<script setup lang="ts">
/**
 * O círculo que troca claro e escuro.
 *
 * ---------------------------------------------------------------------------
 * POR QUE O ÍCONE É DESENHADO EM SVG, E NÃO UM CARACTERE
 * ---------------------------------------------------------------------------
 * O caminho curto seria usar "☀" e "☾". Alguns sistemas resolvem "☀" como emoji
 * colorido, e aí ele não obedece ao `currentColor` nem tem traço fino: vira um
 * adesivo no meio de um botão redondo. Desenhado aqui, o ícone herda a cor do
 * botão e tem o mesmo peso nos dois temas.
 *
 * ---------------------------------------------------------------------------
 * POR QUE OS DOIS ÍCONES ESTÃO SEMPRE NO HTML
 * ---------------------------------------------------------------------------
 * O botão renderiza sol E lua, e quem esconde um dos dois é o CSS, a partir do
 * `data-theme`. Parece desperdício, e é de propósito: o servidor não sabe em que
 * tema o leitor está, e escolher o ícone no JavaScript criaria divergência de
 * hidratação — o HTML do servidor e o do navegador discordando, o que o Vue
 * resolve reclamando no console. Com o CSS decidindo, o HTML é sempre igual e o
 * ícone certo aparece já no primeiro quadro.
 */
const { alternar } = useTheme()
</script>

<template>
  <button
    type="button"
    class="tema"
    aria-label="Alternar entre tema claro e escuro"
    title="Alternar entre tema claro e escuro"
    @click="alternar"
  >
    <!-- Lua: aparece no tema claro, apontando o que o clique faz. -->
    <svg class="tema__icone tema__icone--lua" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7Z"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <!-- Sol: aparece no tema escuro. -->
    <svg class="tema__icone tema__icone--sol" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="2" />
      <path
        d="M12 2.6v2.1M12 19.3v2.1M2.6 12h2.1M19.3 12h2.1M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  </button>
</template>

<style scoped>
.tema {
  width: 2.6rem;
  height: 2.6rem;
  padding: 0;
  display: grid;
  place-items: center;

  border: 0;
  border-radius: var(--radius-round);
  background: var(--brand);
  color: var(--brand-ink);

  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.15s ease,
    background-color 0.2s ease;
}

.tema:hover {
  transform: scale(1.06);
}

.tema:active {
  transform: scale(0.94);
}

.tema__icone {
  grid-area: 1 / 1;
  width: 1.15rem;
  height: 1.15rem;
}

/**
 * No tema claro aparece a lua, e no escuro aparece o sol.
 *
 * A condição é `:not([data-theme='dark'])` em vez de `[data-theme='light']`
 * porque o atributo pode não existir: se o JavaScript falhar antes de escrevê-lo,
 * o site continua no tema claro e o botão precisa continuar coerente com o que
 * se vê na tela.
 */
.tema__icone--sol {
  display: none;
}

:root[data-theme='dark'] .tema__icone--sol {
  display: block;
}

:root[data-theme='dark'] .tema__icone--lua {
  display: none;
}
</style>
