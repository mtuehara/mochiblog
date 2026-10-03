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
    <div class="container">
      <CastPills />
    </div>
  </div>
</template>

<style scoped>
.barra {
  position: sticky;
  top: 0;
  z-index: 5;

  /*
   * Fundo translúcido com desfoque, igual ao cabeçalho antigo.
   *
   * Sem ele, as pílulas ficariam flutuando sobre o texto dos posts quando
   * grudadas no alto, e nenhuma cor de pílula resolve isso.
   */
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(10px);

  padding-block: 0.6rem;
  border-bottom: 1px solid transparent;

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

/**
 * Quando está visível, ganha a linha de baixo que separa a barra do conteúdo.
 * Enquanto está invisível, a borda também some, senão ficaria um risco solto
 * cortando o meio da capa.
 */
.barra:not([inert]) {
  border-bottom-color: var(--border);
}
</style>
