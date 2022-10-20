var wp_common = function ( )
{
// private members and methods

var dtmfDelay = 8000;			//	how long(in ms) sent DTMF should be displayed after last DTMF sending
var cookieExpire = 365;			//	cookies Expire after 'value' days			
var eventDisplayTime = 5000;	//  time(in ms) an event should be displayed	
var veryLowCredit = 1;			//	treshold -> if credit less then 'value', appears in red	
var lowCredit = 3;				//	treshold -> if credit less then 'value', appears in white	
var reRegisterTime = 300000;	//	calls API_Register() every "reRegisterTime" miliseconds (5 min)
var pollingTimerIval = 400;     //	time interval (in ms) at which API_Getstatus() / API_Poll is called
var api_key = '';

var applethandle = null;
var webphoneStatus = null;
var checkCall;	//verify if in call
var checkDTMF;	//verify if sending DTMF
var alertTimerId;
var eventAlertTimerId;
var hold;
var redial;
var mute;
var realCredit;
var DTMFcount;
var callLengthTimerId;	//timer id for calculating call length
var boolCallLengthTimer;
var boolRingTimer;
var callStartTime;
var callLengthInSec;
var boolIncommingCall;	//	true if having incomming call
var currentPage;
var testFocused;
var waitForWebphoneCount;
var appletLoadedBool;	// verify if applet loaded
var isAppletLoaded;		// used in new version
var serverInitBool;		// verify API_ServerInit()
var boolReRegister;
var remoteHold;
var timerDisplayRinging;
var phoneNumberFieldValue;
var strTime;
var trialVersionDisplay;
var voicemailNr;
//var wp_api.webphone_width;	// WJSAPI_CallHangup() , when only one button is used for call and hangup
var isGetLine;              // wehter to call API_GetLine()
var globalStatus;
var isRegistered;           // used for click 2 call
var callApiRegister;		// if true, API_Register() will be called, else the webphone will automatically register


var isWebphoneToJsCalled;
var webphoneToJsCalledNr;
var checkIfPollingTierId;
var pollingTierId;
var getLineTimerId;

var lineStatus; // status for every line
var callType;   // call type for every line (Incoming / Outgoing)
var isFirstStart;
var recordingStatus; // status of recording; if true -> recoding enabled
var callercalled; // other party caller id (username) -> used for displaying it instead of credit/my username
var checkmaxloop = 0; // stop getting line status if can't get the applet handle
/*
function Log (msg)
{alert(wp_common.logElement);
	if (typeof(wp_common.logElement) !== 'undefined' && wp_common.logElement !== null)
	{
		wp_common.logElement.innerHTML += '<br />' + msg;
	}
}*/
function Trim(str)
{
    try{
    if (isNull(str) || str.lenght < 1) { return ''; }
    
    return str.replace(/^\s+|\s+$/g, ''); 
    
    } catch(err) {  }
    
    return str;
}

function isNull (variable)
{
    if (typeof (variable) === 'undefined' || variable === null)
    {
        return true;
    }else
    {
        return false;
    }
    
    return true;
}

//##NEW
function PassParameters()
{
    if (!isNull(wp_api.parameters))
    {
        for (var p in wp_api.parameters)
        {
            if (!isNull(p) && p.length > 0 && !isNull(wp_api.parameters[p]))
            {
                webphone_api.parameters[p] = wp_api.parameters[p];
            }
        }
    }
}

// public interface
return {

	currLine: 1,
	isWebpageLoaded: false,
	//logElement: document.getElementById('testtest'), // used for debugging, log messages to a html element

atload: function ()	//	function called on page load
{
	wp_common.init();
},

init: function ()	//	function to initialize all variables, called only on page load
{
    //##NEW
    webphone_api.onEvent(function (type, evt)
    {
		if (type === 'event')
		{
			wp_common.webphonetojsCommon(evt);
		}
    });
    // also pass webphone parameters
    PassParameters();
    
    
    
    
    
    // display error message if JavaScript is disabled
    if (document.getElementById('js_not_enabled') != null)  document.getElementById('js_not_enabled').style.display = 'none';
	
	// add trim functionality to the String object (mostly for IE)
	if(typeof String.prototype.trim !== 'function')
	{
		String.prototype.trim = function()
		{
			return this.replace(/^\s+|\s+$/g, ''); 
		}
	}
	
	// show warning message if webphone is started locally
	try{
		var pageUrl = window.location.href;
		if (typeof(pageUrl) !== 'undefined' && pageUrl !== null && (pageUrl.toLowerCase()).indexOf("file:///") >= 0)
		{
                        pageUrl = decodeURIComponent(pageUrl);
			var archive = wp_api.attributes['archive'];
			if (typeof(archive) !== 'undefined' && archive !== null) { archive = archive.toLowerCase(); }

			if (archive.indexOf("http://") < 0 && archive.indexOf("https://") < 0)
			{
                console.log('WARNING, The webphone should be hosted on a webserver. It may not work if launched from your filesystem.')
			}
		}
	}catch (e) {  }
    
	//##try{wp_api.isFullyCustomized = wp_api.wp_api.isFullyCustomized}catch (e) {wp_api.isFullyCustomized = false;}

    wp_common.currLine = 1;

	currentPage = 0;
	waitForWebphoneCount = 0;
	appletLoadedBool = false;
	remoteHold = false;

	checkCall = false;
	checkDTMF = false;
	hold = false;
	redial = '';
	mute = false;
	realCredit = '';
	DTMFcount = 0;
	wp_common.btnStatusControl('btn_hangup', 1, 'hangup');
	boolCallLengthTimer = true;
	boolRingTimer = true;
	boolIncommingCall = false;
	callLengthInSec = 0;
	testFocused = false;
	trialVersionDisplay = false;
	
	isWebphoneToJsCalled = false;
	webphoneToJsCalledNr = 0;
	voicemailNr = '';
	wp_common.callhangup_isInCall = false;
	isAppletLoaded = false;
    globalStatus = '';
    isRegistered = false;
	//callhangup_isInCall = false;		// WJSAPI_CallHangup() , when only one button is used for call and hangup
	
    lineStatus = new Array(wp_api.nrOfLines);
    callType = new Array(wp_api.nrOfLines);
	isFirstStart = true;
	recordingStatus = false;
	callercalled = '';

	var startTmp = wp_common.readCookie('MZwebPhoneIsFirstStart'); // on first start display applet in full size
	if (typeof(startTmp) !== 'undefined' && startTmp !== null && startTmp === 'false')
	{
		isFirstStart = false;
	}

    for (var i = 0; i < wp_api.nrOfLines; i++)
    {
        lineStatus[i] = '';
        callType[i] = '';
    }
    
	var usrField = document.getElementById('username_input');	//get user and password from cookies 
	var pwdField = document.getElementById('password_input');	//if it was saved
	var saveSettings = document.getElementById('savesettings');
    
    var lickeyField = document.getElementById('license_key_input');
    var srvaddrField = document.getElementById('server_address_input');
	
	
//get saved user and passw from cookies
	var usr = wp_common.readCookie('MZwebPhoneUsr');
	var pwd = wp_common.readCookie('MZwebPhonePassw');

	if (usrField !== null && typeof(usr) !== 'undefined' && usr !== null && (usr.trim()).length  > 0
		&& pwdField !== null && typeof(pwd) !== 'undefined' && pwd !== null && (pwd.trim()).length  > 0)
	{
		usrField.value = usr;
		pwdField.value = pwd;
		if (saveSettings !== null) {saveSettings.checked = true; }
	}
	

    var lickey = wp_common.readCookie('MZwebPhoneLicKey');

    if (lickeyField !== null && typeof(lickey) !== 'undefined' && lickey !== null && (lickey.trim()).length > 0
		&& saveSettings !== null && saveSettings.checked === true)
    {
        lickeyField.value = lickey.trim();
    }
	
	
	var srvaddr = wp_common.readCookie('MZwebPhoneSrvAddr');

    if (srvaddrField !== null && typeof(srvaddr) !== 'undefined' && srvaddr !== null && (srvaddr.trim()).length > 0
		&& saveSettings !== null && saveSettings.checked === true)
    {
        srvaddrField.value = srvaddr.trim();
    }
    
	boolReRegister = null;
	timerDisplayRinging = false;
//	wp_common.reRegister();

//	try{
//    if (!wp_api.isClick2Call)
//    {
//        if (wp_api.haveloginpage)
//        {
//            wp_common.pages(1);
//        }else
//        {
//            wp_common.pages(2);
//        }
//    }
//	}catch(e) { wp_common.pages(1); }

	wp_common.GetParametersFromCookies();
	wp_common.GetParametersFromUrl();
	
	if (wp_api.isFullyCustomized)
	{
		wp_api.isIphoneSkin = false;
	}
	
	if (!wp_api.isIphoneSkin)
	{
		if (!wp_api.isFullyCustomized)
		{
			wp_layout.ApplyCustomSkin();
		}
	}else
	{
		wp_api.isMultiLineSkin = false;
	}
	
	if (wp_api.isMultiLineSkin == true) { wp_layout.ManageLines(); }
	
	phoneNumberFieldValue = 'Enter number';
	if (document.getElementById('PhoneNumber') != null)   document.getElementById('PhoneNumber').value = phoneNumberFieldValue;
	var callButtons = document.getElementById('callbuttons');
	var acceptReject = document.getElementById('acceptreject');
	if (callButtons != null)	callButtons.style.display = 'inline-block';
	if (acceptReject != null)	acceptReject.style.display = 'none';

// automatically load webphone and register if haveloginpage != true or username and password are set
	var usrReg = wp_api.parameters['username'];
	var pwdReg = wp_api.parameters['password'];
	var md5Reg = wp_api.parameters['md5'];
	
	if (wp_api.haveloginpage !== true && typeof(usrReg) !== 'undefined' && usrReg !== null && (usrReg.trim()).length > 0
		&& ((typeof(pwdReg) !== 'undefined' && pwdReg !== null && (pwdReg.trim()).length > 0) 
			|| (typeof(md5Reg) !== 'undefined' && md5Reg !== null && (md5Reg.trim()).length > 0)) )
	{
		callApiRegister = true;
		wp_common.wp_LoadAppletAndRegister();
		wp_common.pages(2);
	}else
	{
		wp_common.pages(1);
	}
	
	// for the webphone to be aligned on the center of the page
	var withTemp = wp_api.webphone_width + 10;
	if (document.getElementById('main') !== null) { document.getElementById('main').style.width = withTemp + 'px'; }
	
	wp_common.isWebpageLoaded = true;
},
GetParametersFromCookies: function () // get applet parameters and settings from cookies if exists
{
	var tempVal = '';

	tempVal = wp_common.readCookie('wp_serveraddress');
	if (typeof(tempVal) !== 'undefined' && tempVal !== null && tempVal.trim().length > 0)
	{
		wp_api.parameters['serveraddress'] = tempVal.trim();
	}
	
	tempVal = wp_common.readCookie('wp_username');
	if (typeof(tempVal) !== 'undefined' && tempVal !== null && tempVal.trim().length > 0)
	{
		if (document.getElementById('username_input') !== null) { document.getElementById('username_input').value = tempVal.trim(); }
		wp_api.parameters['username'] = tempVal.trim();
	}
	
	tempVal = wp_common.readCookie('wp_password');
	if (typeof(tempVal) !== 'undefined' && tempVal !== null && tempVal.trim().length > 0)
	{
		if (document.getElementById('password_input') !== null) { document.getElementById('password_input').value = tempVal.trim(); }
		wp_api.parameters['password'] = tempVal.trim();
	}
	
	tempVal = wp_common.readCookie('wp_haveloginpage');
	if (typeof(tempVal) !== 'undefined' && tempVal !== null && tempVal.trim().length > 0)
	{
		tempVal = tempVal.trim();
		wp_api.haveloginpage = (tempVal.toLowerCase() === 'true'); // convert string to boolean
	}
	
	tempVal = wp_common.readCookie('wp_brandname');
	if (typeof(tempVal) !== 'undefined' && tempVal !== null && tempVal.trim().length > 0)
	{
		wp_api.brandname = tempVal.trim();
	}
	
	tempVal = wp_common.readCookie('wp_company_webpage');
	if (typeof(tempVal) !== 'undefined' && tempVal !== null && tempVal.trim().length > 0)
	{
		wp_api.company_webpage = tempVal.trim();
	}
	
	tempVal = wp_common.readCookie('wp_md5');
	if (typeof(tempVal) !== 'undefined' && tempVal !== null && tempVal.trim().length > 0)
	{
		wp_api.parameters['md5'] = tempVal.trim();
	}
	
	tempVal = wp_common.readCookie('wp_realm');
	if (typeof(tempVal) !== 'undefined' && tempVal !== null && tempVal.trim().length > 0)
	{
		wp_api.parameters['realm'] = tempVal.trim();
	}
	
	tempVal = wp_common.readCookie('wp_directserveraddress');
	if (typeof(tempVal) !== 'undefined' && tempVal !== null && tempVal.trim().length > 0)
	{
		wp_api.parameters['directserveraddress'] = tempVal.trim();
	}
	
	tempVal = wp_common.readCookie('wp_upperserver');
	if (typeof(tempVal) !== 'undefined' && tempVal !== null && tempVal.trim().length > 0)
	{
		wp_api.parameters['upperserver'] = tempVal.trim();
		
		if ( typeof(wp_api.parameters['directserveraddress']) === 'undefined' || wp_api.parameters['directserveraddress'] === null)
		{
			wp_api.parameters['directserveraddress'] = tempVal.trim();
		}
	}
},
GetParametersFromUrl: function ()	// get applet parameters and settings from URL
{

	var url = window.location.href;
	if (typeof(url) === 'undefined' || url === null || url.length < 1) { return; }
	url = decodeURIComponent(url);
        
	var pos = url.indexOf('?');
	if (pos > 0)
	{
		url = url.substring(pos + 1, url.length);

		var tempVal = '';

		tempVal = wp_common.GetValues(url, 'serveraddress');
		if (tempVal !== null && tempVal.length > 0) { wp_api.parameters['serveraddress'] = tempVal; }

		tempVal = wp_common.GetValues(url, 'username');
		if (tempVal !== null && tempVal.length > 0)
		{
			if (document.getElementById('username_input') !== null) { document.getElementById('username_input').value = tempVal; }
			wp_api.parameters['username'] = tempVal;
		}

		tempVal = wp_common.GetValues(url, 'password');
		if (tempVal !== null && tempVal.length > 0)
		{
			if (document.getElementById('password_input') !== null) { document.getElementById('password_input').value = tempVal; }
			wp_api.parameters['password'] = tempVal;
		}

		tempVal = wp_common.GetValues(url, 'haveloginpage');
		if (tempVal !== null && tempVal.length > 0)
		{
			tempVal = tempVal.trim();
			wp_api.haveloginpage = (tempVal.toLowerCase() === 'true');
		}
		
		tempVal = wp_common.GetValues(url, 'brandname');
		if (tempVal !== null && tempVal.length > 0) { wp_api.brandname = tempVal; }
		
		tempVal = wp_common.GetValues(url, 'company_webpage');
		if (tempVal !== null && tempVal.length > 0) { wp_api.company_webpage = tempVal; }
		
		tempVal = wp_common.GetValues(url, 'md5');
		if (tempVal !== null && tempVal.length > 0) { wp_api.parameters['md5'] = tempVal; }
		
		tempVal = wp_common.GetValues(url, 'realm');
		if (tempVal !== null && tempVal.length > 0) { wp_api.parameters['realm'] = tempVal; }
		
		tempVal = wp_common.GetValues(url, 'callto');
		if (tempVal !== null && tempVal.length > 0) { wp_api.destination_number = tempVal; }
		
		tempVal = wp_common.GetValues(url, 'directserveraddress');
		if (tempVal !== null && tempVal.length > 0) { wp_api.parameters['directserveraddress'] = tempVal; }
		
		tempVal = wp_common.GetValues(url, 'upperserver');
		if (tempVal !== null && tempVal.length > 0)
		{
			wp_api.parameters['upperserver'] = tempVal;
			
			if ( typeof(wp_api.parameters['directserveraddress']) === 'undefined' || wp_api.parameters['directserveraddress'] === null)
			{
				wp_api.parameters['directserveraddress'] = tempVal;
			}
		}
	}
},
GetValues: function (url, param) // get paramater values
{
	if (typeof(param) === 'undefined' || param === null || param.length < 1) { return ''; }
	param = param.trim();

	if (param.indexOf('wp_') === 0) { param = param.substring(param.indexOf('wp_') + 3, param.length); }
	
	var pos = url.indexOf(param);
	if (pos >= 0)
	{
		url = url.substring(pos + 3, url.length);
	
		pos = url.indexOf('&');
		if (pos < 0) { pos = url.length; }
	
		url = url.substring(url.indexOf('=') + 1, pos);

		return url;
	}
	return '';
},
onLogin: function ()	//	reset afferent variables when registering: voipRegiste(), voipStatusRegiste()
{
	hold = false;
	mute = false;
	DTMFcount = 0;
	boolCallLengthTimer = true;
	boolRingTimer = true;
	boolIncommingCall = false;
	callLengthInSec = 0;
},
onCallInit: function ()
{
},
onCallConnected: function ()	
{
},
onCallFinished: function ()	//	reset afferent variables when call finished
{
	hold = false;
	mute = false;
	DTMFcount = 0;
	boolCallLengthTimer = true;
	boolRingTimer = true;
	boolIncommingCall = false;
	callLengthInSec = 0;
},
getURLParameters: function ()	// gets parameters from URL in case login page is not used
{
	var params = new Array();
	var url = window.location.href;
        url = decodeURIComponent(url);
	try {url = url.slice(url.indexOf('?')+1, url.length);} catch (e) { }

	var index = 1;
	var i = 0;
	while (index > 0)
	{
		if (url.indexOf('&') >= 0 )
		{
			params[i] = url.slice(0,url.indexOf('='));
			params[i+1] = url.slice(url.indexOf('=')+1,url.indexOf('&'));
			url = url.slice(url.indexOf('&')+1, url.length);
			i = i + 2;
		}else
		{
			params[i] = url.slice(0,url.indexOf('='));
			params[i+1] = url.slice(url.indexOf('=')+1,url.length);
			index--;
		}
	}
	return params;                  //alert(params[0]+", "+params[1]+", "+params[2]);
},

noLoginRegister: function ()	//	register without login page, showing directly numpad  !!! DEPRECATED
{
        if(!wp_common.initcheck()) {return false;}
    var parameters = new Array();
	var testParameters = true;
	try {parameters = wp_common.getURLParameters();} catch(e) { }
	var srvAddr;
	var usrParam;
	var pssw;
	var md5Checksum;
	var theRealm;

	if(parameters  != null)
    {
		for (var i = 0; i < parameters.length; i++)
		{
			if (parameters[i] == null)	{testParameters = false;}
		}

		if (testParameters == true)
		{
			for (var j = 0; j < parameters.length; j = j + 2)
			{
				if (parameters[j] == 'serveraddress')	{srvAddr = parameters[j+1];}
				if (parameters[j] == 'username')		{usrParam = parameters[j+1];}
				if (parameters[j] == 'password')		{pssw = parameters[j+1];}
				if (parameters[j] == 'md5')				{md5Checksum = parameters[j+1];}
				if (parameters[j] == 'realm')			{theRealm = parameters[j+1];}
			}
		}
	}else
	{
		return false;
	}
		//applethandle.API_ServerInit(""+srvAddr+"");
		//setTimeout ( "noLoginRegister()", 300);

	if (md5Checksum.length > 2)
	{
		if (theRealm.length < 2)	{theRealm = srvAddr;}
                 
		applethandle.API_SetCredentialsMD5(""+srvAddr+"", ""+usrParam+"", ""+md5Checksum+"", ""+theRealm+"");
		applethandle.API_Register(""+srvAddr+"", ""+usrParam+"", "", "", "");
	}else
	{         
		applethandle.API_Register(""+srvAddr+"", ""+usrParam+"", ""+pssw+"", "", "");
	}
	tempUser = usrParam;tempPassw = pssw;
    return true;
},
pages: function (pageNum)	//show login page(1) or Num. Pad page(2)
{
	currentPage = pageNum;
	var pageRegister = document.getElementById('container_register');
	var pageDial = document.getElementById('container_dial');
	
	if (pageRegister != null && pageDial != null)
	{
		
		if (pageNum == 1)
		{
			pageRegister.style.display = 'inline-block';
			pageDial.style.display = 'none';
		}
		else if (pageNum == 2)
		{
			pageRegister.style.display = 'none';
			pageDial.style.display = 'inline-block';
			
			clearTimeout (checkIfPollingTierId);
			checkIfPollingTierId = setTimeout ( "wp_common.isPollingNeeded()", 2500 );
		}
	}
},
btnControl: function (id, control)	// buttons hover effect
{
	if (document.getElementById(id) == null)	return;
    
    var imgPath = document.getElementById(id).getAttribute('src');
    imgPath = imgPath.substr(0, imgPath.lastIndexOf('/') + 1);
	
	if (voicemailNr.length > 0 && id == 'btn_hold')
	{
		if (control == 1)	{document.getElementById(id).setAttribute('src',imgPath+'btn_voicemail.jpg');}
		if (control == 2)	{document.getElementById(id).setAttribute('src',imgPath+'btn_voicemail_hover.jpg');}
	}else
	{
		var ext = '';
		if ((id == 'speaker' || id == 'logout') && wp_api.isIphoneSkin == false) {ext = 'png';}else{ext = 'jpg';}
		
		if (control == 1)	{document.getElementById(id).setAttribute('src',imgPath + id+'.' + ext);}
		if (control == 2)	{document.getElementById(id).setAttribute('src',imgPath + id+'_hover.' + ext);}
	}
},
btnStatusControl: function (id, control, btn)	// call, hangup buttons hover and disabled effect
{
    if (!wp_api.isIphoneSkin)  return;
    var imgPath = document.getElementById(id).getAttribute('src');
    imgPath = imgPath.substr(0, imgPath.lastIndexOf('/') + 1);
    
	if (btn == 'call')
	{
		if (checkCall == true)
		{
			if (document.getElementById(id) != null)
			{
				document.getElementById(id).setAttribute('src',imgPath + id+'_disabled.jpg');
			}
		}else
		{
			wp_common.btnControl(id, control);
		}
	}
	else if (btn == 'hangup')
	{
		if (checkCall == true)
		{
			wp_common.btnControl(id, control);
		}else
		{
			if (document.getElementById(id) != null)
			{
				document.getElementById(id).setAttribute('src',imgPath + id+'_disabled.jpg');
			}
		}
	}
},
testFocus: function (focusTest)
{
	if (focusTest == 0)	{testFocused = false;}
	if (focusTest == 1)	{testFocused = true;}
	
	var phoneNumVal = document.getElementById('PhoneNumber');
	if (phoneNumVal.value == phoneNumberFieldValue)
	{
		phoneNumVal.value = '';
	}
},
onKeyPressEvent: function (event)
{
	var pressedKey = -1;
	if ((currentPage == 2) && (testFocused == false))
	{
		switch(event.keyCode)
		{
			case 48:pressedKey = 0;break;
			case 49:pressedKey = 1;break;
			case 50:pressedKey = 2;break;
			case 51:pressedKey = 3;break;
			case 52:pressedKey = 4;break;
			case 53:pressedKey = 5;break;
			case 54:pressedKey = 6;break;
			case 55:pressedKey = 7;break;
			case 56:pressedKey = 8;break;
			case 57:pressedKey = 9;break;
													// for numpad
			case 96:pressedKey = 0;break;
			case 97:pressedKey = 1;break;
			case 98:pressedKey = 2;break;
			case 99:pressedKey = 3;break;
			case 100:pressedKey = 4;break;
			case 101:pressedKey = 5;break;
			case 102:pressedKey = 6;break;
			case 103:pressedKey = 7;break;
			case 104:pressedKey = 8;break;
			case 105:pressedKey = 9;break;
													// backspace / delete
			case 8:pressedKey = 100;break;
			case 46:pressedKey = 200;break;
			
			case 13:wp_common.wp_Call();break;
	
			default:pressedKey = -1;
		}
		if (pressedKey != -1)	{ wp_common.wp_BtnValue(pressedKey); }
	}else
	{
		if (event.keyCode == 13)
		{
			//wp_common.wp_Call();
		}else
		{
			return false;
		}
	}
    return true;
},
wp_BtnValue: function (id)	// retrieving values of num pad buttons and sending DTMF if in call
{
	if (document.getElementById('PhoneNumber').value == phoneNumberFieldValue)
	{
		 document.getElementById('PhoneNumber').value = '';
	}

	var value;
	try
	{
		if (isNaN(id))
		{
			var id_length = id.length;
			value = id.charAt(id_length-1);
			if (id == 'btn_10') {value = '*'}
			if (id == 'btn_11') {value = '#'}
		}else
		{
			value = id.toString();
		}
	} catch (e) { }
	
	if (checkCall == true)
	{
		if ((value != 100) && (value != 200))
		{
			if(!wp_common.initcheck()) {alert('Cannot find applet handle (1) !');return false;}
			applethandle.API_Dtmf(-2,""+value+"");
			var dtmf = document.getElementById('dtmf');
			DTMFcount++;
			
			document.getElementById('credit').innerHTML = '';
			checkDTMF = true;
            if (dtmf != null)
            {
                if (dtmf.innerHTML == '')
                {
                    wp_common.displayDTMF('DTMF <strong>'+value+'</strong> sent ok: <strong>'+value+'</strong>',dtmfDelay);
                }else
                {
                    var auxString = dtmf.innerHTML;
                    if (DTMFcount > 9)
                    {
                        wp_common.displayDTMF('DTMF <strong>'+value+'</strong> sent ok: <strong>'+value+'</strong>',dtmfDelay);
                        DTMFcount = 0;
                    }else
                    {
                        auxString = auxString.replace(/DTMF <strong>\w/,'DTMF <strong>'+value);
                        wp_common.displayDTMF(auxString+'<strong>'+value+'</strong>',dtmfDelay);
                    }
                }
            }
		}
	}else
	{
		var number = document.getElementById('PhoneNumber').value;
		if (value == 100)
		{
			document.getElementById('PhoneNumber').value = number.slice(0, number.length - 1);
		}else
		{
			if (value == 200)
			{
				document.getElementById('PhoneNumber').value = '';
			}else
			{
				document.getElementById('PhoneNumber').value = number+value;
			}
		}
	}
    return true;
},
displayDTMF: function (strDTMF,delay)	// timer, displaying DTMF
{
	var dtmf = document.getElementById('dtmf');
    if (dtmf != null)	dtmf.innerHTML = strDTMF;
	clearTimeout (alertTimerId);
	alertTimerId = setTimeout ( "wp_common.hideDTMF()", delay );
},
hideDTMF: function () //	hiding DTMF
{
	checkDTMF = false;
	if (document.getElementById('dtmf') != null)    document.getElementById('dtmf').innerHTML = '';
},
isPollingNeeded: function ()
{
	if (isAppletLoaded)
	{
		if (!isWebphoneToJsCalled)
		{
			if(!wp_common.initcheck()) {/*alert('Cannot find applet handle (2) !');*/return false;}

			//applethandle.API_SetParameter("jsscriptpoll", "3")
			wp_common.pollingStatus();
		}
	}else
	{
		setTimeout ( "wp_common.isPollingNeeded()", pollingTimerIval );
	}
    return true;
},
pollingStatus: function ()
{
	var polledStatus = (applethandle.API_Poll()).trim();
	//var polledStatus = (applethandle.API_GetStatus(-2)).trim();

    wp_common.preProcessNotifications(polledStatus);

	clearTimeout (pollingTierId);
	pollingTierId = setTimeout ( "wp_common.pollingStatus()", pollingTimerIval );
},
webphonetojsCommon: function (varr)
{
	var evNot = '' + varr;
    
	if (isWebphoneToJsCalled == false)	{webphoneToJsCalledNr++;}
	if (webphoneToJsCalledNr > 1)		{isWebphoneToJsCalled = true;}
	
	wp_common.preProcessNotifications(evNot);
},
preProcessNotifications: function (eventNotif) // break notification into lines
{
    var notsep = ',NEOL \n'; // notification separator (end of line)
    var notsep2 = ',NEOL'; // notification separator (end of line)

    if (typeof(eventNotif) === 'undefined' || eventNotif === null)  {  return; }

    eventNotif = Trim(eventNotif);

    if (eventNotif.length === 0 || (eventNotif.indexOf(notsep) === eventNotif.lastIndexOf(notsep) && eventNotif.indexOf(notsep2) === eventNotif.lastIndexOf(notsep2)))
    {
        eventNotif = wp_common.CleanNotifications(eventNotif);
        
        wp_common.processNotifications(eventNotif);
	globalStatus = eventNotif;
    }else
    {
        if (eventNotif.indexOf(notsep) !== eventNotif.lastIndexOf(notsep)) // means there is more then one notification, so we have to split them
        {
            var notarray = eventNotif.split(notsep);
            
            if (!isNull(notarray) && notarray.length > 0)
            {
                for (var j = 0; j < notarray.length; j++)
                {
                    if (typeof(notarray[j]) === 'undefined' || notarray[j] === null) { continue; }

                    notarray[j] = wp_common.CleanNotifications(notarray[j]);
                    
                    wp_common.processNotifications(notarray[j]);
                    globalStatus = notarray[j];
                }
            }
        }
        else if (eventNotif.indexOf(notsep2) !== eventNotif.lastIndexOf(notsep2)) // means there is more then one notification, so we have to split them
        {
            var notarray = eventNotif.split(notsep2);
            
            if (!isNull(notarray) && notarray.length > 0)
            {
                for (var j = 0; j < notarray.length; j++)
                {
                    if (typeof(notarray[j]) === 'undefined' || notarray[j] === null) { continue; }

                    notarray[j] = wp_common.CleanNotifications(notarray[j]);

                    wp_common.processNotifications(notarray[j]);
                    globalStatus = notarray[j];
                }
            }
        }else
        {
            eventNotif = wp_common.CleanNotifications(eventNotif);
            
            wp_common.processNotifications(eventNotif);
            globalStatus = eventNotif;
        }
    }

/*    if (eventNotif.indexOf("\r\n") > 0)	// break notification into lines
    {
		var notifArray = eventNotif.split("\r\n");
		for (var i = 0; i < notifArray.length; i++)
		{
			if (notifArray[i] !== 'undefined' && notifArray[i] !== null)
			{
				notifArray[i] = notifArray[i].trim();
				notifArray[i] = notifArray[i].replace("\r\n", "");
			}
			
			if (notifArray[i] !== 'undefined' && notifArray[i] !== null && notifArray[i].length > 0) // check again after trim()
			{
				globalStatus = notifArray[i];
				wp_common.processNotifications(notifArray[i]);
			}
		}
    }else
    {
		if (typeof(eventNotif) !== 'undefined' && eventNotif !== null)
		{
			eventNotif = eventNotif.trim();
			eventNotif = eventNotif.replace("\r\n", "");
		}
		
		if (typeof(eventNotif) !== 'undefined' && eventNotif !== null && eventNotif.length > 0) // check again after trim()
		{
    	    wp_common.processNotifications(eventNotif);
			globalStatus = eventNotif;
		}
    }*/
},
CleanNotifications:function (not) // remove "WPNOTIFICATION" and "LOG"
{
    var notsep = ',NEOL \n'; // notification separator (end of line)
    var notsep2 = ',NEOL'; // notification separator (end of line)

    if (typeof(not) === 'undefined' || not === null) { not = ''; }
    
    if (not.indexOf('WPNOTIFICATION,') >= 0)
    {
        not = not.replace('WPNOTIFICATION,', '');
    }
    
    if (not.indexOf(notsep) >= 0)
    {
        not = not.substring(0, not.indexOf(notsep));
    }
    
    if (not.indexOf(notsep2) >= 0)
    {
        not = not.substring(0, not.indexOf(notsep2));
    }
    
    not = Trim(not);
    
    return not;
},
processNotifications: function (eventNotify)
{
	//document.getElementById('testtest').innerHTML += '<br>' + eventNotify;
	try{
	if (wp_api.ReceiveEvents !== 'undefined' && typeof(wp_api.ReceiveEvents) !== 'undefined' && wp_api.ReceiveEvents !== null)
	{
		wp_api.ReceiveEvents(eventNotify);
	}
	} catch (e) {  }
	
	//document.getElementById("testtest").innerHTML += "<br><span style=\"color:#000;\">" + eventNotify + "</span>";
	var callButtons = document.getElementById('callbuttons');
	var acceptReject = document.getElementById('acceptreject');
	var creditSpan = document.getElementById('credit');
    var chanelStatus = '';
    // belerakni if-be
	
//get credit from EVENT messages
	var posTmp = (eventNotify.toLowerCase()).indexOf('credit:');
	if ( posTmp >= 0)
	{
		var strCredit = ( eventNotify.slice(posTmp + 7, eventNotify.length) ).trim();
		var onlyCredit = ( eventNotify.slice(0, eventNotify.lastIndexOf(" ")) ).trim();
		var numCredit = -1000000000;
		
		try{ numCredit = parseFloat(onlyCredit); } catch (e) { }
		
		if (onlyCredit !== null && onlyCredit.length > 0)
		{
			if (numCredit < -999999999)
			{
				realCredit = strCredit;
			}
			else if (numCredit < veryLowCredit)
			{
				realCredit = strCredit.replace(onlyCredit, '<strong style="color:#ff0000">'+onlyCredit+'</strong>');
			}
			else if (numCredit < lowCredit)
			{
				realCredit = strCredit.replace(onlyCredit, '<strong>'+onlyCredit+'</strong>');
			}else
			{
				realCredit = strCredit.replace(onlyCredit, '<strong style="color:'+wp_api.status_text_color+'">'+onlyCredit+'</strong>');
			}
		}
	}else
	{
		if ((realCredit == '') && (wp_api.parameters['username'] !== null) && (wp_api.parameters['username'].length > 0))
		{
			realCredit = '<strong style="color:'+wp_api.status_text_color+'">' + wp_api.parameters['username'] + '</strong>';
		}
	}
	posTmp = -100;
	
    if (eventNotify.indexOf('STATUS') >= 0)
    {
        eventNotify = eventNotify.replace(/\s+/g,'');
        var theStatus = eventNotify.slice(eventNotify.indexOf(',') + 1, eventNotify.length);
        var statLine = theStatus.slice(0, theStatus.indexOf(','));
        
        theStatus = theStatus.slice(theStatus.indexOf(',') + 1, theStatus.length);
        
        if (theStatus.indexOf(',') > 0)
        {
            theStatus = theStatus.slice(0, theStatus.indexOf(','));
        }
        
        if (statLine == '-1')
        {
            globalStatus = theStatus;
        }
        
        if (statLine == '1')
        {
            chanelStatus = theStatus;
        }
    }
	
	if (globalStatus.indexOf('EVENT') >= 0) // workaround
	{
		globalStatus = ( globalStatus.substring( globalStatus.lastIndexOf('EVENT') + 6, globalStatus.length) ).trim();
	}
	
	// getting status
	//if(!wp_common.initcheck()) {	/*alert('Cannot find applet handle !');*/return false;}
	//globalStatus = (applethandle.API_GetStatus(-2)).replace(/\s+/g,'');   //	get global status

    if (wp_api.isMultiLineSkin && wp_api.nrOfLines > 1)
    {
        var tempStat = eventNotify.replace(/\s+/g,'');
        if (tempStat.indexOf('STATUS') >= 0)
        {
            tempStat = tempStat.substr(tempStat.indexOf(',') + 1, tempStat.length);
            
            var theLine = tempStat.substr(0, tempStat.indexOf(','));
            
            for (var i = 1; i <= wp_api.nrOfLines; i++)
            {
                if (theLine == ''+i)
                {
                    if (tempStat.indexOf('Ringing') >= 0)
                    {
                        var tempCallType = tempStat.substr(tempStat.indexOf(',') + 1, tempStat.length);
                        tempCallType = tempCallType.substr(tempCallType.indexOf(',') + 1, tempCallType.length);
                        tempCallType = tempCallType.substr(tempCallType.indexOf(',') + 1, tempCallType.length);
                        tempCallType = tempCallType.substr(tempCallType.indexOf(',') + 1, tempCallType.length);
                        tempCallType = tempCallType.substr(0, tempCallType.indexOf(','));
                        
                        callType[i - 1] = tempCallType;
                    }else
                    {
                        callType[i - 1] = '';
                    }
                    
                    //document.getElementById('testtest').innerHTML += ': '+ tempStat+'<br />';
                    tempStat = tempStat.substr(tempStat.indexOf(',') + 1, tempStat.length);
                
                    if (tempStat.indexOf(',') > 0)
                    {
                        tempStat = tempStat.substr(0, tempStat.indexOf(','));
                    }
                    lineStatus[i - 1] = tempStat;
                    
                    if (tempStat == 'Ringing' || tempStat == 'InCall' || tempStat == 'Speaking' || tempStat == 'Midcall')
                    {
                        document.getElementById('btn_line_'+i+'_span').innerHTML = tempStat;
                        
                        if (i != wp_common.currLine)
                        {
                            $("span#btn_line_"+i+"_span").blink();
                        }else
                        {
                            $("span#btn_line_"+i+"_span").unblink();
                        }

                    }else
                    {
                        document.getElementById('btn_line_'+i+'_span').innerHTML = 'Line ' + i;
                        $("span#btn_line_"+i+"_span").unblink();
                    }
                    
                    break;
                }
            }
        }
    }

	//var chanelStat = applethandle.API_GetStatus(1);	//	get line status
	//var chanelStatus = chanelStat.replace(/\s+/g,'');

    var inCallStatus = '';
    if (globalStatus.lastIndexOf("(") >= 0)
    {
        inCallStatus = globalStatus.slice(0,globalStatus.lastIndexOf("("));
        inCallStatus = inCallStatus.trim();
    }else
    {
        inCallStatus = globalStatus;
    }

	if ((globalStatus == 'Startingcall') || (inCallStatus == 'InCall'))	//	call buttons control
	{	
		checkCall = true;
		wp_common.onCallInit();
		wp_common.btnStatusControl('btn_call', 1, 'call');
		wp_common.btnStatusControl('btn_hangup', 1, 'hangup');
		
		if (document.getElementById("btn_callhangup") != null) // wp_CallHangup() , when only one button is used for call and hangup
		{
            if ($.browser.msie)
            {
                $("div#btn_callhangup").children().css("background-color",curr_hangup_button_color);
                $("div#btn_callhangup").children().css("border-color",wp_layout.HoverCalc(curr_hangup_button_color, -10));
            }else
            {
                $("div#btn_callhangup").css("background-color",curr_hangup_button_color);
                $("div#btn_callhangup").css("border-color",wp_layout.HoverCalc(curr_hangup_button_color, -10));
            }
			//document.getElementById("btn_callhangup").style.backgroundColor = curr_hangup_button_color;
			//document.getElementById("btn_callhangup").style.borderColor = wp_layout.HoverCalc(curr_hangup_button_color, -10);
            if (document.getElementById("button_title") != null) { document.getElementById("button_title").innerHTML = curr_hangup_button_text; }  // for click2call
		}
		wp_common.callhangup_isInCall = true;
	}
	if (inCallStatus == 'Speaking')	// used when polling the status
	{
		checkCall = true;
		if (!isWebphoneToJsCalled)
		{
			if (callButtons != null)	callButtons.style.display = 'inline-block';
			if (acceptReject != null)	acceptReject.style.display = 'none';
			wp_common.btnStatusControl('btn_call', 1, 'call');
			wp_common.btnStatusControl('btn_hangup', 1, 'hangup');
		}
		
		if (document.getElementById("btn_callhangup") != null) // wp_CallHangup() , when only one button is used for call and hangup
		{
            if ($.browser.msie)
            {
                $("div#btn_callhangup").children().css("background-color",curr_hangup_button_color);
                $("div#btn_callhangup").children().css("border-color",wp_layout.HoverCalc(curr_hangup_button_color, -10));
            }else
            {
                $("div#btn_callhangup").css("background-color",curr_hangup_button_color);
                $("div#btn_callhangup").css("border-color",wp_layout.HoverCalc(curr_hangup_button_color, -10));
            }
			//document.getElementById("btn_callhangup").style.backgroundColor = curr_hangup_button_color;
			//document.getElementById("btn_callhangup").style.borderColor = wp_layout.HoverCalc(curr_hangup_button_color, -10);
            if (document.getElementById("button_title") != null)    document.getElementById("button_title").innerHTML = curr_hangup_button_text;   // for click2call
		}
		wp_common.callhangup_isInCall = true;
	}
	if (globalStatus == 'CallFinished' || globalStatus == 'Call Finished')
	{
		checkCall = false;
		callercalled = '';
		wp_common.onCallFinished();
		wp_common.btnStatusControl('btn_call', 1, 'call');
		wp_common.btnStatusControl('btn_hangup', 1, 'hangup');
		timerDisplayRinging = false;
		
		if (document.getElementById("btn_callhangup") != null) // wp_CallHangup() , when only one button is used for call and hangup
		{
            if ($.browser.msie)
            {
                $("div#btn_callhangup").children().css("background-color",wp_layout.curr_call_button_color);
                $("div#btn_callhangup").children().css("border-color",wp_layout.HoverCalc(wp_layout.curr_call_button_color, -10));
            }else
            {
                $("div#btn_callhangup").css("background-color",wp_layout.curr_call_button_color);
                $("div#btn_callhangup").css("border-color",wp_layout.HoverCalc(wp_layout.curr_call_button_color, -10));
            }
			//document.getElementById("btn_callhangup").style.backgroundColor = wp_layout.curr_call_button_color;
			//document.getElementById("btn_callhangup").style.borderColor = wp_layout.HoverCalc(wp_layout.curr_call_button_color, -10);
            if (document.getElementById("button_title") != null) { document.getElementById("button_title").innerHTML = curr_call_button_text; }  // for click2call
		}
		wp_common.callhangup_isInCall = false;
	}
	if (globalStatus == 'Incoming...')
	{
		if (callButtons != null)	callButtons.style.display = 'none';
		if (acceptReject != null)	acceptReject.style.display = 'inline-block';
	}
	if ((inCallStatus == 'InCall') || (globalStatus == 'CallFinished') || (globalStatus == 'Call Finished'))
	{
		if (callButtons != null)	callButtons.style.display = 'inline-block';
		if (acceptReject != null)	acceptReject.style.display = 'none';
	}
	if (inCallStatus == 'Hold')
	{
		remoteHold = true;
		wp_common.displayEvent('<span style="color:'+wp_api.status_text_color+';">Call In Hold</span>');
	}
	if ((remoteHold == true) && (inCallStatus == 'Speaking'))
	{
		remoteHold = false;
		wp_common.displayEvent('<span style="color:'+wp_api.status_text_color+';">Call Reloaded</span>');
	}
	if ((inCallStatus == 'Speaking') || (chanelStatus == 'Ringing'))	//	calculating call length
	{
		if (chanelStatus == 'Ringing')
		{
			callercalled = eventNotify.substring(eventNotify.indexOf('Ringing') + 8, eventNotify.length);
			callercalled = callercalled.substring(0, callercalled.indexOf(','));
			
			if (boolRingTimer == true)
			{
				timerDisplayRinging = true;
				clearTimeout(callLengthTimerId);
				var time = new Date();
				if (boolIncommingCall == true)
				{
					callStartTime = time.getTime();
					callStartTime = callStartTime - 2000;	//	add 2 sec to call length, when incomming call
				}else
				{
					callStartTime = time.getTime();
				}
				wp_common.dispCallLength();
				boolRingTimer = false;
			}
			
			
			if (document.getElementById("btn_callhangup") != null) // wp_CallHangup() , when only one button is used for call and hangup
			{
				if ($.browser.msie)
				{
					$("div#btn_callhangup").children().css("background-color",curr_hangup_button_color);
					$("div#btn_callhangup").children().css("border-color",wp_layout.HoverCalc(curr_hangup_button_color, -10));
				}else
				{
					$("div#btn_callhangup").css("background-color",curr_hangup_button_color);
					$("div#btn_callhangup").css("border-color",wp_layout.HoverCalc(curr_hangup_button_color, -10));
				}
				//document.getElementById("btn_callhangup").style.backgroundColor = curr_hangup_button_color;
				//document.getElementById("btn_callhangup").style.borderColor = wp_layout.HoverCalc(curr_hangup_button_color, -10);
				if (document.getElementById("button_title") != null) { document.getElementById("button_title").innerHTML = curr_hangup_button_text; }  // for click2call
			}
			wp_common.callhangup_isInCall = true;
			
			
		}
		if (inCallStatus == 'Speaking')
		{
			if (boolCallLengthTimer == true)
			{
				timerDisplayRinging = false;
				clearTimeout(callLengthTimerId);
				var time = new Date();
				if (boolIncommingCall == true)
				{
					callStartTime = time.getTime();
					callStartTime = callStartTime - 2000;	//	add 2 sec to call length, when incomming call
				}else
				{
					callStartTime = time.getTime();
				}
				wp_common.dispCallLength();
				boolCallLengthTimer = false;
			}
		}
	}else
	{
		if (checkCall == false)
		{
			boolCallLengthTimer = true;
			boolRingTimer = true;
			clearTimeout(callLengthTimerId);
			var realStatus = '';
			if (globalStatus == 'RegisterFailed')
			{
				realStatus = '<span style="color:#ff0000;">'+globalStatus+'</span>';
			}else
			{
				realStatus = '<span style="color:'+wp_api.status_text_color+';">'+globalStatus+'</span>';
			}
			wp_common.displaystatus(realStatus);
		}
	}
	var inCallingField = document.getElementById('PhoneNumber');	//get and display incomming caller
	if (chanelStatus == 'Ringing')
	{
		//STATUS,1,Ringing,8888,9999,2,8888
		var tmpArray = eventNotify.split(",", 6);
		var incomming = (tmpArray[5]).trim();
		
		if (incomming == '2')
		{
			var tmpArray2 = eventNotify.split(",", 4);
			var inCallingNum = (tmpArray2[3]).trim();
			
			inCallingField.value = inCallingNum;
			redial = inCallingNum;

// customized for aoudjehane
			if (document.getElementById("displayed_number") !== null) { document.getElementById("displayed_number").innerHTML = inCallingNum; }

			boolIncommingCall = true;
			wp_common.displayEvent('Incomming call from: <span style="color:'+wp_api.status_text_color+'; font-weight:bold;">'+inCallingNum+'</span>');
		}
	}
	if (globalStatus == 'CallFinished')
	{
		if (callLengthInSec > 2)	{inCallingField.value = '';}
		boolIncommingCall = false;
	}
	if (checkCall == true || chanelStatus == 'Ringing' || globalStatus == 'Incoming...') //	display credit
	{
		if (checkDTMF == false && typeof(creditSpan) !== 'undefined' && creditSpan !== null)
		{
			if (typeof(callercalled) !== 'undefined' && callercalled !== null && callercalled.length > 0)
			{
				creditSpan.innerHTML = callercalled;
			}else
			{
				creditSpan.innerHTML = realCredit;
			}
		}
	}
	else if (typeof(creditSpan) !== 'undefined' && creditSpan !== null)
	{
		creditSpan.innerHTML = realCredit;
	}
	var eventName = eventNotify.slice(0, eventNotify.indexOf(","));		// displaying events
	var eventType = eventNotify.split(",",2);eventType = eventType.toString();
	eventType = eventType.slice(eventType.indexOf(",")+1,eventType.length);
	var eventCredit2 = eventNotify.match('EVENT,EVENT,Credit:');
	var eventDestroy = eventNotify.match('EVENT,EVENT, destroying');
	var eventCallDuration = eventNotify.match('EVENT,EVENT,Call duration:');

	if (eventName == 'EVENT')
	{
		if (eventNotify == 'EVENT,ERROR,trial version disconnect')
		{
			trialVersionDisplay = true;
			wp_common.displayEvent('<span style="color:#ff0000;font-weight:bold;">'+eventNotify.slice(eventNotify.indexOf(",")+1,eventNotify.length)+'</span>');
		}
		
		if (trialVersionDisplay) {return true;}
		
		var evnt = eventNotify.slice(eventNotify.indexOf(",")+1,eventNotify.length);evnt = evnt.toString();
		evnt = evnt.slice(evnt.indexOf(",")+1,evnt.length);	
		evnt = evnt.substr(0,1).toUpperCase() + evnt.substr(1);evnt = evnt.toString();
		if (evnt.length > 36)								{evnt = evnt.slice(0, 36)}

		if ((eventType == 'EVENT') && (eventCredit2 != 'EVENT,EVENT,Credit:') && (eventDestroy != 'EVENT,EVENT, destroying'))
		{
			wp_common.displayEvent(evnt);
		}
		if (eventType == 'WARNING')		{wp_common.displayEvent('<span style="color:#a30000">'+evnt+'</span>');}
		if (eventType == 'ERROR')		{wp_common.displayEvent('<span style="color:#ff0000">'+evnt+'</span>');}
		
		if (eventCallDuration == 'EVENT,EVENT,Call duration:')
		{
			strTime = '';
			var tmpDuration = evnt.slice(evnt.indexOf(":")+1,evnt.length);//alert(''+tmpDuration)
            if (tmpDuration != null && tmpDuration.length > 0 && tmpDuration.indexOf('undefined') < 0)
            {
                wp_common.displayEvent('<span style="color:'+wp_api.status_text_color+';font-weight:bold;">Call duration: '+tmpDuration+'</span>');
            }
		}
		
		// VOICEMAIL
		var eventVoicem = eventNotify.slice(eventNotify.indexOf(",")+1,eventNotify.length);eventVoicem = eventVoicem.toString();
		if (eventVoicem.indexOf('MWI') >= 0)
		{
			var areMessages = eventVoicem.slice(eventVoicem.indexOf(',')+1,eventVoicem.length);areMessages = areMessages.toString();
			areMessages = areMessages.slice(0,areMessages.indexOf(','));areMessages = areMessages.toString();
			
			if (areMessages == 'yes')
			{
				voicemailNr = eventVoicem.slice(eventVoicem.indexOf('MWI,yes')+8,eventVoicem.length);voicemailNr = voicemailNr.toString();
				voicemailNr = voicemailNr.slice(0,voicemailNr.indexOf(','));voicemailNr = voicemailNr.toString();
				
				wp_common.ChangeHoldToVoicemail(true);
			}
		}
	}
	
	if (globalStatus == 'CallFinished' && typeof(strTime) !== 'undefined' && strTime !== null && strTime.length > 0 && trialVersionDisplay == false)
	{
        var dispEvent = document.getElementById('displayEvent');
        if (dispEvent != null && ((dispEvent.innerHTML).trim()).length <= 0)
        {
            var durTemp = strTime;
            if (durTemp.indexOf('(Ringing)') >= 0)  durTemp = durTemp.substring(0, durTemp.indexOf('(Ringing)'));
            wp_common.displayEvent('<span style="color:'+wp_api.status_text_color+'">Call duration: '+durTemp+'</span>');
        }
	}
	
	if (voicemailNr.length > 0 && checkCall == false)
	{
		if (!wp_api.isFullyCustomized)
		{
			wp_common.ChangeHoldToVoicemail(true);
		}
	}else
	{
		if (!wp_api.isFullyCustomized)
		{
			wp_common.ChangeHoldToVoicemail(false);
		}
	}
	//var testtest = document.getElementById('testtest');		testtest.innerHTML += eventNotify+'<br />';
    return true;
},
ChangeHoldToVoicemail: function (change)
{
	if (document.getElementById("btn_chat") == null) {return;}
    
    var imgPath = document.getElementById("btn_chat").getAttribute('src');
    
    if (imgPath == null)    return;
    
    imgPath = imgPath.substr(0, imgPath.lastIndexOf('/') + 1);
    
	if (change)
	{
		if (wp_api.isIphoneSkin)
		{
			document.getElementById('btn_hold').setAttribute('src',imgPath + 'btn_voicemail.jpg');
			document.getElementById('btn_hold').title = 'Voicemail';
		}else
		{
			document.getElementById('btn_hold').title = 'Voicemail';
			document.getElementById('btn_hold_img').setAttribute('src',imgPath + 'voicemail.png');
			document.getElementById('btn_hold_span').innerHTML = 'Voicemail';
		}
	}else
	{
		if (wp_api.isIphoneSkin)
		{
			document.getElementById('btn_hold').setAttribute('src',imgPath + 'btn_hold.jpg');
			document.getElementById('btn_hold').title = 'Call Hold';
		}else
		{
			document.getElementById('btn_hold').title = 'Call Hold';
			document.getElementById('btn_hold_img').setAttribute('src',imgPath + 'hold.png');
			document.getElementById('btn_hold_span').innerHTML = 'Hold';
		}
	}
},
displaystatus: function (statustr)	//	display status massages
{
	if (webphoneStatus == null)
	{
		try{webphoneStatus =  document.getElementById('status');} catch (e) { }    
	}
	try{
		if (typeof(statustr) === 'undefined' || statustr === null || statustr.indexOf('Outband') >= 0 || statustr.indexOf('Deletable') >= 0) { return; }

		statustr = statustr.replace('EVENT,', '');
		statustr = statustr.replace('STATUS,', '');
		statustr = statustr.replace('WARNING,', '');
		statustr = statustr.replace('ERROR,', '');
		statustr = statustr.trim();

		var pos = statustr.indexOf(',');
		if (pos > 0)
		{
			var startTmp = '';
			var endTmp = '';
			
			if (statustr.indexOf('<') === 0 && statustr.indexOf('>') > 0)
			{
				startTmp = statustr.substring(0 , statustr.indexOf('>') + 1);
				statustr = ( statustr.replace(startTmp, '') ).trim();
				
				if (statustr.indexOf('<') > 0)
				{
					endTmp = statustr.substring(statustr.indexOf('<'), statustr.length);
					statustr = ( statustr.replace(endTmp, '') ).trim();
				}
				
			}

			pos = statustr.indexOf(',');
			if (pos > 0)
			{
				statustr = statustr.substring(pos + 1, statustr.length);

				pos = statustr.indexOf(',');
				if (pos > 0)
				{
					statustr = statustr.substring(0, statustr.indexOf(','));
				}
			}
			statustr = startTmp + statustr.trim() + endTmp;
		}

		statustr = statustr.trim();
		pos = statustr.indexOf('[');

		if (pos >= 0 && statustr.indexOf(']') > 0)
		{
			var strTemp = statustr.substring(pos,  statustr.indexOf(']') + 1);
			statustr = statustr.replace(strTemp, '');
			statustr = statustr.trim();
		}
		
		pos = statustr.indexOf('[');

		if (pos >= 0 && statustr.indexOf(']') > 0)
		{
			var strTemp = statustr.substring(pos,  statustr.indexOf(']') + 1);
			statustr = statustr.replace(strTemp, '');
			statustr = statustr.trim();
		}
		
		if (webphoneStatus !== null && typeof(statustr) !== 'undefined' && statustr !== null && statustr.length > 0)
		{
			webphoneStatus.innerHTML = statustr;
// customized for aoudjehane
			if (document.getElementById('status2') !== null) { document.getElementById('status2').innerHTML = statustr; }
		}
	} catch (e) { }
},
displayEvent: function (evStr)	//	display event massages
{
	var displayEvent = document.getElementById('displayEvent');
	if (displayEvent !== null && typeof(evStr) !== 'undefined' && evStr !== null)
	{
		evStr = evStr.replace('EVENT,', '');
		evStr = evStr.replace('STATUS,', '');
		evStr = evStr.replace('WARNING,', '');
		evStr = evStr.replace('ERROR,', '');
		
		var pos = evStr.lastIndexOf(',');
		if (pos > 0) { evStr = evStr.substring(pos + 1, evStr.length); }

		evStr = evStr.trim();
		pos = evStr.indexOf('[');
		if (pos === 0 && evStr.indexOf(']') > 0)
		{
			evStr = evStr.substring(evStr.indexOf(']') + 1, evStr.length);
			evStr = evStr.trim();
		}
		
		pos = evStr.indexOf('[');
		if (pos > 0) { evStr = evStr.substring(0, pos); }
		
		displayEvent.innerHTML = evStr;
	}
	clearTimeout (eventAlertTimerId);
	eventAlertTimerId = setTimeout ( "wp_common.hideEvent()", eventDisplayTime);
},
hideEvent: function ()	//	hide event massages
{
	var displayEvent = document.getElementById('displayEvent');
	if (displayEvent != null)   displayEvent.innerHTML = '';
	trialVersionDisplay = false;
},
dispCallLength: function ()	//	display call length
{
	try
	{
		var currTime = new Date();
		var currentTime = currTime.getTime();
		var callLengthSec = parseInt((currentTime - callStartTime)/1000);callLengthInSec = callLengthSec;
		var Sec = callLengthSec % 60;
		var callLengthMin = parseInt(callLengthSec / 60);
		var Min = callLengthMin % 60;
		var Hour = parseInt(callLengthMin / 60);
	} catch (e) { }
	
	strTime = '<span style="font-size:11px;font-weight:bold;">';
	if (Hour > 0)	{strTime += Hour+':';}strTime += Min+':';
	if (Sec < 10)	{strTime += '0';}strTime += Sec;
	if (Min < 0)	{Hour--;Min += 60;}
	if (hold == true)	{strTime += ' (In Hold)';}
	if (timerDisplayRinging == true)	{strTime += ' (Ringing)';}
	strTime += '</span>';
    if (timerDisplayRinging == true)
    {
        wp_common.displaystatus('<span style="color: #444444">' + strTime + '</span>');
    }else
    {
        wp_common.displaystatus(strTime);
    }
	callLengthTimerId = setTimeout ( "wp_common.dispCallLength()", 500);
},

initcheck: function ()	// getting applet handle
{
	if (applethandle === null || typeof(applethandle) === 'undefined')
	{
		wp_common.displaystatus('webphone initializing');

		try{ applethandle = document.getElementById('webphone'); } catch (e) { }  

		if (applethandle == null)
		{
			var applets = null;            
			try{
				applets = document.applets; 

				// Needed for FireFox
				if (applets.length == 0)
				{
					applets = document.getElementsByTagName("object");
				}
				if (applets.length == 0)
				{
					applets = document.getElementsByTagName("applet");
				}

				// Find the active applet object
				for (var i = 0; i < applets.length; ++i)
				{
					try {
						if (typeof (applets[i].API_Call) != "undefined")
						{
							applethandle = applets[i];
							break;
						}
					} catch (e) { }
				}
			} catch (e) { }  

			if (applethandle == null)
			{
				try{ applethandle = document.applets[0]; } catch (e) { }
			}

			if (applethandle == null)
			{
				wp_common.displaystatus('3Cannot find the webphone applet!'); 
			}
		}

		if (applethandle != null)
		{
			// See if we're using the old Java Plug-In and the JNLPAppletLauncher
			try {
				var newapplethandle = applethandle.getSubApplet();

				if( newapplethandle != null) { applethandle  = newapplethandle; }
			} catch (e)
			{ // Using new-style applet -- ignore 
			}
		}
	}
	
	var strApplethandle = "";
	
	var browser = (navigator.userAgent).toLowerCase();
	try{
		strApplethandle = applethandle.toString();

// for IE the values of strApplethandle is the same regardless if the applethandle is found or not
		if (browser.indexOf('msie') > 0 || browser.indexOf('trident') > 0)
		{
			for(var key in applethandle)
			{
				if (key === 'contentDocument')
				{
					strApplethandle = (applethandle[key]).toString();
					break;
				}
			}
		}
	} catch (e) {  }
	// if indexOf('[object') -> means applethandel was not found
	if ( strApplethandle == null || strApplethandle == ''
		|| ( (strApplethandle.toLowerCase()).indexOf('[object') >= 0 && (strApplethandle.toLowerCase()).indexOf('[object') < 5 ) )
	{
		applethandle = null;
		return false;
	}else
	{
		return true;
	}
},

Encrypt: function (str, key)
{
    if(key == null || key.length <= 0)
    {
        alert("Please enter a key with which to encrypt the message.");
        return null;
    }
    
    var prand = "";
    for(var i=0; i<key.length; i++)
    {
        prand += key.charCodeAt(i).toString();
    }
    
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
    var incr = Math.ceil(key.length / 2);
    var modu = Math.pow(2, 31) - 1;
    
    if(mult < 2)
    {
        alert("Algorithm cannot find a suitable hash. Please choose a different key. \nPossible considerations are to choose a more complex or longer key.");
        return null;
    }
    var salt = Math.round(Math.random() * 1000000000) % 100000000;
    prand += salt;
    
    while(prand.length > 10)
    {
        prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    
    prand = (mult * prand + incr) % modu;
    var enc_chr = "";
    var enc_str = "";
    
    for(var i=0; i<str.length; i++)
    {
        enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
        if(enc_chr < 16)
        {
            enc_str += "0" + enc_chr.toString(16);
        }else
        {
            enc_str += enc_chr.toString(16);   
        }
    
        prand = (mult * prand + incr) % modu;
    }
    
    salt = salt.toString(16);
    while(salt.length < 8)salt = "0" + salt;
    enc_str += salt;
    return enc_str;
},

Decrypt: function (str, key, name)
{
    if(str == null || str.length < 8)
    {
        //alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
        wp_common.eraseCookie(name);
        return;
    }
    
    if(key == null || key.length <= 0)
    {
        alert("Please enter a key with which to decrypt the message.");
        return;
    }
    var prand = "";

    for(var i=0; i<key.length; i++)
    {
        prand += key.charCodeAt(i).toString();
    }
    
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
    var incr = Math.round(key.length / 2);
    var modu = Math.pow(2, 31) - 1;
    var salt = parseInt(str.substring(str.length - 8, str.length), 16);
    str = str.substring(0, str.length - 8);
    prand += salt;
    
    while(prand.length > 10)
    {
        prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    
    prand = (mult * prand + incr) % modu;
    var enc_chr = "";
    var enc_str = "";
    
    for(var i=0; i<str.length; i+=2)
    {
        enc_chr = parseInt(parseInt(str.substring(i, i+2), 16) ^ Math.floor((prand / modu) * 255));
        enc_str += String.fromCharCode(enc_chr);
        prand = (mult * prand + incr) % modu;
    }
    return enc_str;
},

createCookie: function (name,value,days)	//	create coockies
{
	try{
        value = wp_common.Encrypt(value, 'ad5b6u8s');
		if (days)
		{
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/;SameSite=Lax";
	} catch (e) { }
},

readCookie: function (name)	//	read coockies
{
	try
	{
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++)
        {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0)
            {
                var value = c.substring(nameEQ.length,c.length);
                value = wp_common.Decrypt(value, 'ad5b6u8s', name);
                return value;
            }
		}
		return null;
	} catch (e) { }
},

eraseCookie: function (name)	//	delete coockies
{
	wp_common.createCookie(name,"",-1);
},
wp_LoadApplet: function ()
{
	var errmsgVisibility = "none";
	var appletString = function ()
	{
		var attr = [];
		var param = [];
		var a;
		
		for (a in wp_api.attributes)
		{
//			width: 290, height: 250
			/*if (isFirstStart) // if started for the first time, then set applet visible (width, height)
			{
				if (a.toLowerCase() === 'width')
				{
					wp_api.attributes[a] = "300";
				}
				else if (a.toLowerCase() === 'height')
				{
					wp_api.attributes[a] = "400";
				}
				errmsgVisibility = "block";
			}*/
			
			if (wp_api.attributes.hasOwnProperty(a))
			{
				attr.push(a + "=\"" + wp_api.attributes[a] + "\"");
			}
		}

		for (a in wp_api.parameters)
		{
            /*if (wp_api.isClick2Call && a == 'username')
            {
                tempUser = parameters[a];
            }*/
			param.push("<param name='" + a + "' value='" + wp_api.parameters[a] + "'/>");
		}
		
		// error message and download link to show if java is not available
		var errMsg = "<div id=\"javaerrormsg\" style=\"clear:both; padding:5px; display:" + errmsgVisibility + "; background:#fff; color:#f00; font-size:14px; font-weight:bold;\">You must enable java or install it<br />if not already installed from <a href=\"https://java.com/en/download/index.jsp\" target=\"_blank\">here</a></div>";
		
		var errMsg2 = '<b>You must enable java or install from <a href="https://www.java.com/en/download/index.jsp"> here </a></b>';

		var out = errMsg + "<applet " + attr.join(" ") + ">" + param.join("") + errMsg2 + "</applet>";
		return out;
	};
	
	// position the applet on the top-left corner of the skin; used for showing applet when java is not available
	var positionTop = 150;
	var positionLeft = 50;
	var position = $("#webphone_bg_container").offset();
	if (typeof(position) !== 'undefined' && position !== null)
	{
		positionTop = position.top + 20;
		positionLeft = position.left;
	}
	
	
	var sp = $("<div/>");
	sp.attr("id","wpappletconatiner").attr("style", "z-index:10000; position:absolute; float:left; top:" + positionTop + "px; left:" + positionLeft + "px;").html(appletString());
	try{
		$("body").append(sp);

	}catch (e) {console.error(e);alert("Can't start applet: "+e);}

	isAppletLoaded = true;
	return true;
},

wp_LoadAppletAndRegisterParam: function (user, pwd)
{
	try{
	if (typeof(user) !== 'undefined' && user !== null && (user.trim()).length > 0
		&& typeof(pwd) !== 'undefined' && pwd !== null && (pwd.trim()).length > 0)
	{
		wp_api.parameters['username'] = user;
		wp_api.parameters['password'] = pwd;
		callApiRegister = true;
	}
	return wp_common.wp_LoadAppletAndRegister();

	}catch (e) { wp_common.wp_LoadAppletAndRegister(); }
},

wp_LoadAppletAndRegister: function ()
{
	var usrField = document.getElementById('username_input');
	var pwdField = document.getElementById('password_input');
    var srvAddr = document.getElementById('server_address_input');
	
	if (usrField !== null && typeof(usrField.value) !== 'undefined' && usrField.value !== null && (usrField.value).length > 0)
	{
		wp_api.parameters['username'] = (usrField.value).trim();
	}
	
	if (pwdField !== null && typeof(pwdField.value) !== 'undefined' && pwdField.value !== null && (pwdField.value).length > 0)
	{
		wp_api.parameters['password'] = (pwdField.value).trim();
	}
	
	if (srvAddr !== null && typeof(srvAddr.value) !== 'undefined' && srvAddr.value !== null && (srvAddr.value).length > 0)
	{
		wp_api.parameters['serveraddress'] = (srvAddr.value).trim();
	}
        
//##NEW
        PassParameters();
        wp_common.onLogin();
        webphone_api.start();
        wp_common.pages(2);
        return true;
        

	if(!isAppletLoaded) wp_common.wp_LoadApplet();
	wp_common.onLogin();
	//if(!wp_common.initcheck()) {alert('Cannot find applet handle !');return false;}
	//applethandle.API_ServerInit(""+wp_api.serverAddress+"");
	//setTimeout("voipDelayedRegister()",400);
    return wp_common.waitForWebphone();
},

wp_Register: function (user, pwd) // in case you don't want to use wp_LoadAppletAndRegister
{
	wp_common.onLogin();
	
	if (typeof(user) !== 'undefined' && user !== null && (user.trim()).length > 0
		&& typeof(pwd) !== 'undefined' && pwd !== null && (pwd.trim()).length > 0)
	{
		wp_api.parameters['username'] = user;
		wp_api.parameters['password'] = pwd;
		callApiRegister = true;
	}else
	{
		return false;
	}
	
	//applethandle.API_ServerInit(""+wp_api.serverAddress+"");
	//setTimeout("voipDelayedRegister()",400);
    return wp_common.waitForWebphone();
},

waitForWebphone: function ()	//	delaying register, when login page not used  !!! DEPRECATED
{
	waitForWebphoneCount++;
	appletLoadedBool = wp_common.initcheck();

	if (appletLoadedBool) // if applet was successfully lodaded
	{
		$("#webphone").width(1); // hide the applet and error message
		$("#webphone").height(1);
		document.getElementById("javaerrormsg").style.display = "none";

		waitForWebphoneCount = 0;

		wp_common.createCookie('MZwebPhoneIsFirstStart','false',""+cookieExpire+"");
 
		return wp_common.voipDelayedRegister();
	}else
	{
		var threshold = 0;
		if (isFirstStart === true) { threshold = 25; } else { threshold = 50; }
									// 5 sec					10 sec
									
		if (waitForWebphoneCount === threshold) // show applet after X sec
		{
			$("#webphone").width(300); // show the applet and error message if couldn't be loaded
			$("#webphone").height(400);
			document.getElementById("javaerrormsg").style.display = "block";
		}
		setTimeout ( "wp_common.waitForWebphone()", 200);
	}
},

voipDelayedRegister: function ()	//	making delay for API_ServerInit()
{
	if(!wp_common.initcheck()) {alert('Cannot find applet handle (3) !');return false;}
	
	var pswLocal = '';
    var saveSettings = document.getElementById('savesettings');
	var usrField = document.getElementById('username_input');
	var pwdField = document.getElementById('password_input');
	
	if (wp_api.parameters['username'] === 'undefined' || wp_api.parameters['username'] === null ||wp_api.parameters['username'].length < 1
		|| wp_api.parameters['password'] === 'undefined' || wp_api.parameters['password'] === null || wp_api.parameters['password'].length < 0)
	{
        var licKey = document.getElementById('license_key_input');
        var srvAddr = document.getElementById('server_address_input');
        
        if (licKey != null)
        {
            var isLicenseOk = false;
            
            if (licKey.value == "")
            {
                try{document.getElementById('login_page_error_messages').innerHTML = 'Invalid license key';} catch (e) {}
                licKey.focus();
                return false;
            }else
            {
                isLicenseOk = applethandle.API_SetKey(licKey.value);
                
                if (saveSettings != null && saveSettings.checked == true)
                {
                    wp_common.createCookie('MZwebPhoneLicKey',""+licKey.value+"",""+cookieExpire+"");
                }else
                {
                    wp_common.eraseCookie('MZwebPhoneLicKey');
                }
            }
            
            if (!isLicenseOk)
            {
                try{document.getElementById('login_page_error_messages').innerHTML = 'Invalid license key';} catch (e) {}
                return false;
            }
        }
        
        // set api_key for webphone service
        if (typeof(api_key) !== 'undefined' && api_key !== null && api_key.length > 0)
        {
            applethandle.API_SetKey(api_key);
        }
        
        if (srvAddr != null)
        {
            if (srvAddr.value == "")
            {
                try{document.getElementById('login_page_error_messages').innerHTML = 'Invalid server address';} catch (e) {}
                srvAddr.focus();
                return false;
            }else
            {
                wp_api.parameters['serveraddress'] = srvAddr.value;
                
                if (saveSettings != null && saveSettings.checked == true)
                {
                    wp_common.createCookie('MZwebPhoneSrvAddr',""+srvAddr.value+"",""+cookieExpire+"");
                }else
                {
                    wp_common.eraseCookie('MZwebPhoneSrvAddr');
                }
            }
        }
		
        if (!wp_api.isClick2Call)
        {
            if (usrField !== null && ( typeof(usrField.value) === 'undefined' || usrField.value === null || ((usrField.value).trim()).length  < 1))
            {
                try{document.getElementById('login_page_error_messages').innerHTML = 'Invalid username';} catch (e) {}
                usrField.focus();
                return false;
            }
            if (pwdField !== null && ( typeof(pwdField.value) === 'undefined' || pwdField.value === null || ((pwdField.value).trim()).length  < 1))
            {
                try{document.getElementById('login_page_error_messages').innerHTML = 'Invalid password';} catch (e) {}
                pwdField.focus();
                return false;
            }

            wp_api.parameters['username'] = usrField.value;
            wp_api.parameters['password'] = pwdField.value;
			callApiRegister = true;
        }
	}
	
    if (!wp_api.isClick2Call)
    {
        if (saveSettings != null && saveSettings.checked == true)
        {
            wp_common.createCookie('MZwebPhoneUsr', usrField.value, cookieExpire);
            wp_common.createCookie('MZwebPhonePassw', pwdField.value, cookieExpire);
        }else
        {
            wp_common.eraseCookie('MZwebPhoneUsr');
            wp_common.eraseCookie('MZwebPhonePassw');
        }

        wp_common.pages(2);
	}
	
	var realm = wp_api.parameters['realm'];
	if ( typeof(realm) === 'undefined' || realm === null || (realm.trim()).length < 1) { realm = wp_api.parameters['serveraddress']; }

	var md5 = wp_api.parameters['md5'];

	if (callApiRegister === true)
	{
		// use md5 if set	
		if ( typeof(md5) !== 'undefined' && md5 !== null && (md5.trim()).length > 0)
		{
			md5 = md5.trim();
//##			isRegistered = applethandle.API_SetCredentialsMD5(wp_api.parameters['serveraddress'], wp_api.parameters['username'], md5, realm);
		}
		/*else if (wp_api.isClick2Call)
		{
//##			isRegistered = applethandle.API_SetCredentials(wp_api.parameters['serveraddress'], wp_api.parameters['username'], wp_api.parameters['password'], wp_api.parameters['username'], wp_api.parameters['username']);
		}*/
		
//##		isRegistered = applethandle.API_Register(wp_api.parameters['serveraddress'], wp_api.parameters['username'], wp_api.parameters['password'], "", "");

	}

    if (wp_api.isMultiLineSkin && wp_api.nrOfLines > 1)
    {
        //wp_ChangeLine(wp_common.currLine);
        applethandle.API_SetLine(wp_common.currLine);
        isGetLine = true;
        setTimeout("wp_common.StartGettingLine()",1400);
    }
    
	return isRegistered;
},
voipStatusRegister: function ()	//	register if double click on status and not in call
{
    return true;
/*    
	if ((checkCall == false) && (wp_api.parameters['username'] !== null) && (wp_api.parameters['username'].length > 0)
		&& (wp_api.parameters['password'] !== null) && (wp_api.parameters['password'].length > 0))
	{
		wp_common.onLogin();
		wp_common.pages(2);
		if(!wp_common.initcheck()) {alert('Cannot find applet handle (4) !');return false;}
		applethandle.API_Register(wp_api.parameters['serveraddress'], wp_api.parameters['username'], wp_api.parameters['password']);
        
        if (wp_api.isMultiLineSkin && wp_api.nrOfLines > 1)
        {
            //wp_ChangeLine(wp_common.currLine);
            applethandle.API_SetLine(wp_common.currLine);
            isGetLine = true;
            setTimeout("wp_common.StartGettingLine()",400);
        }
	}
    return true;*/
},
reRegister: function ()	// !!!!DEPRECATED calls API_Register() every "reRegisterTime" miliseconds
{
    return true;
/*
	if ((boolReRegister != null) && (currentPage == 2))
	{
		if ((checkCall == false) && (wp_api.parameters['username'] !== null) && (wp_api.parameters['username'].length > 0)
			&& (wp_api.parameters['password'] !== null) && (wp_api.parameters['password'].length > 0))
		{
			if(!wp_common.initcheck()) {alert('Cannot find applet handle (5) !');return false;}
			applethandle.API_Register(wp_api.parameters['serveraddress'], wp_api.parameters['username'], wp_api.parameters['password']);
		}
	}
	boolReRegister = setTimeout ( "wp_common.reRegister()", reRegisterTime );
    return true;*/
},
wp_Unregister: function ()
{
	var retVal = false;
//##NEW	retVal = applethandle.API_Unregister();
	wp_common.pages(1);
    isGetLine = false;
    
    return retVal;
},

wp_Call: function (calledNr)
{
//##NEW	if(!wp_common.initcheck()) {alert('Cannot find applet handle (10) !');return false;}
	var boolCall = false;
	var calledNumber = document.getElementById('PhoneNumber');
	try{
	if (typeof(calledNr) === 'undefined' || calledNr === null)
	{
		calledNr = (calledNumber.value).trim();
	}else
	{
		calledNr = calledNr.trim();
	}
	}catch (e) { calledNr = ''; }

	if (typeof(calledNr) !== 'undefined' && calledNr !== null && calledNr.length > 0 && calledNr != phoneNumberFieldValue)
	{
// customized for aoudjehane
		if (document.getElementById("displayed_number") !== null) { document.getElementById("displayed_number").innerHTML = calledNr; }
		
        wp_common.displayEvent('<span style="color:'+wp_api.status_text_color+';">Starting...</span>');
        
//##NEW		boolCall = applethandle.API_Call(wp_common.currLine, ""+calledNr+"");
                boolCall = webphone_api.call(calledNr, wp_common.currLine);

		redial = calledNr;
	}
	if (boolCall == false)
	{
		wp_common.displayEvent('<span style="color:#'+wp_api.status_text_color+';">Enter destination first.</span>');
	}
    return boolCall;
},

wp_CallHangup: function ()
{
	if (wp_common.callhangup_isInCall)
	{
		wp_common.wp_Hangup();
		wp_common.callhangup_isInCall = false;
	}else
	{
        wp_common.displayEvent('<span style="color:#26b14a;">Starting...</span>');
		var boolCall = false;
		var calledNumber = document.getElementById('PhoneNumber');
		if (calledNumber.value != '' && calledNumber.value != phoneNumberFieldValue)
		{
			boolCall = applethandle.API_Call(wp_common.currLine, ""+calledNumber.value+"");
			redial = calledNumber.value;
		}
		if (boolCall == false)
		{
			wp_common.displayEvent('<span style="color:#ff0000;">Enter destination first.</span>');
		}else
		{
			wp_common.callhangup_isInCall = true;
		}
	}
	
	if (document.getElementById("btn_callhangup") != null)
	{
		if (wp_common.callhangup_isInCall)
		{
            if ($.browser.msie)
            {
                $("div#btn_callhangup").children().css("background-color",curr_hangup_button_color);
                $("div#btn_callhangup").children().css("border-color",wp_layout.HoverCalc(curr_hangup_button_color, -10));
            }else
            {
                $("div#btn_callhangup").css("background-color",curr_hangup_button_color);
                $("div#btn_callhangup").css("border-color",wp_layout.HoverCalc(curr_hangup_button_color, -10));
            }
			//document.getElementById("btn_callhangup").style.backgroundColor = curr_hangup_button_color;
			//document.getElementById("btn_callhangup").style.borderColor = wp_layout.HoverCalc(curr_hangup_button_color, -10);
		}else
		{
            if ($.browser.msie)
            {
                $("div#btn_callhangup").children().css("background-color",wp_layout.curr_call_button_color);
                $("div#btn_callhangup").children().css("border-color",wp_layout.HoverCalc(wp_layout.curr_call_button_color, -10));
            }else
            {
                $("div#btn_callhangup").css("background-color",wp_layout.curr_call_button_color);
                $("div#btn_callhangup").css("border-color",wp_layout.HoverCalc(wp_layout.curr_call_button_color, -10));
            }
			//document.getElementById("btn_callhangup").style.backgroundColor = wp_layout.curr_call_button_color;
			//document.getElementById("btn_callhangup").style.borderColor = wp_layout.HoverCalc(wp_layout.curr_call_button_color, -10);
		}
	}
    return true;
},

wp_RegisterCallHangup: function () // used for click to call
{
    var wasAppletLoadind = false;
    if (!isRegistered)
    {
        wp_common.wp_LoadAppletAndRegister();
        wasAppletLoadind = true;
    }
    
    if(!wp_common.initcheck()) {alert('Cannot find applet handle (11) !');return false;}
    
	if (wp_common.callhangup_isInCall)
	{
		wp_common.wp_Hangup();
		wp_common.callhangup_isInCall = false;
	}else
	{
        if (wasAppletLoadind)
        {
            setTimeout("wp_common.ClickToCallDelayd()", 600);
        }else
        {
            wp_common.ClickToCallDelayd();
        }
	}
	
	if (document.getElementById("btn_callhangup") != null)
	{
		if (wp_common.callhangup_isInCall)
		{
            if ($.browser.msie)
            {
                $("div#btn_callhangup").children().css("background-color",curr_hangup_button_color);
                $("div#btn_callhangup").children().css("border-color",wp_layout.HoverCalc(curr_hangup_button_color, -10));
            }else
            {
                $("div#btn_callhangup").css("background-color",curr_hangup_button_color);
                $("div#btn_callhangup").css("border-color",wp_layout.HoverCalc(curr_hangup_button_color, -10));
            }
		}else
		{
            if ($.browser.msie)
            {
                $("div#btn_callhangup").children().css("background-color",wp_layout.curr_call_button_color);
                $("div#btn_callhangup").children().css("border-color",wp_layout.HoverCalc(wp_layout.curr_call_button_color, -10));
            }else
            {
                $("div#btn_callhangup").css("background-color",wp_layout.curr_call_button_color);
                $("div#btn_callhangup").css("border-color",wp_layout.HoverCalc(wp_layout.curr_call_button_color, -10));
            }            
		}
	}
    return true;
},

ClickToCallDelayd: function ()
{
    var boolCall = false;
    if (wp_api.destination_number != null && wp_api.destination_number.length > 1)
    {
        boolCall = applethandle.API_Call(wp_common.currLine, ""+wp_api.destination_number+"");
        redial = wp_api.destination_number;
    }
    
    if (boolCall == false)
    {
        wp_common.displayEvent('<span style="color:#ff0000;">Destination number is not defined.</span>');
    }else
    {
        wp_common.callhangup_isInCall = true;
    }
},

wp_Hangup: function ()
{
//##NEW	if(!wp_common.initcheck()) {alert('Cannot find applet handle (12) !');return false;}
	var boolHangup = false;
        
//##NEW	boolHangup = applethandle.API_Hangup(wp_common.currLine);
	boolHangup = webphone_api.hangup(wp_common.currLine);
        
        
	if (document.getElementById('dtmf') != null)    document.getElementById('dtmf').innerHTML = '';
	checkDTMF = false;
	
	boolIncommingCall = false;
    return boolHangup;
},
wp_Accept: function ()
{
//##NEW	if(!wp_common.initcheck()) {alert('Cannot find applet handle (13) !');return false;}
	var boolAccept = false;
        
//##NEW	boolAccept = applethandle.API_Accept(wp_common.currLine);
	boolAccept = webphone_api.accept(wp_common.currLine);
                
	if (boolAccept == false)
	{
		wp_common.displayEvent('<span style="color:#ff0000;">Accept Failed</span>');
	}
    return boolAccept;
},
wp_Reject: function ()
{
//##NEW	if(!wp_common.initcheck()) {alert('Cannot find applet handle (14) !');return false;}
	var boolReject = false;
	
//##NEW        boolReject = applethandle.API_Reject(wp_common.currLine);
        boolReject = webphone_api.reject(wp_common.currLine);
                
    return boolReject;
},
wp_HoldOrVoicemail: function ()
{
	if (voicemailNr.length > 0 && checkCall == false)
	{
		wp_common.wp_Voicemail();
	}else
	{
		wp_common.wp_Hold();
	}
},
wp_Hold: function (holdParam)
{
//##NEW	if(!wp_common.initcheck()) {alert('Cannot find applet handle (15) !');return false;}
	var holdValue = !hold;

// if parameter is passed; used for wp_api.Hold();
	try{  if (typeof(holdParam) !== 'undefined' && holdParam !== null) { holdValue = holdParam; }  }catch (e) {  }
	
//##NEW	var boolHold = applethandle.API_Hold(wp_common.currLine,holdValue);
	var boolHold = webphone_api.hold(holdValue, wp_common.currLine);

	if (boolHold == true)
 	{
		hold = !hold;
		if (hold == true)
  		{
			wp_common.displayEvent('<span style="color:'+wp_api.status_text_color+';">Call In Hold</span>');
		}else
		{
			wp_common.displayEvent('<span style="color:'+wp_api.status_text_color+';">Call Reloaded</span>');
		}
	}else 
	{
		if(checkCall == true)
		{
			wp_common.displayEvent('<span style="color:#ff0000;">Hold failed</span>');
 		}else
		{
			wp_common.displayEvent('<span style="color:#ff0000;">No call in progress</span>');
		}
	}
    return boolHold;
},
wp_Voicemail: function (vmNumber)
{
	var vmnrTemp = voicemailNr; // got from webphone events
	
// if parameter is passed; used for wp_api.Voicemail();
	try{  if (typeof(vmNumber) !== 'undefined' && vmNumber !== null) { vmnrTemp = vmNumber; }  }catch (e) {  }
	
//##NEW	if(!wp_common.initcheck()) {alert('Cannot find applet handle (16) !');return false;}
//##NEW	return applethandle.API_Call(-1, ""+vmnrTemp+"");
	return webphone_api.call(vmnrTemp, -1);
},
voipRedial: function ()
{
    var boolRedial = false; 
	if (checkCall == false)
	{
//##NEW		if(!wp_common.initcheck()) {alert('Cannot find applet handle (20) !');return false;}
		if (redial != '')
		{
//##NEW			boolRedial = applethandle.API_Call(-1, ""+redial+"");
			boolRedial = webphone_api.call(redial, -1);
                        
                        
			document.getElementById('PhoneNumber').value = redial;
		}
	}
	if (boolRedial == false)
	{
		wp_common.displayEvent('<span style="color:#ff0000;">No previous call found</span>');
	}
    return true;
},
wp_Conference: function ()
{
//##NEW	if(!wp_common.initcheck()) {alert('Cannot find applet handle (21) !');return false;}
    
//##NEW    applethandle.API_SetLine(wp_common.currLine);
//##NEW    applethandle.API_Conf("");
    webphone_api.conference('', true);
        
    return true;
},
wp_CallTransfer: function ()
{
//##NEW	if(!wp_common.initcheck()) {alert('Cannot find applet handle (22) !');return false;}    
	var boolTransfer = false;
    
//##NEW    applethandle.API_SetLine(wp_common.currLine);
//##NEW	boolTransfer = applethandle.API_TransferDialog();
	boolTransfer = webphone_api.transfer();
                
	if (boolTransfer == false)
	{
    	if(checkCall == true)
		{
		   wp_common.displayEvent('<span style="color:#ff0000;">Transfer failed</span>');
        }  
		else
		{
		    wp_common.displayEvent('<span style="color:#ff0000;">No call in progress</span>');
		}
	}
    return boolTransfer;
},
wp_Chat: function (peer)
{
    return true;
/*    
	var chatNumber = document.getElementById('PhoneNumber');
	var chatId = '';

	try{ if ( typeof(chatNumber) !== 'undefined' && chatNumber !== null
		&& typeof(chatNumber.value) !== 'undefined' && chatNumber.value !== null
		&& chatNumber.value !== phoneNumberFieldValue)	{chatId = chatNumber.value;} }catch (e) {  }
	
	try{ if ( typeof(peer) !== 'undefined' && peer !== null && peer.length > 0)	{chatId = peer;} }catch (e) {  }
	
	if(!wp_common.initcheck()) {alert('Cannot find applet handle (23) !');return false;}
	
	return applethandle.API_Chat(chatId);*/
},
wp_AudioDevice: function ()
{
//##NEW	if(!wp_common.initcheck()) {alert('Cannot find applet handle (24) !');return false;}
//##NEW	return applethandle.API_AudioDevice();
	return webphone_api.devicepopup();
},
wp_Mute: function (muteParam)
{
//##NEW	if(!wp_common.initcheck()) {alert('Cannot find applet handle (25) !');return false;}
	var muteValue = !mute;
	
// if parameter is passed; used for wp_api.Mute();
	try{  if (typeof(muteParam) !== 'undefined' && muteParam !== null) { muteValue = muteParam; }  }catch (e) {  }
	
//##NEW	var boolMute = applethandle.API_MuteEx(wp_common.currLine, muteValue, 0);
	var boolMute = webphone_api.mute(muteValue, 2, wp_common.currLine);

	if (boolMute == true)
 	{
		mute = !mute;
		if (mute == true)
  		{
			wp_common.displayEvent('<span style="color:'+wp_api.status_text_color+';">Muted</span>');
		}else
		{
			wp_common.displayEvent('<span style="color:'+wp_api.status_text_color+';">Unmuted</span>');
		}
	}else 
	{
		if(checkCall == true)
		{
			wp_common.displayEvent('<span style="color:#ff0000;">Mute failed</span>');
 		}else
		{
			wp_common.displayEvent('<span style="color:#ff0000;">No call in progress</span>');
		}
	}
    return boolMute;
},
wp_Redial: function ()
{
	if(checkCall == true)
	{
		wp_common.displayEvent('<span style="color:#ff0000;">Call in progress</span>');
		return false;
	}else
	{
		if (redial != null && redial.length > 0)
		{
			document.getElementById('PhoneNumber').value = redial;
			return wp_common.wp_Call(redial);
		}else
		{
			wp_common.displayEvent('<span style="color:#ff0000;">No number to redial</span>');
		}
	}
	return false;
},
wp_ChangeLine: function (ln)
{
    return true;
    /*
    if(!wp_common.initcheck()) {alert('Cannot find applet handle (26) !');return false;}
    var isLineSet = applethandle.API_SetLine(ln);
    
    if (isLineSet)
    {
        wp_common.currLine = ln;

        for (var i = 1; i <= wp_api.nrOfLines; i++)
        {
            if ($.browser.msie)
            {
                if (i == ln)
                {
                    $("div#btn_line_"+i).children().css("background-color",wp_layout.curr_call_button_color);
                    $("div#btn_line_"+i).children().css("border-color",wp_layout.HoverCalc(wp_layout.curr_call_button_color, -10));
                    $("div#btn_line_"+i).children().css("font-weight","bold");
                }else
                {
                    $("div#btn_line_"+i).children().css("background-color",wp_layout.curr_button_color);
                    $("div#btn_line_"+i).children().css("border-color",wp_layout.curr_button_border_color);
                    $("div#btn_line_"+i).children().css("font-weight","normal");
                }
            }else
            {
                if (i == ln)
                {
                    $("div#btn_line_"+i).css("background-color",wp_layout.curr_call_button_color);
                    $("div#btn_line_"+i).css("border-color",wp_layout.HoverCalc(wp_layout.curr_call_button_color, -10));
                    $("div#btn_line_"+i).css("font-weight","bold");
                }else
                {
                    $("div#btn_line_"+i).css("background-color",wp_layout.curr_button_color);
                    $("div#btn_line_"+i).css("border-color",wp_layout.curr_button_border_color);
                    $("div#btn_line_"+i).css("font-weight","normal");
                }
            }
            
            if (i == wp_common.currLine)
            {
                $("span#btn_line_"+i+"_span").unblink();
            }
        }
        
        if (lineStatus[wp_common.currLine - 1] == 'Ringing' && callType[wp_common.currLine - 1].length > 0 && callType[wp_common.currLine - 1] == '2')
        {
            if (document.getElementById('callbuttons') !== null) { document.getElementById('callbuttons').style.display = 'none'; }
            if (document.getElementById('acceptreject') !== null) { document.getElementById('acceptreject').style.display = 'inline-block'; }
        }else
        {
            if (document.getElementById('callbuttons') !== null) { document.getElementById('callbuttons').style.display = 'inline-block'; }
            if (document.getElementById('acceptreject') !== null) { document.getElementById('acceptreject').style.display = 'none'; }
        }
    }else
    {
        wp_common.displayEvent('<span style="color:#ff0000;">Line could not be set !</span>');
        return false;
    }
    return true;*/
},

StartGettingLine: function ()
{
    return true;
/*
    if (isGetLine)
    {
        if(wp_common.initcheck())
		{
			var recievedLine = applethandle.API_GetLine();
			if (recievedLine > 0 && wp_common.currLine != recievedLine)
			{
				wp_common.wp_ChangeLine(recievedLine);
				wp_common.wp_ChangeLine(recievedLine);
			}
		}else
		{
			checkmaxloop = checkmaxloop + 1;
		}
    }
    clearTimeout(getLineTimerId);
	if (checkmaxloop < 300) // stop getting line status if can't get the applet handle
	{
    	getLineTimerId = setTimeout ( "wp_common.StartGettingLine()", 2000 );
	}
    return true;*/
},

SendDtmf: function (dtmfVal)
{
//##NEW	if(!wp_common.initcheck()) {alert('Cannot find applet handle (30) !');return false;}
	
	try{  if (typeof(dtmfVal) === 'undefined' || dtmfVal === null || dtmfVal.length < 1) { return false; }  }catch (e) { return false; }
	
//##NEW	return applethandle.API_Dtmf(-2, dtmfVal);
	return webphone_api.dtmf(dtmfVal, -2);
},

wp_StartStopRec: function ()
{
    return true;
/*
	if(!wp_common.initcheck()) {alert('Cannot find applet handle (31) !');return false;}
	
	var recording;
	
	if (!recordingStatus) // start recording
	{
		recording = applethandle.API_VoiceRecord(4, 0, '');
	}else // stop recording
	{
		recording = applethandle.API_VoiceRecord(0, 0, '');
	}
	
	if (recording) // if API_VoiceRecord was successful
	{
		if (!recordingStatus)
		{
			if (document.getElementById('btn_recording') !== null) { document.getElementById('btn_recording').innerHTML = 'Stop Rec'; }
			wp_common.displayEvent('<span style="color:'+wp_api.status_text_color+';">Recoding enabled</span>');
		}else
		{
			if (document.getElementById('btn_recording') !== null) { document.getElementById('btn_recording').innerHTML = 'Start Rec'; }
			wp_common.displayEvent('<span style="color:'+wp_api.status_text_color+';">Recoding disabled</span>');
		}
		recordingStatus = !recordingStatus;
		return true;
	}
	return false;*/
},

wp_PlayLastRecord: function ()
{
    return true;
/*	if(!wp_common.initcheck()) {alert('Cannot find applet handle (32) !');return false;}

//API_PlaySound(int start, String file, int looping, boolean async, boolean islocal, boolean toremotepeer, int line, String audiodevice, boolean isring)

	return applethandle.API_PlaySound(1, 'lastvoicerecord', 0, false, true, false, -1, '', false);
*/
}

};
}( );
window.onload=wp_common.atload;

//##NEW
/*
function webphonetojs (varr)
{
	var evNot = '' + varr;
	wp_common.webphonetojsCommon(evNot);
}*/

// blink and unblink text for Multiline skin
(function($)
{
    $.fn.blink = function(options)
    {
        var defaults = {delay:500};
        var options = $.extend(defaults, options);

        return this.each(function()
        {
            var obj = $(this);
            if (obj.attr("timerid") > 0) return;
            var timerid=setInterval(function()
            {
                if($(obj).css("visibility") == "visible")
                {
                    $(obj).css('visibility','hidden');
                }
                else
                {
                    $(obj).css('visibility','visible');
                }
            }, options.delay);
            obj.attr("timerid", timerid);
        });
    };
    $.fn.unblink = function(options) 
    {
        var defaults = {visible:true};
        var options = $.extend(defaults, options);

        return this.each(function() 
        {
            var obj = $(this);
            if (obj.attr("timerid") > 0) 
            {
                clearInterval(obj.attr("timerid"));
                obj.attr("timerid", 0);
                obj.css('visibility', options.visible?'visible':'hidden');
            }
        });
    };
}(jQuery));
