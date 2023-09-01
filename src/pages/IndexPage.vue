<template>
  <div align="center" class="q-mt-lg">
    <q-table style="height: 500px; max-width: 900px;" rows-per-page-label="Despesas por página"
      :rows-per-page-options="[10, 20]" virtual-scroll flat bordered title="Despesas" :rows="despesasStore.despesas"
      :columns="columns" row-key="name" :filter="filter" no-results-label="Nenhuma despesa encontrada"
      no-data-label="Você ainda não possui nenhuma despesa cadastrada">
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Pesquisar despesa">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-valor="props">
        <q-td :props="props">
          <div>
            <q-badge color="negative" class="q-pa-sm" :label="props.value" />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-deletar="props">
        <q-td :props="props">
          <q-btn text-color="grey-7" unelevated icon="delete_forever" padding="xm" dense
            @click="confirmarExclusaoDespesa = true, idDespesaParaExclusao = props.row.id" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="confirmarExclusaoDespesa" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">Tem certeza que deseja excluir a despesa?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="secondary" v-close-popup />
          <q-btn flat label="Excluir" color="negative" v-close-popup @click="excluirDespesa(idDespesaParaExclusao)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <ModalDespesa />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="modalDespesaStore.open = true" />
    </q-page-sticky>
  </div>
</template>


<script>
import { defineComponent, ref } from 'vue'
import ModalDespesa from 'components/ModalDespesa.vue'
import { modalDespesaStore } from '../stores/modalDespesaStore.js'
import { despesasStore } from '../stores/despesasStore.js'
import { redirectIfUnauthenticated } from '../utils/redirectIfUnauthenticated.js';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';


const columns = [
  { name: 'descricao', align: 'left', label: 'Descrição', field: 'descricao', required: true },
  { name: 'valor', align: 'left', label: 'Valor (R$)', field: 'valor', sortable: true },
  { name: 'data', align: 'left', label: 'Data', field: 'data', sortable: true },
  { name: 'deletar' }
];

export default defineComponent({
  name: 'IndexPage',
  components: {
    ModalDespesa
  },
  setup() {

    const confirmarExclusaoDespesa = ref(false);
    const idDespesaParaExclusao = ref("");
    const router = useRouter();

    const listarDespesas = () => {
      api.get('/api/despesas')
        .then((response) => {
          despesasStore.despesas = response.data.data
        })
        .catch((error) => {
          if (error?.response?.status == 401) {
            router.push('/');
          }
        })
    }

    const excluirDespesa = (id) => {
      api.delete(`/api/despesas/${id}`)
        .then((response) => {
          listarDespesas()
          Notify.create({
            color: 'positive',
            message: 'Despesa excluida!',
            icon: 'success'
          })
        })
        .catch((error) => {
          Notify.create({
            color: 'negative',
            message: error?.response?.data?.message || 'Erro ao excluir despesa',
            icon: 'report_problem'
          })
          if (error?.response?.status == 401) {
            router.push('/');
          }
        })
        .finally(() => {
          idDespesaParaExclusao.value = "";
        })
    }

    listarDespesas();

    return {
      despesasStore,
      columns,
      modalDespesaStore,
      confirmarExclusaoDespesa,
      excluirDespesa,
      idDespesaParaExclusao
    }
  }
})
</script>
