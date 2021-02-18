<template>
    <div id="mapview"></div>
</template>

<script>
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';
import TileLayer from '@arcgis/core/layers/TileLayer';
import gConfig from './../config/gConfig';

export default {
    name: 'MapView',
    mounted() {
        this.handleCreateMap();
    },
    methods: {
        handleCreateMap() {
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
        },
    },
};
</script>

<style scoped>
#mapview {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
<style>
/*去除mapview拖动时的边框*/
.esri-view .esri-view-surface--inset-outline:focus::after {
    outline: auto 0px Highlight !important;
    outline: auto 0px -webkit-focus-ring-color !important;
}
</style>
