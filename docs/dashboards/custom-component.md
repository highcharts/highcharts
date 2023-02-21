Custom Dashboards components
===
This article shows how to create custom Dashboards Component, in this example YouTube Component.

Note, that to create the custom component we are using ES6, to use the `class` and `extends` keywords, which makes creating custom class much easier.

We start by importing the default `Component` class from `Dashboards` namespace, and by creating the class, which will inherit from this class.
The name of the class will automatically be the name, that will be used to reference this component type, e.g. the class `YouTubeComponent` will be referenced by name: `YouTube`.

```js
    const Component = Dashboards.Component;

    class YouTubeComponent extends Component {

    }
```

Then, depending on what the Component is expected to do, the options are limitless. In this example, one `iframe` element will be added, which will accept one attribute from options, which is `videoId`, and since the iframe element needs it size to be defined, the resize method is extended to update ths size of the element.

At the end, the new Component class needs to be addded to the registry, using the `Component.addComponent` method.

Whole custom code looks like that:

```js
class YouTubeComponent extends Component {
    constructor(options) {
        super(options);
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

And that's it!
The component is ready to be used. Now, the new component type can be referenced like that:

```js
{
    cell: 'cell-id',
    type: 'YouTube',
    videoId: 'video-id-from-youtube'
}
```

[The live example can be found here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/samples/dashboards/demos/custom-component).