import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getTasksByDate, createTask } from "../api/taskRoutes";
import { Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';


import GreetingHeader from "../components/home/GreetingHeader.jsx"; 

const Home = () => {
  const { logout, user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const dateStr = selectedDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    const diff = (prev - new Date()) / (1000 * 60 * 60 * 24);
    if (diff >= -7) setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    const diff = (next - new Date()) / (1000 * 60 * 60 * 24);
    if (diff <= 7) setSelectedDate(next);
  };

  const handleQuickAdd = async () => {
    if (!newTaskTitle.trim()) return;
    const payload = {
      title: newTaskTitle,
      date: selectedDate.toISOString().split("T")[0],
    };
    try {
      await createTask(payload);
      setNewTaskTitle("");
      setShowQuickAdd(false);
      const res = await getTasksByDate(payload.date);
      setTasks(res.data);
    } catch (err) {
      console.error("Quick add failed:", err);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const dateStr = selectedDate.toISOString().split("T")[0];
        const res = await getTasksByDate(dateStr);
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    };
    fetchTasks();
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-[#EADCF8] px-4 py-6 flex flex-col items-center">
      {/* Greeting */}
      <GreetingHeader user={user} dateStr={dateStr} />
      {/* <Typography variant="h4" sx={{ color: "#6A4C93", fontWeight: "bold" }}>
        {getGreeting()}, {name}
      </Typography> */}


      {/* Date Controls */}
      <div className="flex items-center space-x-2 mt-4">
        <ArrowBackIosIcon
          onClick={handlePrevDay}
          className="cursor-pointer hover:text-[#6A4C93]"
        />
        <Typography variant="body1">{dateStr}</Typography>

        <ArrowForwardIosIcon
          onClick={handleNextDay}
          className="cursor-pointer hover:text-[#6A4C93]"
        />
      </div>

      {/* Quick Add Task */}
      <div className="w-full max-w-3xl mt-6 mb-4">
        {!showQuickAdd ? (
          <div className="flex justify-end">

            <button
              onClick={() => setShowQuickAdd(true)}
              className="bg-[#6A4C93] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#4b3670]"
            >
              + Add Task
            </button>

          </div>
        ) : (
          <div className="flex items-center space-x-2">

            <input
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none w-full"
            />

            <button
              onClick={handleQuickAdd}
              className="bg-[#6A4C93] text-white px-3 py-2 rounded-lg hover:bg-[#4b3670]"
            >
              Save
            </button>

            <button
              onClick={() => {
                setShowQuickAdd(false);
                setNewTaskTitle("");
              }}
              className="text-sm text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="w-full max-w-3xl grid grid-cols-2 gap-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col col-span-2 items-center justify-center text-gray-500">
            <AssignmentTurnedInIcon sx={{ fontSize: 40, color: "#BFA2DB" }} />
            <p className="italic">No tasks for this day. Click "+ Add Task" to start.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#F3E8FF] border border-[#D6B8ED] rounded-lg px-4 py-3 text-sm shadow-sm text-gray-800 transition-all hover:scale-[1.02]"
            >
              <span className="font-medium">{task.title}</span>
            </div>
          ))
        )}
      </div>

      {/* Logout */}
      <div className="mt-12">
        <button
          onClick={logout}
          className="text-sm bg-[#9D7BC1] text-white px-4 py-2 rounded-lg hover:bg-[#7a62a2] transition"
        >
          Logout
        </button>
      </div>

    </div>

  );
};

export default Home;