import React from "react";
import {
  HiBars3,
  HiChevronDown,
  HiMagnifyingGlass,
  HiOutlineShoppingBag,
  HiXMark,
  HiPlus,
  HiMinus,
  HiOutlineBookmark,
  HiOutlineShoppingCart,
} from "react-icons/hi2";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import Footer from "./utils/Footer";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const groupCategories = [
  {
    gender: "women",
    subs: [
      {
        name: "Clothing",
        variants: [
          "Tops",
          "Dresses",
          "Pants",
          "Denim",
          "Sweaters",
          "T-Shirts",
          "Jackets",
          "Activewear",
          "Browse All",
        ],
      },
      {
        name: "Accessories",
        variants: ["Watches", "Wallets", "Bags", "Sunglasses", "Hats", "Belts"],
      },
      {
        name: "Brands",
        variants: [
          "Full Nelson",
          "My Way",
          "Re-Arranged",
          "Counterfeit",
          "Significant Other",
        ],
      },
    ],
  },
  {
    gender: "men",
    subs: [
      {
        name: "Clothing",
        variants: [
          "Tops",
          "Pants",
          "Sweaters",
          "T-Shirts",
          "Jackets",
          "Activewear",
          "Browse All",
        ],
      },
      {
        name: "Accessories",
        variants: ["Watches", "Wallets", "Bags", "Sunglasses", "Hats", "Belts"],
      },
      {
        name: "Brands",
        variants: ["Re-Arranged", "Counterfeit", "Full Nelson", "My Way"],
      },
    ],
  },
];

