import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiArrowRight, HiChevronDown } from "react-icons/hi2";

const get_order = gql`
  query Query {
    orders {
      id
      orderBy {
        username
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

const AdminOrderView = () => {
  let { orderId } = useParams();
  const [openStatus, setOpenStatus] = React.useState(false);

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
    <div className="min-h-screen flex-1">
      <div className="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-12 max-w-5xl">
        <h3 className="text-3xl font-bold">
          Order by{" "}
          <span className="capitalize">
            {data.orders.find((item) => item.id === orderId).orderBy.username}
          </span>
        </h3>
        <div className="mt-4">
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
                <div className="mt-4 mb-14">
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
                  <div className="flex items-center gap-x-4">
                    <p className="text-sm font-medium capitalize">
                      Order status
                    </p>
                    <div className="relative inline-block text-left">
                      <div>
                        <button
                          type="button"
                          className="group inline-flex justify-center items-center text-sm font-medium text-indigo-600 hover:text-gray-900 capitalize"
                          onClick={() => setOpenStatus(!openStatus)}
                        >
                          {
                            data.orders.find((item) => item.id === orderId)
                              .status
                          }
                          <HiChevronDown
                            className="-mr-1 ml-1 flex-shrink-0 h-4 w-4 text-gray-400"
                            aria-hidden="true"
                          />
                        </button>
                      </div>

                      {openStatus ? (
                        <div className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1 divide-y w-full" role="none">
                            <button
                              className="font-medium text-gray-900 block px-4 py-2 text-sm w-full text-start"
                              id="menu-item-0"
                            >
                              Pending
                            </button>
                            <button
                              className="text-gray-500 block px-4 py-2 text-sm w-full text-start"
                              id="menu-item-1"
                            >
                              Delivered
                            </button>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
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
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderView;
