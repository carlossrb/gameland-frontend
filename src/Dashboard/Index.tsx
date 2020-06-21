import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { LottieAnimation } from "../utils";
import TopBar from "./TopBar"

const Auth: React.FC = () => {

  
  return (
    <React.Fragment>
        <TopBar/>
      <Container>
        <Box my={2}>
          <LottieAnimation
            style={{ width: 600, marginTop: 40 }}
            name="pacman"
          />
        </Box>
      </Container>
    </React.Fragment>
  );
};

// import React from 'react'
// import { LottieAnimation } from '../utils';

// const Auth: React.FC = ()=>{
//     return(
//             <LottieAnimation  style={{width:600, marginTop: 40}} name='pacman'/>
//     )
// }

export default Auth;
