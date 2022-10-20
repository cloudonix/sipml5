// string resource file
//TRANSLTSTART
webphone_api.stringres = (function ()
{
var StringResources = {

//TRANSLTEND
settings_title: 'Settings',
settings_title_all: 'Settings',

username: 'Username',
password: 'Password',

btn_login: 'Login',
btn_close: 'Close',
btn_cancel: 'Cancel',
btn_ok: 'OK',
btn_upgrade: 'Upgrade',
btn_save: 'Save',
btn_send: 'Send',
btn_set: 'Set',
btn_revert: 'Revert',
btn_create: 'Create',
btn_audio_device: 'Audio devices',
btn_quickcall: 'Call',
btn_accept: 'Accept',
btn_reject: 'Reject',
btn_download: 'Download',
btn_decline: 'Decline',
btn_qrcode: 'QR code login',
btn_hangup: 'Hangup',
btn_transfer: 'Transfer',
btn_smsverify: 'Verify',

myprovider: 'Home',
myaccount: 'My account',
recharge:'Credit recharge',
newuser: 'New User',
newuser_a: 'Create an account',
forgotpassword_a: 'Forgot your password ?',
p2p: 'Phone to Phone',
p2p_nra: 'Your phone number',
p2p_nrb: 'Who are you calling',
p2p_err1: 'Enter your number',
p2p_err2: 'Enter destination number',
callback: 'Callback',
callback_src: 'Enter your mobile phone number<br>(begining with country code)',
interconnect: 'Interconnect calls',
interconnect_conf: 'Calls interconnected in conference',

phone_nr: 'Phone Nr or SIP URI',
phone_nr2: 'Phone number',
chat_nr: 'SIP URI, username or number',
ct_search_hint: 'Search Contacts',
initializing: 'Initializing',
reset_settings_msg: 'Are you sure you want to reset settings ?',
reset_settings_msg2: 'Settings were reset to defaults.',
aec_auto: 'Auto',
aec_none: 'None',
aec_software: 'Software',
aec_native: 'Native',
aec_fast: 'Fast',
aec_decrease_volume: 'Decrease volume',
warning: 'Warning',
help: 'Help',
help_provider: 'Find a voip provider',
logview_help: 'Copy the content of the logs window and send it in an emial to:',
please_enter: 'Please enter',
loading: 'Loading..',
type_phone: 'Call phone',
type_home: 'Call home',
type_mobile: 'Call mobile',
type_work: 'Call work',
type_other: 'Call other',
type_fax_home: 'Fax home',
type_fax_work: 'Fax work',
type_pager: 'Pager',
type_sip: 'Call SIP URI',
phone: 'Phone',
home: 'Home',
mobile: 'Mobile',
work: 'Work',
other: 'Other',
fax_home: 'Fax home',
fax_work: 'Fax work',
pager: 'Pager',
sip: 'SIP URI',
send_msg: 'Send message',
contact_alert_title: 'Choose phone type',
contact_name: 'Name',
contact_phone: 'Phone Nr or SIP URI',
contact_saved: 'Contact saved.',
contact_save_error: 'Error, Contact can\'t be saved',
contact_no_nunber: 'Enter a phone number, username or SIP URI',
no_contacts_1: 'To create contacts select "New Contact" from the menu.',
no_contacts_2: 'Or use the "Sync Contact" menu option to import contacts from your mobile.<br />(Sync will work only after you uploaded contacts from mobile device)',
sync_title: 'Sync contacts',
videocodec_optimal: 'Optimal',
sync_message: 'Sync will work only after you have uploaded contacts from mobile device.',
no_history: 'Call History Empty',
duration: 'Call duration:',
rating_minute: ' \\ min',
clear_callhistory: 'Clear Call History',
clear_callhistory_msg: 'Are you sure you want to clear all call history ?',
contact_delete_msg: 'Are you sure you want to delete this contact?',
contact_delete_all_msg: 'Are you sure you want to delet all the contacts?<br>This will permanently delete the whole contact list!',
ch_outgoing: 'Outgoing call',
ch_incoming: 'Incoming call',
ch_missed: 'Missed call',
ch_delete: 'Delete from call history',
in_hold: '(In Hold)',
initiate_call_forward: 'Initiate call forward',
call_forward_warn: 'Call forward will work only if the remote peer has support for it.',
initiate_call_transfer: 'Initiate call transfer',

btn_quicktransf: 'Quick',
btn_attendedtransf: 'Attended transfer',
btn_attendedtransf_short: 'Attended',
quicktransf_hint: 'Unattanded transfer',
attendedtransf_hint: 'Call, then hangup call',

initiate_conference: 'Initiate conference',
send_dtmf: 'Send DTMF',
unmuted: 'Unmuted',
muted: 'Muted',
unmuted_video: 'Video unmuted',
muted_video: 'Video muted',
hold_released: 'Hold released',
on_hold: 'On hold',
speaker_off: 'Speaker off',
speaker_on: 'Speaker on',
call_from: 'Missed call',
calls: 'missed calls',
message_from: 'Message from',
messages: 'new messages',
goto: 'Go to',
callhistory: 'Call history',
messagehistory: 'Messages',
sett_enabled: 'Enabled',
sett_disabled: 'Disabled',
hide_search: 'Hide search',
show_search: 'Search in settings',
settings_login: 'Login',
ie_update: 'This application requires a higher version of Internet Explorer. Would you like to download and update ?',
install_java: 'Java is required: https://java.com/download/',
serviceengine_title: 'Use service plugin',
serviceengine_msg: 'Install service plugin for a better experience',
np_download: 'Service plugin download',
np_popup_title: 'Service plugin',
np_popup_msg: 'You must install service plugin in order for the softphone to work.',
choose_engine_title: 'Choose engine',
choose_engine_title_single_engine: 'Click to download/install',
nativeplugin: 'service plugin',
native_call: 'Initiating native call...',
ce_enablejava: '<a href="https://java.com/en/download/help/enable_browser.xml" target="_blank">Enable java in your browser setting </a>',
ce_install_java: 'Or if you don\'t have java installed, install from <a href="https://java.com/download/" target="_blank">here.</a>',
ce_installnativeplugin: 'Install [NATIVE_PLUGIN] for the best experience',
ce_usewebrtc: 'Use webrtc',
ce_webrtcnot: '(Not Recommended)',
ce_browser_install: 'Install',
ce_browser_alternate: 'alternate browser',
ce_native_ios_safari: 'Your browser does not support WebRTC. Please use the native application.',
ce_native_ios_not_safari: 'Your browser does not support WebRTC. Please switch to Safari browser or use the native application.',
ce_native_ios: 'Your browser does not support WebRTC.',
ce_native_ios2: 'You can download the app from here',
ce_native_android: 'Use native app',
ce_use: 'selected. Just login.',
app_en_warning: 'Your browser does not have any built-in or plugin VoIP support.<br>Launching native VoIP client...',
app_en_warning_short: 'Browser has no built-in or plugin VoIP support.',
app_en_message: 'VoIP is not supported by your browser. Will launch native app. (this message will not be displayed in the production release).',
app_en_message2: 'VoIP is not supported by your browser. Launch native app ?',
app_en_message3: 'Your VoIP server is not reachable over WebRTC or not configured. Start native app ?',
np_install_title: 'Service plugin',
np_install_msg: 'Please launch the installer once downloaded.<br>Click OK when install finished.',
np_install_msg_lin: 'Please download, extract (unzip) and execute the installer <br>(You can lauch the .run file from your terminal console).',
np_install_msg_mac: 'Please extract and install the app.',
np_install_why: 'Why I am seeing this?',
np_install_warn: 'Service Plugin not accessible!',
np_successfully_installed: 'Service plugin successfully installed.',
java_install_title: 'Download and Install Java',
java_install: 'Click OK to start downloading Java.<br>Login again after you have finished installing it.',
sync_contacts_started: 'Syncing contacts...',
sync_succeded: 'Sync succeded',
sync_failed: 'Sync failed',
sync_msg: 'Or Sync contacts from your mobile devices:',
ce_dontask: 'Don\'t ask again',
add_to_home_title: 'Create shortcut',
add_to_home_msg: 'You can create a shortcut on your Home Screen to [BRAND]. Tap on Menu/Bar icon in the top-right corner of your browser, then tap \"Add to Home screen\"',
ct_menu_error: 'This contact has no numbers or SIP URIs',
switch_conf: 'Switching engine for Conference',
switch_conf_title: 'Use conference',
switch_confmessage: 'To use the conference you need to install NS -Service Plugin. Just click OK to continue.',
fcm_perm_message: 'Permission for Push Notifications is denied',
barcode_success: 'QR code read successfully',
menu_record_call: 'Record call',
menu_stop_record_call: 'Stop call recording',


//OPSSTART
autoprov_loading: 'Retrieving configuration...',
autoprov_restart: 'Applying configuration...',
//OPSEND
hint_menu: 'Menu',
hint_voicemail: 'Voicemail',
hint_quickcall: 'Quick call',
hint_message: 'Message',
hint_addphone: 'Add phone',
hint_removephone: 'Remove phone',
hint_choosect: 'Choose contact',
hint_sendmsg: 'Send message',
hint_conference: 'Add to conference',
hint_transfer: 'Call transfer',
hint_dialpad_dtmf: 'Send DTMF',
hint_mute: 'Mute / Unmute',
hint_hold: 'Hold / Reload',
hint_speaker: 'Speaker On / Off',
hint_dialpad: 'Dialpad',
hint_contacts: 'Contacts',
hint_callhistory: 'Call History',
hint_status: 'Events and status messages',
hint_curr_user: 'Account username',
hint_phone_number: 'Enter here phone number, sip account username or SIP URI',
hint_btn_call: 'Initiate call',
hint_btnback: 'Back to previous page',
hint_numpad: 'Numpad/Dialpad',
hint_recents: 'Actions',
hint_encicon: 'Encrypted',
hint_settlogin: 'Save settings and login',
hint_btnnewuser: 'Create new user',
hint_setprofpic: 'Set profile picture',

transfer_title: 'Call transfer',
attended_transfer_title: 'Attended transfer',
forward_title: 'Call forward',
conference_title: 'Add to conference',

pp_msg: 'Choose profile picture',
status_not_registered: 'Not registered',
pick_ct:'Pick contact',
chat_sms_title: 'Chat or SMS',
chdetails_title: 'Info',
chdetails_btnback_txt: 'Call history',
ctdetails_title: 'Contact',
ctdetails_btnback_txt: 'All contacts',
msg_title_chat: 'IM - Chat',
msg_title_sms: 'SMS',
dialpad_title: 'Call',
msglist_title: 'Messages',
ctlist_title: 'Contacts',
chlist_title: 'Call history',
addeditct_title_new: 'New contact',
addeditct_title_edit: 'Edit contact',
logview_title: 'Logs',
newuser_title: 'New user',
smscodeverify_title: 'Sign-in code',
sms_verification_pwdmsg: 'Your password is',
voicemail_title: 'Voicemail',
voicemail_msg: 'Enter your voicemail number',
quickcall_title: 'Quick call',
quickcall_msg: 'Enter phone number to call',
go_back_btn_txt: 'Back',
chat: 'IM - Chat',
sms: 'SMS',
delete_text: 'Delete',
delete_all_msg_alert: 'All messages will be deleted.',
delete_msg_alert: 'The entire thread will be deleted.',
btn_new_message: 'New message',
message_sent: 'Message sent',
me: 'Me',
sendtosupport: 'Send to support',
support_email_body: 'Copy and paste here the content of the log window:',
support_selectall: 'Select all',
nu_username: 'Username',
nu_password: 'Password',
nu_password_verify: 'Verify password',
nu_email: 'Email address',
nu_fullname: 'Full name',
nu_firstname: 'First name',
nu_lastname: 'Last name',
nu_phone: 'Phone',
nu_address: 'Address',
nu_country: 'Country',
nu_birthday: 'Birthday',
nu_gender: 'Gender',
nu_fpq: 'Forgot password question',
nu_fpa: 'Forgot password answer',
presence_stat_online: 'Online',
presence_stat_away: 'Away',
presence_stat_dnd: 'Do Not Disturb',
presence_stat_invisible: 'Invisible',
presence_stat_offline: 'Offline',
presence_title: 'Set presence status',
connection_title: 'Connection problem',
connection_msg:'Network offline - check your connection!' ,

menu_sync: 'Import contacts from Android',
menu_import_list: 'Import contacts',
menu_import_file: 'Import from File (Restore)',
menu_import_outlook: 'Import from Outlook',
menu_import_skype: 'Import from Skype',
menu_import_google: 'Import from Google',
menu_import_android: 'Import from Android phone',
menu_export_file: 'Export to File (Backup)',

menu_sortct: 'Sort contacts',
menu_filterct: 'Filter contacts',
menu_volumehide: 'Hide volume controls',
menu_volumeshow: 'Volume controls',
menu_audiodevicehide: 'Hide audio device',
menu_audiodeviceshow: 'Devices',
menu_mute_video: 'Audio only',
menu_conference: 'Conference',
menu_transfer: 'Transfer',
menu_numpad: 'Numpad',
menu_numpad_hide: 'Hide Numpad',
menu_mute: 'Mute',
menu_hold: 'Hold',
menu_speaker: 'Speaker',
menu_call: 'Call',
menu_message: 'Message',
menu_new_contact: 'New contact',
menu_editcontact: 'Edit contact',
menu_createcontact: 'Save contact',
menu_deletecontact: 'Delete contact',
menu_integration: 'Integration',
menu_folders: 'Folders',
menu_delallct: 'Delete all contacts',
hint_integration: 'Add click to call functionality by converting numbers to clickable links',
hint_folders: 'Show app folders',
menu_int_outlook: 'Outlook Plugin',
menu_int_chrome: 'Chrome Plugin',
hint_int_outlook: 'Install Outlook click to call plugin',
hint_int_chrome: 'Install Chrome click to call plugin',
menu_folders_bin: 'Show Bin Dir',
menu_folders_data: 'Show Data Dir',
hint_folders_bin: 'Open app directory',
hint_folders_data: 'Open app data directory',
menu_exit: 'Exit',
menu_callpark: 'Call Park',
menu_lastcalldetails: 'Last call details',
menu_call_access: 'Call access number',
menu_switchtoadvanced: 'Show advanced settings',
menu_switchtobasic: 'Show basic settings',
menu_showsettings: 'Settings',
menu_close: 'Close',
menu_help: 'Help',
help_help: 'Guide', // Help
//TRANSLTSTART
help_rate: 'Rate Mizu Webphone',
//TRANSLTEND
help_loging: 'Logs (trace)',
help_proversion: 'License',
help_about: 'About',
help_report: 'Report a problem',
help_license: 'License agreement',
help_startlog: 'Start collecting logs',
help_sendlog: 'View logs / Send to support',
help_stoplog: 'Stop collecting logs',
about_license: 'License agreement',

ct_sort_name: 'By name',
ct_sort_importance: 'By importance',
ct_sort_status: 'By status',
ct_sort_title: 'Sort contacts',
ct_filter_title: 'Display only contacts',
ct_filter_all: 'All',
ct_filter_important: 'Important',
ct_filter_online: 'Online',
btn_activate: 'Activate',
license_key: 'License key',
enter_license_key: 'Enter license key',
sett_chooseengine_title: 'VoIP engine',
sett_chooseengine_popup_title: 'Available engines',
sett_chooseengine_comment: 'Select VoIP Engine',
sett_ce_highly: 'highly recommended',
sett_ce_recommended: 'recommended',
about_homepage: 'Homepage',
about_copyright: 'Copyright &copy;',
about_copyright2: 'All rights reserved.',
hint_page: 'Current selected page',
username_warning: 'Please enter SIP username first',
hint_notif_clear: 'Clear this notification',
not_missed_call: 'Missed call from',
not_missed_chat: 'Missed chat from',
not_panel_title: 'Notifications',
help_enablelog: 'Enable logs',
help_logwindow: 'Logs',
disable_logs: 'Disable logs',
activated: 'Pro License activated.',
about_support: 'Support',
warning_feature: 'You need to get a Pro license to enable this feature.<br />To activate license, login first, then select "License" from the menu.',
allowmedia_title: 'Media access',
//--allowmedia_chrome: 'needs access to your microphone.<br />To grant access, click the "sound" icon in the top-right corner of the browser and select "allow", then remake the call.',
//--allowmedia_firefox: 'needs access to your microphone.<br />To grant access, click the "microphone" icon at the center-top the browser and select "allow", then remake the call.',
allowmedia_general: 'needs access to your microphone.<br />To grant access, click the sound/webrtc/microphone/camera/red icon in your browser and select Allow or Share, then remake the call.',
filetransf_title: 'Send file',
filetransfer_nr: 'SIP URI or username',
hint_filetranf: 'Send file',
filetransf_err: 'Enter destination first.',
fitransf_failed: 'Choose a file to send first!',
ppupload_failed: 'Choose a picture to send first!',
fitransf_succeded: 'Sent successfully',
fitransf_chat: 'sent you a file',
chrome_local_alert: 'The built-in WebRTC engine in the webphone will not work from local filesystem in Google Chrome or Opera browsers (only on HTTPS, from webservers with valid SSL certificate).\nIn these circumstances the webphone will be forced to use the NS or other engines if available. You can use Firefox if you wish to test the webphone WebRTC engine when launched from local file system.',
chrome_local_webrtc_audio: 'WebRTC does not have permission to access audio devices from local file system in Chrome and Opera browsers. \nThe webphone must be hosted on a secure webserver (HTTPS) to be able to make/receive calls using WebRTC.',
chrome_https: 'For Chrome, Opera and Firefox version 68 and above, we recommend to host the webphone on secure http (https), otherwise WebRTC will not work.',
webrtc_local_sipserver: 'Local WebRTC server required!',
chrome_https_reload: 'For Chrome, Opera and Firefox version 68 and above, the WebRTC will only work from secure http (https). \n\n Click OK to reload the page using mizu https proxy.',
all_demo_msg: 'Note: these messages are displayed only in demo version, in final build these situations are handled automatically',
mac_app: 'No engines available in your environment. Please contact your service provider.',
name: 'Name',
displayname_login: 'Your full name on the called side',

save_to_contacts_title: 'Save to contacts',
save_to_contacts_msg: 'Do you want to save this number as a contact?',
btn_save_to_contacts_1: 'Yes, create new contact',
btn_save_to_contacts_2: 'Yes, add to existing contact',
btn_save_to_contacts_dontask: 'Don\'t ask again',
audio_title: 'Audio device',
audio_mic: 'Microphone',
audio_rec: 'Speaker',
audio_ring: 'Ring',
video_rec: 'Camera',
audio_aec: 'AEC',
audio_agc: 'AGC',
audio_all_devices: 'All',
filters_title: 'Rules',
filters_add_label: 'Add rules',
filters_add_rule: 'Add rule',
filter_start: 'When number starts with',
filter_replace: 'Replace with',
filter_minlen: 'Min length',
filter_maxlen: 'Max length',
filter_warning: 'At leaset "Start with" or "Replace with" field must be entered.',
filter_delete_hint: 'Delete rule',
filter_edit_hint: 'Edit rule',
menu_block_contact: 'Block contact',
menu_unblock_contact: 'Unblock contact',
addeditct_label_email: 'Email',
addeditct_label_address: 'Address',
addeditct_label_notes: 'Notes',
addeditct_label_website: 'Website',
addeditct_addfield: 'Add field',
addeditct_hint_adddetails: 'Add additional field',
accounts_add_hint: 'Add new account',
accounts_remove_hint: 'Delete account',
accounts_remove_msg: 'Are you sure you wan to delete this account',
accounts_endis_hint: 'Enable/Disable account',
accounts_main_hint: 'Set as main account',
accounts_hint_server: 'SIP server domain (or IP:port)',
accounts_hint_user: 'SIP account username for authentication',
accounts_hint_password: 'SIP account password',
accounts_hint_callerid: 'SIP username (extension id / user id / phone number / DID / A number / AOR)',
accounts_hint_displayname: 'Your full name to be displayed on the called side',
accounts_hint_proxy: 'Outbound proxy address',
accounts_hint_realm: 'Optional parameter to set the SIP realm if not the same with the serveraddress or domain',
accounts_hint_regival: '(Re)Register time interval in seconds',
active_account: 'Main account:',
accounts_instructions1: 'Manage accounts or set main account.',
accounts_instructions2: 'The selected account will be the main account for outbound calls. Incoming calls can be received on all accounts.',
ftrnasf_status_processing: 'Processing...',
ftrnasf_status_waiting: 'Waiting for peer...',
ftrnasf_status_delivered: 'Delivered.',
ns_engine_unreachable: 'Engine unreachable.',
menu_reconnect: 'ReConnect',
menu_copy: 'Copy',
menu_paste: 'Paste',
menu_showlogs: 'Show Logs',
menu_clearsettings: 'Clear Settings',
java_freeze_ff: 'After you have accepted to "Run this application",\nClick OK to continue',
hint_hangup: 'Hangup call',
hint_accept: 'Accept call',
hint_reject: 'Reject call',
hint_reject_new: 'Reject the new incoming call',
hint_called: 'Caller/called party',
hint_callstatus: 'Call status and event messages',
hint_callduration: 'Call duration',
hint_more: 'More',
ce_ask_user: 'It seems that [SELECTEDENGINE] engine is not working. Switch to [RECOMMENDED] ?',
ce_alert_title: 'Install',
ce_alert_user: 'Please install the', // must be installed for [BRAND] to work properly.
only_webrtc_engine1: 'Only WebRTC engine is available in your browser but it is disabled in the webphone with the enginepriority_webrtc parameter',
only_webrtc_engine2: 'Only WebRTC engine is available in your browser but it is disabled in the webphone. Please contact your service provider.',
only_ns_engine1: 'Only Service plugin engine is available in your browser but it is disabled in the webphone with the enginepriority_ns parameter',
only_ns_engine2: 'Only Service plugin engine is available in your browser but it is disabled in the webphone. Please contact your service provider.',
only_ns_engine3: 'Only the Java VoIP engine is enabled, but not available in your browser. Please use a Java applet compatible browser such as Internet Explorer.',
only_ns_engine4: 'Only the Java VoIP engine is enabled, but not available in your browser. Please use a Java applet compatible browser.',
only_app_engine1: 'Only App engine is available in your browser but it is disabled in the webphone with the enginepriority_app parameter',
only_app_engine2: 'Only App engine is available in your browser but it is disabled in the webphone. Please contact your service provider.',
jnotsupported: 'Chrome doesn\'t support java, use another browser',
favafone_new: 'I am new to Favafone',
newuser_pleaseenter: 'Please enter',
newuser_invalid: 'Invalid',
smscode_instrucation: 'You should receive your sign-in code now by SMS. Please enter your sign-in code:',
hint_callforward: 'Call forward',
initiate_callforward: 'Initiate call forward',
callforward_title: 'Call forward',
menu_callforward: 'Call forward',
recharge_msg: 'Recharge card (PIN code)',
recharge_error: 'Enter your recharge PIN code',
username_err: 'The username contains unsupported special characters, please rewrite',
password_err: 'The password contains unsupported special characters, please rewrite',
menu_webcallme: 'My click2call URL',
menu_confrooms: 'Conference',
menu_callpickup: 'Call Pickup',
webcallme_msg: 'Send this link to your friends and they will be able to call you with a simple click',
cb_callonmobile: 'Mobile call',
cb_callonnative: 'VoIP call',
confroom_msg1: 'Your conference room number is',
confroom_msg2: 'Add people to the conference',
confdtmf_msg: 'Add people to the conference',
confroom_inv_title: 'Invite to conference',
confroom_inv_msg: 'You are invited to conference call by',
service_update: 'A new version of the NS VoIP engine is available.<br> Please download and launch the executable to upgrade.',
video_call: 'Video call',
video_call_msg: 'Video call',
btn_videocall: 'Video call',
menu_ignore: 'Ignore',
hint_smiley: 'Insert emoticon',
menu_groupchat: 'Add people (group chat)',
status_startingengine: 'Starting VoIP engine',
status_enginestarted: 'VoIP engine started',
usenative_title: 'Use native app',
usenative_option_native: 'Recommended: native dialer with better quality',
usenative_option_webrtc: 'Ignore and start (webrtc) in web browser right now',
menu_ct_setfavorite: 'Set as favorite',
menu_ct_unsetfavorite: 'Remove from favorite',
ct_unsetfavorited: 'Removed from favorites',
menu_videorecall: 'Video Recall',
menu_speedtest: 'Speed test',
hint_speedtest: 'Test your internet connection bandwith, packet loss and latency',
switch_engine: 'Switch engine',
gc_message: 'You are in a group chat with',
gc_message2: 'joined the conversation',
username_warning2: 'Username minimum length is 3.',
password_warning2: 'Password minimum length is 3.',
composing: 'is typing',
logview_msg: 'The page may not be available for a few seconds. Reload the page if nothing happens.',
messagepl: 'Compose',
unlockadvancedsett_title: 'Unlock Settings',
unlockadvancedsett_msg: 'Enter password to unlock advanced settings',
warning_notreg: 'Cannot initiate call because not yet registered',
warning_notstarted: 'Cannot initiate call because phone not started yet',
log_email: 'Your email address (useful for any technical support).',
log_description: 'Describe the problem shortly.',
log_desc_error: 'Not sent! Description is mandatory.',
ac_showadvanced: 'Show advanced login settings',
ac_hideadvanced: 'Hide advanced login settings',
sms_verification_error1: 'Invalid sign-in code',

request_permission: 'Waiting for permission. Please push the Allow/Share button in your browser. Click on the webrtc/microphone/camera/red icon if you do not see the dialog.',
request_permission2_title: 'Allow permission',
request_permission2: 'Allow [BRANDNAME] to use your microphone and/or camera.<br><br>It may be possible that you have blocked access before to microphone and/or camera devices. In this case go to your browser settings and enable access for this domain.',
warning_msg_1: 'Only direct calls to SIP URIs will be possible if the VoIP Server address is not set',
warning_msg_2: 'IP or domain name is not accepted in this version. Enter server name or ID here.',
warning_msg_3: "Please enter the contact's name",
warning_msg_4: "Failed retrieving configurations.<br /><br /> On Settings page Server input, enter your VoIP provider's domain name or IP address",
err_msg_1: 'Invalid username.',
err_msg_2: 'Invalid password.',
err_msg_3: 'ERROR, Enter a phone number or SIP URI or username',
err_msg_4: 'Invalid phone number or SIP URI or username',
err_msg_5: 'Invalid phone number.',
err_msg_6: 'Invalid address.',
err_msg_7: 'No messages to delete',

err_msg_8: 'Enter a username.',
err_msg_9: 'Enter a password.',
err_msg_10: 'Enter your email address.',
err_msg_11: 'Enter your full name.',
err_msg_12: 'Invalid email address.',
err_msg_13: 'Username\'s length must be at least',
err_msg_14: 'Invalid username.',
err_msg_15: 'Passwords\'s length must be at least',
err_msg_16: 'Invalid password.',
err_msg_17: 'Full names\'s length must be at least',
err_msg_18: 'Invalid name.',
err_msg_19: 'Invalid phone number.',
err_msg_20: 'Invalid address.',
err_msg_21: 'Enter your phone number.',
err_msg_22: 'Cannot retrieve configuration. Try again later.',

err_nocallinprogress: 'No call in progress',
err_nocallinprogress2: 'No incoming call while trying to accept',
err_flash_local: 'Flash engine will work only if launched from a webserver, not from local file system',

srvaddr_help: 'VoIP service provider server address (ip address or domain name or DNS SRV record). You can also suffix a port number if the server is not on the default SIP port (5060). Example: yourserver.com:6000<br /><br /> In case if you are new to VoIP:<br /> Unlike some other popular software such as Skype, if you are using standard SIP protocol you can use any VoIP provider. There are a hundreds of such kind of services and you could also setup your own server, for example using Mizu server or Asterisk.<br /> Internal (softphone to softphone) calls are usually free and the cost of outbound calls (calls to mobile or landline) are usually cheaper than for traditional providers, especially international calls.<br /> There are also a lot of other benefits in using standard VoIP such as high call quality (with wideband codec), freedom (you can switch your provider at any time), control (you can easily manage your account) and flexibility (lots of extra services such as call recording, conferencing and others). You can even use multiple providers (for example you can always use the cheaper one for your call targets).<br /> If you don\'t have a VoIP account yet then you can create one within a few minutes at any provider and start using VoIP right now: https://www.voip-info.org/wiki/view/Sip+Phone+Service+Providers',

dtmfmode_op_0: 'Disabled',
dtmfmode_op_1: 'SIP INFO method',
dtmfmode_op_2: 'Auto (auto guess from peer advertised capabilities)',
dtmfmode_op_3: 'INFO + NTE',
dtmfmode_op_4: 'NTE (Named Telephone Events as specified in RFC2833 and RFC 4733)',
dtmfmode_op_5: 'In-Band (DTMF audio tones in the RTP stream)',
dtmfmode_op_6: 'INFO + InBand',
enableblf__no: 'No',
enableblf__auto: 'Auto',
enableblf__always: 'Always',
enableblf__must: 'Force',
displaynotification__never: 'Never',
displaynotification__onevent: 'on event',
dropsameoldcall__no: 'No',
dropsameoldcall__requested: 'When reqested (if sip header received)',
dropsameoldcall__reqvideo: 'Yes when requested and video',
dropsameoldcall__forall: 'Yes-for all calls',
chatsms__auto_guess_or_ask: 'Auto guess',
chatsms__sms_only: 'SMS only',
chatsms__chat_only: 'Chat only',
chatsms__disable: 'Disable incoming text messages',
defmute__both: 'Both',
defmute__speakers_only: 'Speakers only',
defmute__mic_only: 'Mic only',
videomode__always: 'Always in video mode',
videomode__noask: 'Call back when needed (do not ask)',
videomode__askonce: 'Call back when needed (ask once)',
videomode__alwaysask: 'Call back when needed (always ask)',
videomode__disable: 'Disable incoming video',
ssquality__low: 'Low',
ssquality__medium: 'Medium',
ssquality__high: 'High',
importonlywithnum__no: 'No (import all users even with no valid phone number)',
importonlywithnum__yes: 'Yes (import only users with phone number)',
incomingcallpopup__no: 'No',
incomingcallpopup__auto: 'Auto (show only if browser window is not in foreground/focused)',
incomingcallpopup__yes: 'Yes',
incomingcallpopup__always: 'Always force from all engines',
androidspeaker__ignore: 'Do not change',
androidspeaker__guess: 'Auto guess',
androidspeaker__def: 'Default',
androidspeaker__before_fcall: 'Switch off speakerphone before the first call',
androidspeaker__after_fcall: 'Switch off speakerphone after the first call',
androidspeaker__atstart: 'Switch off speakerphone at start',
alwaysallowlowcodec__never: 'Never',
alwaysallowlowcodec__auto: 'Auto',
alwaysallowlowcodec__always: 'Always',
nsupgrademode__background: 'Delayed background install only',
nsupgrademode__delayed: 'Background or ask for user',
nsupgrademode__immediate: 'Immediate install',
video__auto: 'Auto',
video__disable: 'Disable',
video__enable: 'Enable',
video__force: 'Force',
agc__disabled: 'Disabled',
agc__for_redcording: 'For recording only',
agc__both_for_recording_and_playback: 'Both for playback and recording',
agc__guess: 'Guess',
use_fast_ice__no: 'No (set to 0 only if your server needs to always route the media)',
use_fast_ice__auto: 'Auto',
use_fast_ice__yes: 'Yes',
use_fast_ice__always: 'Always (not recommended)',
use_stun__force: 'Force private IP',
use_stun__no: 'No',
use_stun__stable_nat: 'With stable NAT only',
use_stun__all_symetric: 'On all symmetric NAT',
use_stun__always: 'Always',
use_stun__public_ip: 'Use even on public IP',
share_location__no: 'No',
share_location__yes: 'Share',
earlymedia__no: 'No',
earlymedia__reserved: 'Reserved',
earlymedia__auto: 'Auto (will early open audio if wideband is enabled to check if supported)',
earlymedia__just_early: 'Just early open the audio',
earlymedia__null_packets: 'Null packets only when SDP received',
earlymedia__yes: 'Yes when SDP received',
earlymedia__always_force: 'Always forced yes',
use_rport__no: 'No',
use_rport__simmetric_nat: 'On simmetric nat',
use_rport__always: 'Always',
use_rport__public_ip: 'Even on public ip',
use_rport__request: 'Request but don\'t use',
register__no: 'No',
register__auto: 'Auto guess',
register__yes: 'Yes',
changesptoring__nothing: 'Do nothing',
changesptoring__disp_ringing: 'Display ringing status',
changesptoring__start_media: 'Start media',
changesptoring__start_media_disp: 'Start media and display ringing',
playring__no: 'No',
playring__incoming: 'For incomming calls',
playring__both: 'For incomming and outgoing calls',
setfinalcodec__never: 'Never',
setfinalcodec__auto: 'Auto',
setfinalcodec__multiple_codec: 'On multiple codec',
setfinalcodec__always: 'Always',
denoise__disabled: 'Disabled',
denoise__recording: 'For recording only',
denoise__both: 'Both for playback and recording',
denoise__auto: 'Auto guess',
plc__no: 'No',
plc__auto: 'Automatic',
plc__yes: 'Yes',
silencesupress__auto: 'Auto',
silencesupress__no: 'No',
silencesupress__yes: 'Yes',
hardwaremedia__auto: 'Auto',
hardwaremedia__no: 'No',
hardwaremedia__yes: 'Yes',
mediaencryption__no: 'No',
mediaencryption__auto: 'Auto',
mediaencryption__srtp: 'SRTP',
setqos__auto: 'Auto',
setqos__no: 'No',
setqos__yes: 'Yes',
codecframecount_auto: 'Auto',
doublesendrtp__no: 'No',
doublesendrtp__yes: 'Yes',
jittersize__no: 'No jitter',
jittersize__esmall: 'Extra small',
jittersize__small: 'Small',
jittersize__normal: 'Normal',
jittersize__big: 'Big',
jittersize__ebig: 'Extra big',
jittersize__max: 'Max',
speakermode__auto: 'Auto',
speakermode__never: 'Never',
speakermode__always: 'Always',
autoignore__dont: 'Don\'t ignore',
autoignore__silently: 'Silently ignore',
autoignore__reject: 'Reject',
transfwithreplace__auto: 'Auto',
transfwithreplace__no: 'No',
transfwithreplace__yes: 'Yes',
transfertype__auto: 'Auto',
transfertype__unattended: 'Unattended drop',
transfertype__withhold: 'Unattended with hold',
transfertype__attanded: 'Attanded (call first)',
transfertype__with_no_hold: 'Transfer with no hold and no disconnect',
transfertype__with_conf: 'Transfer with conference',
automute__no: 'No (default)',
automute__incoming: 'On incoming call',
automute__outgoing: 'On outgoing call',
automute__both: 'On incoming and outgoing calls',
automute__other_line: 'On other line button click',
autohold__no: 'No (default)',
autohold__incoming: 'On incoming call',
autohold__outgoing: 'On outgoing call',
autohold__both: 'On incoming and outgoing calls',
autohold__other_line: 'On other line button click',
holdtype__never: 'Never hold',
holdtype__auto: 'Auto',
holdtype__no: 'No',
holdtype__notused: 'Not used',
holdtype__hold: 'Hold',
holdtype__otherparty: 'Other party hold',
holdtype__both: 'Both in hold',
enablepush__auto: 'Auto',
enablepush__no: 'No',
enablepush__yes: 'Yes',
enablepush__yesauto: 'Yes - Autodetect',
enablepush__yesdirect: 'Yes - Direct',
enablepush__yesgateway: 'Yes - Gateway',
conferencetype__disabled: 'Disabled',
conferencetype__auto: 'Auto',
conferencetype__native: 'Native only with local rtp mixer',
conferencetype__server: 'Server side DTMF controlled',
conferencetype__3way: '3-way SIP conference',
conferencetype__cr_msg_ref: 'Conference rooms via SIP MESSAGE and REFER',
conferencetype__cr_msg: 'Conference rooms via SIP MESSAGE',
conferencetype__cr_ref: 'Conference rooms via SIP REFER',
callreceiver__auto: 'Auto',
callreceiver__noincoming: 'Disable all incoming calls',
callreceiver__enablewhilerunning: 'Enable incoming calls (while app is running - no background listener)',
callreceiver__enablebackgroud: 'Enable also background callses',
normalizenumber__auto: 'Auto',
normalizenumber__no: 'No',
normalizenumber__yes: 'Yes',
savetocontacts__no: 'No',
savetocontacts__ask: 'Ask',
savetocontacts__yes: 'Yes (will not ask for a contact name)',
error_noserver: 'Serveraddress is not set.',
addaccount_title: 'Add account',
addaccount_msg: 'Fill in the following details in order to create a new account',
addacc_server: 'Serveraddress',
addacc_user: 'Username',
addacc_password: 'Password',
addacc_ival: 'Register interval',
addacc_invalid: 'Invalid',

line_title: 'Line',
menu_multilinecall: 'New call',
hint_accept_end: 'End the old call and Accept the new one',
hint_accept_hold: 'Put the old call on hold and Accept the new one',
menu_accept_end: 'End old Accept new',
menu_accept_hold: 'Hold old Accept new',
menu_exit_videomode: 'Exit video mode',
menu_filter: 'Filter',
chfilter_all: 'All',
chfilter_out: 'Outgoing',
chfilter_in: 'Incoming',
chfilter_missed: 'Missed',
disc_reason: 'Disconnect reason',
menu_screenshare: 'Screenshare',
screenshare_call: 'Screen share',
btn_sharescreen: 'Share',
btn_video_fullscreen: 'Full Screen',
accounts_title: 'Accounts',
add_account: 'Add account',
noaccounts: 'No accounts. Click the Plus button to add accounts',
hint_closecall: 'Close call',
notification_message: 'Incoming call from',
chrome_ext_install_title: 'Install Chrome extension',
chrome_ext_install: 'Before using Screen sharing, the Chrome extension from the below link needs to be installed.',
chrome_ext_enable_title: 'Enable Chrome extension',
chrome_ext_enable: 'Click on the below link and enable Screen Capturing chrome extension',

sett_display_name_serveraddress_user: 'Server',
sett_comment_serveraddress_user: 'Enter server adress (domain or IP:port), brand-name or op-code here',
sett_comment_serveraddress_user_gmsdialer: 'Enter the operator code',
sett_comment_short_serveraddress_user: '',
sett_comment_serveraddress_user_operator: 'Enter the operator code',

sett_display_name_sipusername: 'Username',
sett_comment_sipusername: 'Your SIP username used for authentication',
sett_comment_short_sipusername: 'VoIP account username',    

sett_display_name_password: 'Password',
sett_comment_password: 'Enter the password for your SIP account',
sett_comment_short_password: 'VoIP account password',

sett_display_name_startwithos: 'Start with Windows',
sett_comment_startwithos: 'Start when Windows starts',
sett_comment_short_startwithos: '',

sett_display_name_startonboot: 'Run in background',
sett_comment_startonboot: 'Always listen for incoming calls (service will run in backround to enable incoming calls)',
sett_comment_short_startonboot: '',

sett_display_name_codec: 'Audio codec',
sett_comment_codec: 'Choose preferred codec',
sett_checkbox_codec: 'Use Only preferred codec',
sett_comment_short_codec: '',

sett_display_name_videocodec: 'Video codec',
sett_comment_videocodec: 'Choose preferred video codec',
sett_checkbox_videocodec: 'Use Only preferred video codec',
sett_comment_short_videocodec: '',

sett_display_name_androidspeaker: 'Android speaker',
sett_comment_androidspeaker: 'Specify the default playback device on Android',
sett_comment_short_androidspeaker: '',

sett_display_name_alwaysallowlowcodec: 'Allow narrowband codec',
sett_comment_alwaysallowlowcodec: 'Always enable basic narrowband codec',
sett_comment_short_alwaysallowlowcodec: '',

sett_display_name_dropsameoldcall: 'Drop same old call',
sett_comment_dropsameoldcall: 'Drop call if same call is received multiple times',
sett_comment_short_dropsameoldcall: '',

sett_display_name_dtmfmode: 'DTMF',
sett_comment_dtmfmode: 'Choose DTMF (tone dialing) send method',
sett_comment_short_dtmfmode: '',

sett_display_name_register: 'Register',
sett_comment_register: 'Register to domain. This is always needed to receive incoming calls and some providers require also to allow outgoing calls.',
sett_comment_short_register: 'Enable / Disable registration to SIP domain',

sett_display_name_registerinterval: 'Register interval',
sett_comment_registerinterval: '(Re)Register time interval in seconds',
sett_comment_short_registerinterval: '',

sett_display_name_keeprecfiles: 'Keep recordings for',
sett_comment_keeprecfiles: 'Keep call recordings for last specified days',
sett_comment_short_keeprecfiles: '',

sett_display_name_filters: 'Number rewrite',
sett_comment_filters: 'Add destination number rewrite rules (add/remove/rewrite prefix)',
sett_comment_short_filters: '',

sett_display_name_earlymedia: 'Send early media',
sett_comment_earlymedia: 'Start to send media when session progress is received',
sett_comment_short_earlymedia: '',

sett_display_name_transfertype: 'Transfer type',
sett_comment_transfertype: 'Choose call transfer method',
sett_comment_short_transfertype: '',

sett_display_name_conferencetype: 'Conference type',
sett_comment_conferencetype: 'Enable/disable conference room feature',
sett_comment_short_conferencetype: '',

sett_display_name_playring: 'Ringback for',
sett_comment_playring: 'Generate ringtone for incoming and outgoing calls',
sett_comment_short_playring: '',

//--sett_display_name_autoanswer_forward: 'Auto answer, forward or ignore',
//--sett_comment_autoanswer_forward: 'Automatically handle all incoming calls',
//--sett_comment_short_autoanswer_forward: '',

sett_display_name_proxyaddress: 'Proxy address',
sett_comment_proxyaddress: 'Outbound SIP proxy address. Leave it empty if you don’t have a stateless/outbound proxy',
sett_comment_short_proxyaddress: 'Outbound proxy address',

sett_display_name_realm: 'Realm',
sett_comment_realm: 'Set the SIP realm if not the same with the serveraddress or domain',
sett_comment_short_realm: '',

sett_display_name_voicemailnum: 'Voicemail',
sett_comment_voicemailnum: 'Set voicemail number which will be used if not received automatically',
sett_comment_short_voicemailnum: 'Set voicemail access number',

sett_display_name_use_stun: 'Use STUN',
sett_comment_use_stun: 'Change if you have NAT related issues (can\'t register, can\'t call, no voice problems)',
sett_comment_short_use_stun: 'Enable external address discovery',

sett_display_name_use_fast_ice: 'Use ICE',
sett_comment_use_fast_ice: 'Fast ICE negotiations (for p2p rtp routing).<br />Note: if set to "Auto" or "Yes" then STUN should not be disabled',
sett_comment_short_use_fast_ice: '',

sett_display_name_techprefix: 'Tech. prefix',
sett_comment_techprefix: 'Add any prefix for all called numbers',
sett_comment_short_techprefix: '',

sett_display_name_volumein: 'Volume in',
sett_comment_volumein: 'Set default microphone volume between 0 and 100%. 50 means no volume changes.',
sett_comment_short_volumein: '',

sett_display_name_volumeout: 'Volume out',
sett_comment_volumeout: 'Set default speaker volume between 0 and 100%. 50 means no volume changes.',
sett_comment_short_volumeout: '',

sett_display_name_prack: 'Use PRACK',
sett_comment_prack: '100rel support. Should be enabled only if your server require this',
sett_comment_short_prack: '',

sett_display_name_ringtimeout: 'Ring timeout',
sett_comment_ringtimeout: 'Maximum ringing time allowed in seconds. Default is 90 seconds',    
sett_comment_short_ringtimeout: '',

sett_display_name_calltimeout: 'Call timeout',
sett_comment_calltimeout: 'Maximum speech time allowed in seconds. Default is 10800 seconds which means 3 hours',
sett_comment_short_calltimeout: '',

sett_display_name_enableblf: 'BLF',
sett_comment_enableblf: 'Busy Lamp Field',
sett_comment_short_enableblf: '',

sett_display_name_username: 'Caller ID',
sett_comment_username: 'This will not be used for authentication. Specify your User or extension ID here if not the same as Username for authentication setting. Some VoIP servers will reject if not the same with the username!',
sett_comment_short_username: 'You might set a different username here used for A number display',

sett_display_name_displayname: 'Display name',
sett_comment_displayname: 'Specify display name. This is an optional setting and it should be your full name',
sett_comment_short_displayname: 'Set display name',

sett_display_name_theme: 'Theme',
sett_comment_theme: 'Change skin colors',
sett_comment_short_theme: '',

sett_display_name_hidemyidentity: 'Hide my identity',
sett_comment_hidemyidentity: 'Hide Caller ID',
sett_comment_short_hidemyidentity: '',

sett_display_name_keepaliveival: 'Keep-alive',
sett_comment_keepaliveival: 'NAT keep-alive packet send interval in milliseconds. Set to 0 to disable.',
sett_comment_short_keepaliveival: '',

sett_display_name_localip: 'Local IP address',
sett_comment_localip: 'Optionally specify local signaling IP address to use',
sett_comment_short_localip: '',

sett_display_name_signalingport: 'Local signaling port',
sett_comment_signalingport: 'Specify local IP address signaling port to use (default is a stable port initialized with a random value. This has nothing to do with the server SIP port which is usually 5060)',
sett_comment_short_signalingport: 'Optionally specify local signaling port to use',

sett_display_name_rtpport: 'Local RTP port',
sett_comment_rtpport: 'Specify local RTP port base (default is a stable port base initialized with a random value)',
sett_comment_short_rtpport: 'Specify local RTP port base',

sett_display_name_jittersize: 'Jitter size',
sett_comment_jittersize: 'The jitter buffer is used for smooth playback under variable bandwidth. The size is calculated dynamically, but its behavior can modified with this setting',
sett_comment_short_jittersize: '',

sett_display_name_forcewifi: 'Force WiFi',
sett_comment_forcewifi: '(Re)Enable and scan WiFi on startup, new call or connection lost (Even without this setting, WiFi will be the preferred when available)',
sett_comment_short_forcewifi: 'Keep the WiFi awake to handle incoming calls',

//-- callforwardonbusy,callforwardalways,calltransferalways,autoignore,autoaccept
sett_display_name_callforwardonbusy: 'Call forward',
sett_comment_callforwardonbusy: 'Set call forward number used when call is rejected on busy or for auto forward',
sett_comment_short_callforwardonbusy: '',

sett_display_name_callforwardonnoanswer: 'Call forward no answer',
sett_comment_callforwardonnoanswer: 'Set call forward number calls should be forwarded if no answer',
sett_comment_short_callforwardonnoanswer: '',

sett_display_name_callforwardonnoanswertimeout: 'Call forward no answer timeout',
sett_comment_callforwardonnoanswertimeout: 'Delay in seconds before call is forwarded on no answer',
sett_comment_short_callforwardonnoanswertimeout: '',

sett_display_name_callforwardalways: 'Call forward always',
sett_comment_callforwardalways: 'Set call forward number where all calls should be forwarded',
sett_comment_short_callforwardalways: '',

sett_display_name_calltransferalways: 'Call transfer',
sett_comment_calltransferalways: 'Set call transfer number where all calls should be transferred',
sett_comment_short_calltransferalways: '',

sett_display_name_autoignore: 'Auto ignore',
sett_comment_autoignore: 'Automtically ignore all incoming calls',
sett_comment_short_autoignore: '',

sett_display_name_autoaccept: 'Auto accept',
sett_comment_autoaccept: 'Automatically accept all incoming calls (auto answer)',
sett_comment_short_autoaccept: '',

sett_display_name_callforwardonreject: 'Call forward on reject',
sett_comment_callforwardonreject: 'Forward call if rejected',
sett_comment_short_callforwardonreject: '',

sett_display_name_rejectonvoipbusy: 'On VoIP busy',
sett_comment_rejectonvoipbusy: 'Set behavior if there is already a VoIP call in progress',
sett_comment_short_rejectonvoipbusy: '',

//TRANSLTSTART
//OPSSTART
sett_display_name_usetunneling: 'Tunneling and encryption',
sett_comment_usetunneling: 'Use encrypted and tunneled transport layer (UDP, TCP or HTTP)',
sett_comment_short_usetunneling: 'Use alternative encrypted transport',
sett_comment_usetunneling_1: 'Useful in VoIP blocked countries and from behind firewalls. If you need to use this feature for more than a few calls, then you should upgrade to MizuDroidPro which includes unlimited tunneling service.',
sett_comment_usetunneling_2: 'Use signaling and media within encrypted tunnel.',
//OPSEND
//TRANSLTEND

sett_display_name_encryptionport: 'Encryption port',
sett_comment_encryptionport: 'Server base port used for encrypted transport',
sett_comment_short_encryptionport: '',

//--sett_display_name_loglevel: 'Set log/trace level',
//--sett_comment_loglevel: 'Set log detail level when logs are enabled',
//--sett_comment_short_loglevel: '',

sett_display_name_voicerecording: 'Record calls',
sett_comment_voicerecording: 'If enabled, all calls will be recorded',
sett_comment_short_voicerecording: '',

sett_display_name_loglevel: 'Enable log',
sett_comment_loglevel: 'Save trace to file for later uploading to technical support',
sett_comment_short_loglevel: '',

sett_display_name_loglevel_dbg: 'Set log/trace level',
sett_comment_loglevel_dbg: 'Set log detail level when logs are enabled',
sett_comment_short_logleveldbg: '',

sett_display_name_rejectonphonebusy: 'On phone busy',
sett_comment_rejectonphonebusy: 'Set behavior if there is already a native phone call in progress',
sett_comment_short_rejectonphonebusy: '',

sett_display_name_proximitysensor: 'Proximity sensor',
sett_comment_proximitysensor: 'Turn off the screen while in call. This feature is turned off by default because most of the devices has problems when turned on',
sett_comment_short_proximitysensor: 'Turn off the screen wile near ear',

sett_display_name_aec: 'AEC',
sett_comment_aec: 'Acoustic echo cancellation. Turn on if your peers hears their echo.',
sett_comment_short_aec: '',

sett_display_name_agc: 'AGC',
sett_comment_agc: 'Automatic gain control. Will control the volume automatically.',
sett_comment_short_agc: '',

sett_display_name_denoise: 'Denoise',
sett_comment_denoise: 'Remove noise from the conversation (such as background noise or noise generated by the microphone).',
sett_comment_short_denoise: '',

sett_display_name_silencesupress: 'Silence suppression',
sett_comment_silencesupress: 'Do not transmit media when you do not speak. Enable only if your if your bandwidth is really poor.',
sett_comment_short_silencesupress: '',

sett_display_name_plc: 'PLC',
sett_comment_plc: 'Packet loss concealment. Helps to improve the call quality on packet loss which occurs on low quality networks',
sett_comment_short_plc: '',

sett_display_name_callback_mode: 'Callback mode',
sett_comment_callback_mode: 'Chose when to use callback if any',
sett_comment_short_callback_mode: '',

sett_display_name_email: 'Email',
sett_comment_email: 'Your email address (useful for any technical support)',
sett_comment_short_email: 'Your email address',

sett_display_name_chatsms: 'Chat/SMS',
sett_comment_chatsms: 'Set messaging method',
sett_comment_short_chatsms: '',

sett_display_name_textmessaging: 'Messaging',
sett_comment_textmessaging: 'Specify text messaging method',
sett_comment_short_textmessaging: '',

sett_display_name_savetocontacts: 'New contacts',
sett_comment_savetocontacts: 'Whether to (automatically) add new unknown called numbers to your contact list',
sett_comment_short_savetocontacts: 'Add new contacts to contact list',

sett_display_name_call_access: 'Call access number',
sett_comment_call_access: 'IVR access number to call from mobile operator network',
sett_comment_short_call_access: 'Access number to call from mobile operator network',

sett_display_name_unlockphone: 'Unlock keyguard',
sett_comment_unlockphone: 'Automatically unlock phone keyguard on incoming call',
sett_comment_short_unlockphone: '',

sett_display_name_audiorecorder: 'Audio recorder',
sett_comment_audiorecorder: 'Select audio recorder stream for calls. Should be changed only on special devices or if you have special requirements or the automatic setting is not the preferred',
sett_comment_short_audiorecorder: '',

sett_display_name_audioplayer: 'Audio player',
sett_comment_audioplayer: 'Select audio player stream for calls. Should be changed only on special devices or if you have special requirements or the automatic setting is not the preferred',
sett_comment_short_audioplayer: '',

sett_display_name_speakerphoneplayer: 'Speakerphone player',
sett_comment_speakerphoneplayer: 'Select audio speakerphone player stream. Should be changed only on special devices or if you have special requirements or the automatic setting is not the preferred',
sett_comment_short_speakerphoneplayer: '',

sett_display_name_speakerphoneoutput: 'Audio mode',
sett_comment_speakerphoneoutput: 'Select the output device when you switch to speakerphone',
sett_comment_short_speakerphoneoutput: '',

sett_display_name_keepalive: 'Keep-alive',
sett_comment_keepalive: 'Will send a short packet in the specified time interval (seconds) to open and keep your NAT device (router) opened in order to enable incoming calls and other notifications',
sett_comment_short_keepalive: 'Keep your NAT opened',

sett_display_name_mediaencryption: 'Media encryption',
sett_comment_mediaencryption: 'Set media encryption method',
sett_comment_short_mediaencryption: '',

sett_display_name_setqos: 'QoS',
sett_comment_setqos: 'Sets traffic class or type-of-service octet in the IP header for UDP packets',
sett_comment_short_setqos: '',

sett_display_name_codecframecount: 'RTP Frame/Packet',
sett_comment_codecframecount: 'Number of codec payloads in one UDP/RTP packet. Higher values will require less bandwidth but more delays. Unusual values (above 4) can cause incompatibility with your provider.',
sett_comment_short_codecframecount: 'Number of codec payloads in one UDP packet',

sett_display_name_doublesendrtp: 'Double send RTP',
sett_comment_doublesendrtp: 'Might improve audio quality in certain circumstances, but will increase upload data amount',
sett_comment_short_doublesendrtp: 'Double send RTP packets',

sett_display_name_cfgcpuspeed: 'CPU Speed',
sett_comment_cfgcpuspeed: 'Features such as AEC or codec are turned on/off based on your device processor speed',
sett_comment_short_cfgcpuspeed: 'Features are selected automatically based on your CPU speed',

sett_display_name_cfgnetworkspeed: 'Network Speed',
sett_comment_cfgnetworkspeed: 'Helps to choose the best codec and media enhancements for your calls.',
sett_comment_short_cfgnetworkspeed: '',

sett_display_name_accounts: 'Accounts',
sett_comment_accounts: 'Manage multiple SIP accounts. Use this only if you wish to set more then one account!',
sett_comment_short_accounts: '',

sett_display_name_extraoption: 'Extra options',
sett_comment_extraoption: 'Set any custom parameters in a key-value pair list, separated by semicolon.<br />Ex: displayname=John;',
sett_comment_short_extraoption: 'Set any custom parameters',

sett_display_name_enablepush: 'Enable background calls',
sett_comment_enablepush: 'Listen for incoming calls also when the webphone is not opened',
sett_comment_short_enablepush: '',

sett_display_name_reset_settings: 'Reset settings',
sett_comment_reset_settings: 'Reset settings to their default values',
sett_comment_short_reset_settings: '',

sett_display_name_ringtone: 'Ringtone',
sett_comment_ringtone: 'Change your ringtone for incoming calls',
sett_comment_short_ringtone: '',

sett_display_name_changesptoring: 'Ring on session progress',
sett_comment_changesptoring: 'Treat session progress (183) responses as ringing (180). This might be required if your service provider doesn\'t send ringing nor early media',
sett_comment_short_changesptoring: 'Treat session progress (183) responses as ringing (180)',

sett_display_name_transport: 'Transport protocol',
sett_comment_transport: 'Select transport layer',
sett_comment_short_transport: '',

sett_display_name_defmute: 'Mute direction',
sett_comment_defmute: 'Specify how to mute the calls when mute button is pressed',
sett_comment_short_defmute: '',

sett_display_name_incomingcallpopup: 'Incoming call popup',
sett_comment_incomingcallpopup: 'Whether to display a popup about incoming calls.',
sett_comment_short_incomingcallpopup: '',

sett_display_name_automute: 'Mute on new call',
sett_comment_automute: 'Specify whether existing calls should be muted on a new call',
sett_comment_short_automute: '',

sett_display_name_autohold: 'Hold on new call',
sett_comment_autohold: 'Specify whether existing calls should be held on a new call',
sett_comment_short_autohold: '',

sett_display_name_holdtype: 'Hold type',
sett_comment_holdtype: 'Specify how to hold calls',
sett_comment_short_holdtype: '',

sett_display_name_customsipheader: 'Custom SIP header',
sett_comment_customsipheader: 'Set a custom SIP header (a line in the SIP signaling) that will be sent with all SIP messages (Expert setting)',
sett_comment_short_customsipheader: '',

sett_display_name_presencestatus: 'Presence status',
sett_comment_presencestatus: 'Change my presence status.',
sett_comment_short_presencestatus: '',

sett_display_name_profilestatustext: 'About me',
sett_comment_profilestatustext: 'You can enter any text here (for example link to your facebook page).',
sett_comment_short_profilestatustext: '',

sett_display_name_share_location: 'Share my location',
sett_comment_share_location: 'Share my location details with contacts.',
sett_comment_short_share_location: '',

sett_display_name_profilepicture: 'Profile picture',
sett_comment_profilepicture: 'Set your profile picture.',
sett_comment_short_profilepicture: '',

sett_display_name_enginepriority_java: 'Java applet priority',
sett_comment_enginepriority_java: 'Set java applet engine priority',
sett_comment_short_enginepriority_java: '',

sett_display_name_enginepriority_webrtc: 'WebRTC priority',
sett_comment_enginepriority_webrtc: 'Set WebRTC engine priority',
sett_comment_short_enginepriority_webrtc: '',

sett_display_name_enginepriority_ns: 'Service plugin priority',
sett_comment_enginepriority_ns: 'Set service plugin engine priority',
sett_comment_short_enginepriority_ns: '',

sett_display_name_enginepriority_flash: 'Flash priority',
sett_comment_enginepriority_flash: 'Set flash engine priority',
sett_comment_short_enginepriority_flash: '',

sett_display_name_enginepriority_app: 'App priority',
sett_comment_enginepriority_app: 'Set app engine priority',
sett_comment_short_enginepriority_app: '',

sett_display_name_enginepriority_p2p: 'P2P priority',
sett_comment_enginepriority_p2p: 'Set phone to phone engine priority',
sett_comment_short_enginepriority_p2p: '',

sett_display_name_enginepriority_accessnum: 'Access number priority',
sett_comment_enginepriority_accessnum: 'Set access number engine priority',
sett_comment_short_enginepriority_accessnum: '',

sett_display_name_enginepriority_nativedial: 'Native dialer priority',
sett_comment_enginepriority_nativedial: 'Set native dialer engine priority',
sett_comment_short_enginepriority_nativedial: '',

sett_display_name_sendrtponmuted: 'Send media on muted',
sett_comment_sendrtponmuted: 'Send RTP even if muted (zeroed packets). Set to true only if your server is malfunctioning when RTP is suppressed',
sett_comment_short_sendrtponmuted: '',

sett_display_name_capabilityrequest: 'Capability request',
sett_comment_capabilityrequest: 'If set, then will send a capability request (OPTIONS) message to the SIP server on startup',
sett_comment_short_capabilityrequest: '',

sett_display_name_dialerintegration: 'Integrate',
sett_comment_dialerintegration: 'When dialing with native dialer you\'ll be asked if you want to use SIP or mobile',
sett_comment_short_dialerintegration: '',

sett_display_name_devtest: 'Developer tests',
sett_comment_devtest: 'Used for development only',
sett_comment_short_devtest: '',

sett_display_name_settobasefunctionality: 'Set to base functionality',
sett_comment_settobasefunctionality: 'Used for development',
sett_comment_short_settobasefunctionality: '',

sett_display_name_enableaudio: 'Enable audio',
sett_comment_enableaudio: 'Used only for tests',
sett_comment_short_enableaudio: '',

sett_display_name_screenrotation: 'Screen rotation',
sett_comment_screenrotation: 'Control screen orientation',
sett_comment_short_screenrotation: 'Control screen orientation',

sett_display_name_audiobufferlength: 'Audiobuffer length',
sett_comment_audiobufferlength: '-1 means auto. Valid values are between 160 and 16000. Expert setting.',
sett_comment_short_audiobufferlength: 'Advanced setting for the audio playback buffer size',

sett_display_name_p2p: 'Phone 2 Phone URI',
sett_comment_p2p: 'Phone 2 Phone http request',
sett_comment_short_p2p: 'Server HTTP API if any',

sett_display_name_callback: 'Callback URI',
sett_comment_callback: 'Callback HTTP request',
sett_comment_short_callback: 'Server HTTP API if any',

sett_display_name_sms: 'SMS URI',
sett_comment_sms: 'SMS HTTP request',
sett_comment_short_sms: 'Server HTTP API if any',

sett_display_name_creditrequest: 'Balance URI',
sett_comment_creditrequest: 'Balance HTTP request',
sett_comment_short_creditrequest: 'Server HTTP API if any',

sett_display_name_ratingrequest: 'Rating URI',
sett_comment_ratingrequest: 'Rating HTTP request',
sett_comment_short_ratingrequest: 'Server HTTP API if any',

sett_display_name_displaynotification: 'Display notification',
sett_comment_displaynotification: 'Show notifications in phone notification bar (usually on the top corner of your phone)',
sett_comment_short_displaynotification: 'Show notifications in phone notification bar',

sett_display_name_displayvolumecontrols: 'Always display volume',
sett_comment_displayvolumecontrols: 'Always display volume controls when in call',
sett_comment_short_displayvolumecontrols: '',

sett_display_name_displayaudiodevice: 'Always display audio device',
sett_comment_displayaudiodevice: 'Always display audio device when in call',
sett_comment_short_displayaudiodevice: '',

sett_display_name_audiodevices: 'Audio devices',
sett_comment_audiodevices: 'Audio device settings will be available from the dialpad page menu once you login',
sett_comment_short_audiodevices: '',

sett_display_name_cpualwayspartiallock: 'CPU always partial lock',
sett_comment_cpualwayspartiallock: 'Keep the device processor always awake. Set only if otherwise you loose registrations and don\'t receive incoming calls',
sett_comment_short_cpualwayspartiallock: 'Keep a partial lock on the CPU to prevent deep sleep',

sett_display_name_disablewbforpstn: 'Disable wideband for PSTN',
sett_comment_disablewbforpstn: 'Disable wideband audio codecs for calls to mobile/landline numbers (wideband only for IP to IP calls)',
sett_comment_short_disablewbforpstn: '',

sett_display_name_multiplecalls: 'Allow multiple calls',
sett_comment_multiplecalls: 'Allow multiple calls / conference (low-end CPU is not capable to handle)',
sett_comment_short_multiplecalls: '',

sett_display_name_callbacknumber: 'Callback number',
sett_comment_callbacknumber: 'Callback access number. Some VoIP service providers provide this kind of number which you can ring and receive incoming call from server IVR',
sett_comment_short_callbacknumber: 'Callback access number',

sett_display_name_blacklist: 'Blacklist',
sett_comment_blacklist: 'Blacklisted numbers separated by comma',
sett_comment_short_blacklist: '',

sett_display_name_storecallhistory: 'Call history storage',
sett_comment_storecallhistory: 'Specify where to store the call history',
sett_comment_short_storecallhistory: '',

sett_display_name_keepdeviceawakeincall: 'Keep device awake incall',
sett_comment_keepdeviceawakeincall: 'Keep device awake during calls',
sett_comment_short_keepdeviceawakeincall: '',

sett_display_name_speakermode: 'Speaker mode',
sett_comment_speakermode: 'Speaker mode',
sett_comment_short_speakermode: '',

sett_display_name_focusaudio: 'Focus audio',
sett_comment_focusaudio: 'Focus on VoIP call audio (this might lower the volume for other streams such as your media player while you are speaking on VoIP)',
sett_comment_short_focusaudio: 'Focus on VoIP audio',

sett_display_name_useroutingapi: 'Use routing API',
sett_comment_useroutingapi: 'Use routing API for compatibility reasons. Some -usually old- devices might need this for correct audio handling',
sett_comment_short_useroutingapi: '',

sett_display_name_hardwaremedia: 'Hardware media',
sett_comment_hardwaremedia: 'Use hardware media enhancements such as AEC and denoise. This might add a slight delay for the audio streams',
sett_comment_short_hardwaremedia: 'Use hardware media enhancements.',

sett_display_name_autousebluetooth: 'Auto Bluetooth',
sett_comment_autousebluetooth: 'Auto use Bluetooth when available',
sett_comment_short_autousebluetooth: '',

sett_display_name_nativefilterallow: 'Allowed prefixes',
sett_comment_nativefilterallow: 'Handle native calls if number starts with',
sett_comment_short_nativefilterallow: '',

sett_display_name_nativefilterblock: 'Not allowed prefixes',
sett_comment_nativefilterblock: 'Don\'t handle native calls if number starts with',
sett_comment_short_nativefilterblock: '',

sett_display_name_integrateifwifionly: 'Integrate if Wifi only',
sett_comment_integrateifwifionly: 'Integrate with native dialer only if Wifi is connected',
sett_comment_short_integrateifwifionly: '',

sett_display_name_videomode: 'Incoming Video',
sett_comment_videomode: 'Specify how to handle incoming video calls',
sett_comment_short_videomode: '',

sett_display_name_cfgvideo: 'Enable video',
sett_comment_cfgvideo: 'Enable video calls',
sett_comment_short_cfgvideo: '',

sett_display_name_video: 'Enable video',
sett_comment_video: 'Enable video calls',
sett_comment_short_video: '',

sett_display_name_audio_bandwidth: 'Audio bandwidth',
sett_comment_audio_bandwidth: 'Set the bandwidth of audio',
sett_comment_short_audio_bandwidth: '',

sett_display_name_video_bandwidth: 'Video bandwidth',
sett_comment_video_bandwidth: 'Set the bandwidth of video',
sett_comment_short_video_bandwidth: '',

sett_display_name_video_width: 'Video width',
sett_comment_video_width: 'Set the width of video in pixels',
sett_comment_short_video_width: '',

sett_display_name_video_height: 'Video height',
sett_comment_video_height: 'Set the height of video in pixels',
sett_comment_short_video_height: '',

sett_display_name_video_profile: 'Video quality',
sett_comment_video_profile: 'Set video quality',
sett_comment_short_video_profile: '',

sett_display_name_use_h264: 'Use H264 codec',
sett_comment_use_h264: 'Use H264 video codec',
sett_comment_short_use_h264: '',

sett_display_name_use_vp8: 'Use VP8 codec',
sett_comment_use_vp8: 'Use VP8 video codec',
sett_comment_short_use_vp8: '',

sett_display_name_use_vp9: 'Use VP9 codec',
sett_comment_use_vp9: 'Use VP9 video codec',
sett_comment_short_use_vp9: '',

sett_display_name_vibrate: 'Vibrate',
sett_comment_vibrate: 'Vibrate on incoming calls',
sett_comment_short_vibrate: '',

sett_display_name_video_fps: 'Video FPS',
sett_comment_video_fps: 'Set video framerate, 0 means automatic',
sett_comment_short_video_fps: '',

sett_display_name_setfinalcodec: 'Set final codec',
sett_comment_setfinalcodec: 'Workaround for multiple codec negotiation issues',
sett_comment_short_setfinalcodec: '',

sett_display_name_use_rport: 'Use rport',
sett_comment_use_rport: 'Rport usage in Via header',
sett_comment_short_use_rport: '',

sett_display_name_normalizenumber: 'Normalize number',
sett_comment_normalizenumber: 'Remove special characters from dialed numbers',
sett_comment_short_normalizenumber: '',

sett_display_name_natopenpackets: 'NAT open packets',
sett_comment_natopenpackets: 'UDP packets to send to open the NAT device (change if you have NAT issues)',
sett_comment_short_natopenpackets: '',

sett_display_name_sendchatonenter: 'Chat on enter',
sett_comment_sendchatonenter: 'Send chat on enter key press',
sett_comment_short_sendchatonenter: '',

sett_display_name_language: 'Language',
sett_comment_language: 'Set application language',
sett_comment_short_language: '',

sett_display_name_telsearchkey: 'Tel Search key',
sett_comment_telsearchkey: 'Set tel.search.ch api key',
sett_comment_short_telsearchkey: '',

sett_display_name_flash: 'Flash',
sett_comment_flash: 'Flash on incoming call or chat',
sett_comment_short_flash: '',

sett_display_name_beeponincoming: 'Beep',
sett_comment_beeponincoming: 'Beep on incoming call or chat',
sett_comment_short_beeponincoming: '',

sett_display_name_importonlywithnum: 'Import only with number',
sett_comment_importonlywithnum: 'If checked, then will skip contacts without a phone number',
sett_comment_short_importonlywithnum: '',

sett_display_name_transfwithreplace: 'Transfer with replace',
sett_comment_transfwithreplace: 'Specify if replace should be used with transfer so the old call (dialog) is not disconnected but just replaced. This way the A party is never disconnected, just the called party is changed. The A party must be able to handle the replace header for this.',
sett_comment_short_transfwithreplace: 'Specify if replace should be used with transfer so the old call (dialog) is not disconnected but just replaced.',

sett_display_name_sscontrol: 'Control ',
sett_comment_sscontrol: 'Allow remote control for screen sharing (otherwise view only)',
sett_comment_short_sscontrol: '',

sett_display_name_icetimeout: 'ICE timeout ',
sett_comment_icetimeout: 'Set ICE timeout in milliseconds',
sett_comment_short_icetimeout: '',

sett_display_name_nsupgrademode: 'NS engine upgrade mode',
sett_comment_nsupgrademode: 'Set how/when to upgrade the NS engine.',
sett_comment_short_nsupgrademode: '',

sett_display_name_ssscroll: 'Scroll',
sett_comment_ssscroll: 'Allow screen sharing window scroll controls',
sett_comment_short_ssscroll: '',

sett_display_name_sstop: 'Top',
sett_comment_sstop: 'Place the screen sharing window on the top',
sett_comment_short_sstop: '',

sett_display_name_ssquality: 'Quality',
sett_comment_ssquality: 'Remote desktop quality',
sett_comment_short_ssquality: '',

sett_display_name_submenu_sipsettings: 'SIP Settings...',
sett_comment_submenu_sipsettings: 'SIP related configurations',
sett_comment_short_submenu_sipsettings: '',

sett_display_name_submenu_media: 'Media Settings...',
sett_comment_submenu_media: 'Voice codec, quality and device',
sett_comment_short_submenu_media: '',

sett_display_name_submenu_video: 'Video...',
sett_comment_submenu_video: 'Video related settings',
sett_comment_short_submenu_video: '',

sett_display_name_submenu_screenshare: 'Screen Sharing...',
sett_comment_submenu_screenshare: 'Specify remote desktop settings',
sett_comment_short_submenu_screenshare: '',

sett_display_name_submenu_sounddevicevolume: 'Sound Device and Volume...',
sett_comment_submenu_sounddevicevolume: 'Sound playback and recording',
sett_comment_short_submenu_sounddevicevolume: '',

sett_display_name_submenu_calldivert: 'Call Divert Settings...',
sett_comment_submenu_calldivert: 'Forward, transfer, rewrite',
sett_comment_short_submenu_calldivert: '',

sett_display_name_submenu_calldivert_advanced: 'Advanced settings...',
sett_comment_submenu_calldivert_advanced: 'More settings',
sett_comment_short_submenu_calldivert_advanced: '',

sett_display_name_advancedsettings: 'Advanced settings...',
sett_comment_advancedsettings: 'Show advanced settings',
sett_comment_short_advancedsettings: '',

sett_display_name_entersettings: 'Settings...',
sett_comment_entersettings: 'Show settings',
sett_comment_short_entersettings: '',

sett_display_name_advancedloginsettings: 'Advanced...',
sett_comment_advancedloginsettings: 'Show advanced login settings',
sett_comment_short_advancedloginsettings: '',

sett_display_name_advancedloginsettings2: 'Account...',
sett_comment_advancedloginsettings2: 'SIP login related settings',
sett_comment_short_advancedloginsettings2: '',

sett_display_name_submenu_general: 'General Settings...',
sett_comment_submenu_general: 'Other settings',
sett_comment_short_submenu_general: '',

sett_display_name_submenu_profile: 'My profile...',
sett_comment_submenu_profile: 'Set my profile details',
sett_comment_short_submenu_profile: '',

sett_display_name_submenu_integrate: 'Dialer integration...',
sett_comment_submenu_integrate: 'When dialing with native dialer you\'ll be asked if you want to use SIP or mobile',
sett_comment_short_submenu_integrate: '',

sett_display_name_submenu_advanced: 'Advanced settings... ',
sett_comment_submenu_advanced: 'More settings',
sett_comment_short_submenu_advanced: '',

sett_display_name_moresettings: 'More settings...',
sett_comment_moresettings: 'Show more settings',
sett_comment_short_moresettings: '',

proversion_content_text: 'Upgrade to the Pro version for commercial usage and extra features such as G.729 codec and others.',

help_text_custom: '> How to use ?' +
'<br /><br />' +
'  ' +
'In the settings, enter your server address, SIP username and password ' +
'Save the settings (tap on OK).' +
'Now you are ready to initiate and accept phone calls. ' +
'During calls you have some additional options such as call transfer, hold, loudspeaker and others (icons are displayed or press the menu for more).' +
//--'We wish you a lean VoIP experience.' +
'<br /><br />' +
'' +
'> What is [BRANDNAME]?' +
'<br /><br />' +
'' +
'[BRANDNAME] is a VoIP softphone using the open standard SIP protocol. [BRANDNAME] is not tied with any VoIP provider. You are free to use it with any VoIP server.' +
'<br /><br />' +
'With [BRANDNAME] you can do the followings:' +
'-connect to any SIP server' +
'-free calls to other SIP softphones' +
'-make (cheap) calls to VoIP/landline/mobile/international (depending on your VoIP service provider)' +
'-accept incoming calls' +
'-exploit SIP features such as chat/CallerID/forward/transfer/hold/conference and others' +
'<br /><br />' +
'> What is SIP/VoIP?' +
'<br /><br />' +
'' +
'VoIP means "Voice over Internet Protocol", a few protocols to allow voice calls to be made over IP networks.' +
'SIP is the newest VoIP standard adopted by many organizations for their telecom infrastructure. By using the open standard SIP protocols you can keep yourself free of locked-in solutions such as Skype and you are free to use any standard based network for your telecom needs.' +
'More details: ' +
'<a href="https://en.wikipedia.org/wiki/Voice_over_IP" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://en.wikipedia.org/wiki/Voice_over_IP\')">https://en.wikipedia.org/wiki/Voice_over_IP</a>' +
'<br /><br />' +
'<a href="https://en.wikipedia.org/wiki/Session_Initiation_Protocol" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://en.wikipedia.org/wiki/Session_Initiation_Protocol\')">https://en.wikipedia.org/wiki/Session_Initiation_Protocol</a>' +
'<a href="https://www.voip-info.org/" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://www.voip-info.org\')">https://www.voip-info.org/</a>' +
'<br /><br />' +
'You can make VoIP calls in the following ways:' +
'-direct IP to IP calls (this can be done by [BRANDNAME] by typing the peer full URI)' +
'-using your own VoIP server such as Asterisk on Linux' +
'-using a VoIP service provider' +
'<br /><br />' +
'' +
'> Settings/Features' +
'<br /><br />' +
'' +
'All the settings except server/username/password is optional.' +
'Change only if you have some special needs or if a setting is required by your VoIP service provider.' +
'There are some easy to use settings such as call forward or number rewrite which you might wish to modify to enhance your VoIP experience.' +
'However the advanced settings (Setting page -> Menu -> Show advanced settings) should be modified only by experts or if you have some issues using the softphone.' +

'A few useful settings:' +
'-Registration to a server: by default the [BRANDNAME] will try to register to the server what you have set to allow incoming calls, but this is optional (if you need only outbound calls) and can be disabled from the "SIP Settings"' +
'-Transport protocol: UDP (the default) usually works with all servers.' +
'-Proxy address: set this only if you are instructed so by your VoIP provider ' +
'-CalledID display: by default it is your username, but you can also set a "CallerID" and/or "Display name" from the "SIP settings" section' +
'' +
'-call forward always: from the "Call Divert" setting, set a "Call forward number" and then set the "Auto answer" setting to "Forward"' +
'-call forward on busy: from the "Call Divert" setting, set a "Call forward number" and then set the "On phone busy" and/or "On VoIP busy" setting to forward calls' +
'<br /><br />' +
'' +
'[BRANDNAME] is compatible with all VoIP servers using the open standard SIP protocol.' +
'<br /><br />',


help_text: 
//TRANSLTSTART
'> How to use ?' +
'<br /><br />' +
'  ' +
'In the settings, enter your server address, SIP username and password ' +
'Save the settings (tap on OK).' +
'Now you are ready to initiate and accept phone calls. ' +
'During calls you have some additional options such as call transfer, hold, loudspeaker and others (icons are displayed or press the menu for more).' +
//--'We wish you a lean VoIP experience.' +
'<br /><br />' +
'' +
'> What is [BRANDNAME]?' +
'<br /><br />' +
'' +
'[BRANDNAME] is a VoIP softphone using the open standard SIP protocol.' +
'<br /><br />' +
'With [BRANDNAME] you can do the followings:' +
'-connect to your preferred SIP server' +
'-free calls to other SIP softphones' +
'-make (cheap) calls to VoIP/landline/mobile/international (depending on your VoIP service provider)' +
'-accept incoming calls' +
'-exploit SIP features such as chat/CallerID/forward/transfer/hold/conference and others' +
'<br /><br />' +
'> What is SIP/VoIP?' +
'<br /><br />' +
'' +
'VoIP means "Voice over Internet Protocol", a few protocols to allow voice calls to be made over IP networks.' +
'SIP is the newest VoIP standard adopted by many organizations for their telecom infrastructure. By using the open standard SIP protocols you can keep yourself free of locked-in solutions such as Skype and you are free to use any standard based network for your telecom needs.' +
'More details: ' +
'<a href="https://en.wikipedia.org/wiki/Voice_over_IP" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://en.wikipedia.org/wiki/Voice_over_IP\')">https://en.wikipedia.org/wiki/Voice_over_IP</a>' +
'<br /><br />' +
'<a href="https://en.wikipedia.org/wiki/Session_Initiation_Protocol" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://en.wikipedia.org/wiki/Session_Initiation_Protocol\')">https://en.wikipedia.org/wiki/Session_Initiation_Protocol</a>' +
'<a href="https://www.voip-info.org/" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://www.voip-info.org\')">https://www.voip-info.org/</a>' +
'<br /><br />' +
'You can make VoIP calls in the following ways:' +
'-direct IP to IP calls (this can be done by [BRANDNAME] by typing the peer full URI)' +
'-using your own VoIP server such as Asterisk on Linux or Mizutech VoIP server on Windows servers' +
'-using a VoIP service provider' +
'<br /><br />' +
'' +
'> Settings/Features' +
'<br /><br />' +
'' +
'All the settings except server/username/password is optional.' +
'Change only if you have some special needs or if a setting is required by your VoIP service provider.' +
'There are some easy to use settings such as call forward or number rewrite which you might wish to modify to enhance your VoIP experience.' +
'However the advanced settings (Setting page -> Menu -> Show advanced settings) should be modified only by experts or if you have some issues using the softphone.' +

'A few useful settings:' +
'-Registration to a server: by default the [BRANDNAME] will try to register to the server what you have set to allow incoming calls, but this is optional (if you need only outbound calls) and can be disabled from the "SIP Settings"' +
'-Transport protocol: UDP (the default) usually works with all servers.' +
'-Proxy address: set this only if you are instructed so by your VoIP provider ' +
'-CalledID display: by default it is your username, but you can also set a "CallerID" and/or "Display name" from the "SIP settings" section' +
'' +
'-call forward always: from the "Call Divert" setting, set a "Call forward number" and then set the "Auto answer" setting to "Forward"' +
'-call forward on busy: from the "Call Divert" setting, set a "Call forward number" and then set the "On phone busy" and/or "On VoIP busy" setting to forward calls' +
'<br /><br />' +
'' +
'[BRANDNAME] is compatible with all VoIP servers using the open standard SIP protocol. You are free to create a VoIP account at any service provider or use with your own VoIP server ' +
'<br /><br />' +
'' +
'> How can I get my customized softphone' +
'<br /><br />' +
'' +
'Contact Mizutech at <a href="mailto:info@mizu-voip.com">info@mizu-voip.com</a>' +
'<br /><br />' +
'' +
'> Contact us' +
'<br /><br />' +
'' +
'<a href="https://www.mizu-voip.com" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://www.mizu-voip.com\')">https://www.mizu-voip.com</a><br />' +
'general/commercial: <a href="mailto:info@mizu-voip.com">info@mizu-voip.com</a><br />' +
'technical support: <a href="mailto:webphone@mizu-voip.com"webphone@mizu-voip.comm</a>',
//TRANSLTEND




dlg_about_msg: "This SOFTWARE is licensed, not sold.<br />" +
"Copyright &copy; [COMPANY]. All rights reserved for [COMPANY].<br /><br />" +

"BY USING, DEPLOYING OR RUNNING THIS WEBPHONE SOFTWARE, YOU ARE CONSENTING TO BE BOUND BY AND ARE BECOMING A PARTY TO THIS AGREEMENT. IF YOU DO NOT AGREE TO ALL OF THE TERMS OF THIS AGREEMENT, DO NOT DEPLOY AND DO NOT EXECUTE IT! You must destroy all copies of the Software upon termination.<br /><br />" +

"This software is licensed, not sold and it is free to use for non commercial purposes.<br />" +
"[COMPANY] grants you a non-exclusive license to use the software free of charge for non commercial purposes only.<br />" +
"This license does not entitle you to hard-copy documentation, support or telephone assistance.<br /><br />" +

"You may not:<br />" +
"	-Commercially deploy the software<br />" +
"	-Make any revenue by using the software (except Pro version)<br />" +
"	-Resell the software<br />" +
"	-Reverse engineer, decompile, or disassemble the software<br />" +
"	-Modify the software in any way<br />" +
"	-Rent, lease, grant a security interest in, or otherwise transfer purchase rights of the software<br /><br />" +

"Title, ownership rights, and intellectual property rights in the Software shall remain with [COMPANY] and/or its suppliers.<br />" +
"This Agreement and the license granted hereunder will terminate automatically if you fail to comply with the limitations described herein. Upon termination, you must destroy all copies of the Software.<br />" +
"This software contains some modules distributed with LGPL or modified BSD license:<br />" +
"	-speex: https://www.speex.org <br />" +
"	-iLBC: https://www.ilbcfreeware.org <br /><br />" +

"THE SOFTWARE IS PROVIDED \"AS IS\" WITHOUT ANY WARRANTY OF ANY KIND.<br />" +
"[COMPANY] and its suppliers specifically disclaim any express or implied warranty of fitness for High Risk Activities.<br /><br />" +

"Copyright &copy; [COMPANY]<br />",

dlg_about_msg2: "This SOFTWARE is licensed, not sold.<br />" +
"Copyright &copy; [COMPANY]. All rights reserved for [COMPANY].<br /><br />" +

"BY USING, DEPLOYING OR RUNNING THIS WEBPHONE SOFTWARE, YOU ARE CONSENTING TO BE BOUND BY AND ARE BECOMING A PARTY TO THIS AGREEMENT.<br />" +
"IF YOU DO NOT AGREE TO ALL OF THE TERMS OF THIS AGREEMENT, DO NOT DEPLOY AND DO NOT EXECUTE IT!<br /><br />" +

"This software is licensed, not sold.<br />" +
"[COMPANY] grants you a non-exclusive license to use the software.<br /><br />" +

"You may not:<br />" +
"	-Resell the software<br />" +
"	-Reverse engineer, decompile, or disassemble the software<br />" +
"	-Modify the software in any way	except the html/css skin<br />" +
"	-Rent, lease, grant a security interest in, or otherwise transfer purchase rights of the software<br /><br />" +

"Title, ownership rights, and intellectual property rights in the Software shall remain with [COMPANY] and/or its suppliers.<br />" +
"This Agreement and the license granted hereunder will terminate automatically if you fail to comply with the limitations described herein. Upon termination, you must destroy all copies of the Software.<br />" +

"THE SOFTWARE IS PROVIDED \"AS IS\" WITHOUT ANY WARRANTY OF ANY KIND.<br />" +
"[COMPANY] and its suppliers specifically disclaim any express or implied warranty of fitness for High Risk Activities.<br /><br />" +

"Copyright &copy; [COMPANY]<br />",

//TRANSLTSTART

// new entries


/*--------- #language# hu Hungarian ---------*/

settings_title_hu: 'Beállítások',

username_hu: 'Felhasználó',
password_hu: 'Jelszó',

btn_login_hu: 'Bejelentkezés ',
btn_close_hu: 'Bezár',
btn_cancel_hu: 'Visszamond',
btn_ok_hu: 'OK',
btn_upgrade_hu: 'Frissités',
btn_save_hu: 'Mentés',
btn_send_hu: 'Küldés',
btn_revert_hu: 'Visszatér',
btn_create_hu: 'Létrehoz',
btn_audio_device_hu: 'Audio eszköz ',
btn_quickcall_hu: 'Hivás',

myprovider_hu: 'Rólunk',
myaccount_hu: 'Saját fiok',
recharge_hu: 'Kredit feltöltése',
newuser_hu: 'Új felhasználó',
newuser_a_hu: 'Fiok létrehozása',
forgotpassword_a_hu: 'Elfelejtetted a jelszavad ?',
p2p_hu: 'Phone to Phone',
p2p_nra_hu: 'Saját telefonszámod',
p2p_nrb_hu: 'Kit szeretnél hivni',
p2p_err1_hu: 'Ird be a telefonszámod',
p2p_err2_hu: 'Ird be a hivott számát',
callback_hu: 'Visszahívás',
callback_src_hu: 'Ird be a mobilszámodat<br>(ország hivoszámát tartalmazva)',

phone_nr_hu: 'Telefonszám vagy SIP URI',
chat_nr_hu: 'SIP URI, felhasználó név vagy telefonszám',
ct_search_hint_hu: 'Kontaktok keresése',
initializing_hu: 'Inicializálizálás',
reset_settings_msg_hu: 'Biztos, hogy akarod reszetelni a beallitásokat?',
reset_settings_msg2_hu: 'A beállitasok visszavoltak állitva az alapértékükre ',
aec_auto_hu: 'Automatikus',
aec_none_hu: 'Egyiksem',
aec_software_hu: 'Szoftveres',
aec_native_hu: 'Nativ',
aec_fast_hu: 'Gyors',
aec_decrease_volume_hu: 'Hangerősség csökkentése',
warning_hu: 'Figyelmeztetés',
help_hu: 'Segitség',
help_provider_hu: 'VoIP szolgáltató keresése',
logview_help_hu: 'Másold ki a logok ablak tartalmát és küld el emailben a következő cimre: ',
please_enter_hu: 'Kérlek ird be',
loading_hu: 'Betöltés..',
type_home_hu: 'Otthoni szám hivása',
type_mobile_hu: 'Mobil szám hivása',
type_work_hu: 'Munkahelyi szám hivása',
type_other_hu: 'Más szám hivása',
type_fax_home_hu: 'Otthoni fax',
type_fax_work_hu: 'Munkahelyi fax',
type_pager_hu: 'Pager',
type_sip_hu: 'SIP URI hivása',
home_hu: 'Otthon',
mobile_hu: 'Mobilszám',
work_hu: 'Munkahelyi',
other_hu: 'Más',
fax_home_hu: 'Otthoni fax',
fax_work_hu: 'Munkahelyi fax',
pager_hu: 'Pager',
sip_hu: 'SIP URI',
send_msg_hu: 'Üzenet küldése',
contact_alert_title_hu: 'Válaszd ki a telefon tipusát',
contact_name_hu: 'Név',
contact_phone_hu: 'Telefonszám vagy SIP uri',
contact_saved_hu: 'Kontakt mentve.',
contact_save_error_hu: 'Kontaktot nem lehet elmenteni',
contact_no_nunber_hu: 'Irjál be egy telefonszámot, felhasználónevet vagy SIP URI-t',
no_contacts_1_hu: 'Kontaktok létrehozásához válaszd az “Uj kontakt”-ot a menüből',
no_contacts_2_hu: 'Vagy használd a “Kontaktok szinkronizálása” menu opciot, hogy importáld be a kontaktokat a mobilodról.<br />(A szinkronizálás csak akkor fog müködni, miután feltöltöd a kontaktokat a mobilodról.)',
sync_title_hu: 'Kontaktok szinkronizálása',
sync_message_hu: 'A szinkronizálás csak akkor fog müködni, miután feltöltöd a kontaktokat a mobilodról.',
no_history_hu: 'Hiváslista üres',
duration_hu: 'Hivásidőtartama: ',
rating_minute_hu: ' \\ perc',
clear_callhistory_hu: 'Hiváslista törlése',
clear_callhistory_msg_hu: 'Biztos vagy benne, hogy akarod törölni a hiváslistát ?',
contact_delete_msg_hu: 'Biztos akarod törölni ezt a kontaktot?',
ch_outgoing_hu: 'Kimenő hivás',
ch_incoming_hu: 'Bejövő hivás',
ch_missed_hu: 'Nem fogadott hivás',
ch_delete_hu: 'Törlés a hiváslistából',
in_hold_hu: '(Tartásban)',
initiate_call_forward_hu: 'Hivás továbbitása',
initiate_call_transfer_hu: 'Hivás transzferálása',
initiate_conference_hu: 'Konferencia inicializálása',
send_dtmf_hu: 'DTMF küldése',
unmuted_hu: 'Némitásfeloldás',
muted_hu: 'Némitás',
hold_released_hu: 'Tartás felszabaditása',
on_hold_hu: 'Tartásban',
speaker_off_hu: 'Kihangositás kikapcsolva',
speaker_on_hu: 'Kihangositás bekapcsolva ',
call_from_hu: 'Nem fogadott hivás',
calls_hu: 'nem fogadott hivások',
message_from_hu: 'Üzenet',
messages_hu: 'új üzenetek',
goto_hu: 'Tovább a',
callhistory_hu: 'Hiváslista',
messagehistory_hu: 'Üzenetek',
sett_enabled_hu: 'Bekapcsolva',
sett_disabled_hu: 'Kikapcsolva',
hide_search_hu: 'Keresés eltüntetése',
show_search_hu: 'Keresés a beállitásokban',
settings_login_hu: 'Bejelentkezés',
ie_update_hu: 'Ez a szoftver egy újabb verziojú Internet Explorert igényel. Szeretné letölteni és frissiteni?',
install_java_hu: 'Java szükséges: https://java.com/download/',
serviceengine_title_hu: 'Service plugin használása',
serviceengine_msg_hu: 'Install service plugin for a better experience Instaláld a service plugin-t egy jobb müködésért ',
np_download_hu: 'Service plugin letöltése',
np_popup_title_hu: 'Service plugin',
np_popup_msg_hu: 'Le kell töltsd a service plugin-t, hogy a softphone helyesen müködjön',
choose_engine_title_hu: 'Engine kiválasztása',
nativeplugin_hu: 'service plugin',
native_call_hu: 'Nativ hivás inicializálása…',
ce_enablejava_hu: '<a href="https://java.com/en/download/help/enable_browser.xml" target="_blank">Enable java in your browser setting Java engedelyezése</a>',
ce_install_java_hu: 'Vagy ha nincs java instalálva, instaláld innen<a href="https://java.com/download/" target="_blank"></a>',
ce_installnativeplugin_hu: 'Instaláld a [NATIVE_PLUGIN]-t jobb müködésért',
ce_usewebrtc_hu: 'Használj webrtc-t',
ce_webrtcnot_hu: '(Nem ajánlott)',
ce_browser_install_hu: 'Instalálás',
ce_browser_alternate_hu: 'alternativ böngész?',
ce_native_ios_hu: 'iOS nem támogatja a VoIP-ot a böngészőkben',
ce_native_ios2_hu: 'Kérlek használj native app-ot',
ce_native_android_hu: 'Használj nativ app-ot',
ce_use_hu: 'kiválasztva. Jelentkezzél be',
np_install_title_hu: 'Service plugin',
np_install_msg_hu: 'Service plugin letöltése...<br />Plugin instalálása után jelentkezzél be.<br /><br />Nyomjál visszamondást, ha nem akarod használni a Service plugin-t.',
np_successfully_installed_hu: 'Service plugin sikeresen instalálva.',
java_install_title_hu: 'Java instalálása',
java_install_hu: 'Jelentkezzél be miután felinstaláltad a Java-t.',
sync_contacts_started_hu: 'Kontaktok szinkronizálása…',
sync_succeded_hu: 'Szinkronizálás sikeres',
sync_failed_hu: 'Szinkronizálás sikertelen',
sync_msg_hu: 'Vagy szinkronizáld a kontaktokat a mobilodról',
ce_dontask_hu: 'Ne kérdezd ujra',
chrome_local_alert_hu: 'A webphone nem fog müködni local filesystem-ről a Google Chrome és Opera böngészőkben. Csak webserverről fog müködni. Ha local filesystem-ről szeretnéd tesztelni, akkor használhatsz Firefox-ot vagy Internet Explorer-t.',
//OPSSTART
autoprov_loading_hu: 'Beállitások visszakérése...',
autoprov_restart_hu: 'Beállitások érvényesitése...',
//OPSEND
hint_menu_hu: 'Menü',
hint_voicemail_hu: 'Hangposta',
hint_quickcall_hu: 'Gyorshivás',
hint_message_hu: 'Üzenet',
hint_addphone_hu: 'Telefon hozzáadása',
hint_removephone_hu: 'Telefon törlése',
hint_choosect_hu: 'Kontakt kiválasztása',
hint_sendmsg_hu: 'Üzenet küldése',
hint_conference_hu: 'Hozzáadás a konferenciához',
hint_transfer_hu: 'Hivástranszfer',
hint_dialpad_dtmf_hu: 'DTMF küldése',
hint_mute_hu: 'Némitás / Némitás feloldása',
hint_hold_hu: 'Tartás / Ujratöltés',
hint_speaker_hu: 'Kihangositás / Kihangositás kikapcsolva',
hint_dialpad_hu: 'Tárcsázó',
hint_contacts_hu: 'Kontaktok',
hint_callhistory_hu: 'Hiváslista',
hint_status_hu: 'Esemény és status üzenetek',
hint_curr_user_hu: 'Fiok felhasználóneve',
hint_phone_number_hu: 'Ird be a telefonszámot, SIP felhasználónevet vagy SIP URI-t',
hint_btn_call_hu: 'Hivás inditása',
hint_btnback_hu: 'Vissza az előző oldalra',
hint_numpad_hu: 'Tárcsázó',
hint_recents_hu: 'Események',
hint_encicon_hu: 'Titkositva',

transfer_title_hu: 'Hivástranszfer',
forward_title_hu: 'Hivástovábbítás',
conference_title_hu: 'Hozzáadás a konferenciához',

status_not_registered_hu: 'Nincs regisztrálva',
pick_ct_hu: 'Kontakt választása',
chat_sms_title_hu: 'Chat vagy SMS',
chdetails_title_hu: 'Info',
chdetails_btnback_txt_hu: 'Hiváslista',
ctdetails_title_hu: 'Kontakt',
ctdetails_btnback_txt_hu: 'Összes kontakt',
msg_title_chat_hu: 'IM - Chat',
msg_title_sms_hu: 'SMS',
dialpad_title_hu: 'Hivás',
msglist_title_hu: 'Üzenetek',
ctlist_title_hu: 'Kontaktok',
chlist_title_hu: 'Hiváslista',
addeditct_title_new_hu: 'Új kontakt',
addeditct_title_edit_hu: 'Kontakt modositása',
logview_title_hu: 'Logok',
newuser_title_hu: 'Új felhasználó',
voicemail_title_hu: 'Hangposta',
voicemail_msg_hu: 'Hangposta / Ird be a hangposta számodat',
quickcall_title_hu: 'Gyorshivás',
quickcall_msg_hu: 'Ird be a hivott számot',
go_back_btn_txt_hu: 'Vissza',
chat_hu: 'IM - Chat',
sms_hu: 'SMS',
delete_text_hu: 'Törlés',
delete_all_msg_alert_hu: 'Az összes üzenet törölve lesz.',
delete_msg_alert_hu: 'A teljes fonal törölve lesz.',
btn_new_message_hu: 'Új üzenet',
message_sent_hu: 'Üzenet elküldve',
me_hu: 'Én',
sendtosupport_hu: 'Küldés az ügyfélszolgálathoz',
support_email_body_hu: 'A log ablak tartalmát másold ide: ',
support_selectall_hu: 'Válaszd ki az összeset',
nu_username_hu: 'Felhasználónév',
nu_password_hu: 'Jelszó',
nu_email_hu: 'Email cim',
nu_fullname_hu: 'Teljes név',
nu_phone_hu: 'Telefon',
nu_address_hu: 'Cím',
nu_country_hu: 'Ország',
nu_birthday_hu: 'Születési dátum',
nu_gender_hu: 'Nem',
nu_fpq_hu: 'Jelszó elfelejtéshez szükséges kérdés',
nu_fpa_hu: 'Jelszó elfelejtéshez szükséges válasz',
presence_stat_online_hu: 'Online',
presence_stat_away_hu: 'Away',
presence_stat_dnd_hu: 'Do Not Disturb',
presence_stat_invisible_hu: 'Invisible',
presence_stat_offline_hu: 'Offline',
connection_title_hu: 'Hálózati probléma',
connection_msg_hu: 'Úgy néz ki, hogy nem vagy kapcsolódva a hálozathoz vagy az internethez.<br> Ellenőrizd a kapcsolatod.' ,

menu_sync_hu: 'Kontaktok szinkronizálása',
menu_volumehide_hu: 'Hangerősségi kontrolok elrejtése',
menu_volumeshow_hu: 'Hangerősségi kontrolok',
menu_audiodevicehide_hu: 'Audio eszköz elrejtése',
menu_audiodeviceshow_hu: 'Audio eszköz',
menu_conference_hu: 'Konferencia',
menu_transfer_hu: 'Transzfer',
menu_numpad_hu: 'Tárcsázó',
menu_mute_hu: 'Némitás',
menu_hold_hu: 'Tartás',
menu_speaker_hu: 'Kihangositó',
menu_call_hu: 'Hivás',
menu_message_hu: 'Üzenet',
menu_new_contact_hu: 'Új kontakt',
menu_editcontact_hu: 'Kontakt modosítása',
menu_createcontact_hu: 'Kontakt elmentése',
menu_deletecontact_hu: 'Kontakt törlése',
menu_exit_hu: 'Bezárás',
menu_lastcalldetails_hu: 'Utolsó hivás adatai',
menu_call_access_hu: 'Access number hivása',
menu_switchtoadvanced_hu: 'Előrehaladott beállitások mutatása',
menu_switchtobasic_hu: 'Alapbeállitások mutatása',
menu_showsettings_hu: 'Beállitások',
menu_close_hu: 'Bezárás',
menu_help_hu: 'Segitség',
help_help_hu: 'Útmutató', // Help
help_rate_hu: 'Mizu Webphone értékelése',
help_loging_hu: 'Logok',
help_proversion_hu: 'Softphone Pro',
help_about_hu: 'Rólunk',
help_report_hu: 'Problémajelentés',
help_license_hu: 'Licensz megállapodás',
help_startlog_hu: 'Logok gyüjtésének az indítása',
help_sendlog_hu: 'Logok nézése / Küldés az ügyfélszolgálathoz',
help_stoplog_hu: 'Logok gyüjtésének megállitása',
about_url_hu: 'Ügyfélszolgálat oldala',
about_mail_hu: 'Ügyfélszolgálat kontaktja',
about_license_hu: 'Licensz megállapodás',


warning_msg_1_hu: 'Csak direkt hivások a SIP URI-khoz lehetségesek, ha a VoIP szerver cime nincs megadva',
warning_msg_2_hu: 'IP vagy domain név nincs elfogadva ebben a verzióban. Ird be a szerver nevet vagy ID-t.',
warning_msg_3_hu: 'Kérlek ird be a kontakt nevet ',
warning_msg_4_hu: 'Konfigurációk visszakérése sikertelen. .<br /><br /> A beállitások oldalon a Szerver mezőbe ird be a VoIP szolgáltatód domain nevét vagy IP cimjét',
err_msg_1_hu: 'Helytelen felhasználónév.',
err_msg_2_hu: 'Helytelen jelszó.',
err_msg_3_hu: 'ERROR, Ird be a telefonszámot vagy SIP URI-t vagy felhasználónevet',
err_msg_4_hu: 'Helytelen telefonszám vagy SIP URI vagy felhasználónév',
err_msg_5_hu: 'Helytelen telefonszám.',
err_msg_6_hu: 'Helytelen cim.',
err_msg_7_hu: 'Nincsenek törölnivaló üzenetek',

err_msg_8_hu: 'Ird be a felhasználónevet.',
err_msg_9_hu: 'Ird be a jelszót.',
err_msg_10_hu: 'Ird be az emailcimed.',
err_msg_11_hu: 'Ird be a teljes neved.',
err_msg_12_hu: 'Helytelen emailcim.',
err_msg_13_hu: 'Felhasználónév minimális hossza',
err_msg_14_hu: 'Helytelen felhasználónév.',
err_msg_15_hu: 'Jelszó minimális hossza ',
err_msg_16_hu: 'Helytelen jelszó.',
err_msg_17_hu: 'Teljes név minimális hossza',
err_msg_18_hu: 'Helytelen név.',
err_msg_19_hu: 'Helytelen telefonszám.',
err_msg_20_hu: 'Helytelen cim.',
err_msg_21_hu: 'Ird be a telefonszámod.',
err_msg_22_hu: 'Beállitások lekérdezése sikertelen. Később próbálkozz újra.',

err_nocallinprogress_hu: 'Nincs hivás folyamatban',
err_flash_local_hu: 'A Flash engine csak akkor fog müködni, ha webszerverről lesz futtatva, nem lokális file systemről',

srvaddr_help_hu: 'VoIP service provider server address (ip address or domain name or DNS SRV record). You can also suffix a port number if the server is not on the default SIP port (5060). Example: yourserver.com:6000<br /><br /> In case if you are new to VoIP:<br /> Unlike some other popular software such as Skype, if you are using standard SIP protocol you can use any VoIP provider. There are a hundreds of such kind of services and you could also setup your own server, for example using Mizu server or Asterisk.<br /> Internal (softphone to softphone) calls are usually free and the cost of outbound calls (calls to mobile or landline) are usually cheaper than for traditional providers, especially international calls.<br /> There are also a lot of other benefits in using standard VoIP such as high call quality (with wideband codec), freedom (you can switch your provider at any time), control (you can easily manage your account) and flexibility (lots of extra services such as call recording, conferencing and others). You can even use multiple providers (for example you can always use the cheaper one for your call targets).<br /> If you don\'t have a VoIP account yet then you can create one within a few minutes at any provider and start using VoIP right now: https://www.voip-info.org/wiki/view/Sip+Phone+Service+Providers',


sett_display_name_serveraddress_user_hu: 'Szerver',
sett_comment_serveraddress_user_hu: 'Ird be a szerver cimét (domain vagy IP:port), brand név vagy operátor kód',
sett_comment_serveraddress_user_gmsdialer_hu: 'Ird be az operátor kódot',
sett_comment_short_serveraddress_user_hu: '',
sett_comment_serveraddress_user_operator_hu: 'Ird be az operátor kódot',

sett_display_name_sipusername_hu: 'Felhasználónév',
sett_comment_sipusername_hu: 'SIP felhasználónév autentikálásra',
sett_comment_short_sipusername_hu: 'VoIP felhasználónév',    

sett_display_name_password_hu: 'Jelszó',
sett_comment_password_hu: 'Ird be a SIP jelszavad',
sett_comment_short_password_hu: 'VoIP jelszó',

sett_display_name_startwithos_hu: 'Indulás Windows-al',
sett_comment_startwithos_hu: 'Induljon Windows indulásakor',
sett_comment_short_startwithos_hu: '',

sett_display_name_startonboot_hu: 'Fusson háttérben',
sett_comment_startonboot_hu: 'Mindig várja a bejövő hivásokat (a service háttérben fog futni, hogy engedélyezze a bejövő hivásokat)',
sett_comment_short_startonboot_hu: '',

sett_display_name_codec_hu: 'Audiókodek',
sett_comment_codec_hu: 'Válasszd ki a kedvelt kodeket',
sett_checkbox_codec_hu: 'Használd csak a kedvelt kodeket',
sett_comment_short_codec_hu: '',

sett_display_name_dtmfmode_hu: 'DTMF',
sett_comment_dtmfmode_hu: 'Válassz DTMF küldési metódust',
sett_comment_short_dtmfmode_hu: '',

sett_display_name_register_hu: 'Regisztrálás',
sett_comment_register_hu: 'Regisztrálás a domainhez. Ez mindig szülséges, hogy fogadhassál bejövő hivásokat és néhány szolgáltató igényli a kimenő hivások engedélyezéséhez is.',
sett_comment_short_register_hu: 'Kikapcsol / Bekapcsol regisztrálást a SIP domain-hez',

sett_display_name_registerinterval_hu: 'Regisztrálási időköz',
sett_comment_registerinterval_hu: 'Regisztrálási időköz másodpercekben kifejezve',
sett_comment_short_registerinterval_hu: '',

sett_display_name_earlymedia_hu: 'Early media küldése',
sett_comment_earlymedia_hu: 'Média küldésének a kezdete, amikor megjön a session progres ',
sett_comment_short_earlymedia_hu: '',

sett_display_name_transfertype_hu: 'Transzfer tipusa',
sett_comment_transfertype_hu: 'Válassz hivástranszfer metódust',
sett_comment_short_transfertype_hu: '',

sett_display_name_playring_hu: 'Visszacsörgés',
sett_comment_playring_hu: 'Csengőhang generálása bejövő és kimenő hivásoknak',
sett_comment_short_playring_hu: '',

sett_display_name_autoanswer_forward_hu: 'Automatikus hivásfogadás, továbbítás vagy lezárás',
sett_comment_autoanswer_forward_hu: 'Automatikusan kezeli a bejövő hivásokat',
sett_comment_short_autoanswer_forward_hu: '',

sett_display_name_proxyaddress_hu: 'Proxy szerver cime',
sett_comment_proxyaddress_hu: 'Kimenő proxy szerver cime. Hagyd üresen, ha nincs egy stateless/kimenő proxy szervered',
sett_comment_short_proxyaddress_hu: 'Kimenőproxy szerver cime ',

sett_display_name_realm_hu: 'Realm',
sett_comment_realm_hu: 'Állitsd be a SIP realm-et, ha nem ugyanaz mint a VoIP szerver cime',
sett_comment_short_realm_hu: '',

sett_display_name_voicemailnum_hu: 'Hangposta',
sett_comment_voicemailnum_hu: 'Allitsd be a hangposta számot, amely használva lesz ha nem kapod meg automatikusan.',
sett_comment_short_voicemailnum_hu: 'Hangposta szám beállitása',

sett_display_name_use_stun_hu: 'STUN használata',
sett_comment_use_stun_hu: 'Változtasd meg, ha NAT specifikus problémáid vannak (nem tudsz regisztrálni, nem tudsz hivni, audio problémák)',
sett_comment_short_use_stun_hu: 'Publikus IP cim megtalálásának bekapcsolása',

sett_display_name_use_fast_ice_hu: 'ICE használata',
sett_comment_use_fast_ice_hu: 'Gyors ICE tárgyalások (p2p RTP routolásra).<br>Megjegyzés: ha “Auto”-ra van állitva vagy “Yes”-re, akkor a STUN nincs kikapcsolva ',
sett_comment_short_use_fast_ice_hu: '',

sett_display_name_techprefix_hu: 'Tech. prefix',
sett_comment_techprefix_hu: 'Bármilyen tech prefix hozzáadása a hivott számhoz',
sett_comment_short_techprefix_hu: '',

sett_display_name_volumein_hu: 'Bejövő hangerősség',
sett_comment_volumein_hu: 'Az alapértelmezett mikrofon állítása 0 és 100% között. 50 azt jelenti, hogy nincsenek változtatások',
sett_comment_short_volumein_hu: '',

sett_display_name_volumeout_hu: 'Kimenő hangerősség',
sett_comment_volumeout_hu: 'Az alapértelmezett kihangositó állítása 0 és 100% között. 50 azt jelenti, hogy nincsenek változtatások.',
sett_comment_short_volumeout_hu: '',

sett_display_name_prack_hu: 'PRACK használata',
sett_comment_prack_hu: '100rel támogatva. Csak abban az esetben kell bekapcsolni, ha a szervered igényli ezt',
sett_comment_short_prack_hu: '',

sett_display_name_ringtimeout_hu: 'Csörgési időkorlát',
sett_comment_ringtimeout_hu: 'Maximális csörgési idő másodpercben. Alapértéke 90 másodperc',    
sett_comment_short_ringtimeout_hu: '',

sett_display_name_calltimeout_hu: 'Hivás időtartamkorlát ',
sett_comment_calltimeout_hu: 'Maximális engedélyezett hivásidőtartam. Alapértéke 10800 másodperc, ami 3 óra.',
sett_comment_short_calltimeout_hu: '',

sett_display_name_username_hu: 'Hivó ID',
sett_comment_username_hu: 'Ez nem az autentikálásra lesz használva. Add meg, ha nem ugyanaz mint a Felhasználónév. Egyes VoIP szerverek visszafogják utasitani ha nem ugyanaz mint a Felhasználónév!',
sett_comment_short_username_hu: 'Beállithatsz egy különböző felhasználónevet, ami A számként fog szerepelni',

sett_display_name_displayname_hu: 'Megjelenített név',
sett_comment_displayname_hu: 'Megjelenített név meghatározása.Ez egy opcionális beállítás és lehet a teljes neved',
sett_comment_short_displayname_hu: 'Megjelenített név meghatározása',

sett_display_name_theme_hu: 'Téma választása',
sett_comment_theme_hu: 'Változtasd meg a telefon témáját',
sett_comment_short_theme_hu: '',

sett_display_name_hidemyidentity_hu: 'Identitás elrejtése',
sett_comment_hidemyidentity_hu: 'Identitás elrejtése',
sett_comment_short_hidemyidentity_hu: '',

sett_display_name_localip_hu: 'Lokális IP cim',
sett_comment_localip_hu: 'Opcionálisan megadhatod a lokális IP cimed',
sett_comment_short_localip_hu: '',

sett_display_name_signalingport_hu: 'Lokális signaling port',
sett_comment_signalingport_hu: 'Lokális signaling port meghatározása (alapból egy stabil port, ami egy találomszerű értékkel van inicializálva. Ennek a portnak semmi köze sincs a szerver SIP portjához, ami általában 5060)',
sett_comment_short_signalingport_hu: 'Opcionálisan határozd meg a lokális signaling portot',

sett_display_name_rtpport_hu: 'Lokális RTP port',
sett_comment_rtpport_hu: 'Lokális RTP port-intervallum meghatározása (alapból egy stabil port-intervallum, ami találomszerű értékekkel van inicializálva)',
sett_comment_short_rtpport_hu: 'Lokális RTP port-intervallum meghatározása',

sett_display_name_jittersize_hu: 'Jitter mérete',
sett_comment_jittersize_hu: 'A jitter buffer sima lejátszáshoz használatos változó sávszélességalatt. A mérete dinamikusan van kiszámitva, de ennek a viselkedése megváltozható ezzel a beállitással',
sett_comment_short_jittersize_hu: '',

sett_display_name_forcewifi_hu: 'Wifi erőltetése',
sett_comment_forcewifi_hu: 'Engedélyezd és szkenneld a wifi-t induláskor, új hiváskor vagy kapcsolat elvesztésekor (Ez a beállítás nélkül is a WiFi lesz elönyben ha rendelkezésre áll)',
sett_comment_short_forcewifi_hu: 'Tartsd a wifi-t ébren, hogy müködjenek a bejövő hivások',

sett_display_name_callforwardonbusy_hu: 'Hivástovábbitási szám',
sett_comment_callforwardonbusy_hu: 'Állitsál be egy hivásátirányitási számot, azokra a hivásokra amelyek elutasitva vannak foglalt esetén vagy automatikus irányitásra',
sett_comment_short_callforwardonbusy_hu: '',

sett_display_name_callforwardonreject_hu: 'Hivástovábbitás visszautasitáskor',
sett_comment_callforwardonreject_hu: 'Továbbitsd a hivást ha vissza van utasitva',
sett_comment_short_callforwardonreject_hu: '',

sett_display_name_rejectonvoipbusy_hu: 'VoIP foglaltság esetén',
sett_comment_rejectonvoipbusy_hu: 'Állitsd be hogyan viselkedjen, ha már egy VoIP hivás folyamatban van',
sett_comment_short_rejectonvoipbusy_hu: '',

//OPSSTART
sett_display_name_usetunneling_hu: 'Tunneling éstitkosítás',
sett_comment_usetunneling_hu: 'Használjon titkositott és tunneles transport layer-eket (UDP, TCP vagy HTTP)',
sett_comment_short_usetunneling_hu: 'Használjon alternativ titkositást',
sett_comment_usetunneling_1_hu: 'Hasznos azokban az országokban, ahol a VoIP blokkolva van és tüzfalak mögül. Ha gyakran szeretnéd használni ezt a funkciót, akkor kellene upgradeoljál MizuDroidPro-ra, amiben korlátlan titkositás engedélyezett',
sett_comment_usetunneling_2_hu: 'A signaling és média is titkositva van.',
//OPSEND

sett_display_name_encryptionport_hu: 'Titkositási port',
sett_comment_encryptionport_hu: 'Szerver alap titkositási port',
sett_comment_short_encryptionport_hu: '',

/*
sett_display_name_loglevel_hu: 'Logolás bekapcsolása',
sett_comment_loglevel_hu: 'Logok mentése fájl-ba, hogy a későbbiekben feltölthetőek legyenek az ügyfélszolgálathoz',
sett_comment_short_loglevel_hu: '',
*/

sett_display_name_loglevel_hu: 'Logolás bekapcsolása',
sett_comment_loglevel_hu: 'Logok mentése fájl-ba, hogy a későbbiekben feltölthetőek legyenek az ügyfélszolgálathoz',
sett_comment_short_loglevel_hu: '',

sett_display_name_rejectonphonebusy_hu: 'Foglalt esetén',
sett_comment_rejectonphonebusy_hu: 'Állitsd be a viselkedését, ha már van egy nativ telefonhivás folyamatban',
sett_comment_short_rejectonphonebusy_hu: '',

sett_display_name_proximitysensor_hu: 'Közelségérzékelő',
sett_comment_proximitysensor_hu: 'Kapcsolja ki a képernyőt hivás közben. Ez a funkció ki van kapcsolva alapból, mert legtöbb készüléken probléma van a visszakapcsolással',
sett_comment_short_proximitysensor_hu: 'Kapcsolja ki a képernyőt amig a készülék közel van a fülhöz',

sett_display_name_aec_hu: 'AEC',
sett_comment_aec_hu: 'Akusztikus visszhangelnyomás. Kapcsold ki, ha visszhangot tapasztalnak a hivó felek. ',
sett_comment_short_aec_hu: '',

sett_display_name_agc_hu: 'AGC',
sett_comment_agc_hu: 'Automatikus erősítésszabályozás. A hangerősséget fogja szabályozni automatikusan',
sett_comment_short_agc_hu: '',

sett_display_name_denoise_hu: 'Zajszürő',
sett_comment_denoise_hu: 'Kiszüri a zajt a beszélgetesekből (háttérzaj vagy a mikrofon által generált zaj)',
sett_comment_short_denoise_hu: '',

sett_display_name_silencesupress_hu: 'Csend elnyomás',
sett_comment_silencesupress_hu: 'Ne küldje a médiát, amikor nincs beszélgetés. Csak akkor kapcsold be, ha a sávszélességed nagyon kicsi.',
sett_comment_short_silencesupress_hu: '',

sett_display_name_plc_hu: 'PLC',
sett_comment_plc_hu: 'Csomagvesztés eltitkolása. Segít a hivásminőség növelésén gyenge minőségő hállózatok esetén',
sett_comment_short_plc_hu: '',

sett_display_name_filters_hu: 'Számátirás',
sett_comment_filters_hu: 'Hivott szám átirási szabalyok (hozzáad/töröl/prefix átirása)',
sett_comment_short_filters_hu: '',

sett_display_name_callback_mode_hu: 'Callback metodus',
sett_comment_callback_mode_hu: 'Válaszd ki, hogy mikor használjon callback-et',
sett_comment_short_callback_mode_hu: '',

sett_display_name_email_hu: 'Email cim',
sett_comment_email_hu: 'Az email cimed (hasznos a technikai ügyfélszolgálat számára)',
sett_comment_short_email_hu: 'Az email cimed',

sett_display_name_chatsms_hu: 'Chat/SMS',
sett_comment_chatsms_hu: 'Állitsd be az üzenetek metódusát',
sett_comment_short_chatsms_hu: '',

sett_display_name_savetocontacts_hu: 'Új kontaktok',
sett_comment_savetocontacts_hu: 'Ismeretlen számok automatikus hozzáadása a kontakt listához',
sett_comment_short_savetocontacts_hu: 'Új kontaktok hozzáadása a kontaktlistához',

sett_display_name_call_access_hu: 'Access number hivása ',
sett_comment_call_access_hu: 'IVR access number hivása mobil hálózatról',
sett_comment_short_call_access_hu: 'Access number hivása mobil hálózatról',

sett_display_name_unlockphone_hu: 'Billentyüzár feloldása',
sett_comment_unlockphone_hu: 'Billentyüzár automatikus feloldása bejövő hivások esetén',
sett_comment_short_unlockphone_hu: '',

sett_display_name_audiorecorder_hu: 'Hangfelvevő',
sett_comment_audiorecorder_hu: 'Csak speciális eszközöknél kell megváltoztatni, vagy különleges követelmények esetén, vagy haaz automatikus beállítás nem preferált',
sett_comment_short_audiorecorder_hu: '',

sett_display_name_audioplayer_hu: 'Audió lejátszó',
sett_comment_audioplayer_hu: 'Válaszd ki az audio lejátszót. Csak speciális eszközöknél kell megváltoztatni, vagy különleges követelmények esetén, vagy haaz automatikus beállítás nem preferált',
sett_comment_short_audioplayer_hu: '',

sett_display_name_speakerphoneplayer_hu: 'Kihangositó lejátszó',
sett_comment_speakerphoneplayer_hu: 'Válaszd ki a kihangositó lejátszóját. Csak speciális eszközöknél kell megváltoztatni, vagy különleges követelmények esetén, vagy haaz automatikus beállítás nem preferált',
sett_comment_short_speakerphoneplayer_hu: '',

sett_display_name_speakerphoneoutput_hu: 'Audió mód',
sett_comment_speakerphoneoutput_hu: 'Válaszd ki a kimeneteli eszközt kihangositás esetén',
sett_comment_short_speakerphoneoutput_hu: '',

sett_display_name_keepalive_hu: 'Keep-alive',
sett_comment_keepalive_hu: 'Fog küldeni egy rövid csomagot a megadott időintervallumokban (másodpercek), hogy megnyitsa és nyitva tartsa a NAT készüléked (router), hogy lehetővé tegye a bejövő hivásokat és más értesitéseket',
sett_comment_short_keepalive_hu: 'Tartsa nyitva a NAT készüléked',

sett_display_name_mediaencryption_hu: 'Médiatitkositás',
sett_comment_mediaencryption_hu: 'Állitsd be a médiatitkositási metódust',
sett_comment_short_mediaencryption_hu: '',

sett_display_name_setqos_hu: 'QoS',
sett_comment_setqos_hu: 'Állitsd be a forgalom osztályát vagy a szolgáltatás tipusát oktettben az IP fejlécben az UDP csomagoknak',
sett_comment_short_setqos_hu: '',

sett_display_name_codecframecount_hu: 'RTP Keret/Csomag',
sett_comment_codecframecount_hu: 'Kodek rakomány száma egy UDP/RTP csomagban. A magasabb értékek kisebb sávszélességet igényelnek, de több a késés.A nem szokásos értékek (4 fölött) inkompatibilitási problémákat okozhatnak a szolgáltatóval.',
sett_comment_short_codecframecount_hu: 'Kodek rakomány száma egy UDP csomagban',

sett_display_name_doublesendrtp_hu: 'RTP csomagok kétszeres elküldése',
sett_comment_doublesendrtp_hu: 'Javithatja a hangminőséget bizonyos körülmények között, de növeli a feltöltési adatok mennyiségét',
sett_comment_short_doublesendrtp_hu: 'RTP csomagok kétszeres elküldése',

sett_display_name_cfgcpuspeed_hu: 'CPU sebessége',
sett_comment_cfgcpuspeed_hu: 'Funkciókat, mint például az AEC vagy kodekek be-ki kapcsolását határozza meg az eszköz proceszorának a sebessége',
sett_comment_short_cfgcpuspeed_hu: 'A funkciók automatikusan vannak kiválasztva a processzor sebességétől függően',

sett_display_name_cfgnetworkspeed_hu: 'Hálózat sebessége',
sett_comment_cfgnetworkspeed_hu: 'Segit a legjobb kodek és médiafejlesztések kiválasztásában.',
sett_comment_short_cfgnetworkspeed_hu: '',

sett_display_name_accounts_hu: 'Fiokok',
sett_comment_accounts_hu: 'SIP fiokok kezelése',
sett_comment_short_accounts_hu: '',

sett_display_name_extraoption_hu: 'Extra opciok',
sett_comment_extraoption_hu: 'A sajátos paraméterek beállithatok kulcs-érték párositásokban, pontosvesszővel elválasztva. <br> Példa: Megjelenítendőnév=János;',
sett_comment_short_extraoption_hu: 'Sajátos paraméterek beállithatok',

sett_display_name_reset_settings_hu: 'Beállítások visszaállítása',
sett_comment_reset_settings_hu: 'Beállítások visszaállítása az alapértékükre',
sett_comment_short_reset_settings_hu: '',

sett_display_name_autoignore_hu: 'Automatikus figyelmenkivül hagyás',
sett_comment_autoignore_hu: 'Automatikusan figyelmenkivül hagyja a bejövő hivásokat ',
sett_comment_short_autoignore_hu: '',

sett_display_name_ringtone_hu: 'Csengőhang',
sett_comment_ringtone_hu: 'Változtasd meg a csengőhangot a bejövő hivásoknak',
sett_comment_short_ringtone_hu: '',

sett_display_name_changesptoring_hu: 'Csengés session progress-kor',
sett_comment_changesptoring_hu: 'A session progress(183) kezelése mint ringing (180). Ez akkor szükséges, ha a szolgáltatod nem küld ringing-et vagy early media-t',
sett_comment_short_changesptoring_hu: 'A session progress(183) kezelése mint ringing (180)',

sett_display_name_transport_hu: 'Szállitási protokol',
sett_comment_transport_hu: 'Válaszd ki a szállitási protokolt',
sett_comment_short_transport_hu: '',

sett_display_name_defmute_hu: 'Némitás iránya',
sett_comment_defmute_hu: 'Határozd meg, hogy némitsa a hivást, amikor a  némitás gomb megvan nyomva',
sett_comment_short_defmute_hu: '',

sett_display_name_automute_hu: 'Némitás új hivások esetén',
sett_comment_automute_hu: 'Határozd meg, ha a folyamatban levő hivásokat kell-e némitani új hivás esetén',
sett_comment_short_automute_hu: '',

sett_display_name_autohold_hu: 'Hivás tartása új hivás esetén',
sett_comment_autohold_hu: 'Határozd meg, hogy a folyamatban levő hivásokat tartásba kell-e tenni',
sett_comment_short_autohold_hu: '',

sett_display_name_customsipheader_hu: 'Sajátos SIP fejléc',
sett_comment_customsipheader_hu: 'Sajátos sip fejléc (egy sor a SIP signaling-ba), ami el lesz küldve az összes SIP üzenetben (Szakértői beállitás)',
sett_comment_short_customsipheader_hu: '',

sett_display_name_enginepriority_java_hu: 'Java applet prioritása',
sett_comment_enginepriority_java_hu: 'Állitsd be a java applet prioritását',
sett_comment_short_enginepriority_java_hu: '',

sett_display_name_enginepriority_webrtc_hu: 'WebRTC prioritása',
sett_comment_enginepriority_webrtc_hu: 'Állitsd be a WebRTC prioritását',
sett_comment_short_enginepriority_webrtc_hu: '',

sett_display_name_enginepriority_ns_hu: 'Service plugin prioritása',
sett_comment_enginepriority_ns_hu: 'Állitsd be a service plugin prioritását',
sett_comment_short_enginepriority_ns_hu: '',

sett_display_name_enginepriority_flash_hu: 'Flash prioritása',
sett_comment_enginepriority_flash_hu: 'Állitsd be a flash prioritását',
sett_comment_short_enginepriority_flash_hu: '',

sett_display_name_enginepriority_app_hu: 'App prioritása',
sett_comment_enginepriority_app_hu: 'Állitsd be az app prioritását',
sett_comment_short_enginepriority_app_hu: '',

sett_display_name_enginepriority_p2p_hu: 'P2P prioritása',
sett_comment_enginepriority_p2p_hu: 'Állitsd be a P2P prioritását',
sett_comment_short_enginepriority_p2p_hu: '',

sett_display_name_enginepriority_accessnum_hu: 'Access number prioritása',
sett_comment_enginepriority_accessnum_hu: 'Állitsd be az access number prioritását',
sett_comment_short_enginepriority_accessnum_hu: '',

sett_display_name_enginepriority_nativedial_hu: 'Natív dialer prioritása',
sett_comment_enginepriority_nativedial_hu: 'Állitsd be a natív dialer prioritását',
sett_comment_short_enginepriority_nativedial_hu: '',

sett_display_name_sendrtponmuted_hu: 'Küldje a médiát némitás esetén is',
sett_comment_sendrtponmuted_hu: 'Küldje a médiát némitás esetén is. Csak akkor állitsd true-ra, ha a szervered nem tudja lekezelni az RTP elnyomottságot',
sett_comment_short_sendrtponmuted_hu: '',

sett_display_name_capabilityrequest_hu: 'Képesség lekérése',
sett_comment_capabilityrequest_hu: 'Ha bevan állitva, akkor fog küldeni egy képesség lekérési üzenetet (OPTIONS) a SIP szervernek induláskor',
sett_comment_short_capabilityrequest_hu: '',

sett_display_name_dialerintegration_hu: 'Integrálás',
sett_comment_dialerintegration_hu: 'A natív tárcsázó használatakor meg leszel kérdezve, hogy SIP-et akarsz használni vagy mobilt',
sett_comment_short_dialerintegration_hu: '',

sett_display_name_devtest_hu: 'Fejlesztői tesztek',
sett_comment_devtest_hu: 'Csak fejlesztési célokra van használva',
sett_comment_short_devtest_hu: '',

sett_display_name_settobasefunctionality_hu: 'Alap funkcionalitás beállitása',
sett_comment_settobasefunctionality_hu: 'Fejlesztési célokra használt',
sett_comment_short_settobasefunctionality_hu: '',

sett_display_name_enableaudio_hu: 'Audió engedélyezése',
sett_comment_enableaudio_hu: 'Csak tesztekre használt',
sett_comment_short_enableaudio_hu: '',

sett_display_name_screenrotation_hu: 'Képernyő forgatás',
sett_comment_screenrotation_hu: 'Képernyő irányának az állitása',
sett_comment_short_screenrotation_hu: 'Képernyő irányának az állitása',

sett_display_name_audiobufferlength_hu: 'Audiobuffer hossza',
sett_comment_audiobufferlength_hu: '-1 automatikusat jelent. Valós értékek 160 és 1600 között vannak. Szakértő beállitás.',
sett_comment_short_audiobufferlength_hu: 'Szakértő beállitás az audió lejátszóbuffer méretének a meghatározására',

sett_display_name_p2p_hu: 'Phone 2 Phone URI',
sett_comment_p2p_hu: 'Phone 2 Phone http request',
sett_comment_short_p2p_hu: 'Server HTTP API, ha van',

sett_display_name_callback_hu: 'Callback URI',
sett_comment_callback_hu: 'Callback HTTP request',
sett_comment_short_callback_hu: 'Server HTTP API, ha van',

sett_display_name_sms_hu: 'SMS URI',
sett_comment_sms_hu: 'SMS HTTP request',
sett_comment_short_sms_hu: 'Server HTTP API, ha van',

sett_display_name_creditrequest_hu: 'Egyenleg URI',
sett_comment_creditrequest_hu: 'Egyenlg HTTP request',
sett_comment_short_creditrequest_hu: 'Server HTTP API, ha van',

sett_display_name_ratingrequest_hu: 'Hivásár URI',
sett_comment_ratingrequest_hu: 'Hivásár HTTP request',
sett_comment_short_ratingrequest_hu: 'Server HTTP API, ha van',

sett_display_name_displaynotification_hu: 'Megjelenő értesités',
sett_comment_displaynotification_hu: 'Értesitések megjelenitése a telefon értesitési sávján (általában a telefon felső sarkában)',
sett_comment_short_displaynotification_hu: 'Értesitések megjelenitése a telefon értesitési sávján',

sett_display_name_displayvolumecontrols_hu: 'Hangerő állandó megjelenitése',
sett_comment_displayvolumecontrols_hu: 'Hangerő kontrolok állandó megjelenitése hivás alatt',
sett_comment_short_displayvolumecontrols_hu: '',

sett_display_name_displayaudiodevice_hu: 'Audió készülék állandó megjelenitése',
sett_comment_displayaudiodevice_hu: 'Audió készülék állandó megjelenitése hivás alatt',
sett_comment_short_displayaudiodevice_hu: '',

sett_display_name_cpualwayspartiallock_hu: 'CPU állandó parciális lezárása',
sett_comment_cpualwayspartiallock_hu: 'Állandóan ébren tartja a készülék processzorát. Csak abban az esetben állitsd be, ha másképpen a softphone elvesziti a regisztrálást és nem müködnek a bejövő hivások',
sett_comment_short_cpualwayspartiallock_hu: 'CPU állandó parciális lezárása',

sett_display_name_disablewbforpstn_hu: 'Szélessávú kodekek letiltása PSTN-re',
sett_comment_disablewbforpstn_hu: 'Szélessávú audio kodekek letiltása kimenő (mobil/vezetékes telefon) hivásokra (szélessávú kodekek csak lokális hivásokra)',
sett_comment_short_disablewbforpstn_hu: '',

sett_display_name_multiplecalls_hu: 'Többszörös hivás engedélyezése',
sett_comment_multiplecalls_hu: 'Többszörös hivás/konferencia engedélyezése(gyenge CPU-k nem tudják lekezelni)',
sett_comment_short_multiplecalls_hu: '',

sett_display_name_callback_accessnumber_hu: 'Callback szám',
sett_comment_callback_accessnumber_hu: 'Callback access szám. Néhány VoIP szolgáltató biztosít ilyen számokat, amelyeket hivhatod és kapsz egy bejövő hivást a szerver IVR-től',
sett_comment_short_callback_accessnumber_hu: '',

sett_display_name_storecallhistory_hu: 'Hiváslista tárolása',
sett_comment_storecallhistory_hu: 'Határozd meg, hogy hová tárolja a hiváslistát',
sett_comment_short_storecallhistory_hu: '',

sett_display_name_keepdeviceawakeincall_hu: 'Készülék ébren tartása hivás közben',
sett_comment_keepdeviceawakeincall_hu: 'Készülék ébren tartása hivás közben',
sett_comment_short_keepdeviceawakeincall_hu: '',

sett_display_name_speakermode_hu: 'Kihangositási mód',
sett_comment_speakermode_hu: 'Kihangositási mód',
sett_comment_short_speakermode_hu: '',

sett_display_name_focusaudio_hu: 'Audió fokuszálás',
sett_comment_focusaudio_hu: 'Fokuszálás a VoIP hivásokra (ez lehalkithatja a többi médialejátszót VoIP hivások alatt)',
sett_comment_short_focusaudio_hu: 'Fokuszálás VoIP audióra',

sett_display_name_useroutingapi_hu: 'Routolási API használata',
sett_comment_useroutingapi_hu: 'Néhány régebbi készüléknek szüksége van erre a helyes audio kezeléshez',
sett_comment_short_useroutingapi_hu: '',

sett_display_name_hardwaremedia_hu: 'Hardware média',
sett_comment_hardwaremedia_hu: 'Használjon hardware média fejlesztéseket, mint AEC és zajtalanitás. Megtörténhet, hogy egy kis késleltetést okoz',
sett_comment_short_hardwaremedia_hu: 'Használjon hardware média fejlesztéseket',

sett_display_name_autousebluetooth_hu: 'Automatikus Bluetooth',
sett_comment_autousebluetooth_hu: 'Automatikus Bluetooth használása',
sett_comment_short_autousebluetooth_hu: '',

sett_display_name_nativefilterallow_hu: 'Prefixek engedélyezése',
sett_comment_nativefilterallow_hu: 'Kezelje a natív hivásokat, ha a szám a következő prefixel kezdődik',
sett_comment_short_nativefilterallow_hu: '',

sett_display_name_nativefilterblock_hu: 'Nem engedélyezett prefixek',
sett_comment_nativefilterblock_hu: 'Ne kezelje a natív hivásokat, ha a szám a következő prefixel kezdődik',
sett_comment_short_nativefilterblock_hu: '',

sett_display_name_integrateifwifionly_hu: 'Integrálás csak Wifi esetén',
sett_comment_integrateifwifionly_hu: 'Integrálás a natív tárcsázóval csak Wifi kapcsolat esetén',
sett_comment_short_integrateifwifionly_hu: '',

sett_display_name_cfgvideo_hu: 'Video engedélyezése',
sett_comment_cfgvideo_hu: 'Video hivások engedélyezése',
sett_comment_short_cfgvideo_hu: '',

sett_display_name_video_profile_hu: 'Video minősége',
sett_comment_video_profile_hu: 'Video minőségének állitása ',
sett_comment_short_video_profile_hu: '',

sett_display_name_use_h263_hu: 'H263 kodek használata',
sett_comment_use_h263_hu: 'H263 kodek használata',
sett_comment_short_use_h263_hu: '',

sett_display_name_use_h264_hu: 'H264 kodek használata',
sett_comment_use_h264_hu: 'H264 kodek használata',
sett_comment_short_use_h264_hu: '',

sett_display_name_vibrate_hu: 'Vibrálás',
sett_comment_vibrate_hu: 'Vibrálás bejövő hivásoknál',
sett_comment_short_vibrate_hu: '',

sett_display_name_video_fps_hu: 'Video FPS',
sett_comment_video_fps_hu: 'Video frameráta állitása, 0 automatikusat jelent',
sett_comment_short_video_fps_hu: '',

sett_display_name_setfinalcodec_hu: 'Végső kodek állitása',
sett_comment_setfinalcodec_hu: 'Megoldás többszörös kodek egyeztetési problémákra',
sett_comment_short_setfinalcodec_hu: '',

sett_display_name_use_rport_hu: 'Rport használata',
sett_comment_use_rport_hu: 'Rport használata a Viafejlécben',
sett_comment_short_use_rport_hu: '',

sett_display_name_natopenpackets_hu: 'NAT megnyitó csomagok',
sett_comment_natopenpackets_hu: 'NAT készülékek  nyitva tartása UDP csomagok küldésével (változtasd meg, ha NAT problémáid vannak)',
sett_comment_short_natopenpackets_hu: '',



sett_display_name_submenu_sipsettings_hu: 'SIP Beállitások...',
sett_comment_submenu_sipsettings_hu: 'SIP-el kapcsolatos beállitások',
sett_comment_short_submenu_sipsettings_hu: '',

sett_display_name_submenu_media_hu: 'Média Beállitások...',
sett_comment_submenu_media_hu: 'Audió kodek, minőség és készülék',
sett_comment_short_submenu_media_hu: '',

sett_display_name_submenu_video_hu: 'Video...',
sett_comment_submenu_video_hu: 'Video-val kapcsolatos beállitások',
sett_comment_short_submenu_video_hu: '',

sett_display_name_submenu_sounddevicevolume_hu: 'Hang és hangerősség...',
sett_comment_submenu_sounddevicevolume_hu: 'Hang lejátszás és felvétel',
sett_comment_short_submenu_sounddevicevolume_hu: '',

sett_display_name_submenu_calldivert_hu: 'Hivásátirányitással kapcsolatos beállitások...',
sett_comment_submenu_calldivert_hu: 'Hívásátirányítás, transzfer, számátirás',
sett_comment_short_submenu_calldivert_hu: '',

sett_display_name_submenu_calldivert_advanced_hu: 'Haladó beállitások...',
sett_comment_submenu_calldivert_advanced_hu: 'Több beállitás',
sett_comment_short_submenu_calldivert_advanced_hu: '',

sett_display_name_advancedsettings_hu: 'Haladó beállitások...',
sett_comment_advancedsettings_hu: 'Haladó beállitások mutatása',
sett_comment_short_advancedsettings_hu: '',

sett_display_name_entersettings_hu: 'Beállitások...',
sett_comment_entersettings_hu: 'Beállitások mutatása',
sett_comment_short_entersettings_hu: '',

sett_display_name_submenu_general_hu: 'Általános beállitások...',
sett_comment_submenu_general_hu: 'Más beállitások',
sett_comment_short_submenu_general_hu: '',

sett_display_name_submenu_integrate_hu: 'Tárcsázó integrálása...',
sett_comment_submenu_integrate_hu: 'A natív tárcsázó használatakor meg leszel kérdezve, hogy SIP-et akarsz használni vagy mobilt',
sett_comment_short_submenu_integrate_hu: '',

sett_display_name_submenu_advanced_hu: 'Haladó beállitások... ',
sett_comment_submenu_advanced_hu: 'Több beállitás',
sett_comment_short_submenu_advanced_hu: '',

proversion_content_text_hu: 'Upgrade to Softphone Pro<br /><br />' +
'Certain features are available only in the Pro version ($39 license cost)<br />' +
'You should upgrade especially if you need one of the followings:<br />' +
'   -commercial usage<br />' +
'   -more features<br />' +
'   -explicit G.729 codec<br />' +
//OPSSTART
'   -VoIP tunneling and encryption extended service<br />' +
//OPSEND
'    <br />' +
'<br />' +
'How to upgrade:<br />' +
'	-Use PayPal to transfer 39 USD to info@mizu-voip.com. Mobile friendly link: ' +
'<a href="https://mobile.paypal.com" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://mobile.paypal.com\')">https://mobile.paypal.com</a>' +
'	-On your payment you will receive a software key by email within two workdays (usually within a few hours)<br />' +
'	-Enter the key in the input box below and click on the "Upgrade" button<br />' +
'	-You might need to restart the softphone on successful activation to activate the new features<br />' +
'<br />' +
'Note: you should first test the free version and upgrade to pro only if you are satisfied with the software. The pro version runs exactly like the free version but adds more features<br />' +
'<br />' +
'Contact <a href="mailto:webphone@mizu-voip.com">webphone@mizu-voip.com</a> for any help<br />' +
'Please use the Mizutech Android Forum (under the Support menu) for any questions, bug reports or suggestions<br />' +
'Company home page: <a href="https://www.mizu-voip.com" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://www.mizu-voip.com\')">https://www.mizu-voip.com</a> for more info.<br />' +
'Software home page: <a href="https://www.mizu-voip.com/Products/MobileSoftphones/AndroidSoftphone.aspx<br />" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://www.mizu-voip.com/Products/MobileSoftphones/AndroidSoftphone.aspx<br />\')">https://www.mizu-voip.com/Products/MobileSoftphones/AndroidSoftphone.aspx<br /></a>' +
'Copyright &copy; Mizutech SRL.',

help_text_custom_hu: '> How to use ?' +
'<br /><br />' +
'  ' +
'In the settings, enter your server address, SIP username and password ' +
'Save the settings (tap on OK).' +
'Now you are ready to initiate and accept phone calls. ' +
'During calls you have some additional options such as call transfer, hold, loudspeaker and others (icons are displayed or press the menu for more).' +
//'We wish you a lean VoIP experience.' +
'<br /><br />' +
'' +
'> What is [BRANDNAME]?' +
'<br /><br />' +
'' +
'[BRANDNAME] is a VoIP softphone using the open standard SIP protocol. [BRANDNAME] is not tied with any VoIP provider. You are free to use it with any VoIP server.' +
'<br /><br />' +
'With [BRANDNAME] you can do the followings: ' +
'-connect to any SIP server' +
'-free calls to other SIP softphones' +
'-make (cheap) calls to VoIP/landline/mobile/international (depending on your VoIP service provider)' +
'-accept incoming calls' +
'-exploit SIP features such as chat/CallerID/forward/transfer/hold/conference and others' +
'<br /><br />' +
'> What is SIP/VoIP?' +
'<br /><br />' +
'' +
'VoIP means "Voice over Internet Protocol", a few protocols to allow voice calls to be made over IP networks.' +
'SIP is the newest VoIP standard adopted by many organizations for their telecom infrastructure. By using the open standard SIP protocols you can keep yourself free of locked-in solutions such as Skype and you are free to use any standard based network for your telecom needs.' +
'More details: ' +
'<a href="https://en.wikipedia.org/wiki/Voice_over_IP" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://en.wikipedia.org/wiki/Voice_over_IP\')">https://en.wikipedia.org/wiki/Voice_over_IP</a>' +
'<br /><br />' +
'<a href="https://en.wikipedia.org/wiki/Session_Initiation_Protocol" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://en.wikipedia.org/wiki/Session_Initiation_Protocol\')">https://en.wikipedia.org/wiki/Session_Initiation_Protocol</a>' +
'<a href="https://www.voip-info.org/" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://www.voip-info.org\')">https://www.voip-info.org/</a>' +
'<br /><br />' +
'You can make VoIP calls in the following ways: ' +
'-direct IP to IP calls (this can be done by [BRANDNAME] by typing the peer full URI)' +
'-using your own VoIP server such as Asterisk on Linux' +
'-using a VoIP service provider' +
'<br /><br />' +
'' +
'> Settings/Features' +
'<br /><br />' +
'' +
'All the settings except server/username/password is optional.' +
'Change only if you have some special needs or if a setting is required by your VoIP service provider.' +
'There are some easy to use settings such as call forward or number rewrite which you might wish to modify to enhance your VoIP experience.' +
'However the advanced settings (Setting page -> Menu -> Show advanced settings) should be modified only by experts or if you have some issues using the softphone.' +

'A few useful settings: ' +
'-Registration to a server: by default the [BRANDNAME] will try to register to the server what you have set to allow incoming calls, but this is optional (if you need only outbound calls) and can be disabled from the "SIP Settings"' +
'-Transport protocol: UDP (the default) usually works with all servers.' +
'-Proxy address: set this only if you are instructed so by your VoIP provider ' +
'-CalledID display: by default it is your username, but you can also set a "CallerID" and/or "Display name" from the "SIP settings" section' +
'' +
'-call forward always: from the "Call Divert" setting, set a "Call forward number" and then set the "Auto answer" setting to "Forward"' +
'-call forward on busy: from the "Call Divert" setting, set a "Call forward number" and then set the "On phone busy" and/or "On VoIP busy" setting to forward calls' +
'<br /><br />' +
'' +
'[BRANDNAME] is compatible with all VoIP servers using the open standard SIP protocol.' +
'<br /><br />',


help_text_hu: '> How to use ?' +
'<br /><br />' +
'  ' +
'In the settings, enter your server address, SIP username and password ' +
'Save the settings (tap on OK).' +
'Now you are ready to initiate and accept phone calls. ' +
'During calls you have some additional options such as call transfer, hold, loudspeaker and others (icons are displayed or press the menu for more).' +
//'We wish you a lean VoIP experience.' +
'<br /><br />' +
'' +
'> What is [BRANDNAME]?' +
'<br /><br />' +
'' +
'[BRANDNAME] is a VoIP softphone using the open standard SIP protocol.' +
'<br /><br />' +
'With [BRANDNAME] you can do the followings: ' +
'-connect to your preferred SIP server' +
'-free calls to other SIP softphones' +
'-make (cheap) calls to VoIP/landline/mobile/international (depending on your VoIP service provider)' +
'-accept incoming calls' +
'-exploit SIP features such as chat/CallerID/forward/transfer/hold/conference and others' +
'<br /><br />' +
'> What is SIP/VoIP?' +
'<br /><br />' +
'' +
'VoIP means "Voice over Internet Protocol", a few protocols to allow voice calls to be made over IP networks.' +
'SIP is the newest VoIP standard adopted by many organizations for their telecom infrastructure. By using the open standard SIP protocols you can keep yourself free of locked-in solutions such as Skype and you are free to use any standard based network for your telecom needs.' +
'More details: ' +
'<a href="https://en.wikipedia.org/wiki/Voice_over_IP" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://en.wikipedia.org/wiki/Voice_over_IP\')">https://en.wikipedia.org/wiki/Voice_over_IP</a>' +
'<br /><br />' +
'<a href="https://en.wikipedia.org/wiki/Session_Initiation_Protocol" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://en.wikipedia.org/wiki/Session_Initiation_Protocol\')">https://en.wikipedia.org/wiki/Session_Initiation_Protocol</a>' +
'<a href="https://www.voip-info.org/" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://www.voip-info.org\')">https://www.voip-info.org/</a>' +
'<br /><br />' +
'You can make VoIP calls in the following ways: ' +
'-direct IP to IP calls (this can be done by [BRANDNAME] by typing the peer full URI)' +
'-using your own VoIP server such as Asterisk on Linux or Mizutech VoIP server on Windows servers' +
'-using a VoIP service provider' +
'<br /><br />' +
'' +
'> Settings/Features' +
'<br /><br />' +
'' +
'All the settings except server/username/password is optional.' +
'Change only if you have some special needs or if a setting is required by your VoIP service provider.' +
'There are some easy to use settings such as call forward or number rewrite which you might wish to modify to enhance your VoIP experience.' +
'However the advanced settings (Setting page -> Menu -> Show advanced settings) should be modified only by experts or if you have some issues using the softphone.' +

'A few useful settings: ' +
'-Registration to a server: by default the [BRANDNAME] will try to register to the server what you have set to allow incoming calls, but this is optional (if you need only outbound calls) and can be disabled from the "SIP Settings"' +
'-Transport protocol: UDP (the default) usually works with all servers.' +
'-Proxy address: set this only if you are instructed so by your VoIP provider ' +
'-CalledID display: by default it is your username, but you can also set a "CallerID" and/or "Display name" from the "SIP settings" section' +
'' +
'-call forward always: from the "Call Divert" setting, set a "Call forward number" and then set the "Auto answer" setting to "Forward"' +
'-call forward on busy: from the "Call Divert" setting, set a "Call forward number" and then set the "On phone busy" and/or "On VoIP busy" setting to forward calls' +
'<br /><br />' +
'' +
'[BRANDNAME] is compatible with all VoIP servers using the open standard SIP protocol. You are free to create a VoIP account at any service provider or use with your own VoIP server ' +
'<br /><br />' +
'' +
'> How can I get my customized softphone' +
'<br /><br />' +
'' +
'Contact Mizutech at <a href="mailto:info@mizu-voip.com">info@mizu-voip.com</a>' +
'<br /><br />' +
'' +
'> Contact us' +
'<br /><br />' +
'' +
'<a href="https://www.mizu-voip.com" target="_blank" onclick="webphone_api.common.OpenLinkInInternalBrowser(\'https://www.mizu-voip.com\')">https://www.mizu-voip.com</a><br />' +
'general/commercial: <a href="mailto:info@mizu-voip.com">info@mizu-voip.com</a><br />' +
'technical support: <a href="mailto:webphone@mizu-voip.com">webphone@mizu-voip.com</a>',





dlg_about_msg_hu: "[BRANDNAME] Version [APPVERSION]<br /><br />" +

"[BRANDNAME] is a SIP client.<br /><br />" +

" Visit https://www.mizu-voip.com for more info. For customized/branded builds email to info@mizu-voip.com<br />" +
"Please use the Mizutech Forum (under the Support menu) for any questions, bug reports or suggestions.<br />" +
"<br /><br /><br />" +
"License agreement:<br /><br />" +

"This SOFTWARE is licensed, not sold.<br />" +
"Copyright &copy; Mizutech. All rights reserved for MizuTech SRL.<br /><br />" +

"BY USING, DEPLOYING OR RUNNING THIS WEBPHONE SOFTWARE, YOU ARE CONSENTING TO BE BOUND BY AND ARE BECOMING A PARTY TO THIS AGREEMENT. IF YOU DO NOT AGREE TO ALL OF THE TERMS OF THIS AGREEMENT, DO NOT DEPLOY AND DO NOT EXECUTE IT! You must destroy all copies of the Software upon termination.<br /><br />" +

"This software is licensed, not sold and it is free to use for non commercial purposes.<br />" +
"MizuTech grants you a non-exclusive license to use the software free of charge for non commercial purposes only.<br />" +
"This license does not entitle you to hard-copy documentation, support or telephone assistance.<br /><br />" +

"You may not:<br />" +
"	-Commercially deploy the software<br />" +
"	-Make any revenue by using the software (except Pro version)<br />" +
"	-Resell the software<br />" +
"	-Reverse engineer, decompile, or disassemble the software<br />" +
"	-Modify the software in any way<br />" +
"	-Rent, lease, grant a security interest in, or otherwise transfer purchase rights of the software<br /><br />" +

"Title, ownership rights, and intellectual property rights in the Software shall remain with MizuTech and/or its suppliers.<br />" +
"This Agreement and the license granted hereunder will terminate automatically if you fail to comply with the limitations described herein. Upon termination, you must destroy all copies of the Software.<br />" +
"This software contains some modules distributed with LGPL or modified BSD license:<br />" +
"	-speex: https://www.speex.org <br />" +
"	-iLBC: https://www.ilbcfreeware.org <br /><br />" +

"THE SOFTWARE IS PROVIDED \"AS IS\" WITHOUT ANY WARRANTY OF ANY KIND.<br />" +
"Mizutech and its suppliers specifically disclaim any express or implied warranty of fitness for High Risk Activities.<br /><br />" +

"Copyright &copy; Mizutech SRL<br />",


// new entries
btn_accept_hu: 'Elfogad',
btn_reject_hu: 'Elutasít',
phone_nr2_hu: 'Telefonszám',
type_phone_hu: 'Telefonhívás',
phone_hu: 'Telefon',
choose_engine_title_single_engine_hu: 'Letöltéshez/instaláláshoz klikkelj rá',
menu_callpark_hu: 'Hívásparkoltatás',

sett_display_name_callforwardalways_hu: 'Állandó hivásátirányitás', 
sett_comment_callforwardalways_hu: 'Állitsd be azt a telefonszámot, ahová szeretnéd a hivásokat átirányitani',
sett_comment_short_callforwardalways_hu: '',

sett_display_name_calltransferalways_hu: 'Hivástranszferálás', 
sett_comment_calltransferalways_hu: 'Állitsd be azt a telefonszámot, ahová szeretnéd a hivásokat transzferálni',
sett_comment_short_calltransferalways_hu: '',

sett_display_name_autoaccept_hu: 'Automatikus hiváselfogadás', 
sett_comment_autoaccept_hu: 'Automatikusan elfogadja az összes bejövo hivást',
sett_comment_short_autoaccept_hu: '',

sett_display_name_loglevel_dbg_hu: 'Loggolás beállitása',  
sett_comment_loglevel_dbg_hu: 'Loggolási szint beállitása',
sett_comment_short_logleveldbg_hu: '',

sett_display_name_audiodevices_hu: 'Audió eszközök',
sett_comment_audiodevices_hu: 'Az audió eszköz beállitásai elérhetok lesznek a hivó oldalról amikor bejelentkezel',
sett_comment_short_audiodevices_hu: '', 

sett_display_name_callbacknumber_hu: 'Callback szám',
sett_comment_callbacknumber_hu: 'Callback szám. Egyes VoIP szolgáltatók juttatnak egy számot amit fel lehet hívni es visszahív egy szerver IVR',
sett_comment_short_callbacknumber_hu: 'Callback szám',

sett_display_name_blacklist_hu: 'Fekete lista', 
sett_comment_blacklist_hu: 'Fekete lista számai vesszokkel elválasztva',
sett_comment_short_blacklist_hu: '',

sett_display_name_video_hu: 'Video engedélyezése',
sett_comment_video_hu: 'Video hivások engedélyezése',
sett_comment_short_video_hu: '',

sett_display_name_video_bandwidth_hu: 'Video sávszélessége ',
sett_comment_video_bandwidth_hu: 'Video sávszélessége beállitása ',
sett_comment_short_video_bandwidth_hu: '',

sett_display_name_video_width_hu: 'Video szélessége',
sett_comment_video_width_hu: 'Video szélességének a beállitása pixelekben',
sett_comment_short_video_width_hu: '',

sett_display_name_video_height_hu: 'Video magassága',
sett_comment_video_height_hu: 'Video magasságanak a beállitása pixelekben',
sett_comment_short_video_height_hu: '',

sett_display_name_normalizenumber_hu: 'Számok normalizálása',
sett_comment_normalizenumber_hu: 'Speciális karaktereknek az eltüntetése a hivott számbol',
sett_comment_short_normalizenumber_hu: '', 

sett_display_name_sendchatonenter_hu: 'Üzenet elküldése enter-rel',
sett_comment_sendchatonenter_hu: 'Üzenet elküldése enter nyomásakor',
sett_comment_short_sendchatonenter_hu: '',

sett_display_name_transfwithreplace_hu: 'Hivástranszfer cserével', 
sett_comment_transfwithreplace_hu: 'Határozd meg, ha hiváscserét kell használni transzfer esetén, igy a folyamatban levo hivás nincs lezárva, csak le van cserélve. Ebben az esetben az A fél soha sincs lezárva, csak a hivó fél változik meg. A hivó fél kell tudja lekezelni a Replace header-t ennek a funkciónak a müködésének az érdekében',
sett_comment_short_transfwithreplace_hu: 'Határozd meg, hogy a transzfer cserével kell-e véghez vivodjön.',
 
btn_activate_hu: 'Aktiválás',
license_key_hu: 'Licensz kulcs',
enter_license_key_hu: 'Licensz kulcs beirása',
sett_chooseengine_title_hu: 'VoIP engine',
sett_chooseengine_popup_title_hu: 'Elérheto engine-ek',
sett_chooseengine_comment_hu: 'VoIP Engine kiválasztása',
sett_ce_highly_hu: 'nagyon ajánlott',
sett_ce_recommended_hu: 'ajánlott',
about_homepage_hu: 'Homepage',
about_copyright_hu: 'Copyright',
about_copyright2_hu: 'Minden jog fenntartva.',
hint_page_hu: 'Jelenlegi kiválasztott weboldal',
username_warning_hu: 'Kérlek ird be a SIP felhasználóneved',
hint_notif_clear_hu: 'Bejegyzés törlése',
not_missed_call_hu: 'Nem fogadott hivás',
not_missed_chat_hu: 'Nem fogadott üzenet',
not_panel_title_hu: 'Bejegyzések',
help_enablelog_hu: 'Logok engedélyezése',
help_logwindow_hu: 'Logok',
disable_logs_hu: 'Logok tiltása',
activated_hu: 'Pro Licensz aktiválva.',
about_support_hu: 'Ügyfélszolgálat', 
warning_feature_hu: 'Szükséged van egy Pro licenszre ennek a funkciónak az aktiválásához.<br />A licensz aktiválásához elöször jelentkezzél be, majd válaszd a "Licensz"-t a menü-bol.',
allowmedia_title_hu: 'Média hozzáférés', 
allowmedia_chrome_hu: 'szüksége van a mikrofon hozzáféréséhez.<br />A hozzáférés engedélyezéséhez, klikkeljél a "hang" ikonra a böngészod jobb felso sarkában és válaszd az "engedélyez" opciót, majd indits egy uj hivást.',
allowmedia_firefox_hu: 'szüksége van a mikrofon hozzáféréséhez.<br />A hozzáférés engedélyezéséhez, klikkeljél a "mikrofon" ikonra a böngészod közép-felso részében és válaszd az "engedélyez" opciót, majd indits egy uj hivást.',
allowmedia_general_hu: 'szüksége van a mikrofon hozzáféréséhez.<br />A hozzáférés megkapása után indits egy uj hivást.', 
filetransf_title_hu: 'Fájl küldése', 
filetransfer_nr_hu: 'SIP URI vagy felhasználónév',
hint_filetranf_hu: 'Fájl küldése',
filetransf_err_hu: 'Elöször irja be a cimzettet. ',
fitransf_failed_hu: 'Küldés sikertelen!',
fitransf_succeded_hu: 'A küldés sikeres volt',
fitransf_chat_hu: 'küldött egy fájlt', 
chrome_local_webrtc_audio_hu: 'A WebRTCnek nincs jogosultsága, hogy hozzáférjen az audio eszközökhez egy lokális fájlrendszerrol a Chrome és Opera böngészokben. \nA webphone egy biztonságos webszerveren kell legyen hosztolva (HTTPS), hogy müködjenek a bejövo és kimeno hivások WebRTC-n',
//chrome_https_hu: 'It is recommended to host the webphone on HTTPS to enable WebRTC on Chrome / Opera',
//chrome_https_hu: 'For Chrome and Opera we recommend to host the webphone on secure http (https), otherwise the mizu https proxy might be used.',
chrome_https_hu: 'A webphone-nak a helyes müködésének érdekében ajánljuk, hogy hosztolják ezt egy biztonságos webszerveren (https), másképpen a hivások nem fognak müködni WebRTCn.', 
webrtc_local_sipserver_hu: 'Lokális WebRTC szerver szükséges!', 
//chrome_https_reload_hu: 'For Chrome and Opera we recommend to host the webphone on secure http (https).',
chrome_https_reload_hu: 'Chrome-ban és Opera-ban a WebRTC csak https-en fog müködni. \n\n Klikkeljál az OK-ra, hogy ujratöltse az oldalt használva a Mizu https proxy-t',
all_demo_msg_hu: '(ezek az üzenetek csak a demo verzióban jelennek meg, a full verzióban ezek az esetek levannak kezelve automatikusan)',

save_to_contacts_title_hu: 'Mentés a kontaktokhoz',  
save_to_contacts_msg_hu: 'Le akarod menteni ezt a számot kontaktnak?',
btn_save_to_contacts_1_hu: 'Igen, hozzál létre új kontaktot.',  
btn_save_to_contacts_2_hu: 'Igen, add hozzá egy meglévo kontakthoz',
btn_save_to_contacts_dontask_hu: 'Ne kérdezd meg többá',
audio_title_hu: 'Audió beállitások',
audio_mic_hu: 'Mikrofon',
audio_rec_hu: 'Speaker',
audio_ring_hu: 'Csörgés',
audio_aec_hu: 'AEC',
audio_agc_hu: 'AGC',
audio_all_devices_hu: 'Összes',
filters_title_hu: 'Szabályok',
filters_add_label_hu: 'Szabályok hozzáadása',
filters_add_rule_hu: 'Szabály hozzáadása',
filter_start_hu: 'Amikor a szám ezzel kezdodik',
filter_replace_hu: 'Cseréld ki erre',
filter_minlen_hu: 'Min hossza',
filter_maxlen_hu: 'Max hossza',
filter_warning_hu: 'Legalább az "Amikor a szám ezzel kezdodik" vagy "Cseréld ki erre" mezok ki kell legyenek töltve.',
filter_delete_hint_hu: 'Szabály törlése',
filter_edit_hint_hu: 'Szabály megváltoztatása',
menu_block_contact_hu: 'Kontakt tiltása',
menu_unblock_contact_hu: 'Kontakt tiltása-nak feloldása',
addeditct_label_email_hu: 'Emailcim',
addeditct_label_address_hu: 'Cim',
addeditct_label_notes_hu: 'Bejegyzések',
addeditct_label_website_hu: 'Weboldal',
addeditct_addfield_hu: 'Mezo hozzáadása',
addeditct_hint_adddetails_hu: 'Kiegészito mezo hozzáadása',
ftrnasf_status_processing_hu: 'Feldolgozás folyamatban...',
ftrnasf_status_waiting_hu: 'Várakozás...',
ftrnasf_status_delivered_hu: 'Megérkezés.',
ns_engine_unreachable_hu: 'Az engine nem elérheto.',
menu_reconnect_hu: 'Ujrakapcsolódás',
menu_copy_hu: 'Másol',
menu_paste_hu: 'Illeszt',
menu_showlogs_hu: 'Logok mutatása',
menu_clearsettings_hu: 'Beallítasok tőrlése',
java_freeze_ff_hu: 'Miután elfogadtad az "Alkalmazás futtatása"-t,\n klikkeljél az OK-ra a folytatáshoz',
hint_hangup_hu: 'Hivás bontása',
hint_accept_hu: 'Hivás fogadása',
hint_reject_hu: 'Hivás elutasitása',
hint_called_hu: 'Hivó/hivott fél',
hint_callstatus_hu: 'Hivás statusa és eseményüzenetek', 
hint_callduration_hu: 'Hívás idotartama',
hint_more_hu: 'Több',  
ce_ask_user_hu: 'Ugy néz ki, hogy a [SELECTEDENGINE] engine nem müködik. Probáljuk ki a [RECOMMENDED] engine-t?',
ce_alert_title_hu: 'Install',
ce_alert_user_hu: 'fel kell legyen instalálva, hogy a [BRAND] müködjön helyesen.',
favafone_new_hu: 'Új vagyok a Favafone-nál',
newuser_pleaseenter_hu: 'Kérlek ird be',
newuser_invalid_hu: 'Helytelen',
hint_callforward_hu: 'Hivásátirányitás',
initiate_callforward_hu: 'Hivásátirányitás inicializálása',
callforward_title_hu: 'Hivásátirányitás',
menu_callforward_hu: 'Hivásátirányitás',
recharge_msg_hu: 'Feltöltés (PIN kóddal)',
recharge_error_hu: 'Ird be a feltöltési PIN kodot', 
username_err_hu: 'A felhasználónév tartalmaz nem támogatott speciális karaktereket, kérlek ird át',
password_err_hu: 'A jelszó tartalmaz nem támogatott speciális karaktereket, kérlek ird át',
menu_webcallme_hu: 'Click2call URL',
menu_confrooms_hu: 'Konferencia',
menu_callpickup_hu: 'Hivásfelvétel', 
webcallme_msg_hu: 'Küld el ezt a linket a barátaidnak és ok feltudnak majd hivni egy egyszeru klikkel',
cb_callonmobile_hu: 'Mobilszám hivása',
cb_callonnative_hu: 'VoIP hivás',
confroom_msg1_hu: 'A konferenciaszobád száma', 
confroom_msg2_hu: 'Adj hozzá másokat a konferenciához',
confroom_inv_title_hu: 'Meghivás a konferenciába', 
confroom_inv_msg_hu: 'Kaptál egy konferencia meghivást töle: ', 
service_update_hu: 'Egy új verzió NS-Service Plugin jelent meg. Ajánljuk, hogy frissitsél az utolsó verzióra.',
video_call_hu: 'Videó hivás',
video_call_msg_hu: 'Videó hivás',
btn_videocall_hu: 'Videó hivás',
menu_ignore_hu: 'Melloz',
hint_smiley_hu: 'Smiley',
menu_groupchat_hu: 'Társak hozzáadása(group chat)',
status_startingengine_hu: 'Engine inditása',
usenative_title_hu: 'Nativ app használata', 
usenative_option_native_hu: 'Ajánlott: nativ app, jobb minoséggel', 
usenative_option_webrtc_hu: 'Mellozés és inditás a böngészoben most',
menu_ct_setfavorite_hu: 'Beállitás kedvencként',
menu_ct_unsetfavorite_hu: 'Törlés a kedvencekbol',
menu_videorecall_hu: 'Video Újrahivás',
switch_engine_hu: 'Engine változtatása',
gc_message_hu: 'Group chat-ben vagy velük',
gc_message2_hu: 'csatlakozás a beszélgetéshez',
username_warning2_hu: 'A felhasználónév minimum hossza 3.', 
password_warning2_hu: 'A jelszó minimum hossza 3.',
composing_hu: 'ír', 
logview_msg_hu: 'Az oldal nem elérheto pár másodpercig. Töltsd újra, ha semmi sem történik.',
messagepl_hu: 'Összeállítás',
unlockadvancedsett_title_hu: 'Beállitások engedélyezése', 
unlockadvancedsett_msg_hu: 'Az elorehaladott beállitások engedélyezéséhez ird be a jelszót',
warning_notreg_hu: 'Nem tudsz hivást kezdeményezni, mert nem vagy beregisztrálva',
warning_notstarted_hu: 'Nem tudsz hivást kezdeményezni, mert a telefon még nincs elindulva',

chatsms__auto_guess_or_ask_hu: 'Automatikus talalat vagy kerdez',
chatsms__sms_only_hu: 'Csak SMS',
chatsms__chat_only_hu: 'Csak cseveges',
defmute__both_hu: 'Mindkettő',
defmute__speakers_only_hu: 'Csak kihangosító',
defmute__mic_only_hu: 'Csak mikrofon',
video__auto_hu: 'Automatikus',
video__disable_hu: 'Tíltva',
video__enable_hu: 'Engedélyezve',
video__force_hu: 'Erőltetve',
agc__disabled_hu: 'Kikapcsolva',
agc__for_redcording_hu: 'A felvételhez',
agc__both_for_recording_and_playback_hu: 'A felvételhez és visszajátszáshoz',
agc__guess_hu: 'Kitalál',
use_fast_ice__no_hu: 'Nem (csak ha a szerver mindig kell route-olja a médiát)',
use_fast_ice__auto_hu: 'Automatikus',
use_fast_ice__yes_hu: 'Igen',
use_fast_ice__always_hu: 'Mindig (nem ajánlott)',
use_stun__force_hu: 'Erőltetve privát IP-n',
use_stun__no_hu: 'Nem',
use_stun__stable_nat_hu: 'Csak stabil NAT-al',
use_stun__all_symetric_hu: 'Minden szimetrikus NAT-on',
use_stun__always_hu: 'Mindig',
use_stun__public_ip_hu: 'Publikus IP-n is',
use_rport__no_hu: 'Nem',
use_rport__simmetric_nat_hu: 'Szimetrikus NAT-on',
use_rport__always_hu: 'Mindig',
use_rport__public_ip_hu: 'Publikus IP-n is',
use_rport__request_hu: 'Kérni de nem használni',
register__no_hu: 'Ne',
register__auto_hu: 'Kitalál',
register__yes_hu: 'Igen',
changesptoring__nothing_hu: 'Nem csinál semmit',
changesptoring__disp_ringing_hu: 'Megjelenít csőrgő státuszt',
changesptoring__start_media_hu: 'Médiát indít',
changesptoring__start_media_disp_hu: 'Médiát indít és megjelenít csőrgő státuszt',
playring__no_hu: 'Nem',
playring__incoming_hu: 'Bejövő hívásoknak',
playring__both_hu: 'Bejövő és kimenő hívásoknak',
setfinalcodec__never_hu: 'Soha',
setfinalcodec__auto_hu: 'Automatikus',
setfinalcodec__multiple_codec_hu: 'Több kodek estén',
setfinalcodec__always_hu: 'Mindig',
denoise__disabled_hu: 'Kikapcsolva',
denoise__recording_hu: 'Felvételhez',
denoise__both_hu: 'Felvételhez és visszajátszáshoz',
denoise__auto_hu: 'Kitalál',
plc__no_hu: 'Nem',
plc__auto_hu: 'Automatikus',
plc__yes_hu: 'Igen',
silencesupress__auto_hu: 'Automatikus',
silencesupress__no_hu: 'Nem',
silencesupress__yes_hu: 'Igen',
hardwaremedia__auto_hu: 'Automatikus',
hardwaremedia__no_hu: 'Nem',
hardwaremedia__yes_hu: 'Igen',
mediaencryption__no_hu: 'Nem',
mediaencryption__auto_hu: 'Automatikus',
mediaencryption__srtp_hu: 'SRTP',
setqos__auto_hu: 'Automatikus',
setqos__no_hu: 'Nem',
setqos__yes_hu: 'Igen',
codecframecount_auto_hu: 'Automatikus',
doublesendrtp__no_hu: 'Nem',
doublesendrtp__yes_hu: 'Igen',
jittersize__no_hu: 'Nincs dzsitter',
jittersize__esmall_hu: 'Nagyon kicsi',
jittersize__small_hu: 'Kicsi',
jittersize__normal_hu: 'Normalis',
jittersize__big_hu: 'Nagy',
jittersize__ebig_hu: 'Nagyon nagy',
jittersize__max_hu: 'Óriási',
speakermode__auto_hu: 'Automatikus',
speakermode__never_hu: 'Soha',
speakermode__always_hu: 'Mindig',
autoignore__dont_hu: 'Ne mellőzd',
autoignore__silently_hu: 'Csendesen mellőzd',
autoignore__reject_hu: 'Elutasít',
transfwithreplace__auto_hu: 'Automatikus',
transfwithreplace__no_hu: 'Nem',
transfwithreplace__yes_hu: 'Igen',
transfertype__unattended_hu: 'Felügyeletlen dobás',
transfertype__withhold_hu: 'Felügyeletlen tartás',
transfertype__attanded_hu: 'Felügyelt (hívás először)',
automute__no_hu: 'Nem (alap)',
automute__incoming_hu: 'Bejövő hívásnál',
automute__outgoing_hu: 'Kimenő hívásnál',
automute__both_hu: 'Bejövő és kimenő hívásnál',
automute__other_line_hu: 'Más vonalon gomb nyomásra',
autohold__no_hu: 'Nem (alap)',
autohold__incoming_hu: 'Bejövő hívásnál',
autohold__outgoing_hu: 'Kimenő hívásnál',
autohold__both_hu: 'Bejövő és kimenő hívásnál',
autohold__other_line_hu: 'Más vonalon gomb nyomásra',
normalizenumber__no_hu: 'Nem',
normalizenumber__yes_hu: 'Igen',
savetocontacts__no_hu: 'Nem',
savetocontacts__ask_hu: 'Kérdez',
savetocontacts__yes_hu: 'Igen (nem fog kontakt nevet bekérni)',



/*--------- #language# pt Portuguese ---------*/

settings_title_pt: 'Ajustes',

username_pt: 'Usuário',
password_pt: 'Senha',

btn_login_pt: 'Login',
btn_close_pt: 'Fechar',
btn_cancel_pt: 'Cancelar',
btn_ok_pt: 'OK',
btn_upgrade_pt: 'Upgrade',
btn_save_pt: 'Salvar',
btn_send_pt: 'Enviar',
btn_revert_pt: 'Reverter',
btn_create_pt: 'Criar',
btn_audio_device_pt: 'Dispositivos de áudio',
btn_quickcall_pt: 'Ligar',
btn_accept_pt: 'Aceitar',
btn_reject_pt: 'Rejeitar',

myprovider_pt: 'Home',
myaccount_pt: 'Minha conta',
recharge_pt: 'Recarga de crédito',
newuser_pt: 'Novo usuário',
newuser_a_pt: 'Criar uma conta',
forgotpassword_a_pt: 'Esqueceu sua senha ?',
p2p_pt: 'Fone a Fone',
p2p_nra_pt: 'Seu número de telefone',
p2p_nrb_pt: 'Para quem você esta ligando',
p2p_err1_pt: 'Digite seu número',
p2p_err2_pt: 'Digite o número destino',
callback_pt: 'Callback',
callback_src_pt: 'Digite seu número de telefone móvel <br> (começando com o código do país)',

phone_nr_pt: 'Digite telefone..',
phone_nr2_pt: 'Número de telefone',
chat_nr_pt: 'Nome de usuário ou número de telefone',
ct_search_hint_pt: 'Buscar contatos',
initializing_pt: 'Iniciando..',
reset_settings_msg_pt: 'Tem certeza de que deseja redefinir as configurações?',
reset_settings_msg2_pt: 'Configurações foram redefinidas para os padrões',
aec_auto_pt: 'Auto',
aec_none_pt: 'Nenhum',
aec_software_pt: 'Software',
aec_native_pt: 'Nativo',
aec_fast_pt: 'Rápido',
aec_decrease_volume_pt: 'Diminuir o volume',
warning_pt: 'Atenção',
help_pt: 'Ajuda',
help_provider_pt: 'Encontrar um provedor voip',
logview_help_pt: 'Copiar o conteúdo da janela de registros e enviá-lo em um e-mail a:',
please_enter_pt: 'Por favor, insira',
loading_pt: 'Carregando..',
type_phone_pt: 'Chamar telefone',
type_home_pt: 'Chamar home',
type_mobile_pt: 'Chamar celular',
type_work_pt: 'Chamar trabalho',
type_other_pt: 'Chamar outro',
type_fax_home_pt: 'Fax home',
type_fax_work_pt: 'Fax trabalho',
type_pager_pt: 'Pager',
type_sip_pt: 'Chamada por URI',
phone_pt: 'Telefone',
home_pt: 'Home',
mobile_pt: 'Celular',
work_pt: 'Trabalho',
other_pt: 'De outros',
fax_home_pt: 'Fax home',
fax_work_pt: 'Fax trabalho',
pager_pt: 'Pager',
sip_pt: 'SIP URI',
send_msg_pt: 'Enviar mensagem',
contact_alert_title_pt: 'Escolha o tipo de telefone',
contact_name_pt: 'Nome',
contact_phone_pt: 'Digite telefone..',
contact_saved_pt: 'Contato salvo',
contact_save_error_pt: 'Erro, contato não salvo',
contact_no_nunber_pt: 'Introduza um número de telefone, nome de usuário ou URI',
no_contacts_1_pt: 'Para criar contatos, selecione "Novo Contato" no menu',
no_contacts_2_pt: 'Ou use a opção do menu "Sincronizar Contatos" para importar contatos do seu celular. <br /> (só funcionará depois que você carregar contatos do seu celular)',
sync_title_pt: 'Sincronizar contatos',
sync_message_pt: 'Sincronizar irá funcionar apenas depois de ter carregado contatos do seu celular',
no_history_pt: 'Histórico de chamadas vazio',
duration_pt: 'Duração da chamada:',
rating_minute_pt: ' \\ min',
clear_callhistory_pt: 'Limpar histórico de chamadas',
clear_callhistory_msg_pt: 'Tem certeza de que deseja limpar todo o histórico de chamadas?',
contact_delete_msg_pt: 'Tem certeza de que deseja excluir este contato?',
ch_outgoing_pt: 'Chamada de saída',
ch_incoming_pt: 'Chamada recebida',
ch_missed_pt: 'Chamada perdida',
ch_delete_pt: 'Excluir do histórico de chamadas',
in_hold_pt: '(Em espera)',
initiate_call_forward_pt: 'Iniciar encaminhamento de chamada',
initiate_call_transfer_pt: 'Iniciar transferência de chamada',
initiate_conference_pt: 'Iniciadar conferência',
send_dtmf_pt: 'Enviar DTMF',
unmuted_pt: 'Desligar mudo',
muted_pt: 'Mudo',
hold_released_pt: 'Liberar espera',
on_hold_pt: 'Em espera',
speaker_off_pt: 'Auto-falante on',
speaker_on_pt: 'Auto-falante off',
call_from_pt: 'Chamada Perdida',
calls_pt: 'Chamadas perdidas',
message_from_pt: 'Mensagem de',
messages_pt: 'Novas mensagens',
goto_pt: 'Ir para',
callhistory_pt: 'Histórico de chamadas',
messagehistory_pt: 'Mensagens',
sett_enabled_pt: 'Ativado',
sett_disabled_pt: 'Desativado',
hide_search_pt: 'Ocultar busca',
show_search_pt: 'Procurar em configurações',
settings_login_pt: 'Entrar',
ie_update_pt: 'Esta aplicação requer uma versão mais recente do Internet Explorer. Gostaria de baixar e atualizar?',
install_java_pt: 'Java é necessário: https://java.com/download/',
serviceengine_title_pt: 'Usar plugin do serviço',
serviceengine_msg_pt: 'Instalar plug-in de serviço para uma melhor experiência',
np_download_pt: 'Serviço de download de plug-in',
np_popup_title_pt: 'Plugin de serviço',
np_popup_msg_pt: 'É necessário instalar o plug-in de serviço para que o softphone possa funcionar',
choose_engine_title_pt: 'Escolha do motor',
choose_engine_title_single_engine_pt: 'Clique para baixar / instalar',
nativeplugin_pt: 'Plugin de serviço',
native_call_pt: 'Iniciando chamada nativa ...',
ce_enablejava_pt: '<a href="https://java.com/en/download/help/enable_browser.xml" target="_blank"> ativar o Java em seu navegador definindo </a>',
ce_install_java_pt: 'Ou se você não tem java instalado, instale clicando <a href="https://java.com/download/" target="_blank">aqui.</a>',
ce_installnativeplugin_pt: 'Instalar [NATIVE_PLUGIN] para a melhor experiência',
ce_usewebrtc_pt: 'Usar WebRTC',
ce_webrtcnot_pt: '(Não recomendado)',
ce_browser_install_pt: 'Instalar',
ce_browser_alternate_pt: 'Alternar navegador',
ce_native_ios_pt: 'iOS não suporta VoIP no browser',
ce_native_ios2_pt: 'Por favor, use aplicativo nativo',
ce_native_android_pt: 'Use aplicativo nativo',
ce_use_pt: 'selecionado. Basta logar',
np_install_title_pt: 'Plugin de serviço',
np_install_msg_pt: 'Faça o download do plug-in serviço e instale. <br /> Clique em OK depois de pronto ou Cancelar para abortar',
np_successfully_installed_pt: 'Plugin de serviço instalado com sucesso',
java_install_title_pt: 'Baixe e instale Java',
java_install_pt: 'Clique em OK para iniciar o download Java. <br> Entrar novamente depois de ter terminado a instalar',
sync_contacts_started_pt: 'Sincronizando contatos ...',
sync_succeded_pt: 'Sincronização bem sucedida',
sync_failed_pt: 'Sincronização falhou',
sync_msg_pt: 'Ou Sincronizar contatos de seus dispositivos móveis:',
ce_dontask_pt: 'Não perguntar novamente',

//OPSSTART
autoprov_loading_pt: 'Recuperando configuração ...',
autoprov_restart_pt: 'Aplicando configuração ...',
//OPSEND
hint_menu_pt: 'Menu',
hint_voicemail_pt: 'Voicemail',
hint_quickcall_pt: 'Chamada rápida',
hint_message_pt: 'Mensagem',
hint_addphone_pt: 'Adicionar telefone',
hint_removephone_pt: 'Retirar telefone',
hint_choosect_pt: 'Escolha contato',
hint_sendmsg_pt: 'Enviar mensagem',
hint_conference_pt: 'Adicionar à conferência',
hint_transfer_pt: 'Transferência de chamadas',
hint_dialpad_dtmf_pt: 'Enviar DTMF',
hint_mute_pt: 'Mudo / Com som',
hint_hold_pt: 'Reter / Recarregar',
hint_speaker_pt: 'Speaker On / Off',
hint_dialpad_pt: 'Dialpad',
hint_contacts_pt: 'Contatos',
hint_callhistory_pt: 'Histórico de chamadas',
hint_status_pt: 'Eventos e status de mensagens',
hint_curr_user_pt: 'Nome de usuário da conta',
hint_phone_number_pt: 'Digite aqui o número de telefone, nome de usuário ou URI',
hint_btn_call_pt: 'iniciar chamada',
hint_btnback_pt: 'Voltar para a página anterior',
hint_numpad_pt: 'Números / Dialpad',
hint_recents_pt: 'Ações',
hint_encicon_pt: 'Criptografado',
 
transfer_title_pt: 'Transferência de chamadas',
forward_title_pt: 'Encaminhamento de chamadas',
conference_title_pt: 'Adicionar à conferência',
 
status_not_registered_pt: 'Não registrado',
pick_ct_pt: 'Escolha contato',
chat_sms_title_pt: 'Chat ou SMS',
chdetails_title_pt: 'Informações',
chdetails_btnback_txt_pt: 'Histórico de chamadas',
ctdetails_title_pt: 'Contato',
ctdetails_btnback_txt_pt: 'Todos os contatos',
msg_title_chat_pt: 'IM - Chat',
msg_title_sms_pt: 'SMS',
dialpad_title_pt: 'Ligar',
msglist_title_pt: 'Mensagens',
ctlist_title_pt: 'Contactos',
chlist_title_pt: 'Histórico de chamadas',
addeditct_title_new_pt: 'Novo contato',
addeditct_title_edit_pt: 'Editar Contato',
logview_title_pt: 'Logs',
newuser_title_pt: 'Novo usuário',
voicemail_title_pt: 'Voicemail',
voicemail_msg_pt: 'Digite seu número de correio de voz',
quickcall_title_pt: 'Chamada rápida',
quickcall_msg_pt: 'Introduza o número de telefone desejado',
go_back_btn_txt_pt: 'Voltar',
chat_pt: 'IM - Chat',
sms_pt: 'SMS',
delete_text_pt: 'Excluir',
delete_all_msg_alert_pt: 'Todas as mensagens serão eliminadas',
delete_msg_alert_pt: 'Toda a discussão será excluída',
btn_new_message_pt: 'Nova mensagem',
message_sent_pt: 'Mensagem enviada',
me_pt: 'Eu',
sendtosupport_pt: 'Enviar ao suporte',
support_email_body_pt: 'Copiar e colar aqui o conteúdo da janela de log:',
support_selectall_pt: 'Selecionar tudo',
nu_username_pt: 'Nome de usuário',
nu_password_pt: 'Senha',
nu_email_pt: 'Endereço de e-mail',
nu_fullname_pt: 'Nome completo',
nu_phone_pt: 'Telefone',
nu_address_pt: 'Endereço',
nu_country_pt: 'País',
nu_birthday_pt: 'Aniversário',
nu_gender_pt: 'Sexo',
nu_fpq_pt: 'Pergunta de esqueceu a senha',
nu_fpa_pt: 'Resposta de esqueceu a senha',
presence_stat_online_pt: 'Conectados',
presence_stat_away_pt: 'Afastado',
presence_stat_dnd_pt: 'Não perturbe',
presence_stat_invisible_pt: 'Invisível',
presence_stat_offline_pt: 'Off-line',
connection_title_pt: 'Problema de conexão',
connection_msg_pt: 'Parece que você não está conectado a uma rede ou à Internet <br> Por favor, verifique sua conexão',
 
menu_sync_pt: 'Sincronizar contatos',
menu_volumehide_pt: 'Controles de volume ocultar',
menu_volumeshow_pt: 'Controles de volume',
menu_audiodevicehide_pt: 'Esconder dispositivo de áudio',
menu_audiodeviceshow_pt: 'Dispositivo de áudio',
menu_conference_pt: 'Conferência',
menu_transfer_pt: 'Transferir',
menu_numpad_pt: 'Números',
menu_mute_pt: 'Mudo',
menu_hold_pt: 'Aguarde',
menu_speaker_pt: 'Alto falante',
menu_call_pt: 'Ligar',
menu_message_pt: 'Mensagem',
menu_new_contact_pt: 'Novo contato',
menu_editcontact_pt: 'Editar Contato',
menu_createcontact_pt: 'Guardar contacto',
menu_deletecontact_pt: 'Excluir contato',
menu_exit_pt: 'Saída',
menu_callpark_pt: 'Estacionamento de chamadas',
menu_lastcalldetails_pt: 'Detalhes da última chamada',
menu_call_access_pt: 'Número de acesso de chamada',
menu_switchtoadvanced_pt: 'Mostrar configurações avançadas',
menu_switchtobasic_pt: 'Mostrar configurações básicas',
menu_showsettings_pt: 'Configurações',
menu_close_pt: 'Fechar',
menu_help_pt: 'Ajuda',
help_help_pt: 'Guia Ajuda',
help_rate_pt: 'Avalie o softphone',
help_loging_pt: 'Logs (trace)',
help_proversion_pt: 'Licença',
help_about_pt: 'Sobre',
help_report_pt: 'Reportar um problema',
help_license_pt: 'Termos de licença',
help_startlog_pt: 'Começar a recolher os logs',
help_sendlog_pt: 'Ver registos / Enviar ao suporte',
help_stoplog_pt: 'Parar a coleta de registos',
about_license_pt: 'Termos de licença',
 
btn_activate_pt: 'Ativar',
license_key_pt: 'Chave de licença',
enter_license_key_pt: 'Inserir chave de licença',
sett_chooseengine_title_pt: 'Mecanismo de VoIP',
sett_chooseengine_popup_title_pt: 'Mecanismos disponíveis',
sett_chooseengine_comment_pt: 'Selecione mecanismo VoIP',
sett_ce_highly_pt: 'altamente recomendado',
sett_ce_recommended_pt: 'recomendado',
about_homepage_pt: 'Homepage',
about_copyright_pt: 'Direitos autorais',
about_copyright2_pt: 'Todos os direitos reservados',
hint_page_pt: 'Página selecionada atual',
username_warning_pt: 'Por favor, primeiro indique nome de usuário',
hint_notif_clear_pt: 'Desmarque esta notificação',
not_missed_call_pt: 'Chamada perdida de',
not_missed_chat_pt: 'Bate-papo perdido de',
not_panel_title_pt: 'Notificações',
help_enablelog_pt: 'Ativar registros',
help_logwindow_pt: 'Logs',
disable_logs_pt: 'Desativar logs',
activated_pt: 'Licença pro ativada',
about_support_pt: 'Suporte',
warning_feature_pt: 'Você precisa obter uma licença Pro para ativar esse recurso. <br /> Para ativar licença, faça o login e em seguida, selecione "Licença" no menu',
allowmedia_title_pt: 'Acesso à mídia',
allowmedia_chrome_pt: 'precisa de acesso ao seu microfone. <br /> Para conceder acesso, clique no ícone "som" no canto superior direito do navegador e selecione "permitir", em seguida, refazer a chamada',
allowmedia_firefox_pt: 'precisa de acesso ao seu microfone. <br /> Para conceder acesso, clique no ícone "microfone" no centro-top navegador e selecione "permitir", em seguida, refazer a chamada',
allowmedia_general_pt: 'precisa de acesso ao seu microfone. <br /> Depois de concedido o acesso, refazer a chamada',
filetransf_title_pt: 'Enviar arquivo',
filetransfer_nr_pt: 'SIP URI ou nome de usuário',
hint_filetranf_pt: 'Enviar arquivo',
filetransf_err_pt: 'Indique destino em primeiro lugar',
fitransf_failed_pt: 'Enviar falhou!',
fitransf_succeded_pt: 'Enviada com sucesso',
fitransf_chat_pt: 'enviou-lhe um arquivo',
chrome_local_alert_pt: 'O Webphone não trabalha em sistema de arquivos local no Google Chrome ou navegadores Opera.\n Você deve implantá-lo em um servidor web.\n\n Você pode usar o Firefox ou IE, se você quiser experimentá-lo a partir de sistema de arquivos local',
chrome_local_webrtc_audio_pt: 'O WebRTC não tem permissão para acessar dispositivos de áudio a partir do sistema de arquivos local em navegadores Chrome e Opera.\n O webphone deve ser hospedado em um servidor web seguro (HTTPS) para ser capaz de fazer / receber chamadas usando WebRTC',
//chrome_https_pt: 'Recomenda-se instalar o webphone em HTTPS para permitir WebRTC no Chrome / Opera',
//chrome_https_pt: 'Para Chrome e Opera recomendamos para hospedar o webphone em http segura (https), caso contrário, o proxy https foneflex pode ser usado',
chrome_https_pt: 'Para Chrome e Opera recomendamos para hospedar o webphone em http segura (https), caso contrário WebRTC não vai funcionar',
webrtc_local_sipserver_pt: 'Servidor WebRTC local necessário!',
//chrome_https_reload_pt: 'Para Chrome e Opera recomendamos hospedar o webphone em http segura (https)',
chrome_https_reload_pt: 'Para Chrome e Opera o WebRTC só vai trabalhar a partir de http seguro (https).\n\n Clique em OK para recarregar a página usando foneflex https proxy',
all_demo_msg_pt: '(Estas mensagens são exibidas apenas na versão demo, na versão final estas situações são manipuladas automaticamente)',
 
save_to_contacts_title_pt: 'Salvar em contatos',
save_to_contacts_msg_pt: 'Você quer salvar este número como um contato?',
btn_save_to_contacts_1_pt: 'Sim, criar novo contato',
btn_save_to_contacts_2_pt: 'Sim, adicionar a contato existente',
btn_save_to_contacts_dontask_pt: 'Não perguntar novamente',
audio_title_pt: 'Configurações de áudio',
audio_mic_pt: 'Microfone',
audio_rec_pt: 'Alto falante',
audio_ring_pt: 'Toque',
audio_aec_pt: 'AEC',
audio_agc_pt: 'AGC',
audio_all_devices_pt: 'Todos',
filters_title_pt: 'Regras',
filters_add_label_pt: 'Adicionar regras',
filters_add_rule_pt: 'Adicionar regra',
filter_start_pt: 'Quando o número começa com',
filter_replace_pt: 'Substituir com',
filter_minlen_pt: 'Comprimento mínimo',
filter_maxlen_pt: 'Comprimento máximo',
filter_warning_pt: 'Ao menos um dos campos "Comece com" ou "Substituir por" deve ser inserido',
filter_delete_hint_pt: 'Excluir regra',
filter_edit_hint_pt: 'Editar regra',
menu_block_contact_pt: 'Bloquear contato',
menu_unblock_contact_pt: 'Desbloquear contato',
addeditct_label_email_pt: 'E-mail',
addeditct_label_address_pt: 'Endereço',
addeditct_label_notes_pt: 'Notas',
addeditct_label_website_pt: 'Website',
addeditct_addfield_pt: 'Adicionar campo',
addeditct_hint_adddetails_pt: 'Adicionar campo adicional',
ftrnasf_status_processing_pt: 'Em processamento...',
ftrnasf_status_waiting_pt: 'Esperando pares ...',
ftrnasf_status_delivered_pt: 'Entregue',
ns_engine_unreachable_pt: 'Motor inacessível',
menu_reconnect_pt: 'Reconectar',
menu_copy_pt: 'Cópia',
menu_paste_pt: 'Colar',
menu_showlogs_pt: 'Mostrar logs',
menu_clearsettings_pt: 'Definições claras',
java_freeze_ff_pt: 'Depois de aceitar para "executar esta aplicação",\n Clique em OK para continuar',
hint_hangup_pt: 'Desligar chamada',
hint_accept_pt: 'Aceitar chamada',
hint_reject_pt: 'rejeitar chamada',
hint_called_pt: 'Chamador / parte chamada',
hint_callstatus_pt: 'Chamada mensagens de status e eventos',
hint_callduration_pt: 'Duração da chamada',
hint_more_pt: 'Mais',
ce_ask_user_pt: 'Parece que [SELECTEDENGINE] motor não está funcionando. Devemos tentar [RECOMMENDED] motor?',
ce_alert_title_pt: 'Instalar',
ce_alert_user_pt: 'Deve ser instalado para [BRAND] para funcionar corretamente',
favafone_new_pt: 'Eu sou novo para FoneFlex',
newuser_pleaseenter_pt: 'Por favor, insira',
newuser_invalid_pt: 'Inválido',
hint_callforward_pt: 'Reencaminhamento de chamadas',
initiate_callforward_pt: 'Iniciar encaminhamento de chamada',
callforward_title_pt: 'Reencaminhamento de chamadas',
menu_callforward_pt: 'Reencaminhamento de chamadas',
recharge_msg_pt: 'Cartão de recarga (código PIN)',
recharge_error_pt: 'Digite o seu código PIN de recarga',
username_err_pt: 'O nome de usuário contém caracteres especiais, por favor reescreva',
password_err_pt: 'A senha contém caracteres especiais, por favor reescreva',
menu_webcallme_pt: 'Meu Click2Call URL',
menu_confrooms_pt: 'Conferência',
menu_callpickup_pt: 'Captura de chamada',
webcallme_msg_pt: 'Enviar este link para seus amigos e eles serão capazes de chamá-lo com um simples clique',
cb_callonmobile_pt: 'Atendimento móvel',
cb_callonnative_pt: 'Chamada VoIP',
confroom_msg1_pt: 'Seu número de sala de conferência é',
confroom_msg2_pt: 'Adicione pessoas à conferência',
confroom_inv_title_pt: 'Convidar para conferência',
confroom_inv_msg_pt: 'Você está convidado para conferência chamada',
service_update_pt: 'Uma nova versão do NS -Serviço Plugin está disponível. É altamente recomendável atualizar para a versão mais recente',
video_call_pt: 'Chamada de vídeo',
video_call_msg_pt: 'Chamada de vídeo',
btn_videocall_pt: 'Chamada de vídeo',
menu_ignore_pt: 'Ignorar',
hint_smiley_pt: 'Risonho',
menu_groupchat_pt: 'Adicionar pessoas (chat em grupo)',
status_startingengine_pt: 'Iniciando..',
usenative_title_pt: 'Use aplicativo nativo',
usenative_option_native_pt: 'Recomendado: discador nativo com melhor qualidade',
usenative_option_webrtc_pt: 'Ignorar e começar (WebRTC) no navegador web agora',
menu_ct_setfavorite_pt: 'Definir como favorito',
menu_ct_unsetfavorite_pt: 'Retirar dos favoritos',
menu_videorecall_pt: 'Rechamada de vídeo',
switch_engine_pt: 'Trocar aplicação',
gc_message_pt: 'Você está em um chat em grupo com',
gc_message2_pt: 'Entrou na conversa',
username_warning2_pt: 'Comprimento nome de usuário mínima é de 3',
password_warning2_pt: 'Comprimento mínimo de senha é 3',
composing_pt: 'Está digitando',
logview_msg_pt: 'A página pode não estar disponível para alguns segundos. Recarregar a página se não acontecer nada',
messagepl_pt: 'Compor',
unlockadvancedsett_title_pt: 'Desbloquear configurações',
unlockadvancedsett_msg_pt: 'Digite a senha para desbloquear as configurações avançadas',
warning_notreg_pt: 'Não pode iniciar a chamada porque ainda não está registrado',
warning_notstarted_pt: 'Não pode iniciar a chamada porque ainda não está registrado',
 
warning_msg_1_pt: 'Somente chamadas diretas para URIs serão possíveis se o endereço VoIP Server não estiver definido',
warning_msg_2_pt: 'IP ou nome de domínio não é aceito nesta versão. Inserir o nome do servidor ou ID aqui',
warning_msg_3_pt: 'Por favor, indique o nome do contato',
warning_msg_4_pt: 'Falha em recuperar configurações.<br /><br />Na entrada página Configurações do Servidor, insira seu nome de domínio VoIP ou o endereço IP',
err_msg_1_pt: 'Nome de usuário inválido',
err_msg_2_pt: 'Senha inválida',
err_msg_3_pt: 'ERRO, digite um número de telefone ou SIP URI ou nome de usuário',
err_msg_4_pt: 'Número de telefone inválido ou SIP URI ou nome de usuário',
err_msg_5_pt: 'Número de telefone inválido',
err_msg_6_pt: 'Endereço inválido',
err_msg_7_pt: 'Não há mensagens para apagar',
 
err_msg_8_pt: 'Digite um nome de usuário',
err_msg_9_pt: 'Insira uma senha',
err_msg_10_pt: 'Insira o seu endereço de e-mail',
err_msg_11_pt: 'Escreva seu nome completo',
err_msg_12_pt: 'Endereço de email invalido',
err_msg_13_pt: 'Comprimento de usuário deve ser de pelo menos',
err_msg_14_pt: 'Nome de usuário inválido',
err_msg_15_pt: 'Comprimento de senha deve ser pelo menos',
err_msg_16_pt: 'Senha inválida',
err_msg_17_pt: 'Comprimento de nome total deve ser de pelo menos',
err_msg_18_pt: 'Nome inválido',
err_msg_19_pt: 'Número de telefone inválido',
err_msg_20_pt: 'Endereço inválido',
err_msg_21_pt: 'Digite seu número de telefone',
err_msg_22_pt: 'Não é possível recuperar a configuração. Tente mais tarde',
 
err_nocallinprogress_pt: 'Nenhuma chamada em curso',
err_flash_local_pt: 'Aplicação de flash irá funcionar somente se lançado a partir de um servidor web, não do sistema de arquivos local',
 
srvaddr_help_pt: 'Endereço VoIP prestador de serviço do servidor (endereço IP ou nome de domínio ou SRV DNS registro). Você também pode adicionar um sufixo um número de porta se o servidor não está na porta SIP padrão (5060). Exemplo: seudominio.com:6000 <br /><br /> No caso, se você é novo para VoIP: <br /> Ao contrário de alguns outros softwares populares como o Skype, se você estiver usando o protocolo SIP padrão que você pode usar qualquer provedor VoIP . Existem centenas de tal tipo de serviços e você também pode configurar o seu próprio servidor, por exemplo, utilizando servidor Asterisk. <br /> Interno (softphone para softphone) chamadas são geralmente livres e os custos de chamadas de saída (chamadas para celular ou telefone fixo) são geralmente mais baratos do que para os fornecedores tradicionais, especialmente as chamadas internacionais. <br /> Há também uma série de outros benefícios no uso de VoIP padrão, tais como alta qualidade de chamada (com wideband codec), a liberdade (você pode mudar o seu provedor de qualquer momento), controle (você pode facilmente gerenciar sua conta) e flexibilidade (lotes de serviços extras, como gravação de chamadas, conferência e outros). Você ainda pode usar múltiplos fornecedores (por exemplo, você pode usar sempre o mais barato para as suas metas de chamada). <br /> Se você não tem uma conta VoIP ainda, então você pode criar um dentro de alguns minutos a qualquer provedor',
 
chatsms__auto_guess_or_ask_pt: 'Auto adivinhar ou pedir',
chatsms__sms_only_pt: 'Apenas SMS',
chatsms__chat_only_pt: 'Apenas Bate-papo',
defmute__both_pt: 'Ambos',
defmute__speakers_only_pt: 'Apenas os falantes',
defmute__mic_only_pt: 'Apenas Mic',
video__auto_pt: 'Auto',
video__disable_pt: 'Desabilitar',
video__enable_pt: 'Habilitar',
video__force_pt: 'Forçar',
agc__disabled_pt: 'Desativado',
agc__for_redcording_pt: 'Para gravar apenas',
agc__both_for_recording_and_playback_pt: 'Tanto para reprodução e gravação',
agc__guess_pt: 'Adivinhar',
use_fast_ice__no_pt: 'Não (definido como 0 somente se o servidor precisar sempre via os meios de comunicação)',
use_fast_ice__auto_pt: 'Auto',
use_fast_ice__yes_pt: 'Sim',
use_fast_ice__always_pt: 'Sempre (não recomendado)',
use_stun__force_pt: 'Forçar IP privado',
use_stun__no_pt: 'Não',
use_stun__stable_nat_pt: 'Com NAT estável única',
use_stun__all_symetric_pt: 'Em toda NAT simétrico',
use_stun__always_pt: 'Sempre',
use_stun__public_ip_pt: 'Use mesmo em IP público',
use_rport__no_pt: 'Não',
use_rport__simmetric_nat_pt: 'Em nat simmetrica',
use_rport__always_pt: 'Sempre',
use_rport__public_ip_pt: 'Mesmo em IP público',
use_rport__request_pt: 'Pedidir, mas NÃO usar',
register__no_pt: 'Não',
register__auto_pt: 'Suposição auto',
register__yes_pt: 'Sim',
changesptoring__nothing_pt: 'Fazer nada',
changesptoring__disp_ringing_pt: 'Exibição do status de toque',
changesptoring__start_media_pt: 'Comece mídia',
changesptoring__start_media_disp_pt: 'Comece mídia e tela de toque',
playring__no_pt: 'Não',
playring__incoming_pt: 'Para chamadas entrantes',
playring__both_pt: 'Para chamadas entrantes e saída',
setfinalcodec__never_pt: 'Nunca',
setfinalcodec__auto_pt: 'Auto',
setfinalcodec__multiple_codec_pt: 'Em codec múltiplos',
setfinalcodec__always_pt: 'Sempre',
denoise__disabled_pt: 'Desativado',
denoise__recording_pt: 'Para gravar apenas',
denoise__both_pt: 'Tanto para reprodução e gravação',
denoise__auto_pt: 'Suposição auto',
plc__no_pt: 'Não',
plc__auto_pt: 'Automático',
plc__yes_pt: 'Sim',
silencesupress__auto_pt: 'Auto',
silencesupress__no_pt: 'Não',
silencesupress__yes_pt: 'Sim',
hardwaremedia__auto_pt: 'Auto',
hardwaremedia__no_pt: 'Não',
hardwaremedia__yes_pt: 'Sim',
mediaencryption__no_pt: 'Não',
mediaencryption__auto_pt: 'Auto',
mediaencryption__srtp_pt: 'SRTP',
setqos__auto_pt: 'Auto',
setqos__no_pt: 'Não',
setqos__yes_pt: 'Sim',
codecframecount_auto_pt: 'Auto',
doublesendrtp__no_pt: 'Não',
doublesendrtp__yes_pt: 'Sim',
jittersize__no_pt: 'Não jitter',
jittersize__esmall_pt: 'Muito pequeno',
jittersize__small_pt: 'Pequeno',
jittersize__normal_pt: 'Normal',
jittersize__big_pt: 'Grande',
jittersize__ebig_pt: 'Extra grande',
jittersize__max_pt: 'Max',
speakermode__auto_pt: 'Auto',
speakermode__never_pt: 'Nunca',
speakermode__always_pt: 'Sempre',
autoignore__dont_pt: 'NÃO FAZER ignorar',
autoignore__silently_pt: 'Silenciosamente ignorar',
autoignore__reject_pt: 'Rejeitar',
transfwithreplace__auto_pt: 'Auto',
transfwithreplace__no_pt: 'Não',
transfwithreplace__yes_pt: 'Sim',
transfertype__unattended_pt: 'Cancelar sem atender',
transfertype__withhold_pt: 'Automático com retenção',
transfertype__attanded_pt: 'Atendida (primeira chamada)',
automute__no_pt: 'Não (padrão)',
automute__incoming_pt: 'Na chamada',
automute__outgoing_pt: 'Na chamada de saída',
automute__both_pt: 'Em chamadas de entrada e de saída',
automute__other_line_pt: 'Por outro botão de linha clique',
autohold__no_pt: 'Não (padrão)',
autohold__incoming_pt: 'Na chamada',
autohold__outgoing_pt: 'Na chamada de saída',
autohold__both_pt: 'Em chamadas de entrada e de saída',
autohold__other_line_pt: 'Por outro botão de linha clique',
normalizenumber__no_pt: 'Não',
normalizenumber__yes_pt: 'Sim',
savetocontacts__no_pt: 'Não',
savetocontacts__ask_pt: 'Perguntar',
savetocontacts__yes_pt: 'Sim (não vai pedir um nome de contato)',

status_enginestarted_pt: 'Motor de VoIP iniciado',
 
sett_display_name_serveraddress_user_pt: 'Servidor',
sett_comment_serveraddress_user_pt: 'Digite endereço do servidor (domínio ou IP: port)',
sett_comment_serveraddress_user_gmsdialer_pt: 'Digite o código de operador',
sett_comment_short_serveraddress_user_pt: '',
sett_comment_serveraddress_user_operator_pt: 'Digite o código de operador',
 
sett_display_name_sipusername_pt: 'Nome de usuário',
sett_comment_sipusername_pt: 'Seu nome de usuário SIP usado para autenticação',
sett_comment_short_sipusername_pt: 'Nome de usuário VoIP',
 
sett_display_name_password_pt: 'Senha',
sett_comment_password_pt: 'Digite a senha para a sua conta SIP',
sett_comment_short_password_pt: 'Senha da conta VoIP',
 
sett_display_name_startwithos_pt: 'Começar com o Windows',
sett_comment_startwithos_pt: 'Começar quando o Windows inicia',
sett_comment_short_startwithos_pt: '',
 
sett_display_name_startonboot_pt: 'Executado em segundo plano',
sett_comment_startonboot_pt: 'Sempre ouvir para receber chamadas (serviço será executado no backround para permitir chamadas recebidas)',
sett_comment_short_startonboot_pt: '',
 
sett_display_name_codec_pt: 'Codecs de áudio',
sett_comment_codec_pt: 'Escolha codecs preferido',
sett_checkbox_codec_pt: 'Use codecs Só preferidos',
sett_comment_short_codec_pt: '',
 
sett_display_name_dtmfmode_pt: 'DTMF',
sett_comment_dtmfmode_pt: 'Escolha DTMF (discagem por tom) enviar método',
sett_comment_short_dtmfmode_pt: '',
 
sett_display_name_register_pt: 'Register',
sett_comment_register_pt: 'Registre-se para domínio. Este é sempre necessária para receber chamadas e alguns provedores exigem também para permitir chamadas de saída',
sett_comment_short_register_pt: 'Habilitar o registro / desativar a SIP domínio',
 
sett_display_name_registerinterval_pt: 'Intervalo de registro',
sett_comment_registerinterval_pt: '(Re) Registar intervalo de tempo em segundos',
sett_comment_short_registerinterval_pt: '',
 
sett_display_name_filters_pt: 'Reescrita número',
sett_comment_filters_pt: 'Adicionar regras de reescrita número do destino (adicionar / remover / reescrever prefixo)',
sett_comment_short_filters_pt: '',
 
sett_display_name_earlymedia_pt: 'Enviar media início',
sett_comment_earlymedia_pt: 'Iniciar para enviar a mídia quando o progresso da sessão é recebido',
sett_comment_short_earlymedia_pt: '',
 
sett_display_name_transfertype_pt: 'Tipo de transferência',
sett_comment_transfertype_pt: 'Escolha forma de transferência de chamadas',
sett_comment_short_transfertype_pt: '',
 
sett_display_name_playring_pt: 'Ringback para',
sett_comment_playring_pt: 'Gerar toque para chamadas recebidas e efectuadas',
sett_comment_short_playring_pt: '',
 
//sett_display_name_autoanswer_forward_pt: 'Resposta automática, para a frente ou ignorar',
//sett_comment_autoanswer_forward_pt: 'Tratar automaticamente todas as chamadas recebidas',
//sett_comment_short_autoanswer_forward_pt: '',
 
sett_display_name_proxyaddress_pt: 'Endereço de proxy',
sett_comment_proxyaddress_pt: 'Endereço de proxy SIP de saída. Deixe em branco se você não tem um proxy / outbound',
sett_comment_short_proxyaddress_pt: 'Endereço de proxy de saída',
 
sett_display_name_realm_pt: 'Domínio',
sett_comment_realm_pt: 'Definir o domínio SIP se não for o mesmo com o server address ou domínio',
sett_comment_short_realm_pt: '',
 
sett_display_name_voicemailnum_pt: 'Voicemail',
sett_comment_voicemailnum_pt: 'Definir o número de correio de voz que será usado se não for recebido automaticamente',
sett_comment_short_voicemailnum_pt: 'Definir número de acesso do correio de voz',
 
sett_display_name_use_stun_pt: 'Use STUN',
sett_comment_use_stun_pt: 'Mudar se você tem problemas relacionados NAT (registo, chamada, não há problemas de voz)',
sett_comment_short_use_stun_pt: 'Habilitar a descoberta endereço externo',
 
sett_display_name_use_fast_ice_pt: 'Use ICE',
sett_comment_use_fast_ice_pt: 'Negociações rápido no ICE (para roteamento p2p RTP) <br />. Nota: Se definido para "Auto" ou "Sim", então STUN não deve ser desativado',
sett_comment_short_use_fast_ice_pt: '',
 
sett_display_name_techprefix_pt: 'Tech. prefixo',
sett_comment_techprefix_pt: 'Adicionar qualquer prefixo para todos os números chamados',
sett_comment_short_techprefix_pt: '',
 
sett_display_name_volumein_pt: 'Volume in',
sett_comment_volumein_pt: 'Definir o volume do microfone padrão entre 0 e 100%. 50% significa que não há mudanças de volume',
sett_comment_short_volumein_pt: '',
 
sett_display_name_volumeout_pt: 'Volume out',
sett_comment_volumeout_pt: 'Definir o volume do alto-falante padrão entre 0 e 100%. 50% significa que não há mudanças de volume',
sett_comment_short_volumeout_pt: '',
 
sett_display_name_prack_pt: 'Use PRACK',
sett_comment_prack_pt: 'Apoio 100% só deve ser ativado se o servidor precisar deste',
sett_comment_short_prack_pt: '',
 
sett_display_name_ringtimeout_pt: 'Tempo limite de ring',
sett_comment_ringtimeout_pt: 'O tempo máximo permitido a tocar em segundos. O padrão é 90 segundos',
sett_comment_short_ringtimeout_pt: '',
 
sett_display_name_calltimeout_pt: 'Tempo de espera de chamada',
sett_comment_calltimeout_pt: 'O tempo máximo permitido discurso em segundos. O padrão é 10800 segundos, o que significa 3 horas',
sett_comment_short_calltimeout_pt: '',
 
sett_display_name_username_pt: 'Caller ID',
sett_comment_username_pt: 'Isto não irá ser utilizado para a autenticação. Especificar se não for o mesmo com o usuário para configuração de autenticação. Alguns servidores VoIP irão rejeitar se não for o mesmo com o nome de usuário!',
sett_comment_short_username_pt: 'Você pode definir um nome de usuário diferente aqui usado para uma exibição de número',
 
sett_display_name_displayname_pt: 'Mostrar nome',
sett_comment_displayname_pt: 'Especificar nome de exibição. Esta é uma configuração opcional e deve ser o seu nome completo',
sett_comment_short_displayname_pt: 'Definir nome de exibição',
 
sett_display_name_theme_pt: 'Tema',
sett_comment_theme_pt: 'Alterar cores de tema',
sett_comment_short_theme_pt: '',
 
sett_display_name_hidemyidentity_pt: 'Esconder minha identidade',
sett_comment_hidemyidentity_pt: 'Esconder minha identidade',
sett_comment_short_hidemyidentity_pt: '',
 
sett_display_name_localip_pt: 'Endereço IP local',
sett_comment_localip_pt: 'Opcionalmente especificar o endereço IP de sinalização local para usar',
sett_comment_short_localip_pt: '',
 
sett_display_name_signalingport_pt: 'Porta de sinalização local',
sett_comment_signalingport_pt: 'Especifique o endereço IP local porta de sinalização de usar (o padrão é uma porta estável inicializado com um valor aleatório. Isso não tem nada a ver com a porta SIP servidor que é geralmente 5060)',
sett_comment_short_signalingport_pt: 'Opcionalmente especificar a porta de sinalização local para usar',
 
sett_display_name_rtpport_pt: 'Porta RTP local',
sett_comment_rtpport_pt: 'Especificar base local porto RTP (o padrão é uma base porta estável inicializado com um valor aleatório)',
sett_comment_short_rtpport_pt: 'Especificar base local porto RTP',
 
sett_display_name_jittersize_pt: 'O tamanho do jitter',
sett_comment_jittersize_pt: 'O buffer de jitter é usado para reprodução suave sob largura de banda variável. O tamanho é calculado de forma dinâmica, mas o seu comportamento pode modificado com esta definição',
sett_comment_short_jittersize_pt: '',
 
sett_display_name_forcewifi_pt: 'Forçar WiFi',
sett_comment_forcewifi_pt: '(Re) Habilitar e digitalizar WiFi no arranque, nova chamada ou perda de conexão (Mesmo sem esta definição, Wi-Fi será a preferida quando disponível)',
sett_comment_short_forcewifi_pt: 'Mantenha o WiFi ativo para lidar com as chamadas recebidas',
 
// callforwardonbusy,callforwardalways,calltransferalways,autoignore,autoaccept
sett_display_name_callforwardonbusy_pt: 'Reencaminhamento de chamadas',
sett_comment_callforwardonbusy_pt: 'Definir número de encaminhamento de chamada usado quando a chamada é rejeitada quando estiver ocupado ou para auto frente',
sett_comment_short_callforwardonbusy_pt: '',
 
sett_display_name_callforwardalways_pt: 'Ligue para a frente sempre',
sett_comment_callforwardalways_pt: 'Defina Número de Chamada para a frente, onde todas as chamadas devem ser encaminhadas',
sett_comment_short_callforwardalways_pt: '',
 
sett_display_name_calltransferalways_pt: 'Transferência de chamadas',
sett_comment_calltransferalways_pt: 'Definir número de transferência de chamadas, onde todas as chamadas devem ser transferidas',
sett_comment_short_calltransferalways_pt: '',
 
sett_display_name_autoignore_pt: 'Auto ignorar',
sett_comment_autoignore_pt: 'Automtically ignorar todas as chamadas recebidas',
sett_comment_short_autoignore_pt: '',
 
sett_display_name_autoaccept_pt: 'Auto aceitar',
sett_comment_autoaccept_pt: 'Aceitar automaticamente todas as chamadas recebidas (atendimento automático)',
sett_comment_short_autoaccept_pt: '',
 
sett_display_name_callforwardonreject_pt: 'Chamada para a frente em rejeitar',
sett_comment_callforwardonreject_pt: 'reencaminhamento de chamadas em caso de rejeição',
sett_comment_short_callforwardonreject_pt: '',
 
sett_display_name_rejectonvoipbusy_pt: 'Em VoIP ocupado',
sett_comment_rejectonvoipbusy_pt: 'Definir o comportamento se já houver uma chamada VoIP em andamento',
sett_comment_short_rejectonvoipbusy_pt: '',
 
//OPSSTART
sett_display_name_usetunneling_pt: 'Tunneling e criptografia',
sett_comment_usetunneling_pt: 'Use camada de transporte criptografado e encapsulado (UDP, TCP ou HTTP)',
sett_comment_short_usetunneling_pt: 'Utilize os transportes criptografados alternativa',
sett_comment_usetunneling_1_pt: 'Útil em VoIP bloqueada países e por trás de firewalls. Se você precisa usar esse recurso para mais do que algumas chamadas, então você deve atualizar para Pro que inclui o serviço de tunelamento ilimitado',
sett_comment_usetunneling_2_pt: 'Use a sinalização e meios de comunicação dentro de túnel criptografado',
//OPSEND 

sett_display_name_encryptionport_pt: 'Porta de criptografia',
sett_comment_encryptionport_pt: 'Porta base do servidor usado para o transporte criptografado',
sett_comment_short_encryptionport_pt: '',
/* 
sett_display_name_loglevel_pt: 'Definir o nível de log / trace',
sett_comment_loglevel_pt: 'Definir log nível de detalhe quando os logs são habilitados',
sett_comment_short_loglevel_pt: '',
*/ 
sett_display_name_loglevel_pt: 'Ativar log',
sett_comment_loglevel_pt: 'Salve rastreamento para o arquivo para upload mais tarde para suporte técnico',
sett_comment_short_loglevel_pt: '',
 
sett_display_name_loglevel_dbg_pt: 'Definir o nível de log / trace',
sett_comment_loglevel_dbg_pt: 'Definir log nível de detalhe quando os logs são habilitados',
sett_comment_short_logleveldbg_pt: '',
 
sett_display_name_rejectonphonebusy_pt: 'No telefone ocupado',
sett_comment_rejectonphonebusy_pt: 'Definir o comportamento se já existe um telefonema nativa em andamento',
sett_comment_short_rejectonphonebusy_pt: '',
 
sett_display_name_proximitysensor_pt: 'Sensor de proximidade',
sett_comment_proximitysensor_pt: 'Desligar a tela enquanto na chamada. Este recurso é desativado por padrão porque a maioria dos dispositivos tem problemas quando é ligado',
sett_comment_short_proximitysensor_pt: 'Desligue a tela quando perto da orelha',

sett_display_name_aec_pt: 'AEC',
sett_comment_aec_pt: 'Cancelamento do Eco acústico. Ligue se os seus pares ouve o seu eco',
sett_comment_short_aec_pt: '',

sett_display_name_agc_pt: 'AGC',
sett_comment_agc_pt: 'Controle automático de ganho. Irá controlar o volume automaticamente',
sett_comment_short_agc_pt: '',

sett_display_name_denoise_pt: 'Ruído',
sett_comment_denoise_pt: 'Remova o ruído da conversa (como o ruído de fundo ou ruído gerado pelo microfone)',
sett_comment_short_denoise_pt: '',

sett_display_name_silencesupress_pt: 'Supressão de silêncio',
sett_comment_silencesupress_pt: 'Não transmita mídia quando você não fala. Ativar apenas se o seu se a sua largura de banda é realmente pobre',
sett_comment_short_silencesupress_pt: '',

sett_display_name_plc_pt: 'PLC',
sett_comment_plc_pt: 'Ocultação de perda de pacotes. Ajuda a melhorar a qualidade das chamadas em perda de pacotes que ocorre em redes de baixa qualidade',
sett_comment_short_plc_pt: '',

sett_display_name_callback_mode_pt: 'Modo de retorno de chamada',
sett_comment_callback_mode_pt: 'Escolheu quando usar callback se houver',
sett_comment_short_callback_mode_pt: '',

sett_display_name_email_pt: 'O e-mail',
sett_comment_email_pt: 'O seu endereço de e-mail (útil para qualquer suporte técnico)',
sett_comment_short_email_pt: 'Seu endereço de email',

sett_display_name_chatsms_pt: 'Chat / SMS',
sett_comment_chatsms_pt: 'Definir método de mensagens',
sett_comment_short_chatsms_pt: '',

sett_display_name_savetocontacts_pt: 'Novos contatos',
sett_comment_savetocontacts_pt: 'Se a (automaticamente) adicionar novos números chamados desconhecidos à lista de contatos',
sett_comment_short_savetocontacts_pt: 'Adicionar novos contatos à lista de contatos',

sett_display_name_call_access_pt: 'Número de acesso de chamada',
sett_comment_call_access_pt: 'Número de acesso IVR para ligar de rede do operador móvel',
sett_comment_short_call_access_pt: 'Número de acesso para ligar de rede do operador móvel',

sett_display_name_unlockphone_pt: 'Desbloquear a proteção de teclado',
sett_comment_unlockphone_pt: 'Desbloquear automaticamente a proteção de teclado de telefone em chamada',
sett_comment_short_unlockphone_pt: '',

sett_display_name_audiorecorder_pt: 'Gravador de áudio',
sett_comment_audiorecorder_pt: 'Selecione fluxo de gravador de áudio para chamadas. Deve ser alterada apenas em dispositivos especiais ou se tiver requisitos especiais ou a configuração automática não é o preferido',
sett_comment_short_audiorecorder_pt: '',

sett_display_name_audioplayer_pt: 'Leitor de áudio',
sett_comment_audioplayer_pt: 'Selecione fluxo de leitor de áudio para chamadas. Deve ser alterada apenas em dispositivos especiais ou se tiver requisitos especiais ou a configuração automática não é o preferido',
sett_comment_short_audioplayer_pt: '',

sett_display_name_speakerphoneplayer_pt: 'Speakerphone',
sett_comment_speakerphoneplayer_pt: 'Selecione Stream Player alto-falante de áudio. Deve ser alterada apenas em dispositivos especiais ou se tiver requisitos especiais ou a configuração automática não é o preferido',
sett_comment_short_speakerphoneplayer_pt: '',

sett_display_name_speakerphoneoutput_pt: 'Modo de áudio',
sett_comment_speakerphoneoutput_pt: 'Selecione o dispositivo de saída quando você alternar para viva-voz',
sett_comment_short_speakerphoneoutput_pt: '',

sett_display_name_keepalive_pt: 'Mantenha vivo',
sett_comment_keepalive_pt: 'Vou enviar um curto pacote no intervalo de tempo especificado (em segundos) para abrir e manter o seu dispositivo NAT (router) abriu, a fim de permitir que as chamadas recebidas e outras notificações',
sett_comment_short_keepalive_pt: 'Mantenha o seu NAT aberto',

sett_display_name_incomingcallalert_pt: 'Ringer',
sett_comment_incomingcallalert_pt: 'Selecione fluxo de leitor de áudio para o ring. Deve ser alterada apenas em dispositivos especiais ou se tiver requisitos especiais ou a configuração automática não é o preferido',
sett_comment_short_incomingcallalert_pt: '',

sett_display_name_mediaencryption_pt: 'Criptografia de mídia',
sett_comment_mediaencryption_pt: 'Definir Mídia método de criptografia',
sett_comment_short_mediaencryption_pt: '',

sett_display_name_setqos_pt: 'QoS',
sett_comment_setqos_pt: 'Classe de tráfego conjuntos ou octeto tipo de serviço no cabeçalho IP para pacotes UDP',
sett_comment_short_setqos_pt: '',

sett_display_name_codecframecount_pt: 'RTP Frame / Packet',
sett_comment_codecframecount_pt: 'Número de payloads codec em um pacote UDP / RTP. Valores mais altos exigem menos largura de banda, mas mais atrasos. valores incomuns (acima de 4) pode causar incompatibilidade com seu provedor',
sett_comment_short_codecframecount_pt: 'Número de payloads codec em um pacote UDP',

sett_display_name_doublesendrtp_pt: 'Duplo enviar RTP',
sett_comment_doublesendrtp_pt: 'Pode melhorar a qualidade de áudio em determinadas circunstâncias, mas vai aumentar a quantidade de dados de upload',
sett_comment_short_doublesendrtp_pt: 'pacotes RTP dupla de envio',

sett_display_name_cfgcpuspeed_pt: 'Velocidade da CPU',
sett_comment_cfgcpuspeed_pt: 'Características como a AEC ou codec está ligado / desligado com base em sua velocidade do processador do dispositivo',
sett_comment_short_cfgcpuspeed_pt: 'Os recursos são automaticamente selecionados com base em sua velocidade de CPU',

sett_display_name_cfgnetworkspeed_pt: 'Velocidade da rede',
sett_comment_cfgnetworkspeed_pt: 'Ajuda a escolher o melhor codec e melhorias de mídia para as suas chamadas',
sett_comment_short_cfgnetworkspeed_pt: '',

sett_display_name_accounts_pt: 'Contas',
sett_comment_accounts_pt: 'Gerir as suas contas SIP / perfis',
sett_comment_short_accounts_pt: '',

sett_display_name_extraoption_pt: 'Opções extras',
sett_comment_extraoption_pt: 'Definir quaisquer parâmetros personalizados em uma lista de pares de valores-chave, separadas por ponto e vírgula <br /> Ex:. Displayname = João;',
sett_comment_short_extraoption_pt: 'Definir quaisquer parâmetros personalizados',

sett_display_name_reset_settings_pt: 'Redefinir configurações',
sett_comment_reset_settings_pt: 'Redefinir as configurações para seus valores padrão',
sett_comment_short_reset_settings_pt: '',

sett_display_name_ringtone_pt: 'Toque',
sett_comment_ringtone_pt: 'Mudar seu toque para as chamadas recebidas',
sett_comment_short_ringtone_pt: '',

sett_display_name_changesptoring_pt: 'Ring sobre o progresso da sessão',
sett_comment_changesptoring_pt: 'Progresso de sessão (183) como respostas de toque (180). Isso pode ser necessário se o seu provedor de serviços indiferente enviar tocar nem primeiros meios',
sett_comment_short_changesptoring_pt: 'Tratar o progresso da sessão (183) respostas como toque (180)',

sett_display_name_transport_pt: 'Protocolo de transporte',
sett_comment_transport_pt: 'Camada Select transportes',
sett_comment_short_transport_pt: '',

sett_display_name_defmute_pt: 'Direção Mute',
sett_comment_defmute_pt: 'Especificar a forma de silenciar as chamadas quando o botão mute é pressionado',
sett_comment_short_defmute_pt: '',

sett_display_name_automute_pt: 'Mute em nova chamada',
sett_comment_automute_pt: 'Especificar se as chamadas existentes devem ser silenciado em uma nova chamada',
sett_comment_short_automute_pt: '',

sett_display_name_autohold_pt: 'Hold nova chamada',
sett_comment_autohold_pt: 'Especificar se as chamadas existentes deve ser susensas em uma nova chamada',
sett_comment_short_autohold_pt: '',

sett_display_name_customsipheader_pt: 'Custom SIP cabeçalho',
sett_comment_customsipheader_pt: 'Definir um cabeçalho SIP personalizado (uma linha na sinalização SIP) que serão enviadas com todas as mensagens SIP (configuração de especialista)',
sett_comment_short_customsipheader_pt: '',

sett_display_name_enginepriority_java_pt: 'Java applet de prioridade',
sett_comment_enginepriority_java_pt: 'Definir java prioridade motor miniaplicativo',
sett_comment_short_enginepriority_java_pt: '',

sett_display_name_enginepriority_webrtc_pt: 'Prioridade WebRTC',
sett_comment_enginepriority_webrtc_pt: 'Definir WebRTC prioridade motor',
sett_comment_short_enginepriority_webrtc_pt: '',

sett_display_name_enginepriority_ns_pt: 'Serviço prioridade plug-in',
sett_comment_enginepriority_ns_pt: 'Service Set prioridade motor de plug-in',
sett_comment_short_enginepriority_ns_pt: '',

sett_display_name_enginepriority_flash_pt: 'Prioridade do Flash',
sett_comment_enginepriority_flash_pt: 'Definir a prioridade do motor de flash',
sett_comment_short_enginepriority_flash_pt: '',

sett_display_name_enginepriority_app_pt: 'Prioridade app',
sett_comment_enginepriority_app_pt: 'prioridade app engine Set',
sett_comment_short_enginepriority_app_pt: '',

sett_display_name_enginepriority_p2p_pt: 'Prioridade P2P',
sett_comment_enginepriority_p2p_pt: 'Definir telefone a prioridade motor de telefone',
sett_comment_short_enginepriority_p2p_pt: '',

sett_display_name_enginepriority_accessnum_pt: 'Acesso prioridade número',
sett_comment_enginepriority_accessnum_pt: 'Definir acesso prioritário motor de número',
sett_comment_short_enginepriority_accessnum_pt: '',

sett_display_name_enginepriority_nativedial_pt: 'Prioridade discador nativo',
sett_comment_enginepriority_nativedial_pt: 'Definir a prioridade do motor discador nativo',
sett_comment_short_enginepriority_nativedial_pt: '',

sett_display_name_sendrtponmuted_pt: 'Enviar mídia em silencio',
sett_comment_sendrtponmuted_pt: 'Enviar RTP ainda que silenciado (pacotes zerados). Definido como verdadeiro somente se o servidor está funcionando corretamente quando RTP é suprimida',
sett_comment_short_sendrtponmuted_pt: '',

sett_display_name_capabilityrequest_pt: 'Pedido de capacidade',
sett_comment_capabilityrequest_pt: 'Se definido, em seguida enviará uma mensagem de pedido de capacidade (Opções) para o servidor SIP no arranque',
sett_comment_short_capabilityrequest_pt: '',

sett_display_name_dialerintegration_pt: 'Integrar',
sett_comment_dialerintegration_pt: 'Ao discar com discador nativo você será perguntado se quer usar SIP ou móveis',
sett_comment_short_dialerintegration_pt: '',

sett_display_name_devtest_pt: 'Testes de desenvolvedor',
sett_comment_devtest_pt: 'Usado para o desenvolvimento só',
sett_comment_short_devtest_pt: '',

sett_display_name_settobasefunctionality_pt: 'Definido como funcionalidade básica',
sett_comment_settobasefunctionality_pt: 'Usado para o desenvolvimento',
sett_comment_short_settobasefunctionality_pt: '',

sett_display_name_enableaudio_pt: 'Ativar áudio',
sett_comment_enableaudio_pt: 'Usado apenas para testes',
sett_comment_short_enableaudio_pt: '',

sett_display_name_screenrotation_pt: 'Rotação da tela',
sett_comment_screenrotation_pt: 'Orientação da tela de controle',
sett_comment_short_screenrotation_pt: 'Orientação da tela de controle',

sett_display_name_audiobufferlength_pt: 'Comprimento Audiobuffer',
sett_comment_audiobufferlength_pt: '-1 Significa auto. Os valores válidos são entre 160 e 16000. configuração de especialistas',
sett_comment_short_audiobufferlength_pt: 'configuração avançada para o tamanho do buffer de reprodução de áudio',

sett_display_name_p2p_pt: 'Telefone 2 Telefone URI',
sett_comment_p2p_pt: 'Telefone pedido http 2 Telefone',
sett_comment_short_p2p_pt: 'Servidor API HTTP se houver',

sett_display_name_callback_pt: 'Callback URI',
sett_comment_callback_pt: 'Solicitação HTTP callback',
sett_comment_short_callback_pt: 'Servidor API HTTP se houver',

sett_display_name_sms_pt: 'SMS URI',
sett_comment_sms_pt: 'Solicitação HTTP SMS',
sett_comment_short_sms_pt: 'Servidor API HTTP se houver',

sett_display_name_creditrequest_pt: 'Equilibrar URI',
sett_comment_creditrequest_pt: 'Solicitação HTTP equilíbrio',
sett_comment_short_creditrequest_pt: 'Servidor API HTTP se houver',

sett_display_name_ratingrequest_pt: 'Avaliação URI',
sett_comment_ratingrequest_pt: 'solicitação HTTP classificação',
sett_comment_short_ratingrequest_pt: 'Servidor API HTTP se houver',

sett_display_name_displaynotification_pt: 'Exibir notificação',
sett_comment_displaynotification_pt: 'Mostrar notificações na barra de notificação do telefone (geralmente no canto superior do seu telefone)',
sett_comment_short_displaynotification_pt: 'Mostrar notificações na barra de notificação de telefone',

sett_display_name_displayvolumecontrols_pt: 'Sempre exibir o volume',
sett_comment_displayvolumecontrols_pt: 'Sempre exibir controles de volume durante uma chamada',
sett_comment_short_displayvolumecontrols_pt: '',

sett_display_name_displayaudiodevice_pt: 'Sempre exibir dispositivo de áudio',
sett_comment_displayaudiodevice_pt: 'Sempre exibir dispositivo de áudio durante uma chamada',
sett_comment_short_displayaudiodevice_pt: '',

sett_display_name_audiodevices_pt: 'Dispositivos de áudio',
sett_comment_audiodevices_pt: 'Configurações do dispositivo de áudio estará disponível a partir do menu da página de chamada uma vez que você login',
sett_comment_short_audiodevices_pt: '',

sett_display_name_cpualwayspartiallock_pt: 'CPU bloqueio sempre parcial',
sett_comment_cpualwayspartiallock_pt: 'Mantenha o processador do dispositivo sempre acordado. Defina apenas se caso contrário você inscrições soltos e NÃO FAZEM receber chamadas',
sett_comment_short_cpualwayspartiallock_pt: 'Manter um bloqueio parcial sobre a CPU para evitar o sono profundo',

sett_display_name_disablewbforpstn_pt: 'Desativar banda larga para PSTN',
sett_comment_disablewbforpstn_pt: 'Desativar codecs de áudio de banda larga para chamadas para números móveis / fixos (banda larga apenas para IP para chamadas IP)',
sett_comment_short_disablewbforpstn_pt: '',

sett_display_name_multiplecalls_pt: 'Permitir várias chamadas',
sett_comment_multiplecalls_pt: 'Permitir várias chamadas de conferência / (CPU low-end não é capaz de lidar com)',
sett_comment_short_multiplecalls_pt: '',

sett_display_name_callbacknumber_pt: 'Número de retorno',
sett_comment_callbacknumber_pt: 'Número de acesso de retorno de chamada. Alguns provedores de serviços VoIP fornecer este tipo de número que você pode tocar e receber chamada de entrada de IVR servidor',
sett_comment_short_callbacknumber_pt: 'Número de acesso de retorno de chamada',

sett_display_name_blacklist_pt: 'Lista negra',
sett_comment_blacklist_pt: 'Números na lista negra separados por vírgulas',
sett_comment_short_blacklist_pt: '',

sett_display_name_storecallhistory_pt: 'Armazenamento de histórico de chamadas',
sett_comment_storecallhistory_pt: 'Especificar onde armazenar o histórico de chamadas',
sett_comment_short_storecallhistory_pt: '',

sett_display_name_keepdeviceawakeincall_pt: 'Manter o dispositivo incall acordado',
sett_comment_keepdeviceawakeincall_pt: 'Manter o dispositivo acordado durante as chamadas',
sett_comment_short_keepdeviceawakeincall_pt: '',

sett_display_name_speakermode_pt: 'Modo de alto-falante',
sett_comment_speakermode_pt: 'Modo de alto-falante',
sett_comment_short_speakermode_pt: '',

sett_display_name_focusaudio_pt: 'Áudio foco',
sett_comment_focusaudio_pt: 'Concentre-se em áudio da chamada de VoIP (isso pode diminuir o volume de outros fluxos, como o seu media player enquanto você está falando sobre VoIP)',
sett_comment_short_focusaudio_pt: 'Concentre-se em áudio VoIP',

sett_display_name_useroutingapi_pt: 'Use API roteamento',
sett_comment_useroutingapi_pt: 'Use API roteamento por razões de compatibilidade. Alguns dispositivos -normalmente de idade- pode precisar deste para a manipulação de áudio correto',
sett_comment_short_useroutingapi_pt: '',

sett_display_name_hardwaremedia_pt: 'Media de hardware',
sett_comment_hardwaremedia_pt: 'Use melhorias de mídia de hardware, como AEC e denoise. Isto pode adicionar um ligeiro atraso para os fluxos de áudio',
sett_comment_short_hardwaremedia_pt: 'Use melhorias de mídia de hardware',

sett_display_name_autousebluetooth_pt: 'Bluetooth Auto',
sett_comment_autousebluetooth_pt: 'Uso Auto Bluetooth quando estiver disponível',
sett_comment_short_autousebluetooth_pt: '',

sett_display_name_nativefilterallow_pt: 'Prefixos permitidos',
sett_comment_nativefilterallow_pt: 'Lidar com as chamadas nativas se o número começa com',
sett_comment_short_nativefilterallow_pt: '',

sett_display_name_nativefilterblock_pt: 'Prefixos não permitidos',
sett_comment_nativefilterblock_pt: 'NÃO FAZEM lidar com as chamadas nativas se o número começa a sagacidade',
sett_comment_short_nativefilterblock_pt: '',

sett_display_name_integrateifwifionly_pt: 'Integrar se Wi-Fi só',
sett_comment_integrateifwifionly_pt: 'Integrar com discador nativo somente se Wifi está conectado',
sett_comment_short_integrateifwifionly_pt: '',

sett_display_name_cfgvideo_pt: 'Ativar vídeo',
sett_comment_cfgvideo_pt: 'Activar chamadas de vídeo',
sett_comment_short_cfgvideo_pt: '',

sett_display_name_video_pt: 'Ativar vídeo',
sett_comment_video_pt: 'Activar chamadas de vídeo',
sett_comment_short_video_pt: '',

sett_display_name_video_bandwidth_pt: 'Largura de banda de vídeo',
sett_comment_video_bandwidth_pt: 'Definir a largura de banda de vídeo',
sett_comment_short_video_bandwidth_pt: '',

sett_display_name_video_width_pt: 'Largura de vídeo',
sett_comment_video_width_pt: 'Definir a largura do vídeo em pixels',
sett_comment_short_video_width_pt: '',

sett_display_name_video_height_pt: 'Altura de vídeo',
sett_comment_video_height_pt: 'Ajuste a altura do vídeo em pixels',
sett_comment_short_video_height_pt: '',

sett_display_name_video_profile_pt: 'Qualidade de vídeo',
sett_comment_video_profile_pt: 'Definir a qualidade de vídeo',
sett_comment_short_video_profile_pt: '',

sett_display_name_use_h263_pt: 'Codec H263 Uso',
sett_comment_use_h263_pt: 'Use codec de vídeo H263',
sett_comment_short_use_h263_pt: '',

sett_display_name_use_h264_pt: 'Codec H264 Uso',
sett_comment_use_h264_pt: 'Use codec de vídeo H264',
sett_comment_short_use_h264_pt: '',

sett_display_name_vibrate_pt: 'Vibrar',
sett_comment_vibrate_pt: 'Vibrar ao receber chamadas',
sett_comment_short_vibrate_pt: '',

sett_display_name_video_fps_pt: 'Vídeo FPS',
sett_comment_video_fps_pt: 'Definir vídeo framerate, 0 significa automática',
sett_comment_short_video_fps_pt: '',

sett_display_name_setfinalcodec_pt: 'Definir codec finais',
sett_comment_setfinalcodec_pt: 'Solução para problemas de negociação múltiplos codecs',
sett_comment_short_setfinalcodec_pt: '',

sett_display_name_use_rport_pt: 'Use rport',
sett_comment_use_rport_pt: 'Uso rport na Via cabeçalho',
sett_comment_short_use_rport_pt: '',

sett_display_name_normalizenumber_pt: 'Normalizar número',
sett_comment_normalizenumber_pt: 'Remover caracteres especiais de números discados',
sett_comment_short_normalizenumber_pt: '',

sett_display_name_natopenpackets_pt: 'NAT pacotes abertos',
sett_comment_natopenpackets_pt: 'pacotes UDP para enviar para abrir o dispositivo NAT (mudança, se você tem problemas de NAT)',
sett_comment_short_natopenpackets_pt: '',

sett_display_name_sendchatonenter_pt: 'Chat sobre entrar',
sett_comment_sendchatonenter_pt: 'Enviar bate-papo em entrar pressione a tecla',
sett_comment_short_sendchatonenter_pt: '',

sett_display_name_transfwithreplace_pt: 'Transferir com substituição',
sett_comment_transfwithreplace_pt: 'Especificar se substituir deve ser usado com a transferência de modo que a chamada velha (de diálogo) não está desligado, mas apenas substituído. Desta forma, o A festa nunca é desligado, apenas a parte chamada é alterado. A uma parte deve ser capaz de lidar com o cabeçalho substituir para isso',
sett_comment_short_transfwithreplace_pt: 'Especificar se substituir deve ser usado com a transferência de modo que a chamada velha (de diálogo) não está desligado, mas apenas substituído',

sett_display_name_submenu_sipsettings_pt: 'Definições SIP ...',
sett_comment_submenu_sipsettings_pt: 'Configurações relacionadas SIP',
sett_comment_short_submenu_sipsettings_pt: '',

sett_display_name_submenu_media_pt: 'Configurações de mídia ...',
sett_comment_submenu_media_pt: 'Codecs de voz, a qualidade e o dispositivo',
sett_comment_short_submenu_media_pt: '',

sett_display_name_submenu_video_pt: 'Vídeo...',
sett_comment_submenu_video_pt: 'Configurações relacionadas a vídeo',
sett_comment_short_submenu_video_pt: '',

sett_display_name_submenu_sounddevicevolume_pt: 'Dispositivo de som e volume ...',
sett_comment_submenu_sounddevicevolume_pt: 'Reprodução e gravação',
sett_comment_short_submenu_sounddevicevolume_pt: '',

sett_display_name_submenu_calldivert_pt: 'Configurações de chamada de desvio ...',
sett_comment_submenu_calldivert_pt: 'Adiante, transferência, reescrita',
sett_comment_short_submenu_calldivert_pt: '',

sett_display_name_submenu_calldivert_advanced_pt: 'Configurações avançadas...',
sett_comment_submenu_calldivert_advanced_pt: 'Mais configurações',
sett_comment_short_submenu_calldivert_advanced_pt: '',

sett_display_name_advancedsettings_pt: 'Configurações avançadas...',
sett_comment_advancedsettings_pt: 'Mostrar configurações avançadas',
sett_comment_short_advancedsettings_pt: '',

sett_display_name_entersettings_pt: 'Configurações...',
sett_comment_entersettings_pt: 'Mostrar configurações',
sett_comment_short_entersettings_pt: '',

sett_display_name_submenu_general_pt: 'Configurações Gerais...',
sett_comment_submenu_general_pt: 'Outros ajustes',
sett_comment_short_submenu_general_pt: '',

sett_display_name_submenu_integrate_pt: 'Integração Dialer ...',
sett_comment_submenu_integrate_pt: 'Ao discar com discador nativo você vai ser perguntado se você quiser usar SIP ou móveis',
sett_comment_short_submenu_integrate_pt: '',

sett_display_name_submenu_advanced_pt: 'Configurações avançadas...',
sett_comment_submenu_advanced_pt: 'Mais configurações',
sett_comment_short_submenu_advanced_pt: '',


/*--------- #language# de German ---------*/

settings_title_de: 'Einstellungen',

username_de: 'Benutzername',
password_de: 'Passwort',

btn_login_de: 'Anmeldung',
btn_close_de: 'schliessen',
btn_cancel_de: 'abbrechen',
btn_ok_de: 'OK',
btn_upgrade_de: 'Upgrade',
btn_save_de: 'speichern',
btn_send_de: 'senden',
btn_revert_de: 'rueckgaengig',
btn_create_de: 'erstellen',
btn_audio_device_de: 'Audio Geraet',
btn_quickcall_de: 'Anruf',
btn_accept_de: 'akzeptieren',
btn_reject_de: 'verwerfen',
myprovider_de: 'Start',
myaccount_de: 'mein Account',
recharge_de: 'Kredit aufladen',
newuser_de: 'neuer Benutzer',
newuser_a_de: 'Account erstellen',
forgotpassword_a_de: 'Passwort vergessen ?',
p2p_de: 'Telefon zu Telefon',
p2p_nra_de: 'Ihre Telefonnummer',
p2p_nrb_de: 'Wen rufen Sie an',
p2p_err1_de: 'Geben Sie Ihre Nummer ein',
p2p_err2_de: 'Geben Sie die Zielnummer ein',
callback_de: 'Rueckruf',
callback_src_de: 'Geben Sie Ihre Handynummer ein<br>(inkl. der Laendervorwahl)',

phone_nr_de: 'Rufnummer',
phone_nr2_de: 'Telefonnummer',
chat_nr_de: 'SIP URI, Benutzername oder -nummer',
ct_search_hint_de: 'Kontakte suchen',
initializing_de: 'Initialisierung',
reset_settings_msg_de: 'Sind Sie sicher, dass Sie die Einstellungen zuruecksetzen wollen?',
reset_settings_msg2_de: 'Die Einstellungen wurden auf die Standardwerte zurueckgesetzt.',
aec_auto_de: 'automatisch',
aec_none_de: 'keine',
aec_software_de: 'Software',
aec_native_de: 'native',
aec_fast_de: 'schnell',
aec_decrease_volume_de: 'Lautstaerke verringern',
warning_de: 'Warnung',
help_de: 'Hilfe',
help_provider_de: 'Finden Sie einen VoIP-Provider',
logview_help_de: 'Kopieren Sie den Inhalt der Protokolle Fenster und senden Sie es in einem EMail zu:',
please_enter_de: 'Eingabe',
loading_de: 'laden..',
type_phone_de: 'Telefon',
type_home_de: 'Privat',
type_mobile_de: 'Mobile',
type_work_de: 'Geschaeft',
type_other_de: 'andere',
type_fax_home_de: 'Fax Privat',
type_fax_work_de: 'Fax Geschaeft',
type_pager_de: 'Pager',
type_sip_de: 'Voip',
phone_de: 'Telefon',
home_de: 'Privat',
mobile_de: 'Mobile',
work_de: 'Geschaeft',
other_de: 'andere',
fax_home_de: 'Fax Privat',
fax_work_de: 'Fax Geschaeft',
pager_de: 'Pager',
sip_de: 'Voip',
send_msg_de: 'Nachricht senden',
contact_alert_title_de: 'waehle Telefontyp',
contact_name_de: 'Name',
contact_phone_de: 'Rufnummer',
contact_saved_de: 'Kontakt gespeichert.',
contact_save_error_de: 'Fehler - Kontakt(e) können nicht gespeichert werden.',
contact_no_nunber_de: 'Geben Sie eine Rufnummer oder Benutzernamen an',
no_contacts_1_de: 'So erstellen Sie Kontakte: Neuer Kontakt aus dem Menue auswaehlen.',
no_contacts_2_de: 'Oder verwenden Sie die "Sync Kontakt" Menü-Option um Kontakte aus Ihrem Handy zu importieren.<br />(Sync funktioniert nur, nachdem Sie Kontakte aus Ihrem Handy hochgeladen haben)',
sync_title_de: 'Sync Kontakte',
sync_message_de: 'Sync funktioniert nur, nachdem Sie Kontakte aus mobilen Gerät geladen haben.',
no_history_de: 'Anrufliste leer',
duration_de: 'Gespraechsdauer:',
rating_minute_de: ' \\ min',
clear_callhistory_de: 'Anrufliste leeren',
clear_callhistory_msg_de: 'Sind Sie sicher dass Sie die Anrufliste loeschen wollen?',
contact_delete_msg_de: 'Sind Sie sicher dass Sie diesen Kontakt loeschen wollen?',
ch_outgoing_de: 'ausgehender Anruf',
ch_incoming_de: 'eingehender Anruf',
ch_missed_de: 'verpasster Anruf',
ch_delete_de: 'loeschen von der Anrufliste',
in_hold_de: '(halten)',
initiate_call_forward_de: 'initiere Rufweiterleitung',
initiate_call_transfer_de: 'initiere Ruftransfer',
initiate_conference_de: 'initiere Konferenz',
send_dtmf_de: 'sende DTMF',
unmuted_de: 'Mikrofon ein',
muted_de: 'Mikrofon aus',
hold_released_de: 'Wartestellung freigegeben',
on_hold_de: 'in Wartestellung',
speaker_off_de: 'Lautsrpecher aus',
speaker_on_de: 'Lautsprecher ein',
call_from_de: 'verpasster Anruf',
calls_de: 'verpasste Anrufe',
message_from_de: 'Nachricht von',
messages_de: 'Neue Nachricht',
goto_de: 'gehe zu',
callhistory_de: 'Anrufverlauf',
messagehistory_de: 'Nachrichten',
sett_enabled_de: 'eingeschaltet',
sett_disabled_de: 'ausgeschaltet',
hide_search_de: 'verstecke suchen',
show_search_de: 'suchen in einstellungen',
settings_login_de: 'Anmelden',
ie_update_de: 'Diese Anwendung erfordert eine höhere Version von Internet Explorer . Wollen Sie die Aktualisierung downloadnen?',
install_java_de: 'Java wird benoetigt: https://java.com/download/',
serviceengine_title_de: 'benutze service Plugin',
serviceengine_msg_de: 'Installiere service Plugin fuer eine bessere Erfahrung',
np_download_de: 'Service Plugin Download',
np_popup_title_de: 'Service Plugin',
np_popup_msg_de: 'Sie müssen das Service -Plugin installieren fuer das Softphone.',
choose_engine_title_de: 'Waehlen Sie die Engine',
choose_engine_title_single_engine_de: 'Click für den Download / Installion',
nativeplugin_de: 'Service Plugin',
native_call_de: 'initiiere Anruf...',
ce_enablejava_de: '<a href="https://java.com/en/download/help/enable_browser.xml" target="_blank">aktiviere Java in den Browsereinstellungen </a>',
ce_install_java_de: 'Falls Java noch nicht installiert ist, installieren Sie es von <a href="https://java.com/download/" target="_blank">here.</a>',
ce_installnativeplugin_de: 'Installieren Sie [NATIVE_PLUGIN] fuer die beste Erfahrung',
ce_usewebrtc_de: 'benutze webrtc',
ce_webrtcnot_de: '(Nicht Empfohlen)',
ce_browser_install_de: 'Installieren',
ce_browser_alternate_de: 'alternativer Browser',
ce_native_ios_de: 'iOS unterstuezt Voip nicht im Browser.',
ce_native_ios2_de: 'Bitte verwenden Sie die APP',
ce_native_android_de: 'Benutze die APP',
ce_use_de: 'ausgewaehlt. einfach anmelden.',
np_install_title_de: 'Service Plugin',
np_install_msg_de: 'Downloaden Sie das Service Plugin und installieren Sie es.<br />Clicken Sie auf OK oder ABBRUCH.',
np_successfully_installed_de: 'Service Plugin erfolgreich installiert.',
java_install_title_de: 'Download und Installation von Java',
java_install_de: 'Klicken Sie auf OK, um Java herunterzuladen.<br>Sie muessen Sich wieder neu anmelden , nachdem Sie die Installation beendet haben.',
sync_contacts_started_de: 'Sync Kontakte...',
sync_succeded_de: 'Sync erfolgreich',
sync_failed_de: 'Sync fehlerhaft',
sync_msg_de: 'oder Sync Kontakte vom Mobilen Geraet:',
ce_dontask_de: 'nicht noch einmal fragen',
//OPSSTART
autoprov_loading_de: 'Konfiguration wird abgerufen...',
autoprov_restart_de: 'Konfiguration wird angewendet...',
//OPSEND
hint_menu_de: 'Menue',
hint_voicemail_de: 'Sprachnachricht',
hint_quickcall_de: 'Schnellanruf',
hint_message_de: 'Nachricht',
hint_addphone_de: 'Telefon hinzufuehgen',
hint_removephone_de: 'Telefon entfernen',
hint_choosect_de: 'Kontakt waehlen',
hint_sendmsg_de: 'Nachricht senden',
hint_conference_de: 'zu Konferenz hinzufuehgen',
hint_transfer_de: 'Rufweiterleitung',
hint_dialpad_dtmf_de: 'DTMF senden',
hint_mute_de: 'Mikrofon ein /ause',
hint_hold_de: 'halten / holen',
hint_speaker_de: 'Lautsprecher ein / aus',
hint_dialpad_de: 'Wahltastatur',
hint_contacts_de: 'Kontakte',
hint_callhistory_de: 'Anrufsverlauf',
hint_status_de: 'Ereignisse und Statusmeldungen',
hint_curr_user_de: 'Benutzername',
hint_phone_number_de: 'Geben Sie hier die Telefonnummer, SIP-Account, Benutzernamen oder SIP-URI ein.',
hint_btn_call_de: 'Anruf starten',
hint_btnback_de: 'zurück zur vorherigen Seite',
hint_numpad_de: 'Wahltastatur',
hint_recents_de: 'Aktion',
hint_encicon_de: 'verschlüsselt',

transfer_title_de: 'Rufweiterleitung',
forward_title_de: 'Rufweiterleitung',
conference_title_de: 'zu Konferenz hinzufuehgen',

status_not_registered_de: 'nicht registriert',
pick_ct_de: 'waehle Kontakt',
chat_sms_title_de: 'Chat oder SMS',
chdetails_title_de: 'Info',
chdetails_btnback_txt_de: 'Anrufsverlauf',
ctdetails_title_de: 'Kontakt',
ctdetails_btnback_txt_de: 'Kontakte',
msg_title_chat_de: 'IM - Chat',
msg_title_sms_de: 'SMS',
dialpad_title_de: 'Anruf',
msglist_title_de: 'Nachrichten',
ctlist_title_de: 'Kontakte',
chlist_title_de: 'Anrufsverlauf',
addeditct_title_new_de: 'Neuer Kontakt',
addeditct_title_edit_de: 'Kontakt aendern',
logview_title_de: 'Logs',
newuser_title_de: 'Neuer Benutzer',
voicemail_title_de: 'Sprachnachricht',
voicemail_msg_de: 'Geben Sie hier Ihre Mailbox-Nummer ein',
quickcall_title_de: 'Schnellanruf',
quickcall_msg_de: 'Geben Sie hier die Telefonnummer ein zum anrufen',
go_back_btn_txt_de: 'zurueck',
chat_de: 'IM - Chat',
sms_de: 'SMS',
delete_text_de: 'loeschen',
delete_all_msg_alert_de: 'Alle Nachrichten werden geleoscht.',
delete_msg_alert_de: 'Der gesammte Verlauf wird geloescht.',
btn_new_message_de: 'Neue Nachricht',
message_sent_de: 'Nachricht gesendet',
me_de: 'ich',
sendtosupport_de: 'an support senden',
support_email_body_de: 'Kopieren Sie hier den Inhalt des Log-Fenster rein:',
support_selectall_de: 'waehle alles',
nu_username_de: 'Benutzername',
nu_password_de: 'Passwort',
nu_email_de: 'Email Addresse',
nu_fullname_de: 'Voller Name',
nu_phone_de: 'Telefon',
nu_address_de: 'Addresse',
nu_country_de: 'Land',
nu_birthday_de: 'Geburtstag',
nu_gender_de: 'Geschlecht',
nu_fpq_de: 'Passwort vergessen Frage:',
nu_fpa_de: 'Passwort vergessen Antwort:',
presence_stat_online_de: 'online',
presence_stat_away_de: 'unterwegs',
presence_stat_dnd_de: 'bitte nicht stoeren',
presence_stat_invisible_de: 'unsichtbar',
presence_stat_offline_de: 'offline',
connection_title_de: 'Verbindugnsproblem',
connection_msg_de: 'Es scheint, dass Sie nicht mit dem Internet verbunden sind.<br>Bitte überprüfen Sie die Verbindung.' ,

menu_sync_de: 'Sync Kontakte',
menu_volumehide_de: 'Lautstaerkeregler ausblenden',
menu_volumeshow_de: 'Lautstaerkeregler',
menu_audiodevicehide_de: 'Audiogeraet ausblenden',
menu_audiodeviceshow_de: 'Audiogeraet',
menu_conference_de: 'Konferenz',
menu_transfer_de: 'Uebertragen',
menu_numpad_de: 'Waehltastatur',
menu_mute_de: 'stumm',
menu_hold_de: 'halten',
menu_speaker_de: 'Lautsprecher',
menu_call_de: 'Anruf',
menu_message_de: 'Nachricht',
menu_new_contact_de: 'Neuer Kontakt',
menu_editcontact_de: 'Kontakt bearbeiten',
menu_createcontact_de: 'Kontakt speichern',
menu_deletecontact_de: 'Kontakt loeschen',
menu_exit_de: 'Exit',
menu_callpark_de: 'Anruf parkieren',
menu_lastcalldetails_de: 'Letzte Anrufdetails',
menu_call_access_de: 'Anruf -Zugangsnummer',
menu_switchtoadvanced_de: 'Erweiterte Einstellungen anzeigen',
menu_switchtobasic_de: 'Standardeinstellungen anzeigen',
menu_showsettings_de: 'Einstellungen',
menu_close_de: 'Schliessen',
menu_help_de: 'Hilfe',
help_help_de: 'Hilfe',
help_rate_de: 'bewerte RigiTel.ch SoftPhone',
help_loging_de: 'Logs (trace)',
help_proversion_de: 'Lizenz',
help_about_de: 'Ueber',
help_report_de: 'Problem melden',
help_license_de: 'Lizenzvereinbarung',
help_startlog_de: 'Starten Sie die Protokollierung',
help_sendlog_de: 'Zeige die Logs / an Support senden',
help_stoplog_de: 'Beenden Sie die Protokollierung',
about_license_de: 'Lizenzvereinbarung',


btn_activate_de: 'aktivieren',
license_key_de: 'Lizenzschluessel',
enter_license_key_de: 'Lizenzschluessel eingeben',
sett_chooseengine_title_de: 'VoIP Engine',
sett_chooseengine_popup_title_de: 'verfuehgbare Engines',
sett_chooseengine_comment_de: 'Waehlen Sie die VoIP Engine',
sett_ce_highly_de: 'sehr empfehlenswert',
sett_ce_recommended_de: 'empfehlenswert',
about_homepage_de: 'Homepage',
about_copyright_de: 'Copyright',
about_copyright2_de: 'All rights reserved.',
hint_page_de: 'Aktuelle gewaehlte Seite',
username_warning_de: 'Bitte geben Sie den SIP-Benutzernamen zuerst ein',
hint_notif_clear_de: 'Loeschen Sie diese Meldung',
not_missed_call_de: 'Verpasster Anruf von',
not_missed_chat_de: 'Verpasster Chat von',
not_panel_title_de: 'Meldung',
help_enablelog_de: 'Logs aktivieren',
help_logwindow_de: 'Logs',
disable_logs_de: 'Logs deaktivieren',
activated_de: 'Pro Lizenz aktiviert.',
about_support_de: 'Support',
warning_feature_de: 'Sie benötigen einen Pro-Lizenz fuer diese Funktion. <br /> um diese Lizenz zu aktivieren, loggen Sie sich zuerst ein, dann waehlen Sie -Lizenz- aus dem Menue.',
allowmedia_title_de: 'Zugang zu den Medien',
allowmedia_chrome_de: 'Das benoetigt Zugriff auf das Mikrofon. <br /> Um Zugriff zu gewaehren, klicken Sie auf das "Sound" Symbol in der oberen rechten Ecke des Browsers und waehlen  -"erlauben" , dann wiederholen Sie den Anruf',
allowmedia_firefox_de: 'Das benoetigt Zugriff auf das Mikrofon. <br /> Um Zugriff zu gewaehren, klicken Sie auf das "Mikrofon" -Symbol oben in der Mitte des Browser und wählen Sie "erlauben", dann wiederholen Sie den Anruf.',
allowmedia_general_de: 'das benoetigt Zugriff auf das Mikrofon. <br /> Nachdem Sie den Zugriff gewaehrt haben, wiederholen Sie den Anruf.',
filetransf_title_de: 'Datei senden',
filetransfer_nr_de: 'SIP URI oder Benutzername',
hint_filetranf_de: 'Datei senden',
filetransf_err_de: 'Geben Sie das Ziel zuerst ein.',
fitransf_failed_de: 'Senden fehlgeschlagen!',
fitransf_succeded_de: 'Erfolgreich gesendet',
fitransf_chat_de: 'Sie haben eine Datei erhalten',
chrome_local_alert_de: 'Das Webphone unterstuetzt das Arbeiten mit dem lokalen Dateisystem in Google Chrome oder Opera-Browser nicht. \ Sie muessen es auf einem Webserver bereitstellen. Sie können Firefox oder IE verwenden wenn sie mit dem lokalen Dateisystem arbeiten wollen.',
chrome_local_webrtc_audio_de: 'WebRTC hat keine Berechtigung für den Zugriff auf Audiogeraete aus dem lokalen Dateisystem in Chrome und Opera-Browser. \ Das Webphone muss auf auf einem sicheren Webserver (HTTPS) gehostet sein um Anrufe zu taetigen und empfangen mit WebRTC..',
//chrome_https_de: 'Es wird empfohlen, das Webphone auf HTTPS zu aktivieren um WebRTC auf Chrome / Opera zu verwenden.',
//chrome_https_de: 'Für Chrome und Opera empfehlen wir das Webphone auf einem sicheren (https) Server zu hosten , da sonst die RigiTel.ch HTTPS-Proxy missbraucht werden koennten.',
chrome_https_de: 'Fuer Chrome und Opera empfehlen wir das Webphone auf einem sicheren (https) Server zu hosten , sonst wird WebRTC nicht funktionieren.',
webrtc_local_sipserver_de: 'Lokale WebRTC Server erforderlich!',
//chrome_https_reload_de: 'Fuer Chrome und Opera empfehlen wir das Webphone auf einem sicheren (https) Server zu hosten.',
chrome_https_reload_de: 'Fuer Chrome und Opera gilt WebRTC wird nur von einer sicheren (https) Umgebung aus funktionieren. OK - Klicken Sie auf die Seite um RigiTel.ch HTTPS-Proxy neu zu laden.',
all_demo_msg_de: '(these messages are displayed only in demo version, in final build these situations are handled automatically)',

save_to_contacts_title_de: 'Kontakt speichern',
save_to_contacts_msg_de: 'Wollen Sie diese Nummer als Kontakt speichern?',
btn_save_to_contacts_1_de: 'Ja , neuen Kontakt erstellen',
btn_save_to_contacts_2_de: 'Ja , zu existierendem Kontakt hinzufuehgen',
btn_save_to_contacts_dontask_de: 'nicht nocheinmal fragen',
audio_title_de: 'Audioeinstellugen',
audio_mic_de: 'Microfon',
audio_rec_de: 'Lautsprecher',
audio_ring_de: 'Ring',
audio_aec_de: 'AEC',
audio_agc_de: 'AGC',
audio_all_devices_de: 'Alle',
filters_title_de: 'Regeln',
filters_add_label_de: 'Regeln hinzufuehgen',
filters_add_rule_de: 'Regeln hinzufuehgen',
filter_start_de: 'Wenn die Nummer beginnt mit',
filter_replace_de: 'Ersetze durch',
filter_minlen_de: 'Minimum Laenge',
filter_maxlen_de: 'Maximum Laenge',
filter_warning_de: 'Beim naechsten "Starten mit" oder "Ersetzen durch " Feld eingegeben werden muss.',
filter_delete_hint_de: 'Regel leoschen',
filter_edit_hint_de: 'Regel aendern',
menu_block_contact_de: 'Kontakt blockieren',
menu_unblock_contact_de: 'Kontakt freigeben',
addeditct_label_email_de: 'Email',
addeditct_label_address_de: 'Addresse',
addeditct_label_notes_de: 'Notiz',
addeditct_label_website_de: 'Webseite',
addeditct_addfield_de: 'Feld hinzufügen',
addeditct_hint_adddetails_de: 'zusätzliches Feld einfuehgen',
ftrnasf_status_processing_de: 'Verarbeitung...',
ftrnasf_status_waiting_de: 'warte auf Gegenseite...',
ftrnasf_status_delivered_de: 'Lieferung.',
ns_engine_unreachable_de: 'Engine nicht verfuehgbar.',
menu_reconnect_de: 'Wiederverbinden',
menu_copy_de: 'Kopieren ',
menu_paste_de: 'Einfuehgen',
menu_showlogs_de: 'Logs anzeigen',
menu_clearsettings_de: 'Einstellungen loeschen',
java_freeze_ff_de: 'Nachdem Sie zugestimmt haben, diese Anwendung auszufuehren, \ nKlicken Sie OK, um fortzufahren',
hint_hangup_de: 'Anruf auflegen',
hint_accept_de: 'Anruf annehmen',
hint_reject_de: 'Anruf ablehnen',
hint_called_de: 'Anrufer / Angerufener',
hint_callstatus_de: 'Anrufstatus  und Ereignismeldungen',
hint_callduration_de: 'Gesprächsdauer',
hint_more_de: 'mehr',
ce_ask_user_de: 'Es scheint als ob [SELECTEDENGINE] Engine nicht funktioniert. Sollen wir [RECOMMENDED] Engine ausprobieren?',
ce_alert_title_de: 'Installieren',
ce_alert_user_de: 'muss installiert sein fuer [BRAND] damit das funktioniert.',
favafone_new_de: 'Ich bin neu in Favafone',
newuser_pleaseenter_de: 'Bitte eingeben',
newuser_invalid_de: 'Ungueltig',
hint_callforward_de: 'Rufweiterleitung',
initiate_callforward_de: 'initiere Rufweiterleitung',
callforward_title_de: 'Rufweiterleitung',
menu_callforward_de: 'Rufweiterleitung',
recharge_msg_de: 'Karten aufladen (PIN code)',
recharge_error_de: 'Geben Sie Ihre PIN-Code zum aufladen ein',
username_err_de: 'Der Benutzername enthaelt nicht unterstuetzte Sonderzeichen, bitte umschreiben',
password_err_de: 'Das Passwort enthaelt nicht unterstuetzte Sonderzeichen, bitte umschreiben',
menu_webcallme_de: 'Meine click2call url',
menu_confrooms_de: 'Konferenz',
menu_callpickup_de: 'Anrufuebernahme',
webcallme_msg_de: 'Senden Sie diesen Link an Ihre Freunde, damit Sie sie mit einem einfachen Klick anrufen koennen.',
cb_callonmobile_de: 'Mobiler Anruf',
cb_callonnative_de: 'VoIP Anruf',
confroom_msg1_de: 'Ihre Konferenzraumnummer ist',
confroom_msg2_de: 'Fügen Sie Personen zur Konferenz hinzu',
confroom_inv_title_de: 'Laden Sie zur Konferenz ein',
confroom_inv_msg_de: 'Sie sind zur Konferenz eingeladen',
service_update_de: 'Eine neue Version von NS-Service Plugin zur Verfuegung. Es ist empfohlen auf die neueste Version zu aktualisieren..',
video_call_de: 'Video Anruf',
video_call_msg_de: 'Video Anruf',
btn_videocall_de: 'Video Anruf',
menu_ignore_de: 'Ignorieren',
hint_smiley_de: 'Smiley',
menu_groupchat_de: 'Leute hinzufuegen(Gruppen Chat)',
status_startingengine_de: 'Start Engine',
usenative_title_de: 'Benutze APP',
usenative_option_native_de: 'Empfohlen: nativen Dialer mit besserer Qualitaet',
usenative_option_webrtc_de: 'Ignorieren und ( WebRTC ) in Web-Browser jetzt starten',
menu_ct_setfavorite_de: 'Als Favoriten setzen',
menu_ct_unsetfavorite_de: 'Entfernen von Favoriten',
menu_videorecall_de: 'Video Wiederanruf',
switch_engine_de: 'wechsle Engine',
gc_message_de: 'Sie befinden sich in einem Gruppen-Chat mit',
gc_message2_de: 'tritt dem Gespraech',
username_warning2_de: 'Benutzername Mindestlaenge ist 3.',
password_warning2_de: 'Passwort Mindestlaenge 3.',
composing_de: 'am schreiben',
logview_msg_de: 'Wenn sich nach einigen Sekunden nichts aendert, aktualisiren Sie die Seite manuell..',
messagepl_de: 'schreibe',
unlockadvancedsett_title_de: 'Einstellungen freigeben',
unlockadvancedsett_msg_de: 'Geben Sie das Kennwort ein um die erweiterten Einstellungen zu entsperren',
warning_notreg_de: 'Kann Anruf nicht initiieren, da noch nicht Registriert',
warning_notstarted_de: 'Kann Anruf nicht initiieren, da das Softphone noch nicht gestartet ist',


warning_msg_1_de: 'Nur direkte Anrufe auf URIs zu SIP sind möglich, wenn die VoIP-Server-Adresse nicht gesetzt ist.',
warning_msg_2_de: 'IP oder Domain-Name wird in dieser Version nicht akzeptiert. Geben Sie den Servernamen oder ID hier ein.',
warning_msg_3_de: 'Bitte geben Sie den Namen des Kontakts ein.',
warning_msg_4_de: 'Fehlgeschlagene Konfigurationen abrufen. <br /> <br /> Auf der Seite Einstellungen Server-Eingang, geben Sie die Domaene des VoIP-Provider und Namen oder die IP-Adresse ein',
err_msg_1_de: 'Ungueltiger Benutzername.',
err_msg_2_de: 'Ungueltiges Passwort.',
err_msg_3_de: 'ERROR, Geben Sie eine Telefonnummer, SIP, URI oder Benutzername ein',
err_msg_4_de: 'Ungueltige Telefonnummer, SIP-URI oder Benutzername',
err_msg_5_de: 'Ungueltige Telefonnummer.',
err_msg_6_de: 'Ungueltige Adresse.',
err_msg_7_de: 'Keine Nachrichten zum löschen',

err_msg_8_de: 'Geben Sie einen Benutzernamen ein.',
err_msg_9_de: 'Geben Sie ein Passwort ein.',
err_msg_10_de: 'Geben Sie Ihre Email Adresse ein',
err_msg_11_de: 'Geben Sie Ihren vollständigen Namen ein.',
err_msg_12_de: 'Ungültige E-Mail-Adresse.',
err_msg_13_de: 'Benutzername\'muss mindestens lang sein',
err_msg_14_de: 'ungueltiger Benutzername.',
err_msg_15_de: 'Passwort\'muss mindestens lang sein',
err_msg_16_de: 'ungueltiges Passwort.',
err_msg_17_de: 'Name\'muss mindestens lang sein',
err_msg_18_de: 'ungueltiger Name.',
err_msg_19_de: 'ungueltige Telefonnummer.',
err_msg_20_de: 'ungueltiger Adresse.',
err_msg_21_de: 'Geben Sie Ihre Telefonnummer ein.',
err_msg_22_de: 'Konfiguration nicht verfuehgbar, versuchen Sie es spaeter nochmals',

err_nocallinprogress_de: 'Kein Anruf im Gange',
err_flash_local_de: 'Flash-Engine funktioniert nur, wenn von einem Webserver gestartet, nicht aus lokalen Dateisystem',

srvaddr_help_de: 'VoIP Service Provider Server Adresse (IP-Adresse oder den Domänennamen oder den DNS-SRV-Datensatz). Sie können auch die Nummer eines Ports ein Suffix, wenn der Server nicht auf dem Standard-SIP-Port (5060). Beispiel: Yourserver.com:6000<br /><br /> Im Falle, wenn Sie neu sind bei VoIP:<br /> Im Gegensatz zu einigen anderen beliebten Software wie Skype, wenn Sie standard SIP-Protokoll können Sie jeden VoIP-Anbieter. Es gibt hunderte solcher Dienste und Sie könnten auch auf Ihrem eigenen Server, beispielsweise durch die Verwendung von Mizu-Server oder Sternchen.<br /> Interne (Softphone Softphone) Anrufe werden in der Regel kostenlos, und die Kosten für abgehende Anrufe (Anrufe zu Mobil- oder Festnetz) sind in der Regel billiger als bei traditionellen Anbietern, insbesondere internationale Anrufe.<br /> Gibt es auch eine Menge anderer Vorteile für die Verwendung von VoIP, wie z. B. hohe Qualität (mit Wideband Codec), Freiheit (Sie können jederzeit Ihr Provider), die Control (können Sie ganz einfach Ihr Konto verwalten) und Flexibilität (viele zusätzliche Dienstleistungen wie die Aufzeichnung von Anrufen, Konferenzen und andere). Sie können sogar mehrere Anbieter (z. B. können Sie verwenden immer die billigere für Ihren Anruf).<br /> Wenn Sie don\'t haben einen VoIP-Account haben, dann können Sie innerhalb von wenigen Minuten bei jedem Anbieter und starten Sie mit VoIP-Jetzt: https://www.voip-info.org/wiki/view/Sip Telefon Service Provider',

chatsms__auto_guess_or_ask_de: 'Auto probieren oder fragen',
chatsms__sms_only_de: 'nur SMS',
chatsms__chat_only_de: 'nur Chat',
defmute__both_de: 'beides',
defmute__speakers_only_de: 'nur Lautsprecher',
defmute__mic_only_de: 'nur Mic',
video__auto_de: 'Auto',
video__disable_de: 'Deaktiviert',
video__enable_de: 'Aktiviert',
video__force_de: 'forsieren',
agc__disabled_de: 'Deaktiviert',
agc__for_redcording_de: 'nur zum aufzeichnen',
agc__both_for_recording_and_playback_de: 'fuer beides aufzeichnen und abspielen',
agc__guess_de: 'einschaetzen',
use_fast_ice__no_de: 'Nein (auf 0 setzen, wenn Ihr Server immer ueber die Medien geroutet wird)',
use_fast_ice__auto_de: 'Auto',
use_fast_ice__yes_de: 'Ja',
use_fast_ice__always_de: 'Immer (nicht empfohlen)',
use_stun__force_de: 'Private IP-Adresse erzwingen',
use_stun__no_de: 'Nein',
use_stun__stable_nat_de: 'Nur mit stabilen NAT',
use_stun__all_symetric_de: 'Auf alle symmetrischen NAT',
use_stun__always_de: 'immer',
use_stun__public_ip_de: 'Einsatz auch auf öffentliche IP-Adresse',
use_rport__no_de: 'Nein',
use_rport__simmetric_nat_de: 'Auf simmetric nat',
use_rport__always_de: 'immer',
use_rport__public_ip_de: 'Auch auf öffentliche IP-Adresse',
use_rport__request_de: 'Anfrage nicht Verwendung',
register__no_de: 'Nein',
register__auto_de: 'Auto einschaetzen',
register__yes_de: 'Ja',
changesptoring__nothing_de: 'nichts tun',
changesptoring__disp_ringing_de: 'Anzeige Status klingeln',
changesptoring__start_media_de: 'Starte Media',
changesptoring__start_media_disp_de: 'Start Media und Klingeln',
playring__no_de: 'Nein',
playring__incoming_de: 'Fuer eingehende Anrufe',
playring__both_de: 'Fuer eingehende und ausgehende Anrufe',
setfinalcodec__never_de: 'Nie',
setfinalcodec__auto_de: 'Auto',
setfinalcodec__multiple_codec_de: 'Auf mehreren Codec',
setfinalcodec__always_de: 'immer',
denoise__disabled_de: 'deakiviert',
denoise__recording_de: 'Nur fuer die Aufnahme',
denoise__both_de: 'Sowohl fuer die Wiedergabe und Aufzeichnung',
denoise__auto_de: 'Auto einschaetzen',
plc__no_de: 'Nein',
plc__auto_de: 'Automatisch',
plc__yes_de: 'Ja',
silencesupress__auto_de: 'Auto',
silencesupress__no_de: 'Nein',
silencesupress__yes_de: 'Ja',
hardwaremedia__auto_de: 'Auto',
hardwaremedia__no_de: 'Nein',
hardwaremedia__yes_de: 'Ja',
mediaencryption__no_de: 'Nein',
mediaencryption__auto_de: 'Auto',
mediaencryption__srtp_de: 'SRTP',
setqos__auto_de: 'Auto',
setqos__no_de: 'Nein',
setqos__yes_de: 'Ja',
codecframecount_auto_de: 'Auto',
doublesendrtp__no_de: 'Nein',
doublesendrtp__yes_de: 'Ja',
jittersize__no_de: 'kein Jitter',
jittersize__esmall_de: 'Extra schmal',
jittersize__small_de: 'schmal',
jittersize__normal_de: 'Normal',
jittersize__big_de: 'gross',
jittersize__ebig_de: 'Extra gross',
jittersize__max_de: 'Max',
speakermode__auto_de: 'Auto',
speakermode__never_de: 'Nie',
speakermode__always_de: 'immer',
autoignore__dont_de: 'nicht ignorieren',
autoignore__silently_de: 'Stillschweigend ignorieren',
autoignore__reject_de: 'Ablehnen',
transfwithreplace__auto_de: 'Auto',
transfwithreplace__no_de: 'Nein',
transfwithreplace__yes_de: 'Ja',
transfertype__unattended_de: 'Unbeaufsichtigt fallen lassen',
transfertype__withhold_de: 'unbeaufsichtigt halten',
transfertype__attanded_de: 'Attanded (erster Anruf)',
automute__no_de: 'Nein (standard)',
automute__incoming_de: 'Fuer das Routing ankommender Anrufe',
automute__outgoing_de: 'Bei ausgehenden Anrufen',
automute__both_de: 'Fuer eingehende und ausgehende Anrufe',
automute__other_line_de: 'Auf der anderen Linie klicken Sie auf die Schaltflaeche',
autohold__no_de: 'Nein (standard)',
autohold__incoming_de: 'Fuer das Routing ankommender Anrufe',
autohold__outgoing_de: 'Bei ausgehenden Anrufen',
autohold__both_de: 'Fuer eingehende und ausgehende Anrufe',
autohold__other_line_de: 'Auf der anderen Linie klicken Sie auf die Schaltflaeche',
normalizenumber__no_de: 'Nein',
normalizenumber__yes_de: 'Ja',
savetocontacts__no_de: 'Nein',
savetocontacts__ask_de: 'fragen',
savetocontacts__yes_de: 'Ja (den Namen eines Kontakts speichern?)',


sett_display_name_serveraddress_user_de: 'Server',
sett_comment_serveraddress_user_de: 'Enter server adress (domain or IP:port), brand-name or op-code here',
sett_comment_serveraddress_user_gmsdialer_de: 'Geben Sie den Operator Code ein',
sett_comment_short_serveraddress_user_de: 'kurze Server Adresse',
sett_comment_serveraddress_user_operator_de: 'Geben Sie den Operator Code ein',

sett_display_name_sipusername_de: 'Benutzername',
sett_comment_sipusername_de: 'Ihr SIP-Benutzername wird fuer die Authentifizierung verwendet.',
sett_comment_short_sipusername_de: 'VoIP Account Benutzername',    

sett_display_name_password_de: 'Passwort',
sett_comment_password_de: 'Geben Sie das Kennwort für Ihr SIP-Konto ein',
sett_comment_short_password_de: 'VoIP Account Passwort',

sett_display_name_startwithos_de: 'Starten mit Windows',
sett_comment_startwithos_de: 'Starten wenn Windows startet',
sett_comment_short_startwithos_de: 'start mit windows',

sett_display_name_startonboot_de: 'starte im Hintergrund',
sett_comment_startonboot_de: 'Laeuft immer für eingehende Anrufe (Service laeuft im Hintergrund, damit eingehende Anrufe empfange werden koennen)',
sett_comment_short_startonboot_de: '',

sett_display_name_codec_de: 'Audio Codec',
sett_comment_codec_de: 'waehle bevorzugten Codec',
sett_checkbox_codec_de: 'benuetze bevorzugten Codec',
sett_comment_short_codec_de: '',

sett_display_name_dtmfmode_de: 'DTMF',
sett_comment_dtmfmode_de: 'Choose DTMF (DialTone) sende Methode',
sett_comment_short_dtmfmode_de: '',

sett_display_name_register_de: 'Registrierung',
sett_comment_register_de: 'Registrieren Sie die Domain. Dies ist immer erforderlich, um eingehende Anrufe zu empfangen. Einige Anbieter verlangen das auch für ausgehende Anrufe.',
sett_comment_short_register_de: 'Aktiviere / Deaktiviere der Registrierung zu SIP-Domain',

sett_display_name_registerinterval_de: 'Registerungs Interval',
sett_comment_registerinterval_de: '(Re)Registerungszeit Interval in Sekunden',
sett_comment_short_registerinterval_de: '',

sett_display_name_filters_de: 'Anzahl umzuschreiben',
sett_comment_filters_de: 'Ziel hinzufügen Anzahl Rewrite Regeln (Hinzufügen/Entfernen/rewrite Präfix)',
sett_comment_short_filters_de: '',

sett_display_name_earlymedia_de: 'Senden Sie frühe Medien',
sett_comment_earlymedia_de: 'Start to send media when session progress is received',
sett_comment_short_earlymedia_de: '',

sett_display_name_transfertype_de: 'Transfer type',
sett_comment_transfertype_de: 'Choose call transfer method',
sett_comment_short_transfertype_de: '',

sett_display_name_playring_de: 'Ringback for',
sett_comment_playring_de: 'Generate ringtone for incoming and outgoing calls',
sett_comment_short_playring_de: '',

//sett_display_name_autoanswer_forward_de: 'Auto answer, forward or ignore',
//sett_comment_autoanswer_forward_de: 'Automatically handle all incoming calls',
//sett_comment_short_autoanswer_forward_de: '',

sett_display_name_proxyaddress_de: 'Proxy address',
sett_comment_proxyaddress_de: 'Outbound SIP proxy address. Leave it empty if you don’t have a stateless/outbound proxy',
sett_comment_short_proxyaddress_de: 'Outbound proxy address',

sett_display_name_realm_de: 'Realm',
sett_comment_realm_de: 'Set the SIP realm if not the same with the serveraddress or domain',
sett_comment_short_realm_de: '',

sett_display_name_voicemailnum_de: 'Voicemail',
sett_comment_voicemailnum_de: 'Set voicemail number which will be used if not received automatically',
sett_comment_short_voicemailnum_de: 'Set voicemail access number',

sett_display_name_use_stun_de: 'Use STUN',
sett_comment_use_stun_de: 'Change if you have NAT related issues (can\'t register, can\'t call, no voice problems)',
sett_comment_short_use_stun_de: 'Enable external address discovery',

sett_display_name_use_fast_ice_de: 'Use ICE',
sett_comment_use_fast_ice_de: 'Fast ICE negotiations (for p2p rtp routing).<br />Note: if set to "Auto" or "Yes" then STUN should not be disabled',
sett_comment_short_use_fast_ice_de: '',

sett_display_name_techprefix_de: 'Tech. prefix',
sett_comment_techprefix_de: 'Add any prefix for all called numbers',
sett_comment_short_techprefix_de: '',

sett_display_name_volumein_de: 'Volume in',
sett_comment_volumein_de: 'Set default microphone volume between 0 and 100%. 50 means no volume changes.',
sett_comment_short_volumein_de: '',

sett_display_name_volumeout_de: 'Volume out',
sett_comment_volumeout_de: 'Set default speaker volume between 0 and 100%. 50 means no volume changes.',
sett_comment_short_volumeout_de: '',

sett_display_name_prack_de: 'Use PRACK',
sett_comment_prack_de: '100rel support. Should be enabled only if your server require this',
sett_comment_short_prack_de: '',

sett_display_name_ringtimeout_de: 'Ring timeout',
sett_comment_ringtimeout_de: 'Maximum ringing time allowed in seconds. Default is 90 seconds',    
sett_comment_short_ringtimeout_de: '',

sett_display_name_calltimeout_de: 'Call timeout',
sett_comment_calltimeout_de: 'Maximum speech time allowed in seconds. Default is 10800 seconds which means 3 hours',
sett_comment_short_calltimeout_de: '',

sett_display_name_username_de: 'Caller ID',
sett_comment_username_de: 'This will not be used for authentication. Specify if not the same with the Username for authentication setting. Some VoIP servers will reject if not the same with the username!',
sett_comment_short_username_de: 'You might set a different username here used for A number display',

sett_display_name_displayname_de: 'Display name',
sett_comment_displayname_de: 'Specify display name. This is an optional setting and it should be your full name',
sett_comment_short_displayname_de: 'Set display name',

sett_display_name_theme_de: 'Theme',
sett_comment_theme_de: 'Change skin colors',
sett_comment_short_theme_de: '',

sett_display_name_hidemyidentity_de: 'Hide my identity',
sett_comment_hidemyidentity_de: 'Hide my identity',
sett_comment_short_hidemyidentity_de: '',

sett_display_name_localip_de: 'Local IP address',
sett_comment_localip_de: 'Optionally specify local signaling IP address to use',
sett_comment_short_localip_de: '',

sett_display_name_signalingport_de: 'Local signaling port',
sett_comment_signalingport_de: 'Specify local IP address signaling port to use (default is a stable port initialized with a random value. This has nothing to do with the server SIP port which is usually 5060)',
sett_comment_short_signalingport_de: 'Optionally specify local signaling port to use',

sett_display_name_rtpport_de: 'Local RTP port',
sett_comment_rtpport_de: 'Specify local RTP port base (default is a stable port base initialized with a random value)',
sett_comment_short_rtpport_de: 'Specify local RTP port base',

sett_display_name_jittersize_de: 'Jitter size',
sett_comment_jittersize_de: 'The jitter buffer is used for smooth playback under variable bandwidth. The size is calculated dynamically, but its behavior can modified with this setting',
sett_comment_short_jittersize_de: '',

sett_display_name_forcewifi_de: 'Force WiFi',
sett_comment_forcewifi_de: '(Re)Enable and scan WiFi on startup, new call or connection lost (Even without this setting, WiFi will be the preferred when available)',
sett_comment_short_forcewifi_de: 'Keep the WiFi awake to handle incoming calls',

// callforwardonbusy,callforwardalways,calltransferalways,autoignore,autoaccept
sett_display_name_callforwardonbusy_de: 'Call forward',
sett_comment_callforwardonbusy_de: 'Set call forward number used when call is rejected on busy or for auto forward',
sett_comment_short_callforwardonbusy_de: '',

sett_display_name_callforwardalways_de: 'Call forward always',
sett_comment_callforwardalways_de: 'Set call forward number where all calls should be forwarded',
sett_comment_short_callforwardalways_de: '',

sett_display_name_calltransferalways_de: 'Call transfer',
sett_comment_calltransferalways_de: 'Set call transfer number where all calls should be transferred',
sett_comment_short_calltransferalways_de: '',

sett_display_name_autoignore_de: 'Auto ignore',
sett_comment_autoignore_de: 'Automtically ignore all incoming calls',
sett_comment_short_autoignore_de: '',

sett_display_name_autoaccept_de: 'Auto accept',
sett_comment_autoaccept_de: 'Automatically accept all incoming calls (auto answer)',
sett_comment_short_autoaccept_de: '',

sett_display_name_callforwardonreject_de: 'Call forward on reject',
sett_comment_callforwardonreject_de: 'Forward call if rejected',
sett_comment_short_callforwardonreject_de: '',

sett_display_name_rejectonvoipbusy_de: 'On VoIP busy',
sett_comment_rejectonvoipbusy_de: 'Set behavior if there is already a VoIP call in progress',
sett_comment_short_rejectonvoipbusy_de: '',

//OPSSTART
sett_display_name_usetunneling_de: 'Tunneling and encryption',
sett_comment_usetunneling_de: 'Use encrypted and tunneled transport layer (UDP, TCP or HTTP)',
sett_comment_short_usetunneling_de: 'Use alternative encrypted transport',
sett_comment_usetunneling_1_de: 'Useful in VoIP blocked countries and from behind firewalls. If you need to use this feature for more than a few calls, then you should upgrade to MizuDroidPro which includes unlimited tunneling service.',
sett_comment_usetunneling_2_de: 'Use signaling and media within encrypted tunnel.',
//OPSEND

sett_display_name_encryptionport_de: 'Encryption port',
sett_comment_encryptionport_de: 'Server base port used for encrypted transport',
sett_comment_short_encryptionport_de: '',
/*
sett_display_name_loglevel_de: 'Set log/trace level',
sett_comment_loglevel_de: 'Set log detail level when logs are enabled',
sett_comment_short_loglevel_de: '',
*/
sett_display_name_loglevel_de: 'Enable log',
sett_comment_loglevel_de: 'Save trace to file for later uploading to technical support',
sett_comment_short_loglevel_de: '',

sett_display_name_loglevel_dbg_de: 'Set log/trace level',
sett_comment_loglevel_dbg_de: 'Set log detail level when logs are enabled',
sett_comment_short_logleveldbg_de: '',

sett_display_name_rejectonphonebusy_de: 'On phone busy',
sett_comment_rejectonphonebusy_de: 'Set behavior if there is already a native phone call in progress',
sett_comment_short_rejectonphonebusy_de: '',

sett_display_name_proximitysensor_de: 'Proximity sensor',
sett_comment_proximitysensor_de: 'Turn off the screen while in call. This feature is turned off by default because most of the devices has problems when turned on',
sett_comment_short_proximitysensor_de: 'Turn off the screen wile near ear',

sett_display_name_aec_de: 'AEC',
sett_comment_aec_de: 'Acoustic echo cancellation. Turn on if your peers hears their echo.',
sett_comment_short_aec_de: '',

sett_display_name_agc_de: 'AGC',
sett_comment_agc_de: 'Automatic gain control. Will control the volume automatically.',
sett_comment_short_agc_de: '',

sett_display_name_denoise_de: 'Denoise',
sett_comment_denoise_de: 'Remove noise from the conversation (such as background noise or noise generated by the microphone).',
sett_comment_short_denoise_de: '',

sett_display_name_silencesupress_de: 'Silence suppression',
sett_comment_silencesupress_de: 'Do not transmit media when you do not speak. Enable only if your if your bandwidth is really poor.',
sett_comment_short_silencesupress_de: '',

sett_display_name_plc_de: 'PLC',
sett_comment_plc_de: 'Packet loss concealment. Helps to improve the call quality on packet loss which occurs on low quality networks',
sett_comment_short_plc_de: '',

sett_display_name_callback_mode_de: 'Callback mode',
sett_comment_callback_mode_de: 'Chose when to use callback if any',
sett_comment_short_callback_mode_de: '',

sett_display_name_email_de: 'Email',
sett_comment_email_de: 'Your email address (useful for any technical support)',
sett_comment_short_email_de: 'Your email address',

sett_display_name_chatsms_de: 'Chat/SMS',
sett_comment_chatsms_de: 'Set messaging method',
sett_comment_short_chatsms_de: '',

sett_display_name_savetocontacts_de: 'New contacts',
sett_comment_savetocontacts_de: 'Whether to (automatically) add new unknown called numbers to your contact list',
sett_comment_short_savetocontacts_de: 'Add new contacts to contact list',

sett_display_name_call_access_de: 'Call access number',
sett_comment_call_access_de: 'IVR access number to call from mobile operator network',
sett_comment_short_call_access_de: 'Access number to call from mobile operator network',

sett_display_name_unlockphone_de: 'Unlock keyguard',
sett_comment_unlockphone_de: 'Automatically unlock phone keyguard on incoming call',
sett_comment_short_unlockphone_de: '',

sett_display_name_audiorecorder_de: 'Audio recorder',
sett_comment_audiorecorder_de: 'Select audio recorder stream for calls. Should be changed only on special devices or if you have special requirements or the automatic setting is not the preferred',
sett_comment_short_audiorecorder_de: '',

sett_display_name_audioplayer_de: 'Audio player',
sett_comment_audioplayer_de: 'Select audio player stream for calls. Should be changed only on special devices or if you have special requirements or the automatic setting is not the preferred',
sett_comment_short_audioplayer_de: '',

sett_display_name_speakerphoneplayer_de: 'Speakerphone player',
sett_comment_speakerphoneplayer_de: 'Select audio speakerphone player stream. Should be changed only on special devices or if you have special requirements or the automatic setting is not the preferred',
sett_comment_short_speakerphoneplayer_de: '',

sett_display_name_speakerphoneoutput_de: 'Audio mode',
sett_comment_speakerphoneoutput_de: 'Select the output device when you switch to speakerphone',
sett_comment_short_speakerphoneoutput_de: '',

sett_display_name_keepalive_de: 'Keep-alive',
sett_comment_keepalive_de: 'Will send a short packet in the specified time interval (seconds) to open and keep your NAT device (router) opened in order to enable incoming calls and other notifications',
sett_comment_short_keepalive_de: 'Keep your NAT opened',

sett_display_name_mediaencryption_de: 'Media encryption',
sett_comment_mediaencryption_de: 'Set media encryption method',
sett_comment_short_mediaencryption_de: '',

sett_display_name_setqos_de: 'QoS',
sett_comment_setqos_de: 'Sets traffic class or type-of-service octet in the IP header for UDP packets',
sett_comment_short_setqos_de: '',

sett_display_name_codecframecount_de: 'RTP Frame/Packet',
sett_comment_codecframecount_de: 'Number of codec payloads in one UDP/RTP packet. Higher values will require less bandwidth but more delays. Unusual values (above 4) can cause incompatibility with your provider.',
sett_comment_short_codecframecount_de: 'Number of codec payloads in one UDP packet',

sett_display_name_doublesendrtp_de: 'Double send RTP',
sett_comment_doublesendrtp_de: 'Might improve audio quality in certain circumstances, but will increase upload data amount',
sett_comment_short_doublesendrtp_de: 'Double send RTP packets',

sett_display_name_cfgcpuspeed_de: 'CPU Speed',
sett_comment_cfgcpuspeed_de: 'Features such as AEC or codec are turned on/off based on your device processor speed',
sett_comment_short_cfgcpuspeed_de: 'Features are selected automatically based on your CPU speed',

sett_display_name_cfgnetworkspeed_de: 'Network Speed',
sett_comment_cfgnetworkspeed_de: 'Helps to choose the best codec and media enhancements for your calls.',
sett_comment_short_cfgnetworkspeed_de: '',

sett_display_name_accounts_de: 'Accounts',
sett_comment_accounts_de: 'Manage your SIP accounts/profiles.',
sett_comment_short_accounts_de: '',

sett_display_name_extraoption_de: 'Extra options',
sett_comment_extraoption_de: 'Set any custom parameters in a key-value pair list, separated by semicolon.<br />Ex: displayname=John;',
sett_comment_short_extraoption_de: 'Set any custom parameters',

sett_display_name_reset_settings_de: 'Reset settings',
sett_comment_reset_settings_de: 'Reset settings to their default values',
sett_comment_short_reset_settings_de: '',

sett_display_name_ringtone_de: 'Ringtone',
sett_comment_ringtone_de: 'Change your ringtone for incoming calls',
sett_comment_short_ringtone_de: '',

sett_display_name_changesptoring_de: 'Ring on session progress',
sett_comment_changesptoring_de: 'Treat session progress (183) responses as ringing (180). This might be required if your service provider doesn\'t send ringing nor early media',
sett_comment_short_changesptoring_de: 'Treat session progress (183) responses as ringing (180)',

sett_display_name_transport_de: 'Transport protocol',
sett_comment_transport_de: 'Select transport layer',
sett_comment_short_transport_de: '',

sett_display_name_defmute_de: 'Mute direction',
sett_comment_defmute_de: 'Specify how to mute the calls when mute button is pressed',
sett_comment_short_defmute_de: '',

sett_display_name_automute_de: 'Mute on new call',
sett_comment_automute_de: 'Specify whether existing calls should be muted on a new call',
sett_comment_short_automute_de: '',

sett_display_name_autohold_de: 'Hold on new call',
sett_comment_autohold_de: 'Specify whether existing calls should be held on a new call',
sett_comment_short_autohold_de: '',

sett_display_name_customsipheader_de: 'Custom SIP header',
sett_comment_customsipheader_de: 'Set a custom sip header (a line in the SIP signaling) that will be sent with all SIP messages (Expert setting)',
sett_comment_short_customsipheader_de: '',

sett_display_name_enginepriority_java_de: 'Java applet priority',
sett_comment_enginepriority_java_de: 'Set java applet engine priority',
sett_comment_short_enginepriority_java_de: '',

sett_display_name_enginepriority_webrtc_de: 'WebRTC priority',
sett_comment_enginepriority_webrtc_de: 'Set WebRTC engine priority',
sett_comment_short_enginepriority_webrtc_de: '',

sett_display_name_enginepriority_ns_de: 'Service plugin priority',
sett_comment_enginepriority_ns_de: 'Set service plugin engine priority',
sett_comment_short_enginepriority_ns_de: '',

sett_display_name_enginepriority_flash_de: 'Flash priority',
sett_comment_enginepriority_flash_de: 'Set flash engine priority',
sett_comment_short_enginepriority_flash_de: '',

sett_display_name_enginepriority_app_de: 'App priority',
sett_comment_enginepriority_app_de: 'Set app engine priority',
sett_comment_short_enginepriority_app_de: '',

sett_display_name_enginepriority_p2p_de: 'P2P priority',
sett_comment_enginepriority_p2p_de: 'Set phone to phone engine priority',
sett_comment_short_enginepriority_p2p_de: '',

sett_display_name_enginepriority_accessnum_de: 'Access number priority',
sett_comment_enginepriority_accessnum_de: 'Set access number engine priority',
sett_comment_short_enginepriority_accessnum_de: '',

sett_display_name_enginepriority_nativedial_de: 'Native dialer priority',
sett_comment_enginepriority_nativedial_de: 'Set native dialer engine priority',
sett_comment_short_enginepriority_nativedial_de: '',

sett_display_name_sendrtponmuted_de: 'Send media on muted',
sett_comment_sendrtponmuted_de: 'Send RTP even if muted (zeroed packets). Set to true only if your server is malfunctioning when RTP is suppressed',
sett_comment_short_sendrtponmuted_de: '',

sett_display_name_capabilityrequest_de: 'Capability request',
sett_comment_capabilityrequest_de: 'If set, then will send a capability request (OPTIONS) message to the SIP server on startup',
sett_comment_short_capabilityrequest_de: '',

sett_display_name_dialerintegration_de: 'Integrate',
sett_comment_dialerintegration_de: 'When dialing with native dialer you\'ll be asked if you want to use SIP or mobile',
sett_comment_short_dialerintegration_de: '',

sett_display_name_devtest_de: 'Developer tests',
sett_comment_devtest_de: 'Used for development only',
sett_comment_short_devtest_de: '',

sett_display_name_settobasefunctionality_de: 'Set to base functionality',
sett_comment_settobasefunctionality_de: 'Used for development',
sett_comment_short_settobasefunctionality_de: '',

sett_display_name_enableaudio_de: 'Enable audio',
sett_comment_enableaudio_de: 'Used only for tests',
sett_comment_short_enableaudio_de: '',

sett_display_name_screenrotation_de: 'Screen rotation',
sett_comment_screenrotation_de: 'Control screen orientation',
sett_comment_short_screenrotation_de: 'Control screen orientation',

sett_display_name_audiobufferlength_de: 'Audiobuffer length',
sett_comment_audiobufferlength_de: '-1 means auto. Valid values are between 160 and 16000. Expert setting.',
sett_comment_short_audiobufferlength_de: 'Advanced setting for the audio playback buffer size',

sett_display_name_p2p_de: 'Phone 2 Phone URI',
sett_comment_p2p_de: 'Phone 2 Phone http request',
sett_comment_short_p2p_de: 'Server HTTP API if any',

sett_display_name_callback_de: 'Callback URI',
sett_comment_callback_de: 'Callback HTTP request',
sett_comment_short_callback_de: 'Server HTTP API if any',

sett_display_name_sms_de: 'SMS URI',
sett_comment_sms_de: 'SMS HTTP request',
sett_comment_short_sms_de: 'Server HTTP API if any',

sett_display_name_creditrequest_de: 'Balance URI',
sett_comment_creditrequest_de: 'Balance HTTP request',
sett_comment_short_creditrequest_de: 'Server HTTP API if any',

sett_display_name_ratingrequest_de: 'Rating URI',
sett_comment_ratingrequest_de: 'Rating HTTP request',
sett_comment_short_ratingrequest_de: 'Server HTTP API if any',

sett_display_name_displaynotification_de: 'Display notification',
sett_comment_displaynotification_de: 'Show notifications in phone notification bar (usually on the top corner of your phone)',
sett_comment_short_displaynotification_de: 'Show notifications in phone notification bar',

sett_display_name_displayvolumecontrols_de: 'Always display volume',
sett_comment_displayvolumecontrols_de: 'Always display volume controls when in call',
sett_comment_short_displayvolumecontrols_de: '',

sett_display_name_displayaudiodevice_de: 'Always display audio device',
sett_comment_displayaudiodevice_de: 'Always display audio device when in call',
sett_comment_short_displayaudiodevice_de: '',

sett_display_name_audiodevices_de: 'Audio devices',
sett_comment_audiodevices_de: 'Audio device settings will be available from the call page menu once you login',
sett_comment_short_audiodevices_de: '',

sett_display_name_cpualwayspartiallock_de: 'CPU always partial lock',
sett_comment_cpualwayspartiallock_de: 'Keep the device processor always awake. Set only if otherwise you loose registrations and don\'t receive incoming calls',
sett_comment_short_cpualwayspartiallock_de: 'Keep a partial lock on the CPU to prevent deep sleep',

sett_display_name_disablewbforpstn_de: 'Disable wideband for PSTN',
sett_comment_disablewbforpstn_de: 'Disable wideband audio codecs for calls to mobile/landline numbers (wideband only for IP to IP calls)',
sett_comment_short_disablewbforpstn_de: '',

sett_display_name_multiplecalls_de: 'Allow multiple calls',
sett_comment_multiplecalls_de: 'Allow multiple calls / conference (low-end CPU is not capable to handle)',
sett_comment_short_multiplecalls_de: '',

sett_display_name_callbacknumber_de: 'Callback number',
sett_comment_callbacknumber_de: 'Callback access number. Some VoIP service providers provide this kind of number which you can ring and receive incoming call from server IVR',
sett_comment_short_callbacknumber_de: 'Callback access number',

sett_display_name_blacklist_de: 'Blacklist',
sett_comment_blacklist_de: 'Blacklisted numbers separated by comma',
sett_comment_short_blacklist_de: '',

sett_display_name_storecallhistory_de: 'Call history storage',
sett_comment_storecallhistory_de: 'Specify where to store the call history',
sett_comment_short_storecallhistory_de: '',

sett_display_name_keepdeviceawakeincall_de: 'Keep device awake incall',
sett_comment_keepdeviceawakeincall_de: 'Keep device awake during calls',
sett_comment_short_keepdeviceawakeincall_de: '',

sett_display_name_speakermode_de: 'Speaker mode',
sett_comment_speakermode_de: 'Speaker mode',
sett_comment_short_speakermode_de: '',

sett_display_name_focusaudio_de: 'Focus audio',
sett_comment_focusaudio_de: 'Focus on VoIP call audio (this might lower the volume for other streams such as your media player while you are speaking on VoIP)',
sett_comment_short_focusaudio_de: 'Focus on VoIP audio',

sett_display_name_useroutingapi_de: 'Use routing API',
sett_comment_useroutingapi_de: 'Use routing API for compatibility reasons. Some -usually old- devices might need this for correct audio handling',
sett_comment_short_useroutingapi_de: '',

sett_display_name_hardwaremedia_de: 'Hardware media',
sett_comment_hardwaremedia_de: 'Use hardware media enhancements such as AEC and denoise. This might add a slight delay for the audio streams',
sett_comment_short_hardwaremedia_de: 'Use hardware media enhancements.',

sett_display_name_autousebluetooth_de: 'Auto Bluetooth',
sett_comment_autousebluetooth_de: 'Auto use Bluetooth when available',
sett_comment_short_autousebluetooth_de: '',

sett_display_name_nativefilterallow_de: 'Allowed prefixes',
sett_comment_nativefilterallow_de: 'Handle native calls if number starts with',
sett_comment_short_nativefilterallow_de: '',

sett_display_name_nativefilterblock_de: 'Not allowed prefixes',
sett_comment_nativefilterblock_de: 'Don\'t handle native calls if number starts with',
sett_comment_short_nativefilterblock_de: '',

sett_display_name_integrateifwifionly_de: 'Integrate if Wifi only',
sett_comment_integrateifwifionly_de: 'Integrate with native dialer only if Wifi is connected',
sett_comment_short_integrateifwifionly_de: '',

sett_display_name_cfgvideo_de: 'Enable video',
sett_comment_cfgvideo_de: 'Enable video calls',
sett_comment_short_cfgvideo_de: '',

sett_display_name_video_de: 'Enable video',
sett_comment_video_de: 'Enable video calls',
sett_comment_short_video_de: '',

sett_display_name_video_bandwidth_de: 'Video bandwidth',
sett_comment_video_bandwidth_de: 'Set the bandwidth of video',
sett_comment_short_video_bandwidth_de: '',

sett_display_name_video_width_de: 'Video width',
sett_comment_video_width_de: 'Set the width of video in pixels',
sett_comment_short_video_width_de: '',

sett_display_name_video_height_de: 'Video height',
sett_comment_video_height_de: 'Set the height of video in pixels',
sett_comment_short_video_height_de: '',

sett_display_name_video_profile_de: 'Video quality',
sett_comment_video_profile_de: 'Set video quality',
sett_comment_short_video_profile_de: '',

sett_display_name_use_h263_de: 'Use H263 codec',
sett_comment_use_h263_de: 'Use H263 video codec',
sett_comment_short_use_h263_de: '',

sett_display_name_use_h264_de: 'Use H264 codec',
sett_comment_use_h264_de: 'Use H264 video codec',
sett_comment_short_use_h264_de: '',

sett_display_name_vibrate_de: 'Vibrate',
sett_comment_vibrate_de: 'Vibrate on incoming calls',
sett_comment_short_vibrate_de: '',

sett_display_name_video_fps_de: 'Video FPS',
sett_comment_video_fps_de: 'Set video framerate, 0 means automatic',
sett_comment_short_video_fps_de: '',

sett_display_name_setfinalcodec_de: 'Set final codec',
sett_comment_setfinalcodec_de: 'Workaround for multiple codec negotiation issues',
sett_comment_short_setfinalcodec_de: '',

sett_display_name_use_rport_de: 'Use rport',
sett_comment_use_rport_de: 'Rport usage in Via header',
sett_comment_short_use_rport_de: '',

sett_display_name_normalizenumber_de: 'Normalize number',
sett_comment_normalizenumber_de: 'Remove special characters from dialed numbers',
sett_comment_short_normalizenumber_de: '',

sett_display_name_natopenpackets_de: 'NAT open packets',
sett_comment_natopenpackets_de: 'UDP packets to send to open the NAT device (change if you have NAT issues)',
sett_comment_short_natopenpackets_de: '',

sett_display_name_sendchatonenter_de: 'Chat on enter',
sett_comment_sendchatonenter_de: 'Send chat on enter key press',
sett_comment_short_sendchatonenter_de: '',

sett_display_name_transfwithreplace_de: 'Transfer with replace',
sett_comment_transfwithreplace_de: 'Specify if replace should be used with transfer so the old call (dialog) is not disconnected but just replaced. This way the A party is never disconnected, just the called party is changed. The A party must be able to handle the replace header for this.',
sett_comment_short_transfwithreplace_de: 'Specify if replace should be used with transfer so the old call (dialog) is not disconnected but just replaced.',



sett_display_name_submenu_sipsettings_de: 'SIP Settings...',
sett_comment_submenu_sipsettings_de: 'SIP related configurations',
sett_comment_short_submenu_sipsettings_de: '',

sett_display_name_submenu_media_de: 'Media Settings...',
sett_comment_submenu_media_de: 'Voice codec, quality and device',
sett_comment_short_submenu_media_de: '',

sett_display_name_submenu_video_de: 'Video...',
sett_comment_submenu_video_de: 'Video related settings',
sett_comment_short_submenu_video_de: '',

sett_display_name_submenu_sounddevicevolume_de: 'Sound Device and Volume...',
sett_comment_submenu_sounddevicevolume_de: 'Sound playback and recording',
sett_comment_short_submenu_sounddevicevolume_de: '',

sett_display_name_submenu_calldivert_de: 'Call Divert Settings...',
sett_comment_submenu_calldivert_de: 'Forward, transfer, rewrite',
sett_comment_short_submenu_calldivert_de: '',

sett_display_name_submenu_calldivert_advanced_de: 'Advanced settings...',
sett_comment_submenu_calldivert_advanced_de: 'More settings',
sett_comment_short_submenu_calldivert_advanced_de: '',

sett_display_name_advancedsettings_de: 'Advanced settings...',
sett_comment_advancedsettings_de: 'Show advanced settings',
sett_comment_short_advancedsettings_de: '',

sett_display_name_entersettings_de: 'Settings...',
sett_comment_entersettings_de: 'Show settings',
sett_comment_short_entersettings_de: '',

sett_display_name_submenu_general_de: 'General Settings...',
sett_comment_submenu_general_de: 'Other settings',
sett_comment_short_submenu_general_de: '',

sett_display_name_submenu_integrate_de: 'Dialer integration...',
sett_comment_submenu_integrate_de: 'When dialing with native dialer you\'ll be asked if you want to use SIP or mobile',
sett_comment_short_submenu_integrate_de: '',

sett_display_name_submenu_advanced_de: 'Advanced settings... ',
sett_comment_submenu_advanced_de: 'More settings',
sett_comment_short_submenu_advanced_de: '',


/*--------- #language# it Italian ---------*/

settings_title_it: 'Impostazioni',

btn_audio_device_it: 'Dispositivi audio',

unmuted_it: 'Muto off',
muted_it: 'Muto ON',

ie_update_it: 'Questa applicazione richiede una nuova versione di Internet Explorer. Vuoi effettuare il download?',

install_java_it: 'Java è richiesto: https://java.com/download/',

serviceengine_title_it: 'Utilizzo del plugin',
serviceengine_msg_it: 'Installare il plugin per migliorare le prestazioni',
np_download_it: 'Download del plugin',
np_install_title_it: 'Plugin nativo',
np_popup_title_it: 'Plugin nativo',
np_popup_msg_it: 'È necessario installare il plugin per utilizzare il telefono.',
np_successfully_installed_it: 'Plugin installato con successo.',

hint_dialpad_dtmf_it: 'Invio DTMF',

audio_title_it: 'Impostazioni audio',
audio_mic_it: 'Microfono',
audio_rec_it: 'Uscita audio',
audio_ring_it: 'Squillo',
video_rec_it: 'Videocamera',
audio_aec_it: 'AEC',
audio_agc_it: 'AGC',
audio_all_devices_it: 'Tutti',

service_update_it: 'Una nuova versione del plugin è disponibile. Si raccomanda di aggiornare appena possibile.',

err_flash_local_it: 'Il motore Flash funziona solo su un webserver pubblico, non su un file system locale',

np_install_msg_it: 'Avviare la installazione dopo il download.<br>Premere OK quando è stata completata.'


};

var lang = '';
var langshort = '';

function get(resName)
{
    if (typeof (resName) === 'undefined' || resName === null) { return ''; }

    resName = resName.toLowerCase();
    if (typeof (lang) === 'undefined' || lang === null) { lang = ''; }

    //get exact translation such as "hu-HU"
    var reslang = resName + lang;
    if (typeof (StringResources[reslang]) !== 'undefined' && StringResources[reslang] !== null)
    {
        return StringResources[reslang];
    }

    if(langshort.length > 0)
    {
        //get short language such as "hu"
        reslang = resName + langshort;
        if (typeof (StringResources[reslang]) !== 'undefined' && StringResources[reslang] !== null)
        {
            return StringResources[reslang];
        }
    }

    //get original/default english
    if (typeof (StringResources[resName]) !== 'undefined' && StringResources[resName] !== null)
    {
        return StringResources[resName];
    }

    return '';

    
    if (typeof (StringResources[reslang]) === 'undefined' || StringResources[reslang] === null)
    {
        if (typeof (StringResources[resName]) === 'undefined' || StringResources[resName] === null)
        {
            return '';
        }
    }else
    {
        return StringResources[reslang];
    }

    return StringResources[resName];
}

function setlang(lan)
{
    //var available_lan = ['en', 'hu', 'pt', 'br'];
    if (typeof (lan) === 'undefined' || lan === null || lan.length < 1)
    {
        try{ if (console && console.log) { console.log('ERROR, invalid language: ' + lan); } }catch (e){}
        return;
    }

    if (lan === 'br') { lan = 'pt'; } // for brazil we use portugal
    lang = '_' + lan.toLowerCase();

    langshort = '';
    if(lan.length > 2)
    {
        if(lan.indexOf('-') > 0) langshort = lan.substr(0,lan.indexOf('-'));
        else if(lan.indexOf('_') > 0) langshort = lan.substr(0,lan.indexOf('_'));

        if(langshort.length > 0) langshort = '_' + langshort.toLowerCase();
    }
}

return{
    get: get,
    setlang: setlang
};
})();
//TRANSLTEND
//file modified by MTranslate at 9/24/2022 18:55:15 changed: 5
