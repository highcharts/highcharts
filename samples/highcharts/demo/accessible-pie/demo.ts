const clrs = Highcharts.getOptions().colors;
const pieColors = [clrs[2], clrs[0], clrs[3], clrs[1], clrs[4]];

// Get a default pattern, but using the pieColors above.
// The i-argument refers to which default pattern to use
function getPattern(i: number): Highcharts.PatternObject {
    return {
        pattern: Highcharts.merge(Highcharts.patterns[i], {
            color: pieColors[i]
        })
    };
}

// Get 5 patterns
const patterns = [0, 1, 2, 3, 4].map(getPattern);

// Website references
const websites = {
    NVDA: 'https://www.nvaccess.org',
    JAWS: 'https://www.freedomscientific.com/Products/Blindness/JAWS',
    VoiceOver: 'http://www.apple.com/accessibility/osx/voiceover',
    ZoomText: 'http://www.zoomtext.com/products/zoomtext-magnifierreader',
    Other: 'http://www.disabled-world.com/assistivedevices/computer/screen-readers.php'
};

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
        backgroundColor: `color-mix(
            var(--highcharts-background-color) 95%,
            transparent
        )`,
        followPointer: false,
        stickOnContact: true
    },

    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                connectorColor: '#777',
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            },
            point: {
                events: {
                    click: function () {
                        window.location.href = websites[
                            this.name as keyof typeof websites
                        ];
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
            accessibility: {
                description: 'This is the most used desktop screen reader'
            }
        }, {
            name: 'JAWS',
            y: 40.1
        }, {
            name: 'VoiceOver',
            y: 12.9
        }, {
            name: 'ZoomText',
            y: 2
        }, {
            name: 'Other',
            y: 4.4
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
} satisfies Highcharts.Options);

// Toggle patterns enabled
(document.getElementById('patterns-enabled') as HTMLInputElement)
    .addEventListener(
        'change',
        function () {
            chart.update({
                colors: this.checked ? patterns : pieColors
            }, true, true, false);
        }
    );
