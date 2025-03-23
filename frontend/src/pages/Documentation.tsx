import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Typography, Button, TextField, Grid, 
  Paper, CircularProgress, makeStyles 
} from '@material-ui/core';
import { Mic, MicOff, Save } from '@material-ui/icons';
import { getPatientById, transcribeSpeech, generateNote } from '../services/api';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  buttonGroup: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  recordingButton: {
    margin: theme.spacing(1),
    backgroundColor: '#d32f2f',
    color: 'white',
    '&:hover': {
      backgroundColor: '#b71c1c',
    },
  },
  transcriptionBox: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    minHeight: '100px',
    backgroundColor: '#f5f5f5',
  },
  generatedNoteBox: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    minHeight: '200px',
    backgroundColor: '#e3f2fd',
  },
}));

const Documentation: React.FC = () => {
  const classes = useStyles();
  const [patientId, setPatientId] = useState('');
  const [patient, setPatient] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [generatedNote, setGeneratedNote] = useState('');
  const [loading, setLoading] = useState(false);
  
  // For MVP, we'll use browser's MediaRecorder API
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Load patient data when patientId changes
  useEffect(() => {
    if (patientId) {
      const fetchPatient = async () => {
        try {
          const response = await getPatientById(patientId);
          setPatient(response.data);
        } catch (error) {
          console.error('Error fetching patient:', error);
        }
      };

      fetchPatient();
    }
  }, [patientId]);

  // Start recording function
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };
      
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Process the recorded audio
  const processAudio = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      // For MVP, we'll simulate transcription response
      // In production, uncomment the API call to your Azure Function
      /*
      const response = await transcribeSpeech(audioBlob);
      setTranscription(response.data.transcription);
      */
      
      // Simulated response for MVP
      setTimeout(() => {
        setTranscription("Patient reports feeling better since starting the new medication. Blood pressure has been stable, averaging around 130/85. No side effects from the medication. Has been walking 30 minutes daily as recommended.");
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error processing audio:', error);
      setLoading(false);
    }
  };

  // Generate clinical note from transcription
  const handleGenerateNote = async () => {
    if (!transcription || !patient) return;
    
    setLoading(true);
    try {
      // For MVP, we'll simulate note generation response
      // In production, uncomment the API call to your Azure Function
      /*
      const patientContext = `${patient.firstName} ${patient.lastName}, ${patient.gender}, DOB: ${patient.dateOfBirth}. Medical conditions: ${patient.medicalConditions.join(', ')}`;
      
      const response = await generateNote({
        transcription,
        patientId: patient.id,
        patientContext,
        providerId: 'provider-001' // Mock provider ID for MVP
      });
      
      setGeneratedNote(response.data.document.generatedContent);
      */
      
      // Simulated response for MVP
      setTimeout(() => {
        setGeneratedNote(`
        # CLINICAL NOTE
        
        ## Patient Information
        Name: ${patient.firstName} ${patient.lastName}
        DOB: ${patient.dateOfBirth}
        MRN: ${patient.mrn}
        
        ## Subjective
        Patient reports feeling better since starting the new medication. Blood pressure has been stable, averaging around 130/85. No side effects from the medication. Has been walking 30 minutes daily as recommended.
        
        ## Objective
        Vital Signs:
        - BP: 130/85 (average, self-reported)
        - No reported adverse effects from medication
        
        ## Assessment
        1. Hypertension - Improving with current treatment regimen
        2. Medication adherence - Good
        3. Exercise compliance - Good
        
        ## Plan
        1. Continue current medication regimen
        2. Maintain daily walking routine of 30 minutes
        3. Follow-up in 3 months
        4. Call office if any concerns arise
        `);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating note:', error);
      setLoading(false);
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        Clinical Documentation
      </Typography>
      
      <Paper className={classes.paper}>
        <Typography variant="h6">
          Patient Information
        </Typography>
        <TextField
          fullWidth
          label="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          margin="normal"
          variant="outlined"
          placeholder="Enter patient ID to load information"
        />
        
        {patient && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Name:</strong> {patient.firstName} {patient.lastName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>MRN:</strong> {patient.mrn}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>DOB:</strong> {patient.dateOfBirth}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Gender:</strong> {patient.gender}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Paper>
      
      <Paper className={classes.paper}>
        <Typography variant="h6">
          Voice Transcription
        </Typography>
        
        <div className={classes.buttonGroup}>
          {!isRecording ? (
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<Mic />}
              onClick={startRecording}
              disabled={!patient || loading}
            >
              Start Recording
            </Button>
          ) : (
            <Button
              variant="contained"
              className={classes.recordingButton}
              startIcon={<MicOff />}
              onClick={stopRecording}
            >
              Stop Recording
            </Button>
          )}
        </div>
        
        {loading && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <CircularProgress />
            <Typography variant="body2" style={{ marginTop: '10px' }}>
              Processing...
            </Typography>
          </div>
        )}
        
        <div className={classes.transcriptionBox}>
          <Typography variant="body1">
            {transcription || 'Transcription will appear here...'}
          </Typography>
        </div>
        
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleGenerateNote}
          disabled={!transcription || loading}
        >
          Generate Clinical Note
        </Button>
      </Paper>
      
      {generatedNote && (
        <Paper className={classes.paper}>
          <Typography variant="h6">
            Generated Clinical Note
          </Typography>
          
          <div className={classes.generatedNoteBox}>
            <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
              {generatedNote}
            </pre>
          </div>
          
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<Save />}
          >
            Save Note
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default Documentation