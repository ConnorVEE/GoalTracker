import { useContext, useState, useEffect } from 'react';

// Contexts
import { TaskContext } from "../../../contexts/TaskContext";

// TESTING
// MUI
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';

const weekdayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const daysOfWeek = weekdayMap.map((name, value) => ({ name, value }));

const RecurringTasksPanel = () => {
  const { recurringTasks, fetchRecurringTasks, loading } = useContext(TaskContext);

  useEffect(() => {
    if (fetchRecurringTasks) {
      fetchRecurringTasks();
    }
  }, [fetchRecurringTasks]);

  return (
    <div className="border border-dashed border-gray-400 rounded">

        {/* Testing */}
        <div className="w-full">
          {/* 'disableGutters' and 'elevation={0}' help it blend into your page */}
          <Accordion disableGutters elevation={0} className="bg-transparent before:hidden">

            <AccordionSummary expandIcon={<ExpandMoreIcon />} className="px-0" >
              <h2 className="font-semibold text-lg">Recurring Tasks</h2>
            </AccordionSummary>

            <AccordionDetails className="px-0">
              {loading ? (
                <div className="flex justify-center p-4">
                  <CircularProgress size={24} /> 
                </div>

              ) : (
                <div className="flex flex-col gap-3">
                
                  {recurringTasks.length > 0 ? (
                    recurringTasks.map((task) => (
                      <div key={task.id} className="p-4 bg-white border rounded-lg flex items-center justify-between">
                        <h3 className="font-medium text-slate-800">{task.title}</h3>

                        {task.recurrence_rule?.days_of_week?.length > 0 && (
                          <span variant="body2" color="text.secondary">
                            {task.recurrence_rule.days_of_week
                              .map((d) => weekdayMap[d])
                              .join(", ")}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No recurring tasks found.</p>
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