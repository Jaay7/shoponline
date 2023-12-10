import React from "react";
import { gql, useQuery } from "@apollo/client";
import {
  IoAlertCircle,
  IoCheckmarkCircle,
  IoCloseCircle,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const get_orders = gql`
  query Query {
    orders {
      id
      orderBy {
        id
        username
        email
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

const AdminCheckOrders = () => {
  const { data, loading, error } = useQuery(get_orders, {
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
    pollInterval: 500,
  });
  return (
    <div className="bg-gray-50 h-full w-full">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className="pb-10">
          <h3 className="text-3xl font-bold">Received Orders</h3>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <AiOutlineLoading3Quarters className="animate-spin text-xl font-semibold mt-6" />
          </div>
        ) : (
          <React.Fragment>
            <div className="max-w-4xl">
              {data && data.orders.length > 0
                ? data.orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col text-sm w-full py-6 border rounded-md bg-white px-6 mb-10"
                    >
                      <div className="flex flex-row flex-wrap items-center justify-between border-b gap-x-6 pb-6">
                        <div>
                          <p className="font-medium">Order number</p>
                          <p className="text-gray-500 mt-1">{order.id}</p>
                        </div>
                        <div>
                          <p className="font-medium">Date placed</p>
                          <p className="text-gray-500 mt-1">
                            {order.createdAt.split(",")[0]}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Total amount</p>
                          <p className="font-medium mt-1">
                            &#x20b9;{order.totalPrice}
                          </p>
                        </div>
                        <div className="flex flex-row gap-x-4">
                          <Link
                            to={`/order/${order.id}`}
                            className="justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            View Order
                          </Link>
                          <button
                            type="button"
                            className="justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            View Invoice
                          </button>
                        </div>
                      </div>
                      {order.orderProducts.map((item) => (
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
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-x-2">
                          {order.status === "success" ? (
                            <IoCheckmarkCircle className="h-5 w-5 text-green-500" />
                          ) : order.status === "pending" ? (
                            <IoAlertCircle className="h-5 w-5 text-amber-500" />
                          ) : (
                            <IoCloseCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="font-medium text-gray-500 capitalize">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                : "No orders placed yet"}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default AdminCheckOrders;
