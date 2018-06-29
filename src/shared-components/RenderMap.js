import React, { Component } from 'react';
import GoogleMap from 'google-map-react';
import { getThemeAttribute } from './../../helpers';
import { K_SIZE } from './MarkerStyles';
import Marker from './Marker';

class RenderMap extends Component {
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
    width: '100%'
  }

  render() {
    let key =  getThemeAttribute("google_maps_api_key")
    let { markers, center, height, width, zoom } = this.props

    const markerHTML = markers.map((marker, index) => (
      <Marker
        key={index}
        lat={marker.lat}
        lng={marker.lng}
        title={marker.title}
        />
    ))

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: height, width: width }}>
        <GoogleMap
          bootstrapURLKeys={{ key: key }}
          defaultCenter={ center }
          defaultZoom={zoom}>
          {markerHTML}
        </GoogleMap>
      </div>
    )

  }
}

export default RenderMap;
