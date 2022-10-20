/* global webphone_api.$, common */

// Call page
webphone_api._call = (function ()
{
var calltype = '';
var callnumber = '';
var showcallfwd = false; // dislplay call forward option in menu: callforward csak bejovo hivas ring-nel
var showignore = false;
var hanguponchat = false; //-- bejovo hivasnal call ablakbol chat-et valaszt es ringing-ben van akkor hangup call
var callmode = 0;  //  callmode: 0=call-audio, 1=call-audiovideo, 2=call-screenshare


function onCreate (event) // called only once - bind events here
{
    try{
        if(webphone_api.common.CanLog(4)) { webphone_api.common.PutToDebugLog(4, "EVENT, _call: onCreate"); }
    
    webphone_api.$('#call_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_call_menu").on("click", function()
    {
        CreateOptionsMenu('#call_menu_ul');
    });
    webphone_api.$("#btn_call_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    
    webphone_api.$("#btn_hangup").on("click", function()
    {
        if(webphone_api.common.CanLog(4)) { webphone_api.common.PutToDebugLog(4, 'EVENT, _call Hangup onclick'); }
        HangupCall();
    });
    
    webphone_api.$("#btn_accept").on("click", function()
    {
        if(webphone_api.common.CanLog(4)) { webphone_api.common.PutToDebugLog(4, 'EVENT, _call AcceptCall onclick'); }
        AcceptCall(true);
    });
    
    webphone_api.$("#btn_reject").on("click", function()
    {
        webphone_api.common.PutToDebugLog(4, 'EVENT, _call RejectCall onclick');
        RejectCall(true);
    });
    
    webphone_api.$("#btn_ml_accept").on("click", function()
    {
        webphone_api.common.PutToDebugLog(4, 'EVENT, _call multiline Accept onclick');
        AcceptCall(true);
    });
    
    webphone_api.$("#btn_ml_reject").on("click", function()
    {
        webphone_api.common.PutToDebugLog(4, 'EVENT, _call RejectCallMultiline onclick');
        RejectCallMultiline(true);
    });
    
    webphone_api.$("#btn_ml_more").on("click", function()
    {
        webphone_api.common.PutToDebugLog(4, 'EVENT, _call multiline more onclick');
        webphone_api.$('#btn_call_menu').click();
    });
    
    webphone_api.$("#btn_hangup").attr("title", webphone_api.stringres.get("hint_hangup"));
    webphone_api.$("#btn_accept").attr("title", webphone_api.stringres.get("hint_accept"));
    webphone_api.$("#btn_reject").attr("title", webphone_api.stringres.get("hint_reject"));
    webphone_api.$("#calledcaller").attr("title", webphone_api.stringres.get("hint_called"));
    webphone_api.$("#status_call").attr("title", webphone_api.stringres.get("hint_callstatus"));
    webphone_api.$("#call_duration").attr("title", webphone_api.stringres.get("hint_callduration"));
    
//--    webphone_api.$("#btn_accept_end").attr("title", webphone_api.stringres.get("hint_accept_end"));
//--    webphone_api.$("#btn_reject_ml").attr("title", webphone_api.stringres.get("hint_reject_new"));
//--    webphone_api.$("#btn_accept_hold").attr("title", webphone_api.stringres.get("hint_accept_hold"));
    webphone_api.$("#btn_ml_accept").attr("title", webphone_api.stringres.get("hint_accept"));
    webphone_api.$("#btn_reject_ml").attr("title", webphone_api.stringres.get("hint_reject_new"));
    webphone_api.$("#btn_ml_more").attr("title", webphone_api.stringres.get("hint_more"));
    
    webphone_api.$("#btn_audiodevice").on("click", function()
    {
        webphone_api.common.PutToDebugLog(4, 'EVENT, _call webphone_audiodevice onclick');
        webphone_api.devicepopup();
    });
    
    
  //--  var idx = 0;
    var timerid;
    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_call')
        {
            if ( !webphone_api.common.isNull(timerid) ) { clearTimeout(timerid); }
            timerid = setTimeout(function ()
            {
                AddCallFunctions(false);
                MeasureCall();
//--                idx++;
//--                webphone_api.common.PutToDebugLog(2, 'idx = ' + idx);
            }, 100);
        }
    });
    
    webphone_api.$("#numpad_btn_dp_1").on("click", function()
    {
        SendDtmf('1');
//--        webphone_api.play(1, 'sound/rtc_ringtone.wav', false, true);
//--        webphone_api.common.PrintCallSessions();
    });
    webphone_api.$("#numpad_btn_dp_2").on("click", function() { SendDtmf('2'); });
    webphone_api.$("#numpad_btn_dp_3").on("click", function() { SendDtmf('3'); });
    webphone_api.$("#numpad_btn_dp_4").on("click", function() { SendDtmf('4'); });
    webphone_api.$("#numpad_btn_dp_5").on("click", function() { SendDtmf('5'); });
    webphone_api.$("#numpad_btn_dp_6").on("click", function() { SendDtmf('6'); });
    webphone_api.$("#numpad_btn_dp_7").on("click", function() { SendDtmf('7'); });
    webphone_api.$("#numpad_btn_dp_8").on("click", function() { SendDtmf('8'); });
    webphone_api.$("#numpad_btn_dp_9").on("click", function() { SendDtmf('9'); });
    webphone_api.$("#numpad_btn_dp_0").on("click", function() { SendDtmf('0'); });
    webphone_api.$("#numpad_btn_dp_ast").on("click", function() { SendDtmf('*'); });
    webphone_api.$("#numpad_btn_dp_diez").on("click", function() { SendDtmf('#'); });

    webphone_api.$( "#page_call" ).keypress(function( event )
    {        
        HandleKeyPress(event);
    });

    webphone_api.$( "#page_call" ).keydown(function(event)
    {
        try{
            var charCode = (event.keyCode) ? event.keyCode : event.which; // workaround for firefox
        
            if (charCode == ctrlKey) { ctrlDown = true; return true; }
            if (charCode == altKey) { altDown = true; return true; }
            if (charCode == shiftKey) { shiftDown = true; return true; }
            if (event.ctrlKey || event.metaKey || event.altKey) { specialKeyDown = true; return true; }


            if (charCode === 13) // enter
            {
                var active_popups = webphone_api.$.mobile.activePage.find(".messagePopup");
                if (!webphone_api.common.isNull(active_popups) && active_popups.length > 0)
                {
                    webphone_api.$("#adialog_positive").click();
                    event.preventDefault();
                }
                else if (webphone_api.$('#acceptreject_layout').is(':visible')) // acceptreject_layout   check is visible
                {
                    webphone_api.$("#btn_accept").click();
                    event.preventDefault();
                }
                else if (webphone_api.$('#mline_layout').is(':visible')) // acceptreject_layout   check is visible
                {
                    webphone_api.$("#btn_ml_accept").click();
                    event.preventDefault();
                }
            }
            else if (charCode === 27 || charCode === 8) // ESC or Backspace
            {
                var active_popups = webphone_api.$.mobile.activePage.find(".messagePopup");
                if (!webphone_api.common.isNull(active_popups) && active_popups.length > 0)
                {
                    webphone_api.$("#adialog_negative").click();
                    event.preventDefault();
                }
                else if (webphone_api.$('#acceptreject_layout').is(':visible')) // acceptreject_layout   check is visible
                {
                    webphone_api.$("#btn_reject").click();
                    event.preventDefault();
                }
                else if (webphone_api.$('#mline_layout').is(':visible')) // acceptreject_layout   check is visible
                {
                    webphone_api.$("#btn_ml_reject").click();
                    event.preventDefault();
                }
                else if (webphone_api.$('#hangup_layout').is(':visible')) // acceptreject_layout   check is visible
                {
                    webphone_api.$("#btn_hangup").click();
                    event.preventDefault();
                }
            }
            else
            {
                return;
            }
        } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: keydown", err); }
    });
    
    
//--    webphone_api.$( "#volumein" ).slider({
//--        create: function( event, ui ) { alert('slidecreate1'); }
//--    });
    
//--    webphone_api.$( "#volumein" ).on( "slidecreate", function( event, ui )
//--    {
//--        var invalue = webphone_api.common.GetParameter('volumein');
        
//--        if (webphone_api.common.isNull(invalue) || invalue.length < 1 || !webphone_api.common.IsNumber(invalue))
//--        {
//--            invalue = '50';
//--        }
        
//--        this.value = invalue;
//--    });
        
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: onCreate", err); }
}

var ctrlDown = false;
var altDown = false;
var shiftDown = false;
var specialKeyDown = false;
var ctrlKey = 17, vKey = 86, cKey = 67, altKey = 18, shiftKey = 16;
// keypresses during call should send dtmf
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

    if ((charCode >= 48 && charCode <= 57) || charCode === 42 || charCode === 35)
    {
        SendDtmf(String.fromCharCode(charCode));
    }

    return false;
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: HandleKeyPress", err); }
}

function onStart(event)
{
    try{
        if(webphone_api.common.CanLog(4)) { webphone_api.common.PutToDebugLog(4, "EVENT, _call: onStart"); }
    webphone_api.global.isCallStarted = true;
    
    webphone_api.global.hangupPressedCount = 0;
    
    MeasureCall(); // resolve window height size change
    
    if (!webphone_api.common.isNull(document.getElementById("app_name_call"))
        && webphone_api.common.GetParameter('devicetype') !== webphone_api.common.DEVICE_WIN_SOFTPHONE())
    {
        document.getElementById("app_name_call").innerHTML = webphone_api.common.GetBrandName();
    }
    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#call_header'), -30) );
    
    webphone_api.$('#btn_hangup_img').attr('src', '' + webphone_api.common.GetElementSource() + 'images/btn_hangup_txt.png');
    
    if (!webphone_api.common.isNull(document.getElementById('btn_audiodevice')))
    {
        document.getElementById('btn_audiodevice').innerHTML = webphone_api.stringres.get('btn_audio_device');
    }
    
    if (webphone_api.common.GetParameterBool('displayvolumecontrols', false) === true)
    {
        webphone_api.$('#volumecontrols').show();
    }

    if (webphone_api.common.GetParameterBool('displayaudiodevice', false) === true)
    {
        webphone_api.$('#audiodevice_container').show();
    }
    
    
// set volume controls values
    var invalue = webphone_api.common.GetParameter('volumein');
    if (webphone_api.common.isNull(invalue) || invalue.length < 1 || !webphone_api.common.IsNumber(invalue))
    {
        invalue = '50';
    }
    webphone_api.$("#volumein").val(invalue);
    webphone_api.$("#volumein").slider('refresh');
    
    var outvalue = webphone_api.common.GetParameter('volumeout');
    if (webphone_api.common.isNull(outvalue) || outvalue.length < 1 || !webphone_api.common.IsNumber(outvalue))
    {
        outvalue = '50';
    }
    webphone_api.$("#volumeout").val(outvalue);
    webphone_api.$("#volumeout").slider('refresh');
    
// handle volume control on change
    webphone_api.$( "#volumein" ).on( "slidestop", function( event, ui )
    {
        var setval = this.value;
        
        if (webphone_api.common.isNull(setval) || setval.length < 1) { return; }
        
        setval = webphone_api.common.Trim(setval);

        webphone_api.common.SaveParameter('volumein', setval);
        webphone_api.common.PutToDebugLog(5, 'EVENT, volumein slidestop: ' + this.value);
        
        //  -0 for the recording (microphone) audio device
        //  -1 for the playback (speaker) audio device
        //  -2 for the ringback (speaker) audio device
        webphone_api.setvolume(0, setval);
    });
    
    webphone_api.$( "#volumeout" ).on( "slidestop", function( event, ui )
    {
        var setval = this.value;
        
        if (webphone_api.common.isNull(setval) || setval.length < 1) { return; }
        
        setval = webphone_api.common.Trim(setval);

        webphone_api.common.SaveParameter('volumeout', setval);
        webphone_api.common.PutToDebugLog(5, 'EVENT, volumeout slidestop: ' + this.value);
        
        webphone_api.setvolume(1, setval);
    });
    
    calltype  = webphone_api.common.GetIntentParam(webphone_api.global.intentcall, 'calltype');
    var callmodestr  = webphone_api.common.GetIntentParam(webphone_api.global.intentcall, 'callmode');
    if (!webphone_api.common.isNull(callmodestr) && webphone_api.common.IsNumber(callmodestr)) { callmode = webphone_api.common.StrToInt(callmodestr); }
    
    webphone_api.global.callName = ''; // reset webphone_api.global.callName
    
    callnumber = webphone_api.common.GetIntentParam(webphone_api.global.intentcall, 'number');
    webphone_api.global.callName = webphone_api.common.GetIntentParam(webphone_api.global.intentcall, 'name');
    
    if (webphone_api.common.isNull(webphone_api.global.callName) || webphone_api.global.callName.length < 1)
    {
        webphone_api.global.callName = webphone_api.common.GetContactNameFromNumber(callnumber);
    }
    
    var telsearchurl = webphone_api.common.GetParameter2('telsearchurl');
    if (webphone_api.common.isNull(telsearchurl) || telsearchurl.length < 3) { telsearchurl = webphone_api.parameters['telsearchurl']; }
    if (!webphone_api.common.isNull(telsearchurl) && telsearchurl.length > 3 && (webphone_api.global.callName.length < 1 || webphone_api.global.callName === callnumber))
    {
        webphone_api.gettelsearchname(callnumber, function (recname)
        {
            if (webphone_api.common.isNull(recname) || recname.length < 2 || recname.length > 60) { return; }
            webphone_api.global.telsearchname = recname;
            webphone_api.global.callName = recname;

            peerdetails = webphone_api.global.callName + '<br>' +  callnumber;
            webphone_api.$('#page_call_peer_details').html(peerdetails);

            peerdetails = webphone_api.global.callName + '&nbsp;(' + callnumber + ')&nbsp;';
            webphone_api.$('#calledcaller').html(peerdetails);

        });
    }
    
// don't display username and name, if both are the same
    var peerdetails = '';
    if (webphone_api.global.callName !== callnumber)
    {
        peerdetails = webphone_api.global.callName + '&nbsp;(' + callnumber + ')&nbsp;';
        webphone_api.$('#calledcaller').html(peerdetails);
    }else
    {
        peerdetails = callnumber;
        webphone_api.$('#calledcaller').html(peerdetails);
    }
    
    NormalizeDisplayDetails(peerdetails);
    if (calltype === "incoming")
    {
        webphone_api.GetIncomingDisplay(function (disp)
        {
            if (!webphone_api.common.isNull(disp) && disp.length > 0 && peerdetails.indexOf(disp) < 0)
            {
                disp = disp.replace('\n', '');
                peerdetails = disp + ' ' + peerdetails;
            }
            
            NormalizeDisplayDetails(peerdetails);
        });
    }
    
    
// handle hangup / acceptreject layouts (icoming / outgoing call)
    if (calltype === "outgoing")
    {
        AddCallFunctions(false);
        
        webphone_api.$('#acceptreject_layout').hide();
        webphone_api.$('#hangup_layout').show();
        webphone_api.$('#callfunctions_layout').show();
        
//--        if (!webphone_api.global.isdebugversion)
//--        {
//--            webphone_api.call(-1, callnumber);
            
            setTimeout(function ()
            {
                var ratinguri = webphone_api.common.GetParameter('ratingrequest');
                if (
//OPSSTART
                        webphone_api.common.Glbr() === true && 
//OPSEND
                        !webphone_api.common.isNull(ratinguri) && ratinguri.length > 2 && !webphone_api.common.isNull(callnumber) && callnumber.length > 0 &&
                        (webphone_api.common.isNull(webphone_api.global.rating) || (webphone_api.global.rating).length < 1) // means rating is not received from signaling
                    )
                {
                    webphone_api.needratingrequest(function (val) // API_NeedRatingRequest
                    {
                        if (val === true)
                        {
                            webphone_api.common.UriParser(ratinguri, '', callnumber, '', '', 'getrating');
                        }
                    });
                }
            }, 4000);
//--        }
    }

    if (calltype === "incoming")
    {
        if (webphone_api.common.GetParameterBool('autoaccept', false) === true || webphone_api.common.GetParameterInt('enableautoaccept', 1) === 3)
        {
            webphone_api.$('#hangup_layout').show();
            webphone_api.$('#callfunctions_layout').show();
            webphone_api.$('#acceptreject_layout').hide();
        }else
        {
//--             normal call
            AddCallFunctions(true);
            showignore = true;
            hanguponchat = true;
            webphone_api.$('#hangup_layout').hide();
            webphone_api.$('#callfunctions_layout').hide();
            webphone_api.$('#acceptreject_layout').show();
        }
    }
    
    if (callmode > 0 && webphone_api.common.CanIUseVideo() === true)
    {
        webphone_api.$('#contact_details').hide();
        webphone_api.$('#video_container').show();

        MeasureCall();
        setTimeout(function () { MeasureCall(); }, 200);

        if (webphone_api.common.GetParameterInt('softphonevideomode', 0) === 1) // hide Full Screeen button in windows softphone, because it's not working
        {
            webphone_api.$('#div_video_fullscreen_button').hide();
        }
        webphone_api.common.PutToDebugLog(2, 'EVENT, call onstart video container displayed');
    }
    
if (webphone_api.global.isdebugversion === true)
{
    webphone_api.$('#mline_layout').show();
}
    
    MeasureCall();
    setTimeout(function () { MeasureCall(); }, 200);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: onStart", err); }
}

// display other party details
// search details and don't show the same string twice: for example caller or display name
function NormalizeDisplayDetails(det_in)
{
    try{
    if (webphone_api.common.isNull(det_in) || det_in.length < 1)
    {
        webphone_api.$('#page_call_peer_details').html('');
        return;
    }
    if (det_in.indexOf(' ') < 0)
    {
        webphone_api.$('#page_call_peer_details').html(det_in);
        return;
    }
    
    det_in = webphone_api.common.ReplaceAll(det_in, '-', ' ');
    var det = '';
    var darr = det_in.split(' ');
    
    var idx = 0;// remove any empty/invalid entries
    while (idx < darr.length)
    {
        if (webphone_api.common.isNull(darr[idx]) || webphone_api.common.Trim(darr[idx]).lengh < 1)
        {
            darr.splice(idx, 1);
        }else
        {
            idx++;
        }
    }
    
    // returns only unique elements
    darr = webphone_api.common.UniqueArray(darr);
    
    var middle = Math.ceil(darr.length / 2);
    for (var i = 0; i < darr.length; i++)
    {
        if (webphone_api.common.isNull(darr[i]) || webphone_api.common.Trim(darr[i]).lengh < 1) { continue; }
        
        if (det.indexOf(darr[i]) < 0)
        {
            if (det.length > 0)
            {
                if (i === middle)
                {
                    det = det + '<br>';
                }else
                {
                    det = det + ' ';
                }
            }
            det = det + darr[i];
        }
    }
    
    webphone_api.$('#page_call_peer_details').html(det);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: NormalizeDisplayDetails", err); }
}

function OnNewIncomingCall()
{
    try{
    webphone_api.common.PutToDebugLog(5, 'EVENT, _call handle OnNewIncomingCall on line: ' + webphone_api.global.aline.toString());
    var ep = webphone_api.common.GetEndpoint(1025,webphone_api.global.aline, '', '', '', false);
    if (webphone_api.common.isNull(ep) || ep.length < 5)
    {
        webphone_api.common.PutToDebugLog(3, 'WARNING, _call OnNewIncomingCall: ep is NULL for line A: ' + webphone_api.global.aline.toString());

        //handle bug / workaround
        var curraline = webphone_api.common.GetFreeLine(); webphone_api.common.SetALineInternal(curraline,51);
        ep = webphone_api.common.GetEndpoint(1026,webphone_api.global.aline, '', '', '', false);
        if (webphone_api.common.isNull(ep) || ep.length < 5)
        {
            webphone_api.common.PutToDebugLog(2, 'ERROR, _call OnNewIncomingCall: ep is NULL for line B: ' + webphone_api.global.aline.toString());
            webphone_api.common.LogLines();
            return;
        }
    }
    
    var innr = ep[webphone_api.common.EP_DESTNR];
    webphone_api.$('#mline_layout').show();
    
    if (webphone_api.$('#hangup_layout').is(':visible'))
    {
        webphone_api.$('#hangup_layout').hide();
    }
    if (webphone_api.$('#acceptreject_layout').is(':visible'))
    {
        webphone_api.$('#acceptreject_layout').hide();
    }
    
    webphone_api.common.RefreshInfo();
    
    setTimeout(function () { MeasureCall(); }, 200);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: OnNewIncomingCall", err); }
}

function RejectCallMultiline(callapi)
{
    try{
    showignore = false;
    hanguponchat = false;
    webphone_api.$('#mline_layout').hide();
    webphone_api.$('#callfunctions_layout').show();
    webphone_api.$('#hangup_layout').show();
    setTimeout(function () { MeasureCall(); }, 200);

    webphone_api.global.acceptReject = true;
//--    webphone_api.global.hangupPressedCount = 1;
    
//find last incoming call to reject; because maybe user changed line, but even then reject the incoming line
    if (callapi)
    {
        var linetoreject = webphone_api.global.aline; // 1=outgoing, 2=incoming
        var setuptime = 0;
/* NEM LOGIKUS !!!!
        for (var i = 0; i < webphone_api.global.ep.length; i++)
        {
            if (webphone_api.common.isNull(webphone_api.global.ep[i]) || webphone_api.global.ep[i].length < 5) { continue; }
            if (webphone_api.global.ep[i][webphone_api.common.EP_INCOMING] !== '2') { continue; }
            
            var stime = webphone_api.common.StrToInt(webphone_api.global.ep[i][webphone_api.common.EP_SETUPTIME]);
            if (!webphone_api.common.isNull(stime) && webphone_api.common.IsNumber(stime) && stime > setuptime)
            {
                setuptime = stime;
                linetoreject = webphone_api.global.ep[i][webphone_api.common.EP_LINE];
            }
        }
*/
        webphone_api.plhandler.Reject(linetoreject);

    // update lines (remove line and set last active line)
        for (var i = 0; i < webphone_api.global.ep.length; i++)
        {
            if (webphone_api.common.isNull(webphone_api.global.ep[i]) || webphone_api.global.ep[i].length < 5) { continue; }

            var lntmp = webphone_api.global.ep[i][webphone_api.common.EP_LINE];
            if (lntmp == webphone_api.global.aline)
            {
                webphone_api.global.ep[i][webphone_api.common.EP_FLAGDEL] = 'true';
                break;
            }
        }
        
    // find last active line
        for (var i = webphone_api.global.ep.length - 1; i >= 0; i--)
        {
            if (webphone_api.common.isNull(webphone_api.global.ep[i]) || webphone_api.global.ep[i].length < 5) { continue; }

            if (webphone_api.global.ep[i][webphone_api.common.EP_FLAGDEL] == 'false')
            {
                // found one active line, set it
                webphone_api.common.PutToDebugLog(2, 'EVENT, SetLine called from RejectCallMultiline');
                webphone_api.setline(webphone_api.common.StrToInt(webphone_api.global.ep[i][webphone_api.common.EP_LINE]));
                break;
            }
        }
        
//--        UpdateLineUI();
        setTimeout(function ()
        {
            webphone_api.common.RefreshInfo();
        }, 400);
    }
    callmode = 0;
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: RejectCallMultiline", err); }
}

function AcceptHold(callapi)
{
    try{
    webphone_api.global.acceptReject = true;
    
    AddCallFunctions(false);
    showignore = false;
    hanguponchat = false;
    
    webphone_api.$('#mline_layout').hide();
    webphone_api.$('#hangup_layout').show();
    webphone_api.$('#callfunctions_layout').show();
    
    setTimeout(function () { MeasureCall(); }, 200);

    if (callapi)
    {
        // find previous active line to put that call on hold
        var prevline = -10;
        var setuptimeTmp = 0;
        if (!webphone_api.common.isNull(webphone_api.global.ep))
        {
            for (var i = 0; i < webphone_api.global.ep.length; i++)
            {
                var eptmp = webphone_api.global.ep[i];
                if (webphone_api.common.isNull(eptmp) || eptmp.length < 1) { continue; }
                
                if (eptmp[webphone_api.common.EP_FLAGDEL] === 'true') { continue; }
                
                if (!webphone_api.common.isNull(eptmp[webphone_api.common.EP_LINE]) && webphone_api.common.IsNumber(eptmp[webphone_api.common.EP_LINE]) === true)
                {
                    if (setuptimeTmp < webphone_api.common.StrToInt(eptmp[webphone_api.common.EP_SETUPTIME]))
                    {
                        prevline = webphone_api.common.StrToInt(eptmp[webphone_api.common.EP_LINE]);
                    }
                }
            }
        }
        
        webphone_api.common.PutToDebugLog(2, 'EVENT, mlogic API_Accept AcceptHold');
        webphone_api.accept(webphone_api.global.aline);

        if (prevline > 0)
        {
            webphone_api.common.PutToDebugLog(2, 'EVENT, API_Hold mainlogic hold call from cl AcceptHold; ' + ' on line: ' + prevline );
            webphone_api.plhandler.Hold(true, prevline);
            setTimeout(function ()
            {
                AddCallFunctions(false);
            }, 250);

            webphone_api.common.PutToDebugLog(2, 'EVENT, AcceptHold hold finished');
        }
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: AcceptHold", err); }
}

function AcceptEnd(callapi)
{
    try{
    webphone_api.global.acceptReject = true;
    
    AddCallFunctions(false);
    showignore = false;
    hanguponchat = false;
    
    webphone_api.$('#mline_layout').hide();
    webphone_api.$('#hangup_layout').show();
    webphone_api.$('#callfunctions_layout').show();
    
    setTimeout(function () { MeasureCall(); }, 200);

    if (callapi)
    {
        // find previous active line to end that call
        var prevline = -10;
        var setuptimeTmp = 0;
        if (!webphone_api.common.isNull(webphone_api.global.ep))
        {
            for (var i = 0; i < webphone_api.global.ep.length; i++)
            {
                var eptmp = webphone_api.global.ep[i];
                if (webphone_api.common.isNull(eptmp) || eptmp.length < 1) { continue; }
                
                if (eptmp[webphone_api.common.EP_FLAGDEL] === 'true') { continue; }
                
                if (!webphone_api.common.isNull(eptmp[webphone_api.common.EP_LINE]) && webphone_api.common.IsNumber(eptmp[webphone_api.common.EP_LINE]) === true)
                {
                    if (setuptimeTmp < webphone_api.common.StrToInt(eptmp[webphone_api.common.EP_SETUPTIME]))
                    {
                        prevline = webphone_api.common.StrToInt(eptmp[webphone_api.common.EP_LINE]);
                    }
                }
            }
        }
        
        webphone_api.common.PutToDebugLog(2, 'EVENT, AcceptEnd called');
        
        webphone_api.plhandler.Accept(webphone_api.global.aline);
        
        if (prevline > 0)
        {
            webphone_api.common.PutToDebugLog(2, 'EVENT, hangup AcceptEnd');
            webphone_api.plhandler.Hangup(prevline);
        }
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: AcceptEnd", err); }
}

function MeasureCall() // resolve window height size change
{
    try{
//--    var pgh = webphone_api.common.GetDeviceHeight() - 1; webphone_api.$('#page_call').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_call').css('min-height', 'auto'); // must be set when softphone is skin in div

    var volumevisible = false;
    var audiodevicevisible = false;
    if (webphone_api.$('#volumecontrols').is(':visible')) { volumevisible = true; }
    if (webphone_api.$('#audiodevice_container').is(':visible')) { audiodevicevisible = true; }

    webphone_api.$("#page_call_content").height(webphone_api.common.GetDeviceHeight() - webphone_api.$("#call_header").height() -webphone_api.$('.separator_line_thick').height());

    var pageHeight = webphone_api.common.GetDeviceHeight() - webphone_api.$("#call_header").height();
    webphone_api.$('#page_call_content').height(pageHeight - 3);
    var max_vid_height = pageHeight - 3;
    
    
    var numpadHeight = pageHeight - webphone_api.$("#hangup_layout").height() - webphone_api.$("#callfunctions_layout").height() - webphone_api.$(".separator_color_bg").height() - 12;
    if (webphone_api.$('#mlcontainer').is(':visible')) { numpadHeight = numpadHeight - webphone_api.$('#mlcontainer').height() - 2; }
    
    var rowHeight = Math.floor(numpadHeight / 5);
    webphone_api.$("#numpad_btn_grid .ui-btn").height(rowHeight);
    rowHeight = rowHeight - 6;
    
    webphone_api.$("#numpad_number_container").height(rowHeight);
    webphone_api.$("#numpad_number_container").css("line-height", rowHeight + "px");
    
    if (calltype === "outgoing")
    {
        pageHeight = pageHeight - webphone_api.$("#hangup_layout").height() - webphone_api.$("#callfunctions_layout").height() - webphone_api.$(".separator_color_bg").height() - 1;
        
        if (volumevisible) { pageHeight = pageHeight - webphone_api.$("#volumecontrols").height(); }
        if (audiodevicevisible) { pageHeight = pageHeight - webphone_api.$("#audiodevice_container").height(); }
        pageHeight = pageHeight - webphone_api.$("#mlcontainer").height() - webphone_api.$(".separator_line_thick").height();
        pageHeight = Math.floor(pageHeight);

        webphone_api.$("#contact_image").height(  pageHeight );
//--        webphone_api.$("#contact_image").css("line-height", pageHeight + "px");
        var mTop = (pageHeight - webphone_api.$("#contact_image_img").height() - webphone_api.$("#page_call_additional_info").height()) / 2;
        webphone_api.$("#contact_image_img").css("margin-top", mTop + "px");
    }

    if (calltype === "incoming")
    {
        if (document.getElementById('acceptreject_layout').style.display === 'block')
        {
            pageHeight = pageHeight - webphone_api.$("#acceptreject_layout").height() - 3;
            if (volumevisible) { pageHeight = pageHeight - webphone_api.$("#volumecontrols").height(); }
            if (audiodevicevisible) { pageHeight = pageHeight - webphone_api.$("#audiodevice_container").height(); }
            pageHeight = pageHeight - webphone_api.$("#mlcontainer").height() - webphone_api.$(".separator_line_thick").height();
            pageHeight = Math.floor(pageHeight);
        }else
        {
            pageHeight = pageHeight - webphone_api.$("#hangup_layout").height() - webphone_api.$("#callfunctions_layout").height() - webphone_api.$(".separator_color_bg").height() - 1;
            if (volumevisible) { pageHeight = pageHeight - webphone_api.$("#volumecontrols").height(); }
            if (audiodevicevisible) { pageHeight = pageHeight - webphone_api.$("#audiodevice_container").height(); }
            pageHeight = pageHeight - webphone_api.$("#mlcontainer").height() - webphone_api.$(".separator_line_thick").height();
            pageHeight = Math.floor(pageHeight);
        }

        webphone_api.$("#contact_image").height(  pageHeight );
//--        webphone_api.$("#contact_image").css("line-height", pageHeight + "px");
        var mTop = (pageHeight - webphone_api.$("#contact_image_img").height() - webphone_api.$("#page_call_additional_info").height()) / 2;
        webphone_api.$("#contact_image_img").css("margin-top", mTop + "px");
    }
    
    var brandW = Math.floor(webphone_api.common.GetDeviceWidth() / 4.6);
    webphone_api.$("#app_name_call").width(brandW);
    
// handle video container height/aspect ratio
    if (webphone_api.$('#video_container').is(':visible'))
    {
        var vh = webphone_api.$('#video_remote').height();
        if (!webphone_api.common.isNull(vh) && webphone_api.common.IsNumber(vh))
        {
            vh = vh - 55; // space for full screen button (for some reason video_container reports invalid height value so we have to use video remote DIV)
            max_vid_height = max_vid_height - webphone_api.$("#hangup_layout").height() - webphone_api.$("#callfunctions_layout").height() - webphone_api.$(".separator_color_bg").height() - 1;

//alert('webphone_api.$("#hangup_layout").height(): ' + webphone_api.$("#hangup_layout").height() + '\nj$("#callfunctions_layout").height(): ' + webphone_api.$("#callfunctions_layout").height() + '\nmax_vid_height: ' + max_vid_height);
            
            if (vh > max_vid_height)
            {
                webphone_api.$('#video_container').height(max_vid_height);
                webphone_api.$('#video_remote').height(max_vid_height - 55);
            }
        }
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: MeasureCall", err); }
}

function HangupCall()
{
    try{
        // reset mute, hold, speaker buttons state
//--    webphone_api.$('#mute_status').removeClass("callfunc_status_on");
//--    webphone_api.$('#hold_status').removeClass("callfunc_status_on");
//--    webphone_api.$('#speaker_status').removeClass("callfunc_status_on");

    webphone_api.global.dontshowdiscreason = true;
    if (webphone_api.common.GetNrOfActiveCalls() < 2)
    {
        webphone_api.global.hangupPressedCount++;
    }

        if(webphone_api.common.CanLog(4)) { webphone_api.common.PutToDebugLog(4, 'EVENT, _call HangupCall'); }

    if (webphone_api.global.hangupPressedCount < 2)
    {
        if (webphone_api.common.GetNrOfActiveCalls() < 2 && (webphone_api.common.isNull(webphone_api.global.waiting_conf_numbers) || webphone_api.global.waiting_conf_numbers.length < 1) && webphone_api.global.dontshow_closecall === false)
        {
            webphone_api.$('#callfunctions_layout').hide();
            webphone_api.$('#btn_hangup_img').attr('src', '' + webphone_api.common.GetElementSource() + 'images/btn_close_txt.png');
            webphone_api.$("#btn_hangup").attr("title", webphone_api.stringres.get("hint_closecall"));
        }
        webphone_api.hangup();
        
//--        UpdateLineUI();
        setTimeout(function ()
        {
            webphone_api.common.RefreshInfo();
        }, 400);
    }
    else if (webphone_api.global.hangupPressedCount > 1)
    {
        webphone_api.hangup();
        webphone_api.$.mobile.back();

        webphone_api.global.hangupPressedCount = 0;
    }
    callmode = 0;

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: HangupCall", err); }
}

function AcceptCall(callapi)
{
    try{
    webphone_api.global.acceptReject = true;
    
    AddCallFunctions(false);
    showignore = false;
    hanguponchat = false;
    
    webphone_api.$('#mline_layout').hide();
    webphone_api.$('#acceptreject_layout').hide();
    webphone_api.$('#hangup_layout').show();
    webphone_api.$('#callfunctions_layout').show();
    
    setTimeout(function () { MeasureCall(); }, 200);

//--    CallfunctionUsage(); TODO: implement
    
    if (callapi)
    {
        webphone_api.accept(-2);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: AcceptCall", err); }
}

function RejectCall(callapi)
{
    try{
    showignore = false;
    hanguponchat = false;
    webphone_api.$('#mline_layout').hide();
    webphone_api.$('#acceptreject_layout').hide();
    if (webphone_api.common.GetNrOfActiveCalls() < 2)
    {
        webphone_api.$('#callfunctions_layout').hide();
    }
    webphone_api.$('#hangup_layout').show();
    setTimeout(function () { MeasureCall(); }, 200);

    webphone_api.global.acceptReject = true;
    webphone_api.global.hangupPressedCount = 1;
    
    if (callapi)
    {
        webphone_api.reject(-2);
    }
    callmode = 0;

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: RejectCall", err); }
}

function SendDtmf(numChar)
{
    try{
    webphone_api.common.PutToDebugLog(5,"EVENT, _call SendDtmf: " + numChar);
    	
    webphone_api.dtmf(numChar, -1);

    var currNumVal = webphone_api.$('#numpad_number').html();
    if (webphone_api.common.isNull(currNumVal)) { currNumVal = ''; }
    
    if (currNumVal.length > 18) { currNumVal = currNumVal.substring(10, currNumVal.length) + ' '; }
    
    webphone_api.$('#numpad_number').html(currNumVal + numChar);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: SendDtmf", err); }
}

function CloseCall()
{
    try{
        if(webphone_api.common.CanLog(4)) { webphone_api.common.PutToDebugLog(3, 'EVENT, _call CloseCall'); }
    webphone_api.$.mobile.back();
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: CloseCall", err); }
}

// show close button if the caller hangs up before it is accepted or rejected
function OnCallerHangup() //--TODO:
{
    try{
//--            if (isVideoOn) VideoOnPause(); // stop video

    webphone_api.global.hangupPressedCount = 1;

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: OnCallerHangup", err); }
}

var lastBtns = '';
function UpdateLineButtons()
{
    try{
    if (webphone_api.common.IsSDK() === true) { return; }
    var mlcont = document.getElementById('mlcontainer');
    if (webphone_api.common.isNull(mlcont)) { return; }
        
    var ml_btns = document.getElementById('ml_buttons');
    if (webphone_api.common.isNull(ml_btns)) { return; }
    
    
    if (webphone_api.common.isNull(webphone_api.global.ep) || webphone_api.global.ep.length < 1) { return; }
    
    var template = '' +
        '<button class="ui-btn line_btn noshadow" data-theme="b" id="btn_line_[LINENR]">' +
            '<span class="line_text">' + webphone_api.stringres.get('line_title') + ' [LINENR]</span>' +
            '<span class="line_status [ISACTIVE]" id="line_[LINENR]_status" >&nbsp;</span>' +
        '</button>';
    
    
    var buttonIds = [];
    var currBtns = '';
    for (var i = 0; i < webphone_api.global.ep.length; i++)
    {
        var item = webphone_api.global.ep[i];
        if (webphone_api.common.isNull(item) || item.length < 1) { continue; }
        
        var lntmp = item[webphone_api.common.EP_LINE];
        if (webphone_api.common.isNull(lntmp) || lntmp.length < 1 || webphone_api.common.IsNumber(lntmp) === false) { continue; }
        
        var iline = webphone_api.common.StrToInt(lntmp);
        
        var isActive = '';
        if (webphone_api.global.aline == iline)
        {
            isActive = 'line_status_on';
        }
        
        var btn = webphone_api.common.ReplaceAll(template, '[LINENR]', iline.toString());
        btn = btn.replace('[ISACTIVE]', isActive);
        
        currBtns += btn;
        buttonIds.push(iline.toString());
    }
    
    if (currBtns === lastBtns)
    {
        return;
    }else
    {
        lastBtns = currBtns;
    }
    
    ml_btns.innerHTML = currBtns;
    
    for (var i = 0; i < buttonIds.length; i++)
    {
        webphone_api.$('#btn_line_' + buttonIds[i]).off('click');
        webphone_api.$('#btn_line_' + buttonIds[i]).on('click', function (e)
        {
            LineCliked(webphone_api.$(this).attr('id'));
        });
    }
    
    if (buttonIds.length > 1) // display buttons only if there are at least 2 lines
    {
        if (mlcont.style.display === 'none') { mlcont.style.display = 'block'; }
    }else
    {
        ml_btns.innerHTML = '';
        mlcont.style.display = 'none';
    }
    
    webphone_api.common.RefreshInfo();
    MeasureCall();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: UpdateLineButtons", err); }
}

function LineCliked(id)
{
    try{
    if (webphone_api.common.IsSDK() === true) { return; }
    if (webphone_api.common.isNull(id) || id.indexOf('btn_line_') !== 0)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _call: LineCliked invalid id: ' + id);
        return;
    }
    id = id.replace('btn_line_', '');
    var line = webphone_api.common.StrToInt(id);
    
    webphone_api.common.PutToDebugLog(1, 'EVENT, Line ' + line.toString() + ' selected by user');
    webphone_api.setline(line);
    
    // defmute: 0=both, 1=mute out (speakers), 2=mute in (microphone), 3=both, 4=both, 5=disable mute
    var mutedirection = webphone_api.common.GetParameterInt('defmute', 0);
    if (mutedirection === 3 || mutedirection === 4) mutedirection = 0;

    var automute = webphone_api.common.GetParameterInt('automute', 0);
    var autohold = webphone_api.common.GetParameterInt('autohold', 0);
    
    for (var i = 0; i < webphone_api.global.ep.length; i++)
    {
        var item = webphone_api.global.ep[i];
        if (webphone_api.common.isNull(item) || item.length < 1) { continue; }
        
        var lntmp = item[webphone_api.common.EP_LINE];
        if (webphone_api.common.isNull(lntmp) || lntmp.length < 1 || webphone_api.common.IsNumber(lntmp) === false) { continue; }
        var iline = webphone_api.common.StrToInt(lntmp);
        
// handle automute/autohold     4=on other line button click
//-- ha az automute és/vagy autohold  4-re van állitva, akkor kezelni kéne a vissza váltás –t is (amelyik line –ra váltunk, arra kell unhold/unmute).
//--if (webphone_api.common.getuseengine() === webphone_api.global.ENGINE_WEBRTC)
//--{
        if (webphone_api.global.aline == iline)
        {
            if (automute >= 4)
            {
                
                if (item[webphone_api.common.EP_MUTESTATE] == 'true') // if is muted
                {
// call directly to engine API files to be able to pass exact line

                    webphone_api.common.PutToDebugLog(2, 'EVENT, EVENT, USER, automute, API_MuteEx, false on line: ' + iline + '; dest: ' + item[webphone_api.common.EP_DESTNR]);
                    if (webphone_api.common.getuseengine() === webphone_api.global.ENGINE_WEBRTC)
                    {
                        webphone_api.webrtcapi.SipToggleMute(false, mutedirection, iline);
                    }
                    else if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE() || webphone_api.common.getuseengine() === webphone_api.global.ENGINE_SERVICE)
                    {
                        webphone_api.common.WinAPI('API_MuteEx', null, iline, false, mutedirection);
                    }
                    else if (webphone_api.common.getuseengine() === webphone_api.global.ENGINE_JAVA)
                    {
                        webphone_api.webphone.MuteEx(iline, false, mutedirection);
                    }
                    
                    webphone_api.global.ep[i][webphone_api.common.EP_MUTESTATE] = 'false';
                }
            }

            if (autohold >= 4)
            {
                if (item[webphone_api.common.EP_HOLDSTATE] == 'true') // if is on hold
                {
                    webphone_api.common.PutToDebugLog(2, 'EVENT, EVENT, USER, autohold, API_Hold mainlogic, false on line: ' + iline + '; dest: ' + item[webphone_api.common.EP_DESTNR]);
                    if (webphone_api.common.getuseengine() === webphone_api.global.ENGINE_WEBRTC)
                    {
                        webphone_api.webrtcapi.SipToggleHoldResume(false, iline);
                    }
                    else if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE() || webphone_api.common.getuseengine() === webphone_api.global.ENGINE_SERVICE)
                    {
                        webphone_api.common.WinAPI('API_Hold', null, iline, false);
                    }
                    else if (webphone_api.common.getuseengine() === webphone_api.global.ENGINE_JAVA)
                    {
                        webphone_api.webphone.Hold(iline, false);
                    }
                    
                    webphone_api.global.ep[i][webphone_api.common.EP_HOLDSTATE] = 'false';
                }
            }
        }else
        {
            if (automute >= 4)
            {
                if (item[webphone_api.common.EP_MUTESTATE] == 'false') // if not muted
                {
                    webphone_api.common.PutToDebugLog(2, 'EVENT, EVENT, USER, automute, API_MuteEx, true on line: ' + iline + '; dest: ' + item[webphone_api.common.EP_DESTNR]);
                    if (webphone_api.common.getuseengine() === webphone_api.global.ENGINE_WEBRTC)
                    {
                        webphone_api.webrtcapi.SipToggleMute(true, mutedirection, iline);
                    }
                    else if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE() || webphone_api.common.getuseengine() === webphone_api.global.ENGINE_SERVICE)
                    {
                        webphone_api.common.WinAPI('API_MuteEx', null, iline, true, mutedirection);
                    }
                    else if (webphone_api.common.getuseengine() === webphone_api.global.ENGINE_JAVA)
                    {
                        webphone_api.webphone.MuteEx(iline, true, mutedirection);
                    }
                    
                    webphone_api.global.ep[i][webphone_api.common.EP_MUTESTATE] = 'true';
                }
            }

            if (autohold >= 4)
            {
                if (item[webphone_api.common.EP_HOLDSTATE] == 'false') // if not on hold
                {
                    webphone_api.common.PutToDebugLog(2, 'EVENT, EVENT, USER, autohold, API_Hold mainlogic, true on line: ' + iline + '; dest: ' + item[webphone_api.common.EP_DESTNR]);
                    if (webphone_api.common.getuseengine() === webphone_api.global.ENGINE_WEBRTC)
                    {
                        webphone_api.webrtcapi.SipToggleHoldResume(true, iline);
                    }
                    else if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE() || webphone_api.common.getuseengine() === webphone_api.global.ENGINE_SERVICE)
                    {
                        webphone_api.common.WinAPI('API_Hold', null, iline, true);
                    }
                    else if (webphone_api.common.getuseengine() === webphone_api.global.ENGINE_JAVA)
                    {
                        webphone_api.webphone.Hold(iline, true);
                    }
                    
                    webphone_api.global.ep[i][webphone_api.common.EP_HOLDSTATE] = 'true';
                }
            }
        }
//--}
    }
    
    
    
    UpdateLineButtons();
    
    AddCallFunctions(false);
    MeasureCall();

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: LineCliked", err); }
}

// change active line, add line buttons and display otion for call
function NewMultilineCall(phoneNr)
{
    try{
    webphone_api.common.PutToDebugLog(2, 'EVENT, NewMultilineCall');
    
    if (webphone_api.global.isdebugversion)
    {
        webphone_api.common.GetContacts(function () {});
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
'<div id="mlcall_popup" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('menu_multilinecall') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content adialog_btn_nexttoinput">' +
        '<span>' + webphone_api.stringres.get('phone_nr') + '</span>' +
        '<div style="clear: both;"><!--//--></div>' +
        '<input type="text" id="mlcall_input" name="setting_item" data-theme="a" autocapitalize="off"/>' +
        '<button id="btn_pickct" class="btn_nexttoinput ui-btn ui-btn-corner-all ui-btn-b noshadow"><img src="' + webphone_api.common.GetElementSource() + 'images/' + btnimage + '"></button>' +
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
            webphone_api.$('#btn_pickct').off('click');
            popupafterclose();
        }
    });
    
//-- listen for enter onclick, and click OK button
//-- no need for this, because it reloads the page
//--    webphone_api.$( "#mlcall_popup" ).keypress(function( event )
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

    var textBox = document.getElementById('mlcall_input');
    if (!webphone_api.common.isNull(phoneNr) && phoneNr.length > 0) { textBox.value = phoneNr; }
    if (!webphone_api.common.isNull(textBox)) { textBox.focus(); } // setting cursor to text input

    webphone_api.$('#adialog_positive').on('click', function (event)
    {
        webphone_api.common.PutToDebugLog(5,'EVENT, call NewMultilineCall ok onclick');

        var textboxval = webphone_api.common.Trim(textBox.value);
        
        if (!webphone_api.common.isNull(textboxval) && textboxval.length > 0)
        {
            webphone_api.call(textboxval);
            
            webphone_api.common.RefreshInfo();
        }else
        {
            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_4'));
            webphone_api.$.mobile.back();
        }
    });

    webphone_api.$('#adialog_negative').on('click', function (event)
    {
        ;
    });

    webphone_api.$('#btn_pickct').on('click', function (event)
    {
        webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");

        webphone_api.$( '#mlcall_popup' ).on( 'popupafterclose', function( event )
        {
            webphone_api.$( '#mlcall_popup' ).off( 'popupafterclose' );

            webphone_api.common.PickContact(NewMultilineCall);
        });
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: NewMultilineCall", err); }
}

//-- addcallfwd: true/false   callforward csak bejovo hivas ring-nel
function AddCallFunctions(addcallfwd)
{
    try{
    if (webphone_api.common.IsSDK() === true) { return; }
    if (webphone_api.common.GetParameterInt('featureset', 10) < 5)
    {
        webphone_api.$('#callfunctions_layout').hide();
        MeasureCall();
        return;
    }
    
    showcallfwd = addcallfwd;

    var content = '';
    webphone_api.$('#callfunctions_layout').html('');

    var availableFunc = webphone_api.common.GetAvailableCallfunctions();
    if ( webphone_api.common.isNull(availableFunc) || availableFunc.length < 3)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _call: AddCallFunctions no available callfunctions (1)');
        return;
    }

    var callfunc = document.getElementById("callfunctions_layout");
    if ( webphone_api.common.isNull(callfunc) )
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _call: AddCallFunctions no available callfunctions (2)');
        return;
    }
    
    var usageStr = webphone_api.common.GetParameter('callfunctionsbtnusage');
    if (webphone_api.common.isNull(usageStr) || usageStr.length <= 0)
    {
        usageStr = '10,0,5,9,8,10,12,1,3,-2';
        webphone_api.common.SaveParameter('callfunctionsbtnusage', usageStr); // DoVersioning
    }

// calculate video priority
    var postmp = usageStr.lastIndexOf(',');
    var videop = webphone_api.common.StrToInt(usageStr.substring(postmp + 1));
    var newUsageStr = usageStr.substring(0, postmp);
    if (webphone_api.common.IsNumber(videop) && webphone_api.common.CanIUseVideo() && videop < 1)
    {
        videop = 3;
        usageStr = newUsageStr + ',' + videop.toString();
        webphone_api.common.SaveParameter('callfunctionsbtnusage', usageStr);
    }


    var tmp = '';
    var usage = usageStr.split(',');
    var usageNames = ["callforward","conference", "transfer", "mute", "hold", "speaker", "numpad", "bluetooth", "chat", "video"];
    
    if (addcallfwd !== true)
    {
        usage.splice(0, 1);
        usageNames.splice(0, 1);
    }
    
    for (var i = 0; i < usage.length; i++)
    {
        for (var j = i + 1; j < usage.length; j++)
        {
            var usi = 0;
            var usj = 0;

            try{
            usi = webphone_api.common.StrToInt(usage[i].trim());
            usj = webphone_api.common.StrToInt(usage[j].trim());
            }catch(ein){  webphone_api.common.PutToDebugLogException(2,"_call AddCallFunctions parseint", ein); }

            //--if( usage[i].compareTo(usage[j]) < 0 )
            if( usi < usj )
            {
                tmp = usage[i];
                usage[i] = usage[j];
                usage[j] = tmp;

                tmp = usageNames[i];
                usageNames[i] = usageNames[j];
                usageNames[j] = tmp;
            }
        }
    }

    if (webphone_api.global.isdebugversion === true) {for (var i = 0; i < usage.length; i++) { webphone_api.common.PutToDebugLog(5, "cfusage " + usageNames[i] + ": " + usage[i]); }}

// get list of available call functions baesd on which engine is used
    var funcArray = availableFunc.split(',');
    var funchtml = '';

    if (webphone_api.common.isNull(funcArray) || funcArray.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _call: AddCallFunctions no available callfunctions (3)');
        return;
    }
    
// wheter to display more button
    var dispmorebtn = false;
    if (webphone_api.global.nrOfCallfunctionsToDisplay === 0) { webphone_api.global.nrOfCallfunctionsToDisplay = 5; }
    if (webphone_api.global.nrOfCallfunctionsToDisplay > funcArray.length) { webphone_api.global.nrOfCallfunctionsToDisplay = funcArray.length; }
    	
    if (funcArray.length > 5) dispmorebtn = true;
    
// build html
    var count = 0;
//--    if (webphone_api.common.isNull(content) || content.length < 10) // if content not yet added, then add it
//--    {
    var template = '' +
        '<div class="callfunc_btn_container">' +
            '<button class="ui-btn callfunc_btn noshadow" data-theme="b" id="btn_[REPLACESTR]">' +
                '<img src="' + webphone_api.common.GetElementSource() + 'images/btn_[REPLACESTR]_txt.png" />' +
                '<span class="callfunc_status" id="[REPLACESTR]_status" >&nbsp;</span>' +
            '</button>' +
        '</div>';


    var spacer = '<div class="callfunc_spacer">&nbsp;</div>';

    var currThemeTmp = webphone_api.common.GetColortheme();
    for (var i = 0; i < usageNames.length; i++)
    {
        var cfitem = usageNames[i];
        if (webphone_api.common.isNull(cfitem) || webphone_api.common.Trim(cfitem).length < 1 ) { continue; }
        if ((availableFunc.toLowerCase()).indexOf(cfitem) < 0) { continue; }

        // WebRTC engine hasn't got conference
        if (webphone_api.common.getuseengine() === webphone_api.global.ENGINE_WEBRTC && cfitem === 'conference') { continue; }

    // conference, transfer, mute, hold, speaker, numpad, bluetooth, chat, video
        var item = template;
        if (currThemeTmp === 22 || currThemeTmp === 23)
        {
            item = webphone_api.common.ReplaceAll(item, 'btn_[REPLACESTR]_txt.png', 'btn_' + cfitem + '_txt_grey.png');
            item = webphone_api.common.ReplaceAll(item, '<button', '<button style="border-color: #FFFFFF"'); // remove border
        }
        item = webphone_api.common.ReplaceAll(item, '[REPLACESTR]', cfitem);

        funchtml = funchtml + item;
        if (i < webphone_api.global.nrOfCallfunctionsToDisplay - 1) { funchtml = funchtml + spacer; }

        count++;

    // add more button and stop adding cf items
        if (dispmorebtn && count > 3)
        {
            var item = template;
            if (currThemeTmp === 22 || currThemeTmp === 23)
            {
                item = item.replace('btn_[REPLACESTR]_txt.png', 'menu_grey.png');
                item = webphone_api.common.ReplaceAll(item, '<button', '<button style="border-color: #FFFFFF"'); // remove border
            }else
            {
                item = item.replace('btn_[REPLACESTR]_txt.png', 'menu.png');
            }
            item = webphone_api.common.ReplaceAll(item, '[REPLACESTR]', 'more');
            funchtml = funchtml + item;
            count++;
            break;
        }
    }
    
    webphone_api.$('#callfunctions_layout').html(funchtml);

// attach click listeners   conference,transfer,numpad,mute,hold,speaker
    webphone_api.$('#btn_callforward').off('click');
    webphone_api.$('#btn_callforward').on('click', function(event) { CallfunctionsOnclick('callforward'); });
    
    webphone_api.$('#btn_conference').off('click');
    webphone_api.$('#btn_conference').on('click', function(event) { CallfunctionsOnclick('conference'); });

    webphone_api.$('#btn_transfer').off('click');
    webphone_api.$('#btn_transfer').on('click', function(event) { CallfunctionsOnclick('transfer', true); });

    webphone_api.$('#btn_numpad').off('click');
    webphone_api.$('#btn_numpad').on('click', function(event) { CallfunctionsOnclick('numpad'); });

    webphone_api.$('#btn_mute').off('click');
    webphone_api.$('#btn_mute').on('click', function(event) { CallfunctionsOnclick('mute'); });

    webphone_api.$('#btn_hold').off('click');
    webphone_api.$('#btn_hold').on('click', function(event) { CallfunctionsOnclick('hold'); });

    webphone_api.$('#btn_speaker').off('click');
    webphone_api.$('#btn_speaker').on('click', function(event) { CallfunctionsOnclick('speaker'); });

    webphone_api.$('#btn_chat').off('click');
    webphone_api.$('#btn_chat').on('click', function(event) { CallfunctionsOnclick('chat'); });
    
    webphone_api.$('#btn_video').off('click');
    webphone_api.$('#btn_video').on('click', function(event) { CallfunctionsOnclick('video'); });
    
    webphone_api.$('#btn_more').off('click');
    webphone_api.$('#btn_more').on('click', function(event) { CallfunctionsOnclick('more'); });



    webphone_api.$('#btn_callforward').attr('title', webphone_api.stringres.get('hint_callforward'));
    webphone_api.$('#btn_conference').attr('title', webphone_api.stringres.get('hint_conference'));
    webphone_api.$('#btn_transfer').attr('title', webphone_api.stringres.get('hint_transfer'));
    webphone_api.$('#btn_numpad').attr('title', webphone_api.stringres.get('hint_dialpad_dtmf'));
    webphone_api.$('#btn_mute').attr('title', webphone_api.stringres.get('hint_mute'));
    webphone_api.$('#btn_hold').attr('title', webphone_api.stringres.get('hint_hold'));
    webphone_api.$('#btn_speaker').attr('title', webphone_api.stringres.get('hint_speaker'));
    webphone_api.$('#btn_chat').attr('title', webphone_api.stringres.get('hint_message'));
    webphone_api.$('#btn_video').attr('title', webphone_api.stringres.get('menu_videorecall'));
    webphone_api.$('#btn_more').attr('title', webphone_api.stringres.get('hint_more'));
    
// set mute,hold status accordingly
    var cline = webphone_api.getline();
    var mutestate = webphone_api.common.GetMuteState(cline);
    var holdstate = webphone_api.common.GetHoldState(cline);

    var mstatus = document.getElementById('mute_status');
    if (!webphone_api.common.isNull(mstatus))
    {
        if (mutestate === true)
        {
            if ( webphone_api.$(mstatus).hasClass('callfunc_status_on') === false )
            {
                webphone_api.$(mstatus).addClass('callfunc_status_on');
            }
        }else
        {
            if ( webphone_api.$(mstatus).hasClass('callfunc_status_on') )
            {
                webphone_api.$(mstatus).removeClass('callfunc_status_on');
            }
        }
    }
    var hstatus = document.getElementById('hold_status');
    if (!webphone_api.common.isNull(hstatus))
    {
        if (holdstate === true)
        {
            if ( webphone_api.$(hstatus).hasClass('callfunc_status_on') === false )
            {
                webphone_api.$(hstatus).addClass('callfunc_status_on');
            }
        }else
        {
            if ( webphone_api.$(hstatus).hasClass('callfunc_status_on') )
            {
                webphone_api.$(hstatus).removeClass('callfunc_status_on');
            }
        }
    }

//--    }

// calculate width in percent
    if (count === 0) { count = webphone_api.global.nrOfCallfunctionsToDisplay; }
    var btnWidth = webphone_api.common.GetDeviceWidth() - ( (count - 1) * webphone_api.$(".callfunc_spacer").width() );
    
    btnWidth = Math.round(btnWidth * 100.0 / webphone_api.common.GetDeviceWidth() * 100) / 100;
    btnWidth = Math.floor(btnWidth / count * 100.0) / 100;

    btnWidth = btnWidth - 0.1;

    webphone_api.$(".callfunc_btn_container").width(btnWidth + '%');
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: AddCallFunctions", err); }
}

var CLICK_CONFERENCE = 0;
var CLICK_TRANSFER = 1;
var CLICK_MUTE = 2;
var CLICK_HOLD = 3;
var CLICK_SPEAKER = 4;
var CLICK_NUMAPD = 5;
var CLICK_BLUETOOTH = 6;
var CLICK_CHAT = 7;
var CLICK_VIDEO = 8;
var CLICK_CALLFORWARD = 9;

function CFUsageClickCount(which) // count the number of clicks on call function buttons
{
    var lastoop = 0;
    var resetVals = false; // reset values (divide by 2 if any value is > 20 or < -20)
    try{ //-- conference, transfer, mute, hold, speaker, numpad, bluetooth, chat, video

    var usageStr = webphone_api.common.GetParameter('callfunctionsbtnusage');
    lastoop = 1;
    if (webphone_api.common.isNull(usageStr) || usageStr.length < 1) return;
    lastoop = 2;
    var usage = usageStr.split(',');
    lastoop = 3;
    var usageInt = [];
    lastoop = 4;
    for (var i = 0; i < usage.length; i++)
    {
            usageInt[i] = webphone_api.common.StrToInt(usage[i]);
            if (usageInt[i] > 20 || usageInt[i] < -20) resetVals = true;
    }
    lastoop = 5;
    switch(which)
    {
            case CLICK_CONFERENCE:	usageInt[CLICK_CONFERENCE]++; return;
            case CLICK_TRANSFER:	usageInt[CLICK_TRANSFER]++; return;
            case CLICK_MUTE:		usageInt[CLICK_MUTE]++; return;
            case CLICK_HOLD:		usageInt[CLICK_HOLD]++; return;
            case CLICK_SPEAKER:		usageInt[CLICK_SPEAKER]++; return;
            case CLICK_NUMAPD:		usageInt[CLICK_NUMAPD]++; return;
            case CLICK_BLUETOOTH:	usageInt[CLICK_BLUETOOTH]++; return;
            case CLICK_CHAT:		usageInt[CLICK_CHAT]++; return;
            case CLICK_VIDEO:		usageInt[CLICK_VIDEO]++; return;
    }

    if (resetVals)
    {
            for (var i = 0; i < usageInt.length; i++)
            {
                usageInt[i] = Math.floor(usageInt[i] / 2);
            }
    }

    lastoop = 6;
//--     callforward, conference, transfer, mute, hold, speaker, numpad, bluetooth, chat, video
    usageStr = usageInt[CLICK_CALLFORWARD] + ',' +usageInt[CLICK_CONFERENCE] + ',' + usageInt[CLICK_TRANSFER] + ',' + usageInt[CLICK_MUTE] + ',' + usageInt[CLICK_HOLD] +',' + usageInt[CLICK_SPEAKER] + ','
            + usageInt[CLICK_NUMAPD] + ',' + usageInt[CLICK_BLUETOOTH] + ',' + usageInt[CLICK_CHAT] + ',' + usageInt[CLICK_VIDEO];
    lastoop = 7;
    webphone_api.common.SaveParameter('callfunctionsbtnusage', usageStr);
    lastoop = 8;
    } catch(err) { webphone_api.common.PutToDebugLogException(2, '_call: CFUsageClickCount (' + lastoop.toString() + ')', err); }
}

function CallfunctionsOnclick (func, isTransfButton) // call page -> call function button on click
{
    try{
    if (webphone_api.common.isNull(func)) { return; }
    
    webphone_api.common.PutToDebugLog(4, 'EVENT, _call CallfunctionsOnclick func = ' + func);
    
    if (func === 'mute')
    {
        var success = Mute();
        if (!success) { return; }
    }
    
    if (func === 'hold')
    {
        var success = Hold();
        if (!success) { return; }
    }
    
    
    var status = document.getElementById(func + '_status');

    if (!webphone_api.common.isNull(status) && func !== 'conference' && func !== 'transfer' && func !== 'chat' && func !== 'more' && func !== 'callforward')
    {
        if ( webphone_api.$(status).hasClass('callfunc_status_on') )
        {
            webphone_api.$(status).removeClass('callfunc_status_on');
        }else
        {
            webphone_api.$(status).addClass('callfunc_status_on');
        }
    }
    
    if (func === 'callforward')     { Callforward(''); }
    if (func === 'conference')      { Conference(''); }
    if (func === 'transfer')        { if (isTransfButton === true) { BeforeTransfer(''); } else { webphone_api.common.Transfer(''); }}
    if (func === 'speaker')         { Speaker(); }
    if (func === 'numpad')          { Numpad(); }
    if (func === 'chat')            { Chat(); }
    if (func === 'video')           { VideoRecall(); }
    if (func === 'more')            { webphone_api.$('#btn_call_menu').click(); }

    } catch(err) { webphone_api.common.PutToDebugLogException(2, '_call: CallfunctionsOnclick', err); }
}

var audiowasvisible = false;
var volumewasvisible = false;
function Numpad() // show / hide numpad for DTMF
{
    try{
    if (webphone_api.$('#numpad').css('display') === 'none')
    {
        if (webphone_api.$('#audiodevice_container').is(':visible')) { audiowasvisible = true; } else { audiowasvisible = false; }
        if (webphone_api.$('#volumecontrols').is(':visible')) { volumewasvisible = true; } else { volumewasvisible = false; }

        document.getElementById('numpad_number').innerHTML = '&nbsp;';
        webphone_api.$('#contact_image').hide();
        webphone_api.$('#audiodevice_container').hide();
        webphone_api.$('#volumecontrols').hide();
        webphone_api.$('#numpad').show();
        MeasureCall();
    }else
    {
        webphone_api.$('#numpad').hide();
        webphone_api.$('#contact_image').show();
        if (audiowasvisible) { webphone_api.$('#audiodevice_container').show(); }
        if (volumewasvisible) { webphone_api.$('#volumecontrols').show(); }
        MeasureCall();
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, '_call: Numpad', err); }
}

function Conference(phoneNr) // popup
{
    try{
    webphone_api.common.PutToDebugLog(1, 'EVENT, ' + webphone_api.stringres.get('initiate_conference'));

    if (webphone_api.common.getuseengine() === webphone_api.global.ENGINE_WEBRTC && !webphone_api.common.IsMizuServerOrGateway())
    {
        if (webphone_api.common.GetParameter('conf_engineswitcheoffered') !== 'true')
        {
            var ep_webrtc = webphone_api.common.StrToInt(webphone_api.common.GetParameter2('enginepriority_webrtc'));
            var ep_java = webphone_api.common.StrToInt(webphone_api.common.GetParameter2('enginepriority_java'));
            var ep_ns = webphone_api.common.StrToInt(webphone_api.common.GetParameter2('enginepriority_ns'));

            if (ep_ns > 0 && ep_webrtc - ep_ns < 3 && webphone_api.common.CanIUseService() === true)
            {
                webphone_api.common.EngineSwitchConference('ns', phoneNr, Conference);
                return;
            }
            if (ep_java > 0 && ep_webrtc - ep_java < 3 && webphone_api.common.CanIUseApplet() === true)
            {
                webphone_api.common.EngineSwitchConference('java', phoneNr, Conference);
                return;
            }
        }else
        {
            webphone_api.common.PutToDebugLog(2, 'ERROR, _call Conference engine switch already offered: ' + webphone_api.common.getuseengine());
        }
    }
    
    if (webphone_api.global.isdebugversion)
    {
        webphone_api.common.GetContacts(function () {});
    }
    
// if is multiline, then try to find another active call and connect them whitout asking for number
    if (webphone_api.common.GetNrOfActiveCalls() > 1)
    {
        for (var i = 0; i < webphone_api.global.ep.length; i++)
        {
            if (webphone_api.common.isNull(webphone_api.global.ep[i]) || webphone_api.global.ep[webphone_api.common.EP_FLAGDEL] === 'true') { continue; }

            var ln = webphone_api.common.StrToInt(webphone_api.global.ep[i][webphone_api.common.EP_LINE]);

            if (ln !== webphone_api.global.aline) // we found another active call
            {
                var nr = webphone_api.global.ep[i][webphone_api.common.EP_DESTNR];
                if (!webphone_api.common.isNull(nr) && nr.length > 0)
                {
                    if(webphone_api.common.IsMizuServerOrGateway() === true && IsConferenceRoom() === true) // means it's conference rooms, so just send invites via chat
                    {
                        // get currently active call number
                        var ep = webphone_api.common.GetEndpoint(1027,webphone_api.global.aline, '', '', '', false);
                        webphone_api.common.SendConferenceInvites(nr, ep[webphone_api.common.EP_DESTNR]);

                        webphone_api.common.PutToDebugLog(2, 'EVENT, _call: Conference, multiline conference: ' + nr + ' AND ' + ep[webphone_api.common.EP_DESTNR]);
                    }else
                    {
                        webphone_api.common.ShowToast(webphone_api.stringres.get('interconnect_conf'));

                        webphone_api.conference(nr, true);
                        webphone_api.common.SaveParameter('last_conference_number', nr);
                        webphone_api.common.PutToDebugLog(2, 'EVENT, _call: Conference, multiline conference: ' + nr);
                    }

                    return;
                }
            }
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

    var interconnectHtml = '';
    if (webphone_api.common.GetNrOfActiveCalls() > 1 && (webphone_api.common.getuseengine() === webphone_api.global.ENGINE_SERVICE || webphone_api.common.getuseengine() === webphone_api.global.ENGINE_JAVA || webphone_api.common.IsWindowsSoftphone() === true))
    {
        interconnectHtml = '<br />'+
            '<button id="btn_interconnect_conf" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" style="font-size: .9em">' + webphone_api.stringres.get('interconnect') + '</button>';
    }
    
    var template = '' +
'<div id="conference_popup" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('conference_title') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content adialog_btn_nexttoinput">' +
        '<span>' + webphone_api.stringres.get('phone_nr') + '</span>' +
        '<div style="clear: both;"><!--//--></div>' +
        '<input type="text" id="conference_input" name="setting_item" data-theme="a" autocapitalize="off"/>' +
        '<button id="btn_pickct" class="btn_nexttoinput ui-btn ui-btn-corner-all ui-btn-b noshadow"><img src="' + webphone_api.common.GetElementSource() + 'images/' + btnimage + '"></button>' +
        interconnectHtml +
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
            webphone_api.$('#btn_pickct').off('click');
            webphone_api.$('#btn_interconnect_conf').off('click');
            popupafterclose();
        }
    });
    
//-- listen for enter onclick, and click OK button
//-- no need for this, because it reloads the page
//--    webphone_api.$( "#conference_popup" ).keypress(function( event )
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

    var textBox = document.getElementById('conference_input');
    
    var lastConferenceNumber = webphone_api.common.GetParameter("last_conference_number");

    if (!webphone_api.common.isNull(lastConferenceNumber) && lastConferenceNumber.length > 1)
    {
        textBox.value = webphone_api.common.Trim(lastConferenceNumber);
    }
    
    if (!webphone_api.common.isNull(phoneNr) && phoneNr.length > 0) { textBox.value = phoneNr; }

    if (!webphone_api.common.isNull(textBox)) { textBox.focus(); } // setting cursor to text input

    webphone_api.$('#adialog_positive').on('click', function (event)
    {
        var textboxval = webphone_api.common.Trim(textBox.value);
        
        webphone_api.common.PutToDebugLog(5,'EVENT, call Conference ok onclick (' + webphone_api.common.getuseengine() + '): ' + textboxval);
        
        if (!webphone_api.common.isNull(textboxval) && textboxval.length > 0)
        {
//--  if Webrtc engine: on conference clicked, hangup call and initiate conference room call
//--		if clicked again, don't initiate conf call again
            if (webphone_api.common.IsWindowsSoftphone() === false && webphone_api.common.getuseengine() === webphone_api.global.ENGINE_WEBRTC)
            {
                if (webphone_api.global.isconfroom_call === true)
                {
                    //webphone_api.common.InitiateConference(textboxval);
                    webphone_api.common.SendConferenceInvites(textboxval, callnumber);
                }else
                {
                    webphone_api.global.isconfroom_call = true;
                    webphone_api.conference(textboxval,true);
                    webphone_api.common.SaveParameter('last_conference_number', textboxval);
                }
                return;
            }else
            {
                webphone_api.conference(textboxval,true);
                webphone_api.common.SaveParameter('last_conference_number', textboxval);
            }
        }else
        {
            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_4'));
            webphone_api.$.mobile.back();
        }
    });

    webphone_api.$('#adialog_negative').on('click', function (event)
    {
        ;
    });

    webphone_api.$('#btn_pickct').on('click', function (event)
    {
        webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");

        webphone_api.$( '#conference_popup' ).on( 'popupafterclose', function( event )
        {
            webphone_api.$( '#conference_popup' ).off( 'popupafterclose' );

            webphone_api.common.PickContact(Conference);
        });
    });

    webphone_api.$('#btn_interconnect_conf').on('click', function (event)
    {
        webphone_api.common.PutToDebugLog(2, 'EVENT, conference interconnect on click');

        webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
        webphone_api.conference('', true);
    });
    
    CFUsageClickCount(CLICK_CONFERENCE);

    } catch(err) { webphone_api.common.PutToDebugLogException(2, '_call: Conference', err); }
}

function Callforward(phoneNr) // popup
{
    try{
    webphone_api.common.PutToDebugLog(1, 'EVENT, ' + webphone_api.stringres.get('initiate_callforward'));
    
    var popupWidth = webphone_api.common.GetDeviceWidth();
    if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
    {
        popupWidth = Math.floor(popupWidth / 1.2);
    }else
    {
        popupWidth = 220;
    }
    var btnimage = 'btn_callforward_txt.png';
    
    var template = '' +
'<div id="callforward_popup" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('callforward_title') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content adialog_btn_nexttoinput">' +
        '<span>' + webphone_api.stringres.get('phone_nr') + '</span>' +
        '<div style="clear: both;"><!--//--></div>' +
        '<input type="text" id="callforward_input" name="setting_item" data-theme="a" autocapitalize="off"/>' +
        '<button id="btn_pickct" class="btn_nexttoinput ui-btn ui-btn-corner-all ui-btn-b noshadow"><img src="' + webphone_api.common.GetElementSource() + 'images/' + btnimage + '"></button>' +
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
            webphone_api.$('#btn_pickct').off('click');
            popupafterclose();
        }
    });
    
//-- listen for enter onclick, and click OK button
//-- no need for this, because it reloads the page
//--    webphone_api.$( "#callforward_popup" ).keypress(function( event )
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

    var textBox = document.getElementById('callforward_input');

//--    var lastTransferNumber = webphone_api.common.GetParameter("last_transfer_number");
//--    if (!webphone_api.common.isNull(lastTransferNumber) && lastTransferNumber.length > 1)
//--    {
//--        textBox.value = webphone_api.common.Trim(lastTransferNumber);
//--    }
    
    if (!webphone_api.common.isNull(phoneNr) && phoneNr.length > 0) { textBox.value = phoneNr; }

    if (!webphone_api.common.isNull(textBox)) { textBox.focus(); } // setting cursor to text input

    webphone_api.$('#adialog_positive').on('click', function (event)
    {
        webphone_api.common.PutToDebugLog(5,'EVENT, call Callforward ok onclick');
        var textboxval = webphone_api.common.Trim(textBox.value);
        
        if (!webphone_api.common.isNull(textboxval) && textboxval.length > 0)
        {
            webphone_api.forward(textboxval);

            webphone_api.$('#acceptreject_layout').hide();
            webphone_api.$('#hangup_layout').show();
//--            webphone_api.common.SaveParameter('last_transfer_number', textboxval);
        }else
        {
            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_4'));
//--            webphone_api.$.mobile.back();
        }
    });

    webphone_api.$('#adialog_negative').on('click', function (event)
    {
        ;
    });

    webphone_api.$('#btn_pickct').on('click', function (event)
    {
        webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");

        webphone_api.$( '#callforward_popup' ).on( 'popupafterclose', function( event )
        {
            webphone_api.$( '#callforward_popup' ).off( 'popupafterclose' );

            webphone_api.common.PickContact(Callforward);
        });
    });
    
    CFUsageClickCount(CLICK_CALLFORWARD);

    } catch(err) { webphone_api.common.PutToDebugLogException(2, '_call: Callforward', err); }
}

function SpecialTransfer(id)
{
    try{
        webphone_api.common.PutToDebugLog(5, 'EVENT, _call SpecialTransfer' + id.toString());
        webphone_api.common.SaveParameter("transfertype", webphone_api.common.GetParameter("transfertype" + id));
        webphone_api.common.SaveParameter("transfwithreplace", webphone_api.common.GetParameter("transfwithreplace" + id));
        webphone_api.common.SaveParameter("allowreplace", webphone_api.common.GetParameter("allowreplace" + id));
        webphone_api.common.SaveParameter("discontransfer", webphone_api.common.GetParameter("discontransfer" + id));
        webphone_api.common.SaveParameter("disconincomingrefer", webphone_api.common.GetParameter("disconincomingrefer" + id));
        webphone_api.common.SaveParameter("inversetransfer", webphone_api.common.GetParameter("inversetransfer" + id));
        webphone_api.common.SaveParameter("transferdelay", webphone_api.common.GetParameter("transferdelay" + id));
        webphone_api.common.SaveParameter("newdialogforrefer", webphone_api.common.GetParameter("newdialogforrefer" + id));
        webphone_api.common.SaveParameter("useserverdomainforrefer", webphone_api.common.GetParameter("useserverdomainforrefer" + id));
        webphone_api.common.SaveParameter("holdontransfer", webphone_api.common.GetParameter("holdontransfer" + id));

        webphone_api.common.Transfer(phoneNr);

    } catch(err) { webphone_api.common.PutToDebugLogException(2, '_call: SpecialTransfer', err); }
}

function BeforeTransfer(phoneNr)
{
    try{
        webphone_api.common.PutToDebugLog(5, 'EVENT, _call BeforeTransfer' + phoneNr);
        if (webphone_api.common.Trim(webphone_api.common.GetParameter("transfername1")).length > 0
                || webphone_api.common.Trim(webphone_api.common.GetParameter("transfername2")).length > 0
                || webphone_api.common.Trim(webphone_api.common.GetParameter("transfername3")).length > 0
                || webphone_api.common.Trim(webphone_api.common.GetParameter("transfername4")).length > 0
                || webphone_api.common.Trim(webphone_api.common.GetParameter("transfername5")).length > 0
                || webphone_api.common.Trim(webphone_api.common.GetParameter("transfername6")).length > 0
                || webphone_api.common.Trim(webphone_api.common.GetParameter("transfername7")).length > 0
                || webphone_api.common.Trim(webphone_api.common.GetParameter("transfername8")).length > 0
                || webphone_api.common.Trim(webphone_api.common.GetParameter("transfername9")).length > 0
                || webphone_api.common.Trim(webphone_api.common.GetParameter("transfername10")).length > 0
        )
        {
            // open menu
            webphone_api.$('#btn_call_menu').click();
            return;
        }

        webphone_api.common.Transfer(phoneNr);

    } catch(err) { webphone_api.common.PutToDebugLogException(2, '_call: BeforeTransfer', err); }
}

function Mute() // :boolean   handle Mute - onClick 
{
    try{
//--    boolean muteSuccess = sipStack.API_Mute(-1, phoneService.muteState);
    // defmute: 0=both, 1=mute out (speakers), 2=mute in (microphone), 3=both, 4=both, 5=disable mute    
    var muteDirection = webphone_api.common.GetParameterInt('defmute', 2);
    if (muteDirection === 3 || muteDirection === 4) muteDirection = 0;

    var mstate = !webphone_api.common.GetMuteState(-1);

    if (muteDirection === 5)
    {
        webphone_api.common.PutToDebugLog(2, 'WARNING, CALL, API_MutEx, ' + mstate + ', ' + muteDirection + ' Mute is disabled!');
        return false;
    }

    var muteSuccess = webphone_api.mute(mstate, muteDirection, -1);

    CFUsageClickCount(CLICK_MUTE);

//--    if (muteSuccess)
//--    {
        return true;
//--    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, '_call: Mute', err); }
    return false;
}

function Hold() // :boolean  handle Hold - onClick 
{
    try{
    var hstate = !webphone_api.common.GetHoldState(-1);
    var holdSuccess = webphone_api.hold(hstate, -1);

    CFUsageClickCount(CLICK_HOLD);

    if (holdSuccess)
    {
        return true;
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, '_call: Hold', err); }
    return false;
}

function Speaker()
{
    try{
    //alert('speaker on / off');
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, '_call: Hold', err); }
}

function Chat()
{
    try{
    if (hanguponchat === true)
    {
        HangupCall();
    }
    
    webphone_api.common.StartMsg(callnumber, '', '_call');
    CFUsageClickCount(CLICK_CHAT);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, '_call: Chat', err); }
}

var MENUITEM_CALL_IGNORE = '#menuitem_call_ignore';
var MENUITEM_CALL_CALLFORWARD = '#menuitem_call_callforward';
var MENUITEM_CALL_CONFERENCE = '#menuitem_call_conference';
var MENUITEM_CALL_TRANSFER = '#menuitem_call_transfer';
var MENUITEM_CALL_NUMPAD = '#menuitem_call_numpad';
var MENUITEM_CALL_MUTE = '#menuitem_call_mute';
var MENUITEM_CALL_HOLD = '#menuitem_call_hold';
var MENUITEM_CALL_SPEAKER = '#menuitem_call_speaker';
var MENUITEM_CALL_MESSAGE = '#menuitem_call_message';
var MENUITEM_VOLUME_CONTROLS = '#menuitem_volume_controls';
var MENUITEM_AUDIO_DEVICE = '#menuitem_audio_device';
var MENUITEM_RECALL_VIDEO = '#menuitem_recall_video';
var MENUITEM_CALLPARK = '#menuitem_callpark';
var MENUITEM_MULTILINECALL = '#menuitem_multilinecall';
var MENUITEM_ACCEPT_HOLD = '#menuitem_accepthold';
var MENUITEM_ACCEPT_END = '#menuitem_acceptend';
var MENUITEM_EXIT_VIDEOMODE = '#menuitem_exit_videomode';
var MENUITEM_CALL_AUDIO_ONLY = '#menuitem_call_audio_only';
var MENUITEM_RECORD_CALL = '#menuitem_call_record_call';

var MENUITEM_CALL_TRANSFER1 = '#menuitem_call_transfer1';
var MENUITEM_CALL_TRANSFER2 = '#menuitem_call_transfer2';
var MENUITEM_CALL_TRANSFER3 = '#menuitem_call_transfer3';
var MENUITEM_CALL_TRANSFER4 = '#menuitem_call_transfer4';
var MENUITEM_CALL_TRANSFER5 = '#menuitem_call_transfer5';
var MENUITEM_CALL_TRANSFER6 = '#menuitem_call_transfer6';
var MENUITEM_CALL_TRANSFER7 = '#menuitem_call_transfer7';
var MENUITEM_CALL_TRANSFER8 = '#menuitem_call_transfer8';
var MENUITEM_CALL_TRANSFER9 = '#menuitem_call_transfer9';
var MENUITEM_CALL_TRANSFER10 = '#menuitem_call_transfer10';

//--var MENUITEM_SCREENSHARE = '#menuitem_screenshare';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
//-- remove data transition for windows softphone, because it's slow
    if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE())
    {
        webphone_api.$( "#btn_call_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _call: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _call: CreateOptionsMenu can't get reference to Menu"); return; }

    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    var featureset = webphone_api.common.GetParameterInt('featureset', 10);
    
    var availableFunc = webphone_api.common.GetAvailableCallfunctions();
    if ( webphone_api.common.isNull(availableFunc) || availableFunc.length < 3)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _call: CreateOptionsMenu no available callfunctions (1)');
        return;
    }
    
    if (availableFunc.indexOf('numpad') >= 0)
    {
        var numpadTitle = webphone_api.stringres.get('menu_numpad');
        if (webphone_api.$('#numpad').is(':visible')) { numpadTitle = webphone_api.stringres.get('menu_numpad_hide'); }
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_NUMPAD + '"><a data-rel="back">' + numpadTitle + '</a></li>' ).listview('refresh');
    }
    
    if (featureset > 5)
    {
        if (availableFunc.indexOf('conference') >= 0 &&
            (
                webphone_api.common.IsWindowsSoftphone() === true
                || webphone_api.common.getuseengine() === webphone_api.global.ENGINE_JAVA
                || webphone_api.common.getuseengine() === webphone_api.global.ENGINE_SERVICE
                || (webphone_api.common.getuseengine() === webphone_api.global.ENGINE_WEBRTC && (webphone_api.common.IsMizuServerOrGateway() || webphone_api.common.CanIUseService() === true))
            ))
        
//--        if (availableFunc.indexOf('conference') >= 0 || (webphone_api.common.IsMizuServerOrGateway() === true && IsConferenceRoom() === true)) // for conference rooms
        {
            webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_CONFERENCE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_conference') + '</a></li>' ).listview('refresh');
        }
    }
    
    if (availableFunc.indexOf('chat') >= 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_MESSAGE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_message') + '</a></li>' ).listview('refresh');
    }
    
//OPSSTART
    if (webphone_api.common.Glt() ===  true)
    {
//OPSEND
        if (featureset > 0 && availableFunc.indexOf('transfer') >= 0 && (webphone_api.global.checkIfCallActive === true || webphone_api.common.GetNrOfActiveCalls() > 0))
        {
            if (webphone_api.common.Trim(webphone_api.common.GetParameter('transfername1')).length > 0
                        || webphone_api.common.Trim(webphone_api.common.GetParameter('transfername2')).length > 0
                        || webphone_api.common.Trim(webphone_api.common.GetParameter('transfername3')).length > 0
                        || webphone_api.common.Trim(webphone_api.common.GetParameter('transfername4')).length > 0
                        || webphone_api.common.Trim(webphone_api.common.GetParameter('transfername5')).length > 0
                        || webphone_api.common.Trim(webphone_api.common.GetParameter('transfername6')).length > 0
                        || webphone_api.common.Trim(webphone_api.common.GetParameter('transfername7')).length > 0
                        || webphone_api.common.Trim(webphone_api.common.GetParameter('transfername8')).length > 0
                        || webphone_api.common.Trim(webphone_api.common.GetParameter('transfername9')).length > 0
                        || webphone_api.common.Trim(webphone_api.common.GetParameter('transfername10')).length > 0
                )
            {
                if (webphone_api.common.Trim(webphone_api.common.GetParameter('transfername1')).length > 0) { webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_TRANSFER1 + '"><a data-rel="back">' + webphone_api.common.GetParameter('transfername1') + '</a></li>' ).listview('refresh'); }
                if (webphone_api.common.Trim(webphone_api.common.GetParameter('transfername2')).length > 0) { webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_TRANSFER2 + '"><a data-rel="back">' + webphone_api.common.GetParameter('transfername2') + '</a></li>' ).listview('refresh'); }
                if (webphone_api.common.Trim(webphone_api.common.GetParameter('transfername3')).length > 0) { webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_TRANSFER3 + '"><a data-rel="back">' + webphone_api.common.GetParameter('transfername3') + '</a></li>' ).listview('refresh'); }
                if (webphone_api.common.Trim(webphone_api.common.GetParameter('transfername4')).length > 0) { webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_TRANSFER4 + '"><a data-rel="back">' + webphone_api.common.GetParameter('transfername4') + '</a></li>' ).listview('refresh'); }
                if (webphone_api.common.Trim(webphone_api.common.GetParameter('transfername5')).length > 0) { webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_TRANSFER5 + '"><a data-rel="back">' + webphone_api.common.GetParameter('transfername5') + '</a></li>' ).listview('refresh'); }
                if (webphone_api.common.Trim(webphone_api.common.GetParameter('transfername6')).length > 0) { webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_TRANSFER6 + '"><a data-rel="back">' + webphone_api.common.GetParameter('transfername6') + '</a></li>' ).listview('refresh'); }
                if (webphone_api.common.Trim(webphone_api.common.GetParameter('transfername7')).length > 0) { webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_TRANSFER7 + '"><a data-rel="back">' + webphone_api.common.GetParameter('transfername7') + '</a></li>' ).listview('refresh'); }
                if (webphone_api.common.Trim(webphone_api.common.GetParameter('transfername8')).length > 0) { webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_TRANSFER8 + '"><a data-rel="back">' + webphone_api.common.GetParameter('transfername8') + '</a></li>' ).listview('refresh'); }
                if (webphone_api.common.Trim(webphone_api.common.GetParameter('transfername9')).length > 0) { webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_TRANSFER9 + '"><a data-rel="back">' + webphone_api.common.GetParameter('transfername9') + '</a></li>' ).listview('refresh'); }
                if (webphone_api.common.Trim(webphone_api.common.GetParameter('transfername10')).length > 0) { webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_TRANSFER10 + '"><a data-rel="back">' + webphone_api.common.GetParameter('transfername10') + '</a></li>' ).listview('refresh'); }
            }else
            {
                webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_TRANSFER + '"><a data-rel="back">' + webphone_api.stringres.get('menu_transfer') + '</a></li>' ).listview('refresh');
            }
        }
