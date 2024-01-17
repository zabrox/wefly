# WeFly ScatterMode Specification

## Overview
ScatterMode is the default mode when WeFly application is launched. It provides a 3D map display using Cesium and offers various controls and information related to flight tracks.

## UI Components

### 3D Map
- Displays the Cesium 3D Map as the main component.
- Represents nearby tracks with TrackGroup icons.
- TrackGroup icons' size is proportional to the number of tracks nearby.
- Clicking on a TrackGroup zooms in and displays the individual tracks.

### Control Panel
- Located on the left side of the screen.
- Comprises DatePicker, TrackNumber, TrackList, and ActionDial.
- Can be toggled open or closed using the ControlPanelToggle button.

### TrackList
- Shows a list of tracks for the selected date via DatePicker.
- Allows scrolling in all directions.
- Includes headers for track type, pilot name, area, start time, flight duration, max altitude, and distance.
- Headers are clickable for sorting the list.
- Filters are available for track type, pilot, and area. Filter dialog appears upon clicking the filter button.

### ActionDial
- Hovering over the ActionDial displays buttons for "List Playback" and "Play Selected Track."
- Clicking these buttons transitions from ScatterMode to PlaybackMode.

## Interactions

### Track Interaction
- Clicking on a TrackPoint highlights the track on the 3D Map and in the TrackList.
- The TrackList scrolls to bring the selected track to the top.
- Clicking a selected track in the TrackList toggles off the highlight and removes the track line from the 3D Map.

### Sorting and Filtering
- The initial state of TrackList is sorted by StartTime in ascending order.
- Clicking on flight duration, max altitude, or distance headers initially sorts the list in descending order.
- Other columns are sorted in ascending order on the first click.
- Filters apply immediately upon selection and filter the TrackList using AND logic across categories.

## Transition to PlaybackMode
- ActionDial options enable the transition from ScatterMode to PlaybackMode.
- "List Playback" initiates playback of all tracks.
- "Play Selected Track" initiates playback of the currently selected track.

