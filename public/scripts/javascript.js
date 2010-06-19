function change_target() {
  var form = document.getElementById('fileform');
  form.setAttribute('target', 'upload_iframe');
}

window.onload = change_target;
