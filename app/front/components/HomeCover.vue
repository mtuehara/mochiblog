<script setup lang="ts">
/**
 * A capa: tela inteira, só os quatro desenhos.
 *
 * ---------------------------------------------------------------------------
 * O QUE MUDOU AQUI, E POR QUÊ
 * ---------------------------------------------------------------------------
 * A versão anterior era uma faixa no alto da página, com as pílulas coloridas
 * sempre visíveis e o painel de texto embaixo. O desenho novo inverte a ideia: a
 * capa é a tela inteira e não tem texto nenhum, os nomes só aparecem quando o
 * ponteiro passa por cima, e quem quiser os filtros rola a página.
 *
 * Consequência prática: a capa não cabe dentro do container de leitura do site.
 * Ela é a única parte que ocupa a largura toda, e por isso o layout deixou de
 * embrulhar tudo num container fixo — cada página decide a própria largura.
 */
const { siteName } = useRuntimeConfig().public
const { members } = useCast()
</script>

<template>
  <section class="capa">
    <h1 class="visually-hidden">{{ siteName }}</h1>

    <ul class="capa__elenco" :style="{ '--passos': members.length - 1 }">
      <li
        v-for="(membro, indice) in members"
        :key="membro.label"
        class="capa__celula"
        :style="{ '--posicao': indice }"
      >
        <!--
          Cada desenho é uma ÂNCORA para a lista de posts, e não um botão com
          JavaScript.

          Três coisas saem de graça disso: funciona sem script, entra na ordem de
          tabulação do teclado, e o navegador já cuida da rolagem suave (o `html`
          tem `scroll-behavior: smooth`, que se desliga sozinho para quem pediu
          movimento reduzido).
        -->
        <a
          class="capa__item"
          href="#posts"
          :title="membro.fullName ? `${membro.fullName} — ver os posts` : `Ver os posts`"
        >
          <UiThemeImage
            class="capa__arte"
            :light="membro.art.light"
            :dark="membro.art.dark"
          />

          <!--
            O nome fica embaixo do desenho, sempre visível.

            A primeira versão só mostrava o nome com o ponteiro em cima. Não
            servia: escondia de quem escolhe justamente a informação de que ele
            precisa, e no celular não existe ponteiro para passar por cima — os
            quatro ficariam anônimos.
          -->
          <span
            class="capa__nome"
            :style="{ '--nome-de': membro.gradient[0], '--nome-ate': membro.gradient[1] }"
          >
            {{ membro.label }}
          </span>
        </a>
      </li>
    </ul>

    <!--
      A dica de que existe mais coisa abaixo.

      Sem ela, uma tela cheia só de desenhos não avisa que a página rola — e quem
      chega de fora ficaria olhando uma figura sem saber que há posts ali.
      A seta é decorativa: quem navega por leitor de tela chega aos posts pelo
      próprio link de cada personagem.
    -->
    <p class="capa__dica" aria-hidden="true">↓</p>
  </section>
</template>

<style scoped>
.capa {
  /* `svh` é a altura da janela COM as barras do navegador visíveis. Usar `vh`
     daria uma tela que fica maior do que o visível no celular, e a seta ficaria
     escondida atrás da barra. O `vh` fica como reserva para navegador antigo. */
  min-height: 100vh;
  min-height: 100svh;

  display: grid;
  align-content: center;
  justify-items: center;
  gap: clamp(1rem, 4vh, 2.5rem);

  padding-block: clamp(2rem, 8vh, 5rem);
  padding-inline: var(--space);

  /* Quanto cada personagem sobe em relação à anterior. Um lugar só, porque a
     diagonal e a compensação embaixo precisam do mesmo número. */
  --passo-da-escada: 1.2rem;
}

.capa__elenco {
  list-style: none;
  margin: 0;
  padding: 0;

  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.4rem, 1.5vw, 1.25rem);
  align-items: center;

  width: 100%;
  max-width: 1500px;

  /*
   * A compensação da escada.
   *
   * Cada personagem sobe um degrau, e o último sobe todos: a diagonal sai para
   * fora do lugar que os itens ocupam, e sem devolver esse espaço aqui o grupo
   * inteiro pareceria descentralizado. O respiro embaixo tem exatamente a altura
   * total da escada, então o centro visual volta a bater com o centro da tela.
   */
  padding-bottom: calc(var(--passos, 0) * var(--passo-da-escada));
}

