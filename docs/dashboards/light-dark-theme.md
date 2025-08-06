# Light and Dark Theme

The Light and Dark adaptive theme allows you to switch between a light and dark theme for the dashboard.
To use the Light and Dark theme, you need to import the `dashboards.css` file.

```css
@import "https://code.highcharts.com/dashboards/css/dashboards.css";
```

Next, if your dashboard contains components with **Highcharts** charts, you want
to apply an adaptive Highcharts theme two. There are two options for that:

1. Load the `adaptive.js` theme for Highcharts.
```html
<script src="https://code.highcharts.com/themes/adaptive.js"></script>
```

2. Alternatively, use [styledMode](https://api.highcharts.com/highcharts/chart.styledMode) and import `https://code.highcharts.com/dashboards/css/dashboards.css`. Enable the `styledMode` option for all components that contain a chart. You can do this by setting the `styledMode` option to `true` in the component's configuration.

```js
{
    type: 'Highcharts',
    renderTo: 'chart-container',
    chartOptions: {
        chart: {
            styledMode: true
        }
        ...
    }
    ...
}
```
or you can set this option globally by using the [setOptions](https://api.highcharts.com/class-reference/Highcharts#.setOptions) method.
```js
Highcharts.setOptions({
    chart: {
        styledMode: true
    }
});
```

## Media query and class names
By default, the theme is set to the system default theme through the
`prefers-color-scheme` media query. You can also force the color scheme by
setting either the `highcharts-light` or `highcharts-dark` class to the dashboard container.

```html
<div id="container" class="highcharts-dark">
```

## Live example
Use the radio buttons below the dashboard to change the theme.
<iframe style="width: 100%; height: 1264px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/demo/light-dark-theme" allow="fullscreen"></iframe>
