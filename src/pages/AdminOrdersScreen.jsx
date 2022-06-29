import React from 'react'
import { gql, useQuery } from '@apollo/client';
import { Typography, CircularProgress, Icon, Divider, Button, Accordion, AccordionSummary, AccordionActions, AccordionDetails, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const get_orders = gql`
  query Query {
    orders {
      id
      orderBy {
        id
        username
        email
        addressLine
        pinCode
        city
        state
        country
      }
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

const AdminOrdersScreen = () => {
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
        Received Orders</Typography>
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
                Order Placed on: <b>{order.createdAt}</b>
              </Typography>
              <Typography variant="body1" gutterBottom>
                Ordered By: <b>{order.orderBy.username}</b>
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails style={{display: 'flex', flexDirection: 'column'}}>
            <Stack direction={'column'}>
              <Typography variant="body1" style={{color: '#464646'}} gutterBottom>
                Delivery Address: <b>{order.orderBy.addressLine + ", " + order.orderBy.city + ", " + order.orderBy.pinCode + ", " + order.orderBy.state}</b>
              </Typography>
            </Stack>
            <Divider style={{marginBottom: 10 }} flexItem />
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
              style={{backgroundColor: '#ee715b', color: '#fff', borderRadius: 50, textTransform: 'none'}}
            >
              Cancelled
            </Button>
            <Button variant="contained"
              style={{backgroundColor: '#00a53b', color: '#fff', borderRadius: 50, textTransform: 'none'}}
            >
              Delivered
            </Button>
          </AccordionActions>
        </Accordion>
      )) : "No orders received yet!"
      }
    </StyledDiv>
  )
}

export default AdminOrdersScreen