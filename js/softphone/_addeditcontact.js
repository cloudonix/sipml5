// AddEditContact page
webphone_api._addeditcontact = (function ()
{
var action = '';
var numberToAdd = '';
var nameToAdd = '';
var ctid = -1;
var name = '';
var nameField = null;
var contact = null;
var numbers = null;
var types = null;

function onCreate (event) // called only once - bind events here
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _addeditcontact: onCreate");
    
    webphone_api.$( window ).resize(function() // window resize handling
    {
        if (webphone_api.$.mobile.activePage.attr('id') === 'page_addeditcontact')
        {
            MeasureAddeditcontact();
        }
    });
    
    webphone_api.$('#addeditcontact_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected(webphone_api.$(this).attr('id'));
    });
    webphone_api.$("#btn_addeditcontact_menu").on("click", function() { CreateOptionsMenu('#addeditcontact_menu_ul'); });
    webphone_api.$("#btn_addeditcontact_menu").attr("title", webphone_api.stringres.get("hint_menu"));
    
    webphone_api.$("#btn_save_aec").on("click", function() { SaveContact(); });
    webphone_api.$("#btn_revert_aec").on("click", function() { webphone_api.$.mobile.back(); });
    
    webphone_api.$("#btn_add_aec").on("click", function() { AddPhoneField(null, null, true); });
    webphone_api.$("#btn_add_aec").attr("title", webphone_api.stringres.get("hint_addphone"));
    webphone_api.$(".minus_btn").attr("title", webphone_api.stringres.get("hint_removephone"));
    
    webphone_api.$("#btn_add_aec_details").on("click", function() { AddDetailsField(); });
    webphone_api.$("#btn_add_aec_details").attr("title", webphone_api.stringres.get("addeditct_hint_adddetails"));
    
    var fieldcount = webphone_api.$('#aec_number_fields').children().length;
    if (!webphone_api.common.isNull(fieldcount) && fieldcount > 0)
    {
        for (var i = 0; i < fieldcount; i++)
        {
            (function (i)
            {
                webphone_api.$('#btn_type_aec_' + i).on('click', function() { ChooseType(i, webphone_api.$(this).html()); });
                webphone_api.$('#btn_minus_aec_' + i).on('click', function() { RemoveEntry(i); });
            }(i));
        }
    }

    webphone_api.$( "#page_addeditcontact" ).keyup(function(event)
    {
        HandleKeyUp(event);
    });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: onCreate", err); }
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

    if (charCode === 13) // enter
    {
        webphone_api.$("#btn_save_aec").click();
        event.preventDefault();
    }
    else if (charCode === 27) // ESC or Backspace
    {
        webphone_api.$("#btn_revert_aec").click();
        event.preventDefault();
    }
    return false;
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: HandleKeyUp", err); }
}

