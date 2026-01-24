# Surface & Co. E-commerce Example

A sample e-commerce app built with Next.js (App Router), React, Storybook, and a GraphQL API powered by Yoga. The backend services include product, order, and content layers with Algolia + Contentful integrations. Development mode uses local mock data so external connections are optional.

## Features
- Next.js storefront with custom UI components
- Storybook stories for key UI building blocks
- GraphQL Yoga API at `/api/graphql`
- Product service (Algolia search + fallback mock data)
- Content service (Contentful + fallback mock data)
- Order service (in-memory store for development)
- Development mode toggle to avoid external dependencies

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to view the storefront.

### Storybook

```bash
npm run storybook
```

### Tests

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

### UI Tests

```bash
npm run test:ui
```

## Development Mode

By default, development mode is enabled when `NODE_ENV` is not `production`. You can also force it on with `DEV_MODE=true` in `.env.local`.

When development mode is enabled:
- Algolia queries use local mock products
- Contentful pages use local mock content
- Orders are stored in memory

Copy `.env.example` to `.env.local` and add credentials if you want to hit the real services.

## GraphQL API

Endpoint: `POST /api/graphql`

Example query:

```graphql
query Home($slug: String!) {
  content(slug: $slug) {
    title
    blocks { id type title body imageUrl }
  }
  products {
    id
    name
    price
  }
  orders { id status total }
}
```

Example mutation:

```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    total
    status
  }
}
```

## Environment Variables

See `.env.example` for all supported keys.
