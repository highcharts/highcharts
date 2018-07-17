(function (H) {
    var each = H.each;
    Highcharts.seriesType('sociogram', 'line', {
        dataLabels: {
            enabled: true,
            format: '{point.name}'
        }
    }, {
        // Use the drawGraph function to draw relational paths between the nodes
        drawGraph: function () {
            var series = this,
                chart = this.chart,
                relations = this.relations = this.relations || {};
            each(this.points, function (point) {
                each(point.connections, function (connId) {

                    var key = point.id + '-' + connId,
                        connPoint = chart.get(connId);

                    if (connPoint) {

                        if (!relations[key]) {
                            relations[key] = chart.renderer.path()
                                .add(series.group);
                        }

                        relations[key].attr({
                            'd': [
                                'M', point.plotX, point.plotY,
                                'L', connPoint.plotX, connPoint.plotY
                            ],
                            zIndex: 10,
                            'stroke': series.color,
                            'stroke-width': H.pick(series.options.lineWidth, 2),
                            'marker-end': "url(#arrow-end)"
                            //'marker-start': "url(#arrow-start)"
                        });
                    }

                });
            });
        }
    });

    H.wrap(H.Chart.prototype, 'getContainer', function (proceed) {
        proceed.apply(this);

        var chart = this,
            renderer = chart.renderer,
            defOptions = chart.options.defs || [],
            i = defOptions.length,
            def,
            marker;

        while (i--) {
            def = defOptions[i];
            marker = renderer.createElement('marker').attr({
                id: def.id,
                viewBox: "0 -5 10 20",
                refX: 16,
                refY: 6,
                markerWidth: 6,
                markerHeight: 6,
                orient: 'auto',
                fill: 'inherit'
            }).add(renderer.defs);
            renderer.createElement('path').attr({
                d: def.path,
                fill: 'black'
            }).add(marker);
        }
    });

    H.wrap(H.Series.prototype, 'drawGraph', function (proceed) {
        proceed.apply(this);

    });
}(Highcharts));


Highcharts.chart('container', {

    chart: {
        height: '100%',
        polar: true
    },

    defs: [{
        id: 'arrow-start',
        path: 'M 0 0 L 10 5 L 0 10 z',
        fill: 'gray'
    }, {
        id: 'arrow-end',
        path: 'M 0 0 L 10 5 L 0 10 z', //M 0 0 L 10 5 L 0 10 z
        fill: 'gray'
    }],

    title: {
        text: 'Highcharts Sociogram Study'
    },

    xAxis: {
        visible: false
    },

    yAxis: {
        labels: {
            enabled: false
        },
        reversed: true,
        plotBands: [{
            from: 0,
            to: Infinity,
            color: 'rgba(0, 255, 96, 0.1)'
        }, {
            from: 1,
            to: Infinity,
            color: 'rgba(0, 255, 96, 0.1)'
        }, {
            from: 2,
            to: Infinity,
            color: 'rgba(0, 255, 96, 0.1)'
        }, {
            from: 3,
            to: Infinity,
            color: 'rgba(0, 255, 96, 0.1)'
        }, {
            from: 4,
            to: Infinity,
            color: 'rgba(0, 255, 96, 0.1)'
        }],
        gridLineColor: 'white'
    },

    series: [{
        data: [{
            id: 'MarcusID',
            name: 'Marcus',
            connections: [
                'TomID',
                'AnnID',
                'JulieID',
                'MartinID'
            ],
            y: 4,
            color: 'red'
        }, {
            id: 'TomID',
            name: 'Tom',
            connections: [
                'AnnID',
                'JulieID'
            ],
            y: 2,
            color: 'blue'
        }, {
            id: 'AnnID',
            name: 'Ann',
            connections: [
                'TomID',
                'MartinID'
            ],
            y: 2,
            color: 'red'
        }, {
            id: 'JulieID',
            name: 'Julie',
            connections: [
                'TomID',
                'AnnID',
                'MartinID'
            ],
            y: 3,
            color: 'red'
        }, {
            id: 'MartinID',
            name: 'Martin',
            connections: [
                'MarcusID'
            ],
            y: 1,
            color: 'red'
        }, {
            id: 'JohnID',
            name: 'John',
            connections: [
                'NoraID',
                'MonicaID'
            ],
            color: 'red',
            y: 2
        }, {
            id: 'MonicaID',
            name: 'Monica',
            connections: [
                'NoraID'
            ],
            y: 1,
            color: 'red'
        }, {
            id: 'NoraID',
            name: 'Nora',
            connections: [
                'MonicaID'
            ],
            y: 1,
            color: 'red'
        }],
        type: 'sociogram',
        name: 'Positive relations'
    }]

});
