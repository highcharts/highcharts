Edit mode
===

Edit mode is a mode in which the user can change the appearance of the dashboard through the User Interface (UI).  
When the dashboard is declared with custom HTML structure, the edit mode is limited to the component settings only.

## Introduction
To be able to use Dashboards with layout system and editmode you first have to load the `layout` module.  
The order of the imports is important, so make sure that the `layout` module is imported after the Dashboards module.

```html
<script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
<script src="https://code.highcharts.com/dashboards/modules/layout.js"></script>
```

Alternatively, you can also use the NPM package.

```bash
npm install highcharts @highcharts/dashboards
```

and import it in your project like:
```js
import * as Dashboards from '@highcharts/dashboards';
import LayoutModule from '@highcharts/dashboards/modules/layout';

LayoutModule(Dashboards);
```

If you use ESM, you can also import the modules directly from the package:

```js
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src.js';
import '@highcharts/dashboards/es-modules/masters/modules/layout.src.js';
```


In addition, this option has to be enabled in the dashboard config:
```js
editMode: {
    enabled: true,
    contextMenu: {
        enabled: true
    }
},
```

Edit mode can now be enabled by the burger menu in the upper right corner.

![edit-mode-context-menu.png](edit-mode-context-menu.png)

When edit mode is enabled, the appearance of the dashboard changes. When hovering over a cell a blue border appears around it. The border of the row containing the cell turns green. Additionally, both the row and the cell get a tooltip, which allows the user to change its position, change its options, or just delete it.

![edit-mode-tooltip.png](edit-mode-tooltip.png)

Note that when dashboard is declared with custom HTML structure, only the component setting can be edited. The layout cannot be changed.

