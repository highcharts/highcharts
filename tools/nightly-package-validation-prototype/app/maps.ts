import Highcharts from 'highcharts/highmaps';

const mapData: Highcharts.GeoJSON = {
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        properties: { 'hc-key': 'west', name: 'West' },
        geometry: {
            type: 'Polygon',
            coordinates: [[[0, 0], [4, 0], [4, 4], [0, 4], [0, 0]]]
        }
    }, {
        type: 'Feature',
        properties: { 'hc-key': 'east', name: 'East' },
        geometry: {
            type: 'Polygon',
            coordinates: [[[8, 0], [12, 0], [12, 4], [8, 4], [8, 0]]]
        }
    }]
};

const chart = Highcharts.mapChart('chart', {
    accessibility: { enabled: false },
    chart: { animation: false },
    plotOptions: { series: { animation: false } },
    series: [{
        type: 'map',
        mapData,
        joinBy: ['hc-key', 'region'],
        keys: ['region', 'value'],
        data: [
            ['east', 9],
            ['west', 3]
        ]
    }]
});

Object.assign(window, { chart });
