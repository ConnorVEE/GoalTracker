import RecurringTasksForm from "./RecurringTasksForm.jsx";
// MUI
import { Box, Typography, IconButton } from "@mui/material"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"

const weekdayMap = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

const RecurringTaskItem = ({ task, isEditing, isSaving, error, onStartEdit, onCancelEdit, onSaveEdit, onDelete }) => {  

    if (isEditing) {
        return(
            <RecurringTasksForm
                isSaving={isSaving}
                error={error}
                onCancel={onCancelEdit}
                onSubmit={(updatedData) => onSaveEdit(task, updatedData)}
                initialTitle={task.title}
                initialDays={task.recurrence_rule?.days_of_week || []}
            />
        )
    }

    return (
        <Box
        className="relative w-full rounded-2xl px-2 py-1"
        >
            {/* Title and Recurrence Info */}
            <div className="flex flex-col gap-10 pr-12">
                <Typography variant="h4" sx={{ fontSize: 28 }}>
                    {task.title}
                </Typography>

                <div className="flex gap-1 flex-wrap">
                    {task.recurrence_rule?.days_of_week?.map((dayIndex) => (
                        <Box
                        key={dayIndex}
                        className="flex items-center justify-center px-3 rounded-full"
                        sx={{
                            height: 26,
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                            fontSize: 14,
                            fontWeight: 500,
                            boxShadow: 2,
                        }}
                        >
                        {weekdayMap[dayIndex]}
                        </Box>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-1 right-1 flex flex-col gap-2">
                <IconButton
                    onClick={() => onDelete?.(task)}
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
                    <DeleteOutlineIcon fontSize="small" />
                </IconButton>

                <IconButton
                    onClick={() => onStartEdit?.(task.id)}
                    sx={{
                        boxShadow: 2,
                        backgroundColor: "#EBBE4D",
                        color: "black",
                        "&:hover": {
                            backgroundColor: "#d4a93f",
                        },
                        width: 27.5,
                        height: 27.5,
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            </div>
        </Box>
    )
}

export default RecurringTaskItem;