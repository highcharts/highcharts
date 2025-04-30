/* *
 *
 *   (c) 2010-2025 Highsoft AS
 *
 *  Author: Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  Dynamic light/dark theme based on CSS variables
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { DefaultOptions } from '../../Core/Options';

import D from '../../Core/Defaults.js';
const { setOptions } = D;

/* *
 *
 *  Theme
 *
 * */

/**
 * The color variable names and values are copied from highcharts.css
 */
const styleSheet = `
:root,
.highcharts-light {
    /* Colors for data series and points */
    --highcharts-color-0: #2caffe;
    --highcharts-color-1: #544fc5;
    --highcharts-color-2: #00e272;
    --highcharts-color-3: #fe6a35;
    --highcharts-color-4: #6b8abc;
    --highcharts-color-5: #d568fb;
    --highcharts-color-6: #2ee0ca;
    --highcharts-color-7: #fa4b42;
    --highcharts-color-8: #feb56a;
    --highcharts-color-9: #91e8e1;

    /* Chart background, point stroke for markers and columns etc */
    --highcharts-background-color: #ffffff;

    /*
    Neutral colors, grayscale by default. The default colors are defined by
    mixing the background-color with neutral, with a weight corresponding to
    the number in the name.

    https://www.highcharts.com/samples/highcharts/css/palette-helper
    */

    /* Strong text. */
    --highcharts-neutral-color-100: #000000;

    /* Main text, axis labels and some strokes. */
    --highcharts-neutral-color-80: #333333;

    /* Axis title, connector fallback. */
    --highcharts-neutral-color-60: #666666;

    /* Credits text, export menu stroke. */
    --highcharts-neutral-color-40: #999999;

    /* Disabled texts, button strokes, crosshair etc. */
    --highcharts-neutral-color-20: #cccccc;

    /* Grid lines etc. */
    --highcharts-neutral-color-10: #e6e6e6;

    /* Minor grid lines etc. */
    --highcharts-neutral-color-5: #f2f2f2;

    /* Tooltip background, button fills, map null points. */
    --highcharts-neutral-color-3: #f7f7f7;

    /*
    Highlights, shades of blue by default
    */

    /* Drilldown clickable labels, color axis max color. */
    --highcharts-highlight-color-100: #0022ff;

    /* Selection marker, menu hover, button hover, chart border, navigator
    series. */
    --highcharts-highlight-color-80: #334eff;

    /* Navigator mask fill. */
    --highcharts-highlight-color-60: #667aff;

    /* Ticks and axis line. */
    --highcharts-highlight-color-20: #ccd3ff;

    /* Pressed button, color axis min color. */
    --highcharts-highlight-color-10: #e6e9ff;

    /* Indicators */
    --highcharts-positive-color: #06b535;
    --highcharts-negative-color: #f21313;

    /* Transparent colors for annotations */
    --highcharts-annotation-color-0: rgba(130, 170, 255, 0.4);
    --highcharts-annotation-color-1: rgba(139, 191, 216, 0.4);
    --highcharts-annotation-color-2: rgba(150, 216, 192, 0.4);
    --highcharts-annotation-color-3: rgba(156, 229, 161, 0.4);
    --highcharts-annotation-color-4: rgba(162, 241, 130, 0.4);
    --highcharts-annotation-color-5: rgba(169, 255, 101, 0.4);
}

@media (prefers-color-scheme: dark) {
    :root {
        /* UI colors */
        --highcharts-background-color: rgb(48, 48, 48);

        /*
            Neutral color variations
            https://www.highcharts.com/samples/highcharts/css/palette-helper
        */
        --highcharts-neutral-color-100: rgb(255, 255, 255);
        --highcharts-neutral-color-80: rgb(214, 214, 214);
        --highcharts-neutral-color-60: rgb(173, 173, 173);
        --highcharts-neutral-color-40: rgb(133, 133, 133);
        --highcharts-neutral-color-20: rgb(92, 92, 92);
        --highcharts-neutral-color-10: rgb(71, 71, 71);
        --highcharts-neutral-color-5: rgb(61, 61, 61);
        --highcharts-neutral-color-3: rgb(57, 57, 57);

        /* Highlight color variations */
        --highcharts-highlight-color-100: rgb(122, 167, 255);
        --highcharts-highlight-color-80: rgb(108, 144, 214);
        --highcharts-highlight-color-60: rgb(94, 121, 173);
        --highcharts-highlight-color-20: rgb(65, 74, 92);
        --highcharts-highlight-color-10: rgb(58, 63, 71);
    }
}

.highcharts-dark {
    /* UI colors */
    --highcharts-background-color: rgb(48, 48, 48);

    /* Neutral color variations */
    --highcharts-neutral-color-100: rgb(255, 255, 255);
    --highcharts-neutral-color-80: rgb(214, 214, 214);
    --highcharts-neutral-color-60: rgb(173, 173, 173);
    --highcharts-neutral-color-40: rgb(133, 133, 133);
    --highcharts-neutral-color-20: rgb(92, 92, 92);
    --highcharts-neutral-color-10: rgb(71, 71, 71);
    --highcharts-neutral-color-5: rgb(61, 61, 61);
    --highcharts-neutral-color-3: rgb(57, 57, 57);

    /* Highlight color variations */
    --highcharts-highlight-color-100: rgb(122, 167, 255);
    --highcharts-highlight-color-80: rgb(108, 144, 214);
    --highcharts-highlight-color-60: rgb(94, 121, 173);
    --highcharts-highlight-color-20: rgb(65, 74, 92);
    --highcharts-highlight-color-10: rgb(58, 63, 71);
}
`;

