import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  HiOutlineBookmark,
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
  HiStar,
  HiXMark,
} from "react-icons/hi2";
import NotificationBox from "../utils/NotificationBox";

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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AdminManageProducts = () => {
  const { loading, error, data } = useQuery(get_all_products, {
    pollInterval: 500,
  });

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
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className="pb-10">
          <h3 className="text-3xl font-bold">All Products</h3>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <AiOutlineLoading3Quarters className="animate-spin text-xl font-semibold mt-6" />
          </div>
        ) : error ? (
          <>{error.message}</>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
            {data.products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="h-48 w-40 sm:h-56 sm:w-44 w-full overflow-hidden rounded-md bg-gray-200 xl:h-64 xl:w-56">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center opacity-90 hover:opacity-75"
                  />
                </div>
                <h3 className="mt-3 text-sm text-gray-700">{product.name}</h3>
                <h3 className="mt-1 text-sm text-gray-500">
                  {product.category}
                </h3>
                <p className="mt-1 text-base font-medium text-gray-900">
                  &#x20b9;{product.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <NotificationBox notification={notification} />
    </div>
  );
};

export default AdminManageProducts;
