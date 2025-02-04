/** @format */

import Image from "next/image";
import Link from "next/link";
import Dining from "@/public/images/Dining.webp";
import Living from "@/public/images/living.webp";
import Bedroom from "@/public/images/Bedroom.webp";
const Range = () => {
  return (
    <div className='container mx-auto p-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {" "}
        {/* 3-column grid */}
        {/* Bedroom Column */}
        <div className='bg-white rounded-lg text-center overflow-hidden relative'>
          <Link href={`products?679cff65631f81325321d555`}>
            <Image
              src={Dining.src}
              alt='Dining'
              width={500}
              height={300}
              className='object-cover rounded-t-lg mb-2'
            />
            <div className='p-4'>
              <h2 className='text-xl font-bold mb-2'>Dining</h2>
            </div>
          </Link>
        </div>
        {/* Living Room Column */}
        <div className='bg-white rounded-lg text-center overflow-hidden relative'>
          <Link href={`products?679cff78631f81325321d557`}>
            <Image
              src={Living.src}
              alt='Living'
              width={500}
              height={300}
              className='object-cover rounded-t-lg mb-2'
            />
            <div className='p-4'>
              <h2 className='text-xl font-bold mb-2'>Living Room</h2>
            </div>
          </Link>
        </div>
        {/* Dining Room Column */}
        <div className='bg-white rounded-lg text-center overflow-hidden relative'>
          <Link href={`products?679cff65631f81325321d555`}>
            <Image
              src={Bedroom}
              alt='Bedroom'
              width={500}
              height={300}
              className='object-cover rounded-t-lg mb-2'
            />
            <div className='p-4'>
              <h2 className='text-xl font-bold mb-2'>Bedroom</h2>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Range;

// app/page.tsx (or wherever you want the 3-column section)
