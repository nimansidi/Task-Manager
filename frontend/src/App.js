import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios
        .put(`http://localhost:5000/api/tasks/${editId}`, form)
        .then((response) => {
          setTasks(
            tasks.map((task) => (task._id === editId ? response.data : task))
          );
          setEditId(null);
          setForm({ title: "", description: "", dueDate: "" });
        })
        .catch((error) => console.error("Error updating task:", error));
    } else {
      axios
        .post("http://localhost:5000/api/tasks", form)
        .then((response) => {
          setTasks([...tasks, response.data]);
          setForm({ title: "", description: "", dueDate: "" });
        })
        .catch((error) => console.error("Error adding task:", error));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setForm({
      title: task.title,
      description: task.description,
      dueDate: formatDate(task.dueDate), // Format the date here
    });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
        setError(null);
      })
      .catch((error) => {
        console.error(
          "Error deleting task:",
          error.response ? error.response.data : error.message
        );
        setError("Failed to delete task. Please try again.");
      });
  };

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Task Management Application</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex justify-center mb-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
        >
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="border p-2 mb-4 w-full bg-gray-700 text-white"
            required
          />
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 mb-4 w-full bg-gray-700 text-white"
            required
          />
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="border p-2 mb-4 w-full bg-gray-700 text-white"
            required
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 w-full max-w-xs"
            >
              {editId ? "Update" : "Add"} Task
            </button>
          </div>
        </form>
      </div>
      <ul className="mt-6 w-full max-w-md">
        {tasks.map((task) => (
          <li key={task._id} className="border p-4 mb-4 rounded-lg bg-gray-800">
            <h2 className="text-xl font-bold">{task.title}</h2>
            <p className="mb-2">{task.description}</p>
            <p className="mb-2">
              {new Date(task.dueDate).toLocaleDateString()}
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => handleEdit(task)}
                className="bg-yellow-500 text-white p-1 mr-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 text-white p-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
