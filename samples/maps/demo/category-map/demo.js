$(function () {


    // Instanciate the map
    $('#container').highcharts('Map', {
        chart: {
            spacingBottom: 20
        },
        title : {
            text : 'Europe time zones'
        },

        legend: {
            enabled: true
        },

        plotOptions: {
            map: {
                allAreas: false,
                joinBy: ['iso-a2', 'code'],
                dataLabels: {
                    enabled: true,
                    color: '#FFFFFF',
                    formatter: function () {
                        if (this.point.properties && this.point.properties.labelrank.toString() < 5) {
                            return this.point.properties['iso-a2'];
                        }
                    },
                    format: null,
                    style: {
                        fontWeight: 'bold'
                    }
                },
                mapData: Highcharts.maps['custom/europe'],
                tooltip: {
                    headerFormat: '',
                    pointFormat: '{point.name}: <b>{series.name}</b>'
                }

            }
        },

        series : [{
            name: 'UTC',
            data: $.map(['IE', 'IS', 'GB', 'PT'], function (code) {
                return { code: code };
            })
        }, {
            name: 'UTC + 1',
            data: $.map(['NO', 'SE', 'DK', 'DE', 'NL', 'BE', 'LU', 'ES', 'FR', 'PL', 'CZ', 'AT', 'CH', 'LI', 'SK', 'HU',
                    'SI', 'IT', 'SM', 'HR', 'BA', 'YF', 'ME', 'AL', 'MK'], function (code) {
                return { code: code };
            })
        }, {
            name: 'UTC + 2',
            data: $.map(['FI', 'EE', 'LV', 'LT', 'BY', 'UA', 'MD', 'RO', 'BG', 'GR', 'TR', 'CY'], function (code) {
                return { code: code };
            })
        }, {
            name: 'UTC + 3',
            data: $.map(['RU'], function (code) {
                return { code: code };
            })
        }]
    });
});