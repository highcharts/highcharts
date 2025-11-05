# Highcharts Mobile Interactions - Comprehensive Test Plan

## Application Overview

Highcharts is a powerful JavaScript charting library that provides rich interactive functionality across desktop and mobile devices. This test plan focuses specifically on mobile device interactions, including:

- **Touch-based Zooming**: Single-touch and pinch-to-zoom gestures for data exploration
- **Responsive Design**: Charts that adapt their layout and presentation based on viewport size
- **Scrollable Plot Areas**: Horizontal and vertical scrolling for large datasets
- **Touch Selection**: Navigator and range selector interactions using touch gestures
- **Panning**: Touch-based chart panning after zooming
- **Mouse Wheel/Pinch Zoom**: Alternative zoom methods for hybrid devices

The test scenarios cover both portrait and landscape orientations on various mobile device sizes (phones and tablets) as well as responsive behavior on desktop browsers.

## Test Environment Requirements

### Desktop Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)

### Mobile Devices (Physical or Emulated)
- **iOS**: iPhone SE, iPhone 14 Pro, iPad Air, iPad Pro
- **Android**: Samsung Galaxy S21, Google Pixel 7, Samsung Galaxy Tab S8
- **Viewports (Logical/CSS Pixels)**: 375x667 (iPhone SE), 412x915 (Pixel 7), 393x852 (iPhone 14 Pro), 820x1180 (iPad Air)

### Test Approach
Tests use Playwright's device emulation with `createChart()` from `tests/fixtures.ts` or `getSample()` from `tests/utils.ts` to load sample demos from the `/samples` directory. All network requests are intercepted and served locally via route handlers.

## Test Scenarios

---

### 1. Single Touch Zoom - Enable/Disable

**Seed:** `tests/highcharts/seed.spec.ts`

**Sample Path:** `samples/highcharts/chart/zoombysingletouch/`

**Devices:** All mobile devices (iPhone SE, Pixel 7, iPhone 14 Pro, iPad Air)

#### 1.1 Single Touch Zoom Enabled
**Starting State:** Chart loaded with `zooming.singleTouch: true`

**Steps:**
1. Load the single touch zoom demo page on mobile device
2. Verify the "True" button is active/highlighted
3. Place one finger on the chart plot area at the left edge (near Jan)
4. Drag finger horizontally to the right edge (near Jun) without lifting
5. Release finger

**Expected Results:**
- Chart zooms into the selected range (Jan to Jun visible)
- Other data points outside range are hidden
- X-axis updates to show only selected categories
- "Reset zoom" button appears in the chart
- Vertical scroll on page should be prevented during drag gesture
- Chart should not pan, only zoom selection visible

#### 1.2 Single Touch Zoom Disabled
**Starting State:** Chart loaded with `zooming.singleTouch: false`

**Steps:**
1. Tap the "False" button to disable single touch zoom
2. Verify the "False" button becomes active/highlighted
3. Place one finger on the chart plot area
4. Drag finger horizontally across the chart
5. Release finger
6. Attempt to scroll the page vertically while finger is over the chart

**Expected Results:**
- No zoom selection occurs during drag gesture
- Chart does not zoom
- Page scrolls normally when dragging vertically
- Tooltip may appear and follow finger movement
- Chart remains in default view without zoom

#### 1.3 Reset Zoom After Single Touch
**Starting State:** Chart is zoomed from scenario 1.1

**Steps:**
1. Locate the "Reset zoom" button (typically top-right of chart)
2. Tap the "Reset zoom" button with one finger
3. Observe the chart animation

**Expected Results:**
- Chart animates back to default view showing all data
- All original data points become visible (Jan through Dec)
- "Reset zoom" button disappears
- X-axis and Y-axis reset to original scales
- Chart is interactive and ready for new zoom action

#### 1.4 Toggle Single Touch Multiple Times
**Starting State:** Chart in default view

**Steps:**
1. Tap "True" button to enable single touch zoom
2. Perform a zoom gesture (drag across chart)
3. Verify zoom occurs
4. Tap "Reset zoom" button
5. Tap "False" button to disable single touch zoom
6. Attempt zoom gesture (drag across chart)
7. Verify no zoom occurs
8. Tap "True" button again
9. Perform another zoom gesture

**Expected Results:**
- Button states update correctly with each tap (active styling)
- Zoom behavior matches button state consistently
- No errors in console
- Chart updates configuration in real-time
- Each zoom gesture after re-enabling works correctly
- Page scrolling behavior changes based on mode

---

### 2. XY Zoom and Panning

**Seed:** `tests/highcharts/seed.spec.ts`

**Sample Path:** `samples/highcharts/chart/panning-type/` or `samples/highcharts/chart/zoomtype-xy/`

**Devices:** All mobile devices

#### 2.1 Pinch to Zoom In
**Starting State:** Chart loaded with `zooming.type: 'xy'`

**Steps:**
1. Load XY zoom chart on mobile device
2. Place two fingers close together in the center of the chart plot area
3. Move fingers apart (pinch-out gesture) to zoom in
4. Lift both fingers
5. Observe the zoomed chart

