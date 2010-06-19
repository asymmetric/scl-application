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
    var progressbar = document.getElementById('progressbar');
    progressbar.style.display = '';
  }
}

function display_element() {
  var submit = document.getElementById('sendbutton');
  var iframe = document.getElementById('upload_iframe');
  submit.style.display = "";
  this.style.display = "";
}



window.onload = init;
