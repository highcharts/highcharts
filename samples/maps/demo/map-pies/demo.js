
// New map-pie series type that also allows lat/lon as center option.
// Also adds a sizeFormatter option to the series, to allow dynamic sizing
// of the pies.
Highcharts.seriesType('mappie', 'pie', {
    center: null, // Can't be array by default anymore
    clip: true, // For map navigation
    states: {
        hover: {
            halo: {
                size: 5
            }
        }
    },
    dataLabels: {
        enabled: false
    }
}, {
    getCenter: function () {
        var options = this.options,
            chart = this.chart,
            slicingRoom = 2 * (options.slicedOffset || 0);
        if (!options.center) {
            options.center = [null, null]; // Do the default here instead
        }
        // Handle lat/lon support
        if (options.center.lat !== undefined) {
            var point = chart.fromLatLonToPoint(options.center);
            options.center = [
                chart.xAxis[0].toPixels(point.x, true),
                chart.yAxis[0].toPixels(point.y, true)
            ];
        }
        // Handle dynamic size
        if (options.sizeFormatter) {
            options.size = options.sizeFormatter.call(this);
        }
        // Call parent function
        var result = Highcharts.seriesTypes.pie.prototype.getCenter.call(this);
        // Must correct for slicing room to get exact pixel pos
        result[0] -= slicingRoom;
        result[1] -= slicingRoom;
        return result;
    },
    translate: function (p) {
        this.options.center = this.userOptions.center;
        this.center = this.getCenter();
        return Highcharts.seriesTypes.pie.prototype.translate.call(this, p);
    }
});


var data = [
        // state, demVotes, repVotes, libVotes, grnVotes, sumVotes, winner, offset config for pies
        ['Alabama', 729547, 1318255, 44467, 9391, 2101660, -1],
        ['Alaska', 116454, 163387, 18725, 5735, 304301, -1],
        ['Arizona', 1161167, 1252401, 106327, 34345, 2554240, -1],
        ['Arkansas', 380494, 684782, 29829, 9473, 1104578, -1],
        ['California', 8577206, 4390272, 467370, 271047, 13705895, 1, { lon: -1, drawConnector: false }],
        ['Colorado', 1338870, 1202484, 144121, 38437, 2723912, 1],
        ['Connecticut', 897572, 673215, 48676, 22841, 1642304, 1, { lat: -1.5, lon: 1 }],
        ['Delaware', 235603, 185127, 14757, 6103, 441590, 1, { lat: -1.3, lon: 2 }],
        ['District of Columbia', 282830, 12723, 4906, 4258, 304717, 1, { lat: -2, lon: 2 }],
        ['Florida', 4504975, 4617886, 207043, 64399, 9394303, -1],
        ['Georgia', 1877963, 2089104, 125306, 0, 4092373, -1],
        ['Hawaii', 266891, 128847, 15954, 12737, 424429, 1, { lat: -0.5, lon: 0.5, drawConnector: false }],
        ['Idaho', 189765, 409055, 28331, 8496, 635647, -1],
        ['Illinois', 2977498, 2118179, 208682, 74112, 5378471, 1],
        ['Indiana', 1039126, 1557286, 133993, 7841, 2738246, -1],
        ['Iowa', 653669, 800983, 59186, 11479, 1525317, -1],
        ['Kansas', 427005, 671018, 55406, 23506, 1176935, -1],
        ['Kentucky', 628854, 1202971, 53752, 13913, 1899490, -1],
        ['Louisiana', 780154, 1178638, 37978, 14031, 2010801, -1],
        ['Maine', 352156, 332418, 37578, 13995, 736147, 1],
        ['Maryland', 1502820, 878615, 78225, 33380, 2493040, 1, { lon: 0.6, drawConnector: false }],
        ['Massachusetts', 1995196, 1090893, 138018, 47661, 3271768, 1, { lon: 3 }],
        ['Michigan', 2268839, 2279543, 172136, 51463, 4771981, -1],
        ['Minnesota', 1367716, 1322951, 112972, 36985, 2840624, 1, { lon: -1, drawConnector: false }],
        ['Mississippi', 462127, 678284, 14411, 3595, 1158417, -1],
        ['Missouri', 1054889, 1585753, 96404, 25086, 2762132, -1],
        ['Montana', 174281, 273879, 28036, 7868, 484064, -1],
        ['Nebraska', 273185, 485372, 38746, 8337, 805640, -1],
        ['Nevada', 539260, 512058, 37384, 0, 1088702, 1],
        ['New Hampshire', 348526, 345790, 30694, 6465, 731475, 1],
        ['New Jersey', 1967444, 1509688, 72143, 37131, 3586406, 1, { lat: -1, lon: 1.2 }],
        ['New Mexico', 380923, 316134, 74544, 9797, 781398, 1],
        ['New York', 4145376, 2638135, 162273, 100110, 7045894, 1],
        ['North Carolina', 2169496, 2345235, 130021, 1038, 4645790, -1],
        ['North Dakota', 93758, 216794, 21434, 378, 332364, -1],
        ['Ohio', 2320596, 2776683, 174266, 44310, 5315855, -1],
        ['Oklahoma', 420375, 949136, 83481, 0, 1452992, -1],
        ['Oregon', 991580, 774080, 93875, 49247, 1908782, 1],
        ['Pennsylvania', 2874136, 2945302, 144826, 49334, 6013598, -1],
        ['Rhode Island', 227062, 166454, 14700, 6171, 414387, 1, { lat: -0.7, lon: 1.7 }],
        ['South Carolina', 855373, 1155389, 49204, 13034, 2073000, -1],
        ['South Dakota', 117442, 227701, 20845, 0, 365988, -1],
        ['Tennessee', 868853, 1519926, 70286, 15952, 2475017, -1],
        ['Texas', 3877868, 4685047, 283492, 71558, 8917965, -1],
        ['Utah', 222858, 375006, 39608, 7695, 645167, -1],
        ['Vermont', 178573, 95369, 10078, 6758, 290778, 1, { lat: 2 }],
        ['Virginia', 1981473, 1769443, 118274, 27638, 3896828, 1],
        ['Washington', 1727840, 1210370, 160356, 57571, 3156137, 1],
        ['West Virginia', 187519, 486304, 22958, 8016, 704797, -1],
        ['Wisconsin', 1382947, 1407028, 106470, 31016, 2927461, -1],
        ['Wyoming', 55973, 174419, 13287, 2515, 246194, -1]
    ],
    maxVotes = 0,
    demColor = 'rgba(74,131,240,0.80)',
    repColor = 'rgba(220,71,71,0.80)',
    libColor = 'rgba(240,190,50,0.80)',
    grnColor = 'rgba(90,200,90,0.80)';


