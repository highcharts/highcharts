$(function () {

    function simplifyPath(data, epsilon) {
        function douglasPecker(data, epsilon) {
            if (data.length <= 2) {
                return [data[0]];
            }
            var result = [],
                dmax = 0,
                index = 0,
                start = data[0],
                end = data[data.length - 1],
                point,
                i,
                d;

            // recurring factors
            var m = (end.y - start.y) / (end.x - start.x),
                b = start.y - (m * start.x);

            // Find furthest point
            for (i = 1; i <= data.length - 2; i++) {
                point = data[i];
                d = Math.abs(point.y - (m * point.x) - b) / Math.sqrt(Math.pow(m, 2) + 1);
                if (d > dmax) {
                    dmax = d;
                    index = i;
                }
            }
            // Evaluate
            if (dmax >= epsilon) {
                result = result.concat(douglasPecker(data.slice(0, index + 1), epsilon));
                result = result.concat(douglasPecker(data.slice(index + 1, data.length), epsilon));
            } else {
                result = [start];
            }
            return result;
        }
        // CALL RDP Function
        var arr = douglasPecker(data, epsilon);
        arr.push(data[data.length - 1]);
        return arr;
    }


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