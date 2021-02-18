import React, { Component } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';
import TileLayer from '@arcgis/core/layers/TileLayer';
import gConfig from './../../config/gConfig';
import './MapView.css';

class MapComponent extends Component {
    componentDidMount = () => {
        this.handleCreateMap();
    };

    handleCreateMap = () => {
        const basemap = new Basemap({
            baseLayers: [
                new TileLayer({
                    url: gConfig.basemap_url,
                    title: 'Basemap',
                }),
            ],
            title: 'basemap',
            id: 'basemap',
        });
        const map = new Map({
            basemap: basemap,
        });

        const view = new MapView({
            container: 'mapview',
            map: map,
            zoom: 10,
            center: [104.09028, 30.577999],
        });

        console.log(view);
    };

    render() {
        return <div id="mapview"></div>;
    }
}

export default MapComponent;
