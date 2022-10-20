// Contact Details page
webphone_api._contactdetails = (function ()
{
var ctid = -1;
var contact = null;
var iscontact = false; // true if it's a saved contact in contacts list
var frompage = '';
var isfavorite = false; // is contact favorite

function onCreate (event) // called only once - bind events here
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _contactdetails: onCreate");

    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_contactdetails')
        {
            MeasureContactdetails();
        }
    });
    
    webphone_api.$('#contactdetails_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_contactdetails_menu").on("click", function() { CreateOptionsMenu('#contactdetails_menu_ul'); });
    webphone_api.$("#btn_contactdetails_menu").attr("title", webphone_api.stringres.get("hint_menu"));

    webphone_api.$( "#page_contactdetails" ).keyup(function( event )
    {   
        HandleKeyUp(event);
    });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: onCreate", err); }
}

function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _contactdetails: onStart");
    webphone_api.global.isContactdetailsStarted = true;

    setTimeout(function() // otherwise keyup will not work, because the element is not focused
    {
        webphone_api.$("#page_contactdetails").focus();
    }, 100);
    
//--    document.getElementById("app_name_contactdetails").innerHTML = webphone_api.common.GetBrandName();
    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#page_contactdetails'), -30) );
    
    if (!webphone_api.common.isNull(document.getElementById('contactdetails_title')))
    {
        document.getElementById('contactdetails_title').innerHTML = webphone_api.stringres.get("ctdetails_title");
    }
    webphone_api.$("#contactdetails_title").attr("title", webphone_api.stringres.get("hint_page"));

    if (!webphone_api.common.isNull(document.getElementById('ctdetails_btnback')))
    {
        document.getElementById('ctdetails_btnback').innerHTML = '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("ctdetails_btnback_txt");
    }
    
// needed for proper display of page height
    MeasureContactdetails();
    
    var modified = (webphone_api.common.GetTickCount()).toString();
    var ctname = webphone_api.common.GetIntentParam(webphone_api.global.intentctdetails, 'ctname');
    var ctnumber = webphone_api.common.GetIntentParam(webphone_api.global.intentctdetails, 'ctnumber');

    try { ctid = webphone_api.common.StrToInt( webphone_api.common.GetIntentParam(webphone_api.global.intentctdetails, 'ctid') ); } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: onStart can't convert ctid to INT", err); }
    
    if (ctid < 0 && !webphone_api.common.isNull(ctnumber) && ctnumber.length > 0)
    {
        ctid = webphone_api.common.GetContactIdFromNumber(ctnumber);
    }
    
    if (ctid >= 0)
    {
        iscontact = true;
        contact = webphone_api.global.ctlist[ctid];
    }
    
//--    PopulateData();
    
    if (ctid >= 0)
    {
        webphone_api.$("#btn_contactdetails_favorite").show();
        isfavorite = webphone_api.common.ContactIsFavorite(ctid);
        if (isfavorite === true)
        {
            webphone_api.$("#btn_contactdetails_favorite").attr('src', '' + webphone_api.common.GetElementSource() + 'images/btn_star_on_normal_holo_light.png').attr("title", webphone_api.stringres.get("menu_ct_unsetfavorite"));
        }else
        {
            webphone_api.$("#btn_contactdetails_favorite").attr('src', '' + webphone_api.common.GetElementSource() + 'images/btn_star_off_normal_holo_light.png').attr("title", webphone_api.stringres.get("menu_ct_setfavorite"));
        }
    }else
    {
        iscontact = false;
        if (webphone_api.common.isNull(ctname)) { ctname = ''; }
        if (webphone_api.common.isNull(ctnumber)) { ctnumber = ''; }
        
        if (ctname.length > 0 && ctname === ctnumber)
        {
            ctname = webphone_api.common.GetContactNameFromNumber(ctnumber);
        }

        contact = [];
        contact[webphone_api.common.CT_NAME] = ctname;
        contact[webphone_api.common.CT_NUMBER] = [ctnumber];
        contact[webphone_api.common.CT_PTYPE] = ['other'];
        contact[webphone_api.common.CT_USAGE] = '0';
        contact[webphone_api.common.CT_LASTMODIF] = modified;
        contact[webphone_api.common.CT_DELFLAG] = '0';
        contact[webphone_api.common.CT_FAV] = '0';
        contact[webphone_api.common.CT_EMAIL] = '';
        contact[webphone_api.common.CT_ADDRESS] = '';
        contact[webphone_api.common.CT_NOTES] = '';
        contact[webphone_api.common.CT_WEBSITE] = '';
        contact[webphone_api.common.CT_LASTACTIVE] = '0';
    }
    
    PopulateData();
    
    frompage = webphone_api.common.GetIntentParam(webphone_api.global.intentctdetails, 'frompage');
    
    if (frompage === 'dialpad' && !webphone_api.common.isNull(document.getElementById('ctdetails_btnback')))
    {
        document.getElementById('ctdetails_btnback').innerHTML = '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("go_back_btn_txt");
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: onStart", err); }
}

