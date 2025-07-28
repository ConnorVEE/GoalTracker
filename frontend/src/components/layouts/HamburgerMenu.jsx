import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

import MenuIcon from "@mui/icons-material/Menu";
import {
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Typography,
} from "@mui/material";

const HamburgerMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    <div className="absolute top-4 left-4 z-50">
      <IconButton onClick={handleOpen} sx={{ color: "#6A4C93" }}>
        <MenuIcon fontSize="large" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleNavigate("/home")}>Home</MenuItem>
        <MenuItem onClick={() => handleNavigate("/tasks")}>Tasks</MenuItem>
        <MenuItem onClick={() => handleNavigate("/goals")}>Goals</MenuItem>

        <Divider />

        <MenuItem onClick={logout}>
          <Typography color="error">Logout</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default HamburgerMenu;