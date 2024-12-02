"use client";

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { animate, motion } from "framer-motion";
import { GoCopilot } from "react-icons/go";
import { Card } from "@/components/ui/card"
import { Modal } from "@/components/ui/animated-modal"
import { Input } from "@/components/ui/input"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { TrashIcon, EditIcon, CheckCircleIcon } from "lucide-react";

type Task = {
  id: number;
  title: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string | null;
  category: string;
  subTasks: string[];
  completed: boolean;
};

export default function ToDoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Partial<Task>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);

  const handleAddTask = () => {
    if (!newTask.title) return;
    const task = {
      id: Date.now(),
      title: newTask.title,
      priority: newTask.priority || "Medium",
      dueDate: newTask.dueDate || null,
      category: newTask.category || "General",
      subTasks: newTask.subTasks || [],
      completed: false,
    } as Task;
    setTasks([...tasks, task]);
    setNewTask({});
    setIsModalOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({ ...task });
    setIsModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingTask) return;
    const updatedTask = { ...editingTask, ...newTask };
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    setNewTask({});
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleCompleteTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">ToDo List App</h1>
        <Button onClick={() => setIsModalOpen(true)} className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white">Add Task</Button>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div>
            <h2 className="text-lg font-bold mb-2">{editingTask ? "Edit Task" : "Add Task"}</h2>
            <Input
              placeholder="Task Title"
              value={newTask.title || ""}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="mb-4"
            />
            <Select
              value={newTask.priority || ""}
              onChange={(value) => setNewTask({ ...newTask, priority: value as Task["priority"] })}
              className="mb-4"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              placeholder="Category"
              value={newTask.category || ""}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              className="mb-4"
            />
            <Input
              placeholder="Subtasks (comma separated)"
              value={newTask.subTasks?.join(", ") || ""}
              onChange={(e) => setNewTask({ ...newTask, subTasks: e.target.value.split(", ").map((s) => s.trim()) })}
              className="mb-4"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full mb-4">
                  <CalendarIcon />
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
            <Button onClick={editingTask ? handleSaveEdit : handleAddTask} className="bg-blue-600 hover:bg-blue-700 text-white">
              {editingTask ? "Save Changes" : "Add Task"}
            </Button>
          </div>
        </Modal>

        {tasks.length > 0 && (
          <div className="mt-8">
            <Carousel>
              <CarouselContent className="-ml-4">
                {tasks.map((task) => (
                  <CarouselItem key={task.id} className="pl-4">
                    <Card className={`p-4 ${task.completed ? "bg-green-100" : "bg-white"}`}>
                      <h3 className="text-xl font-semibold">{task.title}</h3>
                      <p>Priority: {task.priority}</p>
                      <p>Due Date: {task.dueDate ? format(new Date(task.dueDate), "PPP") : "None"}</p>
                      <p>Category: {task.category}</p>
                      <div className="mt-4">
                        <p><strong>Subtasks:</strong> {task.subTasks.join(", ")}</p>
                        <div className="flex space-x-2 mt-2">
                          <Button onClick={() => handleCompleteTask(task.id)} className="bg-green-600 hover:bg-green-700 text-white">
                            {task.completed ? <CheckCircleIcon /> : "Mark as Complete"}
                          </Button>
                          <Button onClick={() => handleEditTask(task)} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <EditIcon />
                          </Button>
                          <Button onClick={() => handleDeleteTask(task.id)} className="bg-red-600 hover:bg-red-700 text-white">
                            <TrashIcon />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}
      </Card>
    </div>
  );
}
