
class Program {

  constructor( console ) {
    this.console = console;
  }

  initPlayBook( properties ) {

    this.basiccontext = new BasicContext( this.console );

    this.width = properties.w;
    this.height = properties.h;

    this.console.reset();

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

        basiccontext.reset();

        this.x=0; this.y=21;

    }
  }




  playHandle( evt ) {
    if( evt.type == 'keydown' ) {

      //console.log(evt);

      var c = this.console;
      if( evt.key == "Enter") {

          var basiccontext = this.basiccontext;

          c.clearCursor();
          var line=c.getCurrentLine();
          //console.log( line );
          c.writeString("", true);
          basiccontext.handleLineInput( line );


      }
      else if( evt.key == "Pause" && evt.ctrlKey) {
        this.basiccontext.reset();
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
      else if( evt.key == "Escape") {
          this.basiccontext.runStop();
      }
      else if( evt.key == "Home") {
          c.clearCursor();
          c.cursorHome();
      }
      else {
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
