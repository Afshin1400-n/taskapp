"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  ownerId: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  projectId: string;
  assigneeId: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Task modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");
  const [taskStatus, setTaskStatus] = useState("TODO");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskAssigneeId, setTaskAssigneeId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectId = params.id as string;

        // ۱. گرفتن اطلاعات پروژه
        const projectRes = await axios.get(`http://localhost:4000/projects/${projectId}`);
        const projectData = projectRes.data;
        setProject(projectData);

        // ۲. گرفتن همه کاربران
        const usersRes = await axios.get('http://localhost:4000/users');
        const allUsers = usersRes.data;

        // ۳. پیدا کردن صاحب پروژه
        const ownerData = allUsers.find((u: any) => u.id === projectData.ownerId);
        setOwner(ownerData || null);

        // ۴. پیدا کردن اعضای پروژه
        const membersData = allUsers.filter((u: any) =>
          projectData.members?.includes(u.id)
        );
        setMembers(membersData);

        // ۵. گرفتن تسک‌های پروژه
        const tasksRes = await axios.get(`http://localhost:4000/tasks?projectId=${projectId}`);
        setTasks(tasksRes.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Project not found');
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await axios.delete(`http://localhost:4000/projects/${project?.id}`);
      router.push('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  // ✅ اضافه کردن تسک جدید
  const handleAddTask = async () => {
    if (!taskTitle.trim()) {
      alert("Please enter a task title");
      return;
    }

    setIsSubmitting(true);

    try {
      const newTask: Omit<Task, "id"> = {
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        status: taskStatus,
        priority: taskPriority,
        dueDate: taskDueDate || new Date().toISOString(),
        projectId: project?.id || "",
        assigneeId: taskAssigneeId || user?.id || "1",
        creatorId: user?.id || "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await axios.post("http://localhost:4000/tasks", newTask);
      setTasks([...tasks, res.data]);

      // Reset form
      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("MEDIUM");
      setTaskStatus("TODO");
      setTaskDueDate("");
      setTaskAssigneeId("");
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ حذف تسک
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`http://localhost:4000/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  // ✅ تغییر وضعیت تسک
  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await axios.patch(`http://localhost:4000/tasks/${taskId}`, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // ✅ رنگ اولویت
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300";
      case "HIGH":
        return "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300";
      case "MEDIUM":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300";
      case "LOW":
        return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  // ✅ رنگ وضعیت
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300";
      case "IN_PROGRESS":
        return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300";
      case "TODO":
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Project not found'}</p>
          <Link
            href="/projects"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="../dashboard"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              ← Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Project Details
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          {/* Project Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {project.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition text-sm"
            >
              Delete
            </button>
          </div>

          {/* Description */}
          {project.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {project.description}
              </p>
            </div>
          )}

          {/* Owner */}
          {owner && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Owner
              </h3>
              <div className="flex items-center gap-3">
                <img
                  src={owner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${owner.email}`}
                  alt={owner.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-900 dark:text-white font-medium">
                  {owner.name}
                </span>
              </div>
            </div>
          )}

          {/* Members */}
          {members.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Members ({members.length})
              </h3>
              <div className="flex flex-wrap gap-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    <img
                      src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`}
                      alt={member.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {member.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Project ID</p>
              <p className="text-sm text-gray-900 dark:text-white font-mono">
                {project.id}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {new Date(project.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tasks ({tasks.length})
            </h3>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
            >
              + Add Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No tasks yet. Create your first task!
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace("_", " ")}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-3">
                    {/* Status dropdown */}
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none"
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                      title="Delete task"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ✅ Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                New Task
              </h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Enter task title..."
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Enter description..."
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition resize-none"
                />
              </div>

              {/* Status + Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assignee
                </label>
                <select
                  value={taskAssigneeId}
                  onChange={(e) => setTaskAssigneeId(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500 transition"
                >
                  <option value="">Select assignee...</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddTask}
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition"
                >
                  {isSubmitting ? "Adding..." : "Add Task"}
                </button>
                <button
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}