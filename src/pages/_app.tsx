import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import {
  Hydrate,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    queryCache: new QueryCache({
      onError: (error: any) =>
        console.log(`Unexpected Error: ${error.message}`),
    }),
    defaultOptions: {
      queries: {
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      }
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
