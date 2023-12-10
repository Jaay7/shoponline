import React from "react";
import { storage } from "../../config";
import { gql, useMutation } from "@apollo/client";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from "react-router-dom";

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
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState();
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState("");
  const [category, setCategory] = React.useState("");
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

  const [createProduct, { loading }] = useMutation(upload_product, {
    variables: {
      name,
      price,
      image,
      description,
      category,
    },
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
    onCompleted: () => {
      console.log("Product created");
      setName("");
      setPrice("");
      setDescription("");
      setImage("");
      setCategory("");
    },
  });

  return <div>AddNewProduct</div>;
};

export default AddNewProduct;
