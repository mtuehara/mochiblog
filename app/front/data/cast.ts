import pamonhaDark from '~/assets/images/pamonha-dark.png'
import pamonhaLight from '~/assets/images/pamonha-light.png'
import mochiDark from '~/assets/images/mochi-dark.png'
import mochiLight from '~/assets/images/mochi-light.png'
import purpleDark from '~/assets/images/purple-dark.png'
import purpleLight from '~/assets/images/purple-light.png'
import rukaDark from '~/assets/images/ruka-dark.png'
import rukaLight from '~/assets/images/ruka-light.png'

import { normalizeLabel } from '~/utils/label'

/**
 * O elenco do blog.
 *
 * ---------------------------------------------------------------------------
 * POR QUE ESTA LISTA É FIXA, SE AS ABAS DO SITE NÃO SÃO
 * ---------------------------------------------------------------------------
 * A navegação por rótulo é montada a partir de `/api/labels` de propósito: um
 * rótulo novo criado no Blogger aparece sozinho, e nenhum post fica invisível.
 *
 * Esta lista é o oposto, e é curada de propósito também: cada personagem tem cor
 * e desenho próprios, e não existe gradiente para inventar a partir de um rótulo
 * desconhecido. Por isso uma lista não substitui a outra — elas convivem. O que
 * não estiver aqui continua sendo alcançado pelos rótulos que vêm da API, o que
 * mantém a garantia de que nenhum post desaparece.
 *
 * A ORDEM desta lista é a ordem na tela. Não é alfabética: é a do mockup.
 */
export interface CastMember {
  /**
   * O rótulo do Blogger, escrito como a autora escreveu.
   *
   * É a chave de tudo: o filtro do BFF e o endereço `/tag/<label>` usam este
   * texto. A comparação ignora caixa e acento (ver `utils/label.ts`), então
   * pequenas diferenças de digitação não quebram o link.
   */
  label: string

  /** O nome completo, quando o rótulo é só um apelido. Hoje só a roxa tem um. */
  fullName?: string

  /** Gradiente da pílula, medido no mockup, da esquerda para a direita. */
  gradient: readonly [string, string]

  /**
   * O desenho de cada tema.
   *
   * São dois arquivos, e não um só com filtro: a cor da linha muda entre o claro
   * e o escuro porque o fundo muda. Um filtro de matiz no desenho inteiro
   * deslocaria todas as cores juntas, e aí a personagem perderia a identidade
   * dela para caber no tema.
   */
  art: { readonly light: string; readonly dark: string }
}

export const CAST: readonly CastMember[] = [
  {
    label: 'Purple',
    // O botão mostra "Purple", como no mockup; "Zolana" é o nome completo e
    // aparece em texto corrido. Os arquivos originais eram `Zolana.png` e
    // `Zolana2.png`, que eram justamente a personagem que não se chamava Zolana
    // no site — o tipo de nome que faz a próxima pessoa perder meia hora.
    fullName: 'Zolana',
    gradient: ['#801bdb', '#cb94ff'],
    art: { light: purpleLight, dark: purpleDark },
  },
  {
    label: 'Ruka',
    gradient: ['#56d5e2', '#0553b0'],
    art: { light: rukaLight, dark: rukaDark },
  },
  {
    label: 'Pamonha',
    gradient: ['#0a9cac', '#7ad75a'],
    art: { light: pamonhaLight, dark: pamonhaDark },
  },
  {
    label: 'Mochi',
    gradient: ['#ff52df', '#ff4e6f'],
    art: { light: mochiLight, dark: mochiDark },
  },
]

/**
 * Encontra o membro do elenco correspondente a um rótulo.
 *
 * Existe porque o rótulo que chega pode ter vindo de qualquer lugar: da rota,
 * da API, ou do texto que a autora digitou no Blogger. Devolver `undefined` para
 * um rótulo desconhecido é resposta legítima, não erro: significa que aquele
 * rótulo não é de ninguém do elenco.
 */
export function findCastMember(label: string): CastMember | undefined {
  const procurado = normalizeLabel(label)
  return CAST.find((member) => normalizeLabel(member.label) === procurado)
}
