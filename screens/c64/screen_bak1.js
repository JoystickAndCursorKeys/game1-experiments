class C64SpriteFrame {
	constructor() {
		this.ini = false;
	}

	init() {
		if( this.ini ) { return; }

		this.canvas =  document.createElement('canvas');
		this.context = this.canvas.getContext('2d');

		this.canvas.width=24;
		this.canvas.height=21;

		this.ini = true;

	}

	getCanvas() {
		this.init();
		return this.canvas;
	}

}


class C64Screen {

	 constructor( rcanvasid, c64path, onload, onloaddata  ) {

		  var __this = this;
		  var font = new Image();
		  this.font = font;
		  this.onload = onload;
		  this.onloaddata = onloaddata;

 		  this.vic = [];
			this.vicUsed = [];

			for( var i=0; i<47; i++) {
				vic.push(0);
			}

      font.onload = function ( evt ) {
        __this._postLoadFontImage();
      }

      font.src = c64path + "/res/petscii.png";
      this.ready = false;

      this.canvas =  document.createElement('canvas');
      this.context = this.canvas.getContext('2d');

			this.rcanvas =  document.getElementById( rcanvasid );
      this.rcontext = this.rcanvas.getContext('2d');

      this.canvas.width=320;
      this.canvas.height=200;

			this.bufcanvas =  document.createElement('canvas');
      this.bufcontext = this.bufcanvas.getContext('2d');
			this.bufcanvas.width=320;
			this.bufcanvas.height=200;


			this.border = {
				w: 64,
				h: 32
			}

			this.WIDTH = 640;
			this.HEIGHT = 400;

			this.FULLWIDTH = this.WIDTH + this.border.w * 2;
			this.FULLHEIGHT = this.HEIGHT + this.border.h * 2;

			this.rcanvas.width=this.FULLWIDTH ;
      this.rcanvas.height=this.FULLHEIGHT;


			this.context.imageSmoothingEnabled= false;

			this.colors = [];

			this.colors[ 0 ] = { r:1, g:1, b:1 };
			this.colors[ 1 ] = { r:255, g:255, b:255 };
			this.colors[ 2 ] = { r:136, g:0, b:0 };
			this.colors[ 3 ] = { r:170, g:255, b:238 };
			this.colors[ 4 ] = { r:204, g:68, b:204 };
			this.colors[ 5 ] = { r:0, g:204, b:85 };
			this.colors[ 6 ] = { r:0, g:0, b:170 };
			this.colors[ 7 ] = { r:238, g:238, b:119 };
			this.colors[ 8 ] = { r:221, g:136, b:85 };
			this.colors[ 9 ] = { r:102, g:68, b:0 };
			this.colors[ 10 ] = { r:255, g:119, b:119 };
			this.colors[ 11 ] = { r:51, g:51, b:51 };
			this.colors[ 12 ] = { r:119, g:119, b:119 };
			this.colors[ 13 ] = { r:170, g:255, b:102 };
			this.colors[ 14 ] = { r:0, g:136, b:255 };
			this.colors[ 15 ] = { r:187, g:187, b:187 };

			var map = [];

			map['@'] = 0;
			map['a'] = 1;
			map['b'] = 2;
			map['c'] = 3;
			map['d'] = 4;
			map['e'] = 5;
			map['f'] = 6;
			map['g'] = 7;
			map['h'] = 8;
			map['i'] = 9;
			map['j'] = 10;
			map['k'] = 11;
			map['l'] = 12;
			map['m'] = 13;
			map['n'] = 14;
			map['o'] = 15;
			map['p'] = 16;
			map['q'] = 17;
			map['r'] = 18;
			map['s'] = 19;
			map['t'] = 20;
			map['u'] = 21;
			map['v'] = 22;
			map['w'] = 23;
			map['x'] = 24;
			map['y'] = 25;
			map['z'] = 26;

			map['['] = 27;
			map[']'] = 29;
			map['!'] = 33;
			map['"'] = 34;
			map['#'] = 35;
			map['$'] = 36;
			map['%'] = 37;
			map['&'] = 38;
			map['\''] = 39;
			map['\\'] = 77;
			map['{'] = 0x73;
			map['}'] = 0x6b;
			map['('] = 40;
			map[')'] = 41;

			map['*'] = 42;
			map['+'] = 43;
			map[','] = 44;
			map['-'] = 45;
			map['.'] = 46;
			map['/'] = 47;

			map['0'] = 48;
			map['1'] = 49;
			map['2'] = 50;
			map['3'] = 51;
			map['4'] = 52;
			map['5'] = 53;
			map['6'] = 54;
			map['7'] = 55;
			map['8'] = 56;
		  map['9'] = 57;

			map[' '] = 32;

			map[':'] = 58;
			map[';'] = 59;
			map['<'] = 60;
			map['='] = 61;
			map['>'] = 62;
			map['?'] = 63;

			this.map = map;

			var backmap = []
			var mapInfo = Object.entries(map);
			for( var i=0; i<mapInfo.length; i++) {
				backmap[ mapInfo[i][1]] = mapInfo[i][0];
			}
			backmap[32] = " ";
			this.backmap = backmap;
			console.log( backmap );

			this.sprites = [];

			for( var i=0; i<8; i++ ) {

				this.sprites[ i ] = new Object();
				var sp = this.sprites[ i ];
				sp.x = 0; sp.y = 0; sp.enabled = 0; sp.frame = 0; sp.col = 0;

				sp.canvas = document.createElement('canvas');
				sp.context = sp.canvas.getContext('2d');
				sp.canvas.width=24;
				sp.canvas.height=21;
			}

			this.spframes = [];

			for( var t=0; t<128; t++ ) {
				this.spframes[ t ] = new C64SpriteFrame();
				this.spframes[ t ].init();
				this.spframes[ t ].context.fillStyle = this._htmlColor( this.colors[ 1 ] );
				this.spframes[ t ].context.fillRect(
					0,0,
					24,
					21
				);
			}

			this.pixel = this.context.createImageData(1,1);
			this.pixeldata = this.pixel.data;

			this.pixels8 = this.context.createImageData(8,1);
			this.pixels8data = this.pixels8.data;

			this.col = 14;
			this.bgcol = 6;
			this.bgcolLast = 6;
			this.bcol = 14;
			this.bcolLast = 14;


   }