// Compute max votes to find relative sizes of bubbles
Highcharts.each(data, function (row) {
    maxVotes = Math.max(maxVotes, row[5]);
});

// Build the chart
var chart = Highcharts.mapChart('container', {
    title: {
        text: 'USA 2016 Presidential Election Results'
    },

    chart: {
        animation: false // Disable animation, especially for zooming
    },

    colorAxis: {
        dataClasses: [{
            from: -1,
            to: 0,
            color: 'rgba(244,91,91,0.5)',
            name: 'Republican'
        }, {
            from: 0,
            to: 1,
            color: 'rgba(124,181,236,0.5)',
            name: 'Democrat'
        }, {
            from: 2,
            to: 3,
            name: 'Libertarian',
            color: libColor
        }, {
            from: 3,
            to: 4,
            name: 'Green',
            color: grnColor
        }]
    },

    mapNavigation: {
        enabled: true
    },
    // Limit zoom range
    yAxis: {
        minRange: 2300
    },

    tooltip: {
        useHTML: true
    },

    // Default options for the pies
    plotOptions: {
        mappie: {
            borderColor: 'rgba(255,255,255,0.4)',
            borderWidth: 1,
            tooltip: {
                headerFormat: ''
            }
        }
    },

    series: [{
        mapData: Highcharts.maps['countries/us/us-all'],
        data: data,
        name: 'States',
        borderColor: '#FFF',
        showInLegend: false,
        joinBy: ['name', 'id'],
        keys: ['id', 'demVotes', 'repVotes', 'libVotes', 'grnVotes',
            'sumVotes', 'value', 'pieOffset'],
        tooltip: {
            headerFormat: '',
            pointFormatter: function () {
                var hoverVotes = this.hoverVotes; // Used by pie only
                return '<b>' + this.id + ' votes</b><br/>' +
                    Highcharts.map([
                        ['Democrats', this.demVotes, demColor],
                        ['Republicans', this.repVotes, repColor],
                        ['Libertarians', this.libVotes, libColor],
                        ['Green', this.grnVotes, grnColor]
                    ].sort(function (a, b) {
                        return b[1] - a[1]; // Sort tooltip by most votes
                    }), function (line) {
                        return '<span style="color:' + line[2] +
                            // Colorized bullet
                            '">\u25CF</span> ' +
                            // Party and votes
                            (line[0] === hoverVotes ? '<b>' : '') +
                            line[0] + ': ' +
                            Highcharts.numberFormat(line[1], 0) +
                            (line[0] === hoverVotes ? '</b>' : '') +
                            '<br/>';
                    }).join('') +
                    '<hr/>Total: ' + Highcharts.numberFormat(this.sumVotes, 0);
            }
        }
    }, {
        name: 'Separators',
        type: 'mapline',
        data: Highcharts.geojson(Highcharts.maps['countries/us/us-all'], 'mapline'),
        color: '#707070',
        showInLegend: false,
        enableMouseTracking: false
    }, {
        name: 'Connectors',
        type: 'mapline',
        color: 'rgba(130, 130, 130, 0.5)',
        zIndex: 5,
        showInLegend: false,
        enableMouseTracking: false
    }]
});

