import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/shell/providers';
export const metadata: Metadata = {
  title: { default: 'Trading workspace', template: '%s · Trading workspace' },
  description: 'A trading journal workspace. Demo data, no broker connected.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
