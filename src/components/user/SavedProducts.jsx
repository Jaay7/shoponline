import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import NotificationBox from "../utils/NotificationBox";

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

  const [notification, setNotification] = React.useState({
    open: false,
    for: "",
    title: "",
    description: "",
  });

  React.useEffect(() => {
    if (notification.open) {
      setTimeout(() => {
        setNotification({
          open: false,
          for: "",
          title: "",
          description: "",
        });
      }, 2500);
    }
  }, [notification]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8 flex flex-col items-center">
        <div className="pb-10">
          <h3 className="text-3xl font-bold">Wishlist</h3>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <AiOutlineLoading3Quarters className="animate-spin text-xl font-semibold mt-6" />
          </div>
        ) : (
          <React.Fragment>
            {data && data.me.savedProducts.length > 0 ? (
              <div className="mx-auto border-t">
                {data.me.savedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between py-8 border-b max-w-2xl"
                  >
                    <div className="flex flex-row gap-x-4">
                      <div className="h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-lg bg-gray-200">
                        <img
                          src={product.image}
                          className="h-full w-full object-cover object-center opacity-80"
                        />
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between">
                        <div className="flex flex-col space-y-1 sm:w-56">
                          <p className="text-sm text-gray-800 font-medium">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-500 hover:text-gray-700 flex flex-col justify-between items-end">
                      <p className="text-sm text-gray-950 font-medium">
                        &#x20b9;{product.price}
                      </p>
                      <button
                        className="text-sm font-medium text-indigo-600"
                        onClick={() => {
                          removeSaveProduct({
                            variables: { productId: product.id },
                            context: {
                              headers: {
                                Authorization: localStorage.getItem("token"),
                              },
                            },
                          })
                            .then((response) => {
                              setNotification({
                                open: true,
                                for: "success",
                                title: "Product removed!",
                                description: `Id: ${product.id}`,
                              });
                            })
                            .catch((error) => {
                              setNotification({
                                open: true,
                                for: "fail",
                                title: "Failed to remove!",
                                description: error.message,
                              });
                            });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              "No products saved"
            )}
          </React.Fragment>
        )}
      </div>
      <NotificationBox notification={notification} />
    </div>
  );
};

export default SavedProducts;
