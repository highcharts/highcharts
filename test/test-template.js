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
     * @type {Dictionary<TestTemplate>}
     */
    var templates = {};

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
        var container = global.document.createElement('div'),
            containerStyle = container.style;
        containerStyle.left = '0';
        containerStyle.position = 'absolute';
        containerStyle.top = '0';
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
     * Listens on the update event of a chart and saves changes for undo.
     *
     * @param {Highcharts.Chart} chart
     * The instance of the chart
     *
     * @return {function}
     * Undo function to restore original state
     */
    function updateUndoFor(chart) {

        var undoStack = [],
            removeEvent;

        removeEvent = Highcharts.addEvent(chart, 'update',
            function (args) {
                undoStack.push(treeCopy(chart.options, args.options));
            }
        );

        return function () {

            removeEvent();

            var undoOption;
            while (typeof (undoOption = undoStack.pop()) !== 'undefined') {
                chart.update(undoOption, false, true, false);
            }

        };

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
     * The reference name of the chart.
     *
     * @param {function} chartConstructor
     * The chart factory function for the template.
     *
     * @param {object} chartOptions
     * The default chart Options for the template.
     *
     * @param {function} testInitializer
     * The initializer function for a test case. (optional)
     *
     * @return {TestTemplate}
     * The new chart template.
     */
    function TestTemplate(
        name, chartConstructor, chartOptions, testInitializer
    ) {

        if (!(this instanceof TestTemplate)) {
            return new TestTemplate(
                name, chartConstructor, chartOptions, testInitializer
            );
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

        /**
         * The chart instance of the chart template
         *
         * @type {Highcharts.Chart}
         */
        this.chart = chart;

        /**
         * The name of the chart template
         *
         * @type {string}
         */
        this.name = name;

        /**
         * The state of the chart template
         *
         * @type {boolean}
         */
        this.ready = true;

        /**
         * The queue of waiting test cases for the chart template
         *
         * @type {Array<Object>}
         */
        this.testCases = testCases;

        /**
         * An initializer for each test case (optional)
         *
         * @type {function|undefined}
         */
        this.testInitializer = testInitializer;

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
    TestTemplate.prototype.test = function (
        chartOptions,
        testCallback
    ) {

        chartOptions = (chartOptions || {});

        var chart = this.chart,
            testInitializer = this.testInitializer;

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

                var undoUpdates;

                try {

                    undoUpdates = updateUndoFor(chart);

                    if (typeof testInitializer === 'function') {
                        testInitializer.call(chart, testCase.chartOptions);
                    }

                    chart.update(testCase.chartOptions, true, true, false);
                    chart.container.style.zIndex = '9999';
                    testCase.testCallback(this);

                } finally {

                    if (typeof undoUpdates === 'function') {
                        undoUpdates();
                    }

                    chart.container.style.zIndex = '';

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
     * Registers a chart template for additional tests
     *
     * @param {string} name
     * The reference name of the chart.
     *
     * @param {function} chartConstructor
     * The chart factory function for the template.
     *
     * @param {object} chartOptions
     * The default chart options for the template.
     *
     * @param {function} testInitializer
     * The initializer function for a test case. (optional)
     *
     * @return {void}
     */
    TestTemplate.register = function (
        name, chartConstructor, chartOptions, testInitializer
    ) {

        if (typeof name !== 'string' ||
            typeof chartConstructor !== 'function' ||
            typeof chartOptions !== 'object' ||
            (typeof testInitializer !== 'undefined' &&
             typeof testInitializer !== 'function')
        ) {
            throw new Error('Arguments are invalid');
        }

        if (templates[name]) {
            throw new Error('Chart template already registered');
        }

        templates[name] = {
            name: name,
            chartConstructor: chartConstructor,
            chartOptions: chartOptions,
            testInitializer: testInitializer
        };

    };

    /**
     * Prepares a chart template for a test. This function works asynchronously.
     *
     * @param {string} name
     * The reference name of the template to prepare for the test.
     *
     * @param {object|undefind} chartOptions
     * The additional options to customize the chart of the template.
     *
     * @param {function} testCallback
     * The callback with the prepared chart template as the first argument.
     *
     * @return {void}
     */
    TestTemplate.test = function (name, chartOptions, testCallback) {

        if (typeof name !== 'string' ||
            typeof chartOptions !== 'object' ||
            typeof testCallback !== 'function'
        ) {
            throw new Error('Arguments are invalid');
        }

        var template = templates[name];

        if (!template) {
            throw new Error('Template "' + name + '" is not registered');
        }

        chartOptions = (chartOptions || {});

        if (!(template instanceof TestTemplate)) {
            templates[name] = new TestTemplate(
                template.name,
                template.chartConstructor,
                template.chartOptions,
                template.testInitializer
            );
            template = templates[name];
        }

        template.test(chartOptions, testCallback);

    };

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * The registered chart templates
     *
     * @type {Array<TestTemplate>}
     */
    TestTemplate.templates = templates;

    /* *
     *
     *  Global
     *
     * */

    global.TestTemplate = TestTemplate;

}(this));
