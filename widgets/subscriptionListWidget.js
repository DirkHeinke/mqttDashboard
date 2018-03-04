class SubscriptionListWidget extends Widget {
  constructor(parentElement, id, saveCb, deleteCb) {
    super(parentElement, id, saveCb, deleteCb);
    this.parent = parent;
    this.id = id;
    this.widgetData = storageService.widgets.get(this.id);
    this.init();
  }

  init() {
    var data = this.widgetData;
    var widgetId = this.id;

    var tpl = `
      <div class="widget widget__scrollable" id="widget_{0}">
        <div class="widget-title">
            <div class="widget-name">{1}</div>
            <div class="widget-actions">
                <button class="widget-edit btn-icon" title="edit"><i class="far fa-edit"></i></button>
                <button class="widget-delete btn-icon" title="delete"><i class="fas fa-trash"></i></button>
            </div>
        </div>
        <div class="widget-body">
            <h3>Messages</h3>
            <div class="msg-container"></div>
        </div>
        <div class="widget-back hidden">
            <form id="widget_{0}_back">
              <div class="input-wrapper">
                <label>Widget Name</label>
                <input type="text" id="widget_{0}_name">
              </div>
              <div class="input-wrapper">
                <label>Topic</label>
                <input type="text" id="widget_{0}_topic">
              </div>
              <button class="widget-save">Save</button>
              <button class="widget-cancel">Cancel</button>
            </form>
        </div>
    </div>`;

    // Order of items in array is important
    super.render(tpl, [widgetId, data.title, data.btnLabel]);

    this.$messageContainer = this.$widget.find('.msg-container');

    this.mqttClient.subscribe(data.topic);
    this.mqttClient.on('message', this.handleMessage.bind(this));
  }

  handleMessage(topic, msg) {
    var message = msg.toString();

    var subscribedTopic = this.widgetData.topic;

    if(!this.matches(subscribedTopic, topic)) {
      console.log("removed", topic, subscribedTopic)
      return;
    }

    var timeNow = new Date().toLocaleTimeString("de-DE", {hour: '2-digit', minute:'2-digit'});
    this.$messageContainer.prepend(`<div class="msg"><div class="topic">Topic: "${topic}"</div><div class="time">${timeNow}</div><div class="payload">${message}</div></div>`);
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