Light and Dark Theme
===

The Light and Dark theme allows you to switch between a light and dark theme for the dashboard.
To use the Light and Dark theme, you need to import the `dashboards.css` file.

```css
@import "https://code.highcharts.com/dashboards/css/dashboards.css";
```

By default, the theme is set to the system default theme through the `prefers-color-scheme` media query. But it adjusts itself to the user's system settings.
You can also force the color scheme by setting the class to the dashboard container.

```html
<div id="container" class="highcharts-dashboards-dark ">
```
