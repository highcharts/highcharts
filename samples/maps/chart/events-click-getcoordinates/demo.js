function showMap(mapKey) {

    var supportsLatLon = !!Highcharts.maps[mapKey]['hc-transform'];

    // Initiate the chart
    $('#container').highcharts('Map', {

        chart: {
            events: {
                click: function (e) {
                    var series = this.get($('input[name=series]:checked').val()),
                        x = Math.round(e.xAxis[0].value),
                        y = Math.round(e.yAxis[0].value);

                    series.addPoint(supportsLatLon ? this.fromPointToLatLon({
                        x: x,
                        y: y
                    }) : {
                        x: x,
                        y: y
                    });
                }
            },
            animation: false
        },

        title: {
            text : 'Draw your own points or lines'
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
                point: {
                    events: {
                        // Update lat/lon properties after dragging point
                        drop: function (e) {
                            var newLatLon;
                            if (supportsLatLon) {
                                newLatLon = this.series.chart.fromPointToLatLon(this);
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
            draggableX: true,
            draggableY: true,
            cursor: 'move',
            point: {
                events: {
                    click: function () {
                        if ($('input#delete').attr('checked')) {
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
                        if ($('input#delete').attr('checked')) {
                            this.remove();
                        }
                    }
                }
            }
        }]
    });
}



$(function () {

    var $select,
        $option,
        group,
        name;

    showMap('custom/world');


    $('#getconfig').click(function () {
        var chart = $('#container').highcharts(),
            points,
            html = '';

        function getPointConfigString(point) {
            return point.lat ? '{ lat: ' + point.lat + ', lon: ' + point.lon + ' }' :
                '{ x: ' + point.x + ', y: ' + point.y + ' }';
        }

        if (chart.get('points').data.length) {
            points = '{\n    type: "mappoint",\n    data: [\n        ' +
                $.map(chart.get('points').data, getPointConfigString).join(",\n        ") +
                '\n    ]\n}';
            html += '<h3>Points configuration</h3><pre>' + points + '</pre>';
        }

        if (chart.get('connected-points').data.length) {
            points = '{\n    type: "mappoint",\n    lineWidth: 2,\n    data: [\n        ' +
                $.map(chart.get('connected-points').data, getPointConfigString).join(",\n        ") +
                '\n    ]\n}';
            html += '<h3>Connected points configuration</h3><pre>' + points + '</pre>';
        }

        if (!html) {
            html = 'No points added. Click the map to add points.';
        }

        $('#code-inner').html(html);
        $('#container').css({
            'margin-top': -500
        });


        return false;
    });

    $('#close').click(function () {
        $('#container').css({
            'margin-top': 0
        });
    });

    $select = $('select#maps');
    for (group in Highcharts.mapDataIndex) {
        if (Highcharts.mapDataIndex.hasOwnProperty(group)) {
            if (group !== 'version') {
                for (name in Highcharts.mapDataIndex[group]) {
                    if (Highcharts.mapDataIndex[group].hasOwnProperty(name)) {
                        $option = $('<option value="' + Highcharts.mapDataIndex[group][name] + '">' + name + '</option>');
                        if (name === 'World') {
                            $option.attr('selected', true);
                        }
                        $select.append($option);
                    }
                }
            }
        }
    }
    $select.change(function () {
        var mapKey = $select.val().replace(/\.js$/, '');
        $.getScript('https://code.highcharts.com/mapdata/' + mapKey + '.js', function () {
            showMap(mapKey);
        });
    });

});