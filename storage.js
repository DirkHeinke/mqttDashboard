var storageService = (function(_) {
  var STORAGE_KEYS = {
    CONNECTIONS: 'connections',
    STATE: 'state',
    WIDGETS: 'widgets',
    DASHBOARDS: 'dashboards'
  };

  function _save(key, data) {
    var value = data;
    
    if(typeof data !== 'string') {
      value = JSON.stringify(data);
    }
    
    localStorage.setItem(key, value);
  }

  function _get(key) {
    var value = localStorage.getItem(key);
    if(!value) {
      return {};
    }
    return JSON.parse(value);
  }

  function saveConnection(connection) {
    var id = Date.now();
    var connections = _get(STORAGE_KEYS.CONNECTIONS) || {};
    connections[id] = connection;
    _save(STORAGE_KEYS.CONNECTIONS, connections);
    return id;
  }

  function getConnection(id) {
    var connections = _get(STORAGE_KEYS.CONNECTIONS) || {};
    return connections[id];
  }
  
  function getConnections() {
    return _get(STORAGE_KEYS.CONNECTIONS) || {};
  }

  function deleteConnection(id) {
    var connections = _get(STORAGE_KEYS.CONNECTIONS);
    
    if(!connections[id]) {
      return;  
    }
    
    delete connections[id];
    _save(STORAGE_KEYS.CONNECTIONS, connections);
  }

  function setState(data) {
    var current = getState() || {};
    var newState = Object.assign(current, data);
    _save(STORAGE_KEYS.STATE, newState);
  }

  function getState() {
    return _get(STORAGE_KEYS.STATE) || {};
  }

  function saveWidget(data) {
    var id = Date.now();
    var widgets = _get(STORAGE_KEYS.WIDGETS) || {};
    widgets[id] = data;
    _save(STORAGE_KEYS.WIDGETS, widgets);
    return id;
  }

  function saveDashboard(data) {
    var id = Date.now();
    var dashboards = _get(STORAGE_KEYS.DASHBOARDS) || {};
    dashboards[id] = data;
    _save(STORAGE_KEYS.DASHBOARDS, dashboards);
    return id;
  }

  function getDashboard(id) {
    var dashboards = _get(STORAGE_KEYS.DASHBOARDS) || {};
    return dashboards[id];
  }

  function getDashboards() {
    return _get(STORAGE_KEYS.DASHBOARDS) || {};
  }

  function deleteDashboard(id) {
    var dashboards = _get(STORAGE_KEYS.DASHBOARDS);

    if (!dashboards[id]) {
      return;
    }

    delete dashboards[id];
    _save(STORAGE_KEYS.DASHBOARDS, dashboards);
  }

  function updateDashboard(id, data) {
    var dashboards = _get(STORAGE_KEYS.DASHBOARDS);

    if(!dashboards[id]) {
      return;
    }

    var updatedDashboard = Object.assign(dashboards[id], data);
    dashboards[id] = updatedDashboard;
    _save(STORAGE_KEYS.DASHBOARDS, dashboards);
    return updatedDashboard;
  }

  function updateWidget(id, data) {

  }

  function getWidget(id) {
    var widgets = _get(STORAGE_KEYS.WIDGETS);
    return widgets[id];
  }

  function getWidgetsByDashboardId(dashboardId) {
    var widgets = _get(STORAGE_KEYS.WIDGETS);
    var dashboard = getDashboard(dashboardId);
    
    if(!dashboard) {
      return [];
    }

    var dashboardWidgetIds = dashboard.widgets;
    return _.pick(widgets, dashboardWidgetIds);
  }

  function deleteWidget(id) {
    var widgets = _get(STORAGE_KEYS.WIDGETS);

    if (!widgets[id]) {
      return;
    }

    delete widgets[id];
    _save(STORAGE_KEYS.WIDGETS, widgets);
  }

  return {
    connections: {
      save: saveConnection,
      getAll: getConnections,
      get: getConnection,
      delete: deleteConnection
    },
    state: {
      get: getState,
      set: setState
    },
    widgets: {
      save: saveWidget,
      get: getWidget,
      getByDashboardId: getWidgetsByDashboardId,
      update: updateWidget,
      delete: deleteWidget
    },
    dashboards: {
      save: saveDashboard,
      getAll: getDashboards,
      get: getDashboard,
      delete: deleteDashboard,
      update: updateDashboard
    }
  };
})(_)