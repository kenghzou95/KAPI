import logo from './logo.svg';
import './App.css';
import Header from './Header'
import Box from '@mui/material/Box';

import CssBaseline from "@mui/material/CssBaseline";

import { ThemeProvider } from "@mui/material/styles";
import theme from "assets/theme";
import AppRoutes from "AppRoutes"



function App() {


  return (
    <div className="App" style={{ background: 'linear-gradient(to right bottom, #eee,  #eee, #eee)' }}>
      {/* <ThemeProvider theme={theme}> */}
      <CssBaseline />
      <Header></Header>
      <Box sx={{ display: 'flex' }}>


        <Box component="main" sx={{ flexGrow: 1, padding: '95px 24px' }}>

          <AppRoutes ></AppRoutes>
        </Box>

      </Box>

      {/* </ThemeProvider> */}
    </div>

  );
}


export default App;
