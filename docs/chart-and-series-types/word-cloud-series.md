Word cloud
===

A word cloud is a visualization of a set of words, where the size and placement of a word is determined by how it is weighted.

<iframe style="width: 100%; height: 416px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/wordcloud allow="fullscreen"></iframe>

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/wordcloud/) to check the code

Requirements
------------

The word cloud chart requires the following module `modules/wordcloud.js`.

Options
-------

Click [here](https://api.highcharts.com/highcharts/plotOptions.wordcloud) to get an overview of all options available for the wordcloud series.

Data structure
--------------

Each point in the wordcloud series is required to have a `name` and a `weight`. The name determines the text to be drawn in the visualization, while the weight determines its priority. The points with the highest priority gets drawn first, and will be draw with larger font-size.

    
    data: [{
        name: 'Lorem',
        weight: 3
    }, {
        name: 'Ipsum',
        weight: 2
    }, {
        name: 'Dolor',
        weight: 1
    }] 

Advanced usage
--------------

### Custom spiralling algorithm

Spirals are used for moving a word after the initial position experienced a collision with either another word or the borders of the playing field.  
To implement a custom spiral, look at the function archimedeanSpiral for example:

    
    /**
     * archimedeanSpiral - Gives a set of coordinates for an Archimedian Spiral.
     *
     * @param {number} t How far along the spiral we have traversed.
     * @return {object} Resulting coordinates, x and y.
     */
    var archimedeanSpiral = function archimedeanSpiral(t) {
        t *= 0.1;
        return {
            x: t * Math.cos(t),
            y: t * Math.sin(t)
        };
    }; 

The spiralling algorithm is made accessible by attaching it to the `spirals` property:

    
    Highcharts.seriesTypes.wordcloud.prototype.spirals.archimedean = archimedeanSpiral; 

Afterwards you can use the algorithm by specifying the option **series`<wordcloud>`.spiral**:

    
    Highcharts.chart(..., {
      series: [{
        type: 'wordcloud',
        spiral: 'archimedean'
      }]
    }); 

### Custom placement strategies

Strategies are used for deciding rotation and initial position of a word.  
To implement a custom strategy, have a look at the function randomPlacement for example:

    
    var randomPlacement = function randomPlacement(point, options) {
      var field = options.field,
        r = options.rotation;
      return {
        x: getRandomPosition(field.width) - (field.width / 2),
        y: getRandomPosition(field.height) - (field.height / 2),
       rotation: getRotation(r.orientations, r.from, r.to)
      };
    }; 

The placement algorithm is made accessible by attaching it to the `placementStrategy` property:

    
    Highcharts.seriesTypes.wordcloud.prototype.placementStrategy.random= randomPlacement; 

Afterwards you can use the algorithm by specifying the option **series`<wordcloud>`.placementStrategy**:

    
    Highcharts.chart(..., {
      series: [{
        type: 'wordcloud',
        placementStrategy: 'random'
      }]
    }); 

### Custom font sizing

The size of the font is calculated by the function `deriveFont`, which gives a result based on the relative weight of a word. The weight is on a scale 0-1, which indicates the words weight compared to the word with the largest weight.  
When customizing the font sizes, you should be aware that higher font sizes can make the placement algorithm run slower, while a lower font size can make the placement of words more scattered.

    
    // Include this snippet after loading Highcharts and before Highcharts.chart is executed.
    Highcharts.seriesTypes.wordcloud.prototype.deriveFontSize = function (relativeWeight) {
       var maxFontSize = 25;
      // Will return a fontSize between 0px and 25px.
      return Math.floor(maxFontSize * relativeWeight);
    }; 

Things to be aware of
---------------------

*   When words are rotated in angles not divisible by 90, there is a lot of air between them.
    *   The current collision algorithm does not take rotation into count, and only checks if the outer areas of two words collides. To fix this we can utilize the [Separating Axis Theorem](https://gamedevelopment.tutsplus.com/tutorials/collision-detection-using-the-separating-axis-theorem--gamedev-169)
*   The words has changed places when I export my chart.
    *   The exporting does a new render of the data, which causes the words to be repositioned in different coordinates than the original chart.
*   There is a different font type in my exported chart.
    *   The current default font used in our Wordcloud series is not installed on the export server.
