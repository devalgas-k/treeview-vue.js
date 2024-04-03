<template>
  <!-- Liste d'éléments -->
  <ul>
    <li>
      <!-- Transition pour la création d'un nouveau nœud -->
      <transition name="modal">
        <div class="modal-mask" v-show="creating" @click.self="cancel">
          <div class="modal-container">
            <div class="modal-content">
              <h1>Create New Node</h1>
              <!-- Formulaire pour créer un nouveau nœud -->
              <form @keyup.enter="save">
                <input type="text" v-model="newNode.text" placeholder="Text: Google" />
                <input type="text" v-model="newNode.link.type" placeholder="Type: link" />
                <template v-show="newNode.link.type === 'router-link'">
                  <input type="text" v-model="newNode.link.key" placeholder="Key: path or name" />
                </template>
                <input type="text" v-model="newNode.link.value" placeholder="Value: https://www.google.com" />
                <!-- Boutons pour annuler ou enregistrer -->
                <div class="btn-group">
                  <button class="cancel" type="button" @click="cancel">Cancel</button>
                  <button class="save" type="button" @click="save">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </transition>
      <!-- Transition pour l'édition d'un nœud existant -->
      <transition name="modal">
        <div class="modal-mask" v-show="editing" @click.self="cancel">
          <div class="modal-container">
            <div class="modal-content">
              <h1>Edit Node</h1>
              <!-- Formulaire pour éditer un nœud -->
              <form @keyup.enter="save">
                <input type="text" v-model="text.type" placeholder="Text: Google" />
                <input type="text" v-model="link.type" placeholder="Type: link" />
                <template v-show="link.type === 'router-link'">
                  <input type="text" v-model="link.key" placeholder="Key: path or name" />
                </template>
                <input type="text" v-model="link.value" placeholder="Value: https://www.google.com" />
                <!-- Boutons pour annuler ou enregistrer -->
                <div class="btn-group">
                  <button class="cancel" type="button" @click="cancel">Cancel</button>
                  <button class="save" type="button" @click="edit">Edit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </transition>
      <!-- Branchement vers un nouveau nœud -->
      <div class="branch" :class="{ link: (nodes.length & gt, 0) }">
        <template v-if="nodes.length &gt; 0">
          <template v-if="open">
            <fa class="minus-square" :icon="opened" @click="createNewNode"></fa>
          </template>
          <template v-else>
            <fa class="plus-square" :icon="closed" @click="createNewNode"></fa>
          </template>
        </template>
        <!-- Lien vers une URL ou un routeur -->
        <template v-if="link &amp;&amp; link.value">
          <!-- Parent -->
          <router-link class="value"
                       :to="{ [link.key]: link.value, query: link.query || {}, params: link.params || {} }"
                       v-if="link.type === 'router-link'">
            <fa :icon="defaultIcon"></fa>{{ text }} {{nodes.length}}
          </router-link>

          <a class="value" :href="link.value" target="_blank" v-else-if="link.type === 'link'">
          <fa :icon="defaultIcon"></fa>{{ text }} {{nodes.length}}
        </a><span class="edit" @click="editing = true" v-show="editable">Edit</span>
        </template>
        <!-- S'il n'y a pas de lien, affiche simplement le texte -->
        <template v-else><span v-if="nodes.length &gt; 0">
            <fa :icon="defaultIcon" v-show="showParentIcon.parentShow"></fa>{{ text }} {{nodes.length}}
          </span><span @click="createNewNode" v-else>
            <fa :icon="defaultIcon" v-show="showParentIcon.emptyParentShow"></fa>{{ text }} {{nodes.length}}
          </span>
        </template>
      </div>
      <!-- Composant VueDraggable pour faire glisser et déposer les nœuds -->
      <vue-draggable :list="nodes" :group="{ name: 'g1' }" v-if="draggable" item-key="text">
        <template #item="{ node, i }">
          <!-- Branchement récursif pour chaque nœud -->
          <branch class="node" v-if="nodes"
                  :nodes.sync="node.nodes"
                  :text="node.text"
                  :type="node.type"
                  :link="node.link"
                  :class="{ open: open, first: i === 0 && !checkLast(i), last: checkLast(i) }"
                  :closed="closed"
                  :opened="opened"
                  :defaultIcon="t.icon || defaultIcon"
                  :editable="editable"
                  :expanded.sync="expanded"
                  :draggable.sync="draggable"
                  :show-parent-icon="showParentIcon"
                  :key="i"></branch>
        </template>
      </vue-draggable>
      <!-- Affichage des nœuds lorsque le composant VueDraggable n'est pas utilisé -->
      <template v-else>
        <branch class="node" v-for="( t, i) in  nodes "
                :nodes.sync="t.nodes"
                :text="t.text"
                :type="t.type"
                :link="t.link"
                :class="{ open: open, first: i === 0 && !checkLast(i), last: checkLast(i) }"
                v-if="nodes"
                :closed="closed "
                :opened="opened"
                :defaultIcon=" t.icon || defaultIcon "
                :editable=" editable "
                :expanded.sync=" expanded "
                :draggable.sync=" draggable "
                :show-parent-icon=" showParent-icon "
                :key="i"></branch>
      </template>
    </li>
  </ul>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch } from 'vue'
