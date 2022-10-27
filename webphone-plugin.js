(function( $ ) {
  var _oSansayClient             = null;

  var _eSansayClientAudioFastBusy= null;

  var _vSansayClientConnUp       = false;
  var _vSansayClientCallError    = false;
  var _vSansayClientConnTimer    = null;

  var _vSansayUiCallStartTime;
  var _vSansayUiCallElapsedTimer;
  var _vSansayUiCallStateActive  = 0;
  var _vSansayUiVideoCall        = 0;
  var _vSansayUiMute             = 0;
  var _vSansayUiHold             = 0;
  var _vSansayUiXfer             = 0;

  var _vSansayUiIsMobile         = false;

  var _vSansayUiVideoHeight      = 400;
  var _vSansayUiVideoPannelHeight= 480;
  var _vSansayUiVideoWidth       = 600;
  var _vSansayUiVideoPannelWidth = 800;
  var _vSansayUiLocalAspectRatio = 0.0;
  var _vSansayUiRemoteAspectRatio= 0.0;

  var _vSansayRemoteParty        = null;

  // initialization
  function _fSansayUiRingTonesInit() {
    if (document.getElementById('websbc-ring') == null) {
      var ring = document.createElement('audio');

      ring.setAttribute('id', 'websbc-ring');
      ring.setAttribute('preload', true);
//      ring.setAttribute('autoplay', false);
      ring.setAttribute('loop', true);
      ring.src = 'av/sansay-ring.wav';
      ring.load();
      ring.pause();
      document.body.appendChild(ring);
    }

    if (document.getElementById('websbc-ringback') == null) {
      var ringback = document.createElement('audio');

      ringback.setAttribute('id', 'websbc-ringback');
      ringback.setAttribute('preload', true);
//      ringback.setAttribute('autoplay', false);
      ringback.setAttribute('loop', true);
      ringback.src = 'av/sansay-ringback.wav';
      ringback.load();
      ringback.pause();
      document.body.appendChild(ringback);
    }

    if (document.getElementById('websbc-busy') == null) {
      var busy = document.createElement('audio');

      busy.setAttribute('id', 'websbc-busy');
      busy.setAttribute('preload', true);
//      busy.setAttribute('autoplay', false);
      busy.setAttribute('loop', true);
      busy.src = 'av/sansay-fastbusy.wav';
      busy.load();
      busy.pause();
      //document.body.appendChild(busy);
    }

    _oSansayClient.setRingTones('websbc-ring', 'websbc-ringback');
  }

  // initialization
  function _fSansayUiAudioElementsInit() {
	var local_media_dom_id = "sansay_default_voice_only_local";

    // create the DOM and make it hidden if it does not already exist
    var local_media = document.getElementById(this.local_media_dom_id);
    if (local_media == null) {
      webrtc_logger.debug("creating local dom element for voice only call");
      local_media = document.createElement('audio');
      local_media.setAttribute('autoplay', 'true');
      local_media.setAttribute('muted', 'true');
      local_media.muted = 'true';
      local_media.setAttribute('id', local_media_dom_id);
      local_media.style.display = 'none';
      document.body.appendChild(local_media);
    }

	var remote_media_dom_id = "sansay_default_voice_only_remote";

    // create the DOM and make it hidden if it isnt already existed
    remote_media = document.getElementById(remote_media_dom_id);
    if (remote_media == null) {
      webrtc_logger.debug("creating remote dom element for voice only call");
      remote_media = document.createElement('audio');
      remote_media.setAttribute('autoplay', 'true');
      remote_media.setAttribute('id', remote_media_dom_id);
      remote_media.style.display = 'none';
      document.body.appendChild(remote_media);
    }

  }


  function _fSansayUiLogoInit() {
    $(".webphone-logo").attr("src", "./css/img/ringplan-icon_40x40.png");
  }

  function _fSansayUiKeypadInit() {
    // fcn keys
    $('#webphone-redial-btn').click(   function() { _fSansayUiRedialKey(); });
    $('#webphone-backspace-btn').click(function() { _fSansayUiBackspace(); });
    $('#webphone-hold-btn').click(     function() { _fSansayUiHoldKey(); });
    $('#webphone-mute-btn').click(     function() { _fSansayUiMuteKey(); });
    $('#webphone-xfer-btn').click(     function() { console.log("xfer"); });

    // digit keys
    $('#webphone-1-btn').click(        function() { _fSansayUiRegularKey("1"); });
    $('#webphone-2-btn').click(        function() { _fSansayUiRegularKey("2"); });
    $('#webphone-3-btn').click(        function() { _fSansayUiRegularKey("3"); });
    $('#webphone-4-btn').click(        function() { _fSansayUiRegularKey("4"); });
    $('#webphone-5-btn').click(        function() { _fSansayUiRegularKey("5"); });
    $('#webphone-6-btn').click(        function() { _fSansayUiRegularKey("6"); });
    $('#webphone-7-btn').click(        function() { _fSansayUiRegularKey("7"); });
    $('#webphone-8-btn').click(        function() { _fSansayUiRegularKey("8"); });
    $('#webphone-9-btn').click(        function() { _fSansayUiRegularKey("9"); });
    $('#webphone-star-btn').click(     function() { _fSansayUiRegularKey("*"); });
    $('#webphone-0-btn').click(        function() { _fSansayUiRegularKey("0"); });
    $('#webphone-pound-btn').click(    function() { _fSansayUiRegularKey("#"); });

    // call keys
    $('#webphone-call-btn').click(     function() { _fSansayUiCallKey(); });
    $('#webphone-video-btn').click(    function() { _fSansayUiCallKey(1); });
    $('#webphone-video-end-btn').click(function() { _fSansayUiCallKey(1); })
  }


  // keypad handing
  function _fSansayUiBackspace() {
    // since the keyboard backspace is always active we need to disable the backspace effect
    if (_vSansayUiCallStateActive &&
        _vSansayUiHold == 0 &&
        _vSansayUiMute == 0 &&
        _vSansayUiXfer) {
      return;
    }

    var cur_digits = $('.webphone-digits').html().replace(/\s/g, '');
    if (cur_digits.length > 0)
      $('.webphone-digits').html(cur_digits.slice(0, -1));
    else
      $('.webphone-digits').html("");
  }

  function _fSansayUiRegularKey(key) {
    var cur_digits = $('.webphone-digits').html().replace(/\s/g, '');
    $('.webphone-digits').html(cur_digits + key);

    // if we are inside a call we must send the digit too
    if (_vSansayUiCallStateActive &&
        _vSansayUiHold == 0 &&
        _vSansayUiMute == 0 /* &&
        _vSansayUiXfer */) {
      _oSansayClient.sendDTMF(key);
    }
  }

  function _fSansayUiRedialKey() {
    //var value = $('#last-call').html().match(/[\d]+/);
    //$('.webphone-digits').html(value[0]);
    var value = $('#last-call').html().split(/[\s]+/);
    $('.webphone-digits').html(value[2]);

    // should we dial here or the user must hit the call button.
    // we should let the user initiate the dial because this way he/she can choose to
    // make audio or video call
  }

  function _fSansayUiHoldKey() {
    _vSansayUiHold ^= 1;
    if (_vSansayUiHold) {
      $('#hold-btn-text').addClass('webphone-inactive');
      $('#resume-btn-text').removeClass('webphone-inactive');
      $('#webphone-hold-btn').addClass('webphone-fkey-alt');
    }
    else {
      $('#resume-btn-text').addClass('webphone-inactive');
      $('#webphone-hold-btn').removeClass('webphone-fkey-alt');
      $('#hold-btn-text').removeClass('webphone-inactive');
      _oSansayClient.setHoldState(0);
    }

  }

  function _fSansayUiMuteKey() {
    _vSansayUiMute ^= 1;
    if (_vSansayUiMute) {
      $('#mute-btn-text').addClass('webphone-inactive');
      $('#unmute-btn-text').removeClass('webphone-inactive');
      $('#webphone-mute-btn').addClass('webphone-fkey-alt')
    }
    else {
      $('#unmute-btn-text').addClass('webphone-inactive');
      $('#webphone-mute-btn').removeClass('webphone-fkey-alt');
      $('#mute-btn-text').removeClass('webphone-inactive')
    }
  }

  function _fSansayUiXferKey() {

  }

  function _fSansayUiCallKey(video_call) {
    _vSansayUiCallStateActive ^= 1;
    if (_vSansayUiCallStateActive) {  // make call
      var called_num = $('.webphone-digits').html();

      if (called_num.length <= 0)
        return;

      _vSansayUiVideoCall = (typeof video_call != "undefined" && video_call != null) ? 1 : 0;
      if (_vSansayUiVideoCall) {
        _fSansayUiVideoPanel();
        _oSansayClient.setMediaElements("local-side-video", "remote-side-video");
      }

      _oSansayClient.startRTCSession(called_num);
      _oSansayClient.goBusy();

      _fSansayUiCallStateHandling(_vSansayUiCallStateActive, called_num);
    }
    else {                            // end call
      _vSansayUiMute = 0;
      _vSansayUiHold = 0;
      _vSansayUiXfer = 0;

      if (_vSansayClientCallError) {
        // this is to handle user pressing the "end call" key to stop the fast busy
        _oSansayClient.goActive();
        _vSansayClientCallError = false;

        // FIXME: we need to implement start/stopFastBusy in the SansayWebSBCClient layer
        //_oSansayClient.setFastBusy(0);
      }
      else
        _oSansayClient.endRTCSession();
    }
  }

  function _fSansayUiCallActiveUpdate(updaters) {
    if (Array.isArray(updaters) == false)
      updaters = [updaters];

    for (var i=0; i<updaters.length; i++) {
      if (typeof updaters[i] === "function")
        updaters[i]();
    }
    _vSansayUiCallElapsedTimer = setTimeout(_fSansayUiCallActiveUpdate, 2000, updaters)
  }

  function _fSansayUiCallStateHandling(active, remote_num) {
    function __elapsed_time_str(etime) {
      var second = parseInt(etime % 60).toString();
      var minute = parseInt(etime / 60).toString();

      if (second.length < 2)
        second = "0" + second;
      if (minute.length < 2)
        minute = "0" + minute;

      return (minute + ":" + second);
    }
    function __elapsed_update() {
      var now = new Date();
      var elapsed_time = parseInt(now.getTime()/1000) - _vSansayUiCallStartTime;

       var time_str = __elapsed_time_str(elapsed_time);
       $('.webphone-elapse-time').each(function() {$(this).html(time_str)})
    }
    function __video_aspect_ratio_update() {
      var remote_frame_width = $('.webphone-video-frame').width();
      var remote_frame_height = $('.webphone-video-frame').height();
      var local_frame_width = $('.webphone-pip-frame').width();
      var local_frame_height = $('.webphone-pip-frame').height();

      if (_vSansayUiIsMobile) {
        // do something about the frame width and height for both local and remote-side-video
        // if the orientation of the screen changes
      }

      var rvw = $('#remote-side-video').width();
      var rvh = $('#remote-side-video').height();
      var lvw = $('#local-side-video').width();
      var lvh = $('#local-side-video').height();

console.log(rvw + "x" + rvh)
      var rar = rvw/rvh;
      if (_vSansayUiRemoteAspectRatio != rar) {
        // only adjust if there is an aspect ratio change
        _vSansayUiRemoteAspectRatio = rar;
        if (rar < 1) {
          $('#remote-side-video').css('width', $('.webphone-video-frame').css('width'));
          $('#remote-side-video').css('height', 'auto');
          $('.webphone-video-main').css('left', '0px');
        }
        else {
          $('#remote-side-video').css('height', $('.webphone-video-frame').css('height'));
          $('#remote-side-video').css('width', 'auto');
          var rh_offset = Math.round(($('.webphone-video-main').width() - $('.webphone-video-frame').width()) / 4);
          $('.webphone-video-main').css('left', '-' + rh_offset + 'px');
        }
      }

      var lar = lvw/lvh;
      if (_vSansayUiLocalAspectRatio != lar) {
        // only adjust if there is an aspect ratio change
        _vSansayUiLocalAspectRatio = lar;
        if (lvw/lvh < 1) {
          $('#local-side-video').css('width', $('.webphone-pip-frame').css('width'));
          $('#local-side-video').css('height', 'auto');
          $('.webphone-video-pip').css('left', '0px');
          // FIXME: do y offset
        }
        else {
          $('#local-side-video').css('height', $('.webphone-pip-frame').css('height'));
          $('#local-side-video').css('width', 'auto');
          var lh_offset = Math.round(($('.webphone-video-pip').width() - $('.webphone-pip-frame').width()) / 4);
          $('.webphone-video-pip').css('left', '-' + lh_offset + 'px');
        }
      }
    }

    if (active) {
      var now = new Date();
      _vSansayUiCallStartTime = parseInt(now.getTime()/1000);
      _vSansayRemoteParty = remote_num;

      $('#last-call').html('');
      $('#last-call').html('Last call: ' + remote_num);

      $('#last-call').hide();
      $('#elapse-time').show();

      // flip the funciton keys
      $('#no-call').addClass('webphone-inactive');
      $('#in-call').removeClass('webphone-inactive');

      // flip the text of the call button
      $('#call-btn-text').addClass('webphone-inactive');
      $('#end-call-btn-text').removeClass('webphone-inactive');

      var updaters = [__elapsed_update];
      if (_vSansayUiVideoCall) {
        updaters.push(__video_aspect_ratio_update);
        /*
        if (_vSansayUiIsMobile) {
          // this is a mobile environmnent so we just use the full screen
          // we need to find the screen height. screen width we can read
          // from the DOM class 'webphone-video-frame'
        }
        else {

          // this is a desktop environmnent. no need to do anything
          // just use the setting in the css
          _vSansayUiVideoWidth = $('.webphone-video-frame').css('width');
          _vSansayUiVideoHeight = $('.webphone-video-frame').css('height');
        }
        */
      }

      _fSansayUiCallActiveUpdate(updaters);
    }
    else {
      clearTimeout(_vSansayUiCallElapsedTimer);

      $('#elapse-time').hide();
      $('#last-call').show();

      $('.webphone-digits').html('');

      $('#in-call').addClass('webphone-inactive');
      $('#no-call').removeClass('webphone-inactive');

      $('#end-call-btn-text').addClass('webphone-inactive');
      $('#call-btn-text').removeClass('webphone-inactive');

      if (_vSansayUiVideoCall) {
        $('#webphone-video').hide();
        $('#show-phone').show();
        $('input').attr('disabled', false);    // just for safe
        $(document).unbind('keydown');
        _vSansayUiVideoCall = 0;
      }
    }
  }

  function _fSansayUiVideoPanel() {
    var keypad_on = $('#webphone-keypad').is(':visible');
    if (keypad_on) {
      $('#webphone-keypad').hide();
    }
    else {
      $('#webphone-incoming-call').hide();
    }

    $('#show-phone').hide();

    // setup video view ports
    var rh_offset = Math.round(($('.webphone-video-main').width() - $('.webphone-video-frame').width()) / 4);
    $('.webphone-video-main').css('left', '-' + rh_offset + 'px');
    var lh_offset = Math.round(($('.webphone-video-pip').width() - $('.webphone-pip-frame').width()) / 4);
    $('.webphone-video-pip').css('left', '-' + lh_offset + 'px');

    $('#remote-side-video').css('height', $('.webphone-video-frame').css('height'));
    $('#local-side-video').css('height', $('.webphone-pip-frame').css('height'));
    $('#webphone-video').show();
  }

  function _fSansayUiAnswerPrompt(cb, caller, ctype) {
    var keypad_on = $('#webphone-keypad').is(':visible');

    $('body').off('click', '.webphone-reject-key');
    $('body').off('click', '.webphone-answer-key');

    function __answer() {
      $('#webphone-incoming-call').hide();
      if (keypad_on)
        $('#webphone-keypad').show();
      else
        $('#show-phone').show();

      _vSansayUiVideoCall = 0;
      if (ctype == "VIDEO") {
        _vSansayUiVideoCall = 1;
        _fSansayUiVideoPanel();
        _oSansayClient.setMediaElements("local-side-video", "remote-side-video");
      }

      _vSansayUiCallStateActive = 1;

      cb(true, caller, ctype);
    }
    function __reject() {
      $('#webphone-incoming-call').hide();
      if (keypad_on)
        $('#webphone-keypad').show();
      else
        $('#show-phone').show();

      cb(false);
    }
	
	$('body').on('click', '.webphone-answer-key', __answer);
	$('body').on('click', '.webphone-reject-key', __reject);
	
	$('#show-phone').hide();
	$('#webphone-keypad').hide();       // do this just in case
	$('.webphone-caller-id b').html(caller)
	$('#webphone-incoming-call').show();

  }

  $.fn.webphone = function(server, options) {
    if (typeof server == "undefined" || server == null) {
      alert("PROGRAMMING_ERROR: No WebSBC server provided");
      return;
    }

    // initialize client engine
    _oSansayClientPool = [];
    if (Array.isArray(server)) {
      for (var i=0; i<server.length; i++) {
        _oSansayClientPool[i] = new SansayWebSBCClient(server[i], true);
        _oSansayClientPool[i].setStunServers([{urls: 'stun:' + server[i]}])
      }
      _oSansayClient = _oSansayClientPool[0];
    }
    else {
      _oSansayClient = new SansayWebSBCClient(server);
      _oSansayClient.setStunServers([{urls: 'stun:' + server}]);
    }

    // load pkg js files
    $.getScript('detect-mobile.js', function() {
      _vSansayUiIsMobile = jQuery.browser.mobile;
    });

    // load pkg audio ringtone (av) files
    /*
    $.getScript('sansay/js/buffer-loader.js', function() {
      var buffer_loader = new BufferLoader(_oSansayAudioContext,
                                           [ring_tone,
                                            'sansay/av/sansay-ringback.wav',
                                            'sansay/av/sansay-fastbusy.wav'],
                                           function(buffer_list) {
                                             _vSansayAudioRing = buffer_list[0];
                                             _vSansayAudioRingback = buffer_list[1];
                                             _vSansayAudioFastbusy = buffer_list[2];
                                           });
      buffer_loader.load();
    });
    */
    // load and initialize phone GUI
    // NOTE: should let the container set the z-index. the users have more understanding of the order
    //       they can decide what work better. it's more appropriate that way.
    //this.css('z-index', '1030');
    this.load("webphone-plugin.html", function() {
      // post load initialization

      if (options != undefined && options.position == "left")
        $('#inactive-phone').data({placement: "right"});
      $('[data-toggle="tooltip"]').tooltip();   // bootstrap tooltip init

      $('[data-toggle="tooltip"]').hover(function() {
        if (options == undefined || options.position != "left" )
          $('.tooltip').css('left', parseInt($('.tooltip').css('left')) - 80 + 'px');
        $('.tooltip').css('top', parseInt($('.tooltip').css('top')) + 20 + 'px')
      });

      // init keypad
      _fSansayUiLogoInit();
      _fSansayUiKeypadInit();

      // webphone position and logo customization
      if (options != undefined) {
        if (options.position != undefined && options.position === "left") {
          $('.col-md-offset-9').removeClass('col-md-offset-9');
          $('.col-md-offset-11').removeClass('text-right col-md-offset-11');
        }

        if (options.logo != undefined)
          $(".webphone-logo").attr("src", options.logo + "?" + new Date().getTime());
      }
    });

    // initialize default ringtones
    _fSansayUiRingTonesInit();

	// initialize voice only media elements
	_fSansayUiAudioElementsInit();

    // defaults
    var theme = "dark";

    // set custom ringtone, logo etc
    if (options != undefined) {
      if (options.ring_tone != undefined) {
        var custom = document.getElementById('websbc-ring');
        if (custom == null) {
          var ring = document.createElement('audio');

          ring.setAttribute('id', 'websbc-ring');
          ring.setAttribute('preload', true);
          ring.setAttribute('autoplay', false);
          ring.setAttribute('loop', true);
          ring.src = options.ring_tone;
          ring.load();
          ring.pause();
          document.body.appendChild(ring);
        }
        else {
          custom.src = options.ring_tone;
          custom.load();
          custom.pause();
        }
      }

      // webphone theme customization
      if (options.theme != undefined) {
        if (options.theme == "light")
          theme = "light";
      }
    }
    $("<link/>", {rel: "stylesheet", type: "text/css", href: "css/webphone-light.css"}).appendTo("head");
    $("<link/>", {rel: "stylesheet", type: "text/css", href: "css/font-awesome.min.css"}).appendTo("head");
  }

  var __caplock = false;      // we need to detect the caplock state entering show()
  $.fn.webphone.show = function() {
    $('input').attr('disabled', true);
    $('#show-phone').hide();
    $('#webphone-keypad').show();
	$(document).unbind('keydown');
    //$(document).bind('keypress', function(e) {
    $(document).keydown(function(e) {
      var cur_digits = $('.webphone-digits').html().replace(/\s/g, '');
      if (e.which == 8) {
        e.preventDefault();
        _fSansayUiBackspace();
      }
      else if (e.which == 20) {
        __caplock = true;
      }
      else if (e.which == 13) {
        _fSansayUiCallKey();
      }
	  else if (e.which == 27) {
        console.log(e.key + " was pressed! Hiding keypad");
        $('#webphone-container').webphone.hide();
      }
      else {
        if (e.which != 16 
				&& (   (e.which >= 96 && e.which <= 105)	// numpad numbers && special chars
					|| (e.which >= 48 && e.which <= 57)		// toppad numbers
					|| (e.which >= 65 && e.which <= 90)		// letters
					|| e.which == 106						// numpad *
					|| e.which == 107						// numpad +
					|| e.which == 109						// numpad -
					|| e.which == 163						// #
					|| e.which == 187						// = and +
					|| e.which == 189						// - and _
				)) {
          key = e.key;
          if (e.shiftKey != true && __caplock != true) {
            key = key.toLowerCase();
		  } else if (e.which == 187) {
			key = '+';
		  }

          if (key != " ") {
            _fSansayUiRegularKey(key);
          }
        }
      }
    });

  }

  $.fn.webphone.hide = function() {
    $('input').attr('disabled', false);
    $('#webphone-keypad').hide();
    $('#show-phone').show();
    $(document).unbind('keydown');
  }

  $.fn.webphone.login = function(user, pwd, cname, domain, login_success, login_fail, conn_status_change) {
    if (typeof user === "undefined" || user.length === 0 ||
        typeof pwd === "undefined" || pwd.length === 0 ) {
      // debug log here
      return false;
    }

    function __login_fail() {
      $('#show-phone').hide();
      $('#inactive-phone').show();
      if (typeof login_fail === "function")
        login_fail();
    }

    function __conn_status_change(status) {
      // NOTE: for multi-homing so we need to use this as an indicator to switch
      //
      _vSansayClientConnUp = (status == 'connected') ? true : false;
      if (_vSansayClientConnUp) {
        clearTimeout(_vSansayClientConnTimer);
        $('#inactive-phone').hide();
        $('#show-phone').show();
        if (typeof login_success === "function") {
          login_success();
		  $("#show-phone a").click();
		  setTimeout(function() { $("#webphone-keypad").parent().webphone.hide(); }, 500)
		}
      }
      else {
        $('#show-phone').hide();
        $('#inactive-phone').show();
        if (typeof login_fail === "function")
          login_fail();
      }
    }

    function __call_end() {
      if (_vSansayClientCallError)
        return;

      _fSansayUiCallStateHandling(0);
      _vSansayUiCallStateActive = 0;

      _oSansayClient.goActive();
    }
    function __incoming_call(caller, session_id, ctype, cb) {
      $('.webphone-digits').html(caller);
      _fSansayUiAnswerPrompt(function(ans, caller, ctype) {
        if (ans) {
          _fSansayUiCallStateHandling(1, caller);
        }
        cb(ans);
      }, caller, ctype);
    }
    function __incoming_call_cancel() {

    }
    _oSansayClient.login(
		{
				user_id:         user,
                secret:          pwd,
                cname:           cname,
                domain:          domain,
                login_fail_cb:   __login_fail,
                conn_status_cb:  __conn_status_change,
                media: {
                  incoming_session_cb: __incoming_call,
                  incoming_cancel_cb:  function() {},
                  end_session_cb:      __call_end,
                  error_cb:            function() {}
                },
				auto_answer_ui_handler: function(remote_user, ctype) {
					_vSansayUiVideoCall = 0;
      				if (ctype == "VIDEO") {
      				  _vSansayUiVideoCall = 1;
      				  _fSansayUiVideoPanel();
      				  _oSansayClient.setMediaElements("local-side-video", "remote-side-video");
      				}
      				_vSansayUiCallStateActive = 1;

					$('.webphone-digits').html(remote_user);
					$("#webphone-keypad").parent().webphone.show()
					_fSansayUiCallStateHandling(1, remote_user);
				}
	});

    _vSansayClientConnTimer = setTimeout(__login_fail, 5000);
  }

  $.fn.webphone.logout = function() {
    if (_vSansayUiCallStateActive) {
	  _oSansayClient.endRTCSession();
	}
    _oSansayClient.logout();
    $('#show-phone').hide();
    $('#inactive-phone').show();
  }
})( jQuery );
