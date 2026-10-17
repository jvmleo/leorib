# leorib

Portfólio e site da **leorib**, marca de Leonardo Ribeiro: planilhas, automações e sites para pequenos negócios.

> Status: versão estática exportada do Claude Design (HTML + CSS + JS). Migração para React + Vite planejada.

## Páginas

| Arquivo | Página |
| --- | --- |
| `index.html` | Início: hero, sobre, serviços, cases e contato |
| `servicos.html` | Serviços: planilhas, automações e web, com etapas de trabalho |
| `sobre.html` | Sobre: história, caminho, princípios e trilha da quinzena |
| `case-padaria-grao-fino.html` | Case 01 completo (modelo para os próximos cases) |

## Estrutura de pastas

```
leorib/
├── index.html
├── servicos.html
├── sobre.html
├── case-padaria-grao-fino.html
├── css/        estilos globais (tokens, componentes, páginas)
├── js/         digital.js (símbolo <leo-digital>) e site.js (menu, animações, formulário)
├── assets/     imagens (retrato, prints dos cases)
└── _design/    arquivos de origem do Claude Design (referência)
```

## Design system (resumo)

Conceito **Ateliê**: minimalismo quente, materialidade (papel, gesso, concreto) e verde como cor da marca.

- **Cores base:** Papel `#F3F0E6`, Gesso `#E6E2D6`, Sálvia `#D3DCC8`, Tinta `#22261F`, Musgo `#3F4F3A`, Grafite `#575A50`, Argila `#9A4F33`, Concreto `#B9B5AA` (só decorativo)
- **Materiais dos serviços:** seixo (planilhas) → musgo (automações) → folha (web)
- **Fontes:** Fraunces (títulos), Atkinson Hyperlegible Next (texto), Atkinson Hyperlegible Mono (labels)
- **Grid:** 12 colunas no desktop, 8 no tablet, 4 no mobile; espaçamento em múltiplos de 8
- **Acessibilidade:** texto com no mínimo 18px, contraste AA/AAA, foco visível, `prefers-reduced-motion`, link "Pular para o conteúdo"

Documentação completa: documento "leorib — Documentação do Design System e do Portfólio" no Claude.

## Como rodar localmente

Versão atual (estática): abra o `index.html` no navegador ou use a extensão **Live Server** do VS Code (botão "Go Live").

## Versionamento

- `main`: versão publicada (deploy automático na Vercel)
- Branches de trabalho: `feat/nome-da-tarefa` (ex.: `feat/react-vite`, `feat/case-02`)
- Mensagens de commit no formato `tipo: descrição`:
  - `feat:` nova funcionalidade ou página
  - `fix:` correção
  - `style:` ajuste visual
  - `docs:` documentação
  - `chore:` configuração e manutenção

## Pendências antes de divulgar

- [ ] Substituir os cases de exemplo (Padaria Grão Fino, Auto Center Vila Nova, Floricultura Jardim Alto) por cases reais e autorizados
- [ ] Trocar os prints de exemplo por prints reais (com dados sensíveis ocultos)
- [ ] Definir preços dos serviços
- [ ] Confirmar e-mail e WhatsApp reais no contato
- [ ] Preencher a trilha da quinzena e a capa do álbum
- [ ] Migrar para React + Vite
- [ ] Publicar na Vercel e configurar domínio
