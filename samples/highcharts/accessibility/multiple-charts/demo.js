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

// Line chart
function highlightSeries(series) {
    var chart = series.chart;
    chart.series.forEach(function (s) {
        if (s !== series) {
            if (s.tt) {
                s.tt.attr('opacity', 0.2);
            }
            s.group.attr('opacity', 0.2);
            s.markerGroup.attr('opacity', 0.2);
        }
    });
}
function clearHighlight(chart) {
    chart.series.forEach(function (series) {
        if (series.tt) {
            series.tt.attr('opacity', 1);
        }
        series.group.attr('opacity', 1);
        series.markerGroup.attr('opacity', 1);
    });
}

var chart = Highcharts.chart('container-line', {
    accessibility: {
        description: 'Most commonly used desktop screen readers from January 2009 to July 2015 as reported in the Webaim Survey. JAWS remains the most used screen reader, but is steadily declining. ZoomText and WindowEyes are both displaying large growth from 2014 to 2015.'
    },
    chart: {
        type: 'spline'
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
        accessibility: {
            description: 'Time from January 2009 to July 2015'
        },
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
                    },
                    mouseOver: function () {
                        highlightSeries(this.series);
                    },
                    mouseOut: function () {
                        clearHighlight(this.series.chart);
                    }
                }
            },
            cursor: 'pointer'
        }
    },

    series: [{
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
    }]
});

chart.legend.allItems.forEach(function (item) {
    Highcharts.addEvent(item.a11yProxyElement, 'focus', function () {
        highlightSeries(item.points[0].series);
    });
    Highcharts.addEvent(item.a11yProxyElement, 'blur', function () {
        clearHighlight(chart);
    });
});


// Pie chart

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
