/**********************************************************************************

    Copyright 2013-2022 Sansay Inc. All Rights Reserved

    INFORMATION IN THIS DOCUMENT IS PROVIDED IN CONNECTION WITH SANSAY PRODUCTS,
    NO LICENSE, EXPRESS OR IMPLIED, BY SANSAY OR OTHERWISE, TO ANY INTELLECTUAL
    PROPERTY RIGHTS IS GRANTED BY THIS DOCUMENT. EXCEPT AS PROVIDED IN SANSAY'S
    TERMS AND CONDITIONS OF SALE OF SUCH PRODUCTS, SANSAY ASSUMES NO LIABILITY
    WHATSOEVER AND SANSAY DISCLAIMS ANY EXPRESS OR IMPLIED WARRANTY, RELATING TO
    SALE AND/OR USE OF SANSAY PRODUCTS INCLUDING  LIABILITY OR WARRANTIES RELATING
    TO FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY,  OF ANY PATENT, COPYRIGHT
    OR OTHER INTELLECTUAL PROPERTY RIGHT

***********************************************************************************/

BUILD_VERSION = "2.3.3";
BUILD_DATE    = "Wed Dec 22 08:20:11 PDT 2021";
BUILD_BY      = "J.Hiott";

/*
==================================================================================
  CHANGE LOGS
   04/10/2017     V2.0.0
   04/10/2017     V2.0.0. Major restructuring. prepare to support video conference,
                  chat, share desktop and other advanced features.
   09/19/2017     V2.1.0. Add stack back trace to Logger. Roap and SansayWebSBCClient class
                  accept custom start/stop_ring and start/stop_ringback callbacks.
                  ChanWebSocket.open() can accept port number in the server parameter
                  such as websbc.sansay.com:8889 if no port given it will default to 80
   02/01/2018     V2.2.0 make DTMF handling configurable through SansayWebSBCClient()
                  instantiation.
   02/20/2018     V2.2.1. add support for FireFox version 56 and above
   03/18/2018     V2.2.2. add log and alert notification hooks for customized log
                  and notification handling
   03/23/2018     V2.3.0 supports MicroSoft Edge web browser
   03/27/2018     V2.3.1 supports Apple Safari
   05/16/2018     V2.3.2 supports Refresh Reconnect using cookies that store credentials.
   12/22/2021     V2.3.3 Auto-Answer is fully functional if URI includes 'auto-answer=1'
   					and auto-login is supported if URI includes 'user=', 'pass=' and
					'domain=' with optional 'cname='
==================================================================================
*/

const AUTO_ANSWER = false;

/********************************************************************
 trace log
*********************************************************************/

var __quiet = false;     // set to true to turn off all debug trace

Logger.level = 1;

function parseCallStack(emsg) {
  if (emsg == undefined || emsg == null)
    return null;

  var lines = emsg.split(/[\r\n]+/);
  if (lines[0] === "Error") {
    var caller_info = lines[2].split(/[\s]+/);
    var fcn_name, line_info;

    fcn_name = (caller_info.length < 4) ? "anonymous" : caller_info[caller_info.length - 2];
    line_info = caller_info[caller_info.length -  1].split(/[\/\(\)]+/);

    return [fcn_name, (caller_info.length < 4) ? line_info[line_info.length - 1] : line_info[line_info.length - 2]];
  }
  else {
    // webkit way
    var caller_info = lines[1].split(/\@/);
    var fcn_name = (caller_info.length > 1) ? caller_info[0] : "anonymous";
    var line_info = (caller_info.length > 1) ? caller_info[1].split(/[\/]+/) :  caller_info[0].split(/[\/]+/);

    return [fcn_name, line_info[line_info.length - 1]];
  }
}

function logTrace(module_id, logtype, callstack_info, msg, custom_logger) {
  var log_text = (callstack_info === null) ? "" : callstack_info[0] + " at " + callstack_info[1];

  log_text += ("\n  " + logtype + ": [" + module_id + "] " + msg);
  console.log(log_text);
  if (typeof custom_logger === "function")
    custom_logger(log_text);
}

function Logger(module, level) {
  this.module = module;
  this.level = level;
  this.quiet = false;
  this.custom_handler = null;
}

Logger.prototype.addHandler = function(handler) {
  if (typeof handler === "function")
    this.custom_handler = handler;
};

Logger.prototype.debug = function(msg) {
  if (!__quiet && !this.quiet) {
    let e = new Error();
    if (!e.stack) {
      try {
        throw e;
      } catch (e) {
        if (!e.stack) {

        }
      }
    }
    let info = parseCallStack(e.stack.toString());
    logTrace(this.module, "DEBUG", info, msg, this.custom_handler);
  }
};

Logger.prototype.warning = function(msg) {
//  if (!__quiet && !this.quiet)
    let e = new Error();
    if (!e.stack) {
      try {
        throw e;
      } catch (e) {
        if (!e.stack) {

        }
      }
    }
    let info = parseCallStack(e.stack.toString());
    logTrace(this.module, "WARNING", info, msg, this.custom_handler);
};

Logger.prototype.error = function(msg) {
//  if (!__quiet && !this.quiet)
    let e = new Error();
    if (!e.stack) {
      try {
        throw e;
      } catch (e) {
        if (!e.stack) {

        }
      }
    }
    let info = parseCallStack(e.stack.toString());
    logTrace(this.module, "ERROR", info, msg, this.custom_handler);
};

/********************************************************************
  Cookie handlers
*********************************************************************/

//var cookies = [];

function setCookie(cname, cvalue, exSeconds) {
    var d = new Date();
    d.setTime(d.getTime() + (exSeconds*1000));
    var expires = "expires="+ d.toUTCString();
    var cookie = cname + "=" + cvalue + ";" + expires + ";path=/"; // + cname;
    console.log(cookie);
    document.cookie = cookie;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    //console.log(decodedCookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        console.log("Found cookie: " + c);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    console.log("No Cookie found by name: " + cname);
    return "";
}

/*function checkCookie() {
    var user=getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
       user = prompt("Please enter your name:","");
       if (user != "" && user != null) {
           setCookie("username", user, 30);
       }
    }
}*/


/********************************************************************
 websbc media layer: without FSM.
*********************************************************************/

var RTCPeerConnection  = (window.RTCPeerConnection === undefined) ? null : window.RTCPeerConnection;
var getUserMedia       = null;

var webrtc_logger = new Logger("WebRTC_V1");
var webrtc_alert = alert;


// WebRTC class
function WebRTC() {
  var self = this;

  this.initMediaSession    = null;
  this.endMediaSession     = null;
  this.processLSDP         = null;

  this.localStream               = null;
  this.peerConnection            = null;
  this.attachMediaStream         = null;
  this.dtmfSender                = null;

  this.remote_media_dom_id       = null;
  this.local_media_dom_id        = null;

  this.local_candidates          = [];
  this.local_sdp                 = null;
  this.remote_sdp                 = null;

  this.browser                   = null;
  this.browser_version           = 0;

  this.stun_servers              = {iceServers: []};

  this.stun_timer                = null;


  if (navigator.webkitGetUserMedia) {   // chrome
    self.browser = "CHROME";
    self.browser_version = parseInt(navigator.userAgent.match(/(chrome(?=\/))\/?\s*(\d+)/i)[2]);

    RTCPeerConnection = webkitRTCPeerConnection;
    getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
    self.attachMediaStream = function(media_el, stream) {
      webrtc_logger.debug(media_el + " media stream attached");
      //media_el.src = webkitURL.createObjectURL(stream);
      media_el.srcObject = stream;
    };
  }
  else if (navigator.mozGetUserMedia) { // firefox
    self.browser = "FF";
    self.browser_version = parseInt(navigator.userAgent.match(/(firefox)\/(\d+)\./i)[2]);

    RTCSessionDescription = mozRTCSessionDescription;
    RTCIceCandidate = mozRTCIceCandidate;
    RTCPeerConnection = mozRTCPeerConnection;
    getUserMedia = navigator.mozGetUserMedia.bind(navigator);
    self.attachMediaStream = function(media_el, stream) {
      media_el.srcObject = stream;
      //if (media_el.mozSrcObject !== undefined)
      //  media_el.mozSrcObject = stream;
      //else
      //  media_el.src = (window.URL && window.URL.createObjectURL(stream)) || stream;

      media_el.play();
    }
  }
  else if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) { // edge
    self.browser = "EDGE";
    self.browser_version = parseInt(navigator.userAgent.match(/edge\/(\d+).(\d+)$/i)[2]);

    getUserMedia              = navigator.getUserMedia.bind(navigator);
    RTCIceCandidate           = window.RTCIceCandidate;
    RTCSessionDescription     = window.RTCSessionDescription;
    RTCPeerConnection         = edgeRTCPeerConnection;

    self.attachMediaStream = function(media_el, stream) {
      webrtc_logger.debug(media_el.id + " media stream attached");
      window.stream = stream;
      // media_el.src = URL.createObjectURL(stream);
      media_el.srcObject = stream;

      media_el.play();
    };
  }
  else if (navigator.mediaDevices && navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) { // safari
    self.browser = "SAFARI";
    self.browser_version = parseInt(navigator.userAgent.match(/(applewebkit)\/(\d+)\./i)[2]);

    getUserMedia              = function(constraints, cb, errcb) {
                                  navigator.mediaDevices.getUserMedia(constraints)
                                  .then(cb, errcb);
                                }.bind(navigator);

    RTCPeerConnection         = window.RTCPeerConnection;
    RTCIceCandidate           = window.RTCIceCandidate;
    RTCSessionDescription     = window.RTCSessionDescription;

    self.attachMediaStream = function(media_el, stream) {
      webrtc_logger.debug(media_el.id + " media stream attached");
      window.stream = stream;
      media_el.srcObject = stream;

      media_el.play();
    };
  }
  else {
    webrtc_alert("current browser does not support WebRTC");
  }

  webrtc_logger.debug("client version: " + BUILD_VERSION + ", browser: " + self.browser + ", browser version: " + self.browser_version);
}

WebRTC.prototype.setStunServers = function(servers) {
  if (typeof servers.push != "undefined") {
    for (var i=0; i<servers.length; i++) {
      if (typeof servers[i].urls == "undefined" && typeof server[i].url == "undefined") {
        webrtc_logger.error("setStunServers() fails, STUN server not set. Missing URL");
        return;
      }
    }
    this.stun_servers = {iceServers: servers};
  }
  else
    webrtc_logger.error("ERROR: setStunServers() fails STUN server not set. Must be Array");
};

WebRTC.prototype.setMediaDOM = function(local_dom_id, remote_dom_id) {
  webrtc_logger.debug("local=" + local_dom_id + " remote=" + remote_dom_id);

  this.remote_media_dom_id = remote_dom_id;
  this.local_media_dom_id  = local_dom_id;
};

WebRTC.prototype.open = function(media_avail_handler, media_not_avail_handler, ice_complete_handler) {
  if (this.peerConnection != null) {
    webrtc_logger.error("There is already an open WebRTC connection");
    return;
  }

  var mm = {audio: true, video: false};

  if (RTCPeerConnection == null || getUserMedia == null) {
    webrtc_alert("WebRTC is not initialized");
    return;
  }

  this.initMediaSession    = media_avail_handler;
  this.endMediaSession     = media_not_avail_handler;
  this.processLSDP         = ice_complete_handler;

  if (this.local_media_dom_id == null) {
    // if no media set, assume audio only
    this.local_media_dom_id = "sansay_default_voice_only_local";

    // create the DOM and make it hidden if it does not already exist
    var local_media = document.getElementById(this.local_media_dom_id);
    if (local_media == null) {
      webrtc_logger.debug("creating local dom element for voice only call");
      local_media = document.createElement('audio');
      local_media.setAttribute('autoplay', 'true');
      local_media.setAttribute('muted', 'true');
      local_media.muted = 'true';
      local_media.setAttribute('id', this.local_media_dom_id);
      local_media.style.display = 'none';
      document.body.appendChild(local_media);
    }
  }
  else {
    var local_media = document.getElementById(this.local_media_dom_id);
    if (local_media.tagName == 'VIDEO') {
      var mm = {audio: true, video: true};
    }
  }

  var self = this;
  getUserMedia(mm,
    function(stream) {
      webrtc_logger.debug("addStream() succeeded " + self.local_media_dom_id);

      var local_media = document.getElementById(self.local_media_dom_id);
      self.attachMediaStream(local_media, stream);
      self.localStream = stream;

      if (self.initMediaSession != null) {
        if (self.peerConnection == null) {
          // user(the calling party) hangup prematurely
          webrtc_logger.warning("uh-oh, the calling party hangup already. lets clear the call");

          // NOTE: chrome M47 no longer support MediaStream.stop()
          // self.localStream.stop();
          if (local_media.tagName == 'VIDEO') {
            self.localStream.getVideoTracks()[0].stop();
          }
          self.localStream.getAudioTracks()[0].stop();

          self.localStream = null;
        }
        else
          self.initMediaSession();      // execute the handler

        self.initMediaSession = null;   // reset the handler for the next call
      }
    },
    function() {
      webrtc_logger.debug("addStream() failed. local_stream denied");

      if (self.peerConnection != null) {
        webrtc_logger.debug("closing connection");

        self.peerConnection.close();
        self.peerConnection = null;
      }

      if (self.endMediaSession != null) {
        self.endMediaSession();
        self.endMediaSession = null;
      }
    });

  if (this.browser == "CHROME" && this.browser_version <= 34)
    this.peerConnection = new RTCPeerConnection(this.stun_servers, {optional: [{'DtlsSrtpKeyAgreement': 'true'}]});
  else
    this.peerConnection = new RTCPeerConnection(this.stun_servers);

  this.peerConnection.onicecandidate = function(event) {
    if (event.candidate) {
      console.log(event.candidate);
      self.local_candidates.push(event.candidate);
      webrtc_logger.debug(new Date + " ICE candidate: " + event.candidate.candidate);
      if (self.stun_timer == null) {
        webrtc_logger.debug("***** set stun timer for PDD *****");
        self.stun_timer = setTimeout(self.peerConnection.onicecandidate, 3000, {candidate: null});
      }
    }
    else {
      webrtc_logger.debug(new Date + " no more ICE candidate");

      if (self.processLSDP != null) {
        if (self.local_candidates.length <= 0) {
          webrtc_logger.debug("no candidate. build with info from SDP");
          var local_candidate = self.local_sdp.match(/a=candidate[^\n]+/g);
          var local_sdp = self.local_sdp.replace(/(m=video [\d]+ RTP\/SAVPF [\d]+) [\d]+ [\d]+/, '$1')
                                              .replace(/a=rtpmap\:[\d]+ H264\/90000\r\n/g, '')
                                              .replace(/a=rtcp-fb:126 [\w\s]+\r\n/g, '')
                                              .replace(/a=rtcp-fb:97 [\w\s]+\r\n/g, '');

          webrtc_logger.debug(JSON.stringify(self.local_sdp));
          webrtc_logger.debug(JSON.stringify(local_sdp));

          self.processLSDP({sdp: self.local_sdp, candidates: local_candidate});
        }
        else
          self.processLSDP({sdp: self.local_sdp, candidates: self.local_candidates});

        self.processLSDP = null;
        self.stun_timer = null;
      }
    }};

  this.peerConnection.onaddstream = function (event) {
    var remote_media;

    if (self.remote_media_dom_id == null) {
      // if no media set, assume audio only
      self.remote_media_dom_id = "sansay_default_voice_only_remote";

      // create the DOM and make it hidden if it isnt already existed
      remote_media = document.getElementById(self.remote_media_dom_id);
      if (remote_media == null) {
        webrtc_logger.debug("creating remote dom element for voice only call");
        remote_media = document.createElement('audio');
        remote_media.setAttribute('autoplay', 'true');
        remote_media.setAttribute('id', self.remote_media_dom_id);
        remote_media.style.display = 'none';
        document.body.appendChild(remote_media);
      }
    }
    else
      remote_media = document.getElementById(self.remote_media_dom_id);

    self.attachMediaStream(remote_media, event.stream);
  };

  this.peerConnection.onconnectionstatechange = function(e) {
    console.log("Event: onconnectionstatechange");
    console.log(e);
  };
  this.peerConnection.oniceconnectionstatechange = function(e) {
    console.log("Event oniceconnectionstatechange");
    console.log(this.iceConnectionState);
    console.log(e.srcElement.iceConnectionState);
    console.log(e);
  };
  this.peerConnection.onnegotiationneeded = function(e) {
    console.log("Event onnegotiationneeded");
    console.log(e.srcElement.iceConnectionState);
    console.log(e);
    //if (e.srcElement.iceConnectionState){
    //self.setHoldState(0);
    //}
  };
};

