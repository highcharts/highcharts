Highcharts.chart('container', {
    chart: {
        scrollablePlotArea: {
            minWidth: 700,
            scrollPositionX: 1
        }
    },
    title: {
        text: 'Tooltip formatter & scrollable plot area'
    },
    series: [{
        type: 'column',
        data: [1, 2, 3, 7, 8, 1, 2, 5, 6, 1]
    }],
    tooltip: {
        pointFormat: 'Tooltip inside the chart',
        headerFormat: '',
        shape: 'square',
        positioner: function() {
            return {
                x: 100,
                y: this.chart.container.getBoundingClientRect().top + 50
            }
        }
    }
});  