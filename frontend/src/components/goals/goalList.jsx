import React from "react";
import GoalItem from "./goalItem";
import { Typography } from "@mui/material";

const GoalList = ({ goals, onUpdate, onDelete }) => {
  if (goals.length === 0) {
    return (
      <div className="text-center mt-8">
        <Typography variant="h6" sx={{ color: "#9D7BC1" }}>
          No goals yet! 🎯
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          Start by creating a new goal above.
        </Typography>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2 auto-rows-auto">
      {goals.map((goal) => (
        <div key={goal.id} className="self-start w-full">
          <GoalItem
            goal={goal}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}

export default GoalList;