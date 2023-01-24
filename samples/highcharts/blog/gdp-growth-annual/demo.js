var lenght = 20;
var url = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@22a6cc01/samples/data/worldbank.json';


var arrayString = [],
    date = [],
    array1 = [],
    array2 = [],
    array3 = [],
    array4 = [];

var indicatorName,
    countryName1,
    countryName2,
    countryName3,
    countryName4;

fetch(url).then(function (response) {
    return response.json();
}).then(function (result) {


    result[1].forEach((data, index) => {

        if (index === 1) {
            countryName1 = data.country.value;
        }

        if (index === lenght) {
            countryName2 = data.country.value;
        }

        if (index === lenght * 2) {
            countryName3 = data.country.value;
        }

        if (index === lenght * 3) {
            countryName4 = data.country.value;
        }

        indicatorName = data.indicator.value;
        // fill the date array
        date.push(data.date);
        // fill the string data array
        arrayString.push(data.value);

    });
    // querry send string that we need to convert into numbers
    for (var i = 0; i < arrayString.length; i++) {

        if (i < lenght) {

            if (arrayString[i] !== null) {
                array1.push(parseFloat(arrayString[i]));
            } else {
                array1.push(null);
            }
        }

        if (i >= lenght && i < lenght * 2) {

            if (arrayString[i] !== null) {
                array2.push(parseFloat(arrayString[i]));
            } else {
                array2.push(null);
            }
        }

        if (i >= lenght * 2 && i < lenght * 3) {

            if (arrayString[i] !== null) {
                array3.push(parseFloat(arrayString[i]));
            } else {
                array3.push(null);
            }
        }

        if (i >= lenght * 3 && i < lenght * 4) {

            if (arrayString[i] !== null) {
                array4.push(parseFloat(arrayString[i]));
            } else {
                array4.push(null);
            }
        }

    }


    Highcharts.chart('container', {
        chart: {
            type: 'spline'
        },
        colors: ['#6e9fc5', '#ffdf51', '#a6ca6d', '#ad46d6', '#f26a2e', '#00adef', '#f4bb90'],
        title: {
            text: indicatorName
        },
        subtitle: {
            text: 'Source: World Bank Data'
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        xAxis: {
            categories: date.reverse() // .reverse() to have the min year on the left
        },
        tooltip: {
            valueDecimals: 2,
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}%</b><br/>'
        },

        series: [{
            name: countryName1,
            data: array1.reverse()
        }, {
            name: countryName2,
            data: array2.reverse()
        }, {
            name: countryName3,
            data: array3.reverse()
        }, {
            name: countryName4,
            data: array4.reverse()
        }]
    });
}).catch(function () {
    console.log('there was an error!');

});
