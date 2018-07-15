var _subscriptionListWidgetForm = [
  {
    type: 'text',
    label: 'Widget Title',
    propName: 'title',
    cls: 'widget-name'
  },
  {
    type: 'text',
    label: 'Topic',
    propName: 'topic',
    cls: 'widget-topic'
  }
];

class SubscriptionListWidget extends Widget {
  constructor(parentElement, widgetId, widgetData, deleteCb, editCb) {
    super(parentElement, widgetId, deleteCb, editCb);
    this.parent = parent;
    this.widgetId = widgetId;
    this.widgetData = widgetData
    this.tpl = `
      <div class="widget widget__scrollable" id="widget_{0}">
        <div class="widget-title">
            <div class="widget-name"><span class="uppercase bold">{1}</span> - <span>{3}</span></div>
            <div class="widget-actions">
                <button class="widget-edit btn-icon" title="edit"><i class="far fa-edit"></i></button>
                <button class="widget-delete btn-icon" title="delete"><i class="fas fa-trash"></i></button>
            </div>
        </div>
        <div class="widget-body">
            <h3>Messages</h3>
            <div class="msg-container"></div>
        </div>
    </div>`;
    this.init();
  }

  static get form() { return _subscriptionListWidgetForm };

  refresh(data) {
    var oldTopic = this.widgetData.topic;
    var newTopic = data.topic
    var topicChanged = newTopic !== oldTopic;

    this.widgetData = data;
    this._render(data, { refresh: true });
    if(topicChanged) {
      this._subscribe(newTopic);
    }
  }

  init() {
    var data = this.widgetData;
    this._render(this.widgetData);
    this._subscribe(data.topic);
    this._setupMessageHandler();
  }

  _render(data, opts) {
    // Order of items in array is important
    super.render(this.tpl, [this.widgetId, data.title, data.btnLabel, data.topic], opts);
  }

  _subscribe(topic) {
    this.mqttClient.subscribe(topic);
  }

  _setupMessageHandler() {
    this.mqttClient.on('message', this.handleMessage.bind(this));
  }
  

  handleMessage(topic, msg) {
    var $messageContainer = this.$widget.find('.msg-container');
    var message = msg.toString();

    var subscribedTopic = this.widgetData.topic;

    if(!this.matches(subscribedTopic, topic)) {
      return;
    }

    var timeNow = new Date().toLocaleTimeString("de-DE", {hour: '2-digit', minute:'2-digit', second: '2-digit'});
    $messageContainer.prepend(`<div class="msg"><div class="topic">Topic: "${topic}"</div><div class="time">${timeNow}</div><div class="payload">${message}</div></div>`);
  }

  /**
   * Code from https://github.com/RangerMauve/mqtt-pattern
   */
  matches(pattern, topic) {
    var patternSegments = pattern.split("/");
    var topicSegments = topic.split("/");

    var patternLength = patternSegments.length;
    var topicLength = topicSegments.length;
    var lastIndex = patternLength - 1;

    for(var i = 0; i < patternLength; i++){
      var currentPattern = patternSegments[i];
      var patternChar = currentPattern[0];
      var currentTopic = topicSegments[i];

      if(!currentTopic && !currentPattern)
        continue;

      if(!currentTopic && currentPattern !== "#") return false;

      // Only allow # at end
      if(patternChar === "#")
        return i === lastIndex;
      if(patternChar !== "+" && currentPattern !== currentTopic)
        return false;
    }

    return patternLength === topicLength;
  }
}