**Expected Results:**
- Chart zooms into the area between the two fingers
- Both X and Y axes scale to show zoomed region
- Data points appear larger and more spread out
- Axis labels update to reflect new scale
- "Reset zoom" button appears
- Zoom maintains aspect ratio based on gesture

#### 2.2 Pinch to Zoom Out
**Starting State:** Chart is zoomed in from scenario 2.1

**Steps:**
1. Place two fingers far apart on the zoomed chart
2. Move fingers closer together (pinch-in gesture)
3. Lift both fingers
4. Observe the chart zoom level

**Expected Results:**
- Chart zooms out showing more data
- If fully zoomed out, approaches or reaches default view
- "Reset zoom" button may disappear if fully zoomed out
- Axis scales update accordingly
- Minimum zoom level is enforced (cannot zoom out beyond default view)

#### 2.3 Two-Finger Pan After Zoom
**Starting State:** Chart is zoomed in (from scenario 2.1)

**Steps:**
1. Place two fingers on the chart plot area
2. Drag both fingers together in the same direction (left, right, up, down)
3. Release fingers
4. Repeat panning in different directions

**Expected Results:**
- Chart pans to show different areas of the zoomed data
- Panning is smooth and follows finger movement
- Chart boundaries are respected (cannot pan beyond data limits)
- Axis labels update during panning
- Tooltip does not appear during two-finger pan
- Panning can be done horizontally, vertically, or diagonally

#### 2.4 Single Finger Drag to Zoom (Rectangular Selection)
**Starting State:** Chart in default view with `zooming.singleTouch: true`

**Steps:**
1. Place one finger at top-left of desired zoom area
2. Drag diagonally to bottom-right to create rectangular selection
3. Release finger
4. Observe the resulting zoom

**Expected Results:**
- Semi-transparent selection rectangle appears during drag
- Chart zooms to the selected rectangular area
- Both X and Y axes zoom to fit selection
- "Reset zoom" button appears
- Data outside selection is hidden

#### 2.5 Zoom Limits and Boundaries
**Starting State:** Chart in default view

**Steps:**
1. Attempt to zoom in to maximum level using pinch gesture (repeat multiple times)
2. Try to zoom in further beyond maximum
3. Reset zoom
4. Attempt to zoom out beyond default view using pinch-in gesture

**Expected Results:**
- Chart allows zoom in up to reasonable maximum (e.g., showing 2-3 data points)
- Further zoom-in attempts have no effect
- Chart does not allow zoom out beyond default view
- No JavaScript errors occur at zoom limits
- User receives visual feedback that limits are reached (gesture has no effect)

---

### 3. Scrollable Plot Area

**Seed:** `tests/highcharts/seed.spec.ts`

**Sample Path:** `samples/highcharts/chart/scrollable-plotarea/`

**Devices:** All mobile devices, especially narrow viewports (iPhone SE)

#### 3.1 Horizontal Scroll on Load
**Starting State:** Page just loaded with scrollable plot area chart

**Steps:**
1. Load the scrollable plot area demo on mobile device
2. Observe the initial chart state
3. Note the scroll position indicator or visible data range
4. Check if horizontal scrollbar is visible

**Expected Results:**
- Chart loads with `scrollablePlotArea.minWidth` enforced (e.g., 700px+)
- Chart plot area is wider than viewport on mobile
- Horizontal scroll capability is available
- Chart may show scrollbar or scroll indicators
- Initial `scrollPositionX` is respected (default 0 or configured value)
- Y-axis and legend remain fixed/visible

#### 3.2 Horizontal Scroll Right
**Starting State:** Chart at default scroll position (left edge)

**Steps:**
1. Place one finger on the chart plot area
2. Drag finger from right to left (swipe left) to scroll right
3. Continue scrolling until reaching the right edge of the chart
4. Release finger

**Expected Results:**
- Chart scrolls horizontally to reveal more data on the right
- Scrolling is smooth without lag
- Y-axis remains fixed (does not scroll)
- Chart title and legend remain visible
- Data points and line continue smoothly during scroll
- Cannot scroll beyond right edge of data
- Elastic bounce effect may appear at edge (iOS)

#### 3.3 Horizontal Scroll Left
**Starting State:** Chart scrolled to the right (from scenario 3.2)

**Steps:**
1. Place one finger on the chart plot area
2. Drag finger from left to right (swipe right) to scroll left
3. Continue scrolling until reaching the left edge
4. Release finger

**Expected Results:**
- Chart scrolls back to the left showing earlier data
- Scrolling is smooth in reverse direction
- Cannot scroll beyond left edge of data
- All fixed elements remain in place
- Scroll position indicator updates accordingly

#### 3.4 Rapid Flick Scroll (Momentum)
**Starting State:** Chart at default position

**Steps:**
1. Place finger on chart plot area
2. Perform a quick flick/swipe gesture from right to left
3. Lift finger immediately after flick
4. Observe the scrolling behavior