WebRTC.prototype.close = function() {
  if (this.peerConnection != null) {
    this.peerConnection.close();
    // NOTE: chrome M47 no longer support MediaStream.stop()
    // if (this.localStream != null)
    //   this.localStream.stop();
    if (this.localStream != null) {
       var local_media = document.getElementById(this.local_media_dom_id);
       if (local_media.tagName == 'VIDEO') {
         this.localStream.getVideoTracks()[0].stop();
       }
       this.localStream.getAudioTracks()[0].stop();
    }
    this.peerConnection = null;
    this.localStream = null;
  }
  this.dtmfSender = null;
  this.local_candidates = [];
  this.local_sdp = null;
  this.local_media_dom_id = null;
  this.remote_media_dom_id = null;
};

WebRTC.prototype.placeCall = function() {
  if (this.peerConnection == null) {
    webrtc_alert("WebRTC not opened");
    return false;
  }
  if (this.localStream == null) {
    webrtc_alert("WebRTC local streaming is not ready");
    return false;
  }

  var self = this;
  this.peerConnection.addStream(this.localStream);
//  if (this.browser == "CHROME") {
    this.peerConnection.createOffer(
      function(sdp_blob) { // passed
        self.peerConnection.setLocalDescription(sdp_blob);
        self.local_sdp = sdp_blob.sdp;

        webrtc_logger.debug(sdp_blob.type + "\nSDP: \n" + self.local_sdp);
      },
      function() {},       // failed
      null);               // constrain
/*
  }
  else {
    this.peerConnection.createOffer(
      function(sdp_blob) { // passed
        self.peerConnection.setLocalDescription(sdp_blob);
        self.local_sdp = sdp_blob.sdp;

        webrtc_logger.debug(sdp_blob.type + "\nSDP: \n" + self.local_sdp);
      },
      function() {},       // failed
      {'mandatory' : {'MozDontOfferDataChannel' : true}});               // constrain
  }
*/
  return true;
};

WebRTC.prototype.acceptCall = function(sdp, candidates, type) {
  if (this.peerConnection == null) {
    webrtc_alert("WebRTC not opened");
    return false;
  }

  this.remote_sdp = sdp;
  webrtc_logger.debug("remote sdp:\n" + sdp);

  // filter out H.264 for chrome due to lack of support at the moment
  if (this.browser == "CHROME" && this.browser_version < 50) {
    var m_section = sdp.match(/m=[^\n]+\n(c=[^\n]+[\n]*|a=[^\n]+[\n]*)*/g);
    for (var i=0; i<m_section.length; i++) {
      if (/a=rtpmap:[\d]+ H264/.test(m_section[i]))
        sdp = sdp.replace(m_section[i], '');
    }
    webrtc_logger.debug("after filter sdp:\n" + sdp);
  }

  this.peerConnection.setRemoteDescription(new RTCSessionDescription({type: type, sdp: sdp}));
  webrtc_logger.debug("candidates:\n" + candidates);
  for (var i=0; i<candidates.length; i++) {
    webrtc_logger.debug("remote ice candidate:\n" + candidates[i].candidate);
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidates[i]));
  }

  return true;
};

WebRTC.prototype.answerCall = function() {
  if (this.peerConnection == null) {
    webrtc_alert("WebRTC not opened");
    return false;
  }
  if (this.localStream == null) {
    webrtc_alert("WebRTC local streaming is not ready");
    return false;
  }

  var self = this;
  this.peerConnection.addStream(this.localStream);
  this.peerConnection.createAnswer(
    function(sdp_blob) {
      //var new_sdp_blob = sdp_blob;
      //var cFingerPrint = getCookie("fingerprint");
      //if (cFingerPrint != '' && cFingerPrint != 'undefined') {
        //console.log("Got FingerPrint Cookie: " + cFingerPrint);
        //var oldFingerPrint = sdp_blob.sdp.substring(sdp_blob.sdp.indexOf("a=fingerprint:"), sdp_blob.sdp.indexOf("a=setup:"));
        //console.log("Replacing FingerPrint: " + oldFingerPrint + "With: " + cFingerPrint);
        //setCookie("fingerprint", "", 300);
        //new_
        //sdp_blob.sdp = sdp_blob.sdp.replace(oldFingerPrint, (cFingerPrint + '\n'));
        //sdp_blob.sdp = sdp_blob.sdp.replace(/a=setup:active/, 'a=setup:passive');
        //console.log(sdp_blob.sdp);

        //self.peerConnection.setLocalDescription(sdp_blob);//new_sdp_blob);
        //self.local_sdp = sdp_blob.sdp;//new_sdp_blob.sdp;

      //} else {
        //console.log("Setting FingerPrint Cookie...");
        //setCookie("fingerprint", sdp_blob.sdp.substring(sdp_blob.sdp.indexOf("a=fingerprint:"), sdp_blob.sdp.indexOf("a=setup:")), 300);


        //new_sdp_blob = sdp_blob;
      //}

      self.peerConnection.setLocalDescription(sdp_blob);
      self.local_sdp = sdp_blob.sdp;
      webrtc_logger.debug(sdp_blob.type + "\nlocal sdp: \n" + self.local_sdp);
      webrtc_logger.debug(sdp_blob.type + "\nlocal blob_sdp: \n" + sdp_blob.sdp);
    },
    function() {},
    null);

  return true;
};

WebRTC.prototype.localRefreshCall = function(ice_complete_handler) {
  this.processLSDP = ice_complete_handler;

  var self = this;
  console.log("Calling createOffer");
  this.peerConnection.createOffer(
    function(sdp_blob) { // passed
      self.peerConnection.setLocalDescription(sdp_blob);
      self.local_sdp = sdp_blob.sdp;

      webrtc_logger.debug(sdp_blob.type + "\nSDP: \n" + self.local_sdp);

      if (self.processLSDP != null) {
        self.processLSDP({sdp: self.local_sdp, candidates: self.local_candidates});
        self.processLSDP = null;
      }
    },
    function(e) {
      console.log("createOffer failed");
      console.log(e);
    },       // failed
    (this.browser == "CHROME") ? null : {'mandatory' : {'MozDontOfferDataChannel' : true}});   // constrain
};

WebRTC.prototype.remoteRefreshCall = function(ice_complete_handler) {
  this.processLSDP = ice_complete_handler;

  var self = this;
  this.peerConnection.createAnswer(
    function(sdp_blob) {
      self.peerConnection.setLocalDescription(sdp_blob);
      self.local_sdp = sdp_blob.sdp;

      webrtc_logger.debug(sdp_blob.type + "\nlocal sdp: \n" + self.local_sdp);

      if (self.processLSDP != null) {
        self.processLSDP({sdp: self.local_sdp, candidates: self.local_candidates});
        self.processLSDP = null;
      }
    },
    function() {},
    null);
};

WebRTC.prototype.setLocalMedia = function(enabled) {
  var local_media = document.getElementById(this.local_media_dom_id);
  if (local_media.tagName == 'VIDEO') {
    var video_tracks = this.localStream.getVideoTracks();
    if (video_tracks[0])
      video_tracks[0].enabled = enabled;
  }

  var audio_tracks = this.localStream.getAudioTracks();
  if (audio_tracks[0])
    audio_tracks[0].enabled = enabled;
};

WebRTC.prototype.sendDTMF = function(key) {
  if (this.dtmfSender == null) {
    this.dtmfSender = this.peerConnection.createDTMFSender(this.localStream.getAudioTracks()[0]);

    this.dtmfSender.insertDTMF(key, 500);
  }
  else
    this.dtmfSender.insertDTMF(this.dtmfSender.toneBuffer + key);
};









/********************************************************************
 websbc signaling layer     [ROAP & Signaling Channel]
*********************************************************************/
var roap_logger = new Logger("Roap");

//======================================
// comm channel
//======================================
function ChanWebSocket() {
  var self = this;

  this.sock                           = null;
  this.conn_id                        = null;
  this.token                          = null;
  this.restart_count                  = 0;

  this.signaling_server               = null;
  this.signaling_controller_path      = null;
  this.user_id                        = null;

  this.connHandler                    = null;
  this.smEngine                       = {};
  this.exitHandler                    = [];
  this.readyHandler                   = [];
}

ChanWebSocket.prototype.open = function(sig_server, sig_controller_path, user_id, conn_change_handler) {
  roap_logger.debug("open server(" + sig_server + ")");

  var server_config = sig_server.split(/\:/);
  if (server_config.length < 2 || isNaN(parseInt(server_config[1])))
    this.sock = new WebSocket("wss://" + server_config[0] + ":443/" + sig_controller_path, "sansay-roap", "test");  // origin=test
  else
    this.sock = new WebSocket("wss://" + sig_server + "/" + sig_controller_path, "sansay-roap", "test");  // origin=test

  this.signaling_server = server_config[0];         // sig_server;
  this.signaling_controller_path = sig_controller_path;
  this.user_id = user_id;

  if (typeof conn_change_handler != "undefined" &&
      conn_change_handler != null)
    this.connHandler = conn_change_handler;

  var self = this;
  this.sock.onopen = function() {
    //roap_logger.debug("reset restart count");

    if (self.connHandler != null)
      self.connHandler('connected');
  };
  this.sock.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (typeof data.type != "undefined") {
      if (data.type == "CONNECTION") {
        self.conn_id = data.conn_id;

        for(var i=0; i<self.readyHandler.length; i++)
          self.readyHandler[i]();
      }
      else {
        if (typeof data.token != "undefined")
          self.token = data.token;

        if (typeof self.smEngine[data.type] != "undefined")
          self.smEngine[data.type].msgHandler(self.smEngine[data.type], data);
      }
    }
    else
      roap_logger.error("Received message without data.type");
  };
  this.sock.onclose = function() {
    // connection dropped.
    if (self.conn_id) {  // not closed by invoking close() so it's not expected
      roap_logger.warning("WebSocket got closed somehow unexpectedly. Attempt to reopen it");
      self.sock = null;

      if (self.connHandler != null)
        self.connHandler('disconnected');

      // try reopen it every 10 sec for 1 minute
      if (++self.restart_count <= 6) {
        setTimeout(function() {
          self.open(self.signaling_server,
                    self.signaling_controller_path,
                    self.user_id);
          },
          10000);
      }
      else
        roap_logger.error("Server is down for too long. Giving up.");
    }

    if (self.connHandler != null)
      self.connHandler('disconnected');
  };
  this.sock.onerror = function(err) {
    roap_logger.error("websocket got an error (" + JSON.stringify(err) + ")");
  };
};

ChanWebSocket.prototype.close = function() {
  roap_logger.debug("ChanWebSocket close");

  if (this.connHandler != null)
    this.connHandler('disconnected');

  for(var i=0; i<this.exitHandler.length; i++)
    this.exitHandler[i]();

  if (this.sock != null) {
    this.sock.close();
  }

  this.sock                           = null;
  this.conn_id                        = null;
  this.signaling_server               = null;
  this.signaling_controller_path      = null;
  this.user_id                        = null;
  this.connHandler                    = null;
  this.smEngine                       = {};
  this.exitHandler                    = [];
  this.readyHandler                   = [];
};

ChanWebSocket.prototype.resetConnection = function() {
  if (this.sock != null) {
    this.sock.close();
  }

  this.sock                           = null;
};

ChanWebSocket.prototype.registerReadyHandler = function(handler) {
  this.readyHandler.push(handler);
};

ChanWebSocket.prototype.unregisterReadyHandler = function(handler) {
  for(var i=0; i<this.readyHandler.length; i++) {
    if (handler == this.readyHandler[i]) {
      this.readyHandler.splice(i, 1);
      break;
    }
  }
}

ChanWebSocket.prototype.registerExitHandler = function(handler) {
  this.exitHandler.push(handler);
};

ChanWebSocket.prototype.attachSM = function(mtype, sm) {
  this.smEngine[mtype] = sm;
};

ChanWebSocket.prototype.send = function(local_user, remote_user, msg, mtype, success_cb, fail_cb) {
  if (this.sock == null) {
    roap_logger.error("send fails, ChanWebSocket not open");
    return;
  }

  var data = {};
  if (mtype == "CALL")
    data = {type: mtype, orig: local_user, dest: remote_user, token: this.token, conn_id: this.conn_id, roap: msg};
  else if (mtype == "SESSION") {
    if (this.token == null)
      data = {type: mtype, orig: local_user, dest: remote_user, conn_id: this.conn_id, session: msg};
    else
      data = {type: mtype, orig: local_user, dest: remote_user, token: this.token, conn_id: this.conn_id, session: msg};
  }
  else {
    roap_logger.error("send fails, unknown type " + mtype);
//    return;
  }

  this.sock.send(JSON.stringify(data));
};


//======================================
// call control

