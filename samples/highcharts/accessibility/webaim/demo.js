
// First chart
Highcharts.chart('container-line', {
    chart: {
        type: 'spline',
        description: 'Commonly used desktop and laptop screen readers from January 2009 to July 2015 as reported in the Webaim Survey. JAWS remains the most used screen reader, but is steadily declining. ZoomText and WindowEyes are both displaying large growth from 2014 to 2015.'
    },

    legend: {
        symbolWidth: 40
    },

    title: {
        text: 'Commonly used screen readers from 2009 to 2015'
    },

    yAxis: {
        title: {
            text: 'Percentage of respondents'
        },
        labels: {
            format: '{value}%'
        },
        max: 75,
        tickInterval: 25
    },

    xAxis: {
        title: {
            text: 'Time'
        },
        categories: ['January 2009', 'December 2010', 'May 2012', 'January 2014', 'July 2015']
    },

    tooltip: {
        split: true,
        valueSuffix: '%'
    },

    series: [{
        name: 'JAWS',
        data: [74, 69.6, 63.7, 63.9, 43.7]
    }, {
        name: 'NVDA',
        data: [8, 34.8, 43.0, 51.2, 41.4],
        dashStyle: 'Dot'
    }, {
        name: 'VoiceOver',
        data: [6, 20.2, 30.7, 36.8, 30.9],
        dashStyle: 'ShortDot',
        color: Highcharts.getOptions().colors[7]
    }, {
        name: 'Window-Eyes',
        data: [23, 19.0, 20.7, 13.9, 29.6],
        dashStyle: 'Dash',
        color: Highcharts.getOptions().colors[0]
    }, {
        name: 'ZoomText',
        data: [0, 6.1, 6.8, 5.3, 27.5],
        dashStyle: 'ShortDashDot',
        color: Highcharts.getOptions().colors[8]
    }, {
        name: 'System Access To Go',
        data: [0, 16.2, 22.1, 26.2, 6.9],
        dashStyle: 'ShortDash',
        color: Highcharts.getOptions().colors[1]
    }, {
        name: 'ChromeVox',
        data: [0, 0, 2.8, 4.8, 2.8],
        dashStyle: 'DotDash',
        color: Highcharts.getOptions().colors[4]
    }, {
        name: 'Other',
        data: [0, 7.4, 5.9, 9.3, 6.5],
        dashStyle: 'LongDash',
        color: Highcharts.getOptions().colors[7]
    }]
});


// Second chart

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
        type: 'pie',
        description: 'Most commonly used desktop and laptop screen readers in July 2015 as reported in the Webaim Survey. Shown as percentage of respondents. JAWS is by far the most used screen reader, with 30% of respondents using it. ZoomText and Window-Eyes follow, each with around 20% usage.'
    },

    title: {
        text: 'Primary screen readers'
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
            description: 'This is the most used desktop screen reader'
        }, {
            name: 'ZoomText',
            y: 22.2,
            website: 'http://www.zoomtext.com/products/zoomtext-magnifierreader'
        }, {
            name: 'Window-Eyes',
            y: 20.7,
            website: 'http://www.gwmicro.com/window-eyes'
        }, {
            name: 'NVDA',
            y: 14.6,
            website: 'https://www.nvaccess.org'
        }, {
            name: 'VoiceOver',
            y: 7.6,
            website: 'http://www.apple.com/accessibility/osx/voiceover'
        }, {
            name: 'System Access To Go',
            y: 1.5,
            website: 'https://www.satogo.com'
        }, {
            name: 'ChromeVox',
            y: 0.3,
            website: 'http://www.chromevox.com'
        }, {
            name: 'Other',
            y: 2.9,
            website: 'http://www.disabled-world.com/assistivedevices/computer/screen-readers.php'
        }]
    }]
});


// Third chart
Highcharts.chart('container-column', {
    chart: {
        type: 'column',
        description: 'Disability types of the survey respondents. Blindness and low vision are by far the most common, with 64% and 38.7% of respondents respectively. Note that some respondents reported multiple disabilities.'
    },

    title: {
        text: 'Disability types'
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
        data: [64, 38.7, 1.7, 6.2, 2.4, 2.6]
    }]
});


// Fourth chart
Highcharts.chart('container-pie-3d', {
    chart: {
        type: 'pie',
        description: "Respondents' current level of employment. The results clearly reflect the significant unemployment and underemployment of individuals with disabilities, with only 40.7% of respondents being employed full time.",
        options3d: {
            enabled: true,
            alpha: 55,
            beta: 0
        }
    },

    title: {
        text: 'Level of employment'
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }
    },

    series: [{
        name: 'Percentage usage',
        depth: 40,
        data: [{
            name: 'Full time employment',
            y: 40.7,
            color: '#991111'
        }, {
            name: 'Part time employment',
            y: 13.9,
            color: '#bb3333'
        }, {
            name: 'Unemployed',
            y: 45.4,
            color: '#ee6666'
        }]
    }]
});

