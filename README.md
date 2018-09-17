# requestMedia

## Description

JS object to request access to the webcam and microphone of the user on the browser.

Can be used on:
    
    Desktop:
        Firefox;
        Google Chrome;
        Chromium;
        Opera;

    Mobile:
        Firefox - Android;
        Google Chrome - Android;
        Default browser - Android;
        
## How to use

Download the file requestMedia.js or requestMedia.min.js
Add this code in the html you want to use this API:
    
With requestMedia.min.js:

```html
<script src="/folder/where/the/file/is/requestMedia.min.js" type="text/javascript"></script>
```
    
With requestMedia.js:

```html
<script src="/folder/where/the/file/is/requestMedia.js" type="text/javascript"></script>
```
        
On your JS file is necessary to instantiate the object. Do it using this code:

```JavaScript
var media = new requestMedia({
    feed_in: document.getElementById( ... ),
    feed_out: document.getElementById( ... ),
    name: 'Test.mp4',
    required_audio: true,
    required_video: true,
    file_type: 'video/mp4',
    onGetPermission: function () { ... },
    onForgetPermission: function () { ... },
    onDeniedPermission: function (err) { ... }
    onStartRecording: function () { ... },
    onStopRecording: function () { ... },
    onPictureTaken: function () { ... },
    onDownload: function () { ... }
})
```
Meaning of the options:

    feed_in -> HTML5 video element (<video>\<audio>)
    feed_out -> HTML5 video element (<video>\<audio>)
    name -> Name of the file on download
    file_type -> Type of file
    required_audio -> If you want to an audio device
    required_video -> If you want to use a video device
    onGetPermission -> Callback function after getting permission
    onForgetPermission -> Callback function after forgetting all permissions
    onDeniedPermission -> Callback function if the permission is not granted
    onStartRecording -> Function to execute on event startRecording
    onStopRecording -> Function to execute on event stopRecording
    onPictureTaken -> Function to execute on event PictureTaken
    onDownload -> Function to execute on event Download

## Request access to media

After creating an instance of the object, you can request access to the media like this:

```JavaScript
media.requestPermission()
```

After getting the permissions, if you have passed an HTML5 (video/audio) element at feed_in option, the feed will be displayed in the respective element.

## Recording video/audio

### Recording the feed

After getting permission from the user, you can record the feed. This is done using the function:

```JavaScript
media.startRecording()
```
### Stop the recording

To stop the recording, you just need to call the function:

```JavaScript
media.stopRecording()
```

At this point, if you have passed an HTML5 (video/audio) element at feed_out option, the file recorded will be displayed in the respective element.

## Taking a picture

### Setting the canvas

To take a picture, you'll need to set and start the canvas. You can do it like this:

```JavaScript
/*canvas -> element canvas.*/
media.setCanvas(canvas);

/*
width -> width you want to give your canvas.
We keep a 9/12 proportion on the canvas, like this -> heigth = width * 9/12.
*/
media.startCanvas(width);
```

### Taking the picture

To take the actual picture, after setting the canvas, tou just nedd to call this function:

```JavaScript
media.takePicture();
```

At this point you have your picture draw to the canvas, so you can do whatever you want with it.

## Download the file recorded

You can also download the file after recording it. To do it, just use this code:

```JavaScript
media.Download()
```

## Forgetting permission access

After you get access to the hardware, unless the user go to another page or reload the page, the browser will keep the connection with the webcam/microphone open. This function is used to close the connection and forget the permission you got. The call is done like this:

```JavaScript
media.forgetPermission();
```
