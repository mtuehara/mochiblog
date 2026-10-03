<script setup lang="ts">
/**
 * As pílulas do elenco como filtro, em uma linha só.
 *
 * É a mesma pílula da capa, sem o desenho. Existe separada do `CastRow` porque a
 * capa e o filtro são coisas diferentes que por acaso usam a mesma peça: na capa
 * a pessoa está escolhendo por onde começar, e aqui ela está trocando de assunto
 * sem voltar para a home.
 *
 * A lógica de quem está aceso e para onde cada pílula aponta vem do `useCast`,
 * então as duas telas nunca discordam.
 */
const { members, isActive, routeFor } = useCast()
</script>

<template>
  <ul class="pilulas">
    <li v-for="membro in members" :key="membro.label">
      <UiGradientPill
        :to="routeFor(membro)"
        :color-from="membro.gradient[0]"
        :color-to="membro.gradient[1]"
        :active="isActive(membro.label)"
        :title="membro.fullName ? `${membro.fullName} — posts de ${membro.label}` : undefined"
      >
        {{ membro.label }}
      </UiGradientPill>
    </li>
  </ul>
</template>

<style scoped>
/*
 * Alinhadas ao centro, porque é para lá que elas se juntam.
 *
 * A distância entre uma e outra é o que muda com a rolagem: perto da capa, os
 * nomes deixam seus lugares embaixo de cada personagem e aparecem aqui
 * espalhados, na mesma ordem e nas mesmas colunas. Conforme o leitor desce, eles
 * convergem para o meio e viram os botões.
 *
 * O espalhamento é o inverso da `--mistura`: cheio é junto, solto é separado.
 * Quem publica a mistura é a barra de filtros.
 */
.pilulas {
  list-style: none;
  margin: 0;
  padding: 0;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  --espalhamento: max(0, min(1, calc(1 - var(--mistura, 1))));
  gap: calc(0.75rem + var(--espalhamento) * 8vw);
  transition: gap 0.12s linear;
}

/*
 * Em tela estreita o espalhamento não faz sentido: as quatro pílulas já não
 * cabem numa linha, e abrir espaço entre elas só empurraria a última para baixo
 * antes da hora.
 */
@media (max-width: 620px) {
  .pilulas {
    gap: 0.6rem;
  }
}
</style>
