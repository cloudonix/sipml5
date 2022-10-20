// Contacts List page
webphone_api._contactslist = (function ()
{
function onCreate (event) // called only once - bind events here
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _contactslist: onCreate");
    
//-- navigation done with js, so target URL will not be displayed in browser statusbar
    webphone_api.$("#nav_ct_dialpad").on("click", function()
    {
        webphone_api.$.mobile.changePage("#page_dialpad", { transition: "none", role: "page", reverse: "true" });
    });
    webphone_api.$("#nav_ct_callhistory").on("click", function()
    {
        webphone_api.$.mobile.changePage("#page_callhistorylist", { transition: "none", role: "page" });
    });
    
    webphone_api.$("#nav_ct_dialpad").attr("title", webphone_api.stringres.get("hint_dialpad"));
    webphone_api.$("#nav_ct_contacts").attr("title", webphone_api.stringres.get("hint_contacts"));
    webphone_api.$("#nav_ct_callhistory").attr("title", webphone_api.stringres.get("hint_callhistory"));
    
    webphone_api.$("#status_contactslist").attr("title", webphone_api.stringres.get("hint_status"));
    webphone_api.$("#curr_user_contactslist").attr("title", webphone_api.stringres.get("hint_curr_user"));
    webphone_api.$("#contactslist_not_btn").on("click", function()
    {
        webphone_api.common.SaveParameter('notification_count2', 0);
        webphone_api.common.ShowNotifications2(); // repopulate notifications (hide red dot number)
    });

    
    webphone_api.$('#contactslist_list').on('click', 'li', function(event)
    {
        OnListItemClick(webphone_api.$(this).attr('id'));
    });
    
    webphone_api.$('#contactslist_list').on('taphold', 'li', function(event)
    {
        OnListItemLongClick(webphone_api.$(this).attr('id'));
    });
    
    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_contactslist')
        {
            MeasureContacslist();
        }
    });
    
    webphone_api.$('#contactslist_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_contactslist_menu").on("click", function() { CreateOptionsMenu('#contactslist_menu_ul'); });
    webphone_api.$("#btn_contactslist_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    
    var advuri = webphone_api.common.GetParameter('advertisement');
    if (!webphone_api.common.isNull(advuri) && advuri.length > 5)
    {
        webphone_api.$('#advert_contactslist_frame').attr('src', advuri);
        webphone_api.$('#advert_contactslist').show();
    }
    
    if (webphone_api.common.GetParameterBool('contacttoggle', false) === true)
    {
        var toggle_layout = document.getElementById('togglecontact_container');
        
        if (!webphone_api.common.isNull(toggle_layout))
        {
            toggle_layout.style.display = 'block';
        }
    }

    webphone_api.$('select#togglecontact').change(function()
    {
        var onlyserver = false;
        var val = webphone_api.$(this).val();
        if (!webphone_api.common.isNull(val) && val == 'on')
        {
            onlyserver = true;
        }
        
        PopulateList(onlyserver);
    });
    
    if (webphone_api.common.UsePresence2() === true)
    {
        webphone_api.$("#contactslist_additional_header_left").on("click", function()
        {
            webphone_api.common.PresenceSelector('contactslist');
        });
        webphone_api.$("#contactslist_additional_header_left").css("cursor", "pointer");
    }
    
    webphone_api.$( "#page_contactslist" ).keydown(function(event)
    {
        try{
        var charCode = (event.keyCode) ? event.keyCode : event.which; // workaround for firefox
        
        if ( charCode === 27) // ESC
        {
            webphone_api.$("#contactslist_list").prev("form").find("input[data-type=search]").val('').trigger("change");
        }
        } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: keydown", err); }

    });

    webphone_api.$( "#page_contactslist" ).keyup(function( event )
    {   
        HandleKeyUp(event);
    });

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: onCreate", err); }
}

function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _contactslist: onStart");
    webphone_api.global.isContactslistStarted = true;

    setTimeout(function() // otherwise keyup will not work, because the element is not focused
    {
        webphone_api.$("#page_contactslist").focus();
    }, 100);
    
    if (webphone_api.common.HideSettings('page_history', '', 'page_history', true))
    {
        webphone_api.$("#li_nav_ct_ch").remove();
        var count = webphone_api.$("#ul_nav_ct").children().length;
        var tabwidth = Math.floor(100 / count);
        
        webphone_api.$('#ul_nav_ct').children('li').each(function ()
        {
            webphone_api.$(this).css('width', tabwidth + '%');
        });
        
        if (count < 2)
        {
            webphone_api.$('#ul_nav_ct').remove();
            MeasureDialPad();
        }
    }
    
//--    webphone_api.$("#phone_number").attr("placeholder", webphone_api.stringres.get("phone_nr"));
    
    if (webphone_api.common.GetParameter('devicetype') !== webphone_api.common.DEVICE_WIN_SOFTPHONE())
    {
        document.getElementById("app_name_contactslist").innerHTML = webphone_api.common.GetBrandName();
    }
    webphone_api.$("#contactslist_list").attr("data-filter-placeholder", webphone_api.stringres.get("ct_search_hint"));

    if (!webphone_api.common.isNull(document.getElementById('ctlist_title')))
    {
        document.getElementById('ctlist_title').innerHTML = webphone_api.stringres.get('ctlist_title');
    }
    webphone_api.$("#ctlist_title").attr("title", webphone_api.stringres.get("hint_page"));
    
    var curruser = webphone_api.common.GetCallerid();
    if (!webphone_api.common.isNull(curruser) && curruser.length > 0) { webphone_api.$('#curr_user_contactslist').html(curruser); }
// set status width so it's uses all space to curr_user
    var statwidth = webphone_api.common.GetDeviceWidth() - webphone_api.$('#curr_user_contactslist').width() - 25;
    if (!webphone_api.common.isNull(statwidth) && webphone_api.common.IsNumber(statwidth))
    {
        webphone_api.$('#status_contactslist').width(statwidth);
    }

    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#page_contactslist'), -30) );
    
    if ((webphone_api.common.GetParameter('header')).length > 2)
    {
        webphone_api.$('#headertext_contactslist').show();
        webphone_api.$('#headertext_contactslist').html(webphone_api.common.GetParameter('header'));
    }else
    {
        webphone_api.$('#headertext_contactslist').hide();
    }
    if ((webphone_api.common.GetParameter('footer')).length > 2)
    {
        webphone_api.$('#footertext_contactslist').show();
        webphone_api.$('#footertext_contactslist').html(webphone_api.common.GetParameter('footer'));
    }else
    {
        webphone_api.$('#footertext_contactslist').hide();
    }
    
    webphone_api.$('#contactslist_notification_list').on('click', '.nt_anchor', function(event)
    {
        webphone_api.$("#contactslist_not").panel( "close" );
        webphone_api.common.NotificationOnClick2(webphone_api.$(this).attr('id'), false);
    });
    webphone_api.$('#contactslist_notification_list').on('click', '.nt_menu', function(event)
    {
        webphone_api.$("#contactslist_not").panel( "close" );
        webphone_api.common.NotificationOnClick2(webphone_api.$(this).attr('id'), true);
    });

    if (webphone_api.common.GetColortheme() === 22)
    {
        webphone_api.$("#nav_ct_dialpad IMG").attr("src", "images/tab_dialpad_grey.png");
        webphone_api.$("#nav_ct_contacts IMG").attr("src", "images/tab_contacts_blue.png");
        webphone_api.$("#nav_ct_callhistory IMG").attr("src", "images/tab_callog_grey.png");
    }
    
//BRANDSTART
    if (webphone_api.common.GetConfigInt('brandid', -1) === 58) //-- enikma
    {
        var logodiv = document.getElementById('app_name_contactslist');
        if (!webphone_api.common.isNull(logodiv))
        {
            var middle = document.getElementById('ctlist_title');
            logodiv.style.display = 'inline';
            if (!webphone_api.common.isNull(middle)) { middle.style.display = 'none'; }
            document.getElementById('contactslist_additional_header_left').style.width = '65%';
            logodiv.innerHTML = '<img src="' + webphone_api.common.GetElementSource() + 'images/logo.png" style="border: 0;">&nbsp;&nbsp;&nbsp;<div class="adhead_custom_brand" style=""><b>eNikMa</b> Unified Comm</div>';
        }
    }
//BRANDEND
    
    webphone_api.common.ShowNotifications2();
// needed for proper display and scrolling of listview
    MeasureContacslist();
    
    // fix for IE 10
    if (webphone_api.common.IsIeVersion(10)) { webphone_api.$("#contactslist_list").children().css('line-height', 'normal'); }
    if (webphone_api.common.IsIeVersion(10)) { webphone_api.$("#contactslist_notification_list").children().css('line-height', 'normal'); }
    webphone_api.$("#contactslist_notification_list").height(webphone_api.common.GetDeviceHeight() - 55);

    LoadContacts();
    
    webphone_api.common.ShowOfferSaveContact();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: onStart", err); }
}