//OPSSTART
    }
//OPSEND
    
    if (featureset > 0 && availableFunc.indexOf('mute') >= 0 && (webphone_api.global.checkIfCallActive === true || webphone_api.common.GetNrOfActiveCalls() > 0))
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_MUTE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_mute') + '</a></li>' ).listview('refresh');
    }
    if (featureset > 0 && availableFunc.indexOf('hold') >= 0 && (webphone_api.global.checkIfCallActive === true || webphone_api.common.GetNrOfActiveCalls() > 0))
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_HOLD + '"><a data-rel="back">' + webphone_api.stringres.get('menu_hold') + '</a></li>' ).listview('refresh');
    }
    
    if (webphone_api.common.CanIUseVideo() === true)
    {
        // don't display Video Recall menu item if used in android for video calls
        if (webphone_api.common.IsCExt() < 1)
        {
            webphone_api.$(menuId).append( '<li id="' + MENUITEM_RECALL_VIDEO + '"><a data-rel="back">' + webphone_api.stringres.get('menu_videorecall') + '</a></li>' ).listview('refresh');
        }
    }
    
    if (webphone_api.common.IsMultiline() === 1)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_MULTILINECALL + '"><a data-rel="back">' + webphone_api.stringres.get('menu_multilinecall') + '</a></li>' ).listview('refresh');
    }
