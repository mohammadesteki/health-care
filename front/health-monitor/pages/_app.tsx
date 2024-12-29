import {QueryClient, QueryClientProvider} from 'react-query';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AppCacheProvider } from '@mui/material-nextjs/v15-pagesRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
      weight: ['300', '400', '500', '700'],
      subsets: ['latin'],
      display: 'swap',
      variable: '--font-roboto',
    });

const theme = createTheme({
    // @ts-ignore
    cssVariables: true,
    typography: {
    fontFamily: 'var(--font-roboto)',
    },
});


const defaultOptions = {
  queries: {
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retryOnMount: false,
  },
};

const defaultQueryClient = new QueryClient({
  defaultOptions: defaultOptions,
});

function MyApp({ Component, pageProps }: AppProps) {
  return <QueryClientProvider client={defaultQueryClient} contextSharing>
     <AppCacheProvider {...pageProps}>
       <ThemeProvider theme={theme}>
         <main className={roboto.variable} id="__main">
           <Component {...pageProps} />
         </main>
       </ThemeProvider>
     </AppCacheProvider>
  </QueryClientProvider>
}

export default MyApp
