import React, { useState } from "react";
// MUI
import { Box, Typography, IconButton, TextField, FormControl, FormHelperText } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

const weekdayMap = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

const RecurringTasksForm = ({ isSaving, error, onCancel, onSubmit, initialTitle, initialDays }) => {
    const [titleDraft, setTitleDraft] = useState(initialTitle || "")
    const [daysOfWeekDraft, setDaysOfWeekDraft] = useState(initialDays || [])
    const titleError = titleDraft.trim() === "";
    const daysError = daysOfWeekDraft.length === 0;
    const isValid = !titleError && !daysError;

    const toggleDay = (dayIndex) => {
        if (isSaving) return; // Prevent changes while saving

        setDaysOfWeekDraft(prev => {
            if (prev.includes(dayIndex)) {
            return prev.filter(d => d !== dayIndex)
            } else {
            return [...prev, dayIndex].sort((a, b) => a - b)
            }
        })
    };

    const formErrors = {
        title: (error?.field === "title" && error.message) || (titleError ? "Title cannot be empty" : ""),
        days: daysError ? "Please select at least one day" : "",
        server: error?.type === "server" ? error.message : ""
    };

    const handleSubmit = () => {
        if (!isValid || isSaving) return;

        onSubmit({
            title: titleDraft,
            recurrence_rule: {
            days_of_week: daysOfWeekDraft
            }
        })
    }

    return (
        <Box
        className="relative w-full rounded-2xl px-2 py-1"
        sx={{ backgroundColor: "background.paper" }}
        >
            {/* Entry fields */}
            <div className="flex flex-col gap-8 pr-12">
                {/* Title field */}
                <TextField
                    fullWidth
                    label="Task Title"
                    value={titleDraft}
                    onChange={(e) => !isSaving && setTitleDraft(e.target.value)}
                    error={Boolean(formErrors.title)}
                    helperText={formErrors.title} 
                />

                {/* Weekday Selector */}
                <FormControl error={Boolean(formErrors.days)} variant="standard">
                    <div className="flex gap-1 flex-wrap">
                        {weekdayMap.map((label, index) => {
                            const isSelected = daysOfWeekDraft.includes(index);
                            return (
                                <Box
                                    key={index}
                                    onClick={() => toggleDay(index)}
                                    className="flex items-center justify-center px-3 rounded-full"
                                    sx={{
                                        height: 26,
                                        cursor: "pointer",
                                        backgroundColor: isSelected ? "#29333A" : "rgba(255, 255, 255, 0.1)",
                                        color: "#F4F0E1",
                                        border: isSelected ? "1px solid #29333A" : "1px solid rgba(255, 255, 255, 0.3)",
                                        fontSize: 14,
                                        fontWeight: 500,
                                    }}
                                >
                                    {label}
                                </Box>
                            );
                        })}
                    </div>
                    {formErrors.days && <FormHelperText>{formErrors.days}</FormHelperText>}
                </FormControl>

                {/* Server Errors */}
                {formErrors.server && (
                    <Typography color="error" variant="caption" sx={{ mt: -2 }}>
                        {formErrors.server}
                    </Typography>
                )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-1 right-1 flex flex-col gap-2">
                <IconButton
                    onClick={() => onCancel?.()}
                    sx={{
                    boxShadow: 2,
                    backgroundColor: "#9B0B16",
                    color: "black",
                    "&:hover": {
                        backgroundColor: "#7f0912",
                    },
                    width: 27.5,
                    height: 27.5,
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>

                <IconButton
                    disabled={isSaving || !isValid}
                    onClick={handleSubmit}
                    sx={{
                        boxShadow: 2,
                        backgroundColor: "#548E48",
                        color: "black",
                        "&:hover": {
                            backgroundColor: "#46763C",
                        },
                        width: 27.5,
                        height: 27.5,
                    }}
                >
                    <DoneIcon fontSize="small" />
                </IconButton>
            </div>

        </Box>
        
    )
}

export default RecurringTasksForm;