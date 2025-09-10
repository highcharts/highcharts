// --- Dendrogram "Stair Effect" Utility ---
// This function transforms flat treegraph data to create a step-wise dendrogram
// by inserting nameless "ghost" nodes. Use it to display a classic hierarchical
// layout. The original data remains unchanged.
// eslint-disable-next-line no-unused-vars
function createDendrogramData(sourceData) {
    // 1. Group nodes by their parent ID
    const nodesByParent = {};
    const structuralNodes = []; // Nodes that are not leaves (e.g., categories)

    sourceData.forEach(node => {
        // We identify leaf nodes by the presence of the 'custom' property.
        if (node.custom) {
            if (!nodesByParent[node.parent]) {
                nodesByParent[node.parent] = [];
            }
            nodesByParent[node.parent].push(node);
        } else {
            structuralNodes.push(node);
        }
    });

    const transformedData = [...structuralNodes];
    let ghostNodeCounter = 0;

    // 2. Process each group of leaf nodes
    for (const parentId in nodesByParent) {
        if (Object.prototype.hasOwnProperty.call(nodesByParent, parentId)) {
            const children = nodesByParent[parentId];

            // If a parent has 2 or fewer children, no transformation is needed.
            if (children.length <= 2) {
                transformedData.push(...children);
                continue;
            }

            // Apply the stair-step logic for parents with more than 2 children
            let currentParentId = parentId;

            // The first child connects directly to the original parent
            transformedData.push(children[0]);

            // Create a chain of ghost nodes for the intermediate children
            for (let i = 1; i < children.length - 1; i++) {
                const ghostNodeId = `${parentId}-ghost-${ghostNodeCounter++}`;

                // Create and add the ghost node
                transformedData.push({
                    id: ghostNodeId,
                    parent: currentParentId,
                    name: null // Nameless node
                });

                // Re-parent the actual child to the new ghost node
                const currentChild = { ...children[i], parent: ghostNodeId };
                transformedData.push(currentChild);

                // The next ghost node will be a child of this one
                currentParentId = ghostNodeId;
            }

            // The very last child connects to the last ghost node created
            const lastChild = {
                ...children[children.length - 1],
                parent: currentParentId
            };
            transformedData.push(lastChild);
        }
    }

    return transformedData;
}

