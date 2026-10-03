<script setup lang="ts">
const route = useRoute()
const api = useBlogApi()
const { siteName, siteDescription } = useRuntimeConfig().public

/**
 * A página vem da query string (`/?page=3`).
 *
 * Toda entrada externa precisa ser tratada como suspeita, inclusive a query
 * string. `Number(route.query.page)` com um valor como "abc" devolve NaN, e
 * `?page=-5` produziria um slice absurdo. Normalizamos aqui, uma vez, em vez de
 * confiar que a URL está correta.
 */
const requestedPage = computed(() => {
  const raw = Number(route.query.page ?? 1)
  return Number.isInteger(raw) && raw > 0 ? raw : 1
})

/**
 * A chave do `useAsyncData` inclui a página.
 *
 * Isso é o que faz o Nuxt guardar o resultado de cada página separadamente:
 * voltar para a página 2 é instantâneo, sem nova chamada. Se a chave fosse fixa,
 * todas as páginas compartilhariam o mesmo cache e a navegação mostraria dados
 * errados por um instante.
 */
const { data, error } = await useAsyncData(
  () => `posts:page:${requestedPage.value}`,
  () => api.listPosts({ page: requestedPage.value }),
  { watch: [requestedPage] },
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
 * A referência para a capa, usada para medir a rolagem.
 *
 * O `div` em volta da capa, no template, parece desnecessário e não é: um `ref`
 * num componente Vue devolve a INSTÂNCIA do componente, e o que precisamos aqui é
 * a altura do elemento na página.
 */
const capa = ref<HTMLElement | null>(null)
const { progresso } = useScrollProgress(capa)

/**
 * `title` cuida do `<title>` da aba; `ogTitle` e `ogDescription` cuidam do
 * cartão de preview quando alguém compartilha o link. São coisas diferentes e
 * precisam ser declaradas separadamente.
 */
useSeoMeta({
  title: () => (currentPage.value > 1 ? `Página ${currentPage.value}` : siteName),
  description: siteDescription,
  ogTitle: () => (currentPage.value > 1 ? `Página ${currentPage.value}` : siteName),
  ogDescription: siteDescription,
  ogType: 'website',
  ogSiteName: siteName,
})
</script>

<template>
  <div>
    <!--
      A capa ocupa a tela inteira e NÃO tem container: é a única parte do site
      que usa a largura toda. Foi por causa dela que o layout deixou de
      embrulhar as páginas num container fixo — agora cada página decide a
      própria largura.

      O `ref` existe porque é a altura da capa que define quando os filtros
      aparecem.
    -->
    <div ref="capa">
      <HomeCover />
    </div>

    <!--
      A barra de filtros, logo depois da capa.

      Ela é `sticky`, então gruda no alto quando a rolagem chega nela, e some
      quando a capa volta a aparecer.
    -->
    <CastFilterBar :progresso="progresso" />

    <div class="container">
      <!--
        `id="posts"` é o destino da âncora de cada personagem da capa.

        O título da lista é um `<h2>`, e não um `<h1>`, porque o `<h1>` da página
        fica na capa. Duas manchetes de nível 1 na mesma página não são erro, mas
        dizem ao buscador que existem dois assuntos principais onde só existe um.
      -->
      <section id="posts" class="home__posts">
        <header class="page-head">
          <h2>Últimos posts</h2>
        </header>

      <ul v-if="posts.length" class="post-list">
          <PostCard v-for="post in posts" :key="post.id" :post="post" />
        </ul>

        <p v-else class="empty-state">Nenhum post publicado ainda. Volte em breve.</p>

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
      </section>
    </div>
  </div>
</template>

<style scoped>
/**
 * O recuo da âncora.
 *
 * Sem ele, ao clicar numa personagem a lista pararia no alto da tela e o título
 * ficaria escondido atrás da barra de filtros, que está grudada ali.
 */
.home__posts {
  scroll-margin-top: 5rem;
  padding-block: clamp(1.5rem, 5vw, 3rem);
}
</style>
