/*
---so tests

	10 print a(2,3):  q = 2 : q=4


---eo tests


	instruction =
		assignment | statementcall

	pad = "\s" | "\t"

	assignment = varname "=" expression

	varname = [pad]* namestring [pad]*

	namestring = [A-Za-z][A-Za-z0-9]*

	expression = constant | varname | "(" expression ")" | expression op expression

	op = "+" | "-" | "*" | "/" | ";"

	constant = constantstring | constantint

	constantstring = [pad]* '"' validstringcontent '"'

	validcontantstring =  [all_but_not_'"']*

	constantint = [pad]* [-]+[0-9]* [pad]*

	validconstantint = [-]+[0-9]*

	statementcall = statname [statpar]+ | [statpar] [sep statpar]*

	sep = ","

	statname = [pad]* namestring [pad]*

	statpar = expression


  parseRules.push(["pad", 		"isPadChar"		, "str"] );
  parseRules.push(["str", 		"isStrChar"		, "str"] );
  parseRules.push(["num", 		"isNumChar"		, "str"] );
  parseRules.push(["name", 		"isNameChar"	, "str"] );
  parseRules.push(["op", 			"isOpChar"   	, "chr"] );
  parseRules.push(["comp", 		"isCompChar"  , "chr"] );
  parseRules.push(["eq", 			"isEqChar"   	, "chr"] );
  parseRules.push(["bracket", "isBracket"   , "chr"] );
  parseRules.push(["sep", 		"isSepChar"   , "chr"] );
  parseRules.push(["cmdsep", 	"isCommandSepChar"   , "chr"] );



10  a = 10
15  a = (10)
20  a = 10 : b=10
30  a = "hi"
40  a = 10 + 10
50  a = sin( 1 )
60  a = sin()
70  a = b + sin() + "" + 2
80  a = b + ((sin() + "") + 2)
90  a = color(1,2)
100  print 1
110  print 1: print 2
120  print 1: a=10: print 1
130  print b + ((sin() + "") + 2)


  TODO
    IF
    THEN
    AND
    NOT
    OR
    GOTO
    GOSUB
    RETURN
    FOR TO NEXT STEP


      ()<-error (empty expression)
      sin()
      sin(()+5)
      sin()

*/


class Parser {

  init() {

	  this.CTRL_KW = ["if","then","and", "not", "or", "goto", "gosub", "return", "for", "to", "next", "step" ];
    this.INT_STAT =
     {
       "print": {
          params: {
            0: { type: "int", mandatory: true, keyword: null },
            1: { type: "int", mandatory: true, keyword: "to" }
          }
        },
				"color": {
           params: {
             0: { type: "int", mandatory: true, keyword: null },
             1: { type: "int", mandatory: false, keyword: "," },
						 2: { type: "int", mandatory: false, keyword: "," }
           }
         },
       "input": { parse: 'parseInput' },
     };

     this.screenCodes2CTRLTable = [];
     var tab = this.screenCodes2CTRLTable;

     tab['\x93'] = '\x13';
     tab['\xd3'] = '\x93';
  }

  Exception( ctx, x ) {
    console.log( ctx );
    console.log(" Exception " + x + " at line " + ctx.lineNumber);
    throw x + " at line " + ctx.lineNumber;
  }

/*
  screenCode2CTRLChar( c ) {
    var c2 = null;
    console.log(c.charCodeAt(0));
    c2 = this.screenCodes2CTRLTable[ c ];
    if( !(c2 === undefined )) {
      console.log("->"+c2)
      return c2;
    }

    return c;
  }

  screenCodes2CTRLChars( str ) {
    var str2 = "";

    for( 	var i=0;
          i<str.length;
          i++)
    {
      var c = str.charAt(i);

      var c2 = this.screenCode2CTRLChar( c );
      str2 += c2;
    }

    return str2;
  }

  handleStringsCTRLChars( tokens ) {

		for( 	var i=0;
					i<tokens.length;
					i++)
		{
			var token = tokens[i];

			if( token ) {
				if( token.type == "str" ) {
					token.data = this.screenCodes2CTRLChars( token.data );
				}
			}

		}

    return tokens;
  }
*/

