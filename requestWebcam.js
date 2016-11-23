/*
JS object to request access to the webcam and microphone of the user on the browser.

Can be used on:
    Desktop:
        Firefox;
        Google Chrome - with experimental packages permission;
        Chromium - with experimental packages permission;
        Opera;

    Mobile:
        Firefox - Android;
        Google Chrome - Android;
        Default browser - Android;
*/

function requestWebcam(video_in, video_out){
    /*
    Constructor of the object.

    video_in: receive the ID of an element(<video>) to display the webcam feed after getting permission.

    video_out: receive the ID of an element(<video>) to display the recorded file.
    */

    this.video_in = video_in || null;
    this.video_out = video_out || null;
    this.data_array = [];
    this.stream = null;
    this.recorder = null;
    this.blob = null;
    this.browser = navigator.userAgent;
}

requestWebcam.prototype.getVideo_in = function() {
    /*return the value of Video_in.*/

    return this.video_in;
};

requestWebcam.prototype.getVideo_out = function() {
    /*return the value of Video_out.*/

    return this.video_out;
};

requestWebcam.prototype.getData_array = function() {
    /*return the value of Data_array.*/

    return this.data_array;
};

requestWebcam.prototype.getStream = function() {
    /*return the value of Stream.*/

    return this.stream;
};

requestWebcam.prototype.getRecorder = function() {
    /*return the value of Recorder.*/

    return this.recorder;
};

requestWebcam.prototype.getBlob = function() {
    /*return the value of Blob.*/

    return this.blob;
};

requestWebcam.prototype.forgetPermission = function(f) {
    /*
    Forget the permission given by the user to access the webcam and microphone

    Optional:
    Receive a function by parameter to execute after removing all permissions.
    */

    for (var i = 0; i < this.stream.getTracks().length; i++) {
        this.stream.getTracks()[i].stop();
    }
    if (f && typeof f === 'function'){
        //Case we have received a function on parameter, we execute it after forgeting all permissions.
        f();
    }
}

requestWebcam.prototype.requestPermission = function(success, error) {
    /*
    Request permission from the user to access the microphone and webcam.

    Optional:
    success: Receive a function to execute after getting permission.
    error: Receive a function to execute in case of error. This function may hava a parameter to receive info on the error.

    TODO: Make possible to request only video or only audio;
    */

    var that = this;
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function(stm) {
        that.stream = stm;
        if (that.video_in) {
            /*Case we have received video_in, we display the webcam feed on the html element(<video>) with id equal to video_in.*/
            document.getElementById(that.video_in).src = URL.createObjectURL(that.stream);
        }
        if (success && typeof success === 'function') {
            /*Case we have received a function on parameter, we execute it after the user grants permission.*/
            success();
        }
    })
    .then(null, error && typeof error === 'function' ? error : function (err) {console.log(err.name + ': ' + err.message);})
}

requestWebcam.prototype.startRecording = function() {
    /*
    Start recording the webcam feed.

    The variable Browser is here to differentiate between Chrome and Firefox/Opera,
    because the function mediaRecorder has a different behavior on Chrome.

    TODO: accept an fuction on parameters; Exception/Error Handling;
    */

    var that = this;
    if (this.browser.indexOf("Chrome") > -1) {

        that.recorder = new MediaRecorder(that.stream);
        that.recorder.start();
        that.recorder.ondataavailable = function(e) {that.data_array.push(e.data)};
        
    } else if (that.browser.indexOf("Firefox") > -1 || that.browser.indexOf("Opera") > -1) {

        that.recorder = new MediaRecorder(that.stream);
        that.recorder.start();

    } else {

        that.recorder = new MediaRecorder(that.stream);
        that.recorder.start();
        that.recorder.ondataavailable = function(e) {that.data_array.push(e.data)};
    }
};

requestWebcam.prototype.stopRecording = function(f) {
    /*
    Stop the recording of the feed.

    The variable browser is used to differentiate between Chrome and firefox/Opera,
    because the function mediaRecorder has a different behavior on chrome.

    Optional:
    Receive a function on parameters to execute after stoping the recording.

    TODO: Exception/Error Handling; Make possible to record only video or only audio;
    */

    var that = this;
    if (that.browser.indexOf("Chrome") > -1) {

        that.recorder.stop();
        that.blob = new Blob(that.data_array, {'type' : 'video/mp4'});
        that.urlobj = URL.createObjectURL(that.blob);
        if (that.video_out) {
            //In case we hava received video_out, this insert the recorded video on the element(<video>) with the id received in video_out.
            document.getElementById(that.video_out).src = URL.createObjectURL(that.blob);
        }
        if (f && typeof f === 'function') {
            //This timeout is here, just to make sure we execute the function after the recorder stoped.
            setTimeout(f(), 500);
        }
        that.data_array = [];

    } else if (that.browser.indexOf("Firefox") > -1 || that.browser.indexOf("Opera") > -1) {
        that.recorder.ondataavailable = function(e) {
            that.urlobj = URL.createObjectURL(e.data);
            that.blob = new Blob([e.data], {'type': 'video/mp4'});
            if (that.video_out) {
                document.getElementById(that.video_out).src = URL.createObjectURL(e.data);
            }
            console.log(f);
            if (f && typeof f === 'function') {
                setTimeout(f(), 500);
            }
        };
        that.recorder.stop();

    } else {

        that.recorder.stop();
        that.blob = new Blob(that.data_array, {'type' : 'video/mp4'});
        that.urlobj = URL.createObjectURL(that.blob);
        if (that.video_out) {
                document.getElementById(that.video_out).src = URL.createObjectURL(that.blob);
        }
        if (f && typeof f === 'function') {
            setTimeout(f(), 500);
        }
        that.data_array = [];
    }
};

requestWebcam.prototype.download = function() {
    /*
    Download the video recorded by the feed.

    The first timeout is here just to make sure we have an blob on the blob variable after the recording.

    TODO: Exception/Error Handling;
    */

    var that = this;

    a = document.createElement('a');
    a.style = "display: none";
    a.download = ['video_', (new Date() + '').slice(4, 28), '.mp4'].join('');
    a.href = that.urlobj;
    a.textContent = a.download;
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }, 900);
};
