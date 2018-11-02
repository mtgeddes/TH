import React from "react";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  }
});

const CustomizedInputs = (props) => {
  const { classes } = props;

  return <InputBase className={classes.margin} defaultValue='hello'/>;
}

const Input = withStyles(styles)(CustomizedInputs)

export default Input;