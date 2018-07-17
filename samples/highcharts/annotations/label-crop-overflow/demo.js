Highcharts.chart('container', {

    title: {
        text: 'Highcharts Annotations'
    },

    subtitle: {
        text: 'Annotation label crop and overflow options'
    },

    xAxis: {
        min: 0,
        max: 5
    },

    yAxis: {
        min: 0,
        max: 100
    },

    series: [{
        keys: ['y', 'id'],
        data: [[29.9, '0'], [71.5, '1'], [100, '2']]
    }],

    tooltip: {
        enabled: false
    },

    annotations: [{
        labels: [{
            format: 'Label is cropped',
            crop: true
        }, {
            format: 'Label is moved inside the plot area',
            overflow: 'justify'
        }, {
            point: '2',
            format: 'Label is allowed to be placed outside the plot area'
            //crop: false, by defult labels are not cropped
            //overflow: 'none', by defualt labels are not justified
        }],
        labelOptions: {
            point: '0'
        }
    }]
});