/* a chrome extension that emulates a console to perform numerical computations in js
based upon http://www.numericjs.com/ */
'use strict';
var nj = {
  con: document.getElementById('console'),
  ref: document.getElementById('ref'),
  his: []
};
// func 2 process commands and display return val
function processR(e) {
  var cmd, ret;
  if (nj.his.length === 0) {  // checking history n getting current cmd
    cmd = nj.con.value.replace(/(\n)+/g, ''); 
  } else {
    let cur = nj.con.value.replace(/(\n)+/g, '');  // NEW cmds
    let col = nj.his.reduce((a, b) => a.concat(b), []).join('');  // 2darr to str // OLD cmds
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
// func that pops up cmd history on arrowkey events
function commandR(arrow) {
  var crn;  // crn is a unique array of nj.his cmds otherwise not all cmds r retroaccessible
  (arrow === 'up') ? crn = [...new Set(nj.his.map(x => x[0]))].reverse() : crn = [...new Set(nj.his.map(x => x[0]))];
  if (!nj.prm) {  // nj.prm is temp memory what cmd is on prompt
    nj.con.value += nj.prm = crn[0];
  } else if (crn[crn.indexOf(nj.prm) + 1]) {  // making sure cmd history item is defined at target index
    nj.con.value = nj.con.value.substr(0, nj.con.value.lastIndexOf('\n') + 1);
    nj.con.value += nj.prm = crn[crn.indexOf(nj.prm) + 1]; // rming last cmd on prompt b4 adding new from target
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
    } else if (nj.con.selectionStart === nj.con.value.length && nj.his.length > 0 && e.keyCode === 40) {
      commandR('down');  // down arrow
    } else if (nj.con.selectionStart === nj.con.value.length && nj.prm && e.keyCode === 46) {
      nj.con.value = nj.con.value.substr(0, nj.con.value.lastIndexOf('\n') + 1);  // clearing prompt on del
      nj.prm = '';
    }
  }
});
// clear btn
document.getElementById('clear').addEventListener('click', function(e) {
  nj.con.value = nj.con.placeholder = nj.prm = '';
  nj.his = [];
  nj.con.focus();
});
// toggle btn
document.getElementById('toggle').addEventListener('click', function(e) {
  (nj.ref.style.display === 'none') ? nj.ref.style.display = 'block' : nj.ref.style.display = 'none'; 
});