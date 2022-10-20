webphone_api._messagelist = (function ()
{
function onCreate (event) // called only once - bind events here
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _messagelist: onCreate");
    
    webphone_api.$('#messagelist_list').on('click', 'li', function(event)
    {
        OnListItemClick(webphone_api.$(this).attr('id'));
    });
    
    webphone_api.$('#messagelist_notification_list').on('click', '.nt_anchor', function(event)
    {
        webphone_api.$("#messagelist_not").panel( "close" );
        webphone_api.common.NotificationOnClick2(webphone_api.$(this).attr('id'), false);
    });
    webphone_api.$('#messagelist_notification_list').on('click', '.nt_menu', function(event)
    {
        webphone_api.$("#messagelist_not").panel( "close" );
        webphone_api.common.NotificationOnClick2(webphone_api.$(this).attr('id'), true);
    });
    
    webphone_api.$("#messagelist_not_btn").on("click", function()
    {
        webphone_api.common.SaveParameter('notification_count2', 0);
        webphone_api.common.ShowNotifications2(); // repopulate notifications (hide red dot number)
    });
    
    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_messagelist')
        {
            MeasureMessagelist();
        }
    });
    
    webphone_api.$('#messagelist_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_messagelist_menu").on("click", function() { CreateOptionsMenu('#messagelist_menu_ul'); });
    webphone_api.$("#btn_messagelist_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    

    webphone_api.$("#msglist_btnback").attr("title", webphone_api.stringres.get("hint_btnback"));

    webphone_api.$("#btn_newmessage").on("click", function() { NewMessage(); });

    webphone_api.$( "#page_messagelist" ).keyup(function( event )
    {   
        HandleKeyUp(event);
    });
        
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_messagelist: onCreate", err); }
}

function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _messagelist: onStart");
    webphone_api.global.isMessagelistStarted = true;

    setTimeout(function() // otherwise keyup will not work, because the element is not focused
    {
        webphone_api.$("#page_messagelist").focus();
    }, 100);
    
//--    webphone_api.$("#phone_number").attr("placeholder", webphone_api.stringres.get("phone_nr"));
//--    document.getElementById("app_name_messagelist").innerHTML = webphone_api.common.GetBrandName();
    webphone_api.$('#btn_newmessage').html(webphone_api.stringres.get('btn_new_message'));
    
    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#page_messagelist'), -30) );
    
    if (!webphone_api.common.isNull(document.getElementById('msglist_title')))
    {
        document.getElementById('msglist_title').innerHTML = webphone_api.stringres.get("msglist_title");
    }
    webphone_api.$("#msglist_title").attr("title", webphone_api.stringres.get("hint_page"));

    if (!webphone_api.common.isNull(document.getElementById('msglist_btnback')))
    {
        document.getElementById('msglist_btnback').innerHTML = '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("go_back_btn_txt");
    }
    
// needed for proper display and scrolling of listview
    MeasureMessagelist();
    webphone_api.common.HideMessageNotifications2(); // show only call notification
    
    // fix for IE 10
    if (webphone_api.common.IsIeVersion(10)) { webphone_api.$("#messagelist_list").children().css('line-height', 'normal'); }
    if (webphone_api.common.IsIeVersion(10)) { webphone_api.$("#messagelist_notification_list").children().css('line-height', 'normal'); }
    webphone_api.$("#messagelist_notification_list").height(webphone_api.common.GetDeviceHeight() - 55);
    
    PopulateList();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_messagelist: onStart", err); }
}

