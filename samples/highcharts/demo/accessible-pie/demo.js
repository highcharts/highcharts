function getColorPattern(i) {
    var colors = Highcharts.getOptions().colors,
        patternColors = [colors[2], colors[0], colors[3], colors[1], colors[4]],
        patterns = [
            'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5',
            'M 0 5 L 5 0 M -0.5 0.5 L 0.5 -0.5 M 4.5 5.5 L 5.5 4.5',
            'M 1.5 0 L 1.5 5 M 4 0 L 4 5',
            'M 0 1.5 L 5 1.5 M 0 4 L 5 4',
            'M 0 1.5 L 2.5 1.5 L 2.5 0 M 2.5 5 L 2.5 3.5 L 5 3.5'
        ];

    return {
        pattern: {
            path: patterns[i],
            color: patternColors[i],
            width: 5,
            height: 5
        }
    };
}

Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },

    title: {
        text: 'Primary desktop/laptop screen readers'
    },

    subtitle: {
        text: 'Source: WebAIM. Click on point to visit official website'
    },

    tooltip: {
        valueSuffix: '%',
        borderColor: '#8ae'
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                connectorColor: '#777',
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            },
            point: {
                events: {
                    click: function () {
                        window.location.href = this.website;
                    }
                }
            },
            cursor: 'pointer',
            borderWidth: 3
        }
    },

    series: [{
        name: 'Screen reader usage',
        data: [{
            name: 'NVDA',
            y: 40.6,
            color: getColorPattern(0),
            website: 'https://www.nvaccess.org',
            accessibility: {
                description: 'This is the most used desktop screen reader'
            }
        }, {
            name: 'JAWS',
            y: 40.1,
            color: getColorPattern(1),
            website: 'https://www.freedomscientific.com/Products/Blindness/JAWS'
        }, {
            name: 'VoiceOver',
            y: 12.9,
            color: getColorPattern(2),
            website: 'http://www.apple.com/accessibility/osx/voiceover'
        }, {
            name: 'ZoomText',
            y: 2,
            color: getColorPattern(3),
            website: 'http://www.zoomtext.com/products/zoomtext-magnifierreader'
        }, {
            name: 'Other',
            y: 4.4,
            color: getColorPattern(4),
            website: 'http://www.disabled-world.com/assistivedevices/computer/screen-readers.php'
        }]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                plotOptions: {
                    series: {
                        dataLabels: {
                            format: '<b>{point.name}</b>'
                        }
                    }
                }
            }
        }]
    }
});
