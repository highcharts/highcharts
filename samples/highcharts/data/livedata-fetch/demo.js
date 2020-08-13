let chart; // global

/**
 * Request data from the server, add it to the graph and set a timeout to request again
 */
async function requestData() {
    const result = await fetch('https://demo-live-data.highcharts.com/time-rows.json');
    if (result.ok) {
        const data = await result.json();

        const [date, value] = data[0];
        const point = [new Date(date).getTime(), value * 10];
        const series = chart.series[0],
            shift = series.data.length > 20; // shift if the series is longer than 20

        // add the point
        chart.series[0].addPoint(point, true, shift);
        // call it again after one second
        setTimeout(requestData, 1000);
    }
}

window.addEventListener('load', function () {
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            defaultSeriesType: 'spline',
            events: {
                load: requestData
            }
        },
        title: {
            text: 'Live random data'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Value',
                margin: 80
            }
        },
        series: [{
            name: 'Random data',
            data: []
        }]
    });
});