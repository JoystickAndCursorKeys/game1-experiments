

var __sites={};

__sites["google"] = "http://www.google.com";
__sites["twitter"] = "http://www.twitter.com";
__sites["x16"] = "https://www.commanderx16.com/forum/index.php?/files/";
__sites["gamedev"] = "https://www.gamedev.net/blogs/";
__sites["radio"] = "http://localhost/myradio/";
__sites["youtube"] = "http://www.youtube.com";


function cmduuHandleCommas( s ) {
  var parts = s.split(",");

  for( var i=0; i<parts.length; i++ ) {
    parts[ i ] = parts[ i ].trim();
  }
  return parts;
}

function cmdGo( pars ) {
    var ctx = pars.programContext;

    var site0 = pars.rest;
    var done=false;

    if( __sites.hasOwnProperty( site0 )) {
      done=true; window.open( __sites[site0],'blank');
    }

    var c = ctx._.screen;
    if(! done ) {
      c.writeString("?where to go error",true);
    }
}


function cmdSearch( pars ) {

  var ctx = pars.programContext;

  var site0 = pars.rest;
  var done=false;

  var search = pars.parts[1];
  for( var i=2; i<pars.parts.length; i++) {
    search+"+"+pars.parts[i];
  }

  window.open("http://www.google.com/search?q="+search,'blank');

}

function cmdShow( pars ) {

  var ctx = pars.programContext;

  var site0 = pars.rest;
  var done=false;

  var search = pars.parts[1];

  window.open("http://www.google.com/search?q="+search+"&tbm=isch",'blank');

}

function cmdCls( pars ) {

  var ctx = pars.programContext;

  var c = ctx._.screen;
  c.clearScreen();

}

function cmdPrint( pars ) {

  var ctx = pars.programContext;

  var c = ctx._.screen;
  var params = cmduuHandleCommas( pars.rest );
  var parCount = params.length;

  if( parCount < 1 ) {
     c.writeString("",true);
     return;
  }

  c.writeString(params[0],true);

}


function cmdColor( pars ) {

  var ctx = pars.programContext;

  var c = ctx._.screen;
  var params = cmduuHandleCommas( pars.rest );
  var parCount = params.length;

  if( parCount < 1 ) {
     throw "@no color specified";
  }

  if( parCount >= 1 ) {
    var color = params[0];
    c.setColor( color );
  }
  if( parCount >= 2 ) {
    var color = params[1];
    c.setBGColor( color );
  }
  if( parCount == 3 ) {
    var color = params[2];
    c.setBorderColor( color );
  }
  if( parCount >= 4 ) {
    throw "@too many colors (max=3)";
  }
}

function isCommandAbbreviation( c ) {
  if( c == "?" ) {
    return true;
  }
  else if( c == "!" ) {
    return true;
  }
  return false;
}

function isKeywordCharacter( c ) {

  let n = c.charCodeAt(0);
  let strStartsWithALetter = (n >= 65 && n < 91) || (n >= 97 && n < 123);
  return strStartsWithALetter;
}

function register( main, ctx) {

  var t=main;

  t.pushCmd(ctx, cmdGo, "go",           {type: "stat", parsep: "comma", pars: 1 });
  t.pushCmd(ctx, cmdShow, "show",       {type: "stat", parsep: "comma", pars: 1 });
  t.pushCmd(ctx, cmdSearch, "!",        {type: "stat", parsep: "comma", pars: 1 });
  t.pushCmd(ctx, cmdCls, "cls",         {type: "stat", parsep: "comma", pars: 0 });
  t.pushCmd(ctx, cmdColor, "color",     {type: "stat", parsep: "comma", pars: 3, optional: [1,2] });
  t.pushCmd(ctx, cmdPrint, "print",     {type: "stat", parsep: "comma", pars: 1 });
  t.pushCmd(ctx, cmdPrint, "?",         {type: "stat", parsep: "comma", pars: 1 });

}
