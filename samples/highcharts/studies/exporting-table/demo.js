/**
 * Create the data table
 */
Highcharts.drawTable = function () {

    // user options
    var tableTop = 310,
        colWidth = 100,
        tableLeft = 20,
        rowHeight = 20,
        cellPadding = 2.5,
        valueDecimals = 1,
        valueSuffix = ' °C';

    // internal variables
    var chart = this,
        series = chart.series,
        renderer = chart.renderer,
        cellLeft = tableLeft;

    // draw category labels
    chart.xAxis[0].categories.forEach(function (name, i) {
        renderer.text(
            name,
            cellLeft + cellPadding,
            tableTop + (i + 2) * rowHeight - cellPadding
        )
        .css({
            fontWeight: 'bold'
        })
        .add();
    });

    series.forEach(function (serie, i) {
        cellLeft += colWidth;

        // Apply the cell text
        renderer.text(
                serie.name,
                cellLeft - cellPadding + colWidth,
                tableTop + rowHeight - cellPadding
            )
            .attr({
                align: 'right'
            })
            .css({
                fontWeight: 'bold'
            })
            .add();

        serie.data.forEach(function (point, row) {

            // Apply the cell text
            renderer.text(
                    Highcharts.numberFormat(point.y, valueDecimals) + valueSuffix,
                    cellLeft + colWidth - cellPadding,
                    tableTop + (row + 2) * rowHeight - cellPadding
                )
                .attr({
                    align: 'right'
                })
                .add();

            // horizontal lines
            if (row === 0) {
                Highcharts.tableLine( // top
                    renderer,
                    tableLeft,
                    tableTop + cellPadding,
                    cellLeft + colWidth,
                    tableTop + cellPadding
                );
                Highcharts.tableLine( // bottom
                    renderer,
                    tableLeft,
                    tableTop + (serie.data.length + 1) * rowHeight + cellPadding,
                    cellLeft + colWidth,
                    tableTop + (serie.data.length + 1) * rowHeight + cellPadding
                );
            }
            // horizontal line
            Highcharts.tableLine(
                renderer,
                tableLeft,
                tableTop + row * rowHeight + rowHeight + cellPadding,
                cellLeft + colWidth,
                tableTop + row * rowHeight + rowHeight + cellPadding
            );

        });

        // vertical lines
        if (i === 0) { // left table border
            Highcharts.tableLine(
                renderer,
                tableLeft,
                tableTop + cellPadding,
                tableLeft,
                tableTop + (serie.data.length + 1) * rowHeight + cellPadding
            );
        }

        Highcharts.tableLine(
            renderer,
            cellLeft,
            tableTop + cellPadding,
            cellLeft,
            tableTop + (serie.data.length + 1) * rowHeight + cellPadding
        );

        if (i === series.length - 1) { // right table border

            Highcharts.tableLine(
                renderer,
                cellLeft + colWidth,
                tableTop + cellPadding,
                cellLeft + colWidth,
                tableTop + (serie.data.length + 1) * rowHeight + cellPadding
            );
        }

    });


};

/**
 * Draw a single line in the table
 */
Highcharts.tableLine = function (renderer, x1, y1, x2, y2) {
    renderer.path(['M', x1, y1, 'L', x2, y2])
        .attr({
            'stroke': 'silver',
            'stroke-width': 1
        })
        .add();
};

/**
 * Create the chart
 */
window.chart = Highcharts.chart('container', {

    chart: {
        events: {
            load: Highcharts.drawTable
        },
        borderWidth: 2,
        width: 600,
        height: 600
    },

    title: {
        text: 'Average monthly temperatures'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: {
        title: {
            text: 'Temperature (°C)'
        }
    },

    legend: {
        y: -300
    },

    series: [{
        name: 'Tokyo',
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
    }, {
        name: 'New York',
        data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
    }, {
        name: 'Berlin',
        data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
    }, {
        name: 'London',
        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
    }]
});