import VueDraggable from 'vuedraggable'

// Définition des propriétés et des émetteurs
const props = defineProps({
  text: {
    type: String,
    required: true,
    default: () => ''
  },
  nodes: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: () => ''
  },
  link: {
    type: Object,
    default: () => ({})
  },
  closed: {
    type: [String, Object, Array]
  },
  opened: {
    type: [String, Object, Array]
  },
  defaultIcon: {
    type: [String, Object, Array]
  },
  editable: {
    type: Boolean,
    default: () => true
  },
  expanded: {
    type: Boolean,
    default: () => false
  },
  draggable: {
    type: [Boolean, Object],
    default: false
  },
  showParentIcon: {
    type: Object,
    default: () => ({
      parentShow: false,
      emptyParentShow: false,
    })
  }
})

// Définition de l'émetteur
const emit = defineEmits(['nodes', 'update:expanded'])

// Initialisation des variables réactives
const open = ref(false)
const clicks = ref(0)
const timer = ref(null)
const newNode = ref({
  text: 'Google',
  link: {
    type: 'link',
    key: '',
    value: 'https://www.google.com'
  }
})
const creating = ref(false)
const editing = ref(false)

// Expression régulière pour vérifier les URL
const urlRegex = new RegExp(/^(https?:\/\/)?(www\.|[a-z\d]+\.)?[a-z]+(\.[a-z]{2,3}|:\d{2,5})(\.[a-z]{2,3})?(\/([\w\d]+)?)*((\?|&)[\w\d]+=[\w\d]+)*/)

// Observation de la propriété 'expanded' pour ouvrir ou fermer le nœud
watch(() => props.expanded, async (val) => {
  open.value = val
  emit('update:expanded', val)
}, { immediate: true })

// Fonction pour créer un nouveau nœud
const createNewNode = () => {
  if (props.editable) {
    clicks.value++
    if (clicks.value === 1) {
      timer.value = setTimeout(() => {
        toggle()
        clicks.value = 0
      }, 250);
    } else {
      clearTimeout(timer.value)
      clicks.value = 0
      creating.value = true
    }
  } else {
    toggle()
  }
}

// Fonction pour annuler la création ou l'édition d'un nœud
const cancel = () => {
  creating.value = false
  editing.value = false
  newNode.value = {
    text: 'Google',
    link: {
      type: 'link',
      key: '',
      value: 'https://www.google.com'
    }
  }
}

// Fonction pour éditer un nœud
const edit = () => {
  editing.value = false
  emit('nodes', props.nodes)
}

// Fonction pour enregistrer un nouveau nœud
const save = () => {
  if (newNode.value.link.type === 'link')
    delete newNode.value.link.key
  props.nodes.push(newNode.value)
  creating.value = false
  newNode.value = {
    text: 'Google',
    type: 'link',
    value: 'https://www.google.com'
  }
  emit('nodes', props.nodes)
}

// Fonction pour basculer l'état d'ouverture du nœud
const toggle = () => {
  open.value = !open.value
}

// Fonction pour vérifier si un nœud est le dernier de la liste
const checkLast = (i) => (i + 1) === props.nodes.length
</script>