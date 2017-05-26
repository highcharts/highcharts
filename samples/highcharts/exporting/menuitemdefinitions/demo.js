
Highcharts.chart('container', {

    title: {
        text: 'Modify context button menu items'
    },

    subtitle: {
        text: 'Removed some items and added a custom item'
    },

    credits: {
        enabled: false
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }],

    exporting: {
        menuItemDefinitions: {
            // Custom definition
            label: {
                onclick: function () {
                    this.renderer.label(
                        'You just clicked a custom menu item',
                        100,
                        100
                    )
                    .attr({
                        fill: '#a4edba',
                        r: 5,
                        padding: 10,
                        zIndex: 10
                    })
                    .css({
                        fontSize: '1.5em'
                    })
                    .add();
                },
                text: 'Show label'
            }
        },
        buttons: {
            contextButton: {
                menuItems: ['downloadPNG', 'downloadSVG', 'separator', 'label']
            }
        }
    }

});