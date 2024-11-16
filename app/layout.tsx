"use client"

import { Kanit } from 'next/font/google'
import "./globals.css";
import {NextUIProvider} from "@nextui-org/react";
import Head from "next/head";

const kanit = Kanit({ subsets: ['latin', 'thai'], weight: ["100", "200", "300", "400", "500", "600", "700"]  })

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
      <html lang="en">
        <Head>
            <title>Inventory Management System Provider</title>
        </Head>
        <body className={`${kanit.className}`}>
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </body>
      </html>
  );
}