	 vpoke( a, b ) {
		 this.vic[a] = b;
		 this.vicUsed.push( a );
	 }

	 vpeek( a ) {
		 return this.vic[a];
	 }

	 reset( ) {
			 this.rcontext.imageSmoothingEnabled= false;
	 }

	 _postLoadFontImage() {

     console.log("here");
     this.fonts = [];

		 for (var i = 0; i < 16; i++) {

     	var tmpFont = this._prepColor( this.font, this.colors[ i ] );
     	this.fonts[ i ] = new C64BlockFont( tmpFont , 8, 8, { r:0, g:0, b:0 } );

		 }

		 var ctx = this.context;
		 var cvs = this.canvas;

		 var rctx = this.context;
		 var rcvs = this.canvas;

		 this.bcolLast = -1;

		 this.clearScreen();
		 this.writeString( "ready.", true );
		 this._updateBorder();
		 this._renderBackGround();
		 this._renderBuffer();

		 this._updateDisplay();

     this.ready = true;
     if( this.onload != undefined ) {
       this.onload( this, this.onloaddata );
     }
   }


	 setColor( c ) {
		 this.col = c;
	 }

	 setBGColor( c ) {
		 this.bgcol = c;
	 }

	 setBorderColor( c ) {
		 this.bcol = c;
	 }

