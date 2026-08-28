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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
              href="/projects"
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

        {/* Tasks Section (placeholder) */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tasks
            </h3>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm">
              + Add Task
            </button>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No tasks yet. Create your first task!
          </p>
        </div>
      </main>
    </div>
  );
}