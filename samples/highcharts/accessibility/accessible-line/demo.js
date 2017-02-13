
Highcharts.chart('container', {
    chart: {
        type: 'spline',
        description: 'Most commonly used desktop screen readers from January 2009 to July 2015 as reported in the Webaim Survey. JAWS remains the most used screen reader, but is steadily declining. ZoomText and WindowEyes are both displaying large growth from 2014 to 2015.'
    },

    legend: {
        symbolWidth: 40
    },

    title: {
        text: 'Desktop screen readers from 2009 to 2015'
    },

    subtitle: {
        text: 'Click on point to visit official website'
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
        description: 'Time from January 2009 to July 2015',
        categories: ['January 2009', 'December 2010', 'May 2012', 'January 2014', 'July 2015']
    },

    tooltip: {
        split: true
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
            name: 'JAWS',
            data: [74, 69.6, 63.7, 63.9, 43.7],
            website: 'https://www.freedomscientific.com/Products/Blindness/JAWS'
        }, {
            name: 'NVDA',
            data: [8, 34.8, 43.0, 51.2, 41.4],
            website: 'https://www.nvaccess.org',
            dashStyle: 'Dot'
        }, {
            name: 'VoiceOver',
            data: [6, 20.2, 30.7, 36.8, 30.9],
            website: 'http://www.apple.com/accessibility/osx/voiceover',
            dashStyle: 'ShortDot',
            color: Highcharts.getOptions().colors[7]
        }, {
            name: 'Window-Eyes',
            data: [23, 19.0, 20.7, 13.9, 29.6],
            website: 'http://www.gwmicro.com/window-eyes',
            dashStyle: 'Dash',
            color: Highcharts.getOptions().colors[0]
        }, {
            name: 'ZoomText',
            data: [0, 6.1, 6.8, 5.3, 27.5],
            website: 'http://www.zoomtext.com/products/zoomtext-magnifierreader',
            dashStyle: 'ShortDashDot',
            color: Highcharts.getOptions().colors[8]
        }, {
            name: 'System Access To Go',
            data: [0, 16.2, 22.1, 26.2, 6.9],
            website: 'https://www.satogo.com',
            dashStyle: 'ShortDash',
            color: Highcharts.getOptions().colors[1]
        }, {
            name: 'ChromeVox',
            data: [0, 0, 2.8, 4.8, 2.8],
            website: 'http://www.chromevox.com',
            dashStyle: 'DotDash',
            color: Highcharts.getOptions().colors[4]
        }, {
            name: 'Other',
            data: [0, 7.4, 5.9, 9.3, 6.5],
            website: 'http://www.disabled-world.com/assistivedevices/computer/screen-readers.php',
            dashStyle: 'LongDash',
            color: Highcharts.getOptions().colors[7]
        }
    ]
});
