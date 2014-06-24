/**
 * @license @product.name@ JS v@product.version@ (@product.date@)
 * Plugin for displaying a message when there is no data visible in chart.
 *
 * (c) 2010-2014 Highsoft AS
 * Authors: Jon Arild Nygard / Oystein Moseng
 *
 * License: www.highcharts.com/license
 */

(function (H) { // docs

    var seriesTypes = H.seriesTypes,
        merge = H.merge,
        extendClass = H.extendClass,
        defaultOptions = H.getOptions(),
        plotOptions = defaultOptions.plotOptions,
        scatterOptions = plotOptions.scatter,
        each = H.each;

    // Compute sum of values in array of Points
    function sumPointsValues(points) {
        var totalValue = 0;
        each(points, function (point) {
            totalValue += point.y
        });    
        return totalValue;
    }
    
    // Lay out tiles as stripes in one dimension
    function stripes(points) {         
        var startX = 0,
            totalValue = sumPointsValues(points);
        
        each(points, function (point) {
            point.shapeType = 'rect';
            point.shapeArgs = {
                x: startX,
                y: 0,
                width: point.y / totalValue * point.series.chart.plotWidth,
                height: point.series.chart.plotHeight
            };
            point.plotX = point.shapeArgs.x + point.shapeArgs.width / 2;
            point.plotY = point.shapeArgs.height / 2;            
            startX += point.shapeArgs.width;
        });
        return points;
    }

    // Define default options
    plotOptions.treemap = merge(plotOptions.scatter, {
        marker: {
            lineColor: "#000",
            lineWidth: 0.5,
            radius: 0
        },
        dataLabels:{
            verticalAlign: 'middle'
        },
        layoutAlgorithm: 'stripes'
    });

    // The Treemap series type
    seriesTypes.treemap = extendClass(seriesTypes.scatter, {
        type: 'treemap',

        translate: function () {
            var series = this,
                options = series.options,
                xAxis = series.xAxis,
                yAxis = series.yAxis;

            H.Series.prototype.translate.call(this);
            if(options.layoutAlgorithm === 'stripes')
                series.points = stripes(series.points);
        },

        drawPoints: seriesTypes.column.prototype.drawPoints

    });
}(Highcharts));
