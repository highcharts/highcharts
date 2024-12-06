# Custom Dashboards components

## Custom YouTube Component
This article shows how to create a custom **Dashboards** Component. In this example, we create a YouTube Component.

<iframe style="width: 100%; height: 590px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/components/custom-component" allow="fullscreen" allow="fullscreen"></iframe>

Note that to create the custom component, we are using ES6 and using the `class` and `extends` keywords, which makes creating a custom class much easier.

We start by importing the default `Component` class and `ComponentRegistry` from the `Dashboards` namespace. We can use destructuring syntax to retrieve these two classes. The next step is creating the class that will inherit from the imported `Component` class.
The class name will automatically be the string used to reference this component type. For example, the class `YouTubeComponent` will be referenced by the name "`YouTube`."

```js
const { Component, ComponentRegistry } = Dashboards;

class YouTubeComponent extends Component {

}
```

Then, depending on what the component is expected to do, the options are limitless. In this example, one `iframe` element will be added, which will accept one attribute from options, `videoId`. Since the iframe element needs its size to be defined, the resize method is extended to update the size of the element.

The new `YouTubeComponent` class must be added to the registry using the `ComponentRegistry.registerComponent` method.

The custom code looks like below:

```js
class YouTubeComponent extends Component {
    constructor(cell, options) {
        super(cell, options);

        this.type = 'YouTube';
        this.youTubeElement = document.createElement('iframe');

        this.options.editableOptions = [{
            name: 'videoId',
            propertyPath: ['videoId'],
            type: 'input'
        }, {
            name: 'title',
            propertyPath: ['title'],
            type: 'input'
        }, {
            name: 'caption',
            propertyPath: ['caption'],
            type: 'input'
        }];


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

    async update(newOptions, shouldRerender) {
        super.update.call(this, newOptions, shouldRerender);

        this.youTubeElement.setAttribute(
            'src',
            'https://www.youtube.com/embed/' + this.options.videoId
        );

        this.cell.setLoadingState(false);
    }

    getOptionsOnDrop(sidebar) {
        super.getOptionsOnDrop.call(this, sidebar);
        return {
            renderTo: '',
            type: 'YouTube',
            videoId: '115hdz9NsrY'
        };
    }
}

ComponentRegistry.registerComponent('YouTube', YouTubeComponent);
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
        renderTo: 'cell-id',
        type: 'YouTube',
        videoId: 'video-id-from-youtube'
    }]
});
```

### Adding a custom component to the sidebar
To add the custom component to the sidebar, you need to add the two things:
1. Define the `getOptionsOnDrop` method for the custom component, which will be called when the component is dropped on the dashboard. It should return options for the dropped component.
2. For the `editMode` sidebar, define the list of the components that will be available in it.
Use the exact name to register the component in the `ComponentRegistry`.
3. To properly display the component name in the sidebar, add the `lang` options to the `editMode` object. If not specified, the component name will be displayed as `[YourComponentName]Component`; in this case, it is `YouTubeComponent`.
```js
    editMode: {
        enabled: true,
        lang: {
            videoId: 'Video ID',
            sidebar: {
                YouTube: 'YouTube'
            }
        },
        contextMenu: {
            enabled: true
        },
        toolbars: {
            sidebar: {
                components: ['YouTube', 'HTML', 'Highcharts']
            }
        }
    },
```

