
class Program {

  constructor( console ) {
    this.console = console;
  }

  initPlayBook( properties ) {

    this.basiccontext = new BasicContext( this.console );

    this.width = properties.w;
    this.height = properties.h;

    this.stringMode = false;

    this.console.reset();

    this.keyToCode = [];
    var k2c = this.keyToCode;

    k2c["ALT_:1"] = '\xd0';
    k2c["ALT_:2"] = '\x85';
    k2c["ALT_:3"] = '\x9c';
    k2c["ALT_:4"] = '\xdf';
    k2c["ALT_:5"] = '\xdc';
    k2c["ALT_:6"] = '\x9e';
    k2c["ALT_:7"] = '\x9f';
    k2c["ALT_:8"] = '\xde';
    k2c["ALT_:9"] = '\x92';
    k2c[":Home"]  = '\x93';
    k2c["SHFT_:Home"]  = '\xd3';

    this.keyToCTRLCode = [];
    var k2c = this.keyToCTRLCode;
    k2c["ALT_:1"] = '\x90'; //1
    k2c["ALT_:2"] = '\x05'; //2
    k2c["ALT_:3"] = '\x1c'; //3
    k2c["ALT_:4"] = '\x9f'; //4
    k2c["ALT_:5"] = '\x9c'; //5
    k2c["ALT_:6"] = '\x1e'; //6
    k2c["ALT_:7"] = '\x1f'; //7
    k2c["ALT_:8"] = '\x9e'; //8
    k2c["ALT_:9"] = '\x81'; //9
    k2c[":Home"]  = '\x13';
    k2c["SHFT_:Home"]  = '\x93';

  }

  /*
		Loading
  */
  load(action, data) {

    if (action == 'GETURLS') {
      return;
    } else if (action == 'LOADED') {
      var loadedResources = data.resources;
    }
  }


  /*
	Playing the demo
  */
  play(action, data) {

    if (action == "INIT") {
        this.cursorCount = 1;
        var c = this.console;
        var basiccontext = this.basiccontext;

        basiccontext.reset( true );

        this.x=0; this.y=21;

    }
  }

  resetKeyModifiers() {
    this.k_altGraph = false;
    this.k_shift = false;
    this.k_control = false;
    this.k_alt = false;
  }


  reset() {
    this.basiccontext.reset( false );
    this.basiccontext.runStop()
    this.stringMode = false;
    this.resetKeyModifiers();
  }

  playHandle( evt ) {

    var bcontext = this.basiccontext;
    var running = bcontext.isRunning();
    var modifierKey = false;


    if( evt.key == "AltGraph") {
      this.k_altGraph = (evt.type  == 'keydown');
      modifierKey = true;
    }
    else if( evt.key == "Control") {
      this.k_control = (evt.type  == 'keydown');
      modifierKey = true;
    }
    else if( evt.key == "Shift") {
      this.k_shift = (evt.type  == 'keydown');
      modifierKey = true;
    }
    else if( evt.key == "Alt") {
      this.k_alt = (evt.type  == 'keydown');
      modifierKey = true;
    }

    if( modifierKey ) {
      return; //for now, untill we want to check for only modifier keys
    }

    if( evt.type != 'keydown' ) {
      return;
    }

    evt.k_altGraph = this.k_altGraph;
    evt.k_control = this.k_control;
    evt.k_shift = this.k_shift;
    evt.k_alt = this.k_alt;

    if( ! running ) {
      this.handleScrEditKeys( evt, bcontext );
      //this.resetKeyModifiers();
      return;
    }

    if( evt.key.length == 1) {
        bcontext.pushKeyBuffer( evt.key.charCodeAt(0) );
    }
    else if( evt.key == "Home") {
        if( evt.k_shift ) {
            bcontext.pushKeyBuffer( String.fromCharCode(147) );
        }
        else {
            bcontext.pushKeyBuffer( String.fromCharCode(19) );
        }
    }
    else if( evt.key == "Pause" && evt.ctrlKey) {
      this.reset();
    }
    else if( evt.key == "Escape") {
        this.basiccontext.runStop();
    }


    //this.resetKeyModifiers();
    return;
  }


  handleScrEditKeys( evt, bcontext ) {

    if( evt.type == 'keydown' ) {

      console.log(evt);
      var c = this.console;
      var stringMode;
      stringMode = this.stringMode;

      if( evt.key == "Enter") {

          c.clearCursor();
          var line=c.getCurrentLine();

          c.writeString("", true);
          bcontext.handleLineInput( line );

          this.stringMode = false;
          stringMode = false;

      }
      else if( evt.key == "Pause" && evt.ctrlKey) {
        this.basiccontext.reset( false );
      }
      else if( evt.key == "Backspace") {
          c.clearCursor();
          c.deleteChar();
      }
      else if( evt.key == "ArrowLeft") {

          c.clearCursor();
          c.cursorLeft();
      }
      else if( evt.key == "ArrowRight") {
          c.clearCursor();
          c.cursorRight();
      }
      else if( evt.key == "ArrowUp") {
          c.clearCursor();
          c.cursorUp();
      }
      else if( evt.key == "ArrowDown") {
          c.clearCursor();
          c.cursorDown();
      }
      /*else if( evt.key == "Home") {
          if( stringMode ) {
            if( evt.shiftKey ) {
              c.writePetsciiChar( '\xd3' );
            }
            else {
              c.writePetsciiChar( '\x93' );
            }
          }
          else {
            c.clearCursor();
            c.cursorHome();

            if( evt.shiftKey ) {
              c.clearScreen();
            }
          }
      }*/
      else if( evt.key == "F1") {
        c.writeString('list');
      }
      else if( evt.key == "F2") {
        c.writeString('run');
      }
      else if( evt.key == "F5") {
        c.writeString('load "$":list');
        evt.preventDefault();
      }
      else if( evt.key == "F6") {
        c.writeString('load "*"');
        evt.preventDefault();
      }
      else if( evt.key == "I") {
        c.clearCursor();
        c.writeChar( evt.key );
      }
      else if( evt.key == "\"") {
        c.clearCursor();
        c.writeChar( evt.key );
        evt.preventDefault();
        this.stringMode = !this.stringMode;
      }
      else {

        /*

        var k2c = this.keyToCode;

        k2c["ALT_CODE49"] = '\xd0'; //1


        */


        var checkKey = "";
        if( evt.k_shift ) {
            checkKey += "SHFT_";
        }
        if( evt.k_control ) {
            checkKey += "CTRL_";
        }
        if( evt.k_alt ) {
            checkKey += "ALT_";
        }
        if( evt.k_altGraph ) {
            checkKey += "ALTGR_";
        }

        checkKey += ":" + evt.key;
        console.log("check_key: " + checkKey );

        if( this.stringMode ) {
          var mapEntry = this.keyToCode[checkKey];
          if( ! (mapEntry===undefined)) {
            console.log("check_key: " + checkKey + "\/" );

            c.writePetsciiChar( mapEntry );
            evt.preventDefault();
            return;
          }
        }
        else {
          var mapEntry = this.keyToCTRLCode[checkKey];
          if( ! (mapEntry===undefined)) {

            console.log("check_key: " + checkKey + " - out string" );
            c.clearCursor();
            this.basiccontext.sendChars( mapEntry );
            evt.preventDefault();
            return;
          }
        }


        if( evt.key.length == 1) {
            c.clearCursor();
            c.writeChar( evt.key );
            evt.preventDefault();
        }

      }


    }
  }


  playRun() {

    var basiccontext = this.basiccontext;

    basiccontext.cycle();

    return false;
  }


  playRender(context) {

    this.console.renderDisplay();

  }


}
