$(function () {

    var dataSequence = [
        {
            name: '2009',
            data: [5, 3, 2, 1]
        }, {
            name: '2010',
            data: [5, 6, 4, 3]
        }, {
            name: '2011',
            data: [1, 3, 4, 5]
        }, {
            name: '2012',
            data: [3, 5, 5, 9]
        }, {
            name: '2013',
            data: [4, 5, 6, 1]
        }, {
            name: '2014',
            data: [5, 2, 3, 1]
        }, {
            name: '2015',
            data: [4, 5, 6, 1]
        }, {
            name: '2016',
            data: [5, 2, 3, 1]
        }, {
            name: '2017',
            data: [4, 6, 3, 2]
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title: {
            text: 'Highmaps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/au/au-all.js">Australia</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: dataSequence[0].data,
            mapData: Highcharts.maps['countries/au/au-all'],
            joinBy: null,
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
    
    var chart = $('#container').highcharts();
    
    function update(increment) {
        var input = $('#play-range')[0],
            output = $('#play-output')[0];
        console.log(increment, input.value);
        if (increment) {
            input.value = parseInt(input.value) + increment;
        }
        chart.series[0].setData(dataSequence[input.value].data); // Increment dataset (updates chart)
        output.innerHTML = dataSequence[input.value].name; // Output value
        if (input.value >= input.max) { // Auto-pause
            pause()
        }
    }
    
    function pause() {
        var button = $('#play-pause-button')[0]
        button.title = 'play';
        button.className = 'fa fa-play';
        clearTimeout(chart.sequenceTimer);
        chart.sequenceTimer = undefined;
    }
    
    $('#play-pause-button').bind('click', function () {
        if (chart.sequenceTimer === undefined) {
            this.title = 'pause';
            this.className = 'fa fa-pause';
            chart.sequenceTimer = setInterval ( function () {
                update(1);
            }, 500);
        } else {
            pause()
        }
    });
    
    $('#play-range').bind('input', function () {
        update();
    });
});