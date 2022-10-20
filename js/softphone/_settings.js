/* global common */

// settings page
webphone_api._settings = (function ()
{
var isSettLevelBasic = true; // basic / advanced settings display
var startedfrom = '';
var filtervisible = false; // means search filder is hidden
var isAdvancedLoginSett = 0; // show advanced login settings: 0=no, 1=from login page, 2=from advanced SIP settings

//OPSSTART
var currautoprovsrv = ''; //-- autoprovisioning -> if op code changed, then download autoprovisioning (block at start)
//OPSEND
var chooseenginetouse = '';
    
function onCreate (event) // called only once - bind events here
{
    try{
        if(webphone_api.common.CanLog(4)) { webphone_api.common.PutToDebugLog(4, "EVENT, _settings: onCreate"); }
        webphone_api.global.sipstackstarted = false;
    webphone_api.common.SetLanguage();


//--if (webphone_api.global.isdebugversion === true)
//--{
//--    webphone_api.$('#testrate').show();
//--    webphone_api.$('#testrate').on('click', function(event)
//--    {
//--        webphone_api.common.UriParser(webphone_api.common.GetParameter('ratingrequest'), '', '4072', '', '', 'getrating');
//--    });
//--}
    
// listen for enter onclick, and click OK button - working only for dialog boxes
    //webphone_api.$( "body" ).keypress(function( event )
    webphone_api.$( "#page_settings" ).keydown(function(event)
    {
        
        if ( event.which === 13) // enter
        {
            event.preventDefault();

            var active_popups = webphone_api.$.mobile.activePage.find(".messagePopup");
            if (!webphone_api.common.isNull(active_popups) && active_popups.length > 0)
            {
                webphone_api.$("#adialog_positive").click();
            }
            else if (document.getElementById('btn_login') !== null)
            {
                webphone_api.$("#btn_login").click();
            }
            else if (document.getElementById('lp_btn_login') !== null)
            {
                webphone_api.$("#lp_btn_login").click();
            }
        }
        else if ( event.which === 27) // ESC
        {
            event.preventDefault();

            var active_popups = webphone_api.$.mobile.activePage.find(".messagePopup");
            if (!webphone_api.common.isNull(active_popups) && active_popups.length > 0)
            {
                webphone_api.$("#adialog_negative").click();
            }
            else
            {
                webphone_api.$("#btn_back_settings").click();
            }
        }
        else
        {
            return;
        }
    });

// register global error listener: just for skin, NOT for SDK
    try{
        window.onerror = function (msg, url, lineNo, columnNo, error)
        {
            try{
                if (console)
                {
                    var emsg = 'GlobalErrorHandler: ERROR, ' + msg + ' (' + error + ') url: ' + url + ' line: ' + lineNo + ' col: ' + columnNo;
                    if (console.error)
                    {
                        console.error(emsg);
                    }
                    else if (console.log)
                    {
                        console.log(emsg);
                    }

                    webphone_api.common.PutToDebugLog(2, 'ERROR, GlobalErrorHandler: ' + emsg);
                }
            } catch(errin2) { ; }
            return false;
        };
    } catch(errin1) { ; }


    webphone_api.$('#settings_list').on('click', 'li', function(event)
    {
        OnListItemClick(webphone_api.$(this).attr('id'));
    });
    
    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_settings')
        {
            MeasureSettingslist();
        }
    });
    
    webphone_api.$('#settings_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    
    webphone_api.common.SetLogFormAction();

    webphone_api.$("#btn_settings_menu").on("click", function() { CreateOptionsMenu('#settings_menu_ul'); });
    webphone_api.$("#btn_settings_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    
    webphone_api.$("#btn_back_settings").attr("title", webphone_api.stringres.get("hint_btnback"));

    webphone_api.$("#lp_btn_login").attr("title", webphone_api.stringres.get("hint_settlogin"));

    webphone_api.$("#btn_back_settings").on("click", function(event) { BackOnClick(event); });
    
    webphone_api.$("#btn_settings_engine_close").on("click", function(event)
    {
        webphone_api.common.SaveParameter('ignoreengineselect', 'true');

        webphone_api.$('#settings_engine').hide();
        webphone_api.$('#dialpad_engine').hide();
        
        MeasureSettingslist();
    });
    
    webphone_api.$("#a_newuser").on("click", function(event)
    {
        OnNewUserClicked();
        event.preventDefault();
    });

    webphone_api.$("#a_forgotpassword").on("click", function(event)
    {
        if (webphone_api.common.IsWindowsSoftphone())
        {
            var forgotpasswordurl = webphone_api.common.GetConfig('forgotpasswordurl');
            if (!webphone_api.common.isNull(forgotpasswordurl) && forgotpasswordurl.length > 3)
            {
                webphone_api.common.OpenLinkInExternalBrowser(forgotpasswordurl);
                event.preventDefault();
            }
        }
    });
    webphone_api.$('#lp_btn_custom').on("click", function(event) { CustomBtn(); });

// not used anymore (footer notification) !!!DEPRECATED
    webphone_api.$("#btn_settings_engine").on("click", function(event)
    {
        webphone_api.common.SaveParameter('ignoreengineselect', 'true');

        webphone_api.$('#settings_engine').hide();
        webphone_api.$('#dialpad_engine').hide();
        
        if (webphone_api.common.isNull(chooseenginetouse) || chooseenginetouse.length < 1) { return; }
        MeasureSettingslist();
        
// handle click action based on selected engine
        if (chooseenginetouse === 'java'){ ; }
        else if (chooseenginetouse === 'webrtc') { webphone_api.common.EngineSelect(1,2); }
        else if (chooseenginetouse === 'ns')
        {
            //webphone_api.common.NPDownloadAndInstall();
            setTimeout(function ()
            {
                webphone_api.common.NPDownloadAndInstall();
            }, 400);

            var downloadurl = webphone_api.common.GetNPLocation();
            if (!isNull(downloadurl) && downloadurl.length > 0)
            {
                window.open(downloadurl);
            }
        }
        else if (chooseenginetouse === 'flash')
        {
            ; // todo: implement for flash
        }
        else if (chooseenginetouse === 'app')
        {
            webphone_api.common.ResetEngineClicked();
            var engine = webphone_api.common.GetEngine('app');
            engine.clicked = 2;
            SetEngine('app', engine);
        }
        
        var engine = webphone_api.common.GetEngine(chooseenginetouse);
        if (!webphone_api.common.isNull(engine))
        {
            engine.clicked = 2;
            webphone_api.common.SetEngine(chooseenginetouse, engine);
            
            
            webphone_api.common.ShowToast(webphone_api.common.GetEngineDisplayName(chooseenginetouse) + ' ' + webphone_api.stringres.get('ce_use'), function ()
            {
                webphone_api.common.ChooseEngineLogic2(chooseenginetouse);
                chooseenginetouse = '';
            });
        }
    });
//BRANDSTART
    if (webphone_api.common.GetConfigInt('brandid', -1) === 58) // enikma
    {
        var logodiv = document.getElementById('logologinpage');
        if (!webphone_api.common.isNull(logodiv))
        {
            logodiv.innerHTML = '<img src="' + webphone_api.common.GetElementSource() + 'images/logo.png" style="border: 0;">&nbsp;&nbsp;<div style="color:#000; font-size: .6em; display: inline-block; position: relative; top: -0.6em;"><b>eNikMa</b> Unified Comm</div>';
        }
    }
//BRANDEND
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: onCreate", err); }
}

function onStart(event)
{
    try{
//--setTimeout(function ()
//--{
//--    var message = 'For best experience: <a href="http://localhost:8383/_Webphone/native/WebPhoneService_Install.exe" target="_blank" id="adialog_nativeplugin">Install service plugin</a><br><br>';
//--    var callback = function (){};
//--    webphone_api.common.UserChooseEnginePopup(message, false, true, callback);
//--}, 500);
    webphone_api.global.sipstackstarted = false;

    webphone_api.common.SetCurrTheme();
    if (webphone_api.global.isdebugengine)
    {
        setTimeout(function ()
        {
            webphone_api.common.ChooseEngineLogic(function ()
            {
                console.log('StartUp');
            }, false);
        },200);
    }
    
    ismodified = false;
    
    webphone_api.global.pagewasrefreshed = false;
    webphone_api.global.dploadingdisplayed = false;
    webphone_api.global.loglevel = webphone_api.common.GetLogLevel();

    if(webphone_api.common.CanLog(4)) { webphone_api.common.PutToDebugLog(4, "EVENT, _settings: onStart"); }
    
// content was hidden untill jquery mobile loaded. now dislpay content
    document.getElementById('phone_app_main_container').style.display = 'block';
    webphone_api.common.ShowModalLoader(webphone_api.stringres.get('loading'));
    if(webphone_api.common.CanLog(3)) { webphone_api.common.PutToDebugLogSpecial(3, 'EVENT, _settings: onStart display Loading... modal loader_1', false, ''); }
    
    webphone_api.global.apppletloaded = false;
        
//--     API_GuiStarted()  when skin is loaded
//--    if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE())
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.common.WinAPI('API_GuiStarted', function (answer)
        {
            webphone_api.common.PutToDebugLog(2, 'EVENT, _settings API_GuiStarted response: ' + answer);
        });
    }
    
    webphone_api.global.isSettingsStarted = true;
    
    webphone_api.$("#settings_list").prev("form.ui-filterable").hide();
    
//--    if ( !webphone_api.common.isNull(document.getElementById('app_name_settings')) )
//--    {
//--        document.getElementById("app_name_settings").innerHTML = webphone_api.common.GetBrandName();
//--    }

    if ( !webphone_api.common.isNull(document.getElementById('settings_page_title')) ) { document.getElementById("settings_page_title").innerHTML = webphone_api.stringres.get("settings_title"); }
    webphone_api.$("#settings_page_title").attr("title", webphone_api.stringres.get("hint_page"));

    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#settings_header'), -30) );

    // fix for IE 10
    if (webphone_api.common.IsIeVersion(10)) { webphone_api.$("#settings_list").children().css('line-height', 'normal'); }


//-- setting should always show basic settings by default (no remember old advanced)
//--    if (webphone_api.common.GetParameter('settlevelbasic') === 'false')
//--    {
//--        isSettLevelBasic = false;
//--    }else
//--    {
//--        isSettLevelBasic = true;
//--    }

    webphone_api.$('#settings_page_title').html(webphone_api.stringres.get('settings_login'));
    
    startedfrom = webphone_api.common.GetIntentParam(webphone_api.global.intentsettings, 'startedfrom');
    if (webphone_api.common.isNull(startedfrom)) { startedfrom = ''; }

    if (startedfrom === 'app')
    {
        webphone_api.$('#app_name_settings').hide();
        webphone_api.$('#btn_back_settings').show();
        webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("btn_cancel") );
    }else
    {
        webphone_api.$('#btn_back_settings').hide();
        webphone_api.$('#app_name_settings').show();
    }
    
// login page with username and password

//--    if (webphone_api.common.GetConfig('customizedversion') === 'true' && startedfrom !== 'app')
    if (ShowLoginPage())
    {
        webphone_api.$('#settings_list').hide();
        webphone_api.$('#loginpage_container').show();
        
        if (currfeatureset < 5) // minimal
        {
            webphone_api.$('#btn_settings_menu').hide();
        }
//OPSSTART
        if (!webphone_api.common.IsWindowsSoftphone() && webphone_api.global.usestorage === true)
        {
//--            var cp = '<a href="https://www.mizu-voip.com/Software/WebPhone.aspx" target="_blank" title="Provider">Powered by Mizutech WebPhone &reg;</a>';
//--            webphone_api.$("#settings_copyright").html(cp);
            webphone_api.$("#settings_copyright").show();
        }
//OPSEND

        var newuseruri = webphone_api.common.GetConfig('newuser');
//BRANDSTART
        if (webphone_api.common.GetConfigInt('brandid', -1) === 50) // favafone
        {
            webphone_api.$('#a_newuser').hide();
            
            webphone_api.$('#lp_btn_custom').html(webphone_api.stringres.get('favafone_new'));
            webphone_api.$('#lp_btn_custom').show();
            
        }else
//BRANDEND
        {
            if (!webphone_api.common.isNull(newuseruri) && newuseruri.length > 3)
            {
                webphone_api.$('#a_newuser').show();
                webphone_api.$('#a_newuser').html(webphone_api.stringres.get('newuser_a'));
                webphone_api.$('#a_newuser').attr('href', newuseruri);
            }else
            {
                webphone_api.$('#a_newuser').hide();
            }
        }
        
        var forgotpasswordurl = webphone_api.common.GetConfig('forgotpasswordurl');
        if (!webphone_api.common.isNull(forgotpasswordurl) && forgotpasswordurl.length > 3)
        {
            webphone_api.$('#a_forgotpassword').show();
            webphone_api.$('#a_forgotpassword').html(webphone_api.stringres.get('forgotpassword_a'));
            webphone_api.$('#a_forgotpassword').attr('href', forgotpasswordurl);
        }else
        {
            webphone_api.$('#a_forgotpassword').hide();
        }
    }else
    {
        webphone_api.$('#loginpage_container').hide();
        webphone_api.$('#settings_list').show();
        webphone_api.$('#btn_settings_menu').show();
    }
    
    MeasureSettingslist();

    var trigerred = false; // handle multiple clicks
    webphone_api.$("#lp_btn_login").on("click", function()
    {
        if (trigerred) { return; }
    
        trigerred = true;
        setTimeout(function ()
        {
            trigerred = false;
        }, 1000);
        
        var srv_field = document.getElementById("lp_serveraddress");
        
        if (!webphone_api.common.isNull(srv_field) && webphone_api.$('#lp_serveraddress').closest( 'div.ui-input-text' ).is(':visible') == true)
        {
            var lpsrv = srv_field.value;
            if (webphone_api.common.isNull(lpsrv)) { lpsrv = ''; }
            lpsrv = webphone_api.common.Trim(lpsrv);
            lpsrv = lpsrv.toLowerCase();
            webphone_api.common.NormalizeInput(lpsrv, 0);
            
            webphone_api.common.SaveParameter('serveraddress_user', lpsrv);
        }
        
        if (!webphone_api.common.isNull(document.getElementById("lp_username")))
        {
            var lpusr = document.getElementById("lp_username").value;
            if (webphone_api.common.isNull(lpusr)) { lpusr = ''; }
            lpusr = webphone_api.common.Trim(lpusr);
            
            webphone_api.common.SaveParameter('sipusername', lpusr);
        }
    
        if (!webphone_api.common.isNull(document.getElementById("lp_password")))
        {
            var lppwd = document.getElementById("lp_password").value;
            if (webphone_api.common.isNull(lppwd)) { lppwd = ''; }
            lppwd = webphone_api.common.Trim(lppwd);
            
            webphone_api.common.SaveParameter('password', lppwd);
        }
    
        SaveSettings(true);
    });
    
    webphone_api.$('#lp_serveraddress').closest( 'div.ui-input-text' ).hide();

    if (!webphone_api.common.isNull(document.getElementById("lp_serveraddress")))
    {
        document.getElementById("lp_serveraddress").placeholder = webphone_api.stringres.get('sett_display_name_serveraddress_user');
    }
    if (!webphone_api.common.isNull(document.getElementById("lp_username")))
    {
        document.getElementById("lp_username").placeholder = webphone_api.stringres.get('sett_display_name_sipusername');
    }
    if (!webphone_api.common.isNull(document.getElementById("lp_password")))
    {
        document.getElementById("lp_password").placeholder = webphone_api.stringres.get('sett_display_name_password');
    }

    var logo = webphone_api.common.GetConfig('logo');
    var logodiv = document.getElementById('logologinpage');  //logo
    if (!webphone_api.common.isNull(logo) && logo.length > 2 && !webphone_api.common.isNull(logodiv))
    {
        var isimg = false;
        if ((logo.toLowerCase()).indexOf('.jpg') > 0 || (logo.toLowerCase()).indexOf('.jpeg') > 0
                || (logo.toLowerCase()).indexOf('.png') > 0 || (logo.toLowerCase()).indexOf('.gif') > 0)
        {
            isimg = true;
        }
        
        if (isimg)
        {
            /*
            var logowidth =  Math.floor( (webphone_api.$("#loginpage_container").width()) );  //#phone_app_main_container
            if ( !webphone_api.common.isNull(logowidth) && webphone_api.common.IsNumber(logowidth) && logowidth > 100 )
            {
                //logowidth = Math.floor(logowidth / 1.2);
                if(logowidth > 600) logowidth = 600;
                else if(logowidth < 120) logowidth = 120;
            }else
            {
                logowidth = 424;
            }

            var logoheight = Math.floor(logowidth / 2.14);
            */
            /*
            var logominwidth =  Math.floor( (webphone_api.$("#loginpage_container").width()) );  //#phone_app_main_container
            if ( !webphone_api.common.isNull(logominwidth) && webphone_api.common.IsNumber(logominwidth) && logominwidth > 70 )
            {
                if(logominwidth > 600) logominwidth = 600;
                else if(logominwidth < 100) logominwidth = 100;
            }else
            {
                logominwidth = 100;
            }
            */
            //logodiv.innerHTML = '<img src="' + webphone_api.common.GetElementSource() + 'images/' + logo + '" style="border: 0;  min-width: 120px; min-height: 80px; max-width: 400px; max-height: 300px; ">';
            //logodiv.innerHTML = '<img src="' + webphone_api.common.GetElementSource() + 'images/' + logo + '" width = "'+logowidth.toString()+'" height = "'+logoheight.toString()+'" style="border: 0;">';
            //logodiv.innerHTML = '<img src="' + webphone_api.common.GetElementSource() + 'images/' + logo + '" style="min-width: '+logominwidth.toString()+'px; max-width: 100%; border: 0;">';
            //logodiv.innerHTML = '<img src="' + webphone_api.common.GetElementSource() + 'images/' + logo + '" style="min-width: 100%; max-width: 100%; border: 0;">';
            logodiv.innerHTML = '<img src="' + webphone_api.common.GetElementSource() + 'images/' + logo + '" style="width: 100%; border: 0;">';

        }else
        {
            logodiv.innerHTML = '<span>' + logo + '</span>';
        }
    }
// END login page with username and password
    // needed for proper display and scrolling of listview
    MeasureSettingslist();

    accountsavailable = false;
    GetAccounts();
    
    setTimeout(function ()
    {
        if (
            webphone_api.common.IsSDK() === false
//OPSSTART
            && webphone_api.common.Glv() > 1
//OPSEND
            && webphone_api.common.GetParameter('androidchromedisplayed') !== 'true'
            )
        {
            webphone_api.common.SaveParameter('androidchromedisplayed', 'true');
            
            if (webphone_api.common.GetOs() === 'Android'/* && webphone_api.common.GetBrowser() === 'Chrome'*/)
            {
                var ep_webrtc = webphone_api.common.StrToInt(webphone_api.common.GetParameter2('enginepriority_webrtc'));
                var ep_app = webphone_api.common.StrToInt(webphone_api.common.GetParameter2('enginepriority_app'));
                
                var usewebrtc = webphone_api.common.CanIUseWebRTC();
                if (ep_app < 1 || ep_webrtc < 2 || (ep_webrtc >= ep_app && usewebrtc === true)) { return; }
                
            // find and close all active popups before displaying OfferNativeEngine popup
                var active_popups = webphone_api.$.mobile.activePage.find(".messagePopup");
                if (!webphone_api.common.isNull(active_popups) && active_popups.length > 0 && webphone_api.global.dontclosecurrpopup !== true)
                {
                    webphone_api.$.mobile.activePage.find(".messagePopup").popup("close").bind(
                    {
                        popupafterclose: function ()
                        {
                            webphone_api.$(this).unbind("popupafterclose").remove();
                            OfferNativeEngine();
                        }
                    });
                }else
                {
                    OfferNativeEngine();
                }
            }
        }
    }, 3000);
    
//BRANDSTART
    if (webphone_api.common.GetConfigInt('brandid', -1) === 50 && webphone_api.global.favafone_autologin === true) // favafone
    {
        SaveSettings();
    }
//BRANDEND

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: onStart", err); }
}

//--android-on ha softphone es chrome -> akkor elso indulasnal megkerdezni valasszon engine-t (ha nincs letiltva egyik engine sem):
//--         - recommended: native dialer with better quality or...
//--	 - ignore and start in web browser (webrtc) right now
function OfferNativeEngine(popupafterclose)
{
    try{
    if (webphone_api.common.GetParameter2('enginepriority_webrtc') === '0' || webphone_api.common.GetParameter2('enginepriority_app') === '0') { return; }
    
    var popupWidth = webphone_api.common.GetDeviceWidth();
    if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
    {
        popupWidth = Math.floor(popupWidth / 1.2);
    }else
    {
        popupWidth = 220;
    }

        if(popupWidth > 400) popupWidth = 400;
        else if(popupWidth < 120) popupWidth = 120;
    
    var message = '<a href="javascript:;" id="pusenative">' + webphone_api.stringres.get('usenative_option_native') + '</a><br /><br />';
    message = message + '<a href="javascript:;" id="pusewebrtc">' + webphone_api.stringres.get('usenative_option_webrtc') + '</a>';
    
    var template = '' +
'<div data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
//--        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + webphone_api.stringres.get('usenative_title') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content adialog_alert">' +
        '<span style="-ms-user-select: text; -moz-user-select: text; -khtml-user-select: text; -webkit-user-select: text;  user-select: text;"> ' + message + ' </span>' +
//        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back">' + webphone_api.stringres.get('btn_close') + '</a>' +
//        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" data-transition="flow">Delete</a>' +
    '</div>' +
//--    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
//--        '<a href="javascript:;" style="width: 98%;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_close') + '</a>' +
//--    '</div>' +
'</div>';
 
    popupafterclose = popupafterclose ? popupafterclose : function () {};

    webphone_api.$.mobile.activePage.append(template).trigger("create");
//--    webphone_api.$.mobile.activePage.append(template).trigger("pagecreate");
//--    webphone_api.$.mobile.activePage.find(".closePopup").bind("tap", function (e)
//--    {
//--        webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
//--    });
    
    
    webphone_api.$.mobile.activePage.find(".messagePopup").bind(
    {
        popupbeforeposition: function()
        {
            webphone_api.$(this).unbind("popupbeforeposition");//--.remove();
            webphone_api.$('.ui-popup-screen').off(); // Prevent JQuery Mobile from closing a popup when user taps outside of it

            var maxHeight =  Math.floor( webphone_api.common.GetDeviceHeight() * 0.6 );  //-- webphone_api.$(window).height() - 120;

            if (webphone_api.$(this).height() > maxHeight + 100)
            {
                webphone_api.$('.messagePopup .ui-content').height(maxHeight);
            }
        }
    });
    
    webphone_api.$.mobile.activePage.find(".messagePopup").popup().popup("open").bind(
    {
        popupafterclose: function ()
        {
            webphone_api.$(this).unbind("popupafterclose").remove();
            popupafterclose();
        }
    });
    
    webphone_api.$("#pusewebrtc").on("click", function () //-- !!! also set in UserChooseEnginePopupSDK()
    {
        webphone_api.flagrestartwebrtc = true;
        webphone_api.$.mobile.activePage.find(".messagePopup").popup( "close" );

        webphone_api.common.ResetEngineClicked();
        var engine = webphone_api.common.GetEngine('webrtc');
        engine.clicked = 2;
        webphone_api.common.SetEngine('webrtc', engine);
        
        webphone_api.common.EngineSelect(1,3);
    });
    
    webphone_api.$("#pusenative").on("click", function () //-- !!! also set in UserChooseEnginePopupSDK()
    {
        webphone_api.flagrestartwebrtc = false;
        webphone_api.$.mobile.activePage.find(".messagePopup").popup( "close" );

        webphone_api.common.ResetEngineClicked();
        var engine = webphone_api.common.GetEngine('app');
        engine.clicked = 2;
        webphone_api.common.SetEngine('app', engine);
        
        webphone_api.common.StartAppEngine(false, '');
    });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: OfferNativeEngine", err); }
}

function MeasureSettingslist() // resolve window height size change
{
    try{
//--    var pgh = webphone_api.common.GetDeviceHeight() - 1; webphone_api.$('#page_settings').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_settings').css('min-height', 'auto'); // must be set when softphone is skin in div


    var pageheight = webphone_api.common.GetDeviceHeight() - webphone_api.$("#settings_header").height() - 3;

    if (filtervisible)
    {
        var margin = webphone_api.common.StrToIntPx( webphone_api.$(".ui-input-search").css("margin-top") );
        pageheight = pageheight - webphone_api.$("#settings_list").prev("form.ui-filterable").height() - margin - margin;
    }
    
    if (webphone_api.$('#settings_engine').is(':visible'))
    {
        pageheight = pageheight - webphone_api.$("#settings_engine").height() - 2;
    }
    
    if (webphone_api.$('#settings_copyright').is(':visible'))
    {
        var margin = webphone_api.common.StrToIntPx( webphone_api.$("#settings_copyright").css("margin-bottom") );
        pageheight = pageheight - webphone_api.$("#settings_copyright").height() - margin;
    }
    
    webphone_api.$("#settings_list").height(pageheight);
    webphone_api.$("#loginpage_container").height(pageheight);
    
    if (webphone_api.$('#loginpage').is(':visible'))
    {
        var matop = pageheight - webphone_api.$('#loginpage').height();
        matop = Math.floor(matop/2);
        webphone_api.$('#loginpage').css('margin-top', matop + 'px');
    }
    
//--    if (webphone_api.$('#settings_footer').is(':visible'))
//--    {
//--// set width
//--        var padding_close_str = webphone_api.$("#btn_settings_engine_close").css('padding-left');
//--        var padding_close_int = 0;
//--        if (!webphone_api.common.isNull(padding_close_str) && padding_close_str.length > 0) { padding_close_int = webphone_api.common.StrToIntPx(padding_close_str); }
//--        padding_close_int = padding_close_int + 1;
        
//--        var btn_width = webphone_api.$("#settings_footer").width() - webphone_api.$("#btn_settings_engine_close").width() - (2 * padding_close_int);
//--        btn_width = Math.floor(btn_width);
        
//--        webphone_api.$("#btn_settings_engine").width(btn_width - 3);

//--// set height
//--        var padding_top_str = webphone_api.$("#btn_settings_engine_close").css('padding-top');
//--        var padding_bottom_str = webphone_api.$("#btn_settings_engine_close").css('padding-bottom');
//--        var padding_top_int = 0;
//--        var padding_bottom_int = 0;
        
//--        if (!webphone_api.common.isNull(padding_top_str) && padding_top_str.length > 0) { padding_top_int = webphone_api.common.StrToIntPx(padding_top_str); }
//--        if (!webphone_api.common.isNull(padding_bottom_str) && padding_bottom_str.length > 0) { padding_bottom_int = webphone_api.common.StrToIntPx(padding_bottom_str); }
        
//--        var btn_height = webphone_api.$("#btn_settings_engine_close").height() + padding_top_int + padding_bottom_int;
//--        webphone_api.$("#btn_settings_engine").height(btn_height);
//--    }
    
    var brandW = Math.floor(webphone_api.common.GetDeviceWidth() / 4.6);
    webphone_api.$("#app_name_settings").width(brandW);
        
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: MeasureSettingslist", err); }
}

var accountsavailable = false; // true, if there is at least one account created. If "false". means we have to add an account at SaveSettings()
var filewaittimer = null; // we have to wait for File class to load
var waitmaxloop = 0;
function GetAccounts()
{
//--DBG     webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings GetAccounts called');
    try{
// we have to wait for File class to load
    if (waitmaxloop > 18)
    {
        webphone_api.common.PutToDebugLog(1, 'ERROR, Failed to start');
        webphone_api.common.PutToDebugLog(2, 'ERROR, _settings GetAccounts File class failed to load');
    }
    if (webphone_api.common.isNull(webphone_api.File) && waitmaxloop < 20)
    {
        waitmaxloop++;
        filewaittimer = setTimeout(function ()
        {
            GetAccounts();
        }, 200);
        return;
    }
    
    if (!webphone_api.common.isNull(filewaittimer)) { clearTimeout(filewaittimer); }
    filewaittimer = null;
    
// continue, if we have file class
    
    if ( webphone_api.common.isNull(webphone_api.global.aclist) || (webphone_api.global.aclist).length < 1 )
    {
//--DBG         webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings readaccounts');
        webphone_api.common.ReadAccountsFile(function (accisread)
        {
//--DBG             webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings GetAccounts callback');
            // if there is no accounts file, means there are no settings either
            if (!accisread)
            {
//--DBG                 webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings GetAccounts callback no content_1');
//--###MZSETT                webphone_api.common.InitializeSettings();
//--DBG                 webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings GetAccounts callback no content_2');
//--###MZSETT                webphone_api.common.GetSettingsFromUrl();
//--###MZSETT                webphone_api.common.GetOverWriteSettings();
                webphone_api.common.HandleSettings('', '', function () { ; });
                webphone_api.plhandler.ConfigChanged();
                webphone_api.init.SkinLoaded();

//--DBG                 webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings GetAccounts callback no content_3');
                AutoStart();
//--DBG                 webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings GetAccounts callback no content_4');
            }
            else // if we have accounts file, then we need to get settings filename and read setttings from file
            {
//--DBG                 webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings GetAccounts callback read successfull');
                if (!webphone_api.common.isNull(webphone_api.global.settmap))
                {
                    for (var key in webphone_api.global.settmap)
                    {
                        delete webphone_api.global.settmap[key];
                    }
                }
                if (!webphone_api.common.isNull(webphone_api.global.settmap2))
                {
                    for (var key in webphone_api.global.settmap2)
                    {
                        delete webphone_api.global.settmap2[key];
                    }
                }
                
                accountsavailable = true;
                GetSettings();
            }
        });
    }else // if we have accounts file, then read 
    {
//--DBG         webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings GetAccounts aclist exists');
        accountsavailable = true;
        GetSettings();
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: GetAccounts", err); }
}

function GetSettings()
{//--DBG webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings GetSettings called');
    try{
//--    for (var key in webphone_api.global.settmap)
//--    {
//--        webphone_api.common.PutToDebugLog(2, 'SETT: ' + key + ' = ' + webphone_api.global.settmap[key]);
//--    }

    if ( webphone_api.common.isNull(webphone_api.global.settmap) || webphone_api.common.isNull( webphone_api.global.settmap['magicnumber'] ) )
    {
        var settfilename = webphone_api.common.GetActiveAccSettingsFilename();
        
//--DBG         webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings GetSettings settfilename: ' + settfilename);

        if (webphone_api.common.isNull(settfilename) || settfilename.length < 2)
        {
//--DBG             webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings GetSettings InitializeSettings called');
//--###MZSETT            webphone_api.common.InitializeSettings();
                webphone_api.common.HandleSettings('', '', function () { ; });
                webphone_api.plhandler.ConfigChanged();
                webphone_api.init.SkinLoaded();
        }
        else // we got the active account settings filename, we can read settings
        {
//--DBG             webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings GetSettings ReadSettingsFile');
            webphone_api.common.ReadSettingsFile(settfilename, function (settisread)
            {
//--DBG                 webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings GetSettings callback');
                if (!settisread)
                {
//--DBG                     webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings GetSettings ReadSettings no content');
//--###MZSETT                    webphone_api.common.InitializeSettings();
                }
                webphone_api.plhandler.ConfigChanged();
                
                webphone_api.init.SkinLoaded();
                
//--###MZSETT                webphone_api.common.GetSettingsFromUrl();
//--###MZSETT                webphone_api.common.GetOverWriteSettings();
                AutoStart();
            });
        }
    }else
    {
//--DBG         webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings GetSettings settmap exists');
        
//--###MZSETT        webphone_api.common.GetSettingsFromUrl();
//--###MZSETT        webphone_api.common.GetOverWriteSettings();
        AutoStart();
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: GetSettings", err); }
}

var changePageCalled = false; //-- cahangePage gets called serveral times, bu we need to avoid this
function AutoStart() //if server, username and password is set, then auto start (don't show the settings)
{//--DBG webphone_api.common.PutToDebugLog(3, 'DEBUG, _settings AutoStart called');
    try{
    
    webphone_api.common.DisplayStartPage('Settings');

    
    if (startedfrom !== 'app')
    {
        var autologin = false;

        var srvTemp = webphone_api.common.GetParameter('serveraddress_user');
        var upperSrvTemp = webphone_api.common.GetParameter('upperserver');
        if (webphone_api.common.isNull(upperSrvTemp) || upperSrvTemp.length < 1) upperSrvTemp = webphone_api.common.GetParameter('upperserverdomain');
        if (webphone_api.common.isNull(upperSrvTemp) || upperSrvTemp.length < 1) upperSrvTemp = webphone_api.common.GetParameter('upperserverip');
        var usrTemp = webphone_api.common.GetSipusername();
        var pwdTemp = webphone_api.common.GetParameter('password');

        if (webphone_api.common.GetParameter('serverinputisupperserver') === 'true')
        {
            if (!webphone_api.common.isNull(upperSrvTemp) && upperSrvTemp.length > 2 && !webphone_api.common.isNull(usrTemp) && usrTemp.length > 2
                && !webphone_api.common.isNull(pwdTemp) && pwdTemp.length > 2)
            {
                autologin = true;
            }
        }
        else if (webphone_api.common.GetParameterBool('customizedversion', true) === true)
        {
            if (!webphone_api.common.isNull(usrTemp) && usrTemp.length > 2 && !webphone_api.common.isNull(pwdTemp) && pwdTemp.length > 2)
            {
                autologin =  true;
            }
        }else
        {
            if (!webphone_api.common.isNull(srvTemp) && srvTemp.length > 2 && !webphone_api.common.isNull(usrTemp) && usrTemp.length > 2
                && !webphone_api.common.isNull(pwdTemp) && pwdTemp.length > 2)
            {
                autologin = true;
            }
        }
        
//--     API_GuiStarted()  when skin is loaded
        if (webphone_api.common.IsWindowsSoftphone())
        {
            webphone_api.common.WinAPI('API_GuiStarted', function (answer)
            {
                webphone_api.common.PutToDebugLog(2, 'EVENT, _settings API_GuiStarted response: ' + answer);
            });
        }
        
        webphone_api.common.PutToDebugLog(2, 'EVENT, _settings before StartWin');
        
        var autostart = webphone_api.common.GetAutostart();
        
        if (autostart === 0)
        {
            webphone_api.common.PutToDebugLog(3, 'EVENT, settings autologin disabled because autostart is 0');
            autologin = false;
        }

        if (IsUsernameFixed() === true && IsPasswordFixed() === true)
        {
        }else
        {
            if (autostart < 2 && webphone_api.common.GetParameterInt('lastsucc', -1) === 0 && webphone_api.common.IsSDK() === false) // only for skin
            {
                autologin = false;
                webphone_api.common.PutToDebugLog(2, 'WARNING,_settings AutoStart disabled, because last login was not successfull');

                webphone_api.common.SaveParameter('last_login_failed', 'true');
                
                //-- ha azert all meg a loginnal mert elotte valami gond volt:
                //--    -kerüljön bele a voip engine a basic settings -be elso beallitasnak
                //--    -ha megvan adva a configban a serveraddress-username-passsword, akkor menjen be a basic settingsbe (ne a login oldalon alljon meg ahol csak egy settings item van)            
                var srvtmp = webphone_api.common.GetParameter('serveraddress_user');
                if (webphone_api.common.isNull(srvtmp) || srvtmp.length < 1) { srvtmp = webphone_api.common.GetParameter('serveraddress_orig'); }
                if (webphone_api.common.isNull(srvtmp) || srvtmp.length < 1) { srvtmp = webphone_api.common.GetParameter('serveraddress'); }
                
                var usrtmp = webphone_api.common.GetSipusername();
                var pwdtmp = webphone_api.common.GetParameter('password');
                
                if (usrtmp.length > 0 && pwdtmp.length > 0
                        && ( (webphone_api.common.ShowServerInput() && srvtmp.length > 0) || webphone_api.common.ShowServerInput() === false ))
                {
//diabled for now                    SubmenuSipSettings();
                }
            }
        }

    // softphone skin autologin parameter (will login even if prev unsuccessful or first session) (only for skin)
    // -1=Auto, 0=No, 1=Yes 
        var al = webphone_api.common.GetParameterInt('autologin', -1);
        if (al === 0) { autologin = false; }
        else if (al === 1) { autologin = true; }
        
        if (autologin)
        {
// content was hidden untill jquery mobile loaded. now dislpay content
            document.getElementById('phone_app_main_container').style.display = 'block';
            webphone_api.common.ShowModalLoader(webphone_api.stringres.get('loading'));
            if(webphone_api.common.CanLog(3)) { webphone_api.common.PutToDebugLogSpecial(3, 'EVENT, _settings: onStart display Loading... modal loader_2', false, ''); }

    // cahangePage gets called serveral times, bu we need to avoid this
            if (changePageCalled)
            {
                return;
            }
            changePageCalled = true;
            setTimeout(function () // reset to defualt value
            {
                changePageCalled = false;
            }, 1000);


            webphone_api.$.mobile.changePage("#page_dialpad", { transition: "pop", role: "page" });
            
            setTimeout(function ()
            {
                webphone_api.common.DisplayStartPage('Dialpad');
            }, 200);

            if (webphone_api.common.IsWindowsSoftphone())
            {
                setTimeout(function ()
                {
                    webphone_api.global.webphone_started = false;
//--                    webphone_api.webphone.StartWin();
                    
                    webphone_api.startInner( webphone_api.common.GetSipusername(), webphone_api.common.GetParameter('password') );
                }, 100);
            }else
            {
                setTimeout(function ()
                {
//--                    StartWithEngineSelect();
                    
                    webphone_api.startInner( webphone_api.common.GetSipusername(), webphone_api.common.GetParameter('password') );
                }, 150);
            }
            
            setTimeout(function ()
            {
                if (webphone_api.common.UsePresence2() === true)
                {
                    webphone_api.common.SetSelectedPresence('Offline', false);
                }
            }, 1000);

            return;
        }else
        {
            PopulateList();
        }
    }else
    {
        webphone_api.common.HideModalLoader();
//OPSSTART
        currautoprovsrv = webphone_api.common.GetParameter('serveraddress_user');
//OPSEND
        PopulateList();
    }

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: AutoStart", err); }
}

var eselect_called = false; //-- don't call EngineSelect() every time we PopulateList()
function EngineSelectStage1() //-- call EngineSelect(stage  1) before login, if we are staying on settings page
{
    try{
    if (webphone_api.common.IsWindowsSoftphone()) { return; }
    if (eselect_called) { return; }

    eselect_called = true;
    if (webphone_api.global.engineselectstage !== 0 || (webphone_api.common.GetTickCount() - webphone_api.global.engineselecttime) > webphone_api.global.ENGINE_DELAY || webphone_api.global.webrtcavailable < 0)
    {
        WaitForEngineSelectSetting();
    }else
    {
//--        wait for at least 1 second after EngineSelect stage 0 was called
        var wait = webphone_api.global.ENGINE_DELAY - (webphone_api.common.GetTickCount() - webphone_api.global.engineselecttime);
        if (wait < 0)
        {
            wait = 1;
        }

        setTimeout(function ()
        {
            WaitForEngineSelectSetting();
        }, wait);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: EngineSelectStage1", err); }
}

var engineSelectTimer = null;
var limitmaxloop = 0;
function WaitForEngineSelectSetting()
{
    try{
    if (!webphone_api.common.isNull(engineSelectTimer))
    {
        clearInterval(engineSelectTimer);
        engineSelectTimer = null;
    }
    
    engineSelectTimer = setInterval(function ()
    {
        limitmaxloop++;
        
        if (limitmaxloop > 50)
        {
            webphone_api.common.PutToDebugLog(2, 'ERROR, _settings: EngineSelect timeout');
            clearInterval(engineSelectTimer);
        }
        
//--         wait at least 1 sec before calling with stage 1
        if ((webphone_api.common.GetTickCount() - webphone_api.global.engineselecttime) > webphone_api.global.ENGINE_DELAY)
        {
            var ret = webphone_api.common.EngineSelect(1, 41);

            if (ret < 1 || webphone_api.global.webrtcavailable < 0)
            {
                if (ret < 1)
                {
                    if(webphone_api.common.CanLog(2)) { webphone_api.common.PutToDebugLog(2, 'EVENT, _settings: waiting for EngineSelect (' + limitmaxloop + ')'); }
                }
                if (webphone_api.global.webrtcavailable < 0)
                {
                    if(webphone_api.common.CanLog(2)) { webphone_api.common.PutToDebugLog(2, 'EVENT, _settings: waiting for WebRTC to load (' + limitmaxloop + ')'); }
                }
            }else
            {
                clearInterval(engineSelectTimer);

                webphone_api.common.PutToDebugLog(2, 'EVENT, _settings: selected engine(' + webphone_api.global.engineselectstage + '): '  + webphone_api.common.TestEngineToString(webphone_api.common.GetSelectedEngine(), false));
                webphone_api.common.PutToDebugLog(2, 'EVENT, _settings: recommended engine(' + webphone_api.global.engineselectstage + '): ' + webphone_api.common.TestEngineToString(webphone_api.common.GetRecommendedEngine(), false));

//--     handle push level, choose engine notification, but NOT popup
//--     display option to select engine, but don't display aggressive popup, when user must install (only after login)

                if (webphone_api.common.getuseengine() === webphone_api.global.ENGINE_WEBRTC || webphone_api.common.GetSelectedEngineName() === webphone_api.global.ENGINE_WEBRTC)
                {
                    if (webphone_api.common.UseTLSReload() === true)
                    {
                        webphone_api.common.TLSReload();
                    }
                }

                ShowEngineOptionSettings();
            }
        }
        
    }, 200);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "settings: WaitForEngineSelectSetting", err); }
}

var html_engineoption = ''; // stores engine option html element
function ShowEngineOptionSettings(force_show)
{
    try{
    if (webphone_api.common.IsWindowsSoftphone() === true) { return false; }

    var selengine = webphone_api.common.GetSelectedEngineName();
    var recengine = webphone_api.common.GetRecommendedEngineName();
    
    if (webphone_api.common.isNull(selengine) || selengine.length < 1)
    {
//--        webphone_api.common.PutToDebugLog(2, 'ERROR, _settings: ShowEngineOptionSettings no selected engine available');
        return false;
    }

// means this is the firts start, we have to use selected engine
    if (webphone_api.common.isNull(webphone_api.global.useengine) || webphone_api.global.useengine.length < 2)
    {
//--        force engine start, in case of IE, if engine is Java (otherwise it will not start any engine, if Close button is pressed)
//--         hack for IsJavaInstalled for IE, because we can't detect it properly, so we start the java engine, and fall back if it's not working
        if (webphone_api.common.GetSelectedEngineName() === 'java' && webphone_api.common.GetBrowser() === 'MSIE' && webphone_api.common.IsJavaInstalled() < 2)
        {
            ;//-- don't set webphone_api.global.useengine, because in plhandler.StartEngine it will  start recommended engine
        }else
        {
            webphone_api.common.PutToDebugLog(2, 'EVENT, Settings set useengine: ' + selengine);
            webphone_api.global.useengine = selengine;
            webphone_api.global.last_useengine = selengine;
            webphone_api.global.last_last_useengine = selengine;
        }
    }
    
//--    if (html_engineoption.length > 3) { return; }

    webphone_api.common.ShowEngineOptionOnPage(function (msg, enginetouse)
    {
//--     if an engine is forced, the don't show Choose Engine option to user
        var epjava = webphone_api.common.GetParameter2('enginepriority_java');
        var epwebrtc = webphone_api.common.GetParameter2('enginepriority_webrtc');
        var epns = webphone_api.common.GetParameter2('enginepriority_ns');
        var epflash = webphone_api.common.GetParameter2('enginepriority_flash');
        if (epjava === '5' || epwebrtc === '5' || epns === '5' || epflash === '5')
        {
            return false;
        }
        
//-- add choose engine option as a setting (above footer)
        html_engineoption = '<li data-icon="carat-d" id="settingitem_chooseengine"><a class="noshadow mlistitem"><div class="sett_text"><span class="sett_display_name">' + webphone_api.stringres.get('sett_chooseengine_title') + '</span><br><span id="sett_comment_engineservice" class="sett_comment">' + webphone_api.stringres.get('sett_chooseengine_comment') + '</span></div></a></li>';
        
return true;
//--        var listview = webphone_api.$('#settings_list').html();
//--        var footer = '';

//--        if (webphone_api.common.isNull(listview) || listview.length < 1 || listview.indexOf('settingitem_chooseengine') > 0) { return; }
//--        // if there are no engines
//--        var enginelist = webphone_api.common.GetEngineList();
//--        if (webphone_api.common.isNull(enginelist) || enginelist.length < 2) { return; }

//--        var pos = listview.indexOf('<li id="settings_footer');
//--        if (pos > 0)
//--        {
//--            footer = listview.substring(pos);
//--            listview = listview.substring(0, pos);
//--        }
        
//--        var engineservice = '<li data-icon="carat-d" id="settingitem_chooseengine"><a class="noshadow"><div class="sett_text"><span class="sett_display_name">' + webphone_api.stringres.get('sett_chooseengine_title') + '</span><br><span id="sett_comment_engineservice" class="sett_comment">' + webphone_api.stringres.get('sett_chooseengine_comment') + '</span></div></a></li>';
//--        listview = listview + engineservice + footer;

//--        webphone_api.$('#settings_list').html('');
//--        webphone_api.$('#settings_list').append(listview).listview('refresh');

//-- old footer display !!!DEPRECATED
//--        webphone_api.$('#settings_engine').show();
//--        webphone_api.$('#settings_engine_title').html(webphone_api.stringres.get('choose_engine_title'));
//--        webphone_api.$('#settings_engine_msg').html(msg);
//--        if (enginetouse === 'java')
//--        {
//--            var javainstalled = webphone_api.common.IsJavaInstalled(); // 0=no, 1=installed, but not enabled in browser, 2=installed and enabled
//--            if (javainstalled === 0)
//--            {                
//--                webphone_api.$('#btn_settings_engine').attr('href', webphone_api.global.INSTALL_JAVA_URL);
//--            }
//--            else if (javainstalled === 1)
//--            {
//--                if (webphone_api.common.GetBrowser() === 'MSIE') // can't detect if installed or just not allowed
//--                {
//--                    webphone_api.$('#btn_settings_engine').attr('href', webphone_api.global.INSTALL_JAVA_URL);
//--                }else
//--                {
//--                    webphone_api.$('#btn_settings_engine').attr('href', webphone_api.global.ENABLE_JAVA_URL);
//--                }
//--            }
//--        }
//--        else if (enginetouse === 'webrtc')
//--        {
//--            ;
//--        }
//--        else if (enginetouse === 'ns')
//--        {
//--            webphone_api.$('#btn_settings_engine').attr('href', webphone_api.common.GetNPLocation());
//--        }
//--        else if (enginetouse === 'flash')
//--        {
//--            ; // todo: implement for flash
//--        }
//--        else if (enginetouse === 'app')
//--        {
//--            ;
//--        }
//--        chooseenginetouse = enginetouse;
//--        MeasureSettingslist();
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: ShowEngineOptionSettings", err); }
    return false;
}

var  aspeak  = 'androidspeaker,';
if (webphone_api.common.GetOs() !== 'Android') { aspeak = ''; }

var  exregacc  = 'accounts,';
//OPSSTART
if (webphone_api.common.Glv() < 2) { exregacc = ''; }
//OPSEND

var utops = '';
//OPSSTART
utops = 'usetunneling,';
//OPSEND

//-- rejectonvoipbusy -> removed
//-- for java applet and service
var settOrderWebphone = 'serveraddress_user,sipusername,password,submenu_sipsettings,advancedloginsettings2,submenu_media,submenu_calldivert,submenu_general,submenu_profile,theme,language,'+ exregacc +'incomingcallpopup,sendchatonenter,voicerecording,keeprecfiles,proxyaddress,realm,username,profilepicture,displayname,email,presencestatus,share_location,profilestatustext,hidemyidentity,' + utops + 'transport,use_fast_ice,use_stun,use_rport,register,registerinterval,keepaliveival,keepalive,natopenpackets,ringtimeout,calltimeout,enableblf,dtmfmode,textmessaging,prack,earlymedia,sendrtponmuted,defmute,changesptoring,localip,signalingport,rtpport,capabilityrequest,customsipheader,normalizenumber,techprefix,filters,callforwardonbusy,callforwardonnoanswer,callforwardonnoanswertimeout,callforwardalways,calltransferalways,transfwithreplace,autoignore,autoaccept,dropsameoldcall,voicemailnum,callbacknumber,blacklist,transfertype,conferencetype,automute,autohold,holdtype,dialerintegration,integrateifwifionly,nativefilterallow,nativefilterblock,audiodevices,displayvolumecontrols,displayaudiodevice,savetocontacts,telsearchkey,extraoption,enablepush,reset_settings,loglevel,loglevel_dbg,playring,codec,alwaysallowlowcodec,icetimeout,nsupgrademode,'+
        'audio_bandwidth,video,video_bandwidth,video_width,video_height,'+
        'cfgvideo,video_profile,videocodec,'+ aspeak +
//--        'submenu_screenshare,sscontrol,ssscroll,sstop,ssquality,'+
        'video_fps,setfinalcodec,aec,denoise,agc,plc,silencesupress,hardwaremedia,volumein,volumeout,mediaencryption,setqos,codecframecount,doublesendrtp,jittersize,audiobufferlength,speakermode';
var settorderAdvancedLoginSett = "serveraddress_user,proxyaddress,transport,displayname,username,sipusername,password,realm,settobasefunctionality,accounts,operation_mode,fine_tune,submenu_general,submenu_sipsettings,submenu_media,submenu_calldivert,submenu_profile,usetunneling,autoanswer_forward,submenu_integrate,hidemyidentity,use_fast_ice,use_stun,use_rport,register,registerinterval,acceptsrvexpire,enablepresence,enableblf,keepalive,natopenpackets,ringtimeout,calltimeout,dtmfmode,textmessaging,offlinechat,prack,sendearlymedia,sendrtponmuted,defmute,changesptoring,signalingport,rtpport,capabilityrequest,customsipheader,checksrvrecords,devtest,filters,numrewriterulesadv,techprefix,callforwardonbusy,rejectonvoipbusy,rejectonphonebusy,rejectphoneonvoipbusy,voicemail,callback_accessnumber,callback_mode,accessnumber,accessnumbercalltype,transfertype,transfwithreplace,automute,autohold,holdtypeonhold,enabledirectcalls,normalizenumber,ringincall,beeponconnect,vibrate,keypadfeedback,cpualwayspartiallock,forcewifi,wifionly,keepdeviceawakeincall,unlockphone,proximitysensor,dialerintegration,ringtone,theme,profilepicture,email,info,presencestatus,share_location,integrateifwifionly,nativefilterallow,nativefilterblock,displaynotification,screenrotation,savetocontacts,extraoption,voicerecording,keepcallhistory,sendchatonenter,editbeforecall,recentcontacts,removefromtask,log,loglevel,playring,cfgvideo,callbackonincomingvideo,video_bandwidth,androidspeaker,video_width,video_height,use_h263,use_h264,use_vp8,use_vp9,cfgcpuspeed,cfgnetworkspeed,submenu_video,codec,prefcodec,alwaysallowlowcodec,setfinalcodec,disablewbforpstn,aec_orig,denoise_orig,agc_orig,plc_orig,silencesupress,hardwaremedia,volumein,volumeout,mediaencryption,setqos,codecframecount,doublesendrtp,jittersize,audiobufferlength,speakerphoneoutput,audiorecorder,audioplayer,speakerphoneplayer,incomingcallalert,autousebluetooth,speakermode,focusaudio,useroutingapi,scheduledwakeup,autorestart,runservice,enablefcm,backexit,killonexit,reset_settings";
var settOrderWebphoneWebRTCFlash = 'serveraddress_user,sipusername,password,submenu_sipsettings,advancedloginsettings2,submenu_media,submenu_calldivert,submenu_general,submenu_profile,theme,language,'+ exregacc +'incomingcallpopup,sendchatonenter,voicerecording,keeprecfiles,proxyaddress,realm,username,profilepicture,displayname,email,presencestatus,share_location,profilestatustext,hidemyidentity,' + utops + 'ringtimeout,calltimeout,enableblf,dtmfmode,textmessaging,earlymedia,defmute,customsipheader,normalizenumber,techprefix,filters,voicemailnum,callbacknumber,callforwardonbusy,callforwardonnoanswer,callforwardonnoanswertimeout,callforwardalways,calltransferalways,transfwithreplace,autoignore,autoaccept,dropsameoldcall,blacklist,transfertype,conferencetype,holdtype,autohold,dialerintegration,integrateifwifionly,nativefilterallow,nativefilterblock,audiodevices,displayvolumecontrols,displayaudiodevice,savetocontacts,telsearchkey,extraoption,enablepush,reset_settings,loglevel,loglevel_dbg,codec,alwaysallowlowcodec,icetimeout,nsupgrademode,'+
        'audio_bandwidth,video,video_bandwidth,video_width,video_height,'+
        'cfgvideo,video_profile,videocodec,'+ aspeak +
//--        'submenu_screenshare,sscontrol,ssscroll,sstop,ssquality,'+
        'video_fps,aec,agc,volumein,volumeout';

//-- for featureset = 5 (reduced)
var settOrderReduced = 'serveraddress_user,sipusername,password,username,displayname,email,hidemyidentity,textmessaging,voicemailnum,callbacknumber,loglevel';

//The following settings are not needed in the customizedversion, unless “featureset” parameter  is set to 4. (1: Minimal, 2: Reduced, 3: Normal (default), 4: Extra) 
//    Hide my identity,Realm,Use ICE,Use STUN,Use rport,Register,Register interval,Keep alive,NAT open packets,Use PRACK,Capability request,Set final codec,
var settOrderReducedCustomized = 'hidemyidentity,realm,use_fast_ice,use_stun,use_rport,register,registerinterval,keepaliveival,keepalive,natopenpackets,prack,capabilityrequest,setfinalcodec';
var settorderAdvancedLoginSett = "serveraddress_user,proxyaddress,transport,displayname,username,sipusername,password,realm,settobasefunctionality,accounts,operation_mode,fine_tune,submenu_general,submenu_sipsettings,submenu_media,submenu_calldivert,submenu_profile,usetunneling,autoanswer_forward,submenu_integrate,hidemyidentity,use_fast_ice,use_stun,use_rport,register,registerinterval,acceptsrvexpire,enablepresence,enableblf,keepalive,natopenpackets,ringtimeout,calltimeout,dtmfmode,textmessaging,offlinechat,prack,sendearlymedia,sendrtponmuted,defmute,changesptoring,signalingport,rtpport,capabilityrequest,customsipheader,checksrvrecords,devtest,filters,numrewriterulesadv,techprefix,callforwardonbusy,rejectonvoipbusy,rejectonphonebusy,rejectphoneonvoipbusy,voicemail,callback_accessnumber,callback_mode,accessnumber,accessnumbercalltype,transfertype,transfwithreplace,automute,autohold,holdtypeonhold,enabledirectcalls,normalizenumber,ringincall,beeponconnect,vibrate,keypadfeedback,cpualwayspartiallock,forcewifi,wifionly,keepdeviceawakeincall,unlockphone,proximitysensor,dialerintegration,ringtone,theme,profilepicture,email,info,presencestatus,share_location,integrateifwifionly,nativefilterallow,nativefilterblock,displaynotification,screenrotation,savetocontacts,extraoption,voicerecording,keepcallhistory,sendchatonenter,editbeforecall,recentcontacts,removefromtask,log,loglevel,playring,cfgvideo,callbackonincomingvideo,video_bandwidth,androidspeaker,video_width,video_height,use_h263,use_h264,use_vp8,use_vp9,cfgcpuspeed,cfgnetworkspeed,submenu_video,codec,prefcodec,alwaysallowlowcodec,setfinalcodec,disablewbforpstn,aec_orig,denoise_orig,agc_orig,plc_orig,silencesupress,hardwaremedia,volumein,volumeout,mediaencryption,setqos,codecframecount,doublesendrtp,jittersize,audiobufferlength,speakerphoneoutput,audiorecorder,audioplayer,speakerphoneplayer,incomingcallalert,autousebluetooth,speakermode,focusaudio,useroutingapi,scheduledwakeup,autorestart,runservice,enablefcm,backexit,killonexit,reset_settings";

//-- for windows softphone
var settOrderWin = 'serveraddress_user,sipusername,password,submenu_sipsettings,advancedloginsettings2,submenu_media,submenu_calldivert,submenu_general,submenu_profile,theme,language,startwithos,'+ exregacc +'voicerecording,keeprecfiles,proxyaddress,realm,username,profilepicture,displayname,email,presencestatus,share_location,profilestatustext,flash,beeponincoming,sendchatonenter,importonlywithnum,hidemyidentity,' + utops + 'transport,use_fast_ice,use_stun,use_rport,register,registerinterval,keepaliveival,keepalive,natopenpackets,ringtimeout,calltimeout,enableblf,dtmfmode,textmessaging,prack,earlymedia,sendrtponmuted,defmute,changesptoring,localip,signalingport,rtpport,capabilityrequest,customsipheader,normalizenumber,techprefix,filters,callforwardonbusy,callforwardonnoanswer,callforwardonnoanswertimeout,callforwardalways,calltransferalways,transfwithreplace,autoignore,autoaccept,dropsameoldcall,rejectonvoipbusy,voicemailnum,callbacknumber,blacklist,transfertype,conferencetype,automute,autohold,holdtype,dialerintegration,integrateifwifionly,nativefilterallow,nativefilterblock,audiodevices,displayvolumecontrols,displayaudiodevice,savetocontacts,telsearchkey,extraoption,enablepush,reset_settings,loglevel,loglevel_dbg,playring,'
        +'video,video_bandwidth,video_width,video_height,'
        +'cfgvideo,videomode,video_profile,videocodec,'+
        'submenu_screenshare,sscontrol,ssscroll,sstop,ssquality,'+
        'video_fps,codec,setfinalcodec,alwaysallowlowcodec,aec,denoise,agc,plc,silencesupress,hardwaremedia,volumein,volumeout,mediaencryption,setqos,codecframecount,doublesendrtp,jittersize,audiobufferlength,speakermode';
//--var basicSettings = 'settobasefunctionality,serveraddress_user,sipusername,password,submenu_sipsettings,submenu_calldivert,submenu_general,submenu_integrate,username,displayname,usetunneling,transport,proxyaddress,use_stun,register,registerinterval,keepalive,ringtone,filters,transfwithreplace,autoignore,autoaccept,startonboot,dialerintegration,integrateifwifionly,nativefilterallow,nativefilterblock,email,cpualwayspartiallock,forcewifi,reset_settings,accounts,log,new_user_artcl,recharge_artcl';
var basicSettings = 'settobasefunctionality,theme,username,displayname,' + utops + 'transport,proxyaddress,register,ringtone,voicerecording,startonboot,dialerintegration,integrateifwifionly,nativefilterallow,nativefilterblock,cpualwayspartiallock,forcewifi,email,loglevel,startwithos';
var basicSettingsCustomized = 'settobasefunctionality,theme,displayname,ringtone,voicerecording,startonboot,dialerintegration,integrateifwifionly,nativefilterallow,nativefilterblock,cpualwayspartiallock,forcewifi,email,loglevel,startwithos';
//-- not used  var highlightedSettings = 'displayname,usetunneling,ringtone,startonboot,startwithos,submenu_integrate,dialerintegration';
var currGroup = 20;

var printdevice = true; // print device only once
function PopulateList() //will return true if auto switched inside Settings...
{
    try{
    webphone_api.common.DoVersioning();
    
    EngineSelectStage1();

    var hasonlysettings = 1; //0: no (has other setting), 1: no other settings, 2: has settings
    if(ShowEngineOptionSettings()) hasonlysettings = 0;
//--    if (currGroup !== webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN) && isSettLevelBasic === false)
//--    {
//--        ShowEngineOptionSettings(true); // always show engine options in advanced settings -> group SIP
//--    }else
//--    {
//--        ShowEngineOptionSettings(false);
//--    }
    webphone_api.common.SetCurrTheme();
    
// put username / password in login fields
    if (ShowLoginPage())
    {
        if (webphone_api.common.ShowServerInput())
        {
            webphone_api.common.SaveParameter('iswebrtcuppersrvfromuser', 'true');
//--            upperserverfromuser  0=not needed, 1=no need to enter (preconfigured), 2=maybe,3=yes
//--             !!!! HACK !!!
            if (webphone_api.common.GetParameter('showserverinput') === '1' && webphone_api.common.GetConfigInt('upperserverfromuser', 2) < 2)
            {
                ;
            }else
            {
                webphone_api.$('#lp_serveraddress').val(webphone_api.common.GetParameter('serveraddress_user'));
//--                document.getElementById('lp_serveraddress').style.display = 'block';
                webphone_api.$('#lp_serveraddress').closest( 'div.ui-input-text' ).show();
            }
        }

//BRANDSTART
        if (webphone_api.common.GetConfigInt('brandid', -1) !== 58) // enikma
        {
            webphone_api.$('#lp_username').val(webphone_api.common.GetSipusername());
            webphone_api.$('#lp_password').val(webphone_api.common.GetParameter('password'));
        }
//BRANDEND
        
//--     Kéne legyen rá lehetőség, hogy müködjön jelszó nélkül.
//--	- Pl. ha a password „nopassword” –ra van állitva, akkor ezt kezelni kéne speciálisan a softphone skin –en: annyi az összes tennivaló,
//--		hogy ilyenkor nemkéne megjeleniteni a password inputot a settingsben és a login képernyőn. Semmi más változtatás nem kell.
//--	- if username is "anonymous", then treat as nopassword
        if (webphone_api.common.GetSipusername() === 'anonymous')
        {
            webphone_api.$('#lp_username').hide();
        }
        if (webphone_api.common.GetParameter('password') === 'nopassword')
        {
            webphone_api.$('#lp_password').hide();
        }
    }
    MeasureSettingslist();

    if ( webphone_api.common.isNull(document.getElementById('settings_list')) )
    {
        webphone_api.common.PutToDebugLog(2, "ERROR, _settings: PopulateList listelement is null");
        return false;
    }
    
    webphone_api.common.PutToDebugLog(5, 'EVENT, _settings Starting populate list');
    webphone_api.global.sipstackstarted = false;
    
    var listview = '';

    var settOrderTmp = '';
//--    if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE())
    if (webphone_api.common.IsWindowsSoftphone())
    {
        if (printdevice) { webphone_api.common.PutToDebugLog(2, 'EVENT, settings: Device: Windows softphone'); }
        settOrderTmp = settOrderWin;
        
//--         hide the startwithos option once it is already set
        if (webphone_api.common.ParameterIsDefault('startwithos', true) === false)
        {
            settOrderTmp = settOrderTmp.replace(',startwithos', '');
        }
    }else
    {
        if (printdevice) { webphone_api.common.PutToDebugLog(2, 'EVENT, settings: Device: browser webphone'); }
        settOrderTmp = settOrderWebphone;
        if (webphone_api.common.getuseengine() === webphone_api.global.ENGINE_WEBRTC || webphone_api.common.getuseengine() === webphone_api.global.ENGINE_FLASH)
        {
            settOrderTmp = settOrderWebphoneWebRTCFlash;
        }
        
//--         remove enginepriority_nativedial id not mobile
        
        if (webphone_api.common.GetOs() !== 'Android' && webphone_api.common.GetOs() !== 'iOS')
        {
            settOrderTmp.replace('enginepriority_nativedial,', '');
        }
    }
//BRANDSTART
    if (webphone_api.common.GetConfigInt('brandid', -1) === 50) // favafone
    {
        basicSettingsCustomized = 'startwithos,loglevel,displayvolumecontrols,displayaudiodevice,savetocontacts';
        settOrderTmp = 'startwithos,loglevel,displayvolumecontrols,displayaudiodevice,savetocontacts';
    }
//BRANDEND

    if (isAdvancedLoginSett > 0)
    {
        settOrderTmp = settorderAdvancedLoginSett;
    }

    if (currfeatureset < 10) // reduced
    {
       settOrderTmp = settOrderReduced;
    }
    
    printdevice = false;
    
//OPSSTART
    if (webphone_api.common.Glvd() === false)
    {
        settOrderTmp = settOrderTmp.replace('videocodec,', '');
        settOrderTmp = settOrderTmp.replace('video_fps,', '');
        settOrderTmp = settOrderTmp.replace('video_profile,', '');
        settOrderTmp = settOrderTmp.replace('cfgvideo,', '');
        settOrderTmp = settOrderTmp.replace('video_height,', '');
        settOrderTmp = settOrderTmp.replace('video_width,', '');
        settOrderTmp = settOrderTmp.replace('video_bandwidth,', '');
        settOrderTmp = settOrderTmp.replace('video,', '');
    }
    if (webphone_api.common.Glv() < 2)
    {
//--          + conference, call recording, file transfer
        if (webphone_api.common.Glv() < 1)
        {
            settOrderTmp = settOrderTmp.replace('callforwardonbusy,', '');
            settOrderTmp = settOrderTmp.replace('callforwardonnoanswer,', '');
            settOrderTmp = settOrderTmp.replace('callforwardalways,', '');
            settOrderTmp = settOrderTmp.replace('calltransferalways,', '');
            settOrderTmp = settOrderTmp.replace('transfertype,', '');
            settOrderTmp = settOrderTmp.replace('conferencetype,', '');
        }
    }
//OPSENS

    var settOrderReducedCustomizedArray = settOrderReducedCustomized.split(',');

    // extraloginpageinputs=proxy,sip
    var elpi = webphone_api.common.GetParameter('extraloginpageinputs');
    var extraLits = [];
    if (!webphone_api.common.isNull(elpi) && elpi.length > 0)
    {
        extraLits = elpi.split(',');
    }
    if (webphone_api.common.isNull(extraLits)) { extraLits = []; }

    var loopindex = 0;
    while (settOrderTmp.length > 0 && loopindex < 5000)
    {
        loopindex++;
        
        var listitem = '';
        
        var pos = settOrderTmp.indexOf(",");
        if (pos <= 0)
        {
            if (settOrderTmp.length > 0)
            {
                pos = settOrderTmp.length;
            }else
            {
                break;
            }
        }
	    	
        var settName = settOrderTmp.substring(0, pos);
        if (pos + 1 < settOrderTmp.length) { settOrderTmp = ( webphone_api.common.Trim(settOrderTmp.substring(pos + 1))); } else { settOrderTmp = ""; }

        if ( webphone_api.common.isNull(settName) || settName.length < 1) { continue; }

        var value = webphone_api.global.settmap2[settName];

        if( webphone_api.common.isNull(value) ) { continue; }

        var settValue = value[webphone_api.common.SETT_VALUE];
        var settType = value[webphone_api.common.SETT_TYPE];
        var settIsdefault = value[webphone_api.common.SETT_ISDEFAULT];
        
        var settGroupingInt = 0;
        try{ settGroupingInt = webphone_api.common.StrToInt( webphone_api.common.Trim( value[webphone_api.common.SETT_GROUP]));
             if ( webphone_api.common.isNull(settGroupingInt) ) { settGroupingInt = 0; }
        } catch(errin){ webphone_api.common.PutToDebugLogException(3,"_settings: populateList settGrouping can't be converted to integer", errin); }
        
//-- hide http requests in customized version
//--        if (webphone_api.common.GetParameterBool('customizedversion', true) === true)
//--        {
//--            if (settName === 'creditrequest' || settName === 'ratingrequest' || settName === 'p2p' || settName === 'callback' || settName === 'sms')
//--            {
//--                continue;
//--            }
//--        }

        var settDisplayName = webphone_api.stringres.get('sett_display_name_'+settName);
        var settComment = webphone_api.stringres.get('sett_comment_'+settName);
        var settCommentShort = webphone_api.stringres.get('sett_comment_short_'+settName);

// display all setttings when search / filter is visible
        if (!filtervisible)
        {
            //display only current group
            if (isSettLevelBasic)
            {
                if (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN))
                {
                    if (settGroupingInt !== currGroup && settName !== 'accounts' && extraLits.indexOf(settName) < 0)
                    {
                        continue;
                    }
                }
                else
                {
                    if (webphone_api.common.GetParameterBool('customizedversion', true) === true)
                    {
                        if (basicSettingsCustomized.indexOf(settName) < 0)
                        {
                            continue;
                        }
                    }else
                    {
                        if (basicSettings.indexOf(settName) < 0)
                        {
                            continue;
                        }
                    }
                }
            }else
            {
                if (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_PROFILE))
                {
                    if (settGroupingInt !== currGroup && settName !== 'displayname' && settName !== 'email' && settName !== 'presencestatus')
                    {
                        continue;
                    }

                    if (settName === 'displayname')
                    {
                        settDisplayName = webphone_api.stringres.get('name');
                        settComment = webphone_api.stringres.get('displayname_login');
                    }
                }else
                {
                    if (settGroupingInt !== currGroup && settName !== 'accounts' && settName !== 'ringtone'  && settName !== 'serveraddress_user')
                    {											// accounts is shown in main settings too, if there are more than 1 account
                        continue;
                    }
                }
            }
            
//--            if (settGroupingInt !== currGroup && settName !== 'accounts' && settName !== 'ringtone')
//--            {											// accounts is shown in main settings too, if there are more than 1 account
//--                continue;
//--            }
//--            if (currGroup !== webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN) && isSettLevelBasic && basicSettings.indexOf(settName) < 0)
//--            {
//--                continue;
//--            }
        }
        
//BRANDSTART
        if (webphone_api.common.GetConfigInt('brandid', -1) === 60) //-- voipmuch
        {
            if (settName === 'username') { continue; } //-- hide caller ID
        }
//BRANDEND

//The following settings are not needed in the customizedversion, unless “featureset” parameter  is set to 4. (0: Minimal, 5: Reduced, 10: Normal (default), 15: Extra) 
//    Hide my identity,Realm,Use ICE,Use STUN,Use rport,Register,Register interval,Keep alive,NAT open packets,Use PRACK,Capability request,Set final codec,
        if (webphone_api.common.GetParameterBool('customizedversion', true) === true)
        {
            if (currfeatureset < 10)
            {
                if (settOrderReducedCustomizedArray.indexOf(settName) >= 0)
                {
                    continue;
                }
            }
        }
        
        if (settName === 'accounts')
        {
            /*if ((isSettLevelBasic && currGroup !== webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN)) ||
                    currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_GENERAL) ||
                    (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN) && !webphone_api.common.isNull(webphone_api.global.sipaccounts) && webphone_api.global.sipaccounts.length > 1))*/
            if (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_SIP) ||
                    (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN) && !webphone_api.common.isNull(webphone_api.global.sipaccounts) && webphone_api.global.sipaccounts.length > 1))
            {
                ;
            }else
            {
                continue;
            }
        }
        
//-- dialer integration not implemented
        if (settGroupingInt === webphone_api.common.StrToInt(webphone_api.common.GROUP_INTEGRATE))
        {
            continue;
        }

        if ( webphone_api.common.isNull(settType) || settType.length < 1 || 
                (settType !== '0' && settType !== '1' && settType !== '2' && settType !== '3' && settType !== '4'
                && settType !== '5' && settType !== '6' && settType !== '7' && settType !== '8'))
        {
            if (settType !== '-1')
            {
                webphone_api.common.PutToDebugLog(2,"ERROR, _settings: "+settType+" is incorrectly defined in InitializeSettings");
            }
            continue;
        }
        
        if (webphone_api.common.HideSettings(settName, settDisplayName, settName) === true) { continue; }
        
//--     Kéne legyen rá lehetőség, hogy müködjön jelszó nélkül.
//--	- Pl. ha a password „nopassword” –ra van állitva, akkor ezt kezelni kéne speciálisan a softphone skin –en: annyi az összes tennivaló,
//--		hogy ilyenkor nemkéne megjeleniteni a password inputot a settingsben és a login képernyőn. Semmi más változtatás nem kell.
//--	- if username is "anonymous", then treat as nopassword
        if (settName === 'sipusername')
        {
            if (settValue === 'anonymous') { continue; }
//--         if username or password is set fixed in webphone_api.parameters or config.js, then don't display user/pwd input
            if (IsUsernameFixed() === true)
            {
                continue;
            }
        }
        if (settName === 'password')
        {
            if (settValue === 'nopassword') { continue; }
            // if username or password is set fixed in webphone_api.parameters or config.js, then don't display user/pwd input
            if (IsPasswordFixed() === true)
            {
                continue;
            }
        }
        
        if (settName === 'serveraddress_user')
        {
            if (webphone_api.common.ShowServerInput())
            {
                if (currGroup !== webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN) && currGroup !== webphone_api.common.StrToInt(webphone_api.common.GROUP_SIP))
                {
                    continue;
                }
                
                webphone_api.common.SaveParameter('iswebrtcuppersrvfromuser', 'true');
//--                upperserverfromuser  0=not needed, 1=no need to enter (preconfigured), 2=maybe,3=yes
//--                 !!!! HACK !!!
                //if (webphone_api.common.GetParameter('showserverinput') === '1' && webphone_api.common.GetConfigInt('upperserverfromuser', 2) < 2)
                if (!webphone_api.common.RequestUserServerInput())
                {
                    continue;
                }

                settDisplayName = webphone_api.common.GetParameter('server_label');
                if ((settDisplayName.toLowerCase()).indexOf('op code') >= 0 || (settDisplayName.toLowerCase()).indexOf('operator code') >= 0)
                {
                    settComment = webphone_api.stringres.get('sett_comment_serveraddress_user_operator');
                }
            }else
            {
                continue; //-- don't show server input
            }
        }
        
        if (settName === 'theme' && (webphone_api.common.GetConfig('showtheme') === 'false' || webphone_api.common.GetParameterBool('customizedversion', false) === true)) { continue; }
        
        if (settName === 'loglevel_dbg')
        {
            var loglevel = webphone_api.common.GetLogLevel();
            if (loglevel < 2)
            {
                continue;
            }
        }
        
        if (settName === 'telsearchkey')
        {
            if (webphone_api.common.isNull(webphone_api.common.GetConfig('telsearchurl')) || webphone_api.common.GetConfig('telsearchurl').length < 3)
            {
                continue;
            }
        }
        
//--         show only username/password on first start
//--        if (webphone_api.common.GetParameter('customizedversion') === 'true' && startedfrom !== 'app')
//--        {
//--            if (webphone_api.common.ShowServerInput())
//--            {
//--                if (settName !== 'serveraddress_user' && settName !== 'sipusername' && settName !== 'password')
//--                {
//--                    continue;
//--                }
//--            }else
//--            {
//--                if (settName !== 'sipusername' && settName !== 'password')
//--                {
//--                    continue;
//--                }
//--            }
//--        }
        
//-- not used
//--        if (!isSettLevelBasic && highlightedSettings.indexOf(settName) >= 0)
//--        {
//--            settDisplayName = '<b>' + settDisplayName + '</b>';
//--        }


// icetimeout setting on the softphone skin user interface advanced settings (but should not be displayed when used as windows softphone or other engines forced/webrtc engine disabled)
        if (settName === 'icetimeout')
        {
            if (webphone_api.common.IsWindowsSoftphone() === true) { continue; }

            var ep_webrtc = webphone_api.common.GetParameterInt('enginepriority_webrtc', 2);
            if (ep_webrtc < 1) { continue; }

            var ep_java = webphone_api.common.GetParameterInt('enginepriority_java', 2);
            var ep_ns = webphone_api.common.GetParameterInt('enginepriority_ns', 2);
            var ep_flash = webphone_api.common.GetParameterInt('enginepriority_flash', 2);
            var ep_app = webphone_api.common.GetParameterInt('enginepriority_app', 2);
            var ep_p2p = webphone_api.common.GetParameterInt('enginepriority_p2p', 2);
            var ep_accessnum = webphone_api.common.GetParameterInt('enginepriority_accessnum', 2);
            var ep_nativedial = webphone_api.common.GetParameterInt('enginepriority_nativedial', 2);

            if (ep_webrtc < 3 &&
                (ep_java > 3 || ep_ns > 3 || ep_flash > 3 || ep_app > 3 || ep_p2p > 3 || ep_accessnum > 3 || ep_nativedial > 3))
            {
                continue;
            }
        }


        var comment = '';
        
        if (settIsdefault === '0' || settName === 'sipusername' || settName === 'password' || settName === 'serveraddress_user') // means the default value was changed
        {
            comment = GetSettComment(settName) + ' ' + GetSettFormattedValue(settName);
        }else
        {
            comment = GetSettComment(settName);
        }
        
        if (webphone_api.common.GetParameter('serverinputisupperserver') === 'true')
        {
            if (settName === 'serveraddress_user')
            {
//BRANDSTART
                if (webphone_api.common.GetParameterInt('brandid', -1) === 2) // gmsdialergold
                    comment = webphone_api.stringres.get('sett_comment_serveraddress_user_gmsdialer') + ' ' + GetSettFormattedValue(settName);
                else
//BRANDEND
                    comment = GetSettComment(settName) + ' ' + GetSettFormattedValue(settName);
            }
        }
        
        if (settName === 'serveraddress_user')
        {
            if (webphone_api.common.GetConfig('server_comment').length > 1)
            {
                comment = webphone_api.common.GetConfig('server_comment') + ' ' + GetSettFormattedValue(settName);
            }
        }
        
        if (settName === 'transport')
        {
            if (webphone_api.common.GetParameter('serverinputisupperserver') === 'true' || webphone_api.common.GetParameterBool('autotransportdetect', false) === true)
            {
                continue;
            }
        }
        
// if demo index page, then also read settings from cookie
        try{
        if (window.location.href.indexOf('isdemopage=true') > 0
                && (settName === 'sipusername' || settName === 'username' || settName === 'password' || settName === 'sippassword' || settName === 'serveraddress_user'
                || settName === 'serveraddress_orig' || settName === 'serveraddress' || settName === 'upperserver' || settName === 'callto' || settName === 'destination'))
        {
            var tmp = webphone_api.getparameter(settName);
            if (settName === 'sipusername' && tmp.length < 1) { tmp = webphone_api.getparameter('username'); }
            if (settName === 'serveraddress_user' && tmp.length < 1 && webphone_api.common.RequestUserServerInput() === false) { tmp = webphone_api.getparameter('serveraddress'); }
            if (!webphone_api.common.isNull(tmp) && tmp.length > 0 &&
                    (webphone_api.common.isNull(settValue) || settValue.length < 1))
            {
                webphone_api.setparameter(settName, tmp);
                settValue = tmp;
            }
        }
        } catch(e) { webphone_api.common.PutToDebugLogException(2, '_settings: Populateliet inner1', e); }
        
        
        
//--<li data-icon="carat-d"><a href="javascript:void(0)" class="noshadow"><div class="sett_text"><span class="sett_display_name">Username</span><br><span class="sett_comment">Sip account username Sip account username Sip account username</span></div></a></li>
//--<li data-icon="false"><a href="javascript:void(0)" class="noshadow"><div class="sett_text"><span class="sett_display_name">Password</span><br><span class="sett_comment">Sip account password Sip account password Sip account password</span></div><div class="sett_image"><img src="images\checkbox_true.png" /></div></a></li>
        
//--        listitem = '<li data-icon="[SETTICON]" id="[ITEMID]"><a href="javascript:void(0)" class="noshadow"><div class="sett_text"><span class="sett_display_name">[DISPLAYNAME]</span><br><span id="[COMMENTID]" class="sett_comment">[COMMENT]</span></div>[TRUEFALSEIMG]</a></li>';
        listitem = '<li data-icon="[SETTICON]" id="[ITEMID]" title="[SETT_TITLE]"><a class="noshadow mlistitem"><div class="sett_text"><span class="sett_display_name">[DISPLAYNAME]</span><br><span id="[COMMENTID]" class="sett_comment">[COMMENT]</span></div>[TRUEFALSEIMG]</a></li>';
        
        /**type - 0 = checkbox, 1 = text box, 2 = drop down list, 3 = drop down list and checkbox,
		    	 4 = seek bar, 5 = open new activity, 6 = submenu, 7 = drop down list from XML string-array, 8 = custom*/
        
        if (settType === '0')
        {
            // handle 2 as TRUE and 1 as FALSE
            if (settName === 'flash' || settName === 'sscontrol' || settName === 'ssscroll' || settName === 'sstop')
            {
                if (settValue === '2') { settValue = 'true'; }else{ settValue = 'false'; }
            }
            else if (settName === 'beeponincoming')
            {
                if (settValue === '1') { settValue = 'true'; }else{ settValue = 'false'; }
            }
            
            if (settName === 'loglevel') // handle loglevel separatelly, because values range from 1 to 5 or more
            {
                var tmplevel = webphone_api.common.StrToInt(settValue);
                if (tmplevel > 1)
                {
                    listitem = listitem.replace('[TRUEFALSEIMG]', '<div class="sett_image"><img src="' + webphone_api.common.GetElementSource() + 'images/checkbox_true.png" id="img_' + settName + '" /></div>');
                }else
                {
                    listitem = listitem.replace('[TRUEFALSEIMG]', '<div class="sett_image"><img src="' + webphone_api.common.GetElementSource() + 'images/checkbox_false.png" id="img_' + settName + '" /></div>');
                }
            }
            else if (settValue === 'true')
            {
                listitem = listitem.replace('[TRUEFALSEIMG]', '<div class="sett_image"><img src="' + webphone_api.common.GetElementSource() + 'images/checkbox_true.png" id="img_' + settName + '" /></div>');
            }else
            {
                listitem = listitem.replace('[TRUEFALSEIMG]', '<div class="sett_image"><img src="' + webphone_api.common.GetElementSource() + 'images/checkbox_false.png" id="img_' + settName + '" /></div>');
            }
            
            listitem = listitem.replace('[SETTICON]', 'false');
        }else
        {
            listitem = listitem.replace('[TRUEFALSEIMG]', '');
        }
            
        if (settType === '1' || settType === '2' || settType === '3' || settType === '4' || settType === '5' || settType === '7' || settType === '8')
        {
            listitem = listitem.replace('[SETTICON]', 'carat-d');
        }

        if (settType === '6')
        {
            listitem = listitem.replace('[SETTICON]', 'carat-r');
        }
        
        listitem = listitem.replace('[ITEMID]', 'settingitem_' + settName);
        listitem = listitem.replace('[DISPLAYNAME]', settDisplayName);
        listitem = listitem.replace('[COMMENT]', comment);
        listitem = listitem.replace('[COMMENTID]', 'sett_comment_' + settName);
        listitem = listitem.replace('[SETT_TITLE]', settComment);

        

        listview = listview + listitem;
        hasonlysettings = 0;
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: PopulateList", err); }
    
    setTimeout(function ()
    {
        webphone_api.common.HideModalLoader();
    }, 800);

// settings entry
    var show_showSetitngsEntry = true;
    if (filtervisible === false)
    {
        

        if (
            (startedfrom !== 'app' || webphone_api.common.GetParameter("sipusername").length < 1 || webphone_api.common.GetParameter("password").length < 1)
                && currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN))
        {
            show_showSetitngsEntry = false;

            var settitem = '<li data-icon="carat-r" id="settingitem_advancedloginsettings" title="' + webphone_api.stringres.get('sett_comment_advancedloginsettings') + '"><a class="noshadow mlistitem"><div class="sett_text"><span class="sett_display_name">' + webphone_api.stringres.get('sett_display_name_advancedloginsettings') + '</span><br><span id="sett_comment_advancedloginsettings" class="sett_comment">' + webphone_api.stringres.get('sett_comment_advancedloginsettings') + '</span></div></a></li>';
            listview = listview + settitem;
            hasonlysettings = 0;
        }


        if ((webphone_api.common.GetParameterBool('customizedversion', true) === false || startedfrom === 'app' || webphone_api.common.GetParameter('newuser_second').length > 3)
                && currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN))
        {
            if (show_showSetitngsEntry)
            {
                var settenteritem = '<li data-icon="carat-r" id="settingitem_entersettings" title="' + webphone_api.stringres.get('sett_comment_entersettings') + '"><a class="noshadow mlistitem"><div class="sett_text"><span class="sett_display_name">' + webphone_api.stringres.get('sett_display_name_entersettings') + '</span><br><span id="sett_comment_advancedsettings" class="sett_comment">' + webphone_api.stringres.get('sett_comment_entersettings') + '</span></div></a></li>';
                listview = listview + settenteritem;
                if(hasonlysettings == 1) hasonlysettings = 2;
            }
        }

        if (/*showadvacedsettings && */isSettLevelBasic && currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_MAIN) && currfeatureset > 5 && isAdvancedLoginSett < 1)
        {
            var advanceditem = '<li data-icon="carat-r" id="settingitem_advancedsettings" title="' + webphone_api.stringres.get('sett_comment_submenu_advanced') + '"><a class="noshadow mlistitem"><div class="sett_text"><span class="sett_display_name">' + webphone_api.stringres.get('sett_display_name_advancedsettings') + '</span><br><span id="sett_comment_advancedsettings" class="sett_comment">' + webphone_api.stringres.get('sett_comment_advancedsettings') + '</span></div></a></li>';
            listview = listview + advanceditem;
            hasonlysettings = 0;
        }

        if (isAdvancedLoginSett == 1 && currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_MAIN))
        {
            var moreitem = '<li data-icon="carat-r" id="settingitem_moresettings" title="' + webphone_api.stringres.get('sett_comment_moresettings') + '"><a class="noshadow mlistitem"><div class="sett_text"><span class="sett_display_name">' + webphone_api.stringres.get('sett_display_name_moresettings') + '</span><br><span id="sett_comment_moresettings" class="sett_comment">' + webphone_api.stringres.get('sett_comment_moresettings') + '</span></div></a></li>';
            listview = listview + moreitem;
            hasonlysettings = 0;
        }
/*
        if (!isSettLevelBasic && currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_MAIN))
        {
            temp = new HashMap<String,Object>();

            temp.put("display_name", getResources().getString(R.string.sett_display_name_basicsettings));
            temp.put("display_name_bold","");
            temp.put("comment", getResources().getString(R.string.sett_comment_basicsettings));
            temp.put("type", R.drawable.spacer);
            settList.add(temp);
        }*/




/*

        // advanced settings entry
        if (webphone_api.common.HideSettings('advancedsettings', '', 'advancedsettings') === false)
        {
            if (isSettLevelBasic && currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_MAIN) && currfeatureset > 5)
            {
                var advanceditem = '<li data-icon="carat-r" id="settingitem_advancedsettings"><a class="noshadow mlistitem"><div class="sett_text"><span class="sett_display_name">' + webphone_api.stringres.get('sett_display_name_advancedsettings') + '</span><br><span id="sett_comment_advancedsettings" class="sett_comment">' + webphone_api.stringres.get('sett_comment_advancedsettings') + '</span></div></a></li>';
                listview = listview + advanceditem;
            }
        }

        if ((webphone_api.common.GetParameterBool('customizedversion', true) !== true || startedfrom === 'app') && currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN))
        {
            var settenteritem = '<li data-icon="carat-r" id="settingitem_entersettings"><a class="noshadow mlistitem"><div class="sett_text"><span class="sett_display_name">' + webphone_api.stringres.get('sett_display_name_entersettings') + '</span><br><span id="sett_comment_advancedsettings" class="sett_comment">' + webphone_api.stringres.get('sett_comment_entersettings') + '</span></div></a></li>';
            listview = listview + settenteritem;
        }*/
    }



//-- service plugin (service engine) suggestion !!!DEPRECATED
 //--   if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WEBPHONE() && currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN)
//--            && webphone_api.global.enableservice && webphone_api.global.useengine > -1 && webphone_api.global.useengine !== webphone_api.global.ENGINE_SERVICE
//--            && webphone_api.global.useengine !== webphone_api.global.ENGINE_JAVA && !webphone_api.common.IsServiceInstalled())
//--    {
//--        var engineservice = '<li data-icon="carat-r" id="settingitem_engineservice"><a class="noshadow"><div class="sett_text"><span class="sett_display_name">' + webphone_api.stringres.get('serviceengine_title') + '</span><br><span id="sett_comment_engineservice" class="sett_comment">' + webphone_api.stringres.get('serviceengine_msg') + '</span></div></a></li>';
//--        listview = listview + engineservice;
//--    }

//--// choose  engine for testing !!!DEPRECATED
//--    if (webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN))
//--    {
//--        var engine = '<li data-icon="[SETTICON]" id="[ITEMID]"><a class="noshadow"><div class="sett_text"><span class="sett_display_name">[DISPLAYNAME]</span><br><span id="[COMMENTID]" class="sett_comment">[COMMENT]</span></div>[TRUEFALSEIMG]</a></li>';
//--        if (webphone_api.global.enablewebrtc)
//--        {
//--            engine = engine.replace('[TRUEFALSEIMG]', '<div class="sett_image"><img src="' + webphone_api.common.GetElementSource() + 'images/checkbox_true.png" id="img_' + settName + '" /></div>');
//--        }else
//--        {
//--            engine = engine.replace('[TRUEFALSEIMG]', '<div class="sett_image"><img src="' + webphone_api.common.GetElementSource() + 'images/checkbox_false.png" id="img_' + settName + '" /></div>');
//--        }
//--        engine = engine.replace('[SETTICON]', 'false');
//--        engine = engine.replace('[ITEMID]', 'chooseengine');
//--        engine = engine.replace('[DISPLAYNAME]', 'Use WebRTC');
//--        engine = engine.replace('[COMMENT]', 'If checked uses WebRTC esle uses Java');
//--        listview = listview + engine;
//--    }


//-- show chooseengine setting on login page only if previous engine could not register; 0=unknown, 1=failed, 2=if we received any notification

//-- ha azert all meg a loginnal mert elotte valami gond volt:
//--    -kerüljön bele a voip engine a basic settings -be elso beallitasnak
//--    -ha megvan adva a configban a serveraddress-username-passsword, akkor menjen be a basic settingsbe (ne a login oldalon alljon meg ahol csak egy settings item van)            
if (webphone_api.common.IsWindowsSoftphone() === false && (webphone_api.global.isdebugversion_showengineselection === true || webphone_api.common.GetParameterInt('enproblem', 0) > 0
        || (webphone_api.common.GetParameterBool('last_login_failed', false) === true && currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_MAIN))))
{
    html_engineoption = '<li data-icon="carat-d" id="settingitem_chooseengine"><a class="noshadow mlistitem"><div class="sett_text"><span class="sett_display_name">' + webphone_api.stringres.get('sett_chooseengine_title') + '</span><br><span id="sett_comment_engineservice" class="sett_comment">' + webphone_api.stringres.get('sett_chooseengine_comment') + ' (' + webphone_api.common.GetEngineDisplayName(webphone_api.common.GetSelectedEngineName()) + ')' + '</span></div></a></li>';
    listview = html_engineoption + listview;
    hasonlysettings = 0;

    var enproblem = webphone_api.common.GetParameterInt('enproblem', 0);
    if(enproblem > 0)
    {
        if(enproblem > 4) enproblem = 4;
        enproblem--;
        webphone_api.common.SaveParameter('enproblem', enproblem);
    }

}else
{
    if((currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN) && webphone_api.common.GetParameter('lastsessionsuccess') === '1')
            || (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_SIP) && isSettLevelBasic === false))
    {
        if (webphone_api.common.isNull(html_engineoption)) { html_engineoption = ''; }
        listview = html_engineoption + listview;
        hasonlysettings = 0;
    }
}
//--    var footer = '<li id="settings_footer"><button id="btn_cancel" class="ui-btn ui-btn-corner-all ui-btn-b noshadow">' + webphone_api.stringres.get('btn_cancel') + '</button><button id="btn_login" class="ui-btn ui-btn-corner-all ui-btn-b noshadow">' + webphone_api.stringres.get("btn_login") + '</button></li>';
    
    var btnlogintitle = '';
    if (startedfrom === 'app' && ismodified === true)
    {
        btnlogintitle = webphone_api.stringres.get('btn_save');
    }else
    {
        btnlogintitle = webphone_api.stringres.get('btn_login');
    }
    var footer = '<li id="settings_footer"><button id="btn_login" title="' + webphone_api.stringres.get("hint_settlogin") + '" class="ui-btn ui-btn-corner-all ui-btn-b noshadow">' + btnlogintitle + '</button></li>';

    var usrtmp = webphone_api.common.GetSipusername(); if (webphone_api.common.isNull(usrtmp)) { usrtmp = ''; }
    var pwdtmp = webphone_api.common.GetParameter('password'); if (webphone_api.common.isNull(pwdtmp)) { pwdtmp = ''; }

    var qrlayout = '';
    if (webphone_api.common.IsWindowsSoftphone() === true)
    {
        var qrcode_login = webphone_api.common.GetParameterInt('qrcode_login', 0);
        if (qrcode_login == 1)
        {
            if (usrtmp.length < 1 || pwdtmp.lenght < 1)
            {
                qrlayout = '<li id="qrcode_layout"><button id="btn_qrcode_login" class="ui-btn ui-btn-corner-all ui-btn-b noshadow">' + webphone_api.stringres.get('btn_qrcode') + '</button></li>';
            }
        }
        else if (qrcode_login == 2)
        {
            qrlayout = '<li id="qrcode_layout"><button id="btn_qrcode_login" class="ui-btn ui-btn-corner-all ui-btn-b noshadow">' +  webphone_api.stringres.get('btn_qrcode') + '</button></li>';
        }
    }

    if (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN)
            || (usrtmp.length > 0 && pwdtmp.length > 0))
    {
        listview = listview + qrlayout + footer;
    }
    
    var newuseruri = webphone_api.common.GetParameter('newuser');
    if (webphone_api.common.isNull(newuseruri) || newuseruri.length < 1)  newuseruri = webphone_api.common.GetParameter('newuserurl');
        if (!webphone_api.common.isNull(newuseruri) && newuseruri.length > 2 && startedfrom !== 'app' && currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN))
    {
        listview = listview + '<a href="javascript:;" id="al_newuser" title="' + webphone_api.stringres.get('hint_btnnewuser') + '" class="settings_links" target="_blank">' + webphone_api.stringres.get('newuser') + '</a>';
        hasonlysettings = 0;

//-- OLD button style
//--        var newuser = '<li id="newuser_container"><button id="btn_newuser" class="ui-btn ui-btn-corner-all ui-btn-b noshadow">' + webphone_api.stringres.get('newuser') + '</button></li>';
//--        listview = listview + newuser;
    }

    webphone_api.$('#settings_list').html('');
    webphone_api.$('#settings_list').append(listview).listview('refresh');
    
    webphone_api.$("#al_newuser").on("click", function(event) { OnNewUserClicked(); event.preventDefault(); });

//--    webphone_api.$('#settings_footer').off('click');
    
    var trigerredQ = false; // handle multiple clicks
    webphone_api.$("#btn_qrcode_login").on("click", function()
    {
        if (trigerredQ) { return; }
    
        trigerredQ = true;
        setTimeout(function ()
        {
            trigerredQ = false;
        }, 1000);
        
        webphone_api.common.PutToDebugLog(3, 'EVENT, settings button QRcode login clicked');
        
        QRcodeLogin();
    });

    var trigerred = false;
    webphone_api.$("#btn_login").on("click", function()
    {
        if (trigerred) { return; }
    
        trigerred = true;
        setTimeout(function ()
        {
            trigerred = false;
        }, 1000);
        
        webphone_api.common.PutToDebugLog(3, 'EVENT, settings button login clicked');

//--        alert('IsJavaInstalled: ' + webphone_api.common.IsJavaInstalled());
//--        return;

        SaveSettings(true);
        currGroup = 20;
    });
    webphone_api.$("#btn_cancel").on("click", function()
    {
//--        webphone_api.common.OpenWebURL('https://www.mizu-voip.com');
//--        webphone_api.common.ShowToast('test toast');
//--        webphone_api.$.mobile.changePage("#page_messagelist", { transition: "pop", role: "page" });
//--        webphone_api.common.SaveSettingsFile();
        console.log('Cancel');
        
//--        webphone_api.common.AlertDialog('Test', webphone_api.stringres.get('proversion_content_text'))
//--        webphone_api.common.UpgradeToProVersion();
    });
    webphone_api.common.PutToDebugLog(5, 'EVENT, _settings List populated');

    if(hasonlysettings == 2)
    {
        webphone_api.common.PutToDebugLog(5, 'EVENT, auto switch into settings'); //because only one single "Settings..." is in the list
        ShowSettings();

        //change Back button behaviour:
        currGroup = webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN);
        //webphone_api.$('#settings_page_title').html( webphone_api.stringres.get("settings_login") );
        //webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("btn_cancel") );
        //webphone_api.$("#btn_back_settings").on("click", function(event) { BackOnClick(event); });

        webphone_api.$('#settings_page_title').html( webphone_api.stringres.get("settings_title") );
        webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get('settings_login') );
        return true;
    }
    return false;
