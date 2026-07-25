import '../index.css';
import Providers from './providers';
import AppShell from '../components/AppShell';

export const metadata = {
  title: 'NT Exams',
  description: 'Exam preparation app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
