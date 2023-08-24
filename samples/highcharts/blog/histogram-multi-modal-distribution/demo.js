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
        // borderRadius:10,
        // borderWidth:1,
        // borderColor:'rgba(156,156,156,.25)',
        // backgroundColor:'rgba(204,204,204,.25)',
        // plotBackgroundColor:'rgba(255,255,255,1)',
        style: {
            fontFamily: 'Abel,serif'
        }
    },
    title: {
        text: 'Generate a Histogram',
        align: 'left',
        margin: 10,
        x: 25,
        style: {
            fontWeight: 'bold',
            color: 'rgba(0,0,0,.9)'
        }
    },
    subtitle: {
        text: 'From raw data array',
        align: 'left',
        x: 30
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
            text: 'Y Axis<br />Title',
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

const rawData = [
    0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1,
    0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4,
    0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3,
    0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2, 1.4, 1.5, 1.5, 1.3, 1.5,
    1.3, 1.6, 1, 1.3, 1.4, 1, 1.5, 1, 1.4, 1.3, 1.4, 1.5, 1, 1.5, 1.1,
    1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1, 1.1, 1, 1.2, 1.6,
    1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1, 1.3, 1.2, 1.3,
    1.3, 1.1, 1.3, 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5,
    2, 1.9, 2.1, 2, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2, 2, 1.8,
    2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2, 2.2, 1.5, 1.4, 2.3, 2.4,
    1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2, 2.3, 1.8
];

const binnedData = binData(rawData);

const chart = Highcharts.chart('container', {
    chart: {
        type: 'column',
        margin: [60, 10, 40, 40]
    },
    title: {
        text: 'Multi-Modal Distribution',
        x: 25
    },
    subtitle: {
        text: 'Fisher\'s Iris Data: Petal Width',
        x: 25
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    tooltip: {},
    plotOptions: {
        series: {
            pointPadding: 0,
            groupPadding: 0,
            borderWidth: 0.5,
            borderColor: 'rgba(255,255,255,0.5)',
            color: Highcharts.getOptions().colors[1]
        }
    },
    xAxis: {
        title: {
            text: 'Petal Width (cm)'
        }
    },
    yAxis: {
        title: {
            text: ''
        },
        maxPadding: 0,
        endOnTick: false
    }
});
chart.addSeries({
    name: 'Distribution',
    data: binnedData
});


//-------------------------------------------------------
function binData(data) {

    const hData = [], // the output array
        size = data.length; // how many data points

    let bins = Math.round(Math.sqrt(size)); // determine how many bins we need

    bins = bins > 50 ? 50 : bins; // adjust if more than 50 cells

    const max = Math.max.apply(null, data), // lowest data value
        min = Math.min.apply(null, data), // highest data value
        range = max - min, // total range of the data
        width = range / bins; // size of the bins

    let binBottom, // place holders for the bounds of each bin
        binTop;

    // loop through the number of cells
    for (let i = 0; i < bins; i++) {

        // set the upper and lower limits of the current cell
        binBottom = min + (i * width);
        binTop = binBottom + width;

        // check for and set the x value of the bin
        if (!hData[i]) {
            hData[i] = [];
            hData[i][0] = binBottom + (width / 2);
        }

        // loop through the data to see if it fits in this bin
        for (let j = 0; j < size; j++) {
            const x = data[j];

            // adjust if it's the first pass
            binBottom = i === 0 && j === 0 ? binBottom -= 1 : binBottom;

            // if it fits in the bin, add it
            if (x > binBottom && x <= binTop) {
                hData[i][1] = !hData[i][1] ? 1 : hData[i][1] += 1;
            }
        }
    }
    hData.forEach(function (point, i) {
        if (typeof point[1] === 'undefined') {
            hData[i][1] = 0;
        }
    });
    return hData;
}
