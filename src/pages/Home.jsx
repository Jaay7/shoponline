import React from 'react'
import { gql, useMutation, useQuery } from '@apollo/client';
import { makeStyles } from '@mui/styles'
import { Typography, CircularProgress, Card, Button, CardHeader, Icon, Snackbar, Tooltip, MenuItem, Menu, Divider, AppBar, CardActions, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minHeight: '100vh',
    // backgroundColor: '#f8f8f8',
  },
  cards: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '60px'
  },
  card: {
    margin: '8px',
    width: '300px',
    // height: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #e2e2e2',
    borderRadius: '6px',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 10px #00000020',
    overflow: 'hidden'
  },
  imageBox: {
    width: '100%',
    height: '200px',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat'
  },
})

const get_user_type = gql`
  query GetUserType {
    me {
      id
      email
      userType
    }
  }
`;

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

const remove_product = gql`
  mutation Mutation($id: ID!) {
    deleteProduct(id: $id)
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

const ContainedButton = styled((props) => <Button {...props} />)(({ theme }) => ({
  padding: '6px 16px',
  fontSize: 14,
  display: 'flex',
  alignItems: 'center',
  outline: 'none',
  border: 'none',
  backgroundColor: '#2939341a',
  textTransform: 'capitalize',
  color: '#293934',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    color: '#293934da',
    backgroundColor: '#2939341a',
    border: 'none',
  }
}));

const Home = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(get_all_products, {
    pollInterval: 500,
  });

  const { data: userData } = useQuery(get_user_type, {
    context: {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    },
    pollInterval: 500,
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState('');

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBar(false);
  };

  const [deleteProduct] = useMutation(remove_product)
  const [saveProduct] = useMutation(save_product)
  const [addToCart] = useMutation(add_to_cart)

  return (
    <div className={classes.container}>
      <React.Fragment>
        <AppBar style={{
          display:'flex', 
          flexDirection: 'row',
          backgroundColor: 'transparent', 
          backdropFilter: 'blur(15px)', 
          height: '56px', 
          color: 'inherit', 
          boxShadow: 'none', 
          borderBottom: '1px solid #e2e2e2', 
          alignItems: 'center'
        }}>
          <Typography variant='h6' style={{padding: 20, alignSelf: 'center', fontWeight: 'bold'}}>All Products</Typography>
          <span style={{flexGrow: 1}}></span>
          {
            localStorage.getItem('token') ?
              <Tooltip title="Account settings">
                <Icon baseClassName='material-icons-round' onClick={handleClick} style={{marginRight: 30}}>account_circle</Icon>
              </Tooltip>
            : <ContainedButton style={{marginRight: 30}} onClick={() => navigate('/login')}>Login</ContainedButton>
          }
          
        </AppBar>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              width: 200,
              color: '#727272',
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => navigate('/profile')}>
            <Icon baseClassName='material-icons-round'>person</Icon>
            <Typography sx={{ml: 2}}>Profile</Typography>
          </MenuItem>
          {
            userData && userData.me.userType === 'admin' ? <>
              <MenuItem onClick={() => navigate('/file-upload')}>
                <Icon baseClassName='material-icons-round'>file_upload</Icon>
                <Typography sx={{ml: 2}}>Add Product</Typography>
              </MenuItem> 
              <MenuItem onClick={() => navigate('/received-orders')}>
                <Icon baseClassName='material-icons-round'>shopping_basket</Icon>
                <Typography sx={{ml: 2}}>Received Orders</Typography>
              </MenuItem> 
              </> : <>
              <MenuItem onClick={() => navigate('/saved')}>
                <Icon baseClassName='material-icons-round'>bookmark</Icon>
                <Typography sx={{ml: 2}}>Saved</Typography>
              </MenuItem>
              <MenuItem onClick={() => navigate('/cart')}>
                <Icon baseClassName='material-icons-round'>shopping_cart</Icon>
                <Typography sx={{ml: 2}}>My Cart</Typography>
              </MenuItem>
              <MenuItem onClick={() => navigate('/orders')}>
                <Icon baseClassName='material-icons-round'>shopping_basket</Icon>
                <Typography sx={{ml: 2}}>My Orders</Typography>
              </MenuItem>
              </>
          }
          <Divider />
          <ContainedButton onClick={() => localStorage.removeItem('token')} style={{width: '100%'}}>
            <Icon baseClassName='material-icons-round'>logout</Icon>
            <Typography sx={{ml: 2}}>Logout</Typography>
          </ContainedButton>
        </Menu>
      </React.Fragment>
      {
        loading ?
        <CircularProgress size={28} color="inherit" style={{marginTop: 60}} />
        : error ?
          <Typography>Error: {error.message}</Typography>
        : data && <div className={classes.cards}>
          {data.products.map(product => (
            <Card elevation={0} key={product.id} sx={{width: 250, margin: 1, boxShadow: '0px 3px 6px #00000020'}}>
              <CardHeader
                sx={{py: 1}}
                action={
                  <Typography  sx={{mt: 2}}><b>&#x20b9;{product.price}</b></Typography>
                }
                subheader={<Typography style={{fontSize: 16, fontWeight: 'bold', color: '#565656'}}>{product.name}</Typography>}
                title={<Typography style={{fontSize: 14, color: '#8D8D8D'}}>{product.category}</Typography>}
              />
              <Divider />
              <div
                className={classes.imageBox}
                style={{backgroundImage: `url("${product.image}")`}}
              />
              <Divider />
              <CardActions>
              {
                  localStorage.getItem('token') !== null || localStorage.getItem('token') !== undefined || localStorage.getItem('token') !== '' ?
                  userData && userData.me.userType === 'admin' ?
                  <Stack flexDirection={'row'} justifyContent='space-between' width='100%'>
                    <Button
                      variant="text"
                      style={{color: '#293934', textTransform: 'none', width: '100%'}}
                      startIcon={<Icon baseClassName='material-icons-round'>edit</Icon>}
                    >
                      Edit
                    </Button>
                    <Divider orientation="vertical" flexItem />
                    <Button
                      variant="text"
                      style={{color: '#ee715b', textTransform: 'none', width: '100%'}}
                      onClick={() => {
                        deleteProduct({
                          variables: {id: product.id},
                          context: {
                            headers: {
                              'Authorization': localStorage.getItem('token')
                            }
                          },
                          onCompleted: () => {
                            setOpenSnackBar(true);
                            setSnackBarMessage(`${product.name} deleted`);
                          },
                          onError: () => {
                            setOpenSnackBar(true);
                            setSnackBarMessage("Delete Failed!");
                          }
                        })
                      }}
                      startIcon={<Icon baseClassName='material-icons-round'>delete</Icon>}
                    >
                      Delete
                    </Button>
                  </Stack> :
                  <Stack flexDirection={'row'} justifyContent='space-between' width='100%'>
                    <Button
                      variant="text"
                      style={{color: '#293934', textTransform: 'none', width: '100%'}}
                      onClick={() => {
                        saveProduct({
                          variables: {productId: product.id},
                          context: {
                            headers: {
                              Authorization: localStorage.getItem('token')
                            }
                          },
                          onCompleted: () => {
                            setOpenSnackBar(true);
                            setSnackBarMessage(`${product.name} saved`);
                          },
                          onError: () => {
                            setOpenSnackBar(true);
                            setSnackBarMessage("Save Failed!");
                          }
                        })
                      }}
                      startIcon={<Icon baseClassName='material-icons-round'>bookmark_border</Icon>}
                    >
                      Save
                    </Button>
                    <Divider orientation="vertical" flexItem />
                    <Button
                      variant="text"
                      style={{color: '#293934', textTransform: 'none', width: '100%'}}
                      onClick={() => {
                        addToCart({
                          variables: {productId: product.id},
                          context: {
                            headers: {
                              Authorization: localStorage.getItem('token')
                            }
                          },
                          onCompleted: () => {
                            setOpenSnackBar(true);
                            setSnackBarMessage(`${product.name} added to cart`);
                          },
                          onError: () => {
                            setOpenSnackBar(true);
                            setSnackBarMessage("Add to cart Failed!");
                          }
                        })
                      }}
                      startIcon={<Icon baseClassName='material-icons-round'>add_shopping_cart</Icon>}
                    >
                      Add to Cart
                    </Button>
                  </Stack> : <></>
                }
              </CardActions>
            </Card>
          ))}
        </div> 
      }
      <Snackbar
        open={openSnackBar}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
        message={snackBarMessage}
      />
    </div>
  )
}

export default Home