function Roap(use_info_method) {
  var self = this;

  this.dtmf = (use_info_method == undefined || use_info_method == false) ? "RFC" : "INFO";
  this.seq                        = 0;

  this.sent_msg                   = null;

  this.active_offerer_session_id  = null;
  this.active_answerer_session_id = null;
  this.active_seq                 = null;
  this.active_session_token       = null;
  this.active_response_token      = null;
  this.active_remote_user_id      = null;
  this.incoming_call_type         = null;

  this.sm_timer                   = null;
  this.call_state                 = "CS_NULL";
  this.hold_state                 = 0;
  this.state_table                = {};

  this.user_id                    = null;

  this.mediaEngine                = null;

  this.incomingCallHandler        = null;         // prepare DOM elements
  this.incomingCallCancelHandler  = null;
  this.postCallHandler            = null;
  this.errorHandler               = null;
  this.handleUIOnAutoAnsweredCall = null;

  this.ring_dom_id                = null;
  this.ringback_dom_id            = null;

  this.start_ring                 = null;
  this.stop_ring                  = null;
  this.start_ringback             = null;
  this.stop_ringback              = null;

  this.ringing                    = false;

  //============ utilities =============
  this.startTimer = function(sec) {
//    self.sm_timer = setTimeout(function(){self.state_table[self.call_state]("E_TIMEOUT", null)}, 1000 * sec);
    self.sm_timer = setTimeout(function(){self.smExec("E_TIMEOUT", null)}, 1000 * sec);
  }

  this.clearCall = function() {
    roap_logger.debug("clearing call");

    self.active_offerer_session_id  = null;
    self.active_answerer_session_id = null;
    self.active_seq                 = null;
    self.active_session_token       = null;
    self.active_response_token      = null;
    self.active_remote_user_id      = null;
    self.incoming_call_type         = null;
  };

  this.startRing = function() {
    self.ringing = true;

    if (typeof self.start_ring === "function")
      self.start_ring();
    else if ((typeof self.ring_dom_id != "undefined") && self.ring_dom_id != null)
      document.getElementById(self.ring_dom_id).play();

    roap_logger.debug("start ring");
  };

  this.stopRing = function() {
    if (typeof self.stop_ring === "function")
      self.stop_ring();
    else if ((typeof self.ring_dom_id != "undefined") && self.ring_dom_id != null) {
      var ring = document.getElementById(self.ring_dom_id);
      ring.pause();
      ring.currentTime = 0;
    }

    roap_logger.debug("stop ring");
    self.ringing = false;
  };

  this.startRingback = function() {
    if (self.start_ringback === "function")
      self.start_ringback();
    else if ((typeof self.ringback_dom_id != "undefined") && self.ringback_dom_id != null)
      document.getElementById(self.ringback_dom_id).play();

    roap_logger.debug("start ringback");
  };

  this.stopRingback = function() {
    if (typeof self.stop_ringback === "function")
      self.stop_ringback();
    else if ((typeof self.ringback_dom_id != "undefined") && self.ringback_dom_id != null) {
      var ringback = document.getElementById(self.ringback_dom_id);
      ringback.pause();
      ringback.currentTime = 0;
    }

    roap_logger.debug("stop ringback");
  };

  this.genGUID = function() {
    var S4 = function() {
      return Math.floor(Math.random() * 0x100000).toString(16);
    };
    return (self.user_id + "_" + S4() + S4() + "_" + S4() + "_" + S4() + "_" + S4() + "_" + S4() + S4() + S4());
  };

  this.initActiveSession = function (seq, offerer_sid, answerer_sid) {
    self.active_seq = seq;
    self.active_offerer_session_id = offerer_sid;
    self.active_answerer_session_id = answerer_sid;
    roap_logger.debug(self.active_seq + " " + self.active_offerer_session_id + " " + self.active_answerer_session_id);
  };

  this.updateActiveSession = function (msg) {
    if (msg == null) {
      roap_logger.error("no msg provided to update session info");
      return false;
    }

    if (msg.seq != self.active_seq || msg.offererSessionId != self.active_offerer_session_id) {
      roap_logger.error("mismatched seq or offererSessionId msg.seq=" + msg.seq +
                   " active_seq=" + self.active_seq +
                   " msg.offererSessionId=" + msg.offererSessionId +
                   " active_offerer_session_id=" + self.active_offerer_session_id);
      return false;
    }

    // only answerer session id for now
    self.active_answerer_session_id = msg.answererSessionId;
    return true;
  };

  this.processSDP = function(sdp) {
    self.smExec("E_SDP_READY", sdp);
  }

  this.sendMsg = function (msg, remote_user) {
    if (self.user_id == null || remote_user == null) {
      roap_logger.error("local or remote user not set");
      return;
    }

    self.sent_msg = msg;
    self.sigChan.send(self.user_id,
                      remote_user,
                      msg,
                      "CALL",
                      function() {
                        roap_logger.debug(self.sent_msg.messageType + " sent successfully");
                        self.sent_msg = null;
                      },
                      function() {
                        roap_logger.debug(self.sent_msg.messageType + " sent failed");
                        self.sent_msg = null;
                      });
  };

  this.sendErrorResponse = function (remote_user, etype, msg) {
    var rsp = {
      messageType:       "ERROR",
      seq:               msg.seq,
      offererSessionId:  msg.offererSessionId,
      answererSessionId: msg.answererSessionId,
      errorType:         etype
    };

    //console.log(rsp);
    self.sendMsg(rsp, remote_user);
  };

  this.sendError = function (etype) {
    var msg = {
      messageType:       "ERROR",
      seq:               self.active_seq,
      offererSessionId:  self.active_offerer_session_id,
      answererSessionId: self.active_answerer_session_id,
      errorType:         etype
    };
    self.sendMsg(msg, self.active_remote_user_id);
  };

  this.sendOffer = function (sdp, candidates) {
    var msg = {
      messageType:       "OFFER",
      seq:               self.active_seq,
      offererSessionId:  self.active_offerer_session_id,
      answererSessionId: self.active_answerer_session_id,
      candidates:        JSON.stringify(candidates),
      sdp:               sdp
    };
    self.sendMsg(msg, self.active_remote_user_id);
  };

  this.sendAnswer = function (sdp, candidates) {
    //roap_logger.debug(self.active_seq + " " + self.active_offerer_session_id + " " + self.active_answerer_session_id);
    var msg = {
      messageType:       "ANSWER",
      seq:               self.active_seq,
      offererSessionId:  self.active_offerer_session_id,
      answererSessionId: self.active_answerer_session_id,
      candidates:        JSON.stringify(candidates),
      sdp:               sdp
    };
    self.sendMsg(msg, self.active_remote_user_id);
  };

  this.sendInfo = function (info) {
    var msg = {
      messageType:       "INFO",
      seq:               self.active_seq,
      offererSessionId:  self.active_offerer_session_id,
      answererSessionId: self.active_answerer_session_id,
      info:              info
    };
    roap_logger.debug("sending INFO");
    self.sendMsg(msg, self.active_remote_user_id);
  };

  this.sendOk = function() {
    var msg = {
      messageType:       "OK",
      seq:               self.active_seq,
      offererSessionId:  self.active_offerer_session_id,
      answererSessionId: self.active_answerer_session_id
    };
    self.sendMsg(msg, self.active_remote_user_id);
  };

  this.sendShutdown = function() {
    var msg = {
      messageType:       "SHUTDOWN",
      seq:               self.active_seq,
      offererSessionId:  self.active_offerer_session_id,
      answererSessionId: self.active_answerer_session_id
    };
    self.sendMsg(msg, self.active_remote_user_id);
  };
}

Roap.prototype.msgHandler = function(self, data) {
  var msg = data.roap;
  var remote_user = data.orig;

  roap_logger.debug("received " + msg.messageType + ", at cstate " + self.call_state);
  switch(msg.messageType) {
    case "OFFER":
      if (self.active_remote_user_id != null && remote_user != self.active_remote_user_id) {
        roap_logger.warning("received OFFER from user(" + remote_user + ") while placing a call to " + self.remote_user_id + " -- send REFUSED");
        self.sendErrorResponse(remote_user, "REFUSED", msg);

        break;
      }
      else if ((self.active_seq != null && msg.seq != self.active_seq) ||
               (self.active_offerer_session_id != null && msg.offererSessionId != self.active_offerer_session_id)) {
        roap_logger.warning("glare happens");

        self.sendErrorResponse(remote_user, "CONFLICT", msg);

        break;
      }

      var ctype = 'AUDIO';
      if (msg.sdp.match(/m=video/)) {
        roap_logger.warning("Setting ctype = 'VIDEO'");
        ctype = 'VIDEO';
      }
	// HACK HACK
	msg.sdp = msg.sdp.replace(/a=setup:active/, 'a=setup:actpass'); //\r\na=iceRestart:true');

	// AUTO-ANSWER if URI has 'auto-answer=1'
	if (AUTO_ANSWER || 
			( window.location.search.length > 1 && window.location.search.toLowerCase().indexOf('auto-answer=1') > -1) ) {
		console.log('DETECTED AUTO-ANSWER: TRUE, SETTING "auto-pickup" in STATE MACHINE');
		msg['action'] = 'auto-pickup';
	}

	//TODO::: Add code to store fingerprint on unload and relpace on autopickup.
	//msg.sdp = msg.sdp.replace(/a=fingerprint:/, 'a=setup:actpass');
	//console.log(msg.sdp.indexOf("a=fingerprint:"));
	//console.log(msg.sdp.substring(msg.sdp.indexOf("a=fingerprint:"), msg.sdp.indexOf("a=setup:")));

console.log("****************************")
console.log(JSON.stringify(msg, null, 1))
console.log("****************************")
      // async incomingCallHandler
      if (self.incomingCallHandler != null) {
        //self.startRing();
        self.active_remote_user_id = remote_user;
        self.incoming_call_type = ctype;

        if (msg.action !== undefined && msg.action === 'auto-pickup') {
            self.smExec("E_MSG_RECV_OFFER", msg);
			if (self.handleUIOnAutoAnsweredCall != undefined && self.handleUIOnAutoAnsweredCall != null
					&& (typeof self.handleUIOnAutoAnsweredCall === "function") ) {
				setTimeout(function() {
					console.log("REMOTE USER: " + remote_user);
					self.handleUIOnAutoAnsweredCall(remote_user, ctype);
				}, 2000);
			}
        }
        else {
          self.startRing();
          self.incomingCallHandler(remote_user,
                                   msg.offererSessionId,
                                   ctype,
                                   function(ans) {
                                     if (ans) {
                                       self.smExec("E_MSG_RECV_OFFER", msg);
                                     }
                                     else {
                                       console.log("In REFUSED offer handler");
                                       self.sendErrorResponse(remote_user, "REFUSED", msg);
                                       self.stopRing();
                                       self.clearCall();
                                     }
                                   });
        }
      }
      else {
        roap_logger.error("incoming call but no handler, reject and clear call");
        self.sendErrorResponse(remote_user, "REFUSED", msg);
        self.clearCall();
      }

      break;

    case "ANSWER":
      if (self.active_remote_user_id != remote_user ||
          self.active_seq != msg.seq ||
          self.active_offerer_session_id != msg.offererSessionId) {
        roap_logger.warning("received " + msg.messageType + " with mismatch info");
        roap_logger.debug(msg);
        self.sendErrorResponse(remote_user, "NOMATCH", msg);

        break;
      }

      self.smExec("E_MSG_RECV_ANSWER", msg);
      break;

    case "SHUTDOWN":
      if (self.ringing && self.call_state == "CS_NULL") {
        if (self.incomingCallCancelHandler != null)
          self.incomingCallCancelHandler();

        self.sendOk();
        self.stopRing();
        break;
      }

      if (self.active_remote_user_id != remote_user ||
          // self.active_seq != msg.seq ||
          self.active_offerer_session_id != msg.offererSessionId ||
          (self.call_state != "CS_ALERTING" && self.call_state != "CS_OFFERED" && self.active_answerer_session_id != msg.answererSessionId)) {
        roap_logger.warning("received " + msg.messageType + " with mismatch info");
        roap_logger.debug(msg);
        self.sendErrorResponse(remote_user, "NOMATCH", msg);

        break;
      }

      self.smExec("E_MSG_RECV_SHUTDOWN", msg);
      break;

    case "OK":
      // response for SHUTDOWN and ANSWER
      self.smExec("E_MSG_RECV_OK", msg);
      break;

    case "ERROR":
      // NOMATCH, TIMEOUT, REFUSED, CONFLICT, DOUBLECONFLICT, FAILED
      if (self.active_remote_user_id == remote_user &&
          self.active_seq == msg.seq &&
          self.active_offerer_session_id == msg.offererSessionId) {
        self.smExec("E_MSG_RECV_ERROR", msg);
      }
      else {
        roap_logger.debug(msg);
        roap_logger.warning("received ERROR for unexpected call. drop it");
      }
      break;

    default:
      roap_logger.debug("unhandled message " + msg.messageType);
  }
};

Roap.prototype.smExec = function(event, msg) {
  var self = this;
  var state_table = {};

  state_table["CS_NULL"] = function(event, msg) {
    switch(event) {
      case "E_USER_MAKE_CALL":
        self.mediaEngine.open(
          self.mediaEngine.placeCall,
          self.userHangup,
          self.processSDP);

        self.call_state = "CS_DIALING";
        self.hold_state = 0;           // reset hold state
        break;

      case "E_MSG_RECV_OFFER":
        self.initActiveSession(msg.seq, msg.offererSessionId, self.genGUID());

        self.mediaEngine.open(
          self.mediaEngine.answerCall,
          self.userReject,
          self.processSDP,
          self.incoming_call_type);

        var candidates = new Array;
        if (typeof msg.candidates != "undefined")
          candidates = JSON.parse(msg.candidates);

        //setCookie("sbc_fingerprint", msg.sdp.substring(msg.sdp.indexOf("a=fingerprint:"), msg.sdp.indexOf("a=setup:")), 300);

        self.mediaEngine.acceptCall(msg.sdp, candidates, "offer");

        self.hold_state = 0;
        self.call_state = "CS_OFFERED";

        // do ringing in the msgHandler() as soon as the OFFER is received.
        //self.startRing();

        break;

      default:
        roap_logger.debug("unhandled event " + event);
    }
  };

  state_table["CS_DIALING"] = function(event, msg) {
    switch(event) {
      case "E_SDP_READY":
        roap_logger.debug("got sdp, sending OFFER to " + self.active_remote_user_id);
        if (self.hold_state) {
          roap_logger.debug("fixing up sdp to tell the other side to hold");
          msg.sdp = msg.sdp.replace(/(c=IN IP4)[\s]+[0-9]+.[0-9]+.[0-9]+.[0-9]+/, '$1 0.0.0.0').replace(/a=sendrecv/, 'a=sendonly');
        }

        console.log(msg.sdp.substring(msg.sdp.indexOf("a=fingerprint:"), msg.sdp.indexOf("a=setup:")));

        self.sendOffer(msg.sdp, msg.candidates);
        // FIXME: doing the equivalent of ringback
        //        start timer

        // do ringback ONLY if we are making a new call
        if (self.call_state == "CS_NULL")
          self.startRingback();

        self.call_state = "CS_ALERTING";

        break;

      case "E_MSG_RECV_ERROR":
        roap_logger.warning("got error. errorType=" + msg.errorType);
        self.clearCall();
        self.mediaEngine.close();

        if (self.errorHandler != null) {
          self.errorHandler("CS_DIALING", msg.errorType);
        }
        if (self.postCallHandler != null) {
          self.postCallHandler();
        }

        self.call_state = "CS_NULL";
        break;

      case "E_MSG_RECV_SHUTDOWN": // msgHandler already filter, so if it gets here it is meant for us
        self.sendOk();
        // fall through
      case "E_USER_HANGUP":
        roap_logger.debug("got hangup (or mic/cam access denied) from user");
        self.clearCall();

        self.mediaEngine.close();

        if (self.postCallHandler != null) {
          self.postCallHandler();
        }

        self.call_state = "CS_NULL";
        break;
    }
  };

  state_table["CS_ALERTING"] = function(event, msg) {
    switch(event) {
      case "E_USER_HANGUP":
        roap_logger.debug("got hangup from user. sending shutdown");
        self.sendShutdown();
        self.startTimer(3);
        // FIXME: do we need to send SHUTDOWN to the other send since we send OFFER already?
        //        maybe not. we just go back to IDLE/NULL and when receive ANSWER from these
        //        states we can send ERROR to kick the other side back to IDLE/NULL
        self.call_state = "CS_IDLE";

        self.stopRingback();

        break;

      case "E_MSG_RECV_ERROR":
        roap_logger.warning("got error. errorType=" + msg.errorType);
        // fall thru
      case "E_MSG_RECV_SHUTDOWN":
        self.clearCall();
        self.mediaEngine.close();
        if ((event == "E_MSG_RECV_ERROR") && (self.errorHandler != null)) {
          self.errorHandler("CS_ALERTING", msg.errorType);
        }
        else
          self.sendOk();
        if (self.postCallHandler != null) {
          self.postCallHandler();
        }

        self.call_state = "CS_NULL";

        self.stopRingback();

        break;

      case "E_MSG_RECV_ANSWER":
        if (self.updateActiveSession(msg) != false) {
          //console.log(msg);
          var candidates = new Array;
          if (typeof msg.candidates != "undefined")
            candidates = JSON.parse(msg.candidates);

          self.mediaEngine.acceptCall(msg.sdp, candidates, "answer");
          self.sendOk();
          self.call_state = "CS_CONNECTED";

          // stop ringback
          self.stopRingback();
        }
        else {
          roap_logger.warning("got a ANSWER that does not match the call");
        }
        break;
    }
  };

  state_table["CS_OFFERED"] = function(event, msg) {
    switch(event) {
      case "E_SDP_READY":
        // this is the case of auto-answer. preferably the user is presented with choice how to
        // or whether to answer the call and use the event E_USER_ANSWER to move to CS_ACCEPTED
        //console.log(msg.sdp.substring(msg.sdp.indexOf("a=fingerprint:"), msg.sdp.indexOf("a=setup:")));
        roap_logger.debug("got sdp, sending ANSWER to " + self.active_remote_user_id);
        self.sendAnswer(msg.sdp, msg.candidates);
        self.startTimer(3);

        self.call_state = "CS_ACCEPTED";
        // stop ringing
        self.stopRing();
        break;

      case "E_MSG_RECV_SHUTDOWN":
        self.sendOk();
        // fall through
      case "E_RECV_SHUTDOWN":
        // return to IDLE and let the call be cleaned up gracefully
        self.startTimer(1);   // start cleaning up the call in 1 sec
        self.stopRing();
        self.call_state = "CS_IDLE";

        break;

      case "E_USER_HANGUP":
        self.userReject();
        self.mediaEngine.close();
        self.call_state = "CS_NULL";     // just for the completeness. this is done inside roapUserReject() already
        // stop ringing
        self.stopRing();

        break;

      case "E_USER_ANSWER":
        // if callee reject the call, proceed as if he hangup by doing roapSM("E_USER_HANGUP");

        // set constrain if callee prefer voice only.
        // webrtcAnswerCall();
        self.call_state = "CS_ACCEPTED";
        // stop ringing
        self.stopRing();

        console.log("Print message:");
        console.log(msg);
        //Drop cookies in browser on page unload
        window.onunload = function() {
          console.log("Unloading cookies!");
          setCookie("call_state", "active", 300);
          setCookie("active_offerer_session_id", self.active_offerer_session_id, 300);
          setCookie("active_answerer_session_id", self.active_answerer_session_id, 300);
          setCookie("active_seq", self.active_seq, 300);
          setCookie("active_session_token", self.active_session_token, 300);
          setCookie("active_response_token", self.active_response_token, 300);
          setCookie("active_remote_user_id", self.active_remote_user_id, 300);
          setCookie("incoming_call_type", self.incoming_call_type, 300);
          setCookie("remote_sdp", self.remote_sdp, 300);
          setCookie("local_sdp", self.local_sdp, 300);
          return "Please Reconnect!";
        };

        break;
    }
  };

  state_table["CS_ACCEPTED"] = function(event, msg) {
  // not a relavent state for now... need revisit
    switch(event) {
      case "E_TIMEOUT":
        roap_logger.debug("timeout waiting for OK in the CS_ACCEPTED state");
        self.sendShutdown();
        self.startTimer(3);

        self.call_state = "CS_IDLE";
        break;

      case "E_MSG_RECV_OK":
        self.call_state = "CS_CONNECTED";

        console.log("Print message:");
        console.log(msg);
        //Drop cookies in browser on page unload
        window.onunload = function() {
          console.log("Unloading cookies!");
          setCookie("call_state", "active", 300);
          setCookie("active_offerer_session_id", self.active_offerer_session_id, 300);
          setCookie("active_answerer_session_id", self.active_answerer_session_id, 300);
          setCookie("active_seq", self.active_seq, 300);
          setCookie("active_session_token", self.active_session_token, 300);
          setCookie("active_response_token", self.active_response_token, 300);
          setCookie("active_remote_user_id", self.active_remote_user_id, 300);
          setCookie("incoming_call_type", self.incoming_call_type, 300);
          setCookie("remote_sdp", self.remote_sdp, 300);
          setCookie("local_sdp", self.local_sdp, 300);
          return "Please Reconnect!";
        };


        break;

    }
  };

  state_table["CS_CONNECTED"] = function(event, msg) {
    switch(event) {
      case "E_USER_HANGUP":
        self.sendShutdown();
        self.startTimer(3);

        self.call_state = "CS_IDLE";
        break;

      case "E_USER_PRESS_KEY":
        if (self.hold_state == 0)
          if (self.dtmf == "INFO")
            self.sendInfo({type: "DTMF", signal: msg, duration: 160});
          else
            self.mediaEngine.sendDTMF(msg);
        else {

        }
        break;

      case "E_USER_HOLD_RESUME":
        // local initiated hold
        self.hold_state = msg;
        console.log("Calling localRefreshCall");
        self.mediaEngine.localRefreshCall(self.processSDP);

        self.call_state = "CS_DIALING";
        break;

      case "E_MSG_RECV_OFFER":
        // remote initiated hold
        var candidates = new Array;
        if (typeof msg.candidates != "undefined")
          candidates = JSON.parse(msg.candidates);
        self.mediaEngine.acceptCall(msg.sdp, candidates, "offer");

        self.mediaEngine.remoteRefreshCall(self.processSDP);
        self.call_state = "CS_OFFERED";

        break;
/*
      case "E_MSG_RECV_OFFER":
        self.initActiveSession(msg.seq, msg.offererSessionId, self.genGUID());

        self.mediaEngine.open(
          self.mediaEngine.answerCall,
          self.userReject,
          self.processSDP,
          self.incoming_call_type);

        var candidates = new Array;
        if (typeof msg.candidates != "undefined")
          candidates = JSON.parse(msg.candidates);

        //setCookie("sbc_fingerprint", msg.sdp.substring(msg.sdp.indexOf("a=fingerprint:"), msg.sdp.indexOf("a=setup:")), 300);

        self.mediaEngine.acceptCall(msg.sdp, candidates, "offer");

        self.hold_state = 0;
        self.call_state = "CS_OFFERED";

        // do ringing in the msgHandler() as soon as the OFFER is received.
        //self.startRing();

        break;
*/

      case "E_MSG_RECV_SHUTDOWN": // msgHandler already filter, so if it gets here it is meant for us
        self.sendOk();
        // fall through

      case "E_MSG_RECV_ERROR":    // msgHandler already filter, so if it gets here it is meant for us
        self.mediaEngine.close();
        self.clearCall();

        if ((event == "E_MSG_RECV_ERROR") && (self.errorHandler != null)) {
          self.errorHandler("CS_CONNECTED", msg.errorType);
        }
        if (self.postCallHandler != null) {
          self.postCallHandler();
        }

        self.call_state = "CS_NULL";
        break;
      default:
        roap_logger.debug("unhandled event " + event);
    }
  };

  state_table["CS_IDLE"] = function(event, msg) {
    switch(event) {
      case "E_TIMEOUT":
      case "E_MSG_RECV_OK":
        self.mediaEngine.close();

        if (self.postCallHandler != null) {
          roap_logger.debug("before executing post call clean up " + self.active_offerer_session_id);
          self.postCallHandler();
        }

        self.clearCall();
        self.call_state = "CS_NULL";
        break;
    }
  };

  roap_logger.debug("Roap.smExec(" + self.user_id  + ") - at state(" + self.call_state + ") got event(" + event + ")");
  state_table[self.call_state](event, msg);
};

