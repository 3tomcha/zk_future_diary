'use client';
import RecoilProvider from './recoilProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head />
      <body>
        <RecoilProvider>{children}</RecoilProvider>
      </body>
    </html>
  );
}