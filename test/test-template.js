/* global Highcharts, QUnit */

(function (global) {

    /**
     * Creates a deep copy of entries or properties.
     *
     * @param {array|object} source
     * The source properties to copy.
     *
     * @return {array|object}
     * The copy of the source.
     */
    function deepCopy(source) { // eslint-disable-line no-unused-vars
        return JSON.parse(JSON.stringify(source));
    }

    /**
     * Changes the options of a chart.
     *
     * @param {object} chartOptions
     * The curent chart options as reference
     *
     * @param {object} newOptions
     * The new chart options as replacement
     *
     * @param {boolean} preserveOld
     * True, to deep copy old chart options and return them
     *
     * @return {object}
     * The old chart options, that are replaced, or an empty object
     */
    function replaceChartOptions(chartOptions, newOptions, preserveOld) {

        var oldOptions = {};

        try {
            Highcharts.objectEach(newOptions, function (value, key) {

                if (preserveOld) {
                    oldOptions[key] = deepCopy(chartOptions[key]);
                }

                chartOptions[key] = value;

            });
        } catch (error) {
            global.console.error(error);
        }

        return oldOptions;
    }

    /**
     * The test templates provides a fast system to test on a generic chart with
     * custom changes.
     *
     * @param {string} templateName
     * The template type to test again. See ./test/templates for possible
     * options.
     *
     * @param {object} chartOptions
     * Additional chart options for the tests.
     *
     * @param {function} testCallback
     * The function callback with the chart template to do tests on.
     *
     * @return {void}
     */
    global.testTemplate = function (templateName, chartOptions, testCallback) {

        var templateChart = global.testTemplate[templateName],
            originalChartOptions = {};

        QUnit.module('Template ' + templateName, {
            beforeEach: function () {
                originalChartOptions = replaceChartOptions(
                    templateChart.options,
                    chartOptions,
                    true
                );
            },
            afterEach: function () {
                replaceChartOptions(
                    templateChart.options,
                    originalChartOptions,
                    false
                );
            }
        });

        if (templateChart) {

            Function.call(templateChart, testCallback, templateChart);

        } else {

            var templateScript = global.document.createElement('script');

            templateScript.addEventListener('load', function () {

                templateChart = global.testTemplate[templateName];

                if (!templateChart) {
                    throw new Error('Loading template ' + templateName + ' failed.');
                }
            });
        }

    };

}(this));