const get_user = gql`
  query GetUser {
    me {
      id
      email
      userType
      cartProducts {
        id
      }
      savedProducts {
        id
      }
    }
  }
`;

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = React.useState("");
  const [mobileCategory, setMobileCategory] = React.useState("women");
  const [openSideMenu, setOpenSideMenu] = React.useState(false);
  const [dropdownList, setDropdownList] = React.useState("");

  const { data: userData } = useQuery(get_user, {
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
    pollInterval: 500,
  });

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-white">
      <div className="relative z-40 lg:hidden" role="dialog" aria-modal="true">
        <div
          className={classNames(
            openSideMenu ? "" : "hidden",
            "fixed inset-0 bg-black bg-opacity-25 backdrop-animation",
          )}
        ></div>

        <div
          className={classNames(
            openSideMenu ? "" : "hidden",
            "fixed inset-0 z-40 flex sidenav",
          )}
        >
          <div className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
            <div className="flex px-4 pb-2 pt-5">
              <button
                type="button"
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                onClick={() => setOpenSideMenu(false)}
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Close menu</span>
                <HiXMark className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-2">
              <div className="border-b border-gray-200">
                <div
                  className="-mb-px flex space-x-8 px-4"
                  aria-orientation="horizontal"
                  role="tablist"
                >
                  <button
                    id="tabs-1-tab-1"
                    className={classNames(
                      mobileCategory === "women"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-900",
                      "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium",
                    )}
                    aria-controls="tabs-1-panel-1"
                    role="tab"
                    type="button"
                    onClick={() => setMobileCategory("women")}
                  >
                    Women
                  </button>
                  <button
                    id="tabs-1-tab-2"
                    className={classNames(
                      mobileCategory === "men"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-900",
                      "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium",
                    )}
                    aria-controls="tabs-1-panel-2"
                    role="tab"
                    type="button"
                    onClick={() => setMobileCategory("men")}
                  >
                    Men
                  </button>
                </div>
              </div>

              {groupCategories
                .filter(
                  (item) =>
                    item.gender.toLowerCase() === mobileCategory.toLowerCase(),
                )
                .map((item, index) => (
                  <div
                    id="tabs-1-panel-1"
                    className="space-y-2 px-4 pb-8 pt-6"
                    aria-labelledby="tabs-1-tab-1"
                    role="tabpanel"
                    tabIndex="0"
                    key={index}
                  >
                    {item.subs.map((vari) => (
                      <div key={vari.name}>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                          onClick={() =>
                            setDropdownList(
                              dropdownList === `${vari.name} ${item.gender}`
                                ? ""
                                : `${vari.name} ${item.gender}`,
                            )
                          }
                        >
                          <span className="font-medium text-sm text-gray-900">
                            {vari.name}
                          </span>
                          <span className="ml-6 flex items-center">
                            {dropdownList === `${vari.name} ${item.gender}` ? (
                              <HiMinus className="h-5 w-5w" />
                            ) : (
                              <HiPlus className="h-5 w-5" />
                            )}
                          </span>
                        </button>
                        <ul
                          role="list"
                          aria-labelledby="women-clothing-heading-mobile"
                          className={classNames(
                            dropdownList === `${vari.name} ${item.gender}`
                              ? "flex"
                              : "hidden",
                            "mt-2 flex-col space-y-4",
                          )}
                        >
                          {vari.variants.map((item) => (
                            <li key={item} className="flow-root">
                              <p className="ml-3 min-w-0 flex-1 text-sm text-gray-700">
                                {item}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              <div className="flow-root">
                <Link
                  to={"/"}
                  className={classNames(
                    location.pathname === "/"
                      ? "text-indigo-600"
                      : "text-gray-900",
                    "-m-2 block p-2 font-medium text-sm",
                  )}
                >
                  Home
                </Link>
              </div>
              <div className="flow-root">
                <a
                  href="#"
                  className="-m-2 block p-2 font-medium text-sm text-gray-900"
                >
                  Company
                </a>
              </div>
              <div className="flow-root">
                <a
                  href="#"
                  className="-m-2 block p-2 font-medium text-sm text-gray-900"
                >
                  Stores
                </a>
              </div>
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {localStorage.getItem("token") ? (
                <React.Fragment>
                  <div className="flow-root">
                    <Link
                      to={"/profile"}
                      className={classNames(
                        location.pathname === "/profile"
                          ? "text-indigo-600"
                          : "text-gray-900",
                        "-m-2 block p-2 font-medium text-sm",
                      )}
                    >
                      Profile
                    </Link>
                  </div>
                  <div className="flow-root">
                    <button
                      onClick={onLogout}
                      className="-m-2 block p-2 font-medium text-sm text-gray-900"
                    >
                      Logout
                    </button>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="flow-root">
                    <Link
                      to={"/signin"}
                      className="-m-2 block p-2 font-medium text-sm text-gray-900"
                    >
                      Sign in
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link
                      to={"/signup"}
                      className="-m-2 block p-2 font-medium text-sm text-gray-900"
                    >
                      Create account
                    </Link>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Greater */}
      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over &#x20b9;999
        </p>

        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpenSideMenu(!openSideMenu)}
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open menu</span>
                <HiBars3 className="h-6 w-6" />
              </button>
              <div className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  <Link
                    to="/"
                    className={classNames(
                      location.pathname === "/"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-700 hover:text-gray-800",
                      "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out capitalize gap-x-1",
                    )}
                  >
                    Home
                  </Link>
                  {groupCategories.map((nav) => (
                    <div key={nav.gender} className="flex">
                      <div className="relative flex">
                        <button
                          type="button"
                          className={classNames(
                            category === nav.gender
                              ? "border-indigo-600 text-indigo-600"
                              : "border-transparent text-gray-700 hover:text-gray-800",
                            "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out capitalize gap-x-1",
                          )}
                          aria-expanded="false"
                          onClick={() =>
                            setCategory(
                              category !== nav.gender ? nav.gender : "",
                            )
                          }
                        >
                          {nav.gender} <HiChevronDown />
                        </button>
                      </div>

                      {/* flyout menu */}
                      <div
                        className={classNames(
                          category === nav.gender ? "" : "hidden",
                          "absolute inset-x-0 top-full z-50 text-sm text-gray-500 flyout-menu",
                        )}
                      >
                        <div
                          className="absolute inset-0 top-1/2 bg-white shadow"
                          aria-hidden="true"
                        ></div>
                        <div className="relative bg-white">
                          <div className="mx-auto max-w-7xl px-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                              <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                {nav.subs.map((vari) => (
                                  <div key={vari.name}>
                                    <p
                                      id="Clothing-heading"
                                      className="font-medium text-gray-900"
                                    >
                                      {vari.name}
                                    </p>
                                    <ul
                                      role="list"
                                      aria-labelledby="Clothing-heading"
                                      className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                    >
                                      {vari.variants.map((item) => (
                                        <li key={item} className="flex">
                                          <a
                                            href="#"
                                            className="hover:text-gray-800"
                                          >
                                            {item}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <a
                    href="#"
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Company
                  </a>
                  <a
                    href="#"
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Stores
                  </a>
                </div>
              </div>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {localStorage.getItem("token") ? (
                    <React.Fragment>
                      <button
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                        onClick={onLogout}
                      >
                        Logout
                      </button>
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      ></span>
                      <Link
                        to={"/profile"}
                        className={classNames(
                          location.pathname === "/profile"
                            ? "text-indigo-600"
                            : "text-gray-700 hover:text-gray-800",
                          "text-sm font-medium",
                        )}
                      >
                        Profile
                      </Link>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Link
                        to={"/signin"}
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Sign in
                      </Link>
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      ></span>
                      <Link
                        to={"/signup"}
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Create account
                      </Link>
                    </React.Fragment>
                  )}
                </div>

                <div className="flex lg:ml-6">
                  <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Search</span>
                    <HiMagnifyingGlass className="h-6 w-6" />
                  </a>
                </div>

                {localStorage.getItem("token") ? (
                  <React.Fragment>
                    <div className="ml-4 flow-root lg:ml-6">
                      <Link
                        to={"/saved-products"}
                        className="group -m-2 flex items-center p-2"
                      >
                        <HiOutlineBookmark
                          className={classNames(
                            location.pathname === "/saved-products"
                              ? "text-indigo-600"
                              : "text-gray-400 group-hover:text-gray-500",
                            "h-6 w-6 flex-shrink-0",
                          )}
                        />
                        <span
                          className={classNames(
                            location.pathname === "/saved-products"
                              ? "text-indigo-600"
                              : "text-gray-700 group-hover:text-gray-800",
                            "ml-2 text-sm font-medium",
                          )}
                        >
                          {userData ? userData.me.savedProducts.length : "0"}
                        </span>
                        <span className="sr-only">
                          items in saved, view bag
                        </span>
                      </Link>
                    </div>

                    <div className="ml-4 flow-root lg:ml-6">
                      <Link
                        to={"/cart"}
                        className="group -m-2 flex items-center p-2"
                      >
                        <HiOutlineShoppingCart
                          className={classNames(
                            location.pathname === "/cart"
                              ? "text-indigo-600"
                              : "text-gray-400 group-hover:text-gray-500",
                            "h-6 w-6 flex-shrink-0",
                          )}
                        />
                        <span
                          className={classNames(
                            location.pathname === "/cart"
                              ? "text-indigo-600"
                              : "text-gray-700 group-hover:text-gray-800",
                            "ml-2 text-sm font-medium",
                          )}
                        >
                          {userData ? userData.me.cartProducts.length : "0"}
                        </span>
                        <span className="sr-only">items in cart, view bag</span>
                      </Link>
                    </div>

                    <div className="ml-4 flow-root lg:ml-6">
                      <Link
                        to={"/my-orders"}
                        className="group -m-2 flex items-center p-2"
                      >
                        <HiOutlineShoppingBag
                          className={classNames(
                            location.pathname === "/my-orders"
                              ? "text-indigo-600"
                              : "text-gray-400 group-hover:text-gray-500",
                            "h-6 w-6 flex-shrink-0",
                          )}
                        />
                        <span className="sr-only">items in cart, view bag</span>
                      </Link>
                    </div>
                  </React.Fragment>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Dashboard;
