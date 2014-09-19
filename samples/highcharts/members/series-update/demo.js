$(function () {
    $('#container').highcharts({
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            showEmpty: false
        },

        yAxis: {
            showEmpty: false
        },

        series: [{
            allowPointSelect: true,
            data: [ // use names for display in pie data labels
                ['January',    29.9],
                ['February',   71.5],
                ['March',     106.4],
                ['April',     129.2],
                ['May',       144.0],
                ['June',      176.0],
                ['July',      135.6],
                ['August',    148.5],
                {
                    name: 'September',
                    y: 216.4,
                    selected: true,
                    sliced: true
                },
                ['October',   194.1],
                ['November',   95.6],
                ['December',   54.4]
            ],
            marker: {
                enabled: false
            },
            showInLegend: true
        }]
    });

    var chart = $('#container').highcharts(),
        name = false,
        enableDataLabels = true,
        enableMarkers = true,
        color = false;


    // Toggle names
    $('#name').click(function () {
        chart.series[0].update({
            name: name ? null : 'First'
        });
        name = !name;
    });

    // Toggle data labels
    $('#data-labels').click(function () {
        chart.series[0].update({
            dataLabels: {
                enabled: enableDataLabels
            }
        });
        enableDataLabels = !enableDataLabels;
    });

    // Toggle point markers
    $('#markers').click(function () {
        chart.series[0].update({
            marker: {
                enabled: enableMarkers
            }
        });
        enableMarkers = !enableMarkers;
    });

    // Toggle point markers
    $('#color').click(function () {
        chart.series[0].update({
            color: color ? null : Highcharts.getOptions().colors[1]
        });
        color = !color;
    });

    // Set type
    $.each(['line', 'column', 'spline', 'area', 'areaspline', 'scatter', 'pie'], function (i, type) {
        $('#' + type).click(function () {
            chart.series[0].update({
                type: type
            });
        });
    });
});