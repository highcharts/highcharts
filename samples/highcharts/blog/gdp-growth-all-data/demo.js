function displayData() {

    var iso2 = document.getElementById('Country_Select').value;
    // Get indicator code from SelectList
    var ind = document.getElementById('Ind_Select').value;
    var end = document.getElementById('end').value;
    var start = document.getElementById('start').value;
    var url = 'https://api.worldbank.org/v2/countries/' + iso2 + '/indicators/' + ind + '?date=' + start + ':' + end + '&format=json';


    var arrayString = [],
        date = [],
        arrayFinal = [],
        indicatorName,
        countryName;

    fetch(url).then(function (response) {
        return response.json();
    }).then(function (result) {

        result[1].forEach(function (data) {
            countryName = data.country.value;
            indicatorName = data.indicator.value;
            // fill the date array
            date.push(data.date);
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
                type: 'spline',
                renderTo: 'container'
            },
            title: {
                text: indicatorName + ' in ' + countryName
            },
            subtitle: {
                text: 'Source: World Bank Data'
            },
            tooltip: {
                valueDecimals: 2,
                pointFormat: '<span style="color: { point.color }">\u25CF</span> {series.name}: <b>{point.y}%</b><br/>'
            },
            xAxis: {
                categories: date.reverse() // .reverse() to have the min year on the left
            },
            series: [{
                name: countryName,
                data: arrayFinal.reverse()
            }]
        });
    }).catch(function (error) {
        console.log(error);
    });
}
