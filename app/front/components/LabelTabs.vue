<script setup lang="ts">
const api = useBlogApi()
const route = useRoute()

/**
 * Abas de assunto do blog.
 *
 * As abas são geradas a partir de `/api/labels`, e não escritas à mão. Isso
 * importa: os rótulos quem cria é quem escreve o post, direto no Blogger. Uma
 * barra fixa no código com quatro abas continuaria funcionando no dia em que
 * aparecesse um quinto rótulo, mas o post ficaria invisível para sempre em
 * qualquer aba. Aqui, a barra acompanha o conteúdo sozinha.
 *
 * A chave `'labels'` é fixa de propósito. O `useAsyncData` deduplica por chave,
 * então mesmo que este componente apareça mais de uma vez na página, sai uma
 * chamada só para o BFF.
 */
const { data } = await useAsyncData('labels', () => api.listLabels())

/**
 * Se a chamada falhar, `data` fica nulo e a barra simplesmente não aparece.
 *
 * O `useAsyncData` guarda o erro em vez de lançar, então o layout continua
 * renderizando normalmente. É degradação graciosa: o site perde a navegação por
 * assunto, não fica em branco.
 */
const labels = computed(() => data.value ?? [])

/**
 * A aba ativa é derivada da ROTA, não de estado local.
 *
 * Assim não existe estado para sincronizar: recarregar a página, usar o botão
 * voltar ou abrir o link direto mantêm a aba certa marcada, de graça.
 */
const currentLabel = computed<string | null>(() => {
  const raw = route.params.label
  if (Array.isArray(raw)) return raw[0] ?? null
  return raw ?? null
})

/**
 * A comparação de rótulos mora em `utils/label.ts`.
 *
 * Ela nasceu aqui dentro e passou a ser usada também pelo elenco das
 * personagens. Duas cópias da mesma regra no mesmo aplicativo era uma a mais do
 * que o aceitável, então virou uma função compartilhada.
 */

const isAllActive = computed(() => route.path === '/')

/**
 * Prefetch por INTENÇÃO, não por visibilidade.
 *
 * O padrão do Nuxt é prefetchar todo link que entra na tela. Como a barra de
 * abas está sempre visível, isso significava uma requisição por aba a cada
 * página vista: medi cinco chamadas a `/api/posts` numa única visita, mesmo sem
 * ninguém clicar em nada.
 *
 * Cada prefetch desses vira uma execução do servidor Nitro e uma chamada ao BFF.
 * Em serverless isso conta no total de invocações, e no celular é banda gasta
 * para um menu que a maioria dos leitores nem usa.
 *
 * Com `hover`, nada é buscado até o leitor demonstrar interesse passando o mouse
 * por cima de uma aba. O clique continua rápido, porque a busca começa antes.
 */
const prefetchOn = { visibility: false, hover: true }
</script>

<template>
  <nav v-if="labels.length" class="tabs" aria-label="Filtrar posts por assunto">
    <ul class="tabs__list">
      <li>
        <NuxtLink
          to="/"
          class="tab"
          :class="{ 'tab--active': isAllActive }"
          :aria-current="isAllActive ? 'page' : undefined"
          :prefetch-on="prefetchOn"
          >Todos</NuxtLink
        >
      </li>

      <li v-for="label in labels" :key="label.name">
        <NuxtLink
          :to="`/tag/${encodeURIComponent(label.name)}`"
          class="tab"
          :class="{
            'tab--active': currentLabel !== null && sameLabel(currentLabel, label.name),
          }"
          :aria-current="
            currentLabel !== null && sameLabel(currentLabel, label.name) ? 'page' : undefined
          "
          :prefetch-on="prefetchOn"
          >{{ label.name }}</NuxtLink
        >
      </li>
    </ul>
  </nav>
</template>
