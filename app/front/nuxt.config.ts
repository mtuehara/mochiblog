/**
 * URL do BFF.
 *
 * Atenção ao detalhe: esta variável é lida em TEMPO DE BUILD, não em tempo de
 * execução. O motivo é que ela alimenta o `routeRules.proxy` abaixo, e o
 * routeRules vira configuração do servidor Nitro compilado.
 *
 * Consequência prática no Vercel: `BFF_URL` precisa existir nas variáveis de
 * ambiente ANTES do build, senão o site sobe apontando para localhost. Se um
 * dia isso virar um problema, a alternativa é trocar o proxy por um middleware
 * de servidor que leia `useRuntimeConfig()`, que aí passa a ser dinâmico.
 */
const bffUrl = (process.env.BFF_URL ?? 'http://localhost:3001').replace(/\/+$/, '')

/**
 * Onde a escolha de tema do leitor fica guardada no navegador.
 *
 * Esta constante existe em UM lugar só, e é usada por dois consumidores que não
 * podem divergir: o script abaixo, que lê o valor antes da página pintar, e o
 * `useTheme`, que grava o valor quando alguém clica no botão. Se os dois
 * usassem literais diferentes, o botão funcionaria e a escolha seria esquecida
 * a cada recarga — o tipo de bug que passa desapercebido por semanas.
 */
const CHAVE_DO_TEMA = 'mochiblog:tema'

/**
 * Decide o tema ANTES do primeiro quadro, e por isso é um script inline.
 *
 * O problema que ele resolve: a escolha do leitor mora no `localStorage`, que
 * não existe no servidor. Se a decisão ficasse para depois da hidratação, a
 * página apareceria clara e só então mudaria para escura — o piscar branco que
 * todo site com tema escuro tem. Aqui o atributo já está no <html> quando o
 * navegador pinta pela primeira vez.
 *
 * Sem escolha salva, seguimos o sistema operacional. O `try/catch` não é
 * enfeite: `localStorage` lança exceção em navegação privada em alguns
 * navegadores, e um site que não abre é bem pior que um site que abre claro.
 */
