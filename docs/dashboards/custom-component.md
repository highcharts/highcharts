Custom Dashboards components
===

## Custom YouTube Component
This article shows how to create custom Dashboards Component, in this example YouTube Component.

Note, that to create the custom component we are using ES6, to use the `class` and `extends` keywords, which makes creating custom class much easier.

We start by importing the default `Component` class and `ComponentRegistry` from `Dashboards` namespace. We can use destructuring syntax to retrieve this 2 classes. The next step is creating the class which will inherit from the imported `Component` class.
The name of the class will automatically be the string, that will be used to reference this component type e.g. the class `YouTubeComponent` will be referenced by name: "`YouTube`".

```js
    const { Component, ComponentRegistry } = Dashboards;

    class YouTubeComponent extends Component {

    }
```

Then, depending on what the Component is expected to do, the options are limitless. In this example, one `iframe` element will be added, which will accept one attribute from options, which is `videoId`, and since the iframe element needs it size to be defined, the resize method is extended to update the size of the element.

At the end, the new `YouTubeComponent` class needs to be addded to the registry, using the `ComponentRegistry.registerComponent` method.

The custom code looks like below:

```js
class YouTubeComponent extends Component {
    constructor(cell, options) {
        super(cell, options);
        this.type = 'YouTube';
        this.youTubeElement = document.createElement('iframe');

        return this;
    }

    resize(width, height) {
        super.resize.call(this, width, height);
        this.youTubeElement.setAttribute('width', width - 10);
        this.youTubeElement.setAttribute('height', height - 10);
    }

    load() {
        super.load();

        this.youTubeElement.setAttribute(
            'src',
            'https://www.youtube.com/embed/' + this.options.videoId
        );
        this.youTubeElement.setAttribute('title', 'YouTube video player');
        this.youTubeElement.setAttribute('frameborder', '0');
        this.youTubeElement.allowfullscreen = true;
        this.contentElement.appendChild(this.youTubeElement);
        this.parentElement.appendChild(this.element);

        return this;
    }
}

Component.addComponent(YouTubeComponent);
```

And that's it! The component is ready to be used. Now, the new component type can be referenced like that:

```js
Dashboards.board({
    gui: [{
        layouts: [{
            rows: [{
                cells:[{
                    id: 'cell-id'
                }]
            }]
        }]
    }],
    components: [{
        cell: 'cell-id',
        type: 'YouTube',
        videoId: 'video-id-from-youtube'
    }]
});
```
[The live example can be found here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/samples/dashboards/demos/custom-component).

---
## Custom HTML Component
The basic HTML component is described in the [Types of Components](https://www.highcharts.com/docs/chart-and-series-types/dashboards/types-of-components) page. The basic one is very flexible, but requires a lot of configuration. In this example, we will create a custom HTML component, which will be more flexible and easier to use.  
To do so, we will use the `Highcharts.AST` class, which will be used to parse the string type HTML into the AST-like object.

First we can declare our custom HTML in HTML file as shown in the code snippet below or you can declare that as a string in the code.
``` HTML
<div id="custom-html">
    <h1>Your custom HTML</h1>
    <p>Here you can add any HTML you like.</p>
</div>
```
Then we can reference it in the code and parse it into the AST object like below:

```JS
const customHTML = document.getElementById('custom-html').outerHTML,
    AST = Highcharts.AST;

Dashboards.board('container', {
    ...
    components: [{
        type: 'HTML',
        cell: 'dashboard-col-0',
        elements: new AST(`${customHTML}`).nodes
    }, ....]
});
```
Check out the [live example here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/samples/dashboards/demos/custom-html-component).