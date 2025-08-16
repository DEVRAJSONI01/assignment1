/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NHOST_SUBDOMAIN: string
  readonly VITE_NHOST_REGION: string
  readonly VITE_HASURA_GRAPHQL_ENDPOINT: string
  readonly VITE_HASURA_GRAPHQL_WS_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
