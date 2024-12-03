import React, { useState } from 'react';
import { MoreVertical, Shield, Trash2, Key } from 'lucide-react';
import { User } from '../../types/auth';
import { setAdminRole, deleteUser, resetPassword } from '../../utils/admin';
import { useToast } from '../../contexts/ToastContext';

interface UserActionsProps {
  user: User;
  onUpdate: () => void;
}

export function UserActions({ user, onUpdate }: UserActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAction = async (action: 'admin' | 'delete' | 'reset') => {
    setLoading(true);
    try {
      switch (action) {
        case 'admin':
          await setAdminRole(user.id);
          toast({
            title: 'Success',
            description: `${user.name} is now an admin`,
            type: 'success'
          });
          break;
        case 'delete':
          await deleteUser(user.id);
          toast({
            title: 'Success',
            description: 'User deleted successfully',
            type: 'success'
          });
          break;
        case 'reset':
          await resetPassword(user.email);
          toast({
            title: 'Success',
            description: 'Password reset email sent',
            type: 'success'
          });
          break;
      }
      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="p-1 rounded-full hover:bg-gray-100"
      >
        <MoreVertical className="w-5 h-5 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          {user.role !== 'admin' && (
            <button
              onClick={() => handleAction('admin')}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Shield className="w-4 h-4" />
              Make Admin
            </button>
          )}
          <button
            onClick={() => handleAction('reset')}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Key className="w-4 h-4" />
            Reset Password
          </button>
          <button
            onClick={() => handleAction('delete')}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete User
          </button>
        </div>
      )}
    </div>
  );
}