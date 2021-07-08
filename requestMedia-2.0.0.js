var requestMedia = function(opts){
    if (!navigator.mediaDevices.getUserMedia || window.MediaRecorder == undefined){
        throw "Not supported on your browser, use the latest version of Firefox or Chrome'";
    }

    this.defaults = {
        preview: null, //HTML5 video/audio element
        output: null, //HTML5 video/audio element
        onGetPermission: function() {},
        onForgetPermission: function() {},
        onError: function (err) {console.log(err.name + ': ' + err.message)},
        onStartRecording: function() {},
        onStopRecording: function() {},
        onPictureTaken: function() {},
        onDownload: function() {},
        audio:true, //can receive an object with audio constraints
        video:{ //video constraints
            width:{
                min:640,
                ideal:1280,
                max:1080
            },
            height:{
                min:480,
                ideal:720,
                max:1980
            },
            frameRate:{
                min:24,
                ideal:60,
                max:120
            },
            facingMode: "user" //On mobile, defaults to the user facing camera
        }
    }

    for(var i in this.defaults){
        this[i] = (opts[i] !== undefined) ? opts[i] : this.defaults[i]
    }

    this.dataArray = [];
    this.stream = null;
    this.recorder = null;
    this.blob = null;
    this.urlobj = null
    this.canvas = null;
    this.fileName = null;
    this.fileType = "video/webm"; //defaults to webm but we switch to mp4 on Safari 14.0.2+

    this._getOptionRecorder = function(){
        if(typeof MediaRecorder.isTypeSupported === 'function'){
            var options = {mimeType: null}

            if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                options.mimeType = 'video/webm;codecs=vp9';

            } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
                options.mimeType = 'video/webm;codecs=h264';

            } else  if (MediaRecorder.isTypeSupported('video/webm')) {
                options.mimeType = 'video/webm';

            } else  if (MediaRecorder.isTypeSupported('video/mp4')) {
              //Safari 14.0.2 has an EXPERIMENTAL version of MediaRecorder enabled by default
              options.mimeType = 'video/mp4';
            }

            console.log('Using ' + options.mimeType);

            return options;
        } else {
            return undefined;
        }
    }
}

requestMedia.prototype.requestPermission = function() {
    var that = this;
    navigator.mediaDevices.getUserMedia({video: that.video, audio: that.audio}).then(
        function(stream){
            that.stream = stream;

            that.stream.getTracks().forEach(function(track) {
                if(track.kind == "audio"){
                    track.onended = function(event){
                        console.log("audio track.onended Audio track.readyState="+track.readyState+", track.muted=" + track.muted);
                    }
                }
                if(track.kind == "video"){
                    track.onended = function(event){
                        console.log("video track.onended Audio track.readyState="+track.readyState+", track.muted=" + track.muted);
                    }
                }
            });

            if(that.preview && typeof that.preview === "object" && (that.preview.nodeName === "AUDIO" || that.preview.nodeName === "VIDEO")){
                that.preview.srcObject = that.stream;
                that.preview.play();
            }
        }).catch(function(err){
            if (that.onError && typeof this.onError === 'function'){
                that.onError(err)
            } else {
                console.log('Request access error: ' + err)
            }
        });
}

requestMedia.prototype.forgetPermission = function() {

    if (this.stream == null) return;

    this.stream.getTracks().forEach(function(track) {track.stop();});

    if (this.onForgetPermission && typeof this.onForgetPermission === 'function'){
        this.onForgetPermission();
    }
}

