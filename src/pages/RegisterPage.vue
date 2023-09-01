<template>
    <div class="fullscreen bg-secondary text-white text-center q-pa-md flex flex-center row">
        <div class="col-xs-12 col-sm-8 col-md-6 col-lg-6 col-xl-6">
            <q-card class>
                <q-toolbar class="bg-primary">
                    <q-toolbar-title>Registre-se</q-toolbar-title>
                    <q-tabs>
                        <q-route-tab icon="login" to="/" exact />
                        <q-route-tab icon="person_add" to="/register" exact />
                    </q-tabs>
                </q-toolbar>

                <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                    <q-card-section>

                        <q-input filled v-model="registrationForm.name" label="Nome *" hint="Informe o seu nome"
                            :rules="[(val) => !!val || 'O nome deve ser informado']">
                            <template v-slot:append>
                                <q-icon name="person" color="secondary" />
                            </template>
                        </q-input>

                        <q-input filled v-model="registrationForm.email" label="Email *" type="email"
                            hint="Informe o seu melhor email" :rules="[
                                (val, rules) => rules.email(val) || 'Por favor, informe um email válido',
                                () => !erros?.email || erros?.email[0]
                            ]
                                ">
                            <template v-slot:append>
                                <q-icon name="mail" color="secondary" />
                            </template>
                        </q-input>

                        <q-input filled v-model="registrationForm.password" label="Senha *" hint="Crie uma senha"
                            type="password"
                            :rules="[(val) => val && val.length > 8 || 'A senha deve ter pelo menos 8 caracteres']">
                            <template v-slot:append>
                                <q-icon name="password" color="secondary" />
                            </template>
                        </q-input>

                        <q-input filled v-model="registrationForm.password_confirmation" label="Confirme sua senha *"
                            hint="Confirme sua senha" type="password"
                            :rules="[(val) => registrationForm.password == registrationForm.password_confirmation || 'As senhas devem combinar']">
                            <template v-slot:append>
                                <q-icon name="password" color="secondary" />
                            </template>
                        </q-input>


                    </q-card-section>

                    <q-separator />
                    <q-card-section align="left">
                        <div>
                            <q-btn label="Registrar" type="submit" color="primary" />
                        </div>
                    </q-card-section>
                </q-form>
            </q-card>
        </div>
    </div>
</template>
  
<script>
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    name: 'RegisterPage',
    setup() {

        const registrationForm = ref({
            name: "",
            email: "",
            password: "",
            password_confirmation: ""
        })

        const router = useRouter();

        const onSubmit = (e) => {
            e.preventDefault();
            api.post('/register', registrationForm.value)
                .then((response) => {
                    onReset();
                    router.push('/');
                    create({
                        color: 'positive',
                        message: 'Registro efetuado com sucesso!',
                        icon: 'success'
                    })
                })
                .catch((error) => {
                    Notify.create({
                        color: 'negative',
                        message: error?.response?.data?.message || 'Falha ao registrar',
                        icon: 'report_problem'
                    })
                })
        }

        const onReset = () => {
            registrationForm.value = {
                name: "",
                email: "",
                password: "",
                password_confirmation: ""
            }
        }

        return {
            registrationForm,
            onSubmit
        }
    }
})
</script>
  