# requestWebcam

## Description

JS object to request access to the webcam and microphone of the user on the browser.

Can be used on:
    
    Desktop:
        Firefox;
        Google Chrome - with experimental packages permission;
        Chromium - with experimental packages permission;
        Opera;

    Mobile:
        Firefos - Android;
        Google Chrome - Android;
        Default browser - Android;
        
## How to use

Download the file requestWebcam.js or requestWebcam.min.js
Add this code in the html you want to use this API:
    
With requestWebcam.min.js:

```html
<script src="/folder/where/the/file/is/requestWebcam.min.js" type="text/javascript"></script>
```
    
With requestWebcam.js:

```html
<script src="/folder/where/the/file/is/requestWebcam.js" type="text/javascript"></script>
```
        
On your JS file is necessary to instantiate the object. Do it using this code:

```JavaScript
var webcam = new requestWebcam({
    video_in: document.getElementById( ... ),
    video_out: document.getElementById( ... ),
    name_video: 'Test.mp4',
    onGetPermission: function () { ... },
    onForgetPermission: function () { ... },
    onDeniedPermission: function (err) { ... }
    onStartRecording: function () { ... },
    onStopRecording: function () { ... },
    onDownload: function () { ... }
})
```
Meaning of the options:

    video_in -> HTML5 video element (<video>)
    video_out -> HTML5 video element (<video>)
    name_video -> Name of the file on download
    onGetPermission -> Callback function after getting permission
    onForgetPermission -> Callback function after forgetting all permissions
    onDeniedPermission -> Callback function if the permission is not granted
    onStartRecording -> Function to execute on event startRecording
    onStopRecording -> Function to execute on event stopRecording
    onDownload -> Function to execute on event Download

## Request access to webcam

After creating an instance of the object, you can request access to the webcam like this:

```JavaScript
webcam.requestWebcam()
```

After getting the permissions, if you have passed an HTML5 video element at video_in option, the feed will be displayed in the respective element.
    
## Recording the feed

After getting permission from the user, you can record the feed. This is done using the function:

```JavaScript
webcam.startRecording()
```
## Stop the recording

To stop the recording, you just need to call the function:

```JavaScript
webcam.stopRecording()
```

At this point, if you have passed an HTML5 video element at video_out option, the feed will be displayed in the respective element.

## Download the video recorded

You can also download the video after recording it. To do it, just use this code:

```JavaScript
webcam.Download()
```

## Forgetting permission access

After you get access to the hardware, unless the user go to another page or reload the page using the feed, the browser will keep the connection with the webcam/microphone open. This function is used to close the connection and forget the permission you got. The call is done like this:

```JavaScript
webcam.forgetPermission();
```
