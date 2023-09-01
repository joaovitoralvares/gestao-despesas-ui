<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Gestão Despesas
        </q-toolbar-title>

        <q-item>
          <q-item-label><q-btn icon="logout" flat @click="logout()" /></q-item-label>
        </q-item>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-blue-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8">
          Páginas
        </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { api } from 'src/boot/axios'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

const linksList = [
  {
    title: 'Despesas',
    caption: 'Gerencie suas despesas',
    icon: 'attach_money',
    link: '/despesas'
  },
  {
    title: 'Perfil',
    caption: 'Gerencie seu perfil',
    icon: 'person',
    link: '/perfil'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const router = useRouter();

    const logout = () => {
      api.post('/logout')
        .then((response) => {
          router.push('/');
          Notify.create({
            color: 'positive',
            message: 'Sessão encerrada!',
            icon: 'success'
          })
        })
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      logout
    }
  }
})
</script>
