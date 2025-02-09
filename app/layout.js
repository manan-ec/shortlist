import './globals.css'
import { ShortlistProvider } from '../context/ShortlistContext';

export const metadata = {
    title: 'Shortlist renders',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <ShortlistProvider>
                    {children}
                </ShortlistProvider>
            </body>
        </html>
    );
}
