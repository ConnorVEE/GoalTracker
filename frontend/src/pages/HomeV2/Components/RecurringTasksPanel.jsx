import { useContext, useState, useEffect } from 'react';
// Contexts
import { TaskContext } from "../../../contexts/TaskContext";
// components
import RecurringTaskItem from "./RecurringTaskItem.jsx";
// TESTING
// MUI
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';

// const daysOfWeek = weekdayMap.map((name, value) => ({ name, value }));

const RecurringTasksPanel = () => {
  const { recurringTasks, fetchRecurringTasks, loading } = useContext(TaskContext);

  useEffect(() => {
    if (fetchRecurringTasks) {
      fetchRecurringTasks();
    }
  }, [fetchRecurringTasks]);

  // Debugging log to check the fetched recurring tasks shape and content
  console.log("Recurring Tasks:", recurringTasks); // Debugging log

  return (
    <div className="border border-dashed border-gray-400 rounded">

        {/* Testing */}
        <div className="w-full">
          {/* 'disableGutters' and 'elevation={0}' help it blend into your page */}
          <Accordion 
            disableGutters 
            elevation={0} 
            sx={{
              backgroundColor: "transparent",
              "&:before": { display: "none" }, // removes divider line
            }}
          >

            <AccordionSummary expandIcon={<ExpandMoreIcon />} className="px-0" >
              <h2 className="font-semibold text-lg">Recurring Tasks</h2>
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
                          task = {task}
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
        </div>

    </div>

  );
};

export default RecurringTasksPanel;