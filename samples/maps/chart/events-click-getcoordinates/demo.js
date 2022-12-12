let chart;

function showMap(topology) {
    // Initialize the chart
    chart = Highcharts.mapChart('container', {
        chart: {
            events: {
                click: function (e) {
                    const series = this.get(
                        document
                            .querySelector('input[name=series]:checked')
                            .value
                    );

                    series.addPoint({ lon: e.lon, lat: e.lat });
                }
            },
            animation: false
        },

        title: {
            text: 'Draw your own points or lines'
        },

        subtitle: {
            style: {
                color: 'red'
            }
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        legend: {
            enabled: false
        },

        tooltip: {
            pointFormat: 'Lon: {point.lon:.2f}, Lat: {point.lat:.2f}'
        },

        plotOptions: {
            series: {
                stickyTracking: false,
                point: {
                    events: {
                        // Update lat/lon properties after dragging point
                        drop: function () {
                            const newLatLon = this.series.chart
                                .fromPointToLatLon(this);
                            this.lat = newLatLon.lat;
                            this.lon = newLatLon.lon;
                        }
                    }
                }
            }
        },

        series: [{
            mapData: topology
        }, {
            type: 'mappoint',
            id: 'points',
            name: 'Points',
            dragDrop: {
                draggableX: true,
                draggableY: true
            },
            cursor: 'move',
            point: {
                events: {
                    click: function () {
                        if (document.getElementById('delete').checked) {
                            this.remove();
                        }
                    }
                }
            }
        }, {
            type: 'mappoint',
            id: 'connected-points',
            name: 'Connected points',
            draggableX: true,
            draggableY: true,
            cursor: 'move',
            color: Highcharts.getOptions().colors[0],
            lineWidth: 2,
            point: {
                events: {
                    click: function () {
                        if (document.getElementById('delete').checked) {
                            this.remove();
                        }
                    }
                }
            }
        }]
    });
}

(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    showMap(topology);

    const container = document.getElementById('container');

    document.getElementById('getconfig').addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        let points;
        let html = '';

        function getPointConfigString(point) {
            return point.lat ? '{ lat: ' + point.lat + ', lon: ' + point.lon + ' }' :
                '{ x: ' + point.x + ', y: ' + point.y + ' }';
        }

        if (chart.get('points').data.length) {
            points = '{\n    type: "mappoint",\n    data: [\n        ' +
                chart.get('points').data.map(getPointConfigString).join(',\n        ') +
                '\n    ]\n}';
            html += '<h3>Points configuration</h3><pre>' + points + '</pre>';
        }

        if (chart.get('connected-points').data.length) {
            points = '{\n    type: "mappoint",\n    lineWidth: 2,\n    data: [\n        ' +
                chart.get('connected-points').data.map(getPointConfigString).join(',\n        ') +
                '\n    ]\n}';
            html += '<h3>Connected points configuration</h3><pre>' + points + '</pre>';
        }

        if (!html) {
            html = 'No points added. Click the map to add points.';
        }

        document.getElementById('code-inner').innerHTML = html;
        container.style.marginTop = '-500px';
    });

    document.getElementById('close').addEventListener('click', () => {
        container.style.marginTop = 0;
    });

    const select = document.getElementById('maps');

    for (const group in Highcharts.mapDataIndex) {
        if (
            Object.prototype.hasOwnProperty.call(Highcharts.mapDataIndex, group)
        ) {
            if (group !== 'version') {
                for (const name in Highcharts.mapDataIndex[group]) {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            Highcharts.mapDataIndex[group], name
                        )
                    ) {
                        const option = document.createElement('option');
                        option.value = Highcharts.mapDataIndex[group][name];
                        option.innerText = name;
                        option.selected = name ===
                            'World, Miller projection, medium resolution';

                        select.append(option);
                    }
                }
            }
        }
    }

    select.addEventListener('change', async () => {
        const mapKey = select.value.replace(/\.js$/, '');
        const topology = await fetch(
            `https://code.highcharts.com/mapdata/${mapKey}.topo.json`
        ).then(response => response.json());
        showMap(topology);
    });
})();