

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
    openDashboard();
}

function openDashboard() {
  $('#dashboard').show();
}

loadConnections();



var main = (function ($) {

    return {
        loadConnections: loadConnections
    };
    // var mqttClient;
    //
    // connect("192.168.178.109", "9001", "dirk", "dirkdirk");

    // show_saved_connections();

    // function call_connect() {
    //     var url = document.getElementById("connect_url").value;
    //     var port = document.getElementById("connect_port").value;
    //     var username = document.getElementById("connect_user").value;
    //     var password = document.getElementById("connect_password").value;

    //     connect(url, port, username, password);
    // }

    function call_subscribe() {
        var topic = document.getElementById("subscribe_topic").value;

        subscribe(topic);
    }

    // function save_connection() {
    //     // TODO if selected in Dropdown, update -> button umbenennen?
    //     var connection_parameters = {};
    //     connection_parameters.url = document.getElementById("connect_url").value;
    //     connection_parameters.port = document.getElementById("connect_port").value;
    //     connection_parameters.username = document.getElementById("connect_user").value;
    //     connection_parameters.password = document.getElementById("connect_password").value;

    //     var connections = localStorage.getItem("connections");
    //     if (!connections) {
    //         connections = [];
    //     } else {
    //         connections = JSON.parse(connections);
    //     }
    //     console.log(connections)

    //     connections.push(connection_parameters);
    //     localStorage.setItem("connections", JSON.stringify(connections));
    // }

    function show_saved_connections() {
        var connections = JSON.parse(localStorage.getItem("connections"));
        if (!connections) {
            return;
        }
        var selectItem = document.getElementById("connections_dropdown");

        connections.forEach(function (entry, index) {
            console.log(entry);
            var option = document.createElement("option");
            option.text = entry.url;
            option.value = index;
            selectItem.add(option);
        })
    }

    function load_connection() {
        // Fill form with old data
        var connections = JSON.parse(localStorage.getItem("connections"));
        if (!connections) {
            return;
        }
        var value = document.getElementById("connections_dropdown").value;
        if (value == "New") {
            return;
        }

        document.getElementById("connect_url").value = connections[value].url;
        document.getElementById("connect_port").value = connections[value].port;
        document.getElementById("connect_user").value = connections[value].username;
        document.getElementById("connect_password").value = connections[value].password;

    }


    function subscribe(topic) {
        mqttClient.subscribe(topic);
    }

    // function connect(url, port, username, password) {
    //     if (mqttClient) { mqttClient.end(); }
    //     console.log("Connect");
    //     mqttClient = mqtt("ws://" + url + ":" + port + "/mqtt", {
    //         "username": username,
    //         "password": password
    //     });


    //     // mqttClient.subscribe("#");
    //     // mqttClient.publish("/hi", "bla");

    //     mqttClient.on("connect", function (connack) {
    //         console.log("Connected!");
    //     });

    //     mqttClient.on('message', function (topic, message) {
    //         // message is Buffer
    //         console.log(topic, message.toString())
    //     })
    // }

})(jQuery)
