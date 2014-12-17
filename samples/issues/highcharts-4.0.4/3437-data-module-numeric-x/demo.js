$(function () {
    $('#container4').highcharts({
        data: {
            csv: document.getElementById('data').innerHTML
        }
    });
});