// ROAP external APIs
Roap.prototype.init = function(user_id, media_engine, sig_chan, incoming_call_cb, end_call_cb, error_cb, cancel_cb, start_ring, stop_ring, start_ringback, stop_ringback, auto_answer_ui_handler) {
  this.user_id            = user_id;
  this.mediaEngine        = media_engine;
  this.sigChan            = sig_chan;

  if (typeof incoming_call_cb != "undefined")
    this.incomingCallHandler = incoming_call_cb;
  if (typeof end_call_cb != "undefined")
    this.postCallHandler = end_call_cb;
  if (typeof error_cb != "undefined")
    this.errorHandler = error_cb;
  if (typeof cancel_cb != "undefined")
    this.incomingCallCancelHandler = cancel_cb;

  if (typeof start_ring === "function")
    this.start_ring = start_ring;
  if (typeof stop_ring === "function")
    this.stop_ring = stop_ring;
  if (typeof start_ringback === "function")
    this.start_ringback = start_ringback;
  if (typeof stop_ringback === "function")
    this.stop_ringback = stop_ringback;
  if (typeof auto_answer_ui_handler === "function")
    this.handleUIOnAutoAnsweredCall = auto_answer_ui_handler;

  this.sigChan.attachSM("CALL", this);
  //this.sigChan.registerExitHandler(function() { console.log("my sigChan is closing..."); })
};

Roap.prototype.setMediaElements = function(local_media_dom_id, remote_media_dom_id) {
  this.mediaEngine.setMediaDOM(local_media_dom_id, remote_media_dom_id);
};

Roap.prototype.setRingTones = function(ring, ringback) {
  this.ring_dom_id = ring;
  this.ringback_dom_id = ringback;
}

Roap.prototype.isCallActive = function() {
  return (this.call_state === "CS_CONNECTED");
};

Roap.prototype.userHangup = function() {
  this.smExec("E_USER_HANGUP", null);
};

Roap.prototype.sendKey = function(key) {
  if (this.call_state != "CS_CONNECTED") {
    roap_logger.debug("key press outside a call. do nothing");
    return "";
  }

  if ((key >= "0" && key <= 9) || key == "*" || key == "#")
    this.smExec("E_USER_PRESS_KEY", key);
  else
    roap_logger.warning("invalid DTMF key " + key);
};

Roap.prototype.changeHoldState = function(hold) {
  if (this.call_state != "CS_CONNECTED") {
    roap_logger.warning("can not change mute state outside a call context");
    return;
  }

  this.smExec("E_USER_HOLD_RESUME", hold);
};

Roap.prototype.changeMuteState = function(mute) {
  if (this.call_state != "CS_CONNECTED") {
    roap_logger.warning("can not change mute state outside a call context");
    return;
  }

  if (mute)
    this.mediaEngine.setLocalMedia(false);
  else
    this.mediaEngine.setLocalMedia(true);
};

Roap.prototype.userReject = function() {
  this.sendError("REFUSED");
  this.clearCall();

  if (this.postCallHandler != null)
    this.postCallHandler();

  this.call_state = "CS_NULL";
};

Roap.prototype.answerCall = function() {
  if (this.call_state != "CS_OFFERED") {
    roap_logger.error("Attempt to answer call in the wrong state" + this.call_state);
    return "";
  }

  this.smExec("E_USER_ANSWER", null);
};

Roap.prototype.placeCall = function(remote_user) {
  var s_id = this.genGUID();

  if (this.call_state != "CS_NULL") {
    roap_logger.error("Attempt to place call in the wrong state " + this.call_state);
    return "";
  }

  this.initActiveSession(++this.seq, s_id, null);
  this.active_remote_user_id = remote_user;
  roap_logger.debug("place call to " + this.active_remote_user_id);

  this.smExec("E_USER_MAKE_CALL", null);

  return s_id;
};


//======================================
// register

function Register() {
  var self = this;

  this.user_id                   = null;
  this.secret                    = null;
  this.domain                    = null;
  this.status                    = null;
  this.heartbeat                 = null;
  this.heartbeat_interval         = 50000;

  this.seq                       = 0;

  this.sigChan                   = null;
  this.signaling_server          = "webSBC";

  this.loginErrorHandler         = null;

  this.sendLogin = function(seq) {
    var msg;

    if (self.domain == null)
      msg = {
        messageType:     "LOGIN",
        userId:          self.user_id,
        password:        self.secret,
        cname:           self.cname,
        seq:             seq
      };
    else
      msg = {
        messageType:     "LOGIN",
        userId:          self.user_id,
        password:        self.secret,
        cname:           self.cname,
        domain:          self.domain,
        seq:             seq
      };

    roap_logger.debug("sending LOGIN (" + self.user_id + ")");
    self.sigChan.send(self.user_id,
                      self.signaling_server,    // webSBC/webServer???
                      msg,
                      "SESSION",
                      function() {},
                      function() {});
    //roap_logger.debug("LOGIN sent");
  };

  this.sendLogout = function() {
    var msg = {
      messageType:     "LOGOUT",
      userId:          self.user_id,
      seq:             ++self.seq
    };

    roap_logger.debug("sending LOGOUT (" + self.user_id + ")");
    self.sigChan.send(this.user_id,
                      self.signaling_server,
                      msg,
                      "SESSION",
                      function() {},
                      function() {});
    //roap_logger.debug("LOGOUT sent");
  };

  this.sendHeartbeat = function() {
    var msg = {
      messageType:     "HEARTBEAT",
      userId:          self.user_id,
      seq:             ++self.seq,
      status:          self.status
    };

    self.sigChan.send(self.user_id,
                      self.signaling_server,
                      msg,
                      "SESSION",
                      function() {},
                      function() {});

    roap_logger.debug("sending HEARTBEAT. (" + self.user_id + ") " + (new Date()));
    self.heartbeat = setTimeout(self.sendHeartbeat, self.heartbeat_interval);
    //roap_logger.debug("re-arming HEARTBEAT timer");
  };

  this.sendSleep = function () {
    var msg = {
      messageType:       "SLEEP",
      userId:            self.user_id,
      seq:               ++self.seq
    };

    roap_logger.debug("sending SLEEP (" + self.user_id + ")");
    self.sigChan.send(this.user_id,
                      self.signaling_server,
                      msg,
                      "SESSION",
                      function() {},
                      function() {});
  };
}

Register.prototype.init = function(sig_chan, user_id, secret, cname, domain, logout_cb) {
  var self = this;
  if ((typeof user_id != "undefined") &&
      (typeof secret != "undefined")) {
    roap_logger.debug("init with new user_id(" + user_id + "/" + cname + ") and secret");
    this.user_id = user_id;
    this.secret = secret;
    this.cname = (typeof cname === "undefined" || cname === null || cname.length === 0) ? user_id : cname;
    if (typeof domain != "undefined")
      this.domain = domain;
    if (typeof logout_cb != "undefined")
      this.loginErrorHandler = logout_cb;

    this.sigChan = sig_chan;

    this.sigChan.attachSM("SESSION", this);
    this.sigChan.registerReadyHandler(function() {self.sendLogin(++self.seq)});
    this.status = "no_call";
    // setTimeout(this.init, 2000);   // schedule sending LOGIN 2 secs later
  }
  else {
    roap_logger.error("missing init info");
  }
}

Register.prototype.setStatus = function(status) {
  this.status = status;
};

Register.prototype.logout = function() {
  this.sendLogout();
  this.sigChan.close();

  /*
  if (this.loginErrorHandler != null)
    this.loginErrorHandler();
  */

  this.user_id                   = null;
  this.secret                    = null;
  this.domain                    = null;
  this.status                    = null;
  this.sigChan                   = null;

  this.loginErrortHandler        = null;

  if (this.heartbeat != null) {
    clearTimeout(this.heartbeat);
    this.heartbeat = null;
  }
};

Register.prototype.msgHandler = function(self, data) {
  var msg = data.session;
  var remote_user = data.orig;

  roap_logger.debug("received " + msg.messageType);
  switch(msg.messageType) {
    case "CHALLENGE":
      self.sendLogin(msg.seq);
      break;

    case "SUCCESS":
      // start heartbeat here
      self.sendHeartbeat();
      break;

    case "ERROR":
      if (msg.errorType == "NOMATCH") {
        if (self.loginErrorHandler != null)
          self.loginErrorHandler();
        // stop retry login
        self.sigChan.unregisterReadyHandler(self.init);
        self.sigChan.close();
        if (self.heartbeat != null) {
          clearTimeout(this.heartbeat);
          self.heartbeat = null;
        }

      }
      break;

    case "OK":
      // do nothing
      break
  }
};


/********************************************************************
 websbc application layer
*********************************************************************/

function SansayWebSBCClient(server, use_info_method) {
  this.signaling_server          = server;
  this.signaling_controller_path = "";

  this.rtc                       = 0;

  this.sigChan                   = new ChanWebSocket("SYMMETRIC");
  this.media                     = null;
  if (typeof WebRTC === "function")
    this.media = new WebRTC();
  this.reg                       = new Register();
  this.roap                      = new Roap(use_info_method);
}

SansayWebSBCClient.prototype.attachMedia = function(media) {
  this.media = media;
};

SansayWebSBCClient.prototype.login = function(init_params) {
  if (init_params.logger !== undefined) {
    webrtc_logger.addHandler(init_params.logger);
    roap_logger.addHandler(init_params.logger);
  }
  if (init_params.notifier !== undefined) {
    if (typeof init_params.notifier !== "function")
      roap_logger.warning("Can not override notifier. Must be a function.");
    else {
      webrtc_alert = init_params.notifier;
      roap_logger.debug("override notifier");
    }
  }

  this.sigChan.open(this.signaling_server, this.signaling_controller_path, init_params.user_id, init_params.conn_status_cb);
  this.reg.init(this.sigChan, init_params.user_id, init_params.secret, init_params.cname, init_params.domain, init_params.login_fail_cb);

  if (typeof init_params.media != "undefined" &&
      typeof init_params.media.incoming_session_cb != "undefined" &&
      init_params.media.incoming_session_cb != null &&
      typeof init_params.media.end_session_cb != "undefined" &&
      init_params.media.end_session_cb != null) {
    roap_logger.debug("initializing call engine");
    this.roap.init( init_params.user_id,
					this.media,
					this.sigChan,
                    init_params.media.incoming_session_cb,
					init_params.media.end_session_cb,
                    init_params.media.error_cb,
					init_params.media.incoming_cancel_cb,
                    init_params.media.start_ring,
					init_params.media.stop_ring,
                    init_params.media.start_ringback,
					init_params.media.stop_ringback,
					init_params.auto_answer_ui_handler);
    this.rtc = 1;
  }
  else {
    roap_logger.error("initialize call engine fails. missing one or more parameters");
  }

  var self = this;
  window.onbeforeunload = function() {
    setCookie("user_id", init_params.user_id, 300);
    setCookie("secret", init_params.secret, 300);
    setCookie("cname", init_params.cname, 300);
    setCookie("domain", init_params.domain, 300);

    self.suspendSession();
  }

};

SansayWebSBCClient.prototype.logout = function() {
  window.onbeforeunload = function() {
    setCookie("user_id", "", 1);
    setCookie("secret", "", 1);
    setCookie("cname", "", 1);
    setCookie("domain", "", 1);
  };
  this.reg.logout();
};

SansayWebSBCClient.prototype.startRTCSession = function(callee) {
  if (this.rtc == 0)
    return;

  return this.roap.placeCall(callee);
};

SansayWebSBCClient.prototype.endRTCSession = function() {
  if (this.rtc == 0)
    return;

  this.roap.userHangup();
};

SansayWebSBCClient.prototype.suspendSession = function() {
  if (this.roap.isCallActive()) {
    roap_logger.debug("suspend active call");
    this.reg.sendSleep();
  }
};

SansayWebSBCClient.prototype.resetConnection = function() {
  this.media.close();
  this.roap.clearCall();
  this.roap.call_state = "CS_NULL";    // hack
  this.sigChan.resetConnection();
};

SansayWebSBCClient.prototype.sendDTMF = function(key) {
  if (this.rtc == 0)
    return;

  this.roap.sendKey(key);
};

