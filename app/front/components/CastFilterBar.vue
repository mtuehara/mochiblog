<script setup lang="ts">
/**
 * A barra de filtros que acompanha a rolagem.
 *
 * ---------------------------------------------------------------------------
 * COMO ELA SE COMPORTA
 * ---------------------------------------------------------------------------
 * Ela fica logo depois da capa na página, e é `sticky`: quando a rolagem chega
 * nela, gruda no alto da tela e fica.
 *
 * Ela NUNCA fica invisível. Os nomes que estão aqui são os mesmos que aparecem
 * embaixo de cada personagem na capa, então apagá-los apagaria a própria capa. O
 * que a rolagem muda é a APARÊNCIA de cada pílula, não a presença dela: nome solto
 * em gradiente lá em cima, botão cheio aqui embaixo.
 *
 * O número da rolagem vem de fora, em vez de ser medido aqui dentro, porque quem
 * tem os dois elementos para comparar é a página. Este componente só desenha.
 */
defineProps<{
  /** Proporção da capa que já subiu: 0 é a capa inteira à vista, 1 é fora dela. */
  progresso: number
}>()
</script>

<template>
  <div class="barra" :style="{ '--progresso': progresso }">
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
  padding-inline: var(--folga-capa);

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

  /*
   * E o inverso dela: 1 é "solto" (nome espalhado, como na capa), 0 é "junto"
   * (botão na linha). Quem desenha os nomes lê daqui.
   */
  --espalhamento: max(0, min(1, calc(1 - var(--mistura))));

  /*
   * Nada de `opacity` aqui.
   *
   * Havia um `opacity: var(--progresso)` neste lugar, com a intenção de esconder
   * a barra enquanto a capa estivesse à vista. Só que ele desbota a barra
   * INTEIRA — e como as pílulas são os nomes das personagens, o efeito era as
   * letras sumirem no lugar de o fundo delas sumir. Quem cuida de desaparecer é
   * o preenchimento de cada pílula, e só ele.
   */
}
</style>
