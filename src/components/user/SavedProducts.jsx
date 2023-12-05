import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const get_saved_products = gql`
  query SavedProducts {
    me {
      id
      savedProducts {
        id
        name
        price
        description
        image
        category
        createdAt
      }
    }
  }
`;

const remove_save_product = gql`
  mutation Mutation($productId: ID!) {
    removeFromSavedProducts(productId: $productId)
  }
`;

const add_to_cart = gql`
  mutation Mutation($productId: ID!) {
    addToCart(productId: $productId)
  }
`;

const SavedProducts = () => {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(get_saved_products, {
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
    pollInterval: 500,
  });

  const [removeSaveProduct] = useMutation(remove_save_product);
  const [addToCart] = useMutation(add_to_cart);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className="pb-10">
          <h3 className="text-3xl font-semibold">Wishlist</h3>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <AiOutlineLoading3Quarters className="animate-spin text-xl font-semibold mt-6" />
          </div>
        ) : (
          <React.Fragment>
            {data && data.me.savedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {data.me.savedProducts.map((product) => (
                  <a key={product.id} className="group">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      &#x20b9;{product.price}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              "No products saved"
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default SavedProducts;
