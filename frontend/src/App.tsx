import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@material-ui/core';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Documentation from './pages/Documentation';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0078D4',
    },
    secondary: {
      main: '#2B88D8',
    },
  },
  typography: {
    fontFamily: [
      'Segoe UI',
      '-apple-system',
      'BlinkMacSystemFont',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