function onStart(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _addeditcontact: onStart");
    webphone_api.global.isAddeditcontactStarted = true;
    
//--    webphone_api.$("#phone_number").attr("placeholder", webphone_api.stringres.get("phone_nr"));
//--    document.getElementById("app_name_addeditcontact").innerHTML = webphone_api.common.GetBrandName();
    document.getElementById('aec_label_name').innerHTML = webphone_api.stringres.get('contact_name');
    webphone_api.$('#aec_name').attr('placeholder', webphone_api.stringres.get('contact_name'));
    webphone_api.$('#aec_lastname').attr('placeholder', webphone_api.stringres.get('contact_lastname'));
    document.getElementById('aec_label_phone').innerHTML = webphone_api.stringres.get('contact_phone');
    document.getElementById('btn_save_aec').innerHTML = webphone_api.stringres.get('btn_save');
    document.getElementById('btn_revert_aec').innerHTML = webphone_api.stringres.get('btn_cancel');
    
    webphone_api.$("#addeditcontact_list").attr("data-filter-placeholder", webphone_api.stringres.get("ct_search_hint"));
    
    webphone_api.$(".separator_line_thick").css( 'background-color', webphone_api.common.HoverCalc(webphone_api.common.getBgColor('#page_addeditcontact'), -30) );
    
    if (!webphone_api.common.isNull(document.getElementById('addeditct_btnback')))
    {
        document.getElementById('addeditct_btnback').innerHTML = '<b>&LT;</b>&nbsp;' + webphone_api.stringres.get('btn_cancel');
    }
    
    webphone_api.$('#aec_label_details').html(webphone_api.stringres.get('addeditct_addfield'));
    webphone_api.$('#aec_entry_email label').html(webphone_api.stringres.get('addeditct_label_email') + ':');
    webphone_api.$('#aec_entry_address label').html(webphone_api.stringres.get('addeditct_label_address') + ':');
    webphone_api.$('#aec_entry_notes label').html(webphone_api.stringres.get('addeditct_label_notes') + ':');
    webphone_api.$('#aec_entry_website label').html(webphone_api.stringres.get('addeditct_label_website') + ':');
    
// needed for proper display and scrolling of listview
    MeasureAddeditcontact();
    setTimeout(function () { MeasureAddeditcontact(); }, 1000);
    
    action = webphone_api.common.GetIntentParam(webphone_api.global.intentaddeditct, 'action');
    
    if (!webphone_api.common.isNull(action) && action.length > 0)
    {
        if (action === 'add')
        {
            numberToAdd = webphone_api.common.GetIntentParam(webphone_api.global.intentaddeditct, 'numbertoadd');
            nameToAdd = webphone_api.common.GetIntentParam(webphone_api.global.intentaddeditct, 'nametoadd');
            if (webphone_api.common.isNull(nameToAdd)) { nameToAdd = ''; }
            
            document.getElementById('addeditct_title').innerHTML = webphone_api.stringres.get('addeditct_title_new');
        }else if (action === 'edit')
        {
            try{
                ctid = webphone_api.common.StrToInt(webphone_api.common.GetIntentParam(webphone_api.global.intentaddeditct, 'ctid'));
            } catch(errin) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: onStart can't convert contact id", errin); }
    
            contact = webphone_api.global.ctlist[ctid];
            numbers = contact[webphone_api.common.CT_NUMBER];
            types = contact[webphone_api.common.CT_PTYPE];
            
            document.getElementById('addeditct_title').innerHTML = webphone_api.stringres.get('addeditct_title_edit');
        }else
        {
            webphone_api.$.mobile.back();
        }
    }
    
    webphone_api.$("#addeditct_title").attr("title", webphone_api.stringres.get("hint_page"));
    
    if (!webphone_api.common.isNull(contact) && contact.length > 0) { name = contact[webphone_api.common.CT_NAME]; }
        
    nameField = document.getElementById('aec_name');
    
    if (action === 'add' && !webphone_api.common.isNull(nameField))
    {
        nameField.focus(); // setting cursor to text input
    }
    
    PopulateData();
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: onStart", err); }
}

