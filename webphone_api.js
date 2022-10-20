/** 
* Mizu WebPhone Java Script API.
* This file is the main interface of the WebPhone, which must be included in your html (<script src="PATH/webphone_api.js"></script>).
* You can interact with the WebPhone using the API functions below.
* See the documentation about the usage: https://www.mizu-voip.com/Portals/0/Files/Webphone_Documentation.pdf
*/
var webphone_api = (function ()
{
    /**
     * API parameter configuration have been moved to: webphone_config.js.
	 * (If you set any parameters here, those will be still loaded)	
     */
    var parameters = {};


    /** Call this function once, passing a callback.
 * The passed callback function will be called on every app state change. The states are:
 * "loaded" - the webphone library is completely loaded so you can start the usage (call any other API functions after this state is received).
 * "started" - the VoIP engine has successfully started (ready to register or make calls). Note: you can initiate calls also from the onLoaded and it will be queued to be executed after started.
 * "stopped" - the VoIP engine has stopped (all endpoints and sipstack is destroyed).
 * --PARAMETERS --
 * state: the callback function will have a String parameter containing the new state of the application */
function onAppStateChange(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.appstatechangecb.push(callback);
}

/** Call this function once, passing a callback.
 * The passed callback function will be called on every register state change. The states are:
 * "registered" - the webphone is registered to the VoIP server, so you can start dialing/receiving calls/chats
 * "unregistered" - the webphone is unregistered from the VoIP server
 * "failed" - the webphone failed to register to the VoIP server
 * --PARAMETERS --
 * state: the callback function will have a String parameter containing the new state of register
 * reason: the callback function will have a second String parameter containing the reason of the failed registration (only for "failed" state) */
function onRegStateChange(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.regstatechangecb.push(callback);
}


/** Call this function once, passing a callback. 
 * The passed callback function will be called on every call state change.
 * --PARAMETERS --
 * event: can have following values: callSetup, callRinging, callConnected, callDisconnected
 * direction: 1 (outgoing), 2 (incoming)
 * peername: is the other party username
 * peerdisplayname: is the other party display name if any
 * line: the event refers to this line
 * callid: Call-ID header value from SIP signaling*/
function onCallStateChange(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.callstatechangecb.push(callback);
}
/** Call this function once, passing a callback.
 * The passed callback function will be called when chat message is received.
 * --PARAMETERS --
 * from: username, phone number or sip URI of the sender
 * msg: the content of the text message
 * line: chat message received on this line
 * group: group name; the name of the group if it's group chat, otherwise it will be an empty string */
function onChat(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.chatcb.push(callback);
}

/** Call this function once, passing a callback.
 * The passed callback function will be called when SMS is received.
 * --PARAMETERS --
 * from: phone number of the sender
 * msg: the content of the text message */
function onSMS(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.smscb.push(callback);
}

/** Call this function once, passing a callback.
 * The passed callback function will be called after each call. You will receive a CDR (call detail record).
 * --PARAMETERS --
 * caller: the caller party username
 * called: called party username
 * connecttime: milliseconds elapsed between call initiation and call connect
 * duration: milliseconds elapsed between call connect and hangup (0 for not connected calls. Divide by 1000 to obtain seconds.)
 * direction: 1 (outgoing), 2 (incoming)
 * peerdisplayname: is the other party display name if any
 * reason: disconnect reason as string
 * line: the CDR refers to this line
 * callid: Call-ID SIP header
*/
function onCdr(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.cdrcb.push(callback);
}

/** Call this function once, passing a callback.
 * The passed callback function will be called when a DTMF is received.
 * --PARAMETER --
 * dtmf: string DTMF character
 * line: the DTMF refers to this line */
function onDTMF(callback) 
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.cddtmf.push(callback);
}

/**
* Optionally you can "start" the phone, before making any other action. 
* In some circumstances the initialization procedure might take a few seconds (depending on usable engines) so you can prepare the webphone with this method
* to avoid any delay when the user really needs to use by pressing the call button for example. 
* If the serveraddress/username/password is already set and auto register is not disabled, then the webphone will also register (connect) to the SIP server upon start.
* If start is not called, then the webphone will initialize itself the first time when you call some other function such as register or call.
* The webphone parameter should be set before you call this method (preset in the js file or by using the setparameter function).
*/
function start ()
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
    {
        return webphone_api.addtoqueue('Start', [parameters, true]);
    }
    else
        return webphone_api.plhandler.Start(parameters, true);
}

/**
 * Will stop all endpoints and sipstack. This function call is optional */
 function stop ()
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('Stop', [parameters]);
    else
        webphone_api.plhandler.Stop(parameters);
}

/** Optionally you can "register". This will "connect" to the SIP server if not already connected by the start method */
function register ()
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('Register', [parameters]);
    else
        webphone_api.plhandler.Register(parameters);
}

/** Used to register to with multiple SIP accounts
 * the accounts are passed as string in the following format:
 * server,usr,pwd,ival#server2,usr2,pwd2,ival;*/
function registerex (accounts)
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('RegisterEx', [accounts]);
    else
        webphone_api.plhandler.RegisterEx(accounts);
}

/** Initiate call to a number, sip username or SIP URI. Parameter "number" must be of type String.*/
function call (number)
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('Call', [number]);
    else
        webphone_api.plhandler.Call(number);
}

/** Initiate video call to a number, sip username or SIP URI. Parameter "number" must be of type String.*/
function videocall (number)
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('VideoCall', [number]);
    else
        webphone_api.plhandler.VideoCall(number);
}

/** Disable/enable video(stream) during a video call
 * state: (boolean) can be true or false
 * The direction can have the following values:
 *   0:  state both (default)
 *   1:  state remote
 *   2:  state local*/
