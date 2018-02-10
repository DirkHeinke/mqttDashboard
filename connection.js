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

    var url = document.getElementById("connect_url").value;
    var port = document.getElementById("connect_port").value;
    var username = document.getElementById("connect_user").value;
    var password = document.getElementById("connect_password").value;
    var saveConnection = document.getElementById("connect_save").checked;

    var connectionOptions = {
      url: url,
      port: port,
      username: username,
      password: password
    };

    if (saveConnection) {
      newConnectionId = _addConnection(connectionOptions);
    }

    _establishConnection(connectionOptions);
    storageService.state.set({
      currentConnectionId: newConnectionId 
    });
  }

  function _establishConnection(opts) {
    if (mqttClient) { mqttClient.end(); }
    console.log("Connect", opts);
    
    mqttClient = mqtt("ws://" + opts.url + ":" + opts.port + "/mqtt", {
      "username": opts.username,
      "password": opts.password
    });

    mqttClient.on("connect", function (connack) {
      console.log("Connected!");
    });

    mqttClient.on('message', function (topic, message) {
      // message is Buffer
      console.log(topic, message.toString())
    })
  }

  function _addConnection(connection) {
    return storage.connections.save(connection);
  }

  return {
    connect: connect,
    // getConnections: getConnections,
    // deleteConnection: deleteConnection
  };

})(mqtt, storageService)