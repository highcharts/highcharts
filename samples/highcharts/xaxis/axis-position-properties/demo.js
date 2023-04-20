const colors = Highcharts.getOptions().colors;

Highcharts.chart('container', {

    title: {
        text: 'Different placement of multiple xAxis'
    },

    subtitle: {
        text: 'Using top, left, height and width properties'
    },

    yAxis: [{
        height: '40%'
    }, {
        height: '40%',
        top: '70%',
        offset: 0
    }],

    xAxis: [{
        lineColor: colors[0],
        title: {
            text: 'xAxis 1'
        },
        height: '50%',
        width: '50%'
    }, {
        lineColor: colors[1],
        title: {
            text: 'xAxis 2'
        },
        height: '50%',
        width: '50%',
        left: '50%',
        offset: 0
    }, {
        lineColor: colors[2],
        title: {
            text: 'xAxis 3'
        },
        height: '50%',
        width: '50%',
        top: '60%',
        offset: 0
    }, {
        lineColor: colors[3],
        title: {
            text: 'xAxis 4'
        },
        height: '50%',
        width: '50%',
        top: '60%',
        left: '50%',
        offset: 0
    }],

    series: [{
        data: [29, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54],
        xAxis: 0,
        yAxis: 0
    }, {
        data: [29, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54],
        xAxis: 1,
        yAxis: 0
    }, {
        data: [29, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54],
        xAxis: 2,
        yAxis: 1
    }, {
        data: [29, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54],
        xAxis: 3,
        yAxis: 1
    }],

    legend: {
        margin: 50
    }

});