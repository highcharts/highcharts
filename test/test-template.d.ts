/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/
/**
 * Constructor for a test chart
 */
declare type TestChartConstructor = (container: (string | Highcharts.HTMLDOMElement), options: Highcharts.Options) => Highcharts.Chart;
/**
 * Callback for one test
 */
declare type TestTemplateCallback = (testTemplate: TestTemplate) => void;
/**
 * Initializer for each test
 */
declare type TestTemplateInitializer = (this: Highcharts.Chart, chartOptions: Highcharts.Options) => void;
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
/**
 * This class creates a new template for testing on generic charts. It also
 * provides static functions to use registered templates in test cases.
 */
declare class TestTemplate {
    /**
     * The registered chart templates
     */
    static templates: Highcharts.Dictionary<TestTemplate | TestTemplateRegistry>;
    /**
     * Creates a new container in the DOM tree.
     */
    private static createContainer;
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
    static register: (name: string, chartConstructor: TestChartConstructor, chartOptions: Highcharts.Options, testInitializer?: TestTemplateInitializer) => void;
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
    static test(name: string, chartOptions?: Highcharts.Options, testCallback?: TestTemplateCallback): void;
    /**
     * Creates a deep copy of entries and properties.
     *
     * @param source
     *        The source to copy from.
     *
     * @param propertiesTree
     *        The properties tree to copy.
     */
    private static treeCopy;
    /**
     * Listens on the update event of a chart and saves changes for the
     * returned undo function.
     *
     * @param chart
     *        The instance of the chart
     */
    private static updateUndoFor;
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
    constructor(name: string, chartConstructor: TestChartConstructor, chartOptions: Highcharts.Options, testInitializer?: TestTemplateInitializer);
    /**
     * The name of the chart template
     */
    name: string;
    /**
     * The chart instance of the chart template
     */
    chart: TestChart;
    /**
     * The state of the chart template
     */
    ready: boolean;
    /**
     * The queue of waiting test cases for the chart template
     */
    testCases: Array<TestTemplateCase>;
    /**
     * An initializer for each test case (optional)
     */
    testInitializer?: TestTemplateInitializer;
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
    test(chartOptions?: Highcharts.Options, testCallback?: TestTemplateCallback): void;
}
