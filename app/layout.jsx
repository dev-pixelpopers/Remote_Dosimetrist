import './globals.css'
import PreloaderProvider from '@/components/PreloaderContext'
import Preloader from '@/components/Preloader'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DeferredPopup from '@/components/DeferredPopup'
import HashScrollAnchor from '@/components/HashScrollAnchor'
import Script from "next/script";
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  preload: true,
  adjustFontFallback: true,
  weight: ['400', '500', '600', '700', '800', '900'],
})

const schema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Remote Dosimetrist",
  "url": process.env.NEXT_PUBLIC_SITE_URL,
  "inLanguage": "en",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <meta name="google-site-verification" content="7_n7SeloGYX-tn3PCX6tDGelNFJxobTu6ChgyLQJC88" />
        <Script id="gtm" strategy='lazyOnload' >
          {`
    (function(w,d,s,l,i){
      w[l]=w[l]||[];
      w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),
      dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-M5C8BSRH');
  `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TD9VV5JEXC"
          strategy='lazyOnload'
        />

        <Script id="ga4-init" strategy='lazyOnload' >
          {`
     window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-TD9VV5JEXC');
  `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.classList.add(sessionStorage.getItem('preloaderShown')==='true'?'preloader-done':'preloader-active')}catch(e){}`,
          }}
        />
        <noscript>
          <style>{`#site-preloader{display:none}`}</style>
        </noscript>
      </head>
      <body>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M5C8BSRH"
          height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe></noscript>
        <PreloaderProvider>
          <Preloader />
          <Header />
          <DeferredPopup />
          <HashScrollAnchor />
          {children}
          <Footer />
        </PreloaderProvider>
      </body>
    </html>
  )
}
