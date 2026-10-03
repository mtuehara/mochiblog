<script setup lang="ts">
/**
 * O layout do site.
 *
 * ---------------------------------------------------------------------------
 * AQUI EXISTIA UM CABEÇALHO, E ELE SAIU INTEIRO
 * ---------------------------------------------------------------------------
 * Ele tinha a marca, dois links e uma barra de abas por rótulo, e era fixo no
 * topo. Saiu por decisão de desenho: no mockup o alto da home é a capa, sem
 * barra nenhuma, e a navegação por assunto passou a ser o elenco das
 * personagens.
 *
 * O que substituiu cada pedaço:
 *
 *   - as abas por rótulo  -> as pílulas do elenco, que são os filtros
 *   - a marca             -> o nome do site, no rodapé
 *   - os links de navegar -> o rodapé, porque sem ele não haveria como chegar
 *                            à busca nem sair de uma página interna sem usar o
 *                            botão voltar do navegador
 *
 * O círculo do tema ficou onde estava no mockup, no alto à esquerda. Ele NÃO é
 * fixo: rola junto com a página. Fixo, ele passaria por cima do texto em tela
 * estreita, e trocar de tema não é coisa que precise estar ao alcance o tempo
 * todo.
 */
const { siteName, siteTagline } = useRuntimeConfig().public
</script>

<template>
  <div class="site">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>

    <div class="site__topo">
      <div class="container">
        <UiThemeToggle />
      </div>
    </div>

    <main id="conteudo" class="site__main">
      <div class="container">
        <slot />
      </div>
    </main>

    <footer class="site__footer">
      <div class="container">
        <nav class="site__footer-nav" aria-label="Navegação">
          <NuxtLink to="/">Início</NuxtLink>
          <NuxtLink to="/busca">Busca</NuxtLink>
        </nav>

        <p class="site__footer-nota">{{ siteName }} · {{ siteTagline }}</p>
      </div>
    </footer>
  </div>
</template>
