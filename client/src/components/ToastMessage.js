import React from "react";
import { Box, Toast } from "gestalt";

const ToastMessage = ({ show, message }) =>
//if show is true then we show else none
  show && (
    <Box
      dangerouslySetInlineStyle={{
        __style: {
          bottom: 250,
          left: "50%",
          transform: "translateX(-50%)"
        }
      }}
      position="fixed"
    >
      <Toast  color="orange" text={message} />
    </Box>
  );

export default ToastMessage;
