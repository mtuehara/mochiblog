<script setup lang="ts">
/**
 * A capa da home: elenco, apresentação e os dois botões.
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTE COMPONENTE É
 * ---------------------------------------------------------------------------
 * É a composição, não o conteúdo. Ele junta três peças que existem por conta
 * própria — o elenco, o painel e os botões — e decide apenas como elas se
 * relacionam na tela. Por isso ele não busca nada na API nem conhece as cores de
 * ninguém: quem sabe disso é o `CastRow` e o arquivo de dados do elenco.
 *
 * ---------------------------------------------------------------------------
 * SOBRE O TEXTO DE APRESENTAÇÃO
 * ---------------------------------------------------------------------------
 * O texto é o do mockup, com três correções de digitação ("oode" -> "onde",
 * "as vezes" -> "às vezes", e uma vírgula antes de "clique"). A voz é da autora e
 * não foi reescrita: só o que estava claramente errado foi corrigido.
 *
 * O `<h1>` da página é o nome do site, e está invisível de propósito. O desenho
 * do mockup não tem título nenhum na tela — só o painel com o texto —, mas toda
 * página precisa de um título de nível 1 para leitores de tela e buscadores. Um
 * título escondido mantém os dois lados satisfeitos.
 */
const { siteName } = useRuntimeConfig().public

const INTRO =
  'Bom, este é um canto íntimo onde partes e personalidades da minha mente ficam ' +
  'trocando textos. É também uma ferramenta de autoconhecimento. Só clicar no nome ' +
  'do alter para ver seus textos, desabafos e, às vezes, desenhos. Se quiser só ' +
  'textos mistos ou só desenhos, clique nos botões corretos.'
</script>

<template>
  <section class="capa">
    <h1 class="visually-hidden">{{ siteName }}</h1>

    <CastRow />

    <div class="capa__painel card">
      <p class="capa__texto">{{ INTRO }}</p>
    </div>

    <div class="capa__acoes">
      <!--
        "Todos" leva à lista de posts, que fica logo abaixo nesta mesma página.
        Por isso é uma âncora, e não uma rota: navegar para a página em que já se
        está não faria nada visível.

        A âncora aproveita o `scroll-behavior: smooth` que já está no `html`, e
        respeita quem pediu movimento reduzido, porque essa regra também já
        desliga a rolagem suave nesse caso.
      -->
      <a class="btn capa__botao" href="#posts">Mistos/Todos</a>

      <!--
        "Rabiscos" ainda não filtra nada: o botão está aqui só para o desenho
        ficar completo, e quem decidiu isso foi o Mau.

        Ele fica `disabled` de verdade em vez de parecer clicável, para não
        prometer o que não cumpre. Quando existir uma forma de identificar
        desenho, este botão vira um link filtrado e sai do estado desabilitado.
      -->
      <button class="btn capa__botao" type="button" disabled title="Ainda não filtra nada">
        Rabiscos
      </button>
    </div>
  </section>
</template>

<style scoped>
.capa {
  display: grid;
  gap: clamp(1.5rem, 5vw, 2.5rem);
  margin-bottom: clamp(2.5rem, 8vw, 4rem);
}

/**
 * O painel é o `.card` que já existe no site, com três ajustes.
 *
 * A preferência foi reusar em vez de criar um segundo componente de painel: dois
 * jeitos de desenhar a mesma caixa é exatamente o tipo de duplicação que este
 * projeto vem removendo. O que muda aqui é só o que é próprio de uma capa —
 * painel maior, sem borda e com cantos mais arredondados.
 */
.capa__painel {
  margin: 0;
  border: 0;
  border-radius: clamp(1.5rem, 4vw, 2.25rem);
  padding: clamp(1.5rem, 5vw, 2.75rem);
}

.capa__texto {
  margin: 0;
  font-size: clamp(1rem, 1.6vw, 1.15rem);
}

.capa__acoes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(0.75rem, 3vw, 1.5rem);
}

/**
 * Os dois botões são grandes e usam a fonte do elenco, como no mockup.
 *
 * Sobre `.btn` e não sobre um componente: a classe já é o sistema de botões do
 * site, usado na busca e no painel. Transformá-la num componente no meio do
 * caminho criaria dois sistemas de botão convivendo, que é pior do que o
 * incômodo de escrever duas classes aqui.
 */
.capa__botao {
  font-family: var(--font-cast);
  font-size: clamp(1.05rem, 2.6vw, 1.3rem);
  padding: 0.9rem clamp(1.75rem, 5vw, 2.75rem);
  border-radius: var(--radius-lg);
}
</style>
