//==================================================================
// logger.js

var __quiet = false;     // set to true to turn off all debug trace

Logger.level = 1;

function parseCallStack(emsg) {
  var caller_info = emsg.split(/[\r\n]+/)[2].split(/[\s]+/);
  var fcn_name = caller_info[2];
  var line_info = caller_info[3].split(/[\/\(\)]+/);
  return [fcn_name, line_info[line_info.length - 2]]
}

function Logger(module, level) {
  this.module = module;
  this.level = level;
  this.quiet = false;
}

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
    console.log(info[0] + " at " + info[1] + "\n  DEBUG: [" + this.module + "] " + msg);
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
    console.log(info[0] + " at " + info[1] + "\n  WARNING: [" + this.module + "] " + msg);
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
    console.log(info[0] + " at " + info[1] + "\n  ERROR: [" + this.module + "] " + msg);
};



//====================================================================
// webrtc.js

// webRTC utils
navigator.getUserMedia    = navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia;
var getUserMedia          = navigator.getUserMedia.bind(navigator);

var RTCPeerConnection     = window.RTCPeerConnection ||
                            window.webkitRTCPeerConnection ||
                            window.mozRTCPeerConnection;

var RTCSessionDescription = window.RTCSessionDescription ||
                            window.webkitRTCSessionDescription || 
                            window.mozRTCSessionDescription;

function attachMediaStreamToDOM(dom, stream) {
  if ('srcObject' in dom)
    dom.srcObject = stream;
  else 
    dom.src = window.URL.createObjectURL(stream);

  dom.play();
  // dom.volume = 0;
}



// class definition
var webrtc_logger = new Logger("WebRTC_V2");

function WebRTC() {
  this.local_media           = {dom: null, stream: null, sdp: null, candidates: []};
  this.remote_media_pool     = [];

  this.peer_conn       = null;

  this.enable_video    = true;           // default with video

  this.dtmf_sender     = null;
  this.stun_servers    = []; //[{url: 'stun:stun.ipns.com'},
                         // {url: 'stun:stun.rnktel.com'}];
}

WebRTC.prototype.setStunServers = function(servers) {
  if (typeof servers.push != "undefined") {
    for (var i=0; i<servers.length; i++) {
      if (typeof servers[i].url == "undefined") {
        webrtc_logger.error("setStunServers() fails, STUN server not set. Missing URL");
        return;
      }
    }
    this.stun_servers = servers;
  }
  else
    webrtc_logger.error("ERROR: setStunServers() fails STUN server not set. Must be Array");
};

WebRTC.prototype.setMediaDOMs = function(local_dom_id, remote_dom_ids, enable_video) {
  this.local_media.dom = document.getElementById(local_dom_id);
  let dom_ids = (Array.isArray(remote_dom_ids) == false) ? [remote_dom_ids] : remote_dom_ids;
  for (let i=0 ;i<dom_ids.length; i++) {
    this.remote_media_pool[i] = {use: false, sdp: null, stream: null, dom: document.getElementById(dom_ids[i]) }
  }
  if (enable_video !== undefined)
    this.enable_video = enable_video;
};

