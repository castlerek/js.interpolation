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
        static Generate( l, L, A, B, context ) {
            let formula = ( distDisc, distFull, compA, compB ) => {
                return compA + distDisc * ( ( compB - compA ) / distFull );
            };

            let compC = {
                red   : formula( l, L, A.red, B.red ),
                green : formula( l, L, A.green, B.green ),
                blue  : formula( l, L, A.blue, B.blue )
            };

            let testImageData = new Uint8ClampedArray([ compC.red, compC.green, compC.blue, 255 ]);
            context.putImageData( new ImageData( testImageData, 1, 1 ), ( l - 1 ), 0 );
        }
    }

    class App {
        createCanvas( domId ) {
            this.canvas = document.createElement( "canvas" );
            this.canvas.id = domId;
            this.context = this.canvas.getContext( "2d" );

            this.canvas.width  = 10;
            this.canvas.height = 1;
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

        app.drawPoint( 0, 0, "#ff00ff" );
        app.drawPoint( 9, 0, "#ffff00" );

        let A = { red: 0xff, green: 0, blue: 0xff };
        let B = { red: 0xff, green: 0xff, blue: 0 };

        for ( let i = 2; i < 10; i++ )
            Interpolation.Generate( i, 10, A, B, app.context );
    });

})( window );