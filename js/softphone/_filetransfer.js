// File transfer
webphone_api._filetransfer = (function ()
{

function onCreate (event) // called only once - bind events here
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _filetransfer: onCreate");
    
    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_filetransfer')
        {
            MeasureFiletransfer();
        }
    });

    webphone_api.$('#filetransfer_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_filetransfer_menu").on("click", function() { CreateOptionsMenu('#filetransfer_menu_ul'); });
    webphone_api.$("#btn_filetransfer_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    
    webphone_api.$("#btn_filetransfpick").on("click", function() { webphone_api.common.PickContact(PickContactResult); });
    webphone_api.$("#btn_filetransfpick").attr("title", webphone_api.stringres.get('hint_choosect'));
    
    webphone_api.$("#filetransfer_btnback").attr("title", webphone_api.stringres.get("hint_btnback"));
    
//--    webphone_api.$("#btn_filetransf").on("click", function(event) { SendFile(event); });
//--    webphone_api.$("#btn_filetransf").attr("title", webphone_api.stringres.get('hint_filetranf'));
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filetransfer: onCreate", err); }
}

var iframe = document.createElement('iframe');
var actionurl = '';
var lasttarget = '';
function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _filetransfer: onStart");
    webphone_api.global.isFiletransferStarted = true;


    if (!webphone_api.common.isNull(document.getElementById('filetransfer_title')))
    {
        document.getElementById('filetransfer_title').innerHTML = webphone_api.stringres.get("filetransf_title");
    }
    webphone_api.$("#filetransfer_title").attr("title", webphone_api.stringres.get("hint_page"));

    if (!webphone_api.common.isNull(document.getElementById('filetransfer_btnback')))
    {
        document.getElementById('filetransfer_btnback').innerHTML = '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("go_back_btn_txt");
    }
    
    var destination = webphone_api.common.GetIntentParam(webphone_api.global.intentfiletransfer, 'destination');
    if (webphone_api.common.isNull(destination)) { destination = ''; }
    if(destination.length < 1) destination = lasttarget;
    if (webphone_api.common.isNull(destination)) { destination = ''; }
    if(destination.length < 1) destination = webphone_api.common.GetParameter('lastchattarget');
    if (webphone_api.common.isNull(destination)) { destination = ''; }
    webphone_api.$('#filetransfpick_input').val(destination);
    
    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#filetransfer_header'), -30) );
    
    webphone_api.$("#filetransfpick_input").attr("placeholder", webphone_api.stringres.get("filetransfer_nr"));
    // set focus on destination
    setTimeout(function ()
    {
        var tovalTmp = webphone_api.$("#filetransfpick_input").val();
        if (webphone_api.common.isNull(tovalTmp) || (webphone_api.common.Trim(tovalTmp)).length < 1)
        {
            webphone_api.$("#filetransfpick_input").focus();
        }
    }, 100);
    
    actionurl = webphone_api.common.GetFiletrasnferFormActionUrl();
    var useurlshortener = webphone_api.common.GetParameterInt('useurlshortener', -1);
    var urlshortener_orig = webphone_api.common.GetParameter('urlshortener_orig');
    var urlshortener_replace = webphone_api.common.GetParameter('urlshortener_replace');

        if (isNull(urlshortener_orig) || urlshortener_orig.length < 1) { urlshortener_orig = 'https://www.mizu-voip.com/G'; }
        if (isNull(urlshortener_replace) || urlshortener_replace.length < 1) { urlshortener_replace = 'https://tinyurl.com/qm6oja3'; }

    if ((useurlshortener === -1 || useurlshortener === 1)
            && !webphone_api.common.isNull(urlshortener_orig) && urlshortener_orig.length > 0 && !webphone_api.common.isNull(urlshortener_replace) && urlshortener_replace.length > 0
            && actionurl.indexOf(urlshortener_orig) >= 0)
    {
            actionurl = actionurl.replace(urlshortener_orig, urlshortener_replace);
            if(actionurl.indexOf("https://rtc.mizu-voip.com/mvweb") >= 0)
            {
                actionurl = actionurl.replace('https://rtc.mizu-voip.com/mvweb', 'https://tinyurl.com/yxpz9ce2');
            }
    }

    webphone_api.common.PutToDebugLog(2, 'EVENT, filetransfer actionurl: ' + actionurl);
    
// add iframe
    iframe.style.background = 'transparent';
    iframe.style.border = '0';
    iframe.style.width = '100%';
    iframe.style.overflow = 'hidden';
    var html = '<body style="margin 0; padding 0; background: transparent; width: 100%; overflow:hidden; font-size: 1em; color: #cecece;">' +
                    '<style>' +
                        '#fileinput { padding: .6em; background: #ffffff; display: inline-block; width: 95%; border: .1em solid #b8b8b8; -webkit-border-radius: .15em; border-radius: .15em;' +
                                            'cursor: pointer; font-weight: bold; font-size: 1em; }' +

                        '#btn_filetransf { display: inline-block; margin-top: 1.5em; padding: .6em 2em .6em 2em; border: .1em solid #b8b8b8; -webkit-border-radius: .15em; border-radius: .15em;' +
                                            'cursor: pointer; font-weight: bold; font-size: 1em; background: #cccccc; }' +
                        '#btn_filetransf:hover { background: #ffffff; }' +
                    '</style>' +
                    '<form style=" width: 100%; margin: 0; padding: 0;" action="' + actionurl + '" method="post" enctype="multipart/form-data" id="frm_filetransf" name="frm_filetransf" onsubmit="return OnFormSubmit()">' +
                        '<input type="hidden" id="filepath" name="filepath" value="">' +
                        '<input name="filedata" type="file" id="fileinput" /><br />' +
                        '<input type="submit" id="btn_filetransf" value="' + webphone_api.stringres.get('btn_send') + '" title="' + webphone_api.stringres.get('hint_filetranf') + '" />' +
                        '<script>' +
                            'function OnFormSubmit(){' +
                                'var directory = document.getElementById("filepath").value;' +
                                'var filename = document.getElementById("fileinput").value;' +
                                'return parent.webphone_api._filetransfer.FileTransferOnSubmit(directory, filename);' +
                            '}' +
                        '</script>' +
                    '</form>' +
                '</body>';
//--    document.body.appendChild(iframe);
    document.getElementById('ftranf_iframe_container').appendChild(iframe);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html);
    iframe.contentWindow.document.close();
    iframe.onload = function (evt) { FileUploaded(evt); };
    
    var ifrmDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    setTimeout(function ()
    {
    // fallback for IE7, IE8 addEventListener
        if (ifrmDoc.addEventListener)
        {
            ifrmDoc.addEventListener('click', HandleEventFiletransferStart, false);
        }
        else if (ifrmDoc.attachEvent)
        {
            ifrmDoc.attachEvent('click', HandleEventFiletransferStart);
        }
        
        function HandleEventFiletransferStart(event)
        {
            var dest = document.getElementById('filetransfpick_input').value;

            if (webphone_api.common.isNull(dest) || (webphone_api.common.Trim(dest)).length < 1)
            {
                event.preventDefault();
                webphone_api.$("#filetransfpick_input").focus();
                webphone_api.common.ShowToast(webphone_api.stringres.get('filetransf_err'));
                return;
            }else
            {
                // set userguid (directory name)
                var filepath = webphone_api.common.GetTransferDirectoryName(dest);
                ifrmDoc.getElementById('filepath').value = filepath;
                
                webphone_api.common.PutToDebugLog(4, 'EVENT, filetransfer directory: ' + filepath);
            }
        }
    }, 150);
    
    MeasureFiletransfer();

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filetransfer: onStart", err); }
}

