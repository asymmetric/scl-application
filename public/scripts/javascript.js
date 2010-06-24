var HASH_LENGTH = 32;
var sid = 0;
var POLLING = 1000;

$(document).ready(function() {
    $('#title').one('keypress', function() {
      $(this).val('').toggleClass('opaqued blackened');
    });

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
          $.get('files/' + sid, function(data) {
            $('#status').val(data);
          });
        } else { // TODO handle other cases
          var recv = response.received;
          var total = response.size;
          var percentage = (recv / total ) * 100
          $('#status').val(percentage + '%');
        }
      }
    });
  }, POLLING);
}
