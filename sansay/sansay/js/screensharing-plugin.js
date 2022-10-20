(function ( $ ) {
  //window.postMessage( 'check-addon-installed', '*' )

  var extensionID = 'fmakbkdbghbpcaackkhbhnbhlghdgdbl';

  // Code from https://groups.google.com/a/chromium.org/d/msg/chromium-extensions/8ArcsWMBaM4/2GKwVOZm1qMJ
  function detectExtension(extensionId, callback) {
    var img;
    img = new Image();
    img.src = "chrome-extension://" + extensionId + "/sansay.png";
    img.onload = function() {
      callback(true);
    };
    img.onerror = function() {
      callback(false);
    };
  }

  var _oSansayClient         = null;

  // janus related stuffs

  var _vScreenSharingUser        = "";
  var _vScreenSharingRows        = 0;

  var _vScreenSharingJoined      = false;

  function _fScreenSharingExtInstallPrompt() {
    //$('#download-ext-btn').click(function(){_fScreenSharingInstallExtension();});
    $('#screensharing-ext-install-prompt').show();
  }

  function _fScreenSharingInstallExtension() {
    chrome.webstore.install('https://chrome.google.com/webstore/detail/fmakbkdbghbpcaackkhbhnbhlghdgdbl', function(msg) {
      console.log("Successfully Installed Sansay ScreenSharing Plugin!");
      console.log(msg);
    }, function(err){
      console.log("Failed to install Sansay ScreenSharing Plugin!");
      console.log(err);
    });
  }

  function _fScreenSharingZoom(id) {
    var dom = document.getElementById('pvideo-' + id);
    if ('srcObject' in dom) {
      document.getElementById('screensharing-zoom').srcObject = dom.srcObject;
    }
    else {
      document.getElementById('screensharing-zoom').src = dom.src;
    }

    //$('#screensharing-zoom').attr('src', $('#pvideo-' + id).attr('src'));
    $('.screensharing-zoom-frame').show();
  }
  function _fScreenSharingZoomClose() {
    $('#screensharing-zoom').attr('src', '');
    $('.screensharing-zoom-frame').hide();
  }

  function _fScreenSharingJoinKey() {
    detectExtension(extensionID, function(response) {
      if(response) {
        window.postMessage('requestScreenSourceId', '*' );
      } else {
        _fScreenSharingExtInstallPrompt();
      }
    });
    var room_number = $('#confroom-num').val();

    function __in_conference() {
      _vScreenSharingJoined = true;

      $('.screensharing-video-panel').removeClass('col-md-offset-10');
      $('.screensharing-video-panel').removeClass('col-xs-offset-8');
      $('.screensharing-video-panel').removeClass('col-xs-4');
      $('#screensharing-join-txt').hide();
      $('#screensharing-leave-txt').show();
      $('.screensharing-participant-panel').show();

      $('.screensharing-join-error').hide();
    }
    function __out_conference(reason) { // use in cb if join fails
      _vScreenSharingJoined = false;
console.log("===>" + reason)
      $('#screensharing-leave-txt').hide();
      $('#screensharing-join-txt').show();

      $('#screensharing-video-self').hide();
      $('.screensharing-participant-panel').hide();
      $('.screensharing-video-panel').addClass('col-md-offset-10');
      $('.screensharing-video-panel').addClass('col-xs-offset-8');
      $('.screensharing-video-panel').addClass('col-xs-4');

      // the conference-client currently will return one of these three 'reason' (in string)
      //   - USER_LEAVE
      //   - INVALID_CONF_NUMBER
      //   - UNKNOWN_ERROR
      if (reason !== "USER_LEAVE") {
        if (reason === "INVALID_CONF_NUMBER") {
          $('.screensharing-join-error').show();
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
          $('#pzoom-' + i).click(function() {_fScreenSharingZoom(i)});
        }
      }
    }

    if (!_vScreenSharingJoined)
      _oSansayClient.join(room_number, __in_conference, __out_conference, __update_participants);
    else
      _oSansayClient.leave();
  };


  $.fn.screensharing = function(server, options) {
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
    $.getScript('sansay/js/screensharing-client.js', function() {
      _oSansayClient = new SansayConfClient(server);      // instantiate the conf client once conference-client.js loaded
    });

    this.load('sansay/screensharing-plugin.html', function() {

      _vScreenSharingRows = $('.screensharing-participant-panel .row').length - 1; // zoom takes one row

      // attach handler to "join" and the "zoom-close" button
      $('.screensharing-btn').click( function() { _fScreenSharingJoinKey(); });
      $('.screensharing-zoom-close').click( function() { _fScreenSharingZoomClose(); });
    });

    $("<link/>", {rel: "stylesheet", type: "text/css", href: "sansay/css/screensharing-" + theme + ".css"}).appendTo("head");
    $("<link/>", {rel: "stylesheet", type: "text/css", href: "sansay/css/font-awesome.min.css"}).appendTo("head");
  };

  $.fn.screensharing.login = function(user, pwd, cname, domain, login_cb, logout_cb) {
    $('#service-inactive').hide();
    $('#service-active').show();
    _vScreenSharingUser = user;

    _oSansayClient.login(user, pwd, cname, domain, function() {
      // login success, setup DOMs for video rendering
      let participant_video_ids = [];
      let participants = $('.screensharing-participant-panel video');
      for (var i=0; i<participants.length; i++) {
        if (participants[i].id.length === 0) {
          let vid = "pvideo-" + i;
          participants[i].id = vid;
          participant_video_ids.push(vid);
          $('.screensharing-video-overlay-text')[i].id = 'pname-' + i;
          $('.screensharing-zoom-icon')[i].id = 'pzoom-' + i;
          //$('#pzoom-' + i).click(function() {_fScreenSharingZoom(i)});
        }
      }
      _oSansayClient.setMediaElements("screensharing-video-self", participant_video_ids);

      login_cb();
     },
     function() {
      $('#service-active').hide();
       $('#service-inactive').show();

       logout_cb();
     });
  };
  $.fn.screensharing.logout = function() {
    _oSansayClient.logout();
    $('#service-active').hide();
    $('#service-inactive').show();
  };

  $.fn.screensharing.show = function() {
    $('#screensharing-icon').hide();

    //$('.screensharing-participant-panel').hide();
    //$('.screensharing-video-panel').addClass('col-md-offset-10');
    $('#screensharing-main').show();
  };
  $.fn.screensharing.hide = function() {
    $('#screensharing-main').hide();
    $('#screensharing-icon').show();
  }
})( jQuery );
