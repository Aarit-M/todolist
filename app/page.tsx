"use client";

import React, { useState } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, TrashIcon, EditIcon } from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: number;
  title: string;
  priority: string;
  category: string;
  subTasks: string[];
  dueDate: string | null;
  completed: boolean;
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "",
    category: "",
    subTasks: "",
    dueDate: null as string | null, // Updated type for dueDate
  });
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const handleAddTask = () => {
    if (!newTask.title || !newTask.priority) return;

    if (editingTaskId !== null) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                ...newTask,
                subTasks: newTask.subTasks.split(",").map((s) => s.trim()),
              }
            : task
        )
      );
      setEditingTaskId(null);
    } else {
      setTasks((prevTasks) => [
        ...prevTasks,
        {
          id: Date.now(),
          ...newTask,
          completed: false,
          subTasks: newTask.subTasks.split(",").map((s) => s.trim()),
        },
      ]);
    }

    setNewTask({ title: "", priority: "", category: "", subTasks: "", dueDate: null });
  };

  const handleEditTask = (task: Task) => {
    setNewTask({
      ...task,
      subTasks: task.subTasks.join(", "),
    });
    setEditingTaskId(task.id);
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleToggleComplete = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <>
      <Head>
        <title>To-Do List</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
          <h2 className="text-lg font-semibold mb-4">Add Task</h2>
          <Input
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="mb-4"
          />
          <Select
            value={newTask.priority}
            onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Category"
            value={newTask.category}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            className="mt-4 mb-4"
          />
          <Input
            placeholder="Subtasks (comma separated)"
            value={newTask.subTasks}
            onChange={(e) => setNewTask({ ...newTask, subTasks: e.target.value })}
            className="mb-4"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full mb-4">
                <CalendarIcon className="mr-2" />
                {newTask.dueDate ? format(new Date(newTask.dueDate), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={newTask.dueDate ? new Date(newTask.dueDate) : undefined}
                onSelect={(date) => setNewTask({ ...newTask, dueDate: date?.toString() || null })}
              />
            </PopoverContent>
          </Popover>
          <Button
            onClick={handleAddTask}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {editingTaskId ? "Save Changes" : "Add Task"}
          </Button>
        </div>
        <div className="w-full max-w-md mt-6 space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-lg shadow-md flex flex-col justify-between ${
                task.completed ? "bg-green-100" : "bg-white"
              }`}
            >
              <div>
                <h3 className="font-bold text-lg">{task.title}</h3>
                <p className="text-sm text-gray-600">Category: {task.category}</p>
                <p className="text-sm text-gray-600">Priority: {task.priority}</p>
                <p className="text-sm text-gray-600">
                  Due Date: {task.dueDate ? format(new Date(task.dueDate), "PPP") : "No due date"}
                </p>
                {task.subTasks.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                    {task.subTasks.map((subTask, index) => (
                      <li key={index}>{subTask}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleToggleComplete(task.id)}>
                  {task.completed ? "Undo" : "Complete"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditTask(task)}>
                  <EditIcon />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteTask(task.id)}>
                  <TrashIcon />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
