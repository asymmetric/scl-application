var SERVER = window.location; // TODO ok?
var HASH_LENGTH = 32;
var sid = 0;

$(document).ready(function() {
    $('#fileform').attr('target', 'upload_iframe');

    $('#sendbutton').click(function() {
        $('#progressbar_div').css('visibility', 'visible');
        generate_sid();
        periodical();
      }
    );
  }
);

function generate_sid () {
  // TODO revise
  for (var i = 0; i < HASH_LENGTH; i++) {
    sid += Math.floor(Math.random() * 16).toString(16);
  }

  $('#fileform').attr('action', function() {
      return this.action + "?X-Progress-ID=" + sid;
    }
  );
}

function periodical () {
  var timeout = setInterval(function() {
    var ajax = new XMLHttpRequest();
    ajax.open('GET', 'status/', true);
    ajax.setRequestHeader("X-Progress-ID", sid);
    ajax.onreadystatechange = function() {
      var status_el = document.getElementById('status');
      if (ajax.readyState == 4) {
        if (ajax.status == 200) {
          // TODO sanitize!
          var upload = eval( "(" + ajax.responseText + ")" );
          status_el.value = upload.state;
          if (upload.state == 'done') {
            window.clearInterval(timeout);
          }
        }
      }
    };
    ajax.send();
  }, 1000);
}
//window.onload = init;
