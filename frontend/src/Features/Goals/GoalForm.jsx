import { useState } from "react";
// MUI
import { Box, Typography, IconButton, TextField } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

const GoalForm = ({ isSaving, error, onCancel, onSubmit, initialTitle, initialDescription, initialDate }) => {
    const [titleDraft, setTitleDraft] = useState(initialTitle || "")
    const [descriptionDraft, setDescriptionDraft] = useState(initialDescription || "")
    const [dateDraft, setDateDraft] = useState(initialDate ? dayjs(initialDate) : null);
    const [touched, setTouched] = useState(false);
    const titleError = titleDraft.trim() === "";
    const descriptionError = descriptionDraft.trim() === "";
    const isValid = !titleError && !descriptionError && dateDraft !== null;

    const formErrors = {
        title: (error?.field === "title" && error.message) || (titleError ? "Title cannot be empty" : ""),
        description: (error?.field === "description" && error.message) || (descriptionError ? "Description cannot be empty" : ""),
        server: error?.type === "server" ? error.message : ""
    };

    const handleSubmit = () => {
        if (!isValid || isSaving) return;

        console.log("Submitting edit with date:", dateDraft ? dateDraft.format("YYYY-MM-DD") : "No date selected")

        onSubmit({
            title: titleDraft,
            description: descriptionDraft,
            due_date: dateDraft.format("YYYY-MM-DD"),
        })
    }

    return (
        <Box
            className="relative w-full rounded-2xl px-2 py-1"
        >
            {/* Entry fields */}
            <div className="flex flex-col gap-8 pr-12">
                {/* Title field */}
                <TextField
                    fullWidth
                    label="Goal Title"
                    value={titleDraft}
                    onChange={(e) => !isSaving && setTitleDraft(e.target.value)}
                    onBlur={() => setTouched(true)}
                    error={touched && Boolean(formErrors.title)}
                    helperText={touched ? formErrors.title : ""} 
                />

                {/* Description field */}
                <TextField
                    fullWidth
                    label="Goal Description"
                    multiline
                    rows={4}
                    value={descriptionDraft}
                    onChange={(e) => !isSaving && setDescriptionDraft(e.target.value)}
                    onBlur={() => setTouched(true)}
                    error={touched && Boolean(formErrors.description)}
                    helperText={touched ? formErrors.description : ""} 
                />

                {/* Date field */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Due Date"
                        value={dateDraft}
                        onChange={(newValue) => setDateDraft(newValue)}
                        disabled={isSaving}
                    />
                </LocalizationProvider>

                {/* Server Errors */}
                {formErrors.server && (
                    <Typography color="error" variant="caption" sx={{ mt: -2 }}>
                        {formErrors.server}
                    </Typography>
                )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-1 right-1 flex flex-col gap-2">
                {/* Cancel button */}
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

                {/* Save button */}
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

export default GoalForm;