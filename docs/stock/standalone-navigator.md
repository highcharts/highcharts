Standalone Navigator
====================

The Standalone Navigator is a versatile Highcharts component, designed to synchronize and manipulate the viewing range across multiple charts. This tool enables users to easily control the range of one or more charts by interacting with a single navigator interface. It's particularly useful in dashboards and data analysis applications where viewing different data sets in parallel is essential.

## Binding Charts to the Navigator

The `bind` method binds chart or axis to the Standalone Navigator. Once a chart is bound, any range adjustments made using the navigator are automatically reflected in the bound chart. See the [bind method documentation](https://api.highcharts.com/class-reference/Highcharts.StandaloneNavigator.bind) for more details.

The `unbind` method is used to detach a chart or axis from the Standalone Navigator. This method can unbind either a single chart or all charts bound to the navigator simultaneously. Detaching charts from the navigator stops it from influencing their range. See the [unbind method documentation](https://api.highcharts.com/class-reference/Highcharts.StandaloneNavigator.unbind) for additional information.

## Managing Navigator Range

The `setRange` method allows programmatic control of the navigator's range. This method not only updates the navigator's range but also synchronizes this change with all bound charts. Additionally, it triggers the `setRange` event.

The `getRange` method retrieves the current range of the Standalone Navigator, enabling users to view or use the navigator's existing range settings.

## API

For comprehensive information on all available features and options, refer to the API reference for the [Standalone Navigator](https://api.highcharts.com/class-reference/Highcharts.StandaloneNavigator).
