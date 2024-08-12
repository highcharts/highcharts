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
        text: '2024'
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
            name: 'India',
            y: 1441719852
        }, {
            name: 'China',
            y: 1425178782
        }, {
            name: 'United States',
            y: 341814420
        }, {
            name: 'Indonesia',
            y: 279798049
        }, {
            name: 'Pakistan',
            y: 245209815
        }, {
            name: 'Nigeria',
            y: 229152217
        }, {
            name: 'Brazil',
            y: 217637297
        }, {
            name: 'Bangladesh',
            y: 174701211
        }, {
            name: 'Russia',
            y: 143957079
        }, {
            name: 'Ethiopia',
            y: 129719719
        }]
    }]

});
