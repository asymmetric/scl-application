var SERVER = window.location; // TODO ok?

function init() {
  set_target();
  add_events();
  //periodical();
}

function set_target() {
  var form = document.getElementById('fileform');
  form.setAttribute('target', 'upload_iframe');
}

function add_events() {
  var submit = document.getElementById('sendbutton');
  // TODO maybe we should use addEventListener
  submit.onclick = function() {
    var progressbar_div = document.getElementById('progressbar_div');
    progressbar_div.style.visibility = 'visible';
    periodical();
  };

  var textfield = document.getElementById('title');
  textfield.onfocus = function() {
    this.value = "";
  };
}

function periodical () {
  var timeout = setInterval(function() {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
      //var iframe = document.getElementById('upload_iframe');
      var status = document.getElementById('status');
      if (ajax.readyState == 4) {
        if (ajax.status == 200) {
          status_el.value = ajax.responseText;
          if (parseFloat(status_el.value) > 99.9) {
            window.clearInterval(timeout);
          }
        }
      }
    };
    ajax.open('GET', SERVER + 'status', true);
    ajax.send();
  }, 1000);
}
window.onload = init;
