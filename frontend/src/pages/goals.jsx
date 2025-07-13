import React, { useState, useEffect } from "react";
import { getGoals, createGoal, updateGoal, deleteGoal } from "../api/goalRoutes";
import GoalForm from "../components/goals/goalForm";
import GoalList from "../components/goals/goalList";
import { Typography, Container, Box, Snackbar, Alert } from "@mui/material";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const loadGoals = async () => {
    try {
      const res = await getGoals();
      setGoals(res.data);
    } catch (err) {
      console.error("Failed to load goals:", err);
      showSnackbar("Failed to load goals", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSave = async (goalData) => {
    try {
      await createGoal(goalData);
      showSnackbar("Goal created!");

      loadGoals();
    } catch (err) {
      console.error("Create failed:", err);
      showSnackbar("Failed to create goal", "error");
      
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updateGoal(id, updatedData);
      showSnackbar("Goal updated!");
      loadGoals();
    } catch (err) {
      console.error("Failed to update goal:", err);
      showSnackbar("Failed to update goal", "error");
    }
  };

  const handleDelete = async (goalId) => {
    try {
      await deleteGoal(goalId);
      showSnackbar("Goal deleted!");
      loadGoals();
    } catch (err) {
      console.error("Delete failed:", err);
      showSnackbar("Failed to delete goal", "error");
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  return (
    <Container maxWidth="xlg" sx={{ py: 4 }}>

      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#6A4C93" }}>
        Your Goals
      </Typography>

      <Box sx={{ mb: 4 }}>

        <Typography variant="h6" sx={{ mb: 2, color: "#9370DB" }}>
          Create a New Goal
        </Typography>

        <GoalForm onSave={handleSave} />
      </Box>

      <GoalList goals={goals} onUpdate={handleUpdate} onDelete={handleDelete} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default Goals;