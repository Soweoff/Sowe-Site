# Sowe Studio — Site

Site do **Sowe Studio**: vitrine pública (serviços, portfólio, canais do YouTube, CS2 e produtos digitais) e área logada com o painel de agendamentos. Feito com React + TypeScript + Vite e conectado à [Sowe API](https://github.com/Soweoff/sowe-backend).

[![CI](https://github.com/Soweoff/Sowe-Site/actions/workflows/ci.yml/badge.svg)](https://github.com/Soweoff/Sowe-Site/actions/workflows/ci.yml)

Produção: <https://sowestudio.com.br>

## Páginas

| Rota | Página | Acesso |
|---|---|---|
| `/` | Home: serviços e últimos trabalhos (com painel 3D do Spline) | Público |
| `/portfolio` | Portfólio com filtros (vídeos/VFX e sites); os projetos ficam em `src/data/projects.ts` | Público |
| `/youtube` | Canais do YouTube com inscritos e visualizações | Público |
| `/edition` | Edição, VFX e 3D: estilos, softwares e equipamentos | Público |
| `/cs2` | Conteúdo de CS2, parceiros e cupons | Público |
| `/products` | Cursos e produtos digitais (compra em links externos) | Público |
| `/websites` | Sites desenvolvidos | Público |
| `/login` · `/register` | Entrar e criar conta | Público |
| `/dashboard` | Planejamento de entregas (calendário somente leitura) | Usuário logado |
| `/admin/metrics` | Métricas dos canais do YouTube (totais e períodos de 30/90/365 dias) | Somente `ADMIN` |
| `/admin` | Painel do administrador: agendamentos e usuários | Somente `ADMIN` |

## Como a autenticação funciona

1. `Login.tsx` envia e-mail e senha para `POST /v1/auth/login`.
2. A API devolve um token JWT; o `AuthContext` guarda no `localStorage` e decodifica o papel (`USER` ou `ADMIN`).
3. O interceptor do Axios (`src/services/api.ts`) envia `Authorization: Bearer <token>` em todas as requisições. Se a API responder 401, a sessão é encerrada e o usuário volta ao login.
4. O `ProtectedRoute` bloqueia as rotas privadas no navegador (e `/admin` exige `ADMIN`).

> O bloqueio do site é só de interface. A segurança de verdade está na API, que confere o token e o papel em cada requisição.

## Rodando localmente

Pré-requisito: Node.js 22+.

```bash
npm install
echo "VITE_API_URL=http://localhost:3000" > .env
npm run dev                 # http://localhost:5173
```

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da Sowe API (sem barra no final). Sem ela, usa `http://localhost:3000`. |

O arquivo `.env` não vai para o GitHub.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Verifica os tipos (`tsc`) e gera a versão de produção em `dist/` |
| `npm run preview` | Serve a versão de produção localmente |
| `npm run lint` | ESLint |

## Stack

React 19 · TypeScript · Vite · React Router · Axios · FullCalendar (com `rrule`) · Spline · Vercel Analytics e Speed Insights.

## Deploy

Hospedado na **Vercel**, com deploy automático a cada push na `main` e *preview* para cada branch. O `vercel.json` redireciona todas as rotas para `index.html` (necessário para o React Router). Defina `VITE_API_URL` nas variáveis de ambiente do projeto na Vercel.

A API aceita requisições apenas dos domínios listados no CORS dela (`CORS_ORIGINS`); ao usar outro domínio ou o link de *preview*, inclua-o lá.

## Integração contínua

O workflow `.github/workflows/ci.yml` instala as dependências, roda o lint e faz o build a cada push e pull request.

## Estrutura

```
src/
  pages/        uma página por rota
  data/         projects.ts: lista editável do portfólio
  components/   layout e elementos compartilhados
  context/      AuthContext (sessão e papel do usuário)
  routes/       ProtectedRoute
  services/     api.ts (Axios) e errors.ts (mensagens de erro)
  styles/       CSS global
```

## Observações

- As estatísticas do YouTube vêm de um Google Apps Script, consultado direto pelo navegador (não passam pela Sowe API).
- Os pagamentos dos cursos e produtos acontecem em links externos (Hotmart); o site não processa pagamentos.
