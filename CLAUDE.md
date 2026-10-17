# CLAUDE.md — leorib

Guia para trabalhar neste repositório. Em caso de dúvida, `css/styles.css` é a fonte de verdade dos tokens; o README resume, mas pode divergir.

## Visão geral

Site/portfólio da **leorib**, marca de Leonardo Ribeiro: planilhas, automações e sites para pequenos negócios. Idioma do conteúdo: **pt-BR** (`<html lang="pt-BR">`).

- Hoje: HTML + CSS + JS **estáticos**, sem build, sem dependências, exportados do Claude Design.
- Versionado no GitHub; `main` é publicada automaticamente na Vercel.
- Planejado: migração para React + Vite (branch `feat/react-vite`). Até lá, não introduzir bundler, framework ou npm.
- Conceito visual **Ateliê**: minimalismo quente, materialidade (papel, gesso, concreto) e verde como cor da marca. Metáfora dos serviços: **seixo → musgo → folha** (planilhas → automações → web).
- Pendências de conteúdo antes de divulgar estão no README (cases reais, prints, preços, contatos reais). Os cases atuais, e-mail `oi@leorib.com.br` e WhatsApp `(11) 90000-0000` são placeholders.

## Estrutura de pastas

```
/
├── index.html                    Início: hero, sobre, serviços, cases, contato
├── servicos.html                 Serviços e etapas de trabalho
├── sobre.html                    História, caminho, princípios, trilha da quinzena
├── case-padaria-grao-fino.html   Case 01 completo (modelo para os próximos cases)
├── css/styles.css                Único CSS: tokens, base, componentes, páginas, motion
├── js/
│   ├── digital.js                Web component <leo-digital> (símbolo: anéis de tronco gerados por seed)
│   └── site.js                   Texturas SVG, animações de entrada, menu mobile, formulário, player, retrato
├── assets/                       Imagens (leo.jpeg etc.)
├── _design/                      Arquivos de origem do Claude Design (referência; não publicar/editar)
├── README.md
└── CLAUDE.md
```

Cada página carrega: Google Fonts → `css/styles.css` → `<script>` inline que adiciona a classe `js` ao `<html>` → `js/digital.js` e `js/site.js` com `defer`.

### Convenções de código

- Sem build: o que está no repositório é o que vai ao ar. Teste abrindo o HTML (ou Live Server).
- Todo valor visual vem de **tokens** (`var(--…)`); não hardcodar cor nova. (Hoje há alguns hex fixos em superfícies sempre-verdes como `.mat-folha`, `.btn-light`, hero e contato — não replicar em código novo se existir token.)
- Modo escuro troca **só tokens** em `@media (prefers-color-scheme: dark)`, nunca layout.
- Classes em português (`.faixa`, `.servico`, `.etapa`), semântica de papel nos tokens (`--bg`, `--ink`, `--brand`, `--action`).
- Texturas são geradas em `site.js` e injetadas como custom properties (`--tx-grao`, `--tx-grao-luz`, `--tx-grao-forte`, `--tx-linho`, `--nat-seixo`, `--nat-musgo`, `--nat-folha`). Sem JS valem `none` e o gradiente continua válido.
- Animações de entrada via atributos `data-reveal`, `data-line`, `data-strip`, `data-orb` (+ `data-delay` em ms); o `IntersectionObserver` adiciona `.in`.
- Novos cases: copiar `case-padaria-grao-fino.html`. Novo componente de página: CSS na seção correspondente de `styles.css`.

## Design system — tokens

### Cores (modo claro)

| Token | Valor | Uso |
| --- | --- | --- |
| `--papel` | `#F3F0E6` | Fundo da página |
| `--gesso` | `#E6E2D6` | Superfícies, hover de nav |
| `--salvia` | `#D6E3C3` | Tags, hover secundário |
| `--tinta` | `#22261F` | Texto principal |
| `--folha` | `#2B5633` | Marca, ação primária, foco |
| `--grafite` | `#575A50` | Texto secundário (`--muted`) |
| `--argila` | `#9A4F33` | Acento, erro |
| `--folha-media` | `#5E8A4E` | Gradientes/decoração |
| `--broto` | `#8DB06E` | Gradientes, material musgo |
| `--concreto` | `#B9B5AA` | Linhas e divisores — **só decorativo**, nunca texto |