.capa__celula {
  /*
   * A coluna é declarada de propósito, mesmo sendo uma só.
   *
   * Sem ela o grid cria uma coluna `auto`, e largura percentual dentro de coluna
   * automática é dependência circular: o tamanho da coluna depende do item, e o
   * item depende da coluna. O navegador resolve com um valor inflado — já
   * medimos 302px onde deveriam ser 228px, numa versão anterior.
   */
  grid-template-columns: minmax(0, 1fr);
  display: grid;
  place-items: center;

  /**
   * A diagonal, e a razão dela: as quatro personagens são voadoras, e uma fileira
   * reta não diz isso. Subindo da esquerda para a direita, na ordem do mockup, a
   * fileira vira uma trajetória.
   *
   * É `transform` pelo mesmo motivo do crescimento no hover: mudar a posição com
   * margem refaria o layout a cada quadro, e aqui isso significa quatro desenhos
   * de meio megapixel sendo remexidos.
   */
  transform: translateY(calc(var(--posicao, 0) * -1 * var(--passo-da-escada)));
}

.capa__item {
  display: grid;
  justify-items: center;
  gap: 0.5rem;

  /* Mesma razão do comentário acima: é a coluna que dá base à largura
     percentual do desenho. */
  grid-template-columns: minmax(0, 1fr);

  width: 100%;
  text-decoration: none;
}

/**
 * O desenho é maior que a célula, de propósito: é assim que as personagens se
 * encostam. Nada fica cortado, porque a arte é PNG de fundo transparente e
 * nenhum elemento recorta a lista.
 *
 * O teto do `min()` é o que impede a barra de rolagem horizontal: a margem que
 * existe fora do container vale exatamente `--space`, então o desenho pode
 * transbordar a célula até `célula + 2 * --space` e nada além.
 */
.capa__arte {
  width: min(132%, calc(100% + 2 * var(--space)));

  /*
   * O crescimento no hover acontece por `transform`, e não mudando a largura.
   *
   * Transformar não refaz o layout: o desenho cresce sem empurrar os vizinhos
   * nem mexer na posição do nome embaixo dele. Mudar a largura faria os quatro
   * se remexerem a cada passada de ponteiro.
   */
  transition: transform 0.18s ease;
}

.capa__item:hover .capa__arte,
.capa__item:focus-visible .capa__arte {
  transform: scale(1.06);
}

/**
 * O nome, embaixo do desenho.
 *
 * A cor é o gradiente da própria personagem, recortado nas letras — mesmo peso
 * visual das pílulas, sem precisar de caixa. O `drop-shadow` existe por
 * legibilidade: as letras ficam vazadas, e sobre o fundo colorido um nome sem
 * sombra perde o contorno.
 *
 * A cor da sombra é a tinta do site, e não um valor fixo: no tema claro ela sai
 * escura e separa as letras do fundo menta; no escuro ela sai clara e faz o
 * mesmo sobre o magenta. Uma regra só, e os dois casos ficam certos.
 */
.capa__nome {
  font-family: var(--font-cast);
  font-size: clamp(1.25rem, 2.6vw, 2rem);
  line-height: 1.15;
  text-align: center;

  background-image: linear-gradient(90deg, var(--nome-de), var(--nome-ate));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  /*
   * A sombra é forte de propósito. O gradiente do Pamonha termina num verde claro
   * e o do Mochi começa num rosa forte: sobre um fundo claro, a ponta mais clara
   * de cada nome precisa de uma borda escura para não sumir. Como a cor da sombra
   * é a tinta do site, no tema escuro ela vira clara e cumpre o mesmo papel sobre
   * o magenta.
   */
  filter:
    drop-shadow(0 1px 1px color-mix(in srgb, var(--ink) 85%, transparent))
    drop-shadow(0 2px 6px color-mix(in srgb, var(--ink) 45%, transparent));
}

.capa__dica {
  margin: 0;
  font-size: 1.5rem;
  color: var(--link);
  animation: pulsa 2.4s ease-in-out infinite;
}

@keyframes pulsa {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(6px);
    opacity: 1;
  }
}

/*
 * Em tela estreita, quatro desenhos lado a lado ficam pequenos demais para
 * clicar. Duas colunas resolvem, e o desenho volta ao tamanho da célula para não
 * transbordar a margem da página.
 */
@media (max-width: 620px) {
  .capa__elenco {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
    padding-bottom: 0;
  }

  /*
   * Em duas colunas a diagonal deixa de fazer sentido: o segundo item de cada
   * linha ficaria mais alto que o primeiro sem motivo, e a escada vira bagunça.
   */
  .capa__celula {
    transform: none;
  }

  .capa__arte {
    width: 100%;
  }
}
</style>
