import React, { Component } from 'react';
import { getThemeAttribute } from './../../helpers';
import { setParentState } from './../../helpers';
const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } = require("react-google-maps");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const { DrawingManager } = require("react-google-maps/lib/components/drawing/DrawingManager");

const MapWithDrawingManager = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=[apikey]&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      let props = this.props;

      this.setState({
        bounds: null,
        center: {
          lat: 43.6426, lng: -79.3871
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPolygonComplete: ref => {
          console.log(ref)
        },
        onCircleComplete: ref => {
          console.log(ref)
        },
        onMarkerComplete: ref => {
          let markers = props.myMarkers
          let marker = { title: '', lat: 0, lng: 0 }

          marker.title = `New Marker ${markers.length + 1}`
          marker.lat = ref.overlay.position.lat()
          marker.lng = ref.overlay.position.lng()

          markers.push(marker)

          props.setParentState({
            myMarkers: markers
          })
        },
        onPolylineComplete: ref => {
          console.log(ref)
        },
        onRectangleComplete: ref => {
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });

          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={11}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Search"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `8px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          left: `275px`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    <DrawingManager
      onPolygonComplete={props.onPolygonComplete}
      onCircleComplete={props.onCircleComplete}
      onMarkerComplete={props.onMarkerComplete}
      onPolylineComplete={props.onPolylineComplete}
      onRectangleComplete={props.onRectangleComplete}
      defaultDrawingMode={google.maps.drawing.OverlayType.MARKER}
      defaultOptions={{
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_LEFT,
          drawingModes: [
            google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.CIRCLE,
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.POLYLINE,
            google.maps.drawing.OverlayType.RECTANGLE,
          ],
        },
        circleOptions: {
          fillColor: `#ffff00`,
          fillOpacity: 1,
          strokeWeight: 5,
          clickable: false,
          editable: true,
          zIndex: 1,
        },
      }}
    />
    <Polygon path={props.polyCoords} onClick={event => props.clickMe(event)} />
  </GoogleMap>
);

class RenderMapEditor extends Component {
  static defaultProps = {
    markers: [{
      lat: 0,
      lng: 0,
      title: ''
    }],
    center: {
      lat: 0,
      lng: 0
    },
    zoom: 11,
    height: '100%',
    width: '100%',
  }

  constructor(props) {
    super(props);
    this.state = {
      myMarkers: []
    };
    this.setParentState = setParentState.bind(this)
  }

  clickMe = (event) => {
    console.log("clicked", event)
  }

  render() {
    let key = getThemeAttribute("google_maps_api_key")
    let { markers, center, height, width, zoom } = this.props

    let polyCoords = [
      { lat: 43.6426, lng: -79.3871 },
      { lat: 43.67771760000001, lng: -79.62481969999999 },
      { lat: 43.62842879999999, lng: -79.41353300000003 }
    ]

    console.log(this.state.myMarkers)

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: height, width: width }}>
        <MapWithDrawingManager
          setParentState={this.setParentState}
          myMarkers={this.state.myMarkers}
          polyCoords={polyCoords}
          clickMe={this.clickMe}
          />
      </div>
    )

  }
}

export default RenderMapEditor;

// https://github.com/tomchentw/react-google-maps/issues/796
