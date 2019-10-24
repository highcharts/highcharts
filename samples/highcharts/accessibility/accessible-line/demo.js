var colors = Highcharts.getOptions().colors;

Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },

    legend: {
        symbolWidth: 40
    },

    title: {
        text: 'Most common desktop screen readers'
    },

    subtitle: {
        text: 'Source: WebAIM. Click on points to visit official screen reader website'
    },

    caption: {
        text: 'Line chart demonstrating some accessibility features of Highcharts. The chart displays the most commonly used screen readers in surveys taken by WebAIM from December 2010 to September 2019. JAWS was the most used screen reader until 2019, when NVDA took over. VoiceOver is the third most used screen reader, followed by Narrator. ZoomText/Fusion had a surge in 2015, but usage is otherwise low. The overall use of other screen readers has declined drastically the past few years.'
    },

    yAxis: {
        title: {
            text: 'Percentage usage'
        }
    },

    xAxis: {
        title: {
            text: 'Time'
        },
        accessibility: {
            description: 'Time from December 2010 to September 2019'
        },
        categories: ['December 2010', 'May 2012', 'January 2014', 'July 2015', 'October 2017', 'September 2019']
    },

    tooltip: {
        valueSuffix: '%'
    },

    plotOptions: {
        series: {
            point: {
                events: {
                    click: function () {
                        window.location.href = this.series.options.website;
                    }
                }
            },
            cursor: 'pointer'
        }
    },

    series: [
        {
            name: 'NVDA',
            data: [34.8, 43.0, 51.2, 41.4, 64.9, 72.4],
            website: 'https://www.nvaccess.org',
            color: colors[2],
            accessibility: {
                description: 'This is the most used screen reader in 2019'
            }
        }, {
            name: 'JAWS',
            data: [69.6, 63.7, 63.9, 43.7, 66.0, 61.7],
            website: 'https://www.freedomscientific.com/Products/Blindness/JAWS',
            dashStyle: 'ShortDashDot',
            color: colors[0]
        }, {
            name: 'VoiceOver',
            data: [20.2, 30.7, 36.8, 30.9, 39.6, 47.1],
            website: 'http://www.apple.com/accessibility/osx/voiceover',
            dashStyle: 'ShortDot',
            color: colors[1]
        }, {
            name: 'Narrator',
            data: [null, null, null, null, 21.4, 30.3],
            website: 'https://support.microsoft.com/en-us/help/22798/windows-10-complete-guide-to-narrator',
            dashStyle: 'Dash',
            color: colors[9]
        }, {
            name: 'ZoomText/Fusion',
            data: [6.1, 6.8, 5.3, 27.5, 6.0, 5.5],
            website: 'http://www.zoomtext.com/products/zoomtext-magnifierreader',
            dashStyle: 'ShortDot',
            color: colors[5]
        }, {
            name: 'Other',
            data: [42.6, 51.5, 54.2, 45.8, 20.2, 15.4],
            website: 'http://www.disabled-world.com/assistivedevices/computer/screen-readers.php',
            dashStyle: 'ShortDash',
            color: colors[3]
        }
    ],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    itemWidth: 150
                }
            }
        }]
    }
});
