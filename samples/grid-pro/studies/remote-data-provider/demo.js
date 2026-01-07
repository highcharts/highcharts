/**
 * Maps Grid filter operator to API filter condition.
 */
function mapFilterCondition(operator) {
    const operatorMap = {
        '==': 'equals',
        '===': 'equals',
        '!=': 'doesNotEqual',
        '!==': 'doesNotEqual',
        '>': 'greaterThan',
        '>=': 'greaterThanOrEqualTo',
        '<': 'lessThan',
        '<=': 'lessThanOrEqualTo',
        contains: 'contains',
        startsWith: 'beginsWith',
        endsWith: 'endsWith',
        empty: 'empty'
    };
    return operatorMap[operator] || operator;
}

/**
 * Recursively extracts filter conditions from FilterCondition structure.
 */
function extractFilterConditions(condition, filterColumns = []) {
    if (!condition) {
        return filterColumns;
    }

    if (condition.operator === 'and' || condition.operator === 'or') {
        // Logical condition - extract from nested conditions
        if (condition.conditions) {
            for (const subCondition of condition.conditions) {
                extractFilterConditions(subCondition, filterColumns);
            }
        }
    } else if (condition.columnId) {
        // Single condition
        filterColumns.push({
            id: condition.columnId,
            condition: mapFilterCondition(condition.operator),
            value: condition.value
        });
    }

    return filterColumns;
}

Grid.grid('container', {
    data: {
        providerType: 'remote',
        chunkSize: 50,
        fetchCallback: async (query, offset, limit) => {
            const baseUrl = 'https://dataset-server-hc-production.up.railway.app/data';
            const params = new URLSearchParams();

            // Pagination - use offset/limit (page-based)
            const page = Math.floor(offset / limit) + 1;
            params.set('page', page.toString());
            params.set('pageSize', limit.toString());

            // Use columnar format (format=js) for better performance
            params.set('format', 'js');

            // Include only basic, non-nested columns
            const basicColumns = [
                'employeeId',
                'firstName',
                'lastName',
                'department',
                'role',
                'city',
                'country',
                'nationality',
                'employmentType',
                'projectsAssigned',
                'remote'
            ];
            params.set('columnsInclude', basicColumns.join(','));

            // Build filter from query.filtering.modifier
            const filterColumns = [];
            if (query.filtering.modifier?.options?.condition) {
                extractFilterConditions(
                    query.filtering.modifier.options.condition,
                    filterColumns
                );
            }

            if (filterColumns.length > 0) {
                const filterJson = JSON.stringify({ columns: filterColumns });
                params.set('filter', filterJson);
            }

            // Build sort from query.sorting.currentSorting
            const sorting = query.sorting.currentSorting;
            if (sorting?.columnId && sorting?.order) {
                params.set('sortBy', sorting.columnId);
                params.set('sortOrder', sorting.order);
            }

            const url = `${baseUrl}?${params.toString()}`;
            console.log('Fetching from:', url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const apiResponse = await response.json();

            // Convert API response to RemoteDataProvider format
            // API: {data: {columnId: [values]}, meta: {...}}
            // Need: {columns: {columnId: [values]}, totalRowCount, ...}
            const meta = apiResponse.meta || {};
            return {
                columns: apiResponse.data || {},
                currentPage: meta.currentPage || null,
                pageSize: meta.pageSize || limit,
                totalRowCount: meta.totalRowCount || 0
            };
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true
        }
    }
    // pagination: {
    //     enabled: true,
    //     pageSize: 22,
    //     totalItems: 100,
    //     controls: {
    //         pageSizeSelector: { // boolean
    //             enabled: true,
    //             options: [10, 20, 50, 100]
    //         },
    //         pageInfo: {  // boolean
    //             enabled: true
    //         },
    //         firstLastButtons: {  // boolean
    //             enabled: true
    //         },
    //         previousNextButtons: {  // boolean
    //             enabled: true
    //         },
    //         pageButtons: {  // boolean
    //             enabled: true,
    //             count: 5
    //         }
    //     }
    // }
});
