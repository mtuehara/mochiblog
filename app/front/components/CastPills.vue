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
/**
 * MESMA CAIXA QUE OS DESENHOS
 * ===========================================================================
 * A linha de nomes não é uma fileira centralizada: ela é a MESMA caixa da
 * fileira de personagens (mesma folga lateral, do pai, e mesmo teto de largura,
 * do token `--largura-elenco`), dividida em quatro colunas iguais. É essa
 * coincidência que faz a coluna do nome cair na coluna da personagem.
 *
 * A altura é declarada porque os nomes saíram do fluxo (ver abaixo): sem ela a
 * caixa mediria zero e a barra encolheria.
 */
.pilulas {
  list-style: none;
  margin: 0;
  padding: 0;

  position: relative;
  height: var(--altura-linha-nomes);

  max-width: var(--largura-elenco);
  margin-inline: auto;
}

/*
 * POSIÇÃO ABSOLUTA, e por que chegamos nela.
 *
 * Em fluxo, as quatro pílulas eram uma fileira centralizada. Só que a largura
 * delas vem do TEXTO: o grupo media sempre uns 575px, enquanto as colunas das
 * personagens esticam com a janela. Medido, o erro foi de 15px em tela de 900px
 * e de 208px em 1700 — ou seja, o nome ia deixando de ficar embaixo da sua
 * personagem conforme a janela crescia.
 *
 * Fora do fluxo, cada nome é preso ao centro da coluna que lhe cabe: a coluna
 * `i` ocupa a faixa `i` de quatro da caixa, então o centro dela é `(i + 0,5) / 4`.
 * O `translateX(-50%)` centra a pílula nesse ponto, seja ela larga ou estreita.
 *
 * Três problemas somem de uma vez: o erro de alinhamento (não existe em largura
 * nenhuma), a quebra de linha (quem está fora do fluxo não empurra ninguém) e a
 * regra de "quanto espalhar" — que antes era chute de `vw` para cada largura.
 *
 * A `translateY` continua sendo a escada: cada nome sobe junto com a sua
 * personagem enquanto os desenhos estão à vista, e volta para a linha reta
 * quando `--espalhamento` chega a zero.
 */
.pilulas li {
  position: absolute;
  top: 0;
  left: calc((var(--posicao, 0) + 0.5) * 25%);

  transform: translate(
    -50%,
    calc(var(--posicao, 0) * -1 * var(--passo-escada) * var(--espalhamento, 0))
  );
}

/*
 * Em tela estreita a capa vira duas colunas, e aí a conta de quatro colunas
 * deixa de valer: os nomes voltam para a fileira comum, alinhados ao centro.
 *
 * O limite é o mesmo 620px da capa, e não um número inventado aqui. Com a folga
 * lateral já encolhida, o nome mais largo ("Pamonha") cabe em uma coluna de
 * quatro até um pouco abaixo disso: em 700px de tela a coluna tem 154px e o nome
 * pede cerca de 112px.
 */
@media (max-width: 620px) {
  .pilulas {
    position: static;
    height: auto;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem;
  }

  .pilulas li {
    position: static;
    transform: none;
  }
}
</style>