**Expected Results:**
- Chart continues scrolling with momentum after finger lift
- Scroll velocity matches flick intensity
- Scrolling gradually decelerates
- Scroll stops at appropriate position or edge
- Momentum scroll can be interrupted by touching the chart

#### 3.5 Vertical Page Scroll with Horizontal Chart Scroll
**Starting State:** Page loaded with scrollable chart

**Steps:**
1. Scroll the page vertically to position the chart in middle of viewport
2. Place finger on chart and attempt to scroll the chart horizontally
3. Lift finger
4. Place finger on chart and attempt to scroll vertically
5. Place finger outside chart and scroll page vertically

**Expected Results:**
- Horizontal gestures on chart scroll the chart, not the page
- Vertical gestures on chart may scroll the page (if chart not vertically scrollable)
- Touch event handling correctly distinguishes horizontal vs vertical intent
- No conflict between page scroll and chart scroll
- Chart scroll is isolated when appropriate

#### 3.6 Scrollable Plot Area on Tablet Landscape
**Starting State:** Tablet in landscape orientation (e.g., iPad Air 820x1180 rotated)

**Steps:**
1. Load scrollable plot area chart on tablet in landscape mode
2. Observe if scrolling is needed given wider viewport
3. If chart still scrolls, test scroll gestures as in scenarios 3.2-3.4

**Expected Results:**
- Chart may fit entirely in landscape viewport if `minWidth` < viewport width
- If scrolling still needed, it functions correctly
- Chart adapts responsively to landscape orientation
- All interactions remain smooth on larger viewport

---

### 4. Responsive Chart Behavior

**Seed:** `tests/highcharts/seed.spec.ts`

**Sample Path:** `samples/highcharts/responsive/axis/`

**Devices:** All devices, test with device rotation

#### 4.1 Responsive Chart on Small Viewport (Portrait Phone)
**Starting State:** Chart loaded on iPhone SE (375x667) in portrait

**Steps:**
1. Load responsive chart demo on small phone viewport
2. Observe the chart layout, axis labels, legend, and title
3. Note any responsive adaptations
4. Compare to design specifications for small viewports

**Expected Results:**
- Chart renders within viewport without horizontal overflow
- X-axis labels are abbreviated or rotated (e.g., "J, F, M, A" instead of "January, February...")
- Y-axis title may be hidden or shortened
- Legend may be repositioned (below chart instead of right side)
- Font sizes may be reduced for readability
- Chart maintains aspect ratio appropriate for mobile
- All interactive elements remain accessible
- Responsive rules defined in `responsive.rules` are applied

#### 4.2 Responsive Chart on Medium Viewport (Phablet/Small Tablet)
**Starting State:** Chart loaded on Pixel 7 (412x915) or similar

**Steps:**
1. Load responsive chart on medium viewport device
2. Observe chart layout compared to small viewport
3. Check if different responsive rules apply

**Expected Results:**
- Chart may show more detail than small viewport
- Axis labels may be less abbreviated
- More responsive breakpoint rules may apply
- Chart utilizes available space efficiently
- Layout is optimized for medium-sized screens

#### 4.3 Responsive Chart on Tablet (Landscape)
**Starting State:** Chart loaded on iPad Air (1180x820) in landscape mode

**Steps:**
1. Load responsive chart on tablet in landscape orientation
2. Observe full chart layout
3. Compare to mobile phone layouts

**Expected Results:**
- Chart displays full details (no abbreviated labels)
- All legend items visible
- Y-axis title displayed fully
- Chart resembles desktop version
- Large viewport responsive rules (or no rules) applied
- Chart takes advantage of available width and height

#### 4.4 Device Rotation: Portrait to Landscape
**Starting State:** Chart loaded on iPhone 14 Pro in portrait (393x852)

**Steps:**
1. Load responsive chart on phone in portrait mode
2. Note the current chart layout and responsive adaptations
3. Rotate device to landscape orientation (932x430)
4. Observe chart reflow and layout changes
5. Rotate back to portrait
6. Observe chart returns to portrait layout

**Expected Results:**
- Chart immediately reflows when device rotates
- Appropriate responsive rules apply for new orientation
- Landscape may show full labels, portrait shows abbreviated
- Chart dimensions update to fit new viewport
- No layout breaking or overlapping elements
- Rotation animation is smooth
- Chart state (zoom, selection) is preserved during rotation

#### 4.5 Dynamic Viewport Resize
**Starting State:** Chart loaded on desktop browser at 1200px width

**Steps:**
1. Load responsive chart on desktop browser
2. Open browser developer tools and enable device emulation
3. Start with 1200px viewport width
4. Gradually resize viewport from 1200px down to 375px
5. Observe chart changes at various breakpoints
6. Resize back up to 1200px

**Expected Results:**
- Chart responds to each breakpoint defined in `responsive.rules`
- At 800px: some responsive adaptations may occur
- At 500px: mobile responsive rules apply (abbreviated labels, repositioned legend)
- At 375px: smallest viewport rules apply
- Changes are smooth and immediate
- No JavaScript errors during resize
- Chart remains functional at all viewport sizes
- Resizing up reverses the responsive adaptations

