<script setup lang="ts">
/**
 * A capa: tela inteira, só os quatro desenhos.
 *
 * ---------------------------------------------------------------------------
 * O QUE MUDOU AQUI, E POR QUÊ
 * ---------------------------------------------------------------------------
 * Esta seção tem SÓ os desenhos.
 *
 * Antes ela também tinha o nome embaixo de cada personagem, e a barra de filtros
 * tinha outros quatro nomes por cima dos mesmos lugares. O resultado era o que
 * não podia ser: enquanto se rolava, dava para ver o nome saindo e um botão
 * aparecendo logo abaixo — dois elementos para a mesma personagem.
 *
 * Agora existe um só. Os nomes embaixo das personagens SÃO as pílulas: elas
 * nascem na mesma folga lateral e na mesma escada que os desenhos, então cada um
 * aparece embaixo da sua personagem, e são elas que endurecem em botão conforme
 * o leitor desce.
 *
 * Por isso a capa não é mais uma tela cheia: ela ocupa a altura da janela menos a
 * linha de nomes, e os desenhos ficam encostados embaixo, com o céu sobrando em
 * cima — que é para onde eles estão voando.
 */
const { siteName } = useRuntimeConfig().public
const { members } = useCast()
</script>

<template>
  <section class="capa">
    <h1 class="visually-hidden">{{ siteName }}</h1>

    <ul class="capa__elenco">
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
          :aria-label="`Ver os posts de ${membro.label}`"
          :title="membro.fullName ? `${membro.fullName} — ver os posts` : `Ver os posts`"
        >
          <UiThemeImage
            class="capa__arte"
            :light="membro.art.light"
            :dark="membro.art.dark"
          />
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.capa {
  /*
   * A altura da janela MENOS as duas faixas: a do topo, onde fica o círculo do
   * tema, e a linha de nomes, que vem logo depois.
   *
   * É essa conta que faz o nome de cada personagem cair logo abaixo dela e tudo
   * caber numa tela sem rolagem: a linha vive no fluxo, encostada no fim desta
   * seção, então sobra para os desenhos exatamente isto.
   *
   * `svh` é a altura com as barras do navegador visíveis; `vh` fica de reserva
   * para navegador antigo.
   */
  min-height: calc(100vh - var(--altura-linha-nomes) - var(--altura-topo));
  min-height: calc(100svh - var(--altura-linha-nomes) - var(--altura-topo));

  display: grid;

  /*
   * Os desenhos encostam embaixo e o espaço que sobra fica em cima — que é para
   * onde eles estão voando. Também é o que mantém cada nome junto da sua
   * personagem: centrados, sobraria um vão entre os pés e os nomes.
   */
  align-content: end;
  justify-items: center;

  padding-block: clamp(1.5rem, 6vh, 4rem) 0;
  padding-inline: var(--folga-capa);
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
  transform: translateY(calc(var(--posicao, 0) * -1 * var(--passo-escada)));
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
 * O desenho é bem maior que a célula, de propósito: é assim que as personagens
 * se encostam. Nada fica cortado, porque a arte é PNG de fundo transparente e
 * nenhum elemento recorta a lista.
 *
 * O teto do `min()` é o que impede a barra de rolagem horizontal. Com quatro
 * desenhos enfileirados, a largura total ocupada é `3 * célula + desenho`, e isso
 * não pode passar da largura da janela. Daí o teto ser `célula + 2 * folga`: a
 * folga lateral é exatamente o espaço livre nas pontas.
 */
.capa__arte {
  width: min(150%, calc(100% + 2 * var(--folga-capa)));

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

/*
 * Em tela estreita, quatro desenhos lado a lado ficam pequenos demais para
 * clicar. Duas colunas resolvem, e o desenho volta ao tamanho da célula para não
 * transbordar a margem da página.
 */
@media (max-width: 620px) {
  .capa__elenco {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
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