function mutevideo(state, direction)
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('MuteVideo', [mute, direction]);
    else
        webphone_api.plhandler.MuteVideo(state, direction);
}

/** Set the size of the displayed video container. Can also be configured from css/video.css
 * type: 1=for remote video container, 2=for local video container
 * width: integer value of width in pixels
 * height: integer value of height in pixels; this parameter can be left empty or null, and the height will be set depending on the video's aspect ratio*/
function setvideodisplaysize(type, width, height)
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('SetVideoSize', [type, width, height]);
    else
        webphone_api.plhandler.SetVideoSize(type, width, height);
}

/** Initiate screenshare call to a number, sip username or SIP URI. Just omit "screenid" parameter; this can be used only in Chrome OS*/
function screenshare (number, screenid)
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('ScreenShare', [number, screenid]);
    else
        webphone_api.plhandler.ScreenShare(number, screenid);
}

/** Terminate screenshare. hangup() function can also be used.*/
function stopscreenshare ()
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('StopScreenShare', []);
    else
        webphone_api.plhandler.StopScreenShare();
}

/** Disconnect current call(s).*/
function hangup ()
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('Hangup', []);
    else
        webphone_api.plhandler.Hangup();
}

/** Connect incoming call*/
function accept ()
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        return webphone_api.addtoqueue('Accept', []);
    else
        return webphone_api.plhandler.Accept();
}

/** Disconnect incoming call.*/
function reject ()
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('Reject', []);
    else
        webphone_api.plhandler.Reject();
}

/** Ignore incoming call.*/
function ignore ()
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('Ignore', []);
    else
        webphone_api.plhandler.Ignore();
}

/**
* Get details about a line. The line parameter can be -1 (will return the “best” line status).
* Will return the following string:
* LINEDETAILS,line,state,callid,remoteusername,localusername,type,localaddress,serveraddress,mute,hold,remotefullname */
function getlinedetails(line)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.GetLineDetails(line);
    else
        return '';
}

/**
 * Returns a String with details about the last finished call
 */
function getlastcalldetails ()
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.GetLastCallDetails();
    else
        return '';
}

/**
 * Call this function passing a callback.
 * The passed callback function will be called with a String parameter containing the reason of the last failed registration. Set the extended parameter to true to get more details
*/
function getregfailreason(callback, extended)
{
     if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        webphone_api.plhandler.GetRegFailReason(callback, extended);
    else
        webphone_api.Log('ERROR, webphone_api: getregfailreason webphone_api.plhandler is not defined');
}

/** Play any sound file, at least wave files (raw linear PCM) are supported in the following format: PCM SIGNED 8000.0 Hz (8 kHz) 16 bit mono (2 bytes/frame) in little-endian (128 kbits)
 * --PARAMETERS --
 * start: int - 1 for start or 0 to stop the playback, -1 to pre-cache
 * file: String - file name or full path
 * looping: int - 1 to repeat, 0 to play once
 * toremotepeer: boolean - stream the playback to the connected peer
 */
function play(start, file, looping, toremotepeer)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.PlaySound(start, file, looping, toremotepeer);
    else
        webphone_api.Log('ERROR, webphone_api: play webphone_api.plhandler is not defined');
    return false;
}

/**
 * Returns a String list of available call functions, separated by comma, based on what functions are supported by the current VoIP engine
 * Possible values: conference,transfer,mute,hold,chat
 *                  or ERROR, if webphone is not yet started
*/
function getavailablecallfunc ()
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
    {
        webphone_api.Log('ERROR, webphone_api: getavailablecallfunc webphone_api.plhandler is not defined');
        return 'ERROR, webphone is not yet started';
    }
    else
    {
        return webphone_api.plhandler.GetAvailableCallfunc();
    }
}

/** 
* Forward incoming call to number
*/
function forward (number)
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('Forward', [number]);
    else
        webphone_api.plhandler.Forward(number);
}

/** 
* Add people to conference.
* If number is empty than will mix the currently running calls (if there is more than one call)
* Otherwise it will call the new number (usually a phone number or a SIP user name) and once connected will join with the current session.
* number: string parameter, usually a phone number or a SIP user name
* add: boolean, true if to add, false to remove
*/
function conference (number, add)
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('Conference', [number, add]);
    else
        webphone_api.plhandler.Conference(number, add);
}

/** 
* Transfer current call to number which is usually a phone number or a SIP username. (Will use the REFER method after SIP standards).
* You can set the mode of the transfer with the "transfertype" parameter.
*/
function transfer (number)
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('Transfer', [number]);
    else
        webphone_api.plhandler.Transfer(number);
}

/** 
* Send DTMF message by SIP INFO or RFC2833 method (depending on the "dtmfmode" parameter).
* Please note that the "msg" parameter is a string. This means that multiple dtmf characters can be passed at once
* and the webphone will streamline them properly. Use the space character to insert delays between the digits.
* The dtmf messages are sent with the protocol specified with the “dtmfmode” parameter.
* Example:	dtmf(" 12 345 #");
*/
function dtmf (msg)
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('Dtmf', [msg]);
    else
        webphone_api.plhandler.Dtmf(msg);
}

/** 
*  Mute current call. The direction can have the following values:
*   0:  state both
*   1:  state out (speakers)
*   2:  state in (microphone) (Default)
*/
function mute (state, direction)
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('MuteEx', [mute, direction]);
    else
        return webphone_api.plhandler.MuteEx(state, direction);
}

/** Will return true if the call is muted, otherwise false */
function ismuted ()
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.IsMuted();
    else
        return false;
}

/** 
* Set state to "true" to put the calll on hold
* or "false" to unhold the call
*/
function hold (state)
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        return webphone_api.addtoqueue('Hold', [state]);
    else
        return webphone_api.plhandler.Hold(state);
}