 	 spriteFrame( s, f ) {

 		 var sp = this.sprites[ s ];
 		 this.spframes[ f ].init();

 		 sp.frame = f;

 		 var imgdata = sp.context.getImageData(0, 0, 24, 21 );
 		 var dd  = imgdata.data;

 		 var imgdata2 = this.spframes[ f ].context.getImageData(0, 0, 24, 21 );
 		 var sd  = imgdata2.data;

 		 var len = 24 * 21 * 4;
 		 var c = this.colors[ sp.col ];
 		 for( var i=0 ; i<len; i+=4 ) {
 			 if( sd[ i+0 ] ) {
 				 dd[ i+0 ] = c.r;
 				 dd[ i+1 ] = c.g;
 				 dd[ i+2 ] = c.b;
 				 dd[ i+3 ] = 255;
 			 }
 			 else {
 				 dd[ i+3 ] = 0;
 			 }
 		 }

 		 sp.context.putImageData( imgdata, 0, 0 );
 	 }

 	 spriteEnable( n, enabled ) {
 		 this.sprites[ n ].enabled = enabled;
 	 }

 	 spritePos( n, x, y ) {
 		 this.sprites[ n ].x = x;
 		 this.sprites[ n ].y = y;
 	 }

 	 spriteCol( n, c ) {
 		 this.sprites[ n ].col = c;
      this.spriteFrame( n, this.sprites[ n ].frame )
 	 }


 	 spritePoke( frame, offset, byte ) {

 		 var mem = this.pixels8data;
 		 for( var i=0 ; i<8; i++) {
 			 var mask = (1<<(7-i));
 			 var v=0;
 			 var o = i*4;
 			 if( byte & mask ) {
 				 v=255;
 			 }
 			 mem[ o+0 ] = v;
 			 mem[ o+1 ] = v;
 			 mem[ o+2 ] = v;
 			 mem[ o+3 ] = v;
 		 }

 		 //x,y from offset, todo, must be a quicker way to do this
 		 var x=0, y=0;
 		 for( var i=0 ; i<offset; i++) {
 			 x+=8;
 			 if( x > 16 ) {
 				 x=0; y++;
 			 }
 		 }

 		 this.spframes[ frame ].context.putImageData( this.pixels8, x, y );
 		 console.log();
 		 //this.spriteFrame(); todo
 		 this.spriteReFrame( frame );
 	 }

 	 spritePlot( frame, x, y, on ) {

 		 var d=this.pixeldata;
 		 var v = 0;
 		 if( on ) { v=255; }
 		 d[0]   = v;
 		 d[1]   = v;
 		 d[2]   = v;
 		 d[3]   = v;
 		 this.spframes[ frame ].context.putImageData( this.pixel, x, y );
 		 //this.spriteFrame(); todo
 		 this.spriteReFrame( frame );
 	 }


 	 spriteReFrame( frame ) {

 		 for( var s=0 ; s<8; s++) {

 			 var sp = this.sprites[ s ];
 			 if( sp.frame == frame ) {
 				 this.spriteFrame( s, sp.frame ); //redraw with correct mono color
 			 }
 		 }

 	 };

	 getRenderSize() {
		 return [ this.rcanvas.width, this.rcanvas.height ];
	 }

	 clearScreen() {
		this.buffer = [];
		this.cursorx = 0;
		this.cursory = 0;

	 	for( var y=0; y<25; y++) {
			var row = [];
	 		for( var x=0; x<40; x++) {
				row[ x ] = [32,14,true];
	 		}
	 		this.buffer[ y ] = row;
	 	}
	 }

	 scrollUp() {

		 var buf = this.buffer;

		 this.cursory=24;

		 for( var y=0; y<24; y++) {
			 buf[y] = buf[y + 1];
		 }
		var newrow = [];
		for( var x=0; x<40; x++) {
			newrow[ x ] = [32,14,true];
		}
		buf[ 24 ] = newrow;

		for( var y=0; y<25; y++) {
		  for( var x=0; x<40; x++) {
		 	  buf[y][x][2] = true;
		  }
		 }

	 }


