// Save instances of widgets by id
var WIDGETS = {};

function loadConnections() {
  var $connectionContainer = $('#saved_connections');
  var items = $connectionContainer.find('.saved-connection');
  var connections = storageService.connections.getAll();

  if(items.length > 0) {
    $connectionContainer.empty();
  }

  if(Object.keys(connections).length === 0) {
    // no connection, add default
    console.log("Adding default connection")
    storageService.connections.save({url: "broker.mqttdashboard.com", port: "8000", username: "", password: ""})
    connections = storageService.connections.getAll();
  }

  Object.keys(connections).forEach(function(id) {
    var connection = connections[id];

    var tpl = `
            <div class="saved-connection">
                <span class="">${connection.url}</span>
                <button onclick="deleteSavedConnection(${id})" class="btn-icon" title="delete"><i class="fas fa-trash"></i></button>
                <button onclick="editSavedConnection(${id})" class="btn-icon" title="edit"><i class="far fa-edit"></i></button>
                <button onclick="connect(${id})" class="btn-icon" title="connect"><i class="fas fa-arrow-circle-right"></i></button>
            </div>
        `;
    $connectionContainer.append(tpl);
  })
}

function loadConnection(id) {
  var connection = storageService.connections.get(id);
  var $form = $('#create_connection');
  var $urlInput = $form.find('#connect_url');
  var $portInput = $form.find('#connect_port');
  var $userInput = $form.find('#connect_user');
  var $passwordInput = $form.find('#connect_password');
  var $checkbox = $form.find('#connect_save');
  var $connectionIdInput = $form.find('#connection_id');

  $urlInput.val(connection.url);
  $portInput.val(connection.port);
  $userInput.val(connection.username);
  $passwordInput.val(connection.password);
  $connectionIdInput.val(id);
  $checkbox.prop('checked', false);
}

function closeConnection() {
  connectionService.getClient().end();
  var state = {currentConnectionId: ''}
  storageService.state.set(state);
  closeDashboard();
}

function deleteSavedConnection(id) {
  storageService.connections.delete(id);
  loadConnections();
}

function editSavedConnection(id) {
  loadConnection(id);

  // rename button connect -> update & connect
  $('#button_connect').hide();
  $('#button_updateAndConnect').show();
  $('#button_updateCancel').show();

  // disable save checkbox
  $('#create_connection').find('#connect_save').prop('disabled', true);
}

function cancelUpdateConnection() {
  emptyConnectionForm();
  $('#button_connect').show();
  $('#button_updateAndConnect').hide();
  $('#button_updateCancel').hide();
  $('#create_connection').find('#connect_save').prop('disabled', false);
}


function emptyConnectionForm() {
  $('#create_connection')[0].reset();
  $('#connection_id').val("");
}

function connect(id) {
  if(!id) {
    var formData = getConnectionFormValues();
    if(!formData.connectionOptions.url || !formData.connectionOptions.port) {
      showConnectionError("Provide URL and Port");
      return;
    }
  }


  connectionService.connect(id);
  var client = connectionService.getClient();
  loadConnections();
  client.on('connect', function() {
    console.log('[connect] Connection established');
    hideConnectionError();
    openDashboard();
    updateConnectionInTopBar();
    emptyConnectionForm();
    loadConnections();
    loadDashboards();
  });

  client.on('error', function(err) {
    console.log('[connect] Connection failed', err);
    if(err.code === 4 || err.code === 5) {
      showConnectionError('Not Authorized!');
    } else {
      showConnectionError('Could not connect to broker!');
    }
    storageService.state.set({
      currentConnectionId: ""
    });
  });

  client.stream.on('error', function(err) {
    console.log('[connect] Stream Error', err);
    showConnectionError('Could not connect to broker!');
    storageService.state.set({
      currentConnectionId: ""
    });
  })

}

function updateAndConnect(id) {
  var formData = getConnectionFormValues();
  storageService.connections.update(formData.id, formData.connectionOptions);

  cancelUpdateConnection();
  connect(formData.id);
}

function updateConnectionInTopBar() {
  var state = storageService.state.get();
  var currentConnectionId = state.currentConnectionId;
  var currentConnection = storageService.connections.get(currentConnectionId);
  $('#connection-current').text(currentConnection.url);
}

function openDashboard() {
  $('#start-container').hide();
  $('#dashboard').show();
}

function closeDashboard() {
  $('#dashboard').hide();
  $('#start-container').show();
}

function openWidgetCreateDialog() {
  createWidgetDialog.open();
}

function saveWidget(widget) {
  var widgetId = storageService.widgets.save(widget);
  createWidget(widgetId);
  addWidgetToDashboard(widgetId);
}

function onUpdateWidget(widgetId, updatedWidget) {
  storageService.widgets.update(widgetId, updatedWidget);

  updateWidget(widgetId);
}

function openDashboardCreateDialog() {
  createDashboardDialog.open();
}

function saveDashboard() {
  var name = $('#dashboard-name').val();

  createDashboard(name);
}

function createDashboard(name) {
  var dashboard = {
    name: name,
    widgets: []
  };

  var id = storageService.dashboards.save(dashboard);
  loadDashboards();
  activateDashboard(id);
}

