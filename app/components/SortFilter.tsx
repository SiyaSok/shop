/** @format */
"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { BsFilterSquare } from "react-icons/bs";
import { FaGripHorizontal } from "react-icons/fa";
import { AiOutlinePicCenter } from "react-icons/ai";

interface Category {
  _id: string;
  title: string;
}

interface SortFilterProps {
  onLimitChange: (limit: number) => void;
  onSortChange: (sortBy: string) => void;
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
  limit: number;
  productsTotal: number;
}

const SortFilter: React.FC<SortFilterProps> = ({
  onLimitChange,
  onSortChange,
  onCategoryChange,
  selectedCategory,
  limit,
  productsTotal,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get<Category[]>("/api/categories");
        setCategories(response.data);
      } catch (err: unknown) {
        console.error("Error fetching categories:", err);
      }
    }

    fetchCategories();
  }, []);

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    onLimitChange(newLimit);
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    onSortChange(newSortBy);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    onCategoryChange(newCategory);
  };

  return (
    <div className='bg-orange-100'>
      <div className='p-4 container mx-auto flex items-center space-x-4 justify-between'>
        {/* Sorting */}
        <div className='flex items-center gap-4'>
          <div className='flex items-center'>
            <BsFilterSquare className='mr-4 text-4xl' />
            <select
              className='p-2 w-24 bg-transparent'
              value={selectedCategory}
              onChange={handleCategoryChange}>
              <option value=''>Filter</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FaGripHorizontal />
          </div>
          <div>
            <AiOutlinePicCenter />
          </div>
          <div>|</div>
          <div>{`Showing 1–${limit || 16} of ${productsTotal} results`}</div>
        </div>

        {/* Category Filter */}
        <div className='flex items-center gap-4'>
          {/* Limit Selection */}
          <div className='flex items-center gap-4'>
            <label className='block text-sm font-medium'>Show:</label>
            <select
              className='p-2 border'
              value={limit}
              onChange={handleLimitChange}>
              <option value='2'>2</option>
              <option value='4'>4</option>
              <option value='8'>8</option>
              <option value='16'>16</option>
              <option value='32'>32</option>
              <option value='64'>64</option>
              <option value='128'>128</option>
            </select>
          </div>

          {/* Sort Selection */}
          <div className='flex items-center gap-4'>
            <label className='block text-sm font-medium'>Sort By:</label>
            <select
              className='w-24 p-2'
              value={sortBy}
              onChange={handleSortByChange}>
              <option value=''>Sort By</option>
              <option value='highToLow'>Price: High to Low</option>
              <option value='price'>Price: Low to High</option>
              <option value='category'>Category</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortFilter;
