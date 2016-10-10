$(function () {
    Highcharts.chart('container4', {
        data: {
            csv: document.getElementById('data').innerHTML
        }
    });
});
