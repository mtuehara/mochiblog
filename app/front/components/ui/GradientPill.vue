<script setup lang="ts">
/**
 * Pílula com gradiente — o botão de cada personagem.
 *
 * ---------------------------------------------------------------------------
 * O QUE ELA SABE, E O QUE ELA NÃO SABE
 * ---------------------------------------------------------------------------
 * Este componente não conhece personagem nenhum. Ele recebe duas cores e um
 * destino, e desenha. Quem sabe que a roxa vai de `#801bdb` a `#cb94ff` é o
 * arquivo de dados do elenco.
 *
 * Essa separação é o que permite reusar a mesma pílula para outra coisa depois
 * sem tocar nela: um assunto, um botão de filtro, o que aparecer.
 */
withDefaults(
  defineProps<{
    /** Destino do clique. A pílula é sempre um link, nunca um botão solto. */
    to: string
    /** Cor do lado esquerdo do gradiente. */
    colorFrom: string
    /** Cor do lado direito. */
    colorTo: string
    /** Marca a pílula como a que representa a página atual. */
    active?: boolean
  }>(),
  { active: false },
)
</script>

<template>
  <NuxtLink
    class="pilula"
    :to="to"
    :style="{ '--pilula-de': colorFrom, '--pilula-ate': colorTo }"
    :aria-current="active ? 'page' : undefined"
  >
    <slot />
  </NuxtLink>
</template>

<style scoped>
/**
 * ===========================================================================
 * DUAS APARÊNCIAS, UMA PÍLULA
 * ===========================================================================
 * A mesma pílula é um botão cheio quando está na área dos posts e vira só o nome
 * em gradiente quando o leitor sobe de volta para a capa. Quem interpola as duas
 * é `--progresso`, publicado pela barra de filtros a partir da rolagem.
 *
 * A montagem é esta:
 *
 *   - o TEXTO é o gradiente recortado nas letras, com um branco por cima;
 *   - o PREENCHIMENTO é um `::before` atrás do texto, com o mesmo gradiente;
 *   - `--mistura` vai de 1 (cheia, longe da capa) a 0 (solta, perto dela).
 *
 * Cheia: preenchimento opaco, branco por cima das letras. Solta: preenchimento
 * invisível, branco em zero, e o gradiente das letras fica à mostra — que é a
 * mesma aparência dos nomes embaixo de cada personagem, para a passagem da capa
 * para os posts parecer contínua, e não uma troca de elemento.
 *
 * O padrão de `--progresso` é 1, ou seja, cheia: fora da home não existe capa, e
 * a pílula está sempre na área dos posts.
 */
.pilula {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* A barra em volta dela está com `pointer-events: none`; aqui devolvemos. */
  pointer-events: auto;

  padding: 0.5rem 1.6rem;
  border-radius: var(--radius-round);
  /*
   * `--mistura` vem de fora: quem calcula é a barra de filtros, a partir da
   * rolagem. 0 é "solto", 1 é "cheio".
   *
   * O padrão existe para quando a pílula aparece fora da home — lá não há capa,
   * então ela está sempre na área dos posts, e portanto cheia.
   *
   * `--forca` é a mesma coisa ao quadrado, e existe por um motivo visual: como o
   * preenchimento e o texto são o MESMO gradiente, no meio do caminho o texto
   * branco fica semitransparente sobre um fundo semitransparente da mesma cor —
   * e o resultado fica lavado, quase ilegível. Ao quadrado, o fundo cheio só
   * aparece perto do fim, e o miolo incômodo fica curto.
   */
  --forca: calc(var(--mistura, 1) * var(--mistura, 1));

  background-image: linear-gradient(90deg, var(--pilula-de), var(--pilula-ate));
  background-clip: text;
  color: color-mix(in srgb, #ffffff calc(var(--forca) * 100%), transparent);

  /*
   * A folga lateral encolhe junto com o preenchimento.
   *
   * Solta, a pílula é só o nome: o `padding` de botão aqui só criaria um vão
   * grande entre um nome e o outro, e é justamente esse vão que fazia a linha
   * medir 575px independentemente da largura da janela.
   */
  padding-inline: calc(1.6rem * var(--mistura, 1));

  font-family: var(--font-cast);

  /*
   * Solta, a pílula é um nome, e tem o tamanho de nome. Cheia, é um botão, e
   * encolhe para o tamanho de botão. O `clamp` continua ali para acompanhar a
   * largura da janela nos dois estados.
   */
  font-size: calc(clamp(1.05rem, 3.4vw, 1.3rem) + var(--espalhamento, 0) * 0.7rem);
  line-height: 1.2;

  text-decoration: none;
  text-align: center;

  /*
   * `drop-shadow` no lugar de `box-shadow`: ele segue a forma do que foi pintado.
   * Com a pílula cheia é a sombra da pílula; solta, é a sombra das letras — que é
   * o contorno de que o gradiente precisa sobre o fundo da página.
   */
  filter: drop-shadow(0 1px 2px color-mix(in srgb, var(--ink) 45%, transparent));

  transition: transform 0.15s ease;
}

/*
 * O preenchimento.
 *
 * O `z-index: -1` NÃO é detalhe: sem ele o fundo é pintado DEPOIS do texto.
 * Um filho posicionado sem `z-index` entra no fim da ordem de pintura, junto com
 * o texto e depois dele — então, quando o fundo ficava opaco, ele cobria as
 * letras e o botão virava um retângulo colorido sem nome nenhum.
 *
 * Com `-1` ele desce para logo acima do fundo do próprio elemento e abaixo do
 * texto. Funciona porque o `filter` da pílula já cria um contexto de
 * empilhamento: o `-1` é relativo a ela, e não à página.
 */
.pilula::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;

  border-radius: inherit;
  background-image: linear-gradient(90deg, var(--pilula-de), var(--pilula-ate));
  opacity: var(--forca);
}

.pilula:hover,
.pilula:focus-visible {
  --mistura: 1;
  --forca: 1;
  transform: translateY(-2px);
}

/**
 * A pílula ativa ganha um anel, e não só uma cor diferente.
 *
 * Quem não distingue as tonalidades — ou quem está olhando no sol — precisa de
 * mais de uma pista. O anel usa a cor da tinta do site, que já vira clara no tema
 * escuro, então ele continua visível nos dois.
 */
.pilula[aria-current='page'] {
  outline: 3px solid var(--ink);
  outline-offset: 3px;
}
</style>
