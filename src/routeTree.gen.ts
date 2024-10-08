/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const TimeLockLazyImport = createFileRoute('/time-lock')()
const SpendingBudgetLazyImport = createFileRoute('/spending-budget')()
const ScriptLazyImport = createFileRoute('/script')()
const PredicateLazyImport = createFileRoute('/predicate')()
const OverviewLazyImport = createFileRoute('/overview')()
const FaucetLazyImport = createFileRoute('/faucet')()
const ConditionalReleaseLazyImport = createFileRoute('/conditional-release')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const TimeLockLazyRoute = TimeLockLazyImport.update({
  path: '/time-lock',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/time-lock.lazy').then((d) => d.Route))

const SpendingBudgetLazyRoute = SpendingBudgetLazyImport.update({
  path: '/spending-budget',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/spending-budget.lazy').then((d) => d.Route),
)

const ScriptLazyRoute = ScriptLazyImport.update({
  path: '/script',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/script.lazy').then((d) => d.Route))

const PredicateLazyRoute = PredicateLazyImport.update({
  path: '/predicate',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/predicate.lazy').then((d) => d.Route))

const OverviewLazyRoute = OverviewLazyImport.update({
  path: '/overview',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/overview.lazy').then((d) => d.Route))

const FaucetLazyRoute = FaucetLazyImport.update({
  path: '/faucet',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/faucet.lazy').then((d) => d.Route))

const ConditionalReleaseLazyRoute = ConditionalReleaseLazyImport.update({
  path: '/conditional-release',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/conditional-release.lazy').then((d) => d.Route),
)

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/conditional-release': {
      id: '/conditional-release'
      path: '/conditional-release'
      fullPath: '/conditional-release'
      preLoaderRoute: typeof ConditionalReleaseLazyImport
      parentRoute: typeof rootRoute
    }
    '/faucet': {
      id: '/faucet'
      path: '/faucet'
      fullPath: '/faucet'
      preLoaderRoute: typeof FaucetLazyImport
      parentRoute: typeof rootRoute
    }
    '/overview': {
      id: '/overview'
      path: '/overview'
      fullPath: '/overview'
      preLoaderRoute: typeof OverviewLazyImport
      parentRoute: typeof rootRoute
    }
    '/predicate': {
      id: '/predicate'
      path: '/predicate'
      fullPath: '/predicate'
      preLoaderRoute: typeof PredicateLazyImport
      parentRoute: typeof rootRoute
    }
    '/script': {
      id: '/script'
      path: '/script'
      fullPath: '/script'
      preLoaderRoute: typeof ScriptLazyImport
      parentRoute: typeof rootRoute
    }
    '/spending-budget': {
      id: '/spending-budget'
      path: '/spending-budget'
      fullPath: '/spending-budget'
      preLoaderRoute: typeof SpendingBudgetLazyImport
      parentRoute: typeof rootRoute
    }
    '/time-lock': {
      id: '/time-lock'
      path: '/time-lock'
      fullPath: '/time-lock'
      preLoaderRoute: typeof TimeLockLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/conditional-release': typeof ConditionalReleaseLazyRoute
  '/faucet': typeof FaucetLazyRoute
  '/overview': typeof OverviewLazyRoute
  '/predicate': typeof PredicateLazyRoute
  '/script': typeof ScriptLazyRoute
  '/spending-budget': typeof SpendingBudgetLazyRoute
  '/time-lock': typeof TimeLockLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/conditional-release': typeof ConditionalReleaseLazyRoute
  '/faucet': typeof FaucetLazyRoute
  '/overview': typeof OverviewLazyRoute
  '/predicate': typeof PredicateLazyRoute
  '/script': typeof ScriptLazyRoute
  '/spending-budget': typeof SpendingBudgetLazyRoute
  '/time-lock': typeof TimeLockLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/conditional-release': typeof ConditionalReleaseLazyRoute
  '/faucet': typeof FaucetLazyRoute
  '/overview': typeof OverviewLazyRoute
  '/predicate': typeof PredicateLazyRoute
  '/script': typeof ScriptLazyRoute
  '/spending-budget': typeof SpendingBudgetLazyRoute
  '/time-lock': typeof TimeLockLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/conditional-release'
    | '/faucet'
    | '/overview'
    | '/predicate'
    | '/script'
    | '/spending-budget'
    | '/time-lock'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/conditional-release'
    | '/faucet'
    | '/overview'
    | '/predicate'
    | '/script'
    | '/spending-budget'
    | '/time-lock'
  id:
    | '__root__'
    | '/'
    | '/conditional-release'
    | '/faucet'
    | '/overview'
    | '/predicate'
    | '/script'
    | '/spending-budget'
    | '/time-lock'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  ConditionalReleaseLazyRoute: typeof ConditionalReleaseLazyRoute
  FaucetLazyRoute: typeof FaucetLazyRoute
  OverviewLazyRoute: typeof OverviewLazyRoute
  PredicateLazyRoute: typeof PredicateLazyRoute
  ScriptLazyRoute: typeof ScriptLazyRoute
  SpendingBudgetLazyRoute: typeof SpendingBudgetLazyRoute
  TimeLockLazyRoute: typeof TimeLockLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  ConditionalReleaseLazyRoute: ConditionalReleaseLazyRoute,
  FaucetLazyRoute: FaucetLazyRoute,
  OverviewLazyRoute: OverviewLazyRoute,
  PredicateLazyRoute: PredicateLazyRoute,
  ScriptLazyRoute: ScriptLazyRoute,
  SpendingBudgetLazyRoute: SpendingBudgetLazyRoute,
  TimeLockLazyRoute: TimeLockLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/conditional-release",
        "/faucet",
        "/overview",
        "/predicate",
        "/script",
        "/spending-budget",
        "/time-lock"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/conditional-release": {
      "filePath": "conditional-release.lazy.tsx"
    },
    "/faucet": {
      "filePath": "faucet.lazy.tsx"
    },
    "/overview": {
      "filePath": "overview.lazy.tsx"
    },
    "/predicate": {
      "filePath": "predicate.lazy.tsx"
    },
    "/script": {
      "filePath": "script.lazy.tsx"
    },
    "/spending-budget": {
      "filePath": "spending-budget.lazy.tsx"
    },
    "/time-lock": {
      "filePath": "time-lock.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