// called from iframe -> for onsubmit
var transf_initiated = false;
function FileTransferOnSubmit(directory, filename)
{
    try{
    webphone_api.common.PutToDebugLog(4, 'EVENT, FileTransferOnSubmit called from iframe form');
    webphone_api.common.PutToDebugLog(4, 'EVENT, FileTransferOnSubmit directory: ' + directory + '; filename: ' + filename);
    
//--    FileTransferOnSubmit directory: 0ecf34d0bd5c69f07b6fa8b654d80a74; filename: C:\fakepath\webphonejar_parameters.txt
    
    if (webphone_api.common.isNull(directory)) { directory = ''; } else { directory = '/' + directory; }
    if (webphone_api.common.isNull(filename) || filename.length < 1)
    {
        webphone_api.common.PutToDebugLog(3, 'ERROR, FileTransfer send failed: ivalid filename: ' + filename);
        webphone_api.common.ShowToast(webphone_api.stringres.get('fitransf_failed'));
        return false;
    }
    
    var pos = filename.lastIndexOf('/');
    if (pos >= 0) { filename = filename.substring(pos + 1, filename.length); }
    pos = filename.lastIndexOf('\\');
    if (pos >= 0) { filename = filename.substring(pos + 1, filename.length); }
    
// the path of the uploaded file on the server
    var transferpath = actionurl + 'filestorage' + directory + '/' + webphone_api.common.NormalizeFilename(filename);
    webphone_api.common.PutToDebugLog(4, 'EVENT, FileTransferOnSubmit filepath: ' + transferpath);
    
    webphone_api.$('#ftranf_status').html(webphone_api.stringres.get('ftrnasf_status_processing'));
    
//--     go back one step in history, otherwise <Back must be clicked 2 times to close the window
//--   setTimeout(function ()
//--    {
//--        webphone_api.$.mobile.back();
//--        webphone_api.common.ShowToast(webphone_api.stringres.get('fitransf_succeded'));
//--    }, 1500);
    
// send chat to destination
    var ahref = '<a href="' + transferpath + '" target="_blank">' + webphone_api.common.NormalizeFilename(filename) + '</a>';
    var msg = '[DONT_START_CHAT_WINDOW]' + webphone_api.common.GetSipusername() + ' ' + webphone_api.stringres.get('fitransf_chat') + ': ' + ahref;
    
    var to = webphone_api.common.Trim(document.getElementById('filetransfpick_input').value);
    lasttarget = to;
    webphone_api.common.SaveParameter('lastchattarget',to);

    
    webphone_api.sendchat(to, msg);
    transf_initiated = true;
    
    if (webphone_api.common.GetBrowser() === 'Firefox')
    {
        if (!webphone_api.common.isNull(iframe))
        {
            document.getElementById('ftranf_iframe_container').removeChild(iframe);
        }
        FileUploaded(null);
        return false;
    }else
    {
        return true;
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filetransfer:  FileTransferOnSubmit", err); }
    return false;
}

function FileUploaded(evt) // actually it's called on iframe.onload
{
    try{
    if (transf_initiated === false) { return; }
    transf_initiated = false;
    
    webphone_api.$('#ftranf_status').html(webphone_api.stringres.get('ftrnasf_status_waiting'));
    
    // go back one step in history, otherwise <Back must be clicked 2 times to close the window
    setTimeout(function ()
    {
        webphone_api.$.mobile.back();
    }, 500);

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filetransfer:  FileUploaded", err); }
}

function MeasureFiletransfer() // resolve window height size change
{
    try{
//--    var pgh = webphone_api.common.GetDeviceHeight() - 1; webphone_api.$('#page_filetransfer').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_filetransfer').css('min-height', 'auto'); // must be set when softphone is skin in div

    webphone_api.$("#page_filetransfer_content").height(webphone_api.common.GetDeviceHeight() - webphone_api.$("#filetransfer_header").height() - 2);
//--    webphone_api.$("#log_text").height(webphone_api.common.GetDeviceHeight() - webphone_api.$("#filetransfer_header").height() - webphone_api.$("#sendtosupport_container").height() - 5);
//--    webphone_api.$("#log_text").width(webphone_api.common.GetDeviceWidth());

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filetransfer: MeasureFiletransfer", err); }
}

function PickContactResult(number)
{
    try{
    document.getElementById('filetransfpick_input').value = number;
//--    webphone_api.$("#msg_textarea").focus();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filetransfer: PickContactResult", err); }
}

var MENUITEM_FILETRANSFER_CLOSE = '#menuitem_filetransfer_close';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.GetParameter('devicetype') === webphone_api.common.DEVICE_WIN_SOFTPHONE())
    {
        webphone_api.$( "#btn_filetransfer_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _filetransfer: CreateOptionsMenu menuid null"); return false; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _filetransfer: CreateOptionsMenu can't get reference to Menu"); return false; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_FILETRANSFER_CLOSE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_close') + '</a></li>' ).listview('refresh');

    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filetransfer: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#filetransfer_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#filetransfer_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_FILETRANSFER_CLOSE:
                webphone_api.$.mobile.back();
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filetransfer: MenuItemSelected", err); }
}

function onStop(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _filetransfer: onStop");
    webphone_api.global.isFiletransferStarted = false;
    
    if (!webphone_api.common.isNull(iframe))
    {
        document.getElementById('ftranf_iframe_container').removeChild(iframe);
    }
    document.getElementById('filetransfpick_input').value = '';
    webphone_api.$('#ftranf_status').html('');
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filetransfer: onStop", err); }
}

function onDestroy (event){} // deprecated by onstop


// public members and methods
return {
    onCreate: onCreate,
    onStart: onStart,
    onStop: onStop,
    onDestroy: onDestroy,
    FileTransferOnSubmit: FileTransferOnSubmit
};
})();