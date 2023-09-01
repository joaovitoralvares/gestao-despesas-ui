<template>
    <div class="fullscreen bg-secondary text-white text-center q-pa-md flex flex-center row">
        <div class="col-xs-12 col-sm-8 col-md-6 col-lg-6 col-xl-6">
            <q-card class>
                <q-toolbar class="bg-primary">
                    <q-toolbar-title>Entrar</q-toolbar-title>
                    <q-tabs>
                        <q-route-tab icon="login" to="/" exact />
                        <q-route-tab icon="person_add" to="/register" exact />
                    </q-tabs>
                </q-toolbar>

                <q-form @submit="onSubmit" class="q-gutter-md">
                    <q-card-section>

                        <q-input filled v-model="loginForm.email" type="email" label="Email *" hint="Informe o seu email"
                            :rules="[(val, rules) => rules.email(val) || 'Por favor, informe um email válido']">
                            <template v-slot:append>
                                <q-icon name="person" color="secondary" />
                            </template>
                        </q-input>

                        <q-input filled v-model="loginForm.password" label="Senha *" hint="Digite a sua senha"
                            :rules="[(val) => !!val || 'A senha é obrigatória']" type="password">
                            <template v-slot:append>
                                <q-icon name="password" color="secondary" />
                            </template>
                        </q-input>

                    </q-card-section>

                    <q-separator />
                    <q-card-section>
                        <div>
                            <q-btn label="Entrar" type="submit" color="primary" />
                        </div>
                    </q-card-section>
                </q-form>
            </q-card>
        </div>
    </div>
</template>
  
<script>
import { defineComponent, ref } from 'vue'
import { api } from 'src/boot/axios'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'


export default defineComponent({
    name: 'LoginPage',
    setup() {
        const router = useRouter();
        const loginForm = ref({
            email: "",
            password: ""
        })

        const onSubmit = (e) => {
            api.get('/sanctum/csrf-cookie').then(response => {
                api.post('/login', loginForm.value)
                    .then((response) => {
                        onReset()
                        router.push('/despesas')
                        Notify.create({
                            color: 'positive',
                            message: 'Sucesso!',
                            icon: 'success'
                        })
                    })
                    .catch((error) => {
                        Notify.create({
                            color: 'negative',
                            message: error?.response?.data?.message || 'Verifique suas credenciais',
                            icon: 'report_problem'
                        })
                    })
            });

        }

        const onReset = () => {
            loginForm.value = {
                email: "",
                password: ""
            }
        }

        return {
            loginForm,
            onSubmit
        }
    }
})
</script>
  