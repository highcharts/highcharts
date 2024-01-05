
# Manual tests

Visual test of the initial state of the application, followed the observing the effect of user interactions.

## Initial state
* Observe that the marker for New York is slightly bigger than the rest
* Observe that data for NY are displayed (charts 2,4)
* Observe that the date range is 5 Jan 2010 to 25 Dec 2010 (chart 3)
* Observe that the temperature unit is Celsius on all charts

## Select another city
* Observe that the marker size of the selected city increases
* Observe that the marker size of the previously selected city decreases
* Observe that the temperatures on the maps markers don't change
* Observe that geographical and weather data are consistent across all charts

## Select Fahrenheit
* Observe that the city selection persists
* Observe that the temperature unit is Fahrenheit on all charts

## Change time span
* Observe that data changes on all charts and is consistent across charts
* Observe that the city selection and temperature unit persists

## Return to initial state
* Select Celsius, original time span, and New York
* Observe that data and UI on all charts is consistent with the initial state
