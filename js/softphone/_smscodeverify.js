// smscodeverify
webphone_api._smscodeverify = (function ()
{

var username = '';
var password = '';
var userID = '';

function onCreate (event) // called only once - bind events here
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _smscodeverify: onCreate");
    
    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_smscodeverify')
        {
            MeasureSmscodeverify();
        }
    });

    webphone_api.$('#smscodeverify_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_smscodeverify_menu").on("click", function() { CreateOptionsMenu('#smscodeverify_menu_ul'); });
    webphone_api.$("#btn_smscodeverify_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    
    webphone_api.$("#btn_sms_verify").on("click", function() { VerifyPhonenumber(); });
    webphone_api.$("#btn_cancel_smscodeverify").on("click", function() { CancelClick(); });
    
    webphone_api.$("#sms_instructions").html(webphone_api.stringres.get('smscode_instrucation'));
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_smscodeverify: onCreate", err); }
}

function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _smscodeverify: onStart");
    webphone_api.global.isSmscodeverifyStarted = true;
    
    if (!webphone_api.common.isNull(document.getElementById('smscodeverify_title')))
    {
        document.getElementById('smscodeverify_title').innerHTML = webphone_api.stringres.get('smscodeverify_title');
    }
    webphone_api.$("#smscodeverify_title").attr("title", webphone_api.stringres.get("hint_page"));

    if (!webphone_api.common.isNull(document.getElementById('smscodeverify_btnback')))
    {
        document.getElementById('smscodeverify_btnback').innerHTML = '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("go_back_btn_txt");
    }
    
    if (!webphone_api.common.isNull(document.getElementById('btn_sms_verify')))
    {
        document.getElementById('btn_sms_verify').innerHTML = webphone_api.stringres.get('btn_smsverify');
    }
    
    if (!webphone_api.common.isNull(document.getElementById('btn_cancel_smscodeverify')))
    {
        document.getElementById('btn_cancel_smscodeverify').innerHTML = webphone_api.stringres.get('btn_cancel');
    }

    webphone_api.global.nuiswebpage = null;

    username = webphone_api.common.GetIntentParam(webphone_api.global.intentsmscodeverify, 'username');
    password = webphone_api.common.GetIntentParam(webphone_api.global.intentsmscodeverify, 'password');
    userID = webphone_api.common.GetIntentParam(webphone_api.global.intentsmscodeverify, 'smsverify_userid');
    
    MeasureSmscodeverify();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_smscodeverify: onStart", err); }
}