function MeasureContacslist() // resolve window height size change
{
    try{
//--    var pgh = webphone_api.common.GetDeviceHeight() - 1; webphone_api.$('#page_contactslist').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_contactslist').css('min-height', 'auto'); // must be set when softphone is skin in div

// handle notifiaction      additional_header_right
    var notwidth = webphone_api.common.GetDeviceWidth() - webphone_api.$("#contactslist_additional_header_left").width() - webphone_api.$("#contactslist_additional_header_right").width();
    var margin = webphone_api.common.StrToIntPx( webphone_api.$("#contactslist_additional_header_left").css("margin-left") );
    
    if (webphone_api.common.isNull(margin) || margin === 0) { margin = 10; }
    margin = Math.ceil( margin * 6 );
    notwidth = Math.floor(notwidth - margin) - 20;

    webphone_api.$("#contactslist_notification").width(notwidth);
    webphone_api.$("#contactslist_notification").height( Math.floor( webphone_api.$("#contactslist_additional_header_left").height() ) );
    
// handle page height
    var heightTemp = webphone_api.common.GetDeviceHeight() - webphone_api.$("#contactslist_header").height()/* - webphone_api.$("form.ui-filterable").height()*/ - webphone_api.common.StrToIntPx(webphone_api.$(".ui-input-search").css("border-top-width")) - webphone_api.common.StrToIntPx(webphone_api.$(".ui-input-search").css("border-bottom-width"));
        
//-- not working concictently, many times height is 0

//--    webphone_api.common.PutToDebugLog(2, 'webphone_api.$(".ui-input-search").height(): ' + webphone_api.$(".ui-input-search").height());
//--    webphone_api.common.PutToDebugLog(2, 'webphone_api.$(".ui-listview-filter").height(): ' + webphone_api.$(".ui-listview-filter").height());
    
    heightTemp = heightTemp - 35;
    
    var searchmargin = webphone_api.common.StrToIntPx( webphone_api.$(".ui-input-search").css("margin-top") );
    heightTemp = heightTemp - searchmargin - searchmargin;
    heightTemp = heightTemp - 3;
    
    if (webphone_api.$('#footertext_contactslist').is(':visible')) { heightTemp = heightTemp - webphone_api.$("#footertext_contactslist").height(); }
    
    if (webphone_api.$('#advert_contactslist').is(':visible')) { heightTemp = heightTemp - webphone_api.$("#advert_contactslist").height(); }
    
    if (webphone_api.$('#togglecontact_container').is(':visible')) { heightTemp = heightTemp - webphone_api.$("#togglecontact_container").height(); }
    
    webphone_api.$("#contactslist_list").height(heightTemp);
    
    
//--    var brandW = Math.floor(webphone_api.common.GetDeviceWidth() / 4.6);
//--    webphone_api.$("#app_name_contactslist").width(brandW);
    
    // if brandname does not fit, then hide brandname
    if (webphone_api.global.bname_charcount > 0 && webphone_api.common.GetBrandName().length > webphone_api.global.bname_charcount)
    {
        webphone_api.$('#app_name_contactslist').html('');
        webphone_api.$('#contactslist_additional_header_left').width('35%');
    }
    var brandW = webphone_api.$("#contactslist_additional_header_left").width() - 5;
    if (webphone_api.$('#contactslist_presence').is(':visible')) { brandW = brandW - webphone_api.$("#contactslist_presence").width(); }
    webphone_api.$("#app_name_contactslist").width(brandW);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: MeasureContacslist", err); }
}

function LoadContacts()
{
    try{
    if (webphone_api.global.isdebugversion)
    {
//--        if ( webphone_api.common.isNull(webphone_api.global.ctlist) || webphone_api.global.ctlist.length < 1 )
//--        {
//--             var ctitem = ['Ambrus Akos', ['4444', '0268123456', '13245679'], ['home', 'work', 'other'], '0', '13464346', '0', '0', '', '', '', '', '0'];

//--            var ctitem2 = ['Ambrus Tunde', ['9999', '987654'], ['other', 'fax_home'], '0', '23464346', '0', '0', '', '', '', '', '0'];
//--            var ctitem3 = ['Mariska Mari', ['123456', '4444'], ['other', 'fax_home'], '0', '23464346', '0', '0', '', '', '', '', '0'];
            
//--            webphone_api.global.ctlist.push(ctitem); webphone_api.global.ctlist.push(ctitem2); webphone_api.global.ctlist.push(ctitem3);
            
//--            for (var i = 0; i < 5; i++)
//--            {
//--                var ctitem_generated = ['Test_' + i, ['123456_' + i, '987654_' + i], ['other', 'fax_home'], '0', '23464346', '0', '0'];
//--                webphone_api.global.ctlist.push(ctitem_generated);
//--            }
//--        }

    }
    
    if (webphone_api.common.isNull(webphone_api.global.ctlist) || webphone_api.global.ctlist.length < 1)
    {
    // add special contacts
        if (webphone_api.common.IsMizuServer())
        {
            var ctitem = null;
            ctitem = ['Echo delayed', ['5004', 'echod'], ['phone', 'sip'], '0', '0', '0', '0'];     webphone_api.global.ctlist.push(ctitem);
            ctitem = ['Echo', ['5005', 'echo'], ['phone', 'sip'], '0', '0', '0', '0'];     webphone_api.global.ctlist.push(ctitem);
            ctitem = ['Funny', ['5003', 'funny'], ['phone', 'sip'], '0', '0', '0', '0'];     webphone_api.global.ctlist.push(ctitem);
            ctitem = ['Music', ['5002', 'music'], ['phone', 'sip'], '0', '0', '0', '0'];     webphone_api.global.ctlist.push(ctitem);
            ctitem = ['Playback', ['5011', 'playback'], ['phone', 'sip'], '0', '0', '0', '0'];     webphone_api.global.ctlist.push(ctitem);
            ctitem = ['Record', ['5010', 'record'], ['phone', 'sip'], '0', '0', '0', '0'];     webphone_api.global.ctlist.push(ctitem);
            ctitem = ['Redial', ['5901', 'redial'], ['phone', 'sip'], '0', '0', '0', '0'];     webphone_api.global.ctlist.push(ctitem);
            
            ctitem = ['Voicemail', ['5001', 'voicemail'], ['phone', 'sip'], '0', '0', '0', '0'];     webphone_api.global.ctlist.push(ctitem);
        }else
        {
            ctitem = ['Voicemail', [], [], '0', '0', '0', '0'];     webphone_api.global.ctlist.push(ctitem);
        }
        
        AddDefContacts();
        
        webphone_api.common.GetContacts(function (success)
        {
            if (!success)
            {
                webphone_api.common.PutToDebugLog(2, 'ERROR, _contactslist: LoadContacts failed');
            }

            PopulateList(false);
        });
    }else
    {
        PopulateList(false);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: LoadContacts", err); }
}

function AddDefContacts() // add custom(def) contacts to contactslist and reload contacts list
{
    try{
// add default contacts if defined (customization)
    // set one or more default contacts. Name and number separated by comma and contacts separated by semicolon:
            // example: defcontacts: 'John Doe,12121;Jill Doe,231231'
    var ctitem = null;
    var defct = webphone_api.common.GetConfig('defcontacts');
    if (!webphone_api.common.isNull(webphone_api.parameters['defcontacts'])) { defct = webphone_api.parameters['defcontacts']; }
    if (!webphone_api.common.isNull(defct) && defct.length > 2)
    {
        var darr = defct.split(';');
        if (!webphone_api.common.isNull(darr))
        {
            for (var i = 0; i < darr.length; i++)
            {
                if (webphone_api.common.isNull(darr[i]) || darr[i].length < 3 || darr[i].indexOf(',') < 1) { continue; }

                var onect = darr[i].split(',');
                if (webphone_api.common.isNull(onect) || onect.length < 2) { continue; }

                var number = onect[0];
                var fullname = onect[1];
                var email = '';  if (onect.length > 2) { email = onect[2]; }
                var address = '';  if (onect.length > 3) { address = onect[3]; }
                var notes = '';  if (onect.length > 4) { notes = onect[4]; }
                var website = '';  if (onect.length > 5) { website = onect[5]; }

                if (webphone_api.common.isNull(number) || webphone_api.common.Trim(number).length < 1)
                {
                    webphone_api.common.PutToDebugLog(3, 'ERROR, plhandler AddContact invalid number: ' + number);
                    return false;
                }
                number = webphone_api.common.Trim(number);
                if (webphone_api.common.isNull(fullname)) { fullname = ''; }
                fullname = webphone_api.common.Trim(fullname);
                
                number = webphone_api.common.NormalizeInput2(number, 3);
        
                var norm = webphone_api.common.GetParameterInt('normalize_contact', 1);
        
                if (norm > 0) { fullname = webphone_api.common.NormalizeInput2(fullname, 2); }
        
                if (webphone_api.common.isNull(email)) { email = ''; }
                if (norm > 0) { email = webphone_api.common.NormalizeInput2(email, 3); email = webphone_api.common.Trim(email); }
        
                if (webphone_api.common.isNull(address)) { address = ''; }
                if (norm > 0) { address = webphone_api.common.NormalizeInput2(address, 3); address = webphone_api.common.Trim(address); }
        
                if (webphone_api.common.isNull(notes)) { notes = ''; }
                if (norm > 0) { notes = webphone_api.common.NormalizeInput2(notes, 3); notes = webphone_api.common.Trim(notes); }
        
                if (webphone_api.common.isNull(website)) { website = ''; }
                if (norm > 0) { website = webphone_api.common.NormalizeInput2(website, 2); website = webphone_api.common.Trim(website); }
                
                var type = 'sip';   if (webphone_api.common.IsNumber(number)) { type = 'phone'; }
        
                var isfromsync = '0';
                webphone_api.common.PutToDebugLog(2, 'EVENT, AddContact name: ' + fullname + '; number: ' + number + '; email: ' + email + '; address: ' + address + '; notes: ' + notes + '; website: ' + website + '; isfromsync: ' + isfromsync);
                
                webphone_api.plhandler.SaveTheContact(fullname, number, '0', type, webphone_api.common.GetTickCount(), email, address, notes, website, isfromsync);

                /*
                var name = webphone_api.common.Trim(darr[i].substring(0, darr[i].indexOf(',')));
                var nr = webphone_api.common.Trim(darr[i].substring(darr[i].indexOf(',') + 1));
                if (webphone_api.common.isNull(nr)) { nr = ''; }
                nr = webphone_api.common.ReplaceAll(nr, ',', '');
                nr = webphone_api.common.Trim(nr);

                var type = 'sip';
                if (webphone_api.common.IsNumber(nr)) { type = 'phone'; }

                ctitem = [name, [nr], [type], '0', '0', '0', '0'];
                webphone_api.global.ctlist.push(ctitem);*/
            }
        }
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: AddDefContacts", err); }
}

var ctlistLocal = []; // will display only contacts from this array
function PopulateList(onlyserver) // :no return value;  // onlyonserver: display only contacts on server. Controlled by toggle button
{
    try{
    if ( webphone_api.common.isNull(document.getElementById('contactslist_list')) )
    {
        webphone_api.common.PutToDebugLog(2, "ERROR, _contactslist: PopulateList listelement is null");
        return;
    }
    
    if ( webphone_api.common.isNull(webphone_api.global.ctlist) || webphone_api.global.ctlist.length < 1 )
    {
        var htmlcontent = '<span style="text-shadow:0 0 0;">' + webphone_api.stringres.get('no_contacts_1') + '</span>';
        
        // display sync contacts button
        if (webphone_api.common.GetParameterInt('showsynccontactsmenu', 0) === 0)
        {
            htmlcontent = htmlcontent + '<br /><br /><br />' + '<span style="text-shadow:0 0 0;">' + webphone_api.stringres.get('no_contacts_2') + '</span>';
            
            /*htmlcontent = htmlcontent + '<br /><br /><br />' +
                '<span style="text-shadow:0 0 0;">' + webphone_api.stringres.get('sync_msg') + '</span><br />' +
                '<button id="sync_contacts" class="ui-btn noshadow ui-btn-inline ui-corner-all">' + webphone_api.stringres.get('menu_sync') + '</button>';*/
        }
        
        webphone_api.$('#contactslist_list').html( htmlcontent );
        

        webphone_api.$("#sync_contacts").on("click", function()
        {
            webphone_api.common.DownloadContacts();
        });
        
        webphone_api.common.PutToDebugLog(2, "EVENT, _contactslist: PopulateList no contacts");
        return;
    }
    
    webphone_api.common.PutToDebugLog(2, 'EVENT, _contactslist Starting populate list');
    
    ctlistLocal = [];
    
// onlyonserver: display only contacts on server. Controlled by toggle button
    if (onlyserver)
    {
        var servercontacts = webphone_api.common.GetParameter("servercontacts");

        if (webphone_api.common.isNull(servercontacts) || servercontacts.length < 1)
        {
            return;
        }

// remove any item from ctlistLocal, which number is not in serverctL
//--var ctitem = ['Ambrus Akos', ['445566', '0268123456', '13245679'], ['home', 'work', 'other'], '0', '13464346', '0', '0'];
        var serverctL = servercontacts.split(",");

        var ctidx = 0;
        if (webphone_api.common.isNull(serverctL) || serverctL.length < 1)
        {
            ctlistLocal = [];
        }else
        {
            for (var i = 0; i < webphone_api.global.ctlist.length; i++)
            {
                var item = webphone_api.global.ctlist[i];
                if ( webphone_api.common.isNull(item) || item.length < 1 ) { continue; }

                var nrtmp = item[webphone_api.common.CT_NUMBER]; // ['22334455', '0268123456', '13245679']
                var typetmp = item[webphone_api.common.CT_PTYPE]; // ['home', 'work', 'other']
                
                if (webphone_api.common.isNull(nrtmp) || nrtmp.length < 1) { continue; }
                
                var nrnew = [];
                var typenew = [];
                var idx = 0;
                for (var j = 0; j < nrtmp.length; j++)
                {
                    if (serverctL.indexOf(nrtmp[j]) >= 0)
                    {
                        nrnew[idx] = nrtmp[j];
                        typenew[idx] = typetmp[j];
                        idx++;
                    }
                }
                
                if (nrnew.length > 0)
                {
                    item[webphone_api.common.CT_NUMBER] = nrnew.slice();
                    item[webphone_api.common.CT_PTYPE] = typenew.slice();
                    
                    ctlistLocal[ctidx] = item.slice();
                    ctidx++;
                }
            }
        }
    }else // display all contacts, not only server contacts
    {
        // copy array
        ctlistLocal = webphone_api.global.ctlist.slice();
    }
    
    
//--    var template = '<li id="contact_[ID]"><a href="javascript:void(0)" data-transition="slide">[NAME]</a></li>';
    var template = '<li id="contact_[ID]"><a data-transition="slide" class="mlistitem">[NAME]</a></li>';
    var listview = '';
    
    for (var i = 0; i < ctlistLocal.length; i++)
    {
        var item = ctlistLocal[i];
        if ( webphone_api.common.isNull(item) || item.length < 1 ) { continue; }
        
        var ctname = item[webphone_api.common.CT_NAME];
        
        if ( webphone_api.common.isNull(ctname) || ctname.length < 1 )
        {
            var nrlist = item[webphone_api.common.CT_NUMBER];
            
            if ( webphone_api.common.isNull(nrlist) || nrlist.length < 1 || webphone_api.common.isNull(nrlist[0]) || nrlist[0].length < 1 )
            {
                continue;
            }
            
            ctname = nrlist[0];
        }
        
        var lisitem = template.replace('[ID]', i.toString());
        lisitem = lisitem.replace('[NAME]', ctname);
        
        listview = listview + lisitem;
        
//--        webphone_api.common.PutToDebugLog(2, item[0] + ' - ' + item[1] + ' - ' + item[2] + ' - ' + item[3] + ' - ' + item[4] + ' - ' + item[5] + ' - ' + item[6]);
    }
    
    webphone_api.$('#contactslist_list').html('');
    webphone_api.$('#contactslist_list').append(listview).listview('refresh');
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: PopulateList", err); }
}

function OnListItemClick (id) // :no return value
{
    try{
        
    if (webphone_api.common.isNull(id) || id.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _contactslist OnListItemClick id is NULL');
        return;
    }
    
    var ctid = '';
    var pos = id.indexOf('_');
    if (pos < 2)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _contactslist OnListItemClick invalid id');
        return;
    }
    
    ctid = webphone_api.common.Trim(id.substring(pos + 1));
    
// handle voicemail separatelly
//-- voicemail - ha nincs szam, akkor bekerem pont, mind eddig (nem kell tobbet a menu-be)
    var name = ctlistLocal[ctid][webphone_api.common.CT_NAME];
    if (name.toLowerCase() === 'voicemail')
    {
        var nrlist = ctlistLocal[ctid][webphone_api.common.CT_NUMBER];
        if (webphone_api.common.isNull(nrlist) || nrlist.length < 1)
        {
            webphone_api.common.SetVoiceMailNumber(function (vmnr)
            {
                if (!webphone_api.common.isNull(vmnr) && vmnr.length > 0)
                {
                // first delete old Voicemail contact entry
                    for (var i = 0; i < webphone_api.global.ctlist.length; i++)
                    {
                        if (webphone_api.global.ctlist[i][webphone_api.common.CT_NAME] === 'Voicemail')
                        {
                            webphone_api.global.ctlist.splice(i, 1);
                            break;
                        }
                    }
                    
                // then add the new entry with contact number
                    var ctTemp = [];
                    ctTemp[webphone_api.common.CT_NAME] = ctlistLocal[ctid][webphone_api.common.CT_NAME];
                    ctTemp[webphone_api.common.CT_NUMBER] = [vmnr];
                    ctTemp[webphone_api.common.CT_PTYPE] = ctlistLocal[ctid][webphone_api.common.CT_PTYPE];
                    ctTemp[webphone_api.common.CT_USAGE] = ctlistLocal[ctid][webphone_api.common.CT_USAGE];
                    ctTemp[webphone_api.common.CT_LASTMODIF] = ctlistLocal[ctid][webphone_api.common.CT_LASTMODIF];
                    ctTemp[webphone_api.common.CT_DELFLAG] = ctlistLocal[ctid][webphone_api.common.CT_DELFLAG];
                    ctTemp[webphone_api.common.CT_FAV] = ctlistLocal[ctid][webphone_api.common.CT_FAV];
                    ctTemp[webphone_api.common.CT_EMAIL] = ctlistLocal[ctid][webphone_api.common.CT_EMAIL];
                    ctTemp[webphone_api.common.CT_ADDRESS] = ctlistLocal[ctid][webphone_api.common.CT_ADDRESS];
                    ctTemp[webphone_api.common.CT_NOTES] = ctlistLocal[ctid][webphone_api.common.CT_NOTES];
                    ctTemp[webphone_api.common.CT_WEBSITE] = ctlistLocal[ctid][webphone_api.common.CT_WEBSITE];
                    ctTemp[webphone_api.common.CT_LASTACTIVE] = ctlistLocal[ctid][webphone_api.common.CT_LASTACTIVE];
                    ctTemp[webphone_api.common.CT_ISFROMSYNC] = '0';

                    webphone_api.global.ctlist.push(ctTemp);
                    webphone_api.global.wasCtModified = true;
                    
                    PopulateList(false);
                }
            });
            return;
        }
    }
    
    webphone_api.global.intentctdetails[0] = 'ctid=' + ctid;
    webphone_api.global.intentctdetails[1] = 'frompage=ctlist';
    webphone_api.$.mobile.changePage("#page_contactdetails", { transition: "none", role: "page" });    
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: OnListItemClick", err); }
}

function OnListItemLongClick (id) // :no return value
{
    try{
        
    if (webphone_api.common.isNull(id) || id.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _contactslist OnListItemLongClick id is NULL');
        return;
    }
    
    var ctid = '';
    var pos = id.indexOf('_');
    if (pos < 2)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _contactslist OnListItemLongClick invalid id 1');
        return;
    }
    
    ctid = webphone_api.common.Trim(id.substring(pos + 1));
    if (webphone_api.common.isNull(ctid) || ctid.length < 1 || !webphone_api.common.IsNumber(ctid))
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _contactslist OnListItemLongClick invalid id 2: ' + ctid);
        return;
    }
    
//--     the ctid is from ctlistLocal, so we have to find the id from webphone_api.global.ctlist
    var globalid = '';
    var name = ctlistLocal[ctid][webphone_api.common.CT_NAME];
    for (var i = 0; i < webphone_api.global.ctlist.length; i++)
    {
        if (webphone_api.global.ctlist[i][webphone_api.common.CT_NAME] === name)
        {
            globalid = i.toString();
            break;
        }
    }
    
    CreateContextmenu(globalid);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: OnListItemLongClick", err); }
}

function CreateContextmenu(ctid, popupafterclose)
{
    try{
    var ctentry = ctlistLocal[ctid];
    if (webphone_api.common.isNull(ctid) || ctid.length < 1 || !webphone_api.common.IsNumber(ctid))
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _contactslist: CreateContextmenu invalid contact id: ' + ctid);
    }

    var popupWidth = webphone_api.common.GetDeviceWidth();
    if ( !webphone_api.common.isNull(popupWidth) && webphone_api.common.IsNumber(popupWidth) && popupWidth > 100 )
    {
        popupWidth = Math.floor(popupWidth / 1.2);
    }else
    {
        popupWidth = 220;
    }
    
    var isfavorite = webphone_api.common.ContactIsFavorite(ctid);
    
    var list = '';
    var item = '<li id="[ITEMID]"><a data-rel="back">[ITEMTITLE]</a></li>';
    
    var itemTemp = '';
    
    itemTemp = item.replace('[ITEMID]', '#ct_item_edit_contact');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_editcontact'));
    list = list + itemTemp;
    itemTemp = '';
    
    itemTemp = item.replace('[ITEMID]', '#ct_item_delete_contact');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_deletecontact'));
    list = list + itemTemp;
    itemTemp = '';

// --------------------------

    itemTemp = item.replace('[ITEMID]', '#ct_item_call');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_call'));
    list = list + itemTemp;
    itemTemp = '';

    if (webphone_api.common.CanIUseVideo() === true)
    {
        itemTemp = item.replace('[ITEMID]', '#ct_item_video_call');
        itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('btn_videocall'));
        list = list + itemTemp;
        itemTemp = '';
    }

    itemTemp = item.replace('[ITEMID]', '#ct_item_message');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('send_msg'));
    list = list + itemTemp;
    itemTemp = '';
    
    if (webphone_api.common.GetConfigBool('hasfiletransfer', true) !== false && (webphone_api.common.GetConfigBool('usingmizuserver', false) === true || webphone_api.common.IsMizuPublicWebRTCGateway() === true))
    {
//OPSSTART
        if (webphone_api.common.Glft() === true)
        {
//OPSEND
            itemTemp = item.replace('[ITEMID]', '#ct_item_filetransf');
            itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('filetransf_title'));
            list = list + itemTemp;
            itemTemp = '';
//OPSSTART
        }
//OPSEND
    }
    
    var favtitle = webphone_api.stringres.get('menu_ct_setfavorite');
    if (isfavorite === true) { favtitle = webphone_api.stringres.get('menu_ct_unsetfavorite'); }
    itemTemp = item.replace('[ITEMID]', '#ct_item_favorite');
    itemTemp = itemTemp.replace('[ITEMTITLE]', favtitle);
    list = list + itemTemp;
    itemTemp = '';

    
    var template = '' +
'<div id="ct_contextmenu" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + ctentry[webphone_api.common.CT_NAME] + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content" style="padding: 0; margin: 0;">' +
    
        '<ul id="ct_contextmenu_ul" data-role="listview" data-inset="true" data-icon="false" style="margin: 0;">' +
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
            
            webphone_api.$('#ct_contextmenu_ul').off('click', 'li');
            
            popupafterclose();
        }
    });
    
   
        
    webphone_api.$('#ct_contextmenu_ul').on('click', 'li', function(event)
    {
        var itemid = webphone_api.$(this).attr('id');

        webphone_api.$( '#ct_contextmenu' ).on( 'popupafterclose', function( event )
        {
            webphone_api.$( '#ct_contextmenu' ).off( 'popupafterclose' );

            if (itemid === '#ct_item_edit_contact')
            {        
                EditContact(ctid);
            }
            else if (itemid === '#ct_item_delete_contact')
            {
                DeleteContact(ctid);
            }
            else if (itemid === '#ct_item_call')
            {
                InitiateCall(ctid, false);
            }
            else if (itemid === '#ct_item_video_call')
            {
                InitiateCall(ctid, true);
            }
            else if (itemid === '#ct_item_message')
            {
                SendMessage(ctid);
            }
            else if (itemid === '#ct_item_filetransf')
            {
                FileTrasnf(ctid);
            }
            else if (itemid === '#ct_item_favorite')
            {
                if (isfavorite === true)
                {
                    webphone_api.common.ContactSetFavorite(ctid, false);
                    webphone_api.common.ShowToast(webphone_api.stringres.get('ct_unsetfavorited'), 1400);
                }else
                {
                    webphone_api.common.ContactSetFavorite(ctid, true);
                    webphone_api.common.ShowToast(webphone_api.stringres.get('menu_ct_setfavorite'), 1400);
                }
            }
        });
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: CreateContextmenu", err); }
}

function FileTrasnf(ctidstr) // opens page message with the contact's number
{
    try{
    webphone_api.common.PutToDebugLog(2, 'EVENT, _contactslist: FileTrasnf contact id: ' + ctidstr);
    var ctid = webphone_api.common.StrToInt(ctidstr);
    var contact = webphone_api.global.ctlist[ctid];
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
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: FileTrasnf", err); }
}

function InitiateCall(ctidstr, isvideo) // opens page message with the contact's number
{
    try{
    webphone_api.common.PutToDebugLog(2, 'EVENT, _contactslist: InitiateCall contact id: ' + ctidstr);
    var ctid = webphone_api.common.StrToInt(ctidstr);
    var contact = webphone_api.global.ctlist[ctid];
    var numbers = contact[webphone_api.common.CT_NUMBER];
    
    if (webphone_api.common.isNull(numbers) || numbers.length < 1)
    {
        webphone_api.common.PutToDebugLog(1, 'ERROR,' + webphone_api.stringres.get('ct_menu_error'));
        webphone_api.common.ShowToast('ERROR,' + webphone_api.stringres.get('ct_menu_error'));
        return;
    }
    
    if (numbers.length === 1)
    {
        var number = webphone_api.common.NormalizeNumber(numbers[0]);
        if (isvideo === true)
        {
            webphone_api.common.PutToDebugLog(4, 'EVENT, _contactslist initiate video call to: ' + number);
            webphone_api.videocall(number);
        }else
        {
            webphone_api.common.PutToDebugLog(4, 'EVENT, _contactslist initiate call to: ' + number);
            webphone_api.call(number, -1);
        }
        return;
    }else
    {
        webphone_api.common.PickContactNumber(ctid, function(pick_nr, pick_name)
        {
            var number = webphone_api.common.NormalizeNumber(pick_nr);
            if (isvideo === true)
            {
                webphone_api.common.PutToDebugLog(4, 'EVENT, _contactslist initiate video call to: ' + number);
                webphone_api.videocall(number);
            }else
            {
                webphone_api.common.PutToDebugLog(4, 'EVENT, _contactslist initiate call to: ' + number);
                webphone_api.call(number, -1);
            }
        });
        return;
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: InitiateCall", err); }
}

function SendMessage(ctidstr) // opens page message with the contact's number
{
    try{
    webphone_api.common.PutToDebugLog(2, 'EVENT, _contactslist: SendMessage contact id: ' + ctidstr);
    var ctid = webphone_api.common.StrToInt(ctidstr);
    var contact = webphone_api.global.ctlist[ctid];
    var numbers = contact[webphone_api.common.CT_NUMBER];
    
    if (webphone_api.common.isNull(numbers) || numbers.length < 1)
    {
        webphone_api.common.PutToDebugLog(1, 'ERROR,' + webphone_api.stringres.get('ct_menu_error'));
        webphone_api.common.ShowToast('ERROR,' + webphone_api.stringres.get('ct_menu_error'));
        return;
    }
    
// if we have only one number, then open message container, else popup fo user to choose
    if (numbers.length === 1)
    {
        webphone_api.common.StartMsg(numbers[0], '', '_contactslist');
        return;
    }else
    {
        webphone_api.common.PickContactNumber(ctid, function(pick_nr, pick_name)
        {
            webphone_api.common.StartMsg(pick_nr, '', '_contactslist');
        });
        return;
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: SendMessage", err); }
}

function DeleteContact(ctid, popupafterclose)
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
'<div id="ct_delete_contact_popup" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

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
        webphone_api.global.ctlist.splice(ctid, 1);
        webphone_api.common.SaveContactsFile(function (issaved) { webphone_api.common.PutToDebugLog(4, 'EVENT, _contactslist: DeleteContact SaveContactsFile: ' + issaved.toString()); });

        PopulateList(false);
    });
    
//--    webphone_api.global.ctlist.splice(ctid, 1);
//--    webphone_api.common.SaveContactsFile(function (issaved) { webphone_api.common.PutToDebugLog(4, 'EVENT, _contactdetails: DeleteContact SaveContactsFile: ' + issaved.toString()); });
    
//--    webphone_api.$.mobile.back();
        
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactdetails: DeleteContact", err); }
}

function EditContact(ctid) // open AddEditContact activity
{
    try{
    webphone_api.global.intentaddeditct[0] = 'action=edit';
    webphone_api.global.intentaddeditct[1] = 'ctid=' + ctid;

    webphone_api.$.mobile.changePage("#page_addeditcontact", { transition: "pop", role: "page" });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: EditContact", err); }
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
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: HandleKeyUp", err); }
}

var MENUITEM_CONTACTSLIST_SETTINGS = '#menuitem_contactslist_settings';
var MENUITEM_HELP = '#menuitem_contactslist_help';
var MENUITEM_CONTACTSLIST_NEWCT = '#menuitem_contactslist_newcontact';
var MENUITEM_EXIT = '#menuitem_contactslist_exit';
var MENUITEM_SYNC = '#menuitem_contactslist_sync';
var MENUITEM_FILETRANSFER = '#menuitem_contactslist_filetransfer';
var MENUITEM_SORTCONTACTS = '#menuitem_contactslist_sortcontacts';
var MENUITEM_FILTERCONTACTS = '#menuitem_contactslist_filtercontacts';
var MENUITEM_DELETEALLCONTACTS = '#menuitem_contactslist_deleteallct';

var MENUITEM_CONTACTS_CUSTOM_LINK = 'menuitem_contactslist_custom_link';
var MENUITEM_CONTACTS_CUSTOM_LINK2 = 'menuitem_contactslist_custom_link2';
var MENUITEM_CONTACTS_CUSTOM_LINK3 = 'menuitem_contactslist_custom_link3';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$( "#btn_contactslist_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _contactslist: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _contactslist: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    var featureset = webphone_api.common.GetParameterInt('featureset', 10);

    webphone_api.$(menuId).append( '<li id="' + MENUITEM_CONTACTSLIST_NEWCT + '"><a data-rel="back">' + webphone_api.stringres.get('menu_new_contact') + '</a></li>' ).listview('refresh');
    
    if (webphone_api.common.IsWindowsSoftphone() === true)
    {
        if (featureset > 0)
        {
        // opens import dialog with more options
            webphone_api.$(menuId).append( '<li id="' + MENUITEM_SYNC + '"><a data-rel="back">' + webphone_api.stringres.get('menu_import_list') + '...</a></li>' ).listview('refresh');
        }
    }else
    {
        if (featureset > 0 && (webphone_api.common.GetParameterInt('showsynccontactsmenu', 0) === 0 || webphone_api.common.GetParameterInt('showsynccontactsmenu', 0) === 1))
        {
            webphone_api.$(menuId).append( '<li id="' + MENUITEM_SYNC + '"><a data-rel="back">' + webphone_api.stringres.get('menu_sync') + '</a></li>' ).listview('refresh');
        }
    }
    
    if (featureset > 0 && (webphone_api.common.GetParameterInt('showsynccontactsmenu', 0) === 0 || webphone_api.common.GetParameterInt('showsynccontactsmenu', 0) === 1))
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_SORTCONTACTS + '"><a data-rel="back">' + webphone_api.stringres.get('menu_sortct') + '</a></li>' ).listview('refresh');

//--        webphone_api.$(menuId).append( '<li id="' + MENUITEM_FILTERCONTACTS + '"><a data-rel="back">' + webphone_api.stringres.get('menu_filterct') + '</a></li>' ).listview('refresh');
    }
    
    if (webphone_api.common.GetConfigBool('hasfiletransfer', true) !== false && (webphone_api.common.GetConfigBool('usingmizuserver', false) === true || webphone_api.common.IsMizuPublicWebRTCGateway() === true))
    {
//OPSSTART
        if (webphone_api.common.Glft() === true)
//OPSEND
            webphone_api.$(menuId).append( '<li id="' + MENUITEM_FILETRANSFER + '"><a data-rel="back">' + webphone_api.stringres.get('filetransf_title') + '</a></li>' ).listview('refresh');
    }

    webphone_api.$(menuId).append( '<li id="' + MENUITEM_DELETEALLCONTACTS + '"><a data-rel="back">' + webphone_api.stringres.get('menu_delallct') + '</a></li>' ).listview('refresh');
    
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_CONTACTSLIST_SETTINGS + '"><a data-rel="back">' + webphone_api.stringres.get('settings_title') + '</a></li>' ).listview('refresh');
    
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
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CONTACTS_CUSTOM_LINK + '"><a data-rel="back">' + linktext + '</a></li>' ).listview('refresh');
    }
    if (!webphone_api.common.isNull(linktext2) && linktext2.length > 0 && !webphone_api.common.isNull(linkurl2) && linkurl2.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CONTACTS_CUSTOM_LINK2 + '"><a data-rel="back">' + linktext2 + '</a></li>' ).listview('refresh');
    }
    if (!webphone_api.common.isNull(linktext3) && linktext3.length > 0 && !webphone_api.common.isNull(linkurl3) && linkurl3.length > 0)
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_CONTACTS_CUSTOM_LINK3 + '"><a data-rel="back">' + linktext3 + '</a></li>' ).listview('refresh');
    }
    
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$(menuId).append( '<li id="' + MENUITEM_EXIT + '"><a data-rel="back">' + webphone_api.stringres.get('menu_exit') + '</a></li>' ).listview('refresh');
    }

    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#contactslist_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#contactslist_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_CONTACTSLIST_NEWCT:
                NewContact();
                break;
            case MENUITEM_CONTACTSLIST_SETTINGS:
                webphone_api.common.OpenSettings(true, 11);
                break;
            case MENUITEM_FILETRANSFER:
                webphone_api.common.FileTransfer('');
                break;
            case MENUITEM_DELETEALLCONTACTS:
                DeleteAllContacts();
                break;
            case MENUITEM_HELP:
                setTimeout( function () { webphone_api.common.HelpWindow('settings'); }, 300);
                break;
            case MENUITEM_EXIT:
                webphone_api.common.Exit();
                break;
            case MENUITEM_SYNC:
                if (webphone_api.common.IsWindowsSoftphone() === true)
                {
                    ImportContactsPopup();
                }else
                {   
                    webphone_api.common.DownloadContacts();
                }
                break;
            case MENUITEM_SORTCONTACTS:
                SortContactsPopup();
                break;
            case MENUITEM_FILTERCONTACTS:
                FilterContactsByPopup();
                break;

            case MENUITEM_CONTACTS_CUSTOM_LINK:
                webphone_api.common.OpenWebURL( webphone_api.common.GetParameter('linkurl'), webphone_api.common.GetParameter('linktext') );
                break;
            case MENUITEM_CONTACTS_CUSTOM_LINK2:
                webphone_api.common.OpenWebURL( webphone_api.common.GetParameter('linkurl2'), webphone_api.common.GetParameter('linktext2') );
                break;
            case MENUITEM_CONTACTS_CUSTOM_LINK3:
                webphone_api.common.OpenWebURL( webphone_api.common.GetParameter('linkurl3'), webphone_api.common.GetParameter('linktext3') );
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: MenuItemSelected", err); }
}

