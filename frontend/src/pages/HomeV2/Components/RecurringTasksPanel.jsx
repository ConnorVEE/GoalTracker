import { useContext, useState, useEffect } from 'react';
// Contexts
import { TaskContext } from "../../../contexts/TaskContext";
// components
import RecurringTaskItem from "./RecurringTaskItem.jsx";
import RecurringTasksForm from './RecurringTasksForm.jsx';
// MUI
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, Modal } from '@mui/material';

const RecurringTasksPanel = () => {
  const { recurringTasks, fetchRecurringTasks, deleteTaskItem, editTask, loading, addTask } = useContext(TaskContext);
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async (task) => {
    setError(null)

    if (!window.confirm("Are you sure you want to delete this recurring task? This action cannot be undone")) {
      return;
    }

    try {
      await deleteTaskItem(task)
      if (editingTaskId === task.id) {
        setEditingTaskId(null)
      }
      
    } catch (err) {
      console.error("Failed to delete task:", err)
      setError({
        type: "server",
        message: "Failed to delete task. Please try again."
      })

    }
  }

  const onSaveEdit = async (task, updatedData) => {
    setIsSaving(true)
    setError(null)

    try {
      await editTask(task, updatedData)
      setEditingTaskId(null)

    } catch (err) {
      console.error("Failed to save task edit:", err)

      setError({
        type: "server",
        message: "Failed to save changes. Please try again."
      })

    } finally {
      setIsSaving(false)
    }
  }

  const onAddTask = async (newData) => {
    setIsSaving(true)
    setError(null)

    console.log("Adding new recurring task with data:", newData)
    try {
      await addTask({ 
        ...newData,
        date: null, 
      });
      
      setIsCreating(false)

    } catch (err) {
      console.error("Failed to create task:", err)

      setError({
        type: "server",
        message: "Failed to create task. Please try again."
      })

    } finally {
      setIsSaving(false)
    }
  }

  const handleStartEdit = (taskID) => {
    setError(null)
    setEditingTaskId(taskID)
  }

  const handleCancelEdit = () => {
    setError(null)
    setEditingTaskId(null)
  }

  useEffect(() => {
    if (fetchRecurringTasks) {
      fetchRecurringTasks();
    }
  }, [fetchRecurringTasks]);

  return (
    <div className="border border-dashed border-gray-400 rounded">

        <div className="w-full">

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
                  // This allows the children to use the full width of the summary
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
                  <h2 className="font-semibold text-lg">Recurring Tasks</h2>
                  <h2 className="ml-2 text-md">{`-- ${recurringTasks.length} --`}</h2>
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
                
                    {recurringTasks.length > 0 ? (
                      recurringTasks.map((task) => (
                        <Box
                          key={task.id}
                          sx={{
                            p: 1, borderRadius: 2,
                            backgroundColor: "background.paper",
                            display: "flex", alignItems: "center",
                            justifyContent: "space-between",
                          }}
                          className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1rem)]"
                        >

                          <RecurringTaskItem 
                            key={`${task.id}-${editingTaskId === task.id}`}
                            task = {task}
                            isEditing = {editingTaskId === task.id}
                            isSaving = {isSaving}
                            error = {error}
                            onStartEdit={() => handleStartEdit(task.id)}
                            onCancelEdit={handleCancelEdit}
                            onSaveEdit={onSaveEdit}
                            onDelete={() => handleDelete(task)}
                          />
                          
                        </Box>

                      ))
                    ) : (
                      <p className="italic">No recurring tasks found.</p>
                    )}
                  </div>
                )}
              </AccordionDetails>

            </Accordion>
          </Box>

          <Modal
            open={isCreating}
            onClose={() => setIsCreating(false)}
            aria-labelledby="create-recurring-task-modal"
            aria-describedby="modal-for-creating-new-recurring-task"
          >
            <Box>
              <RecurringTasksForm
                isSaving={isSaving}
                error={error}
                onCancel={() => setIsCreating(false)}
                onSubmit={onAddTask}
                initialTitle=""
                initialDays={[]}
              />
             </Box>
          </Modal>

        </div>

    </div>

  );
};

export default RecurringTasksPanel;