import React from 'react'
import { gql, useMutation, useQuery } from '@apollo/client';
import { makeStyles } from '@mui/styles'
import { Typography, CircularProgress, Card, CardContent, CardHeader, Icon, Snackbar, Divider, CardActions, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const get_cart_products = gql`
  query CartProducts {
    me {
      id
      cartProducts {
        id
        name
        price
        description
        image
        category
        createdAt
      }
    }
  }
`;

const remove_from_cart = gql`
  mutation Mutation($productId: ID!) {
    removeFromCart(productId: $productId)
  }
`;

const place_order = gql`
  mutation Mutation($orderProducts: [OrderProductsInput], $totalPrice: Int, $createdAt: String) {
    createOrder(orderProducts: $orderProducts, totalPrice: $totalPrice, createdAt: $createdAt)
  }
`;

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minHeight: '100vh',
    // backgroundColor: '#f8f8f8',
  },
  imageBox: {
    width: '100%',
    height: '200px',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat'
  },
  bottomBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    right: '10px',
    alignSelf: 'center',
    backgroundColor: '#e2e2e299',
    zIndex: '1',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0px 3px 6px #00000020',
    border: '1px solid #e2e2e2',
  },
  quantity: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 0px 6px #00000020',
    padding: '4px 6px',
    borderRadius: '10px',
    marginTop: '10px',
    marginBottom: '10px',
    width: 'max-content',
  }
})

const StyledCardsDiv = styled((props) => <div {...props} />)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: '60px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const StyledDiv = styled((props) => <div {...props} />)(({ theme }) => ({
  marginTop: 16,
  padding: '20px 10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  [theme.breakpoints.up('sm')]: {
    padding: '20px 60px',
    marginTop: 0,
  },
}));

const MyCart = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(get_cart_products, {
    context: {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    },
    pollInterval: 500
  });

  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState('');

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBar(false);
  };

  const [removeFromCart] = useMutation(remove_from_cart)

  const [order, setOrder] = React.useState([{}]);
  const [totalPrice, setTotalPrice] = React.useState(0);

  const [placeOrder] = useMutation(place_order);

  return(
    error ? <div>Error! {error.message}</div> :
    <StyledDiv>
      <Typography variant="h6" style={{fontWeight: 'bold', color: '#464646', display: 'flex', alignItems: 'center'}} gutterBottom>
        <Icon baseClassName='material-icons-round' onClick={() => navigate('/')} style={{marginRight: 10, cursor: 'pointer'}}>keyboard_backspace</Icon>
        My Cart</Typography>
      <Divider style={{marginBottom: 16 }} />
      {loading ? <CircularProgress size={28} color="inherit" /> :
      data && <StyledCardsDiv>
        {/* {order && order.map(data => data.product + "=" +data.quantity+", ")} */}
          {data.me.cartProducts.length > 0 ? 
          <>{data.me.cartProducts.map(product => (
            <Card elevation={0} key={product.id} sx={{width: 250, margin: 1, boxShadow: '0px 3px 6px #00000020', borderRadius: 2}}>
              <CardHeader
                sx={{py: 1}}
                subheader={<Typography style={{fontSize: 16, fontWeight: 'bold', color: '#565656'}}>{product.name}</Typography>}
                title={<Typography style={{fontSize: 14, color: '#8D8D8D'}}>{product.category}</Typography>}
                // avatar={}
                action={
                  <Typography  sx={{mt: 2}}><b>&#x20b9;{product.price}</b></Typography>
                  //   <IconButton size="small" sx={{mt: 1, mr: 0.5}}
                  //   onClick={() => {
                      
                  //   }}
                  // >
                  //   <Icon baseClassName='material-icons-round'>close</Icon>
                  // </IconButton>
                }
              />
              <Divider />
              <div
                className={classes.imageBox}
                style={{backgroundImage: `url("${product.image}")`}}
              />
              <Divider />
              <CardContent style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: 0}}>
              </CardContent>
              <CardActions style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <div className={classes.quantity}>
                  {/* <Icon baseClassName='material-icons-round' style={{cursor: 'pointer'}} onClick={() => {}}>remove</Icon> */}
                  {/* <Divider orientation='vertical' flexItem /> */}
                  <Typography style={{fontSize: 16, fontWeight: 'bold', color: '#464646', padding: '0px 10px'}}>{
                    order.find(item => item.product === product.id) ? order.find(item => item.product === product.id).quantity : 0
                  }</Typography>
                  <Divider orientation='vertical' flexItem />
                  <Icon baseClassName='material-icons-round' style={{cursor: 'pointer'}} onClick={() => {
                    // eslint-disable-next-line array-callback-return
                    order.map(item => {
                      if (item.product === product.id.toString()) {
                        item.quantity = item.quantity + 1
                      } else {
                        setOrder([...order, {
                          product: product.id,
                          quantity: 1
                        }])
                      }
                      setTotalPrice(totalPrice + Number(product.price))
                    })
                    // console.log(quantity)
                  }}>add</Icon>
                </div>
                <Button 
                  variant="outlined"
                  style={{width: '100%', height: '100%', border: '1px solid #ee715b', color: '#ee715b', textTransform: 'none'}}
                    onClick={() => {
                      removeFromCart({
                        variables: {productId: product.id},
                        context: {
                          headers: {
                            'Authorization': localStorage.getItem('token')
                          }
                        },
                        onCompleted: () => {
                          setSnackBarMessage(`${product.name} removed from cart`)
                          setOpenSnackBar(true)
                        },
                        onError: () => {
                          setSnackBarMessage(`Error removing ${product.name} from cart`)
                          setOpenSnackBar(true)
                        }
                      })
                    }}
                  >
                    <Icon baseClassName='material-icons-round' sx={{mr: 0.5, fontSize: 18}}>delete</Icon>
                    Remove from Cart
                  </Button>
              </CardActions>
            </Card>
          ))}
          <div className={classes.bottomBar}>
            <Typography variant="body1" style={{color: '#464646'}} gutterBottom>
              Total: <b>&#x20b9;{
              // data.me.cartProducts.reduce((acc, product) => acc + Number(product.price), 0)
              totalPrice}</b>
            </Typography>
            <Button
              variant="contained"
              disabled={totalPrice === 0}
              style={{backgroundColor: '#121212', color: '#fff', textTransform: 'none', marginLeft: '30px'}}
              onClick={() => {
                placeOrder({
                  context: {
                    headers: {
                      'Authorization': localStorage.getItem('token')
                    }
                  },
                  variables: {
                    orderProducts: order.reduce((acc, product) => {
                      if (acc.find(item => item.product === product.product)) {
                        acc.find(item => item.product === product.product).quantity = Math.max(acc.find(item => item.product === product.product).quantity, product.quantity)
                      } else {
                        acc.push(product)
                      }
                      return acc
                    }
                    , []).slice(1),
                    totalPrice: totalPrice,
                    createdAt: new Date().toLocaleString()
                  },
                  onCompleted: () => {
                    setSnackBarMessage(`Order placed successfully`)
                    setOpenSnackBar(true)
                  },
                  onError: () => {
                    setSnackBarMessage(`Unable to place order`)
                    setOpenSnackBar(true)
                  }
                })
              }}
              startIcon={<Icon baseClassName='material-icons-round' sx={{fontSize: 16}}>shopping_cart</Icon>}
            >
              Place Order
            </Button>
          </div>
          </> : "No products in cart"}
        </StyledCardsDiv>
      }
      <Snackbar
        open={openSnackBar}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
        message={snackBarMessage}
      />
    </StyledDiv>
  );
}

export default MyCart;