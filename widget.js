function ButtonWidget(parentElem, id, saveCb, deleteCb) {
  this.mqttClient = null;
  this.id = id;
  this.tpl = `
    <div class="widget" id="widget_{0}">
        <div class="widget-title">
            <div class="widget-name">{1}</div>
            <div class="widget-actions">
                <button class="widget-edit">Edit</button>
                <button class="widget-delete">Delete</button>
            </div>
        </div>
        <div class="widget-body">
            <button>{2}</button>
        </div>
        <div class="widget-back hidden">
            <form id="widget_{0}_back">
              <div class="input-wrapper">
                <label>Widget Name</label>
                <input type="text" id="widget_{0}_name">
              </div>
              <div class="input-wrapper">
                <label>Button Label</label>
                <input type="text" id="widget_{0}_label">
              </div>
              <div class="input-wrapper">
                <label>Button Value</label>
                <input type="text" id="widget_{0}_value">
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

  this.$widgetsContainer = parentElem;

  this.btnClick = function(ev) {
    console.log('BTN Click', this.id);
    ev.preventDefault();

    this.mqttClient.publish(this.widgetData.topic, this.widgetData.btnValue);
  };

  this.editMode = function() {
    console.log('activate edit mode');
    this.$widgetBody.hide();
    this.$widgetBack.show();
    var widget = storageService.widgets.get(this.id);

    console.log('EDIT', widget);
  }

  this.closeEditMode = function(ev) {
    ev.preventDefault();
    console.log('close edit mode')
    this.$widgetBody.show();
    this.$widgetBack.hide();
  }

  this.save = function(ev) {
    ev.preventDefault();
    console.log('save widget');

    this.closeEditMode();
    saveCb();
  }

  this.delete = function() {
    var widgetElemId = this.$widget.attr('id');
    deleteCb(this.id, widgetElemId);
  }

  this.render = function() {
    this.widgetData = storageService.widgets.get(this.id);
    var elem = this.tpl.format(this.id, this.widgetData.title, this.widgetData.btnLabel);

    this.$widgetsContainer.append(elem);
    var $widget = $(`#widget_${this.id}`);
    var $widgetBody = $widget.find('.widget-body');
    var $widgetBack = $widget.find('.widget-back');
    this.$widget = $widget;
    this.$widgetBack = $widgetBack;
    this.$widgetBody = $widgetBody;

    var $btn = $widget.find('.widget-body > button');
    var $saveBtn = $widget.find('.widget-back .widget-save');
    var $editBtn = $widget.find('.widget-edit');
    var $cancelBtn = $widget.find('.widget-cancel');
    var $deleteBtn = $widget.find('.widget-delete');

    $saveBtn.on('click', this.save.bind(this));
    $btn.on('click', this.btnClick.bind(this));
    $editBtn.on('click', this.editMode.bind(this));
    $cancelBtn.on('click', this.closeEditMode.bind(this));
    $deleteBtn.on('click', this.delete.bind(this));

    this.init();
  };

  this.init = function() {
  };

  this.render();


}

/**
 * Subscription for a single topic
 */

function SubscriptionListWidget(parentElem, id, saveCb, deleteCb) {
  this.mqttClient = null;
  this.id = id;
  this.tpl = `
    <div class="widget widget__scrollable" id="widget_{0}">
        <div class="widget-title">
            <div class="widget-name">{1}</div>
            <div class="widget-actions">
                <button class="widget-edit">Edit</button>
                <button class="widget-delete">Delete</button>
            </div>
        </div>
        <div class="widget-body">
            <h3>Messages</h3>
            <ul class="msg-container"></ul>
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

  this.$widgetsContainer = parentElem;

  this.init = function() {
    var topic = this.widgetData.topic;
    this.mqttClient = connectionService.getClient();

    this.mqttClient.subscribe(topic);
    this.mqttClient.on('message', function(topic, msg) {
      msg = msg.toString();
      console.log('on message', topic, msg);
      var $container = $(`#widget_${this.id}`).find('.msg-container');
      $container.prepend(`<li>${topic}: ${msg}</li>`);

    }.bind(this));
    console.log('subListWidget init --> Subscribe topic', topic);
  };

  this.render = function() {
    this.widgetData = storageService.widgets.get(this.id);
    var elem = this.tpl.format(this.id, this.widgetData.title);

    this.$widgetsContainer.append(elem);
    var $widget = $(`#widget_${this.id}`);
    var $widgetBody = $widget.find('.widget-body');
    var $widgetBack = $widget.find('.widget-back');
    this.$widget = $widget;
    this.$widgetBack = $widgetBack;
    this.$widgetBody = $widgetBody;

    var $saveBtn = $widget.find('.widget-back .widget-save');
    var $editBtn = $widget.find('.widget-edit');
    var $cancelBtn = $widget.find('.widget-cancel');
    var $deleteBtn = $widget.find('.widget-delete');

    $saveBtn.on('click', this.save.bind(this));
    $editBtn.on('click', this.editMode.bind(this));
    $cancelBtn.on('click', this.closeEditMode.bind(this));
    $deleteBtn.on('click', this.delete.bind(this));

    this.init();
  };

  this.save = function(ev) {
    ev.preventDefault();
    console.log('save widget');

    this.closeEditMode();
    saveCb();
  };

  this.editMode = function() {
    console.log('activate edit mode');
    this.$widgetBody.hide();
    this.$widgetBack.show();
    var widget = storageService.widgets.get(this.id);

    console.log('EDIT', widget);
  };

  this.closeEditMode = function(ev) {
    ev.preventDefault();
    console.log('close edit mode');
    this.$widgetBody.show();
    this.$widgetBack.hide();
  };

  this.delete = function() {
    var widgetElemId = this.$widget.attr('id');
    deleteCb(this.id, widgetElemId);
  };

  this.render();
}