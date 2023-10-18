Export Dashboards to JSON
===
The Dashboards allows you to convert the current state of board's options into
the JSON. Please note that the [getOptions()](https://api.highcharts.com/dashboards/#classes/Dashboards_Board.Board-1#getOptions) function does not support converting functions or events into JSON object.

<iframe style="width: 100%; height: 700px; border: none;" src=https://www.highcharts.com/samples/embed/dashboards/exporting/export-to-json allow="fullscreen"></iframe>

### How to use the getOptions()
The [getOptions()](https://api.highcharts.com/dashboards/#classes/Dashboards_Board.Board-1#getOptions)
method is available in the `board`,
```js
Dashboards.boards[].getOptions()
```

or

```js
const board = Dashboards.board('container', { ... })

board.getOptions();
```

### How to save options into localStorage
The state that you extracted from Dashboards can be useful in your project. 
For instance, you can can save it in your localStorage and import when you need.

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

### How to import options from the localStorage
Importing state from the localStorage is even simpler than you expect.

Only what you need is using build-in functionality.

```js
importBtn.addEventListener('click', () => {
    const dashboardsConfig = localStorage.getItem('highcharts-dashboards-config');

    // you custom action
    Dashboards.board('container', JSON.parse(dashboardsConfig));
});
```