$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=australia.geo.json&callback=?', function (geojson) {

        // Prepare the geojson
        var states = Highcharts.geojson(geojson, 'map'),
            rivers = Highcharts.geojson(geojson, 'mapline'),
            cities = Highcharts.geojson(geojson, 'mappoint'),
            specialCityLabels = {
                'Melbourne': {
                    align: 'right'
                },
                'Canberra': {
                    align: 'right',
                    y: -5
                },
                'Wollongong': {
                    y: 5
                },
                'Brisbane': {
                    y: -5
                }
            };

        // Skip or move some labels to avoid collision
        $.each(states, function () {
            // Disable data labels
            if (this.properties.code_hasc === 'AU.CT' || this.properties.code_hasc === 'AU.JB') {
                this.dataLabels = {
                    enabled: false
                };
            }
            if (this.properties.code_hasc === 'AU.TS') {
                this.dataLabels = {
                    style: {
                        color: '#333333'
                    }
                };
            }
            // Move center for data label
            if (this.properties.code_hasc === 'AU.SA') {
                this.middleY = 0.3;
            }
            if (this.properties.code_hasc === 'AU.QL') {
                this.middleY = 0.7;
            }

        });

        $.each(cities, function () {
            if (specialCityLabels[this.name]) {
                this.dataLabels = specialCityLabels[this.name];
            }
        });


        // Initiate the chart
        $('#container').highcharts('Map', {

            title : {
                text : 'Highmaps from geojson with multiple geometry types'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },


            series : [{
                name: 'States and territories',
                data: states,
                color: Highcharts.getOptions().colors[2],
                states: {
                    hover: {
                        color: Highcharts.getOptions().colors[4]
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    style: {
                        width: '80px' // force line-wrap
                    }
                },
                tooltip: {
                    pointFormat: '{point.name}'
                }
            }, {
                name: 'Rivers',
                type: 'mapline',
                data: rivers,
                color: Highcharts.getOptions().colors[0],
                tooltip: {
                    pointFormat: '{point.properties.NAME}'
                }
            }, {
                name: 'Cities',
                type: 'mappoint',
                data: cities,
                color: 'black',
                marker: {
                    radius: 2
                },
                dataLabels: {
                    align: 'left',
                    verticalAlign: 'middle'
                },
                animation: false,
                tooltip: {
                    pointFormat: '{point.name}'
                }
            }]
        });
    });
});