//OPSSTART
    if (webphone_api.common.Glt() ===  true)
//OPSEND
        if (featureset > 5 && availableFunc.indexOf('callforward') >= 0 && showcallfwd === true)
        {
            webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_CALLFORWARD + '"><a data-rel="back">' + webphone_api.stringres.get('menu_callforward') + '</a></li>' ).listview('refresh');
        }
    
    if (featureset > 0 && availableFunc.indexOf('speaker') >= 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_SPEAKER + '"><a data-rel="back">' + webphone_api.stringres.get('menu_speaker') + '</a></li>' ).listview('refresh');
    }
    
    if (showignore === true)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_IGNORE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_ignore') + '</a></li>' ).listview('refresh');
    }
    
    if (webphone_api.common.IsWindowsSoftphone() === true && callmode > 0)
    {
        if (webphone_api.common.GetParameterInt('softphonevideomode', 0) === 1)
        {
            webphone_api.$(menuId).append( '<li id="' + MENUITEM_EXIT_VIDEOMODE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_exit_videomode') + '</a></li>' ).listview('refresh');
        }
    }
    
    if (webphone_api.$('#mline_layout').is(':visible'))
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_ACCEPT_HOLD + '"><a data-rel="back">' + webphone_api.stringres.get('menu_accept_hold') + '</a></li>' ).listview('refresh');
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_ACCEPT_END + '"><a data-rel="back">' + webphone_api.stringres.get('menu_accept_end') + '</a></li>' ).listview('refresh');
    }

    var cpnr = webphone_api.common.GetConfig('callparknumber');
    if (webphone_api.common.isNull(cpnr) || cpnr.length < 0) { cpnr = webphone_api.common.GetParameter2('callparknumber'); }
    if (cpnr.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALLPARK + '"><a data-rel="back">' + webphone_api.stringres.get('menu_callpark') + '</a></li>' ).listview('refresh');
    }
    
