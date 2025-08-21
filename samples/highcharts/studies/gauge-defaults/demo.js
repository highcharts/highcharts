Highcharts.setOptions({
    chart: {
        plotBorderWidth: 1
    }
});

const options = {

    yAxis: {
        plotBands: [{
            from: 0,
            to: 10,
            color: 'green'
        }]
    },

    series: [{
        data: [27],
        opacity: 0.75
    }]
};

Highcharts.chart('container-1', {
    ...options,

    chart: {
        type: 'gauge'
    },

    title: {
        text: 'Highcharts gauge defauls'
    }

});

Highcharts.chart('container-2', {
    ...options,
    chart: {
        type: 'solidgauge'
    },

    title: {
        text: 'Highcharts solid gauge defauls'
    }

});
