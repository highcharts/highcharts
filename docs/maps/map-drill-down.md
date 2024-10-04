Map drill down
==============

Map drill down allows users to interactively explore hierarchical geographic data by clicking on regions to reveal more detailed maps or information. This feature enhances data visualization by letting users focus on specific areas of interest while maintaining the context of the overall dataset. Highcharts Maps' drilldown functionality provides smooth transitions, customizable animations, and supports both static and dynamic data loading for flexibility in various use cases.

For full detailed documentation and more samples of the drilldown feature, see [the Highcharts Maps API](https://api.highcharts.com/highmaps/drilldown).

For an in-depth overview of drilldown functionality, see [Drill down](https://www.highcharts.com/docs/chart-concepts/drilldown).


Map zooming and animation
-------------------------

The `mapZooming` option controls whether the map zooms into a region when drilling down into a specific point. If set to `false`, the drilldown and drill-up animations will only fade in and out without zooming into the selected area. By default, this feature is enabled (set to `true`).

The following demo illustrates a basic drilldown map with static data preloaded for both the main map and drilldown levels. This setup allows for smooth transitions between regions without additional data fetching during interaction.

<iframe style="width: 100%; height: 500px; border: none;" src="https://www.highcharts.com/samples/embed/maps/demo/map-drilldown-preloaded" allow="fullscreen"></iframe>


Async setup
-----------

In most cases, maps are loaded asynchronously to optimize performance and user experience. With this setup, only the top-level map is loaded initially, and the drilldown maps are fetched dynamically when needed. This ensures that your application doesn't load unnecessary data upfront, reducing initial load times.

The asynchronous drilldown process leverages event handling to load map data on demand, improving responsiveness and resource management. This is especially useful for complex or large datasets, ensuring a faster and more efficient user experience.

<iframe style="width: 100%; height: 500px; border: none;" src="https://www.highcharts.com/samples/embed/maps/demo/map-drilldown" allow="fullscreen"></iframe>
