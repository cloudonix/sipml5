// Call History List page
webphone_api._callhistorylist = (function ()
{
function onCreate (event) // called only once - bind events here
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _callhistorylist: onCreate");
    
//-- navigation done with js, so target URL will not be displayed in browser statusbar
    webphone_api.$("#nav_ch_dialpad").on("click", function()
    {
        webphone_api.$.mobile.changePage("#page_dialpad", { transition: "none", role: "page", reverse: "true" });
    });
    webphone_api.$("#nav_ch_contacts").on("click", function()
    {
        webphone_api.$.mobile.changePage("#page_contactslist", { transition: "none", role: "page", reverse: "true" });
    });
    
    webphone_api.$("#nav_ch_dialpad").attr("title", webphone_api.stringres.get("hint_dialpad"));
    webphone_api.$("#nav_ch_contacts").attr("title", webphone_api.stringres.get("hint_contacts"));
    webphone_api.$("#nav_ch_callhistory").attr("title", webphone_api.stringres.get("hint_callhistory"));
    webphone_api.$("#callhistorylist_not_btn").on("click", function()
    {
        webphone_api.common.SaveParameter('notification_count2', 0);
        webphone_api.common.ShowNotifications2(); // repopulate notifications (hide red dot number)
    });
    
    webphone_api.$("#status_callhistorylist").attr("title", webphone_api.stringres.get("hint_status"));
    webphone_api.$("#curr_user_callhistorylist").attr("title", webphone_api.stringres.get("hint_curr_user"));
    
    webphone_api.$('#callhistorylist_notification_list').on('click', '.nt_anchor', function(event)
    {
        webphone_api.$("#callhistorylist_not").panel( "close" );
        webphone_api.common.NotificationOnClick2(webphone_api.$(this).attr('id'), false);
    });
    webphone_api.$('#callhistorylist_notification_list').on('click', '.nt_menu', function(event)
    {
        webphone_api.$("#callhistorylist_not").panel( "close" );
        webphone_api.common.NotificationOnClick2(webphone_api.$(this).attr('id'), true);
    });


    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_callhistorylist')
        {
            MeasureCallhistorylist();
        }
    });
    
    webphone_api.$('#callhistorylist_list').on('click', 'li', function(event)
    {
        OnListItemClick(webphone_api.$(this).attr('id'));
    });
    
    webphone_api.$('#callhistorylist_list').on('taphold', 'li', function(event)
    {
        OnListItemLongClick(webphone_api.$(this).attr('id'));
    });
    
    webphone_api.$('#callhistorylist_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_callhistorylist_menu").on("click", function() { CreateOptionsMenu('#callhistorylist_menu_ul'); });
    webphone_api.$("#btn_callhistorylist_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    
    var advuri = webphone_api.common.GetParameter('advertisement');
    if (!webphone_api.common.isNull(advuri) && advuri.length > 5)
    {
        webphone_api.$('#advert_callhistorylist_frame').attr('src', advuri);
        webphone_api.$('#advert_callhistorylist').show();
    }
    
    if (webphone_api.common.UsePresence2() === true)
    {
        webphone_api.$("#callhistorylist_additional_header_left").on("click", function()
        {
            webphone_api.common.PresenceSelector('callhistorylist');
        });
        webphone_api.$("#callhistorylist_additional_header_left").css("cursor", "pointer");
    }

    webphone_api.$( "#page_callhistorylist" ).keyup(function( event )
    {   
        HandleKeyUp(event);
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: onCreate", err); }
}

function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _callhistorylist: onStart");
    webphone_api.global.isCallhistorylistStarted = true;

    setTimeout(function() // otherwise keyup will not work, because the element is not focused
    {
        webphone_api.$("#page_callhistorylist").focus();
    }, 100);
    
    if (webphone_api.common.HideSettings('page_contacts', '', 'page_contacts', true))
    {
        webphone_api.$("#li_nav_ch_ct").remove();
        var count = webphone_api.$("#ul_nav_ch").children().length;
        var tabwidth = Math.floor(100 / count);
        
        webphone_api.$('#ul_nav_ch').children('li').each(function ()
        {
            webphone_api.$(this).css('width', tabwidth + '%');
        });
        
        if (count < 2)
        {
            webphone_api.$('#ul_nav_ch').remove();
            MeasureDialPad();
        }
    }

    if (webphone_api.common.GetParameter('devicetype') !== webphone_api.common.DEVICE_WIN_SOFTPHONE())
    {
        document.getElementById("app_name_callhistorylist").innerHTML = webphone_api.common.GetBrandName();
    }
    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#page_callhistorylist'), -30) );
    
    if (!webphone_api.common.isNull(document.getElementById('chlist_title')))
    {
        document.getElementById('chlist_title').innerHTML = webphone_api.stringres.get('chlist_title');
    }
    webphone_api.$("#chlist_title").attr("title", webphone_api.stringres.get("hint_page"));
    
    var curruser = webphone_api.common.GetCallerid();
    if (!webphone_api.common.isNull(curruser) && curruser.length > 0) { webphone_api.$('#curr_user_callhistorylist').html(curruser); }
// set status width so it's uses all space to curr_user
    var statwidth = webphone_api.common.GetDeviceWidth() - webphone_api.$('#curr_user_callhistorylist').width() - 25;
    if (!webphone_api.common.isNull(statwidth) && webphone_api.common.IsNumber(statwidth))
    {
        webphone_api.$('#status_callhistorylist').width(statwidth);
    }
    
    if ((webphone_api.common.GetParameter('header')).length > 2)
    {
        webphone_api.$('#headertext_callhistorylist').show();
        webphone_api.$('#headertext_callhistorylist').html(webphone_api.common.GetParameter('header'));
    }else
    {
        webphone_api.$('#headertext_callhistorylist').hide();
    }
    if ((webphone_api.common.GetParameter('footer')).length > 2)
    {
        webphone_api.$('#footertext_callhistorylist').show();
        webphone_api.$('#footertext_callhistorylist').html(webphone_api.common.GetParameter('footer'));
    }else
    {
        webphone_api.$('#footertext_callhistorylist').hide();
    }

    if (webphone_api.common.GetColortheme() === 22)
    {
        webphone_api.$("#nav_ch_dialpad IMG").attr("src", "images/tab_dialpad_grey.png");
        webphone_api.$("#nav_ch_contacts IMG").attr("src", "images/tab_contacts_grey.png");
        webphone_api.$("#nav_ch_callhistory IMG").attr("src", "images/tab_callog_blue.png");
    }
    
//BRANDSTART
    if (webphone_api.common.GetConfigInt('brandid', -1) === 58) //-- enikma
    {
        var logodiv = document.getElementById('app_name_callhistorylist');
        if (!webphone_api.common.isNull(logodiv))
        {
            var middle = document.getElementById('chlist_title');
            logodiv.style.display = 'inline';
            if (!webphone_api.common.isNull(middle)) { middle.style.display = 'none'; }
            document.getElementById('callhistorylist_additional_header_left').style.width = '65%';
            logodiv.innerHTML = '<img src="' + webphone_api.common.GetElementSource() + 'images/logo.png" style="border: 0;">&nbsp;&nbsp;&nbsp;<div class="adhead_custom_brand" style=""><b>eNikMa</b> Unified Comm</div>';
        }
    }
//BRANDEND

    webphone_api.common.HideCallNotifications2(); //-- show only message notification    
// needed for proper display and scrolling of listview
    MeasureCallhistorylist();
    
    // fix for IE 10
    if (webphone_api.common.IsIeVersion(10)) { webphone_api.$("#callhistorylist_list").children().css('line-height', 'normal'); }
    if (webphone_api.common.IsIeVersion(10)) { webphone_api.$("#callhistorylist_notification_list").children().css('line-height', 'normal'); }
    webphone_api.$("#callhistorylist_notification_list").height(webphone_api.common.GetDeviceHeight() - 55);
    
    LoadHistory();
    
    webphone_api.common.ShowOfferSaveContact();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: onStart", err); }
}

function MeasureCallhistorylist() // resolve window height size change
{
    try{
//--    var pgh = webphone_api.common.GetDeviceHeight() - 1; webphone_api.$('#page_callhistorylist').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_callhistorylist').css('min-height', 'auto'); // must be set when softphone is skin in div

// handle notifiaction      additional_header_right
    var notwidth = webphone_api.common.GetDeviceWidth() - webphone_api.$("#callhistorylist_additional_header_left").width() - webphone_api.$("#callhistorylist_additional_header_right").width();
    var margin = webphone_api.common.StrToIntPx( webphone_api.$("#callhistorylist_additional_header_left").css("margin-left") );
    
    if (webphone_api.common.isNull(margin) || margin === 0) { margin = 10; }
    margin = Math.ceil( margin * 6 );
    notwidth = Math.floor(notwidth - margin) - 20;

    webphone_api.$("#callhistorylist_notification").width(notwidth);
    webphone_api.$("#callhistorylist_notification").height( Math.floor( webphone_api.$("#callhistorylist_additional_header_left").height() ) );
    
// handle page height
    var heightTemp = webphone_api.common.GetDeviceHeight() - webphone_api.$("#callhistorylist_header").height() - 3;
    
    if (webphone_api.$('#footertext_callhistorylist').is(':visible')) { heightTemp = heightTemp - webphone_api.$("#footertext_callhistorylist").height(); }
    
    if (webphone_api.$('#advert_callhistorylist').is(':visible')) { heightTemp = heightTemp - webphone_api.$("#advert_callhistorylist").height(); }
    
    webphone_api.$("#callhistorylist_list").height(heightTemp);

    
//--    var brandW = Math.floor(webphone_api.common.GetDeviceWidth() / 3.2);
//--    webphone_api.$("#app_name_callhistorylist").width(brandW);

    // if brandname does not fit, then hide brandname
    if (webphone_api.global.bname_charcount > 0 && webphone_api.common.GetBrandName().length > webphone_api.global.bname_charcount)
    {
        webphone_api.$('#app_name_callhistorylist').html('');
        webphone_api.$('#callhistorylist_additional_header_left').width('35%');
    }
    var brandW = webphone_api.$("#callhistorylist_additional_header_left").width() - 5;
    if (webphone_api.$('#callhistorylist_presence').is(':visible')) { brandW = brandW - webphone_api.$("#callhistorylist_presence").width(); }
    webphone_api.$("#app_name_callhistorylist").width(brandW);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: MeasureCallhistorylist", err); }
}

function LoadHistory()
{
    try{
    if (webphone_api.global.isdebugversion)
    {
//--        if ( webphone_api.common.isNull(webphone_api.global.chlist) || webphone_api.global.chlist.length < 1 )
//--        {
//--            webphone_api.global.chlist = [];
            // String call_type, String name, String number, String date, String duration(sec), String recording
            
//--            var chitem = ['0', 'John Doe', '12332', '1401783666621', '50', ''];

//--            var chitem2 = ['1', 'Jane Doe', '134567915', '1401783646621', '18', ''];
//--            var chitem3 = ['2', '469879797973', '469879797973', '1401783662621', '85', ''];
//--            var chitem3 = ['2', '46987979797', '46987979797', '1401783662621', '85', ''];
//--            var chitem4 = ['3', 'Bela Missedcall', '46987979797', '1401783662621', '850', ''];
//--            var chitem4 = ['3', 'Bela Missedcall2', '46987979797', '1401783662621', '850', ''];

//--            webphone_api.global.chlist.push(chitem); webphone_api.global.chlist.push(chitem2); webphone_api.global.chlist.push(chitem3); webphone_api.global.chlist.push(chitem4);
//--            webphone_api.global.chlist.push(chitem); webphone_api.global.chlist.push(chitem2); webphone_api.global.chlist.push(chitem3); webphone_api.global.chlist.push(chitem3);
//--            webphone_api.global.chlist.push(chitem3); webphone_api.global.chlist.push(chitem4);
//--        }
    }
    if (webphone_api.common.isNull(webphone_api.global.chlist) || webphone_api.global.chlist.length < 1)
    {
        webphone_api.common.ReadCallhistoryFile(function (success)
        {
            if (!success)
            {
                webphone_api.common.PutToDebugLog(2, 'EVENT, _callhistorylist: Load call history failed');
            }

            PopulateList();
        });
    }else
    {
        PopulateList();
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: LoadHistory", err); }
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

function PopulateList() // :no return value
{
    try{
    if ( webphone_api.common.isNull(document.getElementById('callhistorylist_list')) )
    {
        webphone_api.common.PutToDebugLog(2, "ERROR, _callhistorylist: PopulateList listelement is null");
        return;
    }
    
    if ( webphone_api.common.isNull(webphone_api.global.chlist) || webphone_api.global.chlist.length < 1 )
    {
        webphone_api.$('#callhistorylist_list').html( '<span style="text-shadow:0 0 0;">' + webphone_api.stringres.get('no_history') + '</span>' );
        webphone_api.common.PutToDebugLog(2, "EVENT, _callhistorylist: PopulateList no history");
        return;
    }
    
    webphone_api.common.PutToDebugLog(2, 'EVENT, _callhistorylist Starting populate list');
    
    var template = '' +
        '<li id="chitem_[CHID]" data-theme="b" title="[HINT_DISC_REASON]"><a [MISSED_NEW] class="ch_anchor mlistitem" data-transition="slide">' +
            '<div class="item_container">' +
                '<div class="ch_type">' +
                    '<img src="' + webphone_api.common.GetElementSource() + 'images/[ICON_CALLTYPE].png" />' +
                '</div>' +
                '<div class="ch_data">' +
                    '<div class="ch_name">[NAME]</div>' +
                    '<div class="ch_number">[NUMBER]</div>' +
                    '<div class="ch_duration">[DURATION]</div>' +//Duration: 02:45
                '</div>' +
                '<div class="ch_date">[DATE]</div>' + // Aug, 26 2013 10:55
            '</div>' +
        '</a></li>';
    var listview = '';
    
    for (var i = 0; i < webphone_api.global.chlist.length; i++)
    {
        var item = webphone_api.global.chlist[i];
        if ( webphone_api.common.isNull(item) || item.length < 1 ) { continue; }
        
        /* type 0=outgoing call, 1=incomming call, 2=missed call - not viewed, 3=missed call - viwed*/
        
        var icon = 'icon_call_missed';
        var missed = '';
        
    // handle filter
        if (webphone_api.global.callhistoryfilter === 0 && item[webphone_api.common.CH_TYPE] !== '0') { continue; }
        else if (webphone_api.global.callhistoryfilter === 1 && item[webphone_api.common.CH_TYPE] !== '1') { continue; }
        else if (webphone_api.global.callhistoryfilter === 2 && (item[webphone_api.common.CH_TYPE] !== '2' && item[webphone_api.common.CH_TYPE] !== '3')) { continue; }
            
        var durationint = 0;
        try{
            durationint = webphone_api.common.StrToInt( webphone_api.common.Trim(item[webphone_api.common.CH_DURATION]) );
        
        } catch(errin1) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: PopulateList convert duration", errin1); }
        
        if (item[webphone_api.common.CH_TYPE] === '0')
        {
            if (durationint <= 0)
            {
                icon = 'icon_call_outgoing_failed';
            }else
            {
                icon = 'icon_call_outgoing';
            }
        }
        if (item[webphone_api.common.CH_TYPE] === '1') { icon = 'icon_call_incoming'; }
        
        if (item[webphone_api.common.CH_TYPE] === '2')
        {
            //missed = 'style="background: #ff7500;"';
            
            item[webphone_api.common.CH_TYPE] = '3';
            webphone_api.global.chlist[i] = item;
        }
                
        var datecallint = 0;
        try{
            datecallint = webphone_api.common.StrToInt( webphone_api.common.Trim(item[webphone_api.common.CH_DATE]) );
        
        } catch(errin1) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: PopulateList convert duration", errin1); }

//--Aug, 26 2013 10:55
        var datecall = new Date(datecallint);
        
        var minutes = datecall.getMinutes();
        if (minutes < 10) { minutes = '0' + minutes; }
        
        var day = datecall.getDate(); // getDay returns the day of the week
        if (day < 10) { day = '0' + day; }
        
//--        var seconds = datecall.getSeconds();
//--        if (seconds < 10) { seconds = '0' + seconds; }
        
        var daetcallstr = month[datecall.getMonth()] + ', ' + day + '&nbsp;&nbsp;' + datecall.getFullYear()+ '&nbsp;&nbsp;'
                + datecall.getHours() + ':' + minutes;// + ':' + seconds;
        
        var durationstr = webphone_api.stringres.get('duration') + ' ';
//--        if (durationint > 0)
//--        {
//--            durationint = Math.floor(durationint / 1000);
            var sec = durationint % 60;
            var durationmin = Math.floor(durationint / 60);
            var min = durationmin % 60;
            var hour = Math.floor(durationmin / 60);
            
            if (hour > 0)   { durationstr += hour + ':'; }
            if (min < 10 )  { durationstr += '0'; }             durationstr += min + ':';
            if (sec < 10)   { durationstr += '0'; }             durationstr += sec;
//--        }else
        
        var lisitem = template.replace('[CHID]', i);
        lisitem = lisitem.replace('[ICON_CALLTYPE]', icon);
        lisitem = lisitem.replace('[MISSED_NEW]', missed);
        lisitem = lisitem.replace('[NAME]', item[webphone_api.common.CH_NAME]);
        lisitem = lisitem.replace('[NUMBER]', item[webphone_api.common.CH_NUMBER]);
        lisitem = lisitem.replace('[DURATION]', durationstr);
        lisitem = lisitem.replace('[DATE]', daetcallstr);
        lisitem = lisitem.replace('[HINT_DISC_REASON]', item[webphone_api.common.CH_REASON]);

        listview = listview + lisitem;
    }
    
    webphone_api.$('#callhistorylist_list').html('');
    webphone_api.$('#callhistorylist_list').append(listview).listview('refresh');
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: PopulateList", err); }
}

function OnListItemClick (id) // :no return value
{
    try{
        
    if (webphone_api.common.isNull(id) || id.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _callhistorylist OnListItemClick id is NULL');
        return;
    }
    
    var ctid = '';
    var pos = id.indexOf('_');
    if (pos < 2)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _callhistorylist OnListItemClick invalid id');
        return;
    }
    
    ctid = webphone_api.common.Trim(id.substring(pos + 1));
    
    webphone_api.global.intentchdetails[0] = 'ctid=' + ctid;
    webphone_api.$.mobile.changePage("#page_callhistorydetails", { transition: "none", role: "page" });    
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: OnListItemClick", err); }
}

function OnListItemLongClick (id) // :no return value
{
    try{
        
    if (webphone_api.common.isNull(id) || id.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _callhistorylist OnListItemLongClick id is NULL');
        return;
    }
    
    var chid = '';
    var pos = id.indexOf('_');
    if (pos < 2)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _callhistorylist OnListItemLongClick invalid id 1');
        return;
    }
    
    chid = webphone_api.common.Trim(id.substring(pos + 1));
    if (webphone_api.common.isNull(chid) || chid.length < 1 || !webphone_api.common.IsNumber(chid))
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _callhistorylist OnListItemLongClick invalid id 2: ' + chid);
        return;
    }
    
    CreateContextmenu(chid);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: OnListItemLongClick", err); }
}

function CreateContextmenu(chid, popupafterclose)
{
    try{
    var chentry = webphone_api.global.chlist[chid];
    var popupWidth = webphone_api.common.GetDeviceWidth();
    if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
    {
        popupWidth = Math.floor(popupWidth / 1.2);
    }else
    {
        popupWidth = 220;
    }
    
    var list = '';
    var item = '<li id="[ITEMID]"><a data-rel="back">[ITEMTITLE]</a></li>';
    
    var itemTemp = '';
    
    if (webphone_api.common.GetContactIdFromNumber(chentry[webphone_api.common.CH_NUMBER]) < 0)	// check if contact exists
    {
        itemTemp = item.replace('[ITEMID]', '#item_create_contact');
        itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_createcontact'));
        list = list + itemTemp;
        itemTemp = '';
    }else
    {
        itemTemp = item.replace('[ITEMID]', '#item_edit_contact');
        itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_editcontact'));
        list = list + itemTemp;
        itemTemp = '';
    }
    
    itemTemp = item.replace('[ITEMID]', '#item_delete');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('ch_delete'));
    list = list + itemTemp;
    itemTemp = '';

    
    var template = '' +
'<div id="ch_contextmenu" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + chentry[webphone_api.common.CH_NAME] + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content" style="padding: 0; margin: 0;">' +
    
        '<ul id="ch_contextmenu_ul" data-role="listview" data-inset="true" data-icon="false" style="margin: 0;">' +
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
            
            webphone_api.$('#ch_contextmenu_ul').off('click', 'li');
            
            popupafterclose();
        }
    });
    
   
        
    webphone_api.$('#ch_contextmenu_ul').on('click', 'li', function(event)
    {
        
        var itemid = webphone_api.$(this).attr('id');
        
        if (itemid === '#item_delete')
        {        
            webphone_api.global.chlist.splice(chid, 1);
            webphone_api.global.wasChModified = true;
            PopulateList();
        }
        else if (itemid === '#item_create_contact')
        {        
            CreateContact(chid);
        }
        else if (itemid === '#item_edit_contact')
        {        
            EditContact(chid);
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: CreateContextmenu", err); }
}

function CreateContact(chid)
{
    try{
    webphone_api.$( '#ch_contextmenu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#ch_contextmenu' ).off( 'popupafterclose' );
        
        var chentry = webphone_api.global.chlist[chid];

        webphone_api.global.intentaddeditct[0] = 'action=add';
        webphone_api.global.intentaddeditct[1] = 'numbertoadd=' + chentry[webphone_api.common.CH_NUMBER];
        var name = chentry[webphone_api.common.CH_NAME];
        if (webphone_api.common.isNull(name) || name.length < 1 || name === chentry[webphone_api.common.CH_NUMBER]) { name = ''; }
        webphone_api.global.intentaddeditct[2] = 'nametoadd=' + name;

        webphone_api.$.mobile.changePage("#page_addeditcontact", { transition: "pop", role: "page" });
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: CreateContact", err); }
}

function EditContact(chid)
{
    try{
    var chentry = webphone_api.global.chlist[chid];
    var ctid = webphone_api.common.GetContactIdFromNumber(chentry[webphone_api.common.CH_NUMBER]);
    
    if (ctid < 0) // means there is no contact found
    {
        CreateContact(chid);
        return;
    }
    
    webphone_api.$( '#ch_contextmenu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#ch_contextmenu' ).off( 'popupafterclose' );

        webphone_api.global.intentaddeditct[0] = 'action=edit';
        webphone_api.global.intentaddeditct[1] = 'ctid=' + ctid;

        webphone_api.$.mobile.changePage("#page_addeditcontact", { transition: "pop", role: "page" });
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: EditContact", err); }
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
        webphone_api.$.mobile.changePage("#page_dialpad", { transition: "none", role: "page", reverse: "true" });
    }
//--    else if (charCode === 13)
//--    {
//--        event.preventDefault();
//--        webphone_api.$("#btn_call").click();
//--    }
    return false;
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: HandleKeyUp", err); }
}

var MENUITEM_CALLHISTORYLIST_CLEAR = '#menuitem_callhistorylist_clear';
var MENUITEM_CALLHISTORYLIST_SETTINGS = '#menuitem_callhistorylist_settings';
var MENUITEM_CALLHISTORYLIST_LASTCALLDETAILS = '#menuitem_callhistorylist_lastcalldetails';
var MENUITEM_CALLHISTORYLIST_FILTER = '#menuitem_callhistorylist_filter';
var MENUITEM_HELP = '#menuitem_callhistorylist_help';
var MENUITEM_EXIT = '#menuitem_callhistorylist_exit';

var MENUITEM_CALLHISTORYLIST_CUSTOM_LINK = 'menuitem_callhistorylist_custom_link';
var MENUITEM_CALLHISTORYLIST_CUSTOM_LINK2 = 'menuitem_callhistorylist_custom_link2';
var MENUITEM_CALLHISTORYLIST_CUSTOM_LINK3 = 'menuitem_callhistorylist_custom_link3';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$( "#btn_callhistorylist_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _callhistorylist: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _callhistorylist: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    var featureset = webphone_api.common.GetParameterInt('featureset', 10);

    if ( !webphone_api.common.isNull(webphone_api.global.chlist) && webphone_api.global.chlist.length > 0 )
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALLHISTORYLIST_CLEAR + '"><a data-rel="back">' + webphone_api.stringres.get('clear_callhistory') + '</a></li>' ).listview('refresh');
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALLHISTORYLIST_FILTER + '"><a data-rel="back">' + webphone_api.stringres.get('menu_filter') + '</a></li>' ).listview('refresh');
    }
    
    if (featureset > 0 && !webphone_api.common.isNull(webphone_api.global.lastcalldetails) && webphone_api.global.lastcalldetails.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALLHISTORYLIST_LASTCALLDETAILS + '"><a data-rel="back">' + webphone_api.stringres.get('menu_lastcalldetails') + '</a></li>' ).listview('refresh');
    }

    webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALLHISTORYLIST_SETTINGS + '"><a data-rel="back">' + webphone_api.stringres.get('settings_title') + '</a></li>' ).listview('refresh');

    var help_title = webphone_api.stringres.get('menu_help') + '...';
//BRANDSTART
    if (webphone_api.common.GetConfigInt('brandid', -1) === 60) { help_title = webphone_api.stringres.get('help_about'); } // 101VOICEDT500
//BRANDEND
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_HELP + '"><a data-rel="back">' + help_title + '</a></li>' ).listview('refresh');

    var linktext = webphone_api.common.GetParameter('linktext');
    var linkurl = webphone_api.common.GetParameter('linkurl');
    var linktext2 = webphone_api.common.GetParameter('linktext2');
    var linkurl2 = webphone_api.common.GetParameter('linkurl2');
    var linktext3 = webphone_api.common.GetParameter('linktext3');
    var linkurl3 = webphone_api.common.GetParameter('linkurl3');
    if (!webphone_api.common.isNull(linktext) && linktext.length > 0 && !webphone_api.common.isNull(linkurl) && linkurl.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALLHISTORYLIST_CUSTOM_LINK + '"><a data-rel="back">' + linktext + '</a></li>' ).listview('refresh');
    }
    if (!webphone_api.common.isNull(linktext2) && linktext2.length > 0 && !webphone_api.common.isNull(linkurl2) && linkurl2.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALLHISTORYLIST_CUSTOM_LINK2 + '"><a data-rel="back">' + linktext2 + '</a></li>' ).listview('refresh');
    }
    if (!webphone_api.common.isNull(linktext3) && linktext3.length > 0 && !webphone_api.common.isNull(linkurl3) && linkurl3.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CALLHISTORYLIST_CUSTOM_LINK3 + '"><a data-rel="back">' + linktext3 + '</a></li>' ).listview('refresh');
    }
    
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_EXIT + '"><a data-rel="back">' + webphone_api.stringres.get('menu_exit') + '</a></li>' ).listview('refresh');
    }

    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#callhistorylist_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#callhistorylist_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_CALLHISTORYLIST_CLEAR:
                ClearCallhistory();
                break;
            case MENUITEM_CALLHISTORYLIST_SETTINGS:
                webphone_api.common.OpenSettings(true, 10);
                break;
            case MENUITEM_CALLHISTORYLIST_LASTCALLDETAILS:
                webphone_api.common.AlertDialog(webphone_api.stringres.get('menu_lastcalldetails'), webphone_api.getlastcalldetails(), null, null, false);
                break;
            case MENUITEM_CALLHISTORYLIST_FILTER:
                Filter();
                break;
            case MENUITEM_HELP:
                webphone_api.common.HelpWindow('callhistorylist');
                break;
            case MENUITEM_EXIT:
                webphone_api.common.Exit();
                break;

            case MENUITEM_CALLHISTORYLIST_CUSTOM_LINK:
                webphone_api.common.OpenWebURL( webphone_api.common.GetParameter('linkurl'), webphone_api.common.GetParameter('linktext') );
                break;
            case MENUITEM_CALLHISTORYLIST_CUSTOM_LINK2:
                webphone_api.common.OpenWebURL( webphone_api.common.GetParameter('linkurl2'), webphone_api.common.GetParameter('linktext2') );
                break;
            case MENUITEM_CALLHISTORYLIST_CUSTOM_LINK3:
                webphone_api.common.OpenWebURL( webphone_api.common.GetParameter('linkurl3'), webphone_api.common.GetParameter('linktext3') );
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: MenuItemSelected", err); }
}