// open() starts the local side media i.e. attach local mic+camera as source to a DOM
// 
// this is invoked by upper layer before placing a outgoing call (user make call) or 
// before answering a incoming call (receiving an OFFER/INVITE from the remote side,
// typically followed immediately by the acceptCall)
WebRTC.prototype.open = function(local_media_ready_cb, local_media_end_cb, ice_ready_cb, remote_media_change_cb, enable_video) {
  var self = this;
  function _media_success_handler(stream) {
    attachMediaStreamToDOM(self.local_media.dom, stream);
    self.local_media.stream = stream;

    if (typeof local_media_ready_cb === "function")
      local_media_ready_cb();
  }
  function _media_fail_handler() {
    // do we need any cleanup here?

    if (typeof local_media_end_cb === "function")
      local_media_end_cb();
  }

  if (this.local_media.dom === null) {
    webrtc_logger.error("local dom not set to source/sink media")
    return;
  }

  let options = {video: (enable_video === undefined) ? this.enable_video : enable_video, 
                 audio: true};

  // local side
  getUserMedia(options, _media_success_handler, _media_fail_handler);
 
  this.peer_conn = new RTCPeerConnection({iceServers: this.stun_servers});
  
  // ice/stun
  this.peer_conn.onicecandidate = function(event) {
    if (event.candidate) {
      webrtc_logger.debug(new Date + " ICE candidate: " + event.candidate.candidate);
      self.local_media.candidates.push(event.candidate);
    }
    else {
      webrtc_logger.debug(new Date + " no more ICE candidate");
      
      if (typeof ice_ready_cb === "function")
        ice_ready_cb({sdp: self.local_media.sdp.sdp, candidates: self.local_media.candidates});
    }
  };

  // remote side
  this.peer_conn.onaddstream = function(event) {
    let i;

    for (i=0; i<self.remote_media_pool.length; i++) {
      if (self.remote_media_pool[i].use === false) {
        attachMediaStreamToDOM(self.remote_media_pool[i].dom, event.stream);
        self.remote_media_pool[i].stream = event.stream;
        self.remote_media_pool[i].use = true;

        self.remote_media_pool[i].dom.style.display = '';
        break;
      }
    }
    if (i >= self.remote_media_pool.length) {
      // no available DOMs
    }
    if (typeof remote_media_change_cb === "function")
      remote_media_change_cb();
  };
  this.peer_conn.onremovestream = function(event) {
    let i;

    for (i=0; i<self.remote_media_pool.length; i++) {
      if (self.remote_media_pool[i].use && self.remote_media_pool[i].stream.id == event.stream.id) {
        self.remote_media_pool[i].dom.pause();
        self.remote_media_pool[i].dom.srcObject = null;

        self.remote_media_pool[i].sdp = null;
        self.remote_media_pool[i].use = false;
        self.remote_media_pool[i].stream = null;

        self.remote_media_pool[i].dom.style.display = 'none';

        break;
      }
    }
    if (typeof remote_media_change_cb === "function")
      remote_media_change_cb();
  }
};

WebRTC.prototype.close = function() {
  this.local_media.stream = null;
  this.local_media.sdp = null;
  for (let i=0 ;i<this.remote_media_pool.length; i++) {
    this.remote_media_pool[i].use    = false;
    this.remote_media_pool[i].sdp    = null;
    this.remote_media_pool[i].stream = null;
  }

  this.peer_conn = null;
};

WebRTC.prototype.joinGroup = function(ready_cb) {
  let self = this;

  if (this.peer_conn === null || this.local_media.stream === null) {
    webrtc_logger.error("invoked before peer_conn is created and/or local_stream is ready")
    return;
  }

  this.peer_conn.addStream(this.local_media.stream);
  this.local_media.dom.style.display = '';
  this.peer_conn.createOffer(function(sdp_blob) {
    self.local_media.sdp = sdp_blob;
    if (typeof ready_cb === "function")
      ready_cb(sdp_blob);
  }, function() {}, null /* no constrain */);
};

WebRTC.prototype.remoteMediaStreams = function() {
  let msid = [];
  for (let i=0; i<this.remote_media_pool.length; i++) {
    msid.push(this.remote_media_pool[i].stream)
  }

  return msid;
};

WebRTC.prototype.addParticipant = function(sdp, type, cb) {
  var self = this;
  if (this.peer_conn === null || this.local_media.stream === null) {
    webrtc_logger.error("invoked before peer_conn is created and/or local_stream is ready")
    return;
  }

  this.peer_conn.setRemoteDescription(new RTCSessionDescription({type: type, sdp: sdp}));

  this.peer_conn.addStream(this.local_media.stream);
  this.peer_conn.createAnswer(function(sdp_blob) {
    self.peer_conn.setLocalDescription(sdp_blob);
    self.local_media.sdp = sdp_blob;
    if (typeof cb === "function")
      cb(sdp_blob)
  }, function(err) {
    webrtc_logger.error("createAnswer() fails " + err);
  }, null /* no constrain */);
};

WebRTC.prototype.placeCall = function() {
  let self = this;

  if (this.peer_conn === null || this.local_media.stream === null) {
    webrtc_logger.error("invoked before peer_conn is created and/or local_stream is ready")
    return;
  }

  this.peer_conn.addStream(this.local_media.stream);
  this.peer_conn.createOffer(function(sdp_blob) {
    self.peer_conn.setLocalDescription(sdp_blob);
    self.local_media.sdp = sdp_blob;
  }, function() {}, null /* no constrain */);  
};