/** Will return true if the call is on hold, otherwise false */
function isonhold ()
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.IsOnHold();
    else
        return false;
}

/** 
* Send a chat message. (SIP MESSAGE method after RFC 3428)
 * --PARAMETERS --
 * number: String -  can be a phone number or SIP username/extension number.
 * msg: String - the content of the chat message
 * group: String - group name; has to be sent only for group chat, otherwise it can be an empty string
*/
function sendchat (number, msg, group)
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('SendChat', [number, msg]);
    else
        webphone_api.plhandler.SendChat(number, msg, group);
}

/** 
* Send a SMS message.
* Number can be a PSTN or mobile phone number.
* from is optional
*/
function sendsms (number, msg, from)
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        webphone_api.addtoqueue('SendSms', [number, msg, from]);
    else
        webphone_api.plhandler.SendSms(number, msg, from);
}

/** Call this function and pass a callback, to receive the incoming caller id (might return two lines: caller id \n caller name)
 * NOTE: if you just need the caller id, you should just use the onCallState peer name instead of this function.
 * The callback will be called with a string parameter which will contain the incoming caller id. */
function getcallerdisplayfull (callback)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.GetIncomingDisplay(callback);
    else
        return '';
};

/** Start/stop voice record
 * start: true/false
 * url:  FTP or HTTP url where the voice file will be uploaded to*/
function voicerecord (start, url)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        webphone_api.plhandler.Voicerecord(start, url);
}

/** Open audio/video device selector dialog (built-in user interface).*/
function devicepopup ()
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        webphone_api.plhandler.DevicePopup();
}

/** Call this function and pass a callback, to receive a list of all available audio devices.
 * For the dev parameter pass 0 for recording device names list, 1 for the playback, 2 for ringer devices, 3 for video camera devices
 * The callback will be called with a string parameter which will contain the audio device names separated by CRLF */
function getdevicelist (dev, callback)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
    {
        if (typeof (dev) === 'undefined' || dev === null || dev.length < 1) dev = '-12';
        webphone_api.plhandler.GetDeviceList(dev, callback);
    }
}

/** Call this function and pass a callback, to receive the currently set audio device.
 * For the dev parameter pass 0 for recording device, 1 for the playback, 2 for ringer device , 3 for video camera devices
 * The callback will be called with a string parameter which will contain the currently set audio device names */
function getdevice (dev, callback)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
    {
        if (typeof (dev) === 'undefined' || dev === null || dev.length < 1) dev = '-13';
        webphone_api.plhandler.GetDevice(dev, callback);
    }
}

/** Select an audio device. The devicename should be a valid audio device name (you can list them with the getdevicelist() call)
 * For the dev parameter pass 0 for recording device, 1 for the playback, 2 for ringer device, 3 for video camera devices
 * The "immediate" parameter can have the following values (!!! only for Java and Native Service engines):
-0: default
-1: next call only
-2: immediately for active calls
 */
function setdevice (dev, devicename, immediate)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
    {
        if (typeof (dev) === 'undefined' || dev === null || dev.length < 1) dev = '-14';
        webphone_api.plhandler.SetDevice(dev, devicename, immediate);
    }
}

/** 
* Set volume (0-100%) for the selected device. Default value is 50% -> means no change
* The dev parameter can have the following values:
*  0 for the recording (microphone) audio device
*  1 for the playback (speaker) audio device
*  2 for the ringback (speaker) audio device
*/
function setvolume(dev, volume)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        webphone_api.plhandler.SetVolume(dev, volume);
}

/**
* Call this function, passing a callback
* Return the volume (0-100%) for the selected device.
* The dev parameter can have the following values:
*  0 for the recording (microphone) audio device
*  1 for the playback (speaker) audio device
*  2 for the ringback (speaker) audio device
* --PARAMETERS --
* volume: integer representing the volume
*/
function getvolume(dev, callback)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
    {
        if (typeof (dev) === 'undefined' || dev === null || dev.length < 1) dev = '-15';
        webphone_api.plhandler.GetVolume(dev, callback);
    }
}

/** Call this function with boolean parameter "true" to set the default playback device on Android phones and tablets to speakerphone
* set: Boolean - true/false
 */
function setloudspeaker(set)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        webphone_api.plhandler.SetLoudspeaker(set);
}

/**
* Create new contact in the webphone's phonebook/contact list.
* --PARAMETERS --
* fullname: String - the full name of the contact. If empty, it will be the same as the number
* number: String - Phone number or SIP URI
* email: String
* address: String
* notes: String
* website: String */
function addcontact(fullname, number, email, address, notes, website)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.AddContact(fullname, number, email, address, notes, website);
    else
        return false;
}

/**
* Delete existing contact from webphone's phonebook/contact list, if matches the passed name and/or number.
* --PARAMETERS --
* name: String - delete the contact that match this name
* number: String - delete the contact that match this Phone number or SIP URI */
function deletecontact(name, number)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.DeleteContact(name, number);
    else
        return false;
}

/** Call this function passing the name and/or number of the contact.
* It will return a String with the following parameters separated by "tabs":  \t  if found. If not found, then it will return null.
* --PARAMETERS --
* name: String - the name of the contact
* number: String - number(s)/SIP URI(s) of the contact separated by Pipe(Vertical bar): |
* favorite: int - 0=No, 1=Yes
* email: String - email address of the contact
* address: String - the address of the contact
* notes: String - notes attached to this contact
* website: String: web site attached to this contact*/
function getcontact(name ,number)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.GetContact(name, number);
}

