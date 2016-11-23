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

## Request access to webcam

After creating an instance of the object, you can request access to the webcam like this:

```JavaScript
webcam.requestWebcam()
```

You can pass two parameters to this functions:
    
### success
It must be a function. This function will be called if the user grants access.

### error
It must be a function. This function will be called in case of error or in case the user does not grant permission. It can be an function like this:

```JavaScript
function() {
    //do something
}
```
Or:

```JavaScript
function(e) {
    //do something with the error info
}
```

After getting the permissions, if you have passed something on the paramenter video_in on the constructor, the feed will be displayed on the element with the respective ID.
    
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

This function can receive a function by parameter and execute it after stoping the recorder.
The code would be like this:

```JavaScript
function f() {
    //do something
};
webcam.stopRecording(f);
```
At this point, if we have passed something on the paramenter video_out on the constructor, the video recorded will be displayed on the element with the respective ID.

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
You can pass a function by parameter too. This function will be executed after removing all permissions the user granted before.

```JavaScript
funtion f(){
    //do something
}
webcam.forgetPermission(f);
```