// show Volume controls/Hide Volume  in menu, if not always displayed
    if (webphone_api.common.GetParameterBool('displayvolumecontrols', false) === false)
    {
        if (webphone_api.common.getuseengine() !== webphone_api.global.ENGINE_WEBRTC)
        {
            var voltitle = '';
            if (webphone_api.$('#volumecontrols').is(':visible'))
            {
                voltitle = webphone_api.stringres.get('menu_volumehide');
            }else
            {
                voltitle = webphone_api.stringres.get('menu_volumeshow');
            }
            
            webphone_api.$(menuId).append( '<li id="' + MENUITEM_VOLUME_CONTROLS + '"><a data-rel="back">' + voltitle + '</a></li>' ).listview('refresh');
        }
    }
    
//-- show Audio device/Hide Audio device  in menu, if not always displayed
//--    if (webphone_api.common.GetParameterBool('displayaudiodevice', false) === false)
//--    {
//--        var audiotitle = '';
//--        if (webphone_api.$('#audiodevice_container').is(':visible'))
//--        {
//--            audiotitle = webphone_api.stringres.get('menu_audiodevicehide');
//--        }else
//--        {
//--            audiotitle = webphone_api.stringres.get('menu_audiodeviceshow');
//--        }
        
//--        webphone_api.$(menuId).append( '<li id="' + MENUITEM_AUDIO_DEVICE + '"><a data-rel="back">' + audiotitle + '</a></li>' ).listview('refresh');
//--    }

    if ((webphone_api.common.getuseengine() === webphone_api.global.ENGINE_WEBRTC && (webphone_api.common.GetBrowser() === 'Firefox' || webphone_api.common.GetBrowser() === 'Chrome'))
        || webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE() || webphone_api.common.getuseengine() === webphone_api.global.ENGINE_SERVICE || webphone_api.common.getuseengine() === webphone_api.global.ENGINE_JAVA)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_AUDIO_DEVICE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_audiodeviceshow') + '</a></li>' ).listview('refresh');
    }

    if (callmode === 1)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALL_AUDIO_ONLY + '"><a data-rel="back">' + webphone_api.stringres.get('menu_mute_video') + '</a></li>' ).listview('refresh');
    }