/** This function will return a String containing the whole contact list. If there are no contacts, it will return null.
Set the all parameter to true to receive also virtual contacts as well, like voicemail number, etc...
Contacts will be separated by "carriage return new line": \r\n
           Contact fields will be separated by "tabs": \t 
           A contact can have more than one phone numbers or SIP URIs, so these will be separated by Pipe(Vertical bar): |
           See example below:
The order of fields and their meaning:
name: String - the name of the contact
number: array of String - the number(s)/SIP URI(s) of the contact
favorite: int - 0=No, 1=Yes
email: String - email address of the contact
address: String - the address of the contact
notes: String - notes attached to this contact
website: String: web site attached to this contact

Example:   Name \t Number1|Number2 \t Favorite \t Email \t Address \t Notes \t Website\r\n
*/
function listcontacts(all)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.ListContacts(all);
}

/** This function will return a String containing the whole call history list. If there are no entries in call history, it will return null.
Call history entries will be separated by "carriage return new line": \r\n
           Call history fields will be separated by "tabs": \t 
           
The order of fields and their meaning:
type: int - 0=Outgoing call, 1=Incoming call, 2=Missed call
name: String - can be a name, can be the same as the number or can be empty String
number: String - the phone number/SIP URI
date: int - timestamp date of call
duration: int - duration of the call in milliseconds
discreason: String - call disconnect reason

Example:   1 \t Name \t Number \t Date \t Duration \t Discreason
*/
function listcallhistory()
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.ListCallhistory();
}

/** Any additional parameters must be set before start/register/call is called*/
function setparameter (param, value)
{
    if (typeof (param) === 'undefined' || param === null || typeof (value) === 'undefined') { return false; }
    
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
    {
        webphone_api.Log('WARNING, webphone not initialized yet. webphone_api.setparameter AddToQueue: ' + param + ': ' + value);
        webphone_api.addtoqueue('SetParameter', [param, value]);
    }
    else{
        var valtoprint = value;
        if (param === 'password') { valtoprint = '*****'; }  //|| param === 'sipusername' || param === 'username'
        webphone_api.Log('EVENT, webphone_api.setparameter: ' + param + ': ' + valtoprint);
        webphone_api.plhandler.SetParameter(param, value);
    }
}

/** Will return value of a parameter if exists, otherwise will return empty string*/
function getparameter (param)  // string
{
    if (typeof (param) === 'undefined' || param === null) { return ''; }
    
    var value = parameters[param];
    
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
    {
        return webphone_api.plhandler.GetParameter(param);
    }else
    {
        var err_msg = 'ERROR, Webphone settings not loaded just yet';
        if (typeof (console) !== 'undefined' && console !== null)
        {
            if (typeof (console.error) !== 'undefined' && console.error !== null) { console.error(err_msg); }
            else if (typeof (console.log) !== 'undefined' && console.log !== null) { console.log(err_msg); }
        }
    }
    
    if (typeof (value) === 'undefined' || value === null) { return ''; }
    
    return value;
}

/** Will set the current line. (Use only if you present line selection for the users. Otherwise, you don’t have to take care about the lines as it is handled automatically by the webphone). */
function setline (line)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        webphone_api.plhandler.SetLine(line);
}

/** Will return the current active line number. This should be the line, which you have set previously except after incoming and outgoing calls (the webphone will automatically switch the active line to a new free line for these if the current active line is already occupied by a call). */
function getline () //int
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
    {
        return webphone_api.plhandler.GetLine();
    }
    return -1;
}

/** Call this function passing a line number and a callback
 * The passed callback function will be called with one parameter, which will be the SIP Call-ID for the passed line number. */
function linetocallid (line, callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
    {
        return webphone_api.plhandler.LineToCallID(line, callback);
    }
    webphone_api.Log('ERROR, webphone_api: linetocallid webphone_api.plhandler is not defined');
}

/** Call this function passing a SIP Call-ID and a callback
 * The passed callback function will be called with one parameter, which will be the line number for the passed SIP Call-ID. */
function callidtoline (callid, callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
    {
        return webphone_api.plhandler.CallIDToLine(callid, callback);
    }
    webphone_api.Log('ERROR, webphone_api: callidtoline webphone_api.plhandler is not defined');
}

/** Return true if the webphone is registered ("connected") to the SIP server.*/
function isregistered () // boolean
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.IsRegistered();
    else
        return false;
}

/** Return true if the user is in call, false otherwise*/
function isincall () // boolean
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.IsInCall();
    else
        return false;
}

/** Unregister SIP account from VoIP server*/
function unregister ()
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        webphone_api.plhandler.Unregister();
}

/** 
* Will receive presence information as events: PRESENCE, status,username,displayname,email (displayname and email can be empty)
*       To receive events use the "onEvent(callback)" API function
* userlist: list of sip account usernames separated by comma
* Also it will return an empty String or a String containing a list of users and their presence statuses separated by semicolon, example: "111111,online;222222offline;333333,online"
* Also, a callback can be specified, and in that case the presence must be requested individually for every user. The callback will be called with two String parameters: the user and its status
*/
function checkpresence (userlist, callback)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.CheckPresence(userlist, callback);
}

/** Function call to change the user online status with one of the followings strings: Online, Away, DND, Invisible, Offline (case sensitive) */
function setpresencestatus(statustring)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        webphone_api.plhandler.SetPresenceStatus (statustring);
}

/** Call this function once, passing a callback.
 * The passed callback function will be called on every presence (online/offline/others) state change (of the remote users).
 * --PARAMETERS --
 * peername: is the other party username (or phone number or extension)
 * presence: can have following values: CallMe,Available,Pending,Other,CallForward,Speaking,Busy,Idle,DoNotDisturb,Unknown,Away,Offline,Exists,NotExists,Unknown
 * displayname: optional peer display name if sent as part of presence
 * email: optional peer email address if sent as part of presence */
