import React from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import NotificationBox from "../utils/NotificationBox";

const create_user = gql`
  mutation CreateUser(
    $username: String!
    $email: String!
    $password: String!
    $addressLine: String!
    $pinCode: String!
    $city: String!
    $state: String!
    $country: String!
  ) {
    createUser(
      username: $username
      email: $email
      password: $password
      addressLine: $addressLine
      pinCode: $pinCode
      city: $city
      state: $state
      country: $country
    ) {
      message
      token
    }
  }
`;

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [viewPassword, setViewPassword] = React.useState(false);
  const [addressLine, setAddressLine] = React.useState("");
  const [pinCode, setPinCode] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [country, setCountry] = React.useState("India");

  const [notification, setNotification] = React.useState({
    open: false,
    for: "",
    title: "",
    description: "",
  });

  const [createUser, { loading }] = useMutation(create_user);

  const onSubmit = async () => {
    await createUser({
      variables: {
        username: username,
        email: email,
        password: password,
        addressLine: addressLine,
        pinCode: pinCode,
        city: city,
        state: state,
        country: country,
      },
    })
      .then((res) => {
        let token = res.data.createUser.token;
        localStorage.setItem("token", token);
        setNotification({
          open: true,
          for: "success",
          title: "Signup successful!",
          description: "You will be redirected to home page.",
        });
        navigate("/");
      })
      .catch((error) => {
        setNotification({
          open: true,
          for: "fail",
          title: "Signup failed!",
          description: error.message,
        });
      });
  };

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

  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    return <Navigate to="/" />;
  }

  return (
    <div className="grid min-h-screen flex-1 grid-cols-1 lg:grid-cols-2">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 col-span-1">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to={"/signin"}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
          {/* form starts */}
          <div>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Credentials
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  This information will help you to sign in to the application.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          autoComplete="email"
                          className="block flex-1 border-0 bg-transparent p-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-0"
                          placeholder="person@example.com"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="relative mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type={viewPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          autoComplete="password"
                          className="block flex-1 border-0 bg-transparent p-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-0"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <div
                          className="absolute inset-y-0 right-0 flex items-center transition-all duration-75 pr-2 cursor-pointer"
                          onClick={() => setViewPassword(!viewPassword)}
                        >
                          {viewPassword ? <RxEyeOpen /> : <RxEyeClosed />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Username
                    </label>
                    <div className="mt-2">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-0"
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>

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
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
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
                        onChange={(e) => setAddressLine(e.target.value)}
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
                        onChange={(e) => setCity(e.target.value)}
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
                        onChange={(e) => setState(e.target.value)}
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
                        onChange={(e) => setPinCode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="submit"
                disabled={!email && !password}
                onClick={onSubmit}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-xl font-bold" />
                ) : (
                  "Sign up"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden min-h-full flex-1 flex-col justify-center col-span-1 lg:flex">
        <img
          src={
            "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          className="h-full w-full object-cover object-center"
        />
      </div>
      <NotificationBox notification={notification} />
    </div>
  );
};

export default Signup;
