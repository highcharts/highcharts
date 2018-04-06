(function (global) {

    /**
     * Creates a new container in the DOM tree.
     *
     * @return {HTMLElement}
     * The DOM element of the container
     */
    function createContainer() {
        var container = global.document.createElement('div');
        container.style.left = '0';
        container.style.positon = 'absolute';
        container.style.top = '0';
        global.document.body.appendChild(container);
        return container;
    }


    /**
     * Creates a deep copy of entries and properties.
     *
     * @param {array|object} source
     * The source to copy from.
     *
     * @param {object} propertiesTree
     * The properties tree to copy.
     *
     * @return {array|object}
     * The copy of the source.
     */
    function treeCopy(source, propertiesTree) {
        if (!source) {
            return source;
        }
        switch (typeof source) {
            default:
                return source;
            case 'array':
                return JSON.parse(JSON.stringify(source));
            case 'object':
                var copy = {};
                for (var key in propertiesTree) {
                    if (propertiesTree.hasOwnProperty(key)) {
                        copy[key] = treeCopy(source[key], propertiesTree[key]);
                    } else {
                        copy[key] = undefined; // eslint-disable-line no-undefined
                    }
                }
                return copy;
        }
    }
    global.treeCopy = treeCopy;

    /**
     * Changes options of a chart.
     *
     * @param {object} chart
     * The chart as reference
     *
     * @param {object} newOptions
     * The new chart options as replacement
     *
     * @return {object}
     * Container with the old chart options, that have been replaced
     */
    function replaceChartOptions(chart, newOptions) {
        if (typeof newOptions !== 'object' ||
            newOptions === null
        ) {
            return {};
        }
        var oldOptions = treeCopy(chart.options, newOptions);
        chart.update(newOptions);
        return oldOptions;
    }

    var chartTemplates = {};

    /**
     * This class creates a new template for testing on generic charts. It also
     * provides static functions to use registered templates in test cases.
     *
     * @param {string} name
     * The reference name of the chart
     *
     * @param {Highcharts.Chart} chartConstructor
     * The chart constructor function for the template
     *
     * @param {object} chartOptions
     * The default chart Options for the template
     *
     * @return {ChartTemplate}
     * The new chart template
     */
    function ChartTemplate(name, chartConstructor, chartOptions) {

        if (!(this instanceof ChartTemplate)) {
            return new ChartTemplate(name, chartConstructor, chartOptions);
        }

        var chart = chartConstructor(createContainer(), chartOptions);

        /**
         * The chart instance of the chart template
         *
         * @type {Highcharts.Chart}
         */
        Object.defineProperty(this, 'chart', {
            configurable: false,
            enumerable: true,
            get: function () {
                return chart;
            }
        });

        /**
         * The name of the chart template
         *
         * @type {string}
         */
        Object.defineProperty(this, 'name', {
            configurable: false,
            enumerable: true,
            get: function () {
                return name;
            }
        });

    }

    /**
     * Prepares a chart template for a test. This function works asynchronously.
     *
     * @param {string} name
     * The reference name of the template to prepare for the test
     *
     * @param {object|undefind} chartOptions
     * The additional options to customize the chart of the template
     *
     * @param {function} testCallback
     * The callback with the prepared chart template as the first argument
     *
     * @param {function} finishCallback
     * The callback after test end and template reset
     *
     * @return {void}
     */
    ChartTemplate.test = function (
        name,
        chartOptions,
        testCallback,
        finishCallback
    ) {

        var chartTemplate = chartTemplates[name];

        if (chartTemplate) {
            var originalChartOptions = replaceChartOptions(
                chartTemplate.chart,
                chartOptions
            );
            try {
                testCallback(chartTemplate);
                return;
            } finally {
                try {
                    finishCallback();
                } finally {
                    chartTemplate.chart.update(originalChartOptions);
                }
            }
        }

        var loadingTimeout = null,
            templateScript = global.document.createElement('script');

        templateScript.onload = function () {
            global.clearTimeout(loadingTimeout);
            ChartTemplate.test(
                name,
                chartOptions,
                testCallback,
                finishCallback
            );
        };

        loadingTimeout = global.setTimeout(function () {
            global.document.body.removeChild(templateScript);
            throw new Error(
                'Preparing chart template "' + name +
                '" resulted in a timeout during loading.'
            );
        }, 2000);

        templateScript.src = '/base/test/templates/' + name + '.js';

        global.document.body.appendChild(templateScript);

    };

    /**
     * Registers a chart template for addition
     *
     * @param {ChartTemplate} chartTemplate
     * The chart template to register
     *
     * @return {void}
     */
    ChartTemplate.registerTemplate = function (chartTemplate) {
        if (!(chartTemplate instanceof global.ChartTemplate)) {
            return;
        }
        if (chartTemplates[chartTemplate.name]) {
            throw new Error('Chart template already registered.');
        } else {
            chartTemplates[chartTemplate.name] = chartTemplate;
        }
    };

    /**
     * The registered chart templates
     *
     * @type {Array<ChartTemplate>}
     */
    Object.defineProperty(ChartTemplate, 'templates', {
        configurable: false,
        enumerable: true,
        get: function () {
            return chartTemplates;
        }
    });

    // Prevent changes to ChartTemplate properties
    Object.freeze(ChartTemplate);

    // Publish ChartTemplate in global scope
    Object.defineProperty(global, 'ChartTemplate', {
        configurable: false,
        enumerable: true,
        value: ChartTemplate,
        writable: false
    });

}(this));
