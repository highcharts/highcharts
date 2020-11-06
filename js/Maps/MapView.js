import U from '../Core/Utilities.js';
var isNumber = U.isNumber;
var MapView = /** @class */ (function () {
    function MapView(chart) {
        this.chart = chart;
        this.center = [0, 0];
        this.zoom = 0;
    }
    MapView.prototype.fitToBounds = function (bounds, redraw, animation) {
        if (redraw === void 0) { redraw = true; }
        var _a = this.chart, plotWidth = _a.plotWidth, plotHeight = _a.plotHeight;
        // 256 is the magic number where a world tile is rendered to a 256/256
        // px square.
        var scaleToPlotArea = Math.max((bounds.e - bounds.w) / (plotWidth / 256), (bounds.s - bounds.n) / (plotHeight / 256));
        this.setView([(bounds.s + bounds.n) / 2, (bounds.e + bounds.w) / 2], (Math.log(360 / scaleToPlotArea) / Math.log(2)), redraw, animation);
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
            if (s.useMapGeometry &&
                isNumber(s.minY) &&
                isNumber(s.maxX) &&
                isNumber(s.maxY) &&
                isNumber(s.minX)) {
                bounds.n = Math.min(bounds.n, s.minY);
                bounds.e = Math.max(bounds.e, s.maxX);
                bounds.s = Math.max(bounds.s, s.maxY);
                bounds.w = Math.min(bounds.w, s.minX);
                hasBounds = true;
            }
        });
        return hasBounds ? bounds : void 0;
    };
    MapView.prototype.redraw = function (animation) {
        this.chart.series.forEach(function (s) {
            if (s.useMapGeometry) {
                s.isDirty = true;
            }
        });
        this.chart.redraw(animation);
    };
    MapView.prototype.setView = function (center, zoom, redraw, animation) {
        if (redraw === void 0) { redraw = true; }
        if (center) {
            this.center = center;
        }
        if (typeof zoom === 'number') {
            if (typeof this.minZoom === 'number') {
                zoom = Math.max(zoom, this.minZoom);
            }
            this.zoom = zoom;
        }
        // Stay within the data bounds
        var bounds = this.getDataBounds();
        if (bounds) {
            var cntr = this.center;
            var _a = this.chart, plotWidth = _a.plotWidth, plotHeight = _a.plotHeight;
            var scale = (256 / 360) * Math.pow(2, this.zoom);
            var nw = this.toPixels([bounds.n, bounds.w]);
            var se = this.toPixels([bounds.s, bounds.e]);
            // Off west
            if (nw.x < 0 && se.x < plotWidth) {
                // Adjust eastwards
                cntr[1] += Math.max(nw.x, se.x - plotWidth) / scale;
            }
            // Off east
            if (se.x > plotWidth && nw.x > 0) {
                // Adjust westwards
                cntr[1] += Math.min(se.x - plotWidth, nw.x) / scale;
            }
            // Off north
            if (nw.y < 0 && se.y < plotHeight) {
                // Adjust southwards
                cntr[0] += Math.max(nw.y, se.y - plotHeight) / scale;
            }
            // Off south
            if (se.y > plotHeight && nw.y > 0) {
                // Adjust northwards
                cntr[0] += Math.min(se.y - plotHeight, nw.y) / scale;
            }
        }
        if (redraw) {
            this.redraw(animation);
        }
    };
    MapView.prototype.toPixels = function (pos) {
        var lat = pos[0], lng = pos[1];
        var scale = (256 / 360) * Math.pow(2, this.zoom);
        var centerPxX = this.chart.plotWidth / 2;
        var centerPxY = this.chart.plotHeight / 2;
        var x = centerPxX - scale * (this.center[1] - lng);
        var y = centerPxY - scale * (this.center[0] - lat);
        return { x: x, y: y };
    };
    MapView.prototype.toValues = function (pos) {
        var x = pos.x, y = pos.y;
        var scale = (256 / 360) * Math.pow(2, this.zoom);
        var centerPxX = this.chart.plotWidth / 2;
        var centerPxY = this.chart.plotHeight / 2;
        var lng = this.center[1] - ((centerPxX - x) / scale);
        var lat = this.center[0] - ((centerPxY - y) / scale);
        return [lat, lng];
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
            }
        }
    };
    return MapView;
}());
export default MapView;
