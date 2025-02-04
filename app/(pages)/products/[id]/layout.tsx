/** @format */

import PageHero from "@/app/components/PageHero";

export const metadata = {
  // No need for the type here, it's inferred
  title: "Products Page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-grow'>{children}</main>
    </div>
  );
}