> O README lista Sálvia `#D3DCC8` e "Musgo `#3F4F3A`"; o CSS usa `#D6E3C3` e não tem token `--musgo` (o "musgo" é o material `.mat-musgo`, `#8DB06E`). Vale o CSS; atualizar o README quando mexer nisso.

**Papéis semânticos** (usar estes no código, não as cores cruas): `--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--line-strong`, `--brand`, `--accent`, `--action`/`--on-action`, `--action-hover`/`--on-action-hover`, `--tag-*`, `--field-*`, `--form-*`, `--frame-bg`, `--focus`, `--error`, `--logo`/`--logo-seed`.

**Modo escuro** (`prefers-color-scheme: dark`): fundo `#151A15`, superfície `#1E251E`, texto `#ECE8DC`, muted `#A9AD9F`, marca/ação `#A9C98A`, acento/erro `#D08A68`, linha `#3A433A`.

**Materiais dos serviços**: `.mat-seixo` (`#B3AEA1`, texto escuro), `.mat-musgo` (`#8DB06E`, texto escuro), `.mat-folha` (`#2B5633`, texto claro).

### Fontes

| Token | Família | Uso |
| --- | --- | --- |
| `--serif` | Fraunces (`'SOFT' 100`, pesos 400/500) | Títulos, números de destaque |
| `--sans` | Atkinson Hyperlegible Next (400/500/700) | Texto corrido |
| `--mono` | Atkinson Hyperlegible Mono (400/500) | Labels, legendas, metadados |

Escala: corpo `1.125rem` (18px), `line-height: 1.6`. `.lead` `clamp(1.25rem…1.5rem)`. `.h1` `clamp(2.75rem…5rem)`, `.h2` `clamp(2rem…3.5rem)`, `.h3` `clamp(1.5rem…2.125rem)`. Labels mono em caixa-alta com `letter-spacing: .08em`. Usar `text-wrap: balance` em títulos.

### Grid e espaçamento

- Container `.wrap` (padding lateral `--m`) e `.inset` (padding `--inset`), ambos `max-width: 1280px`.
- Colunas: **12** no desktop, **8** até 1023px, **4** até 639px. Gutter `--gutter: 24px` (16px no mobile).
- Margem lateral `--m`: 64px → 40px (≤1023) → 20px (≤639). `--inset`: 24px → 12px (≤639).
- Posicionamento recorrente: `.c-label` (col. 1–3), `.c-main` (5–12), `.c-main7` (5–11), `.c-wide` (4–12); no tablet/mobile colapsam.
- Espaçamento em **múltiplos de 8** (4 só para microajustes). Seções verticais usam 48/64/80/96/112px.
- Raios: pílulas `999px`, cards `16–20px`, painéis grandes `28px` (20px no mobile).
- Breakpoints: 1023, 860 (nav → menu mobile), 760, 639.
- Motion: `--ease: cubic-bezier(.2, .7, .2, 1)`; transições de 0.25–1.1s.

## Acessibilidade (regras obrigatórias)

