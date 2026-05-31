import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import * as yup from "yup";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

// Schema
const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  due_date: yup
    .string()
    .required("Due date is required")
    .transform((value) => {
      if (!value) return value;
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;
      return date.toISOString().split("T")[0];
    })
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

const GoalItem = ({ goal, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: goal.title,
      description: goal.description,
      due_date: goal.due_date,
    },
  });

  // Date formatting 
  function formatDueDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();

    const sameYear = date.getFullYear() === today.getFullYear();

    const options = { month: "long", day: "numeric" };
    if (!sameYear) {
      options.year = "numeric"; // only show year if not this year
    }

    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  const handleSave = (data) => {
    onUpdate(goal.id, data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <Card
      className="bg-white rounded-2xl shadow-md mb-4"
      sx={{
        backgroundColor: "#FDF9FF",
        border: "1px solid #E9D8FD",
        padding: 1,
      }}
    >
      <CardContent>
        <motion.div
          key={isEditing ? "form" : "view"}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {isEditing ? (
            <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
              <TextField
                fullWidth
                label="Title"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
                sx={{ backgroundColor: "#F3E8FF", borderRadius: "8px" }}
              />

              <TextField
                fullWidth
                label="Description"
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
                sx={{ backgroundColor: "#F3E8FF", borderRadius: "8px" }}
              />

              <TextField
                fullWidth
                type="date"
                label="Due Date"
                InputLabelProps={{ shrink: true }}
                {...register("due_date")}
                error={!!errors.due_date}
                helperText={errors.due_date?.message}
                sx={{ backgroundColor: "#F3E8FF", borderRadius: "8px" }}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: "#A78BFA",
                    "&:hover": { backgroundColor: "#8B5CF6" },
                    fontWeight: "bold",
                    borderRadius: "8px",
                  }}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{
                    color: "#6B21A8",
                    borderColor: "#D8B4FE",
                    fontWeight: "bold",
                    borderRadius: "8px",
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <>
              <Typography variant="h6" sx={{ color: "#6B21A8" }}>
                {goal.title}
              </Typography>

              <Typography variant="body2" className="mb-2 text-gray-700">
                {goal.description || "No description"}
              </Typography>

              <Typography
                variant="caption"
                className="text-sm text-gray-500 mb-4 block"
              >
                Due: {formatDueDate(goal.due_date)}
              </Typography>


              <div className="flex justify-end gap-2">
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(true)}
                  sx={{
                    color: "#6B21A8",
                    borderColor: "#D8B4FE",
                    fontWeight: "bold",
                    borderRadius: "8px",
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => onDelete(goal.id)}
                  sx={{ borderRadius: "8px" }}
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </motion.div>
        
      </CardContent>
    </Card>
  );
};

export default GoalItem;