function onPresenceStateChange(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.presencecb.push(callback);
}

/** Call this function once, passing a callback.
 * The passed callback function will be called on every call state change (of the remote users) which might be used as BLF (busy lamp field).
 * --PARAMETERS --
 * peername: is the other party username (or phone number or extension)
 * direction: can have one of following values: undefined, initiator (outgoing call) or receiver (incoming call)
 * state: can have one of following values: trying , proceeding, early, confirmed, terminated, unknown or failed
 * callid: optional SIP call-id of the call (if reported by the BLF notify)*/
function onBLFStateChange(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.blfcb.push(callback);
}

/*
* Will receive call state information as BLF notifications and will trigger the onBlfStateChange callback.
* userlist: list of sip account usernames separated by comma
*/
function checkblf (userlist)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.CheckBLF(userlist);
}

/** Check if communication channel is encrypted: -1=unknown, 0=no, 1=partially, 2=yes, 3=always*/
function isencrypted()
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.IsEncrypted ();
    else
        return -1;
}
/** Set a custom sip header (a line in the SIP signaling) that will be sent with all messages.
 * Can be used for various integration purposes (for example for sending the http session id).
 * You can also set this with applet parameter (customsipheader).*/
function setsipheader(header)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        webphone_api.plhandler.SetSipHeader(header);
    else
        webphone_api.Log('ERROR, webphone_api: setsipheader webphone_api.plhandler is not defined');
}

/** Call this function passing a callback.
 * The passed callback function will be called with one parameter, which will be the string value of the requested sip header.*/
function getsipheader(header, callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        webphone_api.plhandler.GetSipHeader(header, callback);
    else
        webphone_api.Log('ERROR, webphone_api: getsipheader webphone_api.plhandler is not defined');
}

/** Call this function passing a callback. The callback function will be called with the
 * last SIP signaling message as specified by the current line and the dir/type parameters
 * --PARAMETERS --
 * dir: 0=incoming/received message, 1=out outgoing/sent message
 * type: 0=any, 1=SIP request, 2=SIP answer, 3=INVITE (the last INVITE received or sent), 4=the last 200 OK */
function getsipmessage(dir, type, callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        webphone_api.plhandler.GetSipMessage(dir, type,callback);
    else
        webphone_api.Log('ERROR, webphone_api: getsipmessage webphone_api.plhandler is not defined');
}

/** Change the color theme of the webphone skin. It is the same as from Settings -> Theme
 * --PARAMETERS --
 * theme: the integer index number of the theme. The default "Webphone" named theme is "0" "Light Blues" is "1", "Light Green" is "2" and so on. */
function changetheme(theme)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.ChangeTheme(theme);
}

/** Call this function passing a callback.
 * The passed callback function will be called with one parameter, which will be webphone's work directory.
 * only for Java and Native Service engines*/
function getworkdir(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.GetWorkDir(callback);
    else
        return 'ERROR, getworkdir webphone_api.plhandler is not defined';
}

/** Delete stored data (from cookie and localstorage): settings, contacts, callhistory, messages
 *  level: 1=just settings file, 2=delete everything: settings, contacts, callhistory, messages
 *  !!! IMPORTANT: This API call will stop any runing engine. You will need to call start() to start the webphone */
function delsettings(level)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        webphone_api.plhandler.delsettings(level);
    else
        webphone_api.Log('ERROR, webphone_api: delsettings webphone_api.plhandler is not defined');
}

/** Returns the currently used engine: "java", "webrtc", "ns", "app", "flash", "p2p", "nativedial". Can return empty string if engine selection is in progress*/
function getenginename()
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.Getenginename();
    else
        webphone_api.Log('ERROR, webphone_api: getenginename webphone_api.plhandler is not defined');
}

/** Call this function passing a callback.
 * The passed callback function will be called with one String parameter, which will be the last received call's SIP INVITE message. */
function getlastrecinvite(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.GetLastRecInvite(callback);
    else
        return 'ERROR, getlastrecinvite webphone_api.plhandler is not defined';
}

/** Call this function passing a callback.
 * The passed callback function will be called with one String parameter, which will be the last outgoing call's SIP INVITE message. */
function getlastsentinvite(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.GetLastSentInvite(callback);
    else
        return 'ERROR, getlastsentinvite webphone_api.plhandler is not defined';
}

/** Returns a string containing all the past logs of the webphone*/
function getlogs()
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        return webphone_api.plhandler.getlogs();
    else
        webphone_api.Log('ERROR, webphone_api: getlogs webphone_api.plhandler is not defined');
}

/** If engine is Java or Service plugin, then you can access the full java API as described in the JVoIP SDK documentation: https://www.mizu-voip.com/Software/JVoIP_Doc.pdf
 * --PARAMETERS --
 * name: name of the function
 * jargs: array of arguments passed to the called function; Must be an array, if API function has parameters. If API function has no parameters, then it can be an empty array, null, or omitted altogether
 * ex: API function: API_Call(number)   can be called like this:   webphone_api.jvoip('API_Call',  [number]); */
function jvoip(name, jargs)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        webphone_api.plhandler.Jvoip(name, jargs);
    else
        webphone_api.Log('ERROR, webphone_api: jvoip webphone_api.plhandler is not defined');
}