#### 4.6 Programmatic Resize with `setSize()`
**Starting State:** Responsive chart with resize buttons (Small, Medium, Large)

**Steps:**
1. Load responsive chart with size control buttons
2. Tap "Small (400px)" button
3. Observe chart resize to 400px width
4. Verify responsive rules for width < 500px are applied
5. Tap "Medium (600px)" button
6. Observe chart resize and responsive rules
7. Tap "Large (1000px)" button
8. Verify responsive rules do not apply (or different rules apply)

**Expected Results:**
- Chart resizes to exact dimensions specified
- Button click triggers `chart.setSize(width, height)`
- Responsive rules evaluate based on new chart size
- Small size (400px): abbreviated axis labels, repositioned elements
- Medium size (600px): some responsive adaptations
- Large size (1000px): full desktop layout
- Transitions are smooth
- Chart remains interactive after each resize

---

### 5. Mouse Wheel and Pinch Zoom

**Seed:** `tests/highcharts/seed.spec.ts`

**Sample Path:** `samples/highcharts/mouse-wheel-zoom/enabled/`

**Devices:** Tablets and hybrid devices with trackpad/mouse support

#### 5.1 Mouse Wheel Zoom In
**Starting State:** Chart loaded with `zooming.mouseWheel.enabled: true` (test on desktop or tablet with mouse)

**Steps:**
1. Load mouse wheel zoom chart
2. Position mouse cursor over chart plot area center
3. Scroll mouse wheel forward (away from user)
4. Repeat wheel scroll 3-5 times
5. Observe zoom behavior

**Expected Results:**
- Chart zooms in centered on mouse cursor position
- Each wheel scroll increments zoom level
- Zoom is smooth and proportional to scroll amount
- Sensitivity setting controls zoom speed (`sensitivity: 1.1` default)
- Both X and Y axes zoom proportionally
- "Reset zoom" button appears after zoom
- Chart does not scroll the page during zoom

#### 5.2 Mouse Wheel Zoom Out
**Starting State:** Chart is zoomed in from scenario 5.1

**Steps:**
1. Position mouse cursor over chart plot area
2. Scroll mouse wheel backward (toward user)
3. Continue scrolling until reaching default zoom level
4. Attempt to zoom out beyond default view

**Expected Results:**
- Chart zooms out with each wheel scroll
- Zoom out is smooth and controlled
- Chart stops zooming at default view (cannot zoom out beyond)
- "Reset zoom" button disappears when fully zoomed out
- Page does not scroll during wheel interaction over chart

#### 5.3 Mouse Wheel Zoom at Different Sensitivity
**Starting State:** Chart with adjustable sensitivity or test with different configurations

**Steps:**
1. Load chart with `zooming.mouseWheel.sensitivity: 1.5` (faster)
2. Perform 3 wheel scrolls to zoom in
3. Note the zoom level achieved
4. Reset chart
5. Load chart with `zooming.mouseWheel.sensitivity: 1.05` (slower)
6. Perform 3 wheel scrolls to zoom in
7. Compare zoom levels

**Expected Results:**
- Higher sensitivity (1.5) results in faster/more aggressive zoom
- Lower sensitivity (1.05) results in slower/finer zoom control
- Both sensitivity settings work smoothly
- User can choose preferred zoom speed
- Sensitivity value is respected consistently

#### 5.4 Pinch Zoom on Touch-enabled Tablet
**Starting State:** Chart on iPad or Android tablet with touch screen

**Steps:**
1. Load mouse wheel zoom chart on tablet (chart has `zooming.type: 'xy'`)
2. Place two fingers on chart plot area
3. Perform pinch-out gesture (zoom in)
4. Lift fingers
5. Place two fingers again and perform pinch-in gesture (zoom out)

**Expected Results:**
- Pinch gestures work identically to mouse wheel zoom
- Zoom is centered between the two touch points
- Pinch-out zooms in, pinch-in zooms out
- Zoom is smooth and proportional to pinch distance
- Works independently of mouse wheel configuration
- Chart supports both pinch and wheel zoom methods

#### 5.5 Mouse Wheel Zoom on Different Chart Types
**Starting State:** Various chart types with mouse wheel zoom enabled

**Steps:**
1. Test mouse wheel zoom on line chart
2. Test on scatter plot
3. Test on column/bar chart
4. Test on area chart
5. For each, zoom in and out using mouse wheel

**Expected Results:**
- Mouse wheel zoom works consistently across chart types
- Each chart type zooms appropriately (cartesian charts: XY zoom)
- Chart-specific features remain functional during zoom (columns remain attached to axis, areas fill correctly)
- No errors specific to certain chart types
- All data rendering is correct at all zoom levels

---

### 6. Stock Chart Navigator and Range Selector

**Seed:** `tests/highcharts/seed.spec.ts`

**Sample Path:** `samples/stock/demo/basic-line/` or stock chart with navigator

**Devices:** All mobile devices

#### 6.1 Navigator Drag Handle (Left)
**Starting State:** Stock chart loaded with navigator showing full data range

