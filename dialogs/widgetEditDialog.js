class WidgetEditDialog extends Dialog {

  constructor(id, onUpdate) {
    super(id);
    this.onUpdate = onUpdate;

    this.$saveBtn.on('click', this.save.bind(this));
    var $formContainer = this.$elem.find('.form-container');
    this.$formContainer = $formContainer;
    
  }

  _renderForm(formContainer, formConfig, data) {
    formContainer.empty();
    formConfig.forEach(function (formItem) {
      var tpl = `
        <div class="input-wrapper">
          <label>${formItem.label}</label>
          <input type="${formItem.type}" class="${formItem.cls}" data-name="${formItem.name}" value="${data[formItem.propName]}"/>
        </div>
      `;
      formContainer.append(tpl);
    });
  }

  _getFormData(formConfig) {
    var widget = {};
    var $form = this.$elem.find('form');
    formConfig.forEach(function (formItem) {
      var value = $form.find(`.${formItem.cls}`).val();
      widget[formItem.propName] = value;
    });
    return widget;
  }

  open(widgetId, widgetData) {
    this.widgetId = widgetId;
    this.widgetData = widgetData;
    this.widgetType = widgetData.type;
    this.formConfig = WIDGETS_CONFIG[this.widgetType].form;
    
    this._renderForm(this.$formContainer, this.formConfig, widgetData);
    super.open();
  }

  close() {
    this.$saveBtn.off('click');
    super.close();
  }

  save(ev) {
    ev.preventDefault();

    var widget = this._getFormData(this.formConfig);
    this.onUpdate(this.widgetId, widget);
    this.close();
    this.clear();
  }
}