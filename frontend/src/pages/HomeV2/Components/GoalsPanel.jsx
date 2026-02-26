import { useContext, useState } from 'react';

// Contexts
// We kinda maybe should create a goals context at some point, but for now we'll just use the TaskContext to get some dummy data to display in the panel

// TESTING
// MUI
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';

const GoalsPanel = () => {
  

  return (
    <div className="border border-dashed border-gray-400 rounded">

        {/* Testing */}
        <div className="w-full">
          
          <Accordion 
            disableGutters 
            elevation={0} 
            sx={{
              backgroundColor: "transparent",
              "&:before": { display: "none" },
            }}
          >

            <AccordionSummary expandIcon={<ExpandMoreIcon />} className="px-0" >
              <h2 className="font-semibold text-lg">Goals</h2>
            </AccordionSummary>

            <AccordionDetails className="px-0">
              {/* {loading ? (
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
                          p: 2, borderRadius: 2,
                          backgroundColor: "background.paper",
                          display: "flex", alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1rem)]"
                      >
                        
                        Mock Goals
                        <h3 className="font-medium">Mock Goals</h3>

                      </Box>

                    ))
                  ) : (
                    <p className="italic">No Goals found</p>
                  )} */}
                {/* </div> */}
              {/* )} */}
            </AccordionDetails>

          </Accordion>
        </div>

    </div>

  );
};

export default GoalsPanel;