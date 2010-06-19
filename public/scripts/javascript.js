function init() {
  change_target();
  add_events();
}

function change_target() {
  var form = document.getElementById('fileform');
  form.setAttribute('target', 'upload_iframe');
}

function add_events() {
  var submit = document.getElementById('sendbutton');
  submit.onclick = function() {
    var progressbar_div = document.getElementById('progressbar_div');
    progressbar_div.style.display = 'inline';
  }
}

window.onload = init;
