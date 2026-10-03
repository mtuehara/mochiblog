<script setup lang="ts">
const { siteName, siteTagline } = useRuntimeConfig().public
</script>

<template>
  <div class="site">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>

    <header class="site__header">
      <div class="container">
        <div class="site__header-inner">
          <!--
            O círculo do tema vem ANTES da marca, no canto superior esquerdo,
            como no mockup.

            Ele vive dentro do cabeçalho fixo, e não solto sobre a página, por
            um motivo prático: trocar de tema é algo que se quer poder fazer em
            qualquer ponto da leitura, e solto ele sairia da tela no primeiro
            rolar.

            O grupo à esquerda existe porque o cabeçalho usa `space-between`.
            Com três filhos soltos, a marca seria empurrada para o meio. Num
            grupo, ela fica ao lado do botão e o menu continua na ponta direita.
          -->
          <div class="site__header-left">
            <UiThemeToggle />

            <NuxtLink to="/" class="brand">
              <span class="brand__name">{{ siteName }}</span>
              <span class="brand__tagline">{{ siteTagline }}</span>
            </NuxtLink>
          </div>

          <nav class="site__nav" aria-label="Navegação principal">
            <NuxtLink to="/">Início</NuxtLink>
            <NuxtLink to="/busca">Busca</NuxtLink>
          </nav>
        </div>

        <!--
          As abas ficam DENTRO do header, que é sticky, para continuarem
          acessíveis enquanto o leitor rola. Ficam fora do header-inner porque
          são uma segunda linha, e não parte da fileira de marca e menu.
        -->
        <LabelTabs />
      </div>
    </header>

    <main id="conteudo" class="site__main">
      <div class="container">
        <slot />
      </div>
    </main>

    <footer class="site__footer">
      <div class="container">
        <p>{{ siteName }} · feito com carinho (e um pouco de código)</p>
      </div>
    </footer>
  </div>
</template>
