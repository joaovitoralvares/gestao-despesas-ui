<template>
    <q-dialog v-model="modalDespesaStore.open">
        <q-card class="my-card" style="width: 700px; max-width: 80vw;">
            <q-toolbar class="bg-primary"><q-toolbar-title class="text-white">Cadastrar
                    Despesa</q-toolbar-title></q-toolbar>

            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                <q-card-section>

                    <q-input filled v-model="despesa.descricao" label="Descrição *" hint="Descrição da despesa" />

                    <q-input filled v-model="despesa.valor" label="Valor (R$) *" mask="#,##" fill-mask="0" reverse-fill-mask
                        hint="Valor da despesa em reais" />

                    <q-input filled v-model="despesa.data" mask="##/##/####">
                        <template v-slot:append>
                            <q-icon name="event" color="secondary" class="cursor-pointer">
                                <q-popup-proxy>
                                    <q-date v-model="despesa.data" mask="DD/MM/YYYY" :locale="defaultLocale"></q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>


                </q-card-section>

                <q-separator />
                <q-card-section>
                    <div>
                        <q-btn label="Cadastrar" type="submit" color="primary" />
                        <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm"
                            @click="cancelarCriacaoDespesa" />
                    </div>
                </q-card-section>
            </q-form>

        </q-card>
    </q-dialog>
</template>
  
<script>
import { defineComponent, ref } from 'vue'
import { modalDespesaStore } from '../stores/modalDespesaStore.js'
import { despesasStore } from '../stores/despesasStore.js'
import { api } from 'src/boot/axios'
import { date, Notify } from 'quasar'


export default defineComponent({
    name: 'ModalDespesa',

    setup() {
        const timeStamp = Date.now()
        const dataFormatada = date.formatDate(timeStamp, 'DD/MM/YYYY')

        const despesa = ref({
            descricao: "",
            data: dataFormatada,
            valor: "",
        });

        const onReset = () => {
            despesa.value.descricao = "";
            despesa.value.data = dataFormatada;
            despesa.value.valor = "";
            modalDespesaStore.open = false;
        }

        const onSubmit = () => {
            const data = date.extractDate(despesa.value.data, 'DD/MM/YYYY')
            const payload = {
                descricao: despesa.value.descricao,
                data: date.formatDate(data, 'YYYY-MM-DD'),
                valor: parseFloat(despesa.value.valor.replace(",", ".")),
            }

            api.post('/api/despesas', payload)
                .then((response) => {
                    onReset();
                    api.get('api/despesas').then((response) => {
                        despesasStore.despesas = response.data.data
                    })
                    Notify.create({
                        color: 'positive',
                        message: 'Despesa cadastrada com sucesso!',
                        icon: 'success'
                    })
                })
                .catch((error) => {
                    if (error?.response?.status == 401) {
                        router.push('/');
                    }
                    Notify.create({
                        color: 'negative',
                        message: error?.response?.data?.message || 'Erro ao cadastrar despesa',
                        icon: 'report_problem'
                    })
                })
        }

        const defaultLocale = {
            days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
            daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
            months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
            monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
            firstDayOfWeek: 1,
            format24h: true,
            pluralDay: 'dias'
        }

        return {
            despesa,
            onReset,
            onSubmit,
            defaultLocale,
            modalDespesaStore
        }
    }
})
</script>
  