// Column chart
Highcharts.chart('container-column', {
    chart: {
        type: 'column'
    },

    accessibility: {
        description: 'Disability types of the survey respondents. Blindness and low vision are by far the most common, with 75.8% and 20.4% of respondents respectively.'
    },

    title: {
        text: 'Disability types'
    },

    subtitle: {
        text: 'Source: WebAIM Screen Reader User Survey #7 (2017)'
    },

    legend: {
        enabled: false
    },

    yAxis: {
        title: {
            text: 'Percentage of respondents'
        },
        labels: {
            format: '{value}%'
        }
    },

    tooltip: {
        headerFormat: '',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {point.category}: <b>{point.y}</b>'
    },

    xAxis: {
        categories: ['Blindness', 'Low Vision/Visually-Impaired', 'Cognitive', 'Deafness/Hard-of-Hearing', 'Motor', 'Other']
    },

    series: [{
        name: 'Disability types',
        colorByPoint: true,
        dataLabels: {
            enabled: true,
            format: '{y}%'
        },
        data: [75.8, 20.4, 2.2, 5.0, 1.8, 2.3]
    }]
});


// Make monochrome colors and set them as default for all pies
Highcharts.getOptions().plotOptions.pie.colors = (function () {
    var colors = [],
        base = Highcharts.getOptions().colors[0],
        i;

    for (i = 0; i < 10; i += 1) {
        // Start out with a darkened base color (negative brighten), and end
        // up with a much brighter color
        colors.push(Highcharts.Color(base).brighten((i - 3) / 10).get());
    }
    return colors;
}());

Highcharts.chart('container-pie', {
    chart: {
        type: 'pie'
    },

    accessibility: {
        description: 'Most commonly used desktop and laptop screen readers as reported in the 2017 Webaim Survey. Shown as percentage of respondents. JAWS is the most used screen reader, with 46.6% of respondents using it. NVDA and VoiceOver follow with almost 32% and 12% respectively.'
    },

    title: {
        text: 'Primary screen readers'
    },

    tooltip: {
        valueSuffix: '%'
    },

    subtitle: {
        text: 'Source: WebAIM Screen Reader User Survey #7 (2017)'
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                connectorColor: Highcharts.getOptions().colors[0],
                format: '<b>{point.name}</b>: {point.y:.1f}%'
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
            y: 46.6,
            website: 'https://www.freedomscientific.com/Products/Blindness/JAWS',
            accessibility: {
                description: 'This is the most used desktop screen reader'
            }
        }, {
            name: 'NVDA',
            y: 31.9,
            website: 'https://www.nvaccess.org'
        }, {
            name: 'VoiceOver',
            y: 11.7,
            website: 'http://www.apple.com/accessibility/osx/voiceover'
        }, {
            name: 'ZoomText',
            y: 2.4,
            website: 'http://www.zoomtext.com/products/zoomtext-magnifierreader'
        }, {
            name: 'System Access To Go',
            y: 1.7,
            website: 'https://www.satogo.com'
        }, {
            name: 'Window-Eyes',
            y: 1.5,
            website: 'http://www.gwmicro.com/window-eyes'
        }, {
            name: 'ChromeVox',
            y: 0.4,
            website: 'http://www.chromevox.com'
        }, {
            name: 'Narrator',
            y: 0.3,
            website: 'https://www.microsoft.com/en-us/accessibility/windows'
        }, {
            name: 'Other',
            y: 2.9,
            website: 'http://www.disabled-world.com/assistivedevices/computer/screen-readers.php'
        }]
    }]
});
