var desktopCapturer = require('desktop-capturer');
var ipc = require("electron").ipcRenderer;

function addSource(source) {

}

function getSources() {
  desktopCapturer.getSources({ types:['window', 'screen'] }, function(error, sources) {
    //console.log('Active: ' + sources[1].name);
    ipc.send("activeSources", sources);
    //console.log(sources);
    /*
    for (var i = 0; i < sources.length; ++i) {
      console.log(sources[i]);
      addSource(sources[i]);
    }*/
  });
}

ipc.on("timeline", function(event, data) {
  //console.log(data);
  // Find a <table> element with id="myTable":
  var table = document.getElementById("timeline");

  let tableLengthBefore = table.rows.length;

  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key].appName) {

        //console.log(key + " -> " + data[key]);

        var row = table.insertRow(1);

// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

// Add some text to the new cells:
        cell1.innerHTML = data[key].appName;
        cell2.innerHTML = data[key].windowName;
        cell3.innerHTML = data[key].activeTime;
        cell4.innerHTML = data[key].backgroundTime;
      }

    }
  }

  let tableLength = table.rows.length;

  for(let j = Object.keys(data).length; j < tableLength; j++) {
    table.deleteRow(Object.keys(data).length);
  }


});

setInterval(() => {
  getSources();
}, 1000);
