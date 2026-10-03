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
    <li
      v-for="(membro, indice) in members"
      :key="membro.label"
      :style="{ '--posicao': indice }"
    >
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
 * nomes deixam seus lugares embaixo de cada personagem e continuam aqui
 * espalhados, na mesma ordem e nas mesmas colunas. Conforme o leitor desce, eles
 * convergem para o meio e viram os botões.
 *
 * As duas grandezas vêm da barra de filtros: `--espalhamento` é 1 quando os
 * nomes estão soltos e 0 quando estão juntos. Fora da home não existe barra, e o
 * padrão 0 deixa a linha já formada.
 */
.pilulas {
  list-style: none;
  margin: 0;
  padding: 0;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  gap: calc(0.75rem + var(--espalhamento, 0) * 5vw);
  transition: gap 0.12s linear;
}

/*
 * Cada nome sobe junto com a sua personagem enquanto está solto, para o nome cair
 * embaixo dela e não numa linha reta que atravessa a diagonal.
 */
.pilulas li {
  transform: translateY(
    calc(var(--posicao, 0) * -1 * var(--passo-escada) * var(--espalhamento, 0))
  );
}

/*
 * Em tela estreita não há espalhamento nem diagonal.
 *
 * O limite é 800px, e não o mesmo 620 das personagens, porque o problema aqui é
 * outro: quatro pílulas com o tamanho de nome somam cerca de 575px, e com um vão
 * entre elas a linha precisa de mais espaço do que telas menores oferecem. Com o
 * espalhamento desligado, elas quebram em duas linhas e continuam legíveis.
 */
@media (max-width: 900px) {
  .pilulas {
    gap: 0.6rem;
  }

  .pilulas li {
    transform: none;
  }
}
</style>