SansayWebSBCClient.prototype.setHoldState = function(hold) {
  if (this.rtc == 0)
    return;

  this.roap.changeHoldState(hold);
}

SansayWebSBCClient.prototype.setMuteState = function(mute) {
  if (this.rtc == 0)
    return;

  this.roap.changeMuteState(mute);
}

SansayWebSBCClient.prototype.setVolumeState = function(vol) {
  if (this.rtc == 0)
    return;

  var player = document.getElementById(this.media.remote_media_dom_id);
  console.log('Before: ' + player.volume);
  player.volume = vol / 100;
  console.log('After: ' + player.volume);
}

SansayWebSBCClient.prototype.setMediaElements = function(local, remote) {
  if (this.rtc == 0)
    return;
  this.roap.setMediaElements(local, remote);
};

SansayWebSBCClient.prototype.setStunServers = function(servers) {
  this.media.setStunServers(servers);
};

SansayWebSBCClient.prototype.setRingTones = function(ring, ringback) {
  this.roap.setRingTones(ring, ringback);
}

SansayWebSBCClient.prototype.goBusy = function() {
  this.reg.setStatus("in_call");
};

SansayWebSBCClient.prototype.goActive = function() {
  this.reg.setStatus("no_call");
};



//==================================================================
// The followings are adaptation from the WebRTC project by Google
//   https://github.com/webrtc
//
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

//=================================
// SDP helpers Edge
//
var SDPUtils = {};

// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
SDPUtils.generateIdentifier = function() {
  return Math.random().toString(36).substr(2, 10);
};

// The RTCP CNAME used by all peerconnections from the same JS.
SDPUtils.localCName = SDPUtils.generateIdentifier();

// Splits SDP into lines, dealing with both CRLF and LF.
SDPUtils.splitLines = function(blob) {
  return blob.trim().split('\n').map(function(line) {
    return line.trim();
  });
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
SDPUtils.splitSections = function(blob) {
  var parts = blob.split('\nm=');
  return parts.map(function(part, index) {
    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
  });
};

// returns the session description.
SDPUtils.getDescription = function(blob) {
  var sections = SDPUtils.splitSections(blob);
  return sections && sections[0];
};

// returns the individual media sections.
SDPUtils.getMediaSections = function(blob) {
  var sections = SDPUtils.splitSections(blob);
  sections.shift();
  return sections;
};

// Returns lines that start with a certain prefix.
SDPUtils.matchPrefix = function(blob, prefix) {
  return SDPUtils.splitLines(blob).filter(function(line) {
    return line.indexOf(prefix) === 0;
  });
};

// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
SDPUtils.parseCandidate = function(line) {
  var parts;
  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parseInt(parts[1], 10),
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      case 'ufrag':
        candidate.ufrag = parts[i + 1]; // for backward compability.
        candidate.usernameFragment = parts[i + 1];
        break;
      default: // extension handling, in particular ufrag
        candidate[parts[i]] = parts[i + 1];
        break;
    }
  }
  return candidate;
};

// Translates a candidate object into SDP candidate attribute.
SDPUtils.writeCandidate = function(candidate) {
  var sdp = [];
  sdp.push(candidate.foundation);
  sdp.push(candidate.component);
  sdp.push(candidate.protocol.toUpperCase());
  sdp.push(candidate.priority);
  sdp.push(candidate.ip);
  sdp.push(candidate.port);

  var type = candidate.type;
  sdp.push('typ');
  sdp.push(type);
  if (type !== 'host' && candidate.relatedAddress &&
      candidate.relatedPort) {
    sdp.push('raddr');
    sdp.push(candidate.relatedAddress); // was: relAddr
    sdp.push('rport');
    sdp.push(candidate.relatedPort); // was: relPort
  }
  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
    sdp.push('tcptype');
    sdp.push(candidate.tcpType);
  }
  if (candidate.ufrag) {
    sdp.push('ufrag');
    sdp.push(candidate.ufrag);
  }
  return 'candidate:' + sdp.join(' ');
};

// Parses an ice-options line, returns an array of option tags.
// a=ice-options:foo bar
SDPUtils.parseIceOptions = function(line) {
  return line.substr(14).split(' ');
}

// Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
SDPUtils.parseRtpMap = function(line) {
  var parts = line.substr(9).split(' ');
  var parsed = {
    payloadType: parseInt(parts.shift(), 10) // was: id
  };

  parts = parts[0].split('/');

  parsed.name = parts[0];
  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
  // was: channels
  parsed.numChannels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
  return parsed;
};

// Generate an a=rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
SDPUtils.writeRtpMap = function(codec) {
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
      (codec.numChannels !== 1 ? '/' + codec.numChannels : '') + '\r\n';
};

// Parses an a=extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
SDPUtils.parseExtmap = function(line) {
  var parts = line.substr(9).split(' ');
  return {
    id: parseInt(parts[0], 10),
    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
    uri: parts[1]
  };
};

// Generates a=extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
SDPUtils.writeExtmap = function(headerExtension) {
  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
      (headerExtension.direction && headerExtension.direction !== 'sendrecv'
          ? '/' + headerExtension.direction
          : '') +
      ' ' + headerExtension.uri + '\r\n';
};

// Parses an ftmp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
SDPUtils.parseFmtp = function(line) {
  var parsed = {};
  var kv;
  var parts = line.substr(line.indexOf(' ') + 1).split(';');
  for (var j = 0; j < parts.length; j++) {
    kv = parts[j].trim().split('=');
    parsed[kv[0].trim()] = kv[1];
  }
  return parsed;
};

// Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeFmtp = function(codec) {
  var line = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.parameters && Object.keys(codec.parameters).length) {
    var params = [];
    Object.keys(codec.parameters).forEach(function(param) {
      params.push(param + '=' + codec.parameters[param]);
    });
    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  }
  return line;
};

// Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
SDPUtils.parseRtcpFb = function(line) {
  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
  return {
    type: parts.shift(),
    parameter: parts.join(' ')
  };
};
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeRtcpFb = function(codec) {
  var lines = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
    // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(function(fb) {
      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
          '\r\n';
    });
  }
  return lines;
};

// Parses an RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
SDPUtils.parseSsrcMedia = function(line) {
  var sp = line.indexOf(' ');
  var parts = {
    ssrc: parseInt(line.substr(7, sp - 7), 10)
  };
  var colon = line.indexOf(':', sp);
  if (colon > -1) {
    parts.attribute = line.substr(sp + 1, colon - sp - 1);
    parts.value = line.substr(colon + 1);
  } else {
    parts.attribute = line.substr(sp + 1);
  }
  return parts;
};

// Extracts the MID (RFC 5888) from a media section.
// returns the MID or undefined if no mid line was found.
SDPUtils.getMid = function(mediaSection) {
  var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
  if (mid) {
    return mid.substr(6);
  }
}

SDPUtils.parseFingerprint = function(line) {
  var parts = line.substr(14).split(' ');
  return {
    algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
    value: parts[1]
  };
};

// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
      'a=fingerprint:');
  // Note: a=setup line is ignored since we use the 'auto' role.
  // Note2: 'algorithm' is not case sensitive except in Edge.
  return {
    role: 'auto',
    fingerprints: lines.map(SDPUtils.parseFingerprint)
  };
};

// Serializes DTLS parameters to SDP.
SDPUtils.writeDtlsParameters = function(params, setupType) {
  var sdp = 'a=setup:' + setupType + '\r\n';
  params.fingerprints.forEach(function(fp) {
    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  });
  return sdp;
};
// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.splitLines(mediaSection);
  // Search in session part, too.
  lines = lines.concat(SDPUtils.splitLines(sessionpart));
  var iceParameters = {
    usernameFragment: lines.filter(function(line) {
      return line.indexOf('a=ice-ufrag:') === 0;
    })[0].substr(12),
    password: lines.filter(function(line) {
      return line.indexOf('a=ice-pwd:') === 0;
    })[0].substr(10)
  };
  return iceParameters;
};

// Serializes ICE parameters to SDP.
SDPUtils.writeIceParameters = function(params) {
  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
      'a=ice-pwd:' + params.password + '\r\n';
};

// Parses the SDP media section and returns RTCRtpParameters.
SDPUtils.parseRtpParameters = function(mediaSection) {
  var description = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: [],
    rtcp: []
  };
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
    var pt = mline[i];
    var rtpmapline = SDPUtils.matchPrefix(
        mediaSection, 'a=rtpmap:' + pt + ' ')[0];
    if (rtpmapline) {
      var codec = SDPUtils.parseRtpMap(rtpmapline);
      var fmtps = SDPUtils.matchPrefix(
          mediaSection, 'a=fmtp:' + pt + ' ');
      // Only the first a=fmtp:<pt> is considered.
      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
      codec.rtcpFeedback = SDPUtils.matchPrefix(
          mediaSection, 'a=rtcp-fb:' + pt + ' ')
        .map(SDPUtils.parseRtcpFb);
      description.codecs.push(codec);
      // parse FEC mechanisms from rtpmap lines.
      switch (codec.name.toUpperCase()) {
        case 'RED':
        case 'ULPFEC':
          description.fecMechanisms.push(codec.name.toUpperCase());
          break;
        default: // only RED and ULPFEC are recognized as FEC mechanisms.
          break;
      }
    }
  }
  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  });
  // FIXME: parse rtcp.
  return description;
};

// Generates parts of the SDP media section describing the capabilities /
// parameters.
SDPUtils.writeRtpDescription = function(kind, caps) {
  var sdp = '';

  // Build the mline.
  sdp += 'm=' + kind + ' ';
  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
  sdp += ' UDP/TLS/RTP/SAVPF ';
  sdp += caps.codecs.map(function(codec) {
    if (codec.preferredPayloadType !== undefined) {
      return codec.preferredPayloadType;
    }
    return codec.payloadType;
  }).join(' ') + '\r\n';

  sdp += 'c=IN IP4 0.0.0.0\r\n';
  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
  caps.codecs.forEach(function(codec) {
    sdp += SDPUtils.writeRtpMap(codec);
    sdp += SDPUtils.writeFmtp(codec);
    sdp += SDPUtils.writeRtcpFb(codec);
  });
  var maxptime = 0;
  caps.codecs.forEach(function(codec) {
    if (codec.maxptime > maxptime) {
      maxptime = codec.maxptime;
    }
  });
  if (maxptime > 0) {
    sdp += 'a=maxptime:' + maxptime + '\r\n';
  }
  sdp += 'a=rtcp-mux\r\n';

  caps.headerExtensions.forEach(function(extension) {
    sdp += SDPUtils.writeExtmap(extension);
  });
  // FIXME: write fecMechanisms.
  return sdp;
};

// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
  var encodingParameters = [];
  var description = SDPUtils.parseRtpParameters(mediaSection);
  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

  // filter a=ssrc:... cname:, ignore PlanB-msid
  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'cname';
  });
  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  var secondarySsrc;

  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
  .map(function(line) {
    var parts = line.split(' ');
    parts.shift();
    return parts.map(function(part) {
      return parseInt(part, 10);
    });
  });
  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
    secondarySsrc = flows[0][1];
  }

  description.codecs.forEach(function(codec) {
    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
      var encParam = {
        ssrc: primarySsrc,
        codecPayloadType: parseInt(codec.parameters.apt, 10),
        rtx: {
          ssrc: secondarySsrc
        }
      };
      encodingParameters.push(encParam);
      if (hasRed) {
        encParam = JSON.parse(JSON.stringify(encParam));
        encParam.fec = {
          ssrc: secondarySsrc,
          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
        };
        encodingParameters.push(encParam);
      }
    }
  });
  if (encodingParameters.length === 0 && primarySsrc) {
    encodingParameters.push({
      ssrc: primarySsrc
    });
  }

  // we support both b=AS and b=TIAS but interpret AS as TIAS.
  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
  if (bandwidth.length) {
    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(7), 10);
    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
      // use formula from JSEP to convert b=AS to TIAS value.
      bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95
          - (50 * 40 * 8);
    } else {
      bandwidth = undefined;
    }
    encodingParameters.forEach(function(params) {
      params.maxBitrate = bandwidth;
    });
  }
  return encodingParameters;
};

// parses https://draft.ortc.org/#rtcrtcpparameters*
SDPUtils.parseRtcpParameters = function(mediaSection) {
  var rtcpParameters = {};

  var cname;
  // Gets the first SSRC. Note that with RTX there might be multiple
  // SSRCs.
  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
      .map(function(line) {
        return SDPUtils.parseSsrcMedia(line);
      })
      .filter(function(obj) {
        return obj.attribute === 'cname';
      })[0];
  if (remoteSsrc) {
    rtcpParameters.cname = remoteSsrc.value;
    rtcpParameters.ssrc = remoteSsrc.ssrc;
  }

  // Edge uses the compound attribute instead of reducedSize
  // compound is !reducedSize
  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  rtcpParameters.reducedSize = rsize.length > 0;
  rtcpParameters.compound = rsize.length === 0;

  // parses the rtcp-mux attrіbute.
  // Note that Edge does not support unmuxed RTCP.
  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  rtcpParameters.mux = mux.length > 0;

  return rtcpParameters;
};

// parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.
SDPUtils.parseMsid = function(mediaSection) {
  var parts;
  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
  if (spec.length === 1) {
    parts = spec[0].substr(7).split(' ');
    return {stream: parts[0], track: parts[1]};
  }
  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'msid';
  });
  if (planB.length > 0) {
    parts = planB[0].value.split(' ');
    return {stream: parts[0], track: parts[1]};
  }
};

// Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range
SDPUtils.generateSessionId = function() {
  return Math.random().toString().substr(2, 21);
};

// Write boilder plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
SDPUtils.writeSessionBoilerplate = function(sessId, sessVer) {
  var sessionId;
  var version = sessVer !== undefined ? sessVer : 2;
  if (sessId) {
    sessionId = sessId;
  } else {
    sessionId = SDPUtils.generateSessionId();
  }
  // FIXME: sess-id should be an NTP timestamp.
  return 'v=0\r\n' +
      'o=thisisadapterortc ' + sessionId + ' ' + version + ' IN IP4 127.0.0.1\r\n' +
      's=-\r\n' +
      't=0 0\r\n';
};

SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.direction) {
    sdp += 'a=' + transceiver.direction + '\r\n';
  } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    // spec.
    var msid = 'msid:' + stream.id + ' ' +
        transceiver.rtpSender.track.id + '\r\n';
    sdp += 'a=' + msid;

    // for Chrome.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
};

// Gets the direction from the mediaSection or the sessionpart.
SDPUtils.getDirection = function(mediaSection, sessionpart) {
  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  var lines = SDPUtils.splitLines(mediaSection);
  for (var i = 0; i < lines.length; i++) {
    switch (lines[i]) {
      case 'a=sendrecv':
      case 'a=sendonly':
      case 'a=recvonly':
      case 'a=inactive':
        return lines[i].substr(2);
      default:
        // FIXME: What should happen here?
    }
  }
  if (sessionpart) {
    return SDPUtils.getDirection(sessionpart);
  }
  return 'sendrecv';
};

SDPUtils.getKind = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  return mline[0].substr(2);
};

SDPUtils.isRejected = function(mediaSection) {
  return mediaSection.split(' ', 2)[1] === '0';
};

SDPUtils.parseMLine = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var parts = lines[0].substr(2).split(' ');
  return {
    kind: parts[0],
    port: parseInt(parts[1], 10),
    protocol: parts[2],
    fmt: parts.slice(3).join(' ')
  };
};

SDPUtils.parseOLine = function(mediaSection) {
  var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
  var parts = line.substr(2).split(' ');
  return {
    username: parts[0],
    sessionId: parts[1],
    sessionVersion: parseInt(parts[2], 10),
    netType: parts[3],
    addressType: parts[4],
    address: parts[5],
  };
}

//============================================
// RTCPeerConnection implementation for Edge
//
function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : dtlsRole || 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    var trackId = transceiver.rtpSender._initialTrackId ||
        transceiver.rtpSender.track.id;
    transceiver.rtpSender._initialTrackId = trackId;
    // spec.
    var msid = 'msid:' + (stream ? stream.id : '-') + ' ' +
        trackId + '\r\n';
    sdp += 'a=' + msid;
    // for Chrome. Legacy should no longer be required.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;

    // RTX
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
}

