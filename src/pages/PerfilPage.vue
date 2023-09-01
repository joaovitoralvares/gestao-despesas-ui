<template>
    <div class="text-white text-center q-pa-md flex flex-start row justify-around">
        <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5 col-xl-5">
            <q-card class>
                <q-toolbar class="bg-secondary">
                    <q-toolbar-title>Alterar senha</q-toolbar-title>
                </q-toolbar>

                <q-form @submit="atualizarSenha" @reset="resetPasswordForm" class="q-gutter-md">
                    <q-card-section>
                        <q-input filled v-model="user.current_password" label="Senha atual *" hint="Digite sua senha"
                            type="password" :rules="[(val) => !!val || 'A senha é obrigatória']">
                            <template v-slot:append>
                                <q-icon name="password" color="secondary" />
                            </template>
                        </q-input>

                        <q-input filled v-model="user.new_password" label="Nova senha *" hint="Confirme sua senha"
                            type="password"
                            :rules="[(val) => val && val.length > 8 || 'A senha deve ter pelo menos 8 caracteres']">
                            <template v-slot:append>
                                <q-icon name="password" color="secondary" />
                            </template>
                        </q-input>

                        <q-input filled v-model="user.password_confirmation" label="Confirme sua nova senha *"
                            hint="Confirme sua nova senha" type="password"
                            :rules="[(val) => val == user.new_password || 'As senhas devem combinar']">
                            <template v-slot:append>
                                <q-icon name="password" color="secondary" />
                            </template>
                        </q-input>


                    </q-card-section>

                    <q-separator />
                    <q-card-section align="left">
                        <div>
                            <q-btn label="Alterar senha" type="submit" color="secondary" />
                        </div>
                    </q-card-section>
                </q-form>
            </q-card>
        </div>
        <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5 col-xl-5">
            <q-card class>
                <q-toolbar class=" bg-primary">
                    <q-toolbar-title>Informações pessoais</q-toolbar-title>
                </q-toolbar>

                <q-form @submit="atualizarInformacoesPessoais" class="q-gutter-md">
                    <q-card-section>

                        <q-input filled v-model="user.name" label="Nome *" hint="Alterar nome"
                            :rules="[(val) => !!val || 'O nome deve ser informado']">
                            <template v-slot:append>
                                <q-icon name="person" color="secondary" />
                            </template>
                        </q-input>

                        <q-input filled v-model="user.email" label="Email *" type="email" hint="Alterar email" :rules="[
                            (val, rules) => rules.email(val) || 'Por favor, informe um email válido',
                            () => !erros?.email || erros?.email[0]
                        ]
                            ">
                            <template v-slot:append>
                                <q-icon name="mail" color="secondary" />
                            </template>
                        </q-input>

                    </q-card-section>

                    <q-separator />
                    <q-card-section align="left">
                        <div>
                            <q-btn label="Alterar" type="submit" color="primary" />
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
    name: 'PerfilPage',
    setup() {
        const router = useRouter();

        const user = ref({
            id: "",
            name: "",
            email: "",
            current_password: "",
            new_password: ""
        })

        const buscarUsuario = () => {
            api.get('/api/user')
                .then((response) => {
                    user.value.id = response.data.id;
                    user.value.email = response.data.email;
                    user.value.name = response.data.name;
                })
                .catch((error) => {
                    if (error?.response?.status == 401) {
                        router.push('/');
                    }
                    Notify.create({
                        color: 'negative',
                        message: 'Erro ao buscar informações pessoais',
                        icon: 'report_problem'
                    })
                })
        }

        const resetPasswordForm = () => {
            user.value.current_password = "";
            user.value.new_password = "";
            user.value.password_confirmation = "";
        }

        buscarUsuario();

        const atualizarSenha = (e) => {
            e.preventDefault();

            const payload = {
                current_password: user.value.current_password,
                password: user.value.new_password,
                password_confirmation: user.value.password_confirmation
            }

            api.put('/user/password', payload)
                .then((response) => {
                    resetPasswordForm();
                    Notify.create({
                        color: 'positive',
                        message: 'Senha atualizada!',
                        icon: 'success'
                    })
                })
                .catch((error) => {
                    if (error?.response?.status == 401) {
                        router.push('/');
                    } else {
                        Notify.create({
                            color: 'negative',
                            message: 'Verifique sua senha',
                            icon: 'report_problem'
                        })
                    }

                })
        }

        const atualizarInformacoesPessoais = (e) => {
            e.preventDefault();
            api.put('/user/profile-information', { name: user.value.name, email: user.value.email })
                .then((response) => {
                    Notify.create({
                        color: 'positive',
                        message: 'Informações atualizadas!',
                        icon: 'success'
                    })
                })
                .catch((error) => {
                    Notify.create({
                        color: 'negative',
                        message: 'Falha ao atualizar informações',
                        icon: 'report_problem'
                    })
                })
        }

        return {
            user,
            atualizarInformacoesPessoais,
            atualizarSenha,
            resetPasswordForm,
        }
    }
})
</script>
  