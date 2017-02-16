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

    @example
        * var webcam = new requestWebcam({
        *   video_in: document.getElementById( ... ),
        *   video_out: document.getElementById( ... ),
        *   name_video: 'Test.mp4',
            onGetPermission: function () { ... },
        *   onForgetPermission: function () { ... },
        *   onDeniedPermission: function (err) { ... }
        *   onStartRecording: function () { ... },
        *   onStopRecording: function () { ... },
        *   onDownload: function () { ... }

        * })
        * webcam.requestPermission()

    * @constructor
    * @param {object} options Hash of options
    * @param {object} options.video_in video HTML5 element to display feed
    * @param {object} options.video_out video HTML5 element to display final video
    * @param {string} options.name_video name of video on download
    * @param {function} [options.onGetPermission] callback when getting permission
    * @param {function} [options.onForgetPermission] Execute after deleting the permissions
    * @param {function} [options.onDeniedPermission] callback when not getting permission
    * @param {function} [options.onStartRecording] execute after start recording
    * @param {function} [options.onStopRecording] execute after stop recording
    * @param {function} [options.onDownload] execute before download
*/

var requestWebcam = function(opts) {
    this.defaults = {
        video_in: null,
        video_out: null,
        name: ['video_', (new Date() + '').slice(4, 28), '.mp4'].join(''),
        onGetPermission: function () {},
        onForgetPermission: function () {},
        onDeniedPermission: function (err) {console.log(err.name + ': ' + err.message)},
        onStartRecording: function () {},
        onStopRecording: function () {},
        onDownload: function () {}
    }

    /* copy user options or use default values */
    for (var i in this.defaults) {
        this[i] = (opts[i] !== undefined) ? opts[i] : this.defaults[i]
    }
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

requestWebcam.prototype.getName = function () {
    /*return the value of name.*/
    return this.name;
};

requestWebcam.prototype.getOnGetPermission = function () {
    /*return the value of onGetPermission.*/
    return this.onGetPermission;
};

requestWebcam.prototype.getOnForgetPermission = function () {
    /*return the value of onForgetPermission.*/
    return this.onForgetPermission;
};

requestWebcam.prototype.getOnDeniedPermission = function () {
    /*return the value of onDeniedPermission.*/
    return this.onDeniedPermission;
};

requestWebcam.prototype.getOnStartRecording = function () {
    /*return the value of onStartRecording.*/
    return this.onStartRecording;
};

requestWebcam.prototype.getOnStopRecording = function () {
    /*return the value of onStopRecording.*/
    return this.onStopRecording;
};

requestWebcam.prototype.getOnDownload = function () {
    /*return the value of onDownload.*/
    return this.onDownload;
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

requestWebcam.prototype.forgetPermission = function() {
    /*
    Forget the permission given by the user to access the webcam and microphone

    Optional:
    Receive a function by parameter to execute after removing all permissions.
    */

    for (var i = 0; i < this.stream.getTracks().length; i++) {
        this.stream.getTracks()[i].stop();
    }
    if (this.onForgetPermission && typeof this.onForgetPermission === 'function'){
        //Case we have received a function on parameter, we execute it after forgeting all permissions.
        this.onForgetPermission();
    }
}

requestWebcam.prototype.requestPermission = function() {
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
            that.video_in.src = URL.createObjectURL(that.stream);
        }
        if (that.onGetPermission && typeof that.onGetPermission === 'function') {
            /*Case we have received a function on parameter, we execute it after the user grants permission.*/
            that.onGetPermission();
        }
    })
    .then(null, that.onDeniedPermission && typeof that.onDeniedPermission === 'function' ? that.onDeniedPermission : function (err) {console.log(err.name + ': ' + err.message);})
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

        if (that.onStartRecording && typeof that.onStartRecording === 'function') {
            that.onStartRecording();
        }

        that.recorder = new MediaRecorder(that.stream);
        that.recorder.start();
        that.recorder.ondataavailable = function(e) {that.data_array.push(e.data)};
        
    } else if (that.browser.indexOf("Firefox") > -1 || that.browser.indexOf("Opera") > -1) {

        if (that.onStartRecording && typeof that.onStartRecording === 'function') {
            that.onStartRecording();
        }

        that.recorder = new MediaRecorder(that.stream);
        that.recorder.start();

    } else {

        if (that.onStartRecording && typeof that.onStartRecording === 'function') {
            that.onStartRecording();
        }

        that.recorder = new MediaRecorder(that.stream);
        that.recorder.start();
        that.recorder.ondataavailable = function(e) {that.data_array.push(e.data)};
    }
};

requestWebcam.prototype.stopRecording = function() {
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
            that.video_out.src = URL.createObjectURL(that.blob);
        }
        if (that.onStopRecording && typeof that.onStopRecording === 'function') {
            //This timeout is here, just to make sure we execute the function after the recorder stoped.
            setTimeout(that.onStopRecording(), 50);
        }
        that.data_array = [];

    } else if (that.browser.indexOf("Firefox") > -1 || that.browser.indexOf("Opera") > -1) {
        that.recorder.ondataavailable = function(e) {
            that.urlobj = URL.createObjectURL(e.data);
            that.blob = new Blob([e.data], {'type': 'video/mp4'});
            if (that.video_out) {
                that.video_out.src = URL.createObjectURL(e.data);
            }
            if (that.onStopRecording && typeof that.onStopRecording === 'function') {
                setTimeout(that.onStopRecording(), 50);
            }
        };
        that.recorder.stop();

    } else {

        that.recorder.stop();
        that.blob = new Blob(that.data_array, {'type' : 'video/mp4'});
        that.urlobj = URL.createObjectURL(that.blob);
        if (that.video_out) {
                that.video_out.src = URL.createObjectURL(that.blob);
        }
        if (that.onStopRecording && typeof that.onStopRecording === 'function') {
            setTimeout(that.onStopRecording(), 50);
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

    if (that.onDownload && typeof that.onDownload === 'function') {
        that.onDownload();
    }
    a = document.createElement('a');
    a.style = "display: none";
    a.download = that.name;
    a.href = that.urlobj;
    a.textContent = a.download;
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }, 200);
};
