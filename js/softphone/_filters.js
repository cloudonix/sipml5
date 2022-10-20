// Filters page
webphone_api._filters = (function ()
{

var filterL = null; // [ [40,00,6,12],[+40,,5,10] ]

function onCreate (event) // called only once - bind events here
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _filters: onCreate");

    webphone_api.$('#filters_list').on('click', '.ch_anchor', function(event)
    {
        OnListItemClick(webphone_api.$(this).attr('id'));
    });

    webphone_api.$('#filters_list').on('click', '.ch_menu', function(event)
    {
        OnListItemClick(webphone_api.$(this).attr('id'));
    });
    
    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_filters')
        {
            MeasureFilterslist();
        }
    });
    
    webphone_api.$('#filters_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_filters_menu").on("click", function() { CreateOptionsMenu('#filters_menu_ul'); });
    webphone_api.$("#btn_filters_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    
    webphone_api.$("#btn_add_filters").on("click", function() { AddFilter(false, null); });

    webphone_api.$( "#page_filters" ).keyup(function( event )
    {   
        HandleKeyUp(event);
    });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filters: onCreate", err); }
}

function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _filters: onStart");
    webphone_api.global.isFiltersStarted = true;

    setTimeout(function() // otherwise keyup will not work, because the element is not focused
    {
        webphone_api.$("#page_filters").focus();
    }, 100);
    
    //--webphone_api.$("#phone_number").attr("placeholder", webphone_api.stringres.get("phone_nr"));

    if (!webphone_api.common.isNull(document.getElementById('filters_title')))
    {
        document.getElementById('filters_title').innerHTML = webphone_api.stringres.get('filters_title');
    }
    webphone_api.$("#filters_title").attr("title", webphone_api.stringres.get("hint_page"));
    webphone_api.$("#filters_label_add").html(webphone_api.stringres.get("filters_add_label"));
    
    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#page_filters'), -30) );
    
    if (!webphone_api.common.isNull(document.getElementById('filters_btnback')))
    {
        document.getElementById('filters_btnback').innerHTML = '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get("go_back_btn_txt");
    }
    
// needed for proper display and scrolling of listview
    MeasureFilterslist();
    
    // fix for IE 10
    if (webphone_api.common.IsIeVersion(10)) { webphone_api.$("#filters_list").children().css('line-height', 'normal'); }

    PopulateList();

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filters: onStart", err); }
}

