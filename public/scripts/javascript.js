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
    var sid = document.getElementById('sid').value;
    ajax.onreadystatechange = function() {
      var status = document.getElementById('status');
      if (ajax.readyState == 4) {
        if (ajax.status == 200) {
          status.value = ajax.responseText;
        } else {
          // TODO ko
        }
      }
    };
    ajax.open('GET', SERVER + 'status/' + sid, true);
    ajax.send();
  }, 1000);
}
window.onload = init;