	removePadding( tokens ) {
		var tokens2 = [];

		for( 	var i=0;
					i<tokens.length;
					i++)
		{
			var token = tokens[i];

			if( token ) {
				if( token.type != "pad" ) {
					tokens2.push( token );
				}
			}

		}

		return tokens2;
	}

  mergeCompTokens( tokens ) {
		var tokens2 = [];

		for( 	var i=0;
					i<tokens.length;
					i++)
		{
			var token = tokens[i];

			if( i>0 ) {
        var token2 = tokens[i-1];
				if( ( token.type == "comp" || token.type == "eq" ) &&
            ( token2.type == "comp" || token2.type == "eq" ) ) {
					token2.type = "@@removeme";
          token.data = token2.data + token.data;
          token.type = "comp";
          if( token.data == "><" ) {
            token.data = "<>";
          }
          else if( token.data == "=<" ) {
            token.data = "<=";
          }
          else if( token.data == "=>" ) {
            token.data = ">=";
          }

  			}
			}

		}

    for( 	var i=0;
					i<tokens.length;
					i++)
		{
      if( tokens[i].type!="@@removeme") {
        tokens2.push( tokens[i] );
      }
    }

		return tokens2;
	}


	parseFunParList( context ) {

		var tokens = context.tokens;
		var params = [];
		var even = true;

		var endTokens = [];
		endTokens.push( { type: "sep", data: "@@@all" });
		endTokens.push( { type: "bracket", data: ")" });

		endTokens.push();

		while( true ) {

			var token;

      if( tokens.length > 0) {
        if( tokens[0].type=="bracket" && tokens[0].data==")") {
          break;
        }
      }

			if( even ) {
        var expr = this.parseExpression( context, endTokens );
        expr.type = "expr";
				params.push( expr );
			}
			else {
				token = tokens.shift();

				if( token.type=="sep" ) {
					//all ok, next par
				}
				else {
					this.Exception( context, "expected comma or ), got "+token.type + " " + token.data);
				}
			}
			even = !even;
		}

		return params;
	}


	peekIfNextIsOpenBracket( context ) {

		var tokens = context.tokens;

		if( tokens.length > 0 ) {
			if( tokens[0].type == "bracket" && tokens[0].data == "(") {
				return true;
			}
		}
		return false;
	}

	parseSubExpression( context ) {

		var token = context.tokens.shift();

		if( !(token.type == "bracket" && token.data == "(")) {
			this.Exception( context, "parsing subexpression, expected '(', not " + token.type + " - " + token.data);
		}

		var endTokens = [];
		endTokens.push( { type: "bracket", data: ")" });

		var expr = this.parseExpression( context, endTokens );
		context.tokens.shift();

		expr.type = "expr";
		return expr;
	}


  tokensToString( token )  {
    var str = "";

    if(token.data == "@@@all") {
        str = str + "'" + token.type + "'";
    }
    else {
      str = str + "'" + token.type + "/" + token.data + "'";
    }

    return str;
  }

  endTokensToString( endTokenArry )  {
    var str = "";

    for( var et=0; et<endTokenArry.length; et++) {
      var endToken = endTokenArry[et];

      if( str != "") { str+= " ";}
      str += this.tokensToString( endToken );
    }
    return str;
  }

  isEndToken( token, endTokenArry ) {

    for( var et=0; et<endTokenArry.length; et++) {
      var endToken = endTokenArry[et];

      if( token.type == endToken.type && token.data == endToken.data ) {
        return true;
      }
      else if( token.type == endToken.type && endToken.data == "@@@all" ) {
        return true;
      }
    }
    return false;
  }

