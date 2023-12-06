import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiXMark, HiArrowRight } from "react-icons/hi2";
import { IoBagCheckOutline } from "react-icons/io5";

const get_cart_products = gql`
  query CartProducts {
    me {
      id
      cartProducts {
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

const remove_from_cart = gql`
  mutation Mutation($productId: ID!) {
    removeFromCart(productId: $productId)
  }
`;

const Cart = () => {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(get_cart_products, {
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
    pollInterval: 500,
  });

  const [removeFromCart] = useMutation(remove_from_cart);

  const [order, setOrder] = React.useState([]);
  let [subTotalPrice, setSubTotalPrice] = React.useState(0);
  const shippingEstimate = 60;
  const taxEstimate = 129;

  function calculateTotalPrice(productParam) {
    return productParam.price * productParam.quantity;
  }

  function calculateOverallTotal(productsParam) {
    let overallTotal = 0;
    for (let i = 0; i < productsParam.length; i++) {
      overallTotal += calculateTotalPrice(productsParam[i]);
    }
    setSubTotalPrice(overallTotal);
  }

  React.useEffect(() => {
    calculateOverallTotal(order.filter((obj) => Object.keys(obj).length > 0));
  }, [order]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className="pb-10 border-b max-w-2xl">
          <h3 className="text-3xl font-semibold">Shopping Cart</h3>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <AiOutlineLoading3Quarters className="animate-spin text-xl font-semibold mt-6" />
          </div>
        ) : (
          <React.Fragment>
            {data && data.me.cartProducts.length > 0 ? (
              <React.Fragment>
                <div className="grid min-h-full flex-1 grid-cols-1 lg:grid-cols-5">
                  <div className="flex min-h-full flex-1 flex-col justify-center py-4 col-span-3">
                    {data.me.cartProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex justify-between py-8 border-b max-w-2xl"
                      >
                        <div className="flex flex-row gap-x-4">
                          <div className="h-32 w-32 sm:h-44 sm:w-44 overflow-hidden rounded-lg bg-gray-200">
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
                              <p className="text-sm text-gray-950 font-medium">
                                &#x20b9;{product.price}
                              </p>
                            </div>
                            <div>
                              <select
                                id="quantity"
                                name="quantity"
                                autoComplete="quantity-name"
                                className="block rounded-md border-0 p-1.5 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 outline-0"
                                value={
                                  order.find(
                                    (item) =>
                                      item.product === product.id.toString(),
                                  )
                                    ? order.find(
                                        (item) =>
                                          item.product ===
                                          product.id.toString(),
                                      ).quantity
                                    : 0
                                }
                                onChange={(e) => {
                                  const productToUpdate = order.find(
                                    (item) =>
                                      item.product === product.id.toString(),
                                  );
                                  if (productToUpdate) {
                                    productToUpdate.quantity = Number(
                                      e.target.value,
                                    );
                                    setOrder([...order]);
                                  } else {
                                    setOrder((prevOrder) => [
                                      ...prevOrder,
                                      {
                                        product: product.id,
                                        price: Number(product.price),
                                        quantity: Number(e.target.value),
                                      },
                                    ]);
                                  }
                                }}
                              >
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                  <option key={num} value={num}>
                                    {num}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => {
                            removeFromCart({
                              variables: { productId: product.id },
                              context: {
                                headers: {
                                  Authorization: localStorage.getItem("token"),
                                },
                              },
                            }).then(() => {
                              const productIndex = order.findIndex(
                                (item) =>
                                  item.product === product.id.toString(),
                              );
                              if (productIndex !== null) {
                                setOrder((prevOrder) => {
                                  const updatedOrder = [...prevOrder];
                                  updatedOrder.splice(productIndex, 1);
                                  return updatedOrder;
                                });
                              }
                            });
                          }}
                        >
                          <HiXMark className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex min-h-full flex-1 flex-col px-6 lg:px-8 col-span-2">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h4 className="text-lg font-medium">Order summary</h4>
                      <div className="mt-3 flex flex-col">
                        <div className="flex flex-row justify-between py-4">
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="text-sm text-gray-900 font-medium">
                            &#x20b9;
                            {subTotalPrice}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between py-4">
                          <p className="text-sm text-gray-500">
                            Shipping estimate
                          </p>
                          <p className="text-sm text-gray-900 font-medium">
                            &#x20b9;{subTotalPrice !== 0 ? shippingEstimate : 0}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between py-4">
                          <p className="text-sm text-gray-500">Tax estimate</p>
                          <p className="text-sm text-gray-900 font-medium">
                            &#x20b9;{subTotalPrice !== 0 ? taxEstimate : 0}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between py-4">
                          <p className="text-base text-gray-900 font-medium">
                            Order total
                          </p>
                          <p className="text-base text-gray-900 font-medium">
                            &#x20b9;
                            {subTotalPrice !== 0
                              ? subTotalPrice + shippingEstimate + taxEstimate
                              : 0}
                          </p>
                        </div>
                        <button
                          type="submit"
                          className="mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-x-2"
                        >
                          <IoBagCheckOutline className="h-5 w-5" />
                          Checkout
                        </button>
                        <p className="flex items-center gap-x-1 text-gray-500 text-sm self-center mt-3">
                          or{" "}
                          <span className="flex items-center gap-x-1 text-indigo-600 font-medium">
                            Continue shopping <HiArrowRight />
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              "No products in cart"
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Cart;
