/**
 * Comparação de rótulos, do jeito que o blog precisa.
 *
 * ---------------------------------------------------------------------------
 * POR QUE IGNORAR CAIXA E ACENTO
 * ---------------------------------------------------------------------------
 * Os rótulos quem escreve é a autora, direto no Blogger. Se um dia ela digitar
 * "purple" em vez de "Purple", ou "Pamonhã", o endereço `/tag/purple` precisa
 * continuar funcionando e a pílula precisa continuar acesa.
 *
 * O BFF usa exatamente esta mesma regra para filtrar. Aqui a divergência seria
 * só cosmética — uma aba sem destaque —, então três linhas duplicadas custam
 * menos do que fazer o front importar código de execução do pacote
 * compartilhado, o que arrastaria o Zod junto para o bundle do navegador.
 *
 * Esta função existia dentro do `LabelTabs`. Quando o elenco passou a precisar
 * dela também, duas cópias no mesmo aplicativo deixaram de ser aceitáveis:
 * agora é uma só, e quem quiser comparar rótulo usa esta.
 */
export function normalizeLabel(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function sameLabel(a: string, b: string): boolean {
  return normalizeLabel(a) === normalizeLabel(b)
}
