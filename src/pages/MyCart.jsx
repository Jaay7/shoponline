import React from 'react'
import { gql, useMutation, useQuery } from '@apollo/client';
import { makeStyles } from '@mui/styles'
import { Typography, CircularProgress, Card, CardActionArea, CardContent, CardHeader, IconButton, Icon, Snackbar, Divider } from '@mui/material';
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
  },
  imageBox: {
    width: '100%',
    height: '200px',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat'
  },
})

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

  return(
    error ? <div>Error! {error.message}</div> :
    <StyledDiv>
      <Typography variant="h6" style={{fontWeight: 'bold', color: '#464646', display: 'flex', alignItems: 'center'}} gutterBottom>
        <Icon baseClassName='material-icons-round' onClick={() => navigate('/')} style={{marginRight: 10, cursor: 'pointer'}}>keyboard_backspace</Icon>
        My Cart</Typography>
      <Divider style={{marginBottom: 16 }} />
      {loading ? <CircularProgress size={28} color="inherit" /> :
      data && <div className={classes.cards}>
          {data.me.cartProducts.length > 0 ? data.me.cartProducts.map(product => (
            <Card elevation={0} key={product.id} sx={{width: 250, margin: 1, boxShadow: '0px 0px 2px #00000040'}}>
              <CardHeader
                style={{height: 40}}
                title={<Typography style={{fontSize: 17}}>{product.name}</Typography>}
                subheader={product.category}
                action={
                  <IconButton size="small"
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
                    <Icon baseClassName='material-icons-round'>delete</Icon>
                  </IconButton>
                }
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
            </Card>
          )) : "No products in cart"}
        </div>
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