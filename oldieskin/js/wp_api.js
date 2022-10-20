/*****************************  Webphone Javascript API Docummentation  *****************************************
*																												*
*	Always put the webphone's html code in a <div> element with id="webphone_bg_container"						*																			*																												*
*	isFullyCustomized // set to true if not using Mizutech built skins											*
*																												*
*	boolean wp_api.Start()	// if no parameters passed, phone is started (loaded)								*
*	boolean wp_api.Start(user, pwd)	// phone is started (loaded), and passed Voip account is registered			*
*	boolean wp_api.Stop() // unregister acount from Voip server													*
*																												*
*	boolean wp_api.Register(user, pwd)	// register Voip account												*
*	wp_api.ReceiveEvents() // Notifications (status updates, events, etc) are received from the webphone		*
*																												*
*	boolean wp_api.Call()			// call destination number													*
*	boolean wp_api.Hangup()			// hangup call																*
*	boolean wp_api.Accept()			// accept incoming call														*
*	boolean wp_api.Reject()			// reject incoming call														*
*	boolean wp_api.Hold(holdVal)		// set parameter to true for hold and false to reload					*
*	boolean wp_api.Mute(muteVal)		// mute speaker and mic; set parameter to true for mute and false to unmute	*
*	boolean wp_api.Voicemail(voicemailNumber)	// call voicemail number										*
*	boolean wp_api.CallTransfer()	// call transfer; popup to enter destination number							*
*	boolean wp_api.Chat(peer)		// Open chat form. Peer can be a SIP user or extension number or empty		*
*	boolean wp_api.Redial()			// redial last dialed unmber												*
*	boolean wp_api.AudioDevice()		// bring up audio settings window										*
*	boolean wp_api.SendDtmf(dtmfVal) // send dtmf																*
*																												*
*****************************************************************************************************************/

var wp_api = function ( )
{
// private members and methods
var waitForPageloadCount = 0;

// public interface
return {
	attributes: {},
	parameters: {},
	
	isFullyCustomized: false,	// set to true if not using Mizutech built skins

/*---------------------- Customization options available for Mizutech built skins ----------------------*/

// used for custom webphone skins only
	isIphoneSkin: false,		// if iPhone skin is used
	isMultiLineSkin: false,		// set to true only for Multiline skin
	nrOfLines: 4,				//  number of lines for Multiline skin
	isClick2Call: false,		//  set to true for click 2 call skin

	haveloginpage: false,
	
	brandname: '',
	company_webpage: '',
	
	background_color: '',		// webphone background color	
	general_text_color: '',		// general text color
	
	button_color: '',			// button color
	button_text_color: '',		// button text color
	
	status_text_color: '',		// color of displayed status messages
	
	webphone_width: 256,				// width of webphone in pixels - don't specify measurement unit
	webphone_height: 408,
	
// used for click 2 call only
	username: '',
	password: '',
	md5: '',
	
	realm: '',
    destination_number: '',
	
	call_button_text: 'Call',
	hangup_button_text: 'Hangup',
	button_width: 100,
	
// used for both, custom webphone skins and click 2 call

	call_button_color: '',		// call button color
	hangup_button_color: '',	// hangup button color
	
	
/*---------------------- Webphone API available for building own customized GUI ----------------------*/
	ReceiveEvents: function (evnt)
	{
		;
	},

	Start: function (user, pwd)
	{
		if (!wp_common.isWebpageLoaded && waitForPageloadCount < 100) // waiting for the HTML page to load
		{
			waitForPageloadCount++;
			setTimeout(function(){ wp_api.Start(user, pwd) }, 100);
		}else
		{
			waitForPageloadCount = 0;
		
			if (typeof(user) !== 'undefined' && user !== null && user.length > 0
				&& typeof(pwd) !== 'undefined' && pwd !== null && pwd.length > 0)
			{
				return wp_common.wp_LoadAppletAndRegisterParam(user, pwd);
			}else
			{
				return wp_common.wp_LoadApplet();
			}
		}
	},
	
	Register: function (user, pwd)
	{
		if (typeof(user) === 'undefined' || user === null || user.length < 1
			|| typeof(pwd) === 'undefined' || pwd === null || pwd.length < 1)
		{
			return false;
		}
		
		return wp_common.wp_Register(user, pwd);
	},
	
	Stop: function ()
	{
		return wp_common.wp_Unregister();
	},
	
	Call: function (number)
	{
		return wp_common.wp_Call(number);
	},
	
	Hangup: function ()
	{
		return wp_common.wp_Hangup();
	},
	
	Accept: function ()
	{
		return wp_common.wp_Accept();
	},
	
	Reject: function ()
	{
		return wp_common.wp_Reject();
	},
	
	Hold: function (holdVal)
	{
		return wp_common.wp_Hold(holdVal);
	},
	
	Mute: function (muteVal)
	{
		return wp_common.wp_Mute(muteVal);
	},
	
	Voicemail: function (voicemailNumber)
	{
		return wp_common.wp_Voicemail(voicemailNumber);
	},
	
	CallTransfer: function ()
	{
		return wp_common.wp_CallTransfer();
	},
	
	Chat: function (peer)
	{
		return wp_common.wp_Chat(peer);
	},
	
	Redial: function ()
	{
		return wp_common.wp_Redial();
	},
	
	AudioDevice: function ()
	{
		return wp_common.wp_AudioDevice();
	},
	
	SendDtmf: function (dtmfVal)
	{
		return wp_common.SendDtmf(dtmfVal);
	}
}
}( );