// invoked by upper layer when recieving an OFFER (typically invoke right after open) or ANSWER
// at this state it has all necessary info of the remote end (sdp, candidate)
WebRTC.prototype.acceptCall = function(sdp, candidates, type) {
  if (this.peer_conn === null) {
    webrtc_logger.error("invoked before peer_conn is created");
    return;
  }

  // may need to filter out h.264 if chrome does not support it. chrome should support h.264 now, right?

  this.peer_conn.setRemoteDescription(new RTCSessionDescription({type: type, sdp: sdp}));
  if (Array.isArray(candidates)) {
    for (let i=0; i<candidates.length; i++) {
      this.peer_conn.addIceCandidate(new RTCIceCandidate(candidates[i]));
    }
  }
};

WebRTC.prototype.answerCall = function() {
  let self = this;
  if (this.peer_conn === null || this.local_media.stream === null) {
    webrtc_logger.error("invoked before peer_conn is created and/or local_stream is ready")
    return;
  }

  this.peer_conn.addStream(this.local_media.stream);
  this.peer_conn.createAnswer(function(sdp_blob) {
    self.peer_conn.setLocalDescription(sdp_blob);
    self.local_media.sdp = sdp_blob;
  }, function() {}, null /* no constrain */);
};

WebRTC.prototype.sendDTMF = function(key) {
  if (this.peer_conn === null || this.local_media.stream === null) {
    webrtc_logger.error("invoked before peer_conn is created and/or local_stream is ready")
    return;
  }

  if (this.dtmd_sender == null) {
    this.dtmf_sender = this.peer_conn.createDTMFSender(this.local_media.stream.getAudioTracks()[0]);
    this_dtmf_sender.insertDTMF(key, 500);
  }
  else
    this.dtmf_sender.insertDTMF(this.dtmf_sender.toneBuffer + key);
};


//===================================================================
// sigchan.js

var sigchan_logger = new Logger("SigChan");

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
  sigchan_logger.debug("open server(" + sig_server + ")");
  this.sock = new WebSocket("wss://" + sig_server + ":9998/" + sig_controller_path, "sansay-roap", "test");  // origin=test

  this.signaling_server = sig_server;
  this.signaling_controller_path = sig_controller_path;
  this.user_id = user_id;

  if (typeof conn_change_handler != "undefined" &&
      conn_change_handler != null)
    this.connHandler = conn_change_handler;

  var self = this;
  this.sock.onopen = function() {
    //sigchan_logger.debug("reset restart count");

    if (self.connHandler != null)
      self.connHandler('connected');
  };
  this.sock.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (typeof data.type != "undefined") {
      if (data.type == "CONNECTION") {
        self.conn_id = data.conn_id;

        for(var i=0; i<self.readyHandler.length; i++)
         self.readyHandler[i](data.orig);
      }
      else {
        if (typeof data.token != "undefined")
          self.token = data.token;

        if (typeof self.smEngine[data.type] != "undefined")
          self.smEngine[data.type].msgHandler(self.smEngine[data.type], data);
      }
    }
    else
      sigchan_logger.error("Received message without data.type");
  };
  this.sock.onclose = function() {
    // connection dropped.
    if (self.conn_id) {  // not closed by invoking close() so it's not expected
      sigchan_logger.warning("WebSocket got closed somehow unexpectedly. Attempt to reopen it");
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
        sigchan_logger.error("Server is down for too long. Giving up.");
    }

    if (self.connHandler != null)
      self.connHandler('disconnected');
  };
  this.sock.onerror = function(err) {
    sigchan_logger.error("websocket got an error (" + JSON.stringify(err) + ")");
  };
};

ChanWebSocket.prototype.close = function() {
  sigchan_logger.debug("ChanWebSocket close");

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
    sigchan_logger.error("send fails, ChanWebSocket not open");
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
    sigchan_logger.error("send fails, unknown type " + mtype);
//    return;
  }

  this.sock.send(JSON.stringify(data));
};


//==================================================================
// videoconf.js

var VENICE_CONF_SERVER = "venice-conf";


var videoconf_logger = new Logger("VideoConf");

