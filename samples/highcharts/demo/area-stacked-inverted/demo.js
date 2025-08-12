Highcharts.setOptions({
    colors: [
        '#331E36',
        '#41337A',
        '#6EA4BF',
        '#98CAD5',
        '#C2EFEB',
        '#ECFEE8',
        '#ECFEE8'
    ]
});

Highcharts.chart('container', {
    chart: {
        type: 'areaspline',
        inverted: true
    },
    title: {
        text: 'MSIS atmospheric composition by height',
        align: 'left'
    },
    subtitle: {
        text: `Source:
            <a href="https://en.wikipedia.org/wiki/Atmosphere_of_Earth"
                target="_blank">Wikipedia.org</a>`,
        align: 'left'
    },
    xAxis: {
        tickmarkPlacement: 'on',
        title: {
            text: 'Height (km)'
        },
        opposite: 'true',
        reversed: false,
        crosshair: {
            width: 2,
            zIndex: 3
        },
        tickInterval: 200
    },
    yAxis: {
        title: {
            text: 'Volume fraction'
        },
        labels: {
            format: '{value} %'
        },
        reversedStacks: false
    },
    tooltip: {
        shared: true,
        headerFormat: 'At {point.x} km:<table>',
        pointFormat: `<tr>
            <td><span style="color:{series.color};">\u2b24</span></td>
            <td>{series.name}</td>
            <td style="text-align: right"><b>{point.y} %</b></td>
        </tr>`,
        footerFormat: '</table>',
        useHTML: true
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        },
        areaspline: {
            stacking: 'percent',
            lineColor: '#666666',
            pointInterval: 100,
            lineWidth: 1,
            marker: {
                enabled: false,
                symbol: 'circle',
                fillColor: '#666666',
                lineColor: '#666666',
                radius: 1,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            },
            label: {
                style: {
                    fontSize: '16px'
                }
            },
            states: {
                hover: {
                    halo: {
                        size: 0
                    }
                }
            }
        }
    },
    series: [
        {
            name: 'N2',
            data: [78, 76, 38, 10, 2.5, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'O2',
            data: [21, 20, 2, 0.5, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'O',
            data: [0, 3, 59, 84, 70, 32, 8, 3, 1, 0, 0]
        },
        {
            name: 'Ar',
            data: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'He',
            data: [0, 0, 1, 5, 25, 62, 82, 82, 78, 71, 62]
        },
        {
            name: 'H',
            data: [0, 0, 0, 0.5, 2.5, 6, 10, 15, 21, 29, 38]
        }
    ]
});
