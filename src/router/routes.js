
const routes = [
  {
    path: '/despesas',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
    ]
  },

  {
    path: '/perfil',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PerfilPage.vue') },
    ]
  },


  {
    path: '/',
    component: () => import('layouts/GuestLayout.vue'),
    children: [
      {path: '', component: () => import('pages/LoginPage.vue')},
      {path: 'register', component: () => import('pages/RegisterPage.vue')}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
