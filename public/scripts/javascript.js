var SERVER = window.location; // TODO ok?

function init() {
  set_target();
  add_events();
  periodical();
}

function set_target() {
  var form = document.getElementById('fileform');
  form.setAttribute('target', 'upload_iframe');
}

function add_events() {
  var submit = document.getElementById('sendbutton');
  submit.onclick = function() {
    var progressbar_div = document.getElementById('progressbar_div');
    var iframe = document.getElementById('upload_iframe');
    //iframe.style.visibility = 'visible';
    progressbar_div.style.visibility = 'visible';
  };

  var textfield = document.getElementById('title');
  textfield.onfocus = function() {
    this.value = "";
  };
}

function periodical () {
  var timeout = setTimeout(function() {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
      if (ajax.readyState == 4) {
        if (ajax.status == 200) {
          // TODO ok
        } else {
          // TODO ko
        }
      }
    };
    ajax.open('GET', SERVER + 'files', true);
    ajax.send();
  }, 1000);
}
window.onload = init;
