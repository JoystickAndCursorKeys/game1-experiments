function evalInScope(js, contextAsScope) {
  //# Return the results of the in-line anonymous function we .call with the passed context
  return function() { with(this) { return eval(js); }; }.call(contextAsScope);
}



class Interpreter {


  constructor( console ) {
    this.console = console;

    this.program = [];

    this.programContext=Math;
    this.programContext.pi = this.programContext.PI;
    this.programContext.e = this.programContext.E;

    var ctx = this.programContext;
    var c = this.console;

    ctx._={}
    ctx.col=14;
    ctx._.lastCol=14;
    ctx.bgcol=6;
    ctx._.lastBGCol=6;
    ctx.bcol=14;
    ctx._.lastBorderCol=14;
    ctx._.screen = c;
    ctx._._this = this;
    ctx._mode = "cmd";

    this.initFunctions( ctx );
    this.initCommands( ctx );

    this.autoLoad();

  }


  pushCmd( ctx, cmd, expression ) {

    if( !ctx.commands ) {
      ctx.commands = [];
    }

    var parts = expression.trim().split(" ");

    ctx.commands[ parts[ 0 ] ]
      =
        {
          cmd: cmd
        }
  }


    initCommands( ctx ) {


      register( this, ctx );

    }


    initFunctions( ctx ) {

      var c = this.console;

      ctx.cls=function() {c.clearScreen();};
      ctx.color=function(x) {console.log(c);console.log("col="+x);ctx._.screen.setColor(x);ctx._.lastCol=x;};
      ctx.background=function(x) {c.setBGColor(x);ctx._.lastBGCol=x;};
      ctx.border=function(x) {c.setBorderColor(x);ctx._.lastBorderCol=x;};
      ctx.reset=function() { ctx._._this.reset();}
      //ctx.spriteon=function(s,f) {c.spriteEnable( s, f );}
      ctx.print=function(s0) {
          var s=s0+"";
          for( var i=0; i<s.length; i++) {
              if( s[i] == '\n' ) {
                  c.writeString("",true);
              }
              else if( s[i] == '¤' ) {
                  c.clearScreen();
              }
              else {
                  c.writeChar(s[i]);
              }
          }
        }

    }

    reset() {

      var ctx=this.programContext;
      var c=this.console;

      ctx.col=14;
      ctx._.lastCol=14;
      ctx.bgcol=6;
      ctx._.lastBGCol=6;
      ctx.bcol=14;
      ctx._.lastBorderCol=14;
      ctx._.screen = c;

      ctx.color(ctx.col);
      ctx.background(ctx.bgcol);
      ctx.border(ctx.bcol);

      c.clearScreen();

      c.writeString("",true);
      c.writeString("        **** commodore w64 ****",true);
      c.writeString("",true);
      c.writeString("    your digital friendly assistant",true);
      c.writeString("",true);
      c.writeString("ready.", true);



    }


    initExecuteInput( c )
    {
      if( this.cmdInit ) {  return; }
      this.cmdInit = true;

      var ctx = this.programContext;
      ctx._.screen = c;
      ctx._._this = this;

    }

    getCommands( x ) {
      return [
        {raw: x}
      ];
    }

    autoSave() {
      var myStorage = window.localStorage;

      console.log( this.program );

      localStorage.setItem('w64AutoSav', JSON.stringify( this.program ) );
    }

