const clrs = Highcharts.getOptions().colors;
const pieColors = [clrs[2], clrs[0], clrs[3], clrs[1], clrs[4]];

// Get a default pattern, but using the pieColors above.
// The i-argument refers to which default pattern to use
function getPattern(i) {
    return {
        pattern: Highcharts.merge(Highcharts.patterns[i], {
            color: pieColors[i]
        })
    };
}

// Get 5 patterns
const patterns = [0, 1, 2, 3, 4].map(getPattern);

const chart = Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },

    title: {
        text: 'Primary desktop/laptop screen readers',
        align: 'left'
    },

    subtitle: {
        text: 'Source: WebAIM. Click on point to visit official website',
        align: 'left'
    },

    colors: patterns,

    tooltip: {
        valueSuffix: '%',
        borderColor: '#8ae',
        shape: 'rect',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        followPointer: false,
        stickOnContact: true
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
            website: 'https://www.nvaccess.org',
            accessibility: {
                description: 'This is the most used desktop screen reader'
            }
        }, {
            name: 'JAWS',
            y: 40.1,
            website: 'https://www.freedomscientific.com/Products/Blindness/JAWS'
        }, {
            name: 'VoiceOver',
            y: 12.9,
            website: 'http://www.apple.com/accessibility/osx/voiceover'
        }, {
            name: 'ZoomText',
            y: 2,
            website: 'http://www.zoomtext.com/products/zoomtext-magnifierreader'
        }, {
            name: 'Other',
            y: 4.4,
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

// Toggle patterns enabled
document.getElementById('patterns-enabled').onclick = function () {
    chart.update({
        colors: this.checked ? patterns : pieColors
    });
};