//OPSSTART
    if (webphone_api.common.Glcr() === true)
    {
//OPSEND
    if (featureset > 0 && webphone_api.common.GetParameter('voicerecupload').length > 0)
    {
        if (IsRecStarted( GetActiveLinePeer() ) === true)
        {
            webphone_api.$(menuId).append( '<li id="' + MENUITEM_RECORD_CALL + '"><a data-rel="back">' + webphone_api.stringres.get('menu_stop_record_call') + '</a></li>' ).listview('refresh');
        }else
        {
            webphone_api.$(menuId).append( '<li id="' + MENUITEM_RECORD_CALL + '"><a data-rel="back">' + webphone_api.stringres.get('menu_record_call') + '</a></li>' ).listview('refresh');
        }
    }
//OPSSTART
    }
//OPSEND
    
    return true;

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#call_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#call_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_CALL_IGNORE:
                webphone_api.ignore();
                break;
            case MENUITEM_CALL_CALLFORWARD:
                CallfunctionsOnclick('callforward');
                break;
            case MENUITEM_CALL_CONFERENCE:
                CallfunctionsOnclick('conference');
                break;
            case MENUITEM_CALL_TRANSFER1:
                SpecialTransfer('1');
                break;
            case MENUITEM_CALL_TRANSFER2:
                SpecialTransfer('2');
                break;
            case MENUITEM_CALL_TRANSFER3:
                SpecialTransfer('3');
                break;
            case MENUITEM_CALL_TRANSFER4:
                SpecialTransfer('4');
                break;
            case MENUITEM_CALL_TRANSFER5:
                SpecialTransfer('5');
                break;
            case MENUITEM_CALL_TRANSFER6:
                SpecialTransfer('6');
                break;
            case MENUITEM_CALL_TRANSFER7:
                SpecialTransfer('7');
                break;
            case MENUITEM_CALL_TRANSFER8:
                SpecialTransfer('8');
                break;
            case MENUITEM_CALL_TRANSFER9:
                SpecialTransfer('9');
                break;
            case MENUITEM_CALL_TRANSFER10:
                SpecialTransfer('10');
                break;
            case MENUITEM_CALL_TRANSFER:
                CallfunctionsOnclick('transfer');
                break;
            case MENUITEM_CALL_NUMPAD:
                CallfunctionsOnclick('numpad');
                break;
            case MENUITEM_CALL_MUTE:
                CallfunctionsOnclick('mute');
                break;
            case MENUITEM_CALL_HOLD:
                CallfunctionsOnclick('hold');
                break;
            case MENUITEM_CALL_SPEAKER:
                CallfunctionsOnclick('speaker');
                break;
            case MENUITEM_CALL_MESSAGE:
                CallfunctionsOnclick('chat');
                break;
            case MENUITEM_VOLUME_CONTROLS:
                ShowHideVolumeControls();
                break;
            case MENUITEM_AUDIO_DEVICE:
                //ShowHideAudioDevice();
                webphone_api.devicepopup();
                break;
            case MENUITEM_RECALL_VIDEO:
                VideoRecall();
                break;
            case MENUITEM_CALLPARK:
                CallPark();
                break;
            case MENUITEM_MULTILINECALL:
                NewMultilineCall();
                break;
            case MENUITEM_ACCEPT_HOLD:
                AcceptHold(true);
                break;
            case MENUITEM_ACCEPT_END:
                AcceptEnd(true);
                break;
            case MENUITEM_EXIT_VIDEOMODE:
                webphone_api.common.ExitVideoMode('USER,call Menu');
                break;
            case MENUITEM_RECORD_CALL:
                var apeer = GetActiveLinePeer();
                if (IsRecStarted(apeer) === true)
                {
                    StopRecording(apeer);
                }else
                {
                    StartRecording(apeer);
                }
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: MenuItemSelected", err); }
}