/** 
* New function to replace onDisplay, onLog, onEvents
* Call this function once and pass a callback, to receive important events, which should be displayed for the user and/or parsed to perform other actions after your software custom logic. You will also receive all log messages depending on the value of "loglevel" parameter.
* For the included softphone these are already handled, so no need to use this, except if you need some extra custom actions or functionality which depends on the notifications.
* --PARAMETERS --
* type: the type of the message. This can have the following values:
            "event" - low level status message which can be parsed as string.
					Example: STATUS,1,Ringing,2222,1111,2,Katie,[callid]
					Instead of parsing these low level string notifications, you should use the callback functions instead such as onAppStateChange, onCallStateChange, onChat and the other onXXX functions.
					See the "Notifications" section in the documentation for the possible strings.
            "log" - log messages 
					Usually you don't need to check for the logs.
					You might watch for this only if you wish to collect the logs for some purpose or you have to watch for a log string to be triggered.
            "display" - important messages to be displayed for the user. If you wish to handle the popups yourself, then disable popups by settings "showtoasts" parameter to "false". From here on you will be responsible for presenting these messages to the user.
                        If type is "display", then the "message" parameter will be composed of a "title" until the first comma and a "text". 
						The title can be an empty string, in which case the message begins with a comma.

* message: the text of the event/log/display
*/
/*
	Example: 
		webphone_api.onEvent( function (type, message)
		{
			// For example the following status means that there is an incoming call ringing from 2222 on the first line: 
			// STATUS,1,Ringing,2222,1111,2,Katie,[callid]					
			// You can find more detailed explanation about events in the documentation "Notifications" section.
			
			// example for detecting incoming call:
			if (type === 'event')
			{
				var evtarray = message.split(','); //parameters are separated by comma (,)			
				
				if (evtarray[0] === 'STATUS' && evtarray[2] === 'Ringing')
				{
					if (evtarray[5] === '1') // 1 means it is an outgoing call
					{
						//add any custom logic here, for example you might lookup the caller from a database	
						alert('Incoming call from: '+evtarray[3] + ' ' + evtarray[6]); //of course, instead of alert you should use some better html display
					}					
				}
			}

			// example for handling displayable messages
			else if (type === 'display')
			{
				var position = message.indexOf(',');
				var title = message.substring(0, position); // NOTE: title can be empty string
				var text = message.substring(position + 1);				
				alert(title+'\r\n'+text); //of course, instead of alert you should use some better html display

				//NOTE: If you wish to handle the popups yourself, then disable popups by settings "showtoasts" parameter to "false".
			}
		});
*/

function onEvent (callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.eventcb.push(callback);
}


/** Returns the current global status ("best" line status). 
 * The possible returned texts are the same like for notifications: getEvenets
 * This is NOT a callback, you have to call it every time you want to receive the status. 
 */
function getStatus ()  // string
{
    if (typeof (webphone_api.plhandler) === 'undefined' || webphone_api.plhandler === null)
        return "STATUS,-1,Initializing";
    else
        return webphone_api.plhandler.GetStatus();
}

/** Old, legacy, deprecated method; use onAppStateChange instead ("loaded" state).
 */
function onLoaded (callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.loadedcb.push(callback);
}

/**
 * Old, legacy, deprecated method; use onAppStateChange instead  ("started" state).
 */
function onStart(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.startcb.push(callback);
}


/** The onEvents is only for low level status messages. For the usual status management you should use the onXXX (for example the onCallStateChange callbacks). Example: call onEvents() function passing a callback
 * Deprecated!  Use onEvent instead ("event" type)!
*/
function onEvents(callback){if(!callback||typeof(callback)!=='function'){return;}webphone_api.evcb.push(callback);}

/** FCM Push Notifications config: this is relevant only if you are using push notifications
*/
var config = { // also defined in firebase-messaging-sw.js
    apiKey: "AIzaSyCREU-8xSHkP093-OrE7dSouPYa5lwI380",
    authDomain: "voippush-da64b.firebaseapp.com",
    databaseURL: "https://voippush-da64b.firebaseio.com",
    projectId: "voippush-da64b",
    storageBucket: "voippush-da64b.appspot.com",
    messagingSenderId: "191412546148"
  };

//***************** public API END *********************

function LogEx(msg, err) { if (typeof (msg) === 'undefined' || msg === null) { return; } if (typeof (err) !== 'undefined' || err !== null) { if(msg.indexOf('ERROR') == 0) msg = msg + ' ' + err; else msg = 'ERROR,' + msg + ' ' + err; } webphone_api.Log(msg); };
function Log(msg) { if (webphone_api.parameters && (webphone_api.parameters['logtoconsole'] == 'false' || webphone_api.parameters['logtoconsole'] == false)) { return; } if (typeof (msg) === 'undefined' || msg === null || msg.length < 1) { return; } if (typeof (console) !== 'undefined' && console !== null && typeof (console.log) !== 'undefined' && console.log !== null) { if (typeof (console.error) !== 'undefined' && console.error !== null && (msg.toLowerCase()).indexOf('error') > -1) { console.error(msg); } else { console.log(msg); } } }

function addtoqueue(name, arguments)
{
    if (typeof (webphone_api) === 'undefined' || webphone_api === null) return false;
    if (typeof (webphone_api.helper) === 'undefined' || webphone_api.helper === null) return false;
    if (typeof (webphone_api.helper.AddToQueue) === 'undefined' || webphone_api.helper.AddToQueue === null) return false;
    return webphone_api.helper.AddToQueue(name, arguments);
}

var isnotsdkcache = false;
function IsSDK() // must be used because webphone_api.parameters.issdk might be converted from boolean to string (so all the IF comparisons will fail)
{
    try{
        if(webphone_api && webphone_api.common && typeof(webphone_api.common) !== 'undefined') return webphone_api.common.IsSDK();

        var tmp = null;
        if (window && typeof(window.pageissdk) !== 'undefined' && window.pageissdk !== null
            && (window.pageissdk == 'false' || window.pageissdk == false || window.pageissdk == true || window.pageissdk == 'true')
           )
        {
            if(typeof(window.pageissdk) !== 'undefined' && window.pageissdk !== null && window.pageissdk === 'false') tmp = false;
            else if(typeof(window.pageissdk) !== 'undefined' && window.pageissdk !== null && window.pageissdk === 'true') tmp = true;
            else tmp = window.pageissdk;
            if(!tmp) isnotsdkcache = true;
        }

        if ((tmp === null || typeof (tmp) === 'undefined') && webphone_api.parameters)
        {
            tmp = webphone_api.parameters.issdk;
        }

        if ((tmp === null || typeof (tmp) === 'undefined') || tmp == true || tmp == 'true' || tmp.length < 1) { return true; }
    } catch(err) {  LogEx('ERROR, IsSDKw: ', err); }
    return false;
}