function loadDashboards() {
  var dashboards = storageService.dashboards.getAll();
  if(Object.keys(dashboards).length === 0) {
    createDashboard("Default");
    loadDashboards();
    return;
  }
  var state = storageService.state.get();
  var currentDashboardId = state.currentDashboardId;

  var $dashboardsListContainer = $('#dashboards-list');
  var items = $dashboardsListContainer.find('.dashboard');

  if(items.length > 0) {
    $dashboardsListContainer.empty();
  }

  Object.keys(dashboards).forEach(function(id) {
    var dashboard = dashboards[id];
    // var cls = id !== currentDashboardId ? 'hidden' : '';
    var cls = 'hidden';
    var tpl = `
      <div class="dashboard">
          <div class="dashboard-name">${dashboard.name}<span class="${cls}">ACTIVE</span></div>
          <div class="dashboard-actions">
              <button onclick="deleteDashboard(${id})" class="btn-icon" title="delete"><i class="fas fa-trash"></i></button>
              <button onclick="activateDashboard(${id})" class="btn-icon" title="load"><i class="fas fa-arrow-circle-right"></i></button>
          </div>
      </div>
    `;
    $dashboardsListContainer.append(tpl);
  });
}

function deleteDashboard(id) {
  var dashboard = storageService.dashboards.get(id);
  var widgetIds = dashboard.widgets;
  widgetIds.forEach(function(id) {
    storageService.widgets.delete(id);
  });

  storageService.dashboards.delete(id);
  loadDashboards();

  // Activate first dashboard
  var dashboards = storageService.dashboards.getAll()
  activateDashboard(parseInt(Object.keys(dashboards)[0]));
}

function activateDashboard(id) {
  if(!id) {
    return;
  }

  storageService.state.set({currentDashboardId: id});
  var dashboard = storageService.dashboards.get(id);
  $('#dashboard .dashboard-top h1').text(dashboard.name);
  loadWidgets();
}

function getCurrentDashboardId() {
  var state = storageService.state.get();
  return state.currentDashboardId;
}

function addWidgetToDashboard(widgetId) {
  var state = storageService.state.get();
  var currentDashboardId = state.currentDashboardId;
  var dashboard = storageService.dashboards.get(currentDashboardId);

  if(dashboard.widgets.includes(widgetId)) {
    return;
  }

  dashboard.widgets.push(widgetId);
  storageService.dashboards.update(currentDashboardId, dashboard);
}

function onWidgetRemove(widgetId, elemId) {
  var state = storageService.state.get();
  var currentDashboardId = state.currentDashboardId;
  var dashboard = storageService.dashboards.get(currentDashboardId);

  storageService.widgets.delete(widgetId)

  _.pull(dashboard.widgets, widgetId);
  storageService.dashboards.update(currentDashboardId, dashboard);

  $(`#${elemId}`).remove();
}

function openEditWidgetDialog(widgetId) {
  var editWidgetDialog = new WidgetEditDialog('#dialog-widget-edit', onUpdateWidget);
  var widgetData = storageService.widgets.get(widgetId);
  editWidgetDialog.open(widgetId, widgetData);
}

function getCurrentConnectionId() {
  var state = storageService.state.get();
  return state.currentConnectionId;
}

function loadWidgets() {

  var currentDashboardId = getCurrentDashboardId();
  var dashboardWidgets = storageService.widgets.getByDashboardId(currentDashboardId);
  
  clearWidgets();

  Object.keys(dashboardWidgets).forEach(createWidget);
}

function clearWidgets() {
  var $widgetsContainer = $('#widgets-container');

  if (!$widgetsContainer.find('.widget').length) {
    return;
  }

  $widgetsContainer.empty();
}

function createWidget(widgetId) {
  var $widgetsContainer = $('#widgets-container');
  var widgetData = storageService.widgets.get(widgetId);
  var type = widgetData.type;
  var Widget = WIDGETS_CONFIG[type];
  var widget = new Widget($widgetsContainer, widgetId, widgetData, onWidgetRemove, openEditWidgetDialog);
  WIDGETS[widgetId] = widget;
}

function updateWidget(widgetId) {
  var widgetInstance = WIDGETS[widgetId];
  var widgetData = storageService.widgets.get(widgetId);
  widgetInstance.refresh(widgetData);
}

function hideConnectionError() {
  $('#connection_error').hide();
}

function showConnectionError(text) {
  $('#connection_error')
    .text(text)
    .show();
}

function getConnectionFormValues() {
  var id = document.getElementById("connection_id").value;
  var url = document.getElementById("connect_url").value;
  var port = document.getElementById("connect_port").value;
  var username = document.getElementById("connect_user").value;
  var password = document.getElementById("connect_password").value;
  var saveConnection = document.getElementById("connect_save").checked;

  var formData = {
    id: id,
    saveConnection: saveConnection,
    connectionOptions: {
      url: url,
      port: port,
      username: username,
      password: password
    }
  };

  return formData;
}


function toggleSidebar() {
  $('#dashboard .dashboard-sidebar').toggleClass('isClosed');
  $('#dashboard .sidebar-inner').toggleClass('isClosed');
}


// Init
function init() {
  $('#sidebar-toggle').on('click', toggleSidebar);
  
  loadConnections();

  var currentConnectionId = getCurrentConnectionId();
  if(!currentConnectionId) {
    return closeDashboard();
  }

  connect(currentConnectionId)
  loadDashboards();

  var currentDashboardId = getCurrentDashboardId();
  if(currentDashboardId) {
    activateDashboard(currentDashboardId);
  }
}


init();
var createWidgetDialog = new WidgetCreateDialog('#dialog-widget-create', saveWidget);
var createDashboardDialog = new DashboardCreateDialog('#dialog-dashboard-create', saveDashboard);

