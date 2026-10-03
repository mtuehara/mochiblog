/**
 * Tema claro/escuro, com a escolha guardada no navegador.
 *
 * ---------------------------------------------------------------------------
 * QUEM MANDA NO TEMA
 * ---------------------------------------------------------------------------
 * O CSS nunca pergunta pelo tema a ninguém: ele lê o atributo `data-theme` no
 * elemento <html> e pronto. Isso é o que permite um botão de tema que é uma
 * linha de código em vez de um estado global espalhado.
 *
 * Esse atributo já vem escrito quando o navegador pinta o primeiro quadro,
 * colocado lá pelo script inline declarado em `nuxt.config.ts`. Aqui nós apenas
 * continuamos o serviço: lemos o que ele decidiu e trocamos o valor quando
 * alguém clica.
 *
 * A preferência do sistema operacional é só o valor inicial de quem nunca
 * escolheu. Depois da primeira escolha, ela deixa de ser consultada — quem
 * escolheu "claro" no computador de casa não quer ver o site virar escuro às 18h
 * porque o sistema mudou sozinho.
 */
export type Tema = 'light' | 'dark'

export function useTheme() {
  /**
   * `useState` e não `ref`: o estado precisa ser o MESMO em todos os componentes
   * que pedirem por ele. Com `ref`, dois componentes teriam duas verdades, e o
   * segundo a clicar ficaria com a primeira desatualizada.
   */
  const tema = useState<Tema>('tema-atual', () => 'light')

  const { temaChave } = useRuntimeConfig().public

  function aplicar(proximo: Tema) {
    /**
     * O DOM é a fonte da verdade enquanto a página está aberta, porque é ele que
     * o CSS lê. O estado do Vue existe para o JavaScript poder reagir — hoje,
     * para o botão saber o que fazer no próximo clique.
     */
    document.documentElement.dataset.theme = proximo
    tema.value = proximo

    try {
      localStorage.setItem(temaChave, proximo)
    } catch {
      /**
       * Sem acesso ao armazenamento (navegação privada, em alguns navegadores).
       * A troca continua valendo para esta aba, e é o melhor que dá para fazer:
       * recusar a troca de tema por causa disso seria pior.
       */
    }
  }

  function alternar() {
    aplicar(tema.value === 'dark' ? 'light' : 'dark')
  }

  /**
   * Adota o que o script do <head> já decidiu.
   *
   * Sem isto, o servidor renderizaria dizendo "claro" e o botão mostraria o
   * ícone errado a quem está no escuro. Note que isto é sincronizar o estado com
   * o DOM existente, não reescrevê-lo: por isso `onMounted`, e não a lógica
   * dentro de um computado.
   */
  onMounted(() => {
    tema.value = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  })

  return { tema, alternar }
}
