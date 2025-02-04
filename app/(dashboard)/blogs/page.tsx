/** @format */

export default async function Page() {
  const data = await fetch(
    "http://localhost:3000/api/blogs?userId=672af3377664d04aaf053eb1&categoryid=672c4a55fc2840716a533edd&Keywords=Today&enddate=2025-05-17&page=1&limit=10"
  );
  const posts = await data.json();

  type BlogPostType = {
    id: string;
    title: string;
    description: string;
    category: string;
    user: string;
    createdAt: string;
    updatedAt: string;
  };

  return (
    <ul>
      {posts.map((data: BlogPostType) => (
        <div
          key={data.id}
          className='bg-gray-100 p-6 rounded-lg shadow-lg max-w-xl mx-auto mt-8'>
          <h1 className='text-2xl font-bold text-gray-800 mb-4'>
            {data.title}
          </h1>
          <p className='text-gray-600 mb-6'>{data.description}</p>
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-sm text-gray-500'>Category: {data.category}</p>
              <p className='text-sm text-gray-500'>User ID: {data.user}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>
                Created: {new Date(data.createdAt).toLocaleDateString()}
              </p>
              <p className='text-sm text-gray-500'>
                Updated: {new Date(data.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </ul>
  );
}
