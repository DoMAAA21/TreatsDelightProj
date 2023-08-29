import React from 'react';
import { TableCell, Skeleton, Grid, Card, CardContent } from '@mui/material';

export const SkeletonTableLoader = () => {
  return (
 <>
  <Grid>
    <Card>
      

      
   <Skeleton
          variant="rectangular"
          height={300}
          animation="wave"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '8px',
          }}
        />
    </Card>
  </Grid>
 </>
  );
};


