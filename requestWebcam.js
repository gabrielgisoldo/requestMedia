/**
Classe JS para solicitar acesso a webcam e microfone do usuario a partir do browser.

Compativel com:
    Desktop:
        Firefox
        Google Chrome - com permissao para usar os pacotes experimentais
        Google Chromium - com permissao para usar os pacotes experimentais
        Opera

    Mobile:
        Firefox - Android
        Google Chrome - Android
        Browser Padrão - Android
**/


function requestWebcam(video_in, video_out){
    /**
    Construtor da classe.

    Recebe como parametro o ID de um elemento HTML de video(<video>) para saida e para entrada.

    O elemento do primeiro ID recebe a stream e o segundo elemento recebe o video gravado.
    **/
    this.video_in = video_in || null;
    this.video_out = video_out || null;
    this.data_array = [];
    this.stream = null;
    this.recorder = null;
    this.blob = null;
    this.browser = navigator.userAgent;
}

requestWebcam.prototype.getVideo_in = function() {
    return this.video_in;
};

requestWebcam.prototype.getVideo_out = function() {
    return this.video_out;
};

requestWebcam.prototype.getData_array = function() {
    return this.data_array;
};

requestWebcam.prototype.getStream = function() {
    return this.stream;
};

requestWebcam.prototype.getRecorder = function() {
    return this.recorder;
};

requestWebcam.prototype.getBlob = function() {
    return this.blob;
};

requestWebcam.prototype.forgetPermission = function(f) {
    /**
    Retira a permissao do script de acessar a webcam e microfone.

    Opcional:
    Recebe um funcao por parametro para executar depois de retirar as permissoes.
    **/
    for (var i = 0; i < this.stream.getTracks().length; i++) {
        this.stream.getTracks()[i].stop();
    }
    if (f && typeof f === 'function'){
        f();
    }
}

requestWebcam.prototype.requestPermission = function(f) {
    /**
    Solicita ao usuario a permissao para acessar o microfone e a webcam.

    Opcional:
    Recebe uma funcao por parametro para executar depois de conseguir o objeto LocalMediaStream.
    **/
    var that = this;
    navigator.mediaDevices.getUserMedia(
        {video: true,audio: true}
    ).then(
        function(stm) {
            that.stream = stm;
            // Caso tenha recebido o parametro video_in ele insere o feed da webcam como source no elemento html(<video>).
            if (that.video_in) {
                document.getElementById(that.video_in).src = URL.createObjectURL(that.stream);
            }
            if (f && typeof f === 'function'){
                f();
            }
        }
    ).catch(
        function(e) {console.error(e)}
    );
};

requestWebcam.prototype.startRecording = function() {
    /**
    Inicia a gravacao do feed da webcam.

    A variavel browser e usada para diferenciar entre Chrome e firefox/opera,
    pois a funcao mediaRecorder se comporta de forma diferente no Chrome.
    **/
    var that = this;
    if (this.browser.indexOf("Chrome") > -1) {

        that.recorder = new MediaRecorder(that.stream);
        that.recorder.start();
        this.recorder.ondataavailable = function(e) {that.data_array.push(e.data)};
        
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
    /**
    Encerra a gravacao do feed da webcam.

    A variavel browser e usada para diferenciar entre Chrome e firefox/opera,
    pois a funcao mediaRecorder se comporta de forma diferente no Chrome.

    Opcional:
    Recebe uma funcao por parametro para executar depois de settar os novos
    valores para as variaveis.
    **/
    var that = this;
    if (that.browser.indexOf("Chrome") > -1) {

        that.recorder.stop();
        that.blob = new Blob(that.data_array, {'type' : 'video/mp4'});
        that.urlobj = URL.createObjectURL(that.blob);
        //Caso tenha recebido o parametro video_out ele insere o video gravado como source no elemento html(<video>).
        if (that.video_out) {
                document.getElementById(that.video_out).src = URL.createObjectURL(that.blob);
        }
        if (f && f === 'function') {
            f();
        }
        that.data_array = [];

    } else if (that.browser.indexOf("Firefox") > -1 || that.browser.indexOf("Opera") > -1) {
        that.recorder.ondataavailable = function(e) {
            that.urlobj = URL.createObjectURL(e.data);
            if (that.video_out) {
                document.getElementById(that.video_out).src = URL.createObjectURL(e.data);
            }
            if (f && f === 'function') {
                f();
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
        if (f && f === 'function') {
            f();
        }
        that.data_array = [];
    }
};
