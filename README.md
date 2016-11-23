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

1. Download the file requestWebcam.js or requestWebcam.min.js
2. Add this code in the html you want to use this API:
    
    With requestWebcam.min.js:
        '''html
        <script src="/folder/where/the/file/is/requestWebcam.min.js" type="text/javascript"></script>
        '''
    
    With requestWebcam.js:
        '''html
        <script src="/folder/where/the/file/is/requestWebcam.js" type="text/javascript"></script>
        '''
        
3. On your JS file is necessary to instantiate the object. Do it using this code:

    '''javascript
    webcam = new requestWebcam();
    '''
    
This object can accept two parameters. You can pass the ID of the html element(<video>) you want the feed to be displayed and the ID of the html element(<video>) you want to display the video after recording it. The code would be somethig like this:
    
    '''javascript
    webcam = new requestWebcam(video_in, video_out);
    '''
    
    
    
    
    
