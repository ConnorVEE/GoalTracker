import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// Validation schema
const schema = yup.object().shape({
  title: yup.string()
    .required("Title is required")
    .max(45, "Title cannot exceed 30 characters"),
});

export default function QuickAddTask({ onSave }) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const inputElRef = useRef(null); 

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "" },
  });

  const handleSave = (data) => {
    onSave(data.title);
    reset();
    setShowQuickAdd(false);
  };

  const handleCancel = () => {
    reset();
    setShowQuickAdd(false);
  };

  const variants = {
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
  };

  return (
    <div className="w-full max-w-3xl mt-6 mb-4">
      <AnimatePresence mode="wait">
        
        {!showQuickAdd ? (
          <motion.div
            key="add-button"
            layout
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex justify-center"
          >

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                variant="contained"
                onClick={() => setShowQuickAdd(true)}
                sx={{
                  backgroundColor: "#A78BFA",
                  "&:hover": { backgroundColor: "#8B5CF6" },
                  color: "white",
                  padding: "10px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}
              >
                + Add Task
              </Button>
            </motion.div>

          </motion.div>
        ) : (
          <motion.form
            key="add-form"
            layout
            variants={variants}
            initial="exit"
            animate="enter"
            exit="exit"
            transition={{ duration: 0.18 }}
            onAnimationComplete={() => {

              requestAnimationFrame(() => {
                inputElRef.current?.focus?.();
              });
            }}

            onSubmit={handleSubmit(handleSave)}
            className="flex items-center gap-2"
          >
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  inputRef={(el) => {
                    if (typeof field.ref === "function") field.ref(el);
                    else if (field.ref) field.ref.current = el;
                    inputElRef.current = el;
                  }}
                  fullWidth
                  label="Task title"
                  variant="outlined"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  sx={{
                    backgroundColor: "#F3E8FF",
                    borderRadius: "8px",
                  }}
                />
              )}
            />

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
              type="button"
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

          </motion.form>
        )}

      </AnimatePresence>
    </div>
  );
}