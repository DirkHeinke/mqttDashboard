class Dialog {
  constructor(id) {
    this.$elem = $(id);

    this.$closeBtn = this.$elem.find('.dialog-close > button');
    this.$saveBtn = this.$elem.find('.dialog-save');

    this.$closeBtn.on('click', this.close.bind(this));
  }

  open() {
    this.clear();
    this.$elem.show();
  }

  close() {
    this.$elem.hide();
  }
  
  clear() {
    var $form = this.$elem.find('form');
    $form[0].reset();
  }
}