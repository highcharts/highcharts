Highcharts.setOptions({
    global: {
        useUTC: false
    },
    colors: [
        'rgba( 0,   154, 253, 0.9 )', // bright blue
        'rgba( 253, 99,  0,   0.9 )', // bright orange
        'rgba( 40,  40,  56,  0.9 )', // dark
        'rgba( 253, 0,   154, 0.9 )', // bright pink
        'rgba( 154, 253, 0,   0.9 )', // bright green
        'rgba( 145, 44,  138, 0.9 )', // mid purple
        'rgba( 45,  47,  238, 0.9 )', // mid blue
        'rgba( 177, 69,  0,   0.9 )', // dark orange
        'rgba( 140, 140, 156, 0.9 )', // mid
        'rgba( 238, 46,  47,  0.9 )', // mid red
        'rgba( 44,  145, 51,  0.9 )', // mid green
        'rgba( 103, 16,  192, 0.9 )' // dark purple
    ],
    chart: {
        alignTicks: false,
        type: '',
        margin: [60, 25, 100, 90],
        style: {
            fontFamily: 'Abel,serif'
        },
        events: {
            load: function () {
                this.credits.element.onclick = function () {
                    window.open(
                        'https://stackoverflow.com/users/1011544/jlbriggs?tab=profile'
                    );
                };
            }
        }
    },
    credits: {
        text: 'https://stackoverflow.com/users/1011544/jlbriggs',
        href: 'https://stackoverflow.com/users/1011544/jlbriggs?tab=profile'
    },
    title: {
        text: 'Generate a Histogram',
        align: 'left',
        margin: 10,
        x: 50,
        style: {
            fontWeight: 'bold',
            color: 'rgba(0,0,0,.9)'
        }
    },
    subtitle: {
        text: 'From raw data array',
        align: 'left',
        x: 52
    },
    legend: {
        enabled: true
    },
    plotOptions: {
        area: {
            lineWidth: 1,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 4
            }
        },
        arearange: {
            lineWidth: 1
        },
        areaspline: {
            lineWidth: 1,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 4
            }
        },
        areasplinerange: {
            lineWidth: 1
        },
        boxplot: {
            groupPadding: 0.05,
            pointPadding: 0.05,
            fillColor: 'rgba(255,255,255,.75)'
        },
        bubble: {
            minSize: '0.25%',
            maxSize: '17%'
        },
        column: {
            // stacking:'normal',
            groupPadding: 0.05,
            pointPadding: 0.05
        },
        columnrange: {
            groupPadding: 0.05,
            pointPadding: 0.05
        },
        errorbar: {
            groupPadding: 0.05,
            pointPadding: 0.05,
            showInLegend: true
        },
        line: {
            lineWidth: 1,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 4
            }
        },
        scatter: {
            marker: {
                symbol: 'circle',
                radius: 5
            }
        },
        spline: {
            lineWidth: 1,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 4
            }
        },
        series: {
            shadow: false,
            borderWidth: 0,
            states: {
                hover: {
                    lineWidthPlus: 0
                }
            }
        }
    },
    xAxis: {
        title: {
            text: 'X Axis Title',
            rotation: 0,
            textAlign: 'center',
            style: {
                color: 'rgba(0,0,0,.9)'
            }
        },
        labels: {
            style: {
                color: 'rgba(0,0,0,.9)',
                fontSize: '9px'
            }
        },
        lineWidth: 0.5,
        lineColor: 'rgba(0,0,0,.5)',
        tickWidth: 0.5,
        tickLength: 3,
        tickColor: 'rgba(0,0,0,.75)'
    },
    yAxis: {
        minPadding: 0,
        maxPadding: 0,
        gridLineColor: 'rgba(204,204,204,.25)',
        gridLineWidth: 0.5,
        title: {
            text: 'Y Axis<br/>Title',
            rotation: 0,
            textAlign: 'right',
            style: {
                color: 'rgba(0,0,0,.9)'
            }
        },
        labels: {
            style: {
                color: 'rgba(0,0,0,.9)',
                fontSize: '9px'
            }
        },
        lineWidth: 0.5,
        lineColor: 'rgba(0,0,0,.5)',
        tickWidth: 0.5,
        tickLength: 3,
        tickColor: 'rgba(0,0,0,.75)'
    }
});

const randomData = (points, positive, multiplier) => {
    points = !points ? 1 : points;
    multiplier = !multiplier ? 1 : multiplier;

    function rnd() {
        return ((
            Math.random() +
            Math.random() +
            Math.random() +
            Math.random() +
            Math.random() +
            Math.random()
        ) - 3) / 3;
    }
    var rData = [];
    for (var i = 0; i < points; i++) {
        var val = rnd();
        val = positive === true ? Math.abs(val) : val;
        val = multiplier > 1 ? (val * multiplier) : val;
        rData.push(val);
    }
    return rData;
};

