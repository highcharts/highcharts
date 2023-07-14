Highcharts.chart('container', {

    chart: {
        plotBorderWidth: 1
    },

    title: {
        text: 'Highcharts Annotations'
    },

    subtitle: {
        text: 'Annotation line crop, label crop and overflow options'
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
            // crop: false, by defult labels are not cropped
            // overflow: 'none', by defualt labels are not justified
        }],
        labelOptions: {
            point: '0'
        }
    }, {
        crop: false,
        shapes: [{
            type: 'path',
            points: [{
                x: 2,
                y: 50,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 3,
                y: -10,
                xAxis: 0,
                yAxis: 0
            }]
        }]
    }, {
        // crop: true, // by default lines are cropped
        shapes: [{
            type: 'path',
            points: [{
                x: 3,
                y: 50,
                xAxis: 0,
                yAxis: 0
            }, {
                x: 4,
                y: -10,
                xAxis: 0,
                yAxis: 0
            }]
        }]
    }]
});