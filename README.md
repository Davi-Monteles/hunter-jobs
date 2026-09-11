# Hunter Jobs — edição pública sanitizada

Ferramenta em Node.js e TypeScript para pesquisar, normalizar, pontuar e organizar oportunidades de trabalho antes da revisão humana.

Este repositório é uma edição de portfólio criada a partir de uma ferramenta interna funcional. Nenhuma vaga real, candidatura, sessão de navegador, currículo ou informação pessoal foi incluída.

## Problema

A busca por vagas em várias fontes gera informações inconsistentes, resultados duplicados e decisões repetitivas. Também é fácil perder tempo com oportunidades incompatíveis por senioridade, modalidade ou idioma.

## Solução

O Hunter Jobs organiza o processo em quatro etapas:

1. descoberta e importação de oportunidades;
2. normalização para um formato comum;
3. scoring baseado em perfil e regras explícitas;
4. dashboard para revisão humana.

A edição pública usa somente exemplos sintéticos. As empresas, vagas, URLs e pontuações de demonstração são fictícias.

Ausência de requisito de idioma não é tratada como prova de que português é suficiente; itens sem evidência ficam para revisão.

## Arquitetura

```text
examples/opportunities.synthetic.json
                │
                ▼
        validação sintética
                │
                ▼
        motor de scoring
                │
        ┌───────┴────────┐
        ▼                ▼
 data/opportunities.json  dashboard web
```

## Pipeline de descoberta e scoring

Na ferramenta privada, coletores e automações podem reunir oportunidades de fontes diferentes. Esses coletores, sessões e dados reais não fazem parte deste repositório.

A edição pública demonstra o núcleo genérico:

- competências compatíveis;
- senioridade;
- modalidade remota, híbrida ou presencial;
- país e tipo de contratação;
- exigência de idioma;
- recência da publicação;
- hard blockers para sênior, presencial e inglês fluente obrigatório.

O resultado é classificado em Tier A, B, C ou Rejected. Toda oportunidade não rejeitada permanece marcada para revisão humana.

## Dashboard

O dashboard apresenta:

- score e tier;
- empresa e título;
- competências correspondentes;
- motivos da pontuação;
- filtros por classificação.

A interface exibe um aviso permanente informando que os registros são sintéticos.

## Automação e LLM

`src/llm.ts` implementa um adaptador opcional para APIs compatíveis com o formato OpenAI. Ele pode gerar resumos sem inventar requisitos ou experiência.

Nenhuma credencial está incluída. Sem configuração, o pipeline de scoring e o dashboard funcionam normalmente sem LLM.

## Dados sintéticos

Os quatro registros em `examples/opportunities.synthetic.json` foram escritos exclusivamente para demonstração:

- empresas fictícias;
- URLs no domínio reservado `example.invalid`;
- nenhuma vaga ou candidatura real;
- campo obrigatório `synthetic: true`.

O comando de demonstração recusa registros que não estejam explicitamente marcados como sintéticos.

## Privacidade

Não fazem parte da edição pública:

- `.env` ou chaves de API;
- dados reais de oportunidades;
- histórico de candidaturas;
- currículos;
- cookies, sessões ou perfis de navegador;
- relatórios pessoais;
- contatos, e-mails ou telefones;
- logs de uso.

A pasta `data/` é ignorada pelo Git e contém apenas saída gerada localmente.

## Como executar

### Requisitos

- Node.js 20 ou superior;
- npm.

### Instalação e validação

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
```

### Gerar o resultado sintético

```bash
npm run demo
```

### Abrir o dashboard

```bash
npm run serve
```

Acesse `http://localhost:7878`.

## Configuração opcional de LLM

Copie `.env.example` para `.env` e preencha localmente, sem versionar:

```dotenv
LLM_BASE_URL=
LLM_API_KEY=
LLM_MODEL=
PORT=7878
```

## Limitações

- Os coletores reais não são publicados.
- O dashboard público não envia candidaturas.
- O scoring é explicável, mas não substitui leitura integral da vaga.
- Resumos por LLM exigem revisão humana.
- Esta edição não contém integração com plataformas reais.

## Segurança

Antes de cada publicação, o repositório deve passar por busca de segredos, caminhos locais e dados pessoais. `.env`, `data/`, logs e artefatos de navegador permanecem ignorados.

## Autor

Davi Monteles — Desenvolvedor Júnior | IA Aplicada, Automação e Integrações

- Portfólio: https://davimonteles.vercel.app/pt
- GitHub: https://github.com/Davi-Monteles
- LinkedIn: https://www.linkedin.com/in/davi-monteles-9888333a8/
