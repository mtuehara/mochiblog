<script setup lang="ts">
const route = useRoute()
const api = useBlogApi()

const label = computed(() => String(route.params.label ?? ''))

const requestedPage = computed(() => {
  const raw = Number(route.query.page ?? 1)
  return Number.isInteger(raw) && raw > 0 ? raw : 1
})

const { data, error } = await useAsyncData(
  () => `label:${label.value}:page:${requestedPage.value}`,
  () => api.listPosts({ label: label.value, page: requestedPage.value }),
  { watch: [label, requestedPage] },
)

if (error.value) {
  // `statusMessage` vai para a linha de status do HTTP e precisa ser ASCII.
  // O texto em português que o leitor lê vai em `message`.
  throw createError({
    statusCode: 502,
    statusMessage: 'Bad Gateway',
    message: 'Não foi possível carregar os posts agora. Tente de novo em instantes.',
  })
}

const posts = computed(() => data.value?.items ?? [])
const currentPage = computed(() => data.value?.page ?? 1)
const totalPages = computed(() => data.value?.totalPages ?? 1)

/**
 * O resumo abaixo do título.
 *
 * É montado aqui, e não no template, por um motivo bobo e teimoso: no template a
 * frase vira uma sequência de interpolações separadas por quebras de linha, e
 * cada quebra vira um espaço na tela. O resultado era "1 post encontrado .",
 * com o ponto solto depois de um espaço.
 *
 * Juntando as partes no script, a frase sai inteira e não depende de onde o
 * editor quebrou a linha.
 */
const resumo = computed(() => {
  const contagem = posts.value.length
  const texto = `${contagem} ${contagem === 1 ? 'post encontrado' : 'posts encontrados'}`

  return totalPages.value > 1 ? `${texto} nesta página.` : `${texto}.`
})

useSeoMeta({
  title: () =>
    currentPage.value > 1 ? `${label.value} · Página ${currentPage.value}` : label.value,
  description: () => `Todos os posts marcados com “${label.value}”.`,
  ogTitle: () => label.value,
  ogDescription: () => `Todos os posts marcados com “${label.value}”.`,
  ogType: 'website',
})
</script>

<template>
  <!--
    O container é aplicado pela própria página desde que o layout deixou de
    embrulhar tudo: a capa da home precisa da largura inteira, e as páginas de
    leitura continuam querendo a caixa estreita.
  -->
  <div class="container">
    <!--
      O caminho de volta. Ele era desnecessário enquanto o cabeçalho existia e
      tinha uma aba "Todos"; agora o cabeçalho saiu, e sem isto a única saída da
      página seria o botão voltar do navegador.
    -->
    <NuxtLink class="back-link" to="/">← Todos os posts</NuxtLink>

    <header class="page-head">
      <span class="page-head__eyebrow">Assunto</span>
      <h1>{{ label }}</h1>
      <p class="page-head__lead">{{ resumo }}</p>
    </header>

    <!--
      Os filtros, aqui na página em que eles importam.

      Sem esta linha, trocar de assunto exigiria voltar para a home, porque as
      pílulas da capa só existem lá. São as mesmas pílulas, sem os desenhos: a
      lógica de qual está acesa vem do `useCast`, então as duas telas não podem
      discordar.
    -->
    <CastPills class="assunto__pilulas" />

    <ul v-if="posts.length" class="post-list">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </ul>

    <p v-else class="empty-state">Nenhum post com este assunto ainda.</p>

    <nav v-if="totalPages > 1" class="pagination" aria-label="Paginação">
      <NuxtLink
        v-if="currentPage > 1"
        :to="{ query: currentPage > 2 ? { page: currentPage - 1 } : {} }"
        rel="prev"
      >
        ← Mais recentes
      </NuxtLink>
      <span v-else />

      <span class="pagination__status">Página {{ currentPage }} de {{ totalPages }}</span>

      <NuxtLink
        v-if="currentPage < totalPages"
        :to="{ query: { page: currentPage + 1 } }"
        rel="next"
      >
        Mais antigos →
      </NuxtLink>
      <span v-else />
    </nav>
  </div>
</template>

<style scoped>
/**
 * O respiro depois dos filtros.
 *
 * Fica aqui, e não dentro do `CastPills`, porque o espaçamento depende de quem
 * vem depois — e o componente das pílulas não sabe o que isso é.
 */
.assunto__pilulas {
  margin-bottom: 2rem;
}
</style>
