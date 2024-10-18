Light and Dark Theme
===

The Light and Dark theme allows you to switch between a light and dark theme for the dashboard.
To use the Light and Dark theme, you need to import the `dashboards.css` file.

```css
@import "https://code.highcharts.com/dashboards/css/dashboards.css";
```
And you need to enable the `styledMode` option for the components that has the Highcharts charts in it.
You can do this by setting the `styledMode` option to `true` in the component's configuration.

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

By default, the theme is set to the system default theme through the `prefers-color-scheme` media query. But it adjusts itself to the user's system settings.
You can also force the color scheme by setting the class to the dashboard container.

```html
<div id="container" class="highcharts-dark">
```

### Live example
Use the radio buttons below the board to change the theme.
<iframe style="width: 100%; height: 1264px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/demo/light-dark-theme" allow="fullscreen"></iframe>
