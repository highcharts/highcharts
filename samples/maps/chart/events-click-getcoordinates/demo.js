let chart;

function getScript(url, cb) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = cb;
    document.head.appendChild(script);
}

function showMap(mapKey) {
    const supportsLatLon = !!Highcharts.maps[mapKey]['hc-transform'];

    // Initiate the chart
    chart = Highcharts.mapChart('container', {
        chart: {
            events: {
                click: function (e) {
                    const series = this.get(
                            document
                                .querySelector('input[name=series]:checked')
                                .value
                        ),
                        pos = this.mapView.pixelsToProjectedUnits({
                            x: Math.round(e.chartX - this.plotLeft),
                            y: Math.round(e.chartY - this.plotTop)
                        });

                    series.addPoint(
                        supportsLatLon ?
                            this.fromPointToLatLon(pos) :
                            pos
                    );
                }
            },
            animation: false
        },

        title: {
            text: 'Draw your own points or lines'
        },

        subtitle: supportsLatLon ? {} : {
            text: 'This map does not support latitude/longitude - x/y coordinates will be used',
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
            pointFormatter: function () {
                return supportsLatLon ? 'Lat: ' + this.lat.toFixed(3) + ', Lon: ' + this.lon.toFixed(3) : 'x: ' + this.x + ', y: ' + this.y;
            }
        },

        plotOptions: {
            series: {
                stickyTracking: false,
                point: {
                    events: {
                        // Update lat/lon properties after dragging point
                        drop: function () {
                            var newLatLon;
                            if (supportsLatLon) {
                                newLatLon = this.series.chart
                                    .fromPointToLatLon(this);
                                this.lat = newLatLon.lat;
                                this.lon = newLatLon.lon;
                            }
                        }
                    }
                }
            }
        },

        series: [{
            mapData: Highcharts.maps[mapKey]
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

(function () {
    showMap('custom/world');

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
                chart.get('points').data.map(getPointConfigString).join(",\n        ") +
                '\n    ]\n}';
            html += '<h3>Points configuration</h3><pre>' + points + '</pre>';
        }

        if (chart.get('connected-points').data.length) {
            points = '{\n    type: "mappoint",\n    lineWidth: 2,\n    data: [\n        ' +
                chart.get('connected-points').data.map(getPointConfigString).join(",\n        ") +
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
                        option.selected = name === 'World';

                        select.append(option);
                    }
                }
            }
        }
    }

    select.addEventListener('change', () => {
        const mapKey = select.value.replace(/\.js$/, '');
        getScript('https://code.highcharts.com/mapdata/' + mapKey + '.js', () => {
            showMap(mapKey);
        });
    });
}());