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

    <!--
      O `<slot />` fica solto, sem container.

      Antes o layout embrulhava toda página numa caixa de 780px. Isso deixou de
      servir quando a capa da home passou a ocupar a tela inteira: uma seção de
      largura total não cabe dentro de um container, e a saída seria um
      "full-bleed" com `100vw`, que erra a conta por causa da barra de rolagem.

      Então a largura virou decisão de cada página, e quem quer a caixa de
      leitura usa `class="container"` — que continua sendo o respiro vertical,
      aplicado pelo `main.css` a todo container dentro da `main`.
    -->
    <main id="conteudo" class="site__main">
      <slot />
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
