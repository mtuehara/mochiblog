import { CAST, type CastMember } from '~/data/cast'

/**
 * O elenco, com a marcação de qual pílula está acesa.
 *
 * ---------------------------------------------------------------------------
 * POR QUE ISTO É UMA FUNÇÃO COMPARTILHADA
 * ---------------------------------------------------------------------------
 * As pílulas do elenco aparecem em dois lugares e com formas diferentes: na capa
 * da home, grandes e com o desenho de cada personagem; e na página de um assunto,
 * numa linha só, porque lá elas são o filtro e não a capa.
 *
 * Duas telas, um dado só. Se cada componente decidisse sozinho qual pílula está
 * acesa e para onde cada uma aponta, bastaria alguém mudar a regra de comparação
 * de rótulo num deles para as duas telas discordarem — e a discordância seria
 * silenciosa, do tipo que só aparece quando alguém repara.
 */
export function useCast() {
  const route = useRoute()

  /**
   * O rótulo da rota atual, quando a página é de um assunto.
   *
   * Vem da ROTA, e não de estado local: assim recarregar a página, usar o botão
   * voltar ou abrir `/tag/Ruka` direto mantêm o destaque certo, sem nada para
   * sincronizar.
   */
  const currentLabel = computed<string | null>(() => {
    const raw = route.params.label
    if (Array.isArray(raw)) return raw[0] ?? null
    return raw ?? null
  })

  /**
   * A comparação ignora caixa e acento, então `/tag/purple` e `/tag/Purple`
   * acendem a mesma pílula — o mesmo critério que o BFF usa para filtrar.
   */
  function isActive(label: string): boolean {
    return currentLabel.value !== null && sameLabel(label, currentLabel.value)
  }

  /**
   * O endereço de um membro do elenco.
   *
   * Mora aqui porque é o formato do endereço, e não decisão de quem desenha a
   * pílula: o rótulo pode ter acento ou espaço, e precisa ser codificado igual em
   * todos os lugares que apontam para ele.
   */
  function routeFor(member: CastMember): string {
    return `/tag/${encodeURIComponent(member.label)}`
  }

  return { members: CAST, isActive, routeFor }
}
