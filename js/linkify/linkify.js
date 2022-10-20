/*
  Scan and convert all phone numbers on your web page into click to call links
*/


var linkify = function ( )
{
// private members and methods

function Convert ()
{
    try{
    var dom = document.getElementsByTagName("*");
    if (common.isNull(dom))
    {
        common.PutToDebugLog(2, 'ERROR, cannot get dom elemts');
        return;
    }

    var elementCount = dom.length;

    for (var i = elementCount; i >= 0; i--)
    {
        if (common.isNull(dom[i])) { continue; }
        if ( (dom[i].nodeName).toUpperCase() === 'BODY' ) { break; }

        if ( common.isNull(dom[i].nodeName) || (dom[i].nodeName).toUpperCase() === 'BR' || (dom[i].nodeName).toUpperCase() === 'IMG'
                || (dom[i].nodeName).toUpperCase() === 'A' )
        {
            continue;
        }

        var content = dom[i].innerHTML;
        var done = []; // already replaced numbers

        var j = 0;
        while (j < content.length)
        {
            j++;
            if (common.IsNumber(content.charAt(j)))
            {
                var replaceval = '';
                var isPhoneNumber = 0; // check if it's phone number based on subsucvent digits found

                if (j > 1 && ( content.charAt(j - 2) === '+' || content.charAt(j - 2) === '(') )
                {
                    replaceval = replaceval + content.charAt(j - 2);
                }

                if (j > 0 && ( content.charAt(j - 1) === '+' || content.charAt(j - 1) === '(') )
                {
                    replaceval = replaceval + content.charAt(j - 1);
                }

                var limit = j + 24;
                if (limit > content.length) { limit = content.length; }

                for (var k = j; k < limit; k++)
                {
                    if ( common.IsChar(content.charAt(k)) ) { break; }
                    replaceval = replaceval + content.charAt(k);
                    isPhoneNumber++;
                }

                if (isPhoneNumber > 7) // if phone number found
                {
                    replaceval = common.Trim(replaceval);
//					alert('replaceval_1 = ' + replaceval);

                    var wasAlreadyReplaced = false;
                    if (!common.isNull(done) && done.length > 0)
                    {
                        for (var kk = 0; kk < done.length; kk++)
                        {
                            if (done[kk] === replaceval)
                            {
                                wasAlreadyReplaced = true;
                                break;
                            }
                        }
                    }


            // if not already replaced
                    if (!wasAlreadyReplaced)
                    {
                        done.push(replaceval);

                        var linked = '<a href="javascript:;" title="Click to call" onclick="linkify.GoToWebphone(\'' + replaceval + '\');">' + replaceval + '</a>';

                        content = common.ReplaceAll(content, replaceval, linked);

                        j = j + linked.length - 1;
                    }
                }
                else if (replaceval.length > 1)
                {
                    j = j + replaceval.length - 1;
                }
            }
        }
        dom[i].innerHTML = content;
    }
    } catch(err) { common.PutToDebugLogException(2, "linkify Convert", err); }
}

function log(msg) { try { console.log(msg); } catch (e2) {  } }
var common = {
    PutToDebugLogException: function (level, msg, err) { common.PutToDebugLog(level, msg + ' ' + err); },
    PutToDebugLog: function (level, msg) { log(msg); },
    isNull: function (variable)
    {
        try{
        if (typeof (variable) === 'undefined' || variable === null)
        {
            return true;
        }else
        {
            return false;
        }
        } catch(err) { common.PutToDebugLogException(2, "common: isNull", err); }

        return true;
    },
    Trim: function (str)
    {
        try{
        if (common.isNull(str) || str.lenght < 1) { return ''; }

        return str.replace(/^\s+|\s+$/g, ''); 

        } catch(err) { common.PutToDebugLogException(2, "common: Trim", err); }

        return str;
    },
    IsNumber: function (value)
    {
        try{
        //return (typeof value === 'number' && isFinite(value));
        if (common.isNull(value)) { return false; }

        value = value.toString();
        value = value.replace(/\s+/g, '');

        if (common.isNull(value)|| value.length < 1) { return false; }

        return !isNaN(value);

        } catch(err) { common.PutToDebugLogException(2, "common: IsNumber", err); }

        return false;
    },
    IsChar: function (value) // !!! IMPORTANT used only for finding phone numbers
    {
        try{
        if (common.isNull(value)) { return false; }
        value = value.replace(/\s+/g, '');

        if (value == null || value.length < 1 || value === '-' || value === ')' || value === '(') { return false; }

        return isNaN(value);

        } catch(err) { common.PutToDebugLogException(2, "common: IsChar", err); }

        return false;
    },
    EscapeRegExp: function (str)
    {
        try{
        if (common.isNull(str) || str.lenght < 1)
        {
            common.PutToDebugLog(3, 'ERROR, common EscapeRegExp null value');
            return '';
        }

        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

        } catch(err) { common.PutToDebugLogException(2, "common: EscapeRegExp", err); }

        return '';
    },
    ReplaceAll: function (str, what, value)
    {
        try{
        if (common.isNull(str) || common.isNull(what) || common.isNull(value))
        {
            common.PutToDebugLog(3, 'ERROR, common ReplaceAll null value');
            return '';
        }

        //return str.replace(new RegExp(common.EscapeRegExp(what), 'g'), value);
        return str.split(what).join(value);

        } catch(err) { common.PutToDebugLogException(2, "common: ReplaceAll", err); }
        return '';
    }
};

// public interface
return {
        webphone_url: '',
	serveraddress: '',
	username: '',
	password: '',
	md5: '',
	
	GoToWebphone: function (number)
	{
            try{
            var url = linkify.webphone_url + '?wp_serveraddress=' + linkify.serveraddress + '&wp_username=' + linkify.username + '&wp_password=' + linkify.password + '&wp_md5=' + linkify.md5 + '&wp_callto=' + number;

            window.open(url ,"_blank", "scrollbars=yes, resizable=yes, top=100, left=200, width=400, height=500");

            } catch(err) { common.PutToDebugLogException(2, "common: GoToWebphone", err); }
            return false; // will prevent browser from following the link
	},
	
	atpageload: function ()	//	function called on page load
	{
            Convert();
	}
};
}( );

window.onload = linkify.atpageload;