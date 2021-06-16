// Create the chart
const chart = Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Programmatic drilldown'
    },
    subtitle: {
        text: 'Use the buttons to drill down'
    },
    xAxis: {
        type: 'category'
    },

    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true
            }
        }
    },

    series: [{
        name: 'Goods',
        data: [{
            name: '2020',
            id: 'point-2020',
            y: 5,
            drilldown: 'goods-2020'
        }, {
            name: '2021',
            y: 2
        }]
    }, {
        name: 'Services',
        data: [{
            name: '2020',
            y: 7,
            drilldown: 'services-2020'
        }, {
            name: '2021',
            y: 3
        }]
    }],
    drilldown: {
        series: [{
            id: 'goods-2020',
            name: 'Goods 2020',
            data: [
                ['Q1 2020', 4],
                ['Q2 2020', 2],
                ['Q3 2020', 1],
                ['Q4 2020', 2]
            ]
        }, {
            id: 'services-2020',
            name: 'Services 2020',
            data: [
                ['Q1 2020', 4],
                ['Q2 2020', 2],
                ['Q3 2020', 5],
                ['Q4 2020', 1]
            ]
        }]
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#drill-point').addEventListener('click', () => {
        const point = chart.get('point-2020');
        if (point) {
            point.doDrilldown();
        } else {
            console.warn('Point not available. Already drilled down?');
        }
    });
    document.querySelector('#drill-category').addEventListener('click', () => {
        if (chart.series[0].name === 'Goods') {
            chart.xAxis[0].drilldownCategory(0);
        } else {
            console.warn('Top-level series not found. Already drilled down?');
        }
    });
    document.querySelector('#drill-up').addEventListener('click', () => {
        chart.drillUp();
    });
});
