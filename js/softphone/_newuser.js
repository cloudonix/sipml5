// Newuser
webphone_api._newuser = (function ()
{

function onCreate (event) // called only once - bind events here
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _newuser: onCreate");
    
    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_newuser')
        {
            MeasureNewuser();
        }
    });

    webphone_api.$('#newuser_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_newuser_menu").on("click", function() { CreateOptionsMenu('#newuser_menu_ul'); });
    webphone_api.$("#btn_newuser_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    
    webphone_api.$("#btn_create_newuser").on("click", function() { CreateUser(); });
    webphone_api.$("#btn_cancel_newuser").on("click", function()
    {
        if (webphone_api.common.NuIsWebPage())
        {
            webphone_api.$.mobile.changePage("#page_settings", { transition: "pop", role: "page" });
        }else
        {
            webphone_api.$.mobile.back();
        }
    });
    
    webphone_api.$("#newuser_btnback").on("click", function()
    {
        if (webphone_api.common.NuIsWebPage())
        {
            webphone_api.$.mobile.changePage("#page_settings", { transition: "pop", role: "page" });
        }
    });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_newuser: onCreate", err); }
}

function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _newuser: onStart");
    webphone_api.global.isNewuserStarted = true;
    
    if (!webphone_api.common.isNull(document.getElementById('newuser_title')))
    {
        document.getElementById('newuser_title').innerHTML = webphone_api.stringres.get('newuser_title');
    }
    webphone_api.$("#newuser_title").attr("title", webphone_api.stringres.get("hint_page"));

    if (!webphone_api.common.isNull(document.getElementById('newuser_btnback')))
    {
        document.getElementById('newuser_btnback').innerHTML = '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("go_back_btn_txt");
    }
    
    if (!webphone_api.common.isNull(document.getElementById('btn_create_newuser')))
    {
        document.getElementById('btn_create_newuser').innerHTML = webphone_api.stringres.get('btn_create');
    }
    
    if (!webphone_api.common.isNull(document.getElementById('btn_cancel_newuser')))
    {
        document.getElementById('btn_cancel_newuser').innerHTML = webphone_api.stringres.get('btn_cancel');
    }
    
//--if (webphone_api.global.isdebugversion === true)
//--{
//--    var resp = '{' +
//--'"data": {' +
//--'"fields": [' +
//--'{' +
//--'"name": " firstname ",' +
//--'"displayName": "First name",' +
//--'"type": "text",' +
//--'"width": "100%",' +
//--'"value": "",' +
//--'"mandatory": true,' +
//--'"validation": ""' +
//--'}, {' +
//--'"name": " country ",' +
//--'"displayName": "Country",' +
//--'"type": "select",' +
//--'"width": "100%",' +
//--'"value": "api:settings\/countrieslist",' +
//--'"mandatory": true,' +
//--'"validation": ""' +
//--'}, {' +
//--'"name": " username ",' +
//--'"displayName": "Username",' +
//--'"type": "text",' +
//--'"width": "100%",' +
//--'"value": "",' +
//--'"mandatory": true,' +
//--'"validation": "api:clients\/usernameavailable"' +
//--'}, {' +
//--'"name": " email ",' +
//--'"displayName": "Email",' +
//--'"type": "email",' +
//--'"width": "100%",' +
//--'"value": "",' +
//--'"mandatory": true,' +
//--'"validation": "email"' +
//--'}, {' +
//--'"name": " promocode ",' +
//--'"displayName": "Promo code (optional)",' +
//--'"type": "text",' +
//--'"minlength": 8,' +
//--'"maxlength": 8,' +
//--'"width": "30%",' +
//--'"value": "",' +
//--'"mandatory": false,' +
//--'"validation": "api:settings\/promocodevalidation"' +
//--'}, {' +
//--'"name": " device ",' +
//--'"model": "akarmi",' +
//--'"type": "hidden"' +
//--'}, {' +
//--'"name": " dialer ",' +
//--'"type": "hidden"' +
//--'}, {' +
//--'"name": " client_ip ",' +
//--'"type": "hidden"' +
//--'}' +
//--'],' +
//--'"action": "api:clients\/createaccount",' +
//--'"method": "post"' +
//--'},' +
//--'"error": ""' +
//--'}';
//--    HttpResponseHandler('{"data": [{"c":"AF","n":"Afghanistan"},{"c":"AX","n":"Aland Islands"},{"c":"AL","n":"Albania"},{"c":"DZ","n":"Algeria"}]}', 'get_new_user_countrylist');
//--    HttpResponseHandler(resp, 'get_new_user_form_fields');
//--    return;*/
//--}

    var pwdField = document.getElementById('nu_password');
    if (!webphone_api.common.isNull(pwdField))
    {
        var autogenpassword = webphone_api.common.GetParameterInt('autogenpassword', 0);
        if (autogenpassword > 0)
    	{
    		var pwd = webphone_api.common.RandomStr(12, false, true);
            webphone_api.common.PutToDebugLog(4, 'EVENT, _newuser autogenpassword: ' + pwd);
            
    		pwdField.value = pwd;

    		if (autogenpassword > 1) // is not editable by user
    		{
    			pwdField.readOnly = true;
    		}
    	}
    }


    webphone_api.global.nuiswebpage = null;
    
    MeasureNewuser();
    
    PopulateData();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_newuser: onStart", err); }
}

