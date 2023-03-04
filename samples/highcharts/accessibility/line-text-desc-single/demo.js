const day = 1000 * 60 * 60 * 24;
let prevYear,
    prevMonth,
    yearCount = -1,
    monthCount = -1;

const chart = Highcharts.chart('container', {
    title: {
        text: 'Price of one Bitcoin in US dollars'
    },
    subtitle: {
        text: 'Daily prices, source: Yahoo Finance'
    },
    chart: {
        type: 'spline'
    },
    accessibility: {
        screenReaderSection: {
            axisRangeDateFormat: '%B %Y',
            beforeChartFormat: ''
        },
        point: {
            dateFormat: '%b %e, %Y',
            valueDescriptionFormat: '{value}{separator}{xDescription}'
        },
        series: {
            pointDescriptionEnabledThreshold: false
        }
    },
    sonification: {
        duration: 8000,
        globalContextTracks: [{
            instrument: 'chop',
            valueInterval: day,
            mapping: {
                volume: 0.4
            },
            activeWhen: function (context) {
                const x = context.value,
                    month = new Date(x).getMonth(),
                    newMonth = month !== prevMonth;
                prevMonth = month;
                if (newMonth) {
                    ++monthCount;
                    return !(monthCount % 3);
                }
                return false;
            }
        }, {
            type: 'speech',
            mapping: {
                text: function (context) {
                    const x = context.value,
                        year = new Date(x).getFullYear();
                    return '' + year;
                },
                rate: 2.5,
                volume: 0.3
            },
            valueInterval: day * 10,
            activeWhen: function (context) {
                const x = context.value,
                    year = new Date(x).getFullYear(),
                    newYear = year !== prevYear;
                prevYear = year;
                if (newYear) {
                    ++yearCount;
                    return !(yearCount % 2);
                }
                return false;
            }
        }]
    },
    exporting: {
        enabled: false
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        }
    },
    legend: {
        enabled: false
    },
    data: {
        csv: document.getElementById('data').textContent
    },
    yAxis: {
        title: {
            text: null
        },
        accessibility: {
            description: 'Price in dollar'
        },
        labels: {
            format: '${value:,.0f}'
        }
    },
    xAxis: {
        accessibility: {
            description: 'Time'
        },
        type: 'datetime'
    },
    tooltip: {
        valuePrefix: '$',
        stickOnContact: true
    }
});

chart.accessibility.addLineChartTextDescription();
chart.accessibility.addLineTrendControls();
