/* *
 *
 *  Test cases for the exporting module declarations.
 *
 *  (c) 2018 Highsoft AS. All rights reserved.
 *
 * */

import * as Highcharts from 'highcharts';
import "highcharts/modules/exporting";

test_buttonTheme();

/**
 * Tests the documented `style` and `states` members of the button theme, both
 * on the shared `navigation.buttonOptions` and on the inheriting
 * `exporting.buttons.contextButton`. #24856
 */
function test_buttonTheme() {
    Highcharts.chart('container', {
        navigation: {
            buttonOptions: {
                theme: {
                    fill: '#ffffff',
                    stroke: 'none',
                    style: {
                        color: '#335cad',
                        fontWeight: 'bold'
                    },
                    states: {
                        hover: {
                            fill: '#e6e6e6'
                        },
                        select: {
                            fill: '#e6e6e6',
                            style: {
                                color: '#000000'
                            }
                        },
                        disabled: {
                            style: {
                                color: '#cccccc'
                            }
                        }
                    }
                }
            }
        },
        exporting: {
            buttons: {
                contextButton: {
                    theme: {
                        fill: '#ffffff',
                        style: {
                            color: '#335cad'
                        },
                        states: {
                            hover: {
                                fill: '#e6e6e6'
                            }
                        }
                    }
                }
            }
        },
        series: [{
            type: 'line',
            data: [1, 2, 3]
        }]
    });
}
