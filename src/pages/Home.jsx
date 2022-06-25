import React from 'react'
import { gql, useMutation, useQuery } from '@apollo/client';
import { makeStyles } from '@mui/styles'
import { Typography, CircularProgress, Card, CardActionArea, CardContent, Button, CardHeader, IconButton, Icon, Snackbar, Tooltip, MenuItem, Menu, Divider, AppBar } from '@mui/material';
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
          <MenuItem onClick={() => navigate('/saved')}>
            <Icon baseClassName='material-icons-round'>bookmark</Icon>
            <Typography sx={{ml: 2}}>Saved</Typography>
          </MenuItem>
          <MenuItem onClick={() => navigate('/cart')}>
            <Icon baseClassName='material-icons-round'>shopping_cart</Icon>
            <Typography sx={{ml: 2}}>My Cart</Typography>
          </MenuItem>
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
            <Card elevation={0} key={product.id} sx={{width: 250, margin: 1, boxShadow: '0px 0px 2px #00000040'}}>
              <CardHeader
              style={{height: 40}}
                action={
                  localStorage.getItem('token') !== null || localStorage.getItem('token') !== undefined ?
                  userData && userData.me.userType === 'admin' ?
                  <>
                    <IconButton>
                      <Icon baseClassName='material-icons-round'>edit</Icon>
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        deleteProduct({
                          variables: {id: product.id},
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
                    >
                      <Icon baseClassName='material-icons-round'>delete</Icon>
                    </IconButton>
                  </> :
                  <>
                    <IconButton
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
                    >
                      <Icon baseClassName='material-icons-round'>bookmark_border</Icon>
                    </IconButton>
                    <IconButton
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
                    >
                      <Icon baseClassName='material-icons-round'>add_shopping_cart</Icon>
                    </IconButton>
                  </> : <></>
                }
                title={<Typography style={{fontSize: 17}}>{product.name}</Typography>}
                subheader={product.category}
              />
              <CardActionArea>
                <div
                  className={classes.imageBox}
                  style={{backgroundImage: `url("${product.image}")`}}
                />
                <CardContent style={{height: 20}}>
                  {product.description && <Typography>{product.description}</Typography>}
                  <Typography><b>&#x20b9;{product.price}</b></Typography>
                </CardContent>
              </CardActionArea>
              {/* <CardActions disableSpacing>
                <ContainedButton variant="outlined">
                  <Icon baseClassName='material-icons-round'>bookmark_border</Icon>
                  <Typography style={{marginLeft: 8}}>Save</Typography>
                </ContainedButton>
                <Button size="small" color="primary">
                  Share
                </Button>
              </CardActions> */}
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