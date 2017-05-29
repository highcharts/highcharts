

Highcharts.chart('container', {
    chart: {
        type: 'pie',
        description: 'Most commonly used desktop screen readers in July 2015 as reported in the Webaim Survey. Shown as percentage of respondents. JAWS is by far the most used screen reader, with 30% of respondents using it. ZoomText and Window-Eyes follow, each with around 20% usage.'
    },

    title: {
        text: 'Desktop screen readers'
    },

    subtitle: {
        text: 'Click on point to visit official website'
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                connectorColor: Highcharts.getOptions().colors[0],
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            },
            point: {
                events: {
                    click: function () {
                        window.location.href = this.website;
                    }
                }
            },
            cursor: 'pointer'
        }
    },

    series: [{
        name: 'Percentage usage',
        borderColor: Highcharts.getOptions().colors[0],
        data: [{
            name: 'JAWS',
            y: 30.2,
            website: 'https://www.freedomscientific.com/Products/Blindness/JAWS',
            color: 'url(#highcharts-default-pattern-0)',
            description: 'This is the most used desktop screen reader'
        }, {
            name: 'ZoomText',
            y: 22.2,
            website: 'http://www.zoomtext.com/products/zoomtext-magnifierreader',
            color: 'url(#highcharts-default-pattern-1)'
        }, {
            name: 'Window-Eyes',
            y: 20.7,
            website: 'http://www.gwmicro.com/window-eyes',
            color: 'url(#highcharts-default-pattern-2)'
        }, {
            name: 'NVDA',
            y: 14.6,
            website: 'https://www.nvaccess.org',
            color: 'url(#highcharts-default-pattern-4)'
        }, {
            name: 'VoiceOver',
            y: 7.6,
            website: 'http://www.apple.com/accessibility/osx/voiceover',
            color: 'url(#highcharts-default-pattern-3)'
        }, {
            name: 'System Access To Go',
            y: 1.5,
            website: 'https://www.satogo.com',
            color: 'url(#highcharts-default-pattern-7)'
        }, {
            name: 'ChromeVox',
            y: 0.3,
            website: 'http://www.chromevox.com',
            color: 'url(#highcharts-default-pattern-6)'
        }, {
            name: 'Other',
            y: 2.9,
            website: 'http://www.disabled-world.com/assistivedevices/computer/screen-readers.php',
            color: 'url(#highcharts-default-pattern-5)'
        }]
    }]
});
