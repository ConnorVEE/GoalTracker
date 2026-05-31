import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button } from "@mui/material";

// Validation schema
const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  due_date: yup
    .string()
    .required("Due date is required")
    .transform((value) => {
      // In case the browser gives us a full ISO string, normalize it to YYYY-MM-DD
      if (!value) return value;
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;
      return date.toISOString().split("T")[0]; // ← Converts to 'YYYY-MM-DD'
    })
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

const GoalForm = ({ onSave }) => {
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      due_date: "",
    },
  });

  const onSubmit = (data) => {
    onSave(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl shadow-md p-6 mb-6 max-w-xl mx-auto"
    >
      <h2 className="text-xl font-semibold text-center text-purple-700 mb-4">
        Create a New Goal
      </h2>

      <div className="space-y-4">
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          {...register("title")}
          error={!!errors.title}
          helperText={errors.title?.message}
          sx={{ backgroundColor: "#F3E8FF", borderRadius: "8px" }}
        />

        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
          sx={{ backgroundColor: "#F3E8FF", borderRadius: "8px" }}
        />

        <TextField
          fullWidth
          type="date"
          label="Due Date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          {...register("due_date")}
          error={!!errors.due_date}
          helperText={errors.due_date?.message}
          sx={{ backgroundColor: "#F3E8FF", borderRadius: "8px" }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#A78BFA",
            "&:hover": { backgroundColor: "#8B5CF6" },
            color: "white",
            padding: "5px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          {isSubmitting ? "Saving..." : "Save Goal"}
        </Button>
      </div>
    </form>
  );
};

export default GoalForm;