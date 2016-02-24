( ( globalContext ) => {
    "use strict";

    /*
        ----L----
        A----Y--B
        ---l--

        ( Y - A ) / l = ( B - A ) / L
        Y = A + l * ( ( B - A ) / L )
        
    */

    class Interpolation {
        static Generate( h, w, L, A, B, context, direction ) {
            let formula = ( distDisc, distFull, compA, compB ) => {
                return compA + distDisc * ( ( compB - compA ) / distFull );
            };

            let value = null;

            if ( direction === "horizontal" )
                value = w;
            else if ( direction === "vertical" )
                value = h;
            else
                throw new Error( "Invalid direction value." );

            let compC = {
                red   : formula( value, L, A.red, B.red ),
                green : formula( value, L, A.green, B.green ),
                blue  : formula( value, L, A.blue, B.blue )
            };

            let testImageData = new Uint8ClampedArray([ compC.red, compC.green, compC.blue, 255 ]);
            context.putImageData( new ImageData( testImageData, 1, 1 ), w - 1, h - 1 );
        }
    }

    class App {
        createCanvas( domId ) {
            this.canvas = document.createElement( "canvas" );
            this.canvas.id = domId;
            this.context = this.canvas.getContext( "2d" );

            this.canvas.width  = 10;
            this.canvas.height = 10;
            this.canvas.style.position = "absolute";
            this.canvas.style.margin = "15px";

            document.body.appendChild( this.canvas );
        }

        drawPoint( x, y, color ) {
            this.context.fillStyle = color;
            this.context.fillRect( x, y, 1, 1 );
        }
    }

    globalContext.addEventListener( "DOMContentLoaded", ( event ) => {
        let app = new App();
        app.createCanvas( "Canvas" + Math.random().toString() );

        app.drawPoint( 0, 0, "#ff0000" );
        app.drawPoint( 9, 0, "#00ff00" );
        app.drawPoint( 0, 9, "#00ffff" );
        app.drawPoint( 9, 9, "#ff00ff" );

        let A = { red: 0xff, green: 0, blue: 0 };
        let B = { red: 0, green: 0xff, blue: 0 };
        let C = { red: 0, green: 0xff, blue: 0xff };
        let D = { red: 0xff, green: 0, blue: 0xff };

        // 1st
        for ( let i = 2; i < 10; i++ )
            Interpolation.Generate( 1, i, 10, A, B, app.context, "horizontal" );

        // 2nd
        for ( let i = 2; i < 10; i++ )
            Interpolation.Generate( 10, i, 10, C, D, app.context, "horizontal" );

        // 3rd
        for ( let j = 2; j < 10; j++ )
            Interpolation.Generate( j, 1, 10, A, C, app.context, "vertical" );

        // 4th
        for ( let j = 2; j < 10; j++ )
            Interpolation.Generate( j, 10, 10, B, D, app.context, "vertical" );

        // other
        for ( let j = 2; j < 10; j++ ) { // height
            for ( let i = 2; i < 10; i++ ) { // width
               let pixelA = app.context.getImageData( 0, j, 1, 1 ).data;
               let pixelB = app.context.getImageData( 9, j, 1, 1 ).data;

               let dataA = { red: pixelA[ 0 ], green: pixelA[ 1 ], blue: pixelA[ 2 ] };
               let dataB = { red: pixelB[ 0 ], green: pixelB[ 1 ], blue: pixelB[ 2 ] };

               debugger;
               Interpolation.Generate( j, i, 10, dataA, dataB, app.context, "horizontal" );
            }
        }
    });

})( window );