//--    listElem.innerHTML = listview;
//--    listElem.listview('refresh');
//--    webphone_api.$(menuId).append('<li><a href="javascript:;" id="' + MENUITEM_SETTINGS_EXIT + '" onclick="MenuItemSelected(\'' + MENUITEM_SETTINGS_EXIT + '\')" >Exit</a></li>').listview('refresh');
}

var ismodified = false; // change button text (Login / Save) based on if any setting was clicked
var ulist = []; // list of engines to be displayed for users
var srvc_installed = false;
function OnListItemClick (id) // :no return value
{
    try{
        if(webphone_api.common.CanLog(3)) { webphone_api.common.PutToDebugLog(3,'EVENT, _settings: OnListItemClick click, id: ' + id); }
        
//-- choose  engine
        if (id === 'chooseengine')
        {
            webphone_api.global.enablewebrtc = !webphone_api.global.enablewebrtc;
            PopulateList();
            return;
        }
        

    if (webphone_api.common.isNull(id) || id.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _settings OnListItemClick id is NULL');
        return;
    }
    
    if (id === 'settingitem_entersettings')
    {
        ShowSettings();
        return;
    }

    if (id === 'settingitem_advancedloginsettings' || id === 'settingitem_advancedloginsettings2')
    {
        ShowLoginSettings();
        return;
    }
    
    if (id === 'settingitem_advancedsettings')
    {
        SwitchBetweenBasicAdvanced();
        return;
    }

    if (id === 'settingitem_moresettings')
    {
        isAdvancedLoginSett = 0;
        ShowSettings();
        return;
    }
    
    //-- handle choose engine
    if (id === 'settingitem_chooseengine')
    {
        var enginelist = webphone_api.common.GetEngineList();
        if (webphone_api.common.isNull(enginelist) || enginelist.length < 2) { return; }
        
    // request now, so when user clicks ok, we already have the result; tricky handling, just check the code below
        webphone_api.common.IsServiceInstalled(function (installed)
        {
            if (installed === true)
            {
                srvc_installed = true;
            }else
            {
                srvc_installed = false;
            }
        }, true);
        
        ulist = []; //-- list of engines to be displayed for users
        var selname = webphone_api.common.GetSelectedEngineName();
        var recname = webphone_api.common.GetRecommendedEngineName();

        var e_sel = '3'; //-- selected engine (for option select dropdown)
        var e_rec = '2'; //-- recomended engine (for option select dropdown)
        var e_avail = '1'; //-- available, but not selected and not recommended engine (for option select dropdown)
        var e_dis = '0'; //-- disabled engine (for option select dropdown)
        
        for(var i = 0; i < enginelist.length; i++)
        {
            var engine = enginelist[i];
//--             "java", "webrtc", "ns", "app", "flash", "p2p", "accessnum", "nativedial", "otherbrowser", "java_avail",
            if (webphone_api.common.isNull(engine) || webphone_api.common.isNull(selname) || selname.length < 1
                    || (engine.name !== 'java' && engine.name !== 'webrtc' && engine.name !== 'ns'
                    && engine.name !== 'app' && engine.name !== 'flash'))
            {
                continue;
            }
            
            var defpriority = engine.defpriority;
            
            var type = '0';
            if (engine.name === selname) { type = '3'; defpriority = defpriority * 10;}
            else if (engine.name === recname) { type = '2'; defpriority = defpriority * 4; }
            else if (webphone_api.common.EngineIsSupported(engine.name) > 0) { type = '1'; }
            
            var typeint = webphone_api.common.StrToInt(type);
            
            var item = [];
            item[0] = engine.name;
            item[1] = type;
            item[2] = (typeint * defpriority).toString();
            
            ulist.push(item);
        }
        
        if (webphone_api.common.isNull(ulist) || ulist.length < 1) { return; }
        
//-- sort values in priority order (desc) in ulist -> firts selected, then recommended, ...
        ulist.sort(function (a,b) //-- comparator function
        {
            if ( a[2] > b[2] ) { return -1; }
            if ( a[2] < b[2] ) { return 1; }
            return 0;
        });
        
        for (var i = 0; i < ulist.length; i++)
        {
            var item = ulist[i];
        }
        
//--showing options dialog
        var radiogroup = '';
        for (var i = 0; i < ulist.length; i++)
        {
            var oneen = ulist[i];
            if (webphone_api.common.isNull(oneen) || oneen.length < 1) { continue; }
            
            var item = '<input name="' + mCurrSettName + '" id="[INPUTID]" value="[VALUE]" [CHECKED] [DISABLED] type="radio">' +
                    '<label for="[INPUTID]" [NOTBOLD]>[LABEL]</label>';

            item = item.replace('[INPUTID]', 'ensel_' + oneen[0]);
            item = item.replace('[INPUTID]', 'ensel_' + oneen[0]); //-- twice
            item = item.replace('[VALUE]', oneen[0]);
            
            if (oneen[1] === '3') // selected engine
            {
                item = item.replace('[CHECKED]', 'checked="checked"');
                item = item.replace('[LABEL]', webphone_api.common.GetEngineDisplayName(oneen[0]) + ' (' + webphone_api.stringres.get('sett_ce_highly') + ')');
                item = item.replace('[NOTBOLD]', '');
            }
            else if (oneen[1] === '2')
            {
                item = item.replace('[LABEL]', webphone_api.common.GetEngineDisplayName(oneen[0]) + ' (' + webphone_api.stringres.get('sett_ce_recommended') + ')');
                item = item.replace('[NOTBOLD]', '');
            }
            else if (oneen[1] === '0')
            {
                item = item.replace('[DISABLED]', 'disabled="disabled"');
                
            }
            
            item = item.replace('[CHECKED]', '');
            item = item.replace('[DISABLED]', '');
            item = item.replace('[NOTBOLD]', 'style="font-weight: normal;"');
            item = item.replace('[LABEL]', webphone_api.common.GetEngineDisplayName(oneen[0]));
        
            radiogroup = radiogroup + item;
        }
        
        var pWidth = webphone_api.common.GetDeviceWidth();
        if ( !webphone_api.common.isNull(pWidth) && webphone_api.common.IsNumber(pWidth) && pWidth > 100 )
        {
            pWidth = Math.floor(pWidth / 1.2);
        }else
        {
            pWidth = 220;
        }
        
        var template = '' +
'<div id="settings_user_ce_select" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + pWidth + 'px; min-width: ' + Math.floor(pWidth * 0.6) + 'px;">' +
    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('sett_chooseengine_popup_title') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content_select">' +
    
//--        '<form id="settings_select_2">' +
        '<fieldset id="settings_select_2" data-role="controlgroup">' + radiogroup +
//--            '<legend>Select transport layer protocol</legend>' +
//--            '<input name="radio-choice-v-2" id="radio-choice-v-2a" value="on" checked="checked" type="radio">' +
//--            '<label for="radio-choice-v-2a">One</label>' +
//--            '<input name="radio-choice-v-2" id="radio-choice-v-2b" value="off" type="radio">' +
//--            '<label for="radio-choice-v-2b">Two</label>' +

        '</fieldset>' +
//--        '</form>' +
    '</div>' +
    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" id="adialog_positive" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_ok') + '</a>' +
        '<a href="javascript:;" id="adialog_negative" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back">' + webphone_api.stringres.get('btn_cancel') + '</a>' +
    '</div>' +
'</div>';

        var popupafterclose = function () {};

        webphone_api.$.mobile.activePage.append(template).trigger("create");
//--        webphone_api.$.mobile.activePage.append(template).trigger("pagecreate");

        webphone_api.$.mobile.activePage.find(".closePopup").bind("tap", function (e)
        {
            webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
        });

        webphone_api.$.mobile.activePage.find(".messagePopup").popup().popup("open").bind(
        {
            popupafterclose: function ()
            {
                webphone_api.$(this).unbind("popupafterclose").remove();
//--                webphone_api.$('#adialog_positive').off('click');
//--                webphone_api.$('#adialog_negative').off('click');
                popupafterclose();
            }
        });

//-- listen for enter onclick, and click OK button
//--     !!NOT WORKING
 //--       webphone_api.$( "#settings_user_ce_select" ).keypress(function( event )
//--        {
//--            if ( event.which === 13)
//--            {
//--                event.preventDefault();
//--                webphone_api.$("#adialog_positive").click();
//--            }else
//--            {
//--                return;
//--            }
//--        });
        
// we must use onclick, otherwise window.open() gets blocked by popup blocker
        webphone_api.$('#adialog_positive').on('click', function (event)
        {
            //var newen = webphone_api.$(this).attr ("value");
            var newen = webphone_api.$("#settings_select_2 :radio:checked").val();
            
            webphone_api.common.ResetEngineClicked();
            
//--    webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
//--            webphone_api.$( '#settings_user_ce_select' ).on( 'popupafterclose', function( event )
//--            {
            if(webphone_api.common.CanLog(3)) { webphone_api.common.PutToDebugLog(3, 'EVENT, _settings: selected engine by user: ' + newen); }

                webphone_api.$("#sett_comment_engineservice").html(webphone_api.stringres.get('sett_chooseengine_comment') + '(' + webphone_api.common.GetEngineDisplayName(newen) + ')');

//--             select the engine
                if (newen === 'java'){ ; }
                else if (newen === 'webrtc')
                {
                    webphone_api.common.PutToDebugLog(2, 'EVENT, _settings: chooseengine reset useengine_1');
                    webphone_api.global.useengine = ''; //-- must be reset, otherwise plhandler.StartEngine() interprets it like the selected engine was not working, and starts recommended engine
                    webphone_api.global.last_useengine = '';
                }
                else if (newen === 'ns')
                {
//--                     for ns engine we have to call this before changing window.location, otherwise it will not be called
                    var currengine = webphone_api.common.GetEngine(newen);
                    if (!webphone_api.common.isNull(currengine))
                    {
                        webphone_api.common.PutToDebugLog(2, 'EVENT, _settings: chooseengine reset useengine_2');
                        webphone_api.global.useengine = ''; // must be reset, otherwise plhandler.StartEngine() interprets it like the selected engine was not working, and starts recommended engine
                        webphone_api.global.last_useengine = '';
                        currengine.clicked = 2;
                        webphone_api.common.SetEngine(newen, currengine);

//--                        webphone_api.common.ShowToast(webphone_api.common.GetEngineDisplayName(newen) + ' ' + webphone_api.stringres.get('ce_use'), 3000, function ()
//--                        {
//--                            webphone_api.common.ChooseEngineLogic2(newen);
//--                        });*/
                        
                        webphone_api.common.IsServiceInstalled(function (installed)
                        {
                            if (installed === true)
                            {
                                srvc_installed = true;
                                webphone_api.common.ShowToast(webphone_api.common.GetEngineDisplayName(newen) + ' ' + webphone_api.stringres.get('ce_use'), 3000, function ()
                                {
//--                                    webphone_api.common.ChooseEngineLogic2(newen);
                                });
                            }
                        }, true);

                        webphone_api.common.EngineSelect(1,4);
                    }

                    if (srvc_installed === false) //-- this should not be in IsServiceInstalled:callback, because window.open will only work on user interaction (click)
                    {
//--                         wait for this popup to close
                        setTimeout(function ()
                        {
                            webphone_api.common.NPDownloadAndInstall();
                        }, 350);
                        
                        var downloadurl = webphone_api.common.GetNPLocation();
                        if (!webphone_api.common.isNull(downloadurl) && downloadurl.length > 0)
                        {
                            window.open(downloadurl);
                            //--window.location.assign(downloadurl);
                            //--window.location.href = downloadurl;
                        }
                    }
                }
                else if (newen === 'flash')
                {
                    webphone_api.common.PutToDebugLog(2, 'EVENT, _settings: chooseengine reset useengine_3');
                    webphone_api.global.useengine = ''; //-- must be reset, otherwise plhandler.StartEngine() interprets it like the selected engine was not working, and starts recommended engine
                    webphone_api.global.last_useengine = '';
                }
                else if (newen === 'app')
                {
                    webphone_api.common.SaveParameter('allow_start_app_engine', '1');
                }

                if (newen !== 'ns')
                {
                    var currengine = webphone_api.common.GetEngine(newen);
                    if (!webphone_api.common.isNull(currengine))
                    {
                        webphone_api.common.PutToDebugLog(2, 'EVENT, _settings: chooseengine reset useengine_4');
                        webphone_api.global.useengine = ''; // must be reset, otherwise plhandler.StartEngine() interprets it like the selected engine was not working, and starts recommended engine
                        webphone_api.global.last_useengine = '';
                        currengine.clicked = 2;
                        webphone_api.common.SetEngine(newen, currengine);

                        webphone_api.common.ShowToast(webphone_api.common.GetEngineDisplayName(newen) + ' ' + webphone_api.stringres.get('ce_use'), 3000, function ()
                        {
                            webphone_api.common.ChooseEngineLogic2(newen);
                        });
                        
                        webphone_api.common.EngineSelect(1,5);
                    }
                }

//--                webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
//--            });
        });
        return;
    }
    
//-- !!!DEPRECATED    
//--    if (id === 'settingitem_engineservice')
//--    {
//--        //webphone_api.common.OpenWebURL(webphone_api.global.nativeplugin_path, webphone_api.stringres.get('np_download'));
//--        webphone_api.common.OpenWebURL(webphone_api.common.GetNPLocation(), webphone_api.stringres.get('np_download'));
//--        setTimeout(function ()
//--        {
//--            webphone_api.common.NPDownloadAndInstall();
//--        }, 150);
//--        return;
//--    }
    
    ismodified = true;
    
    if (id === 'settings_footer' || id === 'newuser_container') { return; } // don't handle Save/Cancel buttons
    webphone_api.global.wasSettModified = true;
    
    var mCurrSettName = id.replace('settingitem_', '');
    
    var value = webphone_api.global.settmap2[mCurrSettName];

    if( webphone_api.common.isNull(value) || value.length < 1 )
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _settings OnListItemClick settings NULL: ' + mCurrSettName);
        return;
    }

    var mSettValue = value[webphone_api.common.SETT_VALUE];
    var mSettType = value[webphone_api.common.SETT_TYPE];

    var mSettAllNames = value[webphone_api.common.SETT_ALLNAMES];
    var mSettAllValues = value[webphone_api.common.SETT_ALLVALUES];
    var mSettGrouping =  value[webphone_api.common.SETT_GROUP];
    var settDisplayName = webphone_api.stringres.get('sett_display_name_'+mCurrSettName);
    var settComment = webphone_api.stringres.get('sett_comment_'+mCurrSettName);
    
//BRANDSTART
    if (webphone_api.common.GetConfigInt('brandid', -1) === 50) // favafone
    {
        if (mCurrSettName === 'sipusername') { settComment = 'Your Favafone Username'; }
        if (mCurrSettName === 'password') { settComment = 'Your Favafone Password'; }
    }
//BRANDEND
    
    if (mSettType === null || mSettType.length <= 0 || (mSettType !== '0' && mSettType !== '1' && mSettType !== '2' && mSettType !== '3'
        && mSettType !== '4' && mSettType !== '5' && mSettType !== '6' && mSettType !== '7' && mSettType !== '8'))
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _settings OnListItemClick invalid type');
        return;
    }
    
    var popupWidth = webphone_api.common.GetDeviceWidth();
    if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
    {
        popupWidth = Math.floor(popupWidth / 1.2);
    }else
    {
        popupWidth = 220;
    }

        if(popupWidth > 400) popupWidth = 400;
        else if(popupWidth < 120) popupWidth = 120;
    
