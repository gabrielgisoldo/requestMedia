var preview_video = document.getElementById('preview_video');
var output_video = document.getElementById('output_video');
var getFeedVideo = document.getElementById('getFeedVideo');
var StartRecording = document.getElementById('StartRecording');
var StopRecording = document.getElementById('StopRecording');
var DownloadVideo = document.getElementById('DownloadVideo');

var demoVideo = new requestMedia({
    preview: preview_video,
    output: output_video
});

getFeedVideo.addEventListener('click', function(event){
    demoVideo.requestPermission();
});

StartRecording.addEventListener('click', function(event){
    demoVideo.startRecording();
});

StopRecording.addEventListener('click', function(event){
    demoVideo.stopRecording();
    demoVideo.forgetPermission();
});

DownloadVideo.addEventListener('click', function(event){
    demoVideo.download();
});