	parseExpression( context, endTokens ) {

		var tokens = context.tokens;
    if( tokens.length == 0) {
      return null;
    }

		var expression = {
					parts: []
		};

		var index = 0;
		var even = true;
		var op = null;
		var parts = expression.parts;

		while( true ) {
			var token, part;
			token = tokens.shift();

			if( !token ) {
				break;
			}

      var endLoop = this.isEndToken( token, endTokens );
      if( endLoop ) {
        if( parts.length == 0 ) {
          this.Exception( context, "empty expression");
        }
        tokens.unshift( token );
        break;
      }

			if( even ) {

				if( token.type == "num" ) {
					part = { type: "num", data: token.data, op: op };
					parts.push( part );
				}
				else if( token.type == "str" ) {
					part = { type: "str", data: token.data, op: op };
					parts.push( part );
				}
				else if( token.type=="bracket" && token.data=="(") {
						tokens.unshift( token );

            var subEndTokens = [];
            subEndTokens.push( { type: "bracket", data: ")" });

						var expr = this.parseSubExpression( context, subEndTokens );
            expr.op = op;
						parts.push ( expr );
				}
				else if( token.type=="name" ) {

						var name = token.data;
						var isFunctionCall = this.peekIfNextIsOpenBracket( context );

						if( isFunctionCall ) {
							token = tokens.shift();
							var parameters = this.parseFunParList( context );
              tokens.shift();

							part = { type: "funCall", params: parameters, op: op, functionName: name };
							parts.push ( part );
						}
						else {
							part = { type: "var", data: token.data, op: op };
							parts.push ( part );
						}
				}
				else {
					this.Exception( context, "expected number, string, symbol or '(', not " + token.data);
				}
        op = null;
			}
			else {

				if( token.type == "op" ) {
					op = token.data;
				}
				else {
					this.Exception( context, "expected operator or "+
          this.endTokensToString(endTokens)+
          ", not " + token.type + " " + token.data);
				}
			}
			even = !even;
		}

    if( op != null ) {
      part = { type: "uniop", data: null, op: op };
      parts.push ( part );
    }

		if( expression.parts == null ) {
			return null;
		}

		return expression;
	}

  normalizeStatementName( x ) {
    if(x == "?") {
      return "print";
    }
    return x;
  }

	parseLineCommands( context ) {


		var tokens = context.tokens;
		var commands = [];

		var i=1;
		while( true ) {

			var command = {};
			var token;

			command.lineNumber = context.lineNumber;

			token = tokens.shift();
			if( token === undefined ) {
				break;
			}
			if( token.type == "cmdsep" ) {
				/* empty command */
				continue;
			}

			if( token.type != "name" ) {
				this.Exception( context, "Unexpected token, expected symbolname, got " + token.type + "/" + token.name) ;
			}

			var nameToken = token.data;
			var cmdType = "unknown";

			if( this.CTRL_KW.indexOf( token.data ) > -1) {
					cmdType = "control";
			}

			token = tokens.shift();
			if( token === undefined ) {
				token = { type: "@@@notoken" };
			}


			if( token.type == "eq") {
				if( cmdType == "control" ) {
					this.Exception( context, "Unexpected symbol name, '"+nameToken+"' is a control keyword");
				}
				cmdType = "assignment";
				command.type = cmdType;
				command.var = nameToken;

				var endTokens = [];
				endTokens.push( { type: "cmdsep", data: "@@@all" });

				command.expression = this.parseExpression( context, endTokens );
				commands.push( command );
			}
			else {
				if( cmdType == "control" ) {
					cmdType = "control";
					command.type = cmdType;
					command.controlKW = nameToken;
					tokens.unshift( token );

          if( command.controlKW == "goto") {
            var num = -1;

            token = tokens.shift();
            if( token.type != "num") {
              this.Exception( context, "GOTO expects number");
            }
            num = parseInt(token.data);
            token = tokens.shift();
            if( token !== undefined ) {
              if( token.type != "cmdsep") {
                this.Exception( context, "expected cmdsep, instead of "+token.type+"/"+token.data);
              }
            }

            command.params=[];
            command.params[0] = num;
            commands.push( command );

          }
          else if( command.controlKW == "if") {

            var expr1, expr2, comp;
            var endTokens = [];
            endTokens.push( { type: "eq", data: "=" });
            endTokens.push( { type: "comp", data: "<" });
            endTokens.push( { type: "comp", data: ">" });
            endTokens.push( { type: "comp", data: ">=" });
            endTokens.push( { type: "comp", data: "<=" });
            endTokens.push( { type: "comp", data: "<>" });

						var expr1 = this.parseExpression( context, endTokens );

            token = tokens.shift();
            if( token.type != "eq" && token.type != "comp" ) {
              this.Exception( context, "If expects expr [comp|eq] expr, no expr found, found " + token.type+"/"+token.data);
            }
            comp = token.data;

            endTokens = [];
            endTokens.push( { type: "name", data: "then" });

            var expr2 = this.parseExpression( context, endTokens );
            token = tokens.shift();

            command.params=[];
            command.params[0] = expr1;
            command.params[1] = expr2;
            command.comp = comp;


            command.block = this.parseLineCommands( context );

            commands.push( command );

          }
          else {
            this.Exception( context, command.controlKW + " not implemented");
          }


				}
				else {
					cmdType = "call";
					command.statementName = this.normalizeStatementName( nameToken );
					command.type = cmdType;

					if( token.type != "@@@notoken") {
						tokens.unshift( token );
					}


					command.params = [];

					while ( true ) {

						var endCommand = false;
						var endTokens = [];
						endTokens.push( { type: "sep", data: "@@@all" });
						endTokens.push( { type: "cmdsep", data: "@@@all" });

						var expression = this.parseExpression( context, endTokens );
            console.log( expression );

						if( expression != null ) {
							command.params.push( expression );

							token = tokens.shift();
							if( token != undefined ) {
								if( token === undefined ) {
									endCommand = true;
								}
								if( token.type == "cmdsep" ) {
									endCommand = true;
								}
								else if( token.type == "sep") {
									continue;
								}
								else {
									this.Exception( context, "unexpected chars in statement call: '" + token.data +"'");
								}
							}
							else {
								endCommand = true;
							}

						}
						else {
							endCommand = true;
						}

						if( endCommand  ) {
							commands.push( command );
							break;
						}

					}
				}
			}


		}
    return commands;
	}

