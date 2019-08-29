/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/

/* *
 *
 *  Types
 *
 * */

/**
 * Constructor for a test chart
 */
type TestChartConstructor = (
    container: (string|Highcharts.HTMLDOMElement),
    options: Highcharts.Options
) => Highcharts.Chart;

/**
 * Callback for one test
 */
type TestTemplateCallback = (testTemplate: TestTemplate) => void;

/**
 * Initializer for each test
 */
type TestTemplateInitializer =(
    this: Highcharts.Chart,
    chartOptions: Highcharts.Options
) => void;

/* *
 *
 *  Interfaces
 *
 * */

interface TestChart extends Highcharts.Chart {
    template?: string;
}

interface TestTemplateCase {
    chartOptions: Highcharts.Options;
    testCallback: TestTemplateCallback;
}

interface TestTemplateRegistry {
    name: string;
    chartConstructor: TestChartConstructor;
    chartOptions: Highcharts.Options;
    testInitializer: TestTemplateInitializer;
}

/* *
 *
 *  Classes
 *
 * */

/**
 * This class creates a new template for testing on generic charts. It also
 * provides static functions to use registered templates in test cases.
 */
class TestTemplate {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * The registered chart templates
     */
    public static templates: Highcharts.Dictionary<TestTemplate|TestTemplateRegistry> = {};

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Creates a new container in the DOM tree.
     */
    private static createContainer (): HTMLElement {

        var container = document.createElement('div'),
            containerStyle = container.style;

        containerStyle.left = '0';
        containerStyle.position = 'absolute';
        containerStyle.top = '0';

        document.body.appendChild(container);

        return container;
    }

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
    public static register = function (
        name: string,
        chartConstructor: TestChartConstructor,
        chartOptions: Highcharts.Options,
        testInitializer: TestTemplateInitializer = undefined
    ) {

        if (TestTemplate.templates[name]) {
            throw new Error('Chart template already registered');
        }

        TestTemplate.templates[name] = {
            name: name,
            chartConstructor: chartConstructor,
            chartOptions: chartOptions,
            testInitializer: testInitializer
        };
    }

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
    public static test (
        name: string,
        chartOptions: Highcharts.Options = {},
        testCallback: TestTemplateCallback = undefined
    ) {

        let template = TestTemplate.templates[name];

        if (!template) {
            throw new Error('Template "' + name + '" is not registered');
        }

        if (!(template instanceof TestTemplate)) {
            TestTemplate.templates[name] = template = new TestTemplate(
                template.name,
                template.chartConstructor,
                template.chartOptions,
                template.testInitializer
            );
        }

        template.test(chartOptions, testCallback);
    }

    /**
     * Creates a deep copy of entries and properties.
     *
     * @param source
     *        The source to copy from.
     *
     * @param propertiesTree
     *        The properties tree to copy.
     */
    private static treeCopy (source: any, propertiesTree: any): any {

        if (!source ||
            typeof source !== 'object'
        ) {
            return source;
        }

        // @todo handle arrays (peek into karma-setup how it is handled there)

        var copy = {} as any;

        for (var key in propertiesTree) {
            if (propertiesTree.hasOwnProperty(key) &&
                source.hasOwnProperty(key)
            ) {
                copy[key] = TestTemplate.treeCopy(
                    source[key], propertiesTree[key]
                );
            } else {
                copy[key] = undefined;
            }
        }

        return copy;
    }

    /**
     * Listens on the update event of a chart and saves changes for the
     * returned undo function.
     *
     * @param chart
     *        The instance of the chart
     */
    private static updateUndoFor(chart: Highcharts.Chart): Function {

        var undoStack = [] as Array<Highcharts.Options>,
            removeEvent: Function;

        removeEvent = Highcharts.addEvent(
            chart,
            'update',
            function (args: any) {
                undoStack.push(
                    TestTemplate.treeCopy(chart.options, args.options)
                );
            }
        );

        return function () {

            removeEvent();

            let undoOption;

            while (!!(undoOption = undoStack.pop())) {
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
    constructor (
        name: string,
        chartConstructor: TestChartConstructor,
        chartOptions: Highcharts.Options,
        testInitializer?: TestTemplateInitializer
    ) {

        if (!(this instanceof TestTemplate)) {
            return new TestTemplate(
                name, chartConstructor, chartOptions, testInitializer
            );
        }

        this.chart = chartConstructor(
            TestTemplate.createContainer(), chartOptions
        );
        this.chart.template = name;
        this.name = name;
        this.ready = true;
        this.testCases = [];
        this.testInitializer = testInitializer;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The name of the chart template
     */
    public name: string;

    /**
     * The chart instance of the chart template
     */
    public chart: TestChart;

    /**
     * The state of the chart template
     */
    public ready: boolean;

    /**
     * The queue of waiting test cases for the chart template
     */
    public testCases: Array<TestTemplateCase>;

    /**
     * An initializer for each test case (optional)
     */
    public testInitializer?: TestTemplateInitializer;

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
    public test (
        chartOptions: Highcharts.Options = {},
        testCallback: TestTemplateCallback = undefined
    ) {

        const chart = this.chart;
        const testInitializer = this.testInitializer;

        this.testCases.push({
            chartOptions: chartOptions,
            testCallback: testCallback
        });

        if (!this.ready) {
            return;
        }

        this.ready = false;

        try {

            let testCase: (TestTemplateCase|undefined);
            while (!!(testCase = this.testCases.shift())) {

                let undoUpdates: (Function|undefined);

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
    }
}
