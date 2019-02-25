/*
    This is an advanced demo showing how to create custom accessibility
    functionality for a chart. This allows us to add elements to the
    keyboard navigation, as well as perform accessibility related tasks
    whenever updates are made to the chart.
*/

// Create a basic chart
var chart = Highcharts.chart('container', {
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
});


// Add a custom button. We add this to the chart, and store it in our own
// namespace to avoid conflicts with other chart properties.
chart.myNamespace = {};
chart.myNamespace.myButton = chart.renderer.button(
    'button', 60, 10, function () {
        alert('Custom Button Pressed');
    }
).add();


// Create the custom accessibility component for the chart. This class inherits
// from the AccessibilityComponent class.
var CustomComponent = function (chart) {
    this.initBase(chart);
};
CustomComponent.prototype = new Highcharts.AccessibilityComponent();
Highcharts.extend(CustomComponent.prototype, {

    // Perform tasks to be done when the chart is updated
    onChartUpdate: function () {
        // Get our button if it exists, and set attributes on it
        var namespace = this.chart.myNamespace || {};
        if (namespace.myButton) {
            namespace.myButton.attr({
                role: 'button',
                tabindex: -1
            });
        }
    },

    // Define keyboard navigation for this component
    getKeyboardNavigation: function () {
        var keys = this.keyCodes,
            chart = this.chart,
            namespace = chart.myNamespace || {},
            component = this;

        return new Highcharts.KeyboardNavigationModule(chart, {
            keyCodeMap: [
                // On arrow/tab we just move to the next chart element.
                // If we had multiple buttons we wanted to group together,
                // we could move between them here.
                [[
                    keys.tab, keys.up, keys.down, keys.left, keys.right
                ], function (keyCode, e) {
                    return this.response[
                        keyCode === this.tab && e.shiftKey ||
                        keyCode === keys.left || keyCode === keys.up ?
                            'prev' : 'next'
                    ];
                }],

                // Space/enter means we click the button
                [[
                    keys.space, keys.enter
                ], function () {
                    // Fake a click event on the button element
                    var buttonElement = namespace.myButton &&
                            namespace.myButton.element;
                    if (buttonElement) {
                        component.fakeClickEvent(buttonElement);
                    }
                    return this.response.success;
                }]
            ],

            // Focus button initially
            init: function () {
                var buttonElement = namespace.myButton &&
                        namespace.myButton.element;
                if (buttonElement && buttonElement.focus) {
                    buttonElement.focus();
                }
            }
        });
    }
});


// Update the chart with the new component, also adding it in the keyboard
// navigation order
chart.update({
    accessibility: {
        customComponents: {
            customComponent: new CustomComponent(chart)
        },
        keyboardNavigation: {
            order: ['customComponent', 'series', 'chartMenu', 'legend']
        }
    }
});
