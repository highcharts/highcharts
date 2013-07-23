$(function () {

    $('#container').highcharts({
        
        data: {
            csv: document.getElementById('csv').innerHTML
        },

        chart: {
            type: 'heatmap',
            inverted: true
        },


        title: {
            text: 'Highcharts heat map study'
        },

        xAxis: {
            title: {
                text: null
            },
            tickPixelInterval: 50
            //categories: [],
            //min: 0,
            //max: 23
        },

        yAxis: {
            title: {
                text: 'Hour of the day'
            },
            //categories: [],
            //min: -0.5,
            //max: 30.5,
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false
        },

        legend: {
            valueDecimals: 0,
            _rectangleLength: 120,
            _padding: 50,
            _layout: 'vertical',
            _align: 'right',
            _verticalAlign: 'middle'
        },

        series: [{
            borderWidth: 0,
            data: [],
            colsize: 24 * 36e5,

            // Color ranges for the legend
            _valueRanges: [{
                to: 99,
                color: 'green'
            }, {
                from: 100,
                to: 199,
                color: 'red'
            }, {
                from: 200,
                color: 'yellow'
            }],

            colorRange: {
                from: '#000088',
                to: '#FFFFFF',
                fromLabel: 'cold',
                toLabel: 'warm'
            },

            tooltip: {
                headerFormat: '{series.name}',
                pointFormat: '{series.name}'
            }
        }]

    });
});