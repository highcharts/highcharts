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

    function sliceAndDice(series) {
        //console.log(series);
        var startX = 0,
            startY = 0,
            restW = series.chart.plotWidth,
            restH = series.chart.plotHeight,
            plotTotal = restW*restH,
            totalValue = sumPointsValues(series.points),
            direction = 0;
        each(series.points, function (point) {
            pointTotal = plotTotal * (point.y / totalValue);
            if (direction) {
                plotW = restW;
                plotH = pointTotal/restW;
                restH -= plotH;
            } else {
                plotW = pointTotal/restH;
                plotH = restH;
                restW -= plotW;
            }
            point.shapeType = 'rect';
            point.shapeArgs = {
                x: startX,
                y: startY,
                width: plotW,
                height: plotH
            };
            point.plotX = point.shapeArgs.x + point.shapeArgs.width / 2;
            point.plotY = point.shapeArgs.y + point.shapeArgs.height / 2;            
            if (direction) {
                startY += point.shapeArgs.height;
            } else {
                startX += point.shapeArgs.width;
            }
            direction = 1-direction;
        });
        return series.points;
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
        layoutAlgorithm: 'sliceAndDice'
    });

    // The Treemap series type
    seriesTypes.treemap = extendClass(seriesTypes.scatter, {
        type: 'treemap',
        trackerGroups: ['group', 'dataLabelsGroup'],

        translate: function () {
            var series = this,
                options = series.options,
                xAxis = series.xAxis,
                yAxis = series.yAxis;

            H.Series.prototype.translate.call(this);
            if(options.layoutAlgorithm === 'stripes') {
                series.points = stripes(series.points);
            } else if (options.layoutAlgorithm === 'sliceAndDice') {
                series.points = sliceAndDice(series);
            }
        },

        drawPoints: seriesTypes.column.prototype.drawPoints

    });
}(Highcharts));
