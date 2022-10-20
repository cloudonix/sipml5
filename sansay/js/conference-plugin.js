(function ( $ ) {
  var _oSansayClient         = null;

  // janus related stuffs

  var _vVideoConfUser        = "";
  var _vVideoConfRows        = 0;

  var _vVideoConfJoined      = false;

  function _fVideoConfZoom(id) {
    var dom = document.getElementById('pvideo-' + id);
    if ('srcObject' in dom) {
      document.getElementById('videoconf-zoom').srcObject = dom.srcObject;
    }
    else {
      document.getElementById('videoconf-zoom').src = dom.src;
    }

    //$('#videoconf-zoom').attr('src', $('#pvideo-' + id).attr('src'));
    $('.videoconf-zoom-frame').show();
  }
  function _fVideoConfZoomClose() {
    $('#videoconf-zoom').attr('src', '');
    $('.videoconf-zoom-frame').hide();
  }

  function _fVideoConfJoinKey() {
    var room_number = $('#confroom-num').val();

    function __in_conference() {
      _vVideoConfJoined = true;

      $('.videoconf-video-panel').removeClass('col-md-offset-10');
      $('.videoconf-video-panel').removeClass('col-xs-offset-8');
      $('.videoconf-video-panel').removeClass('col-xs-4');
      $('#videoconf-join-txt').hide();
      $('#videoconf-leave-txt').show();
      $('.videoconf-participant-panel').show();

      $('.videoconf-join-error').hide();
    }
    function __out_conference(reason) { // use in cb if join fails
      _vVideoConfJoined = false;
console.log("===>" + reason)
      $('#videoconf-leave-txt').hide();
      $('#videoconf-join-txt').show();

      $('#videoconf-video-self').hide();
      $('.videoconf-participant-panel').hide();
      $('.videoconf-video-panel').addClass('col-md-offset-10');
      $('.videoconf-video-panel').addClass('col-xs-offset-8');
      $('.videoconf-video-panel').addClass('col-xs-4');

      // the conference-client currently will return one of these three 'reason' (in string)
      //   - USER_LEAVE
      //   - INVALID_CONF_NUMBER
      //   - UNKNOWN_ERROR
      if (reason !== "USER_LEAVE") {
        if (reason === "INVALID_CONF_NUMBER") {
          $('.videoconf-join-error').show();
        }
      }
    }
    function __update_participants(names) {
      //console.log(names);
      for (let i=0; i<names.length; i++) {
        if (names[i] === null) {
          $('#pname-' + i).html('empty');
          $('#pzoom-' + i).click(function() {});
        }
        else {
          $('#pzoom-' + i).show();
          $('#pname-' + i).html(names[i])
          $('#pzoom-' + i).click(function() {_fVideoConfZoom(i)});
        }
      }
    }

    if (!_vVideoConfJoined)
      _oSansayClient.join(room_number, __in_conference, __out_conference, __update_participants);
    else
      _oSansayClient.leave();
  };


  $.fn.videoconf = function(server, options) {
    if (server === undefined || server === null || server.length === 0) {
      alert("PROGRAMMING_ERROR: No server provided");
      return;
    }

    // default settings
    var theme = "dark";
    var position = "right";
    var alignment = "top";
    var custom_logo = null;

    $.getScript('sansay/js/webrtc-adapter.min.js');
    $.getScript('sansay/js/conference-client.js', function() {
      _oSansayClient = new SansayConfClient(server);      // instantiate the conf client once conference-client.js loaded
    });

    this.load('sansay/conference-plugin.html', function() {

      _vVideoConfRows = $('.videoconf-participant-panel .row').length - 1; // zoom takes one row

      // attach handler to "join" and the "zoom-close" button
      $('.videoconf-btn').click( function() { _fVideoConfJoinKey(); });
      $('.videoconf-zoom-close').click( function() { _fVideoConfZoomClose(); });
    });

    $("<link/>", {rel: "stylesheet", type: "text/css", href: "sansay/css/videoconf-" + theme + ".css"}).appendTo("head");
    $("<link/>", {rel: "stylesheet", type: "text/css", href: "sansay/css/font-awesome.min.css"}).appendTo("head");
  };

  $.fn.videoconf.login = function(user, pwd, cname, domain, login_cb, logout_cb) {
    $('#service-inactive').hide();
    $('#service-active').show();
    _vVideoConfUser = user;

    _oSansayClient.login(user, pwd, cname, domain, function() {
      // login success, setup DOMs for video rendering
      let participant_video_ids = [];
      let participants = $('.videoconf-participant-panel video');
      for (var i=0; i<participants.length; i++) {
        if (participants[i].id.length === 0) {
          let vid = "pvideo-" + i;
          participants[i].id = vid;
          participant_video_ids.push(vid);
          $('.videoconf-video-overlay-text')[i].id = 'pname-' + i;
          $('.videoconf-zoom-icon')[i].id = 'pzoom-' + i;
          //$('#pzoom-' + i).click(function() {_fVideoConfZoom(i)});
        }
      }
      _oSansayClient.setMediaElements("videoconf-video-self", participant_video_ids);

      login_cb();
     },
     function() {
      $('#service-active').hide();
       $('#service-inactive').show();

       logout_cb();
     });
  };
  $.fn.videoconf.logout = function() {
    _oSansayClient.logout();
    $('#service-active').hide();
    $('#service-inactive').show();
  };

  $.fn.videoconf.show = function() {
    $('#videoconf-icon').hide();

    //$('.videoconf-participant-panel').hide();
    //$('.videoconf-video-panel').addClass('col-md-offset-10');
    $('#videoconf-main').show();
  };
  $.fn.videoconf.hide = function() {
    $('#videoconf-main').hide();
    $('#videoconf-icon').show();
  }
})( jQuery );
