---
sidebar_label: "Responsive grid"
---

# Responsive grid

The `responsive.rules[]` option lets you override Grid configuration based on the rendered grid size. The API follows the same design and principles as Highcharts Core responsive rules.

Each rule contains:
- `condition`: when the rule is active.
- `gridOptions`: which Grid options to apply while active.

```js
Grid.grid('container', {
    data: {
        columns: {...}
    },
    header: ['firstName', 'lastName', 'email', 'mobile', 'address'],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 800
            },
            gridOptions: {
                header: ['lasttName', 'email', 'mobile']
            }
        }]
    }
});
```

## Rule conditions

You can use one or more of these condition keys:
- `maxWidth`
- `maxHeight`
- `minWidth`
- `minHeight`
- `callback`

When multiple condition keys are set in the same rule, all must match for the rule to apply.

```js
responsive: {
    rules: [{
        condition: {
            maxWidth: 700,
            minHeight: 400
        },
        gridOptions: {
            pagination: {
                pageSize: 10
            }
        }
    }]
}
```

The optional `callback` gives full control over rule matching:

```js
{
    rendering: {
        theme: 'custom-theme'
    },
    responsive: {
        rules: [{
            condition: {
                callback: function (grid) {
                    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                    return isTouchDevice;
                }
            },
            gridOptions: {
                rendering: {
                    theme: 'custom-theme custom-touch-theme'
                }
            }
        }]
    }
}
```

## Rule evaluation and merge behavior

- Rules are evaluated from top to bottom.
- More than one rule can be active at the same time.
- Active rules are merged in order, so later matching rules can override earlier matching rules.
- The responsive check is based on the Grid container size, not the browser window size.

## Typical use cases

Typical responsive use cases in Grid include:
- Simplifying `header` on narrow layouts.
- Adjusting `pagination` for mobile (for example fewer page buttons and smaller `pageSize`).
- Changing column-level options at smaller sizes.

Example: responsive pagination for mobile.

```js
Grid.grid('container', {
    data: {
        columns: {...}
    },
    pagination: {
        enabled: true,
        pageSize: 25,
        controls: {
            pageButtons: {
                enabled: true,
                count: 7
            }
        }
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 600
            },
            gridOptions: {
                pagination: {
                    pageSize: 10,
                    controls: {
                        pageSizeSelector: false,
                        firstLastButtons: false,
                        pageButtons: {
                            enabled: true,
                            count: 3
                        }
                    }
                }
            }
        }]
    }
});
```

See a live sample [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-lite/basic/responsive-rules/).

See the [API reference](https://api.highcharts.com/grid/responsive) for available rule options.