// Edge does not like
// 1) stun: filtered after 14393 unless ?transport=udp is present
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times
function filterIceServers(iceServers, edgeVersion) {
  var hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(function(server) {
    if (server && (server.urls || server.url)) {
      var urls = server.urls || server.url;
      if (server.url && !server.urls) {
        console.warn('RTCIceServer.url is deprecated! Use urls instead.');
      }
      var isString = typeof urls === 'string';
      if (isString) {
        urls = [urls];
      }
      urls = urls.filter(function(url) {
        var validTurn = url.indexOf('turn:') === 0 &&
            url.indexOf('transport=udp') !== -1 &&
            url.indexOf('turn:[') === -1 &&
            !hasTurn;

        if (validTurn) {
          hasTurn = true;
          return true;
        }
        return url.indexOf('stun:') === 0 && edgeVersion >= 14393 &&
            url.indexOf('?transport=udp') === -1;
      });

      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
  });
}

// Determines the intersection of local and remote capabilities.
function getCommonCapabilities(localCapabilities, remoteCapabilities) {
  var commonCapabilities = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: []
  };

  var findCodecByPayloadType = function(pt, codecs) {
    pt = parseInt(pt, 10);
    for (var i = 0; i < codecs.length; i++) {
      if (codecs[i].payloadType === pt ||
          codecs[i].preferredPayloadType === pt) {
        return codecs[i];
      }
    }
  };

  var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
    var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
    var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
    return lCodec && rCodec &&
        lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
  };

  localCapabilities.codecs.forEach(function(lCodec) {
    for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
      var rCodec = remoteCapabilities.codecs[i];
      if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
          lCodec.clockRate === rCodec.clockRate) {
        if (lCodec.name.toLowerCase() === 'rtx' &&
            lCodec.parameters && rCodec.parameters.apt) {
          // for RTX we need to find the local rtx that has a apt
          // which points to the same local codec as the remote one.
          if (!rtxCapabilityMatches(lCodec, rCodec,
              localCapabilities.codecs, remoteCapabilities.codecs)) {
            continue;
          }
        }
        rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
        // number of channels is the highest common number of channels
        rCodec.numChannels = Math.min(lCodec.numChannels,
            rCodec.numChannels);
        // push rCodec so we reply with offerer payload type
        commonCapabilities.codecs.push(rCodec);

        // determine common feedback mechanisms
        rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
          for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
            if (lCodec.rtcpFeedback[j].type === fb.type &&
                lCodec.rtcpFeedback[j].parameter === fb.parameter) {
              return true;
            }
          }
          return false;
        });
        // FIXME: also need to determine .parameters
        //  see https://github.com/openpeer/ortc/issues/569
        break;
      }
    }
  });

  localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
    for (var i = 0; i < remoteCapabilities.headerExtensions.length;
         i++) {
      var rHeaderExtension = remoteCapabilities.headerExtensions[i];
      if (lHeaderExtension.uri === rHeaderExtension.uri) {
        commonCapabilities.headerExtensions.push(rHeaderExtension);
        break;
      }
    }
  });

  // FIXME: fecMechanisms
  return commonCapabilities;
}

// is action=setLocalDescription with type allowed in signalingState
function isActionAllowedInSignalingState(action, type, signalingState) {
  return {
    offer: {
      setLocalDescription: ['stable', 'have-local-offer'],
      setRemoteDescription: ['stable', 'have-remote-offer']
    },
    answer: {
      setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
      setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
    }
  }[type][action].indexOf(signalingState) !== -1;
}

function maybeAddCandidate(iceTransport, candidate) {
  // Edge's internal representation adds some fields therefore
  // not all fieldѕ are taken into account.
  var alreadyAdded = iceTransport.getRemoteCandidates()
      .find(function(remoteCandidate) {
        return candidate.foundation === remoteCandidate.foundation &&
            candidate.ip === remoteCandidate.ip &&
            candidate.port === remoteCandidate.port &&
            candidate.priority === remoteCandidate.priority &&
            candidate.protocol === remoteCandidate.protocol &&
            candidate.type === remoteCandidate.type;
      });
  if (!alreadyAdded) {
    iceTransport.addRemoteCandidate(candidate);
  }
  return !alreadyAdded;
}


function makeError(name, description) {
  var e = new Error(description);
  e.name = name;
  // legacy error codes from https://heycam.github.io/webidl/#idl-DOMException-error-names
  e.code = {
    NotSupportedError: 9,
    InvalidStateError: 11,
    InvalidAccessError: 15,
    TypeError: undefined,
    OperationError: undefined
  }[name];
  return e;
}

function addTrackToStreamAndFireEvent(track, stream) {
    stream.addTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('addtrack',
        {track: track}));
}

function removeTrackFromStreamAndFireEvent(track, stream) {
    stream.removeTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('removetrack',
        {track: track}));
}

function fireAddTrack(pc, track, receiver, streams) {
    var trackEvent = new Event('track');
    trackEvent.track = track;
    trackEvent.receiver = receiver;
    trackEvent.transceiver = {receiver: receiver};
    trackEvent.streams = streams;
    window.setTimeout(function() {
      pc._dispatchEvent('track', trackEvent);
    });
}

var edgeVersion = (navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) ?
                  parseInt(navigator.userAgent.match(/edge\/(\d+).(\d+)$/i)[2]) :
                  null;
function edgeRTCPeerConnection(config) {
    var pc = this;

    var _eventTarget = document.createDocumentFragment();
    ['addEventListener', 'removeEventListener', 'dispatchEvent']
        .forEach(function(method) {
          pc[method] = _eventTarget[method].bind(_eventTarget);
        });

    this.canTrickleIceCandidates = null;

    this.needNegotiation = false;

    this.localStreams = [];
    this.remoteStreams = [];

    this.localDescription = null;
    this.remoteDescription = null;

    this.signalingState = 'stable';
    this.iceConnectionState = 'new';
    this.connectionState = 'new';
    this.iceGatheringState = 'new';

    config = JSON.parse(JSON.stringify(config || {}));

    this.usingBundle = config.bundlePolicy === 'max-bundle';
    if (config.rtcpMuxPolicy === 'negotiate') {
      throw(makeError('NotSupportedError',
          'rtcpMuxPolicy \'negotiate\' is not supported'));
    } else if (!config.rtcpMuxPolicy) {
      config.rtcpMuxPolicy = 'require';
    }

    switch (config.iceTransportPolicy) {
      case 'all':
      case 'relay':
        break;
      default:
        config.iceTransportPolicy = 'all';
        break;
    }

    switch (config.bundlePolicy) {
      case 'balanced':
      case 'max-compat':
      case 'max-bundle':
        break;
      default:
        config.bundlePolicy = 'balanced';
        break;
    }

    config.iceServers = filterIceServers(config.iceServers || [], edgeVersion);

    this._iceGatherers = [];
    if (config.iceCandidatePoolSize) {
      for (var i = config.iceCandidatePoolSize; i > 0; i--) {
        this._iceGatherers.push(new window.RTCIceGatherer({
          iceServers: config.iceServers,
          gatherPolicy: config.iceTransportPolicy
        }));
      }
    } else {
      config.iceCandidatePoolSize = 0;
    }

    this._config = config;

    // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
    // everything that is needed to describe a SDP m-line.
    this.transceivers = [];

    this._sdpSessionId = SDPUtils.generateSessionId();
    this._sdpSessionVersion = 0;

    this._dtlsRole = undefined; // role for a=setup to use in answers.

    this._isClosed = false;
}

// set up event handlers on prototype
edgeRTCPeerConnection.prototype.onicecandidate = null;
edgeRTCPeerConnection.prototype.onaddstream = null;
edgeRTCPeerConnection.prototype.ontrack = null;
edgeRTCPeerConnection.prototype.onremovestream = null;
edgeRTCPeerConnection.prototype.onsignalingstatechange = null;
edgeRTCPeerConnection.prototype.oniceconnectionstatechange = null;
edgeRTCPeerConnection.prototype.onconnectionstatechange = null;
edgeRTCPeerConnection.prototype.onicegatheringstatechange = null;
edgeRTCPeerConnection.prototype.onnegotiationneeded = null;
edgeRTCPeerConnection.prototype.ondatachannel = null;

edgeRTCPeerConnection.prototype._dispatchEvent = function(name, event) {
    if (this._isClosed) {
      return;
    }
    this.dispatchEvent(event);
    if (typeof this['on' + name] === 'function') {
      this['on' + name](event);
    }
};

edgeRTCPeerConnection.prototype._emitGatheringStateChange = function() {
    var event = new Event('icegatheringstatechange');
    this._dispatchEvent('icegatheringstatechange', event);
};

edgeRTCPeerConnection.prototype.getConfiguration = function() {
    return this._config;
};

edgeRTCPeerConnection.prototype.getLocalStreams = function() {
    return this.localStreams;
};

edgeRTCPeerConnection.prototype.getRemoteStreams = function() {
    return this.remoteStreams;
};

// internal helper to create a transceiver object.
// (which is not yet the same as the WebRTC 1.0 transceiver)
edgeRTCPeerConnection.prototype._createTransceiver = function(kind, doNotAdd) {
    var hasBundleTransport = this.transceivers.length > 0;
    var transceiver = {
      track: null,
      iceGatherer: null,
      iceTransport: null,
      dtlsTransport: null,
      localCapabilities: null,
      remoteCapabilities: null,
      rtpSender: null,
      rtpReceiver: null,
      kind: kind,
      mid: null,
      sendEncodingParameters: null,
      recvEncodingParameters: null,
      stream: null,
      associatedRemoteMediaStreams: [],
      wantReceive: true
    };
    if (this.usingBundle && hasBundleTransport) {
      transceiver.iceTransport = this.transceivers[0].iceTransport;
      transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
    } else {
      var transports = this._createIceAndDtlsTransports();
      transceiver.iceTransport = transports.iceTransport;
      transceiver.dtlsTransport = transports.dtlsTransport;
    }
    if (!doNotAdd) {
      this.transceivers.push(transceiver);
    }
    return transceiver;
};

edgeRTCPeerConnection.prototype.addTrack = function(track, stream) {
    if (this._isClosed) {
      throw makeError('InvalidStateError',
          'Attempted to call addTrack on a closed peerconnection.');
    }

    var alreadyExists = this.transceivers.find(function(s) {
      return s.track === track;
    });

    if (alreadyExists) {
      throw makeError('InvalidAccessError', 'Track already exists.');
    }

    var transceiver;
    for (var i = 0; i < this.transceivers.length; i++) {
      if (!this.transceivers[i].track &&
          this.transceivers[i].kind === track.kind) {
        transceiver = this.transceivers[i];
      }
    }
    if (!transceiver) {
      transceiver = this._createTransceiver(track.kind);
    }

    this._maybeFireNegotiationNeeded();

    if (this.localStreams.indexOf(stream) === -1) {
      this.localStreams.push(stream);
    }

    transceiver.track = track;
    transceiver.stream = stream;
    transceiver.rtpSender = new window.RTCRtpSender(track,
        transceiver.dtlsTransport);
    return transceiver.rtpSender;
};

edgeRTCPeerConnection.prototype.addStream = function(stream) {
    var pc = this;
    if (edgeVersion >= 15025) {
      stream.getTracks().forEach(function(track) {
        pc.addTrack(track, stream);
      });
    } else {
      // Clone is necessary for local demos mostly, attaching directly
      // to two different senders does not work (build 10547).
      // Fixed in 15025 (or earlier)
      var clonedStream = stream.clone();
      stream.getTracks().forEach(function(track, idx) {
        var clonedTrack = clonedStream.getTracks()[idx];
        track.addEventListener('enabled', function(event) {
          clonedTrack.enabled = event.enabled;
        });
      });
      clonedStream.getTracks().forEach(function(track) {
        pc.addTrack(track, clonedStream);
      });
    }
};

edgeRTCPeerConnection.prototype.removeTrack = function(sender) {
    if (this._isClosed) {
      throw makeError('InvalidStateError',
          'Attempted to call removeTrack on a closed peerconnection.');
    }

    if (!(sender instanceof window.RTCRtpSender)) {
      throw new TypeError('Argument 1 of edgeRTCPeerConnection.removeTrack ' +
          'does not implement interface RTCRtpSender.');
    }

    var transceiver = this.transceivers.find(function(t) {
      return t.rtpSender === sender;
    });

    if (!transceiver) {
      throw makeError('InvalidAccessError',
          'Sender was not created by this connection.');
    }
    var stream = transceiver.stream;

    transceiver.rtpSender.stop();
    transceiver.rtpSender = null;
    transceiver.track = null;
    transceiver.stream = null;

    // remove the stream from the set of local streams
    var localStreams = this.transceivers.map(function(t) {
      return t.stream;
    });
    if (localStreams.indexOf(stream) === -1 &&
        this.localStreams.indexOf(stream) > -1) {
      this.localStreams.splice(this.localStreams.indexOf(stream), 1);
    }

    this._maybeFireNegotiationNeeded();
};

edgeRTCPeerConnection.prototype.removeStream = function(stream) {
    var pc = this;
    stream.getTracks().forEach(function(track) {
      var sender = pc.getSenders().find(function(s) {
        return s.track === track;
      });
      if (sender) {
        pc.removeTrack(sender);
      }
    });
};

edgeRTCPeerConnection.prototype.getSenders = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpSender;
    })
    .map(function(transceiver) {
      return transceiver.rtpSender;
    });
};

edgeRTCPeerConnection.prototype.getReceivers = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpReceiver;
    })
    .map(function(transceiver) {
      return transceiver.rtpReceiver;
    });
};


edgeRTCPeerConnection.prototype._createIceGatherer = function(sdpMLineIndex,
      usingBundle) {
    var pc = this;
    if (usingBundle && sdpMLineIndex > 0) {
      return this.transceivers[0].iceGatherer;
    } else if (this._iceGatherers.length) {
      return this._iceGatherers.shift();
    }
    var iceGatherer = new window.RTCIceGatherer({
      iceServers: this._config.iceServers,
      gatherPolicy: this._config.iceTransportPolicy
    });
    Object.defineProperty(iceGatherer, 'state',
        {value: 'new', writable: true}
    );

    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
    this.transceivers[sdpMLineIndex].bufferCandidates = function(event) {
      var end = !event.candidate || Object.keys(event.candidate).length === 0;
      // polyfill since RTCIceGatherer.state is not implemented in
      // Edge 10547 yet.
      iceGatherer.state = end ? 'completed' : 'gathering';
      if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
        pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
      }
    };
    iceGatherer.addEventListener('localcandidate',
      this.transceivers[sdpMLineIndex].bufferCandidates);
    return iceGatherer;
};

// start gathering from an RTCIceGatherer.
edgeRTCPeerConnection.prototype._gather = function(mid, sdpMLineIndex) {
    var pc = this;
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
    if (iceGatherer.onlocalcandidate) {
      return;
    }
    var bufferedCandidateEvents =
      this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
    iceGatherer.removeEventListener('localcandidate',
      this.transceivers[sdpMLineIndex].bufferCandidates);
    iceGatherer.onlocalcandidate = function(evt) {
      if (pc.usingBundle && sdpMLineIndex > 0) {
        // if we know that we use bundle we can drop candidates with
        // ѕdpMLineIndex > 0. If we don't do this then our state gets
        // confused since we dispose the extra ice gatherer.
        return;
      }
      var event = new Event('icecandidate');
      event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

      var cand = evt.candidate;
      // Edge emits an empty object for RTCIceCandidateComplete‥
      var end = !cand || Object.keys(cand).length === 0;
      if (end) {
        // polyfill since RTCIceGatherer.state is not implemented in
        // Edge 10547 yet.
        if (iceGatherer.state === 'new' || iceGatherer.state === 'gathering') {
          iceGatherer.state = 'completed';
        }
      } else {
        if (iceGatherer.state === 'new') {
          iceGatherer.state = 'gathering';
        }
        // RTCIceCandidate doesn't have a component, needs to be added
        cand.component = 1;
        var serializedCandidate = SDPUtils.writeCandidate(cand);
        event.candidate = Object.assign(event.candidate,
            SDPUtils.parseCandidate(serializedCandidate));
        event.candidate.candidate = serializedCandidate;
      }

      // update local description.
      var sections = SDPUtils.getMediaSections(pc.localDescription.sdp);
      if (!end) {
        sections[event.candidate.sdpMLineIndex] +=
            'a=' + event.candidate.candidate + '\r\n';
      } else {
        sections[event.candidate.sdpMLineIndex] +=
            'a=end-of-candidates\r\n';
      }
      pc.localDescription.sdp =
          SDPUtils.getDescription(pc.localDescription.sdp) +
          sections.join('');
      var complete = pc.transceivers.every(function(transceiver) {
        return transceiver.iceGatherer &&
            transceiver.iceGatherer.state === 'completed';
      });

      if (pc.iceGatheringState !== 'gathering') {
        pc.iceGatheringState = 'gathering';
        pc._emitGatheringStateChange();
      }

      // Emit candidate. Also emit null candidate when all gatherers are
      // complete.
      if (!end) {
        pc._dispatchEvent('icecandidate', event);
      }
      if (complete) {
        pc._dispatchEvent('icecandidate', new Event('icecandidate'));
        pc.iceGatheringState = 'complete';
        pc._emitGatheringStateChange();
      }
    };

    // emit already gathered candidates.
    window.setTimeout(function() {
      bufferedCandidateEvents.forEach(function(e) {
        iceGatherer.onlocalcandidate(e);
      });
    }, 0);
};

