var _textInputWidgetForm = [
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

class TextInputWidget extends Widget {
  constructor(parentElement, widgetId, widgetData, deleteCb, editCb) {
    super(parentElement, widgetId, deleteCb, editCb);
    this.parent = parent;
    this.widgetId = widgetId;
    this.widgetData = widgetData;
    this.tpl = `
      <div class="widget" id="widget_{0}">
        <div class="widget-title">
          <div class="widget-name">{1}</div>
          <div class="widget-actions">
            <button class="widget-edit btn-icon" title="edit"><i class="far fa-edit"></i></button>
            <button class="widget-delete btn-icon" title="delete"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div class="widget-body">
          <div class="input-wrapper">
            <input id="widget_{0}_text">
          </div>
          <button class="btn-secondary">Send</button>
        </div>
      </div>`;

    this.init();
  }

  static get form() { return _textInputWidgetForm };

  init() {
    var data = this.widgetData;

    // Order of items in array is important
    super.render(this.tpl, [this.widgetId, data.title, data.btnLabel]);
    this._setButtonHandler();
  }

  refresh(data) {
    this.widgetData = data;
    super.render(this.tpl, [this.widgetId, data.title, data.btnLabel], { refresh: true });
    this._setButtonHandler();
  }

  _setButtonHandler() {
    var $btn = this.$widget.find('.widget-body > button');
    $btn.on('click', this.sendMessage.bind(this));
  }

  sendMessage(ev) {
    ev.preventDefault();

    var message = this.$widgetBody.find('input').val();
    this.mqttClient.publish(this.widgetData.topic, message);
  }


}