// Logview
webphone_api._logview = (function ()
{

function onCreate (event) // called only once - bind events here
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _logview: onCreate");
    
    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_logview')
        {
            MeasureLogview();
        }
    });

    webphone_api.$('#logview_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_logview_menu").on("click", function() { CreateOptionsMenu('#logview_menu_ul'); });
    webphone_api.$("#btn_logview_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    
    webphone_api.$("#support_selectall").on("click", function()
    {
        webphone_api.$('#log_text').select();
    });
    
    webphone_api.$("#sendtosupport").on("click", function()
    {
        var additionalinfo = 'Build date: ' + webphone_api.common.GetParameter('codegenerated');
        webphone_api.common.SendLog(additionalinfo + '&#10;' + webphone_api.global.logs);
    });
    
// it's not working on mobile devices
    if (webphone_api.common.GetOs() === 'Android' || webphone_api.common.GetOs() === 'iOS')
    {
        webphone_api.$("#support_selectall").hide();
    }
    
    webphone_api.$("#btn_loghelp").on("click", function()
    {
        webphone_api.common.AlertDialog(webphone_api.stringres.get('help'), webphone_api.stringres.get('logview_help') + ' ' + webphone_api.common.GetParameter('support_email'), null, null, false);
    });
    
    webphone_api.$("#btn_sendlog").on("click", function()
    {
        webphone_api.common.PutToDebugLog(1, 'EVENT, Log upload succeded');
        setTimeout(function ()
        {
            webphone_api.common.PutToDebugLog(1, 'EVENT, Log upload succeded');
        }, 500);
        
//--        webphone_api.common.ShowToast(webphone_api.stringres.get('logview_msg'), 20000); // this line is blocking submit
//--        setTimeout(function ()
//--        {
//--            webphone_api.$("#btn_loghelp").show();
//--            webphone_api.common.ShowToast(webphone_api.stringres.get('logview_help'));
//--        }, 2000);
        
//--        webphone_api.$.mobile.back();

        if (webphone_api.common.GetParameter('email').length < 1)
        {
            var myemail = prompt(webphone_api.stringres.get('log_email'));
            if (!webphone_api.common.isNull(myemail) && myemail.length > 3)
            {
            // validate email
                if (!webphone_api.common.isNull(myemail.match("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9|-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$")))
                {
                    webphone_api.common.SaveParameter('email', myemail);
                }
            }
        }

        var pdesc = prompt(webphone_api.stringres.get('log_description'));
        if (webphone_api.common.isNull(pdesc) || pdesc.length < 3)
        {
            webphone_api.common.ShowToast(webphone_api.stringres.get('log_desc_error'));
            return false;
        }else
        {
            var pd = '\n\nProblem description: ' + pdesc + '\n\n';
            webphone_api.$('#log_text').html(pd + webphone_api.$('#log_text').html());

            //webphone_api.$.mobile.back();
            webphone_api.$.mobile.changePage("#page_dialpad", { transition: "none", role: "page", reverse: "true" });

            return true;
        }
    });

    if (webphone_api.common.GetOs() !== 'Android' && webphone_api.common.GetOs() !== 'iOS')
    {
        webphone_api.$('#log_text').attr('readonly', 'readonly');
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_logview: onCreate", err); }
}

function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _logview: onStart");
    webphone_api.global.isLogviewStarted = true;
    
    if (!webphone_api.common.isNull(document.getElementById('logview_title')))
    {
        document.getElementById('logview_title').innerHTML = webphone_api.stringres.get("logview_title");
    }
    webphone_api.$("#logview_title").attr("title", webphone_api.stringres.get("hint_page"));

    if (!webphone_api.common.isNull(document.getElementById('logview_btnback')))
    {
        document.getElementById('logview_btnback').innerHTML = '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("go_back_btn_txt");
    }
    
    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#logview_header'), -30) );
    
    webphone_api.$("#label_disable_logs").html(webphone_api.stringres.get('disable_logs'));
    
//--    var email = webphone_api.common.GetConfig('log_email');
//--    if (!webphone_api.common.isNull(email) && email.length > 2)
//--    {
//--        if (!webphone_api.common.isNull(document.getElementById("sendtosupport_link")))
//--        {
//--            document.getElementById("sendtosupport_link").innerHTML = webphone_api.stringres.get("sendtosupport");
//--        }
//--        if (!webphone_api.common.isNull(document.getElementById("support_selectall")))
//--        {
//--            document.getElementById("support_selectall").innerHTML = webphone_api.stringres.get("support_selectall");
//--        }
//--        mailto:test@example.com?subject=subject&body=body
        
//--        var href = 'mailto:' + webphone_api.common.Trim(email) + '?subject=JSPhone Log&body=' + webphone_api.stringres.get('support_email_body');
//--        href = webphone_api.common.ReplaceAll(href, ' ', '%20');
        
//--        var href = 'mailto:' + webphone_api.common.Trim(email) + '?subject=' + encodeURIComponent('WebPhone Log') + '&body=' + webphone_api.stringres.get('support_email_body');
//--        webphone_api.$('#sendtosupport_link').attr('href', href);
        
//--        Spaces between words should be replaced by %20 to ensure that the browser will display the text properly.
//--    }else
//--    {
//--        webphone_api.$("#sendtosupport_container").hide();
//--    }
    
    //handle logsendto option: 0=no options, 1=mizutech upload, 2=email (support email from config)
    var logsendto = webphone_api.common.GetConfigInt('logsendto', 1);
    var logmanualemail = webphone_api.common.GetParameterInt('logmanualemail', 0);

    var email = webphone_api.common.GetParameter('logmanualemail_adress');
    if (webphone_api.common.isNull(email) || email.length < 1) { webphone_api.common.GetConfig('supportmail'); }
    if (webphone_api.common.isNull(email) || email.length < 1) { webphone_api.common.GetConfig('log_email'); }
    //?if (webphone_api.common.isNull(email) || email.length < 1) { webphone_api.common.GetConfig('email'); }

    var subject = webphone_api.common.GetParameter('logmanualemail_subject');
    if (webphone_api.common.isNull(subject) || subject.length < 1) { subject = encodeURIComponent('WebPhone Log'); }
    
    
    if ((logsendto === 2 || logmanualemail > 0) && !webphone_api.common.isNull(email) && email.length > 3) // send in email
    {
        webphone_api.$('#btn_sendlog').hide();

        webphone_api.$('#sendtosupport_link').html(webphone_api.stringres.get("sendtosupport"));
        webphone_api.$('#sendtosupport_link').show();
        
        //mailto:test@example.com?subject=subject&body=body
        //var href = 'mailto:' + webphone_api.common.Trim(email) + '?subject=JSPhone Log&body=' + webphone_api.stringres.get('support_email_body');
        //href = webphone_api.common.ReplaceAll(href, ' ', '%20');

        var href = 'mailto:' + webphone_api.common.Trim(email) + '?subject=' + subject + '&body=' + webphone_api.stringres.get('support_email_body');
        webphone_api.$('#sendtosupport_link').attr('href', href);

        //Spaces between words should be replaced by %20 to ensure that the browser will display the text properly.
    }else
    {
        if (logsendto < 1)
        {
            webphone_api.$("#sendtosupport_container").hide();
        }
        else if (logsendto === 1) // send to mizu with xlogpush
        {
            webphone_api.$('#sendtosupport_link').hide();
            webphone_api.$("#sendtosupport_container").show();
        }
    }

    //-- PC softphone: no need for send logs in the skin menu
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$('#sendtosupport_link').hide();
    }
    
    MeasureLogview();
    
    var additionalinfo = 'Build date: ' + webphone_api.common.GetParameter('codegenerated');
    
    webphone_api.$('#log_text').html(additionalinfo + '&#10;' + webphone_api.global.logs);
//--    webphone_api.$('#log_text').textinput('refresh');
//--    document.getElementById('log_text').value = webphone_api.global.logs;
    
    // add filename parameter to form
    if (!webphone_api.common.isNull(document.getElementById('filename')))
    {
        var srv = webphone_api.common.GetParameter('serveraddress_user');
        if (srv.length < 2) { srv = webphone_api.common.GetParameter('serveraddress'); }
        try{ if (srv.length < 2 && !isNull(webphone_api.parameters) && !isNull(webphone_api.parameters.serveraddress)) { srv = webphone_api.parameters.serveraddress; } } catch(errin) {  }
        if (srv.length < 2) { srv = webphone_api.common.GetConfig('serveraddress'); }
        if (webphone_api.common.isNull(srv)) { srv = ''; }
        srv = srv.replace('://', '');
        
        var logfilename = webphone_api.common.GetParameter('logform_filename');
        
        if (webphone_api.common.isNull(logfilename) || logfilename.length < 1)
        {
            logfilename = webphone_api.common.GetSipusername();
            if (!webphone_api.common.isNull(webphone_api.common.GetParameter('brandname'))) { logfilename = logfilename + '_' + encodeURIComponent(webphone_api.common.GetParameter('brandname')); }
            if (!webphone_api.common.isNull(srv)) { logfilename = logfilename + '_' + encodeURIComponent(srv); }
        }

        webphone_api.common.PutToDebugLog(2, 'EVENT, _logview filename: ' + logfilename);
        
        document.getElementById('filename').value = logfilename;
    }
    
    if (!webphone_api.common.isNull(document.getElementById('wplocation')))
    {
        try{
        var loc = window.location.href;
        if (!webphone_api.common.isNull(loc) && loc.length > 0)
        {
            loc = loc.toLowerCase();
            var pos = loc.indexOf('#');
            if (pos > 0)
            {
                loc = loc.substring(0, pos);
            }
            if (webphone_api.common.isNull(loc)) { loc = ''; }
            loc = webphone_api.common.Trim(loc);
            document.getElementById('wplocation').value = loc;
        }
        } catch(err) { webphone_api.common.PutToDebugLogException(2, "_logview: onStart Inner", err); }
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_logview: onStart", err); }
}

function MeasureLogview() // resolve window height size change
{
    try{
//--    var pgh = webphone_api.common.GetDeviceHeight() - 1; webphone_api.$('#page_logview').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_logview').css('min-height', 'auto'); // must be set when softphone is skin in div
    
    webphone_api.$("#page_logview_content").height(webphone_api.common.GetDeviceHeight() - webphone_api.$("#logview_header").height() - 2);
    var ltheight = webphone_api.common.GetDeviceHeight() - webphone_api.$("#logview_header").height() - 5;
    
    if (webphone_api.$('#sendtosupport_container').is(':visible'))
    {
        ltheight = ltheight - webphone_api.$("#sendtosupport_container").height();
    }
    
    webphone_api.$("#log_text").height(ltheight);
    webphone_api.$("#log_text").width(webphone_api.common.GetDeviceWidth());

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_logview: MeasureLogview", err); }
}

var MENUITEM_CLOSE = '#menuitem_logview_close';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE())
    {
        webphone_api.$( "#btn_logview_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _logview: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _logview: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_CLOSE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_close') + '</a></li>' ).listview('refresh');

    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_logview: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#logview_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#logview_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_CLOSE:
                webphone_api.$.mobile.back();
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_logview: MenuItemSelected", err); }
}

function onStop(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _logview: onStop");
    webphone_api.global.isLogviewStarted = false;
    
    if (webphone_api.$('#disable_logs').prop("checked"))
    {
        webphone_api.common.SaveParameter('loglevel', '1');
        webphone_api.common.SaveParameter('jsscriptevent', '2');
        webphone_api.setparameter('jsscriptevent', '2');
        webphone_api.global.loglevel = 1;
        
        webphone_api.$('#disable_logs').prop("checked", false).checkboxradio('refresh');
    }
    
    webphone_api.$('#log_text').html('');
//--    document.getElementById('log_text').value = '';
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_logview: onStop", err); }
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