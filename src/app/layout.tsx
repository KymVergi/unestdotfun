import type { Metadata, Viewport } from 'next';
import { Press_Start_2P, VT323 } from 'next/font/google';
import Navbar from '@/components/layout/Navbar/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import Web3Provider from '@/components/web3/Web3Provider/Web3Provider';
import { HERO_SUBHEADLINE } from '@/config/protocol';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL, X_HANDLE } from '@/config/site';
import '@/styles/globals.css';

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-press-start',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-vt323',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'UNEST',
    'EGG',
    'Uniswap v4 hooks',
    'Ethereum',
    'on-chain economy',
    'ERC-20',
    'ERC-721',
    'pixel art',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: HERO_SUBHEADLINE,
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: HERO_SUBHEADLINE,
    site: X_HANDLE,
    creator: X_HANDLE,
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#11130f',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pressStart.variable} ${vt323.variable}`}>
      <body>
        <Web3Provider>
          <a href="#main" className="visuallyHidden">
            Skip to content
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </Web3Provider>

        <div className="crtGrain" aria-hidden="true" />
        <div className="crtOverlay" aria-hidden="true" />
        <div className="crtVignette" aria-hidden="true" />
      </body>
    </html>
  );
}