const TEMA_INLINE_SCRIPT = `
(() => {
  let tema = 'light'
  try {
    const salvo = localStorage.getItem('${CHAVE_DO_TEMA}')
    if (salvo === 'light' || salvo === 'dark') tema = salvo
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) tema = 'dark'
  } catch {
    /* sem acesso ao armazenamento: segue no claro */
  }
  document.documentElement.dataset.theme = tema
})()
`

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: { enabled: true },

  /**
   * As quatro fontes vêm empacotadas junto com o site, não de um CDN.
   *
   * Cada arquivo traz o `@font-face` com `unicode-range`, então o navegador
   * baixa apenas os subconjuntos que a página realmente usa — em PT-BR isso quer
   * dizer basicamente o latino, mesmo que o pacote traga cirílico e grego.
   *
   * A ordem importa: as fontes primeiro, e o `main.css` por último, para que ele
   * possa sobrescrever qualquer coisa que precise.
   */
  css: [
    '@fontsource/montserrat/400.css',
    '@fontsource/montserrat/500.css',
    '@fontsource/montserrat/600.css',
    '@fontsource/montserrat/700.css',
    '@fontsource/mclaren/400.css',
    '@fontsource/lilita-one/400.css',
    '@fontsource/edu-qld-hand/400.css',
    '~/assets/css/main.css',
  ],

  /**
   * `runtimeConfig.public` é a forma correta de expor configuração para o
   * navegador. O prefixo `NUXT_PUBLIC_` no ambiente sobrescreve automaticamente:
   * `NUXT_PUBLIC_SITE_URL` vira `public.siteUrl`. Sem espalhar `process.env`
   * pelo código, o que também deixa tudo testável.
   */
  runtimeConfig: {
    public: {
      siteName: 'Mochi Blog',

      /**
       * O texto mudou junto com o conceito do site. Ele deixou de ser um blog
       * de receitas e passou a ser o blog dos alters, como diz o mockup: um
       * canto íntimo onde as personalidades trocam textos.
       *
       * Estes dois campos aparecem na aba do navegador, no cartão de preview
       * quando alguém compartilha o link, e no alto da página.
       */
      siteTagline: 'Um canto íntimo',
      siteDescription:
        'Um canto íntimo onde partes e personalidades da minha mente trocam textos, desabafos e, às vezes, desenhos.',

      siteUrl: 'http://localhost:3000',
      authorName: 'Mochi',

      /** Ver o comentário de `CHAVE_DO_TEMA`, no alto deste arquivo. */
      temaChave: CHAVE_DO_TEMA,
    },
  },

  /**
   * O proxy que faz a mágica acontecer.
   *
   * O navegador pede `/api/posts` NO PRÓPRIO DOMÍNIO DO SITE. O Nitro recebe,
   * repassa para o BFF e devolve a resposta. Do ponto de vista do navegador, é
   * uma chamada same-origin: não existe preflight, não existe CORS, e a URL do
   * BFF não aparece em lugar nenhum do HTML.
   *
   * Isso funciona igual no servidor (durante a renderização SSR) e no
   * navegador, o que significa que uma página pode ser montada no servidor com
   * dados reais e depois continuar atualizando no cliente pelo mesmo caminho.
   */
  routeRules: {
    '/api/**': {
      proxy: {
        to: `${bffUrl}/api/**`,

        /**
         * `redirect: 'manual'` — a opção mais importante deste arquivo.
         *
         * O `fetch` do Node segue redirecionamento por padrão, e o proxy herdava
         * isso. Na prática: o BFF respondia 302 para a tela de consentimento do
         * Google, o proxy ia buscar essa página sozinho e devolvia 200 com o HTML
         * do Google no lugar do redirecionamento. O navegador nunca era mandado
         * para lugar nenhum, e a autorização travava sem mensagem de erro.
         *
         * Medido, antes de corrigir: porta 3001 (BFF direto) devolvia 302 com a
         * URL certa; porta 3000 (pelo proxy) devolvia 200.
         *
         * Com `manual`, o 302 chega inteiro ao navegador, que é quem deve
         * seguir o redirecionamento.
         */
        fetchOptions: { redirect: 'manual' },
      },
    },

    /**
     * O painel é renderizado só no navegador. Isso não é preguiça, é a única
     * opção correta aqui.
     *
     * O cookie de sessão tem `Path=/api` (ver `app/bff/src/auth/session.ts`),
     * então o navegador NÃO o envia quando pede a página `/admin` — de propósito,
     * para ele não viajar em navegação nem em arquivo estático. A consequência é
     * que o servidor, ao renderizar `/admin`, não tem como saber se há sessão, e
     * renderizaria o formulário de login para quem já está logado.
     *
     * Medido: com cookie válido, o HTML do servidor vinha com o formulário. A
     * pessoa veria "Entre" por um instante e depois o painel, o que parece bug.
     *
     * Desligando o SSR nesta rota, nada de errado é renderizado: a tela espera a
     * resposta de `/api/auth/me` (que aí sim leva o cookie) e desenha o estado
     * certo de primeira. O painel é uma ferramenta privada que já nasce fora do
     * índice dos buscadores, então não perdemos nada de SEO.
     */
    '/admin/**': { ssr: false },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },

        /**
         * `theme-color` pinta a barra do navegador no celular. São duas tags
         * com `media`, uma por modo.
         *
         * Limitação conhecida: elas respondem à preferência do SISTEMA, não ao
         * botão do site. Quem estiver no sistema claro e escolher o tema escuro
         * aqui vai ver a barra na cor clara. O contorno seria reescrever a tag
         * pelo JavaScript, e não vale a complexidade por um detalhe que só
         * aparece no celular.
         */
        {
          name: 'theme-color',
          content: '#cdfbfe',
          media: '(prefers-color-scheme: light)',
        },
        {
          name: 'theme-color',
          content: '#94367b',
          media: '(prefers-color-scheme: dark)',
        },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      script: [{ innerHTML: TEMA_INLINE_SCRIPT }],
    },
  },

  typescript: {
    // O typecheck completo roda no `pnpm typecheck`, não a cada build. Rodar
    // junto do build deixa o deploy lento sem ganho real, já que o CI cobre.
    typeCheck: false,
    strict: true,
  },
})
