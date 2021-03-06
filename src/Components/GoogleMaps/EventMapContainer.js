import React, { Component } from 'react';
import EventMap from './EventMap';


var API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API 

class EventMapContainer extends Component {

    render() {

        return (
            <div>
            <div className="google_map_container small">
            {this.props.longitude ?
            <EventMap
                longitude={this.props.longitude}
                latitude={this.props.latitude}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                loadingElement={<div style={{ width: `90%` }} />}
                containerElement={<div className="event-map" />}
                mapElement={<div style={{ height: `100%` }} />}
            />: " "}
            </div>
            <div className="google_map_container big">
            {this.props.longitude ?
            <EventMap
                longitude={this.props.longitude}
                latitude={this.props.latitude}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                loadingElement={<div style={{ width: `90%` }} />}
                containerElement={<div className="event-map" />}
                mapElement={<div style={{ height: `100%` }} />}
            />: " "} 
            </div>
            </div>
        )
    }
}

export default EventMapContainer;