const dataSequence = [
    {
        name: 'Week 1',
        data: [1, 2, 2, 1, 1, 2, 2]
    },
    {
        name: 'Week 2',
        data: [6, 12, 2, 3, 3, 2, 2]
    },
    {
        name: 'Week 3',
        data: [4, 5, 6, 5, 5, 4, 9]
    },
    {
        name: 'Week 4',
        data: [5, 5, 6, 6, 5, 6, 6]
    },
    {
        name: 'Week 5',
        data: [6, 7, 7, 6, 6, 6, 7]
    },
    {
        name: 'Week 6',
        data: [8, 9, 9, 8, 8, 8, 9]
    },
    {
        name: 'Week 7',
        data: [9, 10, 4, 10, 9, 9, 9]
    },
    {
        name: 'Week 8',
        data: [1, 10, 10, 10, 10, 11, 11]
    },
    {
        name: 'Week 9',
        data: [11, 11, 12, 12, 12, 11, 11]
    }
];

const chart = Highcharts.chart('container', {
    chart: {
        type: 'areaspline'
    },
    title: {
        text: 'Highcharts with time control'
    },
    subtitle: {
        text: 'Fruit consumption during a week'
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 50,
        y: 50,
        floating: true,
        borderWidth: 1,
        backgroundColor: '#FFFFFF'
    },
    xAxis: {
        categories: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ]
    },
    yAxis: {
        title: {
            text: 'Fruit units'
        }
    },
    tooltip: {
        shared: true,
        valueSuffix: ' units'
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        areaspline: {
            fillOpacity: 0.5
        }
    },
    series: [
        {
            name: 'By week',
            data: dataSequence[0].data.slice()
        },
        {
            name: 'Average week',
            data: [6, 8, 6, 7, 7, 7, 6]
        }
    ]
});

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
    const input = document.getElementById('play-range');
    const output = document.getElementById('play-output');

    if (increment) {
        input.value = parseInt(input.value, 10) + increment;
    }

    chart.series[0].setData(dataSequence[input.value].data); // Increment dataset (updates chart)
    output.innerHTML = dataSequence[input.value].name; // Output value

    if (input.value >= input.max) {
        // Auto-pause
        pause(document.getElementById('play-pause-button'));
    }
}

/**
 * Play the timeline.
 */
function play(button) {
    button.title = 'pause';
    button.className = 'fa fa-pause';
    chart.sequenceTimer = setInterval(() => {
        update(1);
    }, 1000);
}

/**
 * Toggle play and pause from the button
 */
document.getElementById('play-pause-button').addEventListener('click', (e) => {
    if (chart.sequenceTimer === undefined) {
        play(e.target);
    } else {
        pause(e.target);
    }
});

/**
 * Update the chart when the input is changed
 */
document.getElementById('play-range').addEventListener('click', () => {
    update();
});
