/** @format */

// /** @format */

// import axios from "axios";
// import Product from "@/app/components/Products";

// interface Product {
//   _id: string;
//   title: string;
//   description: string;
//   price: number;
//   image: string;
//   outOfStock: boolean;
//   category?: { _id: string; name: string };
// }
// interface PageProps {
//   params: { id: string };
// }
// async function getProducts(id: string): Promise<Product[]> {
//   try {
//     const response = await axios.get<Product[]>(
//       `http://localhost:3000/api/products/category/${id}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return [];
//   }
// }

// function simplifyProduct(product: Product) {
//   return {
//     _id: product._id,
//     title: product.title,
//     description: product.description,
//     price: product.price,
//     image: product.image,
//     outOfStock: product.outOfStock,
//     category: product.category
//       ? { _id: product.category._id, name: product.category.name }
//       : null,
//   };
// }
// export default async function shppage({ params }: PageProps) {
//   const { id } = params;

//   try {
//     const products = await getProducts(id);
//     const simplifiedProducts = products.map(simplifyProduct);

//     return <Product products={simplifiedProducts} />;
//   } catch (error) {
//     console.error(error);

//     return <div>Error loading product.</div>;
//   }
// }

const page = () => {
  return <div>page</div>;
};

export default page;
