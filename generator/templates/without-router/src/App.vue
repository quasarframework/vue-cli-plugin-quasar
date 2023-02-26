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
          icon="<% if (quasar.iconSet === "material-icons") { %>menu<% } else if (quasar.iconSet === "material-icons-outlined") { %>o_menu<% } else if (quasar.iconSet === "material-icons-round") { %>r_menu<% } else if (quasar.iconSet === "material-icons-sharp") { %>s_menu<% } else if (quasar.iconSet === "fontawesome") { %>fas fa-bars<% } else if (quasar.iconSet === "ionicons") { %>ion-menu<% } else if (quasar.iconSet === "mdi") { %>mdi-menu<% } else if (quasar.iconSet === "eva-icons") { %>eva-menu-outline<% } %>"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
          <q-item-section avatar>
            <q-icon name="<% if (quasar.iconSet === "material-icons") { %>school<% } else if (quasar.iconSet === "material-icons-outlined") { %>o_school<% } else if (quasar.iconSet === "material-icons-round") { %>r_school<% } else if (quasar.iconSet === "material-icons-sharp") { %>s_school<% } else if (quasar.iconSet === "fontawesome") { %>fas fa-graduation-cap<% } else if (quasar.iconSet === "ionicons") { %>ion-school<% } else if (quasar.iconSet === "mdi") { %>mdi-school<% } else if (quasar.iconSet === "eva-icons") { %>eva-file-text-outline<% } %>" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://github.com/quasarframework/">
          <q-item-section avatar>
            <q-icon name="<% if (quasar.iconSet === "material-icons") { %>code<% } else if (quasar.iconSet === "material-icons-outlined") { %>o_code<% } else if (quasar.iconSet === "material-icons-round") { %>r_code<% } else if (quasar.iconSet === "material-icons-sharp") { %>s_code<% } else if (quasar.iconSet === "fontawesome") { %>fas fa-code<% } else if (quasar.iconSet === "ionicons") { %>ion-code<% } else if (quasar.iconSet === "mdi") { %>mdi-code-tags<% } else if (quasar.iconSet === "eva-icons") { %>eva-github-outline<% } %>" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Github</q-item-label>
            <q-item-label caption>github.com/quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://chat.quasar.dev">
          <q-item-section avatar>
            <q-icon name="<% if (quasar.iconSet === "material-icons") { %>chat<% } else if (quasar.iconSet === "material-icons-outlined") { %>o_chat<% } else if (quasar.iconSet === "material-icons-round") { %>r_chat<% } else if (quasar.iconSet === "material-icons-sharp") { %>s_chat<% } else if (quasar.iconSet === "fontawesome") { %>fas fa-comments<% } else if (quasar.iconSet === "ionicons") { %>ion-chatbubbles<% } else if (quasar.iconSet === "mdi") { %>mdi-message-text<% } else if (quasar.iconSet === "eva-icons") { %>eva-message-square-outline<% } %>" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Discord Chat Channel</q-item-label>
            <q-item-label caption>chat.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://forum.quasar.dev">
          <q-item-section avatar>
            <q-icon name="<% if (quasar.iconSet === "material-icons") { %>forum<% } else if (quasar.iconSet === "material-icons-outlined") { %>o_forum<% } else if (quasar.iconSet === "material-icons-round") { %>r_forum<% } else if (quasar.iconSet === "material-icons-sharp") { %>s_forum<% } else if (quasar.iconSet === "fontawesome") { %>far fa-clipboard<% } else if (quasar.iconSet === "ionicons") { %>ion-chatboxes<% } else if (quasar.iconSet === "mdi") { %>mdi-forum<% } else if (quasar.iconSet === "eva-icons") { %>eva-people-outline<% } %>" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>forum.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://twitter.com/quasarframework">
          <q-item-section avatar>
            <q-icon name="<% if (quasar.iconSet === "material-icons") { %>rss_feed<% } else if (quasar.iconSet === "material-icons-outlined") { %>o_rss_feed<% } else if (quasar.iconSet === "material-icons-round") { %>r_rss_feed<% } else if (quasar.iconSet === "material-icons-sharp") { %>s_rss_feed<% } else if (quasar.iconSet === "fontawesome") { %>fab fa-twitter<% } else if (quasar.iconSet === "ionicons") { %>ion-logo-twitter<% } else if (quasar.iconSet === "mdi") { %>mdi-twitter<% } else if (quasar.iconSet === "eva-icons") { %>eva-twitter-outline<% } %>" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <HelloWorld />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'LayoutDefault',

  components: {
    HelloWorld
  },

  setup () {
    return {
      leftDrawerOpen: ref(false)
    }
  }
}
</script>