function MeasureSmscodeverify() // resolve window height size change
{
    try{
//--    var pgh = webphone_api.common.GetDeviceHeight() - 1; webphone_api.$('#page_smscodeverify').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_smscodeverify').css('min-height', 'auto'); // must be set when softphone is skin in div

    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#page_smscodeverify'), -30) );
    
    var heightTemp = webphone_api.common.GetDeviceHeight() - webphone_api.$("#smscodeverify_header").height() - webphone_api.$("#smscodeverify_footer").height();
    heightTemp = heightTemp - 5;
    heightTemp = Math.floor(heightTemp);
    webphone_api.$("#page_smscodeverify_content").height(heightTemp);

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_smscodeverify: MeasureSmscodeverify", err); }
}

function VerifyPhonenumber()
{
    var code = "";
    try{
        if (webphone_api.common.isNull(document.getElementById('sms_code_field')))
        {
            webphone_api.common.PutToDebugLog(2, 'ERROR, smscodeverify VerifyPhonenumber: input field is NULL');
            return;
        }

        var code = document.getElementById('sms_code_field').nodeValue;
        if (webphone_api.common.isNull(code)) { code = ''; }

        if (code.length < 2 || code.length > 10)
        {
            webphone_api.common.ShowToast(webphone_api.stringres.get('sms_verification_error1'));
            return;
        }

        webphone_api.common.PutToDebugLog(2, "EVENT, smscodeverify VerifyPhonenumber code is: " + code);
        webphone_api.global.smsCodeUser = code;
        
        code = encodeURIComponent(code);
        var usr = encodeURIComponent(username);
        var pwd = encodeURIComponent(password);

        if (webphone_api.common.isNull(userID) || userID.length < 1)
        {
            userID = username;
        }

        //String uritmp = Common.smsverify_url;
        var uritmp = webphone_api._newuser.GetUriSecondNU();
        if (webphone_api.common.Trim(uritmp).indexOf("*") === 0) { uritmp = uritmp.substring(1); }
        uritmp = uritmp.replace("USERNAME", usr);
        uritmp = uritmp.replace("PASSWORD", pwd);
        uritmp = uritmp.replace("SMSCODE", code);
        uritmp = uritmp.replace("DEVICEID", webphone_api.common.GetDeviceID());
        uritmp = uritmp.replace("USERID", userID);

        //http://185.20.99.144/mvapireq/?apientry=newusercode&authkey=5267734&u_code=SMSCODE&u_username=USERNAME&u_password=PASSWORD&deviceid=DEVICEID&now=415

        webphone_api.common.PutToDebugLog(4, "EVENT, VerifyPhonenumber uri: "+uritmp);
        webphone_api.common.UriParser(uritmp, '', '', '', '', 'verifysmscode');

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_smscodeverify: VerifyPhonenumber", err); }
}

function CancelClick()
{
    try{
    webphone_api.$.mobile.back();

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_smscodeverify: CancelClick", err); }
}

function HttpResponseHandler(resp, action)
{
    try{
    if (actionHandler === 'smscodeverify')
    {
        if ((resp.toLowerCase()).indexOf('error') >= 0)
        {
            webphone_api.common.PutToDebugLog(2, 'ERROR, HttpResponseHandler action: smscodeverify, error: ' + resp);
            webphone_api.common.ShowToast(resp);
            return;
        }

        if (action === "verifysmscode")
        {
            if (resp == null) resp = "";
            if (webphone_api.common.isNull(resp)) { resp = ''; }
            resp = resp.replace("\"", "");
            var tempresp = resp.toLowerCase();

            var seconduri = webphone_api._newuser.GetUriSecondNU();

            var errorstring = webphone_api.common.GetUrlParamVal(seconduri, "ERRORSTRING");
            if (webphone_api.common.isNull(errorstring)) { errorstring = ""; }
            errorstring = errorstring.toLowerCase();

        // get and display success message if any
            var msgtodisplay = webphone_api.common.GetJsonParamVal(resp, "message:");
            if (webphone_api.common.isNull(msgtodisplay) || msgtodisplay.length < 1)
            {
                msgtodisplay = webphone_api.common.GetJsonParamVal(resp, "msg:");
            }
            if (webphone_api.common.isNull(msgtodisplay) || webphone_api.common.Trim(msgtodisplay).length < 1) { msgtodisplay = resp; }

            if (resp.length < 1 || tempresp.indexOf("error") >= 0 || tempresp.indexOf(errorstring) >= 0)
            {
                webphone_api.common.PutToDebugLog(2, "ERROR, SMS verification failed: " + resp);
                webphone_api.common.PutToDebugLog(1, "ERROR," + msgtodisplay);
                webphone_api.common.ShowToast(msgtodisplay);
                return;
            }

            var success = webphone_api.common.GetUrlParamVal(seconduri, "SUCCESSSTRING");
            if (webphone_api.common.isNull(success)) { success = ""; }
            success = success.toLowerCase();
            if (success.length > 0)
            {
                if (tempresp.indexOf(success) >= 0)
                {
                    webphone_api.common.PutToDebugLog(1, "EVENT," + msgtodisplay);
                    webphone_api.common.PutToDebugLog(2, "EVENT, smscodeverify SUCCEDED" + resp);
                }else
                {
                    webphone_api.common.PutToDebugLog(1, "ERROR," + msgtodisplay);
                    webphone_api.common.PutToDebugLog(2, "ERROR, smscodeverify failed, does not contain SUCCESSSTRING" + resp);
                    webphone_api.common.ShowToast(msgtodisplay);
                    return;
                }
            }

            var userid_begin = webphone_api.common.GetUrlParamVal(seconduri, "USERID_BEGIN");
            var userid_end = webphone_api.common.GetUrlParamVal(seconduri, "USERID_END");
            var username_begin = webphone_api.common.GetUrlParamVal(seconduri, "USERNAME_BEGIN");
            var username_end = webphone_api.common.GetUrlParamVal(seconduri, "USERNAME_END");
            var password_begin = webphone_api.common.GetUrlParamVal(seconduri, "PASSWORD_BEGIN");
            var password_end = webphone_api.common.GetUrlParamVal(seconduri, "PASSWORD_END");
            var callerid_begin = webphone_api.common.GetUrlParamVal(seconduri, "CALLERID_BEGIN");
            var callerid_end = webphone_api.common.GetUrlParamVal(seconduri, "CALLERID_END");
            var name_begin = webphone_api.common.GetUrlParamVal(seconduri, "NAME_BEGIN");
            var name_end = webphone_api.common.GetUrlParamVal(seconduri, "NAME_END");
            var email_begin = webphone_api.common.GetUrlParamVal(seconduri, "EMAIL_BEGIN");
            var email_end = webphone_api.common.GetUrlParamVal(seconduri, "EMAIL_END");

            var usr = username;
            var pwd = password;

            if (email_begin.length > 0 && email_end.length > 0 && resp.indexOf(email_begin) >= 0 && resp.indexOf(email_end) > 0)
            {
                var email = resp.substring(resp.indexOf(email_begin) + email_begin.length, resp.indexOf(email_end));

                webphone_api.common.SaveParameter("email", email);
                webphone_api.common.PutToDebugLog(2, "EVENT,smscodeverify VerifyThreadHandler NEW email saved: " + email);
            }

            if (name_begin.length > 0 && name_end.length > 0 && resp.indexOf(name_begin) >= 0 && resp.indexOf(name_end) > 0)
            {
                var name = resp.substring(resp.indexOf(name_begin) + name_begin.length, resp.indexOf(name_end));

                webphone_api.common.SaveParameter("name", name);
                webphone_api.common.PutToDebugLog(2, "EVENT,smscodeverify VerifyThreadHandler NEW name saved: " + name);
            }

            if (callerid_begin.length > 0 && callerid_end.length > 0 && resp.indexOf(callerid_begin) >= 0 && resp.indexOf(callerid_end) > 0)
            {
                var callerid = resp.substring(resp.indexOf(callerid_begin) + callerid_begin.length, resp.indexOf(callerid_end));

                webphone_api.common.SaveParameter("username", callerid);
                webphone_api.common.PutToDebugLog(2, "EVENT,smscodeverify VerifyThreadHandler NEW callerid saved: " + callerid);
            }

            if (userid_begin.length > 0 && userid_end.length > 0 && resp.indexOf(userid_begin) >= 0 && resp.indexOf(userid_end) > 0)
            {
                var userid = resp.substring(resp.indexOf(userid_begin) + userid_begin.length, resp.indexOf(userid_end));

                webphone_api.common.SaveParameter("userid", userid);
                webphone_api.common.PutToDebugLog(2, "EVENT,smscodeverify VerifyThreadHandler NEW userid saved: " + userid);
            }

            if (username_begin.length > 0 && username_end.length > 0 && resp.indexOf(username_begin) >= 0 && resp.indexOf(username_end) > 0)
            {
                usr = resp.substring(resp.indexOf(username_begin) + username_begin.length, resp.indexOf(username_end));

                webphone_api.common.SaveParameter("sipusername", usr);
                webphone_api.common.PutToDebugLog(2, "EVENT,smscodeverify VerifyThreadHandler NEW username saved: " + usr);
            }

            
            var showpwd = false;
            if (password_begin.length > 0 && password_end.length > 0 && resp.indexOf(password_begin) >= 0 && resp.indexOf(password_end) > 0)
            {
                pwd = resp.substring(resp.indexOf(password_begin) + password_begin.length, resp.indexOf(password_end));
                webphone_api.common.SaveParameter("password", pwd);
                webphone_api.common.PutToDebugLog(2, "EVENT,smscodeverify VerifyThreadHandler NEW password saved: " + pwd);
            }else
            {
                // if user already exists, then I will receive encrypted password:
                // OK: userdata: Base64XOREncode(password)
                if (resp.indexOf("userdata:") >= 0)
                {
                    pwd = resp.substring(resp.indexOf("userdata:") + 9, resp.length);
                    pwd = pwd.trim();

                    var key = webphone_api.common.GetParameter('httpreqencryptkey');
                    if (!webphone_api.common.isNull(key) && key.length > 1)
                    {
                        pwd = StrDc(pwd, key);
                    }

                    webphone_api.common.SaveParameter("password", pwd);
                    webphone_api.common.SaveParameter("sipusername", usr);
                    webphone_api.common.PutToDebugLog(2, "EVENT,smscodeverify VerifyThreadHandler OLD password saved: " + pwd);
                }
                else if (pwd.length > 0)
                {
                    webphone_api.common.SaveParameter("password", pwd);
                    webphone_api.common.SaveParameter("username", usr);
                    webphone_api.common.PutToDebugLog(2, "EVENT,smscodeverify VerifyThreadHandler password saved: " + pwd + "; username: " + username);

            // calculate password
                }else // int uauthverifypwd: 0=pwd+755+code,1=code (default),2=client supplied
                {
                    var uauthverifypwd = webphone_api.common.GetParameterInt('uauthverifypwd', 2);

                    if (uauthverifypwd === 0) { pwd = password + "755" + webphone_api.global.smsCodeUser; }
                    else if (uauthverifypwd === 1) { pwd = webphone_api.global.smsCodeUser; }
                    else if (uauthverifypwd > 1) { pwd = password; }

                    webphone_api.common.SaveParameter("password", pwd);
                    webphone_api.common.SaveParameter("sipusername", usr);
                    webphone_api.common.PutToDebugLog(2, "EVENT,smscodeverify VerifyThreadHandler NEW password saved: " + pwd + "; username: " + username);
                    showpwd = true;
                }
            }

            // try to guess/find username in http answer; handle common cases
            var usrTmp = webphone_api.common.GetJsonParamVal(resp, "sip_username");
            if (webphone_api.common.isNull(usrTmp) || usrTmp.length < 1) usrTmp = webphone_api.common.GetJsonParamVal(resp, "sipusername");
            if (webphone_api.common.isNull(usrTmp) || usrTmp.length < 1) usrTmp = webphone_api.common.GetJsonParamVal(resp, "username");
            if (!webphone_api.common.isNull(usrTmp) && usrTmp.length > 0) usr = usrTmp;

            if (!webphone_api.common.isNull(usr) && usr.length > 0)
            {
                webphone_api.common.SaveParameter("sipusername", usr);
                webphone_api.common.PutToDebugLog(2, "EVENT,smscodeverify VerifyThreadHandler NEW username saved(autoguessed): " + usr);
            }


            var pwdTmp = webphone_api.common.GetJsonParamVal(resp, "sip_password");
            if (webphone_api.common.isNull(pwdTmp) || pwdTmp.length < 1) pwdTmp = webphone_api.common.GetJsonParamVal(resp, "sippassword");
            if (webphone_api.common.isNull(pwdTmp) || pwdTmp.length < 1) pwdTmp = webphone_api.common.GetJsonParamVal(resp, "password");
            if (!webphone_api.common.isNull(pwdTmp) && pwdTmp.length > 0) pwd = pwdTmp;

            if (!webphone_api.common.isNull(pwd) && pwd.length > 0)
            {
                webphone_api.common.SaveParameter("password", pwd);
                webphone_api.common.PutToDebugLog(2, "EVENT,smscodeverify VerifyThreadHandler NEW password saved(autoguessed): " + usr);
            }

            if (webphone_api.common.GetParameter("username").length > 0 && webphone_api.common.GetParameter("password").length > 0)
            {
                if (Settings.instance != null)
                {
                    setTimeout(function ()
                    {
                        webphone_api.$("#btn_login").click();
                    }, 300);

                    if (showpwd === true)
                    {
                        webphone_api.common.AlertWindow(webphone_api.stringres.get('password'), webphone_api.stringres.get('sms_verification_pwdmsg') + ": " +webphone_api.common.GetParameter("password"));
                    }
                }
            }
        }

        webphone_api.$.mobile.back();
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_smscodeverify: HttpResponseHandler", err); }
}

var MENUITEM_VERIFY = '#menuitem_smscodeverify_verify';
var MENUITEM_CANCEL = '#menuitem_smscodeverify_cancel';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$( "#btn_smscodeverify_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _smscodeverify: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _smscodeverify: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_VERIFY + '"><a data-rel="back">' + webphone_api.stringres.get('btn_smsverify') + '</a></li>' ).listview('refresh');
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_CANCEL + '"><a data-rel="back">' + webphone_api.stringres.get('btn_cancel') + '</a></li>' ).listview('refresh');

    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_smscodeverify: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#smscodeverify_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#smscodeverify_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_VERIFY:
                VerifyPhonenumber();
                break;
            case MENUITEM_CANCEL:
                CancelClick();
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_smscodeverify: MenuItemSelected", err); }
}

function onStop(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _smscodeverify: onStop");
    webphone_api.global.isSmscodeverifyStarted = false;

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_smscodeverify: onStop", err); }
}

function onDestroy (event){} // deprecated by onstop


// public members and methods
return {
    onCreate: onCreate,
    onStart: onStart,
    onStop: onStop,
    onDestroy: onDestroy,

    HttpResponseHandler: HttpResponseHandler
};
})();