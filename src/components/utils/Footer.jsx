import React from "react";

const FootItems = {
  Products: ["Bags", "Tees", "Objects", "Home Goods", "Accessories"],
  Company: [
    "Who we are",
    "Sustainability",
    "Press",
    "Careers",
    "Terms & Conditions",
    "Privacy",
  ],
  "Customer Service": [
    "Contact",
    "Shipping",
    "Returns",
    "Warranty",
    "Secure Payments",
    "FAQ",
    "Find a store",
  ],
};

const Footer = () => {
  return (
    <div className="relative border-t overflow-hidden py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5">
        {Object.keys(FootItems).map((item) => (
          <div className="col-span-1 text-sm mb-4" key={item}>
            <p className="font-medium pb-2.5">{item}</p>
            {FootItems[item].map((i) => (
              <p key={i} className="text-gray-500 py-2.5">
                {i}
              </p>
            ))}
          </div>
        ))}
        <div className="col-span-1 md:col-span-2 text-sm">
          <div className="sm:col-span-2">
            <p className="block text-sm font-medium leading-6 text-gray-900">
              Sign up for our newsletter
            </p>
            <p className="text-gray-500 pt-4">
              The latest deals and savings, sent to your inbox weekly.
            </p>
            <div className="mt-2 flex gap-x-4">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className="block rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-0"
                // onChange={(e) => setState(e.target.value)}
              />
              <button
                type="button"
                className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 mx-auto max-w-7xl mt-12 border-t pt-8 text-center">
        &#169; 2023 Shop Online, Inc. All rights reserved.
      </p>
      <div
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
        aria-hidden="true"
      >
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
};

export default Footer;
