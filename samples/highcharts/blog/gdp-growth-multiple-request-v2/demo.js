var regionList = ['Africa', 'Arab World', 'Central Europe and the Baltics', 'East Asia & Pacific (all income levels)', 'East Asia & Pacific (developing only)', 'Europe & Central Asia (all income levels)', 'Europe & Central Asia (developing only)', 'European Union', 'Latin America & Caribbean (all income levels)', 'Latin America & Caribbean (developing only)', 'Least developed countries: UN classification', 'Middle East & North Africa (all income levels)', 'Middle East & North Africa (developing only)', 'North America', 'South Asia', 'Sub-Saharan Africa (all income levels)', 'Sub-Saharan Africa (developing only)', 'Sub-Saharan Africa (excluding high income)'];
var incomeList = ['High income', 'High income: OECD', 'High income: nonOECD', 'Low income', 'Middle income', 'Lower middle income', 'Upper middle income', 'Low & middle income', 'OECD members'];
var worldList = ['World', 'world', 'WLD'];

// Settings
var url = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@22a6cc01/samples/data/worldbank2.json';

var arrayRegion = [],
    arrayIncome = [],
    arrayCountry = [],
    arrayWorld = [],
    YearList = [],
    CountryName,
    IncomeName,
    RegionName,
    indicatorName;


fetch(url).then(function (response) {
    return response.json();
}).then(function (result) {
    result[1].forEach(data => {
        // test if country name is in regionList
        if (regionList.indexOf(data.country.value) !== -1) {
            // Store Region Name
            RegionName = data.country.value;
            // Append values to arrayRegion
            if (data.value !== null) {
                arrayRegion.push(parseFloat(data.value));
            } else {
                arrayRegion.push(null);
            }
            // test if country name is in incomeList
        } else if (incomeList.indexOf(data.country.value) !== -1) {
            // Store Income name
            IncomeName = data.country.value;
            if (data.value !== null) {
                arrayIncome.push(parseFloat(data.value));
            } else {
                arrayIncome.push(null);
            }
        } else if (worldList.indexOf(data.country.value) !== -1) {
            // fill the Year list array. NB. We choose the World serie to do so, as this serie is the most likely to be complete (i.e. the one with the less missing values)
            YearList.push(data.date);
            // store Indictor Label
            indicatorName = data.indicator.value;
            if (data.value !== null) {
                arrayWorld.push(parseFloat(data.value));
            } else {
                arrayWorld.push(null);
            }
        } else {
            // Finally create the country data vector
            CountryName = data.country.value;
            if (data.value !== null) {
                arrayCountry.push(parseFloat(data.value));
            } else {
                arrayCountry.push(null);
            }
        }
    });
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
        xAxis: {
            categories: YearList.reverse() // .reverse() to have the min year on the left
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        tooltip: {
            valueDecimals: 2,
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}%</b><br/>'
        },
        series: [{
            name: CountryName,
            data: arrayCountry.reverse()
        }, {
            name: RegionName,
            data: arrayRegion.reverse()
        }, {
            name: IncomeName,
            data: arrayIncome.reverse()
        }, {
            name: 'World',
            data: arrayWorld.reverse()
        }]
    });
}).catch(function (error) {
    console.log('there was an error!', error);
});
