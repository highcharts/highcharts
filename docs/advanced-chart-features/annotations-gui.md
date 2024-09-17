Annotations GUI
===

## Build a custom UI
The API of the annotations module allows you to build a custom user interface for adding annotations to your charts. Automatic binding and built-in actions for your custom HTML elements come out of the box and require minimal programming.

### Binding an event to a HTML element
HTML elements are bound to annotations events through reverse lookup of HTML elements with a class name in the form of: `highcharts-BINDINGNAME`. For example a HTML button with `highcharts-circle-annotation` will bind the [`navigation.bindings.circleAnnotation`](https://api.highcharts.com/highcharts/navigation.bindings.circleAnnotation) events. Class name can be changed by setting `navigation.bindings.circleAnnotation.className`. The actual binding takes place on chart initialization, but only for HTML elements that are wrapped within another HTML element with the class name correlating the chart configuration for [`navigation.bindingsClassName`](https://api.highcharts.com/highcharts/navigation.bindingsClassName). The wrapping class name defaults to `highcharts-bindings-wrapper`. Wrapping the GUI elements is made required for specifying which GUI elements need to be bound and events are delegated to the correct chart.

_The code snippet below demonstrates how trigger lookup of a custom GUI with the `navigation.bindingsClassName`._

```js
Highcharts.chart('container', {
    navigation: {
        bindingsClassName: 'custom-gui-container' // Informs Annotations module where to look for HTML elements for adding annotations etc.
    },
    series: [{
        ...
    }]
});
```

_The button below is now bound to the `circleAnnotation` events, after it's found through the above specified class name `custom-gui-container`._

```html
<div class="custom-gui-container">
  <button class="highcharts-circle-annotation">Add Circle</button>
</div>
```

_See this demo for binding a button to the [`circleAnnotation`](https://api.highcharts.com/highcharts/navigation.bindings.circleAnnotation)._

<iframe style="width: 100%; height: 469px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/annotations/basic-gui allow="fullscreen"></iframe>

### Dialog windows

In applications with more advanced user interaction, additional dialog windows are likely needed. Support for building custom dialog windows is facilitated by hooking up functions to the [`navigation.bindings`](https://api.highcharts.com/highcharts/navigation.bindings).

How to implement a custom dialog window, is best explained with an example where we change the background color of a circle annotation.

1. First we define a dialog window in HTML. Notice the class name `highcharts-popup-annotations` of the outer `div` element. We need this class name in the [`navigation.events.showPopup`](https://api.highcharts.com/highcharts/navigation.events.showPopup) event later on.

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

2. Hook up the functions for the events for [`navigation.bindings`](https://api.highcharts.com/highcharts/navigation.bindings).

  ```js
  navigation: {
      // Informs Annotations module where to look for HTML elements for adding annotations etc.
      bindingsClassName: 'custom-gui-container',
      events: {
          // On selecting the annotation the showPopup event is fired
          showPopup: function(event) {
              const chart = this.chart;

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
  Highcharts.chart('container', {
      chart: {
          events: {
              load: function() {
                  // Function which saves the new background color.
                  const chart = this;
                  // Select the save button of the popup and assign a click event
                  document.querySelectorAll('.highcharts-popup-annotations button')[0].addEventListener(
                      'click',
                      function() {
                          const color = document.querySelectorAll(
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
  <iframe style="width: 100%; height: 502px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/annotations/custom-popup allow="fullscreen"></iframe>