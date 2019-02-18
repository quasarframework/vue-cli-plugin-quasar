<template>
  <q-layout id="q-app" view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="<% if (quasar.iconSet === "material-icons") { %>menu<% } else if (quasar.iconSet === "fontawesome") { %>fas fa-bars<% } else if (quasar.iconSet === "ionicons") { %>ion-android-menu<% } else if (quasar.iconSet === "mdi") { %>mdi-menu<% } %>"
        />

        <q-toolbar-title>
          Quasar App
          <div slot="subtitle">Running on Quasar v{{ $q.version }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list no-border link inset-delimiter>
          <q-list-header>Essential Links</q-list-header>
          <q-item @click.native="openURL('http://quasar-framework.org')">
            <q-item-side icon="<% if (quasar.iconSet === "material-icons") { %>school<% } else if (quasar.iconSet === "fontawesome") { %>fas fa-graduation-cap<% } else if (quasar.iconSet === "ionicons") { %>ion-university<% } else if (quasar.iconSet === "mdi") { %>mdi-school<% } %>" />
            <q-item-main label="Docs" sublabel="quasar-framework.org"></q-item-main>
          </q-item>
          <q-item @click.native="openURL('https://discord.gg/5TDhbDg')">
            <q-item-side icon="<% if (quasar.iconSet === "material-icons") { %>chat<% } else if (quasar.iconSet === "fontawesome") { %>fas fa-comments<% } else if (quasar.iconSet === "ionicons") { %>ion-chatbubbles<% } else if (quasar.iconSet === "mdi") { %>mdi-message-text<% } %>" />
            <q-item-main label="Discord Chat Channel" sublabel="https://discord.gg/5TDhbDg"></q-item-main>
          </q-item>
          <q-item @click.native="openURL('http://forum.quasar-framework.org')">
            <q-item-side icon="<% if (quasar.iconSet === "material-icons") { %>forum<% } else if (quasar.iconSet === "fontawesome") { %>far fa-clipboard<% } else if (quasar.iconSet === "ionicons") { %>ion-compose<% } else if (quasar.iconSet === "mdi") { %>mdi-forum<% } %>" />
            <q-item-main label="Forum" sublabel="forum.quasar-framework.org"></q-item-main>
          </q-item>
          <q-item @click.native="openURL('https://twitter.com/quasarframework')">
            <q-item-side icon="<% if (quasar.iconSet === "material-icons") { %>rss feed<% } else if (quasar.iconSet === "fontawesome") { %>fab fa-twitter<% } else if (quasar.iconSet === "ionicons") { %>ion-social-twitter<% } else if (quasar.iconSet === "mdi") { %>mdi-twitter<% } %>" />
            <q-item-main label="Twitter" sublabel="@quasarframework"></q-item-main>
          </q-item>
        </q-list>
      </q-list>
    </q-layout-drawer>

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
