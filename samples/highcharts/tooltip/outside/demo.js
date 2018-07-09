
Highcharts.chart('container1', {

    chart: {
        type: 'column',
        borderWidth: 1
    },

    title: {
        text: 'Column chart'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr']
    },

    legend: {
        enabled: false
    },

    tooltip: {
        outside: true
    },

    series: [{
        name: 'Really, really long series name 1',
        data: [1, 4, 2, 3]
    }, {
        name: 'Really, really long series name 2',
        data: [4, 2, 5, 3]
    }, {
        name: 'Really, really long series name 2',
        data: [6, 5, 3, 1]
    }, {
        name: 'Really, really long series name 2',
        data: [6, 4, 2, 1]
    }]

});


Highcharts.chart('container2', {

    chart: {
        type: 'line',
        borderWidth: 1
    },

    title: {
        text: 'Line chart'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr']
    },

    legend: {
        enabled: false
    },

    tooltip: {
        outside: true
    },

    series: [{
        name: 'Really, really long series name 1',
        data: [1, 4, 2, 3]
    }, {
        name: 'Really, really long series name 2',
        data: [4, 2, 5, 3]
    }, {
        name: 'Really, really long series name 2',
        data: [6, 5, 3, 1]
    }, {
        name: 'Really, really long series name 2',
        data: [6, 4, 2, 1]
    }]

});


Highcharts.chart('container3', {

    chart: {
        type: 'bar',
        borderWidth: 1
    },

    title: {
        text: 'Bar chart'
    },

    subtitle: {
        text: 'tooltip.useHTML = true'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr']
    },

    legend: {
        enabled: false
    },

    tooltip: {
        outside: true,
        useHTML: true
    },

    series: [{
        name: 'Really, really long series name 1',
        data: [1, 4, 2, 3]
    }, {
        name: 'Really, really long series name 2',
        data: [4, 2, 5, 3]
    }, {
        name: 'Really, really long series name 2',
        data: [6, 5, 3, 1]
    }, {
        name: 'Really, really long series name 2',
        data: [6, 4, 2, 1]
    }]

});


