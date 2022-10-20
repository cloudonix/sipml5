// Accounts page
webphone_api._accounts = (function ()
{

function onCreate (event) // called only once - bind events here
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _accounts: onCreate");
    
    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_accounts')
        {
            MeasureAccountst();
        }
    });
    
    webphone_api.$('#accounts_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_accounts_menu").on("click", function() { CreateOptionsMenu('#accounts_menu_ul'); });
    webphone_api.$("#btn_accounts_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    
    webphone_api.$(".minus_btn").attr("title", webphone_api.stringres.get("hint_removephone"));
    
    webphone_api.$("#btn_add_acc").attr("title", webphone_api.stringres.get("accounts_add_hint"));

    webphone_api.$( "#page_accounts" ).keyup(function( event )
    {   
        HandleKeyUp(event);
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_accounts: onCreate", err); }
}

function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _accounts: onStart");
    webphone_api.global.isAccountsStarted = true;

    webphone_api.$("#btn_add_acc").on("click", function() { AddAccount(); });
        
    webphone_api.$('#acc_add_p').html(webphone_api.stringres.get('add_account'));
    document.getElementById('aec_label_phone').innerHTML = webphone_api.stringres.get('contact_phone');
    
    webphone_api.$("#accounts_list").attr("data-filter-placeholder", webphone_api.stringres.get("ct_search_hint"));
    
    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#page_accounts'), -30) );
    
    if (!webphone_api.common.isNull(document.getElementById('addeditct_btnback')))
    {
        document.getElementById('addeditct_btnback').innerHTML = '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get('btn_cancel');
    }

    var mainAcc = '';
    if (!webphone_api.common.isNull(webphone_api.global.sipaccounts) && webphone_api.global.sipaccounts.length > 0)
    {
    // get active account
        var activeacc_name = "";
        for (var i = 0; i < webphone_api.global.sipaccounts.length; i++)
        {
            var sipitem = webphone_api.global.sipaccounts[i];
            if (sipitem.ismain === true)
            {
                var activeacc_name = sipitem.username;
                if (!webphone_api.common.isNull(sipitem.serveraddress) && sipitem.serveraddress.length > 0)
                {
                    activeacc_name = activeacc_name + '@' + sipitem.serveraddress;
                }
                break;
            }
        }
        if (!webphone_api.common.isNull(activeacc_name) && activeacc_name.length > 0)
        {
            mainAcc = webphone_api.stringres.get('active_account') + ' ' + activeacc_name + '. ';
        }
    }

    var textInstr = webphone_api.stringres.get('accounts_instructions1') + ' '
        + mainAcc + webphone_api.stringres.get('accounts_instructions2');

        webphone_api.$("#text_instructions").html(textInstr);
    
// needed for proper display and scrolling of listview
    MeasureAccountst();
    
    document.getElementById('accounts_title').innerHTML = webphone_api.stringres.get('accounts_title');
    webphone_api.$("#accounts_title").attr("title", webphone_api.stringres.get("hint_page"));
    
    PopulateData();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_accounts: onStart", err); }
}

function MeasureAccountst() // resolve window height size change
{
    try{
    webphone_api.$('#page_accounts').css('min-height', 'auto'); // must be set when softphone is skin in div

    var heightTemp = webphone_api.common.GetDeviceHeight() - webphone_api.$("#accounts_header").height(); // - webphone_api.$('#acc_footer').height();
    heightTemp = heightTemp - 5;
    webphone_api.$("#page_accounts_content").height(heightTemp);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_accounts: MeasureAccountst", err); }
}

var atemplate = '' +
    '<div class="acc_item" id="acc_item_[NR]">' +
        '<div class="acc_control">' +
            '<input type="checkbox" class="acc_checkbox" id="acc_checkbox_[NR]" title="' + webphone_api.stringres.get('accounts_endis_hint') + '" name="acc_checkbox_[NR]" [ENABLE_CHECKED]>' +
            '<input type="radio" class="acc_radio" id="acc_radio_[NR]" title="' + webphone_api.stringres.get('accounts_main_hint') + '" name="acc_active_selection" [MAIN_CHECKED]>' +
        '</div>' +
        '<div class="acc_username" id="acc_username_[NR]">[USERNAME]</div>' +
        '<div class="acc_remove"><button id="btn_remove_account_[NR]" title="' + webphone_api.stringres.get('accounts_remove_hint') + '" class="btn_remove_account noshadow ui-btn-inline ui-btn ui-btn-corner-all ui-btn-b ui-icon-minus ui-btn-icon-notext">Remove</button></div>' +
        '<div class="separator_color_bg"><!--//--></div>' +
    '</div>';

function PopulateData()
{
    try{
// check/uncheck radio buttons

    var form = '';
    
//    extraregisteraccounts = server,usr,pwd,ival;server2,usr2,pwd2, ival;
    if (webphone_api.common.isNull(webphone_api.global.sipaccounts) || webphone_api.global.sipaccounts.length < 1)
    {
        webphone_api.$('.btn_remove_account').off('click');
        webphone_api.$('#acc_list').html('<br /><br />' + webphone_api.stringres.get('noaccounts'));
        return;
    }
    
    for (var i = 0; i < webphone_api.global.sipaccounts.length; i++)
    {
        var sipitem = webphone_api.global.sipaccounts[i];
        var htmlitem = webphone_api.common.ReplaceAll(atemplate, '[NR]', i.toString());
        
        var acc_name = sipitem.username;
        if (!webphone_api.common.isNull(sipitem.serveraddress) && sipitem.serveraddress.length > 0)
        {
            acc_name = acc_name + '@' + sipitem.serveraddress;
        }

        htmlitem = htmlitem.replace('[USERNAME]', acc_name);
        if (sipitem.ismain === true)
        {
            htmlitem = htmlitem.replace('[MAIN_CHECKED]', 'checked="checked"');
        }else
        {
            htmlitem = htmlitem.replace('[MAIN_CHECKED]', '');
        }
        
        if (sipitem.enabled === true)
        {
            htmlitem = htmlitem.replace('[ENABLE_CHECKED]', 'checked="checked"');
        }else
        {
            htmlitem = htmlitem.replace('[ENABLE_CHECKED]', '');
        }
        
        form = form + htmlitem;
    }

    webphone_api.$('#acc_list').html(form);
    webphone_api.$('#acc_list').trigger('create');
    
    webphone_api.$('.btn_remove_account').on('click', function (e)
    {
        try{
        var id = webphone_api.$(this).attr('id');
        if (!webphone_api.common.isNull(id) && id.lastIndexOf('_') > 0)
        {
            var idxstr = id.substring(id.lastIndexOf('_') + 1);
            
            if (!webphone_api.common.isNull(idxstr) && webphone_api.common.IsNumber(idxstr) === true)
            {
                var idx = webphone_api.common.StrToInt(idxstr);
                DeleteAccountPopup(idx);
            }
        }
        } catch(err) { webphone_api.common.PutToDebugLogException(2, "_accounts: remove account", err); }
    });
    
    webphone_api.$('.acc_checkbox').on('change', function (e)
    {
        try{
        var id = webphone_api.$(this).attr('id');
        if (!webphone_api.common.isNull(id) && id.lastIndexOf('_') > 0)
        {
            var checked = document.getElementById(id).checked;
            var idxstr = id.substring(id.lastIndexOf('_') + 1);
            
            if (!webphone_api.common.isNull(idxstr) && webphone_api.common.IsNumber(idxstr) === true)
            {
                var idx = webphone_api.common.StrToInt(idxstr);
                webphone_api.global.sipaccounts[idx].enabled = checked;
                
                var anychecked = false;
                for (var i = 0; i < webphone_api.global.sipaccounts.length; i++)
                {
                    if (i !== idx && webphone_api.global.sipaccounts[i].enabled === true)
                    {
                        anychecked = true;
                        break;
                    }
                }
                
                if (!anychecked)
                {
                    if (webphone_api.global.sipaccounts.length > 1)
                    {
                        for (var i = 0; i < webphone_api.global.sipaccounts.length; i++)
                        {
                            if (i !== idx)
                            {
                                webphone_api.global.sipaccounts[i].enabled = true;
                                document.getElementById('acc_checkbox_' + i).checked = true;
                            // reset ismain
                                for (var j = 0; j < webphone_api.global.sipaccounts.length; j++) { webphone_api.global.sipaccounts[j].ismain = false; }
                                webphone_api.global.sipaccounts[i].ismain = true;
                                webphone_api.$('#acc_radio_' + i).prop('checked', true);
                                break;
                            }
                        }
                    }else
                    {
                        webphone_api.global.sipaccounts[0].enabled = true;
                        document.getElementById(id).checked = true;
                    // reset ismain
                        for (var j = 0; j < webphone_api.global.sipaccounts.length; j++) { webphone_api.global.sipaccounts[j].ismain = false; }
                        webphone_api.global.sipaccounts[0].ismain = true;
                        webphone_api.$('#acc_radio_0').prop('checked', true);
                    }
                }else
                {
                    if (checked === false && webphone_api.global.sipaccounts[idx].ismain === true)
                    {
                        // if we uncheck/disable the main account, then select another main account
                        for (var i = 0; i < webphone_api.global.sipaccounts.length; i++)
                        {
                            if (i === idx || webphone_api.global.sipaccounts[i].enabled === false) { continue; }
                            
                        // reset ismain
                            for (var j = 0; j < webphone_api.global.sipaccounts.length; j++) { webphone_api.global.sipaccounts[j].ismain = false; }
                            
                            webphone_api.global.sipaccounts[i].ismain = true;
                            break;
                        }
                    }
                }
                
                
                for (var i = 0; i < webphone_api.global.sipaccounts.length; i++)
                {
                    if(webphone_api.$('#acc_radio_' + i).is(':checked'))
                    {
                        webphone_api.global.sipaccounts.ismain = true;
                    }else
                    {
                        webphone_api.global.sipaccounts.ismain = false;
                    }
                }
                
                webphone_api.$('.acc_checkbox').off('change');
                webphone_api.common.SaveSipAccounts();
                setTimeout(function ()
                {
                    PopulateData();
                }, 0);
            }
        }
        } catch(err) { webphone_api.common.PutToDebugLogException(2, "_accounts: change ismain", err); }
    });
    
    webphone_api.$(".acc_radio").change(function ()
    {
        try{
        for (var i = 0; i < webphone_api.global.sipaccounts.length; i++)
        {
            if(webphone_api.$('#acc_radio_' + i).is(':checked'))
            {
            // reset ismain
                for (var j = 0; j < webphone_api.global.sipaccounts.length; j++) { webphone_api.global.sipaccounts[j].ismain = false; }
                
                webphone_api.global.sipaccounts[i].ismain = true;
                if (webphone_api.global.sipaccounts[i].enabled === false)
                {
                    webphone_api.global.sipaccounts[i].enabled = true;
                }
                
                webphone_api.$('.acc_radio').off('change');
                webphone_api.common.SaveSipAccounts();
                setTimeout(function ()
                {
                    PopulateData();
                }, 0);
                
                break;
            }
        }
        } catch(err) { webphone_api.common.PutToDebugLogException(2, "_accounts: select ismain", err); }
    });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_accounts: PopulateData", err); }
}

function DeleteAccountPopup(idx, popupafterclose)
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

    var acc_username = webphone_api.global.sipaccounts[idx].username;
    
    var template = '' +
'<div id="adialog_deleteaccount" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('accounts_remove_hint') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content adialog_alert">' +
        '<span> ' + webphone_api.stringres.get('accounts_remove_msg') + ': ' + acc_username + ' </span>' +
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
//--    webphone_api.$( "#adialog_deleteaccount" ).keypress(function( event )
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
        try{
            webphone_api.global.sipaccounts.splice(idx, 1);
                
            webphone_api.common.PutToDebugLog(2, 'EVENT, _accounts, account removed: ' + idx);
            
            var anychecked = false;
            for (var i = 0; i < webphone_api.global.sipaccounts.length; i++)
            {
                if (i !== idx && webphone_api.global.sipaccounts[i].enabled === true)
                {
                    anychecked = true;
                }
            }
            if (!anychecked)
            {
                if (webphone_api.global.sipaccounts.length > 1)
                {
                    for (var i = 0; i < webphone_api.global.sipaccounts.length; i++)
                    {
                        if (i !== idx)
                        {
                            webphone_api.global.sipaccounts[i].enabled = true;
                            document.getElementById('acc_checkbox_' + i).checked = true;
                        // reset ismain
                            for (var j = 0; j < webphone_api.global.sipaccounts.length; j++) { webphone_api.global.sipaccounts[j].ismain = false; }
                            webphone_api.global.sipaccounts[i].ismain = true;
                            webphone_api.$('#acc_radio_' + i).prop('checked', true);
                            break;
                        }
                    }
                }else
                {
                    if (!webphone_api.common.isNull(webphone_api.global.sipaccounts) && webphone_api.global.sipaccounts.length > 0)
                    {
                        webphone_api.global.sipaccounts[0].enabled = true;
                        document.getElementById(id).checked = true;
                    // reset ismain
                        for (var j = 0; j < webphone_api.global.sipaccounts.length; j++) { webphone_api.global.sipaccounts[j].ismain = false; }
                        webphone_api.global.sipaccounts[0].ismain = true;
                        webphone_api.$('#acc_radio_0').prop('checked', true);
                    }
                }
            }
            
            webphone_api.common.SaveSipAccounts();
            PopulateData();
            
            if (webphone_api.global.sipaccounts.length < 1)
            {
                AddAccount();
            }
        } catch(err) { webphone_api.common.PutToDebugLogException(2, "_accounts: DeleteAccountPopup inner OK", err); }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_accounts: DeleteAccountPopup", err); }
}

function AddAccount(popupafterclose)
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

    var accounts_hint_server = webphone_api.stringres.get('accounts_hint_server');
    var accounts_hint_user = webphone_api.stringres.get('accounts_hint_user');
    var accounts_hint_password = webphone_api.stringres.get('accounts_hint_password');
    var accounts_hint_callerid = webphone_api.stringres.get('accounts_hint_callerid');
    var accounts_hint_displayname = webphone_api.stringres.get('accounts_hint_displayname');
    var accounts_hint_proxy = webphone_api.stringres.get('accounts_hint_proxy');
    var accounts_hint_realm = webphone_api.stringres.get('accounts_hint_realm');
    var accounts_hint_regival = webphone_api.stringres.get('accounts_hint_regival');

    var serverHtml = '';
    if (webphone_api.common.ShowServerInput() === true)
    {
        var srv = webphone_api.common.GetParameter('serveraddress_user');
        var val = '';
        if (!webphone_api.common.isNull(srv) && srv.length > 0) { val = 'value="' + srv + '"'; }

        serverHtml = '<label for="addacc_serveraddress">' + webphone_api.stringres.get('addacc_server') + ':</label>'+
        '<input type="text" id="addacc_serveraddress" name="addacc_serveraddress" data-theme="a" autocapitalize="off" ' + val + ' placeholder="' + accounts_hint_server + '" />';
    }
    
    var template = '' +
'<div id="addaccountpopup" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('addaccount_title') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content" style="margin-right: 1em;">' +
    
        '<style>#addaccountpopup LABEL{ text-align: left; font-size: .8em; }</style>' +
        '<span>' + webphone_api.stringres.get('addaccount_msg') + '</span>' +
        
        serverHtml +
        
        '<label for="addacc_username">' + webphone_api.stringres.get('addacc_user') + ':</label>'+
        '<input type="text" id="addacc_username" name="addacc_username" data-theme="a" autocapitalize="off" placeholder="' + accounts_hint_user + '" />' +
        
        '<label for="addacc_password">' + webphone_api.stringres.get('addacc_password') + ':</label>'+
        '<input type="text" id="addacc_password" name="addacc_password" data-theme="a" autocapitalize="off" placeholder="' + accounts_hint_password + '" />' +

        '<br />' +
        '<a href="javascript:;" id="show_hide_advanced">' + webphone_api.stringres.get('ac_showadvanced') + '</a>' +
        '<br />' +
        '<br />' +

        '<div id="addaccountpopup_advanced" style="display: none; margin-left: 2em;">' +
            '<label for="addacc_callerid">' + webphone_api.stringres.get('sett_display_name_username') + ':</label>'+
            '<input type="text" id="addacc_callerid" name="addacc_callerid" value="" data-theme="a" autocapitalize="off" placeholder="' + accounts_hint_callerid + '" />' +

            '<label for="addacc_displayname">' + webphone_api.stringres.get('sett_display_name_displayname') + ':</label>'+
            '<input type="text" id="addacc_displayname" name="addacc_displayname" value="" data-theme="a" autocapitalize="off" placeholder="' + accounts_hint_displayname + '" />' +

            '<label for="addacc_proxyaddress">' + webphone_api.stringres.get('sett_display_name_proxyaddress') + ':</label>'+
            '<input type="text" id="addacc_proxyaddress" name="addacc_proxyaddress" value="" data-theme="a" autocapitalize="off" placeholder="' + accounts_hint_proxy + '" />' +

            '<label for="addacc_realm">' + webphone_api.stringres.get('sett_display_name_realm') + ':</label>'+
            '<input type="text" id="addacc_realm" name="addacc_realm" value="" data-theme="a" autocapitalize="off" placeholder="' + accounts_hint_realm + '" />' +

            '<br /><label for="addacc_ival">' + webphone_api.stringres.get('addacc_ival') + ':</label>'+
            '<input type="text" id="addacc_ival" name="addacc_ival" value="3600" data-theme="a" autocapitalize="off" placeholder="' + accounts_hint_regival + '" />' +
        '</div>'+

    '</div>' +
    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" id="adialog_positive" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_ok') + '</a>' +
        '<a href="javascript:;" id="adialog_negative" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back">' + webphone_api.stringres.get('btn_cancel') + '</a>' +
    '</div>' +
'</div>';

        var popupafterclose = function () {};

        webphone_api.$.mobile.activePage.append(template).trigger("create");

        webphone_api.$.mobile.activePage.find(".closePopup").bind("tap", function (e)
        {
            webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
        });

        webphone_api.$.mobile.activePage.find(".messagePopup").bind(
            {
                popupbeforeposition: function()
                {
                    //webphone_api.$(this).unbind("popupbeforeposition");//.remove();
                    var maxHeight =  Math.floor( webphone_api.common.GetDeviceHeight() * 0.6 );  // webphone_api.$(window).height() - 120;
        
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
                webphone_api.$('#adialog_positive').off('click');
                webphone_api.$('#adialog_negative').off('click');
                popupafterclose();
            }
        });

        webphone_api.$('#adialog_positive').on('click', function (event)
        {
            var srv = webphone_api.$('#addacc_serveraddress').val();
            var usr = webphone_api.$('#addacc_username').val();
            var pwd = webphone_api.$('#addacc_password').val();

            var callerid = webphone_api.$('#addacc_callerid').val();
            var displayname = webphone_api.$('#addacc_displayname').val();
            var proxyaddress = webphone_api.$('#addacc_proxyaddress').val();
            var realm = webphone_api.$('#addacc_realm').val();
            var ivalstr = webphone_api.$('#addacc_ival').val();

            webphone_api.$( '#addaccountpopup' ).on( 'popupafterclose', function( event )
            {
                if (webphone_api.common.GetBrowser() === 'MSIE') { event.preventDefault(); }

                webphone_api.common.PutToDebugLog(5,"EVENT, accounts AddAccount ok onclick");
                ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));

                if (webphone_api.common.ShowServerInput() === true)
                {
                    if (webphone_api.common.isNull(srv) || srv.length < 1) { webphone_api.common.ShowToast(webphone_api.stringres.get('addacc_invalid') + ' ' + webphone_api.stringres.get('addacc_server')); return; }
                }else
                {
                    srv = webphone_api.common.GetParameter('serveraddress');
                    if (webphone_api.common.isNull(srv) || srv.length < 1) { srv = webphone_api.common.GetParameter('serveraddress_user'); }
                }
                if (webphone_api.common.isNull(usr) || usr.length < 1) { webphone_api.common.ShowToast(webphone_api.stringres.get('addacc_invalid') + ' ' + webphone_api.stringres.get('addacc_user')); return; }
                if (webphone_api.common.isNull(pwd) || pwd.length < 1) { webphone_api.common.ShowToast(webphone_api.stringres.get('addacc_invalid') + ' ' + webphone_api.stringres.get('addacc_password')); return; }
                if (webphone_api.common.isNull(ivalstr) || ivalstr.length < 1 || !webphone_api.common.IsNumber(ivalstr)) { webphone_api.common.ShowToast(webphone_api.stringres.get('addacc_invalid') + ' ' + webphone_api.stringres.get('addacc_ival')); return; }

                srv = webphone_api.common.NormalizeInput(srv, 0);
                usr = webphone_api.common.NormalizeInput(usr, 0);
                ivalstr = webphone_api.common.NormalizeInput(ivalstr, 0);

                if (webphone_api.common.isNull(callerid)) { callerid = ''; }
                if (webphone_api.common.isNull(displayname)) { displayname = ''; }
                if (webphone_api.common.isNull(proxyaddress)) { proxyaddress = ''; }
                if (webphone_api.common.isNull(realm)) { realm = ''; }
                callerid = webphone_api.common.NormalizeInput(callerid, 0);
                displayname = webphone_api.common.NormalizeInput(displayname, 0);
                proxyaddress = webphone_api.common.NormalizeInput(proxyaddress, 0);
                realm = webphone_api.common.NormalizeInput(realm, 0);
                
                if (webphone_api.common.isNull(ivalstr) || webphone_api.common.IsNumber(ivalstr) == false) { ivalstr = '3600'; }
                var ival = webphone_api.common.StrToInt(ivalstr);
                
                var ismain = false;
                if (webphone_api.global.sipaccounts.length < 1) { ismain = true; }
                
                webphone_api.common.AddOneAcc(srv, usr, pwd, ival, true, ismain, false, callerid, displayname, proxyaddress, realm);
              
                PopulateData();
            });
        });

        webphone_api.$('#adialog_negative').on('click', function (event)
        {
            if (webphone_api.common.GetBrowser() === 'MSIE') { event.preventDefault(); }
            ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));
        });

        webphone_api.$('#show_hide_advanced').on('click', function (event)
        {
            if (webphone_api.$('#addaccountpopup_advanced').is(':visible'))
            {
                webphone_api.$('#addaccountpopup_advanced').hide();
                webphone_api.$('#show_hide_advanced').html(webphone_api.stringres.get('ac_showadvanced'));

                var maxHeight =  Math.floor( webphone_api.common.GetDeviceHeight() * 0.6 );  // webphone_api.$(window).height() - 120;
        
                if (webphone_api.$('.messagePopup .ui-content').height() > maxHeight + 100)
                {
                    webphone_api.$('.messagePopup .ui-content').height(maxHeight);
                }
            }else
            {
                webphone_api.$('#addaccountpopup_advanced').show();
                webphone_api.$('#show_hide_advanced').html(webphone_api.stringres.get('ac_hideadvanced'));

                var maxHeight =  Math.floor( webphone_api.common.GetDeviceHeight() * 0.6 );  // webphone_api.$(window).height() - 120;
        
                if (webphone_api.$('.messagePopup .ui-content').height() > maxHeight + 100)
                {
                    webphone_api.$('.messagePopup .ui-content').height(maxHeight);
                }
            }
            
            if (webphone_api.common.GetBrowser() === 'MSIE') { event.preventDefault(); }
            ManuallyClosePopup(webphone_api.$.mobile.activePage.find(".messagePopup"));
        });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_accounts: AddAccount", err); }
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

    
    if ( charCode === 8) // backspace
    {
        event.preventDefault();
        webphone_api.$.mobile.back();
    }
//--    else if ( charCode === 13)
//--    {
//--        event.preventDefault();
//--        webphone_api.$("#btn_call").click();
//--    }
    return false;
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_accounts: HandleKeyUp", err); }
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
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_accounts: ManuallyClosePopup", err); }
}

var MENUITEM_ACCOUNTS_CLOSE = '#menuitem_accounts_close';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$( "#btn_accounts_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _accounts: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _accounts: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_ACCOUNTS_CLOSE + '"><a data-rel="back">' + webphone_api.stringres.get('btn_close') + '</a></li>' ).listview('refresh');

    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_accounts: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#accounts_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#accounts_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_ACCOUNTS_CLOSE:
                webphone_api.$.mobile.back();
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_accounts: MenuItemSelected", err); }
}

function onStop(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _accounts: onStop");
    webphone_api.global.isAccountsStarted = false;
    webphone_api.$('.btn_remove_account').off('click');
    webphone_api.$('#btn_add_acc').off('click');
    webphone_api.$('#acc_list').html('');
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_accounts: onStop", err); }
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