var HASH_LENGTH = 32;
var sid = 0;
var POLLING = 1000;

$(document).ready(function() {
    $('#fileform').attr('target', 'upload_iframe');
    $('#title').one('keypress', function() {
      $(this).val('').toggleClass('opaqued blackened');
    });
    $('#progressbar').progressbar();

    $('#sendbutton').click(function() {
        generate_sid();
        periodical();
        $('#progressbar')
          .slideDown()
          .progressbar('option', 'value', 0);
      }
    );
  }
);

function generate_sid () {
  sid = 0;
  // TODO revise
  for (var i = 0; i < HASH_LENGTH; i++) {
    sid += Math.floor(Math.random() * 16).toString(16);
  }

  // TODO unmagic
  $('#fileform').attr('action', '/files?X-Progress-ID=' + sid);
  //$('#fileform').attr('action', function() {
  //    return this.action + "?X-Progress-ID=" + sid;
  //  }
  //);
  $('#sid').val(sid);
}

function periodical () {
  var timeout = setInterval(function() {
    $.ajax({
      type:       'GET',
      url:        'status',
      dataType:   'json',
      beforeSend: function(ajax) {
        ajax.setRequestHeader('X-Progress-ID', sid);
      },
      success:    function(response) {
        if (response.state == 'done') {
          window.clearInterval(timeout);
          $('#progressbar').progressbar('option', 'value', 100);
          $.get('files/' + sid, function(data) {
            $('#status').val(data);
          });
        } else { // TODO handle other cases
          var recv = response.received;
          var total = response.size;
          var percentage = ( recv / total ) * 100;
          $('#progressbar').progressbar('option', 'value', percentage);
        }
      }
    });
  }, POLLING);
}
