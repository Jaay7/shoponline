import React from 'react'
import { gql, useMutation, useQuery } from '@apollo/client';
import { makeStyles } from '@mui/styles'
import { Typography, CircularProgress, Card, CardHeader, Icon, Snackbar, Divider, CardActions, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const get_saved_products = gql`
  query SavedProducts {
    me {
      id
      savedProducts {
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

const remove_save_product = gql`
  mutation Mutation($productId: ID!) {
    removeFromSavedProducts(productId: $productId)
  }
`;

const add_to_cart = gql`
  mutation Mutation($productId: ID!) {
    addToCart(productId: $productId)
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

const SavedProducts = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(get_saved_products, {
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

  const [removeSaveProduct] = useMutation(remove_save_product)
  const [addToCart] = useMutation(add_to_cart)

  return(
    error ? <div>Error! {error.message}</div> :
    <StyledDiv>
      <Typography variant="h6" style={{fontWeight: 'bold', color: '#464646', display: 'flex', alignItems: 'center'}} gutterBottom>
        <Icon baseClassName='material-icons-round' onClick={() => navigate('/')} style={{marginRight: 10, cursor: 'pointer'}}>keyboard_backspace</Icon>
        Saved Products</Typography>
      <Divider style={{marginBottom: 16 }} />
      {loading ? <CircularProgress size={28} color="inherit" /> :
      data && <StyledCardsDiv>
          {data.me.savedProducts.length > 0 ? data.me.savedProducts.map(product => (
            <Card elevation={0} key={product.id} sx={{width: 250, margin: 1, boxShadow: '0px 3px 6px #00000020'}}>
              <CardHeader
                sx={{py: 1}}
                subheader={<Typography style={{fontSize: 16, fontWeight: 'bold', color: '#565656'}}>{product.name}</Typography>}
                title={<Typography style={{fontSize: 14, color: '#8D8D8D'}}>{product.category}</Typography>}
                action={
                  <Typography  sx={{mt: 2}}><b>&#x20b9;{product.price}</b></Typography>
                }
              />
              <Divider />
              <div
                className={classes.imageBox}
                style={{backgroundImage: `url("${product.image}")`}}
              />
              <Divider />
              <CardActions style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Stack flexDirection={'row'} justifyContent='space-between' width='100%'>
                  <Button
                    variant="text"
                    style={{color: '#ee715b', textTransform: 'none', width: '100%'}}
                    onClick={() => {
                      removeSaveProduct({
                        variables: {productId: product.id},
                        context: {
                          headers: {
                            'Authorization': localStorage.getItem('token')
                          }
                        },
                        onCompleted: () => {
                          setSnackBarMessage(`${product.name} removed from saved products`)
                          setOpenSnackBar(true)
                        },
                        onError: () => {
                          setSnackBarMessage(`Error removing ${product.name} from saved products`)
                          setOpenSnackBar(true)
                        }
                      })
                    }}
                    startIcon={<Icon baseClassName='material-icons-round'>delete</Icon>}
                  >
                    Remove
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
                </Stack>
              </CardActions>
            </Card>
          )) : "No products saved"}
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

export default SavedProducts;