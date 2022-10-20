
These are optional modules for the webphone and java SDK.
Just copy these files near the jar (so extract the files from this mediaench directory and copy them near the webphone.jar or JVoIP.jar)


DETAILS:

The webphone/JVoIP will work fine also without these files, but having them accessible might increase the voice quality and will add some more audio codec (but most codec's are implemented in pure java).
The files should be stored near the main jar file (on local file system or on your web server) and you might have to enable the dll, so and dylib mime type on your web server if used in a web project (or set the "mediaenchext" applet parameter to "jar" and rename dll with jar in file name extensions). If the files cannot be found or loaded than the webphone will just not use these features or will failback to pure java code and it will remain fully functional.
When served from a webserver, the webphone will download one of these libraries only at the first usage. Subsequent usage will be served from the browser local cache.


TODO:

1. Deploy
Unpack the mediaench.zip and copy the files near your webphone.jar or JVoIP.jar

2. Enable mime types
Make sure that your web server allows the download of these resource types by allowing/adding the following mime types to your webserver configuration if not already added/allowed:
•	extension: .dll 	MIME type: application/x-msdownload (or application/x-msdownload)
•	extension: .jar 	MIME type: application/java-archive
•	extension: .jnilib	MIME type: application/java-archive
•	extension: .so  	MIME type: application/octet-stream
•	extension: .dylib	MIME type: application/octet-stream

3. Test
In case if you are using the webphone, test the files availability by trying to download the files from your browsers.
For example you should be able to download the mediaench.dll by entering it's exact URL in your browser:
http:\\yourdomain.com\path_to_webphone\mediaench.dll
If the browser doesn't initiate the file download (or displays an error) then you either typed the url incorrectly or your web server doesn't allow the .dll mime type.

