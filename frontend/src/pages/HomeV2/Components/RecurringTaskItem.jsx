// MUI
import { Box, Typography } from "@mui/material"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import { IconButton } from "@mui/material"

const weekdayMap = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

const RecurringTaskItem = ({ task, days, deleteTaskItem, editTask }) => {  

    // Task editing and deletion will require the full task to be passed for the corresponding functions to work
    // These functions and capabilites can and will be handled soon

    return (
        <Box
        className="relative w-full rounded-2xl px-3 py-2"
        sx={{ backgroundColor: "background.paper" }}
        >
            {/* Main Content */}
            <div className="flex flex-col gap-10 pr-12">
                <Typography variant="h4" sx={{ fontSize: 30 }}>
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
                        }}
                        >
                        {weekdayMap[dayIndex]}
                        </Box>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-2">
                <IconButton
                    onClick={() => deleteTaskItem?.(task)}
                    sx={{
                    backgroundColor: "#9B0B16",
                    color: "black",
                    "&:hover": {
                        backgroundColor: "#7f0912",
                    },
                    width: 30,
                    height: 30,
                    }}
                >
                    <DeleteOutlineIcon fontSize="small" />
                </IconButton>

                <IconButton
                    onClick={() => editTask?.(task)}
                    sx={{
                    backgroundColor: "#EBBE4D",
                    color: "black",
                    "&:hover": {
                        backgroundColor: "#d4a93f",
                    },
                    width: 30,
                    height: 30,
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            </div>
        </Box>
    )
}

export default RecurringTaskItem