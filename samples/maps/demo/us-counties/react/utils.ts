type CountyTopoJSON = {
    objects: {
        default: {
            geometries: Array<{
                properties: {
                    'hc-key'?: string;
                    'name'?: string;
                };
            }>;
        };
    };
};

// Add state acronym for tooltip
export function addStateAcronyms(
    topology: Highcharts.TopoJSON
): Highcharts.TopoJSON {
    (topology as CountyTopoJSON).objects.default.geometries.forEach(g => {
        const properties = g.properties;
        if (properties['hc-key']) {
            properties.name =
                (properties.name ?? '') +
                ', ' +
                properties['hc-key'].substr(3, 2).toUpperCase();
        }
    });
    return topology;
}
