// Data retrieved from https://worldpopulationreview.com/countries
Highcharts.chart('container', {

    chart: {
        type: 'lollipop'
    },

    accessibility: {
        point: {
            valueDescriptionFormat: '{index}. {xDescription}, {point.y}.'
        }
    },

    legend: {
        enabled: false
    },

    subtitle: {
        text: '2021'
    },

    title: {
        text: 'Top 10 Countries by Population'
    },

    tooltip: {
        shared: true
    },

    xAxis: {
        type: 'category'
    },

    yAxis: {
        title: {
            text: 'Population'
        }
    },

    series: [{
        name: 'Population',
        data: [{
            name: 'China',
            low: 1444216107
        }, {
            name: 'India',
            low: 1393409038
        }, {
            name: 'United States',
            low: 332915073
        }, {
            name: 'Indonesia',
            low: 276361783
        }, {
            name: 'Pakistan',
            low: 225199937
        }, {
            name: 'Brazil',
            low: 213993437
        }, {
            name: 'Nigeria',
            low: 211400708
        }, {
            name: 'Bangladesh',
            low: 166303498
        }, {
            name: 'Russia',
            low: 145912025
        }, {
            name: 'Mexico',
            low: 130262216
        }]
    }]

});
