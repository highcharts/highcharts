Venn series
===

The venn series has the ability to visualize both venn and vuler diagrams. They are often used in the fields of mathematics, statistics, logistics and computer science to visualize logical relationships.

Euler diagrams displays a number of sets and the relationship between them. The sets are represented by circles, and the relation between the sets are represented by the overlap, or lack of overlap between the circles.

A venn diagram displays all possible logical relations between a collection of different sets, and is therefore a special case of euler diagrams, which does not necessarily have a relationship between all sets.

Getting started
---------------

**Loading the Venn module**

Loading the module `modules/venn.js` will enable the use of venn series type. As a module it will require that Highcharts is loaded in advance. The following is an example of how the Venn series can be loaded using the Highcharts CDN. Please see the [Installation article](https://www.highcharts.com/docs/getting-started/installation) for more information on how Highcharts and its modules can be loaded.

```html
<script href="https://code.highcharts.com/highcharts.js"></script>
<script href="https://code.highcharts.com/modules/venn.js"></script>
```

**Creating a venn diagram**

Since the venn series is an extension to the Highcharts library, it is the chart constructor that should be used when creating the chart.


    Highcharts.chart('container', {
        // Chart options
    });

Next up is adding the a series with type venn where the configurations and data for the venn diagram can be set.


    Highcharts.chart('container', {
        series: [{
            type: 'venn',
            data: [/* Series data */]
        }]
    });

The following data will create two sets A and B, where both sets will have a proportional area of size 2.


    // Series data
        data: [{
            sets: ['A'],
            value: 2
        }, {
            sets: ['B'],
            value: 2
        }]

So far there is no relationship between the two sets, and the current data will create two seperated circles for A and B. Another data point can be added to define the relationship between A and B. The following point will define an intersection between A and B, where the area of overlap will have a size of 1.


    {
        sets: ['A', 'B'],
        value: 1
    }

The visualization should now look like a proper venn diagram, but there is little information about what data is actually visualized. This can be improved greatly by naming the sets. If the property `name` is not specified, then it will default to the values in `sets` joined by `∩`, e.g. `A∩B`.

In the following example A and B will be named as Apples and Bananas, while the relationship between them will be named Fruits.


    // Series data
            data: [{
                name: 'Apples',
                sets: ['A'],
                value: 2
            }, {
                name: 'Bananas',
                sets: ['B'],
                value: 2
            }, {
                name: 'Fruits',
                sets: ['A', 'B'],
                value: 1
            }]

The final visualization should now display a venn diagram of the relation between Apples and Bananas.

<iframe width="100%" height="450" style="null" src=https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-venn/basic/embedded/result/ allow="fullscreen"></iframe>

Its configuration should in full look as the following.


    Highcharts.chart('container', {
        series: [{
            type: 'venn',
            data: [{
                name: 'Apples',
                sets: ['A'],
                value: 2
            }, {
                name: 'Bananas',
                sets: ['B'],
                value: 2
            }, {
                name: 'Fruits',
                sets: ['A', 'B'],
                value: 1
            }]
        }]
    });

**Relevant features and options**

As with all series types in Highcharts there is many familiar features and options that will also be available for use with the venn series. Please see the [Highcharts API](https://api.highcharts.com/highcharts/) for a full overview of options for the venn series.

**venn.data.name**

The option [venn.data.name](https://api.highcharts.com/series.venn.data.name) sets the name of a point. Used in data labels and tooltip. If name is not defined then it will default to the joined values in [sets](https://api.highcharts.com/series.venn.data.sets).

**venn.data.sets**

The option [venn.data.sets](https://api.highcharts.com/series.venn.data.sets) defines which set or sets the options will be applied to. If a single entry is defined, then it will create a new set. If more than one entry is defined, then it will define the area of overlap for the intersection between the sets in the array.

**venn.data.value**

The option [venn.data.value](https://api.highcharts.com/series.venn.data.value) defines the relative area of the circle, or area of overlap between two sets in the venn or euler diagram.

Use Cases
---------

The venn series can be used to create both Venn and Euler diagrams.

**Venn diagram of The Unattainable Triangle**

The unattainable triangle is a reference often used in marketing and advertising, which says that you can either have it fast, cheap, or good, but you cannot have it all. In the triangle the three qualities make up the corners, while the sides create the relationship between these qualities. Since the reference is all about relationships this can also be very well displayed as a venn diagram, as can be seen in the following demo [Venn diagram of the Unattainable Triangle.](https://highcharts.com/demo/venn-diagram)

<iframe style="width: 100%; height: 520px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/venn-diagram allow="fullscreen"></iframe>

Euler diagram of the Relationship between Euler and Venn diagrams
-----------------------------------------------------------------

Euler diagrams are representing a number of sets and the relationship between these sets. An euler diagram will only show the relationships that is relevant, which means that not necessarily every set will overlap each other. While a venn diagram will show all possible relationships between all sets, which means that all sets will overlap each other. A venn diagram is therefore a special case of euler diagrams. This relationship between the euler and venn diagrams can be displayed as an euler diagram, as can be seen in the following demo [Euler diagram of the Relationship between Euler and Venn diagrams.](https://highcharts.com/demo/euler-diagram)

<iframe style="width: 100%; height: 520px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/euler-diagram allow="fullscreen"></iframe>
