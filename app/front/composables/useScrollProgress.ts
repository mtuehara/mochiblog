/**
 * Quanto da página já rolou além de um elemento, de 0 a 1.
 *
 * ---------------------------------------------------------------------------
 * PARA QUE SERVE
 * ---------------------------------------------------------------------------
 * A barra de filtros da home não fica simplesmente aparecendo: ela acompanha a
 * rolagem. Enquanto os desenhos estão na tela, os filtros estão invisíveis; na
 * medida em que a capa sobe, eles aparecem; rolando de volta, desaparecem.
 *
 * O número devolvido é a proporção da capa que já passou: 0 quando ela está
 * inteira na tela, 1 quando saiu por cima.
 *
 * ---------------------------------------------------------------------------
 * POR QUE COM UM OUVINTE DE ROLAGEM, E NÃO COM OBSERVER
 * ---------------------------------------------------------------------------
 * O `IntersectionObserver` é a ferramenta certa para "entrou ou não na tela", e
 * devolveria isso com menos trabalho. Mas ele responde em degraus: para ter um
 * desvanecer contínuo seria preciso criar dezenas de limiares e interpolar no
 * meio, o que é mais código do que o problema pede.
 *
 * Aqui a leitura é direta e barata: `getBoundingClientRect` uma vez por quadro,
 * no máximo. O ouvinte é `passive` e a escrita no estado passa por
 * `requestAnimationFrame`, então a rolagem não trava esperando o JavaScript —
 * que é o defeito clássico de quem lê a posição durante o evento de rolagem.
 */
export function useScrollProgress(elemento: Ref<HTMLElement | null>) {
  const progresso = ref(0)

  /** Guarda o identificador do quadro pedido, para não pedir dois. */
  let quadro = 0

  function medir() {
    const el = elemento.value
    if (el === null) return

    const altura = el.offsetHeight

    /**
     * Sem altura não há proporção que faça sentido. Acontece antes do layout
     * estar pronto, e dividir por zero daria `Infinity`.
     */
    if (altura === 0) {
      progresso.value = 0
      return
    }

    const jaPassou = -el.getBoundingClientRect().top
    progresso.value = Math.min(1, Math.max(0, jaPassou / altura))
  }

  function agendar() {
    if (quadro !== 0) return

    quadro = requestAnimationFrame(() => {
      quadro = 0
      medir()
    })
  }

  onMounted(() => {
    medir()

    window.addEventListener('scroll', agendar, { passive: true })
    window.addEventListener('resize', agendar, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', agendar)
    window.removeEventListener('resize', agendar)

    if (quadro !== 0) cancelAnimationFrame(quadro)
  })

  return { progresso }
}
