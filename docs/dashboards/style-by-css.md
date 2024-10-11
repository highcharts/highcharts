Style by CSS
===

By default each Dashboard and most of its element is styled by CSS. It gives you the
ability to change the look and feel of the dashboard. Most of the elements
have classes that you can use to style them. You can also add your own classes
or ids to the elements.

If you prefer to use your own layout structure, feel free to use it as well. Only what you need is disable the gui by option. Please remember that each container should have an unique `id` for rendered component.

```js
    gui: {
        enabled: false
    }
```

[Here is the standalone demo](https://www.highcharts.com/samples/embed/dashboards/gui/custom-layout).
[Here is the tailwind demo](https://www.highcharts.com/samples/embed/dashboards/gui/custom-layout-tailwind).

*Please note that disabled GUI does not allow you to use the [Edit Mode](https://www.highcharts.com/docs/dashboards/edit-mode) module.

## Importing the CSS
The CSS is not included in the library but you can import it like that:
```css
@import url("https://code.highcharts.com/dashboards/css/dashboards.css");
@import url("https://code.highcharts.com/dashboards/css/datagrid.css");
```

Note that each component has its own CSS file. You can import only the CSS
files that you need.

## General classes
Each of the class name contains a prefix `highcharts-dashboards` and a suffix that
describes the element.   
For example, the class name for the dashboard's row is `highcharts-dashboards-row`.

We can distinguish a few main elements and their classes:
- `highcharts-dashboards` - the main class for the dashboard
- `highcharts-dashboards-row` - the class for the dashboard's row
- `highcharts-dashboards-cell` - the class for the dashboard's cell
- `highcharts-dashboards-component` - the class for the dashboard's component

The rest of the classes are specific for each component or element.

To access and style the whole dashboard, its background and component you can use:
```css
.highcharts-dashboards,
.highcharts-dashboards-wrapper {
    background-color: #f2f9fd;
}
```

To style the dashboard's row:
```css
.highcharts-dashboards-row {
    padding: 10px;
}
```

To style the dashboard's cell:
```css
.highcharts-dashboards-cell {
    text-align: left;
}
```

To style the dashboard's component div and its content:
```css
.highcharts-dashboards-component {
    border-radius: 10px;
}
```

## Component classes
Each component has the generic component CSS class `highcharts-dashboards-component`
and its own CSS class specific for the component. For example, the KPI component
has the class `highcharts-dashboards-component-kpi`.

To style the dashboard's component title:
```css
.highcharts-dashboards-component-title {
    font-size: 12px;
}
```

To style the dashboard's component subtitle:
```css
.highcharts-dashboards-component-subtitle {
    font-size: 10px;
}
```

### KPI Component
To style the dashboard's KPI component div and its content:
```css
.highcharts-dashboards-component-kpi {
    border-radius: 10px;
}
```

To style the dashboard's KPI value:
```css
.highcharts-dashboards-component-kpi-value {
    color: red;
}
```

### Highcharts Component
To style the dashboard's Highcharts component div and its content:
```css
.highcharts-dashboards-component-highcharts {
    background-color: gray;
}
```

To individually style the dashboard's Highcharts chart please find more information on how to [style Highcharts Chart.](https://www.highcharts.com/docs/chart-design-and-style/style-by-css)

### DataGrid Component
To style the dashboard's DataGrid component div and its content:
```css
.highcharts-datagrid-container {
    border-radius: 10px;
}
```

To style the dashboard's DataGrid header:
```css
.highcharts-datagrid-column-header {
    background-color: gray;
}
```

To style the dashboard's DataGrid row:
```css
.highcharts-datagrid-row {
    background-color: gray;
}
```

Note that you can use the child selector to style even and odd rows:
```css
.highcharts-datagrid-row:nth-child(even) {
    background-color: white;
}
```

### HTML Component
Since the whole structure of the HTML component is defined by the user, it differs between the use cases.
Thus it is recommended to use the custom classes and IDs to style it.
More information is in the section below.

## Custom classes
In the dashboard config each component or its element can have a custom class or id.
You can use it to define better CSS selectors and style the dashboard.

See how the HTML component was configured and how the `id` and `class` were used:
```ts
{
    type: 'HTML',
    renderTo: 'dashboard-row-1-cell-3',
    elements: [
        {
            tagName: 'div',
            children: [
                {
                    tagName: 'h4',
                    textContent: 'Check how you can save more!',
                    attributes: {
                        class: 'main-title'
                    }
                },
                {
                    tagName: 'button',
                    textContent: 'Go to the saving account',
                    attributes: {
                        id: 'saving-button'
                    }
                }
            ]
        }
    ]
},
```

These custom classes and ids can be used to style the dashboard:
```css
#saving-button {
    border: none;
    cursor: pointer;
}
```

The final result might look like:

<iframe src="https://www.highcharts.com/samples/embed/dashboards/demo/personal-finance" allow="fullscreen"></iframe>

## Edit Mode classes
You can also change how the Edit Mode looks like. The Edit mode is based on the
elements like the sidebar, toolbar, popup, etc. Each of them has its own class
that you can use to style it.

### Confirmation popup
To style the dashboard's popup:
```css
.highcharts-dashboards-confirmation-popup {
    border-radius: 10px;
}
```

To style the dashboard's overlay:
```css
.highcharts-dashboards-overlay {
    background-color: gray;
}
```

To style the dashboard's popup close button:
```css
.highcharts-dashboards-popup-close {
    background-color: gray;
}
```

### Sidebar (Accordion menu)

To style the dashboard's accordion menu in the sidebar:
```css
.highcharts-dashboards-accordion-menu {
    background-color: gray;
}
```

To style the dashboard's sidebar header in the accordion menu:
```css
.highcharts-dashboards-accordion-header {
    font-size: 12px;
}
```
### Toolbars

To style the dashboard's toolbar in the Edit Mode:
```css
.highcharts-dashboards-toolbar {
    background-color: gray;
}
```

### Highlights

To style the highlights of edited cell:
```css
.highcharts-dashboards-toolbar-cell-outline {
    border-color: red;
}
```

To style the highlights of edited row:
```css
.highcharts-dashboards-toolbar-row-outline {
    border-color: blue;
}
```
