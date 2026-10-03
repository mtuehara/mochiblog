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
 * linha de nomes, e os desenhos sobem em escada (`--passo-escada`), cada um com o
 * nome logo abaixo dos pés — que é para onde eles estão voando.
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
   * Os desenhos ficam CENTRADOS na altura que sobra.
   *
   * Antes eles encostavam no chão (`align-content: end`) e toda a sobra virava
   * céu vazio: medido numa janela de 1440x900, 276px em cima contra nada embaixo.
   *
   * Hoje não sobra quase nada: a escada (`--passo-escada`) é calculada para o
   * grupo ocupar a capa inteira, e o que resta é o respiro de cima e o vão entre
   * os pés e os nomes, os dois em `padding-block`.
   */
  align-content: center;
  justify-items: center;

  padding-block: var(--respiro-capa) var(--vao-nomes);
  padding-inline: var(--folga-capa);
}

.capa__elenco {
  list-style: none;
  margin: 0;
  padding: 0;

  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  /*
   * Sem vão entre as colunas, e isso é exigência do alinhamento dos nomes.
   *
   * Lá embaixo, cada nome é preso ao centro da coluna por uma conta de quatro
   * partes iguais. Com um vão no meio, a coluna deixa de ser exatamente um quarto
   * da caixa e a conta passaria a depender dele — mais uma grandeza para sair de
   * sincronia sem ninguém perceber. E o desenho transborda a célula de qualquer
   * forma: o vão não separava nada.
   */
  gap: 0;

  /*
   * `end` nas LINHAS: cada célula encosta o desenho no fundo da sua própria
   * caixa. É isso que transforma o degrau da escada em altura de verdade — a
   * célula mais alta (a última, com o maior `padding-bottom`) define a altura da
   * linha, e a caixa da capa passa a medir o grupo inteiro. Com `transform`,
   * aquele degrau não existia para o layout e a capa ficava maior que o grupo:
   * era exatamente esse resto que virava o vão entre os pés e os nomes.
   */
  align-items: end;

  width: 100%;
  max-width: var(--largura-elenco);
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
  justify-items: center;
  align-content: end;

  /**
   * A escada, e a razão dela: as quatro personagens são voadoras, e uma fileira
   * reta não diz isso. Subindo da esquerda para a direita, na ordem do mockup, a
   * fileira vira uma trajetória.
   *
   * É `padding` e não `transform`, de propósito: assim o degrau conta como altura
   * da linha e a caixa da capa mede o grupo de verdade. Com `transform`, o degrau
   * era invisível para o layout e a diferença entre a capa e o grupo virava vão.
   *
   * Cada personagem sobe `--passo-escada`, o mesmo tanto que o nome dela desce
   * até a linha dos nomes. É esse número compartilhado que faz o nome cair sempre
   * debaixo dos pés da sua personagem.
   */
  padding-bottom: calc(var(--posicao, 0) * var(--passo-escada));
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
    padding-bottom: 0;
  }

  .capa__arte {
    width: 100%;
  }
}
</style>
