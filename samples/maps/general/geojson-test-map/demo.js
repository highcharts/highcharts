document.getElementById('run').click(function () {
    const geojson = JSON.parse(document.getElementById('geojson').value);

    document.getElementById('container').slideDown().highcharts('Map', {
        series: [{
            mapData: geojson
        }]
    });
});
