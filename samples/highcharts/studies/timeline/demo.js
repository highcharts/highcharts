$(function () {

    var chart,
        dataSequence = [{
            name: '2009',
            data: [1, 2, 2, 1, 1, 2, 2, 2, 1, 1]
        }, {
            name: '2010',
            data: [6, 12, 2, 3, 3, 2, 2, 3, 2, 2]
        }, {
            name: '2011',
            data: [4, 5, 6, 5, 5, 4, 9, 5, 3, 4]
        }, {
            name: '2012',
            data: [5, 5, 6, 6, 5, 6, 6, 5, 5, 6]
        }, {
            name: '2013',
            data: [6, 7, 7, 6, 6, 6, 7, 7, 6, 7]
        }, {
            name: '2014',
            data: [8, 9, 9, 8, 8, 8, 9, 9, 8, 9]
        }, {
            name: '2015',
            data: [9, 10, 4, 10, 9, 9, 9, 10, 10, 10]
        }, {
            name: '2016',
            data: [1, 10, 10, 10, 10, 11, 11, 11, 12, 12]
        }, {
            name: '2017',
            data: [11, 11, 12, 12, 12, 11, 11, 12, 12, 12]
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title: {
            text: 'Highmaps with time control'
        },

        subtitle: {
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/au/au-all.js">Australia</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0,
            max: 12
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

    chart = $('#container').highcharts();

    /**
     * Pause the timeline, either when the range is ended, or when clicking the pause button.
     * Pausing stops the timer and resets the button to play mode.
     */
    function pause(button) {
        button.title = 'play';
        button.className = 'fa fa-play';
        clearTimeout(chart.sequenceTimer);
        chart.sequenceTimer = undefined;
    }

    /**
     * Update the chart. This happens either on updating (moving) the range input,
     * or from a timer when the timeline is playing.
     */
    function update(increment) {
        var input = $('#play-range')[0],
            output = $('#play-output')[0];

        if (increment) {
            input.value = parseInt(input.value, 10) + increment;
        }
        chart.series[0].setData(dataSequence[input.value].data); // Increment dataset (updates chart)
        output.innerHTML = dataSequence[input.value].name; // Output value
        if (input.value >= input.max) { // Auto-pause
            pause($('#play-pause-button')[0]);
        }
    }

    /**
     * Play the timeline.
     */
    function play(button) {
        button.title = 'pause';
        button.className = 'fa fa-pause';
        chart.sequenceTimer = setInterval( function () {
            update(1);
        }, 500);

    }

    /**
     * Toggle play and pause from the button
     */
    $('#play-pause-button').bind('click', function () {
        if (chart.sequenceTimer === undefined) {
            play(this);
        } else {
            pause(this);
        }
    });

    /**
     * Update the chart when the input is changed
     */
    $('#play-range').bind('input', function () {
        update();
    });
});