	 nextLine(  c ) {
		 this.cursory++;
		 this.cursorx=0;
		 if( this.cursory > 24 ) {
			 this.cursory = 24;
			 this.scrollUp();
		 }
	 }

	 setChar( x, y, index ) {

		var buf = this.buffer;
		var chr = buf[y][x];

		chr[2] = true;
		chr[0] = index;

	 }

	 setCharCol( x, y, index ) {

		var buf = this.buffer;
		var chr = buf[y][x];

		chr[2] = true;
		chr[1] = index;

	 }

	 writeChar(  c ) {
    var index = this._mapChar( c );
		var buf = this.buffer;
 		if( index > -1 ) {
			buf[this.cursory][this.cursorx][2] = true;
			buf[this.cursory][this.cursorx][1] = this.col;
			buf[this.cursory][this.cursorx][0] = index;
 		}
		this.cursorx++;
		if(this.cursorx > 39) {
			this.cursorx = 0;
			this.nextLine();

		}
   }


	 deleteChar() {
    var index = 32;
		var buf = this.buffer;

		this.cursorx--;
		if(this.cursorx <0 ) {
			this.cursorx = 39;

			this.cursory--;
			if(this.cursory <0 ) {
				this.cursory = 0;
				this.cursorx = 0;
			}

		}

		buf[this.cursory][this.cursorx][2] = true;
		buf[this.cursory][this.cursorx][0] = index;

   }


	 getCurrentLine() {
		 var line;
		 var buf = this.buffer;

		 line = "";

		 for( var x=0; x<39; x++) {
			 var c=this.backmap[ buf[this.cursory][x][0] ];
			 if( !c ) { c=" "};
			 line = line + c;
		 }
		 return line;
	 }

	 saveCursor( x ) {
		 if( x < 0 ) {
			 return (x+128)%256;
		 }
		 return x%256;
	 }

	 blinkCursor() {
		var buf = this.buffer;
		if( !this.cursorOn ) {
			this.cursorOn = true;
			var index = 32+128;
			buf[this.cursory][this.cursorx][2] = true;
			buf[this.cursory][this.cursorx][1] = this.col;
			buf[this.cursory][this.cursorx][0] = this.saveCursor(buf[this.cursory][this.cursorx][0] + 128);
		}
		else {
			this.cursorOn = false;
			var index = 32;
			buf[this.cursory][this.cursorx][2] = true;
			buf[this.cursory][this.cursorx][1] = this.col;
			buf[this.cursory][this.cursorx][0] = this.saveCursor(buf[this.cursory][this.cursorx][0] - 128);
		}

   }

	 clearCursor() {
		var buf = this.buffer;
 		if( this.cursorOn ) {
 			this.cursorOn = false;
 			var index = 32;
 			buf[this.cursory][this.cursorx][2] = true;
 			buf[this.cursory][this.cursorx][1] = this.col;
 			buf[this.cursory][this.cursorx][0] = this.saveCursor((buf[this.cursory][this.cursorx][0] - 128));
 		}
   }

	 cursorX( x ) {
		 this.cursorx = x;
	 }

	 cursorUp() {
		 this.cursory--;
		 if( this.cursory<0 ) { this.cursory = 0;}
	 }

	 cursorDown() {
		 this.cursory++;
		 if( this.cursory>24 ) { this.cursory = 24;}
	 }

	 cursorLeft() {
		 this.cursorx--;
		 if( this.cursorx<0 ) { this.cursorx = 0;}
	 }

	 cursorRight() {
		 this.cursorx++;
		 if( this.cursorx>39 ) { this.cursorx = 39;}
	 }

	 cursorHome() {
		 this.cursorx=0;
		 this.cursory=0;
	 }

	 writeString( str, newLine ) {
		 for (var i = 0; i < str.length; i++) {
				 this.writeChar( str.charAt(i) );
		 }
		 if(newLine) {
			 this.nextLine();
		 }
	 }

