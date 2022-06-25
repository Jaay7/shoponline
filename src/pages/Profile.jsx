import React from 'react'
import { useQuery, gql } from "@apollo/client";
import { Divider, Typography, Button, Stack, useMediaQuery, TextField, CircularProgress, Icon } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  profilepic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    border: '3px solid #fff',
    marginTop: 50,
  },
  coverPic: {
    width: '100%',
    height: 140,
    position: 'absolute',
    // backgroundColor: '#e7ffd6',
    backgroundColor: '#f8ceec',
    backgroundImage: 'linear-gradient(315deg, #f8ceec 0%, #a88beb 74%)',
    left: 0, top: 0,
    zIndex: -1,
  }
})

const get_user_data = gql`
  query {
    me {
      id
      username
      email
      addressLine
      pinCode
      city
      state
      country
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

const StyledCard = styled((props) => <div {...props} />)(({ theme }) => ({
  padding: '50px 30px 10px 30px',
  width: '100%',
  maxWidth: '920px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignSelf: 'center',
  // backgroundColor: '#e7ffd6',
  backgroundColor: '#fff',
  backdropFilter: 'blur(5px)',
  boxShadow: '0px 0px 6px #00000030',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    padding: '20px 20px',
    minWidth: '100%',
  }
}));

const ContainedButton = styled((props) => <Button {...props} />)(({ theme }) => ({
  marginTop: '10px',
  width: 'max-content',
  height: '40px',
  padding: '6px 30px',
  fontSize: 14,
  outline: 'none',
  borderRadius: '50px',
  border: '1.5px solid #121212',
  textTransform: 'Capitalize',
  backgroundColor: '#121212da',
  color: '#f2f2f2',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#121212aa',
    color: '#f2f2f2',
  }
}));

const Profile = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
  const [edit, setEdit] = React.useState(false);
  const { data, loading, error } = useQuery(get_user_data, {
    context: {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    },
    pollInterval: 500
  });

  return (
    
    error ? <div>Error! {error.message}</div> :
    <StyledDiv>
      <Typography variant="h6" style={{fontWeight: 'bold', color: '#464646', display: 'flex', alignItems: 'center'}} gutterBottom>
        <Icon baseClassName='material-icons-round' onClick={() => navigate('/')} style={{marginRight: 10, cursor: 'pointer'}}>keyboard_backspace</Icon>
        My Profile</Typography>
      <Divider style={{marginBottom: 16 }} />
      {loading ? <CircularProgress size={28} color="inherit" /> : <>
      <StyledCard>
        <div className={classes.coverPic}></div>
        <Stack direction={matchesMD ? "column" : "row"}>
          <img src="https://picsum.photos/200" alt="profile pic" className={classes.profilepic} />
          <Stack style={{marginTop: matchesMD ? 10 : 100, marginLeft: matchesMD ? 0 : 30}}>
           <Typography variant="h6">{data.me.username}</Typography>
          </Stack>
          <span style={{flex: 1}}></span>
          { edit ? 
            <ContainedButton 
              onClick={() => setEdit(false)}
              style={{marginTop: matchesMD ? 10 : 100}}
            >
              Save Changes
            </ContainedButton> :
            <ContainedButton 
              onClick={() => setEdit(true)}
              style={{marginTop: matchesMD ? 10 : 100}}
            >
              Edit Profile
            </ContainedButton>
          }
        </Stack>
        <Typography variant="h6" style={{marginTop: '1rem'}}>Basic Info</Typography>
        <Stack direction={matchesMD ? "column" : "row"} alignItems="baseline" >
          <Typography color="GrayText" variant='body2' style={{width: 240, fontWeight: 'bold'}}>Username</Typography>
          <TextField 
            variant="outlined"
            size='small'
            disabled
            margin='none'
            style={{width: matchesMD ? '100%' : '50%', marginTop: matchesMD ? 10 : 20}}
            value={data.me.username}
          />
        </Stack>
        <Stack direction={matchesMD ? "column" : "row"} alignItems="baseline">
          <Typography color="GrayText" variant='body2' style={{width: 240, fontWeight: 'bold'}}>Email</Typography>
          <TextField 
            variant="outlined"
            size='small'
            margin='none'
            disabled
            style={{width: matchesMD ? '100%' : '50%', marginTop: matchesMD ? 10 : 20}}
            value={data.me.email}
          />
        </Stack>
        <Typography variant="h6" style={{marginTop: '1rem'}}>Shipping Address</Typography>
        <Stack direction={matchesMD ? "column" : "row"} alignItems="baseline">
          <Typography color="GrayText" variant='body2' style={{width: 240, fontWeight: 'bold'}}>Address Line</Typography>
          <TextField 
            variant="outlined"
            size='small'
            margin='none'
            disabled
            style={{width: matchesMD ? '100%' : '50%', marginTop: matchesMD ? 10 : 20}}
            value={data.me.addressLine}
          />
        </Stack>
        <Stack direction={matchesMD ? "column" : "row"} alignItems="baseline">
          <Typography color="GrayText" variant='body2' style={{width: 240, fontWeight: 'bold'}}>City</Typography>
          <TextField
            variant="outlined"
            size='small'
            margin='none'
            disabled
            style={{width: matchesMD ? '100%' : '50%', marginTop: matchesMD ? 10 : 20}}
            value={data.me.city}
          />
        </Stack>
        <Stack direction={matchesMD ? "column" : "row"} alignItems="baseline">
          <Typography color="GrayText" variant='body2' style={{width: 240, fontWeight: 'bold'}}>Pin Code</Typography>
          <TextField
            variant="outlined"
            size='small'
            margin='none'
            disabled
            style={{width: matchesMD ? '100%' : '50%', marginTop: matchesMD ? 10 : 20}}
            value={data.me.pinCode}
          />
        </Stack>
        <Stack direction={matchesMD ? "column" : "row"} alignItems="baseline">
          <Typography color="GrayText" variant='body2' style={{width: 240, fontWeight: 'bold'}}>State</Typography>
          <TextField
            variant="outlined"
            size='small'
            margin='none'
            disabled
            style={{width: matchesMD ? '100%' : '50%', marginTop: matchesMD ? 10 : 20}}
            value={data.me.state}
          />
        </Stack>
        <Stack direction={matchesMD ? "column" : "row"} alignItems="baseline">
          <Typography color="GrayText" variant='body2' style={{width: 240, fontWeight: 'bold'}}>Country</Typography>
          <TextField
            variant="outlined"
            size='small'
            margin='none'
            disabled
            style={{width: matchesMD ? '100%' : '50%', marginTop: matchesMD ? 10 : 20}}
            value={data.me.country}
          />
        </Stack>
        <Typography variant="body2" style={{alignSelf: 'center', fontWeight: 'bold', color: '#727272', marginTop: 40}}>
          Joined On {data.me.createdAt.split(',')[0]}
        </Typography>
      </StyledCard>
      </>}
      
    </StyledDiv>
  )
}

export default Profile