function Filter()
{
    try{
//showing options dialog
    var allchecked = '';
    var outchecked = '';
    var inchecked = '';
    var missedchecked = '';
    
    if (webphone_api.global.callhistoryfilter === -1) { allchecked = 'checked="checked"'; }
    else if (webphone_api.global.callhistoryfilter === 0) { outchecked = 'checked="checked"'; }
    else if (webphone_api.global.callhistoryfilter === 1) { inchecked = 'checked="checked"'; }
    else if (webphone_api.global.callhistoryfilter === 2) { missedchecked = 'checked="checked"'; }
    
    var radiogroup = '<input name="chfilter_all" id="chfilter_all" value="-1" ' + allchecked + ' type="radio">' +
                '<label for="chfilter_all">' + webphone_api.stringres.get('chfilter_all') + '</label>'
        + '<input name="chfilter_out" id="chfilter_out" value="0" ' + outchecked + ' type="radio">' +
                '<label for="chfilter_out">' + webphone_api.stringres.get('chfilter_out') + '</label>'
        + '<input name="chfilter_in" id="chfilter_in" value="1" ' + inchecked + ' type="radio">' +
                '<label for="chfilter_in">' + webphone_api.stringres.get('chfilter_in') + '</label>'
        + '<input name="chfilter_missed" id="chfilter_missed" value="2" ' + missedchecked + ' type="radio">' +
                '<label for="chfilter_missed">' + webphone_api.stringres.get('chfilter_missed') + '</label>';

    var popupHeight = webphone_api.common.GetDeviceHeight();
    if ( !webphone_api.common.isNull(popupHeight) && webphone_api.common.IsNumber(popupHeight) && popupHeight > 100 )
    {
        popupHeight = Math.floor(popupHeight / 1.2);
    }else
    {
        popupHeight = 300;
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
'<div id="ch_filter" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

'<div data-role="header" data-theme="b">' +
    '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
    '<h1 class="adialog_title">' + webphone_api.stringres.get('menu_filter') + '</h1>' +
'</div>' +
'<div role="main" class="ui-content adialog_content_select" style="max-height: ' + popupHeight + 'px;">' +

//'<form id="settings_select_2">' +
'<fieldset id="ch_filter_select" data-role="controlgroup">' + radiogroup +
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
//--                webphone_api.$('#adialog_positive').off('click');
//--                webphone_api.$('#adialog_negative').off('click');
            popupafterclose();
        }
    });

