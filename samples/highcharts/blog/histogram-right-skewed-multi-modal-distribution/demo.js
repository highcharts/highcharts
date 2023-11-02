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

const rawData = [42, 51, 59, 64, 76, 93, 106, 125, 149, 171, 199, 205, 40,
    49, 58, 72, 84, 103, 122, 138, 162, 187, 209, 215, 43, 39, 55, 67,
    84, 99, 115, 138, 163, 187, 198, 202, 42, 49, 56, 67, 74, 87, 102,
    108, 136, 154, 160, 157, 41, 42, 48, 60, 79, 106, 141, 164, 197,
    199, 220, 223, 41, 49, 59, 74, 97, 124, 141, 148, 155, 160, 160,
    157, 41, 49, 57, 71, 89, 112, 146, 174, 218, 250, 288, 305, 42,
    50, 61, 71, 84, 93, 110, 116, 126, 134, 125, 42, 51, 59, 68, 85,
    96, 90, 92, 93, 100, 100, 98, 41, 44, 52, 63, 74, 81, 89, 96,
    101, 112, 120, 124, 43, 51, 63, 84, 112, 139, 168, 177, 182,
    184, 181, 175, 41, 49, 56, 62, 72, 88, 119, 135, 162, 185,
    195, 205, 41, 48, 53, 60, 65, 67, 71, 70, 71, 81, 91, 96, 41,
    49, 62, 79, 101, 128, 164, 192, 227, 248, 259, 266, 41, 49,
    56, 64, 68, 68, 67, 68, 41, 45, 49, 51, 57, 51, 54, 42, 51,
    61, 72, 83, 89, 98, 103, 113, 123, 133, 142, 39, 35, 43, 48,
    55, 62, 65, 71, 82, 88, 106, 120, 144, 157, 41, 47, 54, 58,
    65, 73, 77, 89, 98, 107, 115, 117, 40, 50, 62, 86, 125,
    163, 217, 240, 275, 307, 318, 331, 41, 55, 64, 77, 90, 95,
    108, 111, 131, 148, 164, 167, 43, 52, 61, 73, 90, 103,
    127, 135, 145, 163, 170, 175, 42, 52, 58, 74, 66, 68,
    70, 71, 72, 72, 76, 74, 40, 49, 62, 78, 102, 124, 146,
    164, 197, 231, 259, 265, 42, 48, 57, 74, 93, 114, 136,
    147, 169, 205, 236, 251, 39, 46, 58, 73, 87, 100,
    115, 123, 144, 163, 185, 192, 39, 46, 58, 73, 92,
    114, 145, 156, 184, 207, 212, 233, 39, 48, 59, 74,
    87, 106, 134, 150, 187, 230, 279, 309, 42, 48, 59,
    72, 85, 98, 115, 122, 143, 151, 157, 150, 42, 53,
    62, 73, 85, 102, 123, 138, 170, 204, 235, 256,
    41, 49, 65, 82, 107, 129, 159, 179, 221, 263,
    291, 305, 39, 50, 63, 77, 96, 111, 137, 144,
    151, 146, 156, 147, 41, 49, 63, 85, 107, 134, 164,
    186, 235, 294, 327, 341, 41, 53, 64, 87, 123, 158,
    201, 238, 287, 332, 361, 373, 39, 48, 61, 76, 98,
    116, 145, 166, 198, 227, 225, 220, 41, 48, 56, 68,
    80, 83, 103, 112, 135, 157, 169, 178, 41, 49, 61,
    74, 98, 109, 128, 154, 192, 232, 280, 290, 42, 50,
    61, 78, 89, 109, 130, 146, 170, 214, 250, 272, 41,
    55, 66, 79, 101, 120, 154, 182, 215, 262, 295, 321,
    42, 51, 66, 85, 103, 124, 155, 153, 175, 184, 199,
    204, 42, 49, 63, 84, 103, 126, 160, 174, 204, 234,
    269, 281, 42, 55, 69, 96, 131, 157, 184, 188, 197,
    198, 199, 200, 42, 51, 65, 86, 103, 118, 127, 138,
    145, 146, 41, 50, 61, 78, 98, 117, 135, 141, 147,
    174, 197, 196, 40, 52, 62, 82, 101, 120, 144, 156,
    173, 210, 231, 238, 41, 53, 66, 79, 100, 123, 148,
    157, 168, 185, 210, 205, 39, 50, 62, 80, 104, 125,
    154, 170, 222, 261, 303, 322, 40, 53, 64, 85, 108,
    128, 152, 166, 184, 203, 233, 237, 41, 54, 67, 84,
    105, 122, 155, 175, 205, 234, 264, 264];

const binnedData = binData(rawData);

const chart = Highcharts.chart('container', {
    chart: {
        type: 'column',
        margin: [60, 10, 40, 40]
    },
    title: {
        text: 'Right-Skewed, Multi-Modal Distribution',
        x: 25
    },
    subtitle: {
        text: 'Weights of Chicks on Various Diets',
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
            text: 'Weight'
        }
    },
    yAxis: {
        title: {
            text: ''
        },
        min: 0
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