//type 0 = checkbox
    if (mSettType === '0')
    {
        if (mCurrSettName === 'loglevel')
        {
            if (mSettValue === '1')
            {
                mSettValue = webphone_api.global.predefLoglevel;
                var maxl = webphone_api.common.GetMaxLogLevel();
                if (mSettValue > maxl)
                {
                    mSettValue = maxl;
                }
                    
                webphone_api.common.SaveParameter('jsscriptevent', '3');
                webphone_api.setparameter('jsscriptevent', '3');
                webphone_api.common.SaveParameter('loglastusage', webphone_api.common.GetTickCount());
            }else
            {
                mSettValue = '1';
                
                webphone_api.common.SaveParameter('jsscriptevent', '2');
                webphone_api.setparameter('jsscriptevent', '2');
            }
            
            if (isSettLevelBasic === false) //-- repopulatelist to display/hide 'Set log/trace level' option
            {
                PopulateList();
            }
        }
//--         handle 2 as TRUE and 1 as FALSE
        else if (mCurrSettName === 'flash' || mCurrSettName === 'sscontrol' || mCurrSettName === 'ssscroll' || mCurrSettName === 'sstop')
        {
            if (mSettValue === '2') { mSettValue = '1'; }else{ mSettValue = '2'; }
        }
        else if (mCurrSettName === 'beeponincoming')
        {
            if (mSettValue === '1') { mSettValue = 'true'; }else{ mSettValue = 'false'; }
        }
        else
        {
            if (mSettValue === 'true')
            {
                mSettValue = 'false';
            }else
            {
                mSettValue = 'true';
            }
        }
        
//-- hide the startwithos option once it is already set
        if (mCurrSettName === 'startwithos')
        {
            webphone_api.common.SaveParameter('startwithos_was_sent', 'false');
        }

        var imgsrc = '';
        imgsrc = webphone_api.$('#img_' + mCurrSettName).attr('src');

        if (webphone_api.common.isNull(imgsrc) || imgsrc.lenght < 1)
        {
            webphone_api.common.PutToDebugLog(2, 'ERROR, _settings imgsrc NULL');
            return;
        }
        
        if (imgsrc.indexOf('true') >= 0)
        {
            imgsrc = imgsrc.replace('true', 'false');
        }else
        {
            imgsrc = imgsrc.replace('false', 'true');
        }

        webphone_api.$('#img_' + mCurrSettName).attr('src', imgsrc);
        
        value[webphone_api.common.SETT_VALUE] = mSettValue;
        value[webphone_api.common.SETT_ISDEFAULT] = '0';
        webphone_api.global.settmap[mCurrSettName] = value;
        webphone_api.global.settmap2[mCurrSettName] = value;
        
//-- repopulatelist to display/hide 'Set log/trace level' option
        if (mCurrSettName === 'loglevel')
        {
            if (isSettLevelBasic === false)
            {
                PopulateList();
            }
        }
        
        ShowSettValue(mCurrSettName);
    }