//-- listen for enter onclick, and click OK button
//-- !!NOT WORKING
//--       webphone_api.$( "#settings_type_2" ).keypress(function( event )
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

    webphone_api.$(":radio").on ("change", function (event)
    {
//--        alert (webphone_api.$(this).attr ("id"));
//--        alert (webphone_api.$(this).attr ("value"));

        ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));
        webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
        
        var valstr = webphone_api.$(this).attr ("value");
        
        if (webphone_api.common.isNull(valstr) || valstr.length < 1 || webphone_api.common.IsNumber(valstr) === false)
        {
            webphone_api.common.PutToDebugLog(2, 'ERROR,_callhistorylist: Filter invalid value: ' + valstr);
            return;
        }
        var val = webphone_api.common.StrToInt(valstr);
        webphone_api.global.callhistoryfilter = val;
        PopulateList();
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: Filter", err); }
}

function ManuallyClosePopup(popupelement) // workaround for IE, sometimes popups are not closed simply by clicking the button, so we close it manually
{
    try{
    if (webphone_api.common.isNull(popupelement)) { return; }
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
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: ManuallyClosePopup", err); }
}

function ClearCallhistory(popupafterclose)
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
'<div id="adialog_clearcallhistory" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('clear_callhistory') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content adialog_alert">' +
        '<span> ' + webphone_api.stringres.get('clear_callhistory_msg') + ' </span>' +
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
    
//-- listen for enter onclick, and click OK button
//-- no need for this, because it reloads the page
//--    webphone_api.$( "#adialog_clearcallhistory" ).keypress(function( event )
//--    {
//--        if ( event.which === 13 )
//--        {
//--            event.preventDefault();
//--            webphone_api.$("#btn_adialog_ok").click();
//--        }else
//--        {
//--            return;
//--        }
//--    });

    
    webphone_api.$('#btn_adialog_ok').on('click', function ()
    {
        webphone_api.global.chlist.splice(0, webphone_api.global.chlist.length);
        webphone_api.global.wasChModified = true;
        webphone_api.common.SaveCallhistoryFile(function (issaved)
        {
            webphone_api.common.PutToDebugLog(4, 'EVENT, _callhistorylist: ClearCallhistory SaveCallhistoryFile: ' + issaved.toString());
            PopulateList();
        });
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: ClearCallhistory", err); }
}

function onStop(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _callhistorylist: onStop");
    webphone_api.global.isCallhistorylistStarted = false;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_callhistorylist: onStop", err); }
}

function onDestroy (event){} // deprecated by onstop


// public members and methods
return {
    onCreate: onCreate,
    onStart: onStart,
    onStop: onStop,
    onDestroy: onDestroy,
    MeasureCallhistorylist: MeasureCallhistorylist
};
})();