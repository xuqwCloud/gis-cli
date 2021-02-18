<template>
    <div id="app">
        <map-view></map-view>
    </div>
</template>

<script>
import MapView from './components/MapView.vue';

export default {
    name: 'App',
    components: { MapView },
};
</script>

<style>
html,
body,
#app {
    width: 100%;
    height: 100%;
    margin: 0 !important;
}
</style>
