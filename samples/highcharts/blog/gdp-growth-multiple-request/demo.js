// Set up URL request

var urlCountry = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@22a6cc01/samples/data/worldbank-country.json';
var urlRegion = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@22a6cc01/samples/data/worldbank-region.json';
var urlIncome = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@22a6cc01/samples/data/worldbank-income.json';
var urlWorld = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@22a6cc01/samples/data/worldbank-indicator.json';


var date = [],
    arrayCountry = [],
    arrayRegion = [],
    arrayIncome = [],
    arrayWorld = [],
    arrayStringCountry = [],
    arrayStringRegion = [],
    arrayStringIncome = [],
    arrayStringWorld = [],
    countryName,
    regionName,
    incomeName,
    indicatorName;


fetch(urlCountry).then(function (response) {
    return response.json();
}).then(function (result) {

    result[1].forEach(function (data) {
        countryName = data.country.value;
        // fill the string data array
        arrayStringCountry.push(data.value);
    });
    fetch(urlRegion).then(function (response) {
        return response.json();
    }).then(function (result) {
        result[1].forEach(function (data) {
            regionName = data.country.value;
            arrayStringRegion.push(data.value);
        });
        fetch(urlIncome).then(function (response) {
            return response.json();
        }).then(function (result) {
            result[1].forEach(function (data) {
                incomeName = data.country.value;
                arrayStringIncome.push(data.value);
            });
            fetch(urlWorld).then(function (response) {
                return response.json();
            }).then(function (result) {
                result[1].forEach(function (data) {
                    indicatorName = data.indicator.value;
                    // fill the date array
                    date.push(data.date);
                    arrayStringWorld.push(data.value);
                });

                // querry send string that we need to convert into numbers or null
                for (var i = 0;
                    i < arrayStringWorld.length; i++) { // we use world lenght since the world serie is supposed to be  the longer (the one with no missing values)
                    if (arrayStringCountry[i] !== null) {
                        arrayCountry.push(parseFloat(
                            arrayStringCountry[i]));
                    } else {
                        arrayCountry.push(null);
                    }

                    if (arrayStringRegion[i] !== null) {
                        arrayRegion.push(parseFloat(
                            arrayStringRegion[i]));
                    } else {
                        arrayRegion.push(null);
                    }

                    if (arrayStringIncome[i] !== null) {
                        arrayIncome.push(parseFloat(
                            arrayStringIncome[i]));
                    } else {
                        arrayIncome.push(null);
                    }

                    if (arrayStringWorld[i] !== null) {
                        arrayWorld.push(parseFloat(
                            arrayStringWorld[i]));
                    } else {
                        arrayWorld.push(null);
                    }
                }

                // Create the Chart
                var chart = new Highcharts.Chart({

                    chart: {
                        type: 'spline',
                        renderTo: 'container'
                    },
                    colors: ['#6e9fc5', '#ffdf51', '#a6ca6d', '#ad46d6', '#f26a2e', '#00adef', '#f4bb90'],
                    title: {
                        text: indicatorName,
                        style: {
                            fontSize: '14px'
                        }
                    },
                    type: 'spline',
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
                        categories: date.reverse()
                    }, // .reverse() to have the min year on the left
                    series: [{
                        name: countryName,
                        data: arrayCountry.reverse()
                    }, {
                        name: regionName,
                        data: arrayRegion.reverse()
                    }, {
                        name: incomeName,
                        data: arrayIncome.reverse()
                    }, {
                        name: 'World',
                        data: arrayWorld.reverse()
                    }]
                }); // end highcharts
            }).catch(function (error) {
                console.log('there was an error 1!', error);
            });
        }).catch(function (error) {
            console.log('there was an error 2!', error);
        });
    }).catch(function (error) {
        console.log('there was an error 3!', error);
    });
}).catch(function (error) {
    console.log('there was an error 4!', error);
});
