Highcharts Security
===

Adding HTML from an untrusted source into the DOM is a potential security risk, as it may execute unauthorized code in the browser. This is known as [cross-site scripting or XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Since Highcharts v9 we aim to filter all HTML that is added through the chart options structure - except function callbacks, which are already by definition executing code in the browser. Our design goal is that as long as the chart options are valid JSON, they should be XSS safe.

In practice we do this by using the browser's built-in `DOMParser` to parse incoming strings, transform the result into an [abstract syntax tree](https://api.highcharts.com/class-reference/Highcharts.AST), then check the tags and attributes against allow lists. Unknown tags and attributes are removed.

If your config comes from a trusted source, you may add tags, attributes or reference patterns to the allow lists:
```js
Highcharts.AST.allowedTags.push('blink');
Highcharts.AST.allowedAttributes.push('data-value');
// Allow links to the `tel` protocol
Highcharts.AST.allowedReferences.push('tel:');
```

### Scope
Chart _configuration options_ that are valid JSON are filtered for known XSS vectors. JSON support types of object, strings, numbers, arrays, boolean or null. This implies that function callbacks and event handlers in the chart options structure is not covered by our scope. Functions are inherently unsafe because they by nature allow scripting towards the web page.

Good: This option set is valid JSON, and the evil code is stripped out internally:
```js
Highcharts.chart('container', {
    "title": {
        // Filtered
        "text": "<a href='javascript:console.log(document.domain)'>Click me</a>"
    }
});
```

Bad: In this case the options set includes a function, and evil code may execute:
```js
Highcharts.chart('container', {
    "chart": {
        "events": {
            // Unsafe
            "load": () => console.log(document.domain)
        }
    }
});
```

Good: If we run the options through `JSON.parse`, it will throw on the arrow function, revealing that this is not valid JSON:
```js
const options = JSON.parse(`{
    "chart": {
        "events": {
            "load": () => console.log(document.domain)
        }
    }
}`); // => Throws SyntaxError
Highcharts.chart('container', options);
```

Good: The XSS filtering also applies to partial options given as parameters to functions that add or update chart elements:
```js
const chart = Highcharts.chart('container', {});
chart.setTitle({
    // Filtered
    text: "<a href='javascript:console.log(document.domain)'>Click me</a>"
});
```

### Backwards compatibility
In Highcharts prior to version 9, inputs were not filtered for XSS vectors. Some sporadic issues were handled, but all in all it should be considered giving direct access to the DOM. For example, when `useHTML` was true, any text strings or formats were passed directly to the DOM using `innerHTML`. Highcharts prior to version 9 assumed that the chart configuration was already checked for malicious code, as should any scripting content with user-defined input.

The changes brought to v9 were a deep refactoring of how the whole concept of pseudo HTML in SVG was handled. Therefore it is unfortunately not possible to backport the fix to earlier major versions.

If you are using earlier Highcharts versions, consider either of these points:

* The increased security only makes sense if you include content from untrusted sources in your charts. This may be user-defined chart titles, series names, point names, axis labels etc. - in short any text content that is rendered in the chart. If your chart configuration is static and trusted, there's no need for any action.
* Consider the architecture of your application. If the user-defined input is allowed to pass unfiltered to the point where it is inserted into a chart, sanitation should probably be added at an earlier stage, regardless of Highcharts version.
* Upgrade to Highcharts v9. It is fully backwards compatible and there is no need for changing any configuration.
* If you are not using any of the pseudo-HTML capabilities of Highcharts to format text inputs, stripping the texts of HTML is a simple way to filter out malicious code. See the example of [allow-listing characters](https://jsfiddle.net/highcharts/2qrxyk84/). While this does not render gracefully, it does effectively strip out HTML.
* For more sophisticated sanitizing of the options, consider using a third party library like [DOMPurify](https://github.com/cure53/DOMPurify), either on the server or client side. See [the example](https://jsfiddle.net/highcharts/zd3wcm5L/). This will strip out malicious code in a fast and secure way, while maintaining harmless markup.
