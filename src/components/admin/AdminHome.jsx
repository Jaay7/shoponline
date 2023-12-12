import React from "react";
import { gql, useQuery } from "@apollo/client";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiOutlineShoppingBag, HiOutlineWallet } from "react-icons/hi2";
import { IoPeopleOutline } from "react-icons/io5";

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

const AdminHome = () => {
  const { data, loading, error } = useQuery(get_orders, {
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
    pollInterval: 500,
  });

  const getUniqueValues = (array, key) => {
    return array.reduce((uniqueValues, item) => {
      if (!uniqueValues.includes(item[key])) {
        uniqueValues.push(item[key]);
      }
      return uniqueValues;
    }, []);
  };

  return (
    <div className="bg-gray-50 min-h-full w-full">
      <div className="max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-6xl lg:px-8">
        <div className="pb-10">
          <h3 className="text-3xl font-bold">Dashboard</h3>
          <p className="text-sm text-gray-500">
            Monitor your sales revenue here.
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <AiOutlineLoading3Quarters className="animate-spin text-xl font-semibold mt-6" />
          </div>
        ) : (
          <React.Fragment>
            {data && (
              <div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3">
                  {/* Total Income */}
                  {[
                    {
                      title: "Total Income",
                      icon: (
                        <HiOutlineWallet className="h-5 w-5 text-gray-500" />
                      ),
                      value: `&#x20b9; ${data.orders.reduce(
                        (sum, order) => sum + order.totalPrice,
                        0,
                      )}`,
                    },
                    {
                      title: "Total Orders",
                      icon: (
                        <HiOutlineShoppingBag className="h-5 w-5 text-gray-500" />
                      ),
                      value: data.orders.length > 0 ? data.orders.length : 0,
                    },
                    {
                      title: "Total Customers",
                      icon: (
                        <IoPeopleOutline className="h-5 w-5 text-gray-500" />
                      ),
                      value: getUniqueValues(data.orders, "orderBy").length,
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="max-w-sm col-span-1 bg-white rounded-md border p-5 flex items-center gap-x-2"
                    >
                      <div className="rounded-full p-2.5 bg-gray-100">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500">
                          {item.title}
                        </p>
                        <p
                          className="text-lg font-semibold"
                          dangerouslySetInnerHTML={{ __html: item.value }}
                        />
                      </div>
                      <div>
                        <svg
                          className="w-[80px] xl:w-[110px] h-[38px]"
                          viewBox="0 0 123 38"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g filter="url(#filter0_f_0_1)">
                            <path
                              d="M5.68727 32.6735C5.68727 32.6735 18.914 32.321 23.3229 29.3251C27.4251 26.5376 28.4079 19.9031 33.9562 18.7514C40.879 17.3143 42.6598 24.9378 49.7764 24.0383C58.2254 22.9703 55.7937 9.53943 64.2999 8.70632C71.023 8.04783 74.5697 26.2207 81.1575 25.0956C87.0617 24.0873 85.968 10.7369 91.272 8.70632C96.3024 6.78044 100.482 10.8926 105.277 8.70632C110.297 6.41693 116.947 5.18174 116.947 5.18174"
                              stroke="#4ADE80"
                              strokeOpacity="0.75"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </g>
                          <path
                            d="M5.68727 30.6735C5.68727 30.6735 18.914 30.321 23.3229 27.3251C27.4251 24.5376 28.4079 17.9031 33.9562 16.7514C40.879 15.3143 42.6598 22.9378 49.7764 22.0383C58.2254 20.9703 55.7937 7.53943 64.2999 6.70632C71.023 6.04783 74.5697 24.2207 81.1575 23.0956C87.0617 22.0873 85.968 8.73691 91.272 6.70632C96.3024 4.78044 100.482 8.89263 105.277 6.70632C110.297 4.41693 116.947 3.18174 116.947 3.18174"
                            stroke="#4ADE80"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <defs>
                            <filter
                              id="filter0_f_0_1"
                              x="0.587585"
                              y="0.292084"
                              width="121.46"
                              height="37.2709"
                              filterUnits="userSpaceOnUse"
                              colorInterpolationFilters="sRGB"
                            >
                              <feFlood
                                floodOpacity="0"
                                result="BackgroundImageFix"
                              />
                              <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="BackgroundImageFix"
                                result="shape"
                              />
                              <feGaussianBlur
                                stdDeviation="2"
                                result="effect1_foregroundBlur_0_1"
                              />
                            </filter>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Based on cities */}
                <div className="mt-3">
                  {/* {getUniqueValues(data.orders, "orderBy").map((item) => (
                    <p key={item.city}>
                      {item.city} -{" "}
                      {data.orders.reduce(
                        (sum, order) =>
                          order.orderBy.city === item.city
                            ? sum + order.totalPrice
                            : 0,
                        0,
                      )}
                    </p>
                  ))} */}
                  {/* <iframe
                    className="bg-white border rounded-md w-[640px] h-[480px]"
                    src="https://charts.mongodb.com/charts-shoponline-mnmhp/embed/charts?id=65782cc3-a0f0-4a63-89d9-8cefd399df9c&maxDataAge=300&theme=light&autoRefresh=true"
                  ></iframe> */}
                </div>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
