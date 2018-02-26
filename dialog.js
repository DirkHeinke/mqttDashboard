// A basic dialog
function Dialog (id, saveFn) {
  this.$elem = $(id);
  
  this.$closeBtn = this.$elem.find('.dialog-close > button');
  this.$saveBtn = this.$elem.find('.dialog-save');
  

  this.open = function() {
    this.$elem.show();
  }
  
  this.close = function() {
    this.$elem.hide();
  }

  this.$closeBtn.on('click', this.close.bind(this));
}

function WidgetCreateDialog (id, saveFn) {
  this.$elem = $(id);
  this.saveFn = saveFn;

  Dialog.call(this, id);

  this.forms = {
    'button': [
      {
        type: 'text',
        label: 'Widget Title',
        propName: 'title',
        cls: 'widget-name'
      },
      {
        type: 'text',
        label: 'Button Label',
        propName: 'btnLabel',
        cls: 'widget-btn-label'
      },
      {
        type: 'text',
        label: 'Button Value',
        propName: 'btnValue',
        cls: 'widget-btn-value'
      },
      {
        type: 'text',
        label: 'Topic',
        propName: 'topic',
        cls: 'widget-topic'
      }
    ],
    '2_button': [
      {
        type: 'text',
        label: 'Widget Title',
        propName: 'title',
        cls: 'widget-name'
      },
      {
        type: 'text',
        label: 'Button1 Label',
        propName: 'btnLabel1',
        cls: 'widget-btn-label-1'
      },
      {
        type: 'text',
        label: 'Button2 Label',
        propName: 'btnLabel2',
        cls: 'widget-btn-label-2'
      }
    ],
    'subscriptionList': [
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
    ],
    'textInput': [
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
    ]
  }

  this.init = function () {
    var $widgetTypeSelect = $(id).find('#widget-type');
    this.$widgetTypeSelect = $widgetTypeSelect;

    this.$saveBtn.on('click', this.save.bind(this));
    $widgetTypeSelect.on('change', this.onTypeChange.bind(this));
  }
  
  this.save = function (ev) {
    ev.preventDefault();
    var $form = this.$elem.find('form');
    var widgetType = this.$widgetTypeSelect.val();
    
    var widget = {
      type: widgetType,
    };

    var widgetType = this.$widgetTypeSelect.val();
    var formConfig = this.forms[widgetType];

    formConfig.forEach(function(formItem) {
      var value = $form.find(`.${formItem.cls}`).val();
      widget[formItem.propName] = value;
    });

    this.saveFn(widget);
    this.close();
    this.clear();
  }

  this.onTypeChange = function() {
    var widgetType = this.$widgetTypeSelect.val();
    console.log('widget type changed', widgetType);
    var formConfig = this.forms[widgetType];
    var $formContainer = this.$elem.find('.form-container');
    
    $formContainer.empty();
    
    formConfig.forEach(function(formItem) {
      
      var tpl = `
        <div class="input-wrapper">
          <label>${formItem.label}</label>
          <input type="${formItem.type}" class="${formItem.cls}" data-name="${formItem.name}"/>
        </div>
      `;
      $formContainer.append(tpl);
    });
  }

  this.clear = function() {
    var $form = this.$elem.find('form');
    $form[0].reset();
  }

  this.init();
  this.onTypeChange();
}

function DashboardCreateDialog (id, saveFn) {
  this.$elem = $(id);
  this.saveFn = saveFn;

  Dialog.call(this, id);

  this.init = function () {
    console.log('init dashboard dialog');
    this.$saveBtn.on('click', this.save.bind(this));
  }
  
  this.save = function (ev) {
    console.log('internal save')
    ev.preventDefault();
    
    var widgetName = $('#widget-name').val()
    var widget = {
      name: widgetName
    };

    this.saveFn(widget);
    this.close();
  }

  this.init();
}