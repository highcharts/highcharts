
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
                            'stroke': series.color,
                            'stroke-width': H.pick(series.options.lineWidth, 2)
                        });
                    }

                });
            });
        }
    });
}(Highcharts));


Highcharts.chart('container', {

    chart: {
        height: '100%',
        polar: true
    },

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
        reversed: true
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
