/* global webphone_api.$, common */

// Customizable page: extra1
webphone_api._extra1 = (function ()
{

/** Page navigation can be done by calling jQuery mobile "changePage()" method: 
webphone_api.$.mobile.changePage("#PAGE_ID", { transition: "none", role: "page" });
Example: webphone_api.$.mobile.changePage("#page_extra1", { transition: "none", role: "page" });
To "close" this page and return to the previous page, call jQuery mobile method:  webphone_api.$.mobile.back();
*/

/** !!! IMPORTANT NOTES:
1. The webphone is a single page application built using jQuery mobile framework.
    Every jQuery mobile "page" defined in softphone.html has a corresponding Javascript file in /softphone/ directory.
    Pages in softphone.html are <DIV> elements with the following attribute: data-role="page"
2. jQuery namespace within the webphone is changed from "$"  to  "webphone_api.$"
*/

/** This lifecycle function is called only once per session, when the user navigates to the page for the first time.
* This is where most initialization should go: attaching event listeners, initializing static page content, etc.
*/
function onCreate (event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _extra1: onCreate");

    webphone_api.$('#extra1_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_extra1_menu").on("click", function() { CreateOptionsMenu('#extra1_menu_ul'); });
    
    // set page title
    webphone_api.$("#extra1_title").html('Page Extra 1');
        
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_extra1: onCreate", err); }
}

/** This lifecycle function is called every time the user navigates to this page.
* This is where dynamic content can be added/refreshed.
*/
function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _extra1: onStart");

    // set back button text
    webphone_api.$('#extra1_btnback').html('< Go back');
    
    MeasureExtra1();
    PopulateData();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_extra1: onStart", err); }
}

/** resolve window height size/resize changes */
function MeasureExtra1()
{
    webphone_api.$('#page_extra1').css('min-height', 'auto'); // must be set when softphone is skin in div

    var contentHeight = webphone_api.common.GetDeviceHeight() - webphone_api.$("#extra1_header").height() - 3;
    webphone_api.$("#page_extra1_content").height(contentHeight);
}

/** dynamically add content to page */
function PopulateData()
{
    try{
    var pageContent = '<p>Content data of page Extra 1</p>';
    
    webphone_api.$("#page_extra1_content").html(pageContent);

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_extra1: PopulateData", err); }
}

/** adding menu items
this function will be called every time the user clicks on the "Menu" button in the top-right corner of the page
*/
var MENUITEM_EXTRA1_BACK = '#menuitem_extra1_back';
function CreateOptionsMenu (menuId)
{
    try{
    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _extra1: CreateOptionsMenu menuid null"); return; }
    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _extra1: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    webphone_api.$(menuId).html('');

// add menu items
    var itemTitle = 'Go back';
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_EXTRA1_BACK + '"><a data-rel="back">' + itemTitle + '</a></li>' ).listview('refresh');

    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_extra1: CreateOptionsMenu", err); }
}

/**
handle Menu actions here
called when user clicks on a Menu item
 */
function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#extra1_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#extra1_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_EXTRA1_BACK:
                MenuActionGoBack();
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_extra1: MenuItemSelected", err); }
}

function MenuActionGoBack() // go back to previous page
{
    webphone_api.$.mobile.back();
}

/** This lifecycle function is called every time the user navigates away from this page.
* This is where you can save data that the user modified, clear dynamically added page content, etc.
*/
function onStop(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _extra1: onStop");

    // clear page content
    webphone_api.$("#page_extra_content").html('');
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_extra1: onStop", err); }
}

// public members and methods
return {
    onCreate: onCreate,
    onStart: onStart,
    onStop: onStop
};
})();