class Widget {
  constructor(parentElem, widgetId, deleteCb, editCb) {
    this.$widgetsContainer = parentElem;
    this.deleteCb = deleteCb;
    this.editCb = editCb;
    this.widgetId = widgetId;
    this.mqttClient = connectionService.getClient();
  }

  render(tpl, substitutes, opts) {
    var opts = opts || {};
    var elem = tpl.format(...substitutes);
    

    if(opts.refresh && this.$widget) {
      this._replaceElement(elem);
    } else {
      this._appendElement(elem)
    }

    this.$widget = $(`#widget_${this.widgetId}`);
    this.$widgetBody = this.$widget.find('.widget-body');
    this._setEventHandler(this.$widget);
  }

  _appendElement(elem) {
    this.$widgetsContainer.append(elem);
  }

  _replaceElement(elem) {
    this.$widget.replaceWith(elem);
  }

  _setEventHandler($widget) {
    var $editBtn = $widget.find('.widget-edit');
    var $deleteBtn = $widget.find('.widget-delete');

    $editBtn.on('click', this.edit.bind(this));
    $deleteBtn.on('click', this.delete.bind(this));
  }

  edit(ev) {
    ev.preventDefault();
    this.editCb(this.widgetId);
  }

  delete() {
    var widgetElemId = this.$widget.attr('id');
    this.deleteCb(this.widgetId, widgetElemId);
  }

}