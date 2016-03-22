'use strict';

let app = require('app');
let BrowserWindow = require('browser-window');
let ipc = require("electron").ipcMain;

let mainWindow = null;

let PythonShell = require('python-shell');
/*
PythonShell.run('python-modules/lswin.py', function (err, data) {
  if (err) throw err;
  console.log(data);
});
*/

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.setPath("userData", __dirname + "/saved_recordings");

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    'title-bar-style': 'hidden'
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

let timeline = {};

// Spaces are viewed as the same screen, but only the windows on that space are in the sources list
// So we need to keep a history of sources and try to match them to spaces
// We can probably check if windows on other spaces are running if we check the window ID
ipc.on("activeSources", function(event, sources) {

  let windows = [];
  PythonShell.run('python-modules/lswin.py', function (err, data) {
    if (err) throw err;

    var re = /([0-9]+)(?:[ ]*)([0-9]+)(?:[ ]*){([-0-9]+),([-0-9]+),([-0-9]+),([-0-9]+)(?:.+)}\[([^\]]+)](?:[ ]*)(.*)/g;
    var m;

    data.forEach((window) => {
      while ((m = re.exec(window)) !== null) {
        if (m.index === re.lastIndex) {
          re.lastIndex++;
        }
        // View your result using the m-variable.
        // eg m[0] etc.

        /*
        console.log('PID ' + m[1]);
        console.log('Window ID ' + m[2]);
        console.log('Dimension ' + m[3] + ',' + m[4] + ',' + m[5] + ',' + m[6]);
        console.log('App ' + m[7]);
        console.log('Window title ' + m[8]);
        */

        windows['window:' + m[2]] = {
          appName: m[7],
          windowName: m[8]
        };
      }
    });

    //console.log(windows);

    sources.forEach((source, index) => {
      /*if (windows[source.id]) {
        console.log(windows[source.id]);
      }*/
        if (!timeline[source.id]) {
        timeline[source.id] = {
          name: source.name,
          activeTime: 0,
          backgroundTime: 0
        };

        if (windows[source.id]) {
          //console.log(windows[source.id]);
          timeline[source.id].appName = windows[source.id].appName;
          timeline[source.id].windowName = windows[source.id].windowName;
        }
      } else {
        timeline[source.id].backgroundTime++;
      }
      if (index == 1) {
        timeline[source.id].activeTime++;
      }
    });
    //console.log(timeline);
    mainWindow.webContents.send("timeline", timeline);

  });

});