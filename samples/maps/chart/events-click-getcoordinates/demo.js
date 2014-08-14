function showMap(mapKey) {


    // Initiate the chart
    $('#container').highcharts('Map', {

        chart: {
            events: {
                click: function (e) {
                    var x = Math.round(e.xAxis[0].value),
                        y = Math.round(e.yAxis[0].value),
                        seriesId = $('input[name=series]:checked').val();

                    this.get(seriesId).addPoint({
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

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        legend: {
            enabled: false
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

        if (chart.get('points').data.length) {
            points = '{\n    type: "mappoint",\n    data: [\n        ' +
                $.map(chart.get('points').data, function (point) {
                    return '{ x: ' + point.x + ', y: ' + point.y + ' }';
                }).join(",\n        ") +
                '\n    ]\n}';
            html += '<h3>Points configuration</h3><pre>' + points + '</pre>';
        }

        if (chart.get('connected-points').data.length) {
            points = '{\n    type: "mappoint",\n    lineWidth: 2,\n    data: [\n        ' +
                $.map(chart.get('connected-points').data, function (point) {
                    return '{ x: ' + point.x + ', y: ' + point.y + ' }';
                }).join(",\n        ") +
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
        $.getScript('http://code.highcharts.com/mapdata/' + mapKey + '.js', function () {
            showMap(mapKey);
        });
    });

});