1. **Texto mínimo de 18px (1.125rem)** para conteúdo lido. Não reduzir o corpo. Exceção restrita a metadados não essenciais em fonte mono (labels, legendas, tags), nunca abaixo do que já existe (`.875rem` é o piso atual) e nunca para informação que só aparece ali.
2. **Contraste**: mínimo **AA** (4.5:1 texto normal, 3:1 texto grande e componentes de UI); buscar **AAA** (7:1) em texto corrido (`--ink` sobre `--bg` já atende). Verificar **os dois modos** (claro e escuro) ao criar ou alterar qualquer cor. `--concreto` nunca é cor de texto.
3. **Foco visível**: `:focus-visible { outline: 3px solid var(--focus); outline-offset: 3px }`. Nunca `outline: none` sem substituto equivalente. Em fundos verdes usar `outline-color: #D6E3C3` (já feito em `.contato`, `.painel-folha`, `.player`).
4. **`prefers-reduced-motion`**: todo movimento novo deve estar dentro de `@media (prefers-reduced-motion: no-preference)` ou ser neutralizado no bloco `reduce`. Conteúdo **nunca** pode depender de animação para aparecer: o estado escondido (`[data-reveal]:not(.in)`) só vale com classe `.js` + `no-preference`. O `<leo-digital>` e o `site.js` já respeitam a preferência.
5. **Textura nunca atrás de texto**: grão, linho, seixo, musgo, folha e meio-tom são decoração de áreas **sem texto**, ou o texto fica sobre uma camada lisa (cor sólida/card). Nunca colocar `--tx-*`/`--nat-*` como fundo direto de um bloco que contém texto sem uma superfície lisa entre os dois.
   - *Dívida atual*: hero, `.contato`, `.kpi-painel`, `.player`, `.painel-folha` e `.mobile-menu` aplicam `--tx-grao-luz`/`--tx-grao` sobre fundo verde com texto por cima. Ao mexer nesses blocos, mover a textura para uma camada sem texto (pseudo-elemento `z-index: -1` com máscara, como `.orb`) ou removê-la.
6. **Semântica e teclado**: landmarks (`header`, `nav` com `aria-label`, `main#conteudo`, `footer`); link "Pular para o conteúdo" (`.skip`) em toda página; um `h1` por página; seções com `aria-labelledby`; `aria-current="page"` na navegação; decoração com `aria-hidden="true"`; menu mobile com `aria-expanded`/`aria-controls`, foco movido ao abrir/fechar e `Esc` para fechar; formulário com `<label>` real, `aria-invalid` e mensagens de erro visíveis.
7. **Alvos de toque**: mínimo 44px de altura (botões atuais: 44–56px).
8. **Imagens**: `alt` descritivo em imagens de conteúdo (retrato); `alt=""`/`aria-hidden` em decorativas. Não transmitir informação só por cor.

## Convenção de commits

Formato: `tipo: descrição` — em português, minúsculas, imperativo/presente, sem ponto final, ~70 caracteres.

| Tipo | Quando |
| --- | --- |
| `feat:` | Nova funcionalidade, página ou seção |
| `fix:` | Correção de bug (layout quebrado, link, contraste, foco…) |
| `style:` | Ajuste visual sem mudar comportamento (cores, espaçamento, tipografia) |
| `docs:` | README, CLAUDE.md e demais documentos |
| `chore:` | Configuração e manutenção (.gitignore, estrutura de pastas, deploy) |

Exemplos: `feat: adiciona case 02 do auto center`, `fix: corrige foco do menu mobile`, `style: aumenta respiro entre seções`.

Fluxo: `main` = versão publicada (deploy automático na Vercel). Trabalho em branches `feat/nome-da-tarefa`; um commit = uma mudança lógica. Não commitar sem pedido explícito.

## Verificação

- Depois de qualquer mudança visual, verificar com o Playwright em 375px, 768px e 1280px, nos modos claro e escuro.
- Ao criar ou alterar cor, calcular o contraste e registrar no PR/commit.

## Como trabalhar comigo

- Sou estudante de Web Design e estou aprendendo HTML, CSS, JS e React: ao fazer uma mudança, explique em poucas linhas, em português, o que foi alterado e por quê.
- Mudanças grandes: proponha um plano antes de editar.
- Arquivos `.gitignore`, `.vercelignore` e `CLAUDE.local.md` existem na raiz; `CLAUDE.md`, `README.md` e `_design/` não vão para o site publicado.