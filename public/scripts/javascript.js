var SERVER = window.location; // TODO ok?
var HASH_LENGTH = 32;

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
    generate_sid();
    periodical();
  };

  var textfield = document.getElementById('title');
  textfield.onfocus = function() {
    this.value = "";
  };
}

function generate_sid () {
  var sid;
  // TODO revise
  for (var i = 0; i < HASH_LENGTH; i++) {
    sid += Math.floor(Math.random() * 16).toString(16);
  }

  document.getElementById('sid').value = sid;
}

function periodical () {
  var timeout = setInterval(function() {
    var ajax = new XMLHttpRequest();
    var sid = document.getElementById('sid').value;
    ajax.onreadystatechange = function() {
      var status_el = document.getElementById('status');
      if (ajax.readyState == 4) {
        if (ajax.status == 200) {
          status_el.value = ajax.responseText;
          console.log(status_el.value);
          if (parseFloat(status_el.value) > 99.9) {
            window.clearInterval(timeout);
          }
        }
      }
    };
    ajax.open('GET', SERVER + 'status/' + sid, true);
    ajax.send();
  }, 1000);
}
window.onload = init;
