var HASH_LENGTH = 7;
var sid = 0;
var POLLING = 1000;
var FILETYPES = [ 'mp3', 'wav', 'aiff', 'ogg', 'wma' ];

$(document).ready(function() {
    ACTION = $('#fileform').attr('action');

    $('#title').one('keypress', function() {
      $(this).val('').toggleClass('opaqued blackened');
    });
    $('#progressbar').progressbar();
    $('#sendbutton').button({ disabled: true });

    $('#file').change(function() {
      if (checkFiletype($(this).val()))
        $('#sendbutton').button( 'option', 'disabled', false );
      else
        $('#sendbutton').button( 'option', 'disabled', true );
    });

    $('#sendbutton').click(function() {
        generate_sid();
        periodical();
        $('#progressbar')
          .slideDown()
          .progressbar('option', 'value', 0);
      }
    ).button({
      disabled: true
    });

    $('#dialog').dialog({
      autoOpen: false,
      modal:    true,
      width:    500,
      buttons:  {
        Ok: function() {
          $(this).dialog('close');
          }
      }
    });
  }
);

function generate_sid () {
  sid = 0;
  // TODO revise
  for (var i = 0; i < HASH_LENGTH; i++) {
    sid += Math.floor(Math.random() * 16).toString(16);
  }

  $('#fileform').attr('action', function() {
      return ACTION + "?X-Progress-ID=" + sid;
    }
  );
  $('#sid').val(sid);
}


function checkFiletype (filename) {
  var dots = filename.split('.');
  var ext = dots.pop();

  var notfound = true;
  $.each(FILETYPES, function(index, value) {
        notfound = (value != ext);
        return notfound;
      }
  );

  return !notfound;
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
          $.ajax({
            type:     'GET',
            url:      'info/' + sid,
            dataType: 'json',
            async:    false,
            success:  function(response) {
              if (response.error) {
                // TODO
              } else {
                $('#path').text(response.path);
                var url = window.location + response.url;
                $('#url').text(url);
              }
            }
            $('#dialog').dialog('open');
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
