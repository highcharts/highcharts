


Highcharts.getOptions().lang.editInCloud = 'Edit in Cloud';
Highcharts.getOptions().exporting.buttons.contextButton.menuItems.push(
    'separator',
    'editInCloud'
);
Highcharts.getOptions().exporting.menuItemDefinitions.editInCloud = {
    textKey: 'editInCloud',
    onclick: function () {
        this.editInCloud();
    }
};


Highcharts.chart('container', {

    title: {
        text: 'Edit in Highcharts Cloud'
    },

    subtitle: {
        text: 'Use the context menu to send to the Cloud Editor'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        type: 'column'
    }, {
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4].reverse(),
        type: 'spline'
    }]

});
