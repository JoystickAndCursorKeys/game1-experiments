class BasicContext {

  constructor( console ) {
    this.console = console;

    this.program = [];

    var ctx = this.context;
    var c = this.console;
    this.commands = new BasicCommands( this );

  }

  printError( s ) {
    this.console.writeString( "?" + s + " error", true );
  }

  printLine( s ) {
    this.console.writeString( s, true );
  }

  reset() {
  }


  evalExpressionPart( p ) {
    var val=0;

    if( p.type=="num" ) {
      val = parseInt(p.data);
    }
    else if( p.type=="str" ) {
      val = p.data;
    }
    else if( p.type=="expr" ) {
      val = this.evalExpression( p );
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

  runCommands( cmds ) {
    var commands = this.commands;

    for( var i=0; i<cmds.length; i++) {
      var cmd=cmds[i];
      if( cmd.type == "call" )  {
        var values = [];
        for( var j=0; j<cmd.params.length; j++) {
          var p = this.evalExpression( cmd.params[j] );
          values.push( p );
        }
        try {
          if( commands[ cmd.statementName] === undefined ) {
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
  }

  handleLineInput( str ) {
    var p = new Parser();
    p.init();
    var l = p.parseLine( str );

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
    }

    console.log("program:",this.program);
    console.log("Line: ", l );
  }

}
