/**
 * Events generator for Stock tools
 *
 * (c) 2009-2018 Paweł Fus
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';

var addEvent = H.addEvent,
    doc = H.doc,
    objectEach = H.objectEach,
    PREFIX = 'highcharts-';

H.Toolbar.prototype.features = {
    'infinity-line': {
        start: function (e) {
            var chart = this.chart,
                x = chart.xAxis[0].toValue(e.chartX),
                y = chart.yAxis[0].toValue(e.chartY),
                options = {
                    type: 'infinity-line',
                    // type: 'ray' || 'line',
                    typeOptions: {
                        type: 'line',
                        // startArrow: true,
                        endArrow: true,
                        points: [{
                            x: x,
                            y: y
                        }, {
                            x: x,
                            y: y
                        }],
                        xAxis: 0,
                        yAxis: 0
                    },
                    events: {
                        click: function () {
                            this.cpVisibility = !this.cpVisibility;
                            this.setControlPointsVisibility(this.cpVisibility);
                        }
                    },
                    shapeOptions: {
                        strokeWidth: 2
                    }
                };

            this.currentAnnotation = chart.addAnnotation(options);
            this.nextEvent = this.mouseMoveEvent = this.selectedButton.steps[0];

        },
        steps: [
            function (e) {
                var chart = this.chart,
                    options = this.currentAnnotation.options.typeOptions,
                    x = chart.xAxis[0].toValue(e.chartX),
                    y = chart.yAxis[0].toValue(e.chartY);


                this.currentAnnotation.update({
                    typeOptions: {
                        points: [
                            options.points[0],
                            {
                                x: x,
                                y: y
                            }
                        ]
                    }
                });
                this.nextEvent = this.selectedButton.end;
            }
        ],
        end: function () {
            this.currentAnnotation.added = true;
            this.currentAnnotation = null;
            this.nextEvent = false;
            this.mouseMoveEvent = false;
            // this.deselectButton();
        }
    },
    'crooked-line': {
        start: function () {

        }
    },
    'vertical-arrows': {
        start: function () {

        }
    },
    'pitchfork': {
        start: function () {

        }
    },
    'measure': {
        start: function () {

        }
    },
    'parallel-channel': {
        start: function () {

        }
    },
    'line': {
        start: function () {

        }
    },
    'arrow': {
        start: function () {

        }
    },
    'circle': {
        start: function () {

        }
    },
    'rect': {
        start: function () {

        }
    },
    'tunnel': {
        start: function () {

        }
    },
    'fibonacci': {
        start: function () {

        }
    },
    'simple-text': {
        start: function () {

        }
    },
    'flag': {
        start: function () {

        }
    },
    'zoom-in': {
        start: function () {

        }
    },
    'zoom-out': {
        start: function () {

        }
    },
    'full-screen': {
        start: function () {

        }
    },
    'horizontal-price': {
        start: function () {

        }
    },
    'indicators': {
        start: function () {

        }
    },
    'show-hide-all': {
        start: function () {

        }
    },
    'save-chart': {
        start: function () {

        }
    }
};

addEvent(H.Toolbar, 'afterInit', function () {
    var toolbar = this;
    objectEach(toolbar.features, function (events, className) {
        var element = doc.getElementsByClassName(PREFIX + className)[0];
        if (element) {
            addEvent(
                element,
                'click',
                function () {
                    toolbar.nextEvent = events.start;
                    toolbar.selectedButton = events;
                }
            );
        }
    });
});

addEvent(H.Chart, 'load', function () {
    var toolbar = this.stockToolbar;
    if (toolbar) {
        addEvent(this, 'click', function (e) {
            if (toolbar.nextEvent) {
                toolbar.nextEvent.call(toolbar, e);
            }
        });
        addEvent(this.container, 'mousemove', function (e) {
            if (toolbar.mouseMoveEvent) {
                toolbar.mouseMoveEvent.call(toolbar, e);
            }
        });
    }
});
