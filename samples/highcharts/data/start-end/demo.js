$(function () {
    $('#container').highcharts({

        title: {
            text: 'Global temperature change'
        },

        subtitle: {
            text: 'Data module: Show only last 20 years by limiting start row.'
        },

        data: {
            csv: document.getElementById('csv').innerHTML,
            startRow: 114,
            endRow: 134,
            endColumn: 1,
            firstRowAsNames: false
        },

        xAxis: {
            allowDecimals: false
        },

        series: [{
            name: 'Annual mean'
        }]
    });
});