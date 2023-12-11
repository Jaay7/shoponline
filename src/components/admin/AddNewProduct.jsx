import React from "react";
import { storage } from "../../config";
import { gql, useMutation } from "@apollo/client";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { HiPhoto } from "react-icons/hi2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import NotificationBox from "../utils/NotificationBox";

const upload_product = gql`
  mutation CreateProduct(
    $name: String!
    $price: String!
    $image: String!
    $description: String
    $category: String
  ) {
    createProduct(
      name: $name
      price: $price
      image: $image
      description: $description
      category: $category
    )
  }
`;

const AddNewProduct = () => {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState();
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState("");
  const [category, setCategory] = React.useState("");

  const [notification, setNotification] = React.useState({
    open: false,
    for: "",
    title: "",
    description: "",
  });

  const fileUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          setImage(downloadURL.toString());
        });
      },
    );
  };

  const [createProduct, { loading }] = useMutation(upload_product);

  const onSave = async () => {
    await createProduct({
      variables: {
        name: name,
        price: price,
        image: image,
        description: description,
        category: category,
      },
      context: {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
    })
      .then((res) => {
        setNotification({
          open: true,
          for: "success",
          title: "Product added successfully!",
          description: "Go to products to view.",
        });
        navigate("/add-product");
        setName("");
        setPrice("");
        setDescription("");
        setImage("");
        setCategory("");
      })
      .catch((error) => {
        setNotification({
          open: true,
          for: "fail",
          title: "Failed to add Product!",
          description: error.message,
        });
        navigate("/");
      });
  };

  return (
    <div className="bg-white min-h-full w-full">
      <div className="max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-5xl lg:px-8">
        <div className="pb-10">
          <h3 className="text-3xl font-bold">New Product</h3>
        </div>
        <div>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Product Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                This information will be displayed publicly.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="productname"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="productname"
                        id="productname"
                        className="block flex-1 border-0 bg-transparent p-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                        placeholder="Floral T-Shirt"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Price
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span className="flex select-none items-center px-3 text-gray-500 text-sm border-r">
                        INR
                      </span>
                      <input
                        name="price"
                        id="price"
                        className="block flex-1 border-0 bg-transparent p-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                        placeholder="999"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Category
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="category"
                        id="category"
                        className="block flex-1 border-0 bg-transparent p-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none"
                        placeholder="T-Shirt"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-none"
                      placeholder="This product is perfect for beaches."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write a few details about the product.
                  </p>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Product image
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <HiPhoto
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={fileUpload}
                            disabled={image}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                  <div className="text-sm flex gap-x-3 mt-4">
                    <p className="font-medium">Image URL :</p>
                    <span className="">
                      {image ? image : "Upload image to the URL"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={onSave}
              disabled={image === "" || name === "" || price === ""}
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin text-xl font-bold" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
      <NotificationBox notification={notification} />
    </div>
  );
};

export default AddNewProduct;
