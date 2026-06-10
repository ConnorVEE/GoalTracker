import { useState } from "react"
// Components
import GoalForm from "./GoalForm.jsx";
// MUI
import { Box, Typography, IconButton } from "@mui/material"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
// Date Utility
import { formatFullDate } from "../../utils/DateUtils.js";

const GoalItem = ({ goal, isEditing, isSaving, error, onStartEdit, onCancelEdit, onSaveEdit, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (isEditing) {
        return (
            <GoalForm
                isSaving={isSaving}
                error={error}
                onCancel={onCancelEdit}
                onSubmit={(updatedData) => onSaveEdit(goal, updatedData)}
                initialTitle={goal.title}
                initialDescription={goal.description}
                initialDate={goal.due_date}
            />
        )
    }
    
    return (
        <Box
        className="relative w-full rounded-2xl px-2 py-1"
        sx={{ backgroundColor: "background.lev2" }}
        >

            {/* Title and Goal Info */}
            <div className="pr-10">
                <Typography className="py-1" variant="h4" sx={{ fontSize: 28 }}>
                    {goal.title}
                </Typography>

                {/* Description and due date */}
                <Typography className="py-1" variant="body1" sx={{ fontSize: 16, color: "text.secondary" }}>
                    {goal.description}
                </Typography>

                <Typography className="py-1" variant="body2" sx={{ fontSize: 14, color: "text.disabled" }}>
                    Due {formatFullDate(goal.due_date)}
                </Typography>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-1 right-1 flex flex-col gap-2">
                <IconButton
                    onClick={() => onDelete?.(goal)}
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
                    onClick={() => onStartEdit?.(goal.id)}
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

export default GoalItem;