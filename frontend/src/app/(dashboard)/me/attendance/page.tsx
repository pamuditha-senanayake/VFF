'use client';

import { useMyAttendance, useClockIn, useClockOut } from '@/hooks/useHR';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Clock, Lock, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyAttendancePage() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const { data: attendanceLogs, isLoading } = useMyAttendance(currentMonth, currentYear);
  const { mutate: clockIn, isPending: isClockingIn } = useClockIn();
  const { mutate: clockOut, isPending: isClockingOut } = useClockOut();
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayRecord = attendanceLogs?.find(log => log.target_date === todayStr);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-text-primary">My Attendance</h1>
          <p className="text-text-secondary mt-1">Manage your daily clock-ins and view attendance history.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-border-brand bg-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Today's Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 space-y-6">
            {isLoading ? (
              <Skeleton className="w-full h-32 rounded-lg" />
            ) : !todayRecord ? (
              <>
                <div className="text-center">
                  <p className="text-text-secondary">You haven't clocked in yet.</p>
                </div>
                <Button 
                  onClick={() => clockIn()} 
                  disabled={isClockingIn}
                  className="w-full bg-accent text-bg-brand hover:bg-accent/90"
                  size="lg"
                >
                  {isClockingIn ? 'Clocking In...' : 'Clock In Now'}
                </Button>
              </>
            ) : todayRecord.is_locked ? (
              <>
                <div className="text-center space-y-2">
                  <Lock className="w-12 h-12 text-emerald-500 mx-auto" />
                  <p className="font-medium text-emerald-500">Attendance Completed</p>
                  <p className="text-sm text-text-secondary">
                    In: {format(new Date(todayRecord.clock_in!), 'HH:mm')} | Out: {todayRecord.clock_out ? format(new Date(todayRecord.clock_out), 'HH:mm') : '-'}
                  </p>
                  <p className="text-xs text-text-secondary">{todayRecord.worked_hours ?? 0} hours worked</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <div className="animate-pulse bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-sm font-medium inline-block mb-2">
                    Active Session
                  </div>
                  <p className="text-sm text-text-secondary">
                    Clocked in at {format(new Date(todayRecord.clock_in!), 'HH:mm')}
                  </p>
                </div>
                <Button 
                  onClick={() => clockOut()} 
                  disabled={isClockingOut}
                  className="w-full bg-rose-500 text-white hover:bg-rose-600"
                  size="lg"
                >
                  {isClockingOut ? 'Clocking Out...' : 'Clock Out'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-border-brand bg-surface">
          <CardHeader>
            <CardTitle>My Attendance This Month</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-12" />)}
              </div>
            ) : attendanceLogs && attendanceLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text-secondary uppercase bg-bg-subtle/50">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Date</th>
                      <th className="px-4 py-3">Clock In</th>
                      <th className="px-4 py-3">Clock Out</th>
                      <th className="px-4 py-3">Hours</th>
                      <th className="px-4 py-3 rounded-r-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceLogs.map((log) => (
                      <tr key={log.id} className="border-b border-border-brand last:border-0">
                        <td className="px-4 py-3 font-medium">{log.target_date}</td>
                        <td className="px-4 py-3 text-text-secondary">
                          {log.clock_in ? format(new Date(log.clock_in), 'HH:mm') : '-'}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {log.clock_out ? format(new Date(log.clock_out), 'HH:mm') : '-'}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {log.worked_hours ? `${log.worked_hours}h` : '-'}
                        </td>
                        <td className="px-4 py-3">
                          {log.is_locked ? (
                            log.clock_out ? (
                              <span className="flex items-center gap-1.5 text-emerald-500">
                                <Lock className="w-3.5 h-3.5" /> Locked
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-rose-500">
                                <AlertCircle className="w-3.5 h-3.5" /> Incomplete
                              </span>
                            )
                          ) : (
                            <span className="flex items-center gap-1.5 text-amber-500">
                              <Clock className="w-3.5 h-3.5" /> Active
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary">
                No attendance records found for this month.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