**Steps:**
1. Load stock chart with navigator on mobile device
2. Locate the navigator component (typically below main chart)
3. Identify the left drag handle on the navigator
4. Place finger on the left handle
5. Drag the left handle to the right (toward center)
6. Release finger
7. Observe both main chart and navigator

**Expected Results:**
- Left handle moves smoothly with finger during drag
- Selected range (shaded area) in navigator shrinks from the left
- Main chart updates in real-time to show data from new start date
- X-axis labels in main chart update to reflect new range
- Right handle remains in original position
- Navigator mask (unselected area) becomes darker/more opaque on the left
- Drag is constrained (cannot drag left handle past right handle)

#### 6.2 Navigator Drag Handle (Right)
**Starting State:** Stock chart loaded with full range selected

**Steps:**
1. Locate the right drag handle on the navigator
2. Place finger on the right handle
3. Drag the right handle to the left (toward center)
4. Release finger
5. Observe chart updates

**Expected Results:**
- Right handle moves smoothly with finger
- Selected range shrinks from the right
- Main chart updates to show data up to new end date
- X-axis labels update accordingly
- Left handle remains stationary
- Navigator mask becomes darker on the right side
- Cannot drag right handle past left handle

#### 6.3 Navigator Selection Drag (Move Window)
**Starting State:** Navigator with partial range selected (e.g., middle 3 months of 12-month period)

**Steps:**
1. Place finger in the center of the selected (unmasked) area in navigator
2. Drag left to shift selection window backward in time
3. Release finger
4. Place finger in selected area again
5. Drag right to shift selection window forward in time
6. Release finger

**Expected Results:**
- Entire selection window moves left or right while maintaining its width
- Both handles move together during drag
- Main chart updates to show new time range
- Selected range width (time span) remains constant
- Cannot drag beyond data boundaries (stops at edges)
- Drag is smooth and responsive to touch

#### 6.4 Navigator Pinch to Zoom
**Starting State:** Stock chart with full range in navigator

**Steps:**
1. Place two fingers inside the navigator selected area
2. Perform pinch-out gesture (fingers apart) to narrow selection
3. Observe main chart and navigator
4. Place two fingers in navigator again
5. Perform pinch-in gesture (fingers together) to widen selection

**Expected Results:**
- Pinch-out: Selection range narrows, showing less time in main chart
- Both navigator handles move inward (toward center)
- Pinch-in: Selection range expands, showing more time in main chart
- Both navigator handles move outward
- Main chart updates smoothly during pinch
- Pinch zoom is centered between touch points
- Cannot pinch beyond minimum/maximum ranges

#### 6.5 Range Selector Buttons
**Starting State:** Stock chart with range selector buttons (1M, 3M, 6M, YTD, 1Y, All)

**Steps:**
1. Identify range selector buttons (typically above chart or in toolbar)
2. Tap "1M" (1 month) button
3. Observe chart and navigator update
4. Tap "6M" (6 months) button
5. Observe chart and navigator update
6. Tap "All" button
7. Observe full range display

**Expected Results:**
- Tapping each button updates chart to show corresponding time range
- Navigator handles move to match selected range
- Main chart axis updates to selected period
- Currently selected button is highlighted/active
- Button tap is immediate and responsive
- Data loads if lazy loading is configured
- Data grouping may adjust based on range (e.g., daily for 1M, weekly for 1Y)

#### 6.6 Navigator Touch Interactions with Tooltip
**Starting State:** Stock chart with navigator

**Steps:**
1. Tap on a data point in the main chart
2. Observe tooltip appearance
3. Tap in the navigator selected area (not on handles)
4. Observe if tooltip appears in navigator
5. Drag in navigator and check if tooltip interferes

**Expected Results:**
- Tooltip appears correctly in main chart on tap
- Navigator interactions do not incorrectly trigger tooltips
- Tooltip in navigator (if present) shows data for that time point
- Dragging in navigator does not leave tooltip stuck on screen
- Touch events are correctly attributed to navigation vs tooltip display
- No conflicts between navigator drag and tooltip activation

---

### 7. Pan After Zoom

**Seed:** `tests/highcharts/seed.spec.ts`

**Sample Path:** `samples/highcharts/chart/panning-type/`

**Devices:** All mobile devices

#### 7.1 Single Finger Pan After Zoom (with panKey)
**Starting State:** Chart zoomed in with `panning.enabled: true` and `panKey: 'shift'`

**Steps:**
1. Zoom into chart using pinch gesture or zoom selection
2. Verify chart is zoomed
3. Place one finger on chart plot area
4. Drag finger left, right, up, or down
5. Release finger

**Expected Results (Desktop with panKey):**
- Without holding shift: Single finger drag does not pan
- With shift held: Single finger drag pans the chart
- On mobile (touch): Single finger drag may pan directly (panKey not applicable)
- If `panning.type: 'xy'`, panning works in all directions
- Chart boundaries are respected
- Smooth panning motion follows finger

