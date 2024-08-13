DataGrid installation
===

## Install via NPM
One of the ways of adding the DataGrid to your web page is via npm script.
You can get all of the functionality of the DataGrid through Dashboard packages which can be installed using the following script:
```bash
npm install @highcharts/dashboards
```
Then import the package in your project:
```js
import DataGrid from '@highcharts/dashboards/datagrid';
```

## Include DataGrid by script tag
Include the JavaScript files in the `<head>` section of your web page as shown below.

```html
<script src="https://code.highcharts.com/dashboards/datagrid.js"></script>
 ```

In the example above, the Javascript files are loaded from [code.highcharts.com](https://code.highcharts.com) but you can download the files from [highcharts.com](https://www.highcharts.com/download/) and include them on your web page. Here is an example with DataGrid loaded from your own server:

```html
<script src="../code/dashboards/datagrid.js"></script>
```

## Importing the CSS
The CSS is not included in the library by default, but you can import it as below:
```css
@import url("https://code.highcharts.com/dashboards/css/datagrid.css");
```

### Get started

Now you are ready to use DataGrid. Check out [Your first DataGrid](https://highcharts.com/docs/datagrid/your-first-datagrid) to get started.