# AUTOCONF Vehicles

SPA em Vue 3 para autenticação e gerenciamento de veículos, incluindo cadastro, edição, listagem, detalhe e upload de imagens.

## Stack

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia
- @tanstack/vue-query
- Axios
- shadcn-vue
- Tailwind CSS

## Requisitos

- Node.js 20+
- npm ou pnpm

## Instalação

```bash
pnpm install
```

## Variáveis de ambiente

Crie um arquivo `.env` com base no `.env.example`:
```env 
VITE_API_BASE_URL=http://localhost:8000/api 
VITE_BACKEND_BASE_URL=http://localhost:8000
```
## Rodando em desenvolvimento
```bash
pnpm dev
```

## Build de produção
```bash
pnpm build
``` 

## Lint
```bash
pnpm lint
``` 

## Testes

### Unitários
```bash
pnpm test:unit
```

### E2E
```bash
pnpm test:e2e
``` 

## Funcionalidades entregues

- Login
- Registro
- Guards de rota
- Lista de veículos com:
  - paginação
  - busca
  - filtros
  - ordenação
- Cadastro de veículo
- Edição de veículo
- Detalhe do veículo
- Upload múltiplo de imagens
- Definição de capa
- Exclusão de imagem
- Exclusão de veículo com confirmação
- Feedback visual para loading, erro e sucesso
- Layout responsivo
- Alternância de tema claro e escuro

## Estrutura
```text
src/ app/ components/ features/ auth/ vehicles/ layouts/ lib/ router/
```

## Observações

- O projeto espera que a API respeite os endpoints descritos no desafio.
- Se o backend possuir diferenças de payload, ajuste os tipos em `src/features/vehicles/types/vehicle.types.ts`.
- O client HTTP está centralizado em `src/lib/api/client.ts`.