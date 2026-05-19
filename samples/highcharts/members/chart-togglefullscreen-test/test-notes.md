* Check that after fullscreen open and close, the chart is resizing correctly using the buttons.
* Check that the browser console is free from any relevant errors or warnings.

----
**Maintenance notes**

This is a manual test, because it is not possible to automate it. Last time checked: 2025.11.18.

- Headless logs internal alert: `Full screen is not supported inside a frame.`
- Firefox warning: `Request for fullscreen was denied because Element.requestFullscreen() was not called from inside a short running user-generated event handler.`
- Chrome warning: `Failed to execute 'requestFullscreen' on 'Element': API can only be initiated by a user gesture.`

Check by running (change `skip` to `test`) in `samples\unit-tests\fullscreen\toggle\`