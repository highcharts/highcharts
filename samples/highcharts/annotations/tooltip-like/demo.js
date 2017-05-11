Highcharts.chart('container', {

    title: {
        text: 'Highcharts Annotations'
    },

    subtitle: {
        text: 'Styled and formatted like tooltips'
    },

    series: [{
        keys: ['y', 'id'],
        data: [[29.9, '0'], [71.5, '1'], [106.4, '2'], [129.2, '3'], [144.0, '4'], [176.0, '5']]
    }],

    tooltip: {
        enabled: false
    },

    annotations: [{
        labels: [{
            point: '0'
        }, {
            point: '1'
        }, {
            point: '2'
        }, {
            point: '3'
        }, {
            point: '4'
        }, {
            point: '5'
        }],
        labelOptions: {
            format: '' +
                '<span style="font-size: 10px">{point.x}</span><br/>' /* header */ +
                '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>' /* body */,

            backgroundColor: Highcharts.color('#f7f7f7').setOpacity(0.85).get(),
            borderWidth: 1,
            shadow: true,
            padding: 8,
            distance: 16,
            borderRadius: 3,
            borderColor: Highcharts.getOptions().colors[0],
            style: {
                color: '#333333',
                cursor: 'default',
                fontSize: '12px',
                whiteSpace: 'nowrap'
            }
        },
        zIndex: 7
    }]
});