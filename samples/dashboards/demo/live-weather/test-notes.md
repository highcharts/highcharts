
# Manual tests

## Observe initial state
* Selected station _New York_.
* Selected parameter _temperature_ in chart and KPI.

## Select another station on the map
* Observe that the marker size of the _selected station_ increases and the border is dark.
* Observe that the marker size of the previously selected station is the same as other non-selected stations.
* Observe that the _temperatures_ on the maps markers don't change.
* Observe that geographical and weather data are consistent across all charts.

## Select precipitation in the KPI
* Observe that the marker sizes of all stations are unchanged.
* Observe that the _temperature_ KPI is unselected.
* Observe that the map markers show _precipitation_ and the colors changed.
* Observe that the station chart displays precipitation data.
* Observe that the data grid content is retained.

## Select wind in the KPI
* Observe that the marker sizes of all stations are unchanged.
* Observe that the _precipitation_ KPI is unselected.
* Observe that the map markers show _wind_ and the colors changed.
* Observe that the station chart displays wind speed data.
* Observe that the _windbarb_ series appear in the chart below the wind speed.
* Observe that the data grid content is retained.

## Return to initial state
* Select _New York_ and _temperature_.
* Observe that the _windbarb_ series disappears.
* Observe that data and UI on all charts is consistent with the initial state.

## Theme change
* Select a dark desktop theme and observe that all items in all charts are visible and readable.
* Repeat for a light theme.

## Responsiveness
* Gradually resize the browser window to observe that the components adapt as expected.
* Select the mobile view (HC sample view) and observe that all components get stacked in one column and are readable.