//type 1 = text box
    if (mSettType === '1')
    {
        if (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_PROFILE))
        {
            if (mCurrSettName === 'displayname')
            {
                settComment = webphone_api.stringres.get('displayname_login');
            }
        }

        if (mCurrSettName === 'profilepicture')
        {
            HandleProfilePicture();
            return;
        }

        var template = '' +
'<div id="settings_type_1" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + settDisplayName + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content">' +
        '<span>' + settComment + '</span>' +
        '<input type="text" id="setting_item_input" name="setting_item" data-theme="a" autocapitalize="off"/>' +
    '</div>' +
    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" id="adialog_positive" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_ok') + '</a>' +
        '<a href="javascript:;" id="adialog_negative" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back">' + webphone_api.stringres.get('btn_cancel') + '</a>' +
    '</div>' +
'</div>';

        var popupafterclose = function () {};

        webphone_api.$.mobile.activePage.append(template).trigger("create");
        //--webphone_api.$.mobile.activePage.append(template).trigger("pagecreate");

//-- listen for enter onclick, and click OK button
//--        var xTriggered = 0;
//--        webphone_api.$( "#settings_type_1" ).keypress(function( event )
//--        {
//--            //xTriggered++ ;
//--            if ( event.which === 13)
//--            {
//--                event.preventDefault();
//--                webphone_api.$("#adialog_positive").click();
//--            }else
//--            {
//--                return;
//--            }
//--        });

        webphone_api.$.mobile.activePage.find(".closePopup").bind("tap", function (e)
        {
            webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
        });

        webphone_api.$.mobile.activePage.find(".messagePopup").popup().popup("open").bind(
        {
            popupafterclose: function ()
            {
                webphone_api.$(this).unbind("popupafterclose").remove();
                webphone_api.$('#adialog_positive').off('click');
                webphone_api.$('#adialog_negative').off('click');
                popupafterclose();
            }
        });
        
        var initial_val = mSettValue;

        var textBox = document.getElementById('setting_item_input');

        if (!webphone_api.common.isNull(mSettValue) && mSettValue.length > 0 && !webphone_api.common.isNull(textBox))
        {
            if (mCurrSettName === 'password')
            {
                textBox.value = '*****';
            }

// treat the followings as seconds instead of milliseconds if the value is between 2 and 999: ringtimeout,calltimeout,icetimeout,keepaliveival,wskeepaliveival,closecall_timeout
            else if (mCurrSettName === 'ringtimeout' || mCurrSettName === 'calltimeout' || mCurrSettName === 'icetimeout' || mCurrSettName === 'keepaliveival' || mCurrSettName === 'wskeepaliveival' /*|| mCurrSettName === 'closecall_timeout'*/)
            {
                var intval = webphone_api.common.StrToInt(mSettValue, -10000);
                if (intval >= 2 && intval <= 999)
                {
                    textBox.value = mSettValue;;
                }else
                {
                    intval = Math.floor(intval);
                    mSettValue = intval.toString();
                    textBox.value = mSettValue;
                }
            }
// handle username / sipusername
            else if (mCurrSettName === 'sipusername')
            {
                if ((webphone_api.common.isNull(mSettValue) || mSettValue.length < 1)/* && webphone_api.common.GetParameter('username').length > 0*/)
                {
                    textBox.value = webphone_api.common.GetSipusername();
                }else
                {
                    textBox.value = mSettValue;
                }
            }
            else if (mCurrSettName === 'loglevel_dbg')
            {
                mSettValue = webphone_api.common.GetParameter('loglevel');
                textBox.value = mSettValue;
            }
            else
            {
                textBox.value = mSettValue;
            }
        }

        setTimeout(function ()
        {
            if (!webphone_api.common.isNull(textBox)) { textBox.focus(); } // setting cursor to text input
        }, 150);
        

        webphone_api.$('#adialog_positive').on('click', function (event)
        {
            if (webphone_api.common.GetBrowser() === 'MSIE') { event.preventDefault(); }

            webphone_api.common.PutToDebugLog(5,"EVENT, settings onListItemClick 1 ok (" + mCurrSettName + ")");
            
            ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));

            var textBoxVal = '';
            if (!webphone_api.common.isNull(textBox)) { textBoxVal = textBox.value; }

            if (!webphone_api.common.isNull(textBoxVal)/* && textBoxVal.length > 0*/)
            {
                textBoxVal = webphone_api.common.Trim(textBoxVal);

                // treat the followings as seconds instead of milliseconds if the value is between 2 and 999: ringtimeout,calltimeout,icetimeout,keepaliveival,wskeepaliveival,closecall_timeout
                if (mCurrSettName === 'ringtimeout' || mCurrSettName === 'calltimeout' || mCurrSettName === 'icetimeout' || mCurrSettName === 'keepaliveival' || mCurrSettName === 'wskeepaliveival' /*|| mCurrSettName === 'closecall_timeout'*/)
                {
                    var intval = webphone_api.common.StrToInt(textBoxVal, -10000);
                    if (intval >= 2 && intval <= 999)
                    {
                        intval = intval * 1000;
                    }

                    textBoxVal = intval.toString();
                }
                mSettValue = webphone_api.common.Trim(textBoxVal);

                if (mCurrSettName === 'sipusername')
                {
                    mSettValue = webphone_api.common.NormalizeInput(mSettValue, 0);
                    /*var callerid = webphone_api.common.GetParameter('username');
                    if (webphone_api.common.isNull(callerid) || callerid.length < 1 ||
                            (!webphone_api.common.isNull(initial_val) && initial_val.length > 0 && initial_val !== mSettValue))
                    {
                        webphone_api.common.SaveParameter("username", mSettValue);
                    }*/
                }

                if (mCurrSettName === 'loglevel')
                {
                    if (webphone_api.common.isNull(mSettValue) || mSettValue.length < 1) { mSettValue = '1'; }
                    var valint = 1;
                    
                    try { valint = webphone_api.common.StrToInt(mSettValue); } catch(errinner) {  }
                    
                    webphone_api.global.loglevel = valint;
                }
                else if (mCurrSettName === 'loglevel_dbg')
                {
                    if (!webphone_api.common.isNull(mSettValue) && mSettValue.length > 0)
                    {
                        webphone_api.common.SaveParameter('loglevel', mSettValue);
                    }
                }

                if (mCurrSettName === 'password' && textBoxVal.indexOf('**') >= 0)
                {
                    return;
                }

                value[webphone_api.common.SETT_VALUE] = mSettValue;
                value[webphone_api.common.SETT_ISDEFAULT] = '0';
                webphone_api.global.settmap[mCurrSettName] = value;
                webphone_api.global.settmap2[mCurrSettName] = value;

                ShowSettValue(mCurrSettName);
            }
        });

        webphone_api.$('#adialog_negative').on('click', function (event)
        {
            if (webphone_api.common.GetBrowser() === 'MSIE') { event.preventDefault(); }
            ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));
        });
    }
    
