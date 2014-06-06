$(function () {

    /*
    TODO:
    - Check data labels after drilling. Label rank? New positions?
    - Not US Mainland text
    - Separators
    */

    var data = Highcharts.geojson(Highcharts.maps['countries/usa/usa-all']);

    // Set drilldown pointers
    $.each(data, function (i) {
        this.drilldown = 'usa-' + this.properties.fips.substr(2, 2);
        this.value = i; // Non-random bogus data
    });

    // Some responsiveness
    var small = $('#container').width() < 400;

    // Instanciate the map
    $('#container').highcharts('Map', {
        chart : {
            events: {
                drilldown: function (e) {
                    
                    if (!e.seriesOptions) {
                        var chart = this,
                            mapKey = 'countries/usa/' + e.point.drilldown + '-all';

                        // Show the spinner
                        chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

                        // Handle error, the timeout is cleared on success
                        var fail = setTimeout(function () {
                            if (!Highcharts.maps[mapKey]) {
                                chart.showLoading('<i class="icon-frown"></i> Failed loading ' + e.point.name);

                                fail = setTimeout(function () {
                                    chart.hideLoading();
                                }, 1000);
                            }
                        }, 3000);
                        
                        // Load the drilldown map
                        $.getScript('http://code.highcharts.com/mapdata/1.0.0/' + mapKey + '.js', function () {

                            var data = Highcharts.geojson(Highcharts.maps[mapKey]);
                        
                            // Set a non-random bogus value
                            $.each(data, function (i) {
                                this.value = i;
                            });

                            // Hide loading and add series
                            chart.hideLoading();
                            clearTimeout(fail);
                            chart.addSeriesAsDrilldown(e.point, {
                                name: e.point.name,
                                data: data,
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}'
                                }
                            });
                        })
                    }

                    
                    this.setTitle(null, { text: e.point.name });
                },
                drillup: function (e) {
                    this.setTitle(null, { text: 'USA' });
                }
            }
        },

        title : {
            text : 'Highcharts Map Drilldown'
        },

        subtitle: {
            text: 'USA',
            floating: true,
            align: 'right',
            y: 50,
            style: {
                fontSize: '16px'
            }
        },

        legend: small ? {} : {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        colorAxis: {
            min: 0,
            minColor: '#E6E7E8',
            maxColor: '#005645'
        },
        
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        plotOptions: {
            map: {
                states: {
                    hover: {
                        color: '#EEDD66'
                    }
                }
            }
        },
        
        series : [{
            data : data,
            name: 'USA',
            dataLabels: {
                enabled: true,
                format: '{point.properties.postal-code}'
            }
        }], 

        drilldown: {
            //series: drilldownSeries,
            activeDataLabelStyle: {
                color: 'white',
                textDecoration: 'none'
            },
            drillUpButton: {
                relativeTo: 'spacingBox',
                position: {
                    x: 0,
                    y: 60
                }
            }
        }
    });
});