### Making custom components editable
To make the custom component editable, you must define the `editableOptions` property in the component options. The best place to define the `editableOptions` is in the constructor of the custom component.  
The `editableOptions` property is an array of objects, where each object represents one editable option. Read more about the `editableOptions` in the [Editable Options API.](https://api.highcharts.com/dashboards/#modules/Dashboards_Components_EditableOptions.EditableOptions)  
In the example below, the `videoId`, `title` and `caption` are editable options.
```js
    this.options.editableOptions = [{
        name: 'videoId',
        propertyPath: ['videoId'],
        type: 'input'
    }, {
        name: 'title',
        propertyPath: ['title'],
        type: 'input'
    }, {
        name: 'caption',
        propertyPath: ['caption'],
        type: 'input'
    }];
```
Also, the `update` method should be extended to update the component with new options. Here, we have to switch the videoId and set the new videoId to the iframe element. Note that the loading indicator needs to be disabled after the update is performed.  
```js
    async update(newOptions, shouldRerender) {
        super.update.call(this, newOptions, shouldRerender);

        this.youTubeElement.setAttribute(
            'src',
            'https://www.youtube.com/embed/' + this.options.videoId
        );

        this.cell.setLoadingState(false);
    }
```
Additionally the `lang` options for the new option can be added.
```js
    editMode: {
        enabled: true,
        lang: {
            videoId: 'Video ID',
            sidebar: {
                YouTube: 'YouTube'
            }
        },
        ...
    }
```


## Custom HTML Component
The basic HTML component described in the [Types of Components](https://www.highcharts.com/docs/dashboards/types-of-components) doesn't allow the reuse of the HTML code, which is already present in the DOM. To overcome this limitation, you can create a custom HTML component, which will allow you to reference the HTML element by its `id` attribute or pass the HTML as a string to the `html` property.

<iframe style="width: 100%; height: 590px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/components/custom-html-component" allow="fullscreen"></iframe>

This custom component will extend the basic HTML component, so we must import the `HTMLComponent` class. The easiest way is through the `ComponentRegistry`, as shown below. We will also use the `Dashboards.AST` class, which will be used to parse the string-type HTML into an AST-like object. In case something is missing in the AST class, you can extend it the same way as in Highcharts. See the documentation for [AST](https://api.highcharts.com/class-reference/Highcharts.AST).

Then, we can create our custom class, which extends the `HTMLComponent` class. The only thing we need to do is create a method to extract the HTML from the options and parse it into an AST-like object. In the example, this method is called `getCustomHTML,` and it assigns the element generated by the AST to the `elements` property. The only thing left is to register the new component in the `ComponentRegistry,` and we are ready to use it.

```js
const { ComponentRegistry } = Dashboards,
    HTMLComponent = ComponentRegistry.types.HTML,
    AST = Dashboards.AST;

class CustomHTML extends HTMLComponent {
    constructor(cell, options) {
        super(cell, options);
        this.type = 'CustomHTML';
        this.getCustomHTML();
        return this;
    }

    getCustomHTML() {
        const options = this.options;
        if (options.id) {
            const customHTML = document.getElementById(options.id).outerHTML;

            this.options.elements = new AST(customHTML).nodes;
        }
    }
}

ComponentRegistry.registerComponent('CustomHTML', CustomHTML);
```

The use of this component is shown below:

```js
Dashboards.board('container', {
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }, {
                    id: 'dashboard-col-2'
                }]
            }]
        }]
    },
    components: [{
        type: 'CustomHTML',
        renderTo: 'dashboard-col-0',
        id: 'custom-html-div'
    }, {
        type: 'CustomHTML',
        renderTo: 'dashboard-col-1',
        html: `
            <div>
                <h1>Custom HTML 2</h1>
                <span id="custom-html-div-2">Custom HTML added as string </span>
            </div>
        `
    },
    {
        renderTo: 'dashboard-col-2',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }]
});
```


## Custom Threshold Component
Sometimes, you may want to create a component that works as if it changes its type and/or options depending on certain conditions. Such a condition may be, for example, value. The example below shows how to program a custom so-called Threshold Component.

<iframe style="width: 100%; height: 700px; border: none;" src='https://www.highcharts.com/samples/embed/dashboards/components/custom-threshold-component' allow="fullscreen"></iframe>

Such a component can be implemented very similarly to the previously described `YouTubeComponent`, except that you need to consider replacing the default cell content with the child component. This can be achieved by overriding the render method with the code for clearing the cell content and then the logic for creating and updating a new component like this:

```js
render() {
    if (!this.component) {
        this.parentElement.innerHTML = '';
        this.component =
            new CurrentComponent(this.cell, componentOptions).load();
    } else {
        this.component.update(componentOptions);
    }
}
```

An example implementation of the `ThresholdComponent` can look like this:

```js
const {
    Component,
    ComponentRegistry
} = Dashboards;
const { merge, isNumber } = Dashboards._modules['Core/Utilities.js'];

class ThresholdComponent extends Component {
    constructor(cell, options) {
        super(cell, options);
        this.type = 'Threshold';
        return this;
    }

    render() {
        const options = this.options,
            value = options.value,
            thresholds = options.thresholds;

        let CurrentComponent = ComponentRegistry.types[options.component],
            componentOptions = merge(options.options || {}, {
                value
            });

        // Selecting appropriate options and components based on thresholds
        // and given value.
        if (thresholds && isNumber(value)) {
            for (let i = 0; i < thresholds.length; i++) {
                const threshold = thresholds[i];

                if (
                    isNumber(threshold.min) && value < threshold.min ||
                    isNumber(threshold.max) && value > threshold.max
                ) {
                    continue;
                }

                componentOptions = merge(componentOptions, threshold.options);
                if (threshold.component) {
                    CurrentComponent =
                        ComponentRegistry.types[threshold.component];
                }
            }
        }

        // Rendering the appropriate component or updating it with new options
        // if it already exists.
        if (!this.component || this.component !== Component) {
            this.parentElement.innerHTML = '';
            this.component =
                new CurrentComponent(this.cell, componentOptions).load();
        } else {
            this.component.update(componentOptions);
        }

        return this;
    }
}

ComponentRegistry.registerComponent('Threshold', ThresholdComponent);
```

Now you can create the board containing the `ThresholdComponent` with the thresholds options, that you want, for example:
```js
Dashboards.board('container', {
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }]
            }]
        }]
    },
    components: [{
        type: 'Threshold',
        renderTo: 'dashboard-col-0',
        component: 'HTML',
        value: 7,
        thresholds: [{
            min: 5,
            component: 'KPI',
            options: {
                title: {
                    text: 'Example KPI Component'
                }
            }
        }, {
            min: 10,
            component: 'Highcharts',
            options: {
                title: '',
                chartOptions: {
                    ...
                }
            }
        }]
    }]
});
```


## Custom Component with data from the DataConnector

The example below shows how to develop a custom component that fetches data from the DataConnector, processes and displays it on the dashboard.

The custom component is created by extending the `HTMLComponent` class, which displays the total revenue.

<iframe style="width: 100%; height: 700px; border: none;" src='https://www.highcharts.com/samples/embed/dashboards/components/custom-component-data-connector' allow="fullscreen"></iframe>

The DataConnector is registered on the `load`, so we need to execute and await the `super.load()` method first to ensure that the DataConnector is registered. An important part is that the `load` method is `async` because we need to wait for the data to be fetched and processed.

When the data is ready, the `getTotalRevenue` method calculates the total revenue. The `getElementsFromString` method parses the HTML string into an AST-like object. The `render` method renders the component on the dashboard.

```js
const { ComponentRegistry } = Dashboards,
    HTMLComponent = ComponentRegistry.types.HTML;

class TotalRevenueHTML extends HTMLComponent {
    constructor(cell, options) {
        super(cell, options);

        this.type = 'TotalRevenueHTML';

        return this;
    }

    async load() {
        await super.load();
        const revenue = this.getTotalRevenue();

        this.elements = this.getElementsFromString(
            `
            <div class="revenue">
                <p class="title">Total revenue</p>
                <p class="value">${revenue} €</p>
            </div>
            `
        );
        this.render();
    }

    getTotalRevenue() {
        const connector = this.getFirstConnector();
        const table = connector.table.modified;

        return table.columns.Revenue.reduce((acc, cur) => acc + cur);
    }
}

ComponentRegistry.registerComponent('TotalRevenueHTML', TotalRevenueHTML);
```

Later on, the component can be used in the dashboard by referencing the name it was registered with, which, in this case, is `TotalRevenueHTML`.

```js
...
components: [{
    type: 'TotalRevenueHTML',
    renderTo: 'cell-id-0',
    connector: {
        id: 'data'
    }
},
...
```
