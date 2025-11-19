{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Batumi",
        "type": "start_end"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [41.6399, 41.643414]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Kutaisi",
        "type": "stop"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [42.694589, 42.267911]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Mestia",
        "type": "overnight"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [42.68948, 43.033461]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Ushguli",
        "type": "overnight"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [43.015799, 42.917532]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Route Batumi–Kutaisi–Mestia–Ushguli–Mestia–Batumi"
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [41.6399, 41.643414],   // Batumi
          [42.694589, 42.267911], // Kutaisi
          [42.68948, 43.033461],  // Mestia
          [43.015799, 42.917532], // Ushguli
          [42.68948, 43.033461],  // Mestia (geri dönüş)
          [41.6399, 41.643414]    // Batumi
        ]
      }
    }
  ]
}
