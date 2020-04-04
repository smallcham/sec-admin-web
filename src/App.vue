<template>
  <div id="app">
    <el-container>
      <el-header>
        <Header/>
      </el-header>
      <el-main>
          <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Header from './components/layout/Header'
export default {
  name: 'App',
  components: {Header}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