#### 7.2 Two Finger Pan After Zoom
**Starting State:** Chart zoomed in with `panning.enabled: true`

**Steps:**
1. Ensure chart is zoomed in
2. Place two fingers on the chart plot area
3. Drag both fingers together in the same direction (horizontally or vertically)
4. Release fingers
5. Repeat in different directions

**Expected Results:**
- Two-finger drag pans the chart smoothly
- Panning works regardless of `panKey` setting (common mobile pattern)
- Chart data shifts to reveal adjacent areas
- Axes update continuously during pan
- Cannot pan beyond data extents
- Panning stops when reaching chart boundaries
- Tooltip does not appear during two-finger pan

#### 7.3 Pan Boundaries and Limits
**Starting State:** Chart zoomed into center area

**Steps:**
1. Pan chart toward the left boundary
2. Continue attempting to pan left beyond data edge
3. Observe behavior at boundary
4. Pan chart toward the right boundary
5. Attempt to pan right beyond data edge
6. Repeat for top and bottom boundaries (if Y panning enabled)

**Expected Results:**
- Chart stops panning when reaching data boundaries
- Elastic bounce effect may appear at boundaries (device-dependent)
- Cannot pan to show empty space beyond data
- Axes do not extend beyond data min/max values
- Panning is constrained appropriately in both X and Y directions
- Clear visual feedback that boundary is reached

#### 7.4 Pan Performance with Large Datasets
**Starting State:** Chart with 1000+ data points, zoomed in to show ~50 points

**Steps:**
1. Load chart with large dataset
2. Zoom in to a small section
3. Perform rapid panning back and forth across the zoomed area
4. Observe performance and smoothness
5. Check for frame drops or lag

**Expected Results:**
- Panning remains smooth even with large dataset
- No visible lag or stuttering during rapid pan gestures
- Frame rate stays at 60fps or close (if measurable)
- Chart rendering keeps up with touch input
- No console errors related to performance
- Data grouping or other optimizations work correctly

#### 7.5 Pan and Reset Zoom
**Starting State:** Chart zoomed and panned to show specific area

**Steps:**
1. Zoom into chart
2. Pan to a different area within the zoom
3. Locate and tap the "Reset zoom" button
4. Observe chart return to default

**Expected Results:**
- Reset zoom button is accessible and tappable
- Tapping reset zoom returns chart to original view
- Both zoom and pan are reset
- Chart animates back to default state
- Reset is immediate and complete
- Chart is ready for new interactions after reset

---

### 8. Orientation Changes and Multi-Touch

**Seed:** `tests/highcharts/seed.spec.ts`

**Devices:** Mobile devices capable of rotation

#### 8.1 Chart State Preserved During Rotation
**Starting State:** Chart zoomed and panned to specific area in portrait mode

**Steps:**
1. Load chart on mobile device in portrait orientation
2. Zoom into a specific data range
3. Pan to a particular position within the zoom
4. Rotate device to landscape orientation
5. Observe chart state
6. Rotate back to portrait

**Expected Results:**
- Chart zoom level is preserved during rotation
- Pan position is maintained (same data visible)
- Chart reflows to fit new orientation
- Responsive rules apply appropriately for landscape vs portrait
- No loss of interaction state
- "Reset zoom" button remains if chart was zoomed
- Chart aspect ratio adjusts but content is consistent

#### 8.2 Simultaneous Multi-Touch (Three Fingers)
**Starting State:** Chart in default view

**Steps:**
1. Place three fingers on the chart plot area simultaneously
2. Move all three fingers in the same direction
3. Release all fingers
4. Observe chart behavior

**Expected Results:**
- Chart handles multi-touch gracefully
- Three-finger gesture may be treated as pan (similar to two-finger)
- No crashes or errors from multi-touch input
- Chart does not enter unexpected state
- Only intended gestures (pinch, pan) are recognized
- Extra touch points are ignored or handled appropriately

#### 8.3 Touch During Chart Animation
**Starting State:** Chart in process of animating (zooming, loading, or resetting)

**Steps:**
1. Trigger a zoom reset (chart begins animating back to default)
2. While animation is in progress, place finger on chart
3. Attempt to interact (pan, zoom) during animation
4. Observe chart response

**Expected Results:**
- Touch input during animation either:
  - Cancels animation and responds to new input immediately, OR
  - Is queued until animation completes
- No visual glitches or broken state
- Chart recovers to interactive state smoothly
- No double-interaction or conflicting gestures
- Consistent behavior across devices

---

### 9. Edge Cases and Error Handling

**Seed:** `tests/highcharts/seed.spec.ts`

#### 9.1 Rapid Repeated Zoom In/Out
**Starting State:** Chart in default view

**Steps:**
1. Perform rapid pinch-out zoom in gesture
2. Immediately perform pinch-in zoom out gesture
3. Repeat zoom in/out rapidly 10 times in succession
4. Observe chart behavior and check console for errors

**Expected Results:**
- Chart handles rapid zoom changes without errors
- Each zoom gesture is processed correctly
- No visual artifacts or broken rendering
- Chart does not freeze or become unresponsive
- Animation queue handles rapid inputs appropriately
- No JavaScript errors in console
- Chart remains in consistent state after rapid inputs