	 _mapChar( c0 ) {

     var c = c0.toLowerCase();

     var map = this.map;
     var index;

     index = map [ c ];
     if( index == undefined ) {
 			if( c == ' ' ) {
 				return -1;
 			}
       index = 49;
     }

     return  index;
   }

	 renderChar(x, y, c, col) {
		 this.fonts[ col ].drawRaw( this.context, x, y, c );
	 }

	 _htmlColor( c ) {
		  return 'rgba('+c.r+','+c.g+','+c.b+',1)';
	 }



	 renderDisplay( ) {

		 if( this.bcolLast != this.bcol ) {

			 this._updateBorder();
		 }


		 this._renderBuffer();
		 this._updateDisplay();
	 }

	 _updateBorder( ) {
		 var dw = this.FULLWIDTH;
 		 var dh = this.FULLHEIGHT;
		 var dCtx = this.rcontext;
		 dCtx.fillStyle = this._htmlColor( this.colors[ this.bcol ] );
		 dCtx.fillRect(
			 0,0,
			 dw,
			 dh
		 );
	 }

   _updateDisplay( ) {

		var sCvs = this.bufcanvas;
		var dCtx = this.rcontext;

 		var w = 320;
 		var h = 200;
		var dw = this.WIDTH;
		var dh = this.HEIGHT;
		var b = this.border;

		dCtx.drawImage( sCvs, b.w, b.h, dw, dh);
	 }

	 _renderBackGround() {
		 var ctx = this.context;
		 var cvs = this.canvas;

		 ctx.fillStyle = this._htmlColor( this.colors[ this.bgcol ] );
		 ctx.fillRect(
			 0,0,
			 cvs.width,
			 cvs.height
		 );
	 }

	 _renderBuffer() {
		 var buf = this.buffer;
		 var ctx = this.context;
		 var bufctx = this.bufcontext;

		 ctx.fillStyle = this._htmlColor( this.colors[ this.bgcol ] );

		 if( this.bgcolLast != this.bgcol ) {
			 for( var y=0; y<25; y++) {
			 	for( var x=0; x<40; x++) {

							buf[y][x][2] = false;
							ctx.fillRect(
				 			 x*8, y*8,
				 			 8,8
				 		 );
						 this.renderChar(x*8, y*8, buf[y][x][0], buf[y][x][1] );

			 	}
			 }
			 this.bgcolLast = this.bgcol;
		 }
		 else {
			 for( var y=0; y<25; y++) {
			 	for( var x=0; x<40; x++) {
					if( buf[y][x][2] ) {
							buf[y][x][2] = false;
							ctx.fillRect(
				 			 x*8, y*8,
				 			 8,8
				 		 );
						 this.renderChar(x*8, y*8, buf[y][x][0], buf[y][x][1] );
					}
			 	}
			 }
		 }
		 bufctx.drawImage( this.canvas, 0, 0);

		 for( var i = 0; i < this.sprites.length; i++ ) {
			 var sp = this.sprites[ i ];
				 if( sp.enabled ) {

					//console.log( "Draw sprite " + i);
				 	bufctx.drawImage( sp.canvas, sp.x-24, sp.y-21 );
			 }
		 }
	 }