// When clicking legend items, also toggle connectors and pies
Highcharts.each(chart.legend.allItems, function (item) {
    var old = item.setVisible;
    item.setVisible = function () {
        var legendItem = this;
        old.call(legendItem);
        Highcharts.each(chart.series[0].points, function (point) {
            if (chart.colorAxis[0].dataClasses[point.dataClass].name === legendItem.name) {
                // Find this state's pie and set visibility
                Highcharts.find(chart.series, function (item) {
                    return item.name === point.id;
                }).setVisible(legendItem.visible, false);
                // Do the same for the connector point if it exists
                var connector = Highcharts.find(chart.series[2].points, function (item) {
                    return item.name === point.id;
                });
                if (connector) {
                    connector.setVisible(legendItem.visible, false);
                }
            }
        });
        chart.redraw();
    };
});

// Add the pies after chart load, optionally with offset and connectors
Highcharts.each(chart.series[0].points, function (state) {
    if (!state.id) {
        return; // Skip points with no data, if any
    }

    var pieOffset = state.pieOffset || {},
        centerLat = parseFloat(state.properties.latitude),
        centerLon = parseFloat(state.properties.longitude);

    // Add the pie for this state
    chart.addSeries({
        type: 'mappie',
        name: state.id,
        zIndex: 6, // Keep pies above connector lines
        sizeFormatter: function () {
            var yAxis = this.chart.yAxis[0],
                zoomFactor = (yAxis.dataMax - yAxis.dataMin) /
                    (yAxis.max - yAxis.min);
            return Math.max(
                this.chart.chartWidth / 45 * zoomFactor, // Min size
                this.chart.chartWidth / 11 * zoomFactor * state.sumVotes / maxVotes
            );
        },
        tooltip: {
            // Use the state tooltip for the pies as well
            pointFormatter: function () {
                return state.series.tooltipOptions.pointFormatter.call({
                    id: state.id,
                    hoverVotes: this.name,
                    demVotes: state.demVotes,
                    repVotes: state.repVotes,
                    libVotes: state.libVotes,
                    grnVotes: state.grnVotes,
                    sumVotes: state.sumVotes
                });
            }
        },
        data: [{
            name: 'Democrats',
            y: state.demVotes,
            color: demColor
        }, {
            name: 'Republicans',
            y: state.repVotes,
            color: repColor
        }, {
            name: 'Libertarians',
            y: state.libVotes,
            color: libColor
        }, {
            name: 'Green',
            y: state.grnVotes,
            color: grnColor
        }],
        center: {
            lat: centerLat + (pieOffset.lat || 0),
            lon: centerLon + (pieOffset.lon || 0)
        }
    }, false);

    // Draw connector to state center if the pie has been offset
    if (pieOffset.drawConnector !== false) {
        var centerPoint = chart.fromLatLonToPoint({
                lat: centerLat,
                lon: centerLon
            }),
            offsetPoint = chart.fromLatLonToPoint({
                lat: centerLat + (pieOffset.lat || 0),
                lon: centerLon + (pieOffset.lon || 0)
            });
        chart.series[2].addPoint({
            name: state.id,
            path: 'M' + offsetPoint.x + ' ' + offsetPoint.y +
                'L' + centerPoint.x + ' ' + centerPoint.y
        }, false);
    }
});
// Only redraw once all pies and connectors have been added
chart.redraw();
