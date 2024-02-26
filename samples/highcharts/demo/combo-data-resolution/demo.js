const data = JSON.parse(document.getElementById('data').textContent);

Highcharts.chart('container', {
    title: {
        text: 'Global temperature mean anomalies from 1880 to 2016'
    },
    accessibility: {
        description: `
            A chart of monthly mean temperature anomalies from 1880 to 2016.
            It employs two series, one column and one line,
            to convey the same data at different resolutions.
            There is only one column per thirty years,
            but the line series have a datapoint per year.
        `
    },
    series: [{
        type: 'column',
        data: data.map((d, i) => (i % 30 === 0) && d),
        pointWidth: 30
    }, {
        data: data,
        pointInterval: 36e5
    }],
    yAxis: {
        tickInterval: 0.5,
        endOnTick: true,
        max: 1,
        title: {
            enabled: false
        }
    },
    xAxis: {
        type: 'datetime'
    }
});