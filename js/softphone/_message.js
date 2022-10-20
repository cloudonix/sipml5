// Message List page
webphone_api._message = (function ()
{
var mAction = '';
var msgSent = false;
var textarea = null;
var mMessage = '';
var mContent = '';
var sendrec = false; // if at least one message was sent or received in this session
var placeholderhidden = false;
var enablepres = false;
var composePlaceHolder = '<span style="color: #ccc;">' + webphone_api.stringres.get('messagepl') + '</span>';

function onCreate (event) // called only once - bind events here
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _message: onCreate");
    
    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_message')
        {
            MeasureMessage();
        }
    });
    
    webphone_api.$('#message_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_message_menu").on("click", function() { CreateOptionsMenu('#message_menu_ul'); });
    webphone_api.$("#btn_message_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    
var lastiscomposingsenttick = 0;  //milliseconds. reset to 0 at every chat send and chatreport recv
var reportforlastchatmessagereceived= 0;  //0=not needed,1=needed,2=received success,3=received fail  (set state on chat send to 1 and chatreport recv to 2 or 3)
    webphone_api.$("#msg_textarea").keyup(function()
    {
        
    // character count
        webphone_api.$("#msg_charcount").text(webphone_api.$(this).html().length);
        
        //don’t send if previous msg is pending
        if (reportforlastchatmessagereceived === 1)
        {
            return;
        }

        if (lastiscomposingsenttick === 0 || webphone_api.common.GetTickCount() - lastiscomposingsenttick > 10000)  //send in every 10 second on typing
        {
            lastiscomposingsenttick = webphone_api.common.GetTickCount();
            webphone_api.sendchatiscomposing(webphone_api.global.mto);
        }
    });
    
    webphone_api.$( "#msg_textarea" ).keypress(function( event )
    {
    // handle placeholder in div
        if (placeholderhidden === false)
        {
            placeholderhidden = true;
            var mtmp = webphone_api.$("#msg_textarea").html();
            
            if (!webphone_api.common.isNull(mtmp) && mtmp.length > 0)
            {
                var pos = mtmp.indexOf('</span>');
                if (pos > 0)
                {
                    mtmp = mtmp.substring(pos + 7);
                    webphone_api.$("#msg_textarea").html(mtmp);
                }
            }
        }

//--        // handle delete in content ediatble in Firefox
//--        if (webphone_api.common.GetBrowser() === 'Firefox')
//--        {
//--            var charCode = (event.keyCode) ? event.keyCode : event.which; // workaround for firefox
//--            if (charCode === 46) // delete
//--            {
//--                var cpos = GetCursorPosition(document.getElementById('msg_textarea'));
//--                var htmlc = webphone_api.$("#msg_textarea").html();

//--                if (webphone_api.common.isNull(cpos) || cpos < 0 || webphone_api.common.isNull(htmlc) || htmlc.length < cpos) { return; }
//--            alert(htmlc);

//--                var delidx = 0;
//--                var insidetag = false; // don't count characters if we are inside of a html tag
//--                for (var i = 0; i < htmlc.length; i++)
//--                {
//--                    if (delidx === cpos)
//--                    {
//--                        var begin = htmlc.substring(0, i);
//--                        var end = htmlc.substring(i + 1, htmlc.length);
//--                        webphone_api.$("#msg_textarea").html(begin + end);
//--                        break;
//--                    }
                    
//--                    if (htmlc.charCodeAt(i) === '<') { insidetag = true; }
//--                    if (insidetag === true && htmlc.charCodeAt(i - 1) === '>') { insidetag = false; }
                    
//--                    if (insidetag === false)
//--                    {
//--                        delidx++;
//--                    }
//--                }
//--            }
//--        }

        if (webphone_api.common.GetParameter2('sendchatonenter') !== 'false')
        {
            if ( event.which === 13)
            {
                event.preventDefault();
                webphone_api.$("#btn_msgsend").click();
            }else
            {
                return;
            }
        }else
        {
            return;
        }
    });
    
    webphone_api.$("#status_message").attr("title", webphone_api.stringres.get("hint_status"));
    webphone_api.$("#curr_user_message").attr("title", webphone_api.stringres.get("hint_curr_user"));
    
    webphone_api.$("#btn_msgsend").on("click", function()
    {
        SendMessage();
        lastiscomposingsenttick = 0;
    });
    
    webphone_api.$("#msg_btn_sendfile").on("click", function()
    {
        webphone_api.common.FileTransfer(webphone_api.$("#msgpick_input").val());
    });
    webphone_api.$("#msg_btn_sendfile").attr("title", webphone_api.stringres.get("hint_filetranf"));
    
    webphone_api.$("#btn_msgsend").attr("title", webphone_api.stringres.get('hint_sendmsg'));

    webphone_api.$("#msg_btn_smiley").on("click", function() { OpenSmileys(); });
    webphone_api.$("#msg_btn_smiley").attr("title", webphone_api.stringres.get('hint_smiley'));
    
    webphone_api.$("#btn_msgpick").on("click", function() { webphone_api.common.PickContact(PickContactResult); });
    webphone_api.$("#btn_msgpick").attr("title", webphone_api.stringres.get('hint_choosect'));
    
    webphone_api.$("#msg_btnback").attr("title", webphone_api.stringres.get("hint_btnback"));
        
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: onCreate", err); }
}

function GetCursorPosition(element)
{
    try{
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: GetCursorPosition", err); }
    return 0;
}

function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _message: onStart");
    webphone_api.global.isMessageStarted = true;
    
//--    webphone_api.$("#phone_number").attr("placeholder", webphone_api.stringres.get("phone_nr"));
//--    document.getElementById("app_name_message").innerHTML = webphone_api.common.GetBrandName();
    
    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#page_message'), -30) );
    
// add placeholder on page start
    webphone_api.$( "#msg_textarea" ).html(composePlaceHolder);
    
// needed for proper display and scrolling of listview
    MeasureMessage();
    
    if (webphone_api.common.UsePresence2() === true) { enablepres = true; }
    
    // fix for IE 10
//--    if (webphone_api.common.IsIeVersion(10)) { webphone_api.$("#messagelist_list").children().css('line-height', 'normal'); }
    
    mAction = webphone_api.common.GetIntentParam(webphone_api.global.intentmsg, 'action');
    webphone_api.global.mto = webphone_api.common.GetIntentParam(webphone_api.global.intentmsg, 'to');
    mMessage = webphone_api.common.GetIntentParam(webphone_api.global.intentmsg, 'message');
    
    if (!webphone_api.common.isNull(document.getElementById('msg_title')) && !webphone_api.common.isNull(mAction))
    {
        if (mAction === 'sms')
        {
            document.getElementById('msg_title').innerHTML = webphone_api.stringres.get("msg_title_sms");
        }else
        {
            document.getElementById('msg_title').innerHTML = webphone_api.stringres.get("msg_title_chat");
        }
    }
    webphone_api.$("#msg_title").attr("title", webphone_api.stringres.get("hint_page"));

    if (!webphone_api.common.isNull(document.getElementById('msg_btnback')))
    {
        document.getElementById('msg_btnback').innerHTML = '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("go_back_btn_txt");
    }
    
    if (webphone_api.common.isNull(webphone_api.global.mto)) { webphone_api.global.mto = ''; }
    if (webphone_api.common.isNull(mMessage)) { mMessage = ''; }
    
    webphone_api.$("#msgpick_input").attr("placeholder", webphone_api.stringres.get("chat_nr"));
    
    webphone_api.$('#msgpick_input').keyup(function()
    {
        HandleChatSms();
    });
    webphone_api.$('#msgpick_input').on('input',function(e){
        HandleChatSms();
    });             
    
// set focus on destination or message compose area
    setTimeout(function ()
    {
        var tovalTmp = webphone_api.$("#msgpick_input").val();
        if (webphone_api.common.isNull(tovalTmp) || (webphone_api.common.Trim(tovalTmp)).length < 1)
        {
            webphone_api.$("#msgpick_input").focus();
        }else
        {
            webphone_api.$("#msg_textarea").focus();
        }
    }, 100);
        
    LoadMessage();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: onStart", err); }
}

// decice whether is chat or sms, based on input number
function HandleChatSms()
{
    try{
//--  !!!NOT NEEDED        if (webphone_api.common.GetParameterBool('customizedversion', true) === false) { return; }
        
        var sms = webphone_api.common.GetParameter('sms');
        if (webphone_api.common.isNull(sms) || sms.length < 3) { return; }
        /*
        var textmessaging = webphone_api.common.GetParameterInt('textmessaging',-2);
        if(textmessaging < -1)
        {
            var chatsms = webphone_api.common.GetParameterInt('chatsms',-2);
            switch(chatsms)
            {
                case 0: textmessaging = -1; break;
                case 1: textmessaging = 3; break;
                case 2: textmessaging = 6; break;
                case 3: textmessaging = 0; break;
            }
            if(textmessaging < -1)
            {
                var haschat = webphone_api.common.GetParameterInt('haschat');
                switch(haschat)
                {
                    case 0: textmessaging = 0; break;
                    case 1: textmessaging = 3; break;
                    case 2: textmessaging = 5; break;
                    case 3: textmessaging = 6; break;
                    case 4: textmessaging = -1; break;
                }
            }
        }
        */
        var nr = webphone_api.$("#msgpick_input").val();
        if (webphone_api.common.isNull(nr) || webphone_api.common.Trim(nr).length < 1) { return; }
        nr = webphone_api.common.Trim(nr);

        /*
        if (textmessaging < 0) // if (chatsms === '0') // Ask / Automatic !!!! Treat as automatic (Istvan)
        {
            var tmpNumber = nr;
            if (tmpNumber.indexOf('+') >= 0) { tmpNumber = tmpNumber.substring(tmpNumber.indexOf('+') + 1, tmpNumber.length); }

            //if (!tmpNumber.match('^[0-9 ]{6,20}$'))
            if (webphone_api.common.IsNumber(tmpNumber) && tmpNumber.length > 6 && tmpNumber.length < 20)
            {
                mAction = 'sms';
                document.getElementById('msg_title').innerHTML = webphone_api.stringres.get("msg_title_sms");
            }else
            {
                mAction = 'chat';
                document.getElementById('msg_title').innerHTML = webphone_api.stringres.get("msg_title_chat");

//          This was used for "Ask"
//                    PutToDebugLog(4, 'EVENT, StartMsg called action: ' + action + '; number: ' + number + '; fromclass: ' + fromclass + ' (4)');
//                    ChooseChatOrSms(number, msg);
            }
        }
        */
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: HandleChatSms", err); }
}

function MeasureMessage() // resolve window height size change
{
    try{
//--    var pgh = webphone_api.common.GetDeviceHeight() - 1; webphone_api.$('#page_message').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_message').css('min-height', 'auto'); // must be set when softphone is skin in div

    var heightTemp = webphone_api.common.GetDeviceHeight() - webphone_api.$("#message_header").height() /*- webphone_api.$('#msg_spacer').height()*/ - webphone_api.$('#msg_textarea_container').height();

    if (document.getElementById('msgpick_container').style.display === 'block')
    {
        heightTemp = heightTemp - webphone_api.$("#msgpick_container").height();
    }
    
    var curruser = webphone_api.common.GetCallerid();
    if (!webphone_api.common.isNull(curruser) && curruser.length > 0) { webphone_api.$('#curr_user_message').html(curruser); }
// set status width so it's uses all space to curr_user
    var statwidth = webphone_api.common.GetDeviceWidth() - webphone_api.$('#curr_user_message').width() - 25;
    if (!webphone_api.common.isNull(statwidth) && webphone_api.common.IsNumber(statwidth))
    {
        webphone_api.$('#status_message').width(statwidth);
    }

    heightTemp = Math.floor( heightTemp - 6 );
    webphone_api.$("#msg_list").height(heightTemp);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: MeasureMessage", err); }
}

function LoadMessage()
{
    try{
    // if file exists, read content and populateit
    if (!webphone_api.common.isNull(webphone_api.global.mto) && webphone_api.global.mto.length > 0)
    {
        document.getElementById('msgpick_input').value = webphone_api.global.mto;
        
        // filenames: sms/chat_username_number
    
        var currfile = mAction + '_' + webphone_api.common.GetSipusername() + '_' + webphone_api.global.mto;
        
        webphone_api.File.ReadFile(currfile, webphone_api.global.STORAGE_LOCAL, function (content)
        {
            if ( webphone_api.common.isNull(content) || webphone_api.common.Trim(content).length < 1 )
            {
                webphone_api.common.PutToDebugLog(2, 'ERROR, _message: LoadMessage no content');
                content = '';
                document.getElementById('msgpick_container').style.display = 'block';
                MeasureMessage();
            }
            mContent = content;
            
            if (!webphone_api.common.isNull(mMessage) && mMessage.length > 0 && mContent.indexOf('<p>' + mMessage + '</p>') < 0)
            {
                AddMessage('1', true);
            }
            
            PopulateData();
        });
        
    }else
    {
        document.getElementById('msgpick_container').style.display = 'block';
        MeasureMessage();
        
        if (!webphone_api.common.isNull(mMessage) && mMessage.length > 0 && mContent.indexOf('<p>' + mMessage + '</p>') < 0)
        {
            AddMessage('1', true);
        }
        
        PopulateData();
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: LoadMessage", err); }
}

function PopulateData() // :no return value
{
    try{
    if ( webphone_api.common.isNull(document.getElementById('page_message_content')) )
    {
        webphone_api.common.PutToDebugLog(2, "ERROR, _message: PopulateList listelement is null");
        return;
    }
    // filenames: sms/chat_username_number

    webphone_api.$('#msg_list').html('');
    webphone_api.$('#msg_list').append(mContent);
    ScrollToBottom();
    RemoveNotification();
    
// show presence status in title, if we have username/contact
    if (!webphone_api.common.isNull(webphone_api.global.mto) && webphone_api.global.mto.length > 0 && enablepres === true)
    {
        var presencequery = [];
        var presence = '-1';
        var presobj = webphone_api.global.presenceHM[webphone_api.global.mto];
        if (!webphone_api.common.isNull(presobj)) { presence = presobj[webphone_api.common.PRES_STATUS]; }

            // -1=not exists(undefined), 0=offline, 1=invisible, 2=idle, 3=pending, 4=DND, 5=online
        if (webphone_api.common.isNull(presence) || presence.length < 1 || presence === '-1')
        {
            webphone_api.common.PresenceGet2(webphone_api.global.mto);
        }else
        {
            DisplayPresence(presence);
        }
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: LoadMessage", err); }
}

function RefreshPresence()
{
    webphone_api.common.PresenceGet2(webphone_api.global.mto);
}

var lastpres_stat = '';
function DisplayPresence(presence)
{
    try{
    if (enablepres !== true || webphone_api.common.isNull(presence) || presence.length < 1) { return; }
    lastpres_stat = presence;

    if (!webphone_api.common.isNull(document.getElementById('msg_title')) && !webphone_api.common.isNull(mAction))
    {
        var ptitle = '';
        if (mAction === 'sms') { ptitle = webphone_api.stringres.get("msg_title_sms"); } else { ptitle = webphone_api.stringres.get("msg_title_chat"); }
        
        var presenceimg = '';
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
        
        if (!webphone_api.common.isNull(presenceimg) && presenceimg.length > 0 && !webphone_api.common.isNull(webphone_api.global.mto) && webphone_api.global.mto.length > 0)
        {
            ptitle = ptitle + '&nbsp;&nbsp;&nbsp;' + webphone_api.global.mto + ' ' + presenceimg;

            document.getElementById('msg_title').innerHTML = ptitle;
        }
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: DisplayPresence", err); }
}

function RemoveNotification() // remove new message notification (number) from filenames list for the opened message thread
{
    try{

    var files = webphone_api.common.GetParameter('messagefiles');
    
    if (webphone_api.common.isNull(files) || files.length < 3)
    {
        webphone_api.common.PutToDebugLog(3, 'EVENT, _message: RemoveNotification no message files');
        return;
    }
    
    var msglist = [];
    
    if (!webphone_api.common.isNull(files) && files.length > 0)
    {
        msglist = files.split(',');
    }

    var currfile = mAction + '_' + webphone_api.common.GetSipusername() + '_' + webphone_api.global.mto + '[#';
        
    for (var i = 0; i < msglist.length; i++)
    {
        if (webphone_api.common.isNull(msglist[i]) || msglist[i].length < 3) { continue; }
        
        if (msglist[i].indexOf(currfile) === 0)
        {
            var pos = msglist[i].indexOf('[#');
            
            msglist[i] = msglist[i].substring(0, pos);
            
        // save list
            files = '';
            for (var j = 0; j < msglist.length; j++)
            {
                files = files + ',' + msglist[j];
            }
            
            if (files.indexOf(',') === 0) { files = files.substring(1); } // cut off first comma ,
            if (files.lastIndexOf(',') === files.length - 1) { files = files.substring(0, files.length - 1); } // cut off last comma ,
            
            webphone_api.common.SaveParameter('messagefiles', files);
            
            break;
        }
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: RemoveNotification", err); }
}

function PickContactResult(number)
{
    try{
    document.getElementById('msgpick_input').value = number;
    webphone_api.$("#msg_textarea").focus();
    HandleChatSms();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: PickContactResult", err); }
}

function AddToGroupChat(dest)
{
    try{
    if (webphone_api.common.isNull(dest) || webphone_api.common.Trim(dest).length < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _message: AddToGroupChat invalid destination: ' + dest);
        return;
    }
    
    var inp = document.getElementById('msgpick_input');
    var currval = inp.value;
    if (webphone_api.common.isNull(currval)) { currval = ''; }
    currval = webphone_api.common.Trim(currval);

    // send special message
    if (sendrec === true)
    {
        if (mAction === 'chat')
        {
            var dstlist = currval.split(',');
            for (var i = 0; i < dstlist.length; i++)
            {
                if (webphone_api.common.isNull(dstlist[i]) || webphone_api.common.Trim(dstlist[i]).length < 1) { continue; }

            // send special message about group chat on first message
                var joined = dest + ' ' + webphone_api.stringres.get('gc_message2');
                webphone_api.sendchat(webphone_api.common.Trim(dstlist[i]), joined);
            }

        // send special message about group chat on first message
            var chatwith = '[' + webphone_api.stringres.get('gc_message') + ': ' + currval + ']';
            webphone_api.sendchat(dest, chatwith);
        }
    }


    if (currval.length > 0) { currval = currval + ','; }
    currval = currval + dest;
    inp.value = currval;
    webphone_api.common.PutToDebugLog(2, 'EVENT, _message: AddToGroupChat: ' + dest);

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: AddToGroupChat", err); }
}

function SendMessage() // validate and send chat/sms
{
    try{
    webphone_api.common.PutToDebugLog(5, 'EVENT, _message: SendMessage onclick');

    if (webphone_api.common.isNull(textarea))
    {
        textarea = document.getElementById('msg_textarea');
        if (webphone_api.common.isNull(textarea))
        {
            webphone_api.common.PutToDebugLog(2, 'ERROR, _message: SendMessage textarea is NULL');
            return;
        }
    }
//--    mMessage = textarea.value;
    mMessage = textarea.innerHTML;
    if (!webphone_api.common.isNull(mMessage)) { mMessage = mMessage.replace(composePlaceHolder, ''); }
    
//--    if (webphone_api.common.isNull(webphone_api.global.mto) || webphone_api.global.mto.length < 1)
//--    {
        var tofrom = document.getElementById('msgpick_input').value;

        if ( webphone_api.common.isNull(tofrom) || (webphone_api.common.Trim(tofrom)).length < 1 )
        {
            if (mAction === 'sms')
            {
                webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_5'));
            }else
            {
                webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_6'));
            }
            return;
        }else
        {
            webphone_api.global.mto = tofrom;
        }
//--    }
    
    if ( webphone_api.common.isNull(mMessage) || (webphone_api.common.Trim(mMessage)).length < 1 )
    {
        //textarea.value = '';
        textarea.innerHTML = '';
        return;
    }
    
    mMessage = RemoveEmoticon(mMessage);

    SendAction(webphone_api.global.mto, mMessage);
    
//--    textarea.value = '';
    textarea.innerHTML = '';

    if (msgSent)
    {
        AddMessage('1', false);

//--        // show that message is sent after 1500 ms (FAKE)
//--        setTimeout(function ()
//--        {
//--            webphone_api.common.ShowToast(webphone_api.stringres.get('message_sent'));
            
//--            // request focus after toast closes
//--            setTimeout(function ()
//--            {
//--                textarea.focus();
//--            }, 3500);
//--        }, 1500);
    }else
    {
        AddMessage('0', false);
    }

    textarea.focus();

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: SendMessage", err); }
}

function SendAction(to, msg) // actually send the message
{
    try{
    var smsapi = webphone_api.common.GetParameter('sms');
    if (mAction === 'sms' && !webphone_api.common.isNull(smsapi) && smsapi.length > 0)
    {
        webphone_api.common.PutToDebugLog(5,"EVENT, _message SMS SendMessage to: " + webphone_api.global.mto + '; message: ' + mMessage);

        var toLocal = webphone_api.common.Trim(webphone_api.global.mto);
        var msgLocal = webphone_api.common.StripXML(mMessage);
        
    // handle groupchat
        if (webphone_api.global.mto.indexOf(',') > 0)
        {
            var dstlist = webphone_api.global.mto.split(',');
            for (var i = 0; i < dstlist.length; i++)
            {
                if (webphone_api.common.isNull(dstlist[i]) || webphone_api.common.Trim(dstlist[i]).length < 1) { continue; }
                
                // send special message about group chat on first message
                if (sendrec === false)
                {
                    var chatwith = dstlist.toString();
                    chatwith = chatwith.replace(',' + dstlist[i], '');
                    chatwith = chatwith.replace(dstlist[i] + ',', '');
                    chatwith = chatwith.replace(dstlist[i], '');
                    chatwith = '[' + webphone_api.stringres.get('gc_message') + ': ' + chatwith + ']';
                    
                    webphone_api.common.UriParser(smsapi, '', webphone_api.common.GetSipusername(), webphone_api.common.Trim(dstlist[i]), chatwith, 'sendsms');
                }
                
                webphone_api.common.UriParser(smsapi, '', webphone_api.common.GetSipusername(), webphone_api.common.Trim(dstlist[i]), msgLocal, 'sendsms');
            }
        }else
        {
            webphone_api.common.UriParser(smsapi, '', webphone_api.common.GetSipusername(), toLocal, msgLocal, 'sendsms');
        }

        msgSent = true;
    }else
    {
        if (webphone_api.global.mto.indexOf(',') > 0 && sendrec === false)
        {
            var dstlist = webphone_api.global.mto.split(',');
            for (var i = 0; i < dstlist.length; i++)
            {
                if (webphone_api.common.isNull(dstlist[i]) || webphone_api.common.Trim(dstlist[i]).length < 1) { continue; }
                
            // send special message about group chat on first message
                var chatwith = dstlist.toString();
                chatwith = chatwith.replace(',' + dstlist[i], '');
                chatwith = chatwith.replace(dstlist[i] + ',', '');
                chatwith = chatwith.replace(dstlist[i], '');
                chatwith = '[' + webphone_api.stringres.get('gc_message') + ': ' + chatwith + ']';

                webphone_api.sendchat(webphone_api.common.Trim(dstlist[i]), chatwith);
            }
        }
        
        webphone_api.sendchat(webphone_api.global.mto, mMessage);
        msgSent = true;
    }
    
    sendrec = true;
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: SendAction", err); }
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

function GetDateForMessage()
{
    try{
    var date = new Date();

    var minutes = date.getMinutes();
    if (minutes < 10) { minutes = '0' + minutes; }

    var day = date.getDate(); //-- getDay returns the day of the week
    if (day < 10) { day = '0' + day; }

    var datestr = month[date.getMonth()] + ', ' + day + ' ' + date.getFullYear()+ ' '
            + date.getHours() + ':' + minutes;
    
    return datestr;

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: GetDateForMessage", err); }
    return '';
}

var lastmsg = '';
var lasttickmsg = 0;
var climit = -1;
// add message to UI and save it in List<String>
function AddMessage(sentStatus, isincoming)
{
    var lastoop = 0;
    try{

    if (webphone_api.common.isNull(mMessage))
    {
        webphone_api.common.PutToDebugLog(3, "ERROR, _message: AddMessage message is empty (null)");
        return;
    }
    
// filter duplicate chat messages: filterchatduplicates
    if (climit < 0)
    {
        if (webphone_api.common.GetParameter2('filterchatduplicates') === 'true')
        {
            climit = 10000; // 10 sec
        }else
        {
            climit = 1000;
        }
    }
    lastoop = 1;
    var NOW = webphone_api.common.GetTickCount();
    if (mMessage.length > 0 && mMessage === lastmsg && NOW - lasttickmsg < climit) { return; }
    lastmsg = mMessage;
    lasttickmsg = NOW;

    var ctname = '';
    if (isincoming)
    {
        ctname = webphone_api.common.GetContactNameFromNumber(webphone_api.global.mto);
    }else
    {
        ctname = webphone_api.stringres.get('me');
    }
    
    var formattedmsg = '';
// if received chat message is filetransfer, then create a link from url
    if (mMessage.indexOf('/filestorage/') > 0)
    {
        var pos;
        webphone_api.common.PutToDebugLog(2, 'EVENT,xxxxxx msg: ' + mMessage);
        if (mMessage.indexOf('<a href=') >= 0)
        {
            //received full html. display as-is, just insert the onclick handler which sends feedback to sender
            //example: 8888 sent you a file: <a href="http://192.168.154.130/mvweb/filestorage/39998a69099a98e0dc549b81757e70b6/test.txt" target="_blank" >test.txt</a>
            formattedmsg = mMessage;
            pos = formattedmsg.indexOf('sent you a file: ');
            if (pos >= 0)
            {
                formattedmsg = formattedmsg.substring(pos + 17);
            }
            if (formattedmsg.indexOf('target="_blank"') >= 0)
            {
                formattedmsg = formattedmsg.replace('target="_blank"', 'target="_blank" onclick="try{webphone_api.filetransfercallback(\'' + webphone_api.global.mto + '\')}catch(e){;}"');
                webphone_api.common.PutToDebugLog(2, 'EVENT,xxxxxx a: ' + formattedmsg);
            }
            else
            {
                formattedmsg = formattedmsg.replace('>', ' onclick="try{webphone_api.filetransfercallback(\'' + webphone_api.global.mto + '\')}catch(e){;}" >');
                webphone_api.common.PutToDebugLog(2, 'EVENT,xxxxxx b: ' + formattedmsg);
            }

        }
        else {
            // try to get url
            var furl = mMessage;
            var filename = '';
            pos = furl.indexOf('http:');
            if (pos < 0)
            {
                pos = furl.indexOf('https:');

            }
            if (pos >= 0)
            {
                furl = webphone_api.common.Trim(furl.substring(pos, furl.length));
                pos = furl.lastIndexOf('</'); // remove html element closing like </span></p>
                if (pos > 0) {
                    furl = webphone_api.common.Trim(furl.substring(0, pos));
                }

                // try to get filename
                filename = furl;
                pos = filename.lastIndexOf('/');
                if (pos > 0) {
                    filename = filename.substring(pos + 1, filename.length);
                }
                filename = webphone_api.common.Trim(filename);
                pos = filename.indexOf('"');
                if (pos > 0) {
                    filename = filename.substring(0, pos);
                }

                pos = furl.indexOf('"');
                if (pos > 0) {
                    furl = furl.substring(0, pos);
                }
            }

            if (!webphone_api.common.isNull(filename) && filename.length > 0 && !webphone_api.common.isNull(furl) && furl.length > 10) {
                pos = mMessage.indexOf('http:');
                if (pos < 0) {
                    pos = mMessage.indexOf('https:');
                }
                var start_of_msg = webphone_api.common.Trim(mMessage.substring(0, pos));

                webphone_api.common.PutToDebugLog(2, 'EVENT,xxxxxx url: ' + furl);
                webphone_api.common.PutToDebugLog(2, 'EVENT,xxxxxx fname: ' + filename);
                webphone_api.common.PutToDebugLog(2, 'EVENT,xxxxxx mto: ' + webphone_api.global.mto);

                formattedmsg = start_of_msg + ' <a href="' + furl + '" target="_blank" onclick="try{webphone_api.filetransfercallback(\'' + webphone_api.global.mto + '\')}catch(e){;}">' + filename + '</a>';
                webphone_api.common.PutToDebugLog(2, 'EVENT,xxxxxx formatted: ' + formattedmsg);
            } else {
                formattedmsg = mMessage;
            }
        }
    }
    
    if (webphone_api.common.isNull(formattedmsg) || formattedmsg.length < 1) { formattedmsg = mMessage; }
    formattedmsg = AddEmoticon(formattedmsg);
    
    var imgSrc = 'spacer.png';
    var item = '<b>' + ctname + ':</b><p>' + formattedmsg + '</p><p class="date">' + GetDateForMessage() + '</p><img class="sent_status" src="' + webphone_api.common.GetElementSource() + 'images/' + imgSrc + '" border="0"/>';
    
    webphone_api.$('#msg_list').append(item);
    ScrollToBottom();

    // filenames: sms/chat_username_number[#nrofmissedmessage
    
    if (webphone_api.common.isNull(webphone_api.global.mto) || webphone_api.global.mto.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _message: AddMessage destination number is NULL');
        return;
    }
    
    var currfile = mAction + '_' + webphone_api.common.GetSipusername() + '_' + webphone_api.global.mto;
    
    var files = webphone_api.common.GetParameter('messagefiles');
    var msglist = [];

    if (!webphone_api.common.isNull(files) && files.length > 0) { msglist = files.split(','); }

    var filenameAdded = false;

    //check if filename exists is msglist and make it the first element (last used - first in msg listview)
    for (var i = 0; i < msglist.length; i++)
    {
        if (webphone_api.common.isNull(msglist[i])) { continue; }

// cut off number of missed messages from file names
        var tempmsgfile = msglist[i];
        var pos = tempmsgfile.indexOf('[#');
        if (pos > 0)
        {
            tempmsgfile = tempmsgfile.substring(0, pos);
        }
        
        if (tempmsgfile === currfile)
        {
            msglist.splice(i, 1);
            msglist.unshift(currfile);
            
            // save list
            files = '';
            for (var j = 0; j < msglist.length; j++)
            {
                files = files + ',' + msglist[j];
            }

            if (files.indexOf(',') === 0) { files = files.substring(1); } // cut off first comma ,
            if (files.lastIndexOf(',') === files.length - 1) { files = files.substring(0, files.length - 1); } // cut off last comma ,

            webphone_api.common.SaveParameter('messagefiles', files);
            filenameAdded = true;
            
            break;
        }
    }
    
    if (!filenameAdded)
    {
        if (files.length > 0)
        {
            files = currfile + ',' + files;
            
            if (files.indexOf(',') === 0) { files = files.substring(1); } // cut off first comma ,
            if (files.lastIndexOf(',') === files.length - 1) { files = files.substring(0, files.length - 1); } // cut off last comma ,
        }else
        {
            files = currfile;
        }
        webphone_api.common.SaveParameter('messagefiles', files);
    }
    
    if (mContent.length < 1) // first try to read file, then save it
    {
        if (webphone_api.common.IsWindowsSoftphone())
        {
            webphone_api.common.ApiWinLoadFile(currfile, function (content)
            {
                if ( !webphone_api.common.isNull(content) || webphone_api.common.Trim(content).length > 0 )
                {
                    mContent = content;
                }

                mContent = mContent + item;
                PopulateData();

                webphone_api.common.ApiWinSaveFile(currfile, mContent, function (success)
                {
                    if (success)
                    {
                        webphone_api.common.PutToDebugLog(2, 'ERROR, _message: AddMessage cannot save message file (1) WinApi');
                    }
                });
            });
        }else
        {
            webphone_api.File.ReadFile(currfile, webphone_api.global.STORAGE_LOCAL, function (content)
            {
                if ( !webphone_api.common.isNull(content) || webphone_api.common.Trim(content).length > 0 )
                {
                    mContent = content;
                }

                mContent = mContent + item;
                PopulateData();

                webphone_api.File.SaveFile(currfile, mContent, webphone_api.global.STORAGE_LOCAL, function (success)
                {
                    if (!success)
                    {
                        webphone_api.common.PutToDebugLog(2, 'ERROR, _message: AddMessage cannot save message file (1)');
                    }
                });
            });
        }
    }else // just save in a new file
    {
        mContent = mContent + item;

        if (webphone_api.common.IsWindowsSoftphone())
        {
            webphone_api.common.ApiWinSaveFile(currfile, mContent, function (success)
            {
                if (!success)
                {
                    webphone_api.common.PutToDebugLog(2, 'ERROR, _message: AddMessage cannot save message file (2) WinApi');
                }
            });
        }else
        {
            webphone_api.File.SaveFile(currfile, mContent, webphone_api.global.STORAGE_LOCAL, function (success)
            {
                if (!success)
                {
                    webphone_api.common.PutToDebugLog(2, 'ERROR, _message: AddMessage cannot save message file (2)');
                }
            });
        }
    }

    } catch(err) { webphone_api.common.PutToDebugLogException(2, '_message: AddMessage (' + lastoop.toString() + ')', err); }
}

function SaveMissedIncomingMessage(action, from, name, msg)
{
    try{
    var item = '<b>' + name + ':</b><p>' + msg + '</p><p class="date">' + GetDateForMessage() + '</p>';
    
    // filenames: sms/chat_username_number[#nrofmissedmessage
    
    if (webphone_api.common.isNull(from) || from.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _message: SaveMissedIncomingMessage source number is NULL');
        return;
    }
    
    var currfile = action + '_' + webphone_api.common.GetSipusername() + '_' + from;
    
    var files = webphone_api.common.GetParameter('messagefiles');
    var msglist = [];
    
    if (!webphone_api.common.isNull(files) && files.length > 0) { msglist = files.split(','); }

    var filenameAdded = false;
    var nrmissed = 0; // number of missed messages

    //check if filename exists is msglist and make it the first element (last used - first in msg listview)
    for (var i = 0; i < msglist.length; i++)
    {
        if (webphone_api.common.isNull(msglist[i])) { continue; }

// cut off number of missed messages from file names
        var tempmsgfile = msglist[i];
        var pos = tempmsgfile.indexOf('[#');
        if (pos > 0)
        {
            tempmsgfile = tempmsgfile.substring(0, pos);
        }
        
        if (tempmsgfile === currfile)
        {
            if (pos > 0)
            {
                var temp = webphone_api.common.Trim( msglist[i].substring(pos + 2) );
                
                if (temp.length > 0)
                {
                    try{ nrmissed = webphone_api.common.StrToInt(temp); } catch(err) {   }
                }
            }
            nrmissed = nrmissed + 1;
            
            msglist.splice(i, 1);
            msglist.unshift(currfile + '[#' + nrmissed);
            
            // save list
            files = '';
            for (var j = 0; j < msglist.length; j++)
            {
                files = files + ',' + msglist[j];
            }
            
            if (files.indexOf(',') === 0) { files = files.substring(1); } // cut off first comma ,
            if (files.lastIndexOf(',') === files.length - 1) { files = files.substring(0, files.length - 1); } // cut off last comma ,
            
            webphone_api.common.SaveParameter('messagefiles', files);
            filenameAdded = true;
            
            break;
        }
    }
    
    if (!filenameAdded)
    {
        if (files.length > 0)
        {
            files = currfile + '[#1' + ',' + files;
        }else
        {
            files = currfile + '[#1';
        }
        webphone_api.common.SaveParameter('messagefiles', files);
    }
    
// first read file, then save it
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.common.ApiWinLoadFile(currfile, function (content)
        {
            if ( webphone_api.common.isNull(content) ) { content = ''; }

            content = content + item;

            webphone_api.common.ApiWinSaveFile(currfile, content, function (success)
            {
                if (!success)
                {
                    webphone_api.common.PutToDebugLog(2, 'ERROR, _message: SaveMissedIncomingMessage cannot save message file (1) WinApi');
                }
            });
        });
    }else
    {
        webphone_api.File.ReadFile(currfile, webphone_api.global.STORAGE_LOCAL, function (content)
        {
            if ( webphone_api.common.isNull(content) ) { content = ''; }

            content = content + item;

            webphone_api.File.SaveFile(currfile, content, webphone_api.global.STORAGE_LOCAL, function (success)
            {
                if (!success)
                {
                    webphone_api.common.PutToDebugLog(2, 'ERROR, _message: SaveMissedIncomingMessage cannot save message file (1)');
                }
            });
        });
    }

    } catch(err) { webphone_api.common.PutToDebugLogException(2, '_message: SaveMissedIncomingMessage', err); }
}

function ShowIncomingMessage(action, from, msg)
{
    try{
// if received message, then set status to online if it was offline
    if (enablepres === true)
    {
        webphone_api.global.msg_presence_timer = 0;
        
        if (!webphone_api.common.isNull(lastpres_stat) && lastpres_stat !== '0')
        {
            DisplayPresence('5'); // set to online
        }
    }
    
    sendrec = true;
//--    if (from === webphone_api.global.mto)
    if (webphone_api.global.mto.indexOf(from) >= 0)
    {
        msg = webphone_api.common.ReplaceAll(msg, "\\<.*?>", "");
        mMessage = msg;
        AddMessage("1", true);
        
        if (webphone_api.global.mto.indexOf(',') > 0)
        {
            var dstlist = webphone_api.global.mto.split(',');
            for (var i = 0; i < dstlist.length; i++)
            {
                if (webphone_api.common.isNull(dstlist[i]) || webphone_api.common.Trim(dstlist[i]).length < 1) { continue; }
                if (dstlist[i] === from) { continue; }
                
                if (mAction === 'sms' && !webphone_api.common.isNull(webphone_api.common.GetParameter('sms')) && webphone_api.common.GetParameter('sms').length > 0)
                {
                    webphone_api.common.UriParser(webphone_api.common.GetParameter('sms'), '', webphone_api.common.GetSipusername(), webphone_api.common.Trim(dstlist[i]), msg, 'sendsms');
                }else
                {
                    webphone_api.sendchat(webphone_api.common.Trim(dstlist[i]), msg);
                }
            }
        }
    }else
    {
        var name = webphone_api.common.GetContactNameFromNumber(from);
        webphone_api.common.PutNotifications2('1', '', name + ' - ' + from, 0);
        SaveMissedIncomingMessage(action, from, name, msg);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, '_message: ShowIncomingMessage', err); }
}

function ScrollToBottom()
{
    try{
    var d = webphone_api.$('#msg_list');
    d.scrollTop(d.prop("scrollHeight"));
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: ScrollToBottom", err); }
}

var MENUITEM_MESSAGE_DELETE = '#menuitem_message_delete';
var MENUITEM_MESSAGE_FILETRANSFER = '#menuitem_message_filetransfer';
var MENUITEM_MESSAGE_CALL = '#menuitem_message_call';
var MENUITEM_MESSAGE_GROUPCHAT = '#menuitem_message_groupchat';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$( "#btn_message_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _message: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _message: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_MESSAGE_DELETE + '"><a data-rel="back">' + webphone_api.stringres.get('delete_text') + '</a></li>' ).listview('refresh');
    
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_MESSAGE_CALL + '"><a data-rel="back">' + webphone_api.stringres.get('menu_call') + '</a></li>' ).listview('refresh');
    
    if (webphone_api.common.GetConfigBool('hasfiletransfer', true) !== false && webphone_api.common.IsMizuServerOrGateway())
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_MESSAGE_FILETRANSFER + '"><a data-rel="back">' + webphone_api.stringres.get('filetransf_title') + '</a></li>' ).listview('refresh');
    }
    
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_MESSAGE_GROUPCHAT + '"><a data-rel="back">' + webphone_api.stringres.get('menu_groupchat') + '</a></li>' ).listview('refresh');
    
    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#message_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#message_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_MESSAGE_DELETE:
                ClearHistory();
                break;
            case MENUITEM_MESSAGE_FILETRANSFER:
                webphone_api.common.FileTransfer(webphone_api.$("#msgpick_input").val());
                break;
            case MENUITEM_MESSAGE_CALL:
                StartCall(webphone_api.$("#msgpick_input").val());
                break;
            case MENUITEM_MESSAGE_GROUPCHAT:
                webphone_api.common.PickContact(AddToGroupChat);
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: MenuItemSelected", err); }
}

function StartCall(number, isvideo)
{
    try{
    if (webphone_api.common.isNull(number) || number.length < 1)
    {
        webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_4'));
        webphone_api.common.PutToDebugLog(2, "ERROR, _message: StartCall number is NULL");
        return;
    }
    
    number = webphone_api.common.NormalizeNumber(number);
    
    if (isvideo === true)
    {
        webphone_api.common.PutToDebugLog(4, 'EVENT, _message initiate video call to: ' + number);
        webphone_api.videocall(number);
    }else
    {
        webphone_api.common.PutToDebugLog(4, 'EVENT, _message initiate call to: ' + number);
        webphone_api.call(number, -1);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: StartCall", err); }
}

function ClearHistory(popupafterclose)
{
    try{
    var files = webphone_api.common.GetParameter('messagefiles');
    
    if (webphone_api.common.isNull(files) || files.length < 3 || webphone_api.common.isNull(webphone_api.global.mto) || webphone_api.global.mto.length < 1)
    {
        webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_7'));
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
'<div data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('delete_text') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content adialog_alert">' +
        '<span> ' + webphone_api.stringres.get('delete_msg_alert') + ' </span>' +
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
            webphone_api.$(this).unbind("popupbeforeposition");//.remove();
            var maxHeight =  Math.floor( webphone_api.common.GetDeviceHeight() * 0.6 );  // webphone_api.$(window).height() - 120;
            
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
        webphone_api.$.mobile.activePage.find(".messagePopup").on( 'popupafterclose', function( event )
        {
            webphone_api.$(this).off( 'popupafterclose' );
        
            var currfile = mAction + '_' + webphone_api.common.GetSipusername() + '_' + webphone_api.global.mto;
            var msglist = files.split(',');

            for (var i = 0; i < msglist.length; i++)
            {
                if (webphone_api.common.isNull(msglist[i])) { continue; }

// cut off number of missed messages from file names
                var tempmsgfile = msglist[i];
                var pos = tempmsgfile.indexOf('[#');
                if (pos > 0)
                {
                    tempmsgfile = tempmsgfile.substring(0, pos);
                }

                if (tempmsgfile === currfile)
                {
                    msglist.splice(i, 1);

                    files = '';
                    for (var j = 0; j < msglist.length; j++)
                    {
                        files = files + ',' + msglist[j];
                    }
                    
                    if (files.indexOf(',') === 0) { files = files.substring(1); } // cut off first comma ,
                    if (files.lastIndexOf(',') === files.length - 1) { files = files.substring(0, files.length - 1); } // cut off last comma ,
                    
                    webphone_api.common.SaveParameter('messagefiles', files);

                    break;
                }
            }

            webphone_api.File.DeleteFile(currfile, function (success)
            {
                webphone_api.common.PutToDebugLog(3, 'EVENT, _message: ClearHistory DeleteFile: ' + currfile + ' status: ' + success.toString());
            });

            webphone_api.$.mobile.back();
        });
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: ClearHistory", err); }
}

function OpenSmileys()
{
    try{
    var scont = document.getElementById('smiley_container');
    if (webphone_api.common.isNull(scont))
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _message OpenSmileys: container is NULL');
        return;
    }
    
    scont.style.display = 'block';
    
    var SmileyClose = function ()
    {
        scont.style.display = 'none';
        
        webphone_api.$("#btn_emoti_smiling").off('click').off('mouseover').off('mouseout');
        webphone_api.$("#btn_emoti_sad").off('click').off('mouseover').off('mouseout');
        webphone_api.$("#btn_emoti_laughing").off('click').off('mouseover').off('mouseout');
        webphone_api.$("#btn_emoti_winking").off('click').off('mouseover').off('mouseout');
        webphone_api.$("#btn_emoti_surprised").off('click').off('mouseover').off('mouseout');
        webphone_api.$("#btn_emoti_straightface").off('click').off('mouseover').off('mouseout');
        webphone_api.$("#btn_emoti_worried").off('click').off('mouseover').off('mouseout');
        webphone_api.$("#btn_emoti_crying").off('click').off('mouseover').off('mouseout');
        webphone_api.$("#btn_emoti_cool").off('click').off('mouseover').off('mouseout');
        webphone_api.$("#btn_emoti_angel").off('click').off('mouseover').off('mouseout');
        webphone_api.$("#btn_emoti_kiss").off('click').off('mouseover').off('mouseout');
        webphone_api.$("#btn_emoti_idea").off('click').off('mouseover').off('mouseout');
        webphone_api.$("#btn_emoti_thinking").off('click').off('mouseover').off('mouseout');
    };
    
    webphone_api.$("#msg_btn_smiley_close").on("click", function() { SmileyClose(); });
    webphone_api.$("#msg_btn_smiley_close").attr("title", webphone_api.stringres.get("btn_close"));
    
    var shint = document.getElementById('smiley_hint');
    if (!webphone_api.common.isNull(shint))
    {
        webphone_api.$("#btn_emoti_smiling").on("mouseover", function() { shint.innerHTML = 'Smiling :)'; }).on("mouseout", function() { shint.innerHTML = ''; });
        webphone_api.$("#btn_emoti_sad").on("mouseover", function() { shint.innerHTML = 'Sad :('; });  webphone_api.$("#btn_emoti_sad").on("mouseout", function() { shint.innerHTML = ''; });
        webphone_api.$("#btn_emoti_laughing").on("mouseover", function() { shint.innerHTML = 'Laughing :))'; });  webphone_api.$("#btn_emoti_laughing").on("mouseout", function() { shint.innerHTML = ''; });
        webphone_api.$("#btn_emoti_winking").on("mouseover", function() { shint.innerHTML = 'Winking ;)'; });  webphone_api.$("#btn_emoti_winking").on("mouseout", function() { shint.innerHTML = ''; });
        webphone_api.$("#btn_emoti_surprised").on("mouseover", function() { shint.innerHTML = 'Surprised :-O'; });  webphone_api.$("#btn_emoti_surprised").on("mouseout", function() { shint.innerHTML = ''; });
        webphone_api.$("#btn_emoti_straightface").on("mouseover", function() { shint.innerHTML = 'StraightFace :|'; });  webphone_api.$("#btn_emoti_straightface").on("mouseout", function() { shint.innerHTML = ''; });
        webphone_api.$("#btn_emoti_worried").on("mouseover", function() { shint.innerHTML = 'Worried :-S'; });  webphone_api.$("#btn_emoti_worried").on("mouseout", function() { shint.innerHTML = ''; });
        webphone_api.$("#btn_emoti_crying").on("mouseover", function() { shint.innerHTML = 'Crying :(('; });  webphone_api.$("#btn_emoti_crying").on("mouseout", function() { shint.innerHTML = ''; });
        webphone_api.$("#btn_emoti_cool").on("mouseover", function() { shint.innerHTML = 'Cool B-)'; });  webphone_api.$("#btn_emoti_cool").on("mouseout", function() { shint.innerHTML = ''; });
        webphone_api.$("#btn_emoti_angel").on("mouseover", function() { shint.innerHTML = 'Angel :-O)'; });  webphone_api.$("#btn_emoti_angel").on("mouseout", function() { shint.innerHTML = ''; });
        webphone_api.$("#btn_emoti_kiss").on("mouseover", function() { shint.innerHTML = 'Kiss :x'; });  webphone_api.$("#btn_emoti_kiss").on("mouseout", function() { shint.innerHTML = ''; });
        webphone_api.$("#btn_emoti_idea").on("mouseover", function() { shint.innerHTML = 'Idea :-I'; });  webphone_api.$("#btn_emoti_idea").on("mouseout", function() { shint.innerHTML = ''; });
        webphone_api.$("#btn_emoti_thinking").on("mouseover", function() { shint.innerHTML = 'Thinking :-?'; });  webphone_api.$("#btn_emoti_thinking").on("mouseout", function() { shint.innerHTML = ''; });
    }
    
    var AddSmiley = function (em)
    {
        try{
        SmileyClose();
//--        var alternate = '';
//--        switch (em)
//--        {
//--            case 'Smiling':alternate = ':)';
//--            case 'Sad':alternate = ':(';
//--            case 'Laughing':alternate = ':))';
//--            case 'Winking':alternate = ';)';
//--            case 'Surprised':alternate = ':-O';
//--            case 'StraightFace':alternate = ':|';
//--            case 'Worried':alternate = ':-S';
//--            case 'Crying':alternate = ':((';
//--            case 'Cool':alternate = 'B-)';
//--            case 'Angel':alternate = ':-O)';
//--            case 'Kiss':alternate = ':x';
//--            case 'Idea':alternate = ':-I';
//--            case 'Thinking':alternate = ':-?';
//--        }
//--        var img = '<img src="images/smiley/' + em + '.gif"alt="' + alternate + '"/>';
        var img = '<img src="' + webphone_api.common.GetElementSource() + 'images/smiley/' + em + '.gif">';
        
        var txta = document.getElementById('msg_textarea');
//--        txta.value = txta.value + ' ' + img + ' ';
        txta.innerHTML = txta.innerHTML + ' ' + img + ' ';
        
        } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: AddSmiley", err); }
    };
    
    webphone_api.$("#btn_emoti_smiling").on("click", function() { AddSmiley('Smiling'); });
    webphone_api.$("#btn_emoti_sad").on("click", function() { AddSmiley('Sad'); });
    webphone_api.$("#btn_emoti_laughing").on("click", function() { AddSmiley('Laughing'); });
    webphone_api.$("#btn_emoti_winking").on("click", function() { AddSmiley('Winking'); });
    webphone_api.$("#btn_emoti_surprised").on("click", function() { AddSmiley('Surprised'); });
    webphone_api.$("#btn_emoti_straightface").on("click", function() { AddSmiley('StraightFace'); });
    webphone_api.$("#btn_emoti_worried").on("click", function() { AddSmiley('Worried'); });
    webphone_api.$("#btn_emoti_crying").on("click", function() { AddSmiley('Crying'); });
    webphone_api.$("#btn_emoti_cool").on("click", function() { AddSmiley('Cool'); });
    webphone_api.$("#btn_emoti_angel").on("click", function() { AddSmiley('Angel'); });
    webphone_api.$("#btn_emoti_kiss").on("click", function() { AddSmiley('Kiss'); });
    webphone_api.$("#btn_emoti_idea").on("click", function() { AddSmiley('Idea'); });
    webphone_api.$("#btn_emoti_thinking").on("click", function() { AddSmiley('Thinking'); });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: OpenSmileys", err); }
}

function AddEmoticon(txtin) // convert emoticon text to image:  :) =>  image
{
    try{
    if (webphone_api.common.isNull(txtin) || txtin.length < 1) { return txtin; }
    var txt = txtin;
    
    txt = webphone_api.common.ReplaceAll(txt, ':))', '<img src="' + webphone_api.common.GetElementSource() + 'images/smiley/Laughing.gif">');
    txt = webphone_api.common.ReplaceAll(txt, ':((', '<img src="' + webphone_api.common.GetElementSource() + 'images/smiley/Crying.gif">');
    txt = webphone_api.common.ReplaceAll(txt, ':)', '<img src="' + webphone_api.common.GetElementSource() + 'images/smiley/Smiling.gif">');
    txt = webphone_api.common.ReplaceAll(txt, ':(', '<img src="' + webphone_api.common.GetElementSource() + 'images/smiley/Sad.gif">');
    txt = webphone_api.common.ReplaceAll(txt, ';)', '<img src="' + webphone_api.common.GetElementSource() + 'images/smiley/Winking.gif">');
    txt = webphone_api.common.ReplaceAll(txt, ':-O', '<img src="' + webphone_api.common.GetElementSource() + 'images/smiley/Surprised.gif">');
    txt = webphone_api.common.ReplaceAll(txt, ':|', '<img src="' + webphone_api.common.GetElementSource() + 'images/smiley/StraightFace.gif">');
    txt = webphone_api.common.ReplaceAll(txt, ':-S', '<img src="' + webphone_api.common.GetElementSource() + 'images/smiley/Worried.gif">');
    txt = webphone_api.common.ReplaceAll(txt, 'B-)', '<img src="' + webphone_api.common.GetElementSource() + 'images/smiley/Cool.gif">');
    txt = webphone_api.common.ReplaceAll(txt, ':-O)', '<img src="' + webphone_api.common.GetElementSource() + 'images/smiley/Angel.gif">');
    txt = webphone_api.common.ReplaceAll(txt, ':x', '<img src="' + webphone_api.common.GetElementSource() + 'images/smiley/Kiss.gif">');
    txt = webphone_api.common.ReplaceAll(txt, ':-I', '<img src="' + webphone_api.common.GetElementSource() + 'images/smiley/Idea.gif">');
    txt = webphone_api.common.ReplaceAll(txt, ':-?', '<img src="' + webphone_api.common.GetElementSource() + 'images/smiley/Thinking.gif">');
    
    return txt;
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: AddEmoticon", err); }
    return txtin;
}

function RemoveEmoticon(txtin) // convert emoticon image to text:  image  => :)
{
    try{
    if (webphone_api.common.isNull(txtin) || txtin.length < 1 || txtin.indexOf('<img') < 0) { return txtin; }
    var txt = '';
    var tarr = txtin.split('<img');
    
    var pos = 0;
    for (var i = 0; i < tarr.length; i++)
    {
        var item = tarr[i];
        if (!webphone_api.common.isNull(item) && item.indexOf('.gif">') > 0)
        {
            var emoti = ':)';
            pos = item.indexOf('.gif');
            if (pos > 0)
            {
                emoti = item.substring(0, pos);
                pos = emoti.lastIndexOf('/');
                if (pos > 0) { emoti = emoti.substr(pos + 1); }
            }
            
            switch (emoti)
            {
                case 'Smiling':emoti = ':)'; break;
                case 'Sad':emoti = ':('; break;
                case 'Laughing':emoti = ':))'; break;
                case 'Winking':emoti = ';)'; break;
                case 'Surprised':emoti = ':-O'; break;
                case 'StraightFace':emoti = ':|'; break;
                case 'Worried':emoti = ':-S'; break;
                case 'Crying':emoti = ':(('; break;
                case 'Cool':emoti = 'B-)'; break;
                case 'Angel':emoti = ':-O)'; break;
                case 'Kiss':emoti = ':x'; break;
                case 'Idea':emoti = ':-I'; break;
                case 'Thinking':emoti = ':-?'; break;
            }
            
            tarr[i] = emoti + item.substring(item.indexOf('.gif">') + 6);
        }
    }
    
    for (var i = 0; i < tarr.length; i++)
    {
        txt = txt + tarr[i];
    }
    
    return txt;
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: RemoveEmoticon", err); }
    return txtin;
}

function onStop(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _message: onStop");
    webphone_api.global.isMessageStarted = false;
    sendrec = false;
    
    document.getElementById('msgpick_input').value = '';
    document.getElementById('msg_list').innerHTML = '';
//--    document.getElementById('msg_textarea').value = '';
    document.getElementById('msg_textarea').innerHTML = '';
    document.getElementById('msg_charcount').innerHTML = '0';
    document.getElementById('msgpick_container').style.display = 'none';
    
    mAction = '';
    msgSent = false;
    webphone_api.global.mto = '';
    mMessage = '';
    mContent = '';
    placeholderhidden = false;
    
    webphone_api.$('#msgpick_input').off('input');
    
    webphone_api.common.SaveContactsFile(function (issaved) { webphone_api.common.PutToDebugLog(4, 'EVENT, _message: onDestroy SaveContactsFile: ' + issaved.toString()); });

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_message: onStop", err); }
}

function onDestroy (event){} // deprecated by onstop


// public members and methods
return {
    onCreate: onCreate,
    onStart: onStart,
    onStop: onStop,
    onDestroy: onDestroy,
    
    ShowIncomingMessage: ShowIncomingMessage,
    SaveMissedIncomingMessage: SaveMissedIncomingMessage,
    RefreshPresence: RefreshPresence,
    LoadMessage: LoadMessage,
    DisplayPresence: DisplayPresence
};
})();