// --- Demo Data ---
const data = [
    // Root
    {
        id: 'Programming Languages',
        parent: '',
        name: 'Programming Languages'
    },
    // Paradigms
    {
        id: 'Imperative',
        parent: 'Programming Languages',
        name: 'Imperative'
    },
    {
        id: 'Declarative',
        parent: 'Programming Languages',
        name: 'Declarative'
    },
    // Imperative subclasses
    {
        id: 'Procedural',
        parent: 'Imperative',
        name: 'Procedural'
    },
    {
        id: 'Object-Oriented',
        parent: 'Imperative',
        name: 'Object-Oriented'
    },
    {
        id: 'Scripting',
        parent: 'Imperative',
        name: 'Scripting'
    },
    // Declarative subclasses
    {
        id: 'Functional',
        parent: 'Declarative',
        name: 'Functional'
    },
    {
        id: 'Logic-based',
        parent: 'Declarative',
        name: 'Logic-based'
    },
    // Procedural - example with extra steps
    {
        id: 'C',
        parent: 'Procedural',
        name: 'C',
        custom: { year: 1972 },
        marker: {
            radius: 0.1
        },
        dataLabels: {
            rotation: 0,
            y: 0
        }
    },
    {
        id: 'Procedural2',
        parent: 'Procedural',
        name: 'Procedural',
        marker: {
            radius: 0
        },
        dataLabels: {
            enabled: false
        }
    },
    {
        id: 'Pascal',
        parent: 'Procedural2',
        name: 'Pascal',
        custom: { year: 1970 }
    },
    {
        id: 'Procedural3',
        parent: 'Procedural2',
        name: 'Procedural',
        marker: {
            radius: 0
        },
        dataLabels: {
            enabled: false
        }
    },
    {
        id: 'Go',
        parent: 'Procedural3',
        name: 'Go',
        custom: { year: 2009 }
    },
    {
        id: 'Julia',
        parent: 'Procedural3',
        name: 'Julia',
        custom: { year: 2012 }
    },
    // Object-Oriented
    {
        id: 'Java',
        parent: 'Object-Oriented',
        name: 'Java',
        custom: { year: 1995 }
    },
    {
        id: 'C++',
        parent: 'Object-Oriented',
        name: 'C++',
        custom: { year: 1985 }
    },
    {
        id: 'C#',
        parent: 'Object-Oriented',
        name: 'C#',
        custom: { year: 2000 }
    },
    {
        id: 'Python',
        parent: 'Object-Oriented',
        name: 'Python',
        custom: { year: 1991 }
    },
    {
        id: 'Kotlin',
        parent: 'Object-Oriented',
        name: 'Kotlin',
        custom: { year: 2011 }
    },
    {
        id: 'Swift',
        parent: 'Object-Oriented',
        name: 'Swift',
        custom: { year: 2014 }
    },
    {
        id: 'Rust',
        parent: 'Object-Oriented',
        name: 'Rust',
        custom: { year: 2010 }
    },
    {
        id: 'Dart',
        parent: 'Object-Oriented',
        name: 'Dart',
        custom: { year: 2011 }
    },
    {
        id: 'Scala',
        parent: 'Object-Oriented',
        name: 'Scala',
        custom: { year: 2004 }
    },
    // Scripting
    {
        id: 'JavaScript',
        parent: 'Scripting',
        name: 'JavaScript',
        custom: { year: 1995 }
    },
    {
        id: 'TypeScript',
        parent: 'Scripting',
        name: 'TypeScript',
        custom: { year: 2012 }
    },
    {
        id: 'PHP',
        parent: 'Scripting',
        name: 'PHP',
        custom: { year: 1995 }
    },
    {
        id: 'Ruby',
        parent: 'Scripting',
        name: 'Ruby',
        custom: { year: 1995 }
    },
    {
        id: 'Perl',
        parent: 'Scripting',
        name: 'Perl',
        custom: { year: 1987 }
    },
    {
        id: 'Bash',
        parent: 'Scripting',
        name: 'Bash',
        custom: { year: 1989 }
    },
    // Functional
    {
        id: 'Haskell',
        parent: 'Functional',
        name: 'Haskell',
        custom: { year: 1990 }
    },
    {
        id: 'Lisp',
        parent: 'Functional',
        name: 'Lisp',
        custom: { year: 1958 }
    },
    {
        id: 'Elm',
        parent: 'Functional',
        name: 'Elm',
        custom: { year: 2012 }
    },
    {
        id: 'Elixir',
        parent: 'Functional',
        name: 'Elixir',
        custom: { year: 2011 }
    },
    {
        id: 'F#',
        parent: 'Functional',
        name: 'F#',
        custom: { year: 2005 }
    },
    // Logic-based
    {
        id: 'Prolog',
        parent: 'Logic-based',
        name: 'Prolog',
        custom: { year: 1972 }
    },
    {
        id: 'Datalog',
        parent: 'Logic-based',
        name: 'Datalog',
        custom: { year: 1977 }
    }
];

// --- Choose display style ---
// To show the step-wise (stair) effect, uncomment the next line:
// const stairData = createDendrogramData(data);

Highcharts.chart('container', {
    chart: {
        inverted: true
    },
    title: {
        text: 'Programming Languages by Paradigm'
    },
    subtitle: {
        text: `Exploring Dendrogram Display Styles: Traditional Steps
            and Flattened View`
    },
    series: [
        {
            type: 'treegraph',
            // Change 'data' to 'stairData' for the step-wise version
            data,
            keys: ['id', 'parent', 'name', 'custom'],
            marker: {
                radius: 0
            },
            collapseButton: {
                x: -5
            },
            link: {
                type: 'default',
                radius: 0
            },
            dataLabels: {
                crop: false,
                y: -5,
                style: {
                    whiteSpace: 'nowrap',
                    color: '#000000',
                    textOutline: '3px contrast'
                },
                verticalAlign: 'middle'
            },
            levels: [
                {
                    level: 1,
                    dataLabels: {
                        crop: false,
                        overflow: 'allow',
                        y: 0,
                        style: {
                            textOutline: '6px contrast'
                        }
                    },
                    collapseButton: {
                        x: -15
                    }
                },
                // if you use full step display, skip below settings
                {
                    level: 3,
                    colorByPoint: true,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                },
                {
                    level: 4,
                    colorVariation: {
                        key: 'brightness',
                        to: -0.5
                    },
                    dataLabels: {
                        verticalAlign: 'top',
                        rotation: 90,
                        y: 20
                    },
                    marker: {
                        radius: 7
                    }
                }
            ]
        }
    ],
    tooltip: {
        pointFormatter: function () {
            return this.custom?.year ?
                `<b>${this.name}</b><br/>Created in: ${this.custom.year}` :
                `<b>${this.name}</b>`;
        },
        useHTML: true
    }
});
