import { Typography, IconButton, useTheme } from "@material-ui/core";
import { Link } from "react-router-dom";
import { NightsStay, WbSunny } from "@material-ui/icons";
import React from "react";

export interface DarkStateProps {
  setDarkState: React.Dispatch<React.SetStateAction<boolean>>;
  darkState: boolean;
  color?:string
  size?:"small"|"medium"
}

const Copyright: React.FC<DarkStateProps> = (props) => {
  const theme = useTheme();

  return (
    <div>
      <Typography variant="body2" color="textSecondary" align="center">
        <DarkMode {...props}  />
        {"Copyright © "}
        <Link style={{ color: theme.palette.primary.main }} to="/">
          Gameland.io
        </Link>{" "}
        {new Date().getFullYear()}
      </Typography>
    </div>
  );
};

// Seta darkmode na página de login
export function DarkMode(props: DarkStateProps) {
  const { darkState, setDarkState } = props;
  const theme = useTheme()
  const colorDefaut= theme.palette.text.secondary
  const handleThemeChange = () => {
    localStorage.setItem("darkMode", String(!darkState));
    setDarkState(!darkState);
  };

  return (
    <IconButton style={{color:props.color||colorDefaut}} size={props.size||"small"} onClick={handleThemeChange}>
      {!darkState ? (
        <NightsStay fontSize="inherit" />
      ) : (
        <WbSunny fontSize="inherit" />
      )}
    </IconButton>
  );
}

export default Copyright;
