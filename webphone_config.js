/** 
* The WebPhone configuration settings can be specified below.
* The parameters can be also set at runtime by using the setparameter() function or by URL query parameters (prefixed with wp_ such as wp_username=xy).
* The serveraddress is the most important parameters which should be usually set here.
* If username/password is not set, then the user will have to set it at runtime usually from a login page. 
* See the documentation "Parameters" chapter for the details regarding the available parameters: https://www.mizu-voip.com/Portals/0/Files/Webphone_Documentation.pdf
*/

webphone_api.parameters = {
	//serveraddress: '',  //SET to your SIP server IP address, domain name or SRV DNS record (also set the :port if that is not the default 5060). Example: sip.myserveraddress.com:5070
	//proxyaddress: '',   //Optional SIP proxy address. Specify only if you must use an outbound SIP proxy which is different from the above serveraddress. 
	//webrtcserveraddress: '', //Optional websocket server URL if your VoIP server has WebRTC support. Example: wss://domain:8089/ws
	//transport: -1, //Optional SIP transport protocol. -1: auto detect, 0: UDP, 1: TCP, 2: TLS (usually doesn't have to be set)
	//username: '',  //Optional SIP account username (usually entered by the user, but for some special use cases or quick tests you might preset it here)
	//password: '',  //Optional SIP account password (usually entered by the user, but for some special use cases or quick tests you might preset it here)
	//textmessaging: -1, //just an example parameter which sets the enable/disable chat/sms parameter to its default value
	loglevel: 5 //5 means detailed logs. It might be set it to 1 in production. The logs can be viewed in the browser console.
	
	//There are a lot of other optional parameters that you might set here (or pass via URL or via the API at runtime if their value is not static). 
	//See the documentation for the complete list of available settings ("Parameters" chapter) and insert any other parameters here if needed.	
	//Comma is NOT needed after the last parameter.
};
