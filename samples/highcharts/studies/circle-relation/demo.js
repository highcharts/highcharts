

(function (H) {
    var defaultOptions = H.getOptions(),
        extendClass = H.extendClass,
        merge = H.merge,
        seriesTypes = H.seriesTypes;
    /**
     * The series type factory. This will be included in HC5.
     */
    H.seriesType = function (type, parent, options, props) {

        // Merge the options
        defaultOptions.plotOptions[type] = merge(
            defaultOptions.plotOptions[parent],
            options
        );

        // Create the class
        seriesTypes[type] = extendClass(seriesTypes[parent], props);
        seriesTypes[type].prototype.type = type;
    };

    /**
     * Define the circle series type
     */
    H.seriesType('circle', 'line', {
        gravity: 0.5,
        marker: {
            symbol: 'circle'
        },
        showInLegend: false,
        tooltip: {
            pointFormat: '{series.name}'
        }
    }, {
        getPointSpline: function (points, point, i) {
            var ret = ['L', point.plotX, point.plotY],
                center,
                last = points[i - 1],
                gravity = this.options.gravity,
                invGravity = 1 - gravity;

            if (point && last) {
                center = this.xAxis.center || [(point.plotX + last.plotX) / 2, this.yAxis.len];
                ret = [
                    'C',
                    last.plotX * invGravity + center[0] * gravity,
                    last.plotY * invGravity + center[1] * gravity,
                    point.plotX * invGravity + center[0] * gravity,
                    point.plotY * invGravity + center[1] * gravity,
                    point.plotX,
                    point.plotY
                ];
            }
            return ret;
        }
    });
}(Highcharts));

Highcharts.chart('container', {

    chart: {
        polar: true,
        type: 'circle'
    },

    title: {
        text: 'Relational database overview'
    },

    subtitle: {
        text: 'Highcharts circle relation chart'
    },

    xAxis: {
        categories: ['person', 'family', 'family_dwelling', 'dwelling', 'workplace', 'municipality'],
        min: 0,
        max: 6,
        gridLineWidth: 0,
        lineWidth: 0
    },

    yAxis: {
        min: 0,
        max: 1,
        visible: false
    },

    series: [{
        data: [{
            x: 0,
            y: 1
        }, {
            x: 4,
            y: 1
        }]
    }, {
        data: [{
            x: 0,
            y: 1
        }, {
            x: 1,
            y: 1
        }],
        lineWidth: 5
    }, {
        data: [{
            x: 1,
            y: 1
        }, {
            x: 2,
            y: 1
        }]
    }, {
        data: [{
            x: 2,
            y: 1
        }, {
            x: 3,
            y: 1
        }]
    }, {
        data: [{
            x: 3,
            y: 1
        }, {
            x: 5,
            y: 1
        }],
        lineWidth: 0.25
    }, {
        data: [{
            x: 4,
            y: 1
        }, {
            x: 5,
            y: 1
        }]
    }]

});