#### 9.2 Extremely Small Zoom Range
**Starting State:** Chart with many data points

**Steps:**
1. Zoom into chart to show only 2-3 data points
2. Attempt to zoom in further
3. Observe chart behavior and axis labels
4. Check if data points are still selectable/interactive

**Expected Results:**
- Chart enforces minimum zoom level
- Data points remain visible and not infinitely large
- Axis labels remain readable (or adjust appropriately)
- Tooltip still works on visible data points
- Chart does not allow zoom beyond reasonable limit
- No rendering issues with extreme zoom

#### 9.3 Touch and Hold (Long Press)
**Starting State:** Chart in default view

**Steps:**
1. Place finger on a data point in the chart
2. Hold finger stationary for 2-3 seconds (long press)
3. Release finger
4. Observe chart behavior

**Expected Results:**
- Long press may trigger context menu (device-dependent)
- Tooltip appears and remains visible
- Long press does not unintentionally trigger zoom or pan
- Chart state remains stable
- Context menu (if any) is accessible and functional
- No interference with subsequent normal touches

#### 9.4 Network Delay During Lazy Loading (Stock Charts)
**Starting State:** Stock chart with lazy loading enabled

**Steps:**
1. Load stock chart with large historical dataset
2. Simulate slow network (using browser dev tools, if testing on desktop)
3. Use range selector to select a new date range that requires data loading
4. Observe loading behavior
5. Attempt to interact with chart while data is loading

**Expected Results:**
- Loading indicator appears while data loads
- Chart remains interactive (or gracefully disables interactions)
- Interactions during loading are queued or blocked appropriately
- Data loads successfully despite delay
- Chart updates correctly once data arrives
- No errors if user rapidly changes range selections
- Timeout handling prevents indefinite loading state

#### 9.5 Very Wide Scrollable Plot Area on Mobile
**Starting State:** Chart with `scrollablePlotArea.minWidth: 5000` (very wide)

**Steps:**
1. Load extremely wide scrollable chart on mobile device
2. Attempt to scroll from left edge to right edge
3. Use rapid flick gestures to scroll quickly
4. Check for performance issues or rendering problems

**Expected Results:**
- Chart handles very wide plot area without errors
- Scrolling remains smooth even with large width
- Chart renders visible portion efficiently
- Flick scrolling works with appropriate momentum
- No memory leaks or excessive resource usage
- Chart does not freeze or crash with extreme width
- Scrolling boundaries are correctly enforced

---

### 10. Accessibility and Touch Target Sizes

**Seed:** `tests/highcharts/seed.spec.ts`

#### 10.1 Touch Target Size for Navigator Handles
**Starting State:** Stock chart with navigator on mobile device

**Steps:**
1. Load stock chart with navigator on small phone (iPhone SE)
2. Attempt to tap and drag the left navigator handle with finger
3. Measure or observe ease of grabbing handle
4. Repeat with right handle
5. Compare to larger devices

**Expected Results:**
- Navigator handles are at least 44x44 pixels (iOS guideline) or 48x48dp (Android)
- Handles are easily grabbable with finger (not too small)
- Touch target may be larger than visual handle size (invisible padding)
- Accurate drag initiation without missing the handle
- No accidental taps on adjacent elements
- Handles are visually distinct and easy to identify

#### 10.2 Button Touch Targets (Reset Zoom, Range Selectors)
**Starting State:** Chart with reset zoom button and range selector buttons visible

**Steps:**
1. Observe size and spacing of "Reset zoom" button
2. Tap the reset zoom button with finger
3. Observe size of range selector buttons ("1M", "3M", "6M", etc.)
4. Tap each range selector button sequentially
5. Check for accidental mis-taps on adjacent buttons

**Expected Results:**
- All buttons meet minimum touch target size (44x44px or 48x48dp)
- Sufficient spacing between adjacent buttons (8px+ margin)
- Buttons respond accurately to taps
- No accidental activation of wrong button
- Button press provides visual feedback (highlight, press state)
- Buttons are reachable with thumb in one-handed mobile use

#### 10.3 Tooltip Accessibility on Touch
**Starting State:** Chart with interactive data points

**Steps:**
1. Tap on a data point to trigger tooltip
2. Observe tooltip appearance and position
3. Attempt to read tooltip content
4. Tap elsewhere on chart
5. Observe tooltip dismissal

**Expected Results:**
- Tooltip appears on tap (not just on hover)
- Tooltip is positioned to not obstruct data point or finger
- Tooltip content is readable (appropriate font size)
- Tooltip remains visible until dismissed by tap elsewhere or timeout
- Tooltip does not interfere with further interactions
- Multiple taps cycle through nearby data points correctly

---

## Cross-Browser and Cross-Device Test Matrix

