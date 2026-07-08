'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldAlert, Trash2, Edit, Save, X, RefreshCw, Search, Filter } from 'lucide-react';
import ProtectedRoute from '@/components/layout/protected-route';
import { AuthService } from '@/services/auth.service';
import { toast } from 'sonner';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editRoleId, setEditRoleId] = useState<number>(0);
  
  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await AuthService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch system users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string) => {
    try {
      await AuthService.updateUserRole(userId, editRoleId);
      toast.success('User role updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await AuthService.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  // Roles Definition
  const rolesList = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Director' },
    { id: 3, name: 'Finance Officer' },
    { id: 4, name: 'HR Officer' },
    { id: 5, name: 'Operations Lead' },
    { id: 6, name: 'General Staff' },
    { id: 7, name: 'System Administrator' },
  ];

  // Perform filtering locally
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const emailMatches = user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const roleMatches = roleFilter === 'all' || user.role_id?.toString() === roleFilter;
      return emailMatches && roleMatches;
    });
  }, [users, searchTerm, roleFilter]);

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading tracking-tight mb-2 text-text-primary">
              System Admin
            </h1>
            <p className="text-text-secondary text-sm">
              Manage system accounts, user permissions and roles.
            </p>
          </div>
          <Button 
            onClick={fetchUsers}
            variant="outline"
            className="border-border-brand text-text-primary hover:bg-bg-subtle text-xs"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" /> Refresh List
          </Button>
        </div>

        {/* User Management List */}
        <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base font-semibold font-heading text-text-primary">
              User Directory
            </CardTitle>
            <CardDescription className="text-text-secondary text-xs mt-1">
              Add, update roles, or suspend account credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-4 space-y-6">
            
            {/* Search & Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                <Input 
                  placeholder="Search users by email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-bg-subtle border-border-brand focus:border-accent text-xs rounded-lg h-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-bg-subtle border border-border-brand rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent"
                >
                  <option value="all">All Roles</option>
                  {rolesList.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                {(searchTerm || roleFilter !== 'all') && (
                  <Button 
                    onClick={() => { setSearchTerm(''); setRoleFilter('all'); }} 
                    variant="ghost" 
                    className="text-xs text-text-secondary hover:text-text-primary hover:bg-bg-subtle px-3"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full bg-bg-subtle" />
                <Skeleton className="h-10 w-full bg-bg-subtle" />
                <Skeleton className="h-10 w-full bg-bg-subtle" />
              </div>
            ) : (
              <div className="rounded-xl border border-border-brand overflow-hidden">
                <Table>
                  <TableHeader className="bg-bg-subtle">
                    <TableRow className="hover:bg-transparent border-border-brand">
                      <TableHead className="text-text-secondary font-heading text-xs">User ID</TableHead>
                      <TableHead className="text-text-secondary font-heading text-xs">Email / Name</TableHead>
                      <TableHead className="text-text-secondary font-heading text-xs">Current Role</TableHead>
                      <TableHead className="text-text-secondary font-heading text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-text-muted text-xs">
                          No users matching search filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((u) => (
                        <TableRow key={u.id} className="border-border-brand hover:bg-[#14161C]/40 transition-colors">
                          <TableCell className="font-mono text-xs text-text-muted">{u.id.substring(0, 8)}...</TableCell>
                          <TableCell className="text-xs font-semibold text-text-primary">
                            <div>{u.email}</div>
                          </TableCell>
                          <TableCell>
                            {editingUser?.id === u.id ? (
                              <select
                                value={editRoleId}
                                onChange={(e) => setEditRoleId(parseInt(e.target.value))}
                                className="bg-bg-subtle border border-border-brand rounded-lg px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent"
                              >
                                {rolesList.map((r) => (
                                  <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                              </select>
                            ) : (
                              <Badge className="bg-accent/10 text-accent border border-accent/20 rounded-full px-2.5 py-0.5 text-[10px]">
                                {u.roles?.role_name || 'No Role Assigned'}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {editingUser?.id === u.id ? (
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  onClick={() => handleUpdateRole(u.id)}
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white p-1.5 h-7 w-7 rounded-lg"
                                >
                                  <Save className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  onClick={() => setEditingUser(null)}
                                  size="sm" 
                                  variant="ghost"
                                  className="text-text-secondary hover:text-text-primary p-1.5 h-7 w-7 rounded-lg hover:bg-bg-subtle"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  onClick={() => {
                                    setEditingUser(u);
                                    setEditRoleId(u.role_id || 1);
                                  }}
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-text-secondary hover:text-accent p-1.5 h-7 w-7 rounded-lg hover:bg-bg-subtle"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  onClick={() => handleDeleteUser(u.id)}
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-text-secondary hover:text-negative p-1.5 h-7 w-7 rounded-lg hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
