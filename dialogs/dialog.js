class Dialog {
  constructor(id) {
    this.$elem = $(id);
    this.$overlay = $('#dialog-overlay');

    this.$closeBtn = this.$elem.find('.dialog-close > button');
    this.$saveBtn = this.$elem.find('.dialog-save');

    this.$closeBtn.on('click', this.close.bind(this));
  }

  open() {
    this.$overlay.show();
    this.$elem.show();
  }

  close() {
    this.$elem.hide();
    this.$overlay.hide();
  }
  
  clear() {
    var $form = this.$elem.find('form');
    $form[0].reset();
  }
}