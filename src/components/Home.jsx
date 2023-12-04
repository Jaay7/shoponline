import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const get_all_products = gql`
  query Query {
    products {
      id
      name
      price
      description
      image
      category
      createdAt
    }
  }
`;

const Home = () => {
  const { loading, error, data } = useQuery(get_all_products, {
    pollInterval: 500,
  });
  return (
    <div className="bg-white">
      {loading ? (
        <div className="flex justify-center">
          <AiOutlineLoading3Quarters className="animate-spin text-xl font-semibold mt-6" />
        </div>
      ) : error ? (
        <>{error.message}</>
      ) : (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {data.products.map((product) => (
              <a key={product.id} href={"#"} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-3 text-sm text-gray-700">{product.name}</h3>
                <h3 className="mt-1 text-sm text-gray-500">
                  {product.category}
                </h3>
                <p className="mt-1 text-base font-medium text-gray-900">
                  &#x20b9;{product.price}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