requestMedia.prototype.startRecording = function(){
    var that = this;

    if (that.stream == null) throw "Could not get local stream from mic/camera";

    // Reset everything from any previous recordings
    that.dataArray = [];
    that.fileType = null;
    that.blob = null;
    that.recorder = null;
    that.fileName = null;

    console.log('Starting...')

    // Get mimeType supported
    var mimeType = that._getOptionRecorder();

    // Config MediaRecorder with mimeType (if available)
    if (!mimeType){
        that.recorder = new MediaRecorder(that.stream);
    } else {
        that.fileType = mimeType.mimeType;
        that.recorder = new MediaRecorder(that.stream, mimeType);
    }

    // Config onDataAvailable event
    that.recorder.ondataavailable = function(e) {
        console.log('mediaRecorder.ondataavailable, e.data.size='+e.data.size);
        if (e.data && e.data.size > 0) {
            that.dataArray.push(e.data);
        }
    };

    // Config OnErro event
    if (that.onError && typeof that.onError === 'function') {
        that.recorder.onerror = that.onError
    } else {
        that.recorder.onerror = function(e){
            console.log('Recording error: ' + e);
        };
    }

    // Config OnStart event
    if (that.onStartRecording && typeof that.onStartRecording === 'function') {
        that.recorder.onstart = that.onStartRecording();
    } else {
        that.recorder.onstart = function(){
            console.log('Start recording, that.recorder.state = ' + that.recorder.state);
        }
    }

    // Config OnStop event
    that.recorder.onstop = function(){
        console.log('Stop recording, that.recorder.state = ' + that.recorder.state);

        that.blob = new Blob(that.dataArray, {type: that.recorder.mimeType})

        if(that.output && typeof that.output === "object" && (that.output.nodeName === "AUDIO" || that.output.nodeName === "VIDEO")){
            that.output.src = URL.createObjectURL(that.blob);
            that.output.controls = true;
        }

        switch(that.fileType){
            case "video/mp4":
                that.fileName = ['file_', (new Date() + '').slice(4, 28), '.mp4'].join('');
                break;
            default:
                that.fileName = ['file_', (new Date() + '').slice(4, 28), '.webm'].join('');
        }
    }

    // Config timeslice for OnDataAvailable as 0.1 sec
    that.recorder.start(100);
}

requestMedia.prototype.stopRecording = function() {
    var that = this;
    that.recorder.stop();

    if (that.onStopRecording && typeof that.onStopRecording === 'function') {
        //This timeout is here, just to make sure we execute the function after the recorder stoped.
        setTimeout(that.onStopRecording(), 500);
    }
}

requestMedia.prototype.download = function() {
    var that = this;

    if (that.onDownload && typeof that.onDownload === 'function') {
        that.onDownload();
    }

    a = document.createElement('a');
    a.style = "display: none";
    a.download = that.fileName;
    if (that.urlobj){
        a.href = that.urlobj;
    } else {
        a.href = URL.createObjectURL(that.blob);
    }
    a.textContent = that.fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }, 500);   
}

requestMedia.prototype.startCanvas = function(w){
    /*Initiate the canvas object with explicit width and height generated accordingly to width value and aspect ratio of video element.*/
    var that = this;

    if (that.stream == null) throw "Could not get local stream from mic/camera";

    var width = w, height = 0, context = null;
    if (that.canvas){
        height = that.preview.videoHeight / (that.preview.videoWidth/width);

        // if (isNaN(height)) height = width / (4/3);
        if (isNaN(height)) height = width * 9/12;

        that.canvas.setAttribute('width', width);
        that.canvas.setAttribute('height', height);
    }

    context = that.canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, that.canvas.width, that.canvas.height);
    
    var data = that.canvas.toDataURL('image/png');
    that.output.setAttribute('src', data);
}

requestMedia.prototype.takePicture = function () {
    /*
    From stream object generate image by requested frame moment.
    */
    var that = this;

    if (that.stream == null) throw "Could not get local stream from mic/camera";

    var context = that.canvas.getContext('2d');
    if (that.canvas.width && that.canvas.height){
        width  = that.canvas.width;
        height = that.canvas.height;
        context.drawImage(that.preview, 0, 0, width, height);

        var urlimg = that.canvas.toDataURL('image/png');
        that.output.setAttribute('src', urlimg);
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