import { useContext, useEffect, useState} from "react";
// Contexts
import { AuthContext } from "../../contexts/AuthContext";

// Components
import PageIntro from "./Components/PageIntro.jsx";
import TaskSurface from "./Components/TaskSurface.jsx";
import RecurringTasksPanel from "./Components/RecurringTasksPanel.jsx";
import GoalsPanel from "./Components/GoalsPanel.jsx";

const HomeV2 = () => {  
  const { user } = useContext(AuthContext);

  return (
    <div>
      <PageIntro user={user}/>
      {/* PageIntro Component
          - Welcome message
          - User's name as prop
          - Today's date */}
      
      <div>
        <TaskSurface />
        {/* TaskSurface component
            - Date at the top for context
            - Proper Task/Calendar list/surface
            - Nav + tog buttons for navigation and day/calendar switching */}
      </div>
    
      {/* Panel components */}
      <div className="bg-gray-300">
          <RecurringTasksPanel />
          {/* RecurringTasksPanel 
              - Dropdown panel/menu 
              - Will list/show current recurring task parents */}

          <GoalsPanel />
          {/* GoalsPanel
              - Dropdown panel/menu
              - Will list/show current goals */}
      </div>
    </div>
  );
};

export default HomeV2;