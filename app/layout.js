import "lib/globals.css"

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="min-h-screen w-full dark:bg-neutral-900 dark:text-neutral-500">
                {children}
            </body>
        </html>
    )
}
