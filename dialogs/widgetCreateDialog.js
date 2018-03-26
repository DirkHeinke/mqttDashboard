class WidgetCreateDialog extends Dialog {
  
  constructor(id, onSave) {
    super(id);
    this.onSave = onSave;
    var $widgetTypeSelect = $(id).find('#widget-type');
    this.$widgetTypeSelect = $widgetTypeSelect;

    this.$saveBtn.on('click', this.save.bind(this));
    $widgetTypeSelect.on('change', this.onTypeChange.bind(this));

    // Globally available;
    this.forms = WIDGET_FORMS_CONFIG;
    
    this.onTypeChange();
  }

  open() {
    super.open();
    this.onTypeChange();
  }

  onTypeChange() {
    var widgetType = this.$widgetTypeSelect.val();
    var formConfig = this.forms[widgetType];
    var $formContainer = this.$elem.find('.form-container');

    $formContainer.empty();

    formConfig.forEach(function (formItem) {

      var tpl = `
        <div class="input-wrapper">
          <label>${formItem.label}</label>
          <input type="${formItem.type}" class="${formItem.cls}" data-name="${formItem.name}"/>
        </div>
      `;
      $formContainer.append(tpl);
    });
  }


  save(ev) {
    ev.preventDefault();
    var $form = this.$elem.find('form');
    var widgetType = this.$widgetTypeSelect.val();

    var widget = {
      type: widgetType,
    };

    var widgetType = this.$widgetTypeSelect.val();
    var formConfig = this.forms[widgetType];

    formConfig.forEach(function (formItem) {
      var value = $form.find(`.${formItem.cls}`).val();
      widget[formItem.propName] = value;
    });

    this.onSave(widget);
    this.close();
    this.clear();
  }
}