// Create ICE transport and DTLS transport.
edgeRTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
    var pc = this;
    var iceTransport = new window.RTCIceTransport(null);
    iceTransport.onicestatechange = function() {
      pc._updateIceConnectionState();
      pc._updateConnectionState();
    };

    var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
    dtlsTransport.ondtlsstatechange = function() {
      pc._updateConnectionState();
    };
    dtlsTransport.onerror = function() {
      // onerror does not set state to failed by itself.
      Object.defineProperty(dtlsTransport, 'state',
          {value: 'failed', writable: true});
      pc._updateConnectionState();
    };

    return {
      iceTransport: iceTransport,
      dtlsTransport: dtlsTransport
    };
};

// Destroy ICE gatherer, ICE transport and DTLS transport.
// Without triggering the callbacks.
edgeRTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
      sdpMLineIndex) {
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
    if (iceGatherer) {
      delete iceGatherer.onlocalcandidate;
      delete this.transceivers[sdpMLineIndex].iceGatherer;
    }
    var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
    if (iceTransport) {
      delete iceTransport.onicestatechange;
      delete this.transceivers[sdpMLineIndex].iceTransport;
    }
    var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
    if (dtlsTransport) {
      delete dtlsTransport.ondtlsstatechange;
      delete dtlsTransport.onerror;
      delete this.transceivers[sdpMLineIndex].dtlsTransport;
    }
};

// Start the RTP Sender and Receiver for a transceiver.
edgeRTCPeerConnection.prototype._transceive = function(transceiver,
      send, recv) {
    var params = getCommonCapabilities(transceiver.localCapabilities,
        transceiver.remoteCapabilities);
    if (send && transceiver.rtpSender) {
      params.encodings = transceiver.sendEncodingParameters;
      params.rtcp = {
        cname: SDPUtils.localCName,
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.recvEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
      }
      transceiver.rtpSender.send(params);
    }
    if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
      // remove RTX field in Edge 14942
      if (transceiver.kind === 'video'
          && transceiver.recvEncodingParameters
          && edgeVersion < 15019) {
        transceiver.recvEncodingParameters.forEach(function(p) {
          delete p.rtx;
        });
      }
      if (transceiver.recvEncodingParameters.length) {
        params.encodings = transceiver.recvEncodingParameters;
      } else {
        params.encodings = [{}];
      }
      params.rtcp = {
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.rtcpParameters.cname) {
        params.rtcp.cname = transceiver.rtcpParameters.cname;
      }
      if (transceiver.sendEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
      }
      transceiver.rtpReceiver.receive(params);
    }
};

edgeRTCPeerConnection.prototype.setLocalDescription = function(description) {
    var pc = this;

    // Note: pranswer is not supported.
    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError',
          'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setLocalDescription',
        description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not set local ' + description.type +
          ' in state ' + pc.signalingState));
    }

    var sections;
    var sessionpart;
    if (description.type === 'offer') {
      // VERY limited support for SDP munging. Limited to:
      // * changing the order of codecs
      sections = SDPUtils.splitSections(description.sdp);
      sessionpart = sections.shift();
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var caps = SDPUtils.parseRtpParameters(mediaSection);
        pc.transceivers[sdpMLineIndex].localCapabilities = caps;
      });

      pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
        pc._gather(transceiver.mid, sdpMLineIndex);
      });
    } else if (description.type === 'answer') {
      sections = SDPUtils.splitSections(pc.remoteDescription.sdp);
      sessionpart = sections.shift();
      var isIceLite = SDPUtils.matchPrefix(sessionpart,
          'a=ice-lite').length > 0;
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var transceiver = pc.transceivers[sdpMLineIndex];
        var iceGatherer = transceiver.iceGatherer;
        var iceTransport = transceiver.iceTransport;
        var dtlsTransport = transceiver.dtlsTransport;
        var localCapabilities = transceiver.localCapabilities;
        var remoteCapabilities = transceiver.remoteCapabilities;

        // treat bundle-only as not-rejected.
        var rejected = SDPUtils.isRejected(mediaSection) &&
            SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;

        if (!rejected && !transceiver.rejected) {
          var remoteIceParameters = SDPUtils.getIceParameters(
              mediaSection, sessionpart);
          var remoteDtlsParameters = SDPUtils.getDtlsParameters(
              mediaSection, sessionpart);
          if (isIceLite) {
            remoteDtlsParameters.role = 'server';
          }

          if (!pc.usingBundle || sdpMLineIndex === 0) {
            pc._gather(transceiver.mid, sdpMLineIndex);
            if (iceTransport.state === 'new') {
              iceTransport.start(iceGatherer, remoteIceParameters,
                  isIceLite ? 'controlling' : 'controlled');
            }
            if (dtlsTransport.state === 'new') {
              dtlsTransport.start(remoteDtlsParameters);
            }
          }

          // Calculate intersection of capabilities.
          var params = getCommonCapabilities(localCapabilities,
              remoteCapabilities);

          // Start the RTCRtpSender. The RTCRtpReceiver for this
          // transceiver has already been started in setRemoteDescription.
          pc._transceive(transceiver,
              params.codecs.length > 0,
              false);
        }
      });
    }

    pc.localDescription = {
      type: description.type,
      sdp: description.sdp
    };
    if (description.type === 'offer') {
      pc._updateSignalingState('have-local-offer');
    } else {
      pc._updateSignalingState('stable');
    }

    return Promise.resolve();
};

edgeRTCPeerConnection.prototype.setRemoteDescription = function(description) {
    var pc = this;

    // Note: pranswer is not supported.
    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError',
          'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setRemoteDescription',
        description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not set remote ' + description.type +
          ' in state ' + pc.signalingState));
    }

    var streams = {};
    pc.remoteStreams.forEach(function(stream) {
      streams[stream.id] = stream;
    });
    var receiverList = [];
    var sections = SDPUtils.splitSections(description.sdp);
    var sessionpart = sections.shift();
    var isIceLite = SDPUtils.matchPrefix(sessionpart,
        'a=ice-lite').length > 0;
    var usingBundle = SDPUtils.matchPrefix(sessionpart,
        'a=group:BUNDLE ').length > 0;
    pc.usingBundle = usingBundle;
    var iceOptions = SDPUtils.matchPrefix(sessionpart,
        'a=ice-options:')[0];
    if (iceOptions) {
      pc.canTrickleIceCandidates = iceOptions.substr(14).split(' ')
          .indexOf('trickle') >= 0;
    } else {
      pc.canTrickleIceCandidates = false;
    }

    sections.forEach(function(mediaSection, sdpMLineIndex) {
      var lines = SDPUtils.splitLines(mediaSection);
      var kind = SDPUtils.getKind(mediaSection);
      // treat bundle-only as not-rejected.
      var rejected = SDPUtils.isRejected(mediaSection) &&
          SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
      var protocol = lines[0].substr(2).split(' ')[2];

      var direction = SDPUtils.getDirection(mediaSection, sessionpart);
      var remoteMsid = SDPUtils.parseMsid(mediaSection);

      var mid = SDPUtils.getMid(mediaSection) || SDPUtils.generateIdentifier();

      // Reject datachannels which are not implemented yet.
      if ((kind === 'application' && protocol === 'DTLS/SCTP') || rejected) {
        // TODO: this is dangerous in the case where a non-rejected m-line
        //     becomes rejected.
        pc.transceivers[sdpMLineIndex] = {
          mid: mid,
          kind: kind,
          rejected: true
        };
        return;
      }

      if (!rejected && pc.transceivers[sdpMLineIndex] &&
          pc.transceivers[sdpMLineIndex].rejected) {
        // recycle a rejected transceiver.
        pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
      }

      var transceiver;
      var iceGatherer;
      var iceTransport;
      var dtlsTransport;
      var rtpReceiver;
      var sendEncodingParameters;
      var recvEncodingParameters;
      var localCapabilities;

      var track;
      // FIXME: ensure the mediaSection has rtcp-mux set.
      var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
      var remoteIceParameters;
      var remoteDtlsParameters;
      if (!rejected) {
        remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters.role = 'client';
      }
      recvEncodingParameters =
          SDPUtils.parseRtpEncodingParameters(mediaSection);

      var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);

      var isComplete = SDPUtils.matchPrefix(mediaSection,
          'a=end-of-candidates', sessionpart).length > 0;
      var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
          .map(function(cand) {
            return SDPUtils.parseCandidate(cand);
          })
          .filter(function(cand) {
            return cand.component === 1;
          });

      // Check if we can use BUNDLE and dispose transports.
      if ((description.type === 'offer' || description.type === 'answer') &&
          !rejected && usingBundle && sdpMLineIndex > 0 &&
          pc.transceivers[sdpMLineIndex]) {
        pc._disposeIceAndDtlsTransports(sdpMLineIndex);
        pc.transceivers[sdpMLineIndex].iceGatherer =
            pc.transceivers[0].iceGatherer;
        pc.transceivers[sdpMLineIndex].iceTransport =
            pc.transceivers[0].iceTransport;
        pc.transceivers[sdpMLineIndex].dtlsTransport =
            pc.transceivers[0].dtlsTransport;
        if (pc.transceivers[sdpMLineIndex].rtpSender) {
          pc.transceivers[sdpMLineIndex].rtpSender.setTransport(
              pc.transceivers[0].dtlsTransport);
        }
        if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
          pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
              pc.transceivers[0].dtlsTransport);
        }
      }
      if (description.type === 'offer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex] ||
            pc._createTransceiver(kind);
        transceiver.mid = mid;

        if (!transceiver.iceGatherer) {
          transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
              usingBundle);
        }

        if (cands.length && transceiver.iceTransport.state === 'new') {
          if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
            transceiver.iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function(candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);

        // filter RTX until additional stuff needed for RTX is implemented
        // in adapter.js
        if (edgeVersion < 15019) {
          localCapabilities.codecs = localCapabilities.codecs.filter(
              function(codec) {
                return codec.name !== 'rtx';
              });
        }

        sendEncodingParameters = transceiver.sendEncodingParameters || [{
          ssrc: (2 * sdpMLineIndex + 2) * 1001
        }];

        // TODO: rewrite to use https://w3c.github.io/webrtc-pc/#set-associated-remote-streams
        var isNewTrack = false;
        if (direction === 'sendrecv' || direction === 'sendonly') {
          isNewTrack = !transceiver.rtpReceiver;
          rtpReceiver = transceiver.rtpReceiver ||
              new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);

          if (isNewTrack) {
            var stream;
            track = rtpReceiver.track;
            // FIXME: does not work with Plan B.
            if (remoteMsid && remoteMsid.stream === '-') {
              // no-op. a stream id of '-' means: no associated stream.
            } else if (remoteMsid) {
              if (!streams[remoteMsid.stream]) {
                streams[remoteMsid.stream] = new window.MediaStream();
                Object.defineProperty(streams[remoteMsid.stream], 'id', {
                  get: function() {
                    return remoteMsid.stream;
                  }
                });
              }
              Object.defineProperty(track, 'id', {
                get: function() {
                  return remoteMsid.track;
                }
              });
              stream = streams[remoteMsid.stream];
            } else {
              if (!streams.default) {
                streams.default = new window.MediaStream();
              }
              stream = streams.default;
            }
            if (stream) {
              addTrackToStreamAndFireEvent(track, stream);
              transceiver.associatedRemoteMediaStreams.push(stream);
            }
            receiverList.push([track, rtpReceiver, stream]);
          }
        } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
          transceiver.associatedRemoteMediaStreams.forEach(function(s) {
            var nativeTrack = s.getTracks().find(function(t) {
              return t.id === transceiver.rtpReceiver.track.id;
            });
            if (nativeTrack) {
              removeTrackFromStreamAndFireEvent(nativeTrack, s);
            }
          });
          transceiver.associatedRemoteMediaStreams = [];
        }

        transceiver.localCapabilities = localCapabilities;
        transceiver.remoteCapabilities = remoteCapabilities;
        transceiver.rtpReceiver = rtpReceiver;
        transceiver.rtcpParameters = rtcpParameters;
        transceiver.sendEncodingParameters = sendEncodingParameters;
        transceiver.recvEncodingParameters = recvEncodingParameters;

        // Start the RTCRtpReceiver now. The RTPSender is started in
        // setLocalDescription.
        pc._transceive(pc.transceivers[sdpMLineIndex],
            false,
            isNewTrack);
      } else if (description.type === 'answer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex];
        iceGatherer = transceiver.iceGatherer;
        iceTransport = transceiver.iceTransport;
        dtlsTransport = transceiver.dtlsTransport;
        rtpReceiver = transceiver.rtpReceiver;
        sendEncodingParameters = transceiver.sendEncodingParameters;
        localCapabilities = transceiver.localCapabilities;

        pc.transceivers[sdpMLineIndex].recvEncodingParameters =
            recvEncodingParameters;
        pc.transceivers[sdpMLineIndex].remoteCapabilities =
            remoteCapabilities;
        pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;

        if (cands.length && iceTransport.state === 'new') {
          if ((isIceLite || isComplete) &&
              (!usingBundle || sdpMLineIndex === 0)) {
            iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function(candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        if (!usingBundle || sdpMLineIndex === 0) {
          if (iceTransport.state === 'new') {
            iceTransport.start(iceGatherer, remoteIceParameters,
                'controlling');
          }
          if (dtlsTransport.state === 'new') {
            dtlsTransport.start(remoteDtlsParameters);
          }
        }

        pc._transceive(transceiver,
            direction === 'sendrecv' || direction === 'recvonly',
            direction === 'sendrecv' || direction === 'sendonly');

        // TODO: rewrite to use https://w3c.github.io/webrtc-pc/#set-associated-remote-streams
        if (rtpReceiver &&
            (direction === 'sendrecv' || direction === 'sendonly')) {
          track = rtpReceiver.track;
          if (remoteMsid) {
            if (!streams[remoteMsid.stream]) {
              streams[remoteMsid.stream] = new window.MediaStream();
            }
            addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
            receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
          } else {
            if (!streams.default) {
              streams.default = new window.MediaStream();
            }
            addTrackToStreamAndFireEvent(track, streams.default);
            receiverList.push([track, rtpReceiver, streams.default]);
          }
        } else {
          // FIXME: actually the receiver should be created later.
          delete transceiver.rtpReceiver;
        }
      }
    });

    if (pc._dtlsRole === undefined) {
      pc._dtlsRole = description.type === 'offer' ? 'active' : 'passive';
    }

    pc.remoteDescription = {
      type: description.type,
      sdp: description.sdp
    };
    if (description.type === 'offer') {
      pc._updateSignalingState('have-remote-offer');
    } else {
      pc._updateSignalingState('stable');
    }
    Object.keys(streams).forEach(function(sid) {
      var stream = streams[sid];
      if (stream.getTracks().length) {
        if (pc.remoteStreams.indexOf(stream) === -1) {
          pc.remoteStreams.push(stream);
          var event = new Event('addstream');
          event.stream = stream;
          window.setTimeout(function() {
            pc._dispatchEvent('addstream', event);
          });
        }

        receiverList.forEach(function(item) {
          var track = item[0];
          var receiver = item[1];
          if (stream.id !== item[2].id) {
            return;
          }
          fireAddTrack(pc, track, receiver, [stream]);
        });
      }
    });
    receiverList.forEach(function(item) {
      if (item[2]) {
        return;
      }
      fireAddTrack(pc, item[0], item[1], []);
    });

    // check whether addIceCandidate({}) was called within four seconds after
    // setRemoteDescription.
    window.setTimeout(function() {
      if (!(pc && pc.transceivers)) {
        return;
      }
      pc.transceivers.forEach(function(transceiver) {
        if (transceiver.iceTransport &&
            transceiver.iceTransport.state === 'new' &&
            transceiver.iceTransport.getRemoteCandidates().length > 0) {
          console.warn('Timeout for addRemoteCandidate. Consider sending ' +
              'an end-of-candidates notification');
          transceiver.iceTransport.addRemoteCandidate({});
        }
      });
    }, 4000);

    return Promise.resolve();
};