   _prepColor( img, col ) {

 			var canvas = document.createElement('canvas');
 			var context = canvas.getContext('2d');

      var w = img.width;
      var h = img.height;

      canvas.width  = w;
      canvas.height = h * 2;

      context.drawImage( img, 0, 0 );
			context.drawImage( img, 0, h );
      var imgdata = context.getImageData(0, 0, w, h*2);
      var dd  = imgdata.data;

      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var offset = (x  + ( y * w )) * 4;

          if( dd[ offset ] != 0 && dd[ offset + 1 ] != 0 && dd[ offset + 2 ] != 0 ) {
            dd[ offset ] = col.r;
            dd[ offset + 1] = col.g;
            dd[ offset + 2] = col.b;
          }
        }
      }

			for ( ; y < (h*2); y++) {
        for (var x = 0; x < w; x++) {
          var offset = (x  + ( y * w )) * 4;


          if( dd[ offset ] != 0 && dd[ offset + 1 ] != 0 && dd[ offset + 2 ] != 0 ) {

						dd[ offset ] = 0;
            dd[ offset + 1] = 0;
            dd[ offset + 2] = 0;
          }
					else {
						dd[ offset ] = col.r;
            dd[ offset + 1] = col.g;
            dd[ offset + 2] = col.b;
					}
        }
      }

      context.putImageData( imgdata, 0, 0);
      return canvas;
   }

}

class C64BlockFont {

	constructor( img, gridw, gridh, transCol ) {

			this.img = img;
			this.gridw = gridw;
			this.gridh = gridh;

			this.iconsCanvas = [];
			this.iconsContext = [];

			var w = this.img.width;
			var h = this.img.height;

			this.iconCanvas = document.createElement('canvas');
			this.iconContext = this.iconCanvas.getContext('2d');

			this.iconCanvas.width = 	w;
			this.iconCanvas.height = 	h;

			this.iconContext.drawImage( this.img, 0, 0, w, h);

			this.xiconcount = w / this.gridw;
      this.xiconrowcount = h / this.gridh;

      for (var yicon = 0; yicon < this.xiconrowcount; yicon++) {
			for (var xicon = 0; xicon < this.xiconcount; xicon++) {

				var sx = (xicon * this.gridw);
				var sy = (yicon * this.gridh);
				var imgdata = this.iconContext.getImageData(sx, sy, this.gridw, this.gridh);
				var sd  = imgdata.data;

				var dcanvas = document.createElement('canvas');
				dcanvas.width  = this.gridw;
				dcanvas.height = this.gridh;

				var dcontext = dcanvas.getContext('2d');
				var dimgdata = dcontext.createImageData( this.gridw, this.gridh );
				var dd  = dimgdata.data;

				var xoffset = 0;
				var yoffset = 0;
				var rowoffset = this.gridw * 4;
				var offset;

				for (var y = 0; y < this.gridh; y++) {
					xoffset = 0;
					for (var x = 0; x < this.gridw; x++) {
						offset = yoffset + xoffset;

						dd[ offset + 0] = sd[ offset + 0];
						dd[ offset + 1] = sd[ offset + 1];
						dd[ offset + 2] = sd[ offset + 2];
						dd[ offset + 3] = sd[ offset + 3];

						if( dd[ offset + 0] == transCol.r && dd[ offset + 1] == transCol.g && dd[ offset + 2] == transCol.b )
						{
							dd[ offset + 0] = 0;
							dd[ offset + 1] = 0;
							dd[ offset + 2] = 0;
							dd[ offset + 3] = 0; /* Make transparent */
						}

						xoffset += 4;
					}

					yoffset += rowoffset;
				}

				dcontext.putImageData( dimgdata, 0, 0);
				this.iconsCanvas.push( dcanvas  );
				this.iconsContext.push( dcontext );
			}
      }


      this.iconCanvas = null;
      this.iconContext = null;
      this.img = null;

	}


	drawRaw( ctx, x, y, i ) {
    try {
			ctx.drawImage( this.iconsCanvas[ i ], x, y );
		}
		catch ( ex ) {
			console.log( ex );
			console.log( ctx );
			console.log( x );
			console.log( y );
			console.log( i );
		}
  }


	centerX( str, screenWidth ) {
		var txtW = str.length * this.gridw;
		return Math.floor( (screenWidth/2) - ( txtW/2)) ;
	}

  drawString( ctx, x0, y, str ) {
    var x = x0;
    for (var i = 0; i < str.length; i++) {
        this.drawChar( ctx, x, y, str.charAt(i) );
        x+= this.gridw;
    }
  }

}
