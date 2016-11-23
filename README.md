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
webcam = new requestWebcam()
```

You can pass two parameters to this function:
    
    video_in: ID of the html element(<video/>) you want to display the webcam's feed.
    Video_out: ID of the html element(<video/>) you want to display the video after recording.
    
The code would be something like this:

```JavaScript
webcam = new requestWebcam(video_in, video_out)
```

## Requesting access to webcam

After creating an instance of the onject, you can request access to the webcam like this:

```JavaScript
webcam.requestWebcam()
```

You can pass two parameters to this functions:
    
    success: it must be a function. This function will be called if the user grants access.
    error: it must be a function. This function will be called in case of error or in case the user does not grant permission. It can be an function like this ```JavaScript function() { //do something};``` or ```JavaScript function(e) {//do something with the error info}```
    
## Recording the feed


    
    
    
    
    
