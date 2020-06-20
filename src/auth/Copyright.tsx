import { Typography, IconButton, useTheme } from "@material-ui/core";
import { Link } from "react-router-dom";
import { NightsStay, Brightness5 } from "@material-ui/icons";
import React from "react";

export interface DarkStateProps {
  setDarkState: React.Dispatch<React.SetStateAction<boolean>>;
  darkState: boolean;
}

// Seta darkmode na página de login
const Copyright: React.FC<DarkStateProps> = (props) => {
  const theme = useTheme();
  const { darkState, setDarkState } = props;

  const handleThemeChange = () => {
    localStorage.setItem("darkMode", String(!darkState));
    setDarkState(!darkState);
  };

  return (
    <div>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link
          style={{ color: theme.palette.primary.main }}
          to="/"
        >
          Gameland.io
        </Link>{" "}
        {new Date().getFullYear()}{" "}
        <IconButton
          style={{ marginBottom: 5 }}
          size="small"
          onClick={handleThemeChange}
        >
          {!darkState ? (
            <NightsStay fontSize="inherit" />
          ) : (
            <Brightness5 fontSize="inherit" />
          )}
        </IconButton>
      </Typography>
    </div>
  );
};

export default Copyright;
