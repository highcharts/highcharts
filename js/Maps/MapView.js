/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
var MapView = /** @class */ (function () {
    function MapView(chart) {
        this.chart = chart;
        this.center = [0, 0];
        this.zoom = 0;
    }
    MapView.prototype.fitToBounds = function (bounds) {
        var _a = this.chart, plotWidth = _a.plotWidth, plotHeight = _a.plotHeight;
        // 256 is the magic number where a world tile is rendered to a 256/256
        // px square.
        var scaleToPlotArea = Math.max((bounds.e - bounds.w) / (plotWidth / 256), (bounds.s - bounds.n) / (plotHeight / 256));
        this.center = [(bounds.s + bounds.n) / 2, (bounds.e + bounds.w) / 2];
        this.zoom = (Math.log(360 / scaleToPlotArea) / Math.log(2));
    };
    MapView.prototype.getDataBounds = function () {
        var bounds = {
            n: Number.MAX_VALUE,
            e: -Number.MAX_VALUE,
            s: -Number.MAX_VALUE,
            w: Number.MAX_VALUE
        };
        var hasBounds = false;
        this.chart.series.forEach(function (s) {
            if (s.useMapGeometry) {
                bounds.n = Math.min(bounds.n, s.minY);
                bounds.e = Math.max(bounds.e, s.maxX);
                bounds.s = Math.max(bounds.s, s.maxY);
                bounds.w = Math.min(bounds.w, s.minX);
                hasBounds = true;
            }
        });
        return hasBounds ? bounds : void 0;
    };
    MapView.prototype.redraw = function () {
        this.chart.series.forEach(function (s) {
            if (s.useMapGeometry) {
                s.isDirty = true;
            }
        });
        this.chart.redraw();
    };
    MapView.prototype.setView = function (center, zoom) {
        if (center) {
            this.center = center;
        }
        if (typeof zoom === 'number') {
            this.zoom = zoom;
        }
        this.redraw();
    };
    MapView.prototype.zoomBy = function (howMuch, coords, chartCoords) {
        var chart = this.chart;
        var _a = coords || [], lat = _a[0], lng = _a[1];
        if (typeof howMuch === 'number') {
            var zoom = this.zoom + howMuch;
            var center = void 0;
            // Keep chartX and chartY stationary - convert to lat and lng
            if (chartCoords) {
                var chartX = chartCoords[0], chartY = chartCoords[1];
                var transA = (256 / 360) * Math.pow(2, this.zoom);
                var offsetX = chartX - chart.plotLeft - chart.plotWidth / 2;
                var offsetY = chartY - chart.plotTop - chart.plotHeight / 2;
                lat = this.center[0] + offsetY / transA;
                lng = this.center[1] + offsetX / transA;
            }
            // Keep lat and lng stationary by adjusting the center
            if (typeof lat === 'number' && typeof lng === 'number') {
                var scale = 1 - Math.pow(2, this.zoom) / Math.pow(2, zoom);
                center = this.center;
                var offsetLat = center[0] - lat;
                var offsetLng = center[1] - lng;
                center[0] -= offsetLat * scale;
                center[1] -= offsetLng * scale;
            }
            this.setView(center, zoom);
            // Undefined howMuch => reset zoom
        }
        else {
            var bounds = this.getDataBounds();
            if (bounds) {
                this.fitToBounds(bounds);
                this.redraw();
            }
        }
    };
    return MapView;
}());
export default MapView;
