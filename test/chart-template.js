/* global Highcharts */
(function (global) {

    /* *
     *
     *  Private Properties
     *
     * */

    /**
     * The chart template registry
     *
     * @type {Dictionary<ChartTemplate>}
     */
    var chartTemplates = {};

    /* *
     *
     *  Private Functions
     *
     * */

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
                    if (propertiesTree.hasOwnProperty(key) &&
                        source.hasOwnProperty(key)
                    ) {
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
     * Attachs to the update event of a chart.
     *
     * @param {Highcharts.Chart} chart
     * The instance of the chart
     *
     * @param {Array<object>} optionsStorage
     * The array with previous chart options
     *
     * @return {function}
     * Remove function to stop the attachment
     */
    function attachUpdate(chart, optionsStorage) {
        return Highcharts.addEvent(chart, 'update', function (newOptions) {
            optionsStorage.push(treeCopy(chart.options, newOptions));
        });
    }

    /* *
     *
     *  Constructor
     *
     * */

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

        var chart = chartConstructor(createContainer(), chartOptions),
            testCases = [];

        /* *
         *
         *  Instance Properties
         *
         * */

        /**
         * The name of the template as a flag in the chart
         *
         * @type {string}
         */
        chart.template = name;
        /* //
        Object.defineProperty(chart, 'template', {
            configurable: false,
            enumerable: true,
            get: function () {
                return name;
            }
        }); // */

        /**
         * The chart instance of the chart template
         *
         * @type {Highcharts.Chart}
         */
        this.chart = chart;
        /* //
        Object.defineProperty(this, 'chart', {
            configurable: false,
            enumerable: true,
            get: function () {
                return chart;
            }
        }); // */

        /**
         * The name of the chart template
         *
         * @type {string}
         */
        this.name = name;
        /* //
        Object.defineProperty(this, 'name', {
            configurable: false,
            enumerable: true,
            get: function () {
                return name;
            }
        }); // */

        /**
         * The state of the chart template
         *
         * @type {boolean}
         */
        this.ready = true;
        /* //
        Object.defineProperty(this, 'ready', {
            configurable: false,
            enumerable: true,
            value: true,
            writeable: true
        }); // */

        /**
         * The queue of waiting test cases for the chart template
         *
         * @type {Array<Object>}
         */
        this.testCases = testCases;
        /* //
        Object.defineProperty(this, 'testCases', {
            configurable: false,
            enumerable: true,
            get: function () {
                return testCases;
            }
        }); // */

    }

    /* *
     *
     *  Instance Functions
     *
     * */

    /**
     * Creates a test case for the current template chart and add it to the
     * queue array.
     *
     * @param {object} chartOptions
     * Additional options for the chart
     *
     * @param {function} testCallback
     * The callback to test the chart
     *
     * @return {void}
     */
    ChartTemplate.prototype.test = function (
        chartOptions,
        testCallback
    ) {

        chartOptions = (chartOptions || {});

        var chart = this.chart;

        this.testCases.push({
            chartOptions: chartOptions,
            testCallback: testCallback
        });

        if (!this.ready) {
            return;
        }

        this.ready = false;

        try {
            var testCase;
            while (typeof (testCase = this.testCases.shift()) !== 'undefined') {

                var originalOptions = [treeCopy(
                        chart.options,
                        testCase.chartOptions
                    )],
                    removeUpdate = attachUpdate(chart, originalOptions);

                try {
                    chart.update(testCase.chartOptions, true, true);
                    testCase.testCallback(this);
                } finally {
                    removeUpdate();
                    var originalOption;
                    while (typeof (
                            originalOption = originalOptions.pop()
                        ) !== 'undefined'
                    ) {
                        chart.update(
                            originalOption,
                            false,
                            true
                        );
                    }
                }

            }
        } finally {
            this.ready = true;
        }

    };

    /* *
     *
     *  Static Functions
     *
     * */

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
     * @return {void}
     */
    ChartTemplate.test = function (name, chartOptions, testCallback) {

        if (typeof name !== 'string' ||
            typeof chartOptions !== 'object' ||
            typeof testCallback !== 'function'
        ) {
            throw new Error('Arguments are invalid');
        }

        var chartTemplate = chartTemplates[name];

        if (!chartTemplate) {
            throw new Error('Template "' + name + '" is not registered');
        }

        chartOptions = (chartOptions || {});

        if (!(chartTemplate instanceof ChartTemplate)) {
            chartTemplates[name] = new ChartTemplate(
                chartTemplate.name,
                chartTemplate.chartConstructor,
                chartTemplate.chartOptions
            );
            chartTemplate = chartTemplates[name];
        }

        chartTemplate.test(chartOptions, testCallback);

    };

    /**
     * Registers a chart template for additional tests
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
     * @return {void}
     */
    ChartTemplate.register = function (name, chartConstructor, chartOptions) {

        if (typeof name !== 'string' ||
            typeof chartConstructor !== 'function' ||
            typeof chartOptions !== 'object'
        ) {
            throw new Error('Arguments are invalid');
        }

        if (chartTemplates[name]) {
            throw new Error('Chart template already registered');
        }

        chartTemplates[name] = {
            name,
            chartConstructor,
            chartOptions
        };

    };

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * The registered chart templates
     *
     * @type {Array<ChartTemplate>}
     */
    ChartTemplate.templates = chartTemplates;
    /* //
    Object.defineProperty(ChartTemplate, 'templates', {
        configurable: false,
        enumerable: true,
        get: function () {
            return chartTemplates;
        }
    }); // */

    /* *
     *
     *  Global
     *
     * */

    global.ChartTemplate = ChartTemplate;

    /* // Prevent changes to ChartTemplate properties
    Object.freeze(ChartTemplate);
    Object.freeze(ChartTemplate.prototype);
    // */

    /* // Publish ChartTemplate in global scope
    Object.defineProperty(global, 'ChartTemplate', {
        configurable: false,
        enumerable: true,
        value: ChartTemplate,
        writable: false
    }); // */

}(this));
