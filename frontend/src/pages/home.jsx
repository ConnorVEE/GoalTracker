import { useContext, useEffect, useState} from "react";
// Contexts
import { AuthContext } from "../contexts/AuthContext.jsx";

// Components
import PageIntro from "./PageIntro.jsx";
import TaskSurface from "./TaskSurface.jsx";
import RecurringTasksPanel from "../Features/RecurringTasks/RecurringTasksPanel.jsx";
import GoalsPanel from "../Features/Goals/GoalsPanel.jsx";

const Home = () => {  
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
      <div className="mt-4">
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

export default Home;