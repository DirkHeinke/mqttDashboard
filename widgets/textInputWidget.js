class TextInputWidget extends Widget {
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
      <div class="widget" id="widget_{0}">
        <div class="widget-title">
          <div class="widget-name">{1}</div>
          <div class="widget-actions">
            <button class="widget-edit">Edit</button>
            <button class="widget-delete">Delete</button>
          </div>
        </div>
        <div class="widget-body">
          <input id="widget_{0}_text">
          <button>Send</button>
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

    var $btn = this.$widget.find('.widget-body > button');
    $btn.on('click', this.sendMessage.bind(this));
  }

  sendMessage(ev) {
    ev.preventDefault();

    var message = this.$widgetBody.find('input').val();
    this.mqttClient.publish(this.widgetData.topic, message);
  }

  
}