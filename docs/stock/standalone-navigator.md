Standalone Navigator
====================

The Standalone Navigator is a versatile Highcharts component, designed to synchronize and manipulate the viewing range across multiple charts. This tool enables users to easily control the range of one or more charts by interacting with a single navigator interface. It's particularly useful in dashboards and data analysis applications where viewing different data sets in parallel is essential.

## Creating the Standalone Navigator

To initialize the Standalone Navigator, use the `navigator` constructor with the container reference and configuration options:

```javascript
Highcharts.navigator('container', {
    // Standalone Navigator configuration options
});
```
The configuration options for the Standalone Navigator are the same as those for a chart navigator, and can be found in the [API documentation](https://api.highcharts.com/highstock/navigator).

<iframe style="width: 100%; height: 650px; border: none;" src=https://www.highcharts.com/samples/embed/stock/standalone-navigator/styled-standalone-navigator allow="fullscreen"></iframe>

## Including the Standalone Navigator in a Project
The Standalone Navigator can be included in a project in two ways:
- As a separate module, alongside Highcharts:
```html
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/navigator.js"></script>
```

- As a bundled package that includes both Highcharts and the Navigator:
```html
<script src="https://code.highcharts.com/standalone-navigator.js"></script>
```

## Binding Charts to the Navigator

The `bind` method binds a chart or an axis to the Standalone Navigator. Once a chart is bound, any range adjustments made using the navigator are automatically reflected in the bound chart. See the [bind method documentation](https://api.highcharts.com/class-reference/Highcharts.StandaloneNavigator#bind) for more details.

The `unbind` method is used to detach a chart or axis from the Standalone Navigator. This method can unbind either a single chart or all charts bound to the navigator simultaneously. Detaching charts from the navigator stops it from influencing their range. See the [unbind method documentation](https://api.highcharts.com/class-reference/Highcharts.StandaloneNavigator#unbind) for additional information.

## Managing Navigator Range

The `setRange` method allows programmatic control of the navigator's range. This method not only updates the navigator's range but also synchronizes this change with all bound charts. Additionally, it triggers the `setRange` event.

The `getRange` method retrieves the current range of the Standalone Navigator, enabling users to view or use the navigator's existing range settings.

See the [setRange](https://api.highcharts.com/class-reference/Highcharts.StandaloneNavigator#setRange) and [getRange](https://api.highcharts.com/class-reference/Highcharts.StandaloneNavigator#getRange) methods documentation for more details.

## API

For comprehensive information on all available features and options, refer to the API reference for the [Standalone Navigator](https://api.highcharts.com/class-reference/Highcharts.StandaloneNavigator).
