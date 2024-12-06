# Export Dashboards to JSON

**Dashboards** allows you to convert the current state of the dashboard's options into
JSON. Please note that the [getOptions()](https://api.highcharts.com/dashboards/#classes/Dashboards_Board.Board-1#getOptions) function does not support converting functions or events into a JSON object.

<iframe style="width: 100%; height: 700px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/exporting/export-to-json allow="fullscreen"></iframe>

### How to use the getOptions()
In the example below, the [getOptions()](https://api.highcharts.com/dashboards/#classes/Dashboards_Board.Board-1#getOptions)
method is available in the `board` object.
```js
Dashboards.boards[].getOptions()
```

or

```js
const board = Dashboards.board('container', { ... })

board.getOptions();
```

### How to save options into `localStorage`
The state that you extracted from Dashboards can be helpful in your project.
For instance, you can save it in your `localStorage` object and import it when you need.

```js
localStorage.setItem(
    'highcharts-dashboards-config', // defined id of record in the localStorage
    JSON.stringify(
        board.getOptions(),
        null,
        2
    )
);
```

### How to import options from `localStorage`
Importing the state from `localStorage` is straightforward, as you can use JSON's built-in functionality.

```js
importBtn.addEventListener('click', () => {
    const dashboardsConfig = localStorage.getItem('highcharts-dashboards-config');

    // Your custom action
    Dashboards.board('container', JSON.parse(dashboardsConfig));
});
```
