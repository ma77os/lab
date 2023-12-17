<template>
  <div id="app">
    <!-- <transition
			v-on:enter="enter"
			v-on:leave="leave"
			v-bind:css="false"
		>
		</transition> -->
		<router-view/>
    <TestComponent />
    <div>oi</div>
  </div>
</template>

<script>
import TestComponent from './components/TestComponent.vue'

export default {
  name: 'app',
  components: {
    TestComponent
  },
  // watch:{
  //   $route: function(to, from){
  //     console.log("route", from, to)
  //     if (to != from) {
  //       // console.log('route watch:', to.name)
  //       // if (to.name == 'home') {
  //       //   this.eventHub.dispatcher.$emit(this.eventHub.types.UPDATE_HEADER, 'hide')
  //       // } else {
  //       //   this.eventHub.dispatcher.$emit(this.eventHub.types.UPDATE_HEADER, 'show')
  //       // }
  //     }
  //   }
  // },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
