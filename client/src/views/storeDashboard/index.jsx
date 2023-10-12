import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Grid, Container, Typography, Card, CardContent, Box, Switch } from '@mui/material';
import Swal from 'sweetalert2';
// components

// sections
import {
  AppWidgetSummary,

} from '../../sections/@dashboard/app';


// ----------------------------------------------------------------------

export default function StoreDashboard() {
 
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const handleSwitchChange = (event) => {
    const newState = event.target.checked;
    setIsSwitchOn(newState);

    const message = newState ? 'open' : 'close';
    const color = newState ? 'green' : 'grey';

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

      <Container maxWidth="xl">
   
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <Card style={{ backgroundColor: isSwitchOn ? '#86CD82' : 'grey' }}>
            <CardContent>
              <Typography variant="h4">
                {isSwitchOn ? "Hi Julie's Store (Open)" : "Hi Julie's Store (Closed)"}
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
            <AppWidgetSummary title="Manage Menu"  icon={'fluent-mdl2:task-manager'} />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Schedule Menu"  color="info" icon={'uim:schedule'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Inventory"  color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Reservations"  color="error" icon={'game-icons:card-pickup'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Feedbacks"  color="secondary" icon={'fluent:person-feedback-16-filled'} />
          </Grid>

      
         

        </Grid>
      </Container>
    </>
  );
}
