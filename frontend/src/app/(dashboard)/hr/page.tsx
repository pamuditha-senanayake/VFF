'use client';

import { useState, useEffect } from 'react';
import { useEmployees, useAttendance, useLockAttendance, useRunPayroll, useCreateEmployee } from '@/hooks/useHR';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock, Unlock, UserPlus, Filter, Download, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import ProtectedRoute from '@/components/layout/protected-route';
import { AuthService } from '@/services/auth.service';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { useThemeStore } from '@/store/useThemeStore';

export default function HRPage() {
  const [activeTab, setActiveTab] = useState('employees');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const { data: employees, isLoading: loadingEmployees } = useEmployees();
  const { data: attendance, isLoading: loadingAttendance } = useAttendance(selectedDate);
  
  const lockAttendance = useLockAttendance();
  const runPayroll = useRunPayroll();
  const createEmployee = useCreateEmployee();

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await AuthService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load system users');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'system_roles') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleAddEmployee = () => {
    const isDark = useThemeStore.getState().theme === 'dark';
    const inputStyle = `width: 100%; margin-top: 4px; box-sizing: border-box; font-size: 12px; height: 38px; background: ${isDark ? '#14161C' : '#FFFFFF'}; color: ${isDark ? '#F9FAFB' : '#111318'}; border: 1px solid ${isDark ? '#232730' : '#E5E7EB'}; border-radius: 8px; padding: 0 10px;`;
    
    Swal.fire({
      title: 'Add New Employee',
      html: `
        <div style="display: flex; flex-direction: column; gap: 12px; text-align: left; font-family: sans-serif;">
          <div>
            <label style="font-size: 10px; font-weight: bold; color: ${isDark ? '#9CA3AF' : '#6B7280'}; uppercase; tracking-wider;">FIRST NAME</label>
            <input id="swal-fn" style="${inputStyle}" placeholder="First name">
          </div>
          <div>
            <label style="font-size: 10px; font-weight: bold; color: ${isDark ? '#9CA3AF' : '#6B7280'}; uppercase; tracking-wider;">LAST NAME</label>
            <input id="swal-ln" style="${inputStyle}" placeholder="Last name">
          </div>
          <div>
            <label style="font-size: 10px; font-weight: bold; color: ${isDark ? '#9CA3AF' : '#6B7280'}; uppercase; tracking-wider;">NIC NUMBER</label>
            <input id="swal-nic" style="${inputStyle}" placeholder="e.g. 199512345678 or 951234567V">
          </div>
          <div>
            <label style="font-size: 10px; font-weight: bold; color: ${isDark ? '#9CA3AF' : '#6B7280'}; uppercase; tracking-wider;">BASE SALARY (LKR)</label>
            <input id="swal-salary" type="number" style="${inputStyle}" placeholder="50000">
          </div>
        </div>
      `,
      background: isDark ? '#0F1520' : '#FFFFFF',
      color: isDark ? '#F9FAFB' : '#111318',
      showCancelButton: true,
      confirmButtonText: 'Create Record',
      confirmButtonColor: '#EF9F27',
      cancelButtonText: 'Cancel',
      cancelButtonColor: isDark ? '#232730' : '#E5E7EB',
      preConfirm: () => {
        const fn = (document.getElementById('swal-fn') as HTMLInputElement).value.trim();
        const ln = (document.getElementById('swal-ln') as HTMLInputElement).value.trim();
        const nic = (document.getElementById('swal-nic') as HTMLInputElement).value.trim();
        const salary = (document.getElementById('swal-salary') as HTMLInputElement).value.trim();

        if (!fn || !ln || !nic || !salary) {
          Swal.showValidationMessage('All employee fields are required');
          return false;
        }

        const salVal = parseFloat(salary);
        if (isNaN(salVal) || salVal <= 0) {
          Swal.showValidationMessage('Salary must be a positive number');
          return false;
        }

        return { first_name: fn, last_name: ln, nic, base_salary: salVal, status: 'Active' };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        createEmployee.mutate(result.value);
      }
    });
  };

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading tracking-tight mb-2 text-text-primary">
              Human Resources
            </h1>
            <p className="text-text-secondary text-sm">
              Manage employees, track attendance, and lock records for payroll.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-border-brand text-text-primary hover:bg-bg-subtle text-xs">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button 
              onClick={handleAddEmployee}
              className="bg-accent hover:bg-accent/80 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-sm"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Add Employee
            </Button>
          </div>
        </div>

        {/* Tabs Control */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-bg-subtle border border-border-brand p-1 rounded-lg">
            <TabsTrigger value="employees" className="data-[state=active]:bg-surface data-[state=active]:text-accent text-xs font-semibold rounded-md transition-all">
              Employee List
            </TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-surface data-[state=active]:text-accent text-xs font-semibold rounded-md transition-all">
              Daily Attendance
            </TabsTrigger>
            <TabsTrigger value="payroll" className="data-[state=active]:bg-surface data-[state=active]:text-accent text-xs font-semibold rounded-md transition-all">
              Payroll Prep
            </TabsTrigger>
            <TabsTrigger value="system_roles" className="data-[state=active]:bg-surface data-[state=active]:text-accent text-xs font-semibold rounded-md transition-all">
              System Roles
            </TabsTrigger>
          </TabsList>

          {/* Employee Tab */}
          <TabsContent value="employees" className="mt-6">
            <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
              <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
                <div>
                  <CardTitle className="text-base font-semibold font-heading text-text-primary">Active Employees</CardTitle>
                  <CardDescription className="text-text-secondary text-xs mt-1">Directory of all current personnel.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="text-text-secondary hover:text-text-primary hover:bg-bg-subtle">
                  <Filter size={20} />
                </Button>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                {loadingEmployees ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full bg-bg-subtle" />
                    <Skeleton className="h-10 w-full bg-bg-subtle" />
                  </div>
                ) : (
                  <div className="rounded-xl border border-border-brand overflow-hidden">
                    <Table>
                      <TableHeader className="bg-bg-subtle">
                        <TableRow className="hover:bg-transparent border-border-brand">
                          <TableHead className="text-text-secondary font-heading text-xs">Name</TableHead>
                          <TableHead className="text-text-secondary font-heading text-xs">NIC</TableHead>
                          <TableHead className="text-text-secondary font-heading text-xs">Salary</TableHead>
                          <TableHead className="text-text-secondary font-heading text-xs">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employees?.map((emp) => (
                          <TableRow key={emp.id} className="border-border-brand hover:bg-[#14161C]/40 transition-colors">
                            <TableCell className="font-semibold text-text-primary text-xs">{emp.first_name} {emp.last_name}</TableCell>
                            <TableCell className="text-text-secondary text-xs font-mono">{emp.nic}</TableCell>
                            <TableCell className="text-text-primary font-mono text-xs font-semibold">LKR {emp.base_salary.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge className={
                                emp.status === 'Active' 
                                  ? 'bg-green-500/10 text-positive border border-green-500/20 rounded-full px-2 py-0.5 text-[10px]' 
                                  : 'bg-red-500/10 text-negative border border-red-500/20 rounded-full px-2 py-0.5 text-[10px]'
                              }>
                                {emp.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="mt-6">
            <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
              <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
                <div>
                  <CardTitle className="text-base font-semibold font-heading text-text-primary">Attendance Logs - {selectedDate}</CardTitle>
                  <CardDescription className="text-text-secondary text-xs mt-1">Manual check-ins and lock status indicator.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-bg-subtle border border-border-brand rounded-lg px-2 text-xs text-text-primary focus:outline-none focus:border-accent"
                  />
                  <Button 
                    onClick={() => lockAttendance.mutate(selectedDate)}
                    disabled={lockAttendance.isPending}
                    variant="outline"
                    className="border-accent/30 text-accent hover:bg-accent/10 text-xs"
                  >
                    <Lock className="mr-2 h-4 w-4" /> Lock Day
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                {loadingAttendance ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full bg-bg-subtle" />
                    <Skeleton className="h-10 w-full bg-bg-subtle" />
                  </div>
                ) : (
                  <div className="rounded-xl border border-border-brand overflow-hidden">
                    <Table>
                      <TableHeader className="bg-bg-subtle">
                        <TableRow className="hover:bg-transparent border-border-brand">
                          <TableHead className="text-text-secondary font-heading text-xs">Employee ID</TableHead>
                          <TableHead className="text-text-secondary font-heading text-xs">Check In</TableHead>
                          <TableHead className="text-text-secondary font-heading text-xs">Check Out</TableHead>
                          <TableHead className="text-text-secondary font-heading text-xs">Worked Hours</TableHead>
                          <TableHead className="text-text-secondary font-heading text-xs text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendance?.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-text-muted text-xs">No logs for this date</TableCell>
                          </TableRow>
                        ) : (
                          attendance?.map((row) => (
                            <TableRow key={row.id} className="border-border-brand hover:bg-[#14161C]/40 transition-colors">
                              <TableCell className="font-mono text-xs text-text-primary">#{row.employee_id}</TableCell>
                              <TableCell className="text-text-secondary text-xs">{row.clock_in ? format(new Date(row.clock_in), 'HH:mm') : '--'}</TableCell>
                              <TableCell className="text-text-secondary text-xs">{row.clock_out ? format(new Date(row.clock_out), 'HH:mm') : '--'}</TableCell>
                              <TableCell className="font-mono text-xs text-text-primary">{row.worked_hours || '0'}h</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" disabled={row.is_locked} className="text-text-secondary hover:text-text-primary">
                                  {row.is_locked ? <Lock size={14} /> : 'Edit'}
                                </Button>
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
          </TabsContent>
          
          {/* Payroll Tab */}
          <TabsContent value="payroll" className="mt-6">
            <div className="bg-surface border border-border-brand rounded-card shadow-card p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-amber-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Filter className="text-accent" size={32} />
                </div>
                <h3 className="text-xl font-bold font-heading mb-2 text-text-primary">Automated Payroll Generation</h3>
                <p className="text-text-secondary text-xs mb-6">Aggregate attendance logs to calculate monthly disbursements. Requires all days to be locked.</p>
                <Button
                  className="bg-accent hover:bg-accent/80 text-white font-semibold text-xs py-2 px-4 rounded-lg"
                  disabled={runPayroll.isPending}
                  onClick={() => {
                    const now = new Date();
                    runPayroll.mutate({ month: now.getMonth() + 1, year: now.getFullYear() });
                  }}
                >
                  {runPayroll.isPending ? 'Generating...' : 'Run Calculation'}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* System Roles Tab */}
          <TabsContent value="system_roles" className="mt-6">
            <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-base font-semibold font-heading text-text-primary">System Accounts</CardTitle>
                <CardDescription className="text-text-secondary text-xs mt-1">Assign and edit system permissions and roles.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                {loadingUsers ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full bg-bg-subtle" />
                    <Skeleton className="h-10 w-full bg-bg-subtle" />
                  </div>
                ) : (
                  <div className="rounded-xl border border-border-brand overflow-hidden">
                    <Table>
                      <TableHeader className="bg-bg-subtle">
                        <TableRow className="hover:bg-transparent border-border-brand">
                          <TableHead className="text-text-secondary font-heading text-xs">Email</TableHead>
                          <TableHead className="text-text-secondary font-heading text-xs">Current Role</TableHead>
                          <TableHead className="text-text-secondary font-heading text-xs text-right">Assign Role</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id} className="border-border-brand hover:bg-[#14161C]/40 transition-colors">
                            <TableCell className="font-semibold text-text-primary text-xs">{user.email}</TableCell>
                            <TableCell>
                              <Badge className="bg-accent/10 text-accent border border-accent/20 rounded-full px-2 py-0.5 text-[10px]">
                                {user.roles?.role_name || 'No Role'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <select
                                value={user.role_id}
                                onChange={async (e) => {
                                  const newRoleId = parseInt(e.target.value);
                                  try {
                                    await AuthService.updateUserRole(user.id, newRoleId);
                                    toast.success('Role updated successfully!');
                                    fetchUsers();
                                  } catch (err) {
                                    toast.error('Failed to update role');
                                  }
                                }}
                                className="bg-bg-subtle border border-border-brand rounded-lg px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent"
                              >
                                <option value={1}>Admin</option>
                                <option value={2}>Director</option>
                                <option value={3}>Finance Officer</option>
                                <option value={4}>HR Officer</option>
                                <option value={5}>Operations Lead</option>
                                <option value={6}>General Staff</option>
                                <option value={7}>System Administrator</option>
                              </select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