//type 2 = drop down list
    if (mSettType === '2')
    {
        var allNames2 = mSettAllNames;
        var allValues2 = mSettAllValues;
        var allCount2 = 0;
           
        //getting values and names for combobox options
        var allNamesTmp2 = allNames2;
        while (allNamesTmp2.indexOf(',') > 0)	//get number of options
        {
            allNamesTmp2 = allNamesTmp2.substring(allNamesTmp2.indexOf(',')+1, allNamesTmp2.length);
            allCount2++;
        }
        allCount2++;
        var arrayNames2;
        var arrayValues2;

//-- used only for "transport" setting
//--        if (isSettLevelBasic && mCurrSettName === 'transport' && !webphone_api.common.isNull(mSettValue)
//--                && mSettValue.length > 0 && (mSettValue === '0' || mSettValue === '1'))
//--        {
//--            arrayNames2 = ['UDP', 'TCP'];
//--            arrayValues2 = ['0', '1'];
//--        }else
//--        {
            arrayNames2 = [];
            arrayValues2 = [];

            var countIdx2 = 0;
            allNamesTmp2 = allNames2;
            while (countIdx2 < allCount2)		//get options names in array
            {
                if (allNamesTmp2.indexOf(',') > 0)
                {
                    arrayNames2[countIdx2] = allNamesTmp2.substring(0, allNamesTmp2.indexOf(','));
                    allNamesTmp2 = allNamesTmp2.substring(allNamesTmp2.indexOf(',')+1, allNamesTmp2.length);
                }else
                {
                    arrayNames2[countIdx2] = allNamesTmp2.substring(0, allNamesTmp2.length);
                }
                countIdx2++;
            }

            countIdx2 = 0;
            var allValuesTmp2 = allValues2;
            while (countIdx2 < allCount2)		//get options values in array
            {
                if (allValuesTmp2.indexOf(',') > 0)
                {
                    arrayValues2[countIdx2] = allValuesTmp2.substring(0, allValuesTmp2.indexOf(','));
                    allValuesTmp2 = allValuesTmp2.substring(allValuesTmp2.indexOf(',')+1, allValuesTmp2.length);
                }else
                {
                    arrayValues2[countIdx2] = allValuesTmp2.substring(0, allValuesTmp2.length);
                }
                countIdx2++;
            }
//--        }

//showing options dialog
        var radiogroup = '';
        for (var i = 0; i < arrayNames2.length; i++)
        {
            var item = '<input name="' + mCurrSettName + '" id="[INPUTID]" value="[VALUE]" [CHECKED] type="radio">' +
                    '<label for="[INPUTID]">[LABEL]</label>';

            item = item.replace('[INPUTID]', mCurrSettName + '_' + i);
            item = item.replace('[INPUTID]', mCurrSettName + '_' + i); // twice
            item = item.replace('[VALUE]', arrayValues2[i]);
            item = item.replace('[LABEL]', arrayNames2[i]);
            
            if (arrayValues2[i] === mSettValue)
            {
                item = item.replace('[CHECKED]', 'checked="checked"');
            }else
            {            
                item = item.replace('[CHECKED]', '');
            }
            
            radiogroup = radiogroup + item;
        }
        
        var popupHeight = webphone_api.common.GetDeviceHeight();
        if ( !webphone_api.common.isNull(popupHeight) && webphone_api.common.IsNumber(popupHeight) && popupHeight > 100 )
        {
            popupHeight = Math.floor(popupHeight / 1.2);
        }else
        {
            popupHeight = 300;
        }
        
        var template = '' +
'<div id="settings_type_2" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + settDisplayName + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content_select" style="max-height: ' + popupHeight + 'px;">' +
    
//'<form id="settings_select_2">' +
'<fieldset id="settings_select_2" data-role="controlgroup">' + radiogroup +
//    '<legend>Select transport layer protocol</legend>' +
//    '<input name="radio-choice-v-2" id="radio-choice-v-2a" value="on" checked="checked" type="radio">' +
//    '<label for="radio-choice-v-2a">One</label>' +
//    '<input name="radio-choice-v-2" id="radio-choice-v-2b" value="off" type="radio">' +
//    '<label for="radio-choice-v-2b">Two</label>' +

'</fieldset>' +
//'</form>' +
        
    '</div>' +
'</div>';

        var popupafterclose = function () {};

        webphone_api.$.mobile.activePage.append(template).trigger("create");
//--        webphone_api.$.mobile.activePage.append(template).trigger("pagecreate");

        webphone_api.$.mobile.activePage.find(".closePopup").bind("tap", function (e)
        {
            webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
        });

        webphone_api.$.mobile.activePage.find(".messagePopup").popup().popup("open").bind(
        {
            popupafterclose: function ()
            {
                webphone_api.$(this).unbind("popupafterclose").remove();
//--                webphone_api.$('#adialog_positive').off('click');
//--                webphone_api.$('#adialog_negative').off('click');
                popupafterclose();
            }
        });

//-- listen for enter onclick, and click OK button
//--     !!NOT WORKING
 //--       webphone_api.$( "#settings_type_2" ).keypress(function( event )
//--        {
//--            if ( event.which === 13)
//--            {
//--                event.preventDefault();
//--                webphone_api.$("#adialog_positive").click();
//--            }else
//--            {
//--                return;
//--            }
//--        });
        
        webphone_api.$(":radio").on ("change", function (event)
        {
//--            alert (webphone_api.$(this).attr ("id"));
//--            alert (webphone_api.$(this).attr ("value"));
            ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));
            
            webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");

            mSettValue = webphone_api.$(this).attr ("value");
            
            if (webphone_api.common.IsWindowsSoftphone() && webphone_api.common.GetConfig('needactivation') == 'true' && webphone_api.common.GetParameter('canshowlickeyinput') !== 'true'
                    && ( (mCurrSettName === 'transport' && mSettValue === '2') || (mCurrSettName === 'mediaencryption' && mSettValue === '2') ))
            {
                webphone_api.common.ShowToast(webphone_api.stringres.get('warning_feature'), 6000);
                return;
            }
            
            value[webphone_api.common.SETT_VALUE] = mSettValue;
            value[webphone_api.common.SETT_ISDEFAULT] = '0';
            webphone_api.global.settmap[mCurrSettName] = value;
            webphone_api.global.settmap2[mCurrSettName] = value;
            
            ShowSettValue(mCurrSettName);
            
            if (mCurrSettName === 'theme')
            {
                webphone_api.common.SetCurrTheme();
                
                if (webphone_api.common.IsWindowsSoftphone())
                {
                    var url = webphone_api.common.AddJscommport(webphone_api.global.WIN_SOFTPHONE_URL) + '?extcmd_theme=' + mSettValue;
                    webphone_api.common.WinSoftphoneHttpReq(url, 'GET', '', '', function (resp) { webphone_api.common.PutToDebugLog(2, 'EVENT, send theme to softphone response: ' + resp); });
                }
            }
            else if (mCurrSettName === 'language')
            {
                webphone_api.common.SetLanguage();
            }
        });
    }

//type 3 = drop down list and checkbox - only for codec !!!
    if (mSettType === '3')
    {
        if (mCurrSettName === 'videocodec')
        {
            var radiogroup = ''+
                '<input name="' + mCurrSettName + '" id="videocodec_optimal" [CHECKED_OPTIMAL] type="checkbox">' +
                    '<label for="videocodec_optimal">' + webphone_api.stringres.get('videocodec_optimal') + '</label>' +

                '<input name="' + mCurrSettName + '" id="videocodec_h264" [CHECKED_H264] type="checkbox">' +
                    '<label for="videocodec_h264">H264</label>' +

                '<input name="' + mCurrSettName + '" id="videocodec_vp8" [CHECKED_VP8] type="checkbox">' +
                    '<label for="videocodec_vp8">VP8</label>' +

                '<input name="' + mCurrSettName + '" id="videocodec_vp9" [CHECKED_VP9] type="checkbox">' +
                    '<label for="videocodec_vp9">VP9</label>';
            
            if (mSettValue === '-1') // means optimal
            {
                radiogroup = radiogroup.replace('[CHECKED_OPTIMAL]', 'checked="checked"');
                radiogroup = radiogroup.replace('[CHECKED_H264]', '');
                radiogroup = radiogroup.replace('[CHECKED_VP8]', '');
                radiogroup = radiogroup.replace('[CHECKED_VP9]', '');
            }else
            {
                radiogroup = radiogroup.replace('[CHECKED_OPTIMAL]', '');
                
                var ch_h264 = 'checked="checked"'; if (webphone_api.common.GetParameterBool('use_h264', true) === false) { ch_h264 = ''; }
                radiogroup = radiogroup.replace('[CHECKED_H264]', ch_h264);
                
                var ch_vp8 = 'checked="checked"'; if (webphone_api.common.GetParameterBool('use_vp8', true) === false) { ch_vp8 = ''; }
                radiogroup = radiogroup.replace('[CHECKED_VP8]', ch_vp8);
                
                var ch_vp9 = 'checked="checked"'; if (webphone_api.common.GetParameterBool('use_vp9', true) === false) { ch_vp9 = ''; }
                radiogroup = radiogroup.replace('[CHECKED_VP9]', ch_vp9);
            }
            
            var template = '' +
    '<div id="settings_type_3" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" data-dismissible="false" style="max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

        '<div data-role="header" data-theme="b">' +
//--            '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
            '<h1 class="adialog_title">' + settDisplayName + '</h1>' +
        '</div>' +
        '<div role="main" class="ui-content adialog_content_select">' +

//    '<form id="settings_select_2">' +
    '<fieldset id="settings_select_3" data-role="controlgroup">' + radiogroup +

    //    '<legend>Select transport layer protocol</legend>' +
    //    '<input name="radio-choice-v-2" id="radio-choice-v-2a" value="on" checked="checked" type="checkbox">' +
    //    '<label for="radio-choice-v-2a">One</label>' +
    //    '<input name="radio-choice-v-2" id="radio-choice-v-2b" value="off" type="checkbox">' +
    //    '<label for="radio-choice-v-2b">Two</label>' +

    '</fieldset>' +
    //'</form>' +

        '</div>' +
        '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" style="width: 98%;" id="adialog_positive" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_ok') + '</a>' +
        '</div>' +
    '</div>';

            var popupafterclose = function () {};

            webphone_api.$.mobile.activePage.append(template).trigger("create");
//--            webphone_api.$.mobile.activePage.append(template).trigger("pagecreate");

            webphone_api.$.mobile.activePage.find(".closePopup").bind("tap", function (e)
            {
                webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
            });

            webphone_api.$.mobile.activePage.find(".messagePopup").bind(
            {
                popupbeforeposition: function()
                {
                    webphone_api.$(this).unbind("popupbeforeposition");//.remove();
                    var maxHeight =  Math.floor( webphone_api.common.GetDeviceHeight() * 0.7 );  // webphone_api.$(window).height() - 120;

                    if (webphone_api.$(this).height() > maxHeight)
                    {
                        webphone_api.$('.messagePopup .ui-content').height(maxHeight);
                    }
                }
            });

            webphone_api.$.mobile.activePage.find(".messagePopup").popup().popup("open").bind(
            {
                popupafterclose: function ()
                {
                    webphone_api.$(this).unbind("popupafterclose").remove();
                    webphone_api.$('#adialog_positive').off('click');
//--                    webphone_api.$('#adialog_negative').off('click');
                    popupafterclose();
                }
            });

//--     listen for enter onclick, and click OK button
//--     !!NOT WORKING
//--            webphone_api.$( "#settings_type_3" ).keypress(function( event )
//--            {
//--                if ( event.which === 13)
//--                {
//--                    event.preventDefault();
//--                    webphone_api.$("#adialog_positive").click();
//--                }else
//--                {
//--                    return;
//--                }
//--            });


            webphone_api.$(":checkbox").on ("change", function (event)
            {
                var chid = webphone_api.$(this).attr ("id");
                if (chid === 'videocodec_optimal')
                {
                    webphone_api.$('#videocodec_h264').prop("checked", false).checkboxradio("refresh");
                    webphone_api.$('#videocodec_vp8').prop("checked", false).checkboxradio("refresh");
                    webphone_api.$('#videocodec_vp9').prop("checked", false).checkboxradio("refresh");
                }else
                {
                    webphone_api.$('#videocodec_optimal').prop("checked", false).checkboxradio("refresh");
                }
            });

            webphone_api.$('#adialog_positive').on('click', function (event)
            {
                if (webphone_api.common.GetBrowser() === 'MSIE') { event.preventDefault(); }

                webphone_api.common.PutToDebugLog(5,"EVENT, settings onListItemClick videocodec ok");

                ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));

                mSettValue = '';

                if ( webphone_api.$('#videocodec_optimal').prop("checked") )
                {
                    mSettValue = '-1';

                    webphone_api.common.SaveParameter('use_h264', 'true');
                    webphone_api.common.SaveParameter('use_vp8', 'true');
                    webphone_api.common.SaveParameter('use_vp9', 'true');
                }else
                {
                    mSettValue = '1'; // vagy akarmilyen mas ertek, mint -1
                    
                    var  cdh264 = 'false'; if ( webphone_api.$('#videocodec_h264').prop("checked") ) { cdh264 = 'true'; }
                    webphone_api.common.SaveParameter('use_h264', cdh264);
                    
                    var  cdvp8 = 'false'; if ( webphone_api.$('#videocodec_vp8').prop("checked") ) { cdvp8 = 'true'; }
                    webphone_api.common.SaveParameter('use_vp8', cdvp8);
                    
                    var  cdvp9 = 'false'; if ( webphone_api.$('#videocodec_vp9').prop("checked") ) { cdvp9 = 'true'; }
                    webphone_api.common.SaveParameter('use_vp9', cdvp9);
                }
                
                value[webphone_api.common.SETT_VALUE] = mSettValue;
                value[webphone_api.common.SETT_ISDEFAULT] = '0';
                webphone_api.global.settmap[mCurrSettName] = value;
                webphone_api.global.settmap2[mCurrSettName] = value;

                ShowSettValue(mCurrSettName);
            });
        }
        else if (mCurrSettName === 'codec')
        {
            var allNames3 = mSettAllNames;
            var allValues3 = mSettAllValues;

            var arrayNames3 = allNames3.split(",");	//--Optimal,1,PCMU,1,PCMA,1,GSM,1,iLBC,0,SPEEX,0,SPEEX-WB,0,0,G.729,0
            var arrayValues3 = allValues3.split(",");

            var arraySelectedValues3 = mSettValue.split(",");

            for (var k = 0; k < arraySelectedValues3.length; k++)
            {
                if (arraySelectedValues3[k] === '-1')
                {
                    arraySelectedValues3 = ['-1'];
                    break;
                }
            }

            var radiogroup = '';

            for (var i = 0; i < arrayNames3.length; i++)
            {

                var item = '<input name="' + mCurrSettName + '" id="[INPUTID]" value="[VALUE]" [CHECKED] type="checkbox">' +
                        '<label for="[INPUTID]">[LABEL]</label>';

                item = item.replace('[INPUTID]', mCurrSettName + '_' + i);
                item = item.replace('[INPUTID]', mCurrSettName + '_' + i); //-- twice
                item = item.replace('[VALUE]', arrayValues3[i]);
                item = item.replace('[LABEL]', arrayNames3[i]);

                if (arrayNames3[i] === 'Optimal')
                {
                    for (var j = 0; j < arraySelectedValues3.length; j++)
                    {
                        if (arraySelectedValues3[j] === '-1') { item = item.replace('[CHECKED]', 'checked="checked"'); break; }
                    }
                    item = item.replace('[CHECKED]', '');
                    radiogroup = radiogroup + item;
                }

                if (arrayNames3[i] === 'PCMU')
                {
                    for (var j = 0; j < arraySelectedValues3.length; j++)
                    {
                        if (arraySelectedValues3[j] === '1') {  item = item.replace('[CHECKED]', 'checked="checked"'); break;  }
                    }
                    item = item.replace('[CHECKED]', '');
                    radiogroup = radiogroup + item;
                }
                if (arrayNames3[i] === 'PCMA')
                {
                    for (var j = 0; j < arraySelectedValues3.length; j++)
                    {
                        if (arraySelectedValues3[j] === '2') { item = item.replace('[CHECKED]', 'checked="checked"'); break; }
                    }
                    item = item.replace('[CHECKED]', '');
                    radiogroup = radiogroup + item;
                }
                if (arrayNames3[i] === 'GSM')
                {
                    for (var j = 0; j < arraySelectedValues3.length; j++)
                    {
                        if (arraySelectedValues3[j] === '3') { item = item.replace('[CHECKED]', 'checked="checked"'); break; }
                    }
                    item = item.replace('[CHECKED]', '');
                    radiogroup = radiogroup + item;
                }
                if (arrayNames3[i] === 'iLBC')
                {
                    for (var j = 0; j < arraySelectedValues3.length; j++)
                    {
                        if (arraySelectedValues3[j] === '4') { item = item.replace('[CHECKED]', 'checked="checked"'); break; }
                    }
                    item = item.replace('[CHECKED]', '');
                    radiogroup = radiogroup + item;
                }
                if (arrayNames3[i] === 'SPEEX')
                {
                    for (var j = 0; j < arraySelectedValues3.length; j++)
                    {
                        if (arraySelectedValues3[j] === '5') { item = item.replace('[CHECKED]', 'checked="checked"'); break; }
                    }
                    item = item.replace('[CHECKED]', '');
                    radiogroup = radiogroup + item;
                }
                if (arrayNames3[i] === 'SPEEX-WB')
                {
                    for (var j = 0; j < arraySelectedValues3.length; j++)
                    {
                        if (arraySelectedValues3[j] === '6') { item = item.replace('[CHECKED]', 'checked="checked"'); break; }
                    }
                    item = item.replace('[CHECKED]', '');
                    radiogroup = radiogroup + item;
                }

                if (arrayNames3[i] === 'Opus')
                {
                    for (var j = 0; j < arraySelectedValues3.length; j++)
                    {
                        if (arraySelectedValues3[j] === '6') { item = item.replace('[CHECKED]', 'checked="checked"'); break; }
                    }
                    item = item.replace('[CHECKED]', '');
                    radiogroup = radiogroup + item;
                }
                if (arrayNames3[i] === 'OpusWB')
                {
                    for (var j = 0; j < arraySelectedValues3.length; j++)
                    {
                        if (arraySelectedValues3[j] === '6') { item = item.replace('[CHECKED]', 'checked="checked"'); break; }
                    }
                    item = item.replace('[CHECKED]', '');
                    radiogroup = radiogroup + item;
                }
                if (arrayNames3[i] === 'OpusSWB')
                {
                    for (var j = 0; j < arraySelectedValues3.length; j++)
                    {
                        if (arraySelectedValues3[j] === '6') { item = item.replace('[CHECKED]', 'checked="checked"'); break; }
                    }
                    item = item.replace('[CHECKED]', '');
                    radiogroup = radiogroup + item;
                }
                if (arrayNames3[i] === 'OpusUWB')
                {
                    for (var j = 0; j < arraySelectedValues3.length; j++)
                    {
                        if (arraySelectedValues3[j] === '6') { item = item.replace('[CHECKED]', 'checked="checked"'); break; }
                    }
                    item = item.replace('[CHECKED]', '');
                    radiogroup = radiogroup + item;
                }

                if (arrayNames3[i] === 'G.729')
                {
                    for (var j = 0; j < arraySelectedValues3.length; j++)
                    {
                        if (arraySelectedValues3[j] === '8') { item = item.replace('[CHECKED]', 'checked="checked"'); break; }
                    }
                    item = item.replace('[CHECKED]', '');
                    radiogroup = radiogroup + item;
                }
            }


            var template = '' +
    '<div id="settings_type_3" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" data-dismissible="false" style="max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

        '<div data-role="header" data-theme="b">' +
    //--        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
            '<h1 class="adialog_title">' + settDisplayName + '</h1>' +
        '</div>' +
        '<div role="main" class="ui-content adialog_content_select">' +

    //'<form id="settings_select_2">' +
    '<fieldset id="settings_select_3" data-role="controlgroup">' + radiogroup +

    //    '<legend>Select transport layer protocol</legend>' +
    //    '<input name="radio-choice-v-2" id="radio-choice-v-2a" value="on" checked="checked" type="checkbox">' +
    //    '<label for="radio-choice-v-2a">One</label>' +
    //    '<input name="radio-choice-v-2" id="radio-choice-v-2b" value="off" type="checkbox">' +
    //    '<label for="radio-choice-v-2b">Two</label>' +

    '</fieldset>' +
    //'</form>' +

        '</div>' +
        '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" style="width: 98%;" id="adialog_positive" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_ok') + '</a>' +
        '</div>' +
    '</div>';

            var popupafterclose = function () {};

            webphone_api.$.mobile.activePage.append(template).trigger("create");
//--            webphone_api.$.mobile.activePage.append(template).trigger("pagecreate");

            webphone_api.$.mobile.activePage.find(".closePopup").bind("tap", function (e)
            {
                webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
            });

            webphone_api.$.mobile.activePage.find(".messagePopup").bind(
            {
                popupbeforeposition: function()
                {
                    webphone_api.$(this).unbind("popupbeforeposition");//--.remove();
                    var maxHeight =  Math.floor( webphone_api.common.GetDeviceHeight() * 0.7 );  //-- webphone_api.$(window).height() - 120;

                    if (webphone_api.$(this).height() > maxHeight)
                    {
                        webphone_api.$('.messagePopup .ui-content').height(maxHeight);
                    }
                }
            });

            webphone_api.$.mobile.activePage.find(".messagePopup").popup().popup("open").bind(
            {
                popupafterclose: function ()
                {
                    webphone_api.$(this).unbind("popupafterclose").remove();
                    webphone_api.$('#adialog_positive').off('click');
//--                    webphone_api.$('#adialog_negative').off('click');
                    popupafterclose();
                }
            });

//--    listen for enter onclick, and click OK button
//--     !!NOT WORKING
//--            webphone_api.$( "#settings_type_3" ).keypress(function( event )
//--            {
//--                if ( event.which === 13)
//--                {
//--                    event.preventDefault();
//--                    webphone_api.$("#adialog_positive").click();
//--                }else
//--                {
//--                    return;
//--                }
//--            });


            webphone_api.$(":checkbox").on ("change", function (event)
            {
//--                alert (webphone_api.$(this).attr ("id"));
//--                alert (webphone_api.$(this).attr ("value"));
                var val = webphone_api.$(this).attr ("value");
                if (val === '-1')
                {
                    if ( webphone_api.$('#' + mCurrSettName + '_0').prop("checked") ) // if optimal is checked
                    {
                        for (var i = 1; i < arrayNames3.length; i++)
                        {
                            webphone_api.$('#' + mCurrSettName + '_' + i).prop("checked", false).checkboxradio("refresh");
                        }
                    }else // if optimal is unchecked
                    {
                        for (var i = 0; i < arrayNames3.length; i++)
                        {
                            if (arrayNames3[i] === 'PCMU' || arrayNames3[i] === 'PCMA' || arrayNames3[i] === 'GSM')
                            {
                                webphone_api.$('#' + mCurrSettName + '_' + i).prop("checked", true).checkboxradio("refresh");
                            }    
                        }
                    }
                }else
                {
                    if (val === '8' && webphone_api.common.IsWindowsSoftphone() && webphone_api.common.GetConfig('needactivation') == 'true'
                        && webphone_api.common.GetParameter('canshowlickeyinput') !== 'true')
                    {
//--                        setTimeout(function ()
//--                        {
                            webphone_api.$('#' + mCurrSettName + '_7').prop("checked", false).checkboxradio("refresh");
                            webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
//--                        }, 200);
                        setTimeout(function () { webphone_api.common.ShowToast(webphone_api.stringres.get('warning_feature'), 6000); }, 100);
                        return;
                    }

                    webphone_api.$('#' + mCurrSettName + '_0').prop("checked", false).checkboxradio("refresh");
                }
            });

            webphone_api.$('#adialog_positive').on('click', function (event)
            {
                if (webphone_api.common.GetBrowser() === 'MSIE') { event.preventDefault(); }

                webphone_api.common.PutToDebugLog(5,"EVENT, settings onListItemClick 3 ok");

                ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));

                mSettValue = '';

                for (var i = 0; i < arrayNames3.length; i++)
                {
                    if ( webphone_api.$('#' + mCurrSettName + '_' + i).prop("checked") )
                    {
                        var sep = '';
                        if (mSettValue.length > 0)
                        {
                            sep = ',';
                        }

                        mSettValue = mSettValue + sep + document.getElementById(mCurrSettName + '_' + i).value;
                    }
                }
                value[webphone_api.common.SETT_VALUE] = mSettValue;
                value[webphone_api.common.SETT_ISDEFAULT] = '0';
                webphone_api.global.settmap[mCurrSettName] = value;
                webphone_api.global.settmap2[mCurrSettName] = value;

                ShowSettValue(mCurrSettName);
            });
        }
        
    }
    
//type 4 = seek bar (not implemented yet)
    if (mSettType === '4')
    {
        var template = '' +
'<div id="settings_type_4" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + settDisplayName + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content">' +
        '<span>' + settComment + '</span>' +
        '<input type="text" id="setting_item_input" name="setting_item" data-theme="a" autocapitalize="off"/>' +
    '</div>' +
    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" id="adialog_positive" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_ok') + '</a>' +
        '<a href="javascript:;" id="adialog_negative" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back">' + webphone_api.stringres.get('btn_cancel') + '</a>' +
    '</div>' +
'</div>';

        var popupafterclose = function () {};

        webphone_api.$.mobile.activePage.append(template).trigger("create");
//--        webphone_api.$.mobile.activePage.append(template).trigger("pagecreate");

        webphone_api.$.mobile.activePage.find(".closePopup").bind("tap", function (e)
        {
            webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
        });

        webphone_api.$.mobile.activePage.find(".messagePopup").popup().popup("open").bind(
        {
            popupafterclose: function ()
            {
                webphone_api.$(this).unbind("popupafterclose").remove();
                webphone_api.$('#adialog_positive').off('click');
                webphone_api.$('#adialog_negative').off('click');
                popupafterclose();
            }
        });
        
//-- listen for enter onclick, and click OK button
 //--       webphone_api.$( "#settings_type_4" ).keypress(function( event )
//--        {
//--            if ( event.which === 13)
//--            {
//--                event.preventDefault();
//--                webphone_api.$("#adialog_positive").click();
//--            }else
//--            {
//--                return;
//--            }
//--        });

        var textBox = document.getElementById('setting_item_input');

        if (!webphone_api.common.isNull(mSettValue) && mSettValue.length > 0 && !webphone_api.common.isNull(textBox))
        {
            if ((mCurrSettName === 'ringtimeout' || mCurrSettName === 'calltimeout') && (mCurrSettName.length > 3))
            {
                mSettValue = mSettValue.substring(0, mSettValue.length - 3);
                textBox.value = mSettValue;
            }else
            {
                textBox.value = mSettValue;
            }
        }

        setTimeout(function ()
        {
            if (!webphone_api.common.isNull(textBox)) { textBox.focus(); } // setting cursor to text input
        }, 150);

        webphone_api.$('#adialog_positive').on('click', function (event)
        {
            if (webphone_api.common.GetBrowser() === 'MSIE') { event.preventDefault(); }

            webphone_api.common.PutToDebugLog(5,"EVENT, settings onListItemClick 2 ok (" + mSettValue + ")");
            
            ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));

            var textBoxVal = '';
            if (!webphone_api.common.isNull(textBox)) { textBoxVal = textBox.value; }

            if (!webphone_api.common.isNull(textBoxVal) && textBoxVal.length > 0)
            {
                mSettValue = webphone_api.common.Trim(textBoxVal);

                value[webphone_api.common.SETT_VALUE] = mSettValue;
                value[webphone_api.common.SETT_ISDEFAULT] = '0';
                webphone_api.global.settmap2[mCurrSettName] = value;
                
                ShowSettValue(mCurrSettName);
            }
        });

        webphone_api.$('#adialog_negative').on('click', function (event)
        {
            if (webphone_api.common.GetBrowser() === 'MSIE') { event.preventDefault(); }
            ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));
        });
    }
    
//type 5 = open new activity
    if (mSettType === '5') //-- TODO: not implemented
    {
        if (mCurrSettName === 'filters')
        {
            //webphone_api.global.intentfiletransfer[0] = 'destination=' + destination;

            webphone_api.$.mobile.changePage("#page_filters", { transition: "slide", role: "page" });
        }
        else if (mCurrSettName === 'accounts')
        {
            webphone_api.$.mobile.changePage("#page_accounts", { transition: "slide", role: "page" });
        }else
        {
            console.log('not implemented yet');
        }
    }
    
    
//6 = submenu
    if (mSettType === '6')	//submenu_sipsettings,submenu_media,submenu_integrate,submenu_calldivert,submenu_general,submenu_integrate
    {
//--        webphone_api.$('#app_name_settings').hide();
        
        if (mCurrSettName === 'submenu_sipsettings')
        {
            SubmenuSipSettings();
        }
        else if (mCurrSettName === 'submenu_media')
        {
            currGroup = webphone_api.common.StrToInt( webphone_api.common.Trim(webphone_api.common.GROUP_MEDIA) );
            PopulateList();
            webphone_api.$('#btn_back_settings').show();
            webphone_api.$('#app_name_settings').hide();

            webphone_api.$('#settings_page_title').html( settDisplayName );
            webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("settings_title") );
        }
        else if (mCurrSettName === 'submenu_video') 
        {
            currGroup = webphone_api.common.StrToInt( webphone_api.common.Trim(webphone_api.common.GROUP_VIDEO) );
            PopulateList();
            webphone_api.$('#btn_back_settings').show();
            webphone_api.$('#app_name_settings').hide();

            webphone_api.$('#settings_page_title').html( settDisplayName );
            webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("sett_display_name_submenu_media") );
        }
        else if (mCurrSettName === 'submenu_calldivert')
        {
            currGroup = webphone_api.common.StrToInt( webphone_api.common.Trim(webphone_api.common.GROUP_CALLDIVERT) );
            PopulateList();
            webphone_api.$('#btn_back_settings').show();
            webphone_api.$('#app_name_settings').hide();

            webphone_api.$('#settings_page_title').html( settDisplayName );
            webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("settings_title") );
        }
        else if (mCurrSettName === 'submenu_general') 
        {
            currGroup = webphone_api.common.StrToInt( webphone_api.common.Trim(webphone_api.common.GROUP_GENERAL) );
            PopulateList();
            webphone_api.$('#btn_back_settings').show();
            webphone_api.$('#app_name_settings').hide();

            webphone_api.$('#settings_page_title').html( settDisplayName );
            webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("settings_title") );
        }
        else if (mCurrSettName === 'submenu_profile') 
        {
            currGroup = webphone_api.common.StrToInt( webphone_api.common.Trim(webphone_api.common.GROUP_PROFILE) );
            PopulateList();
            webphone_api.$('#btn_back_settings').show();
            webphone_api.$('#app_name_settings').hide();

            webphone_api.$('#settings_page_title').html( settDisplayName );
            webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("settings_title") );
        }
        else if (mCurrSettName === 'submenu_integrate') 
        {
            currGroup = webphone_api.common.StrToInt( webphone_api.common.Trim(webphone_api.common.GROUP_INTEGRATE) );
            PopulateList();
            webphone_api.$('#btn_back_settings').show();
            webphone_api.$('#app_name_settings').hide();

            webphone_api.$('#settings_page_title').html( settDisplayName );
            webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("settings_title") );
        }
        else if (mCurrSettName === 'submenu_screenshare') 
        {
            currGroup = webphone_api.common.StrToInt( webphone_api.common.Trim(webphone_api.common.GROUP_SCRSHARE) );
            PopulateList();
            webphone_api.$('#btn_back_settings').show();
            webphone_api.$('#app_name_settings').hide();

            webphone_api.$('#settings_page_title').html( settDisplayName );
            webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("settings_title") );
        }
        else if (mCurrSettName === 'submenu_advanced_artcl') // customized for ARTCL
        {
            webphone_api.$('#btn_back_settings').show();
            webphone_api.$('#app_name_settings').hide();
            currGroup = 6;
            PopulateList();
        }
    }
    
// 7 = drop down list from XML string-array
    if (mSettType === '7') //-- TODO: not implemented yet
    {
        console.log('ERROR, not implemented yet c');
    }
    
// custom
    if (mSettType === '8')
    {
        
//audiodevices
        if (mCurrSettName === 'audiodevices')
        {
            webphone_api.common.AlertDialog(webphone_api.stringres.get('sett_display_name_audiodevices'), webphone_api.stringres.get('sett_comment_audiodevices'), null, null, false);
        }

//reset_settings
        if (mCurrSettName === 'reset_settings')
        {
            var template = '' +
'<div data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + settDisplayName + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content">' +
        '<span>' + webphone_api.stringres.get('reset_settings_msg') + '</span>' +
//--        '<input type="text" id="setting_item_input" name="setting_item" data-theme="a"/>' +
    '</div>' +
    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" id="adialog_positive" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_ok') + '</a>' +
        '<a href="javascript:;" id="adialog_negative" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back">' + webphone_api.stringres.get('btn_cancel') + '</a>' +
    '</div>' +
'</div>';

            var popupafterclose = function () {};

            webphone_api.$.mobile.activePage.append(template).trigger("create");
//--            webphone_api.$.mobile.activePage.append(template).trigger("pagecreate");

            webphone_api.$.mobile.activePage.find(".closePopup").bind("tap", function (e)
            {
                webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
            });

            webphone_api.$.mobile.activePage.find(".messagePopup").popup().popup("open").bind(
            {
                popupafterclose: function ()
                {
                    webphone_api.$(this).unbind("popupafterclose").remove();
                    webphone_api.$('#adialog_positive').off('click');
                    webphone_api.$('#adialog_negative').off('click');
                    popupafterclose();
                }
            });

            webphone_api.$('#adialog_positive').on('click', function (event)
            {
                if (webphone_api.common.GetBrowser() === 'MSIE') { event.preventDefault(); }

                webphone_api.common.PutToDebugLog(5,"EVENT, settings onListItemClick Reset Settings ok");
                
                ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));
                
                var usernameTemp = webphone_api.common.GetParameter('username');
                var passwordTemp = webphone_api.common.GetParameter('password');
                var serveraddress_origTemp = webphone_api.common.GetParameter('serveraddress_orig');
                var serveraddress_userTemp = webphone_api.common.GetParameter('serveraddress_user');

                var proxyaddressTemp = webphone_api.common.GetParameter('proxyaddress');
                var sipusernameTemp = webphone_api.common.GetParameter('sipusername');
                var displaynameTemp = webphone_api.common.GetParameter('displayname');
                var emailTemp = webphone_api.common.GetParameter('email');
                var voicemailTemp = webphone_api.common.GetParameter('voicemailnum');
                var forwardnumberTemp = webphone_api.common.GetParameter('callforwardonbusy');

//--                 TODO: delete settings file if exists
//--                if (CommonGUI.FileExists(webphone_api.common.GetActiveAccSettingsFileName()))
//--                {
//--                        CommonGUI.DeleteTextFile(webphone_api.common.GetActiveAccSettingsFileName());
//--                }
                
                for (var key in webphone_api.global.settmap)
                {
                    delete webphone_api.global.settmap[key];
                }
                for (var key in webphone_api.global.settmap2)
                {
                    delete webphone_api.global.settmap2[key];
                }

//--###MZSETT                webphone_api.common.InitializeSettings();
                webphone_api.common.HandleSettings('', '', function () { ; });
                
                webphone_api.common.SaveParameter('username', usernameTemp);
                webphone_api.common.SaveParameter('password', passwordTemp);
                webphone_api.common.SaveParameter('serveraddress_orig', serveraddress_origTemp);
                webphone_api.common.SaveParameter('serveraddress_user', serveraddress_userTemp);

                webphone_api.common.SaveParameter('proxyaddress', proxyaddressTemp);
                webphone_api.common.SaveParameter('sipusername', sipusernameTemp);
                webphone_api.common.SaveParameter('displayname', displaynameTemp);
                webphone_api.common.SaveParameter('email', emailTemp);
                webphone_api.common.SaveParameter('voicemailnum', voicemailTemp);
                webphone_api.common.SaveParameter('callforwardonbusy', forwardnumberTemp);

                webphone_api.common.ShowToast(webphone_api.stringres.get('reset_settings_msg2'));
            });

            webphone_api.$('#adialog_negative').on('click', function (event)
            {
                if (webphone_api.common.GetBrowser() === 'MSIE') { event.preventDefault(); }
                ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));
            });
        }

// for aec
        if (mCurrSettName === 'aec')
        {
            var cbAuto = '';
            var cbNone = '';
            var cbSoftware = '';
            var cbNative = '';
            var cbFast = '';
            var cbDecreaseVolume = '';
            
            var listTmp = mSettValue.split(',');
            	
            for (var i = 0; i < listTmp.length; i++)
            {
                if (listTmp[i] === '-1')    cbAuto = 'checked="checked"';
                if (listTmp[i] === '0')     cbNone = 'checked="checked"';
                if (listTmp[i] === '1')     cbSoftware = 'checked="checked"';
                if (listTmp[i] === '2')     cbNative = 'checked="checked"';
                if (listTmp[i] === '3')     cbFast = 'checked="checked"';
                if (listTmp[i] === '4')     cbDecreaseVolume = 'checked="checked"';
            }
            
            var template = '' +
    '<div id="settings_type_aec" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" data-dismissible="false" style="max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

        '<div data-role="header" data-theme="b">' +
//--            '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
            '<h1 class="adialog_title">' + settDisplayName + '</h1>' +
        '</div>' +
        '<div role="main" class="ui-content adialog_content_select">' +

//--    '<form id="settings_select_2">' +
    '<fieldset id="settings_select_3" data-role="controlgroup">' +
//--        '<legend>Select transport layer protocol</legend>' +
        '<input name="' + mCurrSettName + '" id="aec_auto" ' + cbAuto + ' type="checkbox">' +
        '<label for="aec_auto">' + webphone_api.stringres.get('aec_auto') + '</label>' +
        
        '<input name="' + mCurrSettName + '" id="aec_none" ' + cbNone + ' type="checkbox">' +
        '<label for="aec_none">' + webphone_api.stringres.get('aec_none') + '</label>' +
        
        '<input name="' + mCurrSettName + '" id="aec_software" ' + cbSoftware + ' type="checkbox">' +
        '<label for="aec_software">' + webphone_api.stringres.get('aec_software') + '</label>' +
        
        '<input name="' + mCurrSettName + '" id="aec_native" ' + cbNative + ' type="checkbox">' +
        '<label for="aec_native">' + webphone_api.stringres.get('aec_native') + '</label>' +
        
        '<input name="' + mCurrSettName + '" id="aec_fast" ' + cbFast + ' type="checkbox">' +
        '<label for="aec_fast">' + webphone_api.stringres.get('aec_fast') + '</label>' +
        
        '<input name="' + mCurrSettName + '" id="aec_decrease_volume" ' + cbDecreaseVolume + ' type="checkbox">' +
        '<label for="aec_decrease_volume">' + webphone_api.stringres.get('aec_decrease_volume') + '</label>' +

    '</fieldset>' +
//--    '</form>' +

        '</div>' +
        '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" style="width: 98%;" id="adialog_positive" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_ok') + '</a>' +
        '</div>' +
    '</div>';

            var popupafterclose = function () {};

            webphone_api.$.mobile.activePage.append(template).trigger("create");
//--            webphone_api.$.mobile.activePage.append(template).trigger("pagecreate");
            
            webphone_api.$.mobile.activePage.find(".closePopup").bind("tap", function (e)
            {
                webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
            });

            webphone_api.$.mobile.activePage.find(".messagePopup").popup().popup("open").bind(
            {
                popupafterclose: function ()
                {
                    webphone_api.$(this).unbind("popupafterclose").remove();
                    webphone_api.$('#adialog_positive').off('click');
    //                webphone_api.$('#adialog_negative').off('click');
                    popupafterclose();
                }
            });

//-- listen for enter onclick, and click OK button
//-- !!NOT WORKING
//--            webphone_api.$( "#settings_type_aec" ).keypress(function( event )
//--            {
//--                if ( event.which === 13)
//--                {
//--                    event.preventDefault();
//--                    webphone_api.$("#adialog_positive").click();
//--                }else
//--                {
//--                    return;
//--                }
//--            });

            webphone_api.$(":checkbox").on ("change", function (event)
            {
//--                alert (webphone_api.$(this).attr ("id"));
//--                alert (webphone_api.$(this).attr ("value"));
                var checkbox = webphone_api.$(this).attr ("id");

                if (checkbox === 'aec_auto')
                {
                    if ( webphone_api.$('#' + checkbox).prop("checked") )
                    {
                        webphone_api.$('#aec_none').prop("checked", false).checkboxradio("refresh");
                        webphone_api.$('#aec_software').prop("checked", false).checkboxradio("refresh");
                        webphone_api.$('#aec_native').prop("checked", false).checkboxradio("refresh");
                        webphone_api.$('#aec_fast').prop("checked", false).checkboxradio("refresh");
                        webphone_api.$('#aec_decrease_volume').prop("checked", false).checkboxradio("refresh");
                    }
                }

                if (checkbox === 'aec_none')
                {
                    if ( webphone_api.$('#' + checkbox).prop("checked") )
                    {
                        webphone_api.$('#aec_auto').prop("checked", false).checkboxradio("refresh");
                        webphone_api.$('#aec_software').prop("checked", false).checkboxradio("refresh");
                        webphone_api.$('#aec_native').prop("checked", false).checkboxradio("refresh");
                        webphone_api.$('#aec_fast').prop("checked", false).checkboxradio("refresh");
                        webphone_api.$('#aec_decrease_volume').prop("checked", false).checkboxradio("refresh");
                    }else
                    {
                        webphone_api.$('#aec_auto').prop("checked", true).checkboxradio("refresh");
                    }
                }
                
                if (checkbox === 'aec_software')
                {
                    if ( webphone_api.$('#' + checkbox).prop("checked") )
                    {
                        webphone_api.$('#aec_auto').prop("checked", false).checkboxradio("refresh");
                        webphone_api.$('#aec_none').prop("checked", false).checkboxradio("refresh");
                    }
                    else if ( webphone_api.$('#aec_native').prop("checked") === false && webphone_api.$('#aec_fast').prop("checked") === false
                            && webphone_api.$('#aec_decrease_volume').prop("checked") === false )
                    {
                        webphone_api.$('#aec_auto').prop("checked", true).checkboxradio("refresh");
                    }
                }

                if (checkbox === 'aec_native')
                {
                    if ( webphone_api.$('#' + checkbox).prop("checked") )
                    {
                        webphone_api.$('#aec_auto').prop("checked", false).checkboxradio("refresh");
                        webphone_api.$('#aec_none').prop("checked", false).checkboxradio("refresh");
                    }
                    else if ( webphone_api.$('#aec_software').prop("checked") === false && webphone_api.$('#aec_fast').prop("checked") === false
                            && webphone_api.$('#aec_decrease_volume').prop("checked") === false )
                    {
                        webphone_api.$('#aec_auto').prop("checked", true).checkboxradio("refresh");
                    }
                }
                
                if (checkbox === 'aec_fast')
                {
                    if ( webphone_api.$('#' + checkbox).prop("checked") )
                    {
                        webphone_api.$('#aec_auto').prop("checked", false).checkboxradio("refresh");
                        webphone_api.$('#aec_none').prop("checked", false).checkboxradio("refresh");
                    }
                    else if ( webphone_api.$('#aec_software').prop("checked") === false && webphone_api.$('#aec_native').prop("checked") === false
                            && webphone_api.$('#aec_decrease_volume').prop("checked") === false )
                    {
                        webphone_api.$('#aec_auto').prop("checked", true).checkboxradio("refresh");
                    }
                }

                if (checkbox === 'aec_decrease_volume')
                {
                    if ( webphone_api.$('#' + checkbox).prop("checked") )
                    {
                        webphone_api.$('#aec_auto').prop("checked", false).checkboxradio("refresh");
                        webphone_api.$('#aec_none').prop("checked", false).checkboxradio("refresh");
                    }
                    else if ( webphone_api.$('#aec_software').prop("checked") === false && webphone_api.$('#aec_native').prop("checked") === false
                            && webphone_api.$('#aec_fast').prop("checked") === false )
                    {
                        webphone_api.$('#aec_auto').prop("checked", true).checkboxradio("refresh");
                    }
                }
                
//--                aec_auto,aec_none,aec_software,aec_native,aec_fast,aec_decrease_volume
            });
            

            webphone_api.$('#adialog_positive').on('click', function (event)
            {
                if (webphone_api.common.GetBrowser() === 'MSIE') { event.preventDefault(); }

                webphone_api.common.PutToDebugLog(5,"EVENT, settings onListItemClick aec ok");
                
                ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));

                mSettValue = '';
                
                if ( webphone_api.$('#aec_auto').prop("checked") )           { mSettValue += '-1,'; }
                if ( webphone_api.$('#aec_none').prop("checked") )           { mSettValue += '0,'; }
                if ( webphone_api.$('#aec_software').prop("checked") )       { mSettValue += '1,'; }
                if ( webphone_api.$('#aec_native').prop("checked") )         { mSettValue += '2,'; }
                if ( webphone_api.$('#aec_fast').prop("checked") )           { mSettValue += '3,'; }
                if ( webphone_api.$('#aec_decrease_volume').prop("checked") ){ mSettValue += '4,'; }

                value[webphone_api.common.SETT_VALUE] = mSettValue;
                value[webphone_api.common.SETT_ISDEFAULT] = '0';
                webphone_api.global.settmap[mCurrSettName] = value;
                webphone_api.global.settmap2[mCurrSettName] = value;
                
                ShowSettValue(mCurrSettName);
            });
        }
        
        if (mCurrSettName === 'serveraddress_user') // has different popup (with help button)
        {
            settDisplayName = webphone_api.common.GetParameter('server_label');
            
//BRANDSTART
            if (webphone_api.common.GetParameterInt('brandid', -1) === 2) //-- gmsdialergold
            {
                settComment = webphone_api.stringres.get('sett_comment_serveraddress_user_gmsdialer');
            }
//BRANDEND
            
            if ((settDisplayName.toLowerCase()).indexOf('op code') >= 0 || (settDisplayName.toLowerCase()).indexOf('operator code') >= 0)
            {
                settComment = webphone_api.stringres.get('sett_comment_serveraddress_user_operator');
            }
            
            if (webphone_api.common.GetConfig('server_comment').length > 1)
            {
                settComment = webphone_api.common.GetConfig('server_comment');
            }
            
            var srvaddrpart = '';
            var widthclass = '';
            var sdsrv = webphone_api.common.GetParameter('displaytopdomainserveraddress');
            if (webphone_api.common.isNull(sdsrv)) { sdsrv = ''; }
            if (sdsrv.length > 1)
            {
                srvaddrpart = '<span id="setting_item_srvaddrpart">' + sdsrv + '</span>';
                widthclass = 'data-wrapper-class="setting_item_input_class"';
            }
            

            var template = '' +
'<div id="settings_type_server" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + settDisplayName + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content adialog_btn_nexttoinput">' +
        '<span>' + settComment + '</span>' +
        '<div style="clear: both;"><!--//--></div>' +
        '<input type="text" ' + widthclass + ' id="setting_item_input" name="setting_item" data-theme="a" autocapitalize="off"/>' +
        srvaddrpart +
        '<button id="btn_srvhelp" class="btn_nexttoinput ui-btn ui-btn-corner-all ui-btn-b noshadow"><img src="' + webphone_api.common.GetElementSource() + 'images/icon_help_mark.png"></button>' +
    '</div>' +
    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" id="adialog_positive" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_ok') + '</a>' +
        '<a href="javascript:;" id="adialog_negative" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back">' + webphone_api.stringres.get('btn_cancel') + '</a>' +
    '</div>' +
'</div>';

            var popupafterclose = function () {};

            webphone_api.$.mobile.activePage.append(template).trigger("create");
//--            webphone_api.$.mobile.activePage.append(template).trigger("pagecreate");
            
//-- listen for enter onclick, and click OK button
//--            webphone_api.$( "#settings_type_server" ).keypress(function( event )
//--            {
//--                if ( event.which === 13)
//--                {
//--                    event.preventDefault();
//--                    webphone_api.$("#adialog_positive").click();
//--                }else
//--                {
//--                    return;
//--                }
//--            });

            webphone_api.$.mobile.activePage.find(".closePopup").bind("tap", function (e)
            {
                webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
            });

            webphone_api.$.mobile.activePage.find(".messagePopup").popup().popup("open").bind(
            {
                popupafterclose: function ()
                {
                    webphone_api.$(this).unbind("popupafterclose").remove();
                    webphone_api.$('#adialog_positive').off('click');
                    webphone_api.$('#adialog_negative').off('click');
                    webphone_api.$('#btn_srvhelp').off('click');
                    popupafterclose();
                }
            });
            
//OPSSTART
//--     treat serveraddress_user as upperserver. Used in case of standalone tunnel server
            if (webphone_api.common.GetParameter('serverinputisupperserver') === 'true' && (webphone_api.common.GetParameter('autoprovisioning').length < 1 || webphone_api.common.GetParameter('autoprovisioning') === '0'))
            {
                mSettValue = webphone_api.common.GetParameter('upperserver');
            }
//OPSEND

            var textBox = document.getElementById('setting_item_input');

            if (!webphone_api.common.isNull(mSettValue) && mSettValue.length > 0 && !webphone_api.common.isNull(textBox))
            {
               var valtmp = mSettValue;
               if (sdsrv.length > 1)
               {
                    if (!webphone_api.common.isNull(valtmp) && valtmp.length > 0 && valtmp.indexOf(sdsrv) >= 0)
                    {
                        valtmp = valtmp.replace(sdsrv, '');
                    }else
                    {
                        valtmp = '';
                    }
               }
               textBox.value = valtmp;
            }

            setTimeout(function ()
            {
                if (!webphone_api.common.isNull(textBox)) { textBox.focus(); } // setting cursor to text input
            }, 150);

            webphone_api.$('#adialog_positive').on('click', function (event)
            {
                if (webphone_api.common.GetBrowser() === 'MSIE') { event.preventDefault(); }

                webphone_api.common.PutToDebugLog(5,"EVENT, settings onListItemClick serveraddress ok");
                
                ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));

                var textBoxVal = '';
                if (!webphone_api.common.isNull(textBox)) { textBoxVal = textBox.value; }

                if (!webphone_api.common.isNull(textBoxVal) && textBoxVal.length > 0)
                {
                    mSettValue = webphone_api.common.Trim(textBoxVal);
                    if (webphone_api.common.isNull(mSettValue)) { mSettValue = ''; }

                    mSettValue = webphone_api.common.NormalizeInput(mSettValue, 0);
                    
                    if (sdsrv.length > 1)
                    {
                        mSettValue = mSettValue + sdsrv;
                    }

//--             treat serveraddress_user as upperserver. Used in case of standalone tunnel server
                    if (webphone_api.common.GetParameter('serverinputisupperserver') === 'true')
                    {
//--MODIFYINGUPPERSERVER
//OPSSTART
                        if (webphone_api.common.GetParameter('autoprovisioning') === '1' || webphone_api.common.GetParameter('autoprovisioning') === '2')
                        {
                            webphone_api.common.SaveParameter('serveraddress_user', mSettValue);
                            webphone_api.common.SaveParameter('upperserver', mSettValue);
                        }else
//OPSEND
                            webphone_api.common.SaveParameter('upperserver', mSettValue);

                        ShowSettValue(mCurrSettName);
                        return;
                    }else
                    {
//OPSSTART
                        if (webphone_api.common.GetParameter('autoprovisioning') === '1' || webphone_api.common.GetParameter('autoprovisioning') === '2')
                        {
                            if (webphone_api.global.autoServerDeployVersion && mSettValue.indexOf('.') > 0) //-- IP or domain name is not accepted as serveraddress, only autoprov filename
                            {
                                webphone_api.common.AlertWindow(webphone_api.stringres.get('warning'), webphone_api.stringres.get('warning_msg_2'));
                                return;
                            }

                            mSettValue = mSettValue.toLowerCase();

                            if (mSettValue.indexOf('.') > 0 || mSettValue.toLowerCase() === 'mizu') //-- means it's IP address or domain; not autoprovisioning filename
                            {
                                webphone_api.common.SaveParameter('serveraddress_orig', mSettValue);
                                webphone_api.common.SaveParameter('upperserver', '');
                            }
//--                                mCurrSettName = "autoprov_filename";
                        }else
                        {
//OPSEND
                            webphone_api.common.SaveParameter('serveraddress_orig', mSettValue);
                            webphone_api.common.SaveParameter('upperserver', '');
//OPSSTART
                        }
//OPSEND
                    }

                    value[webphone_api.common.SETT_VALUE] = mSettValue;
                    value[webphone_api.common.SETT_ISDEFAULT] = '0';
                    webphone_api.global.settmap[mCurrSettName] = value;
                    webphone_api.global.settmap2[mCurrSettName] = value;
                    
                    ShowSettValue(mCurrSettName);
                }
            });

            webphone_api.$('#adialog_negative').on('click', function (event)
            {
                if (webphone_api.common.GetBrowser() === 'MSIE') { event.preventDefault(); }
                ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));
            });
            
            webphone_api.$('#btn_srvhelp').on('click', function (event)
            {
                if (webphone_api.common.GetBrowser() === 'MSIE') { event.preventDefault(); }

                webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
                
                var btn_findprovider = '<br /><a href="https://www.mizu-voip.com/VoIPServiceProviders.aspx" onclick="webphone_api.common.OpenLinkInExternalBrowser(\'https://www.mizu-voip.com/VoIPServiceProviders.aspx\')" id="btn_srvhelp" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b " target="_blank">' + webphone_api.stringres.get('help_provider') + '</a>';
                
//--                var btn_findprovider = '<button id="btn_srvhelp" class="ui-btn ui-btn-corner-all ui-btn-b noshadow">' + webphone_api.stringres.get('help_provider') + '</button>';
//--                https://www.mizu-voip.com/VoIPServiceProviders.aspx
                
                webphone_api.common.AlertDialog(webphone_api.stringres.get('help'), webphone_api.stringres.get('srvaddr_help') + btn_findprovider, null, null, false);
            });
        }
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: OnListItemClick", err); }
}

function HandleProfilePicture(popupafterclose)
{
    //-- waiting for HTTP upload api from ISTVAN - handle same as filetransfer
    try{
        popupafterclose = popupafterclose ? popupafterclose : function () {};

        var popupWidth = webphone_api.common.GetDeviceWidth();
        if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
        {
            popupWidth = Math.floor(popupWidth / 1.2);
        }else
        {
            popupWidth = 220;
        }

        if(popupWidth > 400) popupWidth = 400;
        else if(popupWidth < 120) popupWidth = 120;

        var ppic = '';
        var picsrc = webphone_api.common.GetParameter('profilepicture');
        if (!webphone_api.common.isNull(picsrc) || picsrc.length > 10)
        {
            ppic = '<img id="ppmypic" src="' + picsrc + '">';
            webphone_api.common.PutToDebugLog(2, 'EVENT, HandleProfilePicture: display picture: ' + picsrc);
        }
    
        var template = '' +
    '<div data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +
    
        '<div data-role="header" data-theme="b">' +
            '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
            '<h1 class="adialog_title">' + webphone_api.stringres.get('sett_display_name_profilepicture') + '</h1>' +
        '</div>' +
        '<div id="prifilep_container" role="main" class="ui-content adialog_content adialog_alert" style="text-align: center; padding: 0;">' +
            ppic +
//            '<span style="-ms-user-select: text; -moz-user-select: text; -khtml-user-select: text; -webkit-user-select: text;  user-select: text;"> ' + webphone_api.stringres.get('pp_msg') + ' </span>' +
    //        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back">' + webphone_api.stringres.get('btn_close') + '</a>' +
    //        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" data-transition="flow">Delete</a>' +
        '</div>' +
        '<div data-role="footer" data-theme="b" class="adialog_footer">' +
            '<a href="javascript:;" id="btn_adialog_alert_ok" style="width: 98%;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_cancel') + '</a>' +
        '</div>' +
    '</div>';
    
        webphone_api.$.mobile.activePage.append(template).trigger("create");
        //webphone_api.$.mobile.activePage.append(template).trigger("pagecreate");
    
        webphone_api.$.mobile.activePage.find(".closePopup").bind("tap", function (e)
        {
            webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
        });
    
        webphone_api.$.mobile.activePage.find(".messagePopup").bind(
        {
            popupbeforeposition: function()
            {
                webphone_api.$(this).unbind("popupbeforeposition");//.remove();
                var maxHeight =  Math.floor( webphone_api.common.GetDeviceHeight() * 0.6 );  // webphone_api.$(window).height() - 120;
    
                if (webphone_api.$(this).height() > maxHeight + 100)
                {
                    webphone_api.$('.messagePopup .ui-content').height(maxHeight);
                }

                if (!webphone_api.common.isNull(document.getElementById('ppmypic')))
                {
                    document.getElementById('ppmypic').style.width = Math.floor(popupWidth / 3).toString() + 'px';
                }

                BuildPPIframe();
            }
        });
    
        webphone_api.$.mobile.activePage.find(".messagePopup").popup().popup("open", {positionTo: '#settings_header'}).bind(
        {
            popupafterclose: function ()
            {
                webphone_api.$(this).unbind("popupafterclose").remove();
                webphone_api.$('#btn_adialog_alert_ok').off('click');
                popupafterclose(false);
            }
        });
        
        webphone_api.$('#btn_adialog_alert_ok').on('click', function ()
        {
            if ( popupafterclose && typeof (popupafterclose) === 'function' )
            {
                popupafterclose(true); // means that OK was clicked
                popupafterclose = function () {};
            }
        });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: HandleProfilePicture", err); }
}

// build and add prifile picture upload form in iframe
var iframe = null;
function BuildPPIframe()
{
    try{
        var actionurl = webphone_api.common.GetFiletrasnferFormActionUrl();
        webphone_api.common.PutToDebugLog(2, 'EVENT, BuildPPIframe actionurl: ' + actionurl);
        
        iframe = document.createElement('iframe');
    // add iframe
        iframe.style.background = 'transparent';
        iframe.style.border = '0';
        iframe.style.width = '100%';
        iframe.style.height = '110px';
        iframe.style.overflow = 'hidden';
        var html = '<html><body style="margin 0; padding 0; background: transparent; width: 100%; overflow:hidden; font-size: 1em; color: #cecece;">' +
                        '<style>' +
                            '#fileinput { padding: .6em; background: #ffffff; display: inline-block; width: 95%; border: .1em solid #b8b8b8; -webkit-border-radius: .15em; border-radius: .15em;' +
                                                'cursor: pointer; font-weight: bold; font-size: 1em; }' +

                            '#btn_uploadpic { display: inline-block; margin-top: 1em; margin-bottom: 0; padding: .6em 2em .6em 2em; border: .1em solid #b8b8b8; -webkit-border-radius: .15em; border-radius: .15em;' +
                                                'cursor: pointer; font-weight: bold; font-size: 1em; background: #cccccc; }' +
                            '#btn_uploadpic:hover { background: #ffffff; }' +
                        '</style>' +
                        '<script>' +
                            'function OnPPFormSubmit(){' +
                                'var directory = document.getElementById("filepath").value;' +
                                'var filename = document.getElementById("fileinput").value;' +
                                'return parent.webphone_api._settings.ProfilePicOnSubmit(directory, filename);' +
                            '}' +
                        '</script>' +
                        //'<form style=" width: 100%; margin: 0; padding: 0;" action="' + actionurl + '" method="post" enctype="multipart/form-data" id="frm_ppupload" name="frm_ppupload" onsubmit="return OnPPFormSubmit()">' +
                        '<form style=" width: 100%; margin: 0; padding: 0;" action="' + actionurl + '" method="post" enctype="multipart/form-data" id="frm_ppupload" name="frm_ppupload" onsubmit="return OnPPFormSubmit()">' +
                            '<input type="hidden" id="filepath" name="filepath" value="">' +
                            '<input name="filedata" type="file" id="fileinput" /><br />' +
                            '<input type="submit" id="btn_uploadpic" value="' + webphone_api.stringres.get('btn_set') + '" title="' + webphone_api.stringres.get('hint_setprofpic') + '" />' +
                        '</form>' +
                    '</body></html>';
    //--    document.body.appendChild(iframe);
        if (webphone_api.common.isNull(document.getElementById('prifilep_container')))
        {
            webphone_api.common.PutToDebugLog(2, 'ERROR, BuildPPIframe container element is NULL');
            return;
        }
        document.getElementById('prifilep_container').appendChild(iframe);
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(html);
        iframe.contentWindow.document.close();
        //iframe.onload = function (evt) { FileUploaded(evt); };
        
        var ifrmDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        setTimeout(function ()
        {
        // fallback for IE7, IE8 addEventListener
            if (ifrmDoc.addEventListener)
            {
                ifrmDoc.addEventListener('click', HandleEventFiletransferStart, false);
            }
            else if (ifrmDoc.attachEvent)
            {
                ifrmDoc.attachEvent('click', HandleEventFiletransferStart);
            }
            
            function HandleEventFiletransferStart(event)
            {
                // set userguid (directory name)
                var filepath = webphone_api.common.GetTransferDirectoryName('');
                ifrmDoc.getElementById('filepath').value = filepath;
/*
                var username = webphone_api.common.GetSipusername(); if (webphone_api.common.isNull(username)) { username = ''; }
                username = webphone_api.common.Trim(username);
                if (username.lenght < 1) username = webphone_api.common.Md5Hash('abcd123' + webphone_api.common.GetTickCount());

                var serveraddress = GetParameter('serveraddress_user');
                normalized_filename*/
                
                webphone_api.common.PutToDebugLog(4, 'EVENT, profilepic directory: ' + filepath);
            }
        }, 150);
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: BuildPPIframe", err); }
}

function ProfilePicOnSubmit(directory, filename)
{
    try{
        webphone_api.common.PutToDebugLog(4, 'EVENT, ProfilePicOnSubmit directory: ' + directory + '; filename: ' + filename);
        
        if (webphone_api.common.isNull(directory)) { directory = ''; } else { directory = '/' + directory; }
        if (webphone_api.common.isNull(filename) || filename.length < 1)
        {
            webphone_api.common.PutToDebugLog(3, 'ERROR, ProfilePicOnSubmit send failed: ivalid filename: ' + filename);
            webphone_api.common.ShowToast(webphone_api.stringres.get('ppupload_failed'));
            return false;
        }
        
        var pos = filename.lastIndexOf('/');
        if (pos >= 0) { filename = filename.substring(pos + 1, filename.length); }
        pos = filename.lastIndexOf('\\');
        if (pos >= 0) { filename = filename.substring(pos + 1, filename.length); }
        
    // the path of the uploaded file on the server
        var transferpath = actionurl + 'filestorage' + directory + '/' + encodeURIComponent(webphone_api.common.NormalizeFilename(filename));
        webphone_api.common.PutToDebugLog(4, 'EVENT, ProfilePicOnSubmit filepath: ' + transferpath);
        
        if (webphone_api.common.GetBrowser() === 'Firefox')
        {
            if (!webphone_api.common.isNull(iframe) && !webphone_api.common.isNull(document.getElementById('prifilep_container')))
            {
                document.getElementById('prifilep_container').removeChild(iframe);
            }
        }

        webphone_api.common.SaveParameter('profilepicture', transferpath);

        setTimeout(function ()
        {
            // find and close all active popups before displaying OfferEngine popup
            var active_popups = webphone_api.$.mobile.activePage.find(".messagePopup");
            if (!webphone_api.common.isNull(active_popups) && active_popups.length > 0 && webphone_api.global.dontclosecurrpopup !== true)
            {
                webphone_api.$.mobile.activePage.find(".messagePopup").popup("close").bind(
                {
                    popupafterclose: function ()
                    {
                        webphone_api.$(this).unbind("popupafterclose").remove();
                    }
                });
            }
        }, 800);

        return true;

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: ProfilePicOnSubmit", err); }
    return false;
}

function SubmenuSipSettings()
{
    try{
        currGroup = webphone_api.common.StrToInt( webphone_api.common.Trim(webphone_api.common.GROUP_SIP) );
        PopulateList();
        webphone_api.$('#btn_back_settings').show();
        webphone_api.$('#app_name_settings').hide();

        webphone_api.$('#settings_page_title').html( webphone_api.stringres.get('sett_display_name_submenu_sipsettings') );
        webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("settings_title") );
    }catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: SubmenuSipSettings", err); }
}

function ManuallyClosePopup(popupelement) // workaround for IE, sometimes popups are not closed simply by clicking the button, so we close it manually
{
    try{
    if (webphone_api.common.isNull(popupelement) || webphone_api.common.isNull(popupelement.popup)) { return; }
    if (webphone_api.common.GetBrowser() === 'MSIE')
    {
        popupelement.popup("close");
    }
    else if (webphone_api.common.GetBrowser() === 'Firefox')
    {
        setTimeout(function ()
        {
            try{
            popupelement.popup("close"); // it will throw exception in may cases
            } catch(err) { ; }
        }, 200);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: ManuallyClosePopup", err); }
}

function ShowSettValue(settname) // display sett value (if not default) in comment
{
    try{
    if (webphone_api.common.isNull(settname) || settname.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, "WARNING, _settings: ShowSettValue settname is NULL");
        return;
    }
    
    var value = webphone_api.global.settmap2[settname];
    if( webphone_api.common.isNull(value) ) { return; }

    var settIsdefault = value[webphone_api.common.SETT_ISDEFAULT];
    

//-- treat serveraddress_user as upperserver. Used in case of standalone tunnel server
    if (settname === 'serveraddress_user' && webphone_api.common.GetParameter('serverinputisupperserver') === 'true')
    {
        document.getElementById('sett_comment_' + settname).innerHTML = GetSettComment(settname) + ' ' + GetSettFormattedValue(settname);
        return;
    }
    
// no need to add value to comment, because it's the default value
    if (settIsdefault === '1') { return; }
        
    var commentfield = document.getElementById('sett_comment_' + settname);
    if (webphone_api.common.isNull(commentfield))
    {
        webphone_api.common.PutToDebugLog(2, "WARNING, _settings: ShowSettValue commentfield is NULL");
        return;
    }
    
    commentfield.innerHTML = GetSettComment(settname) + ' ' + GetSettFormattedValue(settname);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: ShowSettValue", err); }
}

function GetSettComment(settname) // returns clean comment
{
    var comment = '';
    try{

    if (webphone_api.common.isNull(settname) || settname.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, "WARNING, _settings: GetSettComment settname is NULL");
        return '';
    }
    
    var value = webphone_api.global.settmap2[settname];

    if( webphone_api.common.isNull(value) ) { return ''; }

    var settComment = webphone_api.stringres.get('sett_comment_'+settname);
    var settCommentShort = webphone_api.stringres.get('sett_comment_short_'+settname);
    
    if (!webphone_api.common.isNull(settCommentShort) && settCommentShort.length > 0)
    {
        comment = settCommentShort;
    }else
    {
        comment = settComment;
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: GetSettComment", err); }

    return comment;
}

function GetSettFormattedValue(settname) // returns displayable value of settings; ex: if sett value = 'true' -> it retuens 'enabeld'
{
    var fval = '';
    try{
    if (webphone_api.common.isNull(settname) || settname.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, "WARNING, _settings: GetSettComment settname is NULL");
        return '';
    }
    
    var value = webphone_api.global.settmap2[settname];

    if( webphone_api.common.isNull(value) ) { return ''; }
    
    var type = value[webphone_api.common.SETT_TYPE];
//--    var settval = value[webphone_api.common.SETT_VALUE];
    var settval = webphone_api.common.GetParameter(settname);
    
    if (settname === 'password' && settval.length > 0)
    {
        fval = '*****';
    }
    else if (settname === 'loglevel')
    {
        if (settval === '1')
        {
            fval = webphone_api.stringres.get('sett_disabled');
        }else
        {
            fval = webphone_api.stringres.get('sett_enabled');
        }
    }else
    {
        if (type === '0')
        {
            if (settval === 'true' || settval === '2')
            {
               fval = webphone_api.stringres.get('sett_enabled');
            }else
            {
               fval = webphone_api.stringres.get('sett_disabled');
            }
        }
        else if (type === '1')
        {
            fval = settval;
            
            // cut off millisec (last thre zeros)
            if ((settname === 'ringtimeout' || settname === 'calltimeout') /*&& settval.length > 2*/)
            {
                fval = fval.substring(0, fval.length - 3);
            }
        }
        else if (type === '2')
        {
            var allnames = (value[webphone_api.common.SETT_ALLNAMES]).split(',');
            var allvalues = (value[webphone_api.common.SETT_ALLVALUES]).split(',');

            if (webphone_api.common.isNull(allnames) || allnames.length < 1 || webphone_api.common.isNull(allvalues) || allvalues.length < 1)
            {
                return '';
            }

            for (var i = 0; i < allvalues.length; i++)
            {
                if (allvalues[i] === settval)
                {
                    fval = allnames[i];
                    break;
                }
            }
        }
        else if (type === '3')
        {
            var allnames = (value[webphone_api.common.SETT_ALLNAMES]).split(',');
            var allvalues = (value[webphone_api.common.SETT_ALLVALUES]).split(',');
            var valarray = [];

            if (settval.indexOf(',') > 0) { valarray = settval.split(','); } else { valarray[0] = settval; }

            if (webphone_api.common.isNull(allnames) || allnames.length < 1 || webphone_api.common.isNull(allvalues) || allvalues.length < 1 || webphone_api.common.isNull(valarray))
            {
                return '';
            }

            for (var j = 0; j < valarray.length; j ++)
            {
                for (var i = 0; i < allvalues.length; i++)
                {
                    if (allvalues[i] === valarray[j])
                    {
                        if (fval.length > 0) { fval = fval + ', '; }
                        fval = fval + allnames[i];
                    }
                }
            }
        }
        else if (type === '4')
        {
            fval = settval + '%';
        }
        else if (type === '5' || type === '6' || type === '7')
        {
            fval = '';
        }
        else if (type === '8')
        {
            if (settname === 'aec')
            {
                var allnames = (value[webphone_api.common.SETT_ALLNAMES]).split(',');
                var allvalues = (value[webphone_api.common.SETT_ALLVALUES]).split(',');
                var valarray = [];

                if (settval.indexOf(',') > 0) { valarray = settval.split(','); } else { valarray[0] = settval; }

                if (webphone_api.common.isNull(allnames) || allnames.length < 1 || webphone_api.common.isNull(allvalues) || allvalues.length < 1 || webphone_api.common.isNull(valarray))
                {
                    return '';
                }

                for (var j = 0; j < valarray.length; j ++)
                {
                    for (var i = 0; i < allvalues.length; i++)
                    {
                        if (allvalues[i] === valarray[j])
                        {
                            if (fval.length > 0) { fval = fval + ', '; }
                            fval = fval + allnames[i];
                        }
                    }
                }
            }
            else if (settname === 'serveraddress_user')
            {
                if (webphone_api.common.GetParameter('serverinputisupperserver') === 'true'
//OPSSTART
                    && (webphone_api.common.GetParameter('autoprovisioning').length < 1 || webphone_api.common.GetParameter('autoprovisioning') === '0')
//OPSEND
                    )
                {
                    fval = webphone_api.common.GetParameter('upperserver');
                }else
                {
                    fval = settval;
                }
            }
        }
        
        /**type - 0 = checkbox, 1 = text box, 2 = drop down list, 3 = drop down list and checkbox,
		    	 4 = seek bar, 5 = open new activity, 6 = submenu, 7 = drop down list from XML string-array, 8 = custom*/
    }
    
    if (!webphone_api.common.isNull(fval) && fval.length > 0)
    {
        fval = '(' + fval + ')';
    }else
    {
        fval = '';
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: GetSettFormattedValue", err); }
    
    return fval;
}

function BackOnClick(event)
{
    try{
    if (filtervisible)
    {
        ShowHideSearch();
        return;
    }

    if (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_SIP) || currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_MEDIA)
            || currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_CALLDIVERT) || currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_GENERAL) || currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_PROFILE))
    {
        currGroup = webphone_api.common.StrToInt(webphone_api.common.GROUP_MAIN);
        PopulateList();
//--        webphone_api.$('#btn_back_settings').hide();
//--        webphone_api.$('#app_name_settings').show();

        webphone_api.$('#settings_page_title').html( webphone_api.stringres.get("settings_title") );
        webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("settings_login") );
    }
    else if (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN))
    {
        currGroup = 20;
        BeforeStart(true);
    }
    else if (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_MAIN))
    {
        currGroup = webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN);
        
        if (filtervisible) { ShowHideSearch(); }
        
        if (startedfrom === 'app')
        {
            webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("btn_cancel") );
        }else
        {
            webphone_api.$('#btn_back_settings').hide();
            webphone_api.$('#app_name_settings').show();
        }
        
        if (ShowLoginPage())
        {
            webphone_api.$('#settings_list').hide();
            webphone_api.$('#loginpage_container').show();
        }
        MeasureSettingslist();

        if(PopulateList())
        {
            webphone_api.$('#settings_page_title').html( webphone_api.stringres.get("settings_login") );
            currGroup = 20;
            BeforeStart(true);
        }
        else
        {
           webphone_api.$('#settings_page_title').html( webphone_api.stringres.get("settings_login") );
        }
    }
    else if (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_INTEGRATE))
    {
        currGroup = webphone_api.common.StrToInt(webphone_api.common.GROUP_GENERAL);
        PopulateList();
        
        webphone_api.$('#settings_page_title').html( webphone_api.stringres.get("sett_display_name_submenu_general") );
        webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("settings_title") );
    }
    else if (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_VIDEO))
    {
        currGroup = webphone_api.common.StrToInt(webphone_api.common.GROUP_MEDIA);
        PopulateList();
        
        webphone_api.$('#settings_page_title').html( webphone_api.stringres.get("sett_display_name_submenu_media") );
        webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("settings_title") );
    }
    else if (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_SCRSHARE))
    {
        currGroup = webphone_api.common.StrToInt(webphone_api.common.GROUP_MEDIA);
        PopulateList();
        
        webphone_api.$('#settings_page_title').html( webphone_api.stringres.get("sett_display_name_submenu_media") );
        webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("settings_title") );
    }
    else if (currGroup === 6)
    {
        currGroup = webphone_api.common.StrToInt(webphone_api.common.GROUP_MAIN);
        PopulateList();

        webphone_api.$('#settings_page_title').html( webphone_api.stringres.get("settings_title") );
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: BackOnClick", err); }
}

