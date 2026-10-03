<script setup lang="ts">
import { CAST } from '~/data/cast'

/**
 * O elenco: uma pílula e um desenho por personagem.
 *
 * Este é o primeiro pedaço da capa do site. Ele não busca nada na API — tudo o
 * que aparece aqui vem de `data/cast.ts`, porque é uma lista curada, com cor e
 * desenho escolhidos pessoa a pessoa.
 *
 * A pílula acesa é derivada da ROTA, não de estado local, do mesmo jeito que as
 * abas do site já faziam: assim recarregar a página, usar o botão voltar ou
 * abrir `/tag/Ruka` direto mantêm o destaque certo sem nada para sincronizar.
 */
const route = useRoute()

const currentLabel = computed<string | null>(() => {
  const raw = route.params.label
  if (Array.isArray(raw)) return raw[0] ?? null
  return raw ?? null
})

/**
 * A pílula fica acesa quando a página atual é o assunto daquela personagem.
 *
 * A comparação ignora caixa e acento, então `/tag/purple` e `/tag/Purple`
 * acendem a mesma pílula.
 */
function isActive(label: string): boolean {
  return currentLabel.value !== null && sameLabel(label, currentLabel.value)
}
</script>

<template>
  <ul class="elenco">
    <li
      v-for="(membro, indice) in CAST"
      :key="membro.label"
      class="elenco__item"
      :style="{ '--posicao': indice }"
    >
      <!--
        A pílula vem antes do desenho no HTML porque é assim na tela: o nome
        acima, o desenho pendurado logo abaixo.
      -->
      <UiGradientPill
        class="elenco__pilula"
        :to="`/tag/${encodeURIComponent(membro.label)}`"
        :color-from="membro.gradient[0]"
        :color-to="membro.gradient[1]"
        :active="isActive(membro.label)"
        :title="membro.fullName ? `${membro.fullName} — posts de ${membro.label}` : undefined"
      >
        {{ membro.label }}
      </UiGradientPill>

      <UiThemeImage
        class="elenco__arte"
        :light="membro.art.light"
        :dark="membro.art.dark"
      />
    </li>
  </ul>
</template>

<style scoped>
.elenco {
  list-style: none;
  margin: 0;
  padding: 0;

  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.4rem, 1.5vw, 1.25rem);
  align-items: start;
}

.elenco__item {
  /*
   * A coluna é declarada de propósito, mesmo sendo uma só.
   *
   * Sem ela, o grid cria uma coluna `auto`, e uma largura percentual dentro de
   * uma coluna automática é uma dependência circular: o tamanho da coluna depende
   * do item, e o tamanho do item depende da coluna. O navegador resolve isso com
   * um valor inflado.
   *
   * Medido, antes desta linha: com `width: 132%`, o desenho saía com 302px numa
   * célula de 173px — 175% em vez de 132%. Com `calc(100% + 40px)` a soma virava
   * o dobro do esperado. Declarando a coluna, a porcentagem passa a ter contra o
   * que ser medida e o valor confere.
   */
  grid-template-columns: minmax(0, 1fr);
  display: grid;
  justify-items: center;

  /**
   * A subida em diagonal do mockup: cada pílula um pouco mais alta que a anterior.
   *
   * O deslocamento é calculado a partir da posição na lista, e não escrito quatro
   * vezes à mão. Assim, se entrar um quinto alter, ele continua a escada sozinho.
   */
  transform: translateY(calc(var(--posicao) * -1.1rem));
}

.elenco__pilula {
  position: relative;
  z-index: 1;
}

/*
 * O desenho é maior que a célula dele, de propósito.
 *
 * É assim que as personagens se encostam, como no mockup. E nada fica cortado:
 * a arte é um PNG com fundo transparente e nenhum elemento recorta a lista, então
 * onde os desenhos se cruzam o que se vê são as linhas se cruzando. Ocultar não
 * acontece, porque a área transparente de um não esconde a linha do outro.
 *
 * O limite superior do `min()` não é enfeite: sem ele, o desenho mais largo que
 * a célula transborda para fora da página em telas de tablet, e aí aparece uma
 * barra de rolagem horizontal. Medido: numa janela de 922px o último desenho
 * terminava exatamente no limite da página, sem margem nenhuma.
 *
 * A conta é simples: o desenho transborda `(largura - célula) / 2` de cada lado,
 * e precisa caber na margem que sobra fora do container. Essa margem vale
 * justamente `--space` — o mesmo recuo lateral que o container já usa. Daí
 * `célula + 2 * --space`. Assim o tamanho se ajusta sozinho, em vez de depender
 * de um ponto de quebra escolhido no olho.
 */
.elenco__arte {
  width: min(132%, calc(100% + 2 * var(--space)));
  margin-top: -0.7rem;
}

/**
 * Em duas colunas a diagonal deixa de fazer sentido: o segundo item de cada
 * linha ficaria mais alto que o primeiro sem motivo, e a escada vira bagunça.
 * O desenho também volta ao tamanho da célula: em tela estreita,
 * transbordar significaria sair pela margem da página.
 */
@media (max-width: 620px) {
  .elenco {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem 0.75rem;
  }

  .elenco__item {
    transform: none;
  }

  .elenco__arte {
    width: 100%;
  }
}
</style>
