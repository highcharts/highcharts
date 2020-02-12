// Table row definitions. The table is built from this data.
var tableRows = [{
    trackTitle: 'Education',
    chartData: [178, 184, 167, 183, 160, 138]
}, {
    trackTitle: 'Employment & Workplace',
    chartData: [87, 68, 99, 105, 91, 137]
}, {
    trackTitle: 'Entertainment & Leisure',
    chartData: [24, 32, 30, 25, 25, 28]
}, {
    trackTitle: 'Independent Living',
    chartData: [51, 57, 67, 76, 57, 107]
}, {
    trackTitle: 'Law & Policy',
    chartData: [37, 42, 53, 45, 44, 54]
}, {
    trackTitle: 'Transportation',
    chartData: [5, 6, 10, 8, 4, 4]
}];


// Default options for the sparkline charts
var defaultChartOptions = {
    chart: {
        type: 'line',
        backgroundColor: 'transparent'
    },

    accessibility: {
        landmarkVerbosity: 'disabled',
        point: {
            valueSuffix: ' sessions'
        },
        screenReaderSection: {
            beforeChartFormat: '<div>{chartLongdesc}</div><div>{playAsSoundButton}</div>',
            afterChartFormat: ''
        }
    },

    sonification: {
        duration: 1700
    },

    title: {
        text: null
    },

    legend: {
        enabled: false
    },

    exporting: {
        enabled: false
    },

    credits: {
        enabled: false
    },

    plotOptions: {
        series: {
            pointStart: 2015,
            marker: {
                enabled: false
            }
        }
    },

    tooltip: {
        outside: true,
        useHTML: true,
        hideDelay: 100,
        backgroundColor: 'rgba(250, 250, 250, 0.95)',
        formatter: function () {
            var point = this.point;
            var chart = this.series.chart;
            var longdescText = chart.accessibility.components.infoRegions.getLongdescText() || 'Sessions';
            var longdescFormat = '<span style="font-size: 10px">' + longdescText + '</span><br/>';
            var pointFormat = '<div style="margin-top:5px;"><span style="color:' + point.color +
                '">●</span> ' + point.x + ': <b>' + point.y + '</b></div>';

            return longdescFormat + pointFormat;
        },
        positioner: function () {
            var chart = this.chart;
            var chartPosition = chart.pointer.getChartPosition();
            var tooltipBBox = this.label && this.label.getBBox() || { width: 100, height: 100 };
            var tooltipXOffset = (chart.plotWidth - tooltipBBox.width) / 2;
            var tooltipYOffset = 12;
            var x = chartPosition.left + tooltipXOffset;
            var y = chartPosition.top - tooltipBBox.height - tooltipYOffset;
            return { x: x, y: y };
        },
        shape: 'square'
    },

    xAxis: {
        type: 'category',
        visible: false
    },

    yAxis: {
        visible: false
    }
};


// Get string with basic description of chart data.
function describeChart(data) {
    var firstPoint = data[0];
    var lastPoint = data[data.length - 1];
    var minPoint = Math.min.apply(null, data);
    var maxPoint = Math.max.apply(null, data);
    var slopeText = firstPoint < lastPoint ? 'increased' : 'decreased';

    return 'Chart ' + slopeText + ' from 2015 with ' + firstPoint +
        ' sessions to 2020 with ' + lastPoint + ' sessions, with values between ' +
        minPoint + ' and ' + maxPoint + '.';
}


// Add automated descriptions to the data
tableRows.forEach(function (rowDefinition) {
    rowDefinition.chartDescription = describeChart(rowDefinition.chartData);
});


// Add a cell with the track title to a table row element
function addTrackCell(tableRowElement, rowDefinition) {
    var cell = document.createElement('th');
    cell.setAttribute('scope', 'row');
    cell.textContent = rowDefinition.trackTitle;
    tableRowElement.appendChild(cell);
}


// Add a cell with the average data to a table row element
function addAverageCell(tableRowElement, rowDefinition) {
    var cell = document.createElement('td');
    var getArrayAverage = arr => arr.reduce((acc, cur) => acc + cur, 0) / arr.length;

    cell.textContent = Math.round(getArrayAverage(rowDefinition.chartData)) + ' sessions';
    tableRowElement.appendChild(cell);
}


// Add a sparkline cell to a table row element
function addSparklineCell(tableRowElement, rowDefinition) {
    var cell = document.createElement('td');
    var sparklineContainer = document.createElement('div');

    sparklineContainer.className = 'sparkline-container';
    cell.appendChild(sparklineContainer);
    tableRowElement.appendChild(cell);

    Highcharts.chart(sparklineContainer, Highcharts.merge(defaultChartOptions, {
        accessibility: {
            description: rowDefinition.chartDescription
        },
        series: [{
            name: 'Sessions',
            data: rowDefinition.chartData
        }]
    }));
}


// Populate the table
var tableBody = document.getElementById('tbody');
tableRows.forEach(function (rowDefinition) {
    var tableRowElement = document.createElement('tr');

    tableBody.appendChild(tableRowElement);

    addTrackCell(tableRowElement, rowDefinition);
    addAverageCell(tableRowElement, rowDefinition);
    addSparklineCell(tableRowElement, rowDefinition);
});
