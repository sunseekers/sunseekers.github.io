
class Dialog {
  constructor() {
    this.init({});
  }
  init({
    title,
    msg,
    cancel = {},
    confirm = {},
  }) {
    this.el = document.getElementById('dialog');
    if (!this.el) {
      this.el = document.createElement('div');
      this.el.id = 'dialog';
      this.el.className = 'mask dialog';
      this.el.innerHTML = `
            <div class="dialog-content">
                <h3 class="dialog-title"></h3>
                <p class="dialog-msg"></p>
                <div class="dialog-footer">
                    <button class="dialog-btn_cancel"></button>
                    <button class="dialog-btn_confirm"></button>
                </div>
            </div>
            `
      document.body.appendChild(this.el);
      this.title = this.el.querySelector('.dialog-title');
      this.content = this.el.querySelector('.dialog-msg');
      this.btn_cancel = this.el.querySelector('.dialog-btn_cancel');
      this.btn_confirm = this.el.querySelector('.dialog-btn_confirm');
    }
    this.title.innerText = title || '标题';
    this.content.innerHTML = msg || '';
    this.el.onclick = (ev) => {
      if (!ev.target.closest('.dialog-content')) {
        this.close();
        cancel.fn && cancel.fn();
      }
    }
    if (cancel) {
      this.btn_cancel.innerText = cancel.txt || '取消';
      this.btn_cancel.onclick = () => {
        this.close();
        cancel.fn && cancel.fn();
      };
      this.btn_cancel.hidden = false;
    } else {
      this.btn_cancel.hidden = true;
    }
    this.btn_confirm.innerText = confirm.txt || '确认';
    this.btn_confirm.onclick = () => {
      this.close();
      confirm.fn && confirm.fn();
    };
    return this.el;
  }
  close() {
    this.el && this.el.classList.remove('show');
  }
  show(options) {
    const el = this.init(options);
    el.classList.add('show');
  }
  alert(title, msg, fn) {
    this.show({
      title,
      msg,
      cancel: false,
      confirm: {
        txt: '我知道了',
        fn
      }
    })
  }
}

/**
dialog.show({
    title:'',
    msg:'',
    cancel:{
        txt:'',
        fn:()=>{}
    },
    confirm:{
        txt:'',
        fn:()=>{}
    }
})
 */

window.dialog = new Dialog();
