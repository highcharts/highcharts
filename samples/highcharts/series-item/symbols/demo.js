Highcharts.chart('container', {

    chart: {
        type: 'item',
        height: '120%'
    },

    title: {
        text: 'Highcharts item chart'
    },

    subtitle: {
        text: 'With symbols'
    },

    legend: {
        labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
    },

    series: [{
        name: 'Representatives',
        keys: ['name', 'y', 'marker.symbol'],
        data: [{
            name: 'Male',
            y: 75,
            marker: {
                //symbol: 'url(https://cdn.jsdelivr.net/gh/FortAwesome/Font-Awesome/svgs/solid/male.svg)'
                symbol: 'square'
            },
            color: '#2D5FF3'
        }, {
            name: 'Female',
            y: 25,
            marker: {
                //symbol: 'url(https://cdn.jsdelivr.net/gh/FortAwesome/Font-Awesome/svgs/solid/female.svg)'
                symbol: 'diamond'
            },
            color: '#F23A2F'
        }],
        rows: 10
    }]

});
