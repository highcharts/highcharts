$(function () {

    function getData(n) {
        var arr = [],
            i,
            a,
            b,
            c,
            spike;
        for (i = 0; i < n; i = i + 1) {
    
            arr.push([
                i,
                2 * Math.sin(i / 100) + Math.random()
            ]);
        }
        return arr;
    }

    function getSeries(n, s) {
        var i = 0,
            r = [];

        for (; i < s; i++) {
            r.push({
                data: getData(n),
                animation: false,
                lineWidth: 2,
                boostThreshold: 1,
                turboThreshold: 1,
                showInNavigator: true,                   
                requireSorting: false
            });
        }

        return r;
    }

    var n = 200,
        s = 1,
        data = getData(n),
        series = getSeries(n, s),
        chart;

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    console.time('line');
    chart =  Highcharts.stockChart('container', {

        chart: {
            zoomType: 'x'
        },

        title: {
            text: 'Trimmed Highcharts drawing ' + (n * s) + ' points across ' + s + ' series'
        },

        navigator: {
            xAxis: {
                ordinal: false,
                min: n / 2
                //max: 10
            },
            yAxis: {
               // min: 0,
               // max: 10
            }
        },

        legend: {
            enabled: false
        },        

        xAxis: {
            min: n / 2,
           // max: 120,
            ordinal: false
        },

        yAxis: {
            //min: 0,
            //max: 8
        },

        subtitle: {
            text: 'Using the experimental Highcharts Boost module'
        },

        tooltip: {
            valueDecimals: 2,
            shared: false
        },

        series: series

    });
    console.timeEnd('line');

    function addPoint() {                
        ++n;

        chart.series.forEach(function (s, i) {
            var x = n,
                y = 2 * Math.sin(x / 100) + Math.random();

            s.addPoint([x, y], false, true, false);
            // s.options.data.splice(s.options.data.length, 0, [x, y]);
            // s.options.data.shift();
            // s.isDirty = true;
            // s.isDirtyData = true;
        });

        chart.redraw();
    }

    function addSeries() {

    }

    setInterval(addPoint, 1000);

});