/* a chrome extension that emulates a console to perform numerical computations in js
based upon http://www.numericjs.com/ */
'use strict';
var nj = {};
nj.con = document.getElementById('console');
nj.his = [];  // history array
// func 2 process commands and display return val
function processR(e) {
  var cmd, ret;
  // checking history n getting current cmd
  if (nj.his.length === 0) {
    cmd = nj.con.value.replace(/(\n)+/g, ''); 
  } else {
    let cur = nj.con.value.replace(/(\n)+/g, '');  // NEW cmds
    let col = nj.his.reduce((a, b) => a.concat(b), []).join('');  // join arr to str // OLD cmds
    cmd = cur.replace(col, '');  // extracting current cmd
  }
  if (!cmd) {
    e.preventDefault();  // preventing a new line
    return false;
  }
  try {  // doing an indirect eval 2 call cmd in global scope
    ret = String(window.eval(cmd));
  } catch(err) {
    ret = err;
  } finally {
    nj.his.push([cmd, ret]);
    nj.con.value += '\n' + ret;
  }
}
// func that pops up cmd history on arrowkeys events
function commandR(arrow) {
  var crn;
  // crn is a unique array of nj.his cmds otherwise not all cmds r retroaccessible
  (arrow === 'up') ? crn = [...new Set(nj.his.map(x => x[0]))].reverse() : crn = [...new Set(nj.his.map(x => x[0]))];
  if (!nj.prm) {  // nj.prm is temp memory what cmd is on prompt
    nj.con.value += crn[0];
    nj.prm = crn[0];
  } else if (crn[crn.indexOf(nj.prm) + 1]) {  // making sure cmd history item is defined at target index
    // remove last cmd on prompt before adding new from target index
    nj.con.value = nj.con.value.substr(0, nj.con.value.lastIndexOf('\n') + 1);
    nj.con.value += crn[crn.indexOf(nj.prm) + 1];
    nj.prm = crn[crn.indexOf(nj.prm) + 1];
  }
  nj.con.setSelectionRange(nj.con.value.length, nj.con.value.length);
}
// key events
document.addEventListener('keydown', function(e) {
  if (document.activeElement === nj.con) {
    if (!e.shiftKey && e.keyCode === 13) {
      processR(e);
    } else if (nj.con.selectionStart === nj.con.value.length && nj.his.length > 0 && e.keyCode === 38) {
      e.preventDefault();
      commandR('up');  // up arrow
      nj.ppd = true;  // indicating cmd history is popped up on prompt
    } else if (nj.con.selectionStart === nj.con.value.length && nj.his.length > 0 && e.keyCode === 40) {
      commandR('down');  // down arrow
      nj.ppd = true;
    } else if (nj.con.selectionStart === nj.con.value.length && nj.ppd && e.keyCode === 46) {
      nj.con.value = nj.con.value.substr(0, nj.con.value.lastIndexOf('\n') + 1);  // clearing prompt on del
      nj.ppd = false;
    }
  }
});
// clear btn
document.getElementById('clear').addEventListener('click', function(e) {
  nj.con.value = nj.con.placeholder = '';
  nj.ppd = nj.prm = false;
  nj.his = [];
  nj.con.focus();
});
// toggle btn
document.getElementById('toggle').addEventListener('click', function(e) {
  var ref = document.getElementById('ref');
  (ref.style.display === 'none') ? ref.style.display = 'block' : ref.style.display = 'none'; 
});