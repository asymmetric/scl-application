var HASH_LENGTH = 32;
var sid = 0;
var POLLING = 1000;

$(document).ready(function() {
    $('#fileform').attr('target', 'upload_iframe');
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
        $('#status').val(response.received);
        if (response.state == 'done')
          window.clearInterval(timeout);
      }
    });
  }, POLLING);
}
