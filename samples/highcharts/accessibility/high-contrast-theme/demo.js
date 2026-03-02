function makeArray(length, populate) {
    return [...new Array(length)].map(populate);
}

function makeChart(constructor, type, series) {
    const capitalizeString = s => s.charAt(0).toUpperCase() + s.slice(1);
    return Highcharts[constructor](`container-${type}`, Highcharts.merge({
        chart: {
            type: type
        },
        title: {
            text: `${capitalizeString(type)} chart`
        },
        series: series
    }));
}

// Loop over the regular charts and create them
[
    ['column', [{
        data: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]
    }, {
        colorByPoint: true,
        data: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]
    }]],

    ['scatter', makeArray(10, (_, i) => ({
        data: makeArray(100, () => i / 2 + Math.random())
    }))],

    ['pie', [{
        dataLabels: {
            enabled: false
        },
        data: makeArray(10, () => 1)
    }]]
].forEach(c => makeChart('chart', c[0], c[1]));

// Create map and stock charts
makeChart('stockChart', 'spline', makeArray(10, (_, i) => ({
    data: makeArray(100, () => i + Math.random())
})));
makeChart('mapChart', 'map', [{
    joinBy: null,
    mapData: Highcharts.maps['custom/europe'],
    colorByPoint: true,
    data: makeArray(30, () => 1)
}]);