namespace DynamicDefaultTheme {

    /* *
     *
     *  Constants
     *
     * */

    /**
     * The options are generated using the highcharts/css/palette-helper
     * sample
     */
    export const options: DeepPartial<DefaultOptions> = {
        global: {
            buttonTheme: {
                fill: 'var(--highcharts-neutral-color-3)',
                stroke: 'var(--highcharts-neutral-color-20)',
                style: {
                    color: 'var(--highcharts-neutral-color-80)'
                },
                states: {
                    hover: {
                        fill: 'var(--highcharts-neutral-color-10)'
                    },
                    select: {
                        fill: 'var(--highcharts-highlight-color-10)',
                        style: {
                            color: 'var(--highcharts-neutral-color-100)'
                        }
                    },
                    disabled: {
                        style: {
                            color: 'var(--highcharts-neutral-color-20)'
                        }
                    }
                }
            }
        },
        chart: {
            borderColor: 'var(--highcharts-highlight-color-80)',
            backgroundColor: 'var(--highcharts-background-color)',
            plotBorderColor: 'var(--highcharts-neutral-color-20)'
        },
        title: {
            style: {
                color: 'var(--highcharts-neutral-color-80)'
            }
        },
        subtitle: {
            style: {
                color: 'var(--highcharts-neutral-color-60)'
            }
        },
        caption: {
            style: {
                color: 'var(--highcharts-neutral-color-60)'
            }
        },
        plotOptions: {
            line: {
                marker: {
                    lineColor: 'var(--highcharts-background-color)',
                    states: {
                        select: {
                            fillColor: 'var(--highcharts-neutral-color-20)',
                            lineColor: 'var(--highcharts-neutral-color-100)'
                        }
                    }
                }
            },
            area: {
                marker: {
                    lineColor: 'var(--highcharts-background-color)',
                    states: {
                        select: {
                            fillColor: 'var(--highcharts-neutral-color-20)',
                            lineColor: 'var(--highcharts-neutral-color-100)'
                        }
                    }
                }
            },
            spline: {
                marker: {
                    lineColor: 'var(--highcharts-background-color)',
                    states: {
                        select: {
                            fillColor: 'var(--highcharts-neutral-color-20)',
                            lineColor: 'var(--highcharts-neutral-color-100)'
                        }
                    }
                }
            },
            areaspline: {
                marker: {
                    lineColor: 'var(--highcharts-background-color)',
                    states: {
                        select: {
                            fillColor: 'var(--highcharts-neutral-color-20)',
                            lineColor: 'var(--highcharts-neutral-color-100)'
                        }
                    }
                }
            },
            column: {
                states: {
                    select: {
                        color: 'var(--highcharts-neutral-color-20)',
                        borderColor: 'var(--highcharts-neutral-color-100)'
                    }
                },
                borderColor: 'var(--highcharts-background-color)'
            },
            bar: {
                states: {
                    select: {
                        color: 'var(--highcharts-neutral-color-20)',
                        borderColor: 'var(--highcharts-neutral-color-100)'
                    }
                },
                borderColor: 'var(--highcharts-background-color)'
            },
            scatter: {
                marker: {
                    lineColor: 'var(--highcharts-background-color)',
                    states: {
                        select: {
                            fillColor: 'var(--highcharts-neutral-color-20)',
                            lineColor: 'var(--highcharts-neutral-color-100)'
                        }
                    }
                }
            },
            pie: {
                borderColor: 'var(--highcharts-background-color)'
            },
            hlc: {
                states: {
                    select: {
                        color: 'var(--highcharts-neutral-color-20)',
                        borderColor: 'var(--highcharts-neutral-color-100)'
                    }
                },
                borderColor: 'var(--highcharts-background-color)'
            },
            ohlc: {
                states: {
                    select: {
                        color: 'var(--highcharts-neutral-color-20)',
                        borderColor: 'var(--highcharts-neutral-color-100)'
                    }
                },
                borderColor: 'var(--highcharts-background-color)'
            },
            candlestick: {
                states: {
                    select: {
                        color: 'var(--highcharts-neutral-color-20)',
                        borderColor: 'var(--highcharts-neutral-color-100)'
                    }
                },
                borderColor: 'var(--highcharts-background-color)',
                lineColor: 'var(--highcharts-neutral-color-100)',
                upColor: 'var(--highcharts-background-color)'
            },
            flags: {
                states: {
                    hover: {
                        lineColor: 'var(--highcharts-neutral-color-100)',
                        fillColor: 'var(--highcharts-highlight-color-20)'
                    },
                    select: {
                        color: 'var(--highcharts-neutral-color-20)',
                        borderColor: 'var(--highcharts-neutral-color-100)'
                    }
                },
                borderColor: 'var(--highcharts-background-color)',
                fillColor: 'var(--highcharts-background-color)'
            },
            map: {
                states: {
                    hover: {
                        borderColor: 'var(--highcharts-neutral-color-60)'
                    },
                    select: {
                        color: 'var(--highcharts-neutral-color-20)'
                    }
                },
                nullColor: 'var(--highcharts-neutral-color-3)',
                borderColor: 'var(--highcharts-neutral-color-10)'
            },
            mapline: {
                states: {
                    hover: {
                        borderColor: 'var(--highcharts-neutral-color-60)'
                    },
                    select: {
                        color: 'var(--highcharts-neutral-color-20)'
                    }
                },
                nullColor: 'var(--highcharts-neutral-color-3)',
                borderColor: 'var(--highcharts-neutral-color-10)'
            },
            mappoint: {
                marker: {
                    lineColor: 'var(--highcharts-background-color)',
                    states: {
                        select: {
                            fillColor: 'var(--highcharts-neutral-color-20)',
                            lineColor: 'var(--highcharts-neutral-color-100)'
                        }
                    }
                },
                dataLabels: {
                    style: {
                        color: 'var(--highcharts-neutral-color-100)'
                    }
                }
            },
            bubble: {
                marker: {
                    states: {
                        select: {
                            fillColor: 'var(--highcharts-neutral-color-20)',
                            lineColor: 'var(--highcharts-neutral-color-100)'
                        }
                    }
                }
            },
            mapbubble: {
                marker: {
                    states: {
                        select: {
                            fillColor: 'var(--highcharts-neutral-color-20)',
                            lineColor: 'var(--highcharts-neutral-color-100)'
                        }
                    }
                }
            },
            heatmap: {
                marker: {
                    states: {
                        select: {
                            fillColor: 'var(--highcharts-neutral-color-20)',
                            lineColor: 'var(--highcharts-neutral-color-100)'
                        }
                    }
                },
                nullColor: 'var(--highcharts-neutral-color-3)'
            }
        },
        legend: {
            borderColor: 'var(--highcharts-neutral-color-40)',
            navigation: {
                activeColor: 'var(--highcharts-highlight-color-100)',
                inactiveColor: 'var(--highcharts-neutral-color-20)'
            },
            itemStyle: {
                color: 'var(--highcharts-neutral-color-80)'
            },
            itemHoverStyle: {
                color: 'var(--highcharts-neutral-color-100)'
            },
            itemHiddenStyle: {
                color: 'var(--highcharts-neutral-color-60)'
            },
            bubbleLegend: {
                labels: {
                    style: {
                        color: 'var(--highcharts-neutral-color-100)'
                    }
                }
            }
        },
        loading: {
            style: {
                backgroundColor: 'var(--highcharts-background-color)'
            }
        },
        tooltip: {
            backgroundColor: 'var(--highcharts-background-color)',
            style: {
                color: 'var(--highcharts-neutral-color-80)'
            }
        },
        credits: {
            style: {
                color: 'var(--highcharts-neutral-color-40)'
            }
        },
        xAxis: {
            labels: {
                style: {
                    color: 'var(--highcharts-neutral-color-80)'
                }
            },
            title: {
                style: {
                    color: 'var(--highcharts-neutral-color-60)'
                }
            },
            minorGridLineColor: 'var(--highcharts-neutral-color-5)',
            minorTickColor: 'var(--highcharts-neutral-color-40)',
            lineColor: 'var(--highcharts-neutral-color-80)',
            gridLineColor: 'var(--highcharts-neutral-color-10)',
            tickColor: 'var(--highcharts-neutral-color-80)'
        },
        yAxis: {
            labels: {
                style: {
                    color: 'var(--highcharts-neutral-color-80)'
                }
            },
            title: {
                style: {
                    color: 'var(--highcharts-neutral-color-60)'
                }
            },
            minorGridLineColor: 'var(--highcharts-neutral-color-5)',
            minorTickColor: 'var(--highcharts-neutral-color-40)',
            lineColor: 'var(--highcharts-neutral-color-80)',
            gridLineColor: 'var(--highcharts-neutral-color-10)',
            tickColor: 'var(--highcharts-neutral-color-80)',
            stackLabels: {
                style: {
                    color: 'var(--highcharts-neutral-color-100)'
                }
            }
        },
        scrollbar: {
            barBackgroundColor: 'var(--highcharts-neutral-color-20)',
            barBorderColor: 'var(--highcharts-neutral-color-20)',
            buttonArrowColor: 'var(--highcharts-neutral-color-80)',
            buttonBackgroundColor: 'var(--highcharts-neutral-color-10)',
            buttonBorderColor: 'var(--highcharts-neutral-color-20)',
            trackBorderColor: 'var(--highcharts-neutral-color-20)'
        },
        navigator: {
            handles: {
                backgroundColor: 'var(--highcharts-neutral-color-5)',
                borderColor: 'var(--highcharts-neutral-color-40)'
            },
            outlineColor: 'var(--highcharts-neutral-color-40)',
            xAxis: {
                gridLineColor: 'var(--highcharts-neutral-color-10)',
                labels: {
                    style: {
                        color: 'var(--highcharts-neutral-color-100)'
                    }
                }
            }
        },
        rangeSelector: {
            inputStyle: {
                color: 'var(--highcharts-highlight-color-80)'
            },
            labelStyle: {
                color: 'var(--highcharts-neutral-color-60)'
            }
        },
        colorAxis: {
            labels: {
                style: {
                    color: 'var(--highcharts-neutral-color-80)'
                }
            },
            title: {
                style: {
                    color: 'var(--highcharts-neutral-color-60)'
                }
            },
            minorGridLineColor: 'var(--highcharts-neutral-color-5)',
            minorTickColor: 'var(--highcharts-neutral-color-40)',
            lineColor: 'var(--highcharts-neutral-color-80)',
            gridLineColor: 'var(--highcharts-background-color)',
            tickColor: 'var(--highcharts-neutral-color-80)',
            marker: {
                color: 'var(--highcharts-neutral-color-40)'
            },
            minColor: 'var(--highcharts-highlight-color-10)',
            maxColor: 'var(--highcharts-highlight-color-100)'
        },
        mapNavigation: {
            buttonOptions: {
                style: {
                    color: 'var(--highcharts-neutral-color-60)'
                },
                theme: {
                    fill: 'var(--highcharts-background-color)',
                    stroke: 'var(--highcharts-neutral-color-10)'
                }
            }
        },
        accessibility: {
            keyboardNavigation: {
                focusBorder: {
                    style: {
                        color: 'var(--highcharts-highlight-color-80)'
                    }
                }
            }
        },
        drilldown: {
            activeAxisLabelStyle: {
                color: 'var(--highcharts-highlight-color-100)'
            },
            activeDataLabelStyle: {
                color: 'var(--highcharts-highlight-color-100)'
            }
        },
        navigation: {
            buttonOptions: {
                symbolFill: 'var(--highcharts-neutral-color-60)',
                symbolStroke: 'var(--highcharts-neutral-color-60)',
                theme: {
                    fill: 'var(--highcharts-background-color)'
                }
            },
            menuStyle: {
                background: 'var(--highcharts-background-color)'
            },
            menuItemStyle: {
                color: 'var(--highcharts-neutral-color-80)'
            },
            menuItemHoverStyle: {
                background: 'var(--highcharts-neutral-color-5)'
            }
        }
    };

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Apply the theme.
     */
    export function apply(): void {

        // Add a style sheet
        const style = document.createElement('style');
        style.nonce = 'highcharts';
        style.innerText = styleSheet;
        document.getElementsByTagName('head')[0].appendChild(style);

        // Apply the theme
        setOptions(options);
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DynamicDefaultTheme;
