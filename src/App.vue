<script setup>
import { ref } from 'vue'
import Tree from './tree.json'
import Node from './components/node.vue'


const tree = ref(Tree)
const editable = ref(true)
const expanded = ref(false)

const collapse = () => {
  expanded.value = false
}

const expand = () => {
  expanded.value = true
}
</script>

<template>
  <div>
    <div class="body">
      <div>
<!--        <p>Editable: {{ editable }}</p>
        <p>Expanded: {{ expanded }}</p>-->
<!--        <p v-if="editable">Double click to create new node</p>-->
        <div class="expand-menu"><a @click="expand">Deplier</a><a @click="collapse">Replier</a></div>
        <Node
            :tree.sync="tree"
            :editable="editable"
            :expanded="expanded"
            :show-parent-icon="{ parentShow: true, emptyParentShow: false }" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">

body {
    background-color: #0C2D48;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    width: 100vw;
    overflow: scroll;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #B1D4E0;
    min-width: 400px;
    margin-top: 50px;

    h1,
    p {
      text-align: center;
    }

    h1 {
      margin-bottom: 0;
    }

    h5 {
      display: flex;
      justify-content: space-around;
      margin-right: 1em;

      a.source {
        &:link,
        &:active,
        &:visited {
          color: gold;
          text-decoration: none;
        }

        &:hover {
          text-decoration: underline;
        }
      }
    }

    img {
      height: 300px;
      width: 400px;
      border-radius: 10px;
    }

    .body {
      display: grid;
      grid-template-rows: auto;

      .expand-menu {
        color: gold;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        margin-bottom: 1em;

        a:link,
        a:active,
        a:visited {
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
