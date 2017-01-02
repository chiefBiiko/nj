    /* a chrome extension that emulates a console to perform numerical computations (in js)
    based upon http://www.numericjs.com/
    mvp: console + docs thru iframe
      sugar: cmd history lookup with arrow keys  
    */
    'use strict';
    var nj = {};
    nj.con = document.getElementById('console');
    nj.his = [];  // history array
    // func 2 process commands and display return val
    function processR() {
      var str, cmd, ret;
      str = nj.con.value;
      // checking cmd history n getting current cmd
      if (nj.his.length === 0) {
        cmd = str.replace(/(\n)+/g, ''); 
      } else {
        let cur = str.replace(/(\n)+/g, '');  // NEW cmds
        let col = nj.his.reduce(function(a, b) {return a.concat(b);}, []).join('');  // join arr to str // OLD cmds
        cmd = cur.replace(col, '');  //extracting current cmd
      }
      // doing an indirect eval 2 call statement in global scope
      ret = String(window.eval(cmd));
      nj.his.push([cmd, ret]);
      nj.con.value += '\n' + ret;
    }
    // define function that pops up cmd history on arrowkeys events
    function commandR(arrow) {
      var crn, len;
      // crn is an unique set of nj.his cmds otherwise not all cmds r retroaccessible
      if (arrow === 'up') {  // how 2 collapse follwing map and filter into on func call?
        crn = nj.his.map(x => x[0]).filter((item, i, arr) => arr.indexOf(item) === i).reverse();
      } else {
        crn = nj.his.map(x => x[0]).filter((item, i, arr) => arr.indexOf(item) === i);
      }
      if (!nj.prm) {
        nj.con.value += crn[0];
        nj.prm = crn[0];
      } else if (crn[crn.indexOf(nj.prm) + 1]) {  // making sure cmd history item is defined at target index
        // remove last cmd on prompt before adding new from target index
        let pos = nj.con.value.lastIndexOf('\n') + 1;
        nj.con.value = nj.con.value.substr(0, pos);
        nj.con.value += crn[crn.indexOf(nj.prm) + 1];
        nj.prm = crn[crn.indexOf(nj.prm) + 1];
      }
      len = nj.con.value.length;
      nj.con.setSelectionRange(len, len);
    }
    // keys event listener
    window.addEventListener('keydown', function(e) {
      var len = nj.con.value.length;
      if (document.activeElement === nj.con && e.shiftKey === false && e.keyCode === 13) {
        processR();
      } else if (document.activeElement === nj.con && nj.con.selectionStart === len && e.keyCode === 38) {
        e.preventDefault();
        commandR('up');  // up arrow
      } else if (document.activeElement === nj.con && nj.con.selectionStart === len && e.keyCode === 40) {
        commandR('down');  // down arrow
      }
    });