function MeasureFilterslist() // resolve window height size change
{
    try{
    //--var pgh = webphone_api.common.GetDeviceHeight() - 1; webphone_api.$('#page_filters').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    webphone_api.$('#page_filters').css('min-height', 'auto'); // must be set when softphone is skin in div
    
// handle page height
    var heightTemp = webphone_api.common.GetDeviceHeight() - webphone_api.$("#filters_header").height() - webphone_api.$("#filters_add_section").height();
    var margin = webphone_api.common.StrToIntPx( webphone_api.$("#filters_add_section").css("margin-top") ) + webphone_api.common.StrToIntPx( webphone_api.$("#filters_add_section").css("margin-bottom") );

    heightTemp = heightTemp - margin - 3;
    webphone_api.$("#filters_list").height(heightTemp);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filters: MeasureFilterslist", err); }
}

function PopulateList() // :no return value;  // onlyonserver: display only contacts on server. Controlled by toggle button
{
    try{
    if ( webphone_api.common.isNull(document.getElementById('filters_list')) )
    {
        webphone_api.common.PutToDebugLog(2, "ERROR, _filters: PopulateList listelement is null");
        return;
    }
    
    ReadFilters();
    var listview = '';
    
    if (webphone_api.common.isNull(filterL) || filterL.length < 1)
    {
        webphone_api.$('#filters_list').html('');
        webphone_api.$('#filters_list').append(listview).listview('refresh');
        webphone_api.common.PutToDebugLog(2, "EVENT, _filters: PopulateList no filters to display");
        return;
    }
    
    var template = '' +
            '<li data-theme="b">' +
                '<a id="filteritem_[FID]" class="ch_anchor mlistitem" title="' + webphone_api.stringres.get('filter_edit_hint') + '">' +
                    '<div class="item_container">' +
                        '<div class="r_what">' + webphone_api.stringres.get('filter_start') + ': <span>[WHAT]</span></div>' +
                        '<div class="r_with">' + webphone_api.stringres.get('filter_replace') + ': <span>[WITH]</span></div>' +
                        '<div class="r_minlen">' + webphone_api.stringres.get('filter_minlen') + ': <span>[MINL]</span></div>' +
                        '<div class="r_maxlen">' + webphone_api.stringres.get('filter_maxlen') + ': <span>[MAXL]</span></div>' +
                    '</div>' + 
                '</a>' +
                '<a id="filtermenu_[FID]" class="ch_menu mlistitem">' + webphone_api.stringres.get('filter_delete_hint') + '</a>' +
            '</li>';
    
    for (var i = 0; i < filterL.length; i++)
    {
        var one = filterL[i];
        
        if (webphone_api.common.isNull(one[webphone_api.common.F_WHAT])) { one[webphone_api.common.F_WHAT] = ''; }
        if (webphone_api.common.isNull(one[webphone_api.common.F_WITH])) { one[webphone_api.common.F_WITH] = ''; }
        if (webphone_api.common.isNull(one[webphone_api.common.F_MIN])) { one[webphone_api.common.F_MIN] = ''; }
        if (webphone_api.common.isNull(one[webphone_api.common.F_MAX])) { one[webphone_api.common.F_MAX] = ''; }
        
        var htmlitem = webphone_api.common.ReplaceAll(template, '[FID]', i.toString());
        htmlitem = htmlitem.replace('[WHAT]', one[webphone_api.common.F_WHAT]);
        htmlitem = htmlitem.replace('[WITH]', one[webphone_api.common.F_WITH]);
        htmlitem = htmlitem.replace('[MINL]', one[webphone_api.common.F_MIN]);
        htmlitem = htmlitem.replace('[MAXL]', one[webphone_api.common.F_MAX]);
        
        listview = listview + htmlitem;
    }
    
    webphone_api.$('#filters_list').html('');
    webphone_api.$('#filters_list').append(listview).listview('refresh');
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filters: PopulateList", err); }
}

var trigerredlist = false; // handle multiple clicks
function OnListItemClick (id) // :no return value
{
    try{
        
    if (trigerredlist) { return; }
    
    trigerredlist = true;
    setTimeout(function ()
    {
        trigerredlist = false;
    }, 1000);
    
    if (webphone_api.common.isNull(id) || id.length < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _filters OnListItemClick id is NULL');
        return;
    }
    
    var fid = '';
    var pos = id.indexOf('_');
    if (pos < 2)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _filters OnListItemClick invalid id');
        return;
    }
    
    fid = webphone_api.common.Trim(id.substring(pos + 1));
    var idint = 0;
    
    try{
        idint = webphone_api.common.StrToInt( webphone_api.common.Trim(fid) );

    } catch(errin1) { webphone_api.common.PutToDebugLogException(2, "_filters: OnListItemClick convert fid", errin1); }
    
    if (id.indexOf('filteritem') === 0) // means edit rule
    {
        AddFilter(true, idint)
    }
    else if (id.indexOf('filtermen') === 0) // (menu) in this case delete rule
    {
        DeleteFilter(idint);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filters: OnListItemClick", err); }
}

function AddFilter(isedit, fid, popupafterclose)
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
    
    var fwhat_init = '';
    var fwith_init = '';
    var minl_init = '';
    var maxl_init = '';
    
    if (isedit === true && !webphone_api.common.isNull(fid) && webphone_api.common.IsNumber(fid))
    {
        var edititem = filterL[fid];
        
        fwhat_init = edititem[webphone_api.common.F_WHAT];
        fwith_init = edititem[webphone_api.common.F_WITH];
        minl_init = edititem[webphone_api.common.F_MIN];
        maxl_init = edititem[webphone_api.common.F_MAX];
        
        if (webphone_api.common.isNull(fwhat_init)) { fwhat_init = ''; }
        if (webphone_api.common.isNull(fwith_init)) { fwith_init = ''; }
        if (webphone_api.common.isNull(minl_init)) { minl_init = ''; }
        if (webphone_api.common.isNull(maxl_init)) { maxl_init = ''; }
    }
    
    var template = '' +
'<div id="filter_popup" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="width:' + popupWidth + 'px; max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('filters_add_rule') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content" style="padding: 0; margin: 0; width: 100%;">' +
        
        '<div class="filter_left_container">'+
            '<label style="width: 100%">' + webphone_api.stringres.get('filter_start') + ':</label>' +
        '</div>' +
        '<div class="filter_right_container">' +
            '<input name="filter_what" id="filter_what" data-highlight="true" data-mini="true" value="' + fwhat_init + '" type="text" autocapitalize="off">' +
        '</div>' +
        
        '<div class="filter_left_container">'+
            '<label style="width: 100%">' + webphone_api.stringres.get('filter_replace') + ':</label>' +
        '</div>' +
        '<div class="filter_right_container">' +
            '<input name="filter_with" id="filter_with" data-highlight="true" data-mini="true" value="' + fwith_init + '" type="text" autocapitalize="off">' +
        '</div>' +
        
        '<div class="filter_left_container">'+
            '<label style="width: 100%">' + webphone_api.stringres.get('filter_minlen') + ':</label>' +
        '</div>' +
        '<div class="filter_right_container">' +
            '<input name="filter_min" id="filter_min" data-highlight="true" data-mini="true" value="' + minl_init + '" type="text" autocapitalize="off">' +
        '</div>' +
        
        '<div class="filter_left_container">'+
            '<label style="width: 100%">' + webphone_api.stringres.get('filter_maxlen') + ':</label>' +
        '</div>' +
        '<div class="filter_right_container">' +
            '<input name="filter_max" id="filter_max" data-highlight="true" data-mini="true" value="' + maxl_init + '" type="text" autocapitalize="off">' +
        '</div>' +

//        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back">' + webphone_api.stringres.get('btn_close') + '</a>' +
//        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" data-transition="flow">Delete</a>' +
    '</div>' +
    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
        '<a href="javascript:;" id="adialog_positive" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_ok') + '</a>' +
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
    
    
    webphone_api.$.mobile.activePage.find(".messagePopup").popup().popup("open").bind(
    {
        popupafterclose: function ()
        {
            webphone_api.$(this).unbind("popupafterclose").remove();
            popupafterclose();
        }
    });
    
    webphone_api.$('#adialog_positive').on('click', function (event)
    {
        webphone_api.common.PutToDebugLog(5,"EVENT, _filters AddFilter ok on click");
        
        var fwhat = webphone_api.$('#filter_what').val();
        var fwith = webphone_api.$('#filter_with').val();
        var minl = webphone_api.$('#filter_min').val();
        var maxl = webphone_api.$('#filter_max').val();
        
        if (webphone_api.common.isNull(fwhat)) { fwhat = ''; }
        if (webphone_api.common.isNull(fwith)) { fwith = ''; }
        if (webphone_api.common.isNull(minl)) { minl = ''; }
        if (webphone_api.common.isNull(maxl)) { maxl = ''; }
        
        fwhat = webphone_api.common.Trim(fwhat);
        fwith = webphone_api.common.Trim(fwith);
        minl = webphone_api.common.Trim(minl);
        maxl = webphone_api.common.Trim(maxl);
        
        fwhat = webphone_api.common.ReplaceAll(fwhat, ',', '_');     fwhat = webphone_api.common.ReplaceAll(fwhat, ';', '_');
        fwith = webphone_api.common.ReplaceAll(fwith, ',', '_');     fwith = webphone_api.common.ReplaceAll(fwith, ';', '_');
        if (!webphone_api.common.IsNumber(minl)) { minl = ''; }
        if (!webphone_api.common.IsNumber(maxl)) { maxl = ''; }
        
        if (fwhat.length < 1 && fwith.length < 1)
        {
            webphone_api.common.ShowToast(webphone_api.stringres.get('filter_warning'));
            return;
        }
        
        // add filter to list
        var item = [];
        item[webphone_api.common.F_WHAT] = fwhat;
        item[webphone_api.common.F_WITH] = fwith;
        item[webphone_api.common.F_MIN] = minl;
        item[webphone_api.common.F_MAX] = maxl;
        
        if (isedit === true && !webphone_api.common.isNull(fid) && webphone_api.common.IsNumber(fid))
        {
            filterL[fid] = item;
        }else
        {
            filterL.push(item);
        }
        
        SaveFilters();
        
        PopulateList();
    });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filters: AddFilter", err); }
}

function DeleteFilter(fid)
{
    try{
    if (webphone_api.common.isNull(fid) || !webphone_api.common.IsNumber(fid) || fid < 0 || fid >= filterL.length)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, _filters: DeleteFilter invalid id: ' + fid);
        return;
    }
    
    filterL.splice(fid, 1);
    
    SaveFilters();
    PopulateList();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filters: DeleteFilter", err); }
}

function ReadFilters()
{
    try{
    var fval = webphone_api.common.GetParameter2('filters');
/*
    fval = '40,00,6,12;+40,,5,10';
*/

    filterL = [];
    if (webphone_api.common.isNull(fval) || fval.length < 1)
    {
        webphone_api.common.PutToDebugLog(3, 'ReadFilters, nothing to read');
        return;
    }
    
    var itemsL = fval.split(';');
    
    if (webphone_api.common.isNull(itemsL) || itemsL.length < 1) { return; }
    
    for (var i = 0; i < itemsL.length; i++)
    {
        if (webphone_api.common.isNull(itemsL[i]) || itemsL[i].length < 3) { continue; }
        var oneitem = itemsL[i].split(',');
        
        if (webphone_api.common.isNull(oneitem) || oneitem.length !== 4) { continue; }
        
        filterL.push(oneitem);
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filters: ReadFilters", err); }
}

function SaveFilters()
{
    try{
    if (webphone_api.common.isNull(filterL))
    {
        webphone_api.common.PutToDebugLog(3, 'SaveFilters, nothing to save');
        return;
    }
    
    var fval = '';
    for (var i = 0; i < filterL.length; i++)
    {
        var item = filterL[i];
        if (webphone_api.common.isNull(item) || item.length < 3) { continue; }
        
        if (fval.length > 0) { fval = fval + ';'; }
        
        fval = fval + item[webphone_api.common.F_WHAT] + ',' + item[webphone_api.common.F_WITH] + ',' + item[webphone_api.common.F_MIN] + ',' + item[webphone_api.common.F_MAX];
    }
    
    if (webphone_api.common.isNull(fval)) { fval = ''; }
    
    webphone_api.common.SaveParameter('filters', fval);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filters: SaveFilters", err); }
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
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filters: HandleKeyUp", err); }
}

var MENUITEM_FILTERS_CLOSE = '#menuitem_filters_close';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$( "#btn_filters_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _filters: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _filters: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_FILTERS_CLOSE + '"><a data-rel="back">' + webphone_api.stringres.get('menu_close') + '</a></li>' ).listview('refresh');

    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filters: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#filters_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#filters_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_FILTERS_CLOSE:
                webphone_api.$.mobile.back();
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filters: MenuItemSelected", err); }
}

function onStop(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _filters: onStop");
    webphone_api.global.isFiltersStarted = false;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_filters: onStop", err); }
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