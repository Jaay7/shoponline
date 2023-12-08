import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiArrowRight } from "react-icons/hi2";

const get_order = gql`
  query Query {
    orders {
      id
      orderBy {
        addressLine
        pinCode
        city
        state
        country
      }
      orderProducts {
        product {
          id
          name
          price
          image
          description
          category
        }
        quantity
      }
      totalPrice
      status
      createdAt
    }
  }
`;

const OrderScreen = () => {
  let { orderId } = useParams();

  const { data, loading, error } = useQuery(get_order, {
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
    pollInterval: 500,
  });

  const finalShipping = 60;
  const taxEstimate = 129;

  return (
    <div className="grid min-h-screen flex-1 grid-cols-1 md:grid-cols-2">
      <div className="flex-1 flex-col h-[300px] md:h-full col-span-1 flex">
        <img
          src={
            "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex min-h-full flex-1 flex-col px-6 py-12 md:py-16 lg:px-16 col-span-1">
        <span className="text-indigo-600 text-sm font-medium">
          Order successful
        </span>
        <h3 className="text-3xl md:text-4xl lg:text-5xl py-2 font-bold">
          Thanks for ordering
        </h3>
        <p className="text-gray-500">
          We appreciate your order, we&#8217;re currently processing it. So hang
          tight and we&#8217;ll send you confirmation very soon!
        </p>
        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center">
              <AiOutlineLoading3Quarters className="animate-spin text-xl font-semibold mt-6" />
            </div>
          ) : (
            <React.Fragment>
              <div className="flex flex-col w-full divide-y">
                <div className="text-sm py-6">
                  <p className="font-medium">Tracking number</p>
                  <p className="text-indigo-600 mt-2">
                    {data.orders.find((item) => item.id === orderId).id}
                  </p>
                </div>
                {data.orders
                  .find((item) => item.id === orderId)
                  .orderProducts.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between py-6 w-full"
                    >
                      <div className="flex flex-row gap-x-4">
                        <div className="h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-md bg-gray-200">
                          <img
                            src={item.product.image}
                            className="h-full w-full object-cover object-center opacity-80"
                          />
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between">
                          <div className="flex flex-col space-y-1 sm:w-56">
                            <p className="text-sm text-gray-800 font-medium">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.product.category}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty. {item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-500 hover:text-gray-700 flex flex-col justify-between items-end">
                        <p className="text-sm text-gray-950 font-medium">
                          &#x20b9;{item.product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                <div className="mt-3 flex flex-col">
                  <div className="flex flex-row justify-between py-3">
                    <p className="text-sm text-gray-500 font-medium">
                      Subtotal
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      &#x20b9;
                      {data.orders.find((item) => item.id === orderId)
                        .totalPrice -
                        finalShipping -
                        taxEstimate}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between py-3">
                    <p className="text-sm text-gray-500 font-medium">
                      Shipping
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      &#x20b9;
                      {finalShipping}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between py-3">
                    <p className="text-sm text-gray-500 font-medium">Tax</p>
                    <p className="text-sm text-gray-900 font-medium">
                      &#x20b9;
                      {taxEstimate}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between py-3">
                    <p className="text-base text font-medium-gray-900 font-medium">
                      Total
                    </p>
                    <p className="text-base text-gray-900 font-medium">
                      &#x20b9;
                      {
                        data.orders.find((item) => item.id === orderId)
                          .totalPrice
                      }
                    </p>
                  </div>

                  <div className="text-sm grid grid-cols-1 sm:grid-cols-2 my-8">
                    <div className="text-sm col-span-1">
                      <p className="font-medium">Shipping address</p>
                      <p className="text-gray-600 mt-2">
                        {data.orders.find((item) => item.id === orderId).orderBy
                          .addressLine +
                          ", " +
                          data.orders.find((item) => item.id === orderId)
                            .orderBy.city +
                          ", " +
                          data.orders.find((item) => item.id === orderId)
                            .orderBy.state +
                          ", " +
                          data.orders.find((item) => item.id === orderId)
                            .orderBy.pinCode}
                      </p>
                    </div>
                    <div className="text-sm col-span-1">
                      <p className="font-medium">Payment information</p>
                      <p className="text-gray-600 mt-2">Cash on Delivery</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {data.orders.find((item) => item.id === orderId).status}
                    </p>
                    <div className="relative w-full bg-gray-200 h-2 rounded-full mt-4">
                      {/* order placed w-1/12
                          processing w-5/12
                          shipped w-8/12
                          delivered w-full
                      */}
                      <div
                        className={`absolute bg-indigo-600 rounded-full h-2 ${
                          data.orders.find((item) => item.id === orderId)
                            .status === "pending"
                            ? "w-5/12"
                            : data.orders.find((item) => item.id === orderId)
                                  .status === "delivered"
                              ? "w-full"
                              : "w-1/12"
                        }`}
                      ></div>
                    </div>
                    <div className="grid grid-cols-4 place-items-end mt-3 text-sm text-gray-500 font-medium gap-x-4">
                      <p className="col-span-1 place-self-start">
                        Order placed
                      </p>
                      <p className="col-span-1 place-self-center">Processing</p>
                      <p className="col-span-1 place-self-center">Shipped</p>
                      <p className="col-span-1">Delivered</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <p className="flex items-center gap-x-1 text-gray-500 text-sm self-center mt-6">
                    <Link
                      to="/"
                      className="flex items-center gap-x-1 text-indigo-600 font-medium"
                    >
                      Continue shopping <HiArrowRight />
                    </Link>
                  </p>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
