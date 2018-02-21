class Widget {
  constructor(parentElem, id, saveCb, deleteCb) {
    this.$widgetsContainer = parentElem;
    this.saveCb = saveCb;
    this.deleteCb = deleteCb;
    this.mqttClient = connectionService.getClient();
  }

  render(tpl, substitutes) {
    var elem = tpl.format(...substitutes);
    this.$widgetsContainer.append(elem);
    this.$widget = $(`#widget_${this.id}`);
  
    this.$widgetBody = this.$widget.find('.widget-body');
    this.$widgetBack = this.$widget.find('.widget-back');
  
    var $saveBtn = this.$widget.find('.widget-back .widget-save');
    var $editBtn = this.$widget.find('.widget-edit');
    var $cancelBtn = this.$widget.find('.widget-cancel');
    var $deleteBtn = this.$widget.find('.widget-delete');
  
    $saveBtn.on('click', this.save.bind(this));
    $editBtn.on('click', this.enableEditMode.bind(this));
    $cancelBtn.on('click', this.closeEditMode.bind(this));
    $deleteBtn.on('click', this.delete.bind(this));
  }

  enableEditMode() {
    this.$widgetBody.hide();
    this.$widgetBack.show();
  
    // TODO: Load and show widget data
  }

  closeEditMode(ev) {
    ev.preventDefault();
    console.log('close edit mode')
    this.$widgetBody.show();
    this.$widgetBack.hide();
  }

  delete() {
    var widgetElemId = this.$widget.attr('id');
    this.deleteCb(this.id, widgetElemId);
  }

  save(ev) {
    ev.preventDefault();
    console.log('WIDGET SAVE');
    this.saveCb();
  }

}