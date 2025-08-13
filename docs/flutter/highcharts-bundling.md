# Bundle Highcharts into a Flutter app

There are many good reasons to bundle Highcharts into a Flutter app instead of loading it from a content delivery network.
Doing so for all supported platforms is easy and straightforward.

## Add Highcharts Flutter

If you have not done already, add Highcharts Flutter to your project by running the following command:

```Shell
flutter pub add highcharts_flutter
```

## Add Highcharts assets

First you have to download and add the Highcharts files to your Flutter project.
You can find a ZIP archive with all assets based on your Highcharts license on our [download page](https://www.highcharts.com/download/#download-slot).

In your Flutter project create a folder for assets.
You can also have multiple asset folders or subfolders, if you like to have everything organized.
Copy the files of choice from the ZIP archive to the desired assets folder.
In our example we created a subfolder:

```Shell
mkdir -p assets/highcharts
```

You now have to inform Flutter about the assets folder.
Open the `pubspec.yaml` file in your Flutter project and make sure to have something similar configured to the following:

```YAML
flutter:
  assets:
    - assets/highcharts/
```

## Use Highcharts assets

Following the previous steps the Highcharts assets from the ZIP archive are made now available to all widgets in you Flutter project.
The final step is to define a loading widget that shall be visible while loading the Highcharts assets and otherwise show the Highcharts widget.

The following code is a simplified example to highlight the basic concept.

```dart
import 'package:flutter/material.dart';
import 'package:highcharts_flutter/highcharts.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyApp();
}

class _MyApp extends State<MyApp> {
  late List<String> _assets;

  @override
  void initState() {
    super.initState();

    _assets = [];
  }

  @override
  Widget build(BuildContext context) {
    if (_assets.isEmpty) {
      HighchartsHelpers.loadAssets([
        'assets/highcharts.js',
        'assets/highcharts-more.js'
      ]).then((assets) => setState(() {
        _assets = assets;
      }));

      return const CircularProgressIndicator();
    }

    return MaterialApp(
      title: 'My App',
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
          title: Text('My App'),
        ),
        body: SafeArea(child: ListView(
          children: [
            HighchartsChart(
              HighchartsOptions(
                title: HighchartsTitleOptions(
                  text: 'My Chart',
                ),
                series: [],
              ),
              // Add Highcharts assets as javaScriptModules.
              javaScriptModules: snapshot.data!,
            ),
          ],
        )),
      ),
    );
  }
}
```
