const chart = Highcharts.chart('container', {
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
});

document.getElementById('toggle').addEventListener('click', () => {
    chart.update({
        data: {
            switchRowsAndColumns: !chart.options.data.switchRowsAndColumns
        }
    });
});