function SansayConfClient(server) {
  this.signaling_server          = server;
  this.signaling_controller_path = "";

  this.media                     = new WebRTC();
  this.sigChan                   = new ChanWebSocket("SYMMETRIC");

  this.token                     = null;

  this.user                      = null;
  this.cname                     = null;
  this.domain                    = null;

  this.in_conf                   = false;
  this.room                      = null;

  this.loginErrorHandler         = null;
  this.joinHandler               = null;
  this.leaveHandler              = null;
  this.updateHandler             = null;

  this.msgHandler = function(self, data) {
    if (data.type === "SESSION") {
      if (data.token !== undefined) {
        this.token = data.token;
        // just to simplify and not check for the session section.
      }
      if (data.session !== undefined) {
        if (data.session.messageType === "SUCCESS") {
          // may not need to do anything since
          videoconf_logger.debug("login successfully")
        }
        else if (data.session.messageType === "ERROR") {
          if (self.loginErrorHandler !== null)
            self.loginErrorHandler();
        }
        else {
          videoconf_logger.warning("receive handled SESSION message of " + data.session.messageType);
        }
      }
      else {
        videoconf_logger.error("Malformed SESSION message received");
      }
    }
    else if (data.type === "CALL") {
      //videoconf_logger.debug("got call with roap\n" + JSON.stringify(data.roap))
      if (data.roap !== undefined && data.roap.messageType === "OFFER") {
        videoconf_logger.debug("got OFFER from conf server with SDP");
        videoconf_logger.debug(data.roap.sdp);
        self.media.addParticipant(data.roap.sdp, "offer", function(sdp) {
          if (self.in_conf) {       // this is to handle the subsequent OFFER from conf server to add participants
            let msg = {
              messageType: "ANSWER",
              // need other things here later
              sdp:         self.media.local_media.sdp.sdp};      // FIXME: may need to append the ice candidates too
            self.sigChan.send(self.user, VENICE_CONF_SERVER, msg, "CALL", function() {}, function() {});
          }
        });
      }
      else if (data.roap.messageType === "INFO") {
        if (data.roap.info === "PARTICIPANT_STREAM") {
          let i;
          let msids = [];

          //console.log("PARTICIPANT_STREAM: " + JSON.stringify(data.roap.data))

          let dict = {}
          for (i=0; i<data.roap.data.length; i++) {
            dict[data.roap.data[i].msid] = data.roap.data[i].participant;
          }
          //console.log(JSON.stringify(dict))

          let streams = self.media.remoteMediaStreams();
          let stream_ids = []
          for (i=0; i<streams.length; i++) {
            if (streams[i] !== null)
              stream_ids.push(streams[i].id);
            else
              stream_ids.push(null);
          }
          //console.log("stream_ids: " + JSON.stringify(stream_ids))

          let stream_cnt = 0;
          let msid_cnt = 0;
          for (let i=0; i<stream_ids.length; i++) {
            if (stream_ids[i] !== null) {
              stream_cnt++;
              if (dict[stream_ids[i]] !== undefined) {
                msids.push(dict[stream_ids[i]]);
                msid_cnt++;
              }
            }
            else 
              msids.push(null);
          }

          if (stream_cnt > msid_cnt) {    // try again for missing ones
            videoconf_logger.debug("PARTICIPANT_STREAM: " + JSON.stringify(data.roap.data));
            videoconf_logger.debug("streams: " + JSON.stringify(stream_ids));
            videoconf_logger.debug("dict: " + JSON.stringify(dict));
            videoconf_logger.debug("** try again **");

            // FIXME: we may want to implement some backoff retry mechanism. in some conditions (god knows what)
            //        keep retrying and keep getting missing ones can cause a retry storm and creates
            //        problems. other way is to instrument some defensive measure on the server side
            let msg = {
              messageType: "QUERY",
              // need other things here later
              info:        "PARTICIPANT_STREAM"
            };
            self.sigChan.send(self.user, VENICE_CONF_SERVER, msg, "CALL", function() {}, function() {});
          }
          // matching the msids with the list from the conf server
          if (self.updateHandler !== null)
            self.updateHandler(msids);
        }
      }
      else if (data.roap.messageType === "ERROR") {
        videoconf_logger.debug("receive ERROR of " + data.roap.errorType);
        if (self.leaveHandler !== null) {
          self.leaveHandler((data.roap.errorType === "NOMATCH") ? "INVALID_CONF_NUMBER" : "UNKNOWN_ERROR");
        }
      }
      else if (data.roap.messageType === "OK") {
        videoconf_logger.debug("receive OK. This is for SUBSCRIBE we sent")
      }
      else {
        videoconf_logger.warning("we only expect OFFER. however we are getting " + data.roap.messageType);
        // what to do?
      }
    }
  };
}

