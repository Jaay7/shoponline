import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import {
  HiBars3,
  HiMagnifyingGlass,
  HiOutlineShoppingBag,
  HiXMark,
  HiOutlineShoppingCart,
  HiPlus,
} from "react-icons/hi2";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: <RxDashboard /> },
  { name: "Orders", href: "/orders", icon: <HiOutlineShoppingBag /> },
  { name: "Products", href: "/products", icon: <HiOutlineShoppingCart /> },
  { name: "New product", href: "/add-product", icon: <HiPlus /> },
  { name: "Profile", href: "/profile", icon: <IoPersonCircleOutline /> },
];

const SideNavigation = () => {
  const location = useLocation();
  const [openSideMenu, setOpenSideMenu] = React.useState(false);
  return (
    <div className="bg-white">
      <div>
        {/* <!--
      Mobile filter dialog

      Off-canvas filters for mobile, show/hide based on off-canvas filters state.
    --> */}
        <div
          className="relative z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* <!--
        Off-canvas menu backdrop, show/hide based on off-canvas menu state.

        Entering: "transition-opacity ease-linear duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "transition-opacity ease-linear duration-300"
          From: "opacity-100"
          To: "opacity-0"
      --> */}
          <div
            className={classNames(
              openSideMenu ? "fixed" : "hidden",
              "inset-0 bg-black bg-opacity-70 backdrop-animation",
            )}
          ></div>

          <div
            className={classNames(
              openSideMenu ? "fixed" : "hidden",
              "inset-0 z-40 flex",
            )}
          >
            {/* <!--
          Off-canvas menu, show/hide based on off-canvas menu state.

          Entering: "transition ease-in-out duration-300 transform"
            From: "translate-x-full"
            To: "translate-x-0"
          Leaving: "transition ease-in-out duration-300 transform"
            From: "translate-x-0"
            To: "translate-x-full"
        --> */}
            <div className="relative mr-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between pl-8 pr-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Shop Online
                </h2>
                <button onClick={() => setOpenSideMenu(false)}>
                  <HiXMark className="text-gray-400 h-5 w-5" />
                </button>
              </div>

              {/* <!-- Nav items --> */}
              <div className="mt-8 flex flex-col space-y-1.5 px-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      location.pathname === item.href
                        ? "bg-indigo-400/5 text-indigo-600"
                        : "text-gray-950 hover:bg-indigo-400/5 hover:text-indigo-600",
                      "group rounded-md px-3 py-2.5 text-sm font-medium flex items-center gap-x-3",
                    )}
                  >
                    <span
                      className={classNames(
                        location.pathname === item.href
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-indigo-600",
                        "text-2xl",
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <main className="mx-auto">
          <section aria-labelledby="products-heading" className="">
            <div className="grid grid-cols-1 lg:grid-cols-10">
              {/* <!-- Nav Items --> */}
              <div className="col-span-2 hidden lg:block border-r h-screen">
                <div className="mt-8 flex flex-col space-y-1.5 px-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Shop Online
                  </h2>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        location.pathname === item.href
                          ? "bg-indigo-400/5 text-indigo-600"
                          : "text-gray-950 hover:bg-indigo-400/5 hover:text-indigo-600",
                        "group rounded-md px-3 py-2.5 text-sm font-medium flex items-center gap-x-3",
                      )}
                    >
                      <span
                        className={classNames(
                          location.pathname === item.href
                            ? "text-indigo-600"
                            : "text-gray-400 group-hover:text-indigo-600",
                          "text-2xl",
                        )}
                      >
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* <!-- navigation Outlet --> */}
              <div className="lg:col-span-8 h-screen overflow-auto">
                <div className="flex items-center border-b border-gray-200 h-16 px-6 block lg:hidden">
                  <button
                    className="flex items-center"
                    onClick={() => setOpenSideMenu(!openSideMenu)}
                  >
                    <HiBars3 className="text-gray-400 text-xl" />
                  </button>
                </div>
                <Outlet />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div>
      <SideNavigation />
    </div>
  );
};

export default AdminDashboard;
