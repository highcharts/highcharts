Accessibility module feature overview
=======

The Accessibility module adds several layers of functionality for making your charts compatible with assistive technologies, improving the usability of your charts, and helping you reach a broader audience. 

Keyboard navigation
--------------
An essential part of the Accessibility module is the added keyboard navigation support. This is obviously a critical feature for users with mobility impairments, but also benefits all users. While using a computer mouse can be faster, keyboard navigation allows all users access to precise navigation of the chart.

The inclusion of the Accessibility module, allows users to navigate and interact with the data points, chart menu, and other chart controls using solely their keyboard. 


Keyboard navigation can be tested in the demo below. Use the tab-key to navigate the chart elements, arrow-keys to navigate within the chart element and space-bar to click.

<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/accessibility/accessible-line" allow="fullscreen"></iframe>

[View demo code](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/accessibility/accessible-line)

Screen Readers
--------------
One of the most well known assistive technologies in use by people with disabilities, a screen reader is a program that attempts to convey the information on the screen by using non-visual methods, such as text-to-speech. If your charts are using the Accessibility module, screen reader users can navigate and explore your charts. It will also help your SEO, as web crawlers can read the information provided for screen readers.

The first thing a screen reader user will encounter when exploring a chart is an information region. This region contains basic information about the chart, such as title, the type of chart, axis information, and the text description of the chart if provided (see [Accessibility Module - Basic configuration](https://www.highcharts.com/docs/accessibility/accessibility-module#basic-configuration)). The purpose of this region is to give the screen reader user sufficient information to let them make a decision on whether or not to take more time exploring the chart.

If the screen reader user decides to explore the chart in more detail, they have the option of viewing the chart as a data table. Many users will however prefer navigating the chart elements themselves. Using the Accessibility module, the data points can be navigated, and the values will be accessible to the screen reader. By default, the data series are marked up as regions/landmarks, which aids navigation between series. The screen reader user is able to navigate the chart using their native screen reader commands, and does not have to learn a custom set of shortcuts and navigation keys.

Screen reader users are also able to interact with the elements and the chart menu. By interacting with the chart menu, they will be able to download the chart as an SVG, suitable for tactile printing.

If the chart enables drilldown or is otherwise updating its data dynamically, Highcharts can announce this to screen reader users, while giving you control over the frequency of announcements and their content. See [Dynamic data with the Accessibility module](https://www.highcharts.com/docs/accessibility/accessible-dynamic-data) for more information.

The Accessibility module is compatible with most screen readers in modern browsers, including JAWS, NVDA, Narrator, VoiceOver, and TalkBack.


<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/8Sew47xr-EU" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Low vision features
-------------------
With the Accessibility module, Highcharts comes with built in support for Windows High Contrast Mode. Charts can also be viewed in full-screen for additional separation of elements. [Pattern fills](https://www.highcharts.com/docs/accessibility/patterns-and-contrast) are supported, as well as [premade themes](https://www.highcharts.com/docs/chart-design-and-style/themes) with higher contrast. Series markers also have different shapes to help distinguish between data points without use of color. Due to the responsive nature of Highcharts, screen zooming tools are well supported.

Demo with higher contrast themes: 
<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/accessibility/accessible-switch-theme" allow="fullscreen"></iframe>

[View demo code](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/accessibility/accessible-switch-theme)

Demo with pattern fills:
<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/accessibility/accessible-pattern-fill-one" allow="fullscreen"></iframe>

[View demo code](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/accessibility/accessible-pattern-fill-one)

Demo with series markers:
<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/accessibility/accessible-avg-temp" allow="fullscreen"></iframe>

[View demo code](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/accessibility/accessible-avg-temp)

Voice input
-----------
New since Highcharts version 7.1 is support for voice input software. Similarly to keyboard navigation, this is a technology that is beneficial to users with mobility impairments, but has potential benefits for all users.

Highcharts allows users of voice input software to interact with chart controls such as the chart menu using voice commands. Examples of compatible software include Nuance Dragon, and Microsoft Windows Speech Recognition.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/kt-paZYOKA8" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Tactile export
--------------
As long as the [exporting module](https://www.highcharts.com/docs/export-module/export-module-overview) is included alongside the Accessibility module, users can download an SVG version of the chart. This SVG can be printed and turned into a tactile graphic using embossing printers or similar technology.

<img src="https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2021/02/08185154/braille-chart.jpg" alt="A bar chart with braille on the axes and legends" />

Sonification and Audio Charts
-----------------------------
With Highcharts you can play back the chart as sound. This can be highly effective for conveying trends and patterns quickly without need for visuals. For more information, see [Getting started with audio charts](https://www.highcharts.com/docs/sonification/getting-started).

Cognitive accessibility
-----------------------
A lot of Highcharts features are developed with the goal of making charts easier to use and understand. This translates to better cognitive accessibility, as well as an improved user experience for all users. Relevant features include tooltips, chart legends, dimming surrounding content on hover, series labels, viewing charts in full-screen, and data table support.

Features can be interacted with in this chart:
<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/accessibility/accessible-line" allow="fullscreen"></iframe>

[View demo code](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/accessibility/accessible-line)

Internationalization
--------------------
All Highcharts generated text content can be translated to different languages, including all text used by the Accessibility module. To set these options see [`lang.accessibility`](https://api.highcharts.com/highcharts/lang.accessibility). Read more about [internationalization](https://www.highcharts.com/docs/advanced-chart-features/internationalization).

<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/accessibility/internationalization" allow="fullscreen"></iframe>

[View demo code](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/accessibility/internationalization)
