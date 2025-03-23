import React from 'react';
import { Card, CardContent, Typography, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  patientName: {
    fontWeight: 'bold',
  },
  patientInfo: {
    marginTop: theme.spacing(1),
  },
  actionButton: {
    marginTop: theme.spacing(2),
    backgroundColor: '#0078D4',
    color: 'white',
    '&:hover': {
      backgroundColor: '#106EBE',
    },
  },
}));

interface PatientCardProps {
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    mrn: string;
    medicalConditions?: string[];
  };
  onSelectPatient: (patientId: string) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onSelectPatient }) => {
  const classes = useStyles();

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSelect = () => {
    onSelectPatient(patient.id);
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.patientName}>
          {patient.firstName} {patient.lastName}
        </Typography>
        <Typography variant="body2" color="textSecondary" className={classes.patientInfo}>
          {calculateAge(patient.dateOfBirth)} yo {patient.gender.toLowerCase()} | MRN: {patient.mrn}
        </Typography>
        {patient.medicalConditions && patient.medicalConditions.length > 0 && (
          <Typography variant="body2" color="textSecondary" className={classes.patientInfo}>
            Conditions: {patient.medicalConditions.join(', ')}
          </Typography>
        )}
        <Button 
          variant="contained" 
          className={classes.actionButton} 
          onClick={handleSelect}
        >
          Select Patient
        </Button>
      </CardContent>
    </Card>
  );
};

export default PatientCard;