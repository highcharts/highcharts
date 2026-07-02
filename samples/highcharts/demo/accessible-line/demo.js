const colors = Highcharts.getOptions().colors;

Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },

    legend: {
        symbolWidth: 40
    },

    title: {
        text: 'Most common desktop screen readers',
        align: 'left'
    },

    subtitle: {
        text:
      'Source: WebAIM. Click on points to visit official screen reader website',
        align: 'left'
    },

    yAxis: {
        title: {
            text: 'Percentage usage'
        },
        accessibility: {
            description: 'Percentage usage'
        }
    },

    xAxis: {
        title: {
            text: 'Time'
        },
        accessibility: {
            description: 'Time from December 2010 to January 2024'
        },
        categories: [
            'December 2010',
            'May 2012',
            'January 2014',
            'July 2015',
            'October 2017',
            'September 2019',
            'June 2021',
            'January 2024'
        ]
    },

    tooltip: {
        valueSuffix: '%',
        stickOnContact: true
    },

    plotOptions: {
        series: {
            point: {
                events: {
                    click: function () {
                        top.location.href = this.series.options.website;
                    }
                }
            },
            cursor: 'pointer',
            lineWidth: 2
        }
    },

    series: [
        {
            name: 'NVDA',
            data: [34.8, 43.0, 51.2, 41.4, 64.9, 72.4, 58.8, 65.6],
            website: 'https://www.nvaccess.org',
            color: colors[2],
            accessibility: {
                description: 'This is the most used screen reader in 2024.'
            }
        }, {
            name: 'JAWS',
            data: [69.6, 63.7, 63.9, 43.7, 66.0, 61.7, 70.0, 60.5],
            website: 'https://www.freedomscientific.com/Products/Blindness/JAWS',
            dashStyle: 'ShortDashDot',
            color: colors[0]
        }, {
            name: 'VoiceOver',
            data: [20.2, 30.7, 36.8, 30.9, 39.6, 47.1, 41.3, 43.9],
            website: 'https://www.apple.com/accessibility/osx/voiceover',
            dashStyle: 'ShortDot',
            color: colors[1]
        }, {
            name: 'Narrator',
            data: [null, null, null, null, 21.4, 30.3, 36.8, 37.3],
            website: 'https://support.microsoft.com/en-us/help/22798/windows-10-complete-guide-to-narrator',
            dashStyle: 'Dash',
            color: colors[9]
        }, {
            name: 'ZoomText/Fusion',
            data: [6.1, 6.8, 5.3, 27.5, 6.0, 5.5, 8.9, 7.5],
            website: 'https://vispero.com/zoomtext-screen-magnifier-software/',
            dashStyle: 'ShortDot',
            color: colors[5]
        }, {
            name: 'Other',
            data: [42.6, 51.5, 54.2, 45.8, 20.2, 15.4, 15.5, 25.6],
            website: 'https://www.disabled-world.com/assistivedevices/computer/screen-readers.php',
            dashStyle: 'ShortDash',
            color: colors[3],
            accessibility: {
                description:
                    'Represents less common screen readers. Usage increases ' +
                    'slightly in 2024 and includes Orca at 8.3%.'
            }
        }
    ],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 550
            },
            chartOptions: {
                chart: {
                    spacingLeft: 3,
                    spacingRight: 3
                },
                legend: {
                    itemWidth: 150
                },
                xAxis: {
                    categories: [
                        'Dec. 2010',
                        'May 2012',
                        'Jan. 2014',
                        'July 2015',
                        'Oct. 2017',
                        'Sep. 2019',
                        'June 2021',
                        'Jan. 2024'
                    ],
                    title: ''
                },
                yAxis: {
                    visible: false
                }
            }
        }]
    }
});
