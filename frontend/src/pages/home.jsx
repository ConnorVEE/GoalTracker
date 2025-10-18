import { useContext, useEffect, useState } from "react";
// Contexts
import { AuthContext } from "../contexts/AuthContext";
import { TaskContext } from "../contexts/TaskContext";
// MUI
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
// Components
import GreetingHeader from "../components/home/GreetingHeader.jsx";
import DateSlider from "../components/home/DateSlider.jsx";
import TaskList from "../components/home/TaskList.jsx";
import QuickAddTask from "../components/home/QuickAddTask.jsx";
// Utils
import { formatRelativeDate } from "../utils/DateUtils.js";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { fetchTasksByDate, tasks } = useContext(TaskContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [direction, setDirection] = useState(0);

  const dateStr = formatRelativeDate(selectedDate);

  const handlePrevDay = () => {
    setDirection(-1);
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    const diff = (prev - new Date()) / (1000 * 60 * 60 * 24);
    if (diff >= -7) setSelectedDate(prev);
  };

  const handleNextDay = () => {
    setDirection(1);
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    const diff = (next - new Date()) / (1000 * 60 * 60 * 24);
    if (diff <= 7) setSelectedDate(next);
  };

  useEffect(() => {
    fetchTasksByDate(selectedDate.toISOString().split("T")[0]);
  }, [selectedDate]);

  return (
    <div className="min-h-screen px-4 py-6 flex flex-col items-center">
      <Helmet>
        <title>TodoAllDay | Home</title>
      </Helmet>

      {/* Greeting header with user info and date */}
      <GreetingHeader user={user} dateStr={dateStr} />

      {/* Date navigation slider */}
      <DateSlider handleNextDay={handleNextDay} handlePrevDay={handlePrevDay} dateStr={dateStr} direction={direction}/>
      
      {/* Task list */}
      <div className="w-full max-w-3xl grid gap-4 mt-6">
        {tasks.length === 0 ? (

          <div className="flex flex-col col-span-2 items-center justify-center text-gray-500">
            <AssignmentTurnedInIcon sx={{ fontSize: 40, color: "#BFA2DB" }} />
            <p className="italic">No tasks for this day. Click "+ Add Task" to start.</p>
            
          </div>
        ) : (
          <TaskList direction={direction}/>
        )}
      </div>

      {/* Quick add task input */}
      <QuickAddTask selectedDate={selectedDate} />
    </div>
  );
};

export default Home;