import type { CountyTopology } from './types';

// Add state acronym for tooltip
export function addStateAcronyms(mapData: CountyTopology): void {
    mapData.objects.default.geometries.forEach(g => {
        const properties = g.properties;
        if (properties['hc-key']) {
            properties.name =
                properties.name +
                ', ' +
                properties['hc-key'].substr(3, 2).toUpperCase();
        }
    });
}
