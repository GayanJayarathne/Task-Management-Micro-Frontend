import React from "react";
import { MemoryRouter } from "react-router";
import TaskTable from "../components/TaskTable";

const TaskModule: React.FC = () => {
  return (
    <MemoryRouter>
      <TaskTable />
    </MemoryRouter>
  );
};

export default TaskModule;
