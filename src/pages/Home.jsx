import React from 'react'
import { gql, useQuery } from '@apollo/client';
import { makeStyles } from '@mui/styles'
import { Typography, CircularProgress } from '@mui/material';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: '100vh'
  },
  cards: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px'
  },
  card: {
    margin: '10px',
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e2e2e2',
    borderRadius: '10px',
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 0px 10px #00000040',
    overflow: 'hidden'
  },
  imageBox: {
    width: '100%',
    height: '200px',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
})

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

const Home = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(get_all_products, {
    pollInterval: 1000,
  });

  return (
    <div className={classes.container}>
      <Typography variant='h6' style={{padding: 20}}>All Products</Typography>
      {
        loading ?
        <CircularProgress size={28} color="inherit" />
        : error ?
          <Typography>Error: {error.message}</Typography>
        : data && <div className={classes.cards}>
          {data.products.map(product => (
          <div className={classes.card} key={product.id}>
            <div className={classes.imageBox}>
              <img src={product.image} alt={product.name} style={{height: '100%', width: '100%'}} />
            </div>
            <div style={{padding: 16}}>
              <Typography>Product Name: <b>{product.name}</b></Typography>
              {product.description && <Typography>Product Description: <b>{product.description}</b></Typography>}
              <Typography>Price: <b>{product.price}</b></Typography>
              {product.category && <Typography>Category: <b>{product.category}</b></Typography>}
            </div>
          </div>
        ))}
        </div> 
      }
    </div>
  )
}

export default Home