// Table row definitions. The table is built from this data.
const tableRows = [{
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
const defaultChartOptions = {
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
            beforeChartFormat: '<h5>{chartTitle}</h5>' +
                    '<div>{chartLongdesc}</div>' +
                    '<div>{playAsSoundButton}</div>',
            afterChartFormat: ''
        }
    },

    sonification: {
        enabled: true,
        duration: 1700
    },

    // Title is hidden, but exists for better accessibility, as
    // the title value is picked up by the accessibility module
    // and gives more context to screen reader users.
    title: {
        floating: true,
        style: {
            display: 'none'
        }
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
        style: {
            width: '200px'
        },
        formatter: function () {
            const point = this.point;
            const chart = this.series.chart;
            const longdescText = chart.accessibility.components.infoRegions.getLongdescText() || 'Sessions';
            const longdescFormat = '<span style="font-size: 12px">' + longdescText + '</span><br/>';
            const pointFormat = '<div style="margin-top:10px;"><span style="color:' + point.color +
                '">●</span> ' + point.x + ': <b>' + point.y + '</b></div>';

            return longdescFormat + pointFormat;
        },
        positioner: function () {
            const chart = this.chart;
            const chartPosition = chart.pointer.getChartPosition();
            const tooltipBBox = this.label &&
             this.label.getBBox() || { width: 100, height: 100 };
            const tooltipXOffset = (chart.plotWidth - tooltipBBox.width) / 2;
            const tooltipYOffset = 12;
            const x = chartPosition.left + tooltipXOffset;
            const y = chartPosition.top - tooltipBBox.height - tooltipYOffset;
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
    const firstPoint = data[0];
    const lastPoint = data[data.length - 1];
    const minPoint = Math.min.apply(null, data);
    const maxPoint = Math.max.apply(null, data);
    const slopeText = firstPoint < lastPoint ? 'increased' : 'decreased';

    return 'Sessions ' + slopeText + ' overall from 2015 to 2020, starting at ' + firstPoint +
        ' and ending at ' + lastPoint + '. Values ranged between ' +
        minPoint + ' and ' + maxPoint + '.';
}


// Add automated descriptions to the data
tableRows.forEach(function (rowDefinition) {
    rowDefinition.chartDescription = describeChart(rowDefinition.chartData);
});


// Add a cell with the track title to a table row element
function addTrackCell(tableRowElement, rowDefinition) {
    const cell = document.createElement('th');
    cell.setAttribute('scope', 'row');
    cell.textContent = rowDefinition.trackTitle;
    tableRowElement.appendChild(cell);
}


// Add a cell with the average data to a table row element
function addAverageCell(tableRowElement, rowDefinition) {
    const cell = document.createElement('td');
    const getArrayAverage =
        arr => arr.reduce((acc, cur) => acc + cur, 0) / arr.length;

    cell.textContent = Math.round(getArrayAverage(rowDefinition.chartData)) + ' sessions';
    tableRowElement.appendChild(cell);
}


// Add a sparkline cell to a table row element
function addSparklineCell(tableRowElement, rowDefinition) {
    const cell = document.createElement('td');
    const sparklineContainer = document.createElement('div');

    sparklineContainer.className = 'sparkline-container';
    cell.appendChild(sparklineContainer);
    tableRowElement.appendChild(cell);

    Highcharts.chart(sparklineContainer, Highcharts.merge(defaultChartOptions, {
        title: {
            text: rowDefinition.trackTitle + ' Chart'
        },
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
const tableBody = document.getElementById('tbody');
tableRows.forEach(function (rowDefinition) {
    const tableRowElement = document.createElement('tr');

    tableBody.appendChild(tableRowElement);

    addTrackCell(tableRowElement, rowDefinition);
    addAverageCell(tableRowElement, rowDefinition);
    addSparklineCell(tableRowElement, rowDefinition);
});
