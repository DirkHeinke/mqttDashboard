function loadConnections() {
    var $connectionContainer = $('#saved_connections');
    var items = $connectionContainer.find('.saved-connection');
    var connections = storageService.connections.getAll();
    
    if(items.length > 0) {
        $connectionContainer.empty();
    }

    Object.keys(connections).forEach(function (id) {
        var connection = connections[id];
        
        var tpl = `
            <div class="saved-connection">
                <span class="">${connection.url}</span>
                <button onclick="connect(${id})">Connect</button>
                <button onclick="deleteSavedConnection(${id})">Delete</button>
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
    
    $urlInput.val(connection.url);
    $portInput.val(connection.port);
    $userInput.val(connection.username);
    $passwordInput.val(connection.password);
    $checkbox.prop('checked', false);
}

function closeConnection() {
  var state = { currentConnectionId: ''}
  storageService.state.set(state);
  closeDashboard();
}

function deleteSavedConnection(id) {
    storageService.connections.delete(id);
    loadConnections();
}

function emptyConnectionForm() {
    $('#create_connection')[0].reset()
}

function connect(id) {
    connectionService.connect(id);
    emptyConnectionForm();
    loadConnections();
    loadDashboards();
    openDashboard();
    loadWidgets();
    updateConnectionInTopBar();
}

function updateConnectionInTopBar() {
  var state = storageService.state.get();
  var currentConnectionId = state.currentConnectionId;
  var currentConnection = storageService.connections.get(currentConnectionId); 
  $('#connection-current').text(currentConnection.url);
}

function openDashboard() {
  $('#connections-screen').hide();
  $('#dashboard').show();
}

function closeDashboard() {
  $('#dashboard').hide();
  $('#connections-screen').css('display', 'flex');
}

function openWidgetCreateDialog() {
  createWidgetDialog.open();
}

function saveWidget(widget) {
  console.log('save widget', widget)
  var widgetId = storageService.widgets.save(widget);
  addWidgetToDashboard(widgetId);
  loadWidgets();
}

function openDashboardCreateDialog() {
  createDashboardDialog.open();
}

function saveDashboard() {
  var name = $('#dashboard-name').val();

  var dashboard = {
    name: name,
    widgets: []
  };

  var id = storageService.dashboards.save(dashboard);
  loadDashboards();
  activateDashboard(id);
}

function loadDashboards() {
  console.log('Load Dashboards');
  var dashboards = storageService.dashboards.getAll();
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
              <button onclick="deleteDashboard(${id})">Delete</button>
              <button onclick="activateDashboard(${id})">Load</button>
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
  console.log('Remove', widgetId, elemId);
  var state = storageService.state.get();
  var currentDashboardId = state.currentDashboardId;
  var dashboard = storageService.dashboards.get(currentDashboardId);

  storageService.widgets.delete(widgetId)
  
  _.pull(dashboard.widgets, widgetId);
  storageService.dashboards.update(currentDashboardId, dashboard);
  
  $(`#${elemId}`).remove();
}

function onWidgetSave() {
  loadWidgets();
}

function getCurrentConnectionId() {
  var state = storageService.state.get();
  return state.currentConnectionId;
}

function loadWidgets() {
  console.log('loadwidgets');
  
  var currentDashboardId = getCurrentDashboardId();
  var dashboardWidgets = storageService.widgets.getByDashboardId(currentDashboardId);
  var $widgetsContainer = $('#widgets-container');

  if($widgetsContainer.find('.widget').length > 0) {
    $widgetsContainer.empty();
  }

  Object.keys(dashboardWidgets).forEach(function(widgetId) {
    new ButtonWidget($widgetsContainer, widgetId, onWidgetSave, onWidgetRemove);
  });
}






// Init
function init() {
  loadConnections();
  
  var currentConnectionId = getCurrentConnectionId();
  if(currentConnectionId) {
    connect(currentConnectionId);
    loadDashboards();

    var currentDashboardId = getCurrentDashboardId();
    if (currentDashboardId) {
      activateDashboard(currentDashboardId);
    }

    loadWidgets();
  } else {
    closeDashboard();
  }

  

  
}


init();
var createWidgetDialog = new WidgetCreateDialog('#dialog-widget-create', saveWidget);
var createDashboardDialog = new DashboardCreateDialog('#dialog-dashboard-create', saveDashboard);
