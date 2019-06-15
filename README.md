# mqttDashboard
Simple Web Dashboard for MQTT via Websockets. Add buttons, sliders, ... 


## Demo 

Might be available at: http://mqttdashboard.dirkheinke.de/


## Docker

We provide a Dockerfile based on NGINX that allows you to run the MQTT Dashboard locally

Build image

```
docker build -t mqttdashboard:local .
```

Run container

```
docker run -d --rm --name mqttdashboard -p 8888:80 mqttdashboard:local
```

Run pre-built container

```
docker run -d --rm --name mqttdashboard -p 8888:80 darkdirk/mqttdashboard
```

In your browser, open: http://localhost:8888 and you should see the dashboard.
