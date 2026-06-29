// Data retrieved from https://www.ssb.no/energi-og-industri/olje-og-gass/statistikk/sal-av-petroleumsprodukt/artikler/auka-sal-av-petroleumsprodukt-til-vegtrafikk
Highcharts.chart('container', {
    dataTable: {
        columns: {
            Product: [
                'Jet fuel', 'Duty-free diesel', 'Petrol', 'Diesel', 'Gas oil'
            ],
            2020: [59, 83, 65, 228, 184],
            2021: [24, 79, 72, 240, 167],
            2022: [58, 88, 75, 250, 176],
            Average: [47, 83.33, 70.66, 239.33, 175.66]
        }
    },
    title: {
        text: 'Sales of petroleum products March, Norway'
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: {
            text: 'Million liters'
        }
    },
    tooltip: {
        valueSuffix: ' million liters'
    },
    plotOptions: {
        series: {
            borderRadius: '25%',
            dataMapping: {
                name: 'Product'
            }
        }
    },
    series: [{
        type: 'column',
        dataMapping: {
            y: '2020'
        }
    }, {
        type: 'column',
        dataMapping: {
            y: '2021'
        }
    }, {
        type: 'column',
        dataMapping: {
            y: '2022'
        }
    }, {
        type: 'line',
        step: 'center',
        dataMapping: {
            y: 'Average'
        },
        marker: {
            lineWidth: 2,
            lineColor: 'var(--highcharts-color-3)',
            fillColor: 'var(--highcharts-background-color, white)'
        }
    }, {
        type: 'pie',
        name: 'Total',
        data: [{
            name: '2020',
            y: 619,
            color: 'var(--highcharts-color-0)', // 2020 color
            dataLabels: {
                enabled: true,
                distance: -50,
                format: '{point.total} M',
                style: {
                    fontSize: '15px',
                    color: 'var(--highcharts-neutral-color-100, black)'
                }
            }
        }, {
            name: '2021',
            y: 586,
            color: 'var(--highcharts-color-1)' // 2021 color
        }, {
            name: '2022',
            y: 647,
            color: 'var(--highcharts-color-2)' // 2022 color
        }],
        center: [75, 65],
        size: 100,
        innerSize: '70%',
        showInLegend: false,
        dataLabels: {
            enabled: false
        }
    }]
});