### Priority 1 (Must Test)
| Scenario                     | iPhone SE (iOS) | Pixel 7 (Android) | iPad Air | Desktop Chrome |
|------------------------------|-----------------|-------------------|----------|----------------|
| Single Touch Zoom            | ✓               | ✓                 | ✓        | ✓              |
| Pinch to Zoom                | ✓               | ✓                 | ✓        | N/A            |
| Scrollable Plot Area         | ✓               | ✓                 | ✓        | ✓              |
| Responsive Behavior          | ✓               | ✓                 | ✓        | ✓              |
| Navigator Drag Handles       | ✓               | ✓                 | ✓        | ✓              |
| Device Rotation              | ✓               | ✓                 | ✓        | N/A            |

### Priority 2 (Should Test)
| Scenario                     | iPhone 14 Pro | Galaxy S21 | iPad Pro | Desktop Safari |
|------------------------------|---------------|------------|----------|----------------|
| Mouse Wheel Zoom             | N/A           | N/A        | ✓        | ✓              |
| Two-Finger Pan               | ✓             | ✓          | ✓        | N/A            |
| Range Selector Buttons       | ✓             | ✓          | ✓        | ✓              |
| Touch Target Sizes           | ✓             | ✓          | ✓        | N/A            |

### Priority 3 (Nice to Test)
| Scenario                     | Various iOS | Various Android | Desktop Firefox |
|------------------------------|-------------|-----------------|-----------------|
| Rapid Zoom In/Out            | ✓           | ✓               | ✓               |
| Extremely Small Zoom         | ✓           | ✓               | ✓               |
| Long Press                   | ✓           | ✓               | N/A             |
| Network Delay Handling       | ✓           | ✓               | ✓               |

---

## Known Issues and Limitations

### Browser-Specific Behavior
- **iOS Safari**: May show elastic bounce at scroll boundaries
- **Android Chrome**: Touch event timing may differ slightly from iOS
- **Desktop Safari**: Mouse wheel sensitivity may feel different than Chrome/Firefox

### Device-Specific Considerations
- **Older Devices**: Performance may degrade with very large datasets or rapid interactions
- **High-DPI Displays**: Ensure touch targets scale appropriately
- **Tablets**: Consider both touch and mouse/trackpad input modes

### Configuration Dependencies
- Some interactions require specific configuration (e.g., `zooming.singleTouch`, `panning.enabled`)
- Not all chart types support all zoom/pan types (e.g., pie charts don't zoom)
- Stock charts have additional navigator interactions not present in basic charts

---

## Test Execution Guidelines

### Pre-Test Setup
1. Ensure test devices are charged and have stable network connection
2. Clear browser cache on test devices
3. Disable any browser extensions that might interfere
4. Set devices to appropriate screen brightness for testing
5. Ensure test URLs are accessible (local server running if needed)

### During Testing
1. Test each scenario in listed order to build on previous states where appropriate
2. Document any deviations from expected results with screenshots
3. Note device, OS version, browser version for any issues found
4. Check browser console for JavaScript errors after each test
5. Allow sufficient time between gestures for chart to process interactions

### Post-Test Documentation
1. Mark each scenario as Pass, Fail, or Blocked
2. For failures, provide:
   - Steps to reproduce
   - Actual vs expected behavior
   - Screenshots or screen recordings
   - Device and browser details
   - Console errors (if any)
3. Rate severity: Critical, Major, Minor, Cosmetic
4. Link to any bug reports filed

---

## Success Criteria

A test scenario is considered **PASSED** if:
- All expected results are observed
- No JavaScript errors appear in console
- Interactions are smooth and responsive (no lag > 100ms)
- Chart state remains consistent after interactions
- UI remains functional and accessible
- No visual artifacts or rendering issues

A test scenario is considered **FAILED** if:
- Any expected result is not observed
- JavaScript errors occur during interaction
- Chart becomes unresponsive or crashes
- Data is displayed incorrectly after interaction
- UI elements become inaccessible or broken

A test scenario is **BLOCKED** if:
- Required dependencies are not available
- Test environment cannot be set up
- Prerequisite scenarios have failed
- Device or browser does not support required features

---

## Appendix: Sample Test URLs

### Highcharts Samples
- Single Touch Zoom: `samples/highcharts/chart/zoombysingletouch/`
- XY Zoom: `samples/highcharts/chart/zoomtype-xy/`
- Panning: `samples/highcharts/chart/panning-type/`
- Scrollable Plot Area: `samples/highcharts/chart/scrollable-plotarea/`
- Responsive: `samples/highcharts/responsive/axis/`
- Mouse Wheel Zoom: `samples/highcharts/mouse-wheel-zoom/enabled/`

### Stock Samples
- Basic Line with Navigator: `samples/stock/demo/basic-line/`
- Candlestick with Navigator: `samples/stock/demo/candlestick/`
- Range Selector: `samples/stock/rangeselector/`
- Standalone Navigator: `samples/stock/standalone-navigator/`

### Custom Test Page
- All-in-One Demo: `/test-mobile-interactions.html` (if created locally for manual testing)

---

**Document Version:** 1.0
**Last Updated:** November 5, 2025
**Author:** Test Planning Team
**Review Status:** Ready for Execution
