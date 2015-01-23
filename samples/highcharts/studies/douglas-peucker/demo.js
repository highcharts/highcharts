$(function () {

    /**
     * Javascript implementation of the Douglas Peucker path simplification algorithm
     * By Adam Miller, https://gist.github.com/adammiller/826148#file-douglaspeucker-js
     * License: http://unlicense.org/
     */
    var simplifyPath = function( points, tolerance ) {
        console.time('DouglasPeucker');
        // helper classes 
        var Vector = function( x, y ) {
            this.x = x;
            this.y = y;
            
        };
        var Line = function( p1, p2 ) {
            this.p1 = p1;
            this.p2 = p2;
            
            this.distanceToPoint = function( point ) {
                // slope
                var m = ( this.p2.y - this.p1.y ) / ( this.p2.x - this.p1.x ),
                    // y offset
                    b = this.p1.y - ( m * this.p1.x ),
                    d = [];
                // distance to the linear equation
                d.push( Math.abs( point.y - ( m * point.x ) - b ) / Math.sqrt( Math.pow( m, 2 ) + 1 ) );
                // distance to p1
                d.push( Math.sqrt( Math.pow( ( point.x - this.p1.x ), 2 ) + Math.pow( ( point.y - this.p1.y ), 2 ) ) );
                // distance to p2
                d.push( Math.sqrt( Math.pow( ( point.x - this.p2.x ), 2 ) + Math.pow( ( point.y - this.p2.y ), 2 ) ) );
                // return the smallest distance
                return d.sort( function( a, b ) {
                    return ( a - b ); //causes an array to be sorted numerically and ascending
                } )[0];
            };
        };
        
        var douglasPeucker = function( points, tolerance ) {
            if ( points.length <= 2 ) {
                return [points[0]];
            }
            var returnPoints = [],
                // make line from start to end 
                line = new Line( points[0], points[points.length - 1] ),
                // find the largest distance from intermediate poitns to this line
                maxDistance = 0,
                maxDistanceIndex = 0,
                p;
            for( var i = 1; i <= points.length - 2; i++ ) {
                var distance = line.distanceToPoint( points[ i ] );
                if( distance > maxDistance ) {
                    maxDistance = distance;
                    maxDistanceIndex = i;
                }
            }
            // check if the max distance is greater than our tollerance allows 
            if ( maxDistance >= tolerance ) {
                p = points[maxDistanceIndex];
                line.distanceToPoint( p, true );
                // include this point in the output 
                returnPoints = returnPoints.concat( douglasPeucker( points.slice( 0, maxDistanceIndex + 1 ), tolerance ) );
                // returnPoints.push( points[maxDistanceIndex] );
                returnPoints = returnPoints.concat( douglasPeucker( points.slice( maxDistanceIndex, points.length ), tolerance ) );
            } else {
                // ditching this point
                p = points[maxDistanceIndex];
                line.distanceToPoint( p, true );
                returnPoints = [points[0]];
            }
            return returnPoints;
        };
        var arr = douglasPeucker( points, tolerance );
        // always have to push the very last point on so it doesn't get left off
        arr.push( points[points.length - 1 ] );
        console.timeEnd('DouglasPeucker');
        return arr;
    };


    function getData(n) {
        var arr = [], 
            i,
            a,
            b,
            c,
            spike;
        for (i = 0; i < n; i++) {
            if (i % 100 === 0) {
                a = 2 * Math.random();
            }
            if (i % 1000 === 0) {
                b = 2 * Math.random();
            }
            if (i % 10000 === 0) {
                c = 2 * Math.random();
            }
            if (i % 50000 === 0) {
                spike = 10;
            } else {
                spike = 0;
            }
            arr.push({
                x: i,
                y: 2 * Math.sin(i / 100) + a + b + c + spike + Math.random()
            });
        }
        return arr;
    }


    var rawData = getData(500000),
        simplifiedData = simplifyPath(rawData, 3);

    console.log('Raw data length:', rawData.length, 'Simplifid data length:', simplifiedData.length);
    rawData.length = 0; // clear memory

    console.time('Highcharts.Chart');
    $('#container').highcharts({

        title: {
            text: 'Trimmed Highcharts'
        },

        subtitle: {
            text: 'The points are filtered through the Douglas Peucker algorithm<br>View console for benchmarks'
        },

        series: [{
            data: simplifiedData,
            turboThreshold: 0
        }]

    });
    console.timeEnd('Highcharts.Chart');

});