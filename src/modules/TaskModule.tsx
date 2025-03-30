import React from "react";
import { Link, MemoryRouter, Route, Routes } from "react-router";

const TasksList = () => (
  <div>
    <h3>Tasks List</h3>
    <ul>
      <li>
        Task 1 - <Link to="/task/1">View Details</Link>
      </li>
      <li>
        Task 2 - <Link to="/task/2">View Details</Link>
      </li>
      <li>
        Task 3 - <Link to="/task/3">View Details</Link>
      </li>
    </ul>
  </div>
);

const TaskDetails = () => {
  // We'll use simple props instead of useParams for simplicity
  const params = window.location.pathname.split("/");
  const id = params[params.length - 1];

  return (
    <div>
      <h3>Task Details</h3>
      <p>Viewing details for Task ID: {id}</p>
      <p>This is a placeholder for task details.</p>
      <Link to="/">Back to Tasks List</Link>
    </div>
  );
};

const TaskModule: React.FC = () => {
  return (
    <MemoryRouter>
      <div
        style={{ padding: "20px", border: "2px dashed blue", margin: "10px" }}
      >
        <h2>Task Management Micro Frontend</h2>
        <p>This component is loaded from the remote app</p>

        <Routes>
          <Route path="/" element={<TasksList />} />
          <Route path="/task/:id" element={<TaskDetails />} />
        </Routes>

        <div style={{ marginTop: "20px" }}>
          <Link to="/" style={{ marginRight: "10px" }}>
            Tasks List
          </Link>
          <Link to="/task/1">View Task 1</Link>
        </div>
      </div>
    </MemoryRouter>
  );
};

export default TaskModule;
