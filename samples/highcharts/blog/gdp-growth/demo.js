fetch('https://cdn.jsdelivr.net/gh/highcharts/highcharts@c55c2f39d531b227dc239d2d63d6eef882260cb6/samples/data/worldbank-norway.json').then(function (response) {
    return response.json();
}).then(function (result) {
    // set some variable to host data
    var arrayString = [],
        yearList = [],
        arrayFinal = [],
        countryName,
        indicatorName;

    result[1].forEach(function (data) {
        // Store indicator name
        countryName = data.country.value;
        // Store indicator label
        indicatorName = data.indicator.value;
        // fill the date array
        yearList.push(data.date);
        // fill the string data array
        arrayString.push(data.value);
    });

    // querry send string that we need to convert into numbers
    for (var i = 0; i < arrayString.length; i++) {
        if (arrayString[i] !== null) {
            arrayFinal.push(parseFloat(arrayString[i]));
        } else {
            arrayFinal.push(null);
        }
    }
    Highcharts.chart('container', {
        chart: {
            type: 'spline'
        },
        title: {
            text: indicatorName
        },
        tooltip: {
            valueDecimals: 2,
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}%</b><br/>'
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        subtitle: {
            text: 'Source: World Bank Data'
        },
        xAxis: {
            categories: yearList.reverse() // .reverse() to have the min year on the left
        },
        series: [{
            name: countryName,
            data: arrayFinal.reverse() //
        }]
    });

}).catch(function (error) {
    console.log(error);
});
