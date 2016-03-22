var desktopCapturer = require('desktop-capturer');
var ipc = require("electron").ipcRenderer;

function addSource(source) {

}

function getSources() {
  desktopCapturer.getSources({ types:['window', 'screen'] }, function(error, sources) {
    console.log('Active: ' + sources[1].name);
    ipc.send("activeSources", sources);
    console.log(sources);
    /*
    for (var i = 0; i < sources.length; ++i) {
      console.log(sources[i]);
      addSource(sources[i]);
    }*/
  });
}

setInterval(() => {
  getSources();
}, 1000);
