class BasicContext {

  constructor( console ) {
    this.console = console;

    this.program = [];
    this.cursorCount = 0;
    this.runFlag = false;

    var ctx = this.context;
    var c = this.console;
    this.commands = new BasicCommands( this );
    this.vars = [];
    //this.reset();

    //this.autoLoad();
  }

  poke_53280( v ) { this.console.setBorderColor( v % 16 );  }
  poke_53281( v ) { this.console.setBGColor( v % 16 );  }

  poke( a, b ) {
      var addr = "poke_" + a;
      if( this[addr] ) {
        this[addr](b);
      }
      else if( a>1023 && a<2024) {
        var v = a - 1024;
        var y = Math.floor(v / 40);
        var x = v%40;
        var c = b%256;

        this.console.setChar(x,y,c);
      }
      else if( a>55295 && a<56296) {
        var v = a - 55296;
        var y = Math.floor(v / 40);
        var x = v%40;
        var c = b%256;

        this.console.setCharCol(x,y,c);
      }
  }

  printError( s ) {
    this.console.writeString( "?" + s + " error", true );
  }

  printLine( s ) {
    this.console.writeString( s, true );
  }

  setCursXPos( p ) {
    console.log("Error still exist here: " + p)
    this.console.cursorX( p );
  }

  reset() {
    this.console.clearScreen();
    this.printLine("");
    this.printLine(" **** commodore 64 basic emulator ****");
    this.printLine("");
    this.printLine("  **** javascript implementation ****");
    this.printLine("");
    this.printLine("ready.");
  }


  evalExpressionPart( p ) {
    var val=0;

    if( p.type=="num" ) {
      val = parseInt(p.data);
    }
    else if( p.type=="str" ) {
      val = p.data;
    }
    else if( p.type=="var" ) {
      val = this.vars[ p.data ];
    }
    else if( p.type=="expr" ) {
      val = this.evalExpression( p );
    }
    else if( p.type=="funCall" ) {

      var values = [];
      for( var j=0; j<p.params.length; j++) {
        var par = this.evalExpression( p.params[j] );;
        values.push( par );
      }
      try {
        var commands = this.commands;
        var stc = commands[ p.functionName];
        if( stc === undefined ) {
          this.printError("syntax");
        }
        else {
            val = commands[ p.functionName]( values );
        }

      }
      catch ( e ) {
        console.log(e);
        this.printError("unexpected");
      }
    }

    return val;
  }

  evalExpression( expr ) {

    var val = this.evalExpressionPart( expr.parts[ 0 ] );

    for( var i=1; i<expr.parts.length; i++) {
      var p = expr.parts[ i ];
      if( p.op == "+" ) {
        val += this.evalExpressionPart( p );
      }
      else if( p.op == "-" ) {
        val -= this.evalExpressionPart( p );
      }
      else if( p.op == "*" ) {
        val *= this.evalExpressionPart( p );
      }
      else if( p.op == "/" ) {
        val /= this.evalExpressionPart( p );
      }
      else if( p.op == ";" ) {
        val += ("" + this.evalExpressionPart( p ));
      }
      else {
        throw "unknown op '"+p.op+"'";
      }
    }

    return val;
  }

  cycle() {
    var c = this.console;

    if( !this.runFlag ) {
      if(this.cursorCount++>15) {
        this.cursorCount = 0;

        c.blinkCursor();
      }
    }
    else {

      var p = this.program;

      for( var cyc=0; cyc<5; cyc++) {
        var l = p[ this.runPointer ];

        this.runCommands( l[1] );
        if( !this.gotoFlag) {
          this.runPointer ++;
          if( this.runPointer >=  p.length ) {
            this.runFlag = false;
            c.clearCursor();
          }
        }
        else {
          this.gotoFlag = false;
        }
      }
    }

  }



  goto( line ) {
    var pgm = this.program;
    var len=this.program.length;

    for( var i=0; i<len; i++) {
      var l = pgm[i];

      if( l[0] == line ) {
        this.runPointer = i;
        //console.log("GOTO: Setting runpointer to "+ i);
        this.gotoFlag = true;
        return;
      }
    }
  }

  runStop() {
    if( this.runFlag ) {
      var c = this.console;
      this.runFlag = false;
      c.clearCursor();
      console.log("stop");
      this.printLine( "break in " + this.program[ this.runPointer ][0]);
      this.printLine( "ready.");
    }
  }


  runPGM() {
    var c = this.console;
    if( this.program.length > 0) {
      this.runFlag = true;
      c.clearCursor();
      this.runPointer = 0;
      this.gotoFlag = false;
    }
  }

  runCommands( cmds ) {
    var commands = this.commands;

    for( var i=0; i<cmds.length; i++) {
      var cmd=cmds[i];
      if( cmd.type == "control" )  {
        var cn = cmd.controlKW;
        if( cn == "goto" ) {
          this.goto( cmd.params[0] );
        }
      }
      else if( cmd.type == "call" )  {
        var values = [];
        for( var j=0; j<cmd.params.length; j++) {
          var p = this.evalExpression( cmd.params[j] );;
          values.push( p );
        }
        try {
          var stc = commands[ cmd.statementName];
          if( stc === undefined ) {
            this.printError("syntax");
          }
          else {
              commands[ cmd.statementName]( values );
          }

        }
        catch ( e ) {
          console.log(e);
          this.printError("unexpected");
        }
      }
      else if( cmd.type == "assignment" )  {
        if( this.vars[ cmd.var ] === undefined ) {
          this.vars[ cmd.var ] = 0;
        }
        this.vars[ cmd.var ] = this.evalExpression( cmd.expression );
        //console.log("VAR("+cmd.var+")=" + this.vars[ cmd.var ]);
      }
    }
  }

  insertPgmLine( linenr, commands, raw ) {

    for( var i=0; i<this.program.length; i++) {
      var pl=this.program[i];
      if( pl[0] == linenr ) {
        this.program[i] = [linenr, commands, raw ];
        return;
      }
    }

    this.program.push( [linenr, commands, raw ]);

    var sortF = function compare( a, b ) {
      return a[0] - b[0];
    }

    this.program.sort( sortF );
    //this.autoSave();

  }

  new( linenr ) {

    this.program = [];
    //this.autoSave();
  }

  removePgmLine( linenr ) {

    var pgm2 = [];

    for( var i=0; i<this.program.length; i++) {
      var pl=this.program[i];
      if( pl[0] != linenr ) {
        pgm2.push(pl);
      }
    }
    this.program = pgm2;
    //this.autoSave();
  }


  save() {
    var myStorage = window.localStorage;

    console.log( this.program );

    localStorage.setItem('w64AutoSav', JSON.stringify( this.program ) );
  }

  load() {
    var json = localStorage.getItem('w64AutoSav');

    this.program = JSON.parse( json );
    if(this.program == null ) {
      this.program=[];
    }
    var p = this.program;
    for( var i=0; i<p.length; i++) {
      if( p[i] == null ) {
        delete p[i];
      }
    }
  }


  handleLineInput( str ) {
    var p = new Parser();
    p.init();
    var l = p.parseLine( str );
    if( l == null ) {
      return;
    }
    if( l.lineNumber != -1 ) {
      if( l.commands.length > 0) {
        this.insertPgmLine( l.lineNumber, l.commands, l.raw);
        //this.program[ l.lineNumber ] = [l.commands,l.raw];
      }
      else {
        this.removePgmLine( l.lineNumber  );
      }
    }
    else {
      this.runCommands( l.commands );
      this.printLine("ready.");

    }

    console.log("program:",this.program);
    console.log("Line: ", l );
  }

}