edgeRTCPeerConnection.prototype.close = function() {
    this.transceivers.forEach(function(transceiver) {
      /* not yet
      if (transceiver.iceGatherer) {
        transceiver.iceGatherer.close();
      }
      */
      if (transceiver.iceTransport) {
        transceiver.iceTransport.stop();
      }
      if (transceiver.dtlsTransport) {
        transceiver.dtlsTransport.stop();
      }
      if (transceiver.rtpSender) {
        transceiver.rtpSender.stop();
      }
      if (transceiver.rtpReceiver) {
        transceiver.rtpReceiver.stop();
      }
    });
    // FIXME: clean up tracks, local streams, remote streams, etc
    this._isClosed = true;
    this._updateSignalingState('closed');
};

// Update the signaling state.
edgeRTCPeerConnection.prototype._updateSignalingState = function(newState) {
    this.signalingState = newState;
    var event = new Event('signalingstatechange');
    this._dispatchEvent('signalingstatechange', event);
};

// Determine whether to fire the negotiationneeded event.
edgeRTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
    var pc = this;
    if (this.signalingState !== 'stable' || this.needNegotiation === true) {
      return;
    }
    this.needNegotiation = true;
    window.setTimeout(function() {
      if (pc.needNegotiation) {
        pc.needNegotiation = false;
        var event = new Event('negotiationneeded');
        pc._dispatchEvent('negotiationneeded', event);
      }
    }, 0);
};

// Update the ice connection state.
edgeRTCPeerConnection.prototype._updateIceConnectionState = function() {
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      checking: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function(transceiver) {
      states[transceiver.iceTransport.state]++;
    });

    newState = 'new';
    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.checking > 0) {
      newState = 'checking';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states.new > 0) {
      newState = 'new';
    } else if (states.connected > 0) {
      newState = 'connected';
    } else if (states.completed > 0) {
      newState = 'completed';
    }

    if (newState !== this.iceConnectionState) {
      this.iceConnectionState = newState;
      var event = new Event('iceconnectionstatechange');
      this._dispatchEvent('iceconnectionstatechange', event);
    }
};

// Update the connection state.
edgeRTCPeerConnection.prototype._updateConnectionState = function() {
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      connecting: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function(transceiver) {
      states[transceiver.iceTransport.state]++;
      states[transceiver.dtlsTransport.state]++;
    });
    // ICETransport.completed and connected are the same for this purpose.
    states.connected += states.completed;

    newState = 'new';
    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.connecting > 0) {
      newState = 'connecting';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states.new > 0) {
      newState = 'new';
    } else if (states.connected > 0) {
      newState = 'connected';
    }

    if (newState !== this.connectionState) {
      this.connectionState = newState;
      var event = new Event('connectionstatechange');
      this._dispatchEvent('connectionstatechange', event);
    }
};

edgeRTCPeerConnection.prototype.createOffer = function() {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createOffer after close'));
    }

    var numAudioTracks = pc.transceivers.filter(function(t) {
      return t.kind === 'audio';
    }).length;
    var numVideoTracks = pc.transceivers.filter(function(t) {
      return t.kind === 'video';
    }).length;

    // Determine number of audio and video tracks we need to send/recv.
    var offerOptions = arguments[0];
    if (offerOptions) {
      // Reject Chrome legacy constraints.
      if (offerOptions.mandatory || offerOptions.optional) {
        throw new TypeError(
            'Legacy mandatory/optional constraints not supported.');
      }
      if (offerOptions.offerToReceiveAudio !== undefined) {
        if (offerOptions.offerToReceiveAudio === true) {
          numAudioTracks = 1;
        } else if (offerOptions.offerToReceiveAudio === false) {
          numAudioTracks = 0;
        } else {
          numAudioTracks = offerOptions.offerToReceiveAudio;
        }
      }
      if (offerOptions.offerToReceiveVideo !== undefined) {
        if (offerOptions.offerToReceiveVideo === true) {
          numVideoTracks = 1;
        } else if (offerOptions.offerToReceiveVideo === false) {
          numVideoTracks = 0;
        } else {
          numVideoTracks = offerOptions.offerToReceiveVideo;
        }
      }
    }

    pc.transceivers.forEach(function(transceiver) {
      if (transceiver.kind === 'audio') {
        numAudioTracks--;
        if (numAudioTracks < 0) {
          transceiver.wantReceive = false;
        }
      } else if (transceiver.kind === 'video') {
        numVideoTracks--;
        if (numVideoTracks < 0) {
          transceiver.wantReceive = false;
        }
      }
    });

    // Create M-lines for recvonly streams.
    while (numAudioTracks > 0 || numVideoTracks > 0) {
      if (numAudioTracks > 0) {
        pc._createTransceiver('audio');
        numAudioTracks--;
      }
      if (numVideoTracks > 0) {
        pc._createTransceiver('video');
        numVideoTracks--;
      }
    }

    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId,
        pc._sdpSessionVersion++);
    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      // For each track, create an ice gatherer, ice transport,
      // dtls transport, potentially rtpsender and rtpreceiver.
      var track = transceiver.track;
      var kind = transceiver.kind;
      var mid = transceiver.mid || SDPUtils.generateIdentifier();
      transceiver.mid = mid;

      if (!transceiver.iceGatherer) {
        transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
            pc.usingBundle);
      }

      var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
      // filter RTX until additional stuff needed for RTX is implemented
      // in adapter.js
      if (edgeVersion < 15019) {
        localCapabilities.codecs = localCapabilities.codecs.filter(
            function(codec) {
              return codec.name !== 'rtx';
            });
      }
      localCapabilities.codecs.forEach(function(codec) {
        // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
        // by adding level-asymmetry-allowed=1
        if (codec.name === 'H264' &&
            codec.parameters['level-asymmetry-allowed'] === undefined) {
          codec.parameters['level-asymmetry-allowed'] = '1';
        }

        // for subsequent offers, we might have to re-use the payload
        // type of the last offer.
        if (transceiver.remoteCapabilities &&
            transceiver.remoteCapabilities.codecs) {
          transceiver.remoteCapabilities.codecs.forEach(function(remoteCodec) {
            if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() &&
                codec.clockRate === remoteCodec.clockRate) {
              codec.preferredPayloadType = remoteCodec.payloadType;
            }
          });
        }
      });
      localCapabilities.headerExtensions.forEach(function(hdrExt) {
        var remoteExtensions = transceiver.remoteCapabilities &&
            transceiver.remoteCapabilities.headerExtensions || [];
        remoteExtensions.forEach(function(rHdrExt) {
          if (hdrExt.uri === rHdrExt.uri) {
            hdrExt.id = rHdrExt.id;
          }
        });
      });

      // generate an ssrc now, to be used later in rtpSender.send
      var sendEncodingParameters = transceiver.sendEncodingParameters || [{
        ssrc: (2 * sdpMLineIndex + 1) * 1001
      }];
      if (track) {
        // add RTX
        if (edgeVersion >= 15019 && kind === 'video' &&
            !sendEncodingParameters[0].rtx) {
          sendEncodingParameters[0].rtx = {
            ssrc: sendEncodingParameters[0].ssrc + 1
          };
        }
      }

      if (transceiver.wantReceive) {
        transceiver.rtpReceiver = new window.RTCRtpReceiver(
            transceiver.dtlsTransport, kind);
      }

      transceiver.localCapabilities = localCapabilities;
      transceiver.sendEncodingParameters = sendEncodingParameters;
    });

    // always offer BUNDLE and dispose on return if not supported.
    if (pc._config.bundlePolicy !== 'max-compat') {
      sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    sdp += 'a=ice-options:trickle\r\n';

    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      sdp += writeMediaSection(transceiver, transceiver.localCapabilities,
          'offer', transceiver.stream, pc._dtlsRole);
      sdp += 'a=rtcp-rsize\r\n';

      if (transceiver.iceGatherer && pc.iceGatheringState !== 'new' &&
          (sdpMLineIndex === 0 || !pc.usingBundle)) {
        transceiver.iceGatherer.getLocalCandidates().forEach(function(cand) {
          cand.component = 1;
          sdp += 'a=' + SDPUtils.writeCandidate(cand) + '\r\n';
        });

        if (transceiver.iceGatherer.state === 'completed') {
          sdp += 'a=end-of-candidates\r\n';
        }
      }
    });

    var desc = new window.RTCSessionDescription({
      type: 'offer',
      sdp: sdp
    });
    return Promise.resolve(desc);
};

edgeRTCPeerConnection.prototype.createAnswer = function() {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createAnswer after close'));
    }

    if (!(pc.signalingState === 'have-remote-offer' ||
        pc.signalingState === 'have-local-pranswer')) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createAnswer in signalingState ' + pc.signalingState));
    }

    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId,
        pc._sdpSessionVersion++);
    if (pc.usingBundle) {
      sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    var mediaSectionsInOffer = SDPUtils.getMediaSections(
        pc.remoteDescription.sdp).length;
    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
        return;
      }
      if (transceiver.rejected) {
        if (transceiver.kind === 'application') {
          sdp += 'm=application 0 DTLS/SCTP 5000\r\n';
        } else if (transceiver.kind === 'audio') {
          sdp += 'm=audio 0 UDP/TLS/RTP/SAVPF 0\r\n' +
              'a=rtpmap:0 PCMU/8000\r\n';
        } else if (transceiver.kind === 'video') {
          sdp += 'm=video 0 UDP/TLS/RTP/SAVPF 120\r\n' +
              'a=rtpmap:120 VP8/90000\r\n';
        }
        sdp += 'c=IN IP4 0.0.0.0\r\n' +
            'a=inactive\r\n' +
            'a=mid:' + transceiver.mid + '\r\n';
        return;
      }

      // FIXME: look at direction.
      if (transceiver.stream) {
        var localTrack;
        if (transceiver.kind === 'audio') {
          localTrack = transceiver.stream.getAudioTracks()[0];
        } else if (transceiver.kind === 'video') {
          localTrack = transceiver.stream.getVideoTracks()[0];
        }
        if (localTrack) {
          // add RTX
          if (edgeVersion >= 15019 && transceiver.kind === 'video' &&
              !transceiver.sendEncodingParameters[0].rtx) {
            transceiver.sendEncodingParameters[0].rtx = {
              ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
            };
          }
        }
      }

      // Calculate intersection of capabilities.
      var commonCapabilities = getCommonCapabilities(
          transceiver.localCapabilities,
          transceiver.remoteCapabilities);

      var hasRtx = commonCapabilities.codecs.filter(function(c) {
        return c.name.toLowerCase() === 'rtx';
      }).length;
      if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
        delete transceiver.sendEncodingParameters[0].rtx;
      }

      sdp += writeMediaSection(transceiver, commonCapabilities,
          'answer', transceiver.stream, pc._dtlsRole);
      if (transceiver.rtcpParameters &&
          transceiver.rtcpParameters.reducedSize) {
        sdp += 'a=rtcp-rsize\r\n';
      }
    });

    var desc = new window.RTCSessionDescription({
      type: 'answer',
      sdp: sdp
    });
    return Promise.resolve(desc);
};

edgeRTCPeerConnection.prototype.addIceCandidate = function(candidate) {
    var pc = this;
    var sections;
    if (candidate && !(candidate.sdpMLineIndex !== undefined ||
        candidate.sdpMid)) {
      return Promise.reject(new TypeError('sdpMLineIndex or sdpMid required'));
    }

    // TODO: needs to go into ops queue.
    return new Promise(function(resolve, reject) {
      if (!pc.remoteDescription) {
        return reject(makeError('InvalidStateError',
            'Can not add ICE candidate without a remote description'));
      } else if (!candidate || candidate.candidate === '') {
        for (var j = 0; j < pc.transceivers.length; j++) {
          if (pc.transceivers[j].rejected) {
            continue;
          }
          pc.transceivers[j].iceTransport.addRemoteCandidate({});
          sections = SDPUtils.getMediaSections(pc.remoteDescription.sdp);
          sections[j] += 'a=end-of-candidates\r\n';
          pc.remoteDescription.sdp =
              SDPUtils.getDescription(pc.remoteDescription.sdp) +
              sections.join('');
          if (pc.usingBundle) {
            break;
          }
        }
      } else {
        var sdpMLineIndex = candidate.sdpMLineIndex;
        if (candidate.sdpMid) {
          for (var i = 0; i < pc.transceivers.length; i++) {
            if (pc.transceivers[i].mid === candidate.sdpMid) {
              sdpMLineIndex = i;
              break;
            }
          }
        }
        var transceiver = pc.transceivers[sdpMLineIndex];
        if (transceiver) {
          if (transceiver.rejected) {
            return resolve();
          }
          var cand = Object.keys(candidate.candidate).length > 0 ?
              SDPUtils.parseCandidate(candidate.candidate) : {};
          // Ignore Chrome's invalid candidates since Edge does not like them.
          if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
            return resolve();
          }
          // Ignore RTCP candidates, we assume RTCP-MUX.
          if (cand.component && cand.component !== 1) {
            return resolve();
          }
          // when using bundle, avoid adding candidates to the wrong
          // ice transport. And avoid adding candidates added in the SDP.
          if (sdpMLineIndex === 0 || (sdpMLineIndex > 0 &&
              transceiver.iceTransport !== pc.transceivers[0].iceTransport)) {
            if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
              return reject(makeError('OperationError',
                  'Can not add ICE candidate'));
            }
          }

          // update the remoteDescription.
          var candidateString = candidate.candidate.trim();
          if (candidateString.indexOf('a=') === 0) {
            candidateString = candidateString.substr(2);
          }
          sections = SDPUtils.getMediaSections(pc.remoteDescription.sdp);
          sections[sdpMLineIndex] += 'a=' +
              (cand.type ? candidateString : 'end-of-candidates')
              + '\r\n';
          pc.remoteDescription.sdp = sections.join('');
        } else {
          return reject(makeError('OperationError',
              'Can not add ICE candidate'));
        }
      }
      resolve();
    });
};

edgeRTCPeerConnection.prototype.getStats = function() {
    var promises = [];
    this.transceivers.forEach(function(transceiver) {
      ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
          'dtlsTransport'].forEach(function(method) {
            if (transceiver[method]) {
              promises.push(transceiver[method].getStats());
            }
          });
    });
    var fixStatsType = function(stat) {
      return {
        inboundrtp: 'inbound-rtp',
        outboundrtp: 'outbound-rtp',
        candidatepair: 'candidate-pair',
        localcandidate: 'local-candidate',
        remotecandidate: 'remote-candidate'
      }[stat.type] || stat.type;
    };
    return new Promise(function(resolve) {
      // shim getStats with maplike support
      var results = new Map();
      Promise.all(promises).then(function(res) {
        res.forEach(function(result) {
          Object.keys(result).forEach(function(id) {
            result[id].type = fixStatsType(result[id]);
            results.set(id, result[id]);
          });
        });
        resolve(results);
      });
    });
};


//======================================================================
// the edgeRTCPeerConnection is implemented using Promise, the followings
// are to add an adaptation layer to guarantee that they can be invoked in
// either Promise or conventional (legacy) way

  var methods = ['createOffer', 'createAnswer'];
  methods.forEach(function(method) {
    var nativeMethod = edgeRTCPeerConnection.prototype[method];
    edgeRTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[0] === 'function' ||
          typeof args[1] === 'function') { // legacy
        return nativeMethod.apply(this, [arguments[2]])
        .then(function(description) {
          if (typeof args[0] === 'function') {
            args[0].apply(null, [description]);
          }
        }, function(error) {
          if (typeof args[1] === 'function') {
            args[1].apply(null, [error]);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  methods = ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'];
  methods.forEach(function(method) {
    var nativeMethod = edgeRTCPeerConnection.prototype[method];
    edgeRTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[1] === 'function' ||
          typeof args[2] === 'function') { // legacy
        return nativeMethod.apply(this, arguments)
        .then(function() {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        }, function(error) {
          if (typeof args[2] === 'function') {
            args[2].apply(null, [error]);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  // getStats is special. It doesn't have a spec legacy method yet we support
  // getStats(something, cb) without error callbacks.
  ['getStats'].forEach(function(method) {
    var nativeMethod = edgeRTCPeerConnection.prototype[method];
    edgeRTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[1] === 'function') {
        return nativeMethod.apply(this, arguments)
        .then(function() {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });
