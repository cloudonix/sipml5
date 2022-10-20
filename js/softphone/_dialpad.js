// Dialpad page
webphone_api._dialpad = (function ()
{

var chooseenginetouse = '';
var btn_isvoicemail = false; // if true, then dialpad button (in bottom-left corner) is handled as voicemail
var showfulldialpad = true; // if there are recents, then when searching and we have no results, don't show full dialpad


webphone_api.onAppStateChange(function (state)
{
    // Manage UI based on app state change events
    // For more details check the webphone_api.js and the documentation.
});

webphone_api.onRegStateChange(function (state, reason)
{
    // Manage UI based on registered(connected) state change events
    // For more details check the webphone_api.js and the documentation.
});

webphone_api.onCallStateChange(function (event, direction, peername, peerdisplayname, line, callid)
{
    // Manage UI based on registered(connected) state change events
    // For more details check the webphone_api.js and the documentation.
});

webphone_api.onCdr(function (called, connecttime, duration, direction, peerdisplayname, reason, line, callid)
{
    // Manage UI based on CDR(Call Detail Record) received
    // For more details check the webphone_api.js and the documentation.
});


function onCreate (event) // called only once - bind events here
{
    try{
    if(webphone_api.common.CanLog(4)) { webphone_api.common.PutToDebugLog(4, "EVENT, _dialpad: onCreate"); }
    
// navigation done with js, so target URL will not be displayed in browser statusbar
    webphone_api.$("#nav_dp_contacts").on("click", function()
    {
        webphone_api.$.mobile.changePage("#page_contactslist", { transition: "none", role: "page" });
    });
    webphone_api.$("#nav_dp_callhistory").on("click", function()
    {
        webphone_api.$.mobile.changePage("#page_callhistorylist", { transition: "none", role: "page" });
    });
    
    webphone_api.$("#nav_dp_dialpad").attr("title", webphone_api.stringres.get("hint_dialpad"));
    webphone_api.$("#nav_dp_contacts").attr("title", webphone_api.stringres.get("hint_contacts"));
    webphone_api.$("#nav_dp_callhistory").attr("title", webphone_api.stringres.get("hint_callhistory"));

    webphone_api.$("#status_dialpad").attr("title", webphone_api.stringres.get("hint_status"));
    webphone_api.$("#curr_user_dialpad").attr("title", webphone_api.stringres.get("hint_curr_user"));
    webphone_api.$(".img_encrypt").attr("title", webphone_api.stringres.get("hint_encicon"));
    webphone_api.$("#dialpad_not_btn").on("click", function()
    {
        webphone_api.common.SaveParameter('notification_count2', 0);
        webphone_api.common.ShowNotifications2(); // repopulate notifications (hide red dot number)
    });
    
    webphone_api.$("#phone_number").attr("title", webphone_api.stringres.get("hint_phone_number"));
    
    webphone_api.$("#phone_number").on('input', function() // input text on change listener
    {
        PhoneInputOnChange();
    });

    webphone_api.$("#btn_showhide_numpad").on("click", function()
    {
        try{
        if (btn_isvoicemail)
        {
            MenuVoicemail();
        }else
        {
            if (webphone_api.$('#dialpad_btn_grid').css('display') === 'none')
            {
                webphone_api.$('#dialpad_btn_grid').show();
            }else
            {
                webphone_api.$('#dialpad_btn_grid').hide();
            }

            MeasureDialPad();
        }
        
        } catch(err2) { webphone_api.common.PutToDebugLogException(2, "_dialpad: btn_showhide_numpad on click", err2); }
    });
    webphone_api.$("#btn_showhide_numpad").attr("title", webphone_api.stringres.get("hint_numpad"));
    
    webphone_api.$('#dialpad_list').on('click', '.ch_anchor', function(event)
    {
        OnListItemClick(webphone_api.$(this).attr('id'));
    });

    webphone_api.$('#dialpad_list').on('taphold', '.ch_anchor', function(event) // also show context menu
    {
        var id = webphone_api.$(this).attr('id');
        if (!webphone_api.common.isNull(id))
        {
            id = id.replace('recentitem_', 'recentmenu_');
            OnListItemClick(id, true);
        }
    });

    webphone_api.$('#dialpad_list').on('click', '.ch_menu', function(event)
    {
        OnListItemClick(webphone_api.$(this).attr('id'));
    });

    
    webphone_api.$("#btn_voicemail").on("click", function()
    {
        try{
        if (webphone_api.common.GetParameterInt('voicemail', 2) !== 2)
        {
            QuickCall();
        }else
        {
            var vmNumber = webphone_api.common.GetParameter("voicemailnum");

            if (!webphone_api.common.isNull(vmNumber) && vmNumber.length > 0)
            {
                StartCall(vmNumber);
            }else
            {
                webphone_api.common.SetVoiceMailNumber(function (vmnr)
                {
                    if (!webphone_api.common.isNull(vmnr) && vmnr.length > 0) { StartCall(vmnr); }
                });
            }
        }
        } catch(err2) { webphone_api.common.PutToDebugLogException(2, "_dialpad: btn_voicemail on click", err2); }
    });
    webphone_api.$("#btn_voicemail").attr("title", webphone_api.stringres.get("hint_voicemail"));
    
    var trigerred = false; // handle multiple clicks
    webphone_api.$("#btn_call").on("click", function()
    {
        webphone_api.common.PutToDebugLog(4, 'EVENT, dialpad call button clicked');
        if (trigerred) { return; }
    
        trigerred = true;
        setTimeout(function ()
        {
            trigerred = false;
        }, 1000);
    
//--         tunnel should not allow call without server address set (direct call to sip uri)
        if (webphone_api.common.GetParameter('serverinputisupperserver') === 'true')
        {
            if (webphone_api.common.isNull(webphone_api.common.GetSipusername()) || webphone_api.common.GetSipusername().length <= 0 ||
                    webphone_api.common.isNull(webphone_api.common.GetParameter('password')) || webphone_api.common.GetParameter('password').length <= 0 )
//--                || webphone_api.common.isNull(webphone_api.common.GetParameter('upperserver')) || webphone_api.common.GetParameter('upperserver').length <= 0)
            {
                return;
            }
        }
 
        var field = document.getElementById('phone_number');
        if ( webphone_api.common.isNull(field) ) { return; }
        
        var phoneNumber = field.value;
        var lastDialed = webphone_api.common.GetParameter("redial");

        if (webphone_api.common.isNull(phoneNumber) || phoneNumber.length < 1)
        {
            if (!webphone_api.common.isNull(lastDialed) && lastDialed.length > 0)
            {
                field.value = lastDialed;
            }else
            {
                webphone_api.common.PutToDebugLog(1, webphone_api.stringres.get('err_msg_3'));
                return;
            }
        }else
        {
            phoneNumber = webphone_api.common.Trim(phoneNumber);
            StartCall(phoneNumber);
            webphone_api.common.SaveParameter("redial", phoneNumber);
            webphone_api.$('#disprate_container').html('&nbsp;');
        }
    });
    
    webphone_api.$("#btn_call").attr("title", webphone_api.stringres.get("hint_btn_call"));

    // listen for enter onclick, and click Call button
    webphone_api.$( "#page_dialpad" ).keypress(function( event )
    {        
        HandleKeyPress(event);
    });

    // listen for control key, so we don't catch ctrl+c, ctrl+v
    webphone_api.$( "#page_dialpad" ).keydown(function(event)
    {
        try{
        var charCode = (event.keyCode) ? event.keyCode : event.which; // workaround for firefox
        
        if (charCode == ctrlKey) { ctrlDown = true; return true; }
        if (charCode == altKey) { altDown = true; return true; }
        if (charCode == shiftKey) { shiftDown = true; return true; }
        if (event.ctrlKey || event.metaKey || event.altKey) { specialKeyDown = true; return true; }

        if ( charCode === 8) // backspace
        {
//--            event.preventDefault();
            if (webphone_api.$('#phone_number').is(':focus') === false)
            {
                BackSpaceClick();
            }
        }
        else if ( charCode === 27) // ESC
        {
//--            event.preventDefault();
            webphone_api.$('#phone_number').val('');
        }
        else if ( charCode === 13)
        {
//--            event.preventDefault();
            if (webphone_api.$(".ui-page-active .ui-popup-active").length > 0)
            {
                var pop = webphone_api.$.mobile.activePage.find(".messagePopup");
                if (!webphone_api.common.isNull(pop) && (pop.attr("id") === 'adialog_videocall' || pop.attr("id") === 'adialog_screensharecall')) // initiate video call
                {
                    webphone_api.$('#adialog_positive').click();
                }
                return false;
            }
            webphone_api.$("#btn_call").click();
        }
        } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: keydown", err); }

    });//--.keyup(function(event)
//--    {
//--        try{
//--        var charCode = (event.keyCode) ? event.keyCode : event.which; // workaround for firefox

//--        if (charCode == ctrlKey) { ctrlDown = false; }
//--        if (charCode == altKey) { altDown = false; }
//--        if (charCode == shiftKey) { shiftDown = false; }
//--        if (event.ctrlKey || event.metaKey || event.altKey) { specialKeyDown = false; }
        
//--        return false;
//--        } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: keyup", err); }
//--    });

    webphone_api.$("#btn_message").on("click", function()
    {
            MsgOnClick();
    });
    webphone_api.$("#btn_message").attr("title", webphone_api.stringres.get("hint_message"));
    
//--    if (webphone_api.common.GetConfigInt('brandid', -1) === 60) // 101VOICEDT500
//--    {
//--        webphone_api.$("#btn_message_img").attr("src", '' + webphone_api.common.GetElementSource() + 'images/btn_voicemail_txt_big.png');
//--        webphone_api.$("#btn_message").attr("title", webphone_api.stringres.get("hint_voicemail"));
//--    }
//--     !!! DEPRECATED
//--    webphone_api.$("#dialpad_notification").on("click", function()
//--    {
//--        webphone_api.common.NotificationOnClick();
//--    });

    webphone_api.$('#dialpad_notification_list').on('click', '.nt_anchor', function(event)
    {
        webphone_api.$("#dialpad_not").panel( "close" );
        webphone_api.common.NotificationOnClick2(webphone_api.$(this).attr('id'), false);
    });
    webphone_api.$('#dialpad_notification_list').on('click', '.nt_menu', function(event)
    {
        webphone_api.$("#dialpad_not").panel( "close" );
        webphone_api.common.NotificationOnClick2(webphone_api.$(this).attr('id'), true);
    });
    
    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_dialpad')
        {
            MeasureDialPad();
        }
    });
    
    webphone_api.$('#dialpad_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_dialpad_menu").on("click", function() { CreateOptionsMenu('#dialpad_menu_ul'); });
    webphone_api.$("#btn_dialpad_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    
    setTimeout(function ()
    {
        var displaypopup = false;
        if (webphone_api.common.GetParameterBool('customizedversion', true) !== true && webphone_api.common.GetParameter('displaypopupdirectcalls') === 'true')
        {
//--         in this case we have to watch 'upperserver', NOT 'serveraddress_user'
//--            if (webphone_api.common.GetParameter('serverinputisupperserver') === 'true')
//--            {
                if ( webphone_api.common.isNull(webphone_api.common.GetSipusername()) || webphone_api.common.GetSipusername().length <= 0
                    || webphone_api.common.isNull(webphone_api.common.GetParameter('password')) || webphone_api.common.GetParameter('password').length <= 0 )
                {
                    displaypopup = true;
                }
//--            }else
//--            {
//--                if ((webphone_api.common.isNull(webphone_api.common.GetSipusername()) || webphone_api.common.GetSipusername().length <= 0
//--                    || webphone_api.common.isNull(webphone_api.common.GetParameter('password')) || webphone_api.common.GetParameter('password').length <= 0))
//--                {
//--                    if ((webphone_api.common.isNull(webphone_api.common.GetParameter('serveraddress_user')) || webphone_api.common.GetParameter('serveraddress_user').length <= 0)
//--                            && (webphone_api.common.isNull(webphone_api.common.GetParameter('serveraddress_orig')) || webphone_api.common.GetParameter('serveraddress_orig').length <= 0)
//--                            && (webphone_api.common.isNull(webphone_api.common.GetParameter('serveraddress')) || webphone_api.common.GetParameter('serveraddress').length <= 0))
//--                    {
//--                        displaypopup = true;
//--                    }
//--                }
//--            }
        }
        
        if (displaypopup)
        {
            webphone_api.common.SaveParameter('displaypopupdirectcalls', 'false');
//--            webphone_api.common.AlertDialog(webphone_api.stringres.get('warning'), webphone_api.stringres.get('warning_msg_1'));
            webphone_api.common.ShowToast(webphone_api.stringres.get('warning_msg_1'), 6000);
        }
    },3000);
    
    webphone_api.$("#btn_dp_1").on("tap", function()
    {
        PutNumber('1');
//--        webphone_api.common.AttendedPopupSDK();
//--        webphone_api.common.StartFCM(webphone_api.common.getuseengine());

//--        var nativeProperties = ["parent","opener","top","length","frames","closed","location","self","window","document","name","customElements","history","locationbar","menubar","personalbar","scrollbars","statusbar","toolbar","status","frameElement","navigator","origin","external","screen","innerWidth","innerHeight","scrollX","pageXOffset","scrollY","pageYOffset","visualViewport","screenX","screenY","outerWidth","outerHeight","devicePixelRatio","clientInformation","screenLeft","screenTop","defaultStatus","defaultstatus","styleMedia","onsearch","onwebkitanimationend","onwebkitanimationiteration","onwebkitanimationstart","onwebkittransitionend","isSecureContext","onabort","onblur","oncancel","oncanplay","oncanplaythrough","onchange","onclick","onclose","oncontextmenu","oncuechange","ondblclick","ondrag","ondragend","ondragenter","ondragleave","ondragover","ondragstart","ondrop","ondurationchange","onemptied","onended","onerror","onfocus","onformdata","oninput","oninvalid","onkeydown","onkeypress","onkeyup","onload","onloadeddata","onloadedmetadata","onloadstart","onmousedown","onmouseenter","onmouseleave","onmousemove","onmouseout","onmouseover","onmouseup","onmousewheel","onpause","onplay","onplaying","onprogress","onratechange","onreset","onresize","onscroll","onseeked","onseeking","onselect","onstalled","onsubmit","onsuspend","ontimeupdate","ontoggle","onvolumechange","onwaiting","onwheel","onauxclick","ongotpointercapture","onlostpointercapture","onpointerdown","onpointermove","onpointerup","onpointercancel","onpointerover","onpointerout","onpointerenter","onpointerleave","onselectstart","onselectionchange","onanimationend","onanimationiteration","onanimationstart","ontransitionend","onafterprint","onbeforeprint","onbeforeunload","onhashchange","onlanguagechange","onmessage","onmessageerror","onoffline","ononline","onpagehide","onpageshow","onpopstate","onrejectionhandled","onstorage","onunhandledrejection","onunload","performance","stop","open","alert","confirm","prompt","print","queueMicrotask","requestAnimationFrame","cancelAnimationFrame","captureEvents","releaseEvents","requestIdleCallback","cancelIdleCallback","getComputedStyle","matchMedia","moveTo","moveBy","resizeTo","resizeBy","scroll","scrollTo","scrollBy","getSelection","find","webkitRequestAnimationFrame","webkitCancelAnimationFrame","fetch","btoa","atob","setTimeout","clearTimeout","setInterval","clearInterval","createImageBitmap","close","focus","blur","postMessage","onappinstalled","onbeforeinstallprompt","crypto","indexedDB","webkitStorageInfo","sessionStorage","localStorage","chrome","onpointerrawupdate","speechSynthesis","webkitRequestFileSystem","webkitResolveLocalFileSystemURL","openDatabase","applicationCache","caches","ondevicemotion","ondeviceorientation","ondeviceorientationabsolute","ListGlobalVars"];
//--        for (var key in window)
//--        {
//--            if (nativeProperties.indexOf(key.toString()) >= 0) continue;
//--            if (window.hasOwnProperty(key))
//--            {
//--                console.log(key);
//--            }
//--        }

//--        webphone_api.common.WinAPI('API_TestEncoded', function (val_in)
//--        {
//--            var val = val_in;
//--            if (webphone_api.common.isNull(val)) { val = ''; }   val = webphone_api.common.Trim(val);
//--            if (val.indexOf('_BASE64_') === 0)
//--            {
//--                val = webphone_api.common.B64Dec(val);
//--                if (webphone_api.common.isNull(val)) { val = ''; }
//--                val = webphone_api.common.Trim(val);
//--            }
//--            console.log('API_TestEncoded answer_ORIG: ' + val_in)
//--            console.log('API_TestEncoded answer: ' + val)
//--            alert('API_TestEncoded answer: ' + val);
//--        });

//--webphone_api.common.TestCookie();

//-- * start: int - 1 for start or 0 to stop the playback, -1 to pre-cache
//-- * file: String - file name or full path
//-- * looping: int - 1 to repeat, 0 to play once
//-- * async: boolean - false if no, true if playback should be done in a separate tmhread (only 0 can be used only for local playback, not for streaming)
//-- * islocal: boolean - true if the file have to be read from the client PC file system. False if remote file (for example if the file is on the webserver)
//-- * toremotepeer: boolean - stream the playback to the connected peer
//-- * line: int -used with toremotepeer if there are multiple calls in progress to specify the call (usually set to -1 for the current call if any)
//-- * audiodevice: String - you can specify an exact device for playback. Otherwise set it to empty string
//-- * isring: boolean - whether this sound is a ringtone/ringback

//--webphone_api.playsound(1, 'playsound1.wav',0 , false, false, false, 1, '', false);
        
//--        if (webphone_api.global.isdebugversion)
//--        {
//--            webphone_api.common.UriParser(webphone_api.common.GetParameter('creditrequest'), '', '', '', '', 'creditrequest');
            
//--            var balanceuri = 'http://88.150.183.87:80/mvapireq/?apientry=balance&authkey=1568108345&authid=9999&authmd5=760e4155f1f1c8e614664e20fff73290&authsalt=123456&now=415';
//--            webphone_api.common.UriParser(balanceuri, '', '', '', '', 'creditrequest');
//--        }
       
    });
    webphone_api.$("#btn_dp_2").on("tap", function()
    {
//--        webphone_api.playsound(1, 'playsound2.wav',0 , false, false, false, 1, '', false);
        PutNumber('2');
    });
    webphone_api.$("#btn_dp_3").on("tap", function()
    {
        PutNumber('3');
    });
    webphone_api.$("#btn_dp_4").on("tap", function()
    {
        PutNumber('4');
    });
    webphone_api.$("#btn_dp_5").on("tap", function()
    {
        PutNumber('5');
    });
    webphone_api.$("#btn_dp_6").on("tap", function()
    {
        PutNumber('6');
    });
    webphone_api.$("#btn_dp_7").on("tap", function()
    {
        PutNumber('7');
    });
    webphone_api.$("#btn_dp_8").on("tap", function()
    {
        PutNumber('8');
    });
    webphone_api.$("#btn_dp_9").on("tap", function()
    {
        PutNumber('9');
    });
    webphone_api.$("#btn_dp_0").on("tap", function(evt)
    {
        PutNumber('0');
    });
    webphone_api.$("#btn_dp_ast").on("tap", function()
    {
        PutNumber('*');
    });
    webphone_api.$("#btn_dp_diez").on("tap", function()
    {
        PutNumber('#');
    });
    
// long cliks
    webphone_api.$("#btn_dp_0").on("taphold", function(evt)
    {
        PutCharLongpress(['+']);
    });

    
    webphone_api.$("#btn_backspace").on("click", function()
    {
        BackSpaceClick();
    });
    
    webphone_api.$("#btn_backspace").on("taphold", function()
    {
        if (!webphone_api.common.isNull( document.getElementById('phone_number') ))
        {
            document.getElementById('phone_number').value = '';
        }
        
        PhoneInputOnChange();
    });
    var cthemeTmp = webphone_api.common.GetColortheme();
    if (cthemeTmp === 11 || cthemeTmp === 22 || cthemeTmp === 23)
    {
        webphone_api.$("#btn_backspace_img").attr("src",webphone_api.common.GetElementSource() + 'images/btn_backspace_txt_grey.png');
    }
    if (cthemeTmp === 22)
    {
        webphone_api.$("#btn_message_img").attr("src",webphone_api.common.GetElementSource() + 'images/icon_message_grey.png');
        webphone_api.$("#dp_btn_call_txt").attr("src",webphone_api.common.GetElementSource() + 'images/btn_call_txt_green.png');
    }
    
    
    setTimeout(function ()
    {
        webphone_api.common.GetContacts(function (success)
        {
            if (!success)
            {
                webphone_api.common.PutToDebugLog(2, 'EVENT, _dialpad: LoadContacts failed onCreate');
            }
        });
    }, 500);
    
    setTimeout(function ()
    {
        webphone_api.common.ReadCallhistoryFile(function (success)
        {
            if (!success)
            {
                webphone_api.common.PutToDebugLog(2, 'EVENT, _dialpad: load call history failed onCreate');
            }
        });
    }, 1000);
    
    var advuri = webphone_api.common.GetParameter('advertisement');
    if (!webphone_api.common.isNull(advuri) && advuri.length > 5)
    {
        webphone_api.$('#advert_dialpad_frame').attr('src', advuri);
        webphone_api.$('#advert_dialpad').show();
    }
    
    if (webphone_api.common.UsePresence2() === true)
    {
        webphone_api.$("#dialpad_additional_header_left").on("click", function()
        {
            webphone_api.common.PresenceSelector('dialpad');
        });
        webphone_api.$("#dialpad_additional_header_left").css("cursor", "pointer");
    }

// showratewhiletype = 0; // show rating on dialpad page, while typing the destination number  // 0=no, 1=yes
    var srateStr = webphone_api.common.GetConfig('showratewhiletype');
    if (webphone_api.common.isNull(srateStr) || srateStr.length < 1 || !webphone_api.common.IsNumber(srateStr)) { srateStr = webphone_api.common.GetParameter2('showratewhiletype'); }
    if (webphone_api.common.isNull(srateStr) || srateStr.length < 1 || !webphone_api.common.IsNumber(srateStr)) { srateStr = '0'; }
    webphone_api.global.showratewhiletype_cache = webphone_api.common.StrToInt(srateStr);
    
    if (webphone_api.global.showratewhiletype_cache > 0 && !webphone_api.common.isNull(document.getElementById("disprate_container")) && webphone_api.common.GetParameter('ratingrequest').length > 0)
    {
        document.getElementById("disprate_container").style.display = 'block';
    }

    
//--     in IE8 under WinXP aterisk is not displayed properly
//--    if (webphone_api.common.IsIeVersion(8))
//--    {
//--        webphone_api.$("#dialpad_asterisk").html("*");
//--    }
    
    webphone_api.$("#btn_dialpad_engine_close").on("click", function(event)
    {
        webphone_api.common.SaveParameter('ignoreengineselect', 'true');

        webphone_api.$('#settings_engine').hide();
        webphone_api.$('#dialpad_engine').hide();
        
        MeasureDialPad();
    });
    
    webphone_api.$("#btn_dialpad_engine").on("click", function(event)
    {
        webphone_api.common.SaveParameter('ignoreengineselect', 'true');

        webphone_api.$('#settings_engine').hide();
        webphone_api.$('#dialpad_engine').hide();
        
        if (webphone_api.common.isNull(chooseenginetouse) || chooseenginetouse.length < 1) { return; }
        MeasureDialPad();
        
// handle click action based on selected engine
        if (chooseenginetouse === 'java'){ ; }
        else if (chooseenginetouse === 'webrtc') { webphone_api.common.EngineSelect(1,26); }
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
            ;
        }

// save clicked engine
        var engine = webphone_api.common.GetEngine(chooseenginetouse);
        if (!webphone_api.common.isNull(engine))
        {
            engine.clicked = 2;
            webphone_api.common.SetEngine(chooseenginetouse, engine);
            
            webphone_api.common.OpenSettings(true, 12);
            
            // wait for settings to launch
            setTimeout(function ()
            {
                webphone_api.common.ShowToast(webphone_api.common.GetEngineDisplayName(chooseenginetouse) + ' ' + webphone_api.stringres.get('ce_use'), function ()
                {
                    webphone_api.common.ChooseEngineLogic2(chooseenginetouse);
                    chooseenginetouse = '';
                });
            }, 400);
        }
    });
        
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: onCreate", err); }
}

var putnr_lasttick = 0;
function PutNumber(val)
{
    try{
    var nrfield = document.getElementById('phone_number');
    var NOW = webphone_api.common.GetTickCount();
    if (NOW > 0 && NOW - putnr_lasttick < 100)
    {
        return;
    }
    
    putnr_lasttick = NOW;

    if (webphone_api.$('#phone_number').is(':focus')) // don't write any characters, if input is focused
    {
        return;
    }
    
    if ( webphone_api.common.isNull(nrfield) ) { return; }
    
    if ( webphone_api.common.isNull(nrfield.value) ) { nrfield.value = ''; }
    
    nrfield.value = nrfield.value + val;
    
    var nrval = nrfield.value;
    if (webphone_api.common.isNull(nrval)) { nrval = ''; }
    nrval = webphone_api.common.ReplaceAll(nrval, '+', '');
    nrval = webphone_api.common.ReplaceAll(nrval, '*', '');
    nrval = webphone_api.common.ReplaceAll(nrval, '#', '');
    if (!webphone_api.common.isNull(val) && webphone_api.common.IsNumber(val) && webphone_api.common.IsNumber(nrval))
    {
        webphone_api.common.PlayDtmfSound(val);
    }
    
    issearch = false;
    PhoneInputOnChange();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: PutNumber", err); }
}

function PutCharLongpress(carr) // handle dialpad long press (taphold)
{
    try{
    var nrfield = document.getElementById('phone_number');
    if ( webphone_api.common.isNull(nrfield) ) { return; }
    
    if ( webphone_api.common.isNull(nrfield.value) ) { nrfield.value = ''; }
    if (webphone_api.common.isNull(carr) || carr.length < 1) { return; }
    
    if (carr.length === 1)
    {
        nrfield.value = nrfield.value + carr[0];
        return;
    }
//--    !!! NOT IMPLEMENTED YET
//-- show popup with letter options, just like in android
//--    ...
    issearch = false;
    PhoneInputOnChange();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: PutCharLongpress", err); }
}

var showratewhiletype_minlenth = -1;
var showratewhiletype_maxlenth = -1;
var issearch = true;
function PhoneInputOnChange()
{
    try{
    var field = document.getElementById('phone_number');
    var nrval = '';
    
    if (webphone_api.common.isNull(field) || webphone_api.common.isNull(field.value))
    {
        return;
    }
    
    nrval = field.value;
    
    if (nrval.length > 0)
    {
        webphone_api.$("#btn_backspace").show();
    
    // so phone number text will be centered
        webphone_api.$("#phone_number_container .ui-input-text").css("text-align", "center");
        webphone_api.$("#phone_number_container .ui-input-text:focus").css("text-align", "center");
    }else
    {
        webphone_api.$("#btn_backspace").hide();
    // so cursor will blink on the left
        webphone_api.$("#phone_number_container .ui-input-text").css("text-align", "left");
        webphone_api.$("#phone_number_container .ui-input-text:focus").css("text-align", "left");
        issearch = true;
    }
    
    nrval = webphone_api.common.Trim(nrval);
    
    var dialpadvisible = false;
    if (webphone_api.$('#dialpad_btn_grid').is(':visible'))
    {
        dialpadvisible = true;
    }
    
    if (issearch && nrval.length > 0 && !webphone_api.common.isNull(webphone_api.global.ctlist) && webphone_api.global.ctlist.length > 0)
    {
        PopulateListContacts(nrval);
    }else
    {
        PopulateListRecents();
    }
    
    if (dialpadvisible) // if dialpad was visible, then dn't hide it after PopulateList
    {
        webphone_api.$('#dialpad_btn_grid').show();
        MeasureDialPad();
    }
    
// showratewhiletype = 0; // show rating on dialpad page, while typing the destination number  // 0=no, 1=yes
    if (webphone_api.global.showratewhiletype_cache > 0 && webphone_api.common.GetParameter('ratingrequest').length > 0)
    {
        if (showratewhiletype_minlenth < 0)
        {
            var srmin = webphone_api.common.GetParameter2('showratewhiletype_minlenth');
            if (!webphone_api.common.isNull(srmin) && webphone_api.common.IsNumber(srmin))
            {
                showratewhiletype_minlenth = webphone_api.common.StrToInt(srmin);
            }else
            {
                showratewhiletype_minlenth = 3;
            }
            var srmax = webphone_api.common.GetParameter2('showratewhiletype_maxlenth');
            if (!webphone_api.common.isNull(srmax) && webphone_api.common.IsNumber(srmax))
            {
                showratewhiletype_maxlenth = webphone_api.common.StrToInt(srmax);
            }else
            {
                showratewhiletype_maxlenth = 6;
            }
        }
        
        if (nrval.length >= showratewhiletype_minlenth && nrval.length <= showratewhiletype_maxlenth)
        {
            webphone_api.common.UriParser(webphone_api.common.GetParameter('ratingrequest'), '', nrval, '', '', 'getrating');
//--            var datain = '{"data":{"0":{"prefix":"4075","voice_rate":"0.30","description":"ROMANIA - MOBILE ORANGE"},"currency":"USD","currency_sign":"$"},"error":""}';
//--            webphone_api.common.HttpResponseHandler(datain, 'getrating');
        }else
        {
            webphone_api.$('#disprate_container').html('&nbsp;');
        }
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: PhoneInputOnChange", err); }
}

function BackSpaceClick()
{
    try{
    var field = document.getElementById('phone_number');

    if ( webphone_api.common.isNull(field) || webphone_api.common.isNull(field.value) || field.value.length < 1 ) { return; }

    field.value = (field.value).substring(0, field.value.length - 1);

    PhoneInputOnChange();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: BackSpaceClick", err); }
}

var ctrlDown = false;
var altDown = false;
var shiftDown = false;
var specialKeyDown = false;
var ctrlKey = 17, vKey = 86, cKey = 67, altKey = 18, shiftKey = 16;
function HandleKeyPress(event)
{
    try{
//-- don't catch input if a popup is open, because popups can have input boxes, and we won't be able to write into them
    if (webphone_api.$(".ui-page-active .ui-popup-active").length > 0)
    {
         return false;
    }
    
    var charCode = (event.keyCode) ? event.keyCode : event.which; // workaround for firefox

    // listen for control key, so we don't catch ctrl+c, ctrl+v
    if (ctrlDown || altDown || shiftDown || specialKeyDown || charCode === 8)
    {
        return false;
    }
    
//--    if ( charCode === 8) // backspace
//--    {
//--        event.preventDefault();
//--        BackSpaceClick();
//--    }
//--    else if ( charCode === 13)
//--    {
//--        event.preventDefault();
//--        webphone_api.$("#btn_call").click();
//--    }else
//--    {
//--        event.preventDefault();
        PutNumber(String.fromCharCode(charCode));
//--    }

    return false;
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: HandleKeyPress", err); }
}
        
function StartCall(number, isvideo)
{
    try{
    if (webphone_api.common.isNull(number) || number.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, "EVENT, _dialpad: StartCall number is NULL");
        return;
    }
    
    number = webphone_api.common.NormalizeNumber(number);
    
    if (isvideo === true)
    {
        webphone_api.common.PutToDebugLog(4, 'EVENT, _dialpad initiate video call to: ' + number);
        webphone_api.videocall(number);
    }else
    {
        webphone_api.common.PutToDebugLog(4, 'EVENT, _dialpad initiate call to: ' + number);
        webphone_api.call(number, -1);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: StartCall", err); }
}

function QuickCall()
{
    try{
    var popupWidth = webphone_api.common.GetDeviceWidth();
    if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
    {
        popupWidth = Math.floor(popupWidth / 1.2);
    }else
    {
        popupWidth = 220;
    }
    
    var template = '' +
'<div id="quickcall_popup" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('quickcall_title') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content">' +
        '<span>' + webphone_api.stringres.get('quickcall_msg') + '</span>' +
        '<input type="text" id="quickcall_input" name="setting_item" data-theme="a" autocapitalize="off"/>' +
    '</div>' +
    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" id="adialog_positive" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_quickcall') + '</a>' +
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

    var textBox = document.getElementById('quickcall_input');

    if (!webphone_api.common.isNull(textBox)) { textBox.focus(); } // setting cursor to text input

    webphone_api.$('#adialog_positive').on('click', function (event)
    {
        webphone_api.$( '#quickcall_popup' ).on( 'popupafterclose', function( event )
        {
            webphone_api.common.PutToDebugLog(5,"EVENT, _dialpad SetVoiceMailNumber OK click");

            var qnr = '';
            if (!webphone_api.common.isNull(textBox)) { qnr = textBox.value; }

            if (!webphone_api.common.isNull(qnr) && qnr.length > 0)
            {
                qnr = webphone_api.common.Trim(qnr);

                if (qnr.length > 0)
                {
                    StartCall(qnr);
                }
            }
        });
    });
    
    
    
//--    webphone_api.$.mobile.activePage.find(".messagePopup").popup().popup("open").bind(
//--    {
//--        popupafterclose: function ()
//--        {
//--            webphone_api.$(this).unbind("popupafterclose").remove();
            
//--            webphone_api.$('#log_window_ul').off('click', 'li');
//--            popupafterclose();
//--        }
//--    });
//--    webphone_api.$('#log_window_ul').on('click', 'li', function(event)
//--    {
//--        var itemid = webphone_api.$(this).attr('id');
//--        webphone_api.$( '#quickcall_popup' ).on( 'popupafterclose', function( event )
//--        {
    
    webphone_api.$('#adialog_negative').on('click', function (event)
    {
        ;
    });
        
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: QuickCall", err); }
}

function onStart(event)
{
    var lastoop = 0;
    try{
        lastoop = 1;
        if(webphone_api.common.CanLog(4)) { webphone_api.common.PutToDebugLog(4, "EVENT, _dialpad: onStart"); }
    
    if (webphone_api.common.HideSettings('page_contacts', '', 'page_contacts', true))
    {
        lastoop = 2;
        webphone_api.$("#li_nav_dp_ct").remove();
        var count = webphone_api.$("#ul_nav_dp").children().length;
        var tabwidth = Math.floor(100 / count);
        
        webphone_api.$('#ul_nav_dp').children('li').each(function ()
        {
            webphone_api.$(this).css('width', tabwidth + '%');
        });
        
        if (count < 2)
        {
            webphone_api.$('#ul_nav_dp').remove();
            MeasureDialPad();
        }
    }
    if (webphone_api.common.HideSettings('page_history', '', 'page_history', true))
    {
        lastoop = 3;
        webphone_api.$("#li_nav_dp_ch").remove();
        var count = webphone_api.$("#ul_nav_dp").children().length;
        var tabwidth = Math.floor(100 / count);
        
        webphone_api.$('#ul_nav_dp').children('li').each(function ()
        {
            webphone_api.$(this).css('width', tabwidth + '%');
        });
        
        if (count < 2)
        {
            webphone_api.$('#ul_nav_dp').remove();
            MeasureDialPad();
        }
    }

        lastoop = 4;
    
    if (webphone_api.global.pagewasrefreshed === true)
    {
        webphone_api.common.PutToDebugLog(4, "EVENT, _dialpad: onStart page refresh detected, go back to settings page");
        webphone_api.common.OpenSettings(false, 13);
        return;
    }
    
    if (!webphone_api.common.isNull(document.getElementById('status_dialpad')) && webphone_api.global.dploadingdisplayed === false)
    {
        webphone_api.global.dploadingdisplayed = true;
        document.getElementById('status_dialpad').innerHTML = webphone_api.stringres.get('loading');
        webphone_api.common.PutToDebugLogSpecial(1, 'EVENT, _dialpad: onStart display Loading...', false, '');
    }
    
    webphone_api.global.isDialpadStarted = true;
        lastoop = 5;
    
    webphone_api.common.HideModalLoader();
    
//--    setTimeout(function );

//--!!DEPERECATED 
//--    ShowNativePluginOption();
//-- THIS TYPE OF HEADER NOTIFICATION IS NOT NEEDED ON DIALPAD -> check push level comments
//--    webphone_api.common.ShowEngineOptionOnPage(function (msg, enginetouse)
//--    {
//--        if (webphone_api.common.isNull(msg) || msg.length < 1 || webphone_api.common.isNull(enginetouse) || enginetouse.length < 1) { return; }
//--        if (enginetouse !== 'java' && enginetouse !== 'webrtc' && enginetouse !== 'ns' && enginetouse !== 'flash' && enginetouse !== 'app')
//--        {
//--            return;
//--        }
        
//--        webphone_api.$('#dialpad_engine').show();
//--        webphone_api.$('#dialpad_engine_title').html(webphone_api.stringres.get('choose_engine_title'));
//--        webphone_api.$('#dialpad_engine_msg').html(msg);
        
//--        if (enginetouse === 'java')
//--        {
//--            var javainstalled = webphone_api.common.IsJavaInstalled(); // 0=no, 1=installed, but not enabled in browser, 2=installed and enabled

//--            if (javainstalled === 0)
//--            {                
//--                webphone_api.$('#btn_dialpad_engine').attr('href', webphone_api.global.INSTALL_JAVA_URL);
//--            }
//--            else if (javainstalled === 1)
//--            {
//--                if (webphone_api.common.GetBrowser() === 'MSIE') // can't detect if installed or just not allowed
//--                {
//--                    webphone_api.$('#btn_dialpad_engine').attr('href', webphone_api.global.INSTALL_JAVA_URL);
//--                }else
//--                {
//--                    webphone_api.$('#btn_dialpad_engine').attr('href', webphone_api.global.ENABLE_JAVA_URL);
//--                }
//--            }
//--        }
//--        else if (enginetouse === 'webrtc')
//--        {
//--            ;
//--        }
//--        else if (enginetouse === 'ns')
//--        {
//--            webphone_api.$('#btn_dialpad_engine').attr('href', webphone_api.common.GetNPLocation());
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
        
//--        MeasureDialPad();
//--    });

    webphone_api.$("#phone_number").attr("placeholder", webphone_api.stringres.get("phone_nr"));
//BRANDSTART
    if (webphone_api.common.GetConfigInt('brandid', -1) === 50) // favafone
    {
        webphone_api.$("#phone_number").attr("placeholder", webphone_api.stringres.get("phone_nr2"));
    }

    else if (webphone_api.common.GetConfigInt('brandid', -1) === 60) // voipmuch
    {
        webphone_api.$("#phone_number").attr("placeholder", "Enter # or Contact Name");
        webphone_api.$("#phone_number_container .ui-input-text").css("font-size", "1.2em");
        webphone_api.$("#phone_number_container .ui-input-text:focus").css("font-size", "1.2em");
    }
//BRANDEND
    webphone_api.$("#btn_backspace").hide();
    webphone_api.$('#disprate_container').html('&nbsp;');

    if (webphone_api.common.GetColortheme() === 22)
    {
        webphone_api.$("#nav_dp_dialpad IMG").attr("src", "images/tab_dialpad_blue.png");
        webphone_api.$("#nav_dp_contacts IMG").attr("src", "images/tab_contacts_grey.png");
        webphone_api.$("#nav_dp_callhistory IMG").attr("src", "images/tab_callog_grey.png");
    }
    
    if (!webphone_api.common.isNull(document.getElementById("app_name_dialpad"))
        && webphone_api.common.GetParameter('devicetype') !== webphone_api.common.DEVICE_WIN_SOFTPHONE())
    {
        document.getElementById("app_name_dialpad").innerHTML = webphone_api.common.GetBrandName();
    }
    
    if (!webphone_api.common.isNull(document.getElementById('dialpad_title')))
    {
        document.getElementById('dialpad_title').innerHTML = webphone_api.stringres.get('dialpad_title');
    }
    webphone_api.$("#dialpad_title").attr("title", webphone_api.stringres.get("hint_page"));

        lastoop = 6;

    var curruser = webphone_api.common.GetCallerid();
    if (!webphone_api.common.isNull(curruser) && curruser.length > 0 && curruser != webphone_api.$('#curr_user_dialpad').html()) { webphone_api.$('#curr_user_dialpad').html(curruser); }
    /*
// set status width so it's uses all space to curr_user
    var usernamedisplaywidth =  webphone_api.$('#curr_user_dialpad').width();
    if(usernamedisplaywidth.length < 20) usernamedisplaywidth = 20;
    else if(usernamedisplaywidth.length > 190) usernamedisplaywidth = 190;
    var statwidth = webphone_api.common.GetDeviceWidth() -  usernamedisplaywidth - 50; //25
    if(statwidth < 30) statwidth = 30;
    else if(statwidth > 220) statwidth = 220;
    if (!webphone_api.common.isNull(statwidth) && webphone_api.common.IsNumber(statwidth))
    {
        webphone_api.$('#status_dialpad').width(statwidth);
    }
    */

    
//--autoprov: if no voicemail - then fast call: text input number to call
    if (webphone_api.common.GetParameterInt('voicemail', 2) !== 2)
    {
        webphone_api.$('#btn_voicemail_img').attr('src', '' + webphone_api.common.GetElementSource() + 'images/btn_call_quick_txt.png');
        webphone_api.$("#btn_voicemail").attr("title", webphone_api.stringres.get("hint_quickcall"));
    }else
    {
        webphone_api.$('#btn_voicemail_img').attr('src', '' + webphone_api.common.GetElementSource() + 'images/btn_voicemail_txt.png');
        webphone_api.$("#btn_voicemail").attr("title", webphone_api.stringres.get("hint_voicemail"));
    }
    
    if ((webphone_api.common.GetParameter('header')).length > 2)
    {
        webphone_api.$('#headertext_settings').show();
        webphone_api.$('#headertext_settings').html(webphone_api.common.GetParameter('header'));
    }else
    {
        webphone_api.$('#headertext_settings').hide();
    }
    if ((webphone_api.common.GetParameter('footer')).length > 2)
    {
        webphone_api.$('#footertext_dialpad').show();
        webphone_api.$('#footertext_dialpad').html(webphone_api.common.GetParameter('footer'));
    }else
    {
        webphone_api.$('#footertext_dialpad').hide();
    }
//BRANDSTART
    if (webphone_api.common.GetConfigInt('brandid', -1) === 50) //--Favafone
    {
        webphone_api.$("#btn_message_img").attr("src", '' + webphone_api.common.GetElementSource() + 'images/icon_recharge_dollar.png');
    }
//BRANDEND

        lastoop = 7;

    setTimeout(function ()
    {
        webphone_api.common.CanShowLicKeyInput();
    }, 3500);
    
    webphone_api.common.CheckInternetConnection();
    webphone_api.common.ShowNotifications2();
    GetCallhistory();
        lastoop = 8;
    
// handle hidesettings
    if ((webphone_api.common.HideSettings('chat', webphone_api.stringres.get('sett_display_name_' + 'chat'), 'chat', true) === true || webphone_api.common.GetParameterInt('chatsms', 0) == 3 || webphone_api.common.GetParameterInt('textmessaging', -1) == 0 || webphone_api.common.GetParameterInt('textmessaging', -1) == 2)
//BRANDSTART
        && webphone_api.common.GetConfigInt('brandid', -1) !== 60 // 101VOICEDT500
//BRANDEND
    )
    {
        webphone_api.$('#btn_message button').hide();
    }
    if (webphone_api.common.HideSettings('voicemail', webphone_api.stringres.get('sett_display_name_' + 'voicemail'), 'voicemail', true) === true)
    {
        if (btn_isvoicemail === true)
        {
            webphone_api.$('#btn_showhide_numpad button').hide();
        }else
        {
            webphone_api.$('#btn_showhide_numpad button').show();
        }
    }
    
//BRANDSTART
    if (webphone_api.common.GetConfigInt('brandid', -1) === 58) //-- enikma
    {
        var logodiv = document.getElementById('app_name_dialpad');
        if (!webphone_api.common.isNull(logodiv))
        {
            var middle = document.getElementById('dialpad_title');
            logodiv.style.display = 'inline';
            if (!webphone_api.common.isNull(middle)) { middle.style.display = 'none'; }
            document.getElementById('dialpad_additional_header_left').style.width = '65%';
            logodiv.innerHTML = '<img src="' + webphone_api.common.GetElementSource() + 'images/logo.png" style="border: 0;">&nbsp;&nbsp;&nbsp;<div class="adhead_custom_brand" style=""><b>eNikMa</b> Unified Comm</div>';
        }
    }
//BRANDEND

        lastoop = 9;
// don't display Voicemail if we have custom menus 
    var custm_uri = webphone_api.common.GetParameter('menu_url');
    if (!webphone_api.common.isNull(custm_uri) || custm_uri.length > 3)
    {
        btn_isvoicemail = false;

        if (webphone_api.common.GetColortheme() === 22)
        {
            webphone_api.$("#btn_showhide_numpad_img").attr("src",webphone_api.common.GetElementSource() + 'images/btn_numpad_txt_grey.png');
        }else
        {
            webphone_api.$("#btn_showhide_numpad_img").attr("src", '' + webphone_api.common.GetElementSource() + 'images/btn_numpad_txt.png');
        }
        webphone_api.$("#btn_showhide_numpad").attr("title", webphone_api.stringres.get("hint_numpad"));
    }

        lastoop = 10;
    
    MeasureDialPad();
    
    setTimeout(function ()
    {
//--    if (!webphone_api.global.isdebugversion) { webphone_api.common.StartPresence2(); }
        webphone_api.common.StartPresence2();
    }, 2500);
    
    if (webphone_api.common.IsIeVersion(10)) { webphone_api.$("#dialpad_list").children().css('line-height', 'normal'); }
    if (webphone_api.common.IsIeVersion(10)) { webphone_api.$("#dialpad_notification_list").children().css('line-height', 'normal'); }
    webphone_api.$("#dialpad_notification_list").height(webphone_api.common.GetDeviceHeight() - 55);
        lastoop = 11;
    
    webphone_api.common.ShowOfferSaveContact();
//--    HandleAutoaction();
    
    var pnr = document.getElementById('phone_number');
    if (!webphone_api.common.isNull(pnr) && webphone_api.common.GetOs() !== 'Android' && webphone_api.common.GetOs() !== 'iOS') { pnr.focus(); }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: onStart "+lastoop, err); }
}

function GetCallhistory()
{
    try{
    if ((webphone_api.common.isNull(webphone_api.global.chlist) || webphone_api.global.chlist.length < 1) && webphone_api.global.readcallhistoryforrecents)
    {
        webphone_api.common.ReadCallhistoryFile(function (success)
        {
            if (!success)
            {
                webphone_api.common.PutToDebugLog(2, 'EVENT, _dialpad: load call history failed (2) GetCallhistory');
            }
            
            PopulateListRecents();
        });

//also read contacts in background
        setTimeout(function ()
        {
            webphone_api.common.GetContacts(function (success)
            {
                if (!success)
                {
                    if(webphone_api.common.CanLog(2)) { webphone_api.common.PutToDebugLog(2, 'EVENT, _dialpad: LoadContacts failed GetCallhistory'); }
                }
            });
        }, 1000);
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: GetCallhistory", err); }

    PopulateListRecents();
}

var month = new Array();
month[0] = 'Jan';
month[1] = 'Feb';
month[2] = 'Mar';
month[3] = 'Apr';
month[4] = 'May';
month[5] = 'Jun';
month[6] = 'Jul';
month[7] = 'Aug';
month[8] = 'Sep';
month[9] = 'Oct';
month[10] = 'Nov';
month[11] = 'Dec';

// points for recents list
var LAST_CALLED = 1200;
var IS_ONLINE = 100;
var LAST_HOUR = 70;
var LAST_5HOURS = 50;
var LAST_DAY = 40;
var LAST_WEEK = 30;
var LAST_MONTH = 20;
var LAST_3MONTHS = 10;
var LAST_YEAR = 3;
var OUTGOING_CALL = 10;
var IS_CONTACT = 5; // if can be found in contacts list
var FAVORITE = 1.4; // multiply by
var IS_BLOCKED = 10; // divide by this value

function GetRecents()
{
    var enablepres = false;
    var presencequery = [];
    try{
    if (webphone_api.common.isNull(webphone_api.global.chlist) || webphone_api.global.chlist.length < 1 || (webphone_api.global.refreshrecents === false && webphone_api.global.recentlist.length > 0))
    {
        return;
    }
    
    if (webphone_api.common.UsePresence2() === true)
    {
        enablepres = true;
    }
    
    var chtmp = [];
    var rectmp = [];
    
    if (webphone_api.global.chlist.length > 500)
    {
        chtmp = webphone_api.global.chlist.slice(0, 499);
    }else
    {
        chtmp = webphone_api.global.chlist;
    }
    
    if (webphone_api.common.isNull(chtmp) || chtmp.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _dialpad: GetRecents list is NULL');
        return;
    }
    
    var now = webphone_api.common.GetTickCount();
    
    for (var i = 0; i < chtmp.length; i++)
    {
        if (webphone_api.common.isNull(chtmp[i])) { continue; }
        
        var item = chtmp[i];
        if (webphone_api.common.isNull(item[webphone_api.common.CH_NUMBER]) || item[webphone_api.common.CH_NUMBER].length < 1) { continue; }
        
        if (webphone_api.common.IsContactBlocked(item[webphone_api.common.CH_NUMBER], null) === true) { continue; }

// calculating points
        var points = 0;
        var dateint = 0;
        try{
            dateint = webphone_api.common.StrToInt( webphone_api.common.Trim(item[webphone_api.common.CH_DATE]) );
        
        } catch(errin1) { webphone_api.common.PutToDebugLogException(2, "_dialpad: GetRecents convert duration", errin1); }
        
        var diff = now - dateint;
        
        if (diff > 0)
        {
            if (rectmp.length === 0) // means it's the last call
            {
                points = points + LAST_CALLED;
            }
            else if (diff < 3600000) // less then an hour
            {
                points = points + LAST_HOUR;
            }
            else if (diff < 18000000) // less then 5 hours
            {
                points = points + LAST_5HOURS;
            }
            else if (diff < 86400000) // less then 1 day
            {
                points = points + LAST_DAY;
            }
            else if (diff < 604800000) // less then 1 week
            {
                points = points + LAST_WEEK;
            }
            else if (diff < 2592000000) // less then 1 month
            {
                points = points + LAST_MONTH;
            }
            else if (diff < 31104000000) // less then 1 year
            {
                points = points + LAST_YEAR;
            }
        }
        
        if (enablepres)
        {
            var presence = '-1';
            var presobj = webphone_api.global.presenceHM[item[webphone_api.common.CH_NUMBER]];
            if (!webphone_api.common.isNull(presobj)) { presence = presobj[webphone_api.common.PRES_STATUS]; }

            // -1=not exists(undefined), 0=offline, 1=invisible, 2=idle, 3=pending, 4=DND, 5=online
            if (!webphone_api.common.isNull(presence)) // available
            {
                if (presence === '5')
                {
                    points = points + IS_ONLINE;
                }
                else if ((presence === '0' || presence === '1' || presence === '4') && points > 10)
                {
                    points = Math.floor(points / 2);
                }else
                {
                    points = Math.floor(points / 1.5);
                }
            }

            if (webphone_api.common.isNull(presence) || presence.length < 1 || presence === '-1')
            {
                if (webphone_api.common.isNull(presencequery)) { presencequery = []; }
                if (presencequery.indexOf(item[webphone_api.common.CH_NUMBER]) < 0)
                {
                    presencequery.push(item[webphone_api.common.CH_NUMBER]);
                }
            }
        }


        //more points for contacts added from our app
        // mark contact as favorite -> higher points
        var ctid = webphone_api.common.GetContactIdFromNumber(item[webphone_api.common.CH_NUMBER]);
        if (ctid >= 0)
        {
            var ct = webphone_api.global.ctlist[ctid];
            if (!webphone_api.common.isNull(ct))
            {
                if (ct.length > webphone_api.common.CT_FAV && ct[webphone_api.common.CT_FAV] === '1')
                {
                    points = points * 1.15;
                }

                if (ct.length > webphone_api.common.CT_ISFROMSYNC && ct[webphone_api.common.CT_ISFROMSYNC] === '0')
                {
                    points = points * 1.1;
                }
            }
        }

        
        /* type 0=outgoing call, 1=incomming call, 2=missed call - not viewed, 3=missed call - viwed*/
        if (item[webphone_api.common.CH_TYPE] !== '1')
        {
            points = points + OUTGOING_CALL;
        }
        
        var exists = -1;
        for (var j = 0; j < rectmp.length; j++)
        {
            if (rectmp[j][webphone_api.common.RC_NUMBER] === item[webphone_api.common.CH_NUMBER])
            {
                exists = j;
                break;
            }
        }
        
    // check if contact is blocked
        if (webphone_api.common.IsContactBlocked(item[webphone_api.common.CH_NUMBER]) && points > 5)
        {
            points = Math.floor(points / IS_BLOCKED);
        }
        
    // check if is favorite
        var ctidtmp = webphone_api.common.GetContactIdFromNumber(item[webphone_api.common.CH_NUMBER]);
        if (!webphone_api.common.isNull(ctidtmp) && webphone_api.common.IsNumber(ctidtmp))
        {
            if (webphone_api.common.ContactIsFavorite(ctidtmp) === true)
            {
                points = points * FAVORITE;
            }
        }
        
        if (exists >= 0)
        {
            var pointstmp = 0;
            try{
                var potmp = rectmp[exists][webphone_api.common.RC_RANK];
                if (typeof (potmp) !== 'number')
                {
                    pointstmp = webphone_api.common.StrToInt( webphone_api.common.Trim(rectmp[exists][webphone_api.common.RC_RANK]) );  
                }else
                {
                    pointstmp = potmp;
                }
            } catch(errin2) { webphone_api.common.PutToDebugLogException(2, "_dialpad: GetRecents convert points", errin2); }
            
            pointstmp = pointstmp + points;
            
            rectmp[exists][webphone_api.common.RC_RANK] = pointstmp;
        }else
        {
            var entry = [];
            
            entry[webphone_api.common.RC_TYPE] = item[webphone_api.common.CH_TYPE];
            entry[webphone_api.common.RC_NAME] = item[webphone_api.common.CH_NAME];
            entry[webphone_api.common.RC_NUMBER] = item[webphone_api.common.CH_NUMBER];
            entry[webphone_api.common.RC_DATE] = item[webphone_api.common.CH_DATE];
            entry[webphone_api.common.RC_RANK] = points;
            entry[webphone_api.common.RC_DURATION] = item[webphone_api.common.CH_DURATION];;

            rectmp.push(entry);
        }
    }
    
    webphone_api.global.recentlist = rectmp;
    webphone_api.global.refreshrecents = false;
    SortRecents();
    
    if (enablepres && !webphone_api.common.isNull(presencequery) && presencequery.length > 0)
    {
        var ulist = '';
        for (var i = 0; i < presencequery.length; i++)
        {
            if (webphone_api.common.isNull(presencequery[i]) || webphone_api.common.Trim(presencequery[i]).length < 1) { continue; }
            
            if (ulist.length > 0) { ulist = ulist + ','; }
            ulist = ulist + presencequery[i];
        }
        
        if (!webphone_api.common.isNull(ulist) && ulist.length > 0)
        {
            ulist = webphone_api.common.ReplaceAll(ulist, '-', '');
            ulist = webphone_api.common.ReplaceAll(ulist, ')', '');
            ulist = webphone_api.common.ReplaceAll(ulist, '(', '');
            
            webphone_api.common.PresenceGet2(ulist);
        }
    }

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: GetRecents", err); }
}

function SortRecents()
{
    try{
    webphone_api.global.recentlist.sort(function (a,b) // comparator function
    {
        var anr = a[webphone_api.common.RC_RANK];
        var bnr = b[webphone_api.common.RC_RANK];
        
        if ( anr < bnr ) { return 1; }
        if ( anr > bnr ) { return -1; }
        return 0;
    });
    } catch(err) { PutToDebugLogException(2, "_dialpad: SortRecents", err); }
}

function PopulateListRecents() // :no return value
{
    if (webphone_api.common.GetParameterInt('quick_access_list', 1) < 1)
    {
        return
    }

    var itemstodisplay = webphone_api.global.nrofrecentstodisplay; // max number of items to display
    var enablepres = false;
    var lastoop = 0;
    try{
//--    if (webphone_api.common.HideSettings('recents', '', 'recents', true) === true) { return; }
        lastoop = 1;
    if ( webphone_api.common.isNull(document.getElementById('dialpad_list')) )
    {
        webphone_api.common.PutToDebugLog(2, "ERROR, _dialpad: PopulateListRecents listelement is null");
        return;
    }

        lastoop = 2;
    
    GetRecents();

        lastoop = 3;
    
    if ( webphone_api.common.isNull(webphone_api.global.recentlist) || webphone_api.global.recentlist.length < 1 ||
            webphone_api.common.HideSettings('recents', '', 'recents', true) === true)
    {
        lastoop = 4;
        webphone_api.$('#dialpad_btn_grid').show();
        webphone_api.$('#dialpad_list').html('');
        MeasureDialPad();
        if(webphone_api.common.CanLog(2)) { webphone_api.common.PutToDebugLog(2, "EVENT, _dialpad: PopulateListRecents no recents"); }
        
    // don't display Voicemail if we have custom menus
        var custm_uri = webphone_api.common.GetParameter('menu_url');
        if (!webphone_api.common.isNull(custm_uri) || custm_uri.length > 3)
        {
            btn_isvoicemail = false;
            if (webphone_api.common.GetColortheme() === 22)
            {
                webphone_api.$("#btn_showhide_numpad_img").attr("src",webphone_api.common.GetElementSource() + 'images/btn_numpad_txt_grey.png');
            }else
            {
                webphone_api.$("#btn_showhide_numpad_img").attr("src", '' + webphone_api.common.GetElementSource() + 'images/btn_numpad_txt.png');
            }
            webphone_api.$("#btn_showhide_numpad").attr("title", webphone_api.stringres.get("hint_numpad"));
            return;
        }
        
//BRANDSTART
        if (webphone_api.common.GetConfigInt('brandid', -1) !== 60) //-- 101VOICEDT500
        {
//BRANDEND
            btn_isvoicemail = true;
            if (webphone_api.common.GetColortheme() === 22)
            {
                webphone_api.$("#btn_showhide_numpad_img").attr("src",webphone_api.common.GetElementSource() + 'images/btn_voicemail_txt_big_grey.png');
            }else
            {
                webphone_api.$("#btn_showhide_numpad_img").attr("src", '' + webphone_api.common.GetElementSource() + 'images/btn_voicemail_txt_big.png');
            }
            webphone_api.$("#btn_showhide_numpad").attr("title", webphone_api.stringres.get("hint_voicemail"));
//BRANDSTART
        }
//BRANDEND
        return;
    }else
    {
        lastoop = 5;
        btn_isvoicemail = false;
        if (webphone_api.common.GetColortheme() === 22)
        {
            webphone_api.$("#btn_showhide_numpad_img").attr("src",webphone_api.common.GetElementSource() + 'images/btn_numpad_txt_grey.png');
        }else
        {
            webphone_api.$("#btn_showhide_numpad_img").attr("src", '' + webphone_api.common.GetElementSource() + 'images/btn_numpad_txt.png');
        }
        webphone_api.$("#btn_showhide_numpad").attr("title", webphone_api.stringres.get("hint_numpad"));
//--         intructions Moved after populating is done because MeasuerDialpad() checks the content of the list
    }

        lastoop = 6;
    showfulldialpad = false;
    
    if (!webphone_api.common.isNull(webphone_api.global.recentlist) && webphone_api.global.recentlist.length < itemstodisplay)
    {
        itemstodisplay = webphone_api.global.recentlist.length;
    }
        lastoop = 7;

// refresh the list of recents, meaning: if any unknown numbers have been saved, then get name from contacts; if contacts have been deleted, then remove name
    for (var i = 0; i < itemstodisplay; i++)
    {
        if (webphone_api.global.recentlist[i][webphone_api.common.RC_NAME] === webphone_api.global.recentlist[i][webphone_api.common.RC_NUMBER])
        {
            webphone_api.global.recentlist[i][webphone_api.common.RC_NAME] = webphone_api.common.GetContactNameFromNumber( webphone_api.global.recentlist[i][webphone_api.common.RC_NUMBER] );
        }else
        {
            var idtemp = webphone_api.common.GetContactIdFromNumber( webphone_api.global.recentlist[i][webphone_api.common.RC_NUMBER] );
            if (idtemp < 0)
            {
//--                webphone_api.global.recentlist[i][webphone_api.common.RC_NAME] = webphone_api.global.recentlist[i][webphone_api.common.RC_NUMBER];
            }else
            {
                webphone_api.global.recentlist[i][webphone_api.common.RC_NAME] = webphone_api.common.GetContactNameFromNumber( webphone_api.global.recentlist[i][webphone_api.common.RC_NUMBER] );
            }
        }
    }

        lastoop = 8;
   if(webphone_api.common.CanLog(2)) { webphone_api.common.PutToDebugLog(2, 'EVENT, _dialpad Starting populate recents list'); }
    var recent_menu = '<a id="recentmenu_[RCID]" class="ch_menu mlistitem">' + webphone_api.stringres.get('hint_recents') + '</a>';
    
//-- option to disable the hamburger popup menu for recent calls (in the disablesett)  ...or just disable it if the contact page is also disabled
// add hidesettings parameter: disablecontactmenu
    if (webphone_api.common.HideSettings('disablecontactmenu', '', 'disablecontactmenu', false) === true || webphone_api.common.HideSettings('page_contacts', '', 'page_contacts', true) === true)
    {
        recent_menu = '';
    }

        lastoop = 9;
    
    var template = '' +
        '<li data-theme="b"><a id="recentitem_[RCID]" class="ch_anchor mlistitem">' +
            '<div class="item_container">' +
                '<div class="ch_type">' +
                    '<img src="' + webphone_api.common.GetElementSource() + 'images/[ICON_CALLTYPE].png" />' +
                '</div>' +
                '<div class="ch_numberonly">[NUMBERONLY]</div>' +
                '<div class="ch_data">' +
                    '<div class="ch_name">[NAME]</div>' +
                    '<div class="ch_number">[NUMBER]</div>' +
                '</div>' +
                '<div class="ch_presence">[PRESENCE]</div>' + // <img src="images/presence_available.png" />
                '<div class="ch_date">[DATE]</div>' + // Aug, 26 2013 10:55
            '</div>' +
        '</a>' +
        recent_menu +
        '</li>';

    var listview = '';
        lastoop = 10;
    
    if (webphone_api.common.UsePresence2() === true)
    {
        enablepres = true;
    }
    
    for (var i = 0; i < itemstodisplay; i++)
    {
        lastoop = 11;
        var item = webphone_api.global.recentlist[i];
        if ( webphone_api.common.isNull(item) || item.length < 1 ) { continue; }
        
        /* type 0=outgoing call, 1=incomming call, 2=missed call - not viewed, 3=missed call - viwed*/
        
        var icon = 'icon_call_missed';
        
        var durationint = 0;
        try{
            durationint = webphone_api.common.StrToInt( webphone_api.common.Trim(item[webphone_api.common.RC_DURATION]) );
        
        } catch(errin1) { webphone_api.common.PutToDebugLogException(2, "_dialpad: PopulateListRecents convert duration", errin1); }

        if (item[webphone_api.common.RC_TYPE] === '0')
        {
           if (durationint <= 0)
            {
                icon = 'icon_call_outgoing_failed';
            }else
            {
                icon = 'icon_call_outgoing';
            }
        }
        if (item[webphone_api.common.RC_TYPE] === '1') { icon = 'icon_call_incoming'; }
        
        var datecallint = 0;
        try{
            datecallint = webphone_api.common.StrToInt( webphone_api.common.Trim(item[webphone_api.common.RC_DATE]) );
        
        } catch(errin1) { webphone_api.common.PutToDebugLogException(2, "_dialpad: PopulateListRecents convert date of call", errin1); }
        
//--Aug, 26 2013 10:55
        var datecall = new Date(datecallint);
        
        var minutes = datecall.getMinutes();
        if (minutes < 10) { minutes = '0' + minutes; }
        lastoop = 12;
        
        var day = datecall.getDate(); // getDay returns the day of the week
        if (day < 10) { day = '0' + day; }
        
//--        var seconds = datecall.getSeconds();
//--        if (seconds < 10) { seconds = '0' + seconds; }
        
        var daetcallstr = month[datecall.getMonth()] + ', ' + day + '&nbsp;&nbsp;' + datecall.getFullYear()+ '&nbsp;&nbsp;'
                + datecall.getHours() + ':' + minutes;//-- + ':' + seconds;
        
        var lisitem = template.replace('[RCID]', i.toString());
        lisitem = lisitem.replace('[RCID]', i.toString());
        lisitem = lisitem.replace('[ICON_CALLTYPE]', icon);
        
        if (item[webphone_api.common.RC_NAME] === item[webphone_api.common.RC_NUMBER])
        {
            lisitem = lisitem.replace('[NUMBERONLY]', item[webphone_api.common.RC_NUMBER]);
            lisitem = lisitem.replace('[NAME]', '');
            lisitem = lisitem.replace('[NUMBER]', '');
        }else
        {
            lisitem = lisitem.replace('[NUMBERONLY]', '');
            lisitem = lisitem.replace('[NAME]', item[webphone_api.common.RC_NAME]);
            lisitem = lisitem.replace('[NUMBER]', item[webphone_api.common.RC_NUMBER]);
        }
        lisitem = lisitem.replace('[DATE]', daetcallstr);
        
        var presenceimg = ''; //<img src="images/presence_available.png" />
        
        if (enablepres)
        {
            var phonenr = item[webphone_api.common.RC_NUMBER];
            
            var presence = '-1';
            var presobj = webphone_api.global.presenceHM[phonenr];
            if (!webphone_api.common.isNull(presobj)) { presence = presobj[webphone_api.common.PRES_STATUS]; }

            // -1=not exists(undefined), 0=offline, 1=invisible, 2=idle, 3=pending, 4=DND, 5=online
            if (webphone_api.common.isNull(presence) || presence.length < 1)
            {
                presenceimg = '';
            }
            else if (presence === '0') // offline
            {
                presenceimg = '<img src="' + webphone_api.common.GetElementSource() + 'images/presence_grey.png" />';
            }
            else if (presence === '1') // invisible
            {
                presenceimg = '<img src="' + webphone_api.common.GetElementSource() + 'images/presence_white.png" />';
            }
            else if (presence === '2') // idle
            {
                presenceimg = '<img src="' + webphone_api.common.GetElementSource() + 'images/presence_yellow.png" />';
            }
            else if (presence === '3') // pending
            {
                presenceimg = '<img src="' + webphone_api.common.GetElementSource() + 'images/presence_orange.png" />';
            }
            else if (presence === '4') // DND
            {
                presenceimg = '<img src="' + webphone_api.common.GetElementSource() + 'images/presence_red.png" />';
            }
            else if (presence === '5') // online
            {
                presenceimg = '<img src="' + webphone_api.common.GetElementSource() + 'images/presence_green.png" />';
            }
            else
            {
                presenceimg = '';
            }
        }
        lastoop = 13;
        
        lisitem = lisitem.replace('[PRESENCE]', presenceimg);

        listview = listview + lisitem;
    }

        lastoop = 14;
    
    webphone_api.$('#dialpad_list').html('');
    webphone_api.$('#dialpad_list').append(listview).listview('refresh');

        lastoop = 15;
    
    if ( webphone_api.common.isNull(webphone_api.global.recentlist) || webphone_api.global.recentlist.length < 1 )
    {
        ;
    }else
    {
//--         intructions Moved after populating is done because MeasuerDialpad() checks the content of the list
//--        webphone_api.$('#dialpad_btn_grid').hide();
        
// if list height greater than available space, the hide dialpad
        lastoop = 16;
        var liheight = webphone_api.$("#dialpad_list li").height();

        if (!webphone_api.common.isNull(liheight) && webphone_api.common.IsNumber(liheight) && webphone_api.$('#dialpad_btn_grid').is(':visible'))
        {
            webphone_api.$("#dialpad_btn_grid .ui-btn").height('auto');

            var count = webphone_api.global.nrofrecentstodisplay;
            if (count > webphone_api.global.recentlist.length) { count = webphone_api.global.recentlist.length; }
            var listheight = count * liheight;

            var availablespace = webphone_api.common.GetDeviceHeight() - webphone_api.$("#dialpad_header").height()
                            - webphone_api.$("#phone_number_container").height()
                            - webphone_api.$("#dialpad_footer").height()
                            - webphone_api.common.StrToIntPx(webphone_api.$("#dialpad_header").css("border-top-width"))
                            - webphone_api.common.StrToIntPx(webphone_api.$("#dialpad_header").css("border-bottom-width"))
                            - 2 * (webphone_api.$(".separator_color_bg").height());

            availablespace = availablespace - webphone_api.$("#dialpad_btn_grid").height();

            if (availablespace < listheight)
            {
                webphone_api.$('#dialpad_btn_grid').hide();
            }
        }
        lastoop = 17;
        
        MeasureDialPad();
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: PopulateListRecents "+lastoop, err); }
}

function PopulateListContacts(nrval) // :no return value
{
    try{
    if (webphone_api.common.isNull(nrval) || nrval.length < 1)
    {
        PopulateListRecents();
        return;
    }
    
    showfulldialpad = false;
    
    if ( webphone_api.common.isNull(document.getElementById('dialpad_list')) )
    {
        webphone_api.common.PutToDebugLog(2, "ERROR, _dialpad: PopulateListContacts listelement is null");
        return;
    }
    
    SearchContacts(nrval);
    
    webphone_api.common.PutToDebugLog(2, 'EVENT, _dialpad Starting populate searched contact list');
    
    var template = '' +
        '<li data-theme="b"><a id="searcheditem_[CTID]" class="ch_anchor">' +
            '<div class="item_container">' +
                '<div class="ch_ctname">[NAME]</div>' +
                '<div id="ch_ctnumber_[CTID]" class="ch_ctnumber">[NUMBER]</div>' +
            '</div>' +
        '</a>' +
        '<a id="searchedmenu_[CTID]" class="ch_menu">Menu</a>' +
        '</li>';

    var listview = '';
    
    for (var i = 0; i < webphone_api.global.searchctlist.length; i++)
    {
        if ( webphone_api.common.isNull(webphone_api.global.searchctlist[i]) || webphone_api.global.searchctlist[i].length < 1 ) { continue; }
        
        var lisitem = template.replace('[CTID]', i.toString());
        lisitem = lisitem.replace('[CTID]', i.toString());
        lisitem = lisitem.replace('[CTID]', i.toString());
        lisitem = lisitem.replace('[NAME]', webphone_api.global.searchctlist[i][webphone_api.common.CT_NAME]);
        lisitem = lisitem.replace('[NUMBER]', webphone_api.global.searchctlist[i][webphone_api.common.CT_NUMBER]);

        listview = listview + lisitem;
    }
    
    webphone_api.$('#dialpad_list').html('');
    webphone_api.$('#dialpad_list').append(listview).listview('refresh');
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: PopulateListContacts", err); }
}

function SearchContacts(searchval)
{
    try{
    if (webphone_api.common.isNull(searchval) || (webphone_api.common.Trim(searchval)).lengh < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _dialpad: SearchContacts value is NULL');
        return;
    }
    
    searchval = searchval.toLowerCase();
    webphone_api.global.searchctlist = [];
    
//--     String Name, String[] {numbers/sip uris}, String[] {number types}, int usage, long lastmodified, int delete flag, int isfavorit
//--    var ctitem = ['Ambrus Akos', ['40724335358', '0268123456', '13245679'], ['home', 'work', 'other'], '0', '13464346', '0', '0'];

    for (var i = 0; i < webphone_api.global.ctlist.length; i++)
    {
        var add = false;
        var ctTemp = webphone_api.global.ctlist[i].slice(0);
        if (webphone_api.common.isNull(ctTemp))
        {
            continue;
        }
        
        if ( (ctTemp[webphone_api.common.CT_NAME].toLowerCase()).indexOf(searchval) >= 0 )
        {
            add = true;
// add an entry in searchctlist for every phone number
            for (var j = 0; j < ctTemp[webphone_api.common.CT_NUMBER].length; j++)
            {
                var entry = ctTemp.slice(0);
                
                var nr = ctTemp[webphone_api.common.CT_NUMBER][j];
                
                entry[webphone_api.common.CT_NUMBER] = ctTemp[webphone_api.common.CT_NUMBER][j];
                
                webphone_api.global.searchctlist.push(entry);
            }
        }
        
        if (add === false && !webphone_api.common.isNull(ctTemp[webphone_api.common.CT_NUMBER]))
        {
            for (var j = 0; j < ctTemp[webphone_api.common.CT_NUMBER].length; j++)
            {
                if ( ((ctTemp[webphone_api.common.CT_NUMBER][j]).toLowerCase()).indexOf(searchval) >= 0 )
                {
                    var entry = ctTemp;
                
                    entry[webphone_api.common.CT_NUMBER] = ctTemp[webphone_api.common.CT_NUMBER][j];
                
                    webphone_api.global.searchctlist.push(entry);
                }
            }
        }
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: SearchContacts", err); }
}

var trigerredlist = false; // handle multiple clicks
function OnListItemClick (id, islongclick) // :no return value
{
    try{
    if (trigerredlist) { return; }
    
    trigerredlist = true;
    setTimeout(function ()
    {
        trigerredlist = false;
    }, 1000);
    
    if (webphone_api.common.isNull(id) || id.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _dialpad OnListItemClick id is NULL');
        return;
    }
    
    var rcid = '';
    var pos = id.indexOf('_');
    if (pos < 2)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _dialpad OnListItemClick invalid id');
        return;
    }
    
    rcid = webphone_api.common.Trim(id.substring(pos + 1));
    var idint = 0;
    
    try{
        idint = webphone_api.common.StrToInt( webphone_api.common.Trim(rcid) );

    } catch(errin1) { webphone_api.common.PutToDebugLogException(2, "_dialpad: OnListItemClick convert rcid", errin1); }
    
    if (id.indexOf('recentitem') === 0) // means call from recents list
    {
        var to = webphone_api.global.recentlist[idint][webphone_api.common.RC_NUMBER];
        var name = webphone_api.global.recentlist[idint][webphone_api.common.RC_NAME];

        webphone_api.common.PutToDebugLog(2, 'EVENT, _dialpad recents call to: ' + to);
        webphone_api.call(to, -1);
    }
    else if (id.indexOf('recentmenu') === 0) // menu from recents list
    {
        RecentMenu(idint, true, islongclick);
    }
    else if (id.indexOf('searcheditem') === 0) // means call from recents list
    {
        if (islongclick === true)
        {
            RecentMenu(idint, false, islongclick);
        }else
        {
            var to = webphone_api.$('#ch_ctnumber_' + idint).html();
            var name = webphone_api.global.searchctlist[idint][webphone_api.common.CT_NAME];

            webphone_api.common.PutToDebugLog(2, 'EVENT, _dialpad searched item call to: ' + to);
            webphone_api.call(to, -1);
        }
    }
    else if (id.indexOf('searchedmenu') === 0) // menu from recents list
    {
        RecentMenu(idint, false, islongclick);
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: OnListItemClick", err); }
}

function RecentMenu(rcid, isrecent, islongclick, popupafterclose)
{
    try{
    if (webphone_api.common.isNull(rcid) || rcid.length < 1 || rcid < 0 || rcid > webphone_api.global.recentlist.length)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, RecentMenu: invalid id: ' + rcid);
        return;
    }
    
    var rcname = '';
    var rcnumber = '';
    
    if (isrecent)
    {
        rcname = webphone_api.global.recentlist[rcid][webphone_api.common.RC_NAME];
        rcnumber = webphone_api.global.recentlist[rcid][webphone_api.common.RC_NUMBER];
    }else
    {
        rcname = webphone_api.global.searchctlist[rcid][webphone_api.common.CT_NAME];
        rcnumber = webphone_api.$('#ch_ctnumber_' + rcid).html();
    }
    
    if (webphone_api.common.isNull(rcname)) { rcname = ''; }
    if (webphone_api.common.isNull(rcnumber)) { rcnumber = ''; }
    
    
    if (webphone_api.common.GetContactIdFromNumber(rcnumber) >= 0) // if contact exists
    {
        // show context menu instead
        if (islongclick === true)
        {
            CreateContextmenu(webphone_api.common.GetContactIdFromNumber(rcnumber), rcname, rcnumber, popupafterclose);
        }else
        {
            webphone_api.global.intentctdetails[0] = 'ctid=' + webphone_api.common.GetContactIdFromNumber(rcnumber);
            webphone_api.global.intentctdetails[1] = 'frompage=dialpad';
            webphone_api.$.mobile.changePage("#page_contactdetails", { transition: "none", role: "page" });
        }
    }else
    {
        // show context menu instead
        if (islongclick === true)
        {
            CreateContextmenu('-1', rcname, rcnumber, popupafterclose);
        }else
        {
            webphone_api.global.intentctdetails[0] = 'ctid=-1';
            webphone_api.global.intentctdetails[1] = 'ctname=' + rcname;
            webphone_api.global.intentctdetails[2] = 'ctnumber=' + rcnumber;
            webphone_api.global.intentctdetails[3] = 'frompage=dialpad';
            webphone_api.$.mobile.changePage("#page_contactdetails", { transition: "none", role: "page" });
        }
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: RecentMenu", err); }
}

function CreateContextmenu(cid_in, cname, cnr, popupafterclose)
{
    try{
    if (webphone_api.common.isNull(cid_in) || cid_in.length < 1 || !webphone_api.common.IsNumber(cid_in))
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _dialpad: CreateContextmenu invalid contact id: ' + cid_in);
    }
    var cid = webphone_api.common.StrToInt(cid_in);

    var popupWidth = webphone_api.common.GetDeviceWidth();
    if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
    {
        popupWidth = Math.floor(popupWidth / 1.2);
    }else
    {
        popupWidth = 220;
    }
    
    var iscontact = false;
    if (cid > -1) { iscontact = true; }
    
    var isfavorite = false;
    if (iscontact === true) { isfavorite = webphone_api.common.ContactIsFavorite(cid); }
    
    var list = '';
    var item = '<li id="[ITEMID]"><a data-rel="back">[ITEMTITLE]</a></li>';
    
    var itemTemp = '';
    
    if (iscontact === true)
    {
        itemTemp = item.replace('[ITEMID]', '#dp_item_edit_contact');
        itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_editcontact'));
        list = list + itemTemp;
        itemTemp = '';

//--        itemTemp = item.replace('[ITEMID]', '#dp_item_delete_contact');
//--        itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_deletecontact'));
//--        list = list + itemTemp;
//--        itemTemp = '';
    }

// --------------------------

    itemTemp = item.replace('[ITEMID]', '#dp_item_call');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_call'));
    list = list + itemTemp;
    itemTemp = '';

    if (webphone_api.common.CanIUseVideo() === true)
    {
        itemTemp = item.replace('[ITEMID]', '#dp_item_video_call');
        itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('btn_videocall'));
        list = list + itemTemp;
        itemTemp = '';
    }

    itemTemp = item.replace('[ITEMID]', '#dp_item_message');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('send_msg'));
    list = list + itemTemp;
    itemTemp = '';
    
    if (webphone_api.common.GetConfigBool('hasfiletransfer', true) !== false && webphone_api.common.IsMizuServerOrGateway())
    {
//OPSSTART
        if (webphone_api.common.Glft() === true)
        {
//OPSEND
            itemTemp = item.replace('[ITEMID]', '#dp_item_filetransf');
            itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('filetransf_title'));
            list = list + itemTemp;
            itemTemp = '';
//OPSSTART
        }
//OPSEND
    }
    
    if (iscontact === true)
    {
        var favtitle = webphone_api.stringres.get('menu_ct_setfavorite');
        if (isfavorite === true) { favtitle = webphone_api.stringres.get('menu_ct_unsetfavorite'); }
        itemTemp = item.replace('[ITEMID]', '#dp_item_favorite');
        itemTemp = itemTemp.replace('[ITEMTITLE]', favtitle);
        list = list + itemTemp;
        itemTemp = '';
    }

    var title = cname;
    if (webphone_api.common.isNull(title) || title.length < 1) { title = cnr; }
    
    var template = '' +
'<div id="dp_contextmenu" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + title + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content" style="padding: 0; margin: 0;">' +
    
        '<ul id="dp_contextmenu_ul" data-role="listview" data-inset="true" data-icon="false" style="margin: 0;">' +
            list +
        '</ul>' +
//        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back">' + webphone_api.stringres.get('btn_close') + '</a>' +
//        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" data-transition="flow">Delete</a>' +
    '</div>' +
    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" style="width: 98%;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_close') + '</a>' +
    '</div>' +
'</div>';
 
    popupafterclose = popupafterclose ? popupafterclose : function () {};

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
            
            webphone_api.$('#dp_contextmenu_ul').off('click', 'li');
            
            popupafterclose();
        }
    });
    
   
        
    webphone_api.$('#dp_contextmenu_ul').on('click', 'li', function(event)
    {
        var itemid = webphone_api.$(this).attr('id');

        webphone_api.$( '#dp_contextmenu' ).on( 'popupafterclose', function( event )
        {
            webphone_api.$( '#dp_contextmenu' ).off( 'popupafterclose' );

            if (itemid === '#dp_item_edit_contact')
            {        
                EditContact(cid);
            }
            else if (itemid === '#dp_item_delete_contact')
            {
                DeleteContact(cid);
            }
            else if (itemid === '#dp_item_call')
            {
                StartCall(cnr);
                webphone_api.common.SaveParameter("redial", cnr);
            }
            else if (itemid === '#dp_item_video_call')
            {
                webphone_api.common.SaveParameter("redial", cnr);
                webphone_api.videocall(cnr);
            }
            else if (itemid === '#dp_item_message')
            {
                webphone_api.common.StartMsg(cnr, '', '_dialpad');
            }
            else if (itemid === '#dp_item_filetransf')
            {
                webphone_api.common.FileTransfer(cnr);
            }
            else if (itemid === '#dp_item_favorite')
            {
                if (isfavorite === true)
                {
                    webphone_api.common.ContactSetFavorite(cid, false);
                    webphone_api.common.ShowToast(webphone_api.stringres.get('ct_unsetfavorited'), 1400);
                }else
                {
                    webphone_api.common.ContactSetFavorite(cid, true);
                    webphone_api.common.ShowToast(webphone_api.stringres.get('menu_ct_setfavorite'), 1400);
                }
            }
        });
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: CreateContextmenu", err); }
}

function EditContact(ctid) // open AddEditContact activity
{
    try{
    webphone_api.global.intentaddeditct[0] = 'action=edit';
    webphone_api.global.intentaddeditct[1] = 'ctid=' + ctid;

    webphone_api.$.mobile.changePage("#page_addeditcontact", { transition: "pop", role: "page" });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: EditContact", err); }
}

var presencewidth = 0;
function MeasureDialPad() // resolve window height size change
{
    try{
    //webphone_api.common.PutToDebugLog(2,'EVENT,dddddddd MeasureDialPad');
//--    var pgh = webphone_api.common.GetDeviceHeight() - webphone_api.$("#dialpad_footer").height() - 1; webphone_api.$('#page_dialpad').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_dialpad').css('min-height', 'auto'); // must be set when softphone is skin in div
    
    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#page_dialpad'), -30) );
    
// handle notifiaction      additional_header_right
    var notwidth = webphone_api.common.GetDeviceWidth() - webphone_api.$("#dialpad_additional_header_left").width() - webphone_api.$("#dialpad_additional_header_right").width();
    var margin = webphone_api.common.StrToIntPx( webphone_api.$("#dialpad_additional_header_left").css("margin-left") );
    
    if (webphone_api.common.isNull(margin) || margin === 0) { margin = 10; }
    margin = Math.ceil( margin * 6 );
    notwidth = Math.floor(notwidth - margin) - 20;

//--    webphone_api.$("#dialpad_notification").width(notwidth);
    webphone_api.$("#dialpad_notification").height( Math.floor( webphone_api.$("#dialpad_additional_header_left").height() ) );
    
    //dialpad_footer
    
// handle recents list height
    var contentHeight = webphone_api.common.GetDeviceHeight() - webphone_api.$("#dialpad_header").height()
                        - webphone_api.$("#phone_number_container").height()
                        - webphone_api.$("#dialpad_footer").height()
                        - webphone_api.common.StrToIntPx(webphone_api.$("#dialpad_header").css("border-top-width"))
                        - webphone_api.common.StrToIntPx(webphone_api.$("#dialpad_header").css("border-bottom-width"))
                        - 2 * (webphone_api.$(".separator_color_bg").height());
//--                        - (webphone_api.$(".separator_color_bg").height());
    
//--    if (webphone_api.$('#footertext_dialpad').is(':visible')) { contentHeight = contentHeight - webphone_api.$("#footertext_dialpad").height(); }
    if (webphone_api.$('#dialpad_btn_grid').is(':visible'))
    {
        contentHeight = contentHeight - webphone_api.$("#dialpad_btn_grid").height();
    }
    
    contentHeight = contentHeight - 3;
    
    webphone_api.$("#dialpad_list").height(contentHeight);
    
    
    var bname = webphone_api.common.GetBrandName();
    if (webphone_api.$('#dialpad_title').is(':visible'))
    {
        webphone_api.global.bname_charcount = webphone_api.common.GetTextLengthThatFits('app_name_dialpad', bname, webphone_api.$("#app_name_dialpad").width());
    }
    
    // if brandname does not fit, then hide title and make brandname div wider
    if (webphone_api.global.bname_charcount > 0 && bname.length > webphone_api.global.bname_charcount)
    {
        webphone_api.$('#dialpad_title').remove();
        webphone_api.$('#dialpad_additional_header_left').width('65%');
    }

    var orig_brandW = webphone_api.$("#dialpad_additional_header_left").width();
    var brandW = orig_brandW - 5;
    if (webphone_api.$('#dialpad_presence').is(':visible'))
    {
        var pwidth = webphone_api.$("#dialpad_presence").width();
        if (pwidth === 0) { pwidth = 30; } // hack, sometimes it returns 0
        if(pwidth > presencewidth) presencewidth = pwidth;
    }

    brandW = brandW - presencewidth;
    if(brandW > 350) brandW = 350;

    //webphone_api.common.PutToDebugLog(2,'EVENT, dddddddd set dialpad width: '+brandW+' ('+orig_brandW+')');
    webphone_api.$("#app_name_dialpad").width(brandW);
    

    // handle numpad height
    if ( showfulldialpad && ( webphone_api.common.isNull(webphone_api.$('#dialpad_list').html()) || (webphone_api.$('#dialpad_list').html()).length < 1 ) ) // if recents are not available, then show dialpad in full screen
    {
        var contentHeightDp = webphone_api.common.GetDeviceHeight() - webphone_api.$("#dialpad_header").height() - webphone_api.common.StrToIntPx(webphone_api.$("#dialpad_header").css("border-top-width"))
                - webphone_api.common.StrToIntPx(webphone_api.$("#dialpad_header").css("border-bottom-width")) - 2 * (webphone_api.$(".separator_color_bg").height());

        contentHeightDp = contentHeightDp - webphone_api.$("#phone_number_container").height() - webphone_api.$("#dialpad_footer").height();
        
        contentHeightDp = contentHeightDp - 4;

        var rowHeight = Math.floor(contentHeightDp / 4);
        webphone_api.$("#dialpad_btn_grid .ui-btn").height(rowHeight);

    }else
    {
        webphone_api.$("#dialpad_btn_grid .ui-btn").height('auto');
    }

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: MeasureDialPad", err); }
}

function HandleAutoaction() // 0=nothing, 1=call (default), 2=chat, 3=video call
{
    try{
    if (webphone_api.global.aua_handled === true) { return; }
    webphone_api.global.aua_handled = true;
    var aua_str = webphone_api.common.GetParameter2('autoaction');
    if (webphone_api.common.isNull(aua_str) || !webphone_api.common.IsNumber(aua_str)) { return; }
    var aua = webphone_api.common.StrToInt(aua_str);
    if (webphone_api.common.isNull(aua) || aua < 1 || aua > 3) { return; }
    var ct = webphone_api.getcallto();
    if (webphone_api.common.isNull(ct) || ct.length < 1) { return; }
    
    if (aua === 1) // call
    {
        webphone_api.common.PutToDebugLog(2, 'EVENT, HandleAutoaction initiate call to: ' + ct);
        StartCall(ct, false);
    }
    else if (aua === 2) // chat
    {
        webphone_api.common.PutToDebugLog(2, 'EVENT, HandleAutoaction send message to: ' + ct);
        webphone_api.common.StartMsg(ct, '', '_dialpad');
    }
    else if (aua === 3) // video
    {
        webphone_api.common.PutToDebugLog(2, 'EVENT, HandleAutoaction initiate video call to: ' + ct);
        StartCall(ct, true);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: HandleAutoaction", err); }
}

function MsgOnClick()
{
    try{
//BRANDSTART
    if (webphone_api.common.GetConfigInt('brandid', -1) === 50) //-- favafone
    {
        CreditRecharge();
        return;
    }
//BRANDEND
    var phoneNumber = webphone_api.common.Trim( document.getElementById('phone_number').value );
    
    if (webphone_api.common.isNull(phoneNumber) || phoneNumber.length < 1)
    {
        webphone_api.common.StartMsg('', '', '_dialpad');	// starts msg inbox list
//--        CommonGUI.GetObj().PutToDebugLog(1,getResources().getString(R.string.err_msg_1));
    }else
    {
        webphone_api.common.StartMsg(phoneNumber, '', '_dialpad');
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: MsgOnClick", err); }
}

//--var maxloop = 0;
//--function ShowNativePluginOption()
//--{
//--    try{
//--    webphone_api.common.IsServiceInstalled(function (installed)
//--    {
//--        if (installed === false)
//--        {
//--            if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WEBPHONE()
//--            && webphone_api.global.enableservice  && webphone_api.global.useengine !== webphone_api.global.ENGINE_SERVICE
//--            && webphone_api.global.useengine !== webphone_api.global.ENGINE_JAVA)
//--            {
//--                ;
//--            }else
//--            {
//--                return;
//--            }

//--        //!!DEPERECATED
//--            if (webphone_api.global.showdialpadnativeplugin < 0 && maxloop < 4 && webphone_api.global.isDialpadStarted)
//--            {
//--                maxloop++;
//--                setTimeout(function ()
//--                {
//--                    ShowNativePluginOption();
//--                }, 1000);

//--                return;
//--            }
//--            else if (webphone_api.global.showdialpadnativeplugin === 1)
//--            {
//--                webphone_api.$("#dialpad_engine").show();
//--                webphone_api.$("#dialpad_engine_title").html(webphone_api.stringres.get('serviceengine_title'));
//--                webphone_api.$("#dialpad_engine_msg").html(webphone_api.stringres.get('serviceengine_msg'));

//--                maxloop = 0;
//--            }
//--            else if (webphone_api.global.showdialpadnativeplugin > 1)
//--            {
//--                maxloop = 0;
//--                NativePluginPopup();
//--            }
//--        }
//--    });
//--    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: MsgOnClick", err); }
//--}

function NativePluginPopup(popupafterclose) // ask user to install service plugin (service engine)
{
    webphone_api.common.PutToDebugLog(5, 'EVENT, _dialpad: NativePluginPopup called');
    
    try{
    var popupWidth = webphone_api.common.GetDeviceWidth();
    if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
    {
        popupWidth = Math.floor(popupWidth / 1.2);
    }else
    {
        popupWidth = 220;
    }
    
    var template = '' +
'<div id="native_plugin_popup" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('np_popup_title') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content adialog_alert">' +
        '<span> ' + webphone_api.stringres.get('np_popup_msg') + ' </span>' +
//        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back">' + webphone_api.stringres.get('btn_close') + '</a>' +
//        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" data-transition="flow">Delete</a>' +
    '</div>' +
    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" id="btn_adialog_ok" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_ok') + '</a>' +
        '<a href="javascript:;" id="adialog_negative" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back">' + webphone_api.stringres.get('btn_cancel') + '</a>' +
    '</div>' +
'</div>';
 
    popupafterclose = popupafterclose ? popupafterclose : function () {};

    webphone_api.$.mobile.activePage.append(template).trigger("create");
//--    webphone_api.$.mobile.activePage.append(template).trigger("pagecreate");

    webphone_api.$.mobile.activePage.find(".closePopup").bind("tap", function (e)
    {
        webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
    });
    
    webphone_api.$.mobile.activePage.find(".messagePopup").bind(
    {
        popupbeforeposition: function()
        {
            webphone_api.$(this).unbind("popupbeforeposition");//--.remove();
            var maxHeight =  Math.floor( webphone_api.common.GetDeviceHeight() * 0.6 );  //-- webphone_api.$(window).height() - 120;
            
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
            webphone_api.$('#btn_adialog_ok').off('click');
            popupafterclose();
        }
    });
    
    webphone_api.$('#btn_adialog_ok').on('click', function ()
    {
        webphone_api.$( '#native_plugin_popup' ).on( 'popupafterclose', function( event )
        {
            webphone_api.$( '#native_plugin_popup' ).off( 'popupafterclose' );
            
            webphone_api.common.PutToDebugLog(5, 'EVENT, _dialpad: NativePluginPopup OK onclick');
            
//--            webphone_api.common.OpenWebURL(webphone_api.global.nativeplugin_path, webphone_api.stringres.get('np_download'));
            webphone_api.common.OpenWebURL(webphone_api.common.GetNPLocation(), webphone_api.stringres.get('np_download'));
            setTimeout(function ()
            {
                webphone_api.common.NPDownloadAndInstall();
            }, 150);
        });
    });
        
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: NativePluginPopup", err); }
}
    

var MENUITEM_DIALPAD_PROVIDER = '#menuitem_dialpad_provider';
var MENUITEM_DIALPAD_MYACCOUNT = '#menuitem_dialpad_myaccount';
var MENUITEM_DIALPAD_P2P = '#menuitem_dialpad_p2p';
var MENUITEM_DIALPAD_CALLBACK = '#menuitem_dialpad_callback';
var MENUITEM_DIALPAD_RECHARGE = '#menuitem_dialpad_recharge';
var MENUITEM_DIALPAD_SETTINGS = '#menuitem_dialpad_settings';
var MENUITEM_HELP = '#menuitem_dialpad_help';
var MENUITEM_EXIT = '#menuitem_dialpad_exit';
var MENUITEM_DIALPAD_EXTRA = '#menuitem_dialpad_extra';
var MENUITEM_DIALPAD_EXTRA1 = '#menuitem_dialpad_extra1';
var MENUITEM_DIALPAD_EXTRA2 = '#menuitem_dialpad_extra2';
var MENUITEM_DIALPAD_EXTRA3 = '#menuitem_dialpad_extra3';
var MENUITEM_DIALPAD_EXTRA4 = '#menuitem_dialpad_extra4';
var MENUITEM_DIALPAD_EXTRA5 = '#menuitem_dialpad_extra5';
var MENUITEM_DIALPAD_ACCESSNR = '#menuitem_dialpad_accessnr';
var MENUITEM_DIALPAD_VOICEMAIL = '#menuitem_dialpad_voicemail';
//OPSSTART
var MENUITEM_DIALPAD_PROVERSION = '#menuitem_dialpad_proversion';
//OPSEND
var MENUITEM_DIALPAD_FILETRANSFER = '#menuitem_dialpad_filetransfer';
var MENUITEM_DIALPAD_AUDIOSETTING = '#menuitem_dialpad_audiosettings';
var MENUITEM_DIALPAD_RECONNECT = '#menuitem_dialpad_reconnect';
var MENUITEM_DIALPAD_WEBCALLME = '#menuitem_dialpad_webcallme';
var MENUITEM_DIALPAD_CONFERENCEROOMS = '#menuitem_dialpad_conferencerooms';
var MENUITEM_DIALPAD_VIDEOCALL = '#menuitem_dialpad_videocall';
var MENUITEM_DIALPAD_CALLPICKUP_101VOICE = '#menuitem_dialpad_callpickup_101voice';
var MENUITEM_DIALPAD_SCREENSHARE = '#menuitem_screenshare';
var MENUITEM_DIALPAD_INTEGRATION = 'menuitem_dialpad_integration';
var MENUITEM_DIALPAD_FOLDERS = 'menuitem_dialpad_folders';

var MENUITEM_DIALPAD_CUSTOM_LINK = 'menuitem_dialpad_custom_link';
var MENUITEM_DIALPAD_CUSTOM_LINK2 = 'menuitem_dialpad_custom_link2';
var MENUITEM_DIALPAD_CUSTOM_LINK3 = 'menuitem_dialpad_custom_link3';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$( "#btn_dialpad_menu" ).removeAttr('data-transition');
    }
    
    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _dialpad: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _dialpad: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    
    var featureset = webphone_api.common.GetParameterInt('featureset', 10);
    
    var extramenuurl = webphone_api.common.GetParameter('extramenuurl');
    var extramenutxt = webphone_api.common.GetParameter('extramenutxt');
    if (!webphone_api.common.isNull(extramenuurl) && extramenuurl.length > 1 && !webphone_api.common.isNull(extramenutxt) && extramenutxt.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_EXTRA + '"><a data-rel="back">' + extramenutxt + '</a></li>' ).listview('refresh');
    }

    var extramenuurl1 = webphone_api.common.GetParameter('extramenuurl1');
    var extramenutxt1 = webphone_api.common.GetParameter('extramenutxt1');
    if (!webphone_api.common.isNull(extramenuurl1) && extramenuurl1.length > 1 && !webphone_api.common.isNull(extramenutxt1) && extramenutxt1.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_EXTRA1 + '"><a data-rel="back">' + extramenutxt1 + '</a></li>' ).listview('refresh');
    }

    var extramenuurl2 = webphone_api.common.GetParameter('extramenuurl2');
    var extramenutxt2 = webphone_api.common.GetParameter('extramenutxt2');
    if (!webphone_api.common.isNull(extramenuurl2) && extramenuurl2.length > 1 && !webphone_api.common.isNull(extramenutxt2) && extramenutxt1.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_EXTRA2 + '"><a data-rel="back">' + extramenutxt2 + '</a></li>' ).listview('refresh');
    }

    var extramenuurl3 = webphone_api.common.GetParameter('extramenuurl3');
    var extramenutxt3 = webphone_api.common.GetParameter('extramenutxt3');
    if (!webphone_api.common.isNull(extramenuurl3) && extramenuurl3.length > 1 && !webphone_api.common.isNull(extramenutxt3) && extramenutxt3.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_EXTRA3 + '"><a data-rel="back">' + extramenutxt3 + '</a></li>' ).listview('refresh');
    }

    var extramenuurl4 = webphone_api.common.GetParameter('extramenuurl4');
    var extramenutxt4 = webphone_api.common.GetParameter('extramenutxt4');
    if (!webphone_api.common.isNull(extramenuurl4) && extramenuurl4.length > 1 && !webphone_api.common.isNull(extramenutxt4) && extramenutxt4.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_EXTRA4 + '"><a data-rel="back">' + extramenutxt4 + '</a></li>' ).listview('refresh');
    }

    var extramenuurl5 = webphone_api.common.GetParameter('extramenuurl5');
    var extramenutxt5 = webphone_api.common.GetParameter('extramenutxt5');
    if (!webphone_api.common.isNull(extramenuurl5) && extramenuurl5.length > 1 && !webphone_api.common.isNull(extramenutxt5) && extramenutxt5.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_EXTRA5 + '"><a data-rel="back">' + extramenutxt5 + '</a></li>' ).listview('refresh');
    }

    
    if ( featureset > 0 && !webphone_api.common.isNull(webphone_api.common.GetParameter('accounturi')) && webphone_api.common.GetParameter('accounturi').length > 3 )
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_MYACCOUNT + '"><a data-rel="back">' + webphone_api.stringres.get('myaccount') + '</a></li>' ).listview('refresh');
    }

    if ( featureset > 0 && !webphone_api.common.isNull(webphone_api.common.GetParameter('recharge')) && webphone_api.common.GetParameter('recharge').length > 3 )
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_RECHARGE + '"><a data-rel="back">' + webphone_api.stringres.get('recharge') + '</a></li>' ).listview('refresh');
    }
    
// handle hidesettings
    if (webphone_api.common.CanIUseVideo() === true)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_VIDEOCALL + '"><a data-rel="back">' + webphone_api.stringres.get('video_call') + '</a></li>' ).listview('refresh');
    }
    
    if (webphone_api.common.HideSettings('conference', webphone_api.stringres.get('sett_display_name_' + 'conference'), 'conference', true) === false)
    {
        if (webphone_api.common.IsMizuServerOrGateway() &&
                webphone_api.common.IsWindowsSoftphone() === false && webphone_api.common.getuseengine() === webphone_api.global.ENGINE_WEBRTC)

        {
            var cfr = webphone_api.common.GetParameterInt('conferencetype', 1);
            if (cfr === 1 || cfr === 3 || cfr === 5 || cfr === 6 || cfr === 7)
            {
//OPSSTART
                if (webphone_api.common.Glcf() === true)
//OPSEND
                    webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_CONFERENCEROOMS + '"><a data-rel="back">' + webphone_api.stringres.get('menu_confrooms') + '</a></li>' ).listview('refresh');
            }
        }
    }
    
    if (webphone_api.common.CanIUseScreensharing() === true)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_SCREENSHARE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_screenshare') + '</a></li>' ).listview('refresh');
    }
    
    if (webphone_api.common.GetConfigBool('hasfiletransfer', true) !== false && webphone_api.common.IsMizuServerOrGateway())
    {
//OPSSTART
        if (webphone_api.common.Glft() === true)
//OPSEND
            webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_FILETRANSFER + '"><a data-rel="back">' + webphone_api.stringres.get('filetransf_title') + '</a></li>' ).listview('refresh');
    }

    if ( featureset > 0 && !webphone_api.common.isNull(webphone_api.common.GetParameter('p2p')) && webphone_api.common.GetParameter('p2p').length > 3 )
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_P2P + '"><a data-rel="back">' + webphone_api.stringres.get('p2p') + '</a></li>' ).listview('refresh');
    }
    
    if ( featureset > 0)
    {
        if (webphone_api.common.GetParameter2('callback').length > 3 || webphone_api.common.GetConfig('callbacknumber').length > 3 || webphone_api.common.GetParameter2('callbacknumber').length > 3)
        {
            webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_CALLBACK + '"><a data-rel="back">' + webphone_api.stringres.get('callback') + '</a></li>' ).listview('refresh');
        }
    }
    
    if (featureset > 0 && webphone_api.common.GetParameter('accessnumber').length > 1)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_ACCESSNR + '"><a data-rel="back">' + webphone_api.stringres.get('menu_call_access') + '</a></li>' ).listview('refresh');
    }

    if ((webphone_api.common.getuseengine() === webphone_api.global.ENGINE_WEBRTC && (webphone_api.common.GetBrowser() === 'Firefox' || webphone_api.common.GetBrowser() === 'Chrome'))
            || webphone_api.global.audio_devices_loaded === true && (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE() || webphone_api.common.getuseengine() === webphone_api.global.ENGINE_SERVICE || webphone_api.common.getuseengine() === webphone_api.global.ENGINE_JAVA))
    {
        webphone_api.common.PutToDebugLog(5, "EVENT, loading audio devices because loaded: "+webphone_api.global.audio_devices_loaded.toString()+", getuseengine: "+webphone_api.common.getuseengine()+", devicetype: " + webphone_api.common.GetParameter('devicetype')+", browser: "+webphone_api.common.GetBrowser());
//BRANDSTART
        if (webphone_api.common.GetConfigInt('brandid', -1) !== 50) // favafone
//BRANDEND
            webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_AUDIOSETTING + '"><a data-rel="back">' + webphone_api.stringres.get('audio_title') + '</a></li>' ).listview('refresh');
    }
    else
    {
        webphone_api.common.PutToDebugLog(5, "EVENT, not loading audio devices because loaded: "+webphone_api.global.audio_devices_loaded.toString()+", getuseengine: "+webphone_api.common.getuseengine()+", devicetype: " + webphone_api.common.GetParameter('devicetype')+", browser: "+webphone_api.common.GetBrowser());
    }

    var linktext = webphone_api.common.GetParameter('linktext');
    var linkurl = webphone_api.common.GetParameter('linkurl');
    var linktext2 = webphone_api.common.GetParameter('linktext2');
    var linkurl2 = webphone_api.common.GetParameter('linkurl2');
    var linktext3 = webphone_api.common.GetParameter('linktext3');
    var linkurl3 = webphone_api.common.GetParameter('linkurl3');
    if (!webphone_api.common.isNull(linktext) && linktext.length > 0 && !webphone_api.common.isNull(linkurl) && linkurl.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_CUSTOM_LINK + '"><a data-rel="back">' + linktext + '</a></li>' ).listview('refresh');
    }
    if (!webphone_api.common.isNull(linktext2) && linktext2.length > 0 && !webphone_api.common.isNull(linkurl2) && linkurl2.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_CUSTOM_LINK2 + '"><a data-rel="back">' + linktext2 + '</a></li>' ).listview('refresh');
    }
    if (!webphone_api.common.isNull(linktext3) && linktext3.length > 0 && !webphone_api.common.isNull(linkurl3) && linkurl3.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_CUSTOM_LINK3 + '"><a data-rel="back">' + linktext3 + '</a></li>' ).listview('refresh');
    }
    
    
//--    if (featureset > 0 && webphone_api.common.GetParameterInt('voicemail', 2) === 2 && btn_isvoicemail === false)
//--    {
//--        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_VOICEMAIL + '"><a data-rel="back">' + webphone_api.stringres.get('voicemail_title') + '</a></li>' ).listview('refresh');
//--    }
    
    
// add custom menu items if any
    if (!webphone_api.common.isNull(webphone_api.global.custmenusL) && webphone_api.global.custmenusL.length > 0)
    {
        for (var i = 0; i < webphone_api.global.custmenusL.length; i++)
        {
            var cmid = 2000 + i;
            webphone_api.$(menuId).append( '<li id="dialpad_custmenu_' + cmid + '"><a data-rel="back">' + webphone_api.global.custmenusL[i].label + '</a></li>' ).listview('refresh');
        }
    }
    
//--     Moved to HelpWindow
//--    var vcm = webphone_api.common.GetParameter2('webcallme');
//--    if (!webphone_api.common.isNull(vcm) && vcm.length === 1 && vcm !== '0')
//--    {
//--        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_WEBCALLME + '"><a data-rel="back">' + webphone_api.stringres.get('menu_webcallme') + '</a></li>' ).listview('refresh');
//--    }

//--    if (webphone_api.common.GetConfigInt('brandid', -1) === 60) // 101VOICEDT500
//--    {
//--        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_CALLPICKUP_101VOICE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_callpickup') + '</a></li>' ).listview('refresh');
//--    }
    
//--    webphone_api.common.PutToDebugLog(4, 'EVENT, pv_1: ' + webphone_api.common.IsWindowsSoftphone() + '; pv_2: ' + webphone_api.common.GetConfig('needactivation') + '; pv_3: ' + webphone_api.common.CanShowLicKeyInput());
//--    if (webphone_api.common.IsWindowsSoftphone() && webphone_api.common.GetConfig('needactivation') == 'true' && webphone_api.common.CanShowLicKeyInput())
//--    {
//--        webphone_api.common.PutToDebugLog(4, 'EVENT, proversion_4: menu displayed');
//--        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_PROVERSION + '"><a data-rel="back">' + webphone_api.stringres.get('help_proversion') + '</a></li>' ).listview('refresh');
//--    }
    
//--    if (featureset > 0 && webphone_api.common.IsWindowsSoftphone() === true)
//--    {
//--        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_INTEGRATION + '"><a data-rel="back">' + webphone_api.stringres.get('menu_integration') + '...</a></li>' ).listview('refresh');
//--        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_FOLDERS + '"><a data-rel="back">' + webphone_api.stringres.get('menu_folders') + '...</a></li>' ).listview('refresh');
//--        webphone_api.$("#" + MENUITEM_DIALPAD_INTEGRATION).attr("title", webphone_api.stringres.get("hint_integration"));
//--        webphone_api.$("#" + MENUITEM_DIALPAD_FOLDERS).attr("title", webphone_api.stringres.get("hint_folders"));
//--    }
    
//--     Moved to HelpWindow
//--    webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_RECONNECT + '"><a data-rel="back">' + webphone_api.stringres.get('menu_reconnect') + '</a></li>' ).listview('refresh');


    webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_SETTINGS + '"><a data-rel="back">' + webphone_api.stringres.get('settings_title_all') + '</a></li>' ).listview('refresh');
    
    var help_title = webphone_api.stringres.get('menu_help') + '...';
//--    if (webphone_api.common.GetConfigInt('brandid', -1) === 60) { help_title = webphone_api.stringres.get('help_about'); } // 101VOICEDT500
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_HELP + '"><a data-rel="back">' + help_title + '</a></li>' ).listview('refresh');
    
//--    if ( featureset > 0 && !webphone_api.common.isNull(webphone_api.common.GetParameter('homepage')) && webphone_api.common.GetParameter('homepage').length > 3 )
//--    {
//--        webphone_api.$(menuId).append( '<li id="' + MENUITEM_DIALPAD_PROVIDER + '"><a data-rel="back">' + webphone_api.stringres.get('myprovider') + '</a></li>' ).listview('refresh');
//--    }


    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_EXIT + '"><a data-rel="back">' + webphone_api.stringres.get('menu_exit') + '</a></li>' ).listview('refresh');
    }

    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    // moved here, because my account can be openned in a new window so browser can't block popup
    if (itemid === MENUITEM_DIALPAD_MYACCOUNT)
    {
        MyAccount();
        return;
    }
    
    webphone_api.$( '#dialpad_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#dialpad_menu' ).off( 'popupafterclose' );
        
        if (itemid.indexOf('dialpad_custmenu_') === 0) // means it's a custom menu
        {
            itemid = itemid.replace('dialpad_custmenu_', '');
            
            if (webphone_api.common.IsNumber(itemid))
            {
                var cmid = webphone_api.common.StrToInt(itemid);
                cmid = cmid - 2000;
                
                if (cmid >= 0)
                {
                    var action = webphone_api.global.custmenusL[cmid].action;
                    var data = webphone_api.global.custmenusL[cmid].data;
                    var label = webphone_api.global.custmenusL[cmid].label;
                    
                    webphone_api.common.PutToDebugLog(2, "EVENT, MenuItemSelected custom menu action: " + action + "; data: " + data);
    		
                    if (action.toLowerCase() === 'dial')
                    {
                        StartCall(data);
                    }
                    else if (action.toLowerCase() === 'link')
                    {
                        webphone_api.common.OpenWebURL(data, label);
                    }else
                    {
                        webphone_api.common.PutToDebugLog(1, "ERROR, Invalid Menu action: " + action);
                    }
                }
            }
            
        }

        switch (itemid)
        {
            case MENUITEM_DIALPAD_EXTRA:
                var data = webphone_api.common.GetParameter('extramenuurl');
				if (data.toLowerCase().indexOf('http:') === 0 || data.toLowerCase().indexOf('https:') === 0)
				{
                    webphone_api.common.OpenWebURL( data, webphone_api.common.GetParameter('extramenutxt') );
				}
				else if (data.indexOf('chat:') === 0)
				{
                    data = webphone_api.common.Trim(data.substring(data.indexOf('chat:') + 5));
                    webphone_api.common.StartMsg(data, '', '_dialpad');
				}
				else if (data.indexOf('call:') === 0)
				{
                    data = webphone_api.common.Trim(data.substring(data.indexOf('call:') + 5));
                    StartCall(data, false);
				}
				else if (data.length > 0)
				{
                    StartCall(data, false);
				}
                break;
            case MENUITEM_DIALPAD_EXTRA1:
                var data = webphone_api.common.GetParameter('extramenuurl1');
				if (data.toLowerCase().indexOf('http:') === 0 || data.toLowerCase().indexOf('https:') === 0)
				{
                    webphone_api.common.OpenWebURL( data, webphone_api.common.GetParameter('extramenutxt1') );
				}
				else if (data.indexOf('chat:') === 0)
				{
                    data = webphone_api.common.Trim(data.substring(data.indexOf('chat:') + 5));
                    webphone_api.common.StartMsg(data, '', '_dialpad');
				}
				else if (data.indexOf('call:') === 0)
				{
                    data = webphone_api.common.Trim(data.substring(data.indexOf('call:') + 5));
                    StartCall(data, false);
				}
				else if (data.length > 0)
				{
                    StartCall(data, false);
				}
                break;
            case MENUITEM_DIALPAD_EXTRA2:
                var data = webphone_api.common.GetParameter('extramenuurl2');
				if (data.toLowerCase().indexOf('http:') === 0 || data.toLowerCase().indexOf('https:') === 0)
				{
                    webphone_api.common.OpenWebURL( data, webphone_api.common.GetParameter('extramenutxt2') );
				}
				else if (data.indexOf('chat:') === 0)
				{
                    data = webphone_api.common.Trim(data.substring(data.indexOf('chat:') + 5));
                    webphone_api.common.StartMsg(data, '', '_dialpad');
				}
				else if (data.indexOf('call:') === 0)
				{
                    data = webphone_api.common.Trim(data.substring(data.indexOf('call:') + 5));
                    StartCall(data, false);
				}
				else if (data.length > 0)
				{
                    StartCall(data, false);
				}
                break;
            case MENUITEM_DIALPAD_EXTRA3:
                var data = webphone_api.common.GetParameter('extramenuurl3');
				if (data.toLowerCase().indexOf('http:') === 0 || data.toLowerCase().indexOf('https:') === 0)
				{
                    webphone_api.common.OpenWebURL( data, webphone_api.common.GetParameter('extramenutxt3') );
				}
				else if (data.indexOf('chat:') === 0)
				{
                    data = webphone_api.common.Trim(data.substring(data.indexOf('chat:') + 5));
                    webphone_api.common.StartMsg(data, '', '_dialpad');
				}
				else if (data.indexOf('call:') === 0)
				{
                    data = webphone_api.common.Trim(data.substring(data.indexOf('call:') + 5));
                    StartCall(data, false);
				}
				else if (data.length > 0)
				{
                    StartCall(data, false);
				}
                break;
            case MENUITEM_DIALPAD_EXTRA4:
                var data = webphone_api.common.GetParameter('extramenuurl4');
				if (data.toLowerCase().indexOf('http:') === 0 || data.toLowerCase().indexOf('https:') === 0)
				{
                    webphone_api.common.OpenWebURL( data, webphone_api.common.GetParameter('extramenutxt4') );
				}
				else if (data.indexOf('chat:') === 0)
				{
                    data = webphone_api.common.Trim(data.substring(data.indexOf('chat:') + 5));
                    webphone_api.common.StartMsg(data, '', '_dialpad');
				}
				else if (data.indexOf('call:') === 0)
				{
                    data = webphone_api.common.Trim(data.substring(data.indexOf('call:') + 5));
                    StartCall(data, false);
				}
				else if (data.length > 0)
				{
                    StartCall(data, false);
				}
                break;
            case MENUITEM_DIALPAD_EXTRA5:
                var data = webphone_api.common.GetParameter('extramenuurl5');
				if (data.toLowerCase().indexOf('http:') === 0 || data.toLowerCase().indexOf('https:') === 0)
				{
                    webphone_api.common.OpenWebURL( data, webphone_api.common.GetParameter('extramenutxt5') );
				}
				else if (data.indexOf('chat:') === 0)
				{
                    data = webphone_api.common.Trim(data.substring(data.indexOf('chat:') + 5));
                    webphone_api.common.StartMsg(data, '', '_dialpad');
				}
				else if (data.indexOf('call:') === 0)
				{
                    data = webphone_api.common.Trim(data.substring(data.indexOf('call:') + 5));
                    StartCall(data, false);
				}
				else if (data.length > 0)
				{
                    StartCall(data, false);
				}
                break;
            case MENUITEM_DIALPAD_SETTINGS:
                webphone_api.common.OpenSettings(true, 14);
                break;
            case MENUITEM_DIALPAD_PROVIDER:
                webphone_api.common.OpenWebURL( webphone_api.common.GetParameter('homepage'), webphone_api.stringres.get('myprovider') );
                break;
            case MENUITEM_DIALPAD_P2P:
                webphone_api.common.Phone2Phone('', '');
                break;
            case MENUITEM_DIALPAD_CALLBACK:
                Callback();
                break;
            case MENUITEM_DIALPAD_RECHARGE:
                CreditRecharge();
                break;
            case MENUITEM_HELP:
                webphone_api.common.HelpWindow('dialpad');
                break;
            case MENUITEM_EXIT:
                webphone_api.common.Exit();
                break;
            case MENUITEM_DIALPAD_ACCESSNR:
                CallAccessNumber();
                break;
            case MENUITEM_DIALPAD_VOICEMAIL:
                MenuVoicemail();
                break;
            case MENUITEM_DIALPAD_FILETRANSFER:
                webphone_api.common.FileTransfer(webphone_api.$('#phone_number').val());
                break;
//OPSSTART
            case MENUITEM_DIALPAD_PROVERSION:
                webphone_api.common.UpgradeToProVersion();
                break;
//OPSEND
            case MENUITEM_DIALPAD_AUDIOSETTING:
                webphone_api.devicepopup();
                break;
//--            case MENUITEM_DIALPAD_RECONNECT:
//--                ReConnect();
//--                break;
//--            case MENUITEM_DIALPAD_WEBCALLME:
//--                GenerateWebcallmeLink();
//--                break;
            case MENUITEM_DIALPAD_CONFERENCEROOMS:
                ConferenceDialpad('');
                break;
            case MENUITEM_DIALPAD_VIDEOCALL:
                VideoCall('');
                break;
            case MENUITEM_DIALPAD_CALLPICKUP_101VOICE:
                StartCall('**', false);
                break;
            case MENUITEM_DIALPAD_SCREENSHARE:
                ScreenShare();
                break;
            case MENUITEM_DIALPAD_INTEGRATION:
                Integration();
                break;
            case MENUITEM_DIALPAD_FOLDERS:
                Folders();
                break;

            case MENUITEM_DIALPAD_CUSTOM_LINK:
                webphone_api.common.OpenWebURL( webphone_api.common.GetParameter('linkurl'), webphone_api.common.GetParameter('linktext') );
                break;
            case MENUITEM_DIALPAD_CUSTOM_LINK2:
                webphone_api.common.OpenWebURL( webphone_api.common.GetParameter('linkurl2'), webphone_api.common.GetParameter('linktext2') );
                break;
            case MENUITEM_DIALPAD_CUSTOM_LINK3:
                webphone_api.common.OpenWebURL( webphone_api.common.GetParameter('linkurl3'), webphone_api.common.GetParameter('linktext3') );
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: MenuItemSelected", err); }
}

function ConferenceDialpad(number)
{
    try{
        var cfr = webphone_api.common.GetParameterInt('conferencetype', 1);
        if (cfr === 1 || cfr === 3)
        {
        // UI for user to initiate conference
            var popupWidth = webphone_api.common.GetDeviceWidth();
            if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
            {
                popupWidth = Math.floor(popupWidth / 1.2);
            }else
            {
                popupWidth = 220;
            }
            var btnimage = 'btn_add_contact_txt.png';
            var msg = webphone_api.stringres.get('confdtmf_msg');
            if (webphone_api.common.isNull(number)) { number = ''; }

            var template = '' +
            '<div id="conferencedtmf_popup" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

            '<div data-role="header" data-theme="b">' +
                '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
                '<h1 class="adialog_title">' + webphone_api.stringres.get('menu_confrooms') + '</h1>' +
            '</div>' +
            '<div role="main" class="ui-content adialog_content adialog_btn_nexttoinput">' +
                '<span>' + msg + '</span>' +
                '<div style="clear: both;"><!--//--></div>' +
                '<input type="text" id="conferencedtmf_input" name="setting_item" data-theme="a" autocapitalize="off" value="' + number + '"/>' +
                '<button id="btn_pickct" class="btn_nexttoinput ui-btn ui-btn-corner-all ui-btn-b noshadow"><img src="' + webphone_api.common.GetElementSource() + 'images/' + btnimage + '"></button>' +
            '</div>' +
            '<div data-role="footer" data-theme="b" class="adialog_footer">' +
                '<a href="javascript:;" id="adialog_positive" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_ok') + '</a>' +
                '<a href="javascript:;" id="adialog_negative" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back">' + webphone_api.stringres.get('btn_cancel') + '</a>' +
            '</div>' +
            '</div>';

            var popupafterclose = function () {};

            webphone_api.$.mobile.activePage.append(template).trigger("create");
            //webphone_api.$.mobile.activePage.append(template).trigger("pagecreate");

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
                    webphone_api.$('#btn_pickct').off('click');
                    popupafterclose();
                }
            });

            var textBox = document.getElementById('conferencedtmf_input');
            if (!webphone_api.common.isNull(number) && number.length > 1)
            {
                textBox.value = webphone_api.common.Trim(number);
            }
            if (!webphone_api.common.isNull(textBox)) { textBox.focus(); } // setting cursor to text input

            setTimeout(function ()
            {
                if (!webphone_api.common.isNull(textBox)) { textBox.focus(); } // setting cursor to text input
            }, 150);

            webphone_api.$('#adialog_positive').on('click', function (event)
            {
                webphone_api.common.PutToDebugLog(5,'EVENT, call Conferencedtmf ok onclick');

                var textboxval = webphone_api.common.Trim(textBox.value);
                webphone_api.$( '#conferencedtmf_popup' ).on( 'popupafterclose', function( event )
                {
                    if (!webphone_api.common.isNull(textboxval) && textboxval.length > 0)
                    {
                        webphone_api.common.PutToDebugLog(2, 'EVENT, mlogic ConferenceDialpad: ' + textboxval);
                        webphone_api.conference(textboxval);
                    }else
                    {
                        webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_4'));
                    }
                });
            });

            webphone_api.$('#adialog_negative').on('click', function (event)
            {
                ;
            });

            webphone_api.$('#btn_pickct').on('click', function (event)
            {
                webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");

                webphone_api.$( '#conferencedtmf_popup' ).on( 'popupafterclose', function( event )
                {
                    webphone_api.$( '#conferencedtmf_popup' ).off( 'popupafterclose' );

                    webphone_api.common.PickContact(ConferenceDialpad);
                });
            });
        }else
        {
            webphone_api.common.CreateConferenceRoom(true,number);
        }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: ConferenceDialpad", err); }
}

function Integration(popupafterclose)
{
    try{
    var popupWidth = webphone_api.common.GetDeviceWidth();
    if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
    {
        popupWidth = Math.floor(popupWidth / 1.2);
    }else
    {
        popupWidth = 220;
    }

    var list = '';
    var item = '<li id="[ITEMID]"><a data-rel="back" title="[ITEMHINT]">[ITEMTITLE]</a></li>';

    var itemTemp = '';

    itemTemp = item.replace('[ITEMID]', '#item_integrate_outlook');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_int_outlook'));
    itemTemp = itemTemp.replace('[ITEMHINT]', webphone_api.stringres.get('hint_int_outlook'));
    list = list + itemTemp;
    itemTemp = '';
    itemTemp = item.replace('[ITEMID]', '#item_integrate_chrome');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_int_chrome'));
    itemTemp = itemTemp.replace('[ITEMHINT]', webphone_api.stringres.get('hint_int_chrome'));
    list = list + itemTemp;
    itemTemp = '';

    var template = '' +
'<div id="integration_window" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('menu_integration') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content" style="padding: 0; margin: 0;">' +

        '<ul id="integration_window_ul" data-role="listview" data-inset="true" data-icon="false" style="margin: 0;">' +
            list +
        '</ul>' +
//        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back">' + webphone_api.stringres.get('btn_close') + '</a>' +
//        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" data-transition="flow">Delete</a>' +
    '</div>' +
    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" style="width: 98%;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_close') + '</a>' +
    '</div>' +
'</div>';

    popupafterclose = popupafterclose ? popupafterclose : function () {};

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

            webphone_api.$('#integration_window_ul').off('click', 'li');

            popupafterclose();
        }
    });

    webphone_api.$('#integration_window_ul').on('click', 'li', function(event)
    {
        var itemid = webphone_api.$(this).attr('id');

        webphone_api.$( '#integration_window' ).on( 'popupafterclose', function( event )
        {
            webphone_api.$( '#integration_window' ).off( 'popupafterclose' );
            
            if (itemid === '#item_integrate_outlook')
            {
                webphone_api.common.PutToDebugLog(4, 'EVENT, _dialpad: Integration outlook clicked');

                var url = webphone_api.common.AddJscommport(webphone_api.global.WIN_SOFTPHONE_URL) + '?extcmd_integrate_outlook';
                webphone_api.common.WinSoftphoneHttpReq(url, 'GET', '', '',function (resp)
                {
                    webphone_api.common.PutToDebugLog(2, 'EVENT, Integration outlook answer: ' + resp);
                });
            }
            else if (itemid === '#item_integrate_chrome')
            {
                webphone_api.common.PutToDebugLog(4, 'EVENT, _dialpad: Integration chrome clicked');
                
                var url = webphone_api.common.AddJscommport(webphone_api.global.WIN_SOFTPHONE_URL) + '?extcmd_integrate_chorme';
                webphone_api.common.WinSoftphoneHttpReq(url, 'GET', '', '',function (resp)
                {
                    webphone_api.common.PutToDebugLog(2, 'EVENT, Integration chrome answer: ' + resp);
                });
            }
            else
            {
                webphone_api.common.PutToDebugLog(2, 'ERROR, _dialpad: Integration invalid item id: ' + itemid);
            }
        });
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: Integration", err); }
}

function Folders(popupafterclose)
{
    try{
    var popupWidth = webphone_api.common.GetDeviceWidth();
    if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
    {
        popupWidth = Math.floor(popupWidth / 1.2);
    }else
    {
        popupWidth = 220;
    }

    var list = '';
    var item = '<li id="[ITEMID]"><a data-rel="back" title="[ITEMHINT]">[ITEMTITLE]</a></li>';

    var itemTemp = '';

    itemTemp = item.replace('[ITEMID]', '#item_folders_bin');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_folders_bin'));
    itemTemp = itemTemp.replace('[ITEMHINT]', webphone_api.stringres.get('hint_folders_bin'));
    list = list + itemTemp;
    itemTemp = '';
    itemTemp = item.replace('[ITEMID]', '#item_folders_data');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_folders_data'));
    itemTemp = itemTemp.replace('[ITEMHINT]', webphone_api.stringres.get('hint_folders_data'));
    list = list + itemTemp;
    itemTemp = '';

    var template = '' +
'<div id="folders_window" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('menu_folders') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content" style="padding: 0; margin: 0;">' +

        '<ul id="folders_window_ul" data-role="listview" data-inset="true" data-icon="false" style="margin: 0;">' +
            list +
        '</ul>' +
//        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back">' + webphone_api.stringres.get('btn_close') + '</a>' +
//        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" data-transition="flow">Delete</a>' +
    '</div>' +
    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" style="width: 98%;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_close') + '</a>' +
    '</div>' +
'</div>';

    popupafterclose = popupafterclose ? popupafterclose : function () {};

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

            webphone_api.$('#folders_window_ul').off('click', 'li');

            popupafterclose();
        }
    });

    webphone_api.$('#folders_window_ul').on('click', 'li', function(event)
    {
        var itemid = webphone_api.$(this).attr('id');

        webphone_api.$( '#folders_window' ).on( 'popupafterclose', function( event )
        {
            webphone_api.$( '#folders_window' ).off( 'popupafterclose' );
            
            if (itemid === '#item_folders_bin')
            {
                webphone_api.common.PutToDebugLog(4, 'EVENT, _dialpad: folders BIN clicked');

                var url = webphone_api.common.AddJscommport(webphone_api.global.WIN_SOFTPHONE_URL) + '?extcmd_folder_bin';
                webphone_api.common.WinSoftphoneHttpReq(url, 'GET', '', '', function (resp)
                {
                    webphone_api.common.PutToDebugLog(2, 'EVENT, folders BIN answer: ' + resp);
                });
            }
            else if (itemid === '#item_folders_data')
            {
                webphone_api.common.PutToDebugLog(4, 'EVENT, _dialpad: folders DATA clicked');
                
                var url = webphone_api.common.AddJscommport(webphone_api.global.WIN_SOFTPHONE_URL) + '?extcmd_folder_data';
                webphone_api.common.WinSoftphoneHttpReq(url, 'GET', '', '', function (resp)
                {
                    webphone_api.common.PutToDebugLog(2, 'EVENT, folders DATA answer: ' + resp);
                });
            }
            else
            {
                webphone_api.common.PutToDebugLog(2, 'ERROR, _dialpad: folders invalid item id: ' + itemid);
            }
        });
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: Folders", err); }
}

// softphone -> my account -> open in a new window if our server / our webportal (path contains /mvweb)
function MyAccount()
{
    try{
    var uri = webphone_api.common.GetParameter('accounturi');
    if (webphone_api.common.IsMizuServer() === true || uri.indexOf('/mvweb') > 0) // open url in new window
    {
        uri = webphone_api.common.OpenWebURL( uri, '', false ); // replace keywords
        if (webphone_api.common.IsWindowsSoftphone() === true)
        {
            webphone_api.common.OpenLinkInExternalBrowser(uri);
        }else
        {
            window.open(uri);
        }
    }else
    {
        webphone_api.common.OpenWebURL( uri, webphone_api.stringres.get('myaccount') );
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: MyAccount", err); }
}

function ScreenShare(phoneNr) // initiate screenshare call if a number is entered in phone field, or request a number from the user
{
    try{
    var field = document.getElementById('phone_number');
    if ( webphone_api.common.isNull(field) ) { return; }
    var number = field.value;
    if (!webphone_api.common.isNull(number))
    {
        number = webphone_api.common.Trim(number);
        if (number.length > 0)
        {
            number = webphone_api.common.NormalizeNumber(number);
            webphone_api.common.PutToDebugLog(4, 'EVENT, _dialpad initiate screenshare call to: ' + number);
            webphone_api.screenshare(number);
            return;
        }
    }
    
    var popupWidth = webphone_api.common.GetDeviceWidth();
    if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
    {
        popupWidth = Math.floor(popupWidth / 1.2);
    }else
    {
        popupWidth = 220;
    }
    var btnimage = 'btn_add_contact_txt.png';
    
    var template = '' +
'<div id="adialog_screensharecall" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('screenshare_call') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content adialog_btn_nexttoinput">' +
        '<span>' + webphone_api.stringres.get('phone_nr') + ':</span>' +
        '<div style="clear: both;"><!--//--></div>' +
        '<input type="text" id="screensharecall_input" name="screensharecall_input" data-theme="a" autocapitalize="off"/>' +
        '<button id="btn_pickct" class="btn_nexttoinput ui-btn ui-btn-corner-all ui-btn-b noshadow"><img src="' + webphone_api.common.GetElementSource() + 'images/' + btnimage + '"></button>' +
    '</div>' +
    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" id="adialog_positive" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_sharescreen') + '</a>' +
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
            webphone_api.$('#btn_pickct').off('click');
            popupafterclose();
        }
    });
    
//-- listen for enter onclick, and click OK button
//-- no need for this, because it reloads the page
//--    webphone_api.$( "#adialog_videocall" ).keypress(function( event )
//--    {
//--        if ( event.which === 13 )
//--        {
//--            event.preventDefault();
//--            webphone_api.$("#adialog_positive").click();
//--        }else
//--        {
//--            return;
//--        }
//--    });

    var screensharecall = document.getElementById('screensharecall_input');
    if (!webphone_api.common.isNull(screensharecall))
    {
        if (!webphone_api.common.isNull(phoneNr) && phoneNr.length > 0) { screensharecall.value = phoneNr; }
        screensharecall.focus();
    } // setting cursor to text input
    
    webphone_api.$('#adialog_positive').on('click', function (event)
    {
        webphone_api.$( '#adialog_screensharecall' ).on( 'popupafterclose', function( event )
        {
            number = screensharecall.value;

            webphone_api.common.PutToDebugLog(5,"EVENT, _dialpad ScreenShare 1 ok: " + number);

            if (webphone_api.common.isNull(number) || (webphone_api.common.Trim(number)).length < 1)
            {
                return;
            }else
            {
                number = webphone_api.common.Trim(number);
            }

            number = webphone_api.common.NormalizeNumber(number);
            webphone_api.screenshare(number);
        });
    });

    webphone_api.$('#adialog_negative').on('click', function (event)
    {
        ;
    });
    
    webphone_api.$('#btn_pickct').on('click', function (event)
    {
        webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");

        webphone_api.$( '#adialog_screensharecall' ).on( 'popupafterclose', function( event )
        {
            webphone_api.$( '#adialog_screensharecall' ).off( 'popupafterclose' );

            webphone_api.common.PickContact(ScreenShare);
        });
    });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: ScreenShare", err); }
}


//--function ReConnect() // restart the engine
//--{
//--    try{
//-- !!! MUST USE API_ReStart for NS here
//--    webphone_api.global.authenticated_displayed = false;
//--    webphone_api.startInner();
//--    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: ReConnect", err); }
//--}

function CreditRecharge()
{
    try{
    var ruri = webphone_api.common.GetParameter('recharge');
//--    if (webphone_api.common.GetConfigInt('brandid', -1) === 50)
//--    {
//--        webphone_api.common.OpenLinkInInternalBrowser(ruri);
//--        return;
//--    }
        
    if ((webphone_api.common.Trim(ruri)).indexOf('*') !== 0) // if starts with * => httpapi ELSE link
    {
        webphone_api.common.OpenWebURL( ruri, webphone_api.stringres.get('recharge') );
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
    
    var template = '' +
'<div id="adialog_recharge" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('recharge') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content">' +
        '<span>' + webphone_api.stringres.get('recharge_msg') + ':</span>' +
        '<input type="text" id="recharge_input" name="recharge_input" data-theme="a" autocapitalize="off"/>' +
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
//--    webphone_api.$( "#adialog_recharge" ).keypress(function( event )
//--    {
//--        if ( event.which === 13 )
//--        {
//--            event.preventDefault();
//--            webphone_api.$("#adialog_positive").click();
//--        }else
//--        {
//--            return;
//--        }
//--    });

    var recharge = document.getElementById('recharge_input');
    if (!webphone_api.common.isNull(recharge)) { recharge.focus(); } // setting cursor to text input
    
    webphone_api.$('#adialog_positive').on('click', function (event)
    {
        webphone_api.common.PutToDebugLog(5,"EVENT, _dialpad CreditRecharge 1 ok");

        var pin = recharge.value;
        
        if (webphone_api.common.isNull(pin) || (webphone_api.common.Trim(pin)).length < 1)
        {
            webphone_api.common.ShowToast(webphone_api.stringres.get('recharge_error'));
            return;
        }else
        {
            pin = webphone_api.common.Trim(pin);
        }
        
        webphone_api.common.UriParser(webphone_api.common.GetParameter('recharge'), pin, '', '', '', 'recharge');
    });

    webphone_api.$('#adialog_negative').on('click', function (event)
    {
        ;
    });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: CreditRecharge", err); }
}

function VideoCall(phoneNr) // initiate video call if a number is entered in phone field, or request a number from the user
{
    try{
    var field = document.getElementById('phone_number');
    if ( webphone_api.common.isNull(field) ) { return; }
    var number = field.value;
    if (!webphone_api.common.isNull(number))
    {
        number = webphone_api.common.Trim(number);
        if (number.length > 0)
        {
            StartCall(number, true);
            return;
        }
    }
    
    var lastDialed = webphone_api.common.GetParameter("redial");
    if (webphone_api.common.isNull(lastDialed)) { lastDialed = ''; }
    
    var popupWidth = webphone_api.common.GetDeviceWidth();
    if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
    {
        popupWidth = Math.floor(popupWidth / 1.2);
    }else
    {
        popupWidth = 220;
    }
    var btnimage = 'btn_add_contact_txt.png';
    
    var template = '' +
'<div id="adialog_videocall" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('video_call') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content adialog_btn_nexttoinput">' +
        '<span>' + webphone_api.stringres.get('phone_nr') + ':</span>' +
        '<div style="clear: both;"><!--//--></div>' +
        '<input type="text" id="videocall_input" name="videocall_input" value="' + lastDialed + '" data-theme="a" autocapitalize="off"/>' +
        '<button id="btn_pickct" class="btn_nexttoinput ui-btn ui-btn-corner-all ui-btn-b noshadow"><img src="' + webphone_api.common.GetElementSource() + 'images/' + btnimage + '"></button>' +
    '</div>' +
    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" id="adialog_positive" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_videocall') + '</a>' +
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
            webphone_api.$('#btn_pickct').off('click');
            popupafterclose();
        }
    });
    
//-- listen for enter onclick, and click OK button
//-- no need for this, because it reloads the page
//--    webphone_api.$( "#adialog_videocall" ).keypress(function( event )
//--    {
//--        if ( event.which === 13 )
//--        {
//--            event.preventDefault();
//--            webphone_api.$("#adialog_positive").click();
//--        }else
//--        {
//--            return;
//--        }
//--    });

    var videocall = document.getElementById('videocall_input');
    if (!webphone_api.common.isNull(videocall))
    {
        if (!webphone_api.common.isNull(phoneNr) && phoneNr.length > 0) { videocall.value = phoneNr; }
        videocall.focus();
    } // setting cursor to text input
    
    webphone_api.$('#adialog_positive').on('click', function (event)
    {
        webphone_api.$( '#adialog_videocall' ).on( 'popupafterclose', function( event )
        {
            number = videocall.value;

            webphone_api.common.PutToDebugLog(5,"EVENT, _dialpad VideoCall 1 ok: " + number);

            if (webphone_api.common.isNull(number) || (webphone_api.common.Trim(number)).length < 1)
            {
                return;
            }else
            {
                number = webphone_api.common.Trim(number);
            }
            webphone_api.common.SaveParameter("redial", number);
            webphone_api.videocall(number);
        });
    });

    webphone_api.$('#adialog_negative').on('click', function (event)
    {
        ;
    });
    
    webphone_api.$('#btn_pickct').on('click', function (event)
    {
        webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");

        webphone_api.$( '#adialog_videocall' ).on( 'popupafterclose', function( event )
        {
            webphone_api.$( '#adialog_videocall' ).off( 'popupafterclose' );

            webphone_api.common.PickContact(VideoCall);
        });
    });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: VideoCall", err); }
}

function MenuVoicemail()
{
    try{
    var vmNumber = webphone_api.common.GetParameter("voicemailnum");
//-- if mizu server or mizu upper server (don't check if mizu gateway), then auto set the voicemailnumber to 5001
    if ((webphone_api.common.isNull(vmNumber) || vmNumber.length < 1) && webphone_api.common.IsMizuServer() === true)
    {
        vmNumber = '5001';
        webphone_api.common.SaveParameter('voicemailnum', vmNumber);
    }

    if (!webphone_api.common.isNull(vmNumber) && vmNumber.length > 0)
    {
        StartCall(vmNumber);
    }else
    {
        webphone_api.common.SetVoiceMailNumber(function (vmnr)
        {
            if (!webphone_api.common.isNull(vmnr) && vmnr.length > 0) { StartCall(vmnr); }
        });
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: MenuVoicemail", err); }
}

function Callback() // Menu -> Callback
{
    try{
    var cburi = webphone_api.common.GetParameter2('callback');
    if (cburi.length < 3) { cburi = webphone_api.common.GetConfig('callback'); }

    var cbnr = webphone_api.common.GetParameter2('callbacknumber');
    if (cbnr.length < 3) { cbnr = webphone_api.common.GetConfig('callbacknumber'); }
    
// callback with http request uri
    if (!webphone_api.common.isNull(cburi) && cburi.length > 2)
    {
        var popupWidth = webphone_api.common.GetDeviceWidth();
        if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
        {
            popupWidth = Math.floor(popupWidth / 1.2);
        }else
        {
            popupWidth = 220;
        }

        var template = '' +
    '<div id="adialog_callback" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

        '<div data-role="header" data-theme="b">' +
            '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
            '<h1 class="adialog_title">' + webphone_api.stringres.get('callback') + '</h1>' +
        '</div>' +
        '<div role="main" class="ui-content adialog_content">' +
            '<span>' + webphone_api.stringres.get('callback_src') + '</span>' +
            '<input type="text" id="callback_input" name="callback_input" data-theme="a" autocapitalize="off"/>' +
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

//--     listen for enter onclick, and click OK button
//-- no need for this, because it reloads the page
//--        webphone_api.$( "#adialog_callback" ).keypress(function( event )
//--        {
//--            if ( event.which === 13 )
//--            {
//--                event.preventDefault();
//--                webphone_api.$("#adialog_positive").click();
//--            }else
//--            {
//--                return;
//--            }
//--        });

        var callback = document.getElementById('callback_input');
        if (!webphone_api.common.isNull(callback)) { callback.focus(); } // setting cursor to text input

        var lastCallbackNr = webphone_api.common.GetParameter('last_callback_nr');

        if (!webphone_api.common.isNull(lastCallbackNr) && lastCallbackNr.length > 0)
        {
            callback.value = lastCallbackNr;
        }

        webphone_api.$('#adialog_positive').on('click', function (event)
        {
            webphone_api.common.PutToDebugLog(5,"EVENT, _dialpad Phone2Phone 1 ok");

            var callbacknr = callback.value;

            if (webphone_api.common.isNull(callbacknr) || (webphone_api.common.Trim(callbacknr)).length < 1)
            {
                webphone_api.common.ShowToast(webphone_api.stringres.get('callback_src'));
                return;
            }else
            {
                callbacknr = webphone_api.common.Trim(callbacknr);
            }

            webphone_api.common.UriParser(cburi, '', callbacknr, '', '', 'callback');
            webphone_api.common.SaveParameter('last_callback_nr', callbacknr);
        });

        webphone_api.$('#adialog_negative').on('click', function (event)
        {
            ;
        });
    
        }else if (!webphone_api.common.isNull(cbnr) && cbnr.length > 2)
        {
            if (webphone_api.isregistered() === true)
            {
                StartCall(cbnr);
            }else
            {
                // on pc show sip:uri AND tel:uri, on mobile show only tel:uri
                var mob = '<a href="tel:' + cbnr + '">' + cbnr + '</a>';
                var sip = '<a href="sip:' + cbnr + '">' + cbnr + '</a>';
                
                var htmlcont = '';
                var os = webphone_api.common.GetOs(); // Windows, MacOS, Linux
                if (os === 'Windows' || os === 'MacOS' || os === 'Linux')
                {
                    htmlcont = webphone_api.stringres.get('cb_callonnative') + ': ' + sip + '<br /><br />' + webphone_api.stringres.get('cb_callonmobile') + ': ' + mob;
                }else
                {
                    htmlcont = webphone_api.stringres.get('cb_callonmobile') + ': ' + mob;
                }
                
                webphone_api.common.AlertDialog(webphone_api.stringres.get('callback'), htmlcont);
            }
        }else
        {
            webphone_api.common.PutToDebugLog(2, 'ERROR,_dialpad: Callback, cannot find callback method, number: ' + cbnr + '; uri: ' + cburi);
        }
        
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: Callback", err); }
}

function CallAccessNumber()
{
    try{
//-- accessnumber -> on mobile call with native dialer, on pc call on voip
    var nr = webphone_api.common.GetParameter('accessnumber');
    
    var os = webphone_api.common.GetOs(); // Windows, MacOS, Linux
    if (os === 'Windows' || os === 'MacOS' || os === 'Linux')
    {
        webphone_api.common.CallNumberProtocolHandler('sip', nr);
    }else
    {
        webphone_api.common.CallNumberProtocolHandler('tel', nr);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: CallAccessNumber", err); }
}

function onStop(event)
{
    try{
        if(webphone_api.common.CanLog(4)) { webphone_api.common.PutToDebugLog(4, "EVENT, _dialpad: onStop"); }
    webphone_api.global.isDialpadStarted = false;
    
    document.getElementById('phone_number').value = '';
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_dialpad: onStop", err); }
}

function onDestroy (event){} // deprecated by onstop


// public members and methods
return {
    onCreate: onCreate,
    onStart: onStart,
    onStop: onStop,
    onDestroy: onDestroy,
    PopulateListRecents: PopulateListRecents,
    PopulateListRecents: PopulateListRecents,
    HandleAutoaction: HandleAutoaction,
    MeasureDialPad: MeasureDialPad
};
})();
