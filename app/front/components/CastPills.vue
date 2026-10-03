<script setup lang="ts">
/**
 * As pílulas do elenco, em dois modos.
 *
 * O padrão é o que os filtros sempre foram: uma fileira centrada que quebra em
 * duas linhas se faltar espaço. É o que a página de assunto usa.
 *
 * O modo `nasColunas` é só da home, e existe porque lá em cima existe uma
 * fileira de desenhos dividida em quatro colunas iguais. Aqui a mesma caixa é
 * dividida do mesmo jeito, e cada nome fica no centro da sua coluna — é essa
 * coincidência que faz o nome aparecer debaixo da personagem, e não numa fileira
 * que ignora onde ela está.
 *
 * A lógica de quem está aceso e para onde cada pílula aponta vem do `useCast`,
 * então as duas telas nunca discordam.
 */
withDefaults(
  defineProps<{
    /** Prende cada nome no centro da coluna da sua personagem (modo da capa). */
    nasColunas?: boolean
  }>(),
  { nasColunas: false },
)

const { members, isActive, routeFor } = useCast()
</script>

<template>
  <ul class="pilulas" :class="{ 'pilulas--colunas': nasColunas }">
    <li
      v-for="(membro, indice) in members"
      :key="membro.label"
      :style="{
        '--posicao': indice,
        '--tinta-base': membro.art.tinta.recuoBase,
        '--tinta-x': membro.art.tinta.deslocamentoX,
      }"
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
 * O padrão: fileira centrada, que quebra em duas linhas quando falta espaço.
 */
.pilulas {
  list-style: none;
  margin: 0;
  padding: 0;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
}

/**
 * MESMA CAIXA QUE OS DESENHOS
 * ===========================================================================
 * A linha de nomes não é uma fileira centralizada: ela é a MESMA caixa da
 * fileira de personagens (mesma folga lateral, do pai, e mesmo teto de largura,
 * do token `--largura-elenco`), dividida em quatro colunas iguais. É essa
 * coincidência que faz a coluna do nome cair na coluna da personagem.
 *
 * A altura é declarada porque os nomes saem do fluxo (ver abaixo): sem ela a
 * caixa mediria zero e a barra encolheria.
 */
.pilulas--colunas {
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
 * O `translate` de -50% centra a pílula nesse ponto, seja ela larga ou estreita.
 * Três problemas somem de uma vez: o erro de alinhamento, a quebra de linha e a
 * regra de "quanto espalhar", que antes era um chute em `vw` para cada largura.
 */
.pilulas--colunas li {
  position: absolute;
  top: 0;
  left: calc((var(--posicao, 0) + 0.5) * 25%);

  /*
   * O deslocamento, em duas parcelas que só valem perto da capa.
   *
   * A primeira é a ESCADA: cada nome sobe o mesmo tanto que a sua personagem
   * subiu na capa, para cair no pé dela e não numa linha reta que atravessa a
   * diagonal.
   *
   * A segunda é a TINTA: o arquivo do desenho é um quadro com sobra embaixo, e
   * quanta sobra muda de personagem para personagem (6% no Mochi, 23% na
   * Pamonha). Sem descontar isso, o nome fica a 30px do pé de um e a 130px do pé
   * do outro — e a diferença não tem nada a ver com o desenho.
   *
   * `--lado-arte` é o lado do quadro do desenho na tela (a mesma medida que a
   * capa usa para a escada), e serve de régua para as duas frações.
   *
   * As duas somem com `--espalhamento`, que é 0 quando os desenhos já saíram de
   * vista: na barra grudada no topo não existe personagem para acompanhar, e os
   * nomes ficam na linha reta.
   */
  transform: translate(
    calc(-50% + var(--tinta-x, 0) * var(--lado-arte) * var(--espalhamento, 0)),
    calc(
      var(--posicao, 0) * -1 * var(--passo-escada) * var(--espalhamento, 0) -
        var(--tinta-base, 0) * var(--lado-arte) * var(--espalhamento, 0)
    )
  );
}

/*
 * Em tela estreita a capa vira duas colunas, e aí a conta de quatro colunas deixa
 * de valer: os nomes voltam para a fileira comum, alinhados ao centro.
 *
 * O limite é o mesmo 620px da capa, e não um número inventado aqui. Com a folga
 * lateral já encolhida, o nome mais largo ("Pamonha") cabe numa coluna de quatro
 * até um pouco abaixo disso: em 700px de tela a coluna tem 154px e o nome pede
 * cerca de 112px.
 */
@media (max-width: 620px) {
  .pilulas--colunas {
    position: static;
    height: auto;
    max-width: none;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem;
  }

  .pilulas--colunas li {
    position: static;
    transform: none;
  }
}
</style>
