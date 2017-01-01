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
      console.log(cmd);
      ret = window.eval(cmd);
      nj.his.push([cmd, String(ret)]);
      nj.con.value += '\n' + ret;
    }
    // define function that pops up a tooltip with cmd history on arrowkeys events
    function commandR() {
      
    }
    // keys event listener
    window.addEventListener('keydown', function(e) {
      if (document.activeElement === nj.con && e.keyCode === 13 && e.shiftKey === false) {
        processR();
      } else if (document.activeElement === nj.con && e.keyCode === 38) {
        // up arrow
      } else if (document.activeElement === nj.con && e.keyCode === 40) {
        // down arrow
      }
    });