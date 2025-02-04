/** @format */
import Image from "next/image";
import Link from "next/link";

import logo from "@/public/images/Funiro.webp";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-white border-t border-grey py-4 mt-24'>
      <div className='container mx-auto flex flex-col md:flex-row items-center justify-between px-4'>
        <div className='mb-4 md:mb-0'>
          <Image src={logo} alt='Logo' className='h-8 w-auto' />
        </div>
        <div className='flex flex-wrap justify-center md:justify-start mb-4 md:mb-0'>
          <ul className='flex space-x-4'>
            <li>
              <Link href='/properties'>shop</Link>
            </li>
            <li>
              <Link href='/'>Terms of Funiro</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className='text-sm text-gray-500 mt-2 md:mt-0'>
            &copy; {currentYear} Funiro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
