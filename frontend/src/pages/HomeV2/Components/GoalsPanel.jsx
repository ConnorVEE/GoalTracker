import { useContext, useState } from 'react';

// Contexts
// We kinda maybe should create a goals context at some point, but for now we'll just use the TaskContext to get some dummy data to display in the panel

// TESTING
// MUI
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';

const GoalsPanel = () => {

  return (
    <div className="border border-dashed border-gray-400 rounded">

        {/* Testing */}
        <div className="w-full">
          {/* 'disableGutters' and 'elevation={0}' help it blend into your page */}
          <Accordion disableGutters elevation={0} className="bg-transparent before:hidden">

            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className="px-0" // Removes extra padding to align with your Figma
            >
              <h2 className="font-semibold text-lg">Goals</h2>
            </AccordionSummary>

            <AccordionDetails className="px-0">
              <Stack direction="row" spacing={2}>
                <p className="p-4 bg-white border rounded">Task 1: Drink Water</p>
                <p className="p-4 bg-white border rounded">Task 2: Walk Dog</p>
              </Stack>
            </AccordionDetails>

          </Accordion>
        </div>

    </div>

  );
};

export default GoalsPanel;