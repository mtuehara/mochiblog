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
 * Alinhadas à esquerda, junto do título da página.
 *
 * Centradas elas ficavam soltas no meio, sem relação com o texto acima — e aqui
 * elas são um filtro, parte do conteúdo, não um enfeite de capa.
 */
.pilulas {
  list-style: none;
  margin: 0;
  padding: 0;

  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
</style>
