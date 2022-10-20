// Call History Details page
webphone_api._callhistorydetails = (function ()
{
var ctid = -1;
var chentry = null;

function onCreate (event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _callhistorydetails: onCreate");

    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_callhistorydetails')
        {
            MeasureCallhistorydetails();
        }
    });
    
    webphone_api.$('#callhistorydetails_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_callhistorydetails_menu").on("click", function() { CreateOptionsMenu('#callhistorydetails_menu_ul'); });

    webphone_api.$( "#page_callhistorydetails" ).keyup(function( event )
    {   
        HandleKeyUp(event);
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorydetails: onCreate", err); }
}

function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _callhistorydetails: onStart");
    webphone_api.global.isCallhistorydetailsStarted = true;

    setTimeout(function() // otherwise keyup will not work, because the element is not focused
    {
        webphone_api.$("#page_callhistorydetails").focus();
    }, 100);
    
//--    document.getElementById("app_name_callhistorydetails").innerHTML = webphone_api.common.GetBrandName();
    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#page_callhistorydetails'), -30) );
    
    if (!webphone_api.common.isNull(document.getElementById('callhistorydetails_title')))
    {
        document.getElementById('callhistorydetails_title').innerHTML = webphone_api.stringres.get("chdetails_title");
    }
    webphone_api.$("#callhistorydetails_title").attr("title", webphone_api.stringres.get("hint_page"));

    if (!webphone_api.common.isNull(document.getElementById('chdetails_btnback')))
    {
        document.getElementById('chdetails_btnback').innerHTML = '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("chdetails_btnback_txt");
    }

// needed for proper display of page height
    MeasureCallhistorydetails();
    
    try { ctid = webphone_api.common.StrToInt( webphone_api.common.GetIntentParam(webphone_api.global.intentchdetails, 'ctid') ); } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorydetails: onStart can't convert ctid to INT", err); }
    
    chentry = webphone_api.global.chlist[ctid];
    PopulateData();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorydetails: onStart", err); }
}

function MeasureCallhistorydetails() // resolve window height size change
{
    try{
//--    var pgh = webphone_api.common.GetDeviceHeight() - 1; webphone_api.$('#page_callhistorydetails').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_callhistorydetails').css('min-height', 'auto'); // must be set when softphone is skin in div

    var heightTemp = webphone_api.common.GetDeviceHeight() - webphone_api.$("#callhistorydetails_header").height();
    heightTemp = heightTemp - 3;
    webphone_api.$("#page_callhistorydetails_content").height(heightTemp);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: MeasureCallhistorydetails", err); }
}

function PopulateData()
{
    try{
    if (webphone_api.common.isNull(chentry) || chentry.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _callhistorydetails PopulateData entry is NULL');
        return;
    }
    
    webphone_api.$("#page_callhistorydetails_content").html('');
    
    var content = '<div id="ch_contact_name">' + chentry[webphone_api.common.CH_NAME] + '</div>';

    var number = chentry[webphone_api.common.CH_NUMBER];
    var type = chentry[webphone_api.common.CH_TYPE];
    
    var typestr = '';
    if (type === '0') { typestr = webphone_api.stringres.get('ch_outgoing'); }
    else if (type === '1') { typestr = webphone_api.stringres.get('ch_incoming'); }
    else { typestr = webphone_api.stringres.get('ch_missed'); }
    
    var iconCallPng = 'icon_call.png';
    var iconMsgPng = 'icon_message.png';
    var iconVideoPng = 'btn_video_txt.png';

    if (webphone_api.common.GetColortheme() === 22 || webphone_api.common.GetColortheme() === 23)
    {
        iconCallPng = 'icon_call_grey.png';
        iconMsgPng = 'icon_message_grey.png';
        iconVideoPng = 'btn_video_txt_grey.png';
    }
    
    if (!webphone_api.common.isNull(number) && number.length > 0)
    {
        var itemCall = 
            '<div id="ch_entry" class="ch_container">' +
            '<div id="ch_call_entry" class="ch_call">' +
            	'<div class="ch_data">' +
                    '<div class="ch_type">' + typestr + '</div>' +
                    '<div class="ch_number">' + chentry[webphone_api.common.CH_NUMBER] + '</div>' +
                '</div>' +
                '<div class="ch_icon">' +
                    '<img src="' + webphone_api.common.GetElementSource() + 'images/' + iconCallPng + '" />' +
                '</div>' +
            '</div>' +
        '</div>';

        var itemMsg = 
            '<div id="ch_entry" class="ch_container">' +
            '<div id="ch_msg_entry" class="ch_call">' +
            	'<div class="ch_data">' +
                    '<div class="ch_type">' + webphone_api.stringres.get('send_msg') + '</div>' +
                    '<div class="ch_number">' + chentry[webphone_api.common.CH_NUMBER] + '</div>' +
                '</div>' +
                '<div class="ch_icon">' +
                    '<img src="' + webphone_api.common.GetElementSource() + 'images/' + iconMsgPng + '" />' +
                '</div>' +
            '</div>' +
        '</div>';

        var itemVideo = '';
        if (webphone_api.common.GetParameter2('video') === '1' || (webphone_api.common.GetParameter2('video') === '-1' && webphone_api.common.getuseengine() === webphone_api.global.ENGINE_WEBRTC))
        {
            itemVideo = 
                '<div id="ch_entry" class="ch_container">' +
                '<div id="ch_video_entry" class="ch_call">' +
                    '<div class="ch_data">' +
                        '<div class="ch_type">' + webphone_api.stringres.get('video_call') + '</div>' +
                        '<div class="ch_number">' + chentry[webphone_api.common.CH_NUMBER] + '</div>' +
                    '</div>' +
                    '<div class="ch_icon">' +
                        '<img src="' + webphone_api.common.GetElementSource() + 'images/' + iconVideoPng + '" />' +
                    '</div>' +
                '</div>' +
            '</div>';
        }
        
//-- handle hidesettings
        if (webphone_api.common.HideSettings('chat', webphone_api.stringres.get('sett_display_name_' + 'chat'), 'chat', true) === true || webphone_api.common.GetParameterInt('textmessaging', -1) == 0)
        {
            itemMsg = '';
        }

        if (webphone_api.common.CanIUseVideo() === false) { itemVideo = ''; }

        content = content + itemCall + itemMsg + itemVideo;
    }

    webphone_api.$("#page_callhistorydetails_content").html(content);

// add event listeners
    if (!webphone_api.common.isNull(number) && number.length > 0)
    {
        webphone_api.$('#ch_call_entry').on('click', function() { OnItemClick(0); });
        webphone_api.$('#ch_msg_entry').on('click', function() { OnItemClick(1); });
        webphone_api.$('#ch_video_entry').on('click', function() { OnItemClick(2); });
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorydetails: PopulateData", err); }
}

var trigerred = false; // handle multiple clicks
function OnItemClick(type)  // type: 0=call, 1=chat, 2=video call
{
    try{
    if (trigerred) { return; }
    
    trigerred = true;
    setTimeout(function ()
    {
        trigerred = false;
    }, 1000);

    if (type === 0)
    {
        StartCall(false);
    }
    else if (type === 1)
    {
        StartChatSms();
    }
    else if (type === 2)
    {
        StartCall(true);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorydetails: OnItemClick", err); }
}

function StartCall(isvideo)
{
    try{
    webphone_api.common.SaveParameter('redial', chentry[webphone_api.common.CH_NUMBER]);
    
    webphone_api.common.PutToDebugLog(4, 'EVENT, _callhistorydetails initiate call to: ' + chentry[webphone_api.common.CH_NUMBER]);
    
    setTimeout(function () //-- timeout, so webphone_api.$.mobile.back(); won't close call page
    {
        if (isvideo === true)
        {
            webphone_api.videocall(chentry[webphone_api.common.CH_NUMBER]);
        }else
        {
            //webphone_api.call(-1, chentry[webphone_api.common.CH_NUMBER], chentry[webphone_api.common.CH_NAME]);
            webphone_api.call(chentry[webphone_api.common.CH_NUMBER], -1);
        }
    }, 100);

    webphone_api.$.mobile.back();

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorydetails: StartCall", err); }
}

function StartChatSms()
{
    try{
    webphone_api.common.StartMsg(chentry[webphone_api.common.CH_NUMBER], '', '_callhistorydetails');

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorydetails: StartChatSms", err); }
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
    return false;
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorydetails: HandleKeyUp", err); }
}

var MENUITEM_CALLHISTORYDETAILS_CREATE = '#menuitem_callhistorydetails_create';
var MENUITEM_CALLHISTORYDETAILS_EDIT = '#menuitem_callhistorydetails_edit';
var MENUITEM_CALLHISTORYDETAILS_CALL = '#menuitem_callhistorydetails_call';
var MENUITEM_CALLHISTORYDETAILS_MESSAGE = '#menuitem_callhistorydetails_message';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$( "#btn_callhistorydetails_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _callhistorydetails: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _callhistorydetails: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    if (webphone_api.common.GetContactIdFromNumber(chentry[webphone_api.common.CH_NUMBER]) < 0)	// check if contact exists
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALLHISTORYDETAILS_CREATE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_createcontact') + '</a></li>' ).listview('refresh');
    }else
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALLHISTORYDETAILS_EDIT + '"><a data-rel="back">' + webphone_api.stringres.get('menu_editcontact') + '</a></li>' ).listview('refresh');
    }
    
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALLHISTORYDETAILS_CALL + '"><a data-rel="back">' + webphone_api.stringres.get('menu_call') + '</a></li>' ).listview('refresh');
    
// handle hidesettings
    if (webphone_api.common.HideSettings('chat', webphone_api.stringres.get('sett_display_name_' + 'chat'), 'chat', true) === false || webphone_api.common.GetParameterInt('textmessaging', -1) == 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALLHISTORYDETAILS_MESSAGE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_message') + '</a></li>' ).listview('refresh');
    }

    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorydetails: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#callhistorydetails_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#callhistorydetails_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_CALLHISTORYDETAILS_CREATE:
                CreateContact();
                break;
            case MENUITEM_CALLHISTORYDETAILS_EDIT:
                EditContact();
                break;
            case MENUITEM_CALLHISTORYDETAILS_CALL:
                StartCall();
                break;
            case MENUITEM_CALLHISTORYDETAILS_MESSAGE:
                StartChatSms();
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorydetails: MenuItemSelected", err); }
}

function CreateContact()
{
    try{
    webphone_api.global.intentaddeditct[0] = 'action=add';
    webphone_api.global.intentaddeditct[1] = 'numbertoadd=' + chentry[webphone_api.common.CH_NUMBER];
    var name = chentry[webphone_api.common.CH_NAME];
    if (webphone_api.common.isNull(name) || name.length < 1 || name === chentry[webphone_api.common.CH_NUMBER]) { name = ''; }
    webphone_api.global.intentaddeditct[2] = 'nametoadd=' + name;
    
    webphone_api.$.mobile.changePage("#page_addeditcontact", { transition: "pop", role: "page" });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorydetails: CreateContact", err); }
}

function EditContact()
{
    try{
    var ctid = webphone_api.common.GetContactIdFromNumber(chentry[webphone_api.common.CH_NUMBER]);
    
    if (ctid < 0) // means there is no contact found
    {
        CreateContact();
        return;
    }

    webphone_api.global.intentaddeditct[0] = 'action=edit';
    webphone_api.global.intentaddeditct[1] = 'ctid=' + ctid;
    
    webphone_api.$.mobile.changePage("#page_addeditcontact", { transition: "pop", role: "page" });

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorydetails: EditContact", err); }
}

function onStop(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _callhistorydetails: onStop");
    webphone_api.global.isCallhistorydetailsStarted = false;
    webphone_api.$("#page_callhistorydetails_content").html('');
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorydetails: onStop", err); }
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