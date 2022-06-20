import React from 'react';
import { storage } from '../config';
import { TextField, Typography, Button, CircularProgress } from '@mui/material'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles'
import { gql, useMutation } from '@apollo/client';

const upload_product = gql`
  mutation CreateProduct($name: String!, $price: String!, $image: String!, $description: String, $category: String) {
    createProduct(name: $name, price: $price, image: $image, description: $description, category: $category)
  }
`;

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: 300
  },
  upload: {
    border: '1px solid #6c8780',
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6c8780',
    marginTop: 10,
    marginBottom: 10,
    cursor: 'pointer'
  }
})

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#52635e',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#52635e',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '&.Mui-focused fieldset': {
      borderColor: '#52635e',
    },
  },
});

const ContainedButton = styled((props) => <Button {...props} />)(({ theme }) => ({
  marginTop: '10px',
  padding: '6px 30px',
  fontSize: 14,
  display: 'flex',
  alignItems: 'center',
  outline: 'none',
  border: '2px solid #293934',
  borderRadius: '50px',
  backgroundColor: '#293934',
  textTransform: 'Capitalize',
  color: '#f2f2f2',
  transition: 'all 0.3s ease-in-out',
  fontWeight: 500,
  '&:hover': {
    color: '#293934da',
    backgroundColor: 'transparent',
    border: '2px solid #293934',
  }
}));

const FileUploadScreen = () => {
  const classes = useStyles();

  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState();
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState('');
  const [category, setCategory] = React.useState('');
  const fileUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);
    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log(downloadURL);
        setImage(downloadURL.toString());
      });
    }
    )
  }

  const [createProduct, {loading}] = useMutation(upload_product, {
    variables: {
      name,
      price,
      image,
      description,
      category
    },
    onCompleted: () => {
      console.log('Product created');
      setName('');
      setPrice('');
      setDescription('');
      setImage('');
      setCategory('');
    }
  });

  return (
    <div className={classes.container}>
      <div className={classes.form}>
        <Typography variant="h4">Upload Product</Typography>
        <StyledTextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          size='small'
        />
        <StyledTextField
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          margin="normal"
          size='small'
        />
        <StyledTextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          size='small'
        />
        <StyledTextField 
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          margin="normal"
          size='small'
        />
        <span
          className={classes.upload}
        >
          <input hidden id="icon-button-file" onChange={fileUpload} type="file"/>
          <label htmlFor="icon-button-file" style={{height: "24px"}}>
            Upload Image
          </label>
        </span>
        <Typography>Image: {image}</Typography>
        <ContainedButton
          onClick={() => createProduct()}
          disabled={image === '' || name === '' || price === ''}
        >
          {loading ? <CircularProgress size={28} color="inherit" /> : "Add Product"}
        </ContainedButton>
      </div>
    </div>
  );
}

export default FileUploadScreen;
