import React from "react";
import GoalItem from "./goalItem";

const GoalList = ({ goals, onUpdate, onDelete }) => {
  return (
    <ul>
      {goals.map((goal) => (
        <GoalItem
          key={goal.id}
          goal={goal}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default GoalList;