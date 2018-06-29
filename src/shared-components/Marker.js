import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { markerStyle, markerStyleHover } from './MarkerStyles';

// marker
class Marker extends Component {
  static propTypes = {
    // GoogleMap pass $hover props to hovered components
    // to detect hover it uses internal mechanism, explained in x_distance_hover example
    hover: PropTypes.bool,
    text: PropTypes.string,
    summary: PropTypes.string
  }

  static defaultProps = {
    hover: false,
    text: '',
    summary: ''
  };

  render() {
    const style = this.props.hover ? markerStyleHover : markerStyle;

    return (
       <div style={style}>
          {this.props.title}
          {this.props.summary}
       </div>
    )
  }
}

export default Marker;
