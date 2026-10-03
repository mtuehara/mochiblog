<script setup lang="ts">
import { computed } from 'vue'

/**
 * A barra de filtros que acompanha a rolagem.
 *
 * ---------------------------------------------------------------------------
 * COMO ELA SE COMPORTA
 * ---------------------------------------------------------------------------
 * Ela fica logo depois da capa na página, e é `sticky`: quando a rolagem chega
 * nela, gruda no alto da tela e fica. O que muda com a rolagem é só a presença —
 * enquanto os desenhos estão à vista ela está invisível e inerte; conforme a capa
 * sobe, ela aparece; rolando de volta, desaparece de novo.
 *
 * A opacidade vem de fora, como número, em vez de ser calculada aqui dentro. O
 * motivo é que quem sabe quando a capa acabou é a página, que tem os dois
 * elementos. Este componente só desenha.
 */
const props = defineProps<{
  /** Proporção da capa que já subiu: 0 é escondida, 1 é visível. */
  progresso: number
}>()

/**
 * Abaixo da metade do caminho ela está escondida e sem interação.
 *
 * `inert` resolve as três coisas de uma vez: tira da ordem de tabulação, tira da
 * árvore de acessibilidade e impede clique. O `pointer-events: none` sozinho
 * deixaria os links alcançáveis pelo teclado — invisíveis, mas alcançáveis, que é
 * a pior combinação possível.
 */
const escondida = computed(() => props.progresso < 0.5)
</script>

<template>
  <div
    class="barra"
    :style="{ '--progresso': progresso }"
    :inert="escondida || undefined"
  >
    <!--
      Sem container.

      A barra ocupa a largura toda porque as pílulas são os nomes da capa, e na
      capa eles estão espalhados pela tela inteira. Presas numa caixa de 780px,
      elas não teriam para onde se afastar e a linha quebraria em duas — foi o que
      aconteceu na primeira tentativa.
    -->
    <CastPills />
  </div>
</template>

<style scoped>
.barra {
  position: sticky;
  top: 0;
  z-index: 5;

  /*
   * Sem fundo, sem borda e sem desfoque: as pílulas ficam soltas sobre o
   * conteúdo, que era o pedido. O que as separa do texto atrás é a própria
   * sombra de cada pílula.
   */
  padding-block: 0.75rem;
  padding-inline: var(--space);

  /*
   * A curva da transformação, calculada UMA vez.
   *
   * 0 é "solto", 1 é "cheio", e ela sai da proporção da capa que já subiu:
   * enquanto a capa está à vista (até metade) não há preenchimento nenhum, e ele
   * entra conforme o leitor desce para os posts.
   *
   * Fica aqui, e não em cada peça, porque duas coisas dependem dela ao mesmo
   * tempo: o preenchimento de cada pílula e o quanto a linha delas está espalhada.
   * Calculada em dois lugares, bastaria uma mudança de fórmula para elas
   * discordarem sem que ninguém percebesse.
   */
  --mistura: max(0, min(1, calc((var(--progresso) - 0.5) * 2)));

  opacity: var(--progresso);

  /*
   * A transição é curta de propósito.
   *
   * O número já vem da rolagem, quadro a quadro; uma transição longa aqui
   * atrasaria a resposta e daria a sensação de que a barra está flutuando atrás
   * do dedo. O pouco que existe serve para o salto de um quadro perdido não
   * aparecer como piscada.
   */
  transition: opacity 0.12s linear;
}
</style>
