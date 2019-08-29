const getFlags = () => [{
    x: 0,
    title: '0.0000'
}, {
    x: 3,
    title: '3.0000'
}, {
    x: 3.1,
    title: '3.1000'
}, {
    x: 6,
    title: '6.0000'
}, {
    x: 9,
    title: '9.0000'
}];

Highcharts.chart('container', {

    chart: {
        width: 600,
        plotBorderWidth: 1
    },

    title: {
        text: 'Flag alignment'
    },

    series: [{
        name: 'USD to EUR',
        data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }, {
        type: 'flags',
        shape: 'circlepin', // works if shape is 'flag'
        data: getFlags()
    }, {
        type: 'flags',
        shape: 'flag', // works if shape is 'flag'
        data: getFlags().map(p => {
            p.y = 1;
            return p;
        })
    }]
});
