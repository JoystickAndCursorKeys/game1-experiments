class BasicCommands {

  constructor( context ) {
    this.console = context.console;
    this.context = context;
    this.cmds = {};

    this.pushCmd( "list", { paramCount: 0, param: [] } );
    this.pushCmd( "print", { paramCount: 1, param: [] } );

  }

  pushCmd( cmd, def ) {
    this.cmds[cmd] = def;
  }

  list( pars ) {
    var context = this.context;

    for (const l of context.program)
      {
        context.printLine( l[2] );
      }
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
}
