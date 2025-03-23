import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, 
  makeStyles, CircularProgress 
} from '@material-ui/core';
import { getPatients } from '../services/api';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  cardValue: {
    marginTop: theme.spacing(1),
    fontWeight: 'bold',
    fontSize: 24,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
}));

const Dashboard: React.FC = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [patientCount, setPatientCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getPatients();
        setPatientCount(response.data.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        Provider Dashboard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.cardTitle}>
                Total Patients
              </Typography>
              <Typography className={classes.cardValue}>
                {patientCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.cardTitle}>
                Today's Appointments
              </Typography>
              <Typography className={classes.cardValue}>
                {5} {/* Mock data for MVP */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.cardTitle}>
                Pending Documents
              </Typography>
              <Typography className={classes.cardValue}>
                {3} {/* Mock data for MVP */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.cardTitle}>
                Tasks
              </Typography>
              <Typography className={classes.cardValue}>
                {7} {/* Mock data for MVP */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard