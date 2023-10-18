import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Grid, Container, Typography, Card, CardContent, Switch } from '@mui/material';
import Swal from 'sweetalert2';
import { getStoreDetails } from '../../store/reducers/store/storeDetailsSlice';
// components

// sections
import {
  AppWidgetSummary,

} from '../../sections/@dashboard/app';


// ----------------------------------------------------------------------

const errorMsg = (message = '') =>
    Swal.fire({
        title: `Error`,
        text: `${message}`,
        icon: 'error',
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
    });

export default function StoreDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, role, user } = useSelector((state) => state.auth);
  const { store } = useSelector(state => state.storeDetails)
  const [isSwitchOn, setIsSwitchOn] = useState(false);


  useEffect(() => {
    if (role !== 'Employee') {
      navigate('/dashboard/users');

    }

    dispatch(getStoreDetails(user?.store?.storeId)).then(() => {
      if(store.active){
        setIsSwitchOn(true);
      }else{
        setIsSwitchOn(false);
      }
     
    }).catch((error) => {
      errorMsg(error)
    });

    

  }, [dispatch, role, user,store.active])
  // console.log(store.active);

  const handleSwitchChange = (event) => {
    const newState = event.target.checked;
    setIsSwitchOn(newState);

    const message = newState ? 'open' : 'close';

    Swal.fire({
      title: `Store ${message.toUpperCase()}`,
      text: `Your store is now ${message}`,
      icon: 'success',
      timer: 1500,
      timerProgressBar: true,
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
    });




  };


  return (
    <>
      <Helmet>
        <title> Dashboard  </title>
      </Helmet>


      {user.role === "Employee" ? (
        <Container maxWidth="xl">
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <Card style={{ backgroundColor: isSwitchOn ? '#86CD82' : 'grey' }}>
                <CardContent>
                  <Typography variant="h4">
                    {isSwitchOn ? `Hi ${user?.store?.name} Store (Open)` : `Hi ${user?.store?.name} Store (Closed)`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
          <Grid item xs={12} >
            <Switch checked={isSwitchOn} onChange={handleSwitchChange} />
          </Grid>


          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3} >
              <Link to="/dashboard/users">
                <AppWidgetSummary title="Manage Menu" icon={'fluent-mdl2:task-manager'} />
              </Link>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Schedule Menu" color="info" icon={'uim:schedule'} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Inventory" color="warning" icon={'ant-design:windows-filled'} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Reservations" color="error" icon={'game-icons:card-pickup'} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Feedbacks" color="secondary" icon={'fluent:person-feedback-16-filled'} />
            </Grid>

          </Grid>
        </Container>
      ) :
        null
      }

    </>
  );
}
