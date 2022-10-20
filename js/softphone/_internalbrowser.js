// Internal Browser page
webphone_api._internalbrowser = (function ()
{
var url = '';
var lastpage = '';
var pagetitle = '';

function onCreate (event) // called only once - bind events here
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _internalbrowser: onCreate");
    
    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_internalbrowser')
        {
            MeasureInternalbrowser();
        }
    });

    webphone_api.$('#internalbrowser_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_internalbrowser_menu").on("click", function() { CreateOptionsMenu('#internalbrowser_menu_ul'); });
    webphone_api.$("#btn_internalbrowser_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    
    webphone_api.$("#internalbrowser_btnback").on("click", function(e)
    {
        CloseBrowser();
        e.preventDefault();
    });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_internalbrowser: onCreate", err); }
}

function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _internalbrowser: onStart");
    webphone_api.global.isInternalbrowserStarted = true;
    
    webphone_api.$('#page_internalbrowser_content').html('');

    url = webphone_api.common.GetIntentParam(webphone_api.global.intentbrowser, 'url');
    lastpage = webphone_api.common.GetIntentParam(webphone_api.global.intentbrowser, 'lastpage');
    pagetitle = webphone_api.common.GetIntentParam(webphone_api.global.intentbrowser, 'title');

    if (!webphone_api.common.isNull(document.getElementById('internalbrowser_title')))
    {
        if (webphone_api.common.isNull(pagetitle)) { pagetitle = ''; }
        document.getElementById('internalbrowser_title').innerHTML = pagetitle;
    }
    webphone_api.$("#internalbrowser_title").attr("title", webphone_api.stringres.get("hint_page"));

    if (!webphone_api.common.isNull(document.getElementById('internalbrowser_btnback')))
    {
        document.getElementById('internalbrowser_btnback').innerHTML = '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("go_back_btn_txt");
    }
    
    MeasureInternalbrowser();
    
    if (webphone_api.common.isNull(lastpage))
    {
        lastpage = '';
    }else
    {
        lastpage = webphone_api.common.Trim(lastpage);
    }
    
    webphone_api.$("#page_internalbrowser").css("background", "#FFFFFF");
    
    OpenWebpage();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_internalbrowser: onStart", err); }
}

function MeasureInternalbrowser() // resolve window height size change
{
    try{
    //--var pgh = webphone_api.common.GetDeviceHeight() - 1; webphone_api.$('#page_internalbrowser').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_internalbrowser').css('min-height', 'auto'); // must be set when softphone is skin in div

    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#page_internalbrowser'), -30) );
    
    var heightTemp = webphone_api.common.GetDeviceHeight() - webphone_api.$("#internalbrowser_header").height();
    heightTemp = heightTemp - 3;
    heightTemp = Math.floor(heightTemp);
    webphone_api.$("#page_internalbrowser_content").height(heightTemp);
    
    webphone_api.$("#iframe_internalbrowser").width(webphone_api.common.GetDeviceWidth());
    webphone_api.$("#iframe_internalbrowser").height(heightTemp - 5);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_internalbrowser: MeasureInternalbrowser", err); }
}

function OpenWebpage()
{
    try{
    if (webphone_api.common.isNull(url) || url.length < 3 )
    {
        webphone_api.common.PutToDebugLog(3, 'ERROR, _internalbrowser no url to load: ' + url);
        return;
    }
    
    var width = webphone_api.common.GetDeviceWidth();
    var height = Math.floor( webphone_api.$('#page_internalbrowser_content').height() - 5);
    
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

        iframe = '<form id="internalb_post" target="iframe_internalbrowser" method="post" action="' + purl + '">' +
                    pdataInput +
                    '</form>' + 
                    '<iframe allow="microphone; camera" frameborder="0" width="' + width + '" height="' + height + '" name="iframe_internalbrowser" id="iframe_internalbrowser" style="margin:0px; padding:0px;" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"></iframe>' +
                    '<script type="text/javascript">' +
                        'document.getElementById("internalb_post").submit();' +
                    '</script>';
    }else
    {
//--        var iframe = '<iframe frameborder="0" width="' + width + '" height="' + height + '" src="' + url + '" name="iframe_internalbrowser" id="iframe_internalbrowser" style="margin:0px; padding:0px;"></iframe>';
        iframe = '<iframe allow="microphone *; camera *; autoplay *" allowfullscreen="true" frameborder="0" width="' + width + '" height="' + height + '" src="' + url + '" name="iframe_internalbrowser" id="iframe_internalbrowser" style="margin:0px; padding:0px;" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"></iframe>';
    }

    webphone_api.$('#page_internalbrowser_content').html(iframe);

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_internalbrowser: OpenWebpage", err); }
}

var MENUITEM_CLOSE = '#menuitem_internalbrowser_close';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE())
    {
        webphone_api.$( "#btn_internalbrowser_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _internalbrowser: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _internalbrowser: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_CLOSE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_close') + '</a></li>' ).listview('refresh');

    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_internalbrowser: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#internalbrowser_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#internalbrowser_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_CLOSE:
                CloseBrowser();
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_internalbrowser: MenuItemSelected", err); }
}

function CloseBrowser()
{
    try{
    if (lastpage.length < 2)
    {
        webphone_api.$.mobile.back();

        webphone_api.common.PutToDebugLog(5, 'EVENT, _internalbrowser: CloseBrowser back');
    }else
    {
        webphone_api.$.mobile.changePage("#" + lastpage, { transition: "pop", role: "page" });
        
        webphone_api.common.PutToDebugLog(5, 'EVENT, _internalbrowser: CloseBrowser changepage: ' + lastpage);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_internalbrowser: CloseBrowser", err); }
}

function onStop(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _internalbrowser: onStop");
    webphone_api.global.isInternalbrowserStarted = false;
    
    webphone_api.$('#page_internalbrowser_content').html('');
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_internalbrowser: onStop", err); }
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