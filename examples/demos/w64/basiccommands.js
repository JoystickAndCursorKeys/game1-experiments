class BasicCommands {

  constructor( context ) {
    this.console = context.console;
    this.context = context;
    this.cmds = {};
    this.func = {};

/*
    this.pushCmd( "list", { paramCount: 0, param: [] } );
    this.pushCmd( "run", { paramCount: 0, param: [] } );
    this.pushCmd( "print", { paramCount: 1, param: [] } );
    this.pushCmd( "new", { paramCount: 1, param: [] } );
    this.pushCmd( "load", { paramCount: 1, param: [] } );
    this.pushCmd( "save", { paramCount: 1, param: [] } );

    this.pushCmd( "len", { paramCount: 1, param: [] } );
    this.pushCmd( "sin", { paramCount: 1, param: [] } );
*/
  }

  pushCmd( cmd, def ) {
    this.cmds[cmd] = def;
  }

  pushFunc( cmd, def ) {
    this.func[cmd] = def;
  }

  /* commands */
  new( pars ) {
    this.context.new();
  }

  list( pars ) {
    var context = this.context;

    for (const l of context.program)
      {
        context.printLine( l[2] );
      }
  }

  load( pars ) {
    var context = this.context;

    context.load();
    context.printLine("");
    context.printLine("searching");
    context.printLine("found default.prg");
    context.printLine("loading");
  }

  save( pars ) {
    var context = this.context;

    context.save();
  }


  run( pars ) {
    var context = this.context;

    context.runPGM();
  }

  print( pars ) {
    var context = this.context;

    if( pars.length != 0 ) {
        context.printLine( "" + pars[0] );
    }
    else {
      context.printLine( "" );
    }
  }

  poke( pars ) {

    var context = this.context;
    context.poke( pars[0], pars[1]);

  }

  /* functions */
  len( pars ) {
    return pars[0].length;
  }

  val( pars ) {
    return parseInt( pars[0] );
  }

  exp( pars ) {
    return Math.exp( pars[0] );
  }

  rnd( pars ) {
    return Math.random();
  }

  sqr( pars ) {
    return Math.sqrt( pars[0]);
  }

  log( pars ) {
    return Math.log( pars[0]);
  }

  sin( pars ) {
    return Math.sin( pars[0]);
  }

  cos( pars ) {
    return Math.cos( pars[0]);
  }

  spc( pars ) {
    var out="";
    for( var i=0; i<pars[0]; i++) {
      out+=" ";
    }
    return out;
  }



  max(x,m) {
    if( x<m ) {  return x; }
    return m;
  }

  usr() {
    return 0;
  }

  int( pars ) {
    return Math.floor( pars[0] );
  }

  tab( pars ) {
    var context = this.context;
    context.setCursXPos( max( pars[0], 39) );
    return "";
  }

  sgn( pars ) {
    var x = pars[0];

    if( x<0 ) { return -1; }
    else if( x>0 ) { return 1; }
    return 0;
  }
}
