<script setup lang="ts">
import { computed } from 'vue'

/**
 * Imagem que troca de arquivo conforme o tema.
 *
 * ---------------------------------------------------------------------------
 * O PROBLEMA QUE ESTE COMPONENTE RESOLVE
 * ---------------------------------------------------------------------------
 * Cada desenho do elenco existe em duas versões, uma para o claro e outra para o
 * escuro. Mostrar a certa parece trivial, e não é, porque o servidor não sabe em
 * que tema o leitor está: o tema mora no navegador.
 *
 * As saídas óbvias têm defeito:
 *
 *   - `v-if` pelo tema: o HTML do servidor e o do navegador discordam, e o Vue
 *     acusa divergência de hidratação. Além disso, o desenho certo só apareceria
 *     depois que o JavaScript rodasse — um pulo visível na primeira dobra, que é
 *     justamente onde ele está.
 *   - Os dois `<img>` no HTML, um escondido: funciona e não pisca, mas o
 *     navegador baixa as duas imagens, e metade do peso é jogada fora por todo
 *     visitante, sempre.
 *
 * A saída aqui é deixar o CSS escolher, através de duas variáveis declaradas no
 * elemento. Como o atributo `data-theme` já está no <html> antes do primeiro
 * quadro, a troca acontece junto com a pintura: sem piscar, sem divergência de
 * hidratação e baixando só um dos arquivos.
 *
 * O preço é não ter `alt` de verdade, porque imagem de fundo não aceita. Por
 * isso o desenho é tratado como DECORATIVO por padrão: ele repete o nome que a
 * pílula ao lado já diz. Quando a imagem tiver informação própria, passe `alt` e
 * o componente passa a se anunciar como imagem.
 */
const props = defineProps<{
  /** Arquivo usado no tema claro. */
  light: string
  /** Arquivo usado no tema escuro. */
  dark: string
  /** Descrição para leitores de tela. Sem ela, a imagem é decorativa. */
  alt?: string
}>()

const variaveis = computed(() => ({
  '--imagem-clara': `url("${props.light}")`,
  '--imagem-escura': `url("${props.dark}")`,
}))
</script>

<template>
  <div
    class="imagem-tema"
    :style="variaveis"
    :role="alt ? 'img' : undefined"
    :aria-label="alt"
    :aria-hidden="alt ? undefined : 'true'"
  />
</template>

<style scoped>
.imagem-tema {
  background-image: var(--imagem-clara);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  width: 100%;

  /**
   * A proporção tem padrão 1:1 porque quase todos os desenhos são quadrados, mas
   * é uma variável para que quem usa possa ajustar sem mexer aqui dentro.
   */
  aspect-ratio: var(--imagem-proporcao, 1);
}

:root[data-theme='dark'] .imagem-tema {
  background-image: var(--imagem-escura);
}
</style>