function GetActiveLinePeer ()
{
    try{
        if (!webphone_api.common.isNull(webphone_api.global.ep) || webphone_api.global.ep.length > 0)
        {
            for (var i = 0; i < webphone_api.global.ep.length; i++)
            {
                if (webphone_api.common.isNull(webphone_api.global.ep[i]) || webphone_api.global.ep[i].length < 5) { continue; }

                var lntmp = webphone_api.global.ep[i][webphone_api.common.EP_LINE];

                if (lntmp == webphone_api.global.aline)
                {
                    var peer = webphone_api.global.ep[i][webphone_api.common.EP_DESTNR];
                    if (!webphone_api.common.isNull(peer) && peer.length > 0)
                    {
                        return peer;
                    }else
                    {
                        break;
                    }
                }
            }
        }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: GetActiveLinePeer", err); }
    return callnumber;
}

function IsRecStarted (peer)
{
    try{
        if (webphone_api.common.isNull(peer) || peer.length < 1) { return false; }
        if (webphone_api.common.isNull(rec_status)) { rec_status = {}; }
        
        var rec = rec_status[peer];
        if (!webphone_api.common.isNull(rec))
        {
            if (rec == '1' || rec == 1)
            {
                return true;
            }
        }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: IsRecStarted", err); }
    return false;
}

// object holding recording filename and recording status for all peers
// ex: peer: status
// status: 0: recording stopped or not started, 1: recording started
// !!! stop all call recording on hangup
var rec_status = {};
function StartRecording(peer) // start audio recording
{
    try{
        if (webphone_api.common.isNull(peer) || peer.length < 1) { return; }
        
        if (webphone_api.common.isNull(rec_status)) { rec_status = {}; }
        
        webphone_api.voicerecord (true, webphone_api.common.GetParameter('voicerecftp_addr'));

        rec_status[peer] = 1;

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: StartRecording", err); }
}

function StopRecording(peer) // stop audio recording
{
    try{
        if (webphone_api.common.isNull(peer) || peer.length < 1) { return; }
        
        webphone_api.voicerecord (false, webphone_api.common.GetParameter('voicerecftp_addr'));

        delete rec_status[peer];

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: StopRecording", err); }
}

function VideoRecall()
{
    try{
    if (callmode > 0)
    {
        webphone_api.common.ShowToast('This is already a video call');
        webphone_api.common.PutToDebugLog(2, 'WARNING, _call VideoRecall this is already a video call');
        return;
    }
    webphone_api.common.PutToDebugLog(2, 'EVENT, _call USER VideoRecall');
    webphone_api.global.dontshow_closecall = true;
    HangupCall();
    setTimeout(function ()
    {
        webphone_api.global.add_recall_header = true;
        webphone_api.videocall(callnumber);
        webphone_api.global.dontshow_closecall = false;
    }, 250);

    CFUsageClickCount(CLICK_VIDEO);

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: VideoRecall", err); }
}

function CallPark()
{
    try{
    var cpnr = webphone_api.common.GetConfig('callparknumber');
    if (webphone_api.common.isNull(cpnr) || cpnr.length < 0) { cpnr = webphone_api.common.GetParameter2('callparknumber'); }
    
    webphone_api.common.PutToDebugLog(3, 'EVENT, call CallPark onclick: ' + cpnr);

    if (cpnr.length < 1) { return; }

    webphone_api.dtmf(cpnr);

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: CallPark", err); }
}

function ShowHideVolumeControls()
{
    try{
    if (webphone_api.$('#volumecontrols').is(':visible'))
    {
        webphone_api.$('#volumecontrols').hide();
    }else
    {
        webphone_api.$('#volumecontrols').show();
    }

    MeasureCall();

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: ShowHideVolumeControls", err); }
}

function ShowHideAudioDevice()
{
    try{
    if (webphone_api.$('#audiodevice_container').is(':visible'))
    {
        webphone_api.$('#audiodevice_container').hide();
    }else
    {
        webphone_api.$('#audiodevice_container').show();
    }

    MeasureCall();

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: ShowHideVolumeControls", err); }
}

function IsConferenceRoom() // check if called number is a conference room number
{
    try{
    if (webphone_api.common.isNull(callnumber) || callnumber.length < 0) { return false; }
    var cfr = webphone_api.common.GetParameter('received_confrooms');
    var list = cfr.split(',');
    for (var i = 0; i < list.length; i++)
    {
        if (list[i] === callnumber)
        {
            return true;
        }
    }

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: ShowHideVolumeControls", err); }
    return false;
}

function onStop(event)
{
    try{
        if(webphone_api.common.CanLog(4)) { webphone_api.common.PutToDebugLog(4, "EVENT, _call: onStop"); }
    webphone_api.global.isCallStarted = false;

    webphone_api.global.CLOSE_CALL_TIMER = -100;
    
    webphone_api.global.hangupPressedCount = 0;
    webphone_api.$('#call_duration').html('');
    webphone_api.global.rating = '';
    
    webphone_api.global.closeCallAtivity = false;
//OPSSTART
    webphone_api.plhandler.Cfin();
//OPSEND
    
    webphone_api.global.lastRingEvenet = '';
    webphone_api.global.isconfroom_call = false;
    callmode = 0;
    lastBtns = '';
    
    webphone_api.$('#page_call_additional_info').html('');
    webphone_api.$('#page_call_peer_details').html('');
    
    webphone_api.$('#callfunctions_layout').html('');
    webphone_api.$("#ml_buttons").html('');
    webphone_api.global.acallcount = 0;
    webphone_api.$('#numpad_number').html('');
    webphone_api.global.callPageStatusCachePerLine = {};

//-- after multiline calls, on the next call, these show up if don't hide them
    webphone_api.$('#acceptreject_layout').hide();
    webphone_api.$('#hangup_layout').hide();

    if (!webphone_api.common.isNull(rec_status))
    {
        var recInProgress = false;
        for (var key in rec_status)
        {
            if (rec_status.hasOwnProperty(key))
            {
                if (rec_status[key] == 1)
                {
                    recInProgress = true;
                    break;
                }
            }
        }
        if (recInProgress)
        {
            StopRecording(GetActiveLinePeer());
        }
        delete rec_status;
        rec_status = {};
    }

    if (webphone_api.common.IsSDK() === false)
    {
        webphone_api.$('#display_notmain_account').html('');
        webphone_api.$('#display_notmain_account').hide();
    }

    
//--    webphone_api.$("#btn_hangup").off('click');
//--    webphone_api.$("#btn_accept").off('click');
//--    webphone_api.$("#btn_reject").off('click');
    
//--    webphone_api.$('#btn_conference').off('click');
//--    webphone_api.$('#btn_transfer').off('click');
//--    webphone_api.$('#btn_numpad').off('click');
//--    webphone_api.$('#btn_mute').off('click');
//--    webphone_api.$('#btn_hold').off('click');
//--    webphone_api.$('#btn_speaker').off('click');

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_call: onStop", err); }
}

function onDestroy (event){}// deprecated by onstop


// public members and methods
return {
    onCreate: onCreate,
    onStart: onStart,
    onStop: onStop,
    onDestroy: onDestroy,
    CloseCall: CloseCall,
    MeasureCall: MeasureCall,
    OnCallerHangup: OnCallerHangup,
    AcceptCall: AcceptCall,
    RejectCall: RejectCall,
    LineCliked: LineCliked,
    OnNewIncomingCall: OnNewIncomingCall,
    UpdateLineButtons: UpdateLineButtons,
    StartRecording: StartRecording,
    StopRecording: StopRecording,
    IsRecStarted: IsRecStarted,
    GetActiveLinePeer: GetActiveLinePeer,
    CFUsageClickCount: CFUsageClickCount
};
})();
