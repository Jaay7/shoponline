import React from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoBagCheckOutline, IoCheckmarkCircle } from "react-icons/io5";
import NotificationBox from "../utils/NotificationBox";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ADDRESS_PRODUCTS = gql`
  query AddressProducts {
    me {
      id
      email
      addressLine
      pinCode
      city
      state
      country
      cartProducts {
        id
        name
        price
        image
        category
      }
    }
  }
`;

const place_order = gql`
  mutation Mutation(
    $orderProducts: [OrderProductsInput]
    $totalPrice: Int
    $createdAt: String
  ) {
    createOrder(
      orderProducts: $orderProducts
      totalPrice: $totalPrice
      createdAt: $createdAt
    )
  }
`;

const Checkout = () => {
  const navigate = useNavigate();
  let location = useLocation();

  const { loading, error, data } = useQuery(ADDRESS_PRODUCTS, {
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
    pollInterval: 500,
  });

  const [finalShipping, setFinalShipping] = React.useState(
    location.state && location.state.shippingEstimate,
  );
  const [paymentMethod, setPaymentMethod] = React.useState("");

  const [placeOrder, { loading: placeOrderLoading }] = useMutation(place_order);

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

  if (!location.state) {
    return <Navigate to={"/cart"} />;
  }
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        {loading ? (
          <div className="flex justify-center">
            <AiOutlineLoading3Quarters className="animate-spin text-xl font-semibold mt-6" />
          </div>
        ) : (
          <React.Fragment>
            <div className="grid min-h-full flex-1 grid-cols-1 lg:grid-cols-4">
              <div className="flex min-h-full flex-1 flex-col justify-center py-4 col-span-2">
                <p className="text-lg font-medium leading-6 text-gray-900">
                  Contact Information
                </p>
                <div className="text-sm leading-6 text-gray-600 sm:col-span-2">
                  <div className="mt-4 sm:col-span-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="email"
                        className="block flex-1 w-full sm:max-w-md rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-0"
                        placeholder="person@example.com"
                        disabled
                        value={data.me.email}
                        // onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-4 sm:col-span-4">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone number
                    </label>
                    <div className="mt-2">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        autoComplete="tel"
                        className="block flex-1 w-full sm:max-w-md rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-0"
                        placeholder="+91 123456 78901"
                        // disabled
                        // value={data.me.email}
                        // onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-8 pt-8 text-lg font-medium leading-6 text-gray-900 border-t">
                  Shipping address
                </p>
                <div className="mt-4 text-sm leading-6 text-gray-600 sm:col-span-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Country
                      </label>
                      <div className="mt-2">
                        <select
                          id="country"
                          name="country"
                          autoComplete="country-name"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 outline-0"
                          disabled
                          value={data.me.country}
                          // onChange={(e) => setCountry(e.target.value)}
                        >
                          <option value="India">India</option>
                          <option value="Switzerland">Switzerland</option>
                          <option value="United States">United States</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Street address
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="street-address"
                          id="street-address"
                          autoComplete="street-address"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-0"
                          disabled
                          value={data.me.addressLine}
                          // onChange={(e) => setAddressLine(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 sm:col-start-1">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        City
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="city"
                          id="city"
                          autoComplete="address-level2"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-0"
                          disabled
                          value={data.me.city}
                          // onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        State / Province
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="region"
                          id="region"
                          autoComplete="address-level1"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-0"
                          disabled
                          value={data.me.state}
                          // onChange={(e) => setState(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="postal-code"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        ZIP / Postal code
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="postal-code"
                          id="postal-code"
                          autoComplete="postal-code"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-0"
                          disabled
                          value={data.me.pinCode}
                          // onChange={(e) => setPinCode(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-8 pt-8 text-lg font-medium leading-6 text-gray-900 border-t">
                  Delivery method
                </p>
                <div className="mt-4 text-sm leading-6 text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:col-span-2">
                  <div
                    className={classNames(
                      finalShipping === 60 ? "border-indigo-600" : "",
                      "relative border-2 col-span-1 p-3 cursor-pointer rounded-lg bg-white",
                    )}
                    onClick={() => setFinalShipping(60)}
                  >
                    {finalShipping === 60 && (
                      <IoCheckmarkCircle className="text-indigo-600 h-5 w-5 absolute top-4 right-4" />
                    )}
                    <p className="font-medium">Standard</p>
                    <p className="text-gray-500">4-10 business days</p>
                    <p className="mt-4 font-medium">&#x20b9;60</p>
                  </div>
                  <div
                    className={classNames(
                      finalShipping === 100 ? "border-indigo-600" : "",
                      "relative border-2 col-span-1 p-3 cursor-pointer rounded-lg bg-white",
                    )}
                    onClick={() => setFinalShipping(100)}
                  >
                    {finalShipping === 100 && (
                      <IoCheckmarkCircle className="text-indigo-600 h-5 w-5 absolute top-4 right-4" />
                    )}
                    <p className="font-medium">Express</p>
                    <p className="text-gray-500">2-5 business days</p>
                    <p className="mt-4 font-medium">&#x20b9;100</p>
                  </div>
                </div>
                <p className="mt-8 pt-8 text-lg font-medium leading-6 text-gray-900 border-t">
                  Payment method
                </p>
                <div className="mt-4 flex flex-row gap-x-6">
                  <div className="flex items-center gap-x-3">
                    <input
                      id="cod"
                      name="cash-on-delivery"
                      type="radio"
                      className="h-4 w-4 appearance-none border checked:border-4 border-gray-400 rounded-full bg-white checked:border-indigo-600 text-indigo-600"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <label
                      htmlFor="cod"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Cash on Delivery
                    </label>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="qr-pay"
                      name="qr-pay"
                      type="radio"
                      className="h-4 w-4 appearance-none border checked:border-4 border-gray-400 rounded-full bg-white checked:border-indigo-600 text-indigo-600"
                      checked={paymentMethod === "qr"}
                      onChange={() => setPaymentMethod("qr")}
                    />
                    <label
                      htmlFor="qr-pay"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      QR Pay
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex min-h-full flex-1 flex-col px-6 lg:px-8 py-4 col-span-2">
                <p className="text-lg font-medium leading-6 text-gray-900">
                  Order summary
                </p>
                <div className="bg-white p-6 mt-4 rounded-lg border">
                  {location.state.order
                    .map((o) => {
                      const matchedProduct = data.me.cartProducts.find(
                        (item) => item.id === o.product,
                      );
                      return {
                        id: o.product,
                        image: matchedProduct ? matchedProduct.image : null,
                        name: matchedProduct ? matchedProduct.name : null,
                        quantity: o.quantity,
                        price: o.price,
                      };
                    })
                    .map((product) => (
                      <div
                        key={product.id}
                        className="flex justify-between pb-6 border-b max-w-2xl"
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
                              <p className="text-sm text-gray-950 font-medium">
                                &#x20b9;{product.price}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty. {product.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  <div className="mt-3 flex flex-col">
                    <div className="flex flex-row justify-between py-4">
                      <p className="text-sm text-gray-500">Subtotal</p>
                      <p className="text-sm text-gray-900 font-medium">
                        &#x20b9;
                        {location.state.subTotalPrice}
                      </p>
                    </div>
                    <div className="flex flex-row justify-between py-4">
                      <p className="text-sm text-gray-500">Shipping</p>
                      <p className="text-sm text-gray-900 font-medium">
                        &#x20b9;
                        {finalShipping}
                      </p>
                    </div>
                    <div className="flex flex-row justify-between py-4">
                      <p className="text-sm text-gray-500">Tax</p>
                      <p className="text-sm text-gray-900 font-medium">
                        &#x20b9;
                        {location.state.taxEstimate}
                      </p>
                    </div>
                    <div className="flex flex-row justify-between py-4">
                      <p className="text-base text-gray-900 font-medium">
                        Total
                      </p>
                      <p className="text-base text-gray-900 font-medium">
                        &#x20b9;
                        {location.state.subTotalPrice +
                          finalShipping +
                          location.state.taxEstimate}
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 gap-x-2"
                      onClick={() => {
                        placeOrder({
                          context: {
                            headers: {
                              Authorization: localStorage.getItem("token"),
                            },
                          },
                          variables: {
                            orderProducts: location.state.order
                              .filter((item) => item.quantity > 0)
                              .map(({ product, quantity }) => ({
                                product,
                                quantity,
                              })),
                            totalPrice:
                              location.state.subTotalPrice +
                              finalShipping +
                              location.state.taxEstimate,
                            createdAt: new Date().toLocaleString(),
                          },
                        })
                          .then((res) => {
                            setNotification({
                              open: true,
                              for: "success",
                              title: "Order successful!",
                              description:
                                "You will be redirected to orders page.",
                            });
                            setTimeout(() => {
                              navigate("/my-orders");
                            }, 2500);
                          })
                          .catch((error) => {
                            console.log(error);
                            setNotification({
                              open: true,
                              for: "fail",
                              title: "Order failed!",
                              description: error.message,
                            });
                          });
                      }}
                    >
                      {placeOrderLoading ? (
                        <AiOutlineLoading3Quarters className="animate-spin text-xl font-bold" />
                      ) : (
                        <React.Fragment>
                          <IoBagCheckOutline className="h-5 w-5" />
                          Place order
                        </React.Fragment>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
      <NotificationBox notification={notification} />
    </div>
  );
};

export default Checkout;