var currfeatureset = 10;
function ShowLoginPage() // whether to show standard login page or settings list
{
    try{
    // -1=auto (default), 0=no, 1=only at first login, 2=always. if -1 then auto 1 if featureset is Minimal, otherwise 0.
    var useloginpage = webphone_api.common.GetConfigInt('useloginpage', 10);
    if (useloginpage > 8) { useloginpage = webphone_api.common.GetParameterInt('useloginpage', -1); }
    
    if (!webphone_api.common.isNull(webphone_api.parameters.useloginpage))
    {
        useloginpage = webphone_api.parameters.useloginpage;
    }
    
    currfeatureset = webphone_api.common.GetConfigInt('featureset', 10);
    if (currfeatureset > 15) { currfeatureset = webphone_api.common.GetParameterInt('featureset', 10); }
    
    if (useloginpage === -1)
    {
        if (currfeatureset < 5) // minimal
        {
            return true;
        }else
        {
            return false;
        }
    }
    else if (useloginpage === 0)
    {
        return false;
    }
    else if (useloginpage === 1)
    {
        if (startedfrom !== 'app')
        {
            return true;
        }else
        {
            return false;
        }
    }else
    {
        return true;
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: ShowLoginPage", err); }
    return false;
}

function SaveSettings (usrstart)
{
    try{
    var settValue = '';
    var settDisplayName = '';
    var settComment = '';

    webphone_api.common.HandleCallerID();

//OPSSTART
//-- autoprovisioning -> if op code changed, then download autoprovisioning (block at start)
    if (currautoprovsrv.toLowerCase() !== (webphone_api.common.GetParameter('serveraddress_user')).toLowerCase()) // means opcode changed
    {
        webphone_api.common.SaveParameter('lastautoprov', '');
    }
//OPSEND

    if (webphone_api.common.RequestUserServerInput() && webphone_api.common.GetParameter('serverinputisupperserver') === 'true') // must have: sipusername, password, upperserver
    {
//--MODIFYINGUPPERSERVER
        var uppersrv = webphone_api.common.GetParameter('upperserver');
        var usersrv = webphone_api.common.GetParameter('serveraddress_user');
        
        if ((uppersrv.length < 0 || usersrv.indexOf('.') > 0) && webphone_api.common.ShowServerInput())
        {
            webphone_api.common.SaveParameter('iswebrtcuppersrvfromuser', 'true');
            webphone_api.common.SaveParameter('upperserver', usersrv);
        }
            
            
            
//OPSSTART
        if (webphone_api.common.GetParameter('autoprovisioning').length < 1 || webphone_api.common.GetParameter('autoprovisioning') === '0')
        {
//OPSEND
            settValue = webphone_api.common.GetParameter('upperserver');
            settDisplayName = webphone_api.stringres.get('sett_display_name_serveraddress_user');
            settComment = webphone_api.stringres.get('sett_comment_serveraddress_user');

            if ( webphone_api.common.isNull(settValue) || settValue.length <= 0 )
            {
//--                webphone_api.common.AlertDialog(settDisplayName, webphone_api.stringres.get('please_enter') + ' ' + settComment);
                webphone_api.common.ShowToast(webphone_api.stringres.get('please_enter') + ' ' + settComment);

                return;
            }
//OPSSTART
        }else
        {
            settValue = webphone_api.common.GetParameter('serveraddress_user');
            settDisplayName = webphone_api.stringres.get('sett_display_name_serveraddress_user');
            settComment = webphone_api.stringres.get('sett_comment_serveraddress_user');

            if (settValue.toLowerCase() === 'mizu')
            {
                settValue = "voip.mizu-voip.com";

                webphone_api.common.SaveParameter('serveraddress_user', settValue);
            }
        }
//OPSEND

        //username
        settValue = webphone_api.common.GetSipusername();
        settDisplayName = webphone_api.stringres.get('sett_display_name_sipusername');
        settComment = webphone_api.stringres.get('sett_comment_sipusername');

        if ( webphone_api.common.isNull(settValue) || settValue.length <= 0 )
        {
//--            webphone_api.common.AlertDialog(settDisplayName, webphone_api.stringres.get('username_warning'));
            webphone_api.common.ShowToast(webphone_api.stringres.get('username_warning'));
            return;
        }
        if (webphone_api.common.GetConfigBool('mizuserveronly', false) === true && settValue.length < 3)
        {
            webphone_api.common.PutToDebugLog('WARNING, ' + webphone_api.stringres.get('username_warning2') + '_1');
            webphone_api.common.ShowToast(webphone_api.stringres.get('username_warning2'));
            return;
        }


        //password
        settValue = webphone_api.common.GetParameter('password');
        settDisplayName = webphone_api.stringres.get('sett_display_name_password');
        settComment = webphone_api.stringres.get('sett_comment_password');

        if ( webphone_api.common.isNull(settValue) || settValue.length <= 0 )
        {
//--            webphone_api.common.AlertDialog(settDisplayName, webphone_api.stringres.get('please_enter') + ' ' + settComment);
            webphone_api.common.ShowToast(settDisplayName, webphone_api.stringres.get('please_enter') + ' ' + settComment);
            return;
        }
        if (webphone_api.common.GetConfigBool('mizuserveronly', false) === true && settValue.length < 3)
        {
            webphone_api.common.PutToDebugLog(2, 'WARNING, ' + webphone_api.stringres.get('password_warning2') + '_1');
            webphone_api.common.ShowToast(webphone_api.stringres.get('password_warning2'));
            return;
        }
    }else
    {
        if (webphone_api.common.GetParameterBool('customizedversion', true) !== true)
        {
            //username ; request sipusername even for NOT customized version (used for settings filename)
            settValue = webphone_api.common.GetSipusername();
            settDisplayName = webphone_api.stringres.get('sett_display_name_sipusername');
            settComment = webphone_api.stringres.get('sett_comment_sipusername');

            if ( webphone_api.common.isNull(settValue) || settValue.length <= 0 )
            {
//--                webphone_api.common.AlertDialog(settDisplayName, webphone_api.stringres.get('please_enter') + ' ' + settComment);
                webphone_api.common.ShowToast(webphone_api.stringres.get('username_warning'));
//--                isSaveCommandIssued = false;
                return;
            }
            if (webphone_api.common.GetConfigBool('mizuserveronly', false) === true === true && settValue.length < 3)
            {
                webphone_api.common.PutToDebugLog('WARNING, ' + webphone_api.stringres.get('username_warning2') + '_2');
                webphone_api.common.ShowToast(webphone_api.stringres.get('username_warning2'));
                return;
            }

            settValue = webphone_api.common.GetParameter('serveraddress_user');
            settDisplayName = webphone_api.stringres.get('sett_display_name_serveraddress_user');
            settComment = webphone_api.stringres.get('sett_comment_serveraddress_user');

            if (settValue.toLowerCase() === 'mizu')
            {
                settValue = "voip.mizu-voip.com";

                webphone_api.common.SaveParameter('serveraddress_user', settValue);
            }
        }else
        {

        //username
            settValue = webphone_api.common.GetSipusername();
            settDisplayName = webphone_api.stringres.get('sett_display_name_sipusername');
            settComment = webphone_api.stringres.get('sett_comment_sipusername');

            if ( webphone_api.common.isNull(settValue) || settValue.length <= 0 )
            {
//--                webphone_api.common.AlertDialog(settDisplayName, webphone_api.stringres.get('please_enter') + ' ' + settComment);
                webphone_api.common.ShowToast(webphone_api.stringres.get('username_warning'));
//--                isSaveCommandIssued = false;
                return;
            }
            if (webphone_api.common.GetConfigBool('mizuserveronly', false) === true && settValue.length < 3)
            {
                webphone_api.common.PutToDebugLog('WARNING, ' + webphone_api.stringres.get('username_warning2') + '_3');
                webphone_api.common.ShowToast(webphone_api.stringres.get('username_warning2'));
                return;
            }

        //password
            settValue = webphone_api.common.GetParameter('password');
            settDisplayName = webphone_api.stringres.get('sett_display_name_password');
            settComment = webphone_api.stringres.get('sett_comment_password');

            if ( webphone_api.common.isNull(settValue) || settValue.length <= 0 )
            {
//--                webphone_api.common.AlertDialog(settDisplayName, webphone_api.stringres.get('please_enter') + ' ' + settComment);
                webphone_api.common.ShowToast(webphone_api.stringres.get('please_enter') + ' ' + settComment);
//--                isSaveCommandIssued = false;
                return;
            }
            if (webphone_api.common.GetConfigBool('mizuserveronly', false) === true && settValue.length < 3)
            {
                webphone_api.common.PutToDebugLog(2, 'WARNING, ' + webphone_api.stringres.get('password_warning2') + '_2');
                webphone_api.common.ShowToast(webphone_api.stringres.get('password_warning2'));
                return;
            }
        }
    }
    
    setTimeout(function ()
    {
//--        don't send extcmd_startwithos by default. only on user click - send oly once and if changed
//--	hide the startwithos option once it is already set
        if (webphone_api.common.IsWindowsSoftphone())
        {
            if (webphone_api.common.ParameterIsDefault('startwithos') === false && webphone_api.common.GetParameterBool('startwithos_was_sent', true) === false)
            {
                var url = webphone_api.common.AddJscommport(webphone_api.global.WIN_SOFTPHONE_URL) + '?extcmd_startwithos=' + webphone_api.common.GetParameter('startwithos');
                webphone_api.common.WinSoftphoneHttpReq(url, 'GET', '', '', function (resp) { webphone_api.common.PutToDebugLog(2, 'EVENT, _settings: startwithos response: ' + resp); });
                webphone_api.common.SaveParameter('startwithos_was_sent', 'true');
//--                webphone_api.common.WinExternalCommand('startwithos', webphone_api.common.GetParameter('startwithos'));
            }
        }
    }, 5000);
    
    webphone_api.$('#settings_page_title').html(webphone_api.stringres.get('loading'));
    webphone_api.common.PutToDebugLogSpecial(1, 'EVENT, _settings: SaveSettings set Loading... page title', false, '');

// handle accounts
    if (accountsavailable === false) // true, if there is at least one account created. If "false". means we have to add an account at SaveSettings()
    {
        //acfile = acfile + acTemp[AC_NAME] + ',' + acTemp[AC_SIPUSERNAME] + ',' + acTemp[AC_SETTFILE] + ',' + acTemp[AC_CHFILE] + ',' + acTemp[AC_ISACTIVE] + '\r\n';
        var acctemp = [];
        
        var accname = 'Account' + webphone_api.common.GetSipusername();
        //accountname+serveraddr+username+salt+password
        var settfilename = webphone_api.common.Md5Hash(accname + webphone_api.common.GetParameter('serveraddress_user') + webphone_api.common.GetParameter('sipusername') + webphone_api.global.SALT + webphone_api.common.GetParameter('password') + webphone_api.common.GetLocationPathName());
        
        var extra = webphone_api.common.GetConfig('brandid');
        if (webphone_api.common.isNull(extra) || extra.length < 1 || extra == '-1')
        {
            extra = webphone_api.common.GetBrandName().toLowerCase();
        }
        settfilename = settfilename + extra;
        
        acctemp[webphone_api.common.AC_NAME] = accname;
        acctemp[webphone_api.common.AC_SIPUSERNAME] = webphone_api.common.GetSipusername();
        acctemp[webphone_api.common.AC_SETTFILE] = settfilename;
        acctemp[webphone_api.common.AC_CHFILE] = settfilename + '_ch';
        acctemp[webphone_api.common.AC_ISACTIVE] = 'true';

        /*
        if ( isNull(acctemp) || acctemp.length < 2 || acctemp.indexOf(',') < 0 || (acctemp.indexOf('true') < 0 && acctemp.indexOf('false') < 0))
        {
            PutToDebugLog(2, 'WARNING, trying to save invalid acc a: ' + acctemp);
        }
        */
        
        webphone_api.global.aclist.push(acctemp);
    }

    webphone_api.common.SaveSettingsFile(7, webphone_api.common.GetActiveAccSettingsFilename(), function (retval)
    {
        BeforeStart(usrstart);
        
//--     if demo index page, then also read settings from cookie
        if (window.location.href.indexOf('isdemopage=true') > 0)
        {
            try{
            var stmp = '';
            stmp = webphone_api.common.GetParameter('sipusername'); if (stmp.length > 0) { webphone_api.setparameter('sipusername', stmp); }
            stmp = webphone_api.common.GetParameter('username'); if (stmp.length > 0) { webphone_api.setparameter('username', stmp); }
            stmp = webphone_api.common.GetParameter('password'); if (stmp.length > 0) { webphone_api.setparameter('password', stmp); }
            stmp = webphone_api.common.GetParameter('sippassword'); if (stmp.length > 0) { webphone_api.setparameter('sippassword', stmp); }
            stmp = webphone_api.common.GetParameter('serveraddress_user'); if (stmp.length > 0) { webphone_api.setparameter('serveraddress_user', stmp); }
            stmp = webphone_api.common.GetParameter('serveraddress_orig'); if (stmp.length > 0) { webphone_api.setparameter('serveraddress_orig', stmp); }
            stmp = webphone_api.common.GetParameter('serveraddress'); if (stmp.length > 0) { webphone_api.setparameter('serveraddress', stmp); }
            stmp = webphone_api.common.GetParameter('upperserver'); if (stmp.length > 0) { webphone_api.setparameter('upperserver', stmp); }
            stmp = webphone_api.common.GetParameter('callto'); if (stmp.length > 0) { webphone_api.setparameter('callto', stmp); }
            stmp = webphone_api.common.GetParameter('destination'); if (stmp.length > 0) { webphone_api.setparameter('destination', stmp); }
            
            } catch(e) { webphone_api.common.PutToDebugLogException(2, '_settings: SaveSettings inner1', e); }
        }
        
        setTimeout(function ()
        {
            // save accounts to file
            webphone_api.common.SaveAccountsFile(function (success)
            {
                if(webphone_api.common.CanLog(2)) {
                    if (success)
                    {
                        webphone_api.common.PutToDebugLog(3, 'EVENT, _settings: SaveSettings Accounts file saved successfully');
                    }else
                    {
                        webphone_api.common.PutToDebugLog(2, 'ERROR, _settings: SaveSettings Accounts file save failed');
                    }
                }
            });
        }, 200);
        
    });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: SaveSettings", err); }
}

function BeforeStart(usrstart) //-- handle autoprovisioning
{
    try{
    StartPhone(usrstart);
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: BeforeStart", err); }
}

function StartPhone(usrstart)
{
    try{
//--    webphone_api.$.mobile.loading('hide');
//--    webphone_api.common.HideModalLoader();
    webphone_api.global.sipstackstarted = true;
    webphone_api.$.mobile.changePage("#page_dialpad", { transition: "pop", role: "page" });

    var timeout = 500;
    if (webphone_api.common.IsWindowsSoftphone()) { timeout = 100; }
    setTimeout(function ()
    {
        if (webphone_api.common.IsWindowsSoftphone()) { webphone_api.global.webphone_started = false; }

        if (usrstart === true)
        {
            webphone_api.common.PutToDebugLog(2, 'EVENT, mlogic API_Start _settings StartPhone');
            webphone_api.start( webphone_api.common.GetSipusername(), webphone_api.common.GetParameter('password') );
        }
//--        else
//--        {
//--            webphone_api.startInner( webphone_api.common.GetSipusername(), webphone_api.common.GetParameter('password') );
//--        }
    }, timeout);
    
    setTimeout(function ()
    {
        if (webphone_api.common.UsePresence2() === true)
        {
            webphone_api.common.SetSelectedPresence('Offline', false);
        }
    }, 1000);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: StartPhone", err); }
}

//--1: when the engine has to be started (user click on ok or auto login). wait for stage 0 to complete at least 1 seconds even if it was auto started
//--var DELAY = 1000;
//--function StartWithEngineSelect()
//--{
//--    try{
//--    if (webphone_api.global.engineselectstage !== 0 || (webphone_api.common.GetTickCount() - webphone_api.global.engineselecttime) > DELAY)
//--    {
//--        var ret = webphone_api.common.EngineSelect(1);
//--        webphone_api.common.PutToDebugLog(2, 'EVENT, selected engine: '  + webphone_api.common.TestEngineToString(webphone_api.common.GetSelectedEngine(), false));
//--        webphone_api.common.PutToDebugLog(2, 'EVENT, recommended engine: ' + webphone_api.common.TestEngineToString(webphone_api.common.GetRecommendedEngine(), false));
//--        webphone_api.startInner( webphone_api.common.GetSipusername(), webphone_api.common.GetParameter('password') );
//--        return;
//--    }
//--    //wait for at least 1 second after EngineSelect stage 0 was called
//--    var wait = DELAY - (webphone_api.common.GetTickCount() - webphone_api.global.engineselecttime);
//--    if (wait < 0)
//--    {
//--        wait = 1;
//--    }
//--    setTimeout(function ()
//--    {
//--        var ret = webphone_api.common.EngineSelect(1);
//--        webphone_api.common.PutToDebugLog(2, 'EVENT, selected engine: '  + webphone_api.common.TestEngineToString(webphone_api.common.GetSelectedEngine(), false));
//--        webphone_api.common.PutToDebugLog(2, 'EVENT, recommended engine: ' + webphone_api.common.TestEngineToString(webphone_api.common.GetRecommendedEngine(), false));
//--        webphone_api.startInner( webphone_api.common.GetSipusername(), webphone_api.common.GetParameter('password') );
//--        return;
//--    }, wait);
//--    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: StartWithEngineSelect", err); }
//--}

function QRcodeLogin()
{
    try{
        var url = webphone_api.common.AddJscommport(webphone_api.global.WIN_SOFTPHONE_URL) + '?extcmd_qrcode';
        webphone_api.common.WinSoftphoneHttpReq(url, 'GET', '', '', function (resp)
        {
            webphone_api.common.PutToDebugLog(2, 'EVENT, _settings: extcmd_qrcode response: ' + resp);
        });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: QRcodeLogin", err); }
}

function OnNewUserClicked()
{
    try{/*
    var reguri =  webphone_api.common.GetParameter('newuser');
    
    if ((webphone_api.common.Trim(reguri)).indexOf('*') !== 0) // if starts with * => httpapi ELSE link
    {
        webphone_api.common.OpenWebURL(reguri, webphone_api.stringres.get('newuser'));
    }else
    {
        webphone_api.$.mobile.changePage("#page_newuser", { transition: "pop", role: "page" });
    }
*/

    webphone_api.$.mobile.changePage("#page_newuser", { transition: "pop", role: "page" });

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: OnNewUserClicked", err); }
}

function CustomBtn()
{
    try{
//BRANDSTART
    if (webphone_api.common.GetConfigInt('brandid', -1) === 50) // favafone
    {
        webphone_api.$.mobile.changePage("#page_newuser", { transition: "pop", role: "page" });
    }
//BRANDEND
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: CustomBtn", err); }
}

//--var MENUITEM_SETTINGS_EXIT = '#menuitem_settings_exit';
var MENUITEM_LEVEL = '#menuitem_settings_level';
var MENUITEM_SHOW_SETTINGS = '#menuitem_show_settings';
var MENUITEM_SEARCH = '#menuitem_settings_search';
var MENUITEM_HELP = '#menuitem_settings_help';
var MENUITEM_EXIT = '#menuitem_settings_exit';
//OPSSTART
var MENUITEM_PROVERSION = '#menuitem_settings_proversion';
//OPSEND
var MENUITEM_LOGS_CUSTOM = '#menuitem_settings_logs_custom';
var MENUITEM_SPEEDTEST = 'menuitem_settings_speedtest';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE())
    {
        webphone_api.$( "#btn_settings_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _settings: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _settings: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
//--    webphone_api.$(menuId).append( '<li id="' + MENUITEM_SETTINGS_EXIT + '"><a data-rel="back">' + webphone_api.stringres.get('menu_exit') + '</a></li>' ).listview('refresh');

    var menuLevelTitle = '';
    if (isSettLevelBasic)
    {
        menuLevelTitle = webphone_api.stringres.get('menu_switchtoadvanced');
    }else
    {
        menuLevelTitle = webphone_api.stringres.get('menu_switchtobasic');
    }
    
//--    if (webphone_api.$('#loginpage_container').is(':visible')) // means we are on login page and settings list is not visible
//--    {
//--        webphone_api.$(menuId).append( '<li id="' + MENUITEM_SHOW_SETTINGS + '"><a data-rel="back">' + webphone_api.stringres.get('menu_showsettings') + '</a></li>' ).listview('refresh');
//--    }else
//--    {
//--        if (currfeatureset > 5)
//--        {
//--            webphone_api.$(menuId).append( '<li id="' + MENUITEM_LEVEL + '"><a data-rel="back">' + menuLevelTitle + '</a></li>' ).listview('refresh');
//--        }
//--        webphone_api.$(menuId).append( '<li id="' + MENUITEM_SEARCH + '"><a data-rel="back">' + searchTitle + '</a></li>' ).listview('refresh');
//--    }
//--webphone_api.$(menuId).append( '<li id="' + MENUITEM_SHOW_SETTINGS + '"><a data-rel="back">' + webphone_api.stringres.get('menu_showsettings') + '</a></li>' ).listview('refresh');
   
//--    if (webphone_api.common.IsWindowsSoftphone() && webphone_api.common.GetConfig('needactivation') == 'true' && CanShowLicKeyInput())
//--    {
//--        webphone_api.$(menuId).append( '<li id="' + MENUITEM_PROVERSION + '"><a data-rel="back">' + webphone_api.stringres.get('help_proversion') + '</a></li>' ).listview('refresh');
//--    }
   
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_SPEEDTEST + '"><a data-rel="back">' + webphone_api.stringres.get('menu_speedtest') + '</a></li>' ).listview('refresh');
    webphone_api.$("#" + MENUITEM_SPEEDTEST).attr("title", webphone_api.stringres.get('hint_speedtest'));

    var searchTitle = '';
    if (filtervisible)
    {
        searchTitle = webphone_api.stringres.get('hide_search');
    }else
    {
        searchTitle = webphone_api.stringres.get('show_search');
    }

    if (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN))
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_SHOW_SETTINGS + '"><a data-rel="back">' + webphone_api.stringres.get('menu_showsettings') + '</a></li>' ).listview('refresh');
    }else
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_LEVEL + '"><a data-rel="back">' + menuLevelTitle + '</a></li>' ).listview('refresh');
        
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_SEARCH + '"><a data-rel="back">' + searchTitle + '</a></li>' ).listview('refresh');
    }
   
    var help_title = webphone_api.stringres.get('menu_help') + '...';
//BRANDSTART
    if (webphone_api.common.GetConfigInt('brandid', -1) === 60) // voipmuch
    {
        if (startedfrom === 'app')
        {
            webphone_api.$(menuId).append( '<li id="' + MENUITEM_LOGS_CUSTOM + '"><a data-rel="back">' + webphone_api.stringres.get('logview_title') + '</a></li>' ).listview('refresh'); // add logs to menu if advanced settinsg are displayed
        }
        help_title = webphone_api.stringres.get('help_about');
    }
//BRANDEND
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_HELP + '"><a data-rel="back">' + help_title + '</a></li>' ).listview('refresh');
    
    if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE())
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_EXIT + '"><a data-rel="back">' + webphone_api.stringres.get('menu_exit') + '</a></li>' ).listview('refresh');
    }

    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    if (itemid === MENUITEM_SPEEDTEST)
    {
        var uri = 'https://fast.com/'; //'https://sourceforge.net/speedtest/';
        if (webphone_api.common.IsWindowsSoftphone() === true)
        {
            webphone_api.common.OpenLinkInExternalBrowser(uri);
        }else
        {
            window.open(uri);
        }
    }
    
    webphone_api.$( '#settings_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#settings_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
//--            case MENUITEM_SETTINGS_EXIT:
//--                alert('Exit');
//--                break;
            case MENUITEM_LEVEL:
                SwitchBetweenBasicAdvanced();
                break;
            case MENUITEM_SHOW_SETTINGS:
                ShowSettings();
                break;
            case MENUITEM_SEARCH:
                ShowHideSearch();
                break;
            case MENUITEM_HELP:
                webphone_api.common.HelpWindow('settings');
                break;
            case MENUITEM_EXIT:
                webphone_api.common.Exit();
                break;
//OPSSTART
            case MENUITEM_PROVERSION:
                webphone_api.common.UpgradeToProVersion();
                break;
//OPSEND
            case MENUITEM_LOGS_CUSTOM:
                webphone_api.$.mobile.changePage("#page_logview", { transition: "pop", role: "page" });
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: MenuItemSelected", err); }
}

function ShowSettings()
{
    try{
    if (webphone_api.$('#loginpage_container').is(':visible'))
    {
        webphone_api.$('#loginpage_container').hide();
        webphone_api.$('#settings_list').show();
    }

    currGroup = webphone_api.common.StrToInt(webphone_api.common.GROUP_MAIN);
    webphone_api.$('#btn_back_settings').show();
    webphone_api.$('#app_name_settings').hide();

    webphone_api.$('#settings_page_title').html( webphone_api.stringres.get("settings_title") );
    webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get('settings_login') );
    PopulateList();

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: ShowSettings", err); }
}

function ShowLoginSettings()
{
    try{
        isAdvancedLoginSett = 1;


//currGroup = CommonGUI.StringToInt(GROUP_MAIN, 0);
//   	isAdvancedLoginSett = from;
//		RefreshList(0);
//		String title = getResources().getString(R.string.sett_comment_page_title);
//		mTitle.setText( title );



    if (webphone_api.$('#loginpage_container').is(':visible'))
    {
        webphone_api.$('#loginpage_container').hide();
        webphone_api.$('#settings_list').show();
    }

    currGroup = webphone_api.common.StrToInt(webphone_api.common.GROUP_MAIN);
    webphone_api.$('#btn_back_settings').show();
    webphone_api.$('#app_name_settings').hide();

    webphone_api.$('#settings_page_title').html( webphone_api.stringres.get("settings_title") );
    webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get('settings_login') );
    PopulateList();

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: ShowLoginSettings", err); }
}

function SwitchBetweenBasicAdvanced()
{
    try{
    if (isSettLevelBasic)
    {
        AdvancedSettProtected();
    }else
    {
        isSettLevelBasic = true;
        if (currGroup === webphone_api.common.StrToInt( webphone_api.common.GROUP_MEDIA )) { currGroup = webphone_api.common.StrToInt( webphone_api.common.GROUP_MAIN ); }
        PopulateList();
        webphone_api.common.SaveParameter('settlevelbasic', 'true');
    }

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: SwitchBetweenBasicAdvanced", err); }
}

function ShowAdvancedSettings()
{
    try{
    isSettLevelBasic = false;
    // Settings page: if settings is displayed on page under password in menu "Advanced settings" engine select:
    if (currGroup === webphone_api.common.StrToInt(webphone_api.common.GROUP_LOGIN))
    {
        ShowSettings();
        webphone_api.common.SaveParameter('settlevelbasic', 'false');
        return;
    }
    PopulateList();
    webphone_api.common.SaveParameter('settlevelbasic', 'false');

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: ShowAdvancedSettings", err); }
}

// option to protect advanced settings with password: advancedsettpwd
var settpwdmatche = false;
function AdvancedSettProtected()
{
    try{
    if (settpwdmatche === true)
    {
        ShowAdvancedSettings();
        return;
    }

    var pwd = webphone_api.common.GetConfig('advancedsettpwd');
    if (webphone_api.common.isNull(pwd) || pwd.length < 1) { pwd = webphone_api.common.GetParameter2('advancedsettpwd'); }
    
    if (webphone_api.common.isNull(pwd) || pwd.length < 1)
    {
        settpwdmatche = true;
        ShowAdvancedSettings();
        return;
    }
    pwd = webphone_api.common.Trim(pwd);
    if (pwd.indexOf('encrypted__3__') === 0)
    {
        pwd = webphone_api.common.StrDc(pwd, webphone_api.common.GetPassphrase());
    }
    
// show popup for user to enter unlock password
    var popupWidth = webphone_api.common.GetDeviceWidth();
    if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
    {
        popupWidth = Math.floor(popupWidth / 1.2);
    }else
    {
        popupWidth = 220;
    }

        if(popupWidth > 400) popupWidth = 400;
        else if(popupWidth < 120) popupWidth = 120;

    var msg = webphone_api.stringres.get('unlockadvancedsett_msg') + ':';
    
    var template = '' +
'<div id="advancedsett_popup" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('unlockadvancedsett_title') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content">' +
        '<span>' + msg + '</span>' +
        '<div style="clear: both;"><!--//--></div>' +
        '<input type="text" id="advancedsett_input" name="setting_item" data-theme="a" autocapitalize="off"/>' +
    '</div>' +
    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" id="adialog_positive" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_ok') + '</a>' +
        '<a href="javascript:;" id="adialog_negative" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back">' + webphone_api.stringres.get('btn_cancel') + '</a>' +
    '</div>' +
'</div>';

    var popupafterclose = function () {};

    webphone_api.$.mobile.activePage.append(template).trigger("create");
//--    webphone_api.$.mobile.activePage.append(template).trigger("pagecreate");

    webphone_api.$.mobile.activePage.find(".closePopup").bind("tap", function (e)
    {
        webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
    });

    webphone_api.$.mobile.activePage.find(".messagePopup").popup().popup("open").bind(
    {
        popupafterclose: function ()
        {
            webphone_api.$(this).unbind("popupafterclose").remove();
            webphone_api.$('#adialog_positive').off('click');
            webphone_api.$('#adialog_negative').off('click');
            popupafterclose();
        }
    });
    
//-- listen for enter onclick, and click OK button
//-- no need for this, because it reloads the page
//--    webphone_api.$( "#advancedsett_popup" ).keypress(function( event )
//--    {
//--        if ( event.which === 13)
//--        {
//--            event.preventDefault();
//--            webphone_api.$("#adialog_positive").click();
//--        }else
//--        {
//--            return;
//--        }
//--    });

    var textBox = document.getElementById('advancedsett_input');
    if (!webphone_api.common.isNull(textBox)) { textBox.focus(); } // setting cursor to text input


    webphone_api.$('#adialog_positive').on('click', function (event)
    {
        webphone_api.common.PutToDebugLog(5,'EVENT, _settings AdvancedSettProtected ok onclick');

        var textboxval = webphone_api.common.Trim(textBox.value);
        webphone_api.$( '#advancedsett_popup' ).on( 'popupafterclose', function( event )
        {
            if (!webphone_api.common.isNull(textboxval) && textboxval.length > 0 && textboxval === pwd)
            {
                webphone_api.common.PutToDebugLog(5,'EVENT, _settings AdvancedSettProtected ok onclick password match');
                settpwdmatche = true;
                ShowAdvancedSettings();
            }else
            {
                webphone_api.common.PutToDebugLog(5,'EVENT, _settings AdvancedSettProtected ok onclick password NOT match: ' + textboxval);
                webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_2'));
            }
        });
    });

    webphone_api.$('#adialog_negative').on('click', function (event)
    {
        ;
    });

    return;
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: AdvancedSettProtected", err); }
    ShowAdvancedSettings();
}

var lastback = '';
function ShowHideSearch()
{
    try{

    if (filtervisible)
    {
        if ( webphone_api.common.isNull(lastback) || lastback.length < 2 )
        {
            webphone_api.$('#btn_back_settings').hide();
            webphone_api.$('#app_name_settings').show();
        }else
        {
            webphone_api.$('#btn_back_settings').html(lastback);
            lastback = '';
        }
        
        filtervisible = false;
        webphone_api.$("#settings_list").prev("form.ui-filterable").hide();
        PopulateList();
        MeasureSettingslist();
    }else
    {
        if (webphone_api.$('#btn_back_settings').is(':visible'))
        {
            lastback = webphone_api.$('#btn_back_settings').html();
        }
        webphone_api.$('#btn_back_settings').show();
        webphone_api.$('#app_name_settings').hide();
        webphone_api.$('#btn_back_settings').html( '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("hide_search") );
        
        filtervisible = true;
        webphone_api.$("#settings_list").prev("form.ui-filterable").show();
        PopulateList();
        MeasureSettingslist();
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: ShowHideSearch", err); }
}

//returns true if username or password is set fixed in webphone_api.parameters or config.js
function IsUsernameFixed()
{
    try{
        var usr1 = webphone_api.parameters['username'];
        var usr2 = webphone_api.parameters['sipusername'];
        var usr3 = webphone_api.common.GetConfig('username');
        var usr4 = webphone_api.common.GetConfig('sipusername');
            
        if ((!webphone_api.common.isNull(usr1) && usr1.length > 0 && usr1 !== 'USERNAME' && usr1 !== 'SIPUSERNAME')
                || (!webphone_api.common.isNull(usr2) && usr2.length > 0 && usr2 !== 'USERNAME' && usr2 !== 'SIPUSERNAME')
                || (!webphone_api.common.isNull(usr3) && usr3.length > 0 && usr3 !== 'USERNAME' && usr3 !== 'SIPUSERNAME')
                || (!webphone_api.common.isNull(usr4) && usr4.length > 0 && usr4 !== 'USERNAME' && usr4 !== 'SIPUSERNAME'))
        {
            return true;
        }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: IsUsernameFixed", err); }
    return false;
}

//returns true if username or password is set fixed in webphone_api.parameters or config.js
function IsPasswordFixed()
{
    try{
        var pwd1 = webphone_api.parameters['password'];
        var pwd2 = webphone_api.common.GetConfig('password');
        
        if ((!webphone_api.common.isNull(pwd1) && pwd1.length > 0 && pwd1 !== 'PASSWORD' && pwd1 !== 'SIPPASSWORD' && pwd1 !== 'SIPASSWORD')
                || (!webphone_api.common.isNull(pwd2) && pwd2.length > 0 && pwd2 !== 'PASSWORD' && pwd2 !== 'SIPPASSWORD' && pwd2 !== 'SIPASSWORD'))
        {
            return true;
        }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: IsPasswordFixed", err); }
    return false;
}

function onStop(event)
{
    try{
    if(webphone_api.common.CanLog(4)) { webphone_api.common.PutToDebugLog(4, "EVENT, _settings: onStop"); }
    webphone_api.global.isSettingsStarted = false;
    
    startedfrom = '';
    isSettLevelBasic = true;
    eselect_called = false;
    printdevice = false;
    html_engineoption = '';
    
    webphone_api.global.favafone_autologin = false;
    
    if (filtervisible) { ShowHideSearch(); }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_settings: onStop", err); }
}

function onDestroy (event){} // deprecated by onstop


// public members and methods
return {
    onCreate: onCreate,
    onStart: onStart,
    onStop: onStop,
    onDestroy: onDestroy,

    SaveSettings: SaveSettings,
    ProfilePicOnSubmit: ProfilePicOnSubmit
};
})();
