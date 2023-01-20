Edit mode
===

Edit mode is a mode, in which the user can change the appearance of the dashboard through the UI. To turn on this feature, you need to add the class to main dashboard div:
```html
<div id="container" class="highcharts-dashboard"></div>
```


Also in the dashboard config, this option needs to be enabled:
```javascript
    editMode: {
            enabled: true,
            contextMenu: {
                enabled: true,
                items: ['editMode']
            }
        },
```

Then, the edit mode option can be enabled by the context menu in the upper right corner.

![edit-mode-context-menu.png](edit-mode-context-menu.png)

When edit mode is enabled, the appearance of the dashboard changes. When a cell is hovered it gets blue border and the row, in which the cell is, gets green border. Additionally both row and cell get a tooltip, wich allows the user to change its position, change its options, or just delete it.

![edit-mode-tooltip.png](edit-mode-tooltip.png)

Additionally the buttons next to the burger menu are added.

The “Large”, “medium”, and “small” buttons change the width of the dashboard, to let the designer check, how the dashboard would look like for tablets and smartphones with smaller screens.

The `Add` button allows the user to add the new component. When clicked, the sidebar is shown, which lets you choose the type of component you want to add, and then by drag&drop component type can be selected and dragged to the correct place, which is also indicated by the drop marker.

![edit-mode-sidebar.png](edit-mode-sidebar.png)