function MeasureContactdetails() // resolve window height size change
{
    try{
//--    var pgh = webphone_api.common.GetDeviceHeight() - 1; webphone_api.$('#page_contactdetails').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_contactdetails').css('min-height', 'auto'); // must be set when softphone is skin in div

    var heightTemp = webphone_api.common.GetDeviceHeight() - webphone_api.$("#contactdetails_header").height();
    heightTemp = heightTemp - 3;
    webphone_api.$("#page_contactdetails_content").height(heightTemp);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: MeasureContactdetails", err); }
}

var isctblocked = false;
function PopulateData()
{
    var enablepres = false;
    var presencequery = [];
    try{
    if (webphone_api.common.isNull(contact) || contact.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _contactdetails PopulateData contact is NULL');
        return;
    }
    
    webphone_api.$("#page_contactdetails_content").html('');
    
    var content = '<div id="contact_name">' +
                        '<p>' + contact[webphone_api.common.CT_NAME] + '</p>' +
                        '<div id="contact_blocked">' +
                            '<img src="' + webphone_api.common.GetElementSource() + 'images/icon_block.png" id="contact_blocked_img" />' +
                        '</div>' +
                        '<div id="contact_favorite">' +
                            '<img id="btn_contactdetails_favorite" style="display: none;" src="' + webphone_api.common.GetElementSource() + 'images/btn_star_off_normal_holo_light.png" title="" />' +
                        '</div>' +
                    '</div>';
    
    var numbers = contact[webphone_api.common.CT_NUMBER];
    var types = contact[webphone_api.common.CT_PTYPE];
    
    if (webphone_api.common.UsePresence2() === true)
    {
        enablepres = true;
    }
    
    // check if contact is blocked
    if (!webphone_api.common.isNull(numbers) && numbers.length > 0)
    {
        if (webphone_api.common.IsContactBlocked(null, numbers)) { isctblocked = true; }
    }

    var iconCallPng = 'icon_call.png';
    var iconMsgPng = 'icon_message.png';
    var iconVideoPng = 'btn_video_txt.png';

    if (webphone_api.common.GetColortheme() === 22 || webphone_api.common.GetColortheme() === 23)
    {
        iconCallPng = 'icon_call_grey.png';
        iconMsgPng = 'icon_message_grey.png';
        iconVideoPng = 'btn_video_txt_grey.png';
    }
    
    var NOW = webphone_api.common.GetTickCount();
    if (!webphone_api.common.isNull(numbers) && numbers.length > 0)
    {
        for (var i = 0; i < numbers.length; i++)
        {
            var presenceimg = ''; //<img src="images/presence_available.png" />

            if (enablepres)
            {
                var presence = '-1';
                var lastcheck = 0; // timestamp last checked presence
                var presobj = webphone_api.global.presenceHM[numbers[i]];
                if (!webphone_api.common.isNull(presobj))
                {
                    presence = presobj[webphone_api.common.PRES_STATUS];
                    var laststr = presobj[webphone_api.common.PRES_TIME];
                    if (!webphone_api.common.isNull(laststr) && webphone_api.common.IsNumber(laststr))
                    lastcheck = webphone_api.common.StrToInt(laststr);
                }

                // -1=not exists(undefined), 0=offline, 1=invisible, 2=idle, 3=pending, 4=DND, 5=online
                
                if (webphone_api.common.isNull(presence) || presence.length < 1 || presence === '-1'/* || (lastcheck > 0 && NOW - lastcheck > 20000)*/)
                {
                    presenceimg = '';
                    
                    if (webphone_api.common.isNull(presencequery)) { presencequery = []; }
                    if (presencequery.indexOf(numbers[i]) < 0)
                    {
                        presencequery.push(numbers[i]);
                    }
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
            
//--             don't display "Call other", just "Call"
            var type = webphone_api.stringres.get('type_' + types[i]);
            if (numbers.length < 2) { type = webphone_api.common.Trim(type.substring(0, type.indexOf(' '))); }
            
            var itemcall = 
                '<div id="ct_entry_' + i + '" class="cd_container">' +
                    '<div id="cd_call_' + i + '" class="cd_call">' +
                        '<div class="cd_data">' +
                            '<div class="cd_type">' + type + '</div>' +
                            '<div class="cd_number">' + numbers[i] + '</div>' +
                        '</div>' +
                        '<div class="cd_icon">' +
                            presenceimg + '<img src="' + webphone_api.common.GetElementSource() + 'images/' + iconCallPng + '" />' +
                        '</div>' +
                    '</div>' +
                '</div>';
        
            var itemmsg = 
                '<div id="ct_entry_' + i + '" class="cd_container">' +
                    '<div id="cd_msg_' + i + '" class="cd_call">' +
                        '<div class="cd_data">' +
                            '<div class="cd_type">' + webphone_api.stringres.get('send_msg') + '</div>' +
                            '<div class="cd_number">' + numbers[i] + '</div>' +
                        '</div>' +
                        '<div class="cd_icon">' +
                            presenceimg + '<img src="' + webphone_api.common.GetElementSource() + 'images/' + iconMsgPng + '" />' +
                        '</div>' +
                    '</div>' +
                '</div>';
        
            var itemvideo = '';
            if (webphone_api.common.CanIUseVideo() === true)
            {
                itemvideo = 
                '<div id="ct_entry_' + i + '" class="cd_container">' +
                    '<div id="cd_video_' + i + '" class="cd_call">' +
                        '<div class="cd_data">' +
                            '<div class="cd_type">' + webphone_api.stringres.get('video_call') + '</div>' +
                            '<div class="cd_number">' + numbers[i] + '</div>' +
                        '</div>' +
                        '<div class="cd_icon">' +
                            presenceimg + '<img src="' + webphone_api.common.GetElementSource() + 'images/' + iconVideoPng + '" />' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }


// handle hidesettings
            if (webphone_api.common.HideSettings('chat', webphone_api.stringres.get('sett_display_name_' + 'chat'), 'chat', true) === true || webphone_api.common.GetParameterInt('textmessaging', -1) == 0)
            {
                itemmsg = '';
            }

            content = content + itemcall + itemmsg + itemvideo;
        }
    }
    
    var backtitle = '';
    if (frompage === 'dialpad')
    {
        backtitle = webphone_api.stringres.get('btn_close');
    }else
    {
        backtitle = webphone_api.stringres.get('ctdetails_btnback_txt');
    }

    var controls = '';
    
    if (webphone_api.common.CanIUseScreensharing() === true)
    {
        controls = controls +
        '<div id="ct_screensh" class="cd_container">' +
            '<div id="ct_screensh_entry_button" class="cd_call">' +
                '<div class="cd_button">' + webphone_api.stringres.get('menu_screenshare') + '</div>' +
            '</div>' +
        '</div>';
    }
    
    if (webphone_api.common.GetConfigBool('hasfiletransfer', true) !== false && webphone_api.common.IsMizuServerOrGateway())
    {
//OPSSTART
        if (webphone_api.common.Glft() === true)
//OPSEND
            controls = controls +
            '<div id="ct_filetransf" class="cd_container">' +
                '<div id="ct_filetransf_entry_button" class="cd_call">' +
                    '<div class="cd_button">' + webphone_api.stringres.get('filetransf_title') + '</div>' +
                '</div>' +
            '</div>';

    }
    
    if (iscontact)
    {
        controls = controls +
            '<div id="ct_edit_entry" class="cd_container">' +
                '<div id="ct_edit_entry_button" class="cd_call">' +
                    '<div class="cd_button">' + webphone_api.stringres.get('menu_editcontact') + '</div>' +
                '</div>' +
            '</div>' +
            '<div id="ct_delete_entry" class="cd_container">' +
                '<div id="ct_delete_entry_button" class="cd_call">' +
                    '<div class="cd_button">' + webphone_api.stringres.get('menu_deletecontact') + '</div>' +
                '</div>' +
            '</div>';
    }else
    {
        controls = controls +
        '<div id="ct_save_entry" class="cd_container">' +
            '<div id="ct_save_entry_button" class="cd_call">' +
                '<div class="cd_button">' + webphone_api.stringres.get('menu_createcontact') + '</div>' +
            '</div>' +
        '</div>';
    }
    
    controls = controls +
        '<div id="ct_allcontacts_entry" class="cd_container">' +
            '<div id="ct_allcontacts_entry_button" class="cd_call">' +
                '<div class="cd_button">' + backtitle + '</div>' +
            '</div>' +
        '</div>';

    content = content + controls;

    webphone_api.$("#page_contactdetails_content").html(content);
    
    if (isctblocked === true)
    {
        webphone_api.$('#contact_blocked_img').show();
    }

// add event listeners
    if (!webphone_api.common.isNull(numbers) && numbers.length > 0)
    {
        for (var i = 0; i < numbers.length; i++)
        {
            (function (i)
            {
                webphone_api.$('#cd_call_' + i).on('click', function() { OnItemClick(i, 0); });
                webphone_api.$('#cd_msg_' + i).on('click', function() { OnItemClick(i, 1); });
                webphone_api.$('#cd_video_' + i).on('click', function() { OnItemClick(i, 2); });
            }(i));
        }
    }
    webphone_api.$('#ct_screensh_entry_button').on('click', function() { ScreenSh(); });
    webphone_api.$('#ct_filetransf_entry_button').on('click', function() { FileTrasnf(); });
    webphone_api.$('#ct_edit_entry_button').on('click', function() { EditContact(); });
    webphone_api.$('#ct_delete_entry_button').on('click', function() { DeleteContactPopup(); });
    webphone_api.$('#ct_save_entry_button').on('click', function() { SaveContact(); });
    webphone_api.$('#ct_allcontacts_entry_button').on('click', function() { webphone_api.$.mobile.back(); });
    
    
// handle favorite
    webphone_api.$("#btn_contactdetails_favorite").off("click");
    webphone_api.$("#btn_contactdetails_favorite").on("click", function()
    {
        ToggleFavorite();
    });
    
    if (ctid >= 0) // means it's a contact, not JUST A NUMBER
    {
        webphone_api.$("#btn_contactdetails_favorite").show();
        isfavorite = webphone_api.common.ContactIsFavorite(ctid);
        if (isfavorite === true)
        {
            webphone_api.$("#btn_contactdetails_favorite").attr('src', '' + webphone_api.common.GetElementSource() + 'images/btn_star_on_normal_holo_light.png').attr("title", webphone_api.stringres.get("menu_ct_unsetfavorite"));
        }else
        {
            webphone_api.$("#btn_contactdetails_favorite").attr('src', '' + webphone_api.common.GetElementSource() + 'images/btn_star_off_normal_holo_light.png').attr("title", webphone_api.stringres.get("menu_ct_setfavorite"));
        }
    }
// END handle favorite
    
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
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: PopulateData", err); }
}

function ScreenSh() // opens page message with the contact's number
{
    try{
    webphone_api.common.PutToDebugLog(2, 'EVENT, _contactdetails: ScreenSh');
    var numbers = contact[webphone_api.common.CT_NUMBER];
    
    if (webphone_api.common.isNull(numbers) || numbers.length < 1)
    {
        webphone_api.common.PutToDebugLog(1, 'ERROR,' + webphone_api.stringres.get('ct_menu_error'));
        webphone_api.common.ShowToast('ERROR,' + webphone_api.stringres.get('ct_menu_error'));
        return;
    }
    
    if (numbers.length === 1)
    {
        webphone_api.screenshare(numbers[0]);
        return;
    }else
    {
        webphone_api.common.PickContactNumber(ctid, function(pick_nr, pick_name)
        {
            webphone_api.screenshare(pick_nr);
        });
        return;
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: ScreenSh", err); }
}

function FileTrasnf() // opens page message with the contact's number
{
    try{
    webphone_api.common.PutToDebugLog(2, 'EVENT, _contactdetails: FileTrasnf');
    var numbers = contact[webphone_api.common.CT_NUMBER];
    
    if (webphone_api.common.isNull(numbers) || numbers.length < 1)
    {
        webphone_api.common.PutToDebugLog(1, 'ERROR,' + webphone_api.stringres.get('ct_menu_error'));
        webphone_api.common.ShowToast('ERROR,' + webphone_api.stringres.get('ct_menu_error'));
        return;
    }
    
    if (numbers.length === 1)
    {
        webphone_api.common.FileTransfer(numbers[0]);
        return;
    }else
    {
        webphone_api.common.PickContactNumber(ctid, function(pick_nr, pick_name)
        {
            webphone_api.common.FileTransfer(pick_nr);
        });
        return;
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: FileTrasnf", err); }
}

function ToggleFavorite()
{
    try{
    if (isfavorite === true)
    {
        webphone_api.$("#btn_contactdetails_favorite").attr('src', '' + webphone_api.common.GetElementSource() + 'images/btn_star_off_normal_holo_light.png').attr("title", webphone_api.stringres.get("menu_ct_setfavorite"));
        webphone_api.common.ContactSetFavorite(ctid, false);
    }else
    {
        webphone_api.$("#btn_contactdetails_favorite").attr('src', '' + webphone_api.common.GetElementSource() + 'images/btn_star_on_normal_holo_light.png').attr("title", webphone_api.stringres.get("menu_ct_unsetfavorite"));
        webphone_api.common.ContactSetFavorite(ctid, true);
    }
    isfavorite = !isfavorite;

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: ToggleFavorite", err); }
}
    
var trigerred = false; // handle multiple clicks
function OnItemClick(contactid, type) // type: 0=call, 1=chat, 2=video call
{
    try{
    if (trigerred) { return; }
    
    trigerred = true;
    setTimeout(function ()
    {
        trigerred = false;
    }, 1000);

    if (webphone_api.common.isNull(contactid)) { return; }
    
    var numbers = contact[webphone_api.common.CT_NUMBER];
    var to = numbers[contactid];
    var name = contact[webphone_api.common.CT_NAME];
    
    if (type === 0)
    {
        webphone_api.common.PutToDebugLog(4, 'EVENT, _contactdetails initiate call to: ' + to);
        
        setTimeout(function () //-- timeout, so webphone_api.$.mobile.back(); won't close call page
        {
            webphone_api.call(to, -1);
        }, 100);
        
        if (webphone_api.common.getuseengine() === 'p2p')
        {
            return;
        }
        webphone_api.$.mobile.back();
    }
    else if (type === 1)
    {
        webphone_api.common.StartMsg(to, '', '_contactdetails');
    }
    else if (type === 2)
    {
        webphone_api.common.PutToDebugLog(4, 'EVENT, _contactdetails initiate video call to: ' + to);
        webphone_api.videocall(to);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: OnItemClick", err); }
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
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: HandleKeyUp", err); }
}

var MENUITEM_CONTACTDETAILS_EDIT = '#menuitem_contactdetails_edit';
var MENUITEM_CONTACTDETAILS_DELETE = '#menuitem_contactdetails_delete';
var MENUITEM_CONTACTDETAILS_CREATE = '#menuitem_contactdetails_create';
var MENUITEM_CONTACTDETAILS_BLOCKCT = '#menuitem_contactdetails_blockct';
var MENUITEM_CONTACTDETAILS_FAVORITE = '#menuitem_contactdetails_favorite';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$( "#btn_contactdetails_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _contactdetails: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _contactdetails: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }

    webphone_api.$(menuId).html('');
    
    if (iscontact)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CONTACTDETAILS_EDIT + '"><a data-rel="back">' + webphone_api.stringres.get('menu_editcontact') + '</a></li>' ).listview('refresh');
    
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CONTACTDETAILS_DELETE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_deletecontact') + '</a></li>' ).listview('refresh');
    }else
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CONTACTDETAILS_CREATE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_createcontact') + '</a></li>' ).listview('refresh');
    }
    
    var blocktitle = webphone_api.stringres.get('menu_block_contact');
    if (isctblocked === true) { blocktitle = webphone_api.stringres.get('menu_unblock_contact'); }
    	
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_CONTACTDETAILS_BLOCKCT + '"><a data-rel="back">' + blocktitle + '</a></li>' ).listview('refresh');

    var favtitle = webphone_api.stringres.get('menu_ct_setfavorite');
    if (isfavorite === true) { favtitle = webphone_api.stringres.get('menu_ct_unsetfavorite'); }
    	
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_CONTACTDETAILS_FAVORITE + '"><a data-rel="back">' + favtitle + '</a></li>' ).listview('refresh');

    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#contactdetails_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#contactdetails_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_CONTACTDETAILS_EDIT:
                EditContact();
                break;
            case MENUITEM_CONTACTDETAILS_DELETE:
                DeleteContactPopup();
                break;
            case MENUITEM_CONTACTDETAILS_CREATE:
                SaveContact();
                break;
            case MENUITEM_CONTACTDETAILS_BLOCKCT:
                ToggleCtBlocked();
                break;
            case MENUITEM_CONTACTDETAILS_FAVORITE:
                ToggleFavorite();
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: MenuItemSelected", err); }
}

function ToggleCtBlocked()
{
    try{
    if (isctblocked === true)
    {
        isctblocked = false;
        webphone_api.$('#contact_blocked_img').hide();

        var numbers = contact[webphone_api.common.CT_NUMBER];
        if (!webphone_api.common.isNull(numbers) && numbers.length > 0)
        {
            webphone_api.common.UnBlockContact(null, numbers);
        }
    }else
    {
        isctblocked = true;
        webphone_api.$('#contact_blocked_img').show();

        var numbers = contact[webphone_api.common.CT_NUMBER];
        if (!webphone_api.common.isNull(numbers) && numbers.length > 0)
        {
            webphone_api.common.BlockContact(null, numbers);
        }
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: ToggleCtBlocked", err); }
}

function SaveContact()
{
    try{
    webphone_api.global.intentaddeditct[0] = 'action=add';
    webphone_api.global.intentaddeditct[1] = 'numbertoadd=' + contact[webphone_api.common.CT_NUMBER][0];
    var name = contact[webphone_api.common.CT_NAME];
    if (webphone_api.common.isNull(name) || name.length < 1 || name === contact[webphone_api.common.CT_NUMBER][0]) { name = ''; }
    webphone_api.global.intentaddeditct[2] = 'nametoadd=' + name;
    
    webphone_api.$.mobile.changePage("#page_addeditcontact", { transition: "pop", role: "page" });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: CreateContact", err); }
}

function EditContact() // open AddEditContact activity
{
    try{
    webphone_api.global.intentaddeditct[0] = 'action=edit';
    webphone_api.global.intentaddeditct[1] = 'ctid=' + ctid;
    
    webphone_api.$.mobile.changePage("#page_addeditcontact", { transition: "pop", role: "page" });

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: EditContact", err); }
}

function DeleteContactPopup(popupafterclose)
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

        if(popupWidth > 400) popupWidth = 400;
        else if(popupWidth < 120) popupWidth = 120;
    
    var template = '' +
'<div id="delete_contact_popup" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('menu_deletecontact') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content adialog_alert">' +
        '<span> ' + webphone_api.stringres.get('contact_delete_msg') + ' </span>' +
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
        DeleteContact();
    });
    
//--    webphone_api.global.ctlist.splice(ctid, 1);
//--    webphone_api.common.SaveContactsFile(function (issaved) { webphone_api.common.PutToDebugLog(4, 'EVENT, _contactdetails: DeleteContact SaveContactsFile: ' + issaved.toString()); });
    
//--    webphone_api.$.mobile.back();
        
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: DeleteContactPopup", err); }
}

function DeleteContact()
{
    try{
    webphone_api.$( '#delete_contact_popup' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#delete_contact_popup' ).off( 'popupafterclose' );

        webphone_api.global.ctlist.splice(ctid, 1);
        webphone_api.common.SaveContactsFile(function (issaved) { webphone_api.common.PutToDebugLog(4, 'EVENT, _contactdetails: DeleteContact SaveContactsFile: ' + issaved.toString()); });

        webphone_api.$.mobile.back();
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: DeleteContact", err); }
}

function onStop(event)
{

    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _contactdetails: onStop");
    webphone_api.global.isContactdetailsStarted = false;
    
    webphone_api.$('#contact_blocked_img').hide();
    isctblocked = false;
    
    webphone_api.$("#page_contactdetails_content").html('');
    webphone_api.$("#btn_contactdetails_favorite").off("click");
    
    ctid = -1;
    contact = null;
    iscontact = false;
    frompage = '';
    isfavorite = false;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: onStop", err); }
}

function onDestroy (event){} // deprecated by onstop


// public members and methods
return {
    onCreate: onCreate,
    onStart: onStart,
    onStop: onStop,
    onDestroy: onDestroy,
    PopulateData: PopulateData
};
})();