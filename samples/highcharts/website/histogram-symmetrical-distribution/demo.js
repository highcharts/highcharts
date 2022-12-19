var chart,
    binnedData,
    rawData = [3.5, 3, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3,
        3, 4, 4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3, 3.4, 3.5,
        3.4, 3.2, 3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3, 3.4, 3.5, 2.3,
        3.2, 3.5, 3.8, 3, 3.8, 3.2, 3.7, 3.3, 3.2, 3.2, 3.1, 2.3, 2.8, 2.8,
        3.3, 2.4, 2.9, 2.7, 2, 3, 2.2, 2.9, 2.9, 3.1, 3, 2.7, 2.2, 2.5,
        3.2, 2.8, 2.5, 2.8, 2.9, 3, 2.8, 3, 2.9, 2.6, 2.4, 2.4, 2.7, 2.7,
        3, 3.4, 3.1, 2.3, 3, 2.5, 2.6, 3, 2.6, 2.3, 2.7, 3, 2.9, 2.9, 2.5,
        2.8, 3.3, 2.7, 3, 2.9, 3, 3, 2.5, 2.9, 2.5, 3.6, 3.2, 2.7, 3, 2.5,
        2.8, 3.2, 3, 3.8, 2.6, 2.2, 3.2, 2.8, 2.8, 2.7, 3.3, 3.2, 2.8, 3,
        2.8, 3, 2.8, 3.8, 2.8, 2.8, 2.6, 3, 3.4, 3.1, 3, 3.1, 3.1, 3.1,
        2.7, 3.2, 3.3, 3, 2.5, 3, 3.4, 3];
binnedData = binData(rawData);

Highcharts.chart('container', {
    chart: {
        type: 'column',
        margin: [60, 10, 40, 40]
    },
    title: {
        text: 'Symmetrical Distribution',
        x: 25
    },
    subtitle: {
        text: 'Fisher\'s Iris Data: Sepal Width',
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
            text: 'Sepal Width (cm)'
        }
    },
    yAxis: {
        title: {
            text: ''
        }
    }
});
chart = $('#container').highcharts();
chart.addSeries({
    name: 'Distribution',
    data: binnedData
});


//-------------------------------------------------------
function binData(data) {

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

        // check for and set the x value of the bin
        if (!hData[i]) {
            hData[i] = [];
            hData[i][0] = binBottom + (width / 2);
        }

        // loop through the data to see if it fits in this bin
        for (var j = 0; j < size; j++) {
            var x = data[j];

            // adjust if it's the first pass
            binBottom = i === 0 && j === 0 ? binBottom -= 1 :
                binBottom;

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