/** Internal setline */
function mysetline (line)
{
    if (typeof (webphone_api.plhandler) !== 'undefined' && webphone_api.plhandler !== null)
        webphone_api.plhandler.SetLine(line, true);
}


function LoadScriptFile (url, callback, errorcallback) // used instead of document.write
{
    try{
        //console.log('LoadScriptFile url: ' + url);
        if (typeof (url) === 'undefined' || url === null || url.length < 3)
        {
            Log('ERROR, LoadScriptFile: invalid file url: ' + url);
            if (typeof(errorcallback) === 'function')
            {
                errorcallback();
            }
            else if (typeof(callback) === 'function')
            {
                callback();
            }
            return;
        }

        if(url.indexOf("js/lib/jquery.mobile-") >= 0)
        {
            if (IsSDK() === true)
            {
                //if(callback && typeof (callback) !== 'undefined')
                //Log('EVENT, ignore script jqm');
                if (typeof(callback) === 'function')
                {
                    callback();
                }
                return;
            }
            else
            {
                //Log('EVENT, load script jqm');
            }
        }

        var head = document.getElementsByTagName("head")[0];
        if (typeof (head) === 'undefined' || head === null)
        {
            head = document.getElementsByTagName("body")[0];
            if (typeof (head) === 'undefined' || head === null) head = document.getElementsByTagName("div")[0];
            if (typeof (head) === 'undefined' || head === null) head = document.getElementsByTagName("p")[0];
            if (typeof (head) === 'undefined' || head === null) head = document.getElementsByTagName("a")[0];
            if (typeof (head) === 'undefined' || head === null) {
                Log('ERROR, LoadScriptFile: document does not have a HEAD section');
                if (typeof(errorcallback) === 'function')
                {
                    errorcallback();
                }
                return;
            }
        }
        var script = null;
        if (url.toLowerCase().indexOf('.css') > url.length - 5)
        {
            script = document.createElement("link");
            script.href = url;
            script.rel = 'stylesheet';
        }else
        {
            if (typeof(webphone_api.jscodeversion) !== 'undefined' && webphone_api.jscodeversion !== null && webphone_api.jscodeversion.length > 0 && url.indexOf('jscodeversion=') < 0)
            {
                if (url.indexOf('?') > 0)
                {
                    url = url + '&jscodeversion=' + webphone_api.jscodeversion.toString();
                }else
                {
                    url = url + '?jscodeversion=' + webphone_api.jscodeversion.toString();
                }
            }

            script = document.createElement('script');
            script.src = url;
            script.type = 'text/javascript';
        }

        head.appendChild(script);

        if (script.readyState)  //IE
        {
            script.onreadystatechange = function()
            {
                if (script.readyState == "loaded" || script.readyState == "complete")
                {
                    script.onreadystatechange = null;
                    if (typeof(callback) === 'function')
                    {
                        //head.appendChild(script);
                        callback();
                    }
                }
            };
        }else //Other browsers
        {  
            script.onload = function()
            {
                if (typeof(callback) === 'function')
                {
                    //head.appendChild(script);
                    callback();
                }
            };

            script.onerror = function()
            {
                Log('ERROR, LoadScriptFile: error loading file: ' + url);
                if (typeof(errorcallback) === 'function')
                {
                    errorcallback();
                }
                else if (typeof(callback) === 'function')
                {
                    callback();
                }
            };
        }
        //head.appendChild(script);
        return;
    } catch(err) { LogEx('ERROR, LoadScriptFile: ', err); }
    try{
        if (typeof(errorcallback) === 'function')
        {
            errorcallback();
        }
    } catch(err) { LogEx('ERROR, LoadScriptFileEx: ', err); }
}

try{
// get jscodeversion
var jscodeversion = '1';
var allscripts = document.getElementsByTagName('script');
if (typeof(allscripts) !== 'undefined' && allscripts !== null && allscripts.length > 0)
{
    var thisScript = allscripts[allscripts.length - 1];
    if (typeof(thisScript) !== 'undefined' && thisScript !== null && typeof(thisScript.src) !== 'undefined' && thisScript.src !== null
            && thisScript.src.length > 0 && thisScript.src.indexOf('webphone_api.js') >= 0 && thisScript.src.indexOf('jscodeversion=') > 0)
    {
        var currver = thisScript.src.substring(thisScript.src.indexOf('jscodeversion=') + 14);
        if (typeof(currver) !== 'undefined' && currver !== null)
        {
            if (currver.indexOf('&') > 0) { currver = currver.substring(0, currver.indexOf('&')); }
            if (currver.indexOf('#') > 0) { currver = currver.substring(0, currver.indexOf('#')); }
            if (currver.indexOf('/') > 0) { currver = currver.substring(0, currver.indexOf('/')); }
            if (currver.indexOf('?') > 0) { currver = currver.substring(0, currver.indexOf('?')); }
            if (typeof(currver) === 'undefined' || currver === null) { currver = ''; }
            currver = currver.toString();
            currver = currver.replace(' ', ''); currver = currver.replace(' ', '');

            if (currver.length > 0)
            {
                jscodeversion = currver;
            }
        }
    }
}
} catch(err) { }


