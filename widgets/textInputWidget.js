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
          <div class="widget-name"><span class="uppercase bold">{1}</span> - <span>#{3}</span></div>
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
    this._render(this.widgetData);
    this._setButtonHandler();
  }

  refresh(data) {
    this.widgetData = data;
    this._render(data, { refresh: true });
    this._setButtonHandler();
  }

  _render(data, opts) {
    // Order of items in array is important
    super.render(this.tpl, [this.widgetId, data.title, data.btnLabel, data.topic], opts);
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