Stock tools
===

Stock Tools is a Highcharts Stock module for building a GUI that enables user interaction with the chart, such as adding annotations, technical indicators or just for zooming in or out. The module is released with Highcharts Stock 7 and won't work with previous versions.

Building the GUI is facilitated by the Stock Tools module, where your HTML elements for user interaction are automatically bound to predefined events in this module. Full list of the available bindings can be found in the API [navigation.bindings](https://api.highcharts.com/highstock/navigation.bindings).
![basicStock.png](basicStock.png)

## Quick start
To get started quickly it's recommended to use the default toolbar of the Stock Tools module. We need to load the JavaScript files in the following order.

1. First load Highcharts Stock and the bundle with all the technical indicators for convenience.
  ```html
  <script src="https://code.highcharts.com/indicators/indicators-all.js"></script>
  ```
  See the example below when you only need some specific indicators for your project. Load first the `indicator.js` base module and specific indicators successively. Technical indicators require the [indicators/indicators.js](https://code.highcharts.com/stock/indicators/indicators.js) base module. The base module includes SMA (Simple Moving Average). Find here a list of [available technical indicators](https://www.highcharts.com/docs/stock/technical-indicator-series).

  _See example below for loading specific indicators._
  ```html
  <script src="https://code.highcharts.com/indicators/indicators.js"></script>
  <script src="https://code.highcharts.com/indicators/rsi.js"></script>
  <script src="https://code.highcharts.com/indicators/ema.js"></script>
  <script src="https://code.highcharts.com/indicators/macd.js"></script>
  <script src="/ .... other technical indicators ...  "
  ```

2. Load also the other modules needed by the default toolbar: _Resizable panes, Annotations, Full screen, and Current Price_.
  ```html
  <script src="https://code.highcharts.com/modules/drag-panes.js"></script>
  <script src="https://code.highcharts.com/modules/annotations-advanced.js"></script>
  <script src="https://code.highcharts.com/modules/price-indicator.js"></script>
  <script src="https://code.highcharts.com/modules/full-screen.js"></script>
  ```
3. It is necessary to load the Stock Tools module last, so it will pick up on all available plugins above:
  ```html
  <script src="https://code.highcharts.com/modules/stock-tools.js">
  ```
4. The build-in toolbar, needs the following CSS files:
  ```html
  <link rel="stylesheet" type="text/css" href="https://code.highcharts.com/css/stocktools/gui.css">
  <link rel="stylesheet" type="text/css" href="https://code.highcharts.com/css/annotations/popup.css">
  ```
5. Now you have loaded all required files, create a stock chart as you normally would, see the below example.
  ```js
  Highcharts.stockChart('container', {
      series: [{
          type: 'ohlc',
              data: [ ... ]
          }]
      });
  ```
  And Stock Tools toolbar will show up on the left side of the chart, see the demo below.

  <iframe width="320" height="500" src="https://www.highcharts.com/samples/embed/stock/demo/stock-tools-gui" allow="fullscreen"></iframe>

  **Note:** The buttons graphics of the Stock Toolbar buttons are by default loaded from the Highcharts CDN. If you want to load Stock Tools from your local package, you might also want to set the symbol properties for each of the [`stockTools.gui.definitions`](https://api.highcharts.com/highstock/stockTools.gui.definitions). The icons are available in the Highcharts NPM [package](https://www.npmjs.com/package/highcharts) or clone the highcharts-dist [GitHub repository](https://github.com/highcharts/highcharts-dist).

  Find the icons in the `/gfx/stocktools` folder of this package.

## Build a custom UI
The built-in Stock Toolbar will cover most use cases and get you quickly started. The API of this module supports additionally building a custom defined user interface. Automatic binding and built-in actions for your custom HTML elements come out of the box and require minimal programming.

### Binding an event to a HTML element
HTML elements are bound to stock tools events through reverse lookup of HTML elements with a classname in the form of: `highcharts-BINDINGNAME`. For example a HTML button with `highcharts-circle-annotation` will bind the [`navigation.bindings.circleAnnotation`](https://api.highcharts.com/highstock/navigation.bindings.circleAnnotation) events. Class name can be changed by setting `navigation.bindings.circleAnnotation.className`. The actual binding takes place on chart initialization, but only for HTML elements that are wrapped within another HTML element with the classname correlating the chart configuration for [`navigation.bindingsClassName`](https://api.highcharts.com/highstock/navigation.bindingsClassName). The wrapping classname defaults to `highcharts-bindings-wrapper`. Wrapping the GUI elements is made required for specifying which GUI elements need to be bound and events are delegated to the correct chart.

_The code snippet below demonstrates how to disable the default toolbar, and triggers lookup of a custom GUI with the `navigation.bindingsClassName`._

```js
Highcharts.stockChart('container', {
    navigation: {
        bindingsClassName: 'tools-container' // informs Stock Tools where to look for HTML elements for adding technical indicators, annotations etc.
    },
    stockTools: {
        gui: {
            enabled: false // disable the built-in toolbar
        }
    },
    series: [{
        ....
    }]
});
```

_The button below is now bound to the `circleAnnotation` events, after it's found through the above specified classname `tools-container`._

```html
<div class="tools-container">
  <button class="highcharts-circle-annotation">Add Circle</button>
</div>
```

_See this demo for binding a button to the [`circleAnnotation`](https://api.highcharts.com/highstock/navigation.bindings.circleAnnotation)._

<iframe style="width: 100%; height: 469px; border: none;" src=https://www.highcharts.com/samples/embed/stock/stocktools/basic-gui allow="fullscreen"></iframe>

### Dialog windows

In applications with more advanced user interaction, additional dialog windows are likely needed. Support for building custom dialog windows is facilitated by hooking up functions to the [`navigation.bindings`](https://api.highcharts.com/highstock/navigation.bindings).

How to implement a custom dialog window, is best explained with an example where we change the background color of a circle annotation.

1. First we define a dialog window in HTML. Notice the classname `highcharts-popup-annotations` of the outer `div` element. We need this classname in the [`navigation.events.showPopup`](https://api.highcharts.com/highstock/navigation.events.showPopup) event later on.

  _Example of a dialog window with a color input field_

  ```html
  <div class="highcharts-popup highcharts-popup-annotations">
      <div class="highcharts-popup-wrapper">
          <label for="stroke">Color</label>
          <input type="color" name="stroke" value="rgba(0, 0, 0, 0.75)"/>
      </div>
      <button class="button">Save</button>
  </div>
  ```

2. Hook up the functions for the events for [`navigation.bindings`](https://api.highcharts.com/highstock/navigation.bindings).

  ```js
  navigation: {
      // Informs Stock Tools where to look for HTML elements for adding
      // technical indicators, annotations etc.
      bindingsClassName: 'tools-container',
      events: {
          // On selecting the annotation the showPopup event is fired
          showPopup: function(event) {
              var chart = this.chart;

              if (!chart.annotationsPopupContainer) {
                  // Get and store the popup annotations container
                  chart.annotationsPopupContainer = document
                    .getElementsByClassName('highcharts-popup-annotations')[0];
              }

              // Show the popup container, but not when we add the annotation.
              if (
                  event.formType === 'annotation-toolbar' &&
                  !chart.activeButton
              ) {
                  chart.currentAnnotation = event.annotation;
                  chart.annotationsPopupContainer.style.display = 'block';
              }
          },
          closePopup: function() {
              // Hide the popup container, and reset currentAnnotation
              this.chart.annotationsPopupContainer.style.display = 'none';
              this.chart.currentAnnotation = null;
          },
          selectButton: function(event) {
              // Select button
              event.button.classList.add('active');
              // Register this is current button to indicate we're adding
              // an annotation.
              this.chart.activeButton = event.button;
          },
          deselectButton: function(event) {
              // Unselect the button
              event.button.classList.remove('active');
              // Remove info about active button:
              this.chart.activeButton = null;
          }
      }
  },
  ```

3. Add an event listener to the "Save" button of the dialog window for saving the color to the `fill` of the circle annotation.

  ```js
  Highcharts.stockChart('container', {
      chart: {
          events: {
              load: function() {
                  // Function which saves the new background color.
                  var chart = this;
                  // Select the save button of the popup and assign a click event
                  document.querySelectorAll('.highcharts-popup-annotations button')[0].addEventListener(
                      'click',
                      function() {
                          var color = document.querySelectorAll(
                              '.highcharts-popup-annotations input[name="stroke"]'
                          )[0].value;

                          // Update the circle
                          chart.currentAnnotation.update({
                              shapes: [{
                                  fill: color
                              }]
                          });

                          // Close the container
                          chart.annotationsPopupContainer.style.display = 'none';
                      }
                  )
              }
          }
      },
      navigation: { ... },
      ...
  });
  ```

  _The above code is put together in the below demo_
  <iframe style="width: 100%; height: 502px; border: none;" src=https://www.highcharts.com/samples/embed/stock/stocktools/custom-popup allow="fullscreen"></iframe>
