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
    /**
     * Cor do texto por cima do gradiente.
     *
     * É branco por padrão, e aqui cor fixa se justifica: as cores do gradiente
     * não mudam entre os temas (medido no mockup), então a tinta por cima delas
     * também não precisa mudar. Fosse o fundo sensível ao tema, isto teria que
     * ser um token.
     */
    ink?: string
  }>(),
  { active: false, ink: '#ffffff' },
)
</script>

<template>
  <NuxtLink
    class="pilula"
    :to="to"
    :style="{ '--pilula-de': colorFrom, '--pilula-ate': colorTo, '--pilula-tinta': ink }"
    :aria-current="active ? 'page' : undefined"
  >
    <slot />
  </NuxtLink>
</template>

<style scoped>
.pilula {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0.5rem 1.6rem;
  border-radius: var(--radius-round);

  background-image: linear-gradient(90deg, var(--pilula-de), var(--pilula-ate));
  color: var(--pilula-tinta);

  font-family: var(--font-cast);
  font-size: clamp(1.05rem, 3.4vw, 1.3rem);
  line-height: 1.2;

  text-decoration: none;
  text-align: center;

  box-shadow: var(--shadow-sm);
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease;
}

.pilula:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
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