function MeasureMessagelist() // resolve window height size change
{
    try{
//--    var pgh = webphone_api.common.GetDeviceHeight() - 1; webphone_api.$('#page_messagelist').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_messagelist').css('min-height', 'auto'); // must be set when softphone is skin in div
    
// handle notifiaction      additional_header_right
    var notwidth = webphone_api.common.GetDeviceWidth() - webphone_api.$("#messagelist_additional_header_left").width() - webphone_api.$("#messagelist_additional_header_right").width();
    var margin = webphone_api.common.StrToIntPx( webphone_api.$("#messagelist_additional_header_left").css("margin-left") );
    
    if (webphone_api.common.isNull(margin) || margin === 0) { margin = 10; }
    margin = Math.ceil( margin * 6 );
    notwidth = Math.floor(notwidth - margin) - 20;

// handle page height
    var heightTemp = webphone_api.common.GetDeviceHeight() - webphone_api.$("#messagelist_header").height() - webphone_api.$("#btn_newmessage_container").height();

    heightTemp = Math.floor( heightTemp - 3 );
    webphone_api.$("#messagelist_list").height(heightTemp);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_messagelist: MeasureMessagelist", err); }
}

function LoadMessages()
{
    try{
    PopulateList();

//--    if (webphone_api.global.isdebugversion)
//--    {
//--        if ( webphone_api.common.isNull(webphone_api.global.ctlist) || webphone_api.global.ctlist.length < 1 )
//--        {
//--            webphone_api.global.ctlist = [];
//--            // String Name, String[] {numbers/sip uris}, String[] {number types}, int usage, long lastmodified, int delete flag, int isfavorit
//--            var ctitem = ['Ambrus Akos', ['40724335358', '0268123456', '13245679'], ['home', 'work', 'other'], '0', '13464346', '0', '0'];

//--            var ctitem2 = ['Ambrus Tunde', ['123456', '987654'], ['other', 'fax_home'], '0', '23464346', '0', '0'];
//--            var ctitem3 = ['Mariska Mari', ['123456', '987654'], ['other', 'fax_home'], '0', '23464346', '0', '0'];
//--            webphone_api.global.ctlist.push(ctitem); webphone_api.global.ctlist.push(ctitem2); webphone_api.global.ctlist.push(ctitem3);
            
//--            for (var i = 0; i < 12; i++)
//--            {
//--                var ctitem_generated = ['Test_' + i, ['123456_' + i, '987654_' + i], ['other', 'fax_home'], '0', '23464346', '0', '0'];
//--                webphone_api.global.ctlist.push(ctitem_generated);
//--            }
//--        }
//--    }
    
//--    if (webphone_api.common.isNull(webphone_api.global.ctlist) || webphone_api.global.ctlist.length < 1)
//--    {
//--        webphone_api.common.GetContacts(function (success)
//--        {
//--            if (!success)
//--            {
//--                webphone_api.common.PutToDebugLog(2, 'ERROR, _messagelist: LoadContacts failed');
//--            }
//--            PopulateList();
//--        });
//--    }else
//--    {
//--        PopulateList();
//--    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_messagelist: LoadMessages", err); }
}

function PopulateList() // :no return value
{
    try{
    if ( webphone_api.common.isNull(document.getElementById('messagelist_list')) )
    {
        webphone_api.common.PutToDebugLog(2, "ERROR, _messagelist: PopulateList listelement is null");
        return;
    }
    webphone_api.$('#messagelist_list').html('');

    // filenames: sms/chat_username_number

//-- isdebugversion
//    type_myusername_tousername[#nrofmissedmsg
//    var msgfilestest = 'sms_9999_1111[#3,chat_9999_2222,chat_9999_3333,sms_9999_4444,sms_9999_5555,sms_9999_6666';
//    webphone_api.common.SaveParameter('messagefiles', msgfilestest);
    
    var files = webphone_api.common.GetParameter('messagefiles');
    
    if (webphone_api.common.isNull(files) || files.length < 3)
    {
        webphone_api.common.PutToDebugLog(3, 'EVENT, _messagelist: PopulateList no message files');
        return;
    }
    
    webphone_api.common.PutToDebugLog(2, 'EVENT, _messagelist Starting populate list');
    
    var msglist = [];
    
    if (!webphone_api.common.isNull(files) && files.length > 0)
    {
        msglist = files.split(',');
    }

    var listview = '';
    
    for (var i = 0; i < msglist.length; i++)
    {
        if (webphone_api.common.isNull(msglist[i]) || msglist[i].length < 3) { continue; }
        
        var number = msglist[i].substring( msglist[i].lastIndexOf('_') + 1 );
        var type = msglist[i].substring(0, msglist[i].indexOf('_') );
        var missedmsg = '';
        var nrMissed = 0;

// check if there are missed messages
        var pos = number.indexOf('[#');
        if (pos > 0)
        {
            var tmp = number.substring(pos + 2, number.length);
            number = number.substring(0, pos);
            
            try{ nrMissed = webphone_api.common.StrToInt( webphone_api.common.Trim(tmp) ); } catch(errin) {  }
        }
        
        var name = webphone_api.common.GetContactNameFromNumber(number);
        
        if (!webphone_api.common.isNull(nrMissed) && nrMissed > 0)
        {
            missedmsg = '<span class="ui-li-count">' + nrMissed + '</span>';
        }
        
        if (webphone_api.common.isNull(name) || name.length < 1) { name = number; }
        
        var listitem = '' +
            '<li id="msgitem_' + i + '"><a class="msg_anchor mlistitem" data-transition="slide">' +
                '<div class="msg_item_container">' +
                    '<div class="msg_name">' + name + ' - <span id="msgitemnumber_' + i + '">' + number + '</span>' + missedmsg + '</div>' +
                    //'<div class="new_msg_count">4</div>' +//(3) new missed message count
                    '<div id="msgtype_' + i + '" class="msg_type">' + webphone_api.stringres.get(type) + '</div>' +
		'</div>' +
            '</a></li>';

        listview = listview + listitem;
    }
    
    webphone_api.$('#messagelist_list').html('');
    webphone_api.$('#messagelist_list').append(listview).listview('refresh');
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_messagelist: PopulateList", err); }
}

function OnListItemClick (id) // :no return value
{
    try{
        
    if (webphone_api.common.isNull(id) || id.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _messagelist OnListItemClick id is NULL');
        return;
    }
    
    var msgid = '';
    var pos = id.indexOf('_');
    if (pos < 2)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _messagelist OnListItemClick invalid id');
        return;
    }
    
    msgid = webphone_api.common.Trim(id.substring(pos + 1));
    
    var to = webphone_api.$('#msgitemnumber_' + msgid).html();
    if (webphone_api.common.isNull(to)) { to = ''; }else{ to = webphone_api.common.Trim(to); }
    
    var typestr = webphone_api.$('#msgtype_' + msgid).html();
    if (webphone_api.common.isNull(typestr)) { typestr = webphone_api.stringres.get('chat'); }else{ typestr = webphone_api.common.Trim(typestr); }
    
    var action = '';
    if (typestr === webphone_api.stringres.get('chat'))
    {
        action = 'chat';
    }else if (typestr === webphone_api.stringres.get('sms'))
    {
        action = 'sms';
    }
    
//--    webphone_api.sendchat (1, to, '', action);

    webphone_api.common.PutToDebugLog(4, 'EVENT, _messagelist: OnListItemClick: action: ' + action + '; to: ' + to);

    webphone_api.global.intentmsg[0] = 'action=' + action;
    webphone_api.global.intentmsg[1] = 'to=' + to;
    webphone_api.global.intentmsg[2] = 'message=';
    
    if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE())
    {
        webphone_api.$.mobile.changePage("#page_message", { transition: "none", role: "page" });    
    }else
    {
        webphone_api.$.mobile.changePage("#page_message", { transition: "slide", role: "page" });    
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_messagelist: OnListItemClick", err); }
}

function NewMessage()
{
    try{
    webphone_api.common.StartMsg('', '', '_messagelist');
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_messagelist: NewMessage", err); }
}

function HandleKeyUp(event)
{
    try{
//-- don't catch input if a popup is open, because popups can have input boxes, and we won't be able to write into them
    if (webphone_api.$(".ui-page-active .ui-popup-active").length > 0)
    {
         return false;
    }
    
    var charCode = (event.keyCode) ? event.keyCode : event.which; // workaround for firefox

    if (charCode === 8) // backspace
    {
        event.preventDefault();
        webphone_api.$.mobile.back();
    }
//--    else if (charCode === 13)
//--    {
//--        event.preventDefault();
//--        webphone_api.$("#btn_call").click();
//--    }
    return false;
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_messagelist: HandleKeyUp", err); }
}

var MENUITEM_MESSAGELIST_NEWMESSAGE = '#menuitem_messagelist_newmessage';
var MENUITEM_MESSAGELIST_DELETE = '#menuitem_messagelist_delete';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$( "#btn_messagelist_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _messagelist: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _messagelist: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_MESSAGELIST_NEWMESSAGE + '"><a data-rel="back">' + webphone_api.stringres.get('btn_new_message') + '</a></li>' ).listview('refresh');
    
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_MESSAGELIST_DELETE + '"><a data-rel="back">' + webphone_api.stringres.get('delete_text') + '</a></li>' ).listview('refresh');
    
    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_messagelist: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#messagelist_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#messagelist_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_MESSAGELIST_NEWMESSAGE:
                NewMessage();
                break;
            case MENUITEM_MESSAGELIST_DELETE:
                ClearAllHistory();
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_messagelist: MenuItemSelected", err); }
}

function ClearAllHistory(popupafterclose)
{
    try{
    var files = webphone_api.common.GetParameter('messagefiles');
    
    if (webphone_api.common.isNull(files) || files.length < 3)
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

        if(popupWidth > 400) popupWidth = 400;
        else if(popupWidth < 120) popupWidth = 120;
    
    var template = '' +
'<div data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('delete_text') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content adialog_alert">' +
        '<span> ' + webphone_api.stringres.get('delete_all_msg_alert') + ' </span>' +
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
        var msglist = files.split(',');
    
        for (var i = 0; i < msglist.length; i++)
        {
            if (webphone_api.common.isNull(msglist[i]) || msglist[i].length < 3) { continue; }

// cut off number of missed messages from file names
            var pos = msglist[i].indexOf('[#');
            if (pos > 0)
            {
                msglist[i] = msglist[i].substring(0, pos);
            }

            var cfile = msglist[i];
            (function(){
                webphone_api.File.DeleteFile(cfile, function (success)
                {
                    webphone_api.common.PutToDebugLog(3, 'EVENT, _messagelist: ClearAllHistory DeleteFile: ' + cfile + ' status: ' + success.toString());
                });
            });
        }

        webphone_api.common.SaveParameter('messagefiles', '');
        PopulateList();
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_messagelist: ClearAllHistory", err); }
}

function onStop(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _messagelist: onStop");
    webphone_api.global.isMessagelistStarted = false;

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_messagelist: onStop", err); }
}

function onDestroy (event){} // deprecated by onstop

// public members and methods
return {
    onCreate: onCreate,
    onStart: onStart,
    onStop: onStop,
    onDestroy: onDestroy
};
})();