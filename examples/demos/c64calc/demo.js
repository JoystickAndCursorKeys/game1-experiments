function evalInScope(js, contextAsScope) {
  //# Return the results of the in-line anonymous function we .call with the passed context
  return function() { with(this) { return eval(js); }; }.call(contextAsScope);
}


class Demo {

  constructor( console ) {
    this.console = console;

    this.cat = [
      0, 0, 0, 0, 0, 0, 0, 65, 0, 0, 193, 128, 1, 227, 192, 1, 227, 192, 3, 247, 224,
      6, 62, 48, 12, 28, 24, 13, 157, 152, 221, 157, 157, 46, 62, 58, 23, 255, 244, 31, 255, 252,
      235, 247, 215, 23, 213, 236, 47, 227, 244, 199, 255, 243, 3, 255, 224, 1, 255, 192, 0, 0, 0

    ]

  }


  initFunctions( ctx ) {

    var c = this.console;

    ctx.cls=function() {c.clearScreen();};
    ctx.color=function(x) {console.log(c);console.log("col="+x);ctx._.screen.setColor(x);ctx._.lastCol=x;};
    ctx.background=function(x) {c.setBGColor(x);ctx._.lastBGCol=x;};
    ctx.border=function(x) {c.setBorderColor(x);ctx._.lastBorderCol=x;};
    ctx.cls=function() {c.clearScreen();};
    ctx.cls=function() {c.clearScreen();};
    ctx.spriteon=function(s,f) {c.spriteEnable( s, f );}
    ctx.reset=function() { ctx._._this.reset();}
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
    ctx.go=function(site0,p2) {
      if( site0=="google") { window.open("http://www.google.com",'blank'); }
      else if( site0=="twitter") { window.open("http://www.twitter.com",'blank'); }
      else if( site0=="x16") { window.open("https://www.commanderx16.com/forum/index.php?/files/",'blank'); }
      else if( site0=="gamedev") { window.open("https://www.gamedev.net/blogs/",'blank'); }
      else if( site0=="radio") { window.open("http://localhost/myradio/",'blank'); }
    }

    ctx.search=function(par) {
      window.open("http://www.google.com/search?q="+par,'blank');
    }
    ctx.showme=function(par) {
      window.open("http://www.google.com/search?q="+par+"&tbm=isch",'blank');
    }

  }

  initPlayBook( properties ) {

    this.width = properties.w;
    this.height = properties.h;

    this.console.reset();
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

    this.initFunctions( ctx );


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
    c.writeString("    **** GAME1 C64 SCREEN DEMO ****",true);
    c.writeString("",true);
    c.writeString("      JAVASCRIPT BASED CALCULATOR",true);
    c.writeString("",true);
    c.writeString("ready", true);



  }

  /*
	Playing the demo
  */
  play(action, data) {

    if (action == "INIT") {
        this.cursorCount = 1;
        var c = this.console;
        this.reset();

        this.x=0; this.y=21;

        c.spriteFrame( 0, 0 );
        c.spriteCol(0,1);
        c.spritePos(0,100,100);

        for( var i=0; i<63; i++) {
            c.spritePoke(0,i,this.cat[i]);
        }
        c.spriteReFrame( 0,0 );
        //c.spriteEnable( 0, true );
    }
  }

  initExecuteCommand( c )
  {
    if( this.cmdInit ) {  return; }
    this.cmdInit = true;

    var ctx = this.programContext;
    ctx._.screen = c;
    ctx._._this = this;

  }

  executeCommand( c, cmd ) {

    this.initExecuteCommand( c );

    var w=40;
    var h=20;

    var ctx = this.programContext;

    try {
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
    catch (error) {
      console.log( error );
      c.writeString(error+"", true);
    }


  }



  playHandle( evt ) {
    if( evt.type == 'keydown' ) {

      //console.log(evt);

      var c = this.console;
      if( evt.key == "Enter") {
          c.clearCursor();
          var line=c.getCurrentLine();
          //console.log( line );
          c.writeString("", true);
          this.executeCommand( c, line );


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
      else {
          if( evt.key.length == 1) {
            c.clearCursor();
            c.writeChar( evt.key );
          }

      }


    }
  }


  playRun() {

    var c = this.console;
    if(this.cursorCount++>15) {
      this.cursorCount = 0;

      c.blinkCursor();
    }

    this.x++;
    //this.y++;
    if(this.x>400) { this.x = 0;}
    if(this.y>250) { this.y = 0;}
    c.spritePos(0,this.x,this.y);

    return false;
  }


  playRender(context) {

    this.console.renderDisplay();

  }


}
