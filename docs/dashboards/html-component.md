HTML Component
===


The HTML Component serves as a fundamental building block in dashboards. It offers the versatility to incorporate diverse HTML content. It is a simple yet potent tool for constructing dashboards with dynamic content. The configuration structure resembles an Abstract Syntax Tree (AST), enabling definition of tag names, attributes, and nested elements.

<iframe style="width: 100%; height: 470px; border: none;" src='https://www.highcharts.com/samples/embed/dashboards/components/component-html' allow="fullscreen"></iframe>

### How to setup basic HTML component.

1. The HTML component is the most basic component available in the Highcharts Dashboards. You can find it in the main Highcharts Dashboards package.  
To use it through the CDN, you need to load the following files

```html
<script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
```

Alternatively, you can download the NPM package like:
```bash
npm install @highcharts/dashboards
```
and import it in your project like:
```js
import * as Dashboards from '@highcharts/dashboards';
```

2. After loading the necessary files, define a cell using a unique identifier for the cell, e.g. `dashboard-col-0`. This cell will be used to place the component in the dashboard.

```js
gui: {
    layouts: [{
        id: 'layout-1',
        rows: [{
            cells: [{
                id: 'dashboard-col-0'
            }]
        }]
    }]
}
```

3. When the placeholder is ready, component options can be defined. To do so, set the `type` of the component to `HTML`. The type is case-sensitive, so make sure to use the exact spelling.  
Apart from the `type` property, the component requires the `cell` property to be defined. The `cell` property is used to specify the cell in which the component should be placed.

4. Now, you can define the HTML elements that will be rendered in the component. The `elements` array is an array of objects, where each object represents a single HTML element. The object usually contains the `tagName` which is the name of the HTML tag, e.g. `div`, `img`, `p`, etc. and the `attributes` of the element. If the text should be rendered inside the element, the `textContent` property can be used.

```js
components: [{
    type: 'HTML',
    cell: 'dashboard-col-0',
    elements: [{
        tagName: 'h1',
        textContent: 'Your text',
        attributes: {
            id: 'main-title',
        }
    }]
}]
```

### Nested elements
If more than one element is required, the `children` property can be used. The `children` property is an array of elements that will be nested inside the parent element. Each element can have its own children elements and is configured in the same way as the parent element.

```js
elements: [{
    tagName: 'div',
    children: [{
        tagName: 'h1',
        textContent: 'Title',
        attributes: {
            id: 'main-title',
        }
    }, {
        tagName: 'p',
        textContent: 'Description',
        attributes: {
            id: 'description',
        }
    }]
}]
```


### Styling the HTML component

The most common way to style the HTML component is to use the CSS and utilize the `className` or `id` attributes.
```css
#main-title {
  color: #4b4b4b;
}
#description {
  text-decoration: underline;
}
```


### Extending the HTML component

If some of the HTML elements are used frequently or requires to be more customable, it is possible to create a custom component that will simplify the configuration. The custom component can be created by extending the basic HTML component.  
More in the [Custom Component](https://www.highcharts.com/docs/dashboards/custom-component) section.

### API options
For the full set of available options, see [the API](https://api.highcharts.com/dashboards/#interfaces/Dashboards_Components_HTMLComponent.HTMLComponent.HTMLComponentOptions).