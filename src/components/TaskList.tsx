import React from "react";

const TaskList = () => {
  return (
    <div>
      <h2>Task List from Micro Frontend</h2>
      <p>This component is exposed from the micro frontend</p>
      <ul>
        <li>Task 1 - Implement Micro Frontend</li>
        <li>Task 2 - Test Integration</li>
      </ul>
    </div>
  );
};

export default TaskList;