function DeleteAllContacts(popupafterclose)
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
    '<div id="delete_allcontacts_popup" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

        '<div data-role="header" data-theme="b">' +
            '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
            '<h1 class="adialog_title">' + webphone_api.stringres.get('menu_deletecontact') + '</h1>' +
        '</div>' +
        '<div role="main" class="ui-content adialog_content adialog_alert">' +
            '<span> ' + webphone_api.stringres.get('contact_delete_all_msg') + ' </span>' +
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
            webphone_api.common.PutToDebugLog(2, 'EVENT, _contactslist: DeleteAllContacts OK clicked');

            webphone_api.global.ctlist = null;
            webphone_api.global.ctlist = [];
            webphone_api.common.SaveContactsFile(function (issaved) { webphone_api.common.PutToDebugLog(4, 'EVENT, _contactslist: DeleteAllContacts SaveContactsFile: ' + issaved.toString()); });

            PopulateList(false);
        });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: DeleteAllContacts", err); }
}

function FilterContactsByPopup(popupafterclose)
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
        var item = '<li id="[ITEMID]"><a data-rel="back">[ITEMTITLE]</a></li>';

        var itemTemp = '';

        itemTemp = item.replace('[ITEMID]', '#item_filter_all');
        itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('ct_filter_all'));
        list = list + itemTemp;
        itemTemp = '';

        itemTemp = item.replace('[ITEMID]', '#item_filter_important');
        itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('ct_filter_important'));
        list = list + itemTemp;
        itemTemp = '';
        
        itemTemp = item.replace('[ITEMID]', '#item_filter_online');
        itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('ct_filter_online'));
        list = list + itemTemp;
        itemTemp = '';


        var template = '' +
    '<div id="filterct_popup" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

        '<div data-role="header" data-theme="b">' +
            '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
            '<h1 class="adialog_title">' + webphone_api.stringres.get('ct_filter_title') + '</h1>' +
        '</div>' +
        '<div role="main" class="ui-content adialog_content" style="padding: 0; margin: 0;">' +

            '<ul id="filterct_ul" data-role="listview" data-inset="true" data-icon="false" style="margin: 0;">' +
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

                webphone_api.$('#filterct_ul').off('click', 'li');

                popupafterclose();
            }
        });

        webphone_api.$('#filterct_ul').on('click', 'li', function(event)
        {
            var itemid = webphone_api.$(this).attr('id');

            if (itemid === '#item_filter_all')
            {
                webphone_api.common.SaveParameter('lastfilterval', webphone_api.common.GetParameter('filtercontacts'));
                webphone_api.common.SaveParameter('filtercontacts', '0');
                PopulateList(false);
            }
            else if (itemid === '#item_filter_important')
            {
                webphone_api.common.SaveParameter('lastfilterval', webphone_api.common.GetParameter('filtercontacts'));
                webphone_api.common.SaveParameter('filtercontacts', '1');
                PopulateList(false);
            }
            else if (itemid === '#item_filter_online')
            {
                webphone_api.common.SaveParameter('lastfilterval', webphone_api.common.GetParameter('filtercontacts'));
                webphone_api.common.SaveParameter('filtercontacts', '2');
                PopulateList(false);
            }
/*
            webphone_api.$( '#filterct_popup' ).on( 'popupafterclose', function( event )
            {
                webphone_api.$( '#filterct_popup' ).off( 'popupafterclose' );

                // add action here
            });*/
        });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: FilterContactsByPopup", err); }
}

