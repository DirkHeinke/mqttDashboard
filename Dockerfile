FROM nginx
LABEL maintainer="muellerjan19_dev@icloud.com"
RUN rm /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/www/mqttdashboard
COPY . /var/www/mqttdashboard
COPY ./mqttdashboard.conf /etc/nginx/conf.d/mqttdashboard.conf