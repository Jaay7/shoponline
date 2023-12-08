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
import NotificationBox from "./utils/NotificationBox";

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

const save_product = gql`
  mutation Mutation($productId: ID!) {
    addToSavedProducts(productId: $productId)
  }
`;

const add_to_cart = gql`
  mutation Mutation($productId: ID!) {
    addToCart(productId: $productId)
  }
`;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Home = () => {
  const { loading, error, data } = useQuery(get_all_products, {
    pollInterval: 500,
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [currentProduct, setCurrentProduct] = React.useState();

  const [saveProduct, { loading: saveProductLoading }] =
    useMutation(save_product);
  const [addToCart, { loading: addToCartLoading }] = useMutation(add_to_cart);

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
      {loading ? (
        <div className="flex justify-center">
          <AiOutlineLoading3Quarters className="animate-spin text-xl font-semibold mt-6" />
        </div>
      ) : error ? (
        <>{error.message}</>
      ) : (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
            {data.products.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => {
                  setCurrentProduct(product);
                  setOpenModal(true);
                }}
              >
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
        </div>
      )}
      <React.Fragment>
        {openModal && currentProduct ? (
          <div className="relative z-10" role="dialog" aria-modal="true">
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                <div className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                  <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 md:rounded-xl">
                    <button
                      type="button"
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                      onClick={() => setOpenModal(false)}
                    >
                      <span className="sr-only">Close</span>
                      <HiXMark className="h-6 w-6" />
                    </button>

                    <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                      <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                        <img
                          src={currentProduct.image}
                          alt="Two each of gray, white, and black shirts arranged on table."
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="sm:col-span-8 lg:col-span-7">
                        <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                          {currentProduct.name}
                        </h2>

                        <section
                          aria-labelledby="information-heading"
                          className="mt-2"
                        >
                          <h3 id="information-heading" className="sr-only">
                            Product information
                          </h3>

                          <p className="text-2xl text-gray-900">
                            &#x20b9;{currentProduct.price}
                          </p>

                          <p className="text-sm text-gray-900">
                            {currentProduct.description}
                          </p>

                          {/* <!-- Reviews --> */}
                          <div className="mt-6">
                            <h4 className="sr-only">Reviews</h4>
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {[0, 1, 2, 3, 4].map((rating) => (
                                  <HiStar
                                    key={rating}
                                    className={classNames(
                                      3 > rating
                                        ? "text-gray-900"
                                        : "text-gray-200",
                                      "h-5 w-5 flex-shrink-0",
                                    )}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                              <p className="sr-only">3.9 out of 5 stars</p>
                              <a
                                href="#"
                                className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                117 reviews
                              </a>
                            </div>
                          </div>
                        </section>

                        <section
                          aria-labelledby="options-heading"
                          className="mt-10"
                        >
                          <h3 id="options-heading" className="sr-only">
                            Product options
                          </h3>

                          <form>
                            {/* <!-- Sizes --> */}
                            <div className="mt-10">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900">
                                  Size
                                </h4>
                                <a
                                  href="#"
                                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                  Size guide
                                </a>
                              </div>

                              <fieldset className="mt-4">
                                <legend className="sr-only">
                                  Choose a size
                                </legend>
                                <div className="grid grid-cols-4 gap-4">
                                  {/* <!-- Active: "ring-2 ring-indigo-500" --> */}
                                  {[
                                    "XXS",
                                    "XS",
                                    "S",
                                    "M",
                                    "L",
                                    "XL",
                                    "XXL",
                                  ].map((item) => (
                                    <label
                                      className="group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 cursor-pointer bg-white text-gray-900 shadow-sm"
                                      key={item}
                                    >
                                      <input
                                        type="radio"
                                        name="size-choice"
                                        value={item}
                                        className="sr-only"
                                      />
                                      <span id="size-choice-0-label">
                                        {item}
                                      </span>
                                      {/* <!--
                            Active: "border", Not Active: "border-2"
                            Checked: "border-indigo-500", Not Checked: "border-transparent"
                          --> */}
                                      <span
                                        className="pointer-events-none absolute -inset-px rounded-md"
                                        aria-hidden="true"
                                      ></span>
                                    </label>
                                  ))}
                                  {/* <!-- Active: "ring-2 ring-indigo-500" --> */}
                                  <label className="group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 cursor-not-allowed bg-gray-50 text-gray-200">
                                    <input
                                      type="radio"
                                      name="size-choice"
                                      value="XXXL"
                                      disabled
                                      className="sr-only"
                                      aria-labelledby="size-choice-7-label"
                                    />
                                    <span id="size-choice-7-label">XXXL</span>
                                    <span
                                      aria-hidden="true"
                                      className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                    >
                                      <svg
                                        className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        stroke="currentColor"
                                      >
                                        <line
                                          x1="0"
                                          y1="100"
                                          x2="100"
                                          y2="0"
                                          vectorEffect="non-scaling-stroke"
                                        />
                                      </svg>
                                    </span>
                                  </label>
                                </div>
                              </fieldset>
                            </div>

                            {localStorage.getItem("token") && (
                              <React.Fragment>
                                <button
                                  type="button"
                                  className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-x-2"
                                  onClick={() => {
                                    addToCart({
                                      variables: {
                                        productId: currentProduct.id,
                                      },
                                      context: {
                                        headers: {
                                          Authorization:
                                            localStorage.getItem("token"),
                                        },
                                      },
                                    })
                                      .then((res) => {
                                        setNotification({
                                          open: true,
                                          for: "success",
                                          title: "Added to cart!",
                                          description: `Product ${currentProduct.id}`,
                                        });
                                      })
                                      .catch((error) => {
                                        setNotification({
                                          open: true,
                                          for: "fail",
                                          title: "Failed to add!",
                                          description: error.message,
                                        });
                                      });
                                  }}
                                >
                                  {addToCartLoading ? (
                                    <AiOutlineLoading3Quarters className="animate-spin text-xl font-bold" />
                                  ) : (
                                    <React.Fragment>
                                      <HiOutlineShoppingCart className="h-5 w-5" />
                                      Add to Cart
                                    </React.Fragment>
                                  )}
                                </button>
                                <button
                                  type="button"
                                  className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent text-indigo-600 px-8 py-3 text-base font-medium bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-x-2"
                                  onClick={() => {
                                    saveProduct({
                                      variables: {
                                        productId: currentProduct.id,
                                      },
                                      context: {
                                        headers: {
                                          Authorization:
                                            localStorage.getItem("token"),
                                        },
                                      },
                                    })
                                      .then((res) => {
                                        setNotification({
                                          open: true,
                                          for: "success",
                                          title: "Added to wishlist!",
                                          description: `Product ${currentProduct.id}`,
                                        });
                                      })
                                      .catch((error) => {
                                        setNotification({
                                          open: true,
                                          for: "fail",
                                          title: "Failed to add!",
                                          description: error.message,
                                        });
                                      });
                                  }}
                                >
                                  {saveProductLoading ? (
                                    <AiOutlineLoading3Quarters className="animate-spin text-xl font-bold" />
                                  ) : (
                                    <React.Fragment>
                                      <HiOutlineBookmark className="h-5 w-5" />
                                      Add to Wishlist
                                    </React.Fragment>
                                  )}
                                </button>
                              </React.Fragment>
                            )}
                          </form>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </React.Fragment>
      <NotificationBox notification={notification} />
    </div>
  );
};

export default Home;
