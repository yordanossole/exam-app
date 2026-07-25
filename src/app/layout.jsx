import '../index.css';
import Providers from './providers';

export const metadata = {
  title: 'NT Exams',
  description: 'Exam preparation app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
