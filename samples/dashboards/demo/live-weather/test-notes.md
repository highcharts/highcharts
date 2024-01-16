
# Manual tests

## Observe initial state
* Selected station _Dublin_
* Selected parameter _temperature_

## Select another station on the map
* Observe that the marker size of the _selected station_ increases slightly
* Observe that the marker size of the previously selected station is the same as other non-selected stations
* Observe that the _temperatures_ on the maps markers don't change
* Observe that geographical and weather data are consistent across all charts

## Select humidity in the KPI
* Observe that the marker sizes of all stations are unchanged
* Observe that the _temperature_ KPI is unselected
* Observe that the map markers show _humidity_ and the colors changed
* Observe that the station chart displays humidity data
* Observe that the data grid content is retained
* (repeat the steps with _pressure_)

## Return to initial state
* Select _Dublin_ and _temperature_
* Observe that data and UI on all charts is consistent with the initial state
