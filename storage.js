var storageService = (function() {
  var STORAGE_KEYS = {
    CONNECTIONS: 'connections',
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
    return JSON.parse(value);
  }

  function saveConnection(connection) {
    var id = Date.now();
    var connections = _get(STORAGE_KEYS.CONNECTIONS) || {};
    connections[id] = connection;
    _save(STORAGE_KEYS.CONNECTIONS, connections);
  }

  function getConnection(id) {
    var connections = _get(STORAGE_KEYS.CONNECTIONS);
    return connections[id];
  }
  
  function getConnections(id) {
    return _get(STORAGE_KEYS.CONNECTIONS);
  }

  function deleteConnection(id) {
    var connections = _get(STORAGE_KEYS.CONNECTIONS);
    if(connections[id]) {
      delete connections[id];
    }

    _save(STORAGE_KEYS.CONNECTIONS, connections);
  }
  
  return {
    connections: {
      save: saveConnection,
      getAll: getConnections,
      get: getConnection,
      delete: deleteConnection
    }
  };
})()