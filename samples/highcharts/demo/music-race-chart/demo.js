const btn = document.getElementById('play-pause-button'),
    input = document.getElementById('play-range'),
    startYear = 1973,
    endYear = 2021;

// General helper functions
const getRevenue = (record, year) => {
    const revenue = record[year];
    if (typeof revenue !== 'undefined') {
        return revenue;
    }
    return 0;
};

const arrToAssociative = arr => {
    const tmp = {};
    arr.forEach(item => {
        if (item[1] !== null) {
            tmp[item[0]] = item[1];
        }
    });

    return tmp;
};

const formatRevenue = [];

const chart = Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Music revenue race chart'
    },
    data: {
        csv: document.getElementById('csv').innerHTML,
        itemDelimiter: '\t',
        complete: function (options) {
            for (let i = 0; i < options.series.length; i++) {
                formatRevenue[i] = arrToAssociative(options.series[i].data);
                options.series[i].data = null;
            }
        }
    },
    xAxis: {
        allowDecimals: false,
        min: startYear,
        max: endYear
    },
    yAxis: {
        title: {
            text: 'Revenue in the U.S.'
        },
        labels: {
            format: '${text} B'
        }
    },
    tooltip: {
        pointFormat: '{series.name} had a revenue of <b>${point.y:,.1f} B</b><br/> in {point.x}'
    },
    plotOptions: {
        area: {
            stacking: 'normal',
            pointStart: startYear,
            pointEnd: endYear,
            marker: {
                enabled: false
            },

            label: {
                style: {
                    transition: 'transform 0.4s, opacity 0.8s'
                }
            }
        }
    },

    series: [{
        label: {
            style: {
                fontSize: '0.8em'
            }
        }
    }, {
        label: {
            style: {
                fontSize: '0.3em'
            }
        }
    }, {
        label: {
            style: {
                fontSize: '0.4em'
            }
        }
    }, {
        label: {
            style: {
                fontSize: '2em'
            }
        }
    }, {
        label: {
            style: {
                fontSize: '0.5em'
            }
        }
    }, {
        label: {
            style: {
                fontSize: '0.5em'
            }
        }
    }]

});

function pause(button) {
    button.title = 'play';
    button.className = 'fa fa-play';
    clearTimeout(chart.sequenceTimer);
    chart.sequenceTimer = undefined;
}

function update() {
    chart.update({
        subtitle: {
            text: 'Year ' + input.value
        }
    },
    false,
    false,
    false);

    const series = chart.series,
        yearIndex = input.value - startYear,
        dataLength = series[0].data.length;

    // If slider moved back in time
    if (yearIndex < dataLength - 1) {
        for (let i = 0; i < series.length; i++) {
            const seriesData = series[i].data.slice(0, yearIndex);
            series[i].setData(seriesData, false);
        }
    }

    // If slider moved forward in time
    if (yearIndex > dataLength - 1) {
        const remainingYears = yearIndex - dataLength;
        for (let i = 0; i < series.length; i++) {
            for (let j = input.value - remainingYears; j < input.value; j++) {
                series[i].addPoint([getRevenue(formatRevenue[i], j)], false);
            }
        }
    }

    // Add current year
    for (let i = 0; i < series.length; i++) {
        series[i].addPoint([getRevenue(formatRevenue[i], input.value)], false);
    }

    chart.redraw();

    input.value = parseInt(input.value, 10) + 1;

    if (input.value > endYear) {
        // Auto-pause
        pause(btn);
    }

}

function play(button) {
    // Reset slider at the end
    if (input.value > endYear) {
        input.value = startYear;
    }
    button.title = 'pause';
    button.className = 'fa fa-pause';
    chart.sequenceTimer = setInterval(function () {
        update();
    }, 700);
}

btn.addEventListener('click', function () {
    if (chart.sequenceTimer) {
        pause(this);
    } else {
        play(this);
    }
});

// Trigger the update on the range bar click.
input.addEventListener('input', function () {
    update();
});
