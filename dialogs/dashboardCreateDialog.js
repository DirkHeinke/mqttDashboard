class DashboardCreateDialog extends Dialog {
  constructor(id, onSave) {
    console.log('init dashboard dialog');
    super(id);
    this.onSave = onSave;
    
    this.$saveBtn.on('click', this.save.bind(this));
  }

  save(ev) {
    ev.preventDefault();

    var widgetName = $('#widget-name').val();
    var widget = {
      name: widgetName
    };

    this.onSave(widget);
    this.close();
  }
}