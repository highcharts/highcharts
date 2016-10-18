$(function () {

    var options = {
        data: {
            table: document.getElementById('datatable'),
            switchRowsAndColumns: true
        },
        chart: {
            type: 'column'
        },
        title: {
            text: 'Switched rows and columns'
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Units'
            }
        }
    };

    $('#container').highcharts(Highcharts.merge(options));


    $('#toggle').click(function () {
        options.data.switchRowsAndColumns = !options.data.switchRowsAndColumns;
        $('#container').highcharts(Highcharts.merge(options));
    });
});