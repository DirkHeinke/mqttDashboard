var connectionService = (function(mqtt, storage) {
  var mqttClient;
  var currentConnection = null;

  if(!mqtt) {
    console.warn('MQTT Library missing');
  };

  function connect(id) {
    var newConnectionId;
    var connection = storageService.connections.get(id);
    
    if(connection) {
      _establishConnection(connection);
      storageService.state.set({
        currentConnectionId: id
      });
      return;
    }

    var formData = getConnectionFormValues();

    if (formData.saveConnection) {
      newConnectionId = _addConnection(formData.connectionOptions);
    }

    _establishConnection(formData.connectionOptions);
    storageService.state.set({
      currentConnectionId: newConnectionId 
    });
  }

  function _establishConnection(opts) {
    if (mqttClient) { mqttClient.end(); }
    console.log("Connect", opts);

    var options = {
      reconnectPeriod: 0,
      username: opts.username,
      password: opts.password
    };

    var protocol = opts.ssl ? 'wss' : 'ws';
    var connectionString = `${protocol}://${opts.url}`;
    mqttClient = mqtt(connectionString, options);
  }

  function _addConnection(connection) {
    return storage.connections.save(connection);
  }

  function getClient() {
    return mqttClient;
  }

  return {
    connect: connect,
    getClient: getClient
  };

})(mqtt, storageService)