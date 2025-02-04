/** @format */

import PageHero from "@/app/components/PageHero";

export const metadata = {
  title: "Products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col min-h-screen'>
      <PageHero />
      <main className='flex-grow'>{children}</main>
    </div>
  );
}