  logTokens( tokens ) {
    var tokensStr = "";
    for( var i=0; i<tokens.length; i++) {
      var tok = tokens[i];
      var tokStr = tok.type + ":" + tok.data;
      if( tokensStr != "" ) {
        tokensStr += ", ";
      }
      tokensStr += tokStr;
    }

    console.log( tokensStr );

    for( var i=0; i<tokens.length; i++) {
      var tok = tokens[i];
      console.log("token: ",tok);
    }
  }

  parseLine( line ) {

    var lineRecord = {
      lineNumber: -1,
      commands: []
    };

		var toker = new Tokenizer( new StringReader ( line ) );
		var tokens = toker.tokenize();
    tokens = this.removePadding( tokens );
    tokens = this.mergeCompTokens( tokens );
    //tokens = this.handleStringsCTRLChars( tokens );

    this.logTokens( tokens );


    if( tokens.length == 0 ) {
			return null;
		}

		if( tokens[0].type == "num" ) {
			lineRecord.lineNumber = tokens[0].data;
      tokens.shift();
    }

		var context = {
      tokens: tokens,
      lineNumber: lineRecord.lineNumber
    }

    //context.tokens = this.removePadding( context.tokens );
    var commands = this.parseLineCommands( context );
    lineRecord.commands = commands;
    lineRecord.raw = line;
    return lineRecord;

  }

  /*parseLineToContext( context ) {

		var toker = new Tokenizer( new StringReader ( context.line ) );
		var tokens = toker.tokenize();


    var line = context.line;
    var lineNr = 0;
    var ExceptionLinNr = { syntaxError: true, message: "Line should start with LINENUMBER followed by a space or a tab character, line index=" + context.lineIndex };


    if( tokens.length == 0 ) {
			return null;
		}

		if( tokens[0].type == "num" ) {
			lineNr = tokens[0].data;
    }
		else {
			this.Exception( context, ExceptionLinNr);
		}

    context.lineNumber = lineNr;

		tokens.shift();
		context.tokens = tokens;
		this.parseLineCommands( context );

  }*/

  /*parse( code ) {

    this.init();

    var regExp=/\r\n|\n\r|\n|\r/g;
    var lines = code.replace(regExp,"\n").split("\n");
    var context = {
        lines: lines, line: null,
				commands: []
      }

    var len = lines.length;

    try {

      for (var i = 0; i < len; i++) {
        context.line = lines[i];
        context.lineIndex = i;

        this.parseLineToContext( context );
      }

    }
    catch(err) {
      if( !err.syntaxError ) {
        return {
          error: true,
          syntaxError: false,
          errorMessage: err.message,
          exception: err
        }
      }
      return {
        error: true,
        syntaxError: true,
        errorMessage: err.message,
      }
    }

    return context;
  }*/

}