function SortContactsPopup(popupafterclose)
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
        var item = '<li id="[ITEMID]"><a data-rel="back">[ITEMTITLE]</a></li>';

        var itemTemp = '';

        itemTemp = item.replace('[ITEMID]', '#item_sort_name');
        itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('ct_sort_name'));
        list = list + itemTemp;
        itemTemp = '';

        itemTemp = item.replace('[ITEMID]', '#item_sort_importance');
        itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('ct_sort_importance'));
        list = list + itemTemp;
        itemTemp = '';
        
        itemTemp = item.replace('[ITEMID]', '#item_sort_status');
        itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('ct_sort_status'));
        list = list + itemTemp;
        itemTemp = '';


        var template = '' +
    '<div id="sortct_popup" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

        '<div data-role="header" data-theme="b">' +
            '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
            '<h1 class="adialog_title">' + webphone_api.stringres.get('ct_sort_title') + '</h1>' +
        '</div>' +
        '<div role="main" class="ui-content adialog_content" style="padding: 0; margin: 0;">' +

            '<ul id="sortct_ul" data-role="listview" data-inset="true" data-icon="false" style="margin: 0;">' +
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

                webphone_api.$('#sortct_ul').off('click', 'li');

                popupafterclose();
            }
        });

        webphone_api.$('#sortct_ul').on('click', 'li', function(event)
        {
            var itemid = webphone_api.$(this).attr('id');

            if (itemid === '#item_sort_name')
            {
                webphone_api.common.SaveParameter('sortcontacts', '0');
                webphone_api.common.SortContacts();
                PopulateList(false);
            }
            else if (itemid === '#item_sort_importance')
            {
                webphone_api.common.SaveParameter('sortcontacts', '1');
                webphone_api.common.SortContacts();
                PopulateList(false);
            }
            else if (itemid === '#item_sort_status')
            {
                webphone_api.common.SaveParameter('sortcontacts', '2');
                webphone_api.common.SortContacts();
                PopulateList(false);
            }
/*
            webphone_api.$( '#sortct_popup' ).on( 'popupafterclose', function( event )
            {
                webphone_api.$( '#sortct_popup' ).off( 'popupafterclose' );

                // add action here
            });*/
        });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: SortContactsPopup", err); }
}

