import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  X,
  Calendar,
  FileText,
  Terminal,
} from 'lucide-react';
import { Course } from '../types';
import { addCourse, updateCourse, deleteCourse } from '../lib/supabase';

interface ManageCoursesProps {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  onOpenSqlModal: () => void;
}

export const ManageCourses: React.FC<ManageCoursesProps> = ({
  courses,
  isLoading,
  error,
  onRefresh,
  onShowToast,
  onOpenSqlModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  // Form states
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Copy UUID state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter courses by name or description
  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return courses;
    const term = searchTerm.toLowerCase().trim();
    return courses.filter(
      (c) =>
        c.course_name.toLowerCase().includes(term) ||
        c.course_description.toLowerCase().includes(term)
    );
  }, [courses, searchTerm]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    onShowToast('info', 'Course UUID copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openAddModal = () => {
    setCourseName('');
    setCourseDescription('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setCourseName(course.course_name);
    setCourseDescription(course.course_description);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim() || !courseDescription.trim()) {
      onShowToast('error', 'Please fill in both the Course Name and Description.');
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await addCourse({
      course_name: courseName,
      course_description: courseDescription,
    });
    setIsSubmitting(false);

    if (error) {
      onShowToast('error', `Failed to add course: ${error}`);
      return;
    }

    onShowToast('success', `Course "${data?.course_name || courseName}" created successfully!`);
    setIsAddModalOpen(false);
    onRefresh();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    if (!courseName.trim() || !courseDescription.trim()) {
      onShowToast('error', 'Please fill in both the Course Name and Description.');
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await updateCourse(editingCourse.id, {
      course_name: courseName,
      course_description: courseDescription,
    });
    setIsSubmitting(false);

    if (error) {
      onShowToast('error', `Failed to update course: ${error}`);
      return;
    }

    onShowToast('success', `Course "${data?.course_name || courseName}" updated successfully!`);
    setEditingCourse(null);
    onRefresh();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCourse) return;

    setIsSubmitting(true);
    const { success, error } = await deleteCourse(deletingCourse.id);
    setIsSubmitting(false);

    if (!success || error) {
      onShowToast('error', `Failed to delete course: ${error || 'Unknown error'}`);
      return;
    }

    onShowToast('success', `Course "${deletingCourse.course_name}" deleted.`);
    setDeletingCourse(null);
    onRefresh();
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50/50 min-h-[calc(100vh-140px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Title & Top Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Manage Courses
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Create, update, and organize educational courses offered at KIPS College.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors disabled:opacity-50"
              title="Refresh course catalog"
              aria-label="Refresh course list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </button>
          </div>
        </div>

        {/* Database Notice or Missing Table Banner */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs sm:text-sm flex items-start justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-rose-950">Database Operation Notice: </span>
                <span>{error}</span>
                {error.includes('relation') || error.includes('42P01') || error.includes('not found') ? (
                  <p className="mt-1 text-xs text-rose-800">
                    The <code>courses</code> table has not been created yet in your Supabase project. Click below to view and copy the SQL schema script.
                  </p>
                ) : null}
              </div>
            </div>
            <button
              onClick={onOpenSqlModal}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-700 text-white rounded-lg text-xs font-semibold hover:bg-rose-800 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>View SQL Setup</span>
            </button>
          </div>
        )}

        {/* Search & Stats Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search course by name or description..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium self-end sm:self-auto">
            <span>Total Available Courses:</span>
            <span className="font-bold text-slate-900 font-mono tabular-nums bg-slate-100 px-2 py-0.5 rounded">
              {courses.length}
            </span>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Course ID</th>
                  <th className="py-3.5 px-4 sm:px-6">Course Name</th>
                  <th className="py-3.5 px-4 sm:px-6 min-w-[240px]">Course Description</th>
                  <th className="py-3.5 px-4 sm:px-6">Creation Date</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && courses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-700" />
                        <span className="text-xs font-medium">Loading course catalog from Supabase...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      {searchTerm ? (
                        <div className="space-y-2">
                          <p className="font-medium text-slate-700">No courses match "{searchTerm}"</p>
                          <p className="text-xs text-slate-400">Try adjusting your search criteria</p>
                          <button
                            onClick={() => setSearchTerm('')}
                            className="text-xs text-blue-600 hover:underline font-semibold"
                          >
                            Clear search
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 max-w-sm mx-auto">
                          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">No courses available yet</p>
                            <p className="text-xs text-slate-500 mt-1">
                              Start structuring the KIPS College curriculum by adding your first course.
                            </p>
                          </div>
                          <button
                            onClick={openAddModal}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add First Course
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Course ID */}
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <button
                          onClick={() => handleCopyId(course.id)}
                          className="inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-xs text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors group/btn"
                          title={`Click to copy full UUID:\n${course.id}`}
                        >
                          <span>{course.id.slice(0, 8)}...</span>
                          {copiedId === course.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400 group-hover/btn:text-blue-600" />
                          )}
                        </button>
                      </td>

                      {/* Course Name */}
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-700 shrink-0" />
                          <span>{course.course_name}</span>
                        </div>
                      </td>

                      {/* Course Description */}
                      <td className="py-3.5 px-4 sm:px-6 text-slate-600 leading-relaxed">
                        <p className="line-clamp-2 max-w-lg">
                          {course.course_description}
                        </p>
                      </td>

                      {/* Creation Date */}
                      <td className="py-3.5 px-4 sm:px-6 text-slate-500 whitespace-nowrap tabular-nums">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formatDate(course.creation_date)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(course)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            title="Edit course"
                            aria-label={`Edit ${course.course_name}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingCourse(course)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Delete course"
                            aria-label={`Delete ${course.course_name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADD COURSE MODAL */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-700" />
                  <h3 className="text-base font-bold text-slate-900">Add New Course</h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g. Advanced Physics & Mechanics"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="Comprehensive study of classical mechanics, rotational dynamics, wave motion, and laboratory experiments..."
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent leading-relaxed"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Saving to Supabase...
                      </>
                    ) : (
                      'Save Course'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT COURSE MODAL */}
        {editingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-blue-700" />
                  <h3 className="text-base font-bold text-slate-900">Edit Course Record</h3>
                </div>
                <button
                  onClick={() => setEditingCourse(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-600">
                  <span className="text-slate-400">ID: </span>{editingCourse.id}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent leading-relaxed"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Course'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deletingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 space-y-4">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-slate-900">Delete Course Record?</h3>
                <p className="text-xs text-slate-600">
                  Are you sure you want to delete <span className="font-semibold text-slate-900">"{deletingCourse.course_name}"</span>? This will permanently remove the course from Supabase.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingCourse(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
