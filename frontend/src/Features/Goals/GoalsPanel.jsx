import { useContext, useState, useEffect, use } from 'react';
// Contexts
import { GoalContext } from "./Contexts/GoalContext.jsx";
// Components
import GoalItem from "./GoalItem.jsx";
import GoalForm from "./GoalForm.jsx";
// MUI
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, Modal } from '@mui/material';
import { shadows } from '@mui/system';

const GoalsPanel = () => {
  const { goals, fetchGoals, deleteGoalItem, editGoal, loading, addGoal } = useContext(GoalContext);
  const [editingGoalId, setEditingGoalId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isCreating, setIsCreating] = useState(false) 
  const [error, setError] = useState(null)

  // Handlers for delete and creating modals must go here
  const handleDelete = async (goal) => {
    setError(null)

    if (!window.confirm("Are you sure you want to delete this goal? This action cannot be undone")) {
      return;
    }

    try {
      await deleteGoalItem(goal.id)
      if (editingGoalId === goal.id) {
        setEditingGoalId(null)
      }
      
    } catch (err) {
      console.error("Failed to delete goal:", err)
      setError({
        type: "server",
        message: "Failed to delete goal. Please try again."
      })

    }
  }

  const onSaveEdit = async (goal, updatedData) => {
    setIsSaving(true)
    setError(null)

    try {
      await editGoal( goal, {
        ...updatedData,
        due_date: goal.due_date,
      })
      setEditingGoalId(null)

    } catch (err) {
      console.error("Failed to save goal edit:", err)

      setError({
        type: "server",
        message: "Failed to save changes. Please try again."
      })

    } finally {
      setIsSaving(false)
    }
  }

  const onAddGoal = async (newData) => {
    setIsSaving(true)
    setError(null)

    try {
      await addGoal({
        ...newData,
        due_date: new Date().toISOString().split("T")[0],
      })
      setIsCreating(false)

    } catch (err) {
      console.error("Failed to add goal:", err)

      setError({
        type: "server",
        message: "Failed to create goal. Please try again."
      })

    } finally {
      setIsSaving(false)
    }
  }

  const handleStartEdit = (taskID) => {
    setError(null)
    setEditingGoalId(taskID)
  }

  const handleCancelEdit = () => {
    setError(null)
    setEditingGoalId(null)
  }

  useEffect(() => {
    if (fetchGoals) {
      fetchGoals();
    }
  }, [fetchGoals]);

  return (
    <div>
        <div className="w-full border-t-2 border-[#678498]">
          
          <Box>
            <Accordion 
              disableGutters 
              elevation={0} 
              sx={{
                backgroundColor: "transparent",
                "&:before": { display: "none" },
              }}
            >

              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />} 
                className="px-0"
                sx={{
                  '& .MuiAccordionSummary-content': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 2, 
                    width: '100%',
                  }
                }}
              >
                <Box display="flex" alignItems="center">
                  <h2 className="font-semibold text-lg">Goals</h2>
                  <h2 className="ml-2 text-md">{`-- ${goals.length} --`}</h2>
                </Box>

                <Button 
                  variant="outlined" 
                  endIcon={<AddIcon />} 
                  color="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCreating(true);
                  }}
                >
                  Create
                </Button>
              </AccordionSummary>
                  
              <AccordionDetails className="px-0">
                  {loading ? (
                    <div className="flex justify-center p-4">
                      <CircularProgress size={24} /> 
                    </div>

                  ) : (
                    <div className="flex flex-row flex-wrap gap-4">
                      {goals.length > 0 ? (
                        goals.map((goal) => (
                          <Box
                            key={goal.id}
                            sx={{
                              p: 2, borderRadius: 2,
                              backgroundColor: "background.lev2",
                              display: "flex", alignItems: "center",
                              justifyContent: "space-between",
                              boxShadow: 3,
                            }}
                            className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1rem)]"
                          >

                            <GoalItem 
                              goal = {goal}
                              isEditing = {editingGoalId === goal.id}
                              isSaving = {isSaving}
                              error = {error}
                              onStartEdit={() => handleStartEdit(goal.id)}
                              onCancelEdit={handleCancelEdit}
                              onSaveEdit={onSaveEdit}
                              onDelete={() => handleDelete(goal)}
                            />
                            
                          </Box>

                        ))
                      ) : (
                        <p className="italic">No goals found</p>
                      )}
                    </div>
                  )}
              </AccordionDetails>

            </Accordion>
          </Box>

          {/* Create Modal */}
          <Modal
            open={isCreating}
            onClose={() => setIsCreating(false)}
            aria-labelledby="create-goal-modal-title"
            aria-describedby="create-goal-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: 500 },
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 2,
              }}
            >
              <GoalForm
                isSaving={isSaving}
                error={error}
                onCancel={() => setIsCreating(false)}
                onSubmit={onAddGoal}
                initialTitle=""
                initialDescription=""
              />
            </Box>

          </Modal>

        </div>

    </div>

  );
};

export default GoalsPanel;