function ImportContactsPopup(popupafterclose)
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
    var item = '<li id="[ITEMID]"><a data-rel="back">[ITEMTITLE]</a></li>';

    var itemTemp = '';

    itemTemp = item.replace('[ITEMID]', '#item_import_file');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_import_file'));
    list = list + itemTemp;
    itemTemp = '';
    itemTemp = item.replace('[ITEMID]', '#item_import_outlook');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_import_outlook'));
    list = list + itemTemp;
    itemTemp = '';
    itemTemp = item.replace('[ITEMID]', '#item_import_skype');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_import_skype'));
    list = list + itemTemp;
    itemTemp = '';
    itemTemp = item.replace('[ITEMID]', '#item_import_google');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_import_google'));
    list = list + itemTemp;
    itemTemp = '';
    itemTemp = item.replace('[ITEMID]', '#item_import_android');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_import_android'));
    list = list + itemTemp;
    itemTemp = '';
    itemTemp = item.replace('[ITEMID]', '#item_export_file');
    itemTemp = itemTemp.replace('[ITEMTITLE]', webphone_api.stringres.get('menu_export_file'));
    list = list + itemTemp;
    itemTemp = '';


    var template = '' +
'<div id="import_contacts_window" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('menu_import_list') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content" style="padding: 0; margin: 0;">' +

        '<ul id="import_contacts_window_ul" data-role="listview" data-inset="true" data-icon="false" style="margin: 0;">' +
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

            webphone_api.$('#import_contacts_window_ul').off('click', 'li');

            popupafterclose();
        }
    });

    webphone_api.$('#import_contacts_window_ul').on('click', 'li', function(event)
    {
        var itemid = webphone_api.$(this).attr('id');

        webphone_api.$( '#import_contacts_window' ).on( 'popupafterclose', function( event )
        {
            webphone_api.$( '#import_contacts_window' ).off( 'popupafterclose' );

            ImportContacts(itemid);
        });
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: ImportContactsPopup", err); }
}

function ImportContacts(id)
{
    try{
    if (webphone_api.common.isNull(id) || id.length < 3)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _contactslist ImportContacts invalid entry: ' + id);
        return;
    }
    webphone_api.common.PutToDebugLog(2, 'EVENT, USER ImportContacts: ' + id);
    /*
                        Import from File (Restore)  -> extcmd_import_file           Comment/Hint: Load from CSV file
                        Import from Outlook -> extcmd_import_outlook             Comment/Hint: 
                        Import from Skype -> extcmd_import_skype     Comment/Hint: 
                        Import from Google -> extcmd_import_google Comment/Hint: 
                        Import from Android phone  (already exists)      Comment/Hint: 
                        Export to File (Backup) -> extcmd_export_file   Comment/Hint: Save to CSV file
*/
    if (id === '#item_import_android')
    {
        webphone_api.common.DownloadContacts();
    }
    else if (id === '#item_import_file') // file import
    {
        var url = webphone_api.common.AddJscommport(webphone_api.global.WIN_SOFTPHONE_URL) + '?extcmd_import_file';
        webphone_api.common.WinSoftphoneHttpReq(url, 'GET', '', '', function (resp)
        {
            webphone_api.common.PutToDebugLog(2, 'EVENT, Import contacts from file: ' + resp);
        });
    }
    else if (id === '#item_export_file') // file export
    {
        var url = webphone_api.common.AddJscommport(webphone_api.global.WIN_SOFTPHONE_URL) + '?extcmd_export_file';
        webphone_api.common.WinSoftphoneHttpReq(url, 'GET', '', '', function (resp)
        {
            webphone_api.common.PutToDebugLog(2, 'EVENT, Export contacts to file: ' + resp);
        });
    }
    else if (id === '#item_import_outlook') // outlook import
    {
        var url = webphone_api.common.AddJscommport(webphone_api.global.WIN_SOFTPHONE_URL) + '?extcmd_import_outlook';
        webphone_api.common.WinSoftphoneHttpReq(url, 'GET', '','', function (resp)
        {
            webphone_api.common.PutToDebugLog(2, 'EVENT, Import contacts from outlook: ' + resp);
        });
    }
    else if (id === '#item_import_skype') // skype import
    {
        var url = webphone_api.common.AddJscommport(webphone_api.global.WIN_SOFTPHONE_URL) + '?extcmd_import_skype';
        webphone_api.common.WinSoftphoneHttpReq(url, 'GET', '','', function (resp)
        {
            webphone_api.common.PutToDebugLog(2, 'EVENT, Import contacts from skype: ' + resp);
        });
    }
    else if (id === '#item_import_skype') // google import
    {
        var url = webphone_api.common.AddJscommport(webphone_api.global.WIN_SOFTPHONE_URL) + '?extcmd_import_google';
        webphone_api.common.WinSoftphoneHttpReq(url, 'GET', '','', function (resp)
        {
            webphone_api.common.PutToDebugLog(2, 'EVENT, Import contacts from google: ' + resp);
        });
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: ImportContacts", err); }
}

function NewContact() // open AddEditContact activity
{
    try{
    webphone_api.global.intentaddeditct = [];
    webphone_api.global.intentaddeditct[0] = 'action=add';
    
    webphone_api.$.mobile.changePage("#page_addeditcontact", { transition: "pop", role: "page" });

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: NewContact", err); }
}

function onStop(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _contactslist: onStop");
    webphone_api.global.isContactslistStarted = false;
    
    // reset toogle contact to default value
    webphone_api.$('select#togglecontact').val('no').flipswitch('refresh');
    
    webphone_api.common.SaveContactsFile(function (issaved) { webphone_api.common.PutToDebugLog(4, 'EVENT, _contactslist: onDestroy SaveContactsFile: ' + issaved.toString()); });

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_contactslist: onStop", err); }
}

function onDestroy (event){} // deprecated by onstop


// public members and methods
return {
    onCreate: onCreate,
    onStart: onStart,
    onStop: onStop,
    onDestroy: onDestroy,
    PopulateList: PopulateList,
    MeasureContacslist: MeasureContacslist
};
})();