Highcharts.chart('container', {
    chart: {
        type: 'timeline'
    },
    series: [{
        data: [{
            date: 'Some date',
            label: 'Event label',
            description: 'Description of this event.',
            dataLabels: {
                color: '#78f',
                borderColor: 'blue',
                backgroundColor: '#444',
                connectorWidth: 2,
                connectorColor: 'blue',
                style: {
                    textOutline: 0
                }
            }
        }, {
            date: 'Next date',
            label: 'Next event label',
            description: 'Description of second event.'
        }, {
            date: 'Another date',
            label: 'Last event label',
            description: 'Description of third event.'
        }]
    }]

});