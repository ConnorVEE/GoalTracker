import { React, useState, useContext } from 'react';
// Utilities
import { getLocalDateString, formatCurrentDate } from "../../utils/DateUtils.js";
// Context/hook
import { AuthContext } from "../../contexts/AuthContext.jsx";
// MUI 
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton, Menu, MenuItem } from '@mui/material';

const PageIntro = ( { user } ) => {
    const { logout } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getGreeting = () => {
        const hour = getLocalDateString(new Date(), { hour: 'numeric', hour12: false }).split(':')[0];
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="p-4 rounded flex items-center justify-between w-full">
            
            {/* Greeting and User Name */}
            <h2 className="text-lg font-semibold flex-1 text-left">
                {getGreeting()}
                {user?.first_name ? `, ${user.first_name}` : ""}
            </h2>

            {/* Date  */}
            <h2 className="text-lg font-semibold flex-1 text-center">
                Today is {formatCurrentDate(new Date())}
            </h2>

            {/* Settings menu */}
            <div className="flex-1 text-right">
                <IconButton
                    onClick={handleClick}
                    sx={{
                        boxShadow: 2,
                        color: "text.primary",
                        "&:hover": {
                            color: "text.softText",
                        },
                        width: 27.5,
                        height: 27.5,
                    }}
                >
                    <SettingsIcon />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
            </div>
        </div>
    );
};

export default PageIntro;