Next to the burger menu, the [Add Component](#add-component) button is added.

## Add Component

Available only when dashboard is declared with the layout system- using the `gui` configuration.

The `Add Component` button allows the user to add a new component. When clicked, a sidebar appears, which lets you choose the type of component you want to add and then by drag&drop component type can be selected and dragged to the correct place, which is also indicated by the drop marker.

The sidebar lists the component types provided by the Dashboards API but only the ones whose modules are loaded. If other types are needed, add the extra modules. The order and the components on the list can be changed by setting the `components` array in the `editMode` option - [API](https://api.highcharts.com/dashboards/#interfaces/Dashboards_EditMode_EditMode.EditMode.Toolbars#sidebar).

In order to add other custom components to the list, please follow the [custom component guide](https://www.highcharts.com/docs/dashboards/custom-component).

![edit-mode-sidebar.png](edit-mode-sidebar.png)

After dragging a component into the preferred place in the layout, a sidebar with the [component settings](https://www.highcharts.com/docs/dashboards/edit-mode#component-settings) will appear.


## Component settings

Each component type has its own properties. The most important ones can be set using the settings sidebar. It opens automatically after adding any component, but it can also be opened by clicking on the gear icon that appears in the toolbar that opens after clicking on a cell in the edit mode.

![edit-mode-settings-button.png](edit-mode-settings-button.png)

Below you can see the settings categories for the [Highcharts Component](https://www.highcharts.com/docs/dashboards/highcharts-component).

![edit-mode-chart-settings.png](edit-mode-chart-settings.png)

The first three categories, `Connector name`, `Title` and `Caption`, are options that are also shared by other components. In `Connector name` you can connect an existing connector that will provide data to the component (in this case, a chart). The rest of the options are typical for this component. You can use them to configure the appearance of the chart.

If you do not intend to use the connector, you can set the data using the component's internal options. In [Highcharts Component](https://www.highcharts.com/docs/dashboards/highcharts-component) you can do this by defining data in the [`series.data`](https://api.highcharts.com/highcharts/series.line.data) option. In the [KPI Component](https://www.highcharts.com/docs/dashboards/kpi-component), by setting the [`value`](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_KPIComponent_KPIComponentOptions.Options#value) option.

Check how the component settings sidebar works in practice using the [edit mode live example](https://www.highcharts.com/docs/dashboards/edit-mode#edit-mode-live-example).

## Customizing the component settings

What is displayed in the settings sidebar can be customized by setting the `editableOptions` property in the component options.

The `editableOptions` property is an array of objects, where each object represents a category in the settings sidebar. Each object can have the following properties:
- `name` - the name of the category,
- `propertyPath` - the path to the property in the component options that should be edited,
- `type` - the type of the input field. It can be one of the following:
    - `input` - a simple text input,
    - `textarea` - a textarea,
    - `toggle` - a toggle switch,
    - `select` - a select input requiring `selectOptions` property,
    - `nested` - a nested category, requiring `nestedOptions` property,
- `isStandalone` - a boolean value that indicates whether the category should be displayed as a standalone category or as a part of the parent category.


```js
    ...
    renderTo: 'dashboard-cell-0',
    type: 'Highcharts',
    editableOptions: [{
        isStandalone: true,
        name: 'Component title',
        propertyPath: ['title'],
        type: 'input'
      }, {
        name: 'chartOptions',
        type: 'nested',
        nestedOptions: [{
          name: 'Marker Radius',
          options: [{
            name: 'Marker Radius',
            propertyPath: [
              'chartOptions',
              'plotOptions',
              'series',
              'marker',
              'radius'
            ],
            type: 'select',
            selectOptions: [{
              name: 3
            }, {
              name: 5
            }]
          }]
        }]
      }
    ]
```
See how it works in the [edit mode live example](https://www.highcharts.com/docs/dashboards/edit-mode/editableoptions).

## Customizing the context menu

The `contextMenu` option also allows you to edit, what should be inside the menu, which shows after clicking on the burger menu.  The items can either be a string like `editMode` if it is a default button, or an object, which defines the button name, `onclick` event and some more options. Here is the example snippet of context menu button configuration:
```js
items: [{
    id: 'custom-id',
    type: 'toggle',
    text: 'Custom Name',
    events: {
        click: function () {
            // onClick Event
        }
    }
}]
```


## Edit mode live example

Use the context menu on the upper-right corner to enable and explore the edit mode.
<iframe style="width: 100%; height: 600px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/edit-mode/ctx-enabled" allow="fullscreen"></iframe>


## Edit mode events

Event listeners can be added to the `board.editMode` object, which will call callback functions when editing the layout or any component.

The available events are:
 - `componentChanged` - fired after accepting changes in the component editing sidebar.
 - `componentChangesDiscarded` - fired after discarding changes in the component editing sidebar.
 - `layoutChanged` - called after changes to the layout are changed. It has 6 types:
    - `newLayout` - called after a new layout was added to a board,
    - `newComponent` - called after a new component was added to a board,
    - `rowDestroyed` - called after a row was deleted,
    - `cellDestroyed` - called after a cell was deleted,
    - `cellDragEnd` - called after a cell was moved,
    - `rowDragEnd` - called after a row was moved.

Example:
```js
U.addEvent(editMode, 'componentChanged', e => {
    console.log('Component Changed', e);
});

U.addEvent(editMode, 'componentChangesDiscarded', e => {
    console.log('Component Changes Discarded', e);
});

U.addEvent(editMode, 'layoutChanged', e => {
    console.log('Layout Changed', e);
});
```

See the live demo [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/edit-mode/events/).

## Styling

All default styles for the edit mode are defined in the `dashboards.css` file. It can be imported to your project by adding the following line to your CSS file:

```css
@import url("https://code.highcharts.com/dashboards/css/datagrid.css");
```

You can override them by adding your own styles to your project, for example:

```css
.highcharts-dashboards-edit-sidebar {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
}
```

Note that most elements used for editing the dashboard (popups, toolbars, handles, etc.) have a high (~9999) z-index value, so they are always on top of the other elements.
If you want to change this behavior, you can override the z-index value in your CSS file.