$(document).ready(function () {

    var blnNoData = true;

    var MapSeriesData = [{
        name: '',
        allAreas: true,
        showInLegend: false
    }];

    var MapSeries1 = {};
    MapSeries1.name = 'United States';
    MapSeries1.data = [];
    var MapData1 = {};
    MapData1.value = 43;
    MapData1['hc-key'] = 'us';
    MapSeries1.data[0] = MapData1;
    MapSeriesData.push(MapSeries1);

    $('#container').highcharts('Map', {
        title: {
            text: 'Highmaps combined with 3D module'
        },
        subtitle: {
            text: 'United States got null color'
        },
        plotOptions: {
            series: {
                showEmpty: false,
                dataLabels: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: '{point.value} '
                }
            },
            map: {
                allAreas: false,
                joinBy: 'hc-key',
                nullColor: '#B3BCC0',
                borderColor: '#DCDCDC',
                borderWidth: 1,
                mapData: Highcharts.maps['custom/world']
            }
        },
        series: MapSeriesData
    });

});