function MeasureNewuser() // resolve window height size change
{
    try{
//--    var pgh = webphone_api.common.GetDeviceHeight() - 1; webphone_api.$('#page_newuser').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_newuser').css('min-height', 'auto'); // must be set when softphone is skin in div

    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#page_newuser'), -30) );
    
    if (webphone_api.common.NuIsWebPage())
    {
        var heightBrowser = webphone_api.common.GetDeviceHeight() - webphone_api.$("#newuser_header").height();
        heightBrowser = heightBrowser - 3;
        heightBrowser = Math.floor(heightBrowser);
        webphone_api.$("#page_newuser_content").height(heightBrowser);
        webphone_api.$("#page_newuser").css("padding-bottom", "0px");
        
        webphone_api.$("#iframe_nubrowser").width(webphone_api.common.GetDeviceWidth());
        webphone_api.$("#iframe_nubrowser").height(heightBrowser - 5);
    }else
    {
        var heightTemp = webphone_api.common.GetDeviceHeight() - webphone_api.$("#newuser_header").height() - webphone_api.$("#newuser_footer").height();
        heightTemp = heightTemp - 3;
        heightTemp = Math.floor(heightTemp);
        webphone_api.$("#page_newuser_content").height(heightTemp);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_newuser: MeasureNewuser", err); }
}

var reqtimer = null;
var reqmaxllop = 0;
var ctr_rec = false; // flag, true if country list received
var iswebpage = false;
function PopulateData()
{
    try{
    var reguri = webphone_api.common.GetParameter('newuser');
    if (webphone_api.common.isNull(reguri) || reguri.length < 1) { reguri = webphone_api.common.GetParameter('newuserurl'); }
    if (webphone_api.common.isNull(reguri)) { reguri = ''; }
    reguri = webphone_api.common.Trim(reguri);

    if (webphone_api.common.NuIsWebPage())
    {
        webphone_api.$('#newuser_content_form').hide();
        webphone_api.$('#newuser_footer').hide();

        MeasureNewuser();

        OpenWebPageNU(reguri);
        MeasureNewuser();

        return;
    }
    
//--     http://216.155.138.27:8084/xmapi/adduser?key=a4fg6cvss3a&u_username=USERNAME&u_password=PASSWORD&u_email=MAIL&u_name=NAME&phone=PHONE
//--     &address=ADDRESS&country=COUNTRY&birthday=BIRTHDAY&gender=GENDER&forgotpasswordquestion=FORGOTPASSWORDQUESTION&forgotpasswordanswer=FORGOTPASSWORDANSWER&now
    
    var nuLabel = webphone_api.common.GetParameter('newuser_username_label');
    if (webphone_api.common.isNull(nuLabel) || nuLabel.length < 2) { nuLabel = webphone_api.stringres.get('nu_username'); }
    webphone_api.$('#label_nu_username').html( '*' + nuLabel );
    webphone_api.$('#label_nu_password').html( '*' + webphone_api.stringres.get('nu_password') );
    webphone_api.$('#label_nu_passwordverify').html( '*' + webphone_api.stringres.get('nu_password_verify') );
    webphone_api.$('#label_nu_email').html( webphone_api.stringres.get('nu_email') );
    webphone_api.$('#label_nu_fullname').html( webphone_api.stringres.get('nu_fullname') );
    webphone_api.$('#label_nu_firstname').html( webphone_api.stringres.get('nu_firstname') );
    webphone_api.$('#label_nu_lastname').html( webphone_api.stringres.get('nu_lastname') );
    webphone_api.$('#label_nu_phone').html( webphone_api.stringres.get('nu_phone') );
    webphone_api.$('#label_nu_address').html( webphone_api.stringres.get('nu_address') );

    webphone_api.$('#label_nu_country').html( webphone_api.stringres.get('nu_country') );
    webphone_api.$('#label_nu_birthday').html( webphone_api.stringres.get('nu_birthday') );
    webphone_api.$('#label_nu_gender').html( webphone_api.stringres.get('nu_gender') );
    webphone_api.$('#label_nu_fpq').html( webphone_api.stringres.get('nu_fpq') );
    webphone_api.$('#label_nu_fpa').html( webphone_api.stringres.get('nu_fpa') );
    
// dynamically get form fields
    var newuserform = webphone_api.common.GetConfig('newuserform');
    var newusercountrylist = webphone_api.common.GetConfig('newusercountrylist');
    if (!webphone_api.common.isNull(newuserform) && newuserform.length > 0)
    {
        if (!webphone_api.common.isNull(newusercountrylist) && newusercountrylist.length > 4)
        {
//--                pd = ProgressDialog.show(instance, "", instance.getResources().getString(R.string.loading));

                webphone_api.common.UriParser(newusercountrylist, '', '', '', '', 'get_new_user_countrylist');

                reqtimer = setInterval(function () // waiting for countrylist
                {
                    reqmaxllop++;
                    if (reqmaxllop > 600)
                    {
                        reqmaxllop = 0;
                        if (!webphone_api.common.isNull(reqtimer)) { clearInterval(reqtimer); } reqtimer = null;
                        webphone_api.common.PutToDebugLog(2, 'ERROR, newuser: PopulateData: waiting for countrylist timeouted');
                        return;
                    }

                    if (ctr_rec === true)
                    {
                        ctr_rec = false;
                        reqmaxllop = 0;
                        if (!webphone_api.common.isNull(reqtimer)) { clearInterval(reqtimer); } reqtimer = null;
                        
                        webphone_api.common.UriParser(newuserform, '', '', '', '', 'get_new_user_form_fields');
                    }
                }, 200);
        }else
        {
            webphone_api.common.UriParser(newuserform, '', '', '', '', 'get_new_user_form_fields');
        }
    }else
    {
        if (reguri.length > 0)
        {
            var dispFields = webphone_api.common.GetUrlParamVal(reguri, "DISPLAYFIELDS");
            if (!webphone_api.common.isNull(dispFields) && dispFields.length > 0)
            {
                dispFields = dispFields.toLowerCase();
                var dispArr = dispFields.split(",");

                if (dispArr.indexOf('username') >= 0)
                {
                    document.getElementById('nu_username_container').style.display = 'block';
                }
                if (dispArr.indexOf('password') >= 0)
                {
                    document.getElementById('nu_password_container').style.display = 'block';
                }
                if (dispArr.indexOf('passwordverify') >= 0)
                {
                    document.getElementById('nu_passwordverify_container').style.display = 'block';
                }
                if (dispArr.indexOf('firstname') >= 0)
                {
                    document.getElementById('nu_firstname_container').style.display = 'block';
                }
                if (dispArr.indexOf('lastname') >= 0)
                {
                    document.getElementById('nu_lastname_container').style.display = 'block';
                }
                if (dispArr.indexOf('name') >= 0)
                {
                    document.getElementById('nu_fullname_container').style.display = 'block';
                }
                if (dispArr.indexOf('mail') >= 0 || dispArr.indexOf('email') >= 0)
                {
                    document.getElementById('nu_email_container').style.display = 'block';
                }
                if (dispArr.indexOf('phone') >= 0)
                {
                    document.getElementById('nu_phone_container').style.display = 'block';
                }
                if (dispArr.indexOf('address') >= 0)
                {
                    document.getElementById('nu_address_container').style.display = 'block';
                }
                if (dispArr.indexOf('country') >= 0)
                {
                    document.getElementById('nu_country_container').style.display = 'block';
                }
                if (dispArr.indexOf('gender') >= 0)
                {
                    document.getElementById('nu_gender_container').style.display = 'block';
                }
                if (dispArr.indexOf('forgotpasswordquestion') >= 0)
                {
                    document.getElementById('nu_fpq_container').style.display = 'block';
                }
                if (dispArr.indexOf('forgotpasswordanswer') >= 0)
                {
                    document.getElementById('nu_fpa_container').style.display = 'block';
                }

                var extraLabel = webphone_api.common.GetUrlParamVal(reguri, "EXTRAFIELDCAPTION");
                var extraKey = webphone_api.common.GetUrlParamVal(reguri, "EXTRAFIELDKEY");

                if (!webphone_api.common.isNull(extraLabel) && extraLabel.length > 0 && !webphone_api.common.isNull(extraKey) && extraKey.length > 0)
                {
                    document.getElementById('nu_extra_container').style.display = 'block';
                    webphone_api.$('#label_nu_extra').html( extraLabel );
                }

            }else
            {
                if (reguri.indexOf("USERNAME") >= 0)
                {
                    document.getElementById('nu_username_container').style.display = 'block';
                }
                if (reguri.indexOf("PASSWORD") >= 0)
                {
                    document.getElementById('nu_password_container').style.display = 'block';
                }
                if (reguri.indexOf("MAIL") >= 0)
                {
                    document.getElementById('nu_email_container').style.display = 'block';
                }
                if (reguri.indexOf("NAME") >= 0)
                {
                    document.getElementById('nu_fullname_container').style.display = 'block';
                }
                if (reguri.indexOf("PHONE") >= 0)
                {
                    document.getElementById('nu_phone_container').style.display = 'block';
                }
                if (reguri.indexOf("ADDRESS") >= 0)
                {
                    document.getElementById('nu_address_container').style.display = 'block';
                }

                if (reguri.indexOf("COUNTRY") >= 0)
                {
                    document.getElementById('nu_country_container').style.display = 'block';
                }
                if (reguri.indexOf("BIRTHDAY") >= 0)
                {
                    document.getElementById('nu_birthday_container').style.display = 'block';
                }
                if (reguri.indexOf("GENDER") >= 0)
                {
                    document.getElementById('nu_gender_container').style.display = 'block';
                }
                if (reguri.indexOf("FORGOTPASSWORDQUESTION") >= 0)
                {
                    document.getElementById('nu_fpq_container').style.display = 'block';
                }
                if (reguri.indexOf("FORGOTPASSWORDANSWER") >= 0)
                {
                    document.getElementById('nu_fpa_container').style.display = 'block';
                }
            }
        }
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_newuser: PopulateData", err); }
}

function OpenWebPageNU(url)
{
    try{
        if (webphone_api.common.isNull(url) || url.length < 3 )
        {
            webphone_api.common.PutToDebugLog(3, 'ERROR, _newuser no url to load: ' + url);
            return;
        }

        if (url.toLowerCase().indexOf('http://') === 0 && webphone_api.common.IsHttps() === true)
        {
            window.open(url, '_blank', 'location=yes,height=' + webphone_api.common.GetDeviceHeight() + ',width=' + webphone_api.common.GetDeviceWidth());
            return;
        }
        
        var width = webphone_api.common.GetDeviceWidth();
        var height = Math.floor( webphone_api.$('#page_newuser_content').height() - 5);
        
        var iframe = '';
        var pos = url.indexOf('[POST]');
        if (pos > 0)
        {
            var purl = webphone_api.common.Trim(url.substring(0, pos));
            var pdataStr = webphone_api.common.Trim(url.substring(pos + 6));
            var pdata = [];
            var pdataInput = '';
            
            if (!webphone_api.common.isNull(pdataStr) && pdataStr.length > 0)
            {
                pdata = pdataStr.split('&');
                if (webphone_api.common.isNull(pdata)) { pdata = []; }
            }
            
            for (var i = 0; i < pdata.length; i++)
            {
                if (webphone_api.common.isNull(pdata[i]) || pdata[i].length < 2 || pdata[i].indexOf('=') < 1) { continue; }
                
                var name = pdata[i].substring(0, pdata[i].indexOf('='));
                var val = pdata[i].substring(pdata[i].indexOf('=') + 1);
                
                if (webphone_api.common.isNull(name) || name.length < 1 || webphone_api.common.isNull(val)) { continue; }
                
                pdataInput += '<input type="hidden" name="' + name + '" value="' + val + '"/>';
            }

            webphone_api.common.PutToDebugLog(2, 'EVENT, OpenWebPageNU, new user POST url in iframe: ' + purl);

            iframe = '<form id="internalb_post" target="iframe_nubrowser" method="post" action="' + purl + '" style="margin: 0; padding: 0;">' +
                        pdataInput +
                        '</form>' + 
                        '<iframe  allow="microphone *; camera *; autoplay *" allowfullscreen="true" frameborder="0" width="' + width + '" height="' + height + '" name="iframe_nubrowser" id="iframe_nubrowser" style="margin:0px; padding:0px;" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-modals"></iframe>' +
                        '<script type="text/javascript">' +
                            'document.getElementById("internalb_post").submit();' +
                        '</script>';
        }else
        {
            webphone_api.common.PutToDebugLog(2, 'EVENT, OpenWebPageNU, new user GET url in iframe: ' + url);

    //--        var iframe = '<iframe frameborder="0" width="' + width + '" height="' + height + '" src="' + url + '" name="iframe_nubrowser" id="iframe_nubrowser" style="margin:0px; padding:0px;"></iframe>';
            iframe = '<iframe allow="microphone *; camera *; autoplay *" allowfullscreen="true" frameborder="0" width="' + width + '" height="' + height + '" src="' + url + '" name="iframe_nubrowser" id="iframe_nubrowser" style="margin:0px; padding:0px;" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-modals"></iframe>';
        }

        webphone_api.$('#page_newuser_content').html(iframe);
        document.getElementById('iframe_nubrowser').onload = IframeOnLoad;

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_newuser: OpenWebPageNU", err); }
}

function CreateUser()	// Create User btn onclick
{							// validating the data entered by the user
    try{
// dynamically get form fields
    var newuserform = webphone_api.common.GetConfig('newuserform');
    if (!webphone_api.common.isNull(newuserform) && newuserform.length > 0)
    {
        var nameL = []; // list of parameter's names
        var valueL = []; // list of parameter value's names

        var item = null; // array
        for (var i = 0; i < formf.length; i++)
        {
            item = formf[i];
            if (webphone_api.common.isNull(item) || item.length < 4) { continue; }

            var name = item[FRM_NAME];
            var dispname = item[FRM_DISPNAME];
            var mandatory = item[FRM_MANDATORY];
            var validate = item[FRM_VALIDATION_TYPE];
            var type = item[FRM_TYPE];
            var value = "";
            
            if (webphone_api.common.isNull(type)) { type = ''; }
            type = type.toString();
            type = webphone_api.common.Trim(type);
            type = type.toLowerCase();
            
            var id = 1000 + i;
            var idstr = id.toString();

        // text
            if (type.length < 1 || type === 'text' || type === 'email')
            {
                value = webphone_api.$('#nu_' + idstr).val();
            }
            else if (type === 'select')
            {
                value = webphone_api.$('#nu_' + idstr + ' option:selected').val();
                
//BRANDSTART
//--                 for favafone we need to pass the country code, NOT the name
                if (webphone_api.common.GetConfigInt('brandid', -1) === 50 && !webphone_api.common.isNull(value) && value.length > 0 && !webphone_api.common.isNull(countryNameL) && countryNameL.length > 0
                        && !webphone_api.common.isNull(countryCodeL) && countryCodeL.length > 0)
                {
                    for (var j = 0; j < countryNameL.length; j++)
                    {
                        if (countryNameL[j] === value && countryCodeL.length > j)
                        {
                            value = countryCodeL[j];
                            webphone_api.common.PutToDebugLog(4, 'EVENT, _newuser create-account with country: ' + value);
                        }
                    }
                }
//BRANDEND
            }

            if (webphone_api.common.isNull(value)) { value = ''; }
            value = webphone_api.common.Trim(value);

    // handle mandatory fields
            if (webphone_api.common.isNull(mandatory)) { mandatory = ''; }
            mandatory = mandatory.toString();
            if (value.length < 1 && !webphone_api.common.isNull(mandatory) && mandatory.length > 0)
            {
                mandatory = mandatory.toLowerCase();
                if (mandatory.indexOf('yes') >= 0 || mandatory.indexOf('true') >= 0 || mandatory.indexOf('1') >= 0)
                {
                    webphone_api.common.ShowToast(webphone_api.stringres.get('newuser_pleaseenter') + ' ' + dispname);
                    return;
                }
            }
            
    // handle validation
            if (webphone_api.common.isNull(validate)) { validate = ''; }
            validate = validate.toString();
            validate = validate.toLowerCase();
            if (validate.indexOf('yes') >= 0 || validate.indexOf('true') >= 0 || validate.indexOf('1') >= 0 || validate.indexOf('mail') >= 0)
            {
                var isvalid = true;
            // if email
                if (validate.indexOf('mail') >= 0 || name.indexOf('mail') >= 0)
                {
                    if (webphone_api.common.isNull(value.match("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9|-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$")))
                    {
                        isvalid = false;
                    }
                }
            // for username, password
                else if (validate.indexOf('user') >= 0 || name.indexOf('user') >= 0 || validate.indexOf('password') >= 0 || name.indexOf('password') >= 0)
                {
                    if (webphone_api.common.isNull(value.match("^[A-Za-z0-9_-]{2,40}$")))
                    {
                        isvalid = false;
                    }
                }

                if (isvalid === false)
                {
                    webphone_api.common.ShowToast(webphone_api.stringres.get('newuser_invalid') + ' ' + dispname);
                    return;
                }
            }
            
            nameL.push(name);
            valueL.push(value);
        }

// construct uri	[DYNAMIC_PARAMS]
        var params = '';
        for (var i = 0; i < nameL.length; i++)
        {
            var name = nameL[i];
            var value = valueL[i];
            if (webphone_api.common.isNull(name) || name.length < 1 || webphone_api.common.isNull(value)) { continue; }
            
            if (params.length > 0) params = params + "&";

            if (value.indexOf("@") > 0 && value.indexOf(".") > 0)
            {
                ;// don't encode email address
            }else
            {
                value = encodeURIComponent(value);
            }
            params = params + name + "=" + value;
        }

        var url = webphone_api.common.GetConfig('newuser');

//BRANDSTART
        if (webphone_api.common.GetConfigInt('brandid', -1) === 50) // favafone // add extra parameters
        {
            var pname = webphone_api.platform.name;
            var pver = webphone_api.platform.version;

            if (webphone_api.common.isNull(pname) || webphone_api.common.GetOs() === 'Android') { pname = webphone_api.common.GetBrowser(); }
            if (webphone_api.common.isNull(pver)) { pver = webphone_api.common.GetBrowserVersion(); }

            var curr_os = webphone_api.platform.os;
            if ((/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) && !window.MSStream)
            {
                curr_os = 'iOS ' + webphone_api.common.GetBrowserVersion(); // browser version is the same on iOS as OS version
            }

            var devparamval = "version_name:" + webphone_api.common.GetVersionStr() + "-version_code:" + webphone_api.global.code_version + "-os_version:" + curr_os
                                        + "-make:" + pname + "-model:" + pver;
            devparamval = encodeURIComponent(devparamval);
            params = params + "&device=" + devparamval;
            params = params + "&dialer=webphone";
//--                params = params + "&client_ip=" + CommonGUI.GetIPAddress(true);
//--                "name": " device ", // if possible send all available information for the device brand,model
//--                "name": " dialer ", // android or ios
//--                "name": " client_ip ", // if possible send remote client IP address
        }

// don't encode parameters, because some webservers can't handle ecoded & between parameters
        // if (params.length > 0) { params = encodeURIComponent(params); }

        if (webphone_api.common.GetConfigInt('brandid', -1) === 50) // favafone
        {
            ;
        }else
//BRANDEND
            if (url.indexOf("?") < 1) { params = "?" + params; }

        url = url.replace('[DYNAMIC_PARAMS]', params);


//--var dev = 'version_name%3A1.7.1031-version_code%3A13-os_version%3AWindows%2010%2064-bit-make%3AChrome-model%3A54.0.2840.71';
//--var pname = webphone_api.platform.name;
//--var pver = webphone_api.platform.version;

//--if (webphone_api.common.isNull(pname) || webphone_api.common.GetOs() === 'Android') { pname = webphone_api.common.GetBrowser(); }
//--if (webphone_api.common.isNull(pver)) { pver = webphone_api.common.GetBrowserVersion(); }

//--var devparamval = "version_name:" + webphone_api.common.GetVersionStr() + "-version_code:" + webphone_api.global.code_version + "-os_version:" + webphone_api.platform.os
//--                            + "-make:" + pname + "-model:" + pver;

//--//        version_name:1.7.1031-version_code:13-os_version:Windows 10 64-bit-make:Chrome-model:54.0.2840.71
//--var dev = '';//version_name171031-version_code13-os_versionWindows%2010%2064-bit-makeChrome-model540284071';
//--//var url = 'https://www.favafone.com/webapi/clients/create-account[POST]?firstname=Akoskaaaaaa&country=Romania&username=akostest1234567895&email=akostest1234567895@yahoo.com&' +
//--//            'promocode=&device=' + dev + '&dialer=webphone';
//--var url = 'https://www.favafone.com/webapi/clients/create-account[POST]?username=akarmi';

//--<input type="text" id="request_input" value="https://www.favafone.com/webapi/clients/create-account[POST]?username=akarmi" />
//--<button id="test_request" class="ui-btn ui-btn-corner-all ui-btn-b noshadow">Test Request</button>

        webphone_api.common.UriParser(url, '', '', '', '', 'newuser_dynamic');
        return;
    }
// END of dynamic
                
                
    var username = document.getElementById('nu_username').value;
    var password = document.getElementById('nu_password').value;
    var email = document.getElementById('nu_email').value;
    var fullName = document.getElementById('nu_fullname').value;
    var firstName = document.getElementById('nu_firstname').value;
    var lastName = document.getElementById('nu_lastname').value;
    var phone = document.getElementById('nu_phone').value;
    var address = document.getElementById('nu_address').value;
    
    var country = document.getElementById('nu_country').value;
    var birthday = document.getElementById('nu_birthday').value;
    var gender = document.getElementById('nu_gender').value;
    var fpq = document.getElementById('nu_fpq').value;
    var fpa = document.getElementById('nu_fpa').value;
    var extra = document.getElementById('nu_extra').value;
    
    if (webphone_api.common.isNull(username)) { username = ''; } else { username = webphone_api.common.Trim(username); }
    if (webphone_api.common.isNull(password)) { password = ''; } else { password = webphone_api.common.Trim(password); }
    if (webphone_api.common.isNull(email))    { email = '';    } else { email = webphone_api.common.Trim(email); }
    if (webphone_api.common.isNull(fullName)) { fullName = ''; } else { fullName = webphone_api.common.Trim(fullName); }
    if (webphone_api.common.isNull(firstName)){ firstName = '';} else { firstName = webphone_api.common.Trim(firstName); }
    if (webphone_api.common.isNull(lastName)) { lastName = ''; } else { lastName = webphone_api.common.Trim(lastName); }
    if (webphone_api.common.isNull(phone))    { phone = '';    } else { phone = webphone_api.common.Trim(phone); }
    if (webphone_api.common.isNull(address))  { address = '';  } else { address = webphone_api.common.Trim(username); }
    
    if (webphone_api.common.isNull(country))  { country = '';  } else { country = webphone_api.common.Trim(country); }
    if (webphone_api.common.isNull(birthday)) { birthday = ''; } else { birthday = webphone_api.common.Trim(birthday); }
    if (webphone_api.common.isNull(gender))   { gender = '';   } else { gender = webphone_api.common.Trim(gender); }
    if (webphone_api.common.isNull(fpq))      { fpq = '';      } else { fpq = webphone_api.common.Trim(fpq); }
    if (webphone_api.common.isNull(fpa))      { fpa = '';      } else { fpa = webphone_api.common.Trim(fpa); }
    if (webphone_api.common.isNull(extra))    { extra = '';    } else { extra = webphone_api.common.Trim(extra); }

//--        	"http://mizu-voip.com:8888/xmapi/new?key=18542&amp;usr=${USERNAME}&amp;pwd=${PASSWORD}&amp;mail=${MAIL}&amp;name=${NAME}&amp;phone=${PHONE}&amp;address=${ADDRESS}&amp;now"
    //verify input fields
    if (document.getElementById('nu_username_container').style.display === 'block')
    {
        if (webphone_api.common.isNull(username) || username.length < 1)
        {
            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_8'));
            return;
        }
        else if (username.length < webphone_api.common.MIN_USR_PWD_LENGHT)
        {
            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_13') + ' ' + webphone_api.common.MIN_USR_PWD_LENGHT);
            return;
        }else if (webphone_api.common.isNull( username.match("^[A-Za-z0-9_-]{2,120}$") )
                || ( username.match("^[A-Za-z0-9_-]{2,120}$")[0] ).length < 1  )
        {
            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_14'));
            return;
        }
    }
    
    if (document.getElementById('nu_password_container').style.display === 'block')
    {
        if (webphone_api.common.isNull(password) || password.length < 1)
        {
            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_9'));
            return;
        }
        else if (password.length < webphone_api.common.MIN_USR_PWD_LENGHT)
        {
            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_15') + ' ' + webphone_api.common.MIN_USR_PWD_LENGHT);
            return;
        }else if (webphone_api.common.isNull( password.match("^[A-Za-z0-9_-]{2,120}$") ) || ( password.match("^[A-Za-z0-9_-]{2,120}$")[0] ).length < 1  )
        {
            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_16'));
            return;
        }
    }

//--    if (document.getElementById('nu_email_container').style.display === 'block')
//--    {
//--        if (webphone_api.common.isNull(email) || email.length < 1)
//--        {
//--            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_10'));
//--            return;
//--        }else if (webphone_api.common.isNull( email.match("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9|-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$") )
//--                || ( email.match("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9|-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$")[0] ).length < 1  )
//--        {
//--            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_12'));
//--            return;
//--        }
//--    }
    
//--    if (document.getElementById('nu_fullname_container').style.display === 'block')
//--    {
//--        if (webphone_api.common.isNull(fullName) || fullName.length < 1)
//--        {
//--            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_11'));
//--            return;
//--        }
//--        else if (fullName.length < webphone_api.common.MIN_USR_PWD_LENGHT)
//--        {
//--            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_17') + ' ' + webphone_api.common.MIN_USR_PWD_LENGHT);
//--            return;
//--        }else if (webphone_api.common.isNull( fullName.match("^[A-Za-z0-9_ -]{2,150}$") ) || ( fullName.match("^[A-Za-z0-9_ -]{2,150}$")[0] ).length < 1  )
//--        {
//--            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_18'));
//--            return;
//--        }
//--        fullName = encodeURIComponent(fullName);
//--        reguri = reguri.replace("[NAME]", fullName);
//--    }
        
    if (document.getElementById('nu_phone_container').style.display === 'block')
    {
//--        if (webphone_api.common.isNull(phone) || phone.length < 1)
//--        {
//--            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_21'));
//--            return;
//--        }
//--        else
        if (phone.length > 0)
        {
            if (phone.length < 5)
            {
                webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_19'));
                return;
            }else if (webphone_api.common.isNull( phone.match("^[0-9+]{3,25}$") ) || ( phone.match("^[0-9+]{3,25}$")[0] ).length < 1  )
            {
                webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_19'));
                return;
            }
        }
    }

//--    if (document.getElementById('nu_address_container').style.display === 'block')
//--    {
//--        if (webphone_api.common.isNull(address) || address.length < 10)
//--        {
//--            webphone_api.common.ShowToast(webphone_api.stringres.get('err_msg_20'));
//--            return;
//--        }
        
//--        address = encodeURIComponent(address);
//--        reguri = reguri.replace("[ADDRESS]", address);
//--    }
    
    phone = webphone_api.common.ReplaceAll(phone, ' ', '');
    fullName = encodeURIComponent(fullName);
    firstName = encodeURIComponent(firstName);
    lastName = encodeURIComponent(lastName);
    phone = encodeURIComponent(phone);
    address = encodeURIComponent(address);
    country = encodeURIComponent(country);
    birthday = encodeURIComponent(birthday);
    gender = encodeURIComponent(gender);
    fpq = encodeURIComponent(fpq);
    fpa = encodeURIComponent(fpa);
    
    
    //building request URI
    var reguri = webphone_api.common.GetParameter('newuser');

    reguri = reguri.replace("[USERNAME]", username);
    reguri = reguri.replace("USERNAME", username);
    reguri = reguri.replace("USRNAME", username);
    
    reguri = reguri.replace("[PASSWORD]", password);
    reguri = reguri.replace("PASSWORD", password);
    
    reguri = reguri.replace("[EMAIL]", email);
    reguri = reguri.replace("EMAIL", email);
    
    reguri = reguri.replace("[MAIL]", email);
    reguri = reguri.replace("MAIL", email);
    
    reguri = reguri.replace("FIRSTNAME", firstName);
    reguri = reguri.replace("LASTNAME", lastName);
    
    reguri = reguri.replace("[NAME]", fullName);
    reguri = reguri.replace("NAME", fullName);
    
    reguri = reguri.replace("[PHONE]", phone);
    reguri = reguri.replace("PHONE", phone);

    reguri = reguri.replace("[ADDRESS]", address);
    reguri = reguri.replace("ADDRESS", address);
    
    reguri = reguri.replace("CURRENCY", "");
    reguri = reguri.replace("DEVICEID", webphone_api.common.GetDeviceId());
    
    reguri = reguri.replace("COUNTRY", country);
    reguri = reguri.replace("BIRTHDAY", birthday);
    reguri = reguri.replace("GENDER", gender);
    reguri = reguri.replace("FORGOTPASSWORDQUESTION", fpq);
    reguri = reguri.replace("FORGOTPASSWORDANSWER", fpa);

    var extraKey = webphone_api.common.GetUrlParamVal(GetUriNU(), "EXTRAFIELDKEY");
    if (!webphone_api.common.isNull(extraKey) && extraKey.length > 0)
    {
        reguri = reguri.replace(extraKey, extra);
    }
    
    if (!webphone_api.common.isNull(email) && email.length > 0)          {   webphone_api.common.SaveParameter('email', email);	}
    if (!webphone_api.common.isNull(fullName) && fullName.length > 0)    {   webphone_api.common.SaveParameter('displayname', fullName);	}

    if (!webphone_api.common.isNull(username) && username.length > 0)    {	webphone_api.common.SaveParameter('sipusername', username);	}
    if (!webphone_api.common.isNull(password) && password.length > 0)    {	webphone_api.common.SaveParameter('password', password);	}
    
    webphone_api.common.UriParser(reguri, '', '', '', '', 'newuserreg');
    
    webphone_api.common.PutToDebugLog(4, "EVENT, _newuser CreateUser uri: " + reguri);

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_newuser: CreateUser", err); }
}

var countryNameL = null;
var countryCodeL = null;
var formf = null; // form fields
var FRM_NAME = 0;
var FRM_DISPNAME = 1;
var FRM_TYPE = 2;
var FRM_DEFVAL = 3;
var FRM_MANDATORY = 4;
var FRM_VALIDATION_TYPE = 5;
function HttpResponseHandler(resp, actionHandler)
{
    try{
    if (actionHandler === 'newuserreg')
    {
        if ((resp.toLowerCase()).indexOf('error') >= 0)
        {
            webphone_api.common.PutToDebugLog(2, 'ERROR, HttpResponseHandler action: newuserreg, error: ' + resp);
        }

        var startverify = false;
        if (GetUriSecondNU().length > 3) // (smsverify_answer) means start_smsverify
        {
            startverify = true;
        }

        var tempresp = resp.toLowerCase();
        var uri = GetUriNU();

        var errorstring = webphone_api.common.GetUrlParamVal(uri, "ERRORSTRING");
        if (webphone_api.common.isNull(errorstring)) errorstring = "";
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
            webphone_api.common.PutToDebugLog(2, "ERROR, New user creation failed: " + resp);
            webphone_api.common.PutToDebugLog(1, "ERROR," + msgtodisplay);
            webphone_api.common.ShowToast(msgtodisplay);
            return;
        }

        var success = webphone_api.common.GetUrlParamVal(uri, "SUCCESSSTRING");
        if (webphone_api.common.isNull(success)) { success = ""; }
        success = success.toLowerCase();
        if (success.length > 0)
        {
            if (tempresp.indexOf(success) >= 0)
            {
                if(msgtodisplay.length > 0) webphone_api.common.PutToDebugLog(1, "EVENT," + msgtodisplay);
                webphone_api.common.PutToDebugLog(2, "EVENT, New user creation SUCCEDED" + resp);
            }else
            {
                webphone_api.common.PutToDebugLog(1, "ERROR," + msgtodisplay);
                webphone_api.common.PutToDebugLog(2, "ERROR, New user creation failed, does not contain SUCCESSSTRING" + resp);
                if(msgtodisplay.length > 0) webphone_api.common.ShowToast(msgtodisplay);
                return;
            }
        }


        var userID = webphone_api.common.GetJsonParamVal(resp, "user_id:");
        if (webphone_api.common.isNull(userID) || userID.length < 1) { userID = webphone_api.common.GetJsonParamVal(resp, "userid:"); }
        if (!webphone_api.common.isNull(userID) && userID.length > 0)
        {
            webphone_api.common.SaveParameter("userid", userID);
        }

        var userid_begin = commonGetUrlParamVal(uri, "USERID_BEGIN");
        var userid_end = commonGetUrlParamVal(uri, "USERID_END");
        var username_begin = commonGetUrlParamVal(uri, "USERNAME_BEGIN");
        var username_end = commonGetUrlParamVal(uri, "USERNAME_END");
        var password_begin = commonGetUrlParamVal(uri, "PASSWORD_BEGIN");
        var password_end = commonGetUrlParamVal(uri, "PASSWORD_END");
        var callerid_begin = commonGetUrlParamVal(uri, "CALLERID_BEGIN");
        var callerid_end = commonGetUrlParamVal(uri, "CALLERID_END");
        var name_begin = commonGetUrlParamVal(uri, "NAME_BEGIN");
        var name_end = commonGetUrlParamVal(uri, "NAME_END");
        var email_begin = commonGetUrlParamVal(uri, "EMAIL_BEGIN");
        var email_end = commonGetUrlParamVal(uri, "EMAIL_END");

        var usr = "";
        var pwd = "";

        if (email_begin.length > 0 && email_end.length > 0 && resp.indexOf(email_begin) >= 0 && resp.indexOf(email_end) > 0)
        {
            var email = resp.substring(resp.indexOf(email_begin) + email_begin.length, resp.indexOf(email_end));

            webphone_api.common.SaveParameter("email", email);
            webphone_api.common.PutToDebugLog(2, "EVENT,newusersignup VerifyThreadHandler NEW email saved: " + email);
        }

        if (name_begin.length > 0 && name_end.length > 0 && resp.indexOf(name_begin) >= 0 && resp.indexOf(name_end) > 0)
        {
            var name = resp.substring(resp.indexOf(name_begin) + name_begin.length, resp.indexOf(name_end));

            webphone_api.common.SaveParameter("name", name);
            webphone_api.common.PutToDebugLog(2, "EVENT,newusersignup VerifyThreadHandler NEW name saved: " + name);
        }

        if (callerid_begin.length > 0 && callerid_end.length > 0 && resp.indexOf(callerid_begin) >= 0 && resp.indexOf(callerid_end) > 0)
        {
            var callerid = resp.substring(resp.indexOf(callerid_begin) + callerid_begin.length, resp.indexOf(callerid_end));

            webphone_api.common.SaveParameter("username", callerid);
            webphone_api.common.PutToDebugLog(2, "EVENT,newusersignup VerifyThreadHandler NEW callerid saved: " + callerid);
        }

        if (userid_begin.length > 0 && userid_end.length > 0 && resp.indexOf(userid_begin) >= 0 && resp.indexOf(userid_end) > 0)
        {
            var userid = resp.substring(resp.indexOf(userid_begin) + userid_begin.length, resp.indexOf(userid_end));

            webphone_api.common.SaveParameter("userid", userid);
            webphone_api.common.PutToDebugLog(2, "EVENT,newusersignup VerifyThreadHandler NEW userid saved: " + userid);
        }

        if (username_begin.length > 0 && username_end.length > 0 && resp.indexOf(username_begin) >= 0 && resp.indexOf(username_end) > 0)
        {
            usr = resp.substring(resp.indexOf(username_begin) + username_begin.length, resp.indexOf(username_end));
        }

        if (password_begin.length > 0 && password_end.length > 0 && resp.indexOf(password_begin) >= 0 && resp.indexOf(password_end) > 0)
        {
            pwd = resp.substring(resp.indexOf(password_begin) + password_begin.length, resp.indexOf(password_end));
        }

        // try to guess/find username in http answer; handle common cases
        if (webphone_api.common.isNull(usr) || usr.length < 1)
        {
            usr = webphone_api.common.GetJsonParamVal(resp, "sip_username");
            if (webphone_api.common.isNull(usr) || usr.length < 1) { usr = webphone_api.common.GetJsonParamVal(resp, "sipusername"); }
            if (webphone_api.common.isNull(usr) || usr.length < 1) { usr = webphone_api.common.GetJsonParamVal(resp, "username"); }
            if (webphone_api.common.isNull(usr)) { usr = ""; }
        }

        if (webphone_api.common.isNull(pwd) || pwd.length < 1)
        {
            pwd = webphone_api.common.GetJsonParamVal(resp, "sip_password");
            if (webphone_api.common.isNull(pwd) || pwd.length < 1) { pwd = webphone_api.common.GetJsonParamVal(resp, "sippassword"); }
            if (webphone_api.common.isNull(pwd) || pwd.length < 1) { pwd = webphone_api.common.GetJsonParamVal(resp, "password"); }
            if (webphone_api.common.isNull(pwd)) { pwd = ""; }
        }


        if (startverify === true)
        {
            // don't save username/password if it has to be verified
        }else
        {
            webphone_api.common.SaveParameter("username", usr);
            webphone_api.common.PutToDebugLog(2, "EVENT,newusersignup VerifyThreadHandler NEW username saved: " + usr);
        }
        if (startverify === true)
        {
            // don't save username/password if it has to be verified
        }else
        {
            webphone_api.common.SaveParameter("password", pwd);
            webphone_api.common.PutToDebugLog(2, "EVENT,newusersignup VerifyThreadHandler NEW password saved: " + pwd);
        }

//        if (webphone_api.common.isNull(usr) || usr.length < 1) usr = username;
//        if (webphone_api.common.isNull(pwd) || pwd.length < 1) pwd = password;

// start SmsCodeVerify

        if (startverify === true)
        {
            // close new user page
            if (webphone_api.common.NuIsWebPage())
            {
                webphone_api.$.mobile.changePage("#page_settings", { transition: "pop", role: "page" });
            }else
            {
                webphone_api.$.mobile.back();
            }

            webphone_api.global.intentsmscodeverify[0] = 'username=' + usr;
            webphone_api.global.intentsmscodeverify[1] = 'password=' + pwd;
            webphone_api.global.intentsmscodeverify[2] = 'smsverify_answer=' + resp;
            webphone_api.global.intentsmscodeverify[2] = 'smsverify_userid=' + userID;

            webphone_api.$.mobile.changePage("#page_smscodeverify", { transition: "pop", role: "page" });
        }else
        {
            // get and display success message if any
            if (!webphone_api.common.isNull(msgtodisplay) && msgtodisplay.length > 0)
            {
                webphone_api.common.PutToDebugLog(2, "EVENT, newusersignup threadHandler display status message: " + msgtodisplay);
                webphone_api.common.ShowToast(msgtodisplay);
            }
        
            if (webphone_api.common.NuIsWebPage())
            {
                webphone_api.$.mobile.changePage("#page_settings", { transition: "pop", role: "page" });
            }else
            {
                webphone_api.$.mobile.back();
            }
        }

        //if (actionHandler != null && actionHandler.equals("finishactivity")) NewUserSignup.instance.finish();
    }

    else if (actionHandler === 'get_new_user_countrylist')
    {
        //{"data": [{"c":"AF","n":"Afghanistan"},{"c":"AX","n":"Aland Islands"},{"c":"AL","n":"Albania"},{"c":"DZ","n":"Algeria"},...}
			
        if (resp.indexOf('HttpRequest exception') >= 0)
        {
            webphone_api.common.ShowToast("Can't load country list.");
            return;
        }
//BRANDSTART
        if (webphone_api.common.GetConfigInt('brandid', -1) === 50) // favafone
        {
            var jobj = JSON.parse(resp);

            var jarray = jobj.data;
            var error = jobj.error; // string

            if (!webphone_api.common.isNull(error) && error.length > 0)
            {
                    webphone_api.common.PutToDebugLog(3, 'ERROR, newuserreg get countrylist httpresponsehandler rec error: ' + error);
                    webphone_api.common.ShowToast(error);
                    return;
            }

            if (webphone_api.common.isNull(jarray) || jarray.length < 1)
            {
                    webphone_api.common.PutToDebugLog(3, 'ERROR, newuserreg get countrylist httpresponsehandler data is NULL');
                    webphone_api.common.ShowToast("Can't load country list.");
                    return;
            }

            countryNameL = [];
            countryCodeL = [];
            countryNameL.push(''); // add empty entry for default value
            countryCodeL.push(''); // add empty entry for default value

            for (var i = 0; i < jarray.length; i++)
            {
                jobj = jarray[i];
                if (webphone_api.common.isNull(jobj)) { continue; }
                if (webphone_api.common.isNull(jobj.n) || webphone_api.common.isNull(jobj.c)) { continue; }

                var name = jobj.n;
                var code = jobj.c;

                if (webphone_api.common.isNull(name)) { name  = ''; }

                countryNameL.push(name);
                countryCodeL.push(code);
            }
        }
//BRANDEND
        ctr_rec = true;
    }
    else if (actionHandler === 'get_new_user_form_fields')
    {
        formf = []; // form fields
	
//--{
//--"data": {
//--        "fields": [
//--        {
//--                "name": " firstname ",
//--                "displayName": "First name",
//--                "type": "text",
//--                "width": "100%",
//--                "value": "",
//--                "mandatory": true,
//--                "validation": ""
//--        }, {
//--                "name": " country ",
//--                "displayName": "Country",
//--                "type": "select",
//--                "width": "100%",
//--                "value": "api:settings\/countrieslist",
//--                "mandatory": true,
//--                "validation": ""
//--        }, {
//--                "name": " username ",
//--                "displayName": "Username",
//--                "type": "text",
//--                "width": "100%",
//--                "value": "",
//--                "mandatory": true,
//--                "validation": "api:clients\/usernameavailable"
//--        }, {
//--                "name": " email ",
//--                "displayName": "Email",
//--                "type": "email",
//--                "width": "100%",
//--                "value": "",
//--                "mandatory": true,
//--                "validation": "email"
//--        }, {
//--                "name": " promocode ",
//--                "displayName": "Promo code (optional)",
//--                "type": "text",
//--                "minlength": 8,
//--                "maxlength": 8,
//--                "width": "30%",
//--                "value": "",
//--                "mandatory": false,
//--                "validation": "api:settings\/promocodevalidation"
//--        }, {
//--                "name": " device ", // if possible send all available information for the device brand,
//--                model
//--                "type": "hidden"
//--        }, {
//--                "name": " dialer ", // android or ios
//--                "type": "hidden"
//--        }, {
//--                "name": " client_ip ", // if possible send remote client IP address
//--                "type": "hidden"
//--        }
//--        ],
//--        "action": "api:clients\/createaccount",
//--        "method": "post"
//--},
//--"error": ""
//--}
        
        if (typeof (resp) === 'string' && resp.indexOf('HttpRequest exception') >= 0)
        {
            webphone_api.common.ShowToast("Can't load fileds. Please try again later.");
            return;
        }
//BRANDSTART
        if (webphone_api.common.GetConfigInt('brandid', -1) === 50) // favafone
        {
            var jobj = JSON.parse(resp);

            var jarray = jobj.data;
            var error = jobj.error; // string
            
            
            var jdata = jobj.data;
            var error = jobj.error; // string

            if (!webphone_api.common.isNull(error) && error.length > 0)
            {
                    webphone_api.common.PutToDebugLog(3, 'ERROR, newuserreg httpresponsehandler rec error: ' + error);
                    webphone_api.common.ShowToast(error);
                    return;
            }

            if (webphone_api.common.isNull(jdata))
            {
                    webphone_api.common.PutToDebugLog(3, 'ERROR, newuserreg httpresponsehandler data is NULL');
                    webphone_api.common.ShowToast("Can't load form.");
                    return;
            }

            var jarray = jdata.fields;

            if (webphone_api.common.isNull(jarray) || jarray.length < 1) { return; }

            for (var i = 0; i < jarray.length; i++)
            {
                jobj = jarray[i];
                if (webphone_api.common.isNull(jobj)) { continue; }
                if (webphone_api.common.isNull(jobj['name']) || webphone_api.common.isNull(jobj['displayName']) || webphone_api.common.isNull(jobj['type']) || webphone_api.common.isNull(jobj['value'])
                         || webphone_api.common.isNull(jobj['mandatory']) || webphone_api.common.isNull(jobj['validation']))
                {
                    continue;
                }

                var name = jobj['name'];
                var displayName = jobj['displayName'];
                var type = jobj['type'];
                var defvalue = jobj['value'];
                var mandatory = jobj['mandatory'];
                var validation = jobj['validation'];


                webphone_api.common.PutToDebugLog(2, "name: " + name);
                webphone_api.common.PutToDebugLog(2, "displayName: " + displayName);
                webphone_api.common.PutToDebugLog(2, "type: " + type);
                webphone_api.common.PutToDebugLog(2, "defvalue: " + defvalue);
                webphone_api.common.PutToDebugLog(2, "mandatory: " + mandatory);
                webphone_api.common.PutToDebugLog(2, "validation: " + validation);
                webphone_api.common.PutToDebugLog(2, "----------------------------------");

                if (webphone_api.common.isNull(name)) { name = ''; }
                if (webphone_api.common.isNull(displayName)) { displayName = ''; }
                if (webphone_api.common.isNull(type)) { type = ''; }
                if (webphone_api.common.isNull(defvalue)) { defvalue = ''; }
                if (webphone_api.common.isNull(mandatory)) { mandatory = ''; }
                if (webphone_api.common.isNull(validation)) { validation = ''; }

                name = webphone_api.common.Trim(name);
                displayName = webphone_api.common.Trim(displayName);
                type = webphone_api.common.Trim(type);
                defvalue = webphone_api.common.Trim(defvalue);
                mandatory = webphone_api.common.Trim(mandatory);
                validation = webphone_api.common.Trim(validation);

                var item = [];
                
                item.push(name);
                item.push(displayName);
                item.push(type);
                item.push(defvalue);
                item.push(mandatory);
                item.push(validation);

                formf.push(item);
            }
        }
//BRANDEND
        PopulateDynamicFields();
    }
    else if (actionHandler === 'newuser_dynamic')
    {
        try{
//BRANDSTART
        if (webphone_api.common.GetConfigInt('brandid', -1) === 50) //-- favafone
        {
//--            {"data":{},"error":["Username already in use"]}
//--            {"data":{"AccountState":"0.10","Active":true,"FirstName":"Akos","LastName":"","Email":"akostest2@yahoo.com","Phone":"","Address":"","City":"","Zip":"","State":"","Country":"RO","Login":"akostest2","Password":"7200845369","CreationDate":"\/Date(1475067219000-0700)\/","AudioCodecs":[1,2,4,8,16,32,64,128,256],"CPPrefix":"","ClientNr":"","ClientType":32,"CompanyName":"","CurrencyId":1,"CurrencyName":"USD","CurrencySymbol":"$","DestinationDialingPlanPrefix":"00-> OR 011-> OR +-> OR 0011->","FaxCodecs":[],"GenerateInvoice":false,"IntraStateTariffId":-1,"InvoiceType":1,"IsPrepaid":true,"LastUsed":fal ...
        
            var jobj = JSON.parse(resp);

            var jdata = jobj.data;
            var error = jobj.error; // string

            if (!webphone_api.common.isNull(error) && error.length > 0)
            {
                    webphone_api.common.PutToDebugLog(3, 'ERROR, newuser_dynamic httpresponsehandler rec error: ' + error);
                    webphone_api.common.ShowToast(error);
                    return;
            }

            if (webphone_api.common.isNull(jdata))
            {
                    webphone_api.common.PutToDebugLog(3, 'ERROR, newuser_dynamic httpresponsehandler data is NULL');
                    webphone_api.common.ShowToast("Can't create user.");
                    return;
            }

            var new_usr = jdata.Login;
            var new_pwd = jdata.Password;
            
            if (webphone_api.common.isNull(new_usr)) { new_usr = ''; }
            if (webphone_api.common.isNull(new_pwd)) { new_pwd = ''; }
            
            webphone_api.common.SaveParameter('sipusername', new_usr);
            webphone_api.common.SaveParameter('password', new_pwd);
            
            if (new_usr.length > 0 && new_pwd.length > 0)
            {
                webphone_api.global.favafone_autologin = true;
            }

            webphone_api.$.mobile.back();
        }else
//BRANDEND
            webphone_api.common.PutToDebugLog(2, 'ERROR, _newuser: HttpResponseHandler newuser_dynamic parse resp NOT HANDLED');
        
        } catch(errin) { webphone_api.common.PutToDebugLogException(2, "_newuser: HttpResponseHandler newuser_dynamic parse resp", errin); }
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_newuser: HttpResponseHandler", err); }
}

function GetUriNU() // returns user http req uri or empty string
{
    try{
        var uri = webphone_api.common.GetParameter("newuser");
        if (webphone_api.common.isNull(uri) || uri.length < 1) { uri = webphone_api.common.GetParameter('newuserurl'); }
        if (webphone_api.common.isNull(uri)) uri = "";
        uri = decodeURIComponent(uri);

        return webphone_api.common.Trim(uri);

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_newuser: GetUriNU", err); }
    return "";
}

function GetUriSecondNU() // returns user http req second uri or empty string
{
    try{
        var uri = webphone_api.common.GetParameter("newuser_second");
        if (webphone_api.common.isNull(uri) || uri.length < 1)
        {
            uri = webphone_api.common.GetConfig('newuser_second');
            if (webphone_api.common.isNull(uri) || uri.length < 1)
            {
                var uri = webphone_api.common.GetParameter("newuserurl_second");
                if (webphone_api.common.isNull(uri) || uri.length < 1)
                {
                    uri = webphone_api.common.GetConfig('newuserurl_second');
                }
            }
        }



        if (webphone_api.common.isNull(uri)) uri = "";
        uri = decodeURIComponent(uri);

        return webphone_api.common.Trim(uri);

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_newuser: GetUriSecondNU", err); }
    return "";
}

function PopulateDynamicFields()
{
    var nu_html_content = '';
    try{
// dynamically get form fields
    var newuserform = webphone_api.common.GetConfig('newuserform');
    if (webphone_api.common.isNull(newuserform) || newuserform.length < 1) { return; }

    if (webphone_api.common.isNull(formf) || formf.length < 1)
    {
        webphone_api.common.PutToDebugLog(3, 'ERROR,newuserreg PopulateDynamicFields list is empty');
        return;
    }
    
    var textf_templ = 
            '<div id="nu_[ENTRYID]_container">' +
                '<span id="label_nu_[ENTRYID]">[LABEL]</span>' +
                '<input name="nu_[ENTRYID]" id="nu_[ENTRYID]" value="" type="text" autocapitalize="off">' +
            '</div>';
    var selectf_templ = 
            '<div id="nu_[ENTRYID]_container">' +
                '<span id="label_nu_[ENTRYID]">[LABEL]</span>' +
                '<select name="nu_[ENTRYID]" id="nu_[ENTRYID]" style="margin: 0;">[SELECTCONTENT]</select>' +
            '</div>';

    var item = null;
    for (var i = 0; i < formf.length; i++)
    {
        item = formf[i];
        if (webphone_api.common.isNull(item) || item.length < 4) { continue; }

        var name = item[FRM_NAME];
        var dispname = item[FRM_DISPNAME];
        var mandatory = item[FRM_MANDATORY];
        var type = item[FRM_TYPE];

// content
    // html form tag entry
        var entry = textf_templ;

        if (webphone_api.common.isNull(mandatory)) { mandatory = ''; }
        mandatory = mandatory.toString();
        if (!webphone_api.common.isNull(mandatory) && mandatory.length > 0)
        {
            mandatory = mandatory.toLowerCase();
            if (mandatory.indexOf('yes') >= 0 || mandatory.indexOf('true') >= 0 || mandatory.indexOf('1') >= 0)
            {
                dispname = '*' + dispname;
            }
        }
        
        if (webphone_api.common.isNull(type)) { type = ''; }
        type = webphone_api.common.Trim(type);

// text
        if (type.length < 1 || type === 'text' || type === 'email')
        {
            var id = 1000 + i;
            var idstr = id.toString();

            entry = webphone_api.common.ReplaceAll(entry, '[ENTRYID]', idstr);
            entry = entry.replace('[LABEL]', dispname);
            
            nu_html_content = nu_html_content + entry;
        }
// select
        else if (type === 'select')
        {
            entry = selectf_templ;
            var selitem_templ = '<option value="[VALUE]">[TEXT]</option>';
            
            var id = 1000 + i;
            var idstr = id.toString();
            
            entry = webphone_api.common.ReplaceAll(entry, '[ENTRYID]', idstr);
            entry = entry.replace('[LABEL]', dispname);
            
            var selcontent = '';
            if (name === 'country' && !webphone_api.common.isNull(countryNameL) && countryNameL.length > 0)
            {
                for (var j = 0; j < countryNameL.length; j++)
                {
                    var selitem = selitem_templ;
                    selitem = selitem.replace('[VALUE]', countryNameL[j]);
                    selitem = selitem.replace('[TEXT]', countryNameL[j]);
                    
                    selcontent = selcontent + selitem;
                }
            }
            
            entry = entry.replace('[SELECTCONTENT]', selcontent);
            
            nu_html_content = nu_html_content + entry;
        }

//--            // old style fields from XML
//--            TextView nu_label = (TextView) findViewById( CommonGUI.GetViewResId("nu_label_" + Integer.toString(i)) );
//--                    EditText nu_text = (EditText) findViewById( CommonGUI.GetViewResId("nu_text_" + Integer.toString(i)) );

//--                    nu_text.setHint(dispname);
//--                    if (mandatory != null && mandatory.length() > 0)
//--                    {
//--                            mandatory = mandatory.toLowerCase();
//--                            if (mandatory.indexOf("yes") >= 0 || mandatory.indexOf("true") >= 0 || mandatory.indexOf("1") >= 0)
//--                            {
//--                                    dispname = "*" + dispname;
//--                            }
//--                    }

//--                    nu_label.setText(dispname);
//--                    nu_label.setVisibility(View.VISIBLE);
//--                    nu_text.setVisibility(View.VISIBLE);
    }
    
    nu_html_content = '<form>' + nu_html_content + '</form>';
    webphone_api.$('#page_newuser_content').html(nu_html_content).trigger('create');
    MeasureNewuser();
    setTimeout(function () { MeasureNewuser(); }, 250);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_newuser: PopulateDynamicFields", err); }
}

function IframeOnLoad() // called every time the location (src) of the iframe changes
{
    try{
        if (webphone_api.common.NuIsWebPage())
        {
            var iframe = document.getElementById('iframe_nubrowser');
            var idocument = null;
            if (!webphone_api.common.isNull(iframe))
            {
                idocument = iframe.contentDocument || iframe.contentWindow.document;
            }

            var page = null;
            if (!webphone_api.common.isNull(idocument))
            {
                if (iframe.location && iframe.location.href)
                {
                    webphone_api.common.PutToDebugLog(2, 'EVENT, _newuser IframeOnLoad new location: ' + iframe.location.href);
                }

                var pageContent = '';
                if (typeof (idocument.documentElement) !== 'undefined' && idocument.documentElement !== null)
                {
                    if (typeof (idocument.documentElement.innerHTML) !== 'undefined' && idocument.documentElement.innerHTML !== null)
                    {
                        pageContent = idocument.documentElement.innerHTML.toString();
                        if (webphone_api.common.isNull(pageContent)) { pageContent = ''; }
                        pageContent = webphone_api.common.Trim(pageContent);

                        webphone_api.common.HandleNewUserResult(pageContent, idocument.documentElement);
                    }
                    else if (typeof (idocument.body.innerHTML) !== 'undefined' && idocument.body.innerHTML !== null)
                    {
                        pageContent = idocument.body.innerHTML.toString();
                        if (webphone_api.common.isNull(pageContent)) { pageContent = ''; }
                        pageContent = webphone_api.common.Trim(pageContent);

                        webphone_api.common.HandleNewUserResult(pageContent, idocument);
                    }

                    
                }
            }
        }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_newuser: IframeOnLoad", err); }
}

var MENUITEM_CLOSE = '#menuitem_newuser_close';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$( "#btn_newuser_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _newuser: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _newuser: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_CLOSE + '"><a data-rel="back">' + webphone_api.stringres.get('btn_cancel') + '</a></li>' ).listview('refresh');

    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_newuser: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#newuser_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#newuser_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_CLOSE:
                if (webphone_api.common.NuIsWebPage())
                {
                    webphone_api.$.mobile.changePage("#page_settings", { transition: "pop", role: "page" });
                }else
                {
                    webphone_api.$.mobile.back();
                }
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_newuser: MenuItemSelected", err); }
}

function onStop(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _newuser: onStop");
    webphone_api.global.isNewuserStarted = false;

    webphone_api.global.nuiswebpage = null;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_newuser: onStop", err); }
}

function onDestroy (event){} // deprecated by onstop


// public members and methods
return {
    onCreate: onCreate,
    onStart: onStart,
    onStop: onStop,
    onDestroy: onDestroy,

    HttpResponseHandler: HttpResponseHandler,
    GetUriSecondNU: GetUriSecondNU
};
})();