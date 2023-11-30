import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MobileNet Image Classification
        </Typography>
        <Button href='/' color="inherit">Home</Button>
        <Button href='/accuracy' color="inherit">Evaluate Model</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;