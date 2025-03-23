import React from 'react';
import { AppBar, Toolbar, Typography, Button, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#0078D4',
  },
  title: {
    flexGrow: 1,
    fontWeight: 'bold',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    marginLeft: theme.spacing(2),
  }
}));

const Header: React.FC = () => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          MediSync AI
        </Typography>
        <Link to="/" className={classes.navLink}>
          <Button color="inherit">Dashboard</Button>
        </Link>
        <Link to="/patients" className={classes.navLink}>
          <Button color="inherit">Patients</Button>
        </Link>
        <Link to="/documentation" className={classes.navLink}>
          <Button color="inherit">Documentation</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Header;