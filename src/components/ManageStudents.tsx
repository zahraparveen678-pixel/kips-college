import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  X,
  Mail,
  GraduationCap,
  Calendar,
  Terminal,
} from 'lucide-react';
import { Student } from '../types';
import { addStudent, updateStudent, deleteStudent } from '../lib/supabase';

interface ManageStudentsProps {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  onOpenSqlModal: () => void;
}

export const ManageStudents: React.FC<ManageStudentsProps> = ({
  students,
  isLoading,
  error,
  onRefresh,
  onShowToast,
  onOpenSqlModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formClass, setFormClass] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Copy UUID feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter students by name (case-insensitive)
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const term = searchTerm.toLowerCase().trim();
    return students.filter((s) => s.full_name.toLowerCase().includes(term));
  }, [students, searchTerm]);

  // Unique classes for count
  const uniqueClassesCount = useMemo(() => {
    const classes = new Set(students.map((s) => s.class_name.trim()));
    return classes.size;
  }, [students]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    onShowToast('info', 'Student UUID copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openAddModal = () => {
    setFormName('');
    setFormEmail('');
    setFormClass('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormName(student.full_name);
    setFormEmail(student.email);
    setFormClass(student.class_name);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formClass.trim()) {
      onShowToast('error', 'Please fill in all student fields.');
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await addStudent({
      full_name: formName,
      email: formEmail,
      class_name: formClass,
    });

    setIsSubmitting(false);

    if (error) {
      onShowToast('error', `Failed to add student: ${error}`);
      return;
    }

    onShowToast('success', `Student "${data?.full_name || formName}" added successfully!`);
    setIsAddModalOpen(false);
    onRefresh();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    if (!formName.trim() || !formEmail.trim() || !formClass.trim()) {
      onShowToast('error', 'Please fill in all student fields.');
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await updateStudent(editingStudent.id, {
      full_name: formName,
      email: formEmail,
      class_name: formClass,
    });

    setIsSubmitting(false);

    if (error) {
      onShowToast('error', `Failed to update student: ${error}`);
      return;
    }

    onShowToast('success', `Student "${data?.full_name || formName}" updated successfully!`);
    setEditingStudent(null);
    onRefresh();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;

    setIsSubmitting(true);
    const { success, error } = await deleteStudent(deletingStudent.id);
    setIsSubmitting(false);

    if (!success || error) {
      onShowToast('error', `Failed to delete student: ${error || 'Unknown error'}`);
      return;
    }

    onShowToast('success', `Student "${deletingStudent.full_name}" deleted.`);
    setDeletingStudent(null);
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
                <Users className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Manage Students
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Register, update, and manage student enrollments in KIPS College.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors disabled:opacity-50"
              title="Refresh student records"
              aria-label="Refresh student list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-1"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Student</span>
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
                    The <code>students</code> table has not been created yet in your Supabase project. Click below to view and copy the SQL schema script.
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
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student by name..."
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

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium self-end sm:self-auto">
            <div className="flex items-center gap-1.5">
              <span>Total Students:</span>
              <span className="font-bold text-slate-900 font-mono tabular-nums bg-slate-100 px-2 py-0.5 rounded">
                {students.length}
              </span>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <span>Classes:</span>
              <span className="font-bold text-slate-900 font-mono tabular-nums bg-slate-100 px-2 py-0.5 rounded">
                {uniqueClassesCount}
              </span>
            </div>
          </div>
        </div>

        {/* Student Records Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Student ID</th>
                  <th className="py-3.5 px-4 sm:px-6">Full Name</th>
                  <th className="py-3.5 px-4 sm:px-6">Email Address</th>
                  <th className="py-3.5 px-4 sm:px-6">Class Name</th>
                  <th className="py-3.5 px-4 sm:px-6">Registration Date</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-700" />
                        <span className="text-xs font-medium">Loading student records from Supabase...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      {searchTerm ? (
                        <div className="space-y-2">
                          <p className="font-medium text-slate-700">No students match "{searchTerm}"</p>
                          <p className="text-xs text-slate-400">Try searching with a different name or spelling</p>
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
                            <Users className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">No student records found</p>
                            <p className="text-xs text-slate-500 mt-1">
                              Get started by registering your first student into KIPS College.
                            </p>
                          </div>
                          <button
                            onClick={openAddModal}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            Add First Student
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Student ID */}
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <button
                          onClick={() => handleCopyId(student.id)}
                          className="inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-xs text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors group/btn"
                          title={`Click to copy full UUID:\n${student.id}`}
                        >
                          <span>{student.id.slice(0, 8)}...</span>
                          {copiedId === student.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400 group-hover/btn:text-blue-600" />
                          )}
                        </button>
                      </td>

                      {/* Full Name */}
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 whitespace-nowrap">
                        {student.full_name}
                      </td>

                      {/* Email Address */}
                      <td className="py-3.5 px-4 sm:px-6 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{student.email}</span>
                        </div>
                      </td>

                      {/* Class Name */}
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{student.class_name}</span>
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-4 sm:px-6 text-slate-500 whitespace-nowrap tabular-nums">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formatDate(student.registration_date)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(student)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            title="Edit student"
                            aria-label={`Edit ${student.full_name}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingStudent(student)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Delete student"
                            aria-label={`Delete ${student.full_name}`}
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

        {/* ADD STUDENT MODAL */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-700" />
                  <h3 className="text-base font-bold text-slate-900">Add New Student</h3>
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
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. ayesha.khan@kips.edu"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    placeholder="e.g. FSc Pre-Medical Part I"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                      'Save Student'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT STUDENT MODAL */}
        {editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-blue-700" />
                  <h3 className="text-base font-bold text-slate-900">Edit Student Record</h3>
                </div>
                <button
                  onClick={() => setEditingStudent(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-600">
                  <span className="text-slate-400">ID: </span>{editingStudent.id}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
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
                      'Update Student'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deletingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 space-y-4">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-slate-900">Delete Student Record?</h3>
                <p className="text-xs text-slate-600">
                  Are you sure you want to delete <span className="font-semibold text-slate-900">"{deletingStudent.full_name}"</span>? This will permanently remove the record from Supabase.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingStudent(null)}
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
