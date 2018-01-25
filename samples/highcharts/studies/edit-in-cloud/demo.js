/**
 * Experimental plugin to send a chart's config to the Cloud for editing
 *
 * Limitations
 * - All functions (formatters and callbacks) are removed since they're not
 *   JSON.
 *
 * @todo
 * - Long configs fail
 * - Dynamically updated charts probably fail, we need a generic
 *   Chart.getOptions function that returns all non-default options. Should also
 *   be used by the export module.
 */
(function (H) {

    H.Chart.prototype.editInCloud = function () {
        // Recursively remove function callbacks
        function removeFunctions(ob) {
            Object.keys(ob).forEach(function (key) {
                if (typeof ob[key] === 'function') {
                    delete ob[key];
                }
                if (H.isObject(ob[key])) { // object and not an array
                    removeFunctions(ob[key]);
                }
            });
        }

        var options = H.merge(this.userOptions);
        removeFunctions(options);
        var params = {
            name: (options.title && options.title.text) || 'Chart title',
            options: options,
            settings: {
                constructor: 'Chart',
                dataProvider: {
                    csv: this.getCSV()
                }
            }
        };
        params = JSON.stringify(params);
        params = btoa(params);

        // Open new tab
        var a = document.createElement('a');
        a.href = 'https://cloud.highcharts.com/create?c=' + params;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    };

    H.getOptions().lang.editInCloud = 'Edit in Cloud';
    H.getOptions().exporting.buttons.contextButton.menuItems.push(
        'separator',
        'editInCloud'
    );
    H.getOptions().exporting.menuItemDefinitions.editInCloud = {
        textKey: 'editInCloud',
        onclick: function () {
            this.editInCloud();
        }
    };

}(Highcharts));

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
