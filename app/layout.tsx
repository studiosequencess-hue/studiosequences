import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({
    variable: '--font-inter',
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Studio Sequences",
    description: "Studio Sequences",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${inter.className} antialiased relative`}
        >
        <Header/>
        <main className={"h-full w-full flex-grow flex flex-col"}>
            {children}
        </main>
        <Footer/>
        </body>
        </html>
    );
}