function MeasureAddeditcontact() // resolve window height size change
{
    try{
    webphone_api.$('#page_addeditcontact').css('min-height', 'auto'); // must be set when softphone is skin in div

    var heightTemp = webphone_api.common.GetDeviceHeight() - webphone_api.$("#addeditcontact_header").height() - webphone_api.$('#aec_footer').height();
    heightTemp = heightTemp - 5;
    webphone_api.$("#page_addeditcontact_content").height(heightTemp);
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: MeasureAddeditcontact", err); }
}

function PopulateData()
{
   try{ 
    if (action === 'add')
    {
        if (nameToAdd.length > 0) { nameField.value = nameToAdd; }
        
        if (!webphone_api.common.isNull(numberToAdd) && numberToAdd.length > 0)
        {
            AddPhoneField('', webphone_api.common.Trim(numberToAdd), false);
        }else
        {
            AddPhoneField('', '', false);
        }
    }else if (action === 'edit')
    {
        nameField.value = webphone_api.common.Trim(name);
        
        if (ctid < 0)
        {
            webphone_api.common.PutToDebugLog(2, 'ERROR, _addeditcontact PopulateData incorrect ctid');
            return;
        }
        
        if (webphone_api.common.isNull(numbers) || numbers.length < 1)
        {
            return;
        }
        var availableLayouts = webphone_api.$('#aec_number_fields').children().length;

        for (var i = 0; i < numbers.length; i++)
        {
            if (i >= availableLayouts) { break; }
            
            var typetmp = '';
            if (!webphone_api.common.isNull(types[i])) typetmp = types[i];
            
            AddPhoneField(typetmp, numbers[i], false);
        }
        
        var ctemail = contact[webphone_api.common.CT_EMAIL];
        var ctaddress = contact[webphone_api.common.CT_ADDRESS];
        var ctnotes = contact[webphone_api.common.CT_NOTES];
        var ctwebsite = contact[webphone_api.common.CT_WEBSITE];
        
        if (!webphone_api.common.isNull(ctemail) && webphone_api.common.Trim(ctemail).length > 0) { webphone_api.$('#number_aec_email').val(ctemail); webphone_api.$('#aec_entry_email').show(); }
        if (!webphone_api.common.isNull(ctaddress) && webphone_api.common.Trim(ctaddress).length > 0) { webphone_api.$('#number_aec_address').val(ctaddress); webphone_api.$('#aec_entry_address').show(); }
        if (!webphone_api.common.isNull(ctnotes) && webphone_api.common.Trim(ctnotes).length > 0) { webphone_api.$('#number_aec_notes').val(ctnotes); webphone_api.$('#aec_entry_notes').show(); }
        if (!webphone_api.common.isNull(ctwebsite) && webphone_api.common.Trim(ctwebsite).length > 0) { webphone_api.$('#number_aec_website').val(ctwebsite); webphone_api.$('#aec_entry_website').show(); }
    }
    
    //hide add field button, if all possible fields are already added
    //email, address, notes, website
    if (webphone_api.$('#aec_entry_email').is(':visible') && webphone_api.$('#aec_entry_address').is(':visible') && webphone_api.$('#aec_entry_notes').is(':visible') && webphone_api.$('#aec_entry_website').is(':visible'))
    {
        webphone_api.$('#aec_add_deatils').hide();
    }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: PopulateData", err); }
}

function AddPhoneField(type, number, isonclick)
{
    try{
    if (isonclick)
    {
        webphone_api.common.PutToDebugLog(5, 'EVENT, _addeditcontact: AddPhoneField on click');
    }
    // default value
    if (webphone_api.common.isNull(type) || type.length < 3) { type = 'phone'; }
    if (webphone_api.common.isNull(number)) { number = ''; }
    var fieldcount = webphone_api.$('#aec_number_fields').children().length;
    
    var elements = webphone_api.$('#aec_number_fields').children();
    if (webphone_api.common.isNull(fieldcount) || fieldcount < 1) { return; }
    
    for (var i = 0; i < fieldcount; i++)
    {
        var newelement = document.getElementById('aec_entry_' + i);
                
        if ( !webphone_api.common.isNull(newelement) && newelement.style.display === 'none')
        {
            newelement.style.display = 'block';
            webphone_api.$('#btn_type_aec_' + i).html(webphone_api.stringres.get(type));
            webphone_api.$('#number_aec_' + i).val(number);
            if (isonclick) { webphone_api.$('#btn_type_aec_' + i).click(); } // display choose type if new field added
            break;
        }
    }
  /*
    var template = 
        '<div id="aec_entry_' + fieldcount + '" class="aec_numbers">' +
            '<button id="btn_type_aec_' + fieldcount + '" class="aec_phonetype ui-btn-inline ui-btn ui-btn-corner-all ui-btn-b noshadow">' +  webphone_api.stringres.get(type)+ '</button>' +
            '<input type="text" value="' + number + '" id="number_aec_' + fieldcount + '" name="number" data-theme="a"/>' +
            '<div id="btn_minus_aec_' + fieldcount + '" class="minus_btn"><button class="aec_remove noshadow ui-btn-inline ui-btn ui-btn-corner-all ui-btn-b ui-icon-minus ui-btn-icon-notext">Remove</button></div>' +
        '</div>';

    webphone_api.$('#aec_number_fields').append(template).trigger('create');*/
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: AddPhoneField", err); }
}

function AddDetailsField(popupafterclose)
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
    
    var list = '';
    //email, address, notes, website
    var i_email = '<li id="#addfield_item_email"><a data-rel="back">' + webphone_api.stringres.get('addeditct_label_email') + '</a></li>';
    var i_address = '<li id="#addfield_item_address"><a data-rel="back">' + webphone_api.stringres.get('addeditct_label_address') + '</a></li>';
    var i_notes = '<li id="#addfield_item_notes"><a data-rel="back">' + webphone_api.stringres.get('addeditct_label_notes') + '</a></li>';
    var i_website = '<li id="#addfield_item_website"><a data-rel="back">' + webphone_api.stringres.get('addeditct_label_website') + '</a></li>';
    
    if (!webphone_api.$('#aec_entry_email').is(':visible')) { list = list + i_email; }
    if (!webphone_api.$('#aec_entry_address').is(':visible')) { list = list + i_address; }
    if (!webphone_api.$('#aec_entry_notes').is(':visible')) { list = list + i_notes; }
    if (!webphone_api.$('#aec_entry_website').is(':visible')) { list = list + i_website; }
    
    var template = '' +
'<div id="addfieldpopup" data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('addeditct_hint_adddetails') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content adialog_content" style="padding: 0; margin: 0;">' +
        '<ul id="addfieldpopup_ul" data-role="listview" data-inset="true" data-icon="false" style="margin: 0;">' +
            list +
        '</ul>' +
//        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back">' + webphone_api.stringres.get('btn_close') + '</a>' +
//        '<a href="javascript:;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back" data-transition="flow">Delete</a>' +
    '</div>' +
//    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
//        '<a href="javascript:;" style="width: 98%;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_close') + '</a>' +
//    '</div>' +
'</div>';
 
    popupafterclose = popupafterclose ? popupafterclose : function () {};

    webphone_api.$.mobile.activePage.append(template).trigger("create");

    webphone_api.$.mobile.activePage.find(".closePopup").bind("tap", function (e)
    {
        webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
    });
    
    
    webphone_api.$.mobile.activePage.find(".messagePopup").popup().popup("open").bind(
    {
        popupafterclose: function ()
        {
            webphone_api.$(this).unbind("popupafterclose").remove();
            
            webphone_api.$('#addfieldpopup_ul').off('click', 'li');
            
            popupafterclose();
        }
    });
    
   
    webphone_api.$('#addfieldpopup_ul').on('click', 'li', function(event)
    {
        var itemid = webphone_api.$(this).attr('id');

        webphone_api.$( '#addfieldpopup' ).on( 'popupafterclose', function( event )
        {
            if (itemid === '#addfield_item_email') { webphone_api.$('#aec_entry_email').show(); }
            if (itemid === '#addfield_item_address') { webphone_api.$('#aec_entry_address').show(); }
            if (itemid === '#addfield_item_notes') { webphone_api.$('#aec_entry_notes').show(); }
            if (itemid === '#addfield_item_website') { webphone_api.$('#aec_entry_website').show(); }
            
        //hide add field button, if all possible fields are already added
            //email, address, notes, website
            if (webphone_api.$('#aec_entry_email').is(':visible') && webphone_api.$('#aec_entry_address').is(':visible') && webphone_api.$('#aec_entry_notes').is(':visible') && webphone_api.$('#aec_entry_website').is(':visible'))
            {
                webphone_api.$('#aec_add_deatils').hide();
            }
            
        });
    });
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: AddDetailsField", err); }
}

function ChooseType (idnr, type, popupafterclose)
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
    
    var checked_phone = '';
    var checked_home = '';
    var checked_mobile = '';
    var checked_work = '';
    var checked_other = '';
    var checked_fax_home = '';
    var checked_fax_work = '';
    var checked_pager = '';
    var checked_sip = '';
    
    if (!webphone_api.common.isNull(type) && type.length > 0)
    {
        if (type === webphone_api.stringres.get('phone')) { checked_phone = 'checked="checked"'; }
        if (type === webphone_api.stringres.get('home')) { checked_home = 'checked="checked"'; }
        if (type === webphone_api.stringres.get('mobile')) { checked_mobile = 'checked="checked"'; }
        if (type === webphone_api.stringres.get('work')) { checked_work = 'checked="checked"'; }
        if (type === webphone_api.stringres.get('other')) { checked_other = 'checked="checked"'; }
        if (type === webphone_api.stringres.get('fax_home')) { checked_fax_home = 'checked="checked"'; }
        if (type === webphone_api.stringres.get('fax_work')) { checked_fax_work = 'checked="checked"'; }
        if (type === webphone_api.stringres.get('pager')) { checked_pager = 'checked="checked"'; }
        if (type === webphone_api.stringres.get('sip')) { checked_sip = 'checked="checked"'; }
    }else
    {
    // default value
        checked_phone = 'checked="checked"';
    }
    
    var radiob = '' +
        '<form>' +
        '<fieldset data-role="controlgroup">' +
            '<input name="phone_type" id="radio_phone" value="on" ' + checked_phone + ' type="radio">' +
            '<label for="radio_phone">' + webphone_api.stringres.get('phone') + '</label>' +
            '<input name="phone_type" id="radio_home" value="on" ' + checked_home + ' type="radio">' +
            '<label for="radio_home">' + webphone_api.stringres.get('home') + '</label>' +
            '<input name="phone_type" id="radio_mobile" value="on" ' + checked_mobile + ' type="radio">' +
            '<label for="radio_mobile">' + webphone_api.stringres.get('mobile') + '</label>' +
            '<input name="phone_type" id="radio_work" value="on" ' + checked_work + ' type="radio">' +
            '<label for="radio_work">' + webphone_api.stringres.get('work') + '</label>' +
            '<input name="phone_type" id="radio_other" value="on" ' + checked_other + ' type="radio">' +
            '<label for="radio_other">' + webphone_api.stringres.get('other') + '</label>' +
            '<input name="phone_type" id="radio_fax_home" value="on" ' + checked_fax_home + ' type="radio">' +
            '<label for="radio_fax_home">' + webphone_api.stringres.get('fax_home') + '</label>' +
            '<input name="phone_type" id="radio_fax_work" value="on" ' + checked_fax_work + ' type="radio">' +
            '<label for="radio_fax_work">' + webphone_api.stringres.get('fax_work') + '</label>' +
            '<input name="phone_type" id="radio_pager" value="on" ' + checked_pager + ' type="radio">' +
            '<label for="radio_pager">' + webphone_api.stringres.get('pager') + '</label>' +
            '<input name="phone_type" id="radio_sip" value="on" ' + checked_sip + ' type="radio">' +
            '<label for="radio_sip">' + webphone_api.stringres.get('sip') + '</label>' +
        '</fieldset>' +
        '</form>';
    
    var template = '' +
'<div data-role="popup" class="ui-content messagePopup" data-overlay-theme="a" data-theme="a" style="max-width:' + popupWidth + 'px; min-width: ' + Math.floor(popupWidth * 0.6) + 'px;">' +

    '<div data-role="header" data-theme="b">' +
        '<a href="javascript:;" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-right closePopup">Close</a>' +
        '<h1 class="adialog_title">' + webphone_api.stringres.get('contact_alert_title') + '</h1>' +
    '</div>' +
    '<div role="main" class="ui-content">' +
    radiob +
    '</div>' +
//    '<div data-role="footer" data-theme="b" class="adialog_footer">' +
//        '<a href="javascript:;" style="width: 98%;" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b adialog_2button" data-rel="back" data-transition="flow">' + webphone_api.stringres.get('btn_close') + '</a>' +
//    '</div>' +
'</div>';
 
    popupafterclose = popupafterclose ? popupafterclose : function () {};

    webphone_api.$.mobile.activePage.append(template).trigger("create");

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
    
    webphone_api.$(":radio").on ("change", function (event)
    {
        webphone_api.$.mobile.activePage.find(".messagePopup").popup("close");
        var newtype = webphone_api.$(this).attr ("id");
        
        if (webphone_api.common.isNull(newtype) || newtype.length < 1) { return; }
        
        var pos = newtype.indexOf('_');
        if (pos > 0 && pos < newtype.length)
        {
            newtype = newtype.substring(pos + 1);
        }
//--        alert (webphone_api.$(this).attr ("id"));
        webphone_api.$('#btn_type_aec_' + idnr).html(webphone_api.stringres.get(newtype));
    });
        
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: ChooseType", err); }
}

function RemoveEntry (idnr)
{
    try{
    var elem = document.getElementById('aec_entry_' + idnr);
    if (!webphone_api.common.isNull(elem))
    {
        elem.style.display = 'none';
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: RemoveEntry", err); }
}

function SaveContact()
{
    try{
    if (action === 'add')
    {
        SaveNewContact();
    }else if (action === 'edit')
    {
        SaveEditedContact();
    }else
    {
        return;
    }
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: SaveContact", err); }
}

function SaveEditedContact()
{
    try{
    var currName = nameField.value;

    if (webphone_api.common.isNull(currName)) { currName = ''; }
    currName = webphone_api.common.Trim(currName);
    
    var fieldcount = webphone_api.$('#aec_number_fields').children().length;
    
    if (webphone_api.common.isNull(fieldcount) || fieldcount < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, SaveEditedContact fieldcount is null');
        return;
    }
    
    var numbersTemp = [];
    var typesTemp = [];
    var idx = 0;
    
    for (var i = 0; i < fieldcount; i++)
    {
        var itemField = document.getElementById('aec_entry_' + i);
        var nrtemp = webphone_api.$('#number_aec_' + i).val();
        var typefieldTemp = webphone_api.$('#btn_type_aec_' + i).html();
        var tptemp = webphone_api.stringres.get('mobile');
        
        if (webphone_api.common.isNull(itemField) || itemField.style.display === 'none')
        {
            continue;
        }
        
        if ( webphone_api.common.isNull(nrtemp) || (webphone_api.common.Trim(nrtemp)).length < 1 )
        {
            continue;
        }
        
        if (typefieldTemp === webphone_api.stringres.get('phone'))       { tptemp = 'phone'; }
        if (typefieldTemp === webphone_api.stringres.get('home'))        { tptemp = 'home'; }
        if (typefieldTemp === webphone_api.stringres.get('mobile'))      { tptemp = 'mobile'; }
        if (typefieldTemp === webphone_api.stringres.get('work'))        { tptemp = 'work'; }
        if (typefieldTemp === webphone_api.stringres.get('other'))       { tptemp = 'other'; }
        if (typefieldTemp === webphone_api.stringres.get('fax_home'))    { tptemp = 'fax_home'; }
        if (typefieldTemp === webphone_api.stringres.get('fax_work'))    { tptemp = 'fax_work'; }
        if (typefieldTemp === webphone_api.stringres.get('pager'))       { tptemp = 'pager'; }
        if (typefieldTemp === webphone_api.stringres.get('sip'))         { tptemp = 'sip'; }
        
//--         ['John Doe', ['40724335123', '0268123456'], ['home', 'work'], '0', '13464346', '0', '0']
        numbersTemp[idx] = nrtemp;
        typesTemp[idx] = tptemp;
        idx ++;
    }
    
    if (webphone_api.common.isNull(numbersTemp) || numbersTemp.length < 1)
    {
        if (currName.length < 1)
        {
            webphone_api.common.ShowToast(webphone_api.stringres.get('contact_no_nunber'));
            return;
        }
        
//--      new contact-nal nem kell kerni szamot
//--             ranezni, hogy van-e benne space, s ha nincs akkor rakja be telefonszamnak
        if (currName.indexOf(' ') < 0)
        {
            var tmptype = 'phone';
            if (!webphone_api.common.IsNumber(currName)) { tmptype = 'sip'; }
            
            numbersTemp.push(currName);
            typesTemp.push(tmptype);
        }
    }
    
    if (currName.length < 1) { currName = numbersTemp[0]; }

    var modified = (webphone_api.common.GetTickCount()).toString();

    var ctemail = '';
    var ctaddress = '';
    var ctnotes = '';
    var ctwebsite = '';
    
    if (webphone_api.$('#number_aec_email').is(':visible'))
    {
        ctemail = webphone_api.$('#number_aec_email').val();
        if (webphone_api.common.isNull(ctemail)) { ctemail = ''; } else { ctemail = webphone_api.common.Trim(ctemail); }
    }
    if (webphone_api.$('#number_aec_address').is(':visible'))
    {
        ctaddress = webphone_api.$('#number_aec_address').val();
        if (webphone_api.common.isNull(ctaddress)) { ctaddress = ''; } else { ctaddress = webphone_api.common.Trim(ctaddress); }
        
        ctaddress = webphone_api.common.ReplaceAll(ctaddress, '\r\n', ' ');
        ctaddress = webphone_api.common.ReplaceAll(ctaddress, '\n', ' ');
        ctaddress = webphone_api.common.ReplaceAll(ctaddress, ',', ' ');
    }
    if (webphone_api.$('#number_aec_notes').is(':visible'))
    {
        ctnotes = webphone_api.$('#number_aec_notes').val();
        if (webphone_api.common.isNull(ctnotes)) { ctnotes = ''; } else { ctnotes = webphone_api.common.Trim(ctnotes); }
        
        ctnotes = webphone_api.common.ReplaceAll(ctnotes, '\r\n', ' ');
        ctnotes = webphone_api.common.ReplaceAll(ctnotes, '\n', ' ');
        ctnotes = webphone_api.common.ReplaceAll(ctnotes, ',', ' ');
    }
    if (webphone_api.$('#number_aec_website').is(':visible'))
    {
        ctwebsite = webphone_api.$('#number_aec_website').val();
        if (webphone_api.common.isNull(ctwebsite)) { ctwebsite = ''; } else { ctwebsite = webphone_api.common.Trim(ctwebsite); }
    }

    var ctTemp = [];
    ctTemp[webphone_api.common.CT_NAME] = currName;
    ctTemp[webphone_api.common.CT_NUMBER] = numbersTemp;
    ctTemp[webphone_api.common.CT_PTYPE] = typesTemp;
    ctTemp[webphone_api.common.CT_USAGE] = contact[webphone_api.common.CT_USAGE];
    ctTemp[webphone_api.common.CT_LASTMODIF] = modified;
    ctTemp[webphone_api.common.CT_DELFLAG] = contact[webphone_api.common.CT_DELFLAG];
    ctTemp[webphone_api.common.CT_FAV] = contact[webphone_api.common.CT_FAV];
    ctTemp[webphone_api.common.CT_EMAIL] = ctemail;
    ctTemp[webphone_api.common.CT_ADDRESS] = ctaddress;
    ctTemp[webphone_api.common.CT_NOTES] = ctnotes;
    ctTemp[webphone_api.common.CT_WEBSITE] = ctwebsite;
    ctTemp[webphone_api.common.CT_LASTACTIVE] = webphone_api.common.GetTickCount().toString();
    ctTemp[webphone_api.common.CT_ISFROMSYNC] = '0';
    
    
    webphone_api.global.ctlist[ctid] = ctTemp;
    webphone_api.global.wasCtModified = true;
    
    webphone_api.common.SortContacts();
    
    setTimeout(function ()
    {
        webphone_api.common.ShowToast(webphone_api.stringres.get('contact_saved'));
    }, 300);
    webphone_api.$.mobile.back();
    return;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: SaveEditedContact", err); }
    try{ webphone_api.common.ShowToast(webphone_api.stringres.get('contact_save_error')); webphone_api.$.mobile.back(); } catch(err) { ; }
}

function SaveNewContact()
{
    try{
    var currName = nameField.value;

    if (webphone_api.common.isNull(currName)) { currName = ''; }
    currName = webphone_api.common.Trim(currName);

    var fieldcount = webphone_api.$('#aec_number_fields').children().length;
    
    if (webphone_api.common.isNull(fieldcount) || fieldcount < 1)
    {
        webphone_api.common.PutToDebugLog(2, 'ERROR, SaveNewContact fieldcount is null');
        return;
    }
    
    var numbersTemp = [];
    var typesTemp = [];
    var idx = 0;
    
    for (var i = 0; i < fieldcount; i++)
    {
        var nrtemp = webphone_api.$('#number_aec_' + i).val();
        var typefieldTemp = webphone_api.$('#btn_type_aec_' + i).html();
        var tptemp = webphone_api.stringres.get('mobile');
        
        if ( webphone_api.common.isNull(nrtemp) || (webphone_api.common.Trim(nrtemp)).length < 1 )
        {
            continue;
        }
        
        if (typefieldTemp === webphone_api.stringres.get('phone'))       { tptemp = 'phone'; }
        if (typefieldTemp === webphone_api.stringres.get('home'))        { tptemp = 'home'; }
        if (typefieldTemp === webphone_api.stringres.get('mobile'))      { tptemp = 'mobile'; }
        if (typefieldTemp === webphone_api.stringres.get('work'))        { tptemp = 'work'; }
        if (typefieldTemp === webphone_api.stringres.get('other'))       { tptemp = 'other'; }
        if (typefieldTemp === webphone_api.stringres.get('fax_home'))    { tptemp = 'fax_home'; }
        if (typefieldTemp === webphone_api.stringres.get('fax_work'))    { tptemp = 'fax_work'; }
        if (typefieldTemp === webphone_api.stringres.get('pager'))       { tptemp = 'pager'; }
        if (typefieldTemp === webphone_api.stringres.get('sip'))         { tptemp = 'sip'; }
        
//--         ['John Doe', ['40724335123', '0268123456'], ['home', 'work'], '0', '13464346', '0', '0']
        numbersTemp[idx] = nrtemp;
        typesTemp[idx] = tptemp;
        idx ++;
    }
    
    if (webphone_api.common.isNull(numbersTemp) || numbersTemp.length < 1)
    {
        if (currName.length < 1)
        {
            webphone_api.common.ShowToast(webphone_api.stringres.get('contact_no_nunber'));
            return;
        }
        
//--      new contact-nal nem kell kerni szamot
//--             ranezni, hogy van-e benne space, s ha nincs akkor rakja be telefonszamnak
        if (currName.indexOf(' ') < 0)
        {
            var tmptype = 'phone';
            if (!webphone_api.common.IsNumber(currName)) { tmptype = 'sip'; }
            
            numbersTemp.push(currName);
            typesTemp.push(tmptype);
        }
    }
    
    if (currName.length < 1) { currName = numbersTemp[0]; }

    var modified = (webphone_api.common.GetTickCount()).toString();
    
    var ctemail = '';
    var ctaddress = '';
    var ctnotes = '';
    var ctwebsite = '';
    
    if (webphone_api.$('#number_aec_email').is(':visible'))
    {
        ctemail = webphone_api.$('#number_aec_email').val();
        if (webphone_api.common.isNull(ctemail)) { ctemail = ''; } else { ctemail = webphone_api.common.Trim(ctemail); }
    }
    if (webphone_api.$('#number_aec_address').is(':visible'))
    {
        ctaddress = webphone_api.$('#number_aec_address').val();
        if (webphone_api.common.isNull(ctaddress)) { ctaddress = ''; } else { ctaddress = webphone_api.common.Trim(ctaddress); }
        
        ctaddress = webphone_api.common.ReplaceAll(ctaddress, '\r\n', ' ');
        ctaddress = webphone_api.common.ReplaceAll(ctaddress, '\n', ' ');
        ctaddress = webphone_api.common.ReplaceAll(ctaddress, ',', ' ');
    }
    if (webphone_api.$('#number_aec_notes').is(':visible'))
    {
        ctnotes = webphone_api.$('#number_aec_notes').val();
        if (webphone_api.common.isNull(ctnotes)) { ctnotes = ''; } else { ctnotes = webphone_api.common.Trim(ctnotes); }
        
        ctnotes = webphone_api.common.ReplaceAll(ctnotes, '\r\n', ' ');
        ctnotes = webphone_api.common.ReplaceAll(ctnotes, '\n', ' ');
        ctnotes = webphone_api.common.ReplaceAll(ctnotes, ',', ' ');
    }
    if (webphone_api.$('#number_aec_website').is(':visible'))
    {
        ctwebsite = webphone_api.$('#number_aec_website').val();
        if (webphone_api.common.isNull(ctwebsite)) { ctwebsite = ''; } else { ctwebsite = webphone_api.common.Trim(ctwebsite); }
    }

    var ctTemp = [];
    ctTemp[webphone_api.common.CT_NAME] = currName;
    ctTemp[webphone_api.common.CT_NUMBER] = numbersTemp;
    ctTemp[webphone_api.common.CT_PTYPE] = typesTemp;
    ctTemp[webphone_api.common.CT_USAGE] = '0';
    ctTemp[webphone_api.common.CT_LASTMODIF] = modified;
    ctTemp[webphone_api.common.CT_DELFLAG] = '0';
    ctTemp[webphone_api.common.CT_FAV] = '0';
    ctTemp[webphone_api.common.CT_EMAIL] = ctemail;
    ctTemp[webphone_api.common.CT_ADDRESS] = ctaddress;
    ctTemp[webphone_api.common.CT_NOTES] = ctnotes;
    ctTemp[webphone_api.common.CT_WEBSITE] = ctwebsite;
    ctTemp[webphone_api.common.CT_LASTACTIVE] = webphone_api.common.GetTickCount().toString();
    ctTemp[webphone_api.common.CT_ISFROMSYNC] = '0';
    
    webphone_api.global.ctlist.push(ctTemp);
    webphone_api.global.wasCtModified = true;
    
    webphone_api.common.SortContacts();
    
    setTimeout(function ()
    {
        webphone_api.common.ShowToast(webphone_api.stringres.get('contact_saved'));
    }, 300);
    webphone_api.$.mobile.back();
    return;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: SaveNewContact", err); }
    try{ webphone_api.common.ShowToast(webphone_api.stringres.get('contact_save_error')); webphone_api.$.mobile.back(); } catch(err2) { ; }
}

var MENUITEM_ADDEDITCONTACT_SAVE = '#menuitem_addeditcontact_save';
var MENUITEM_ADDEDITCONTACT_REVERT = '#menuitem_addeditcontact_revert';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (webphone_api.common.IsWindowsSoftphone())
    {
        webphone_api.$( "#btn_addeditcontact_menu" ).removeAttr('data-transition');
    }

    if ( webphone_api.common.isNull(menuId) || menuId.lenght < 1 ) { webphone_api.common.PutToDebugLog(2, "ERROR, _addeditcontact: CreateOptionsMenu menuid null"); return; }

    if (webphone_api.$(menuId).length <= 0) { webphone_api.common.PutToDebugLog(2, "ERROR, _addeditcontact: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    webphone_api.$(menuId).html('');
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_ADDEDITCONTACT_SAVE + '"><a data-rel="back">' + webphone_api.stringres.get('btn_save') + '</a></li>' ).listview('refresh');
    
    webphone_api.$(menuId).append( '<li id="' + MENUITEM_ADDEDITCONTACT_REVERT + '"><a data-rel="back">' + webphone_api.stringres.get('btn_revert') + '</a></li>' ).listview('refresh');

    return true;
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (webphone_api.common.isNull(itemid) || itemid.length < 1) { return; }
    
    webphone_api.$( '#addeditcontact_menu' ).on( 'popupafterclose', function( event )
    {
        webphone_api.$( '#addeditcontact_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_ADDEDITCONTACT_SAVE:
                SaveContact();
                break;
            case MENUITEM_ADDEDITCONTACT_REVERT:
                webphone_api.$.mobile.back();
                break;
        }
    });
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: MenuItemSelected", err); }
}

function onStop(event)
{
    try{
    webphone_api.common.PutToDebugLog(4, "EVENT, _addeditcontact: onStop");
    webphone_api.global.isAddeditcontactStarted = false;
    
// reset phone fields display
    var fieldcount = webphone_api.$('#aec_number_fields').children().length;
    if (webphone_api.common.isNull(fieldcount) || fieldcount < 1) { return; }
    
    for (var i = 0; i < fieldcount; i++)
    {
        var newelement = document.getElementById('aec_entry_' + i);
        if ( !webphone_api.common.isNull(newelement))
        {
            newelement.style.display = 'none';
        }
    }
    
    webphone_api.$('#aec_entry_email').hide();
    webphone_api.$('#aec_entry_address').hide();
    webphone_api.$('#aec_entry_notes').hide();
    webphone_api.$('#aec_entry_website').hide();
    
    webphone_api.$('#aec_entry_email').val('');
    webphone_api.$('#aec_entry_address').val('');
    webphone_api.$('#aec_entry_notes').val('');
    webphone_api.$('#aec_entry_website').val('');
    
    webphone_api.$('#aec_add_deatils').show();
    
    if (!webphone_api.common.isNull(nameField)) { nameField.value = ''; }
    
    } catch(err) { webphone_api.common.PutToDebugLogException(2, "_addeditcontact: onStop", err); }
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