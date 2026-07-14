'use client';

import { useState } from 'react';
import { useAttendance, useLockAttendance } from '@/hooks/useHR';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';
import { Lock, AlertCircle, Clock, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function HRAttendancePage() {
  const [targetDate, setTargetDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [filterIncomplete, setFilterIncomplete] = useState(false);

  const { data: attendanceLogs, isLoading } = useAttendance(targetDate);
  const { mutate: lockDay, isPending: isLocking } = useLockAttendance();

  const handleLockDay = () => {
    lockDay(targetDate);
  };

  const filteredLogs = attendanceLogs?.filter(log => {
    if (filterIncomplete) {
      return log.is_locked && !log.clock_out;
    }
    return true;
  });

  const allLocked = attendanceLogs?.length && attendanceLogs.every(log => log.is_locked);
  const totalIncomplete = attendanceLogs?.filter(log => log.is_locked && !log.clock_out).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-text-primary">Attendance Logs</h1>
          <p className="text-text-secondary mt-1">Review and manage daily attendance records.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-40 bg-surface border-border-brand"
            max={format(new Date(), 'yyyy-MM-dd')}
          />
          <Button 
            variant="outline"
            onClick={() => setFilterIncomplete(!filterIncomplete)}
            className={filterIncomplete ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : ''}
          >
            {filterIncomplete ? 'Show All' : 'Show Incomplete'}
          </Button>

          <Dialog>
            <DialogTrigger render={
              <Button 
                disabled={!attendanceLogs?.length || allLocked || isLocking}
                className="bg-accent text-bg-brand hover:bg-accent/90"
              />
            }>
              <Lock className="w-4 h-4 mr-2" />
              {allLocked ? 'Day Locked' : 'Lock Day'}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-bg-brand text-text-primary border-border-brand">
              <DialogHeader>
                <DialogTitle>Lock Attendance for {targetDate}</DialogTitle>
                <DialogDescription className="text-text-secondary">
                  Are you sure? Locking the day will make all current records immutable. 
                  Any active clock-ins will be marked as 'Incomplete'.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <DialogClose render={<Button variant="outline" />}>
                  Cancel
                </DialogClose>
                <DialogClose render={
                  <Button 
                    onClick={handleLockDay} 
                    className="bg-accent text-bg-brand hover:bg-accent/90"
                  />
                }>
                  Confirm Lock
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-surface border-border-brand">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
            <p className="text-sm font-medium text-text-secondary">Total Clocked In</p>
            <p className="text-2xl font-bold font-heading">{attendanceLogs?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border-brand">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
            <p className="text-sm font-medium text-text-secondary">Active Sessions</p>
            <p className="text-2xl font-bold font-heading text-amber-500">
              {attendanceLogs?.filter(l => !l.is_locked).length || 0}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border-brand">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
            <p className="text-sm font-medium text-text-secondary">Completed</p>
            <p className="text-2xl font-bold font-heading text-emerald-500">
              {attendanceLogs?.filter(l => l.is_locked && l.clock_out).length || 0}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border-brand">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
            <p className="text-sm font-medium text-text-secondary">Incomplete</p>
            <p className="text-2xl font-bold font-heading text-rose-500">
              {totalIncomplete}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border-brand bg-surface">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="w-full h-12" />)}
            </div>
          ) : filteredLogs && filteredLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-secondary uppercase bg-bg-subtle/50">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Clock In</th>
                    <th className="px-6 py-4">Clock Out</th>
                    <th className="px-6 py-4">Hours</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-brand">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-bg-subtle/50 transition-colors">
                      <td className="px-6 py-4 font-medium">
                        {log.employee_profile?.first_name} {log.employee_profile?.last_name}
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {log.clock_in ? format(new Date(log.clock_in), 'HH:mm') : '-'}
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {log.clock_out ? format(new Date(log.clock_out), 'HH:mm') : '-'}
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {log.worked_hours ? `${log.worked_hours}h` : '-'}
                      </td>
                      <td className="px-6 py-4 flex justify-end">
                        {log.is_locked ? (
                          log.clock_out ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                              <Lock className="w-3.5 h-3.5" /> Locked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-500">
                              <AlertCircle className="w-3.5 h-3.5" /> Incomplete
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
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
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-bg-subtle mb-4">
                <Search className="w-6 h-6 text-text-secondary" />
              </div>
              <p className="text-text-primary font-medium">No records found</p>
              <p className="text-text-secondary text-sm mt-1">
                {filterIncomplete ? 'No incomplete records for this date.' : 'No attendance logs for this date.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
