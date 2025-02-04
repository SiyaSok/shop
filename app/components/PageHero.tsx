/** @format */
"use client";
import CoverIamge from "@/public/images/herocover.webp";
import { usePathname } from "next/navigation";
import { MdArrowForwardIos } from "react-icons/md";

function toSentenceCase(str: string): string {
  if (!str) return ""; // Handle empty string

  return str
    .split("/") // Split by slashes to separate path segments
    .map((segment) => {
      if (!segment) return ""; // Handle empty segments

      return segment
        .split(" ") // Split each segment by spaces (if needed)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ) // Capitalize first letter of each word
        .join(" "); // Join words back with spaces
    })
    .filter((segment) => segment !== "") // Remove empty path segments that might result from consecutive slashes
    .join("/"); // Join segments back with slashes
}
const PageHero = () => {
  const pathname = usePathname();

  const sentenceCasePath = toSentenceCase(
    pathname.startsWith("/") ? pathname.substring(1) : pathname
  ); // Remove leading slash first

  return (
    <section
      className='relative h-[200px] md:h-[400px] bg-cover bg-center '
      style={{ backgroundImage: `url(${CoverIamge.src})` }}>
      <div>
        <div className=''>
          <div className='absolute top-0 left-0 w-full h-full  flex items-center justify-center'>
            <div className='text-center text-black'>
              <h1 className='text-2xl md:text-6xl font-semibold mb-4 text-black'>
                {sentenceCasePath}
              </h1>
              <p className='text-lg md:text-xl mb-8 flex items-center justify-center gap-4'>
                <span className='font-semibold'>Home</span>{" "}
                <MdArrowForwardIos /> {sentenceCasePath}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
