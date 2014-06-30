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
        noop = function () {},
        each = H.each;

    function Area(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.centerX = this.x + (this.width/2);
        this.centerY = this.y + (this.height/2);
        this.totalArea = this.width * this.height;
        this.totalValue = 0;
        this._plotW = this.width;
        this._plotH = this.height;
        this._plotX = this.x;
        this._plotY = this.y;
        // Calculates plotting width for a child point
        this.plotW = function (total, d) {
            if (d == 0) {
                val = total/this._plotH;
                this._plotW -= val;
            } else {
                val = this._plotW;
            }
            return val;
        }
        // Calculates plotting height for a child point
        this.plotH = function (total, d) {
            if (d == 1) {
                val = total/this._plotW;
                this._plotH -= val;
            } else {
                val = this._plotH;
            }
            return val;
        }
        // Calculates x value for a child point
        this.plotX = function (w, d) {
            val = this._plotX;
            if (d == 0) {
                this._plotX += w;
            }
            return val;
        }
        // Calculates y value for a child point
        this.plotY = function (h, d) {
            val = this._plotY;
            if (d == 1) {
                this._plotY += h;
            }
            return val;
        }
    }

    // Compute sum of values in array of Points
    function sumPointsValues(points) {
        var totalValue = 0;
        each(points, function (point) {
            totalValue += point.value
        });    
        return totalValue;
    }

    function getSeriesArea(series) {
        var numSeries = series.chart.series.length,
            w = series.chart.plotWidth/numSeries,
            x = w * series._i,
            y = 0,
            h = series.chart.plotHeight;
        return seriesArea = new Area(x, y, w, h);
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
                width: point.value / totalValue * point.series.chart.plotWidth,
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
            verticalAlign: 'middle',
            formatter: function () { // #2945
                return this.point.value;
            },
        },
        layoutAlgorithm: 'sliceAndDice'
    });
    
    // Stolen from heatmap
    var colorSeriesMixin = {
        // mapping between SVG attributes and the corresponding options
        pointAttrToOptions: { 
            stroke: 'borderColor',
            'stroke-width': 'borderWidth',
            fill: 'color',
            dashstyle: 'dashStyle'
        },
        pointArrayMap: ['value'],
        axisTypes: ['xAxis', 'yAxis', 'colorAxis'],
        optionalAxis: 'colorAxis',
        getSymbol: noop,
        parallelArrays: ['x', 'y', 'value'],
        colorKey: 'colorValue', // Point color option key
        translateColors: seriesTypes.heatmap.prototype.translateColors
    }

    // The Treemap series type
    seriesTypes.treemap = extendClass(seriesTypes.scatter, merge(colorSeriesMixin, {
        type: 'treemap',
        trackerGroups: ['group', 'dataLabelsGroup'],
        handleLayout: function () {
            seriesArea = getSeriesArea(this);
            seriesArea.totalValue = sumPointsValues(this.points);
            direction = 0;
            layoutAlgorithm = this[this.options.layoutAlgorithm];

            each(this.points, function (point) {
                var pointArea = layoutAlgorithm(seriesArea, point.value, direction);                
                
                console.log(pointArea)

                // Set point values
                point.shapeType = 'rect';
                point.shapeArgs = {
                    x: pointArea.x,
                    y: pointArea.y,
                    width: pointArea.width,
                    height: pointArea.height
                };
                point.plotX = pointArea.centerX;
                point.plotY = pointArea.centerY;
                direction = 1 - direction;
            });            
        },
        stripes: function () {

        },
        sliceAndDice: function (parent, value, direction) {
            pointTotal = parent.totalArea * (value / parent.totalValue);
            pointW = parent.plotW(pointTotal, direction);
            pointH = parent.plotH(pointTotal, direction);
            pointX = parent.plotX(pointW, direction);
            pointY = parent.plotY(pointH, direction);
            pointArea = new Area(pointX, pointY, pointW, pointH);
            return pointArea;
        },
        translate: function () {
            var series = this;

            H.Series.prototype.translate.call(series);
            series.handleLayout();

            series.translateColors();

            // Make sure colors are updated on colorAxis update (#2893)
            if (series.chart.hasRendered) {
                each(series.points, function (point) {
                    point.shapeArgs.fill = point.color;
                });
            }
        },
        drawPoints: seriesTypes.column.prototype.drawPoints,
        drawLegendSymbol: H.LegendSymbolMixin.drawRectangle,
    }));
}(Highcharts));
