'use client';

import { useState } from 'react';
import { useEmployees, useAttendance, useLockAttendance } from '@/hooks/useHR';
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
import { Lock, Unlock, UserPlus, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';
import ProtectedRoute from '@/components/layout/protected-route';

export default function HRPage() {
  const [activeTab, setActiveTab] = useState('employees');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const { data: employees, isLoading: loadingEmployees } = useEmployees();
  const { data: attendance, isLoading: loadingAttendance } = useAttendance(selectedDate);
  const lockAttendance = useLockAttendance();

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <div className="space-y-8">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Human Resources</h1>
          <p className="text-slate-400">Manage employees, track attendance, and lock records for payroll.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-800 hover:bg-slate-900">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 p-1">
          <TabsTrigger value="employees" className="data-[state=active]:bg-slate-800">Employee List</TabsTrigger>
          <TabsTrigger value="attendance" className="data-[state=active]:bg-slate-800">Daily Attendance</TabsTrigger>
          <TabsTrigger value="payroll" className="data-[state=active]:bg-slate-800">Payroll Prep</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="mt-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Active Employees</CardTitle>
                <CardDescription>Directory of all current personnel.</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400">
                <Filter size={20} />
              </Button>
            </CardHeader>
            <CardContent>
              {loadingEmployees ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full bg-slate-800" />
                  <Skeleton className="h-10 w-full bg-slate-800" />
                  <Skeleton className="h-10 w-full bg-slate-800" />
                </div>
              ) : (
                <div className="rounded-md border border-slate-800 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-950">
                      <TableRow className="hover:bg-transparent border-slate-800">
                        <TableHead className="text-slate-300">Name</TableHead>
                        <TableHead className="text-slate-300">NIC</TableHead>
                        <TableHead className="text-slate-300">Salary</TableHead>
                        <TableHead className="text-slate-300">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees?.map((emp) => (
                        <TableRow key={emp.id} className="border-slate-800 hover:bg-slate-800/40">
                          <TableCell className="font-medium">{emp.first_name} {emp.last_name}</TableCell>
                          <TableCell>{emp.nic}</TableCell>
                          <TableCell>${emp.base_salary.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={
                              emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              'bg-rose-500/10 text-rose-400 border-rose-500/20'
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

        <TabsContent value="attendance" className="mt-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Attendance Logs - {selectedDate}</CardTitle>
                <CardDescription>Manual check-ins and lock status indicator.</CardDescription>
              </div>
              <div className="flex gap-2">
                 <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 text-sm text-slate-300"
                />
                <Button 
                  onClick={() => lockAttendance.mutate(selectedDate)}
                  disabled={lockAttendance.isPending}
                  variant="outline"
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                >
                  <Lock className="mr-2 h-4 w-4" /> Lock Day
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingAttendance ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full bg-slate-800" />
                  <Skeleton className="h-10 w-full bg-slate-800" />
                </div>
              ) : (
                <div className="rounded-md border border-slate-800 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-950">
                      <TableRow className="hover:bg-transparent border-slate-800">
                        <TableHead className="text-slate-300">Employee ID</TableHead>
                        <TableHead className="text-slate-300">Check In</TableHead>
                        <TableHead className="text-slate-300">Check Out</TableHead>
                        <TableHead className="text-slate-300">Worked Hours</TableHead>
                        <TableHead className="text-slate-300 text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendance?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-slate-500">No logs for this date</TableCell>
                        </TableRow>
                      ) : (
                        attendance?.map((row) => (
                          <TableRow key={row.id} className="border-slate-800 hover:bg-slate-800/40">
                            <TableCell className="font-mono">#{row.employee_id}</TableCell>
                            <TableCell>{row.clock_in ? format(new Date(row.clock_in), 'HH:mm') : '--'}</TableCell>
                            <TableCell>{row.clock_out ? format(new Date(row.clock_out), 'HH:mm') : '--'}</TableCell>
                            <TableCell>{row.worked_hours || '0'}h</TableCell>
                            <TableCell className="text-right">
                               <Button variant="ghost" size="sm" disabled={row.is_locked}>
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
        
        <TabsContent value="payroll" className="mt-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
             <div className="max-w-md mx-auto">
               <div className="bg-blue-600/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                 <Filter className="text-blue-400" size={32} />
               </div>
               <h3 className="text-xl font-bold mb-2">Automated Payroll Generation</h3>
               <p className="text-slate-400 mb-6">Aggregate attendance logs to calculate monthly disbursements. Requires all days to be locked.</p>
               <Button className="bg-blue-600">Run Calculation</Button>
             </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </ProtectedRoute>
  );
}

