// Start page
webphone_api._startpage = (function ()
{
var url = '';
var lastpage = '';
var pagetitle = '';
var text = '';
var type = 0;

function onCreate (event) // called only once - bind events here
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _startpage: onCreate");
    
    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_startpage')
        {
            MeasureStartpage();
        }
    });

    webphone_api.$('#startpage_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_startpage_menu").on("click", function() { CreateOptionsMenu('#startpage_menu_ul'); });
    webphone_api.$("#btn_startpage_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    
    webphone_api.$("#startpage_btnback").on("click", function(e)
    {
        ClosePage();
        e.preventDefault();
    });
    
    webphone_api.$("#btn_sp_decline").on("click", function()
    {
        webphone_api.common.PutToDebugLog(5, "EVENT, _startpage: button decline onclick");
        ClosePage();
        webphone_api.common.OpenSettings(true, 15);
    });
    
    webphone_api.$("#btn_sp_accept").on("click", function()
    {
        try{
            webphone_api.common.PutToDebugLog(5, 'EVENT, _startpage: button accept onclick');
            
            var startpage_disp_count = webphone_api.common.GetParameterInt('startpage_disp_count', 0);
            startpage_disp_count++;
            webphone_api.common.SaveParameter('startpage_disp_count', startpage_disp_count.toString());
            
            ClosePage();

        } catch(err) { webphone_api.common.PutToDebugLogException(2, "_startpage: onCreate", err); }
    });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_startpage: onCreate", err); }
}

function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _startpage: onStart");
    webphone_api.global.isStartpageStarted = true;
    
    webphone_api.$('#page_startpage_content').html('');

    url = webphone_api.common.GetIntentParam(webphone_api.global.intentstartpage, 'url');
    lastpage = webphone_api.common.GetIntentParam(webphone_api.global.intentstartpage, 'lastpage');
    pagetitle = webphone_api.common.GetIntentParam(webphone_api.global.intentstartpage, 'title');
    text = webphone_api.common.GetIntentParam(webphone_api.global.intentstartpage, 'text');
    var typeStr = webphone_api.common.GetIntentParam(webphone_api.global.intentstartpage, 'type');
    if (!webphone_api.common.isNull(typeStr) && webphone_api.common.IsNumber(typeStr))
    {
        type = webphone_api.common.StrToInt(typeStr);
    }

    if (!webphone_api.common.isNull(document.getElementById('startpage_title')))
    {
        if (webphone_api.common.isNull(pagetitle)) { pagetitle = ''; }
        document.getElementById('startpage_title').innerHTML = pagetitle;
    }
    webphone_api.$("#startpage_title").attr("title", webphone_api.stringres.get("hint_page"));

    if (!webphone_api.common.isNull(document.getElementById('startpage_btnback')))
    {
        document.getElementById('startpage_btnback').innerHTML = '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("go_back_btn_txt");
    }
    
    MeasureStartpage();
    
    if (webphone_api.common.isNull(lastpage))
    {
        lastpage = '';
    }else
    {
        lastpage = webphone_api.common.Trim(lastpage);
    }
    
    webphone_api.$("#page_startpage").css("background", "#FFFFFF");
    
    
// 0: display once with OK button, 1: display once with confirmation, 2: display always
    if (type === 2)
    {
        webphone_api.$("#btn_sp_accept").attr("title", webphone_api.stringres.get("btn_ok"));
        webphone_api.$("#btn_sp_decline").hide();
        webphone_api.$("#startpage_btnback").show();
    }
    else if (type === 1)
    {
        webphone_api.$("#btn_sp_accept").attr("title", webphone_api.stringres.get("btn_accept"));
        webphone_api.$("#btn_sp_decline").attr("title", webphone_api.stringres.get("btn_decline"));
        webphone_api.$("#btn_sp_decline").show();
        webphone_api.$("#startpage_btnback").hide();
    }
    else
    {
        webphone_api.$("#btn_sp_accept").attr("title", webphone_api.stringres.get("btn_ok"));
        webphone_api.$("#btn_sp_decline").hide();
        webphone_api.$("#startpage_btnback").show();
    }


    if (text.length > 5)
    {
        webphone_api.$('#page_startpage_content').html('<div style="text-align: left; margin: .5em;">' +text + '</div>');
        return;
    }
    else if (!webphone_api.common.isNull(url) && url.length > 0)
    {
        OpenWebpage();
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_startpage: onStart", err); }
}

function MeasureStartpage() // resolve window height size change
{
    try{
    //--var pgh = webphone_api.common.GetDeviceHeight() - 1; webphone_api.$('#page_startpage').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_startpage').css('min-height', 'auto'); // must be set when softphone is skin in div

    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#page_startpage'), -30) );
    
    var heightTemp = webphone_api.common.GetDeviceHeight() - webphone_api.$("#startpage_header").height() - webphone_api.$("#startpage_footer").height() - webphone_api.$(".separator_line_thick").height() - 2;

    heightTemp = heightTemp - 3;
    heightTemp = Math.floor(heightTemp);
    webphone_api.$("#page_startpage_content").height(heightTemp);
    
    webphone_api.$("#iframe_startpage").width(webphone_api.common.GetDeviceWidth());
    webphone_api.$("#iframe_startpage").height(heightTemp - 5);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_startpage: MeasureStartpage", err); }
}

function OpenWebpage()
{
    try{
    if (webphone_api.common.isNull(url) || url.length < 3 )
    {
        webphone_api.common.PutToDebugLog(3, 'ERROR, _startpage no url to load: ' + url);
        return;
    }
    
    var width = webphone_api.common.GetDeviceWidth();
    var height = Math.floor( webphone_api.$('#page_startpage_content').height() - 5);
    
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

        iframe = '<form id="internalb_post" target="iframe_startpage" method="post" action="' + purl + '">' +
                    pdataInput +
                    '</form>' + 
                    '<iframe allow="microphone *; camera *; autoplay *" allowfullscreen="true" frameborder="0" width="' + width + '" height="' + height + '" name="iframe_startpage" id="iframe_startpage" style="margin:0px; padding:0px;" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"></iframe>' +
                    '<script type="text/javascript">' +
                        'document.getElementById("internalb_post").submit();' +
                    '</script>';
    }else
    {
//--        var iframe = '<iframe frameborder="0" width="' + width + '" height="' + height + '" src="' + url + '" name="iframe_startpage" id="iframe_startpage" style="margin:0px; padding:0px;"></iframe>';
        iframe = '<iframe style="margin:0px; padding:0px; overflow-x: hidden; overflow-y: auto;" allow="microphone *; camera *; autoplay *" allowfullscreen="true" frameborder="0" width="' + width + '" height="' + height + '" src="' + url + '" name="iframe_startpage" id="iframe_startpage" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"></iframe>';
    }

    webphone_api.$('#page_startpage_content').html(iframe);

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_startpage: OpenWebpage", err); }
}

var MENUITEM_CLOSE = '#menuitem_startpage_close';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE())
    {
        webphone_api.$( "#btn_startpage_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _startpage: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _startpage: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_CLOSE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_close') + '</a></li>' ).listview('refresh');

    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_startpage: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#startpage_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#startpage_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_CLOSE:
                ClosePage();
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_startpage: MenuItemSelected", err); }
}

function ClosePage()
{
    try{
    if (lastpage.length < 2)
    {
        webphone_api.$.mobile.back();

        webphone_api.common.PutToDebugLog(5, 'EVENT, _startpage: ClosePage back');
    }else
    {
        webphone_api.$.mobile.changePage("#" + lastpage, { transition: "pop", role: "page" });
        
        webphone_api.common.PutToDebugLog(5, 'EVENT, _startpage: ClosePage changepage: ' + lastpage);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_startpage: ClosePage", err); }
}

function onStop(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _startpage: onStop");
    webphone_api.global.isStartpageStarted = false;
    
    webphone_api.$('#page_startpage_content').html('');
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_startpage: onStop", err); }
}

// public members and methods
return {
    onCreate: onCreate,
    onStart: onStart,
    onStop: onStop
};
})();