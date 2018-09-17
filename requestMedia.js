/*
JS object to request access to the webcam and microphone of the user on the browser.

Can be used on:
    Desktop:
        Firefox;
        Google Chrome
        Chromium
        Opera;

    Mobile:
        Firefox - Android;
        Google Chrome - Android;
        Default browser - Android;

    @example
        * var webcam = new requestMedia({
        *   feed_in: document.getElementById( ... ),
        *   feed_out: document.getElementById( ... ),
        *   name: 'Test.mp4',
        *   required_audio: true,
        *   required_video: true,
        *   file_type: 'video/mp4',
        *   onGetPermission: function () { ... },
        *   onForgetPermission: function () { ... },
        *   onDeniedPermission: function (err) { ... }
        *   onStartRecording: function () { ... },
        *   onStopRecording: function () { ... },
        *   onPictureTaken: function () { ... },
        *   onDownload: function () { ... }

        * })
        * webcam.requestPermission()

    * @constructor
    * @param {object} options Hash of options.
    * @param {object} options.feed_in video\audio HTML5 element to display feed.
    * @param {object} options.feed_out video\audio HTML5 element to display final video.
    * @param {boolean} options.request_video if true, the object requests permission of use for the video device.
    * @param {boolean} options.request_audio if true, the object requests permission of use for the audio device.
    * @param {string} options.name name of video on download.
    * @param {boolean} options.required_audio if true, the object forces the use of the audio track.
    * @param {boolean} options.required_video if true, the object forces the use of the video track.
    * @param {string} options.file_type type of file you are getting on output.
    * @param {function} [options.onGetPermission] callback when getting permission.
    * @param {function} [options.onForgetPermission] Execute after deleting the permissions.
    * @param {function} [options.onDeniedPermission] callback when not getting permission.
    * @param {function} [options.onStartRecording] execute after start recording.
    * @param {function} [options.onStopRecording] execute after stop recording.
    * @param {function} [options.onPictureTaken] execute after picture is taken.
    * @param {function} [options.onDownload] execute before download.
*/