    autoLoad() {
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

    executePGMCommand( cmd0, linenr ) {

      var ctx = this.programContext;

      var cmdstring = cmd0.trim();
      var parts = cmdstring.split(" ");
      var cmd = parts[0];
      var c = ctx._.screen;


      if( ! ctx.commands.hasOwnProperty( cmd ) ) {

        c.writeString( "?command not found error, '"+cmd+"' at " + linenr, true );

        return;
      }


      var pars = {
        parts: parts,
        cmd: cmd,
        orginal: cmd0,
        rest: cmdstring.substr( cmd.length ).trim(),
        restoriginal: cmdstring.substr( cmd.length ),
        programContext: ctx
      }

      try {
        ctx.commands[ cmd ].cmd( pars );

      }
      catch ( e ) {
        var handled = false;
        if (typeof e === 'string') {
          if ( e.charAt(0)  === '@' ) {
            c.writeString("?" + e.substring(1)+ " error", true);
            handled = true;
          }
        }
        if(!handled ) {
            c.writeString("?bad error", true);
        }
        console.log(e);
        return false;
      }

      return true;
    }

    run() {
      for(var key in this.program){
            var cmds = this.getCommands( this.program[ key ].raw );
            var ok=this.executePGMCommand( cmds[0].raw, key );
            if(!ok) { break; }
         }
    }

    splitCommands( txt ) {
      var inString = 0;
      var splitPos = [];
      for( var i=0; i<txt.length; i++) {
        var c=txt.charAt(i);

        if( ! inString ) {
          if( c==":" ) {
            splitPos.push( i );
          }
          else if( c=="\"" ) {
            inString = true;
          }
        }
        else {
          if( c=="\"" ) {
            inString = false;
          }
        }
      }

      var parts = [];
      var part=0;
      parts[0] = "";
      //a:b:c
      //
      //p[0]=a
      for( var i=0; i<txt.length; i++) {

        if( splitPos.indexOf( i ) > -1) {
          part++;
          parts[part]="";
        }
        else {
          parts[part]+=txt[i];
        }
      }
      console.log(parts);


      return parts;
    }

    parseLine( txt ) {
      var cmds = this.splitCommands( txt );

      for( var i=0; i<cmds.length; i++) {
        cmds[i] = this.parseCommand( cmds[i] );
      }
      return cmds;
    }

    copyState( s1 ) {
      return {
        c: s1.c,
        isNum: s1.isNum,
        isKeywordCharacter: s1.isKeywordCharacter,
        inString: s1.inString,
        whiteSpace: s1.whiteSpace
      };
    }

    compareState( s1, s2 ) {
      if( s2 == null ) {
        return true;
      }

      if(s1.inString && s2.inString) {
        return true;
      }
      return (
        s1.isNum == s2.isNum &&
        s1.isKeywordCharacter == s2.isKeywordCharacter &&
        s1.inString == s2.inString &&
        s1.whiteSpace == s2.whiteSpace
      )
      ;
    }

    stripString( s ) {
      return s.substr(1,s.length-2);
    }

    asToken( str ) {

        if( str == "," ) {
          return { id: "comma" };
        }
        else if( str.charAt(0) == "\"" ) {
          return { id: "string", value: this.stripString( str ) };
        }
        else if( !isNaN( parseInt( str ) ) ) {
          return { id: "number", value: str  };
        }
        else if( isKeywordCharacter( str.charAt(0 ) ) ) {
          return { id: "keyword", value: str  };
        }

        return { id: "symbol", value: str  };

    }


    tokenizeCommand( txt0 ) {
      var inString = 0;
      var isNumChar, isCmdChar;
      var txt = txt0.trim();

      if( txt.length == 0)  {
        return [];
      }

      var state  = {};
      var lastState = null;
      var splitPos = [];
      var inString = false;
      var states = [];

      for( var i=0; i<txt.length; i++) {
        var c=txt.charAt(i);

        if( c == "\"") {
          inString = !inString;
        }
        state.c = c;
        state.isNum=!isNaN( parseInt( c ) );
        state.isKeywordCharacter=isKeywordCharacter( c );
        state.inString = inString;
        if( !inString && c=="\"" ) {
          state.inString = true;
        }

        state.whiteSpace = (c == " ");

        states.push( this.copyState( state ) );

        var sameState = this.compareState( state, lastState );
        lastState = this.copyState( state );

        if(!sameState) {
          splitPos.push( i );
        }


      }

      splitPos.push( txt.length );

      var parts=[];
      var start=0, end;

      for( var i=0; i<splitPos.length; i++) {
        var end = splitPos[i];
        var part = txt.substr( start, (end-start));
        if( part.trim() != "" ) {
          parts.push( txt.substr( start, (end-start)) );
        }
        start=end;
      }

      var tokens = [];
      for( var i=0; i<parts.length; i++) {

        tokens[i] = {};
        tokens[i].raw = parts[i];
        tokens[i].type = this.asToken( tokens[i].raw );

      }

      return tokens;
    }

    buildCommand( txt, tokens )
    {
      var cmd = { raw: txt }
      if( tokens.length < 1 ) {
        cmd.error = "command to short";
        return;
      }
      if( tokens[0].type != "keyword" ) {
        cmd.error = "Expected keyword or variable";
        return;
      }

      return cmd;
    }

    parseCommand( txt ) {

      var tokens = this.tokenizeCommand( txt );

      var command = this.buildCommand( txt, tokens );
      /*
        "stat"
        "assign"
        "control"

      */

    }

    interpretCommand( cmd0, interactive ) {

      var ctx = this.programContext;

      var cmdstring = cmd0.trim();
      var parts = cmdstring.split(" ");
      var cmd = parts[0];
      var c = ctx._.screen;

      if( cmd == "" ) {
        return;
      }

      var isNum=!isNaN( parseInt( cmd ) );

      if( isNum ) {
          var numL = ("" + parseInt( cmd ) ). length;
          if( cmd.trim() == cmd0.trim() ) {
              delete this.program[ cmd ];
              this.autoSave();
          }
          else {

            var rawCode = cmd0.substr( numL ).trim();

            this.program[ cmd ] =
              {
                raw: rawCode,
                commands: this.parseLine( rawCode )
              }
            this.autoSave();
          }

          return;
      }
      else if( cmd  == 'new' ) {
        this.oldProgram = this.program;
        this.program = [];
        this.autoSave();
        c.writeString("ready.", true);
        return;
      }
      else if( cmd  == 'unnew' ) {
        this.program = this.oldProgram;

        this.autoSave();
        c.writeString("ready.", true);
        return;
      }
      else if( cmd  == 'list' ) {
        for(var key in this.program){
              c.writeString( key + " " + this.program[ key ].raw, true );
           }
        return;
      }
      else if( cmd  == 'run' ) {
        this.run();
        return;
      }
      else if( ! ctx.commands.hasOwnProperty( cmd ) ) {

        c.writeString( "?'"+cmd+"' not found error", true );

        return;
      }


      var pars = {
        parts: parts,
        cmd: cmd,
        orginal: cmd0,
        rest: cmdstring.substr( cmd.length ).trim(),
        restoriginal: cmdstring.substr( cmd.length ),
        programContext: ctx
      }

      try {
        ctx.commands[ cmd ].cmd( pars );

        if( interactive ) {
          c.writeString("ready.", true);
        }
      }
      catch ( e ) {
        var handled = false;
        if (typeof e === 'string') {
          if ( e.charAt(0)  === '@' ) {
            c.writeString("?" + e.substring(1)+ " error", true);
            handled = true;
          }
        }
        if(!handled ) {
            c.writeString("?bad error", true);
        }
        console.log(e)
      }



    }


    executeInput( c, cmd0 ) {

      var cmd = cmd0.trim();

      this.initExecuteInput( c );

      var w=40;
      var h=20;

      var ctx = this.programContext;

      try {

        if( ctx._mode == "cmd" ) {
            if( cmd == "calc" ) {
              ctx._mode = "calc";
              c.writeString("ready for your math.", true);
              return;
            }
            this.interpretCommand( cmd, true );
        }
        else {
          if( cmd == "command" ) {
            ctx._mode = "cmd";
            c.writeString("ready for your command.", true);
            return;
          }

          var result = evalInScope(cmd, ctx);
          console.log( ">>" + result  );
          if( result != undefined ) {
            c.writeString(result+"", true);
          }

          var _ = this.programContext._;
          if( ctx.col != _.lastCol ) {
            ctx.color(ctx.col);
          }
          else if( ctx.bgcol != _.lastBGCol ) {
            ctx.background(ctx.bgcol);
          }
          else if( ctx.bcol != _.lastBorderCol ) {
            ctx.border(ctx.bcol);
          }
        }
      }
      catch (error) {
        console.log( error );
        c.writeString(error+"", true);
      }


    }


}
