"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import NewProduct from '../component/NewProduct';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      // ۱. گرفتن همه پروژه‌ها
      const projectsRes = await axios.get('http://localhost:4000/projects');
      const allProjects = projectsRes.data;

      // ۲. فیلتر پروژه‌های کاربر
      const userProjects = allProjects.filter(
        (p: any) => p.ownerId === user.id || p.members?.includes(user.id)
      );

      // ۳. مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
      const sorted = [...userProjects].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentProjects(sorted);

      // ۴. گرفتن همه تسک‌ها
      const tasksRes = await axios.get('http://localhost:4000/tasks');
      const allTasks = tasksRes.data;

      // ۵. فیلتر تسک‌های کاربر
      const userTasks = allTasks.filter(
        (t: any) => t.assigneeId === user.id || t.creatorId === user.id
      );

      // ۶. تسک‌های انجام شده
      const completedTasks = userTasks.filter((t: any) => t.status === 'DONE');

      setStats({
        projects: userProjects.length,
        tasks: userTasks.length,
        completedTasks: completedTasks.length
      });
      setLoading(false);

    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const handleProjectCreated = () => {
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TaskFlow</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                alt={user?.name}
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your projects
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Projects</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {loading ? '...' : stats.projects}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {loading ? '...' : stats.tasks}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed Tasks</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {loading ? '...' : stats.completedTasks}
            </p>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Projects
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm flex-shrink-0"
            >
              + New Project
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No projects yet. Create your first project!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/products/${project.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-gray-900 dark:text-white font-medium truncate">
                      {project.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-blue-600 transition flex-shrink-0 ml-4">
                    View →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <NewProduct
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProjectCreated}
      />
    </div>
  );
}
