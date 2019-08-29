/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/
/* *
 *
 *  Classes
 *
 * */
/**
 * This class creates a new template for testing on generic charts. It also
 * provides static functions to use registered templates in test cases.
 */
var TestTemplate = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * This class creates a new template for testing on generic charts. It also
     * provides static functions to use registered templates in test cases.
     *
     * @param name
     *        The reference name of the chart.
     *
     * @param chartConstructor
     *        The chart factory function for the template.
     *
     * @param chartOptions
     *        The default chart Options for the template.
     *
     * @param testInitializer
     *        The initializer function for a test case. (optional)
     */
    function TestTemplate(name, chartConstructor, chartOptions, testInitializer) {
        if (!(this instanceof TestTemplate)) {
            return new TestTemplate(name, chartConstructor, chartOptions, testInitializer);
        }
        this.chart = chartConstructor(TestTemplate.createContainer(), chartOptions);
        this.chart.template = name;
        this.name = name;
        this.ready = true;
        this.testCases = [];
        this.testInitializer = testInitializer;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Creates a new container in the DOM tree.
     */
    TestTemplate.createContainer = function () {
        var container = document.createElement('div'), containerStyle = container.style;
        containerStyle.left = '0';
        containerStyle.position = 'absolute';
        containerStyle.top = '0';
        document.body.appendChild(container);
        return container;
    };
    /**
     * Prepares a chart template for a test. This function works asynchronously.
     *
     * @param name
     *        The reference name of the template to prepare for the test.
     *
     * @param chartOptions
     *        The additional options to customize the chart of the template.
     *
     * @param testCallback
     *        The callback with the prepared chart template as the first
     *        argument.
     */
    TestTemplate.test = function (name, chartOptions, testCallback) {
        if (chartOptions === void 0) { chartOptions = {}; }
        if (testCallback === void 0) { testCallback = undefined; }
        var template = TestTemplate.templates[name];
        if (!template) {
            throw new Error('Template "' + name + '" is not registered');
        }
        if (!(template instanceof TestTemplate)) {
            TestTemplate.templates[name] = template = new TestTemplate(template.name, template.chartConstructor, template.chartOptions, template.testInitializer);
        }
        template.test(chartOptions, testCallback);
    };
    /**
     * Creates a deep copy of entries and properties.
     *
     * @param source
     *        The source to copy from.
     *
     * @param propertiesTree
     *        The properties tree to copy.
     */
    TestTemplate.treeCopy = function (source, propertiesTree) {
        if (!source ||
            typeof source !== 'object') {
            return source;
        }
        // @todo handle arrays (peek into karma-setup how it is handled there)
        var copy = {};
        for (var key in propertiesTree) {
            if (propertiesTree.hasOwnProperty(key) &&
                source.hasOwnProperty(key)) {
                copy[key] = TestTemplate.treeCopy(source[key], propertiesTree[key]);
            }
            else {
                copy[key] = undefined;
            }
        }
        return copy;
    };
    /**
     * Listens on the update event of a chart and saves changes for the
     * returned undo function.
     *
     * @param chart
     *        The instance of the chart
     */
    TestTemplate.updateUndoFor = function (chart) {
        var undoStack = [], removeEvent;
        removeEvent = Highcharts.addEvent(chart, 'update', function (args) {
            undoStack.push(TestTemplate.treeCopy(chart.options, args.options));
        });
        return function () {
            removeEvent();
            var undoOption;
            while (!!(undoOption = undoStack.pop())) {
                chart.update(undoOption, false, true, false);
            }
        };
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Creates a test case for the current template chart and add it to the
     * queue array.
     *
     * @param chartOptions
     *        Additional options for the chart
     *
     * @param testCallback
     *        The callback to test the chart
     */
    TestTemplate.prototype.test = function (chartOptions, testCallback) {
        if (chartOptions === void 0) { chartOptions = {}; }
        if (testCallback === void 0) { testCallback = undefined; }
        var chart = this.chart;
        var testInitializer = this.testInitializer;
        this.testCases.push({
            chartOptions: chartOptions,
            testCallback: testCallback
        });
        if (!this.ready) {
            return;
        }
        this.ready = false;
        try {
            var testCase = void 0;
            while (!!(testCase = this.testCases.shift())) {
                var undoUpdates = void 0;
                try {
                    undoUpdates = TestTemplate.updateUndoFor(chart);
                    if (typeof testInitializer === 'function') {
                        testInitializer.call(chart, testCase.chartOptions);
                    }
                    chart.update(testCase.chartOptions, true, true, false);
                    chart.container.style.zIndex = '9999';
                    testCase.testCallback(this);
                }
                finally {
                    if (typeof undoUpdates === 'function') {
                        undoUpdates();
                    }
                    chart.container.style.zIndex = '';
                }
            }
        }
        finally {
            this.ready = true;
        }
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * The registered chart templates
     */
    TestTemplate.templates = {};
    /**
     * Registers a chart template for additional tests
     *
     * @param name
     *        The reference name of the chart.
     *
     * @param chartConstructor
     *        The chart factory function for the template.
     *
     * @param chartOptions
     *        The default chart options for the template.
     *
     * @param testInitializer
     *        The initializer function for a test case. (optional)
     */
    TestTemplate.register = function (name, chartConstructor, chartOptions, testInitializer) {
        if (testInitializer === void 0) { testInitializer = undefined; }
        if (TestTemplate.templates[name]) {
            throw new Error('Chart template already registered');
        }
        TestTemplate.templates[name] = {
            name: name,
            chartConstructor: chartConstructor,
            chartOptions: chartOptions,
            testInitializer: testInitializer
        };
    };
    return TestTemplate;
}());
