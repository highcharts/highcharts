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
            y: 1444216107
        }, {
            name: 'India',
            y: 1393409038
        }, {
            name: 'United States',
            y: 332915073
        }, {
            name: 'Indonesia',
            y: 276361783
        }, {
            name: 'Pakistan',
            y: 225199937
        }, {
            name: 'Brazil',
            y: 213993437
        }, {
            name: 'Nigeria',
            y: 211400708
        }, {
            name: 'Bangladesh',
            y: 166303498
        }, {
            name: 'Russia',
            y: 145912025
        }, {
            name: 'Mexico',
            y: 130262216
        }]
    }]

});
