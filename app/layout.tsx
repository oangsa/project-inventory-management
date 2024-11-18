import { Kanit } from 'next/font/google'
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import { Providers } from './providers/providers';


const kanit = Kanit({ subsets: ['latin', 'thai'], weight: ["100", "200", "300", "400", "500", "600", "700"]  })

const fontSans = FontSans({ subsets: ['latin'], variable: "--font-mono"})

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {

  return (
    <html suppressHydrationWarning lang='en'>
      <body className={`${fontSans.className}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
