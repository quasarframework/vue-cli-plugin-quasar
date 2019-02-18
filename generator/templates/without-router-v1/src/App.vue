<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="<% if (quasar.iconSet === "material-icons") { %>menu<% } else if (quasar.iconSet === "fontawesome") { %>fas fa-bars<% } else if (quasar.iconSet === "ionicons") { %>ion-android-menu<% } else if (quasar.iconSet === "mdi") { %>mdi-menu<% } %>" />
        </q-btn>

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list no-border link inset-delimiter>
          <q-item-label header>Essential Links</q-item-label>
          <q-item clickable tag="a" target="_blank" href="http://v1.quasar-framework.org">
          <q-item-section avatar>
            <q-icon name="<% if (quasar.iconSet === "material-icons") { %>school<% } else if (quasar.iconSet === "fontawesome") { %>fas fa-graduation-cap<% } else if (quasar.iconSet === "ionicons") { %>ion-school<% } else if (quasar.iconSet === "mdi") { %>mdi-school<% } %>" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>v1.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://github.com/quasarframework/">
          <q-item-section avatar>
            <q-icon name="<% if (quasar.iconSet === "material-icons") { %>code<% } else if (quasar.iconSet === "fontawesome") { %>fas fa-code<% } else if (quasar.iconSet === "ionicons") { %>ion-code<% } else if (quasar.iconSet === "mdi") { %>mdi-code-tags<% } %>" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Github</q-item-label>
            <q-item-label caption>github.com/quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="http://chat.quasar-framework.org">
          <q-item-section avatar>
            <q-icon name="<% if (quasar.iconSet === "material-icons") { %>chat<% } else if (quasar.iconSet === "fontawesome") { %>fas fa-comments<% } else if (quasar.iconSet === "ionicons") { %>ion-chatbubbles<% } else if (quasar.iconSet === "mdi") { %>mdi-message-text<% } %>" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Discord Chat Channel</q-item-label>
            <q-item-label caption>chat.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://forum.quasar-framework.org">
          <q-item-section avatar>
            <q-icon name="<% if (quasar.iconSet === "material-icons") { %>forum<% } else if (quasar.iconSet === "fontawesome") { %>far fa-clipboard<% } else if (quasar.iconSet === "ionicons") { %>ion-chatboxes<% } else if (quasar.iconSet === "mdi") { %>mdi-forum<% } %>" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>forum.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://twitter.com/quasarframework">
          <q-item-section avatar>
            <q-icon name="<% if (quasar.iconSet === "material-icons") { %>rss_feed<% } else if (quasar.iconSet === "fontawesome") { %>fab fa-twitter<% } else if (quasar.iconSet === "ionicons") { %>ion-logo-twitter<% } else if (quasar.iconSet === "mdi") { %>mdi-twitter<% } %>" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        </q-list>
      </q-list>
    </q-drawer>

    <q-page-container>
      <HelloWorld />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'LayoutDefault',
  components: {
    HelloWorld
  },
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