SansayConfClient.prototype.logout = function() {
  this.sigChan.close();

  // FIXME: add nessary init to reset all settings
};

SansayConfClient.prototype.login = function(user_id, pwd, cname, domain, success_cb, fail_cb) {
  var self = this;

  this.user = user_id;
  this.cname = cname;
  this.domain = domain;

  if (typeof fail_cb === "function")
    this.loginErrorHandler = fail_cb;

  this.sigChan.open(this.signaling_server, this.signaling_controller_path, user_id, function(status) {
    if (status === "connected") {
      videoconf_logger.debug("connect successfully to server");
      if (typeof success_cb === "function")
        success_cb();
    }
    else if (status === "disconnected") {
      videoconf_logger.error("disconnected from server");
      if (typeof fail_cb === "function")
        fail_cb()
    }
    // doing something here
  });

  // we handle both SESSION and CALL here
  this.sigChan.attachSM("SESSION", this);
  this.sigChan.attachSM("CALL", this);

  this.sigChan.registerReadyHandler(function() {
    // send LOGIN to the conf server as soon as connection is read
    let msg = {
          messageType:     "LOGIN",
          userId:          user_id,
          password:        pwd,
          cname:           cname,
          domain:          domain,
          seq:             0
        };

    self.sigChan.send(user_id,
                      VENICE_CONF_SERVER, 
                      msg,
                      "SESSION",
                      function() {},
                      function() {});
  });
};

SansayConfClient.prototype.leave = function(room) {
  let msg = {
    messageType: "SHUTDOWN",
    group:       this.room
    // FIXME: other stuffs here
  };
  this.sigChan.send(this.user, VENICE_CONF_SERVER, msg, "CALL", function() {}, function() {});

  this.room = null;
  this.in_conf = false;
  if (this.leaveHandler !== null) {
    this.media.close();
    this.leaveHandler("USER_LEAVE");

    // reset them
    this.leaveHandler = null;
    this.updateHandler = null;
  }
};

SansayConfClient.prototype.join = function(room, in_cb, out_cb, update_cb) {  // room_id should also identify the SFU and room # 
  var self = this;
  var conf_ready = false;

  this.media.open(
    function() {
      if (conf_ready) {
        videoconf_logger.debug("conf is ready");
      } 
      else {
        self.media.joinGroup(function(sdp) {
          videoconf_logger.debug("sending SUBSCRIBE with SDP");
          //videoconf.logger.debuf(sdp.sdp);

          let msg = {
            messageType: "SUBSCRIBE",
            group:       room,
            usePlanB:    true,
            sdp:         sdp.sdp};
          self.sigChan.send(self.user, VENICE_CONF_SERVER, msg, "CALL", function() {}, function() {});
        });
        conf_ready = true;
      }
    }, 
    function() {}, 
    function(sdp) {
      videoconf_logger.debug("sending ANSWER");
      let final_sdp = sdp.sdp;
      for (var i=0; i<sdp.candidates.length; i++)
        final_sdp += (sdp.candidates[i].candidate + "\r\n");
      
      //videoconf_logger.debug(final_sdp)

      let msg = {
        messageType: "ANSWER",
        // need other things here later
        sdp:         final_sdp};
      self.sigChan.send(self.user, VENICE_CONF_SERVER, msg, "CALL", function() {}, function() {});
      self.in_conf = true;
      self.room = room;

      if (typeof in_cb === "function")
        in_cb();
  },
  function() {
    let msg = {
      messageType: "QUERY",
      // need other things here later
      info:        "PARTICIPANT_STREAM"
    };
    self.sigChan.send(self.user, VENICE_CONF_SERVER, msg, "CALL", function() {}, function() {});
  });

  if (typeof out_cb === "function")
    self.leaveHandler = out_cb;
  if (typeof update_cb === "function")
    this.updateHandler = update_cb;
};

SansayConfClient.prototype.updateParticipants = function() {
  let msg = {
    messageType: "QUERY",
    // need other things here later
    info:        "PARTICIPANT_STREAM"
  };
  this.sigChan.send(this.user, VENICE_CONF_SERVER, msg, "CALL", function() {}, function() {});
};

SansayConfClient.prototype.setMediaElements = function(local, remotes) {
  this.media.setMediaDOMs(local, remotes);
};

SansayConfClient.prototype.setStunServers = function(servers) {
  this.media.setStunServers(servers);
};


