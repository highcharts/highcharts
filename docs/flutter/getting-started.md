# Getting started with Highcharts Flutter

Highcharts Flutter provides a robust set of widgets for an seamless integration
of charts directly into your Flutter app.  This allows you to create rich and
engaging data visualizations for mobile and web.


## Requirements

Highcharts Flutter relies on specific SDK features, so ensure you have the
following:

*   **Dart:** Version 3.3.0 or later.
    This ensures compatibility with the latest language features and improvements.

*   **Flutter:** Version 1.17.0 or later.
    This is the minimum Flutter version required for the package to function correctly.


## Installation

1.  **Create a Flutter Project** (if you don't have one):
    If you're starting from scratch, follow the official Flutter documentation
    to create a new project.  This sets up the basic structure for your Flutter
    app.  See the [official documentation](https://docs.flutter.dev/get-started)
    for details.

2.  **Install Highcharts Flutter:**
    Open your terminal in your Flutter project's root directory and run the
    following command:

    ```bash
    flutter pub add highcharts_flutter
    ```

    This command fetches the [highcharts_flutter](https://pub.dev/packages/highcharts_flutter)
    package from pub.dev and adds it to your project's dependencies.

3.  **Import the Package:**
    In your Dart code where you want to use Highcharts, add the following import
    statement:

    ```dart
    import 'package:highcharts_flutter/highcharts.dart';
    ```

    This makes the Highcharts Flutter widgets available in your code.



## Example

After the installation you can start using `HighchartsChart` widget and all
available chart options.  This example showcases a simple line chart as a
starting point for using Highcharts to visualize data within your Flutter
projects.

```dart
import 'package:flutter/material.dart';
import 'package:highcharts_flutter/highcharts.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hello, Highcharts!',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
          title: Text(widget.title),
        ),
        body: ListView(
          children: [
            // Here is a Highcharts widget added to the ListView
            HighchartsChart(
              HighchartsOptions(
                title: HighchartsTitleOptions(
                  text: 'Hello, Flutter!'
                ),
                series: [
                  HighchartsLineSeries(
                    name: 'My First Series',
                    data: [[0, 5], [0.5, 55.5], [1, 10]],
                    options: HighchartsLineSeriesOptions(
                      color: '#C60'
                    )
                  )
                ]
              )
            )
          ],
        ),
      )
    );
  }
}
```
