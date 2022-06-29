import React from 'react'
import { gql, useQuery } from '@apollo/client';
import { Typography, CircularProgress, Icon, Divider, Button, Accordion, AccordionSummary, AccordionActions, AccordionDetails, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const get_orders = gql`
  query Query {
    orders {
      id
      orderProducts {
        product {
          id
          name
          price
          image
          description
          category
        }
        quantity
      }
      totalPrice
      status
      createdAt
    }
  }
`;

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

const MyOrders = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(get_orders, {
    context: {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    },
    pollInterval: 500,
    fetchPolicy: 'no-cache'
  });
  
  return (
    error ? <div>Error! {error.message}</div> :
    <StyledDiv>
      <Typography variant="h6" style={{fontWeight: 'bold', color: '#464646', display: 'flex', alignItems: 'center'}} gutterBottom>
        <Icon baseClassName='material-icons-round' onClick={() => navigate('/')} style={{marginRight: 10, cursor: 'pointer'}}>keyboard_backspace</Icon>
        My Orders</Typography>
      <Divider style={{marginBottom: 16 }} />
      {loading ? <CircularProgress size={28} color="inherit" /> :
      data && data.orders.length > 0 ? data.orders.map(order => (
        <Accordion key={order.id}>
          <AccordionSummary
            expandIcon={<Icon baseClassName='material-icons-round'>expand_more</Icon>} 
          >
            <Stack direction={"column"}>
              <Typography variant="body1" gutterBottom>
                Order ID: <b>{order.id}</b>
              </Typography>
              <Typography variant="body1" gutterBottom>
                Status: <b style={{color: order.status === 'pending' ? "orange" : order.status === 'delivered' ? "#08ca4d" : "#ee715b"}}>{order.status}</b>
              </Typography>
              <Typography variant="body1" gutterBottom>
                Order Placed on: <b>{order.createdAt}</b>
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails style={{display: 'flex', flexDirection: 'column'}}>
            {order.orderProducts.map(orderProduct => (
              <Stack direction={'row'} key={orderProduct.product.id}>
                <Typography variant="body1" style={{fontWeight: 'bold', color: '#464646', display: 'flex', alignItems: 'center'}} gutterBottom>
                  {orderProduct.product.name}
                </Typography>
                <span style={{flexGrow: 1}}></span>
                <Typography variant="body1" style={{color: '#464646'}} gutterBottom>
                  Quantity: {orderProduct.quantity}
                </Typography>
                <Typography variant="body1" style={{color: '#464646', marginLeft: 20}} gutterBottom>
                  Price: &#x20b9;{orderProduct.product.price}
                </Typography>
              </Stack>
            ))}
            <Divider style={{marginBottom: 10 }} flexItem />
            {order.totalPrice && <Typography variant="body1" style={{fontWeight: 'bold', color: '#464646', alignSelf: 'flex-end'}} gutterBottom>
              Total Price: &#x20b9;{order.totalPrice}
            </Typography>}
          </AccordionDetails>
          <AccordionActions>
            <Button variant="contained"
              style={{backgroundColor: '#121212', color: '#fff', borderRadius: 50, textTransform: 'none'}}
            >
              View Order
            </Button>
          </AccordionActions>
        </Accordion>
      )) : "You haven't ordered anything yet!"
      }
    </StyledDiv>
  )
}

export default MyOrders