const binData = data => {
    var hData = [], // the output array
        size = data.length, // how many data points
        bins = Math.round(Math.sqrt(size)); // determine how many bins we need
    bins = bins > 50 ? 50 : bins; // adjust if more than 50 cells
    var max = Math.max.apply(null, data), // lowest data value
        min = Math.min.apply(null, data), // highest data value
        range = max - min, // total range of the data
        width = range / bins, // size of the bins
        binBottom, // place holders for the bounds of each bin
        binTop;

    // loop through the number of cells
    for (var i = 0; i < bins; i++) {

        // set the upper and lower limits of the current cell
        binBottom = min + (i * width);
        binTop = binBottom + width;

        // . check for and set the x value of the bin
        if (!hData[i]) {
            hData[i] = [];
            hData[i][0] = binBottom + (width / 2);
        }

        // loop through the data to see if it fits in this bin
        for (var j = 0; j < size; j++) {
            var x = data[j];

            // adjust if it's the first pass
            binBottom = i === 0 && j === 0 ? binBottom -= 1 : binBottom;

            // if it fits in the bin, add it
            if (x > binBottom && x <= binTop) {
                hData[i][1] = !hData[i][1] ? 1 : hData[i][1] += 1;
            }
        }
    }
    hData.forEach((point, i) => {
        if (typeof point[1] === 'undefined') {
            hData[i][1] = null;
        }
    });
    return hData;
};

const numSort = (a, b) => a - b;


// get any percentile from an array
const getPercentile = (data, percentile) => {
    data.sort(numSort);
    var index = (percentile / 100) * data.length;
    var result;
    if (Math.floor(index) === index) {
        result = (data[(index - 1)] + data[index]) / 2;
    } else {
        result = data[Math.floor(index)];
    }
    return result;
};
// get the median absolute deviation
const getMad = data => {
    var median = getPercentile(data, 50);
    var devs = [];
    data.forEach(point => {
        devs.push(Math.abs(point - median));
    });
    var mad = getPercentile(devs, 50);
    var output = {};
    output.median = median;
    output.mad = mad;
    return output;
};

var chart, mad, binnedData, rawData;

rawData = randomData(10000); // generate random normal data points
binnedData = binData(rawData); // bin the data
mad = getMad(rawData); // return the median, and the median absolute deviation

chart = Highcharts.chart('container', {
    chart: {
        type: 'column',
        margin: [100, 25, 100, 50]
    },
    legend: {
        enabled: true
    },
    tooltip: {},
    plotOptions: {
        series: {
            pointPadding: 0,
            groupPadding: 0,
            borderWidth: 0.5,
            borderColor: 'rgba(255,255,255,0.5)'
        }
    },
    xAxis: [{
        title: {
            text: 'Range'
        }

    }, {
        linkedTo: 0,
        opposite: true,
        gridLineWidth: 0.5,
        gridLineColor: 'rgba(0,0,0,0.25)',
        gridZIndex: 8,
        tickPositions: [
            mad.median - (mad.mad * 3),
            mad.median - (mad.mad * 2),
            mad.median - mad.mad,
            mad.median,
            mad.median + mad.mad,
            mad.median + (mad.mad * 2),
            mad.median + (mad.mad * 3)
        ],
        title: {
            text: 'Median and MAD'
        },
        labels: {
            style: {
                color: 'rgba(0,0,0,1)',
                fomntWeight: 'bold'
            },
            format: '{value:.2f}'
        }
    }],
    yAxis: {
        title: {
            text: 'Frequency'
        },
        min: 0
    }
});

// add the data series to the chart
chart.addSeries({
    name: 'Distribution',
    data: binnedData
});

// add MAD plotbands
/*
chart.xAxis[0].addPlotBand({
  from: mad.median - (mad.mad * 3),
  to: mad.median + (mad.mad * 3),
  color: 'rgba(255,255,255,0.25)',
  zIndex: 5
});
chart.xAxis[0].addPlotBand({
  from: mad.median - (mad.mad * 2),
  to: mad.median + (mad.mad * 2),
  color: 'rgba(255,255,255,0.25)',
  zIndex: 6
});
chart.xAxis[0].addPlotBand({
  from: mad.median - mad.mad,
  to: mad.median + mad.mad,
  color: 'rgba(255,255,255,0.25)',
  zIndex: 7
});
*/
// add Median plotline
chart.xAxis[0].addPlotLine({
    value: mad.median,
    width: 1,
    color: 'rgba(0,0,0,0.5)',
    zIndex: 8
});
