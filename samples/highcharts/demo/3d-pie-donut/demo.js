// Data retrieved from https://olympics.com/en/olympic-games/beijing-2022/medals
Highcharts.chart('container', {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45
        }
    },
    title: {
        text: 'Beijing 2022 gold medals by country',
        align: 'left'
    },
    subtitle: {
        text: '3D donut in Highcharts',
        align: 'left'
    },
    plotOptions: {
        pie: {
            innerSize: 100,
            depth: 45,
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                distance: -50,
                style: {
                    color: '#000000'
                }
            }
        }
    },
    series: [{
        name: 'Medals',
        data: [
            {
                name: 'Norway',
                y: 16,
                dataLabels: {
                    x: 20,
                    y: -20,
                    rotation: 30
                }
            },
            {
                name: 'Germany',
                y: 12,
                dataLabels: {
                    x: 55,
                    y: 75,
                    rotation: 300
                }
            },
            {
                name: 'USA',
                y: 8,
                dataLabels: {
                    x: -30,
                    y: 95,
                    rotation: 350
                }
            },
            {
                name: 'Sweden',
                y: 8,
                dataLabels: {
                    x: 30,
                    y: 95,
                    rotation: 15
                }
            },
            {
                name: 'Netherlands',
                y: 8,
                dataLabels: {
                    x: -45,
                    y: 85,
                    rotation: 50
                }
            },
            {
                name: 'ROC',
                y: 6,
                dataLabels: {
                    x: -55,
                    y: 20,
                    rotation: 273
                }
            },
            {
                name: 'Austria',
                y: 7,
                dataLabels: {
                    x: -35,
                    y: -10,
                    rotation: 313
                }
            },
            {
                name: 'Canada',
                y: 4,
                dataLabels: {
                    x: 15,
                    y: -35,
                    rotation: 340
                }
            },
            {
                name: 'Japan',
                y: 3,
                dataLabels: {
                    x: 63,
                    y: -47,
                    rotation: 353
                }
            }
        ]
    }]
});
