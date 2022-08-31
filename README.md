# Ringplan Lite
This project is an adaptation of the SipML5-NG codebase for use by the Ringplan platform, both as a standalone webapp and as an embedable client.



---
# SIPml5-NG
On May 14th, 2012 SIPml5, the world's first open Source HTML SIP client was released. SIPml5 had captivated the mind of RTC pioneers
  in the open source communities. However, as time pregressed, its creator Doubango Telecom had abandoned the project. On Feb 8th, 2018
  Doubango Telecom had released their final version of SIPml5 (version 2.1.4) - and since then the code base had remained unmaintained.

On June 17th, 2020 Cloudonix released its fork of the original SIPml5 project - SIPml5-NG. The new project picks up the project from that point and merges back to the project various patches and updates, provided by the Open Source community
and the various SIPml5 developer community.

SIPml5-NG is an open source (BSD license) HTML5 SIP client entirely written in javascript for integration in social networks (FaceBook, Twitter, Google+), online games, e-commerce websites, email signatures... No extension, plugin or gateway is needed. The media stack relies on WebRTC.

The client can be used to connect to any SIP or IMS network from your preferred browser to make and receive audio/video calls and instant messages.

# Javascript SIP/SDP stack
The SIP and SDP stacks (~1 Mo) are entirely written in javascript and the network transport uses WebSockets as per rfc7118. The live demo doesn't require any installation and can be used to connect to any SIP server using UDP, TCP or TLS transports.

Short but not exhaustive list of supported features:

- Works on Chrome, Firefox, IE, Safari, Opera and Bowser
- Audio / Video call
- Screen/Desktop sharing from Chrome to any SIP client
- Instant messaging
- Presence
- Call Hold / Resume
- Explicit Call transfer
- Multi-line and multi-account
- Dual-tone multi-frequency signaling (DTMF) using SIP INFO
- Click-to-Call
- SIP TelePresence (Video Group chat)
- 3GPP IMS standards

# Media Stack
The media stack depends on WebRTC (Web Real Time Communication) which is natively supported by the following browsers:

- Google Chrome
- Firefox
- Safari
- Microsoft Edge

# Interoperability
Using SIPml5-NG and cloudonix.io you can call any SIP-legacy endpoint or connected with any SIP compatible network.

Our testing and verification process includes testing using the following WebRTC/VoIP tools:

- SIP over WebSocket Servers
  - Asterisk
  - Freeswitch
  - Kamailio
  - OpenSIPS

- SIP over WebSocket Endpoints
  - webrtc.cloudonix.io

- Desktop Browsers
  - Google Chrome
  - Firefox
  - Safari
  - Edge

- Mobile Browsers
  - Google Chrome
  - Firefox
  - Safari

**The following browsers are known to be non-compatible or do not support WebRTC natively:**

- Opera
- Facebook Mobile Browser
- Mobile browsers provided by low end mobile vendors

# Where did the Asterisk patches go?
As of version 12 of the Asterisk project, support for SIP over WebSocket is native to the project. As the patches were required for
older versions, that are no longer supported or available - we had decided to remove that directory.

# License
The code is released under BSD terms. For more information: https://github.com/cloudonix/sipml5-ng/blob/wiki/License.md

# How to contribute to the project
If you have a patch for this project, please submit a pull request. Pull requests will be tested and verified for proper functionality and stability.
Once a patch had been accepted - it will be merged back into the upstream repository.

Project home page: [github.com/cloudonix/sipml5-ng](https://github.com/cloudonix/sipml5-ng) <br />
Download JS API: [SIPml-api.js](https://raw.githubusercontent.com/cloudonix/sipml5-ng/master/release/SIPml-api.js)
