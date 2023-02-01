Highcharts.chart('container', {
    chart: {
        type: 'spline',
        backgroundColor: '#1b1b1b',
        marginBottom: 40
    },
    title: {
        text: 'Top 10 largest economies by average values of GDP',
        style: {
            color: '#FFFFFF',
            fontWeight: 'bold'
        }
    },

    subtitle: {
        text:
      'Source: <a href="https://en.wikipedia.org/wiki/List_of_countries_by_largest_historical_GDP" target="_blank" style="color:white">Wikipedia</a>',
        align: 'left',
        style: {
            color: '#FFFFFF',
            fontWeight: 'bold'
        }
    },

    yAxis: {
        reversed: true,
        gridLineWidth: 0,
        tickInterval: 1,
        startOnTick: false,
        endOnTick: false,
        labels: {
            style: {
                color: '#FFFFFF',
                fontWeight: 'bold'
            }
        },
        title: {
            text: null,
            style: {
                color: '#FFFFFF',
                fontWeight: 'bold'
            }
        }
    },

    xAxis: {
        opposite: true,
        offset: 10,
        labels: {
            style: {
                color: '#FFFFFF',
                fontWeight: 'bold'
            }
        },
        accessibility: {
            rangeDescription: 'Range: 2010 to 2020'
        }
    },

    legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'proximate',
        itemStyle: {
            color: '#FFFFFF',
            fontWeight: 'bold'
        }
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            marker: {
                enabled: false,
                symbol: 'circle'
            },
            pointStart: 1980,
            pointInterval: 5,
            lineWidth: 4
        }
    },
    colors: [
        '#FF0200',
        '#7CB4EC',
        '#008001',
        '#faf0be',
        '#FFB6C1',
        '#2C908F',
        '#91EE7D',
        '#F7A35B',
        '#8185E8',
        '#F15C80',
        '#ffffff',
        '#A19642'
    ],

    series: [
        {
            name: 'China',
            data: [10, 9, 7, 3, 2, 2, 2, 1, 1]
        },
        {
            name: 'USA',
            data: [1, 2, 1, 1, 1, 1, 1, 2, 2]
        },
        {
            name: 'India',
            data: [9, 10, 10, 5, 5, 4, 3, 3, 3]
        },
        {
            name: 'Germany',
            data: [4, 4, 4, 4, 4, 5, 5, 5, 5]
        },
        {
            name: 'Japan',
            data: [3, 3, 3, 2, 3, 3, 4, 4, 4]
        },
        {
            name: 'Russia',
            data: [null, null, null, 6, 7, 6, 6, 6, 6]
        },
        {
            name: 'Indonesia',
            data: [null, null, null, null, null, null, null, 8, 7]
        },
        {
            name: 'Brazil',
            data: [7, 7, 9, 9, 9, 7, 7, 7, 8]
        },
        {
            name: 'France',
            data: [6, 6, 6, 8, 6, 8, 8, 10, 9]
        },
        {
            name: 'UK',
            data: [8, 8, 8, 10, 10, 9, 9, 9, 10]
        },
        {
            name: 'Soviet Union',
            data: [2, 1, 2, null],
            showInLegend: false
        },
        {
            name: 'Italy',
            data: [5, 5, 5, null],
            showInLegend: false
        }
    ]
});
