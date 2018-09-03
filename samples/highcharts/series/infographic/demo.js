Highcharts.chart('container', {
    chart: {
        scrollablePlotArea: {
            minWidth: 460
        }
    },
    title: {
        text: 'Tallest buildings'
    },
    subtitle: {
        text: 'An infographic demo with the pattern fill module'
    },
    tooltip: {
        pointFormat: 'The height for <b>{point.name}</b> is <b>{point.y}</b>'
    },
    legend: {
        enabled: false
    },
    xAxis: {
        type: 'category',
        labels: {
            style: {
                fontSize: '18px'
            }
        }
    },
    yAxis: {
        title: {
            text: 'Height'
        },
        labels: {
            format: '{value}ft'
        }
    },
    series: [{
        type: 'column',
        pointWidth: 110,
        pointPadding: 0.25,
        borderColor: 'transparent',
        borderWidth: 0,
        data: [{
            name: 'Petronas',
            y: 100,
            color: {
                pattern: {
                    image: 'https://www.svgrepo.com/show/27082/petronas-towers.svg',
                    aspectRatio: 1.3
                }
            }
        }, {
            name: 'Pisa',
            y: 150,
            color: {
                pattern: {
                    image: 'https://www.svgrepo.com/show/1171/tower-of-pisa.svg',
                    aspectRatio: 1
                }
            }
        }, {
            name: 'Eiffel tower',
            y: 200,
            color: {
                pattern: {
                    image: 'https://www.svgrepo.com/show/19456/tokyo-tower.svg',
                    aspectRatio: 0.8
                }
            }
        }, {
            name: 'Ahu-tongariki',
            y: 250,
            color: {
                pattern: {
                    image: 'https://www.svgrepo.com/show/27081/ahu-tongariki.svg',
                    aspectRatio: 0.75
                }
            }
        }]
    }]
});