var wphone = {
    onEvent: onEvent,
    getStatus: getStatus,
    onAppStateChange: onAppStateChange,
    onRegStateChange: onRegStateChange,
    onCallStateChange: onCallStateChange,
    onLoaded: onLoaded,
    onStart: onStart,
    onChat: onChat,
    onSMS: onSMS,
    onCdr: onCdr,
    onDTMF: onDTMF,
    start: start,
    stop: stop,
    register: register,
    registerex: registerex,
    call: call,
    videocall: videocall,
    mutevideo: mutevideo,
    setvideodisplaysize: setvideodisplaysize,
    screenshare: screenshare,
    stopscreenshare: stopscreenshare,
    hangup: hangup,
    accept: accept,
    reject: reject,
    ignore: ignore,
    getlinedetails: getlinedetails,
    getavailablecallfunc: getavailablecallfunc,
    getlastcalldetails: getlastcalldetails,
    getregfailreason: getregfailreason,
    play: play,
    forward: forward,
    conference: conference,
    transfer: transfer,
    dtmf: dtmf,
    mute: mute,
    ismuted: ismuted,
    hold: hold,
    isonhold: isonhold,
    sendchat: sendchat,
    sendsms: sendsms,
    getcallerdisplayfull: getcallerdisplayfull,
    voicerecord: voicerecord,
    devicepopup: devicepopup,
    getdevicelist: getdevicelist,
    getdevice: getdevice,
    setdevice: setdevice,
    setvolume: setvolume,
    getvolume: getvolume,
    setloudspeaker: setloudspeaker,
    addcontact: addcontact,
    deletecontact: deletecontact,
    getcontact: getcontact,
    listcontacts: listcontacts,
    listcallhistory: listcallhistory,
    setparameter: setparameter,
    getparameter: getparameter,
    isregistered: isregistered,
    isincall: isincall,
    unregister: unregister,
    
    setline: setline,
    getline: getline,
    linetocallid: linetocallid,
    callidtoline: callidtoline,
    checkpresence: checkpresence,
    setpresencestatus: setpresencestatus,
    onPresenceStateChange: onPresenceStateChange,
    onBLFStateChange: onBLFStateChange,
    checkblf: checkblf,
    isencrypted: isencrypted,
    setsipheader: setsipheader,
    getsipheader: getsipheader,
    getsipmessage: getsipmessage,
    changetheme: changetheme,
    getworkdir: getworkdir,
    delsettings: delsettings,
    getenginename: getenginename,
    getlastrecinvite: getlastrecinvite,
    getlastsentinvite: getlastsentinvite,
    addtoqueue: addtoqueue,

    getlogs: getlogs,
    jvoip: jvoip,
    LoadScriptFile: LoadScriptFile,
    parameters: parameters,
    config: config,
    eventcb: [],
    evcb: [],
    loadedcb: [],
    startcb: [],
    appstatechangecb: [],
    regstatechangecb: [],
    displaycb: [],
    stopcb: [],
    registeredcb: [],
    unregisteredcb: [],
    registerfailedcb: [],
    callstatechangecb: [],
    chatcb: [],
    smscb: [],
    presencecb: [],
    blfcb: [],
    cdrcb: [],
    cddtmf: [],
    logcb: [],
    Log: Log,
    LogEx: LogEx,
    onEvents: onEvents,
    jscodeversion: jscodeversion
};
return wphone;
})();
window.webphone_api = webphone_api;

webphone_api.bd_logged = false;webphone_api.getbasedir2 = function (forceauto)
{try{if (forceauto !== true){var wpbdir = webphone_api.parameters['webphonebasedir'];if (typeof(wpbdir) === 'undefined' || wpbdir === null || wpbdir === '.' || wpbdir.length < 2) { wpbdir = ''; }wpbdir = wpbdir.toString(); try{ wpbdir = wpbdir.replace(/^\s+|\s+$/g, ''); } catch(err) { ; }if (wpbdir.indexOf('/') === 0) { wpbdir = wpbdir.substring(1); }if (wpbdir.length > 1 && wpbdir.lastIndexOf('/') < wpbdir.length - 1){wpbdir = wpbdir + '/';}if (wpbdir && wpbdir.length > 0){if (webphone_api.bd_logged !== true){try{if (webphone_api.parameters['logtoconsole'] != 'false' && webphone_api.parameters['logtoconsole'] != false) {console.log('base diectory - webphonebasedir(helper): ' + wpbdir);}} catch(err){ }}webphone_api.bd_logged = true;return wpbdir;}}
var scriptElements = document.getElementsByTagName('script');if(scriptElements){for (var i = 0; i < scriptElements.length; i++){wpbdir = scriptElements[i].src;if (wpbdir && wpbdir.indexOf('webphone_api.js') > -1){wpbdir = wpbdir.substring(0, wpbdir.indexOf('webphone_api.js'));if (webphone_api.bd_logged !== true){try{if (webphone_api.parameters['logtoconsole'] != 'false' && webphone_api.parameters['logtoconsole'] != false) {console.log('base diectory - webphonebasedir(guessed): ' + wpbdir);}} catch(err){ }}webphone_api.bd_logged = true;return wpbdir;}}}}catch(err) { try{console.log('ERROR, webphone_api getbasedir2');} catch(err2) { ; } }return '';};
webphone_api.LoadScriptFile(webphone_api.getbasedir2() + 'webphone_config.js', function () { webphone_api.LoadScriptFile(webphone_api.getbasedir2() + 'js/lib/api_helper.js', function () { });  });

//document.write('<script type="text/javascript" src="' + webphone_api.getbasedir2() + 'js/lib/api_helper.js"></script>');