var requestMedia = function(opts) {
    this.defaults = {
        feed_in: null,
        feed_out: null,
        request_video: true,
        request_audio: true,
        name: ['file_', (new Date() + '').slice(4, 28), '.mp4'].join(''),
        required_audio: true,
        required_video: true,
        file_type: 'video/mp4',
        onGetPermission: function () {},
        onForgetPermission: function () {},
        onDeniedPermission: function (err) {console.log(err.name + ': ' + err.message)},
        onStartRecording: function () {},
        onStopRecording: function () {},
        onPictureTaken: function() {},
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
    this.canvas = null;
}

requestMedia.prototype.getFeed_in = function() {
    /*return the value of Feed_in.*/
    return this.feed_in;
};

requestMedia.prototype.getFeed_out = function() {
    /*return the value of Feed_out.*/
    return this.feed_out;
};

requestMedia.prototype.getRequest_video = function() {
    /*return the value of Request_video.*/
    return this.request_video;
};
requestMedia.prototype.getRequest_audio = function() {
    /*return the value of Request_audio.*/
    return this.request_audio;
};

requestMedia.prototype.getName = function () {
    /*return the value of name.*/
    return this.name;
};

requestMedia.prototype.getFile_type = function () {
    /*return the value of file_type.*/
    return this.file_type;
}

requestMedia.prototype.getOnGetPermission = function () {
    /*return the value of onGetPermission.*/
    return this.onGetPermission;
};

requestMedia.prototype.getOnForgetPermission = function () {
    /*return the value of onForgetPermission.*/
    return this.onForgetPermission;
};

requestMedia.prototype.getOnDeniedPermission = function () {
    /*return the value of onDeniedPermission.*/
    return this.onDeniedPermission;
};

requestMedia.prototype.getOnStartRecording = function () {
    /*return the value of onStartRecording.*/
    return this.onStartRecording;
};

requestMedia.prototype.getOnStopRecording = function () {
    /*return the value of onStopRecording.*/
    return this.onStopRecording;
};

requestMedia.prototype.getOnPictureTaken = function () {
    /*return the value of onPictureTaken.*/
    return this.onPictureTaken;
};

requestMedia.prototype.getOnDownload = function () {
    /*return the value of onDownload.*/
    return this.onDownload;
};

requestMedia.prototype.getData_array = function() {
    /*return the value of Data_array.*/
    return this.data_array;
};

requestMedia.prototype.getStream = function() {
    /*return the value of Stream.*/
    return this.stream;
};

requestMedia.prototype.getRecorder = function() {
    /*return the value of Recorder.*/
    return this.recorder;
};

requestMedia.prototype.getBlob = function() {
    /*return the value of Blob.*/
    return this.blob;
};

requestMedia.prototype.getRequired_audio = function() {
    /*return the value of Required_audio.*/
    return this.required_audio;
};

requestMedia.prototype.getRequired_video = function() {
    /*return the value of Required_video.*/
    return this.required_video;
};

requestMedia.prototype.getCanvas = function(){
    /*return value of Canvas.*/
    return this.canvas
};

requestMedia.prototype.setCanvas = function(c){
    /*set value in Canvas.*/
    this.canvas = c;
};

requestMedia.prototype.forgetPermission = function() {
    /*
    Forget the permission given by the user to access the webcam and microphone

    Optional:
    Receive a function by parameter to execute after removing all permissions.
    */

    if (this.stream == null) return;

    for (var i = 0; i < this.stream.getTracks().length; i++) {
        this.stream.getTracks()[i].stop();
    }
    if (this.onForgetPermission && typeof this.onForgetPermission === 'function'){
        //Case we have received a function on parameter, we execute it after forgeting all permissions.
        this.onForgetPermission();
    }
}

requestMedia.prototype.requestPermission = function() {
    /*
    Request permission from the user to access the microphone and webcam.

    Optional:
    success: Receive a function to execute after getting permission.
    error: Receive a function to execute in case of error. This function may hava a parameter to receive info on the error.
    */
    var that = this;
    navigator.mediaDevices.getUserMedia({video: that.request_video, audio: that.request_audio})
    .then(function(stm) {
        that.stream = stm;
        if (that.stream.getVideoTracks().length == 0 && that.required_video) {
            /*In case it's required the use of a video device*/
            that.onDeniedPermission({name:"Required Video", message:"No video device found."});
            that.forgetPermission();
        } else if (that.stream.getAudioTracks().length == 0 && that.required_audio) {
            /*In case it's required the use of a audio device*/
            that.onDeniedPermission({name:"Required Audio", message:"No audio device found."});
            that.forgetPermission();
        } else {
            if (that.feed_in) {
                /*Case we have received feed_in, we display the webcam feed on the html element(<video>/<audio>) with id equal to feed_in.*/
                that.feed_in.setAttribute('src', URL.createObjectURL(that.stream));
            }
            if (that.onGetPermission && typeof that.onGetPermission === 'function') {
                /*Case we have received a function on parameter, we execute it after the user grants permission.*/
                that.onGetPermission();
            }
        }
    })
    .then(null, that.onDeniedPermission && typeof that.onDeniedPermission === 'function' ? that.onDeniedPermission : function (err) {console.log(err.name + ': ' + err.message);})
}

requestMedia.prototype.startRecording = function() {
    /*
    Start recording the webcam feed.

    The variable Browser is here to differentiate between Chrome and Firefox/Opera,
    because the function mediaRecorder has a different behavior on Chrome.
    */

    var that = this;
    if (this.browser.indexOf("Chrome") > -1) {

        if (that.onStartRecording && typeof that.onStartRecording === 'function') {
            that.onStartRecording();
        }

        that.recorder = new MediaRecorder(that.stream);
        that.recorder.ondataavailable = function(e) {that.data_array.push(e.data)};
        that.recorder.start();
        
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

requestMedia.prototype.stopRecording = function() {
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

        that.promise = new Promise(function(resolve) {
            that.recorder.stop();
            that.interval = setInterval(function(){
                if (that.data_array.length > 0) {
                    clearInterval(that.interval);
                    resolve(that.data_array);
                }
            }, 2000)
        });

        that.promise.then(function(e) {
            that.blob = new Blob(e, {'type' : that.file_type});
            that.urlobj = URL.createObjectURL(that.blob);
            if (that.feed_out) {
                //In case we hava received feed_out, this insert the recorded file on the element(<video>/<audio>) with the id received in feed_out.
                that.feed_out.setAttribute('src', URL.createObjectURL(that.blob));
            }
            if (that.onStopRecording && typeof that.onStopRecording === 'function') {
                //This timeout is here, just to make sure we execute the function after the recorder stoped.
                setTimeout(that.onStopRecording(), 50);
            }
            that.data_array = [];
        });

    } else if (that.browser.indexOf("Firefox") > -1 || that.browser.indexOf("Opera") > -1) {
        that.recorder.ondataavailable = function(e) {
            that.urlobj = URL.createObjectURL(e.data);
            that.blob = new Blob([e.data], {'type': that.file_type});
            if (that.feed_out) {
                that.feed_out.setAttribute('src', URL.createObjectURL(e.data));
            }
            if (that.onStopRecording && typeof that.onStopRecording === 'function') {
                setTimeout(that.onStopRecording(), 50);
            }
        };
        that.recorder.stop();

    } else {

        that.recorder.stop();
        that.blob = new Blob(that.data_array, {'type' : that.file_type});
        that.urlobj = URL.createObjectURL(that.blob);
        if (that.feed_out) {
                that.feed_out.setAttribute('src', URL.createObjectURL(that.blob));
        }
        if (that.onStopRecording && typeof that.onStopRecording === 'function') {
            setTimeout(that.onStopRecording(), 50);
        }
        that.data_array = [];
    }
};

requestMedia.prototype.startCanvas = function (w) {
    /*Initiate the canvas object with explicit width and height generated accordingly to width value and aspect ratio of video element.*/
    var that = this;

    var width = w, height = 0, context = null;
    if (that.getCanvas()){
        height = that.feed_in.videoHeight / (that.feed_in.videoWidth/width);

        // if (isNaN(height)) height = width / (4/3);
        if (isNaN(height)) height = width * 9/12;

        that.canvas.setAttribute('width', width);
        that.canvas.setAttribute('height', height);
    }

    context = that.canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, that.canvas.width, that.canvas.height);
    
    var data = that.canvas.toDataURL('image/png');
    that.feed_out.setAttribute('src', data);
}

requestMedia.prototype.takePicture = function () {
    /*
    From stream object generate image by requested frame moment.
    */
    var that = this;

    var context = that.canvas.getContext('2d');
    if (that.canvas.width && that.canvas.height){
        width  = that.canvas.width;
        height = that.canvas.height;
        context.drawImage(that.feed_in, 0, 0, width, height);

        var urlimg = that.canvas.toDataURL('image/png');
        that.feed_out.setAttribute('src', urlimg);
        that.urlobj = urlimg;

        var BASE64_MARKER = ';base64,';
        var parts = urlimg.split(BASE64_MARKER);
        var content_type = parts[0].split(':')[1];
        var filebinary = window.atob(parts[1]);
        var filebinary_length = filebinary.length; 

        var uInt8Array = new Uint8Array(filebinary_length);

        for (var i = 0; i < filebinary_length; ++i) {
            uInt8Array[i] = filebinary.charCodeAt(i);
        }

        that.blob = new Blob([uInt8Array], {'type': content_type});

        if (that.onPictureTaken && typeof that.onPictureTaken === 'function') {
            setTimeout(that.onPictureTaken(), 50);
        }


    }else{
        console.log('erro');
        console.log(that.canvas);
    }

}

requestMedia.prototype.download = function() {
    /*
    Download the file recorded by the feed.

    The first timeout is here just to make sure the click function worked before we remove the element 'a'.
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
