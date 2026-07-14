'use client';

import { useState } from 'react';
import { useRunPayroll, useAttendance } from '@/hooks/useHR';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { hasPermission } from '@/lib/permissions';
import { toast } from 'sonner';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function HRPayrollPage() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  
  const { user } = useAuthStore();
  const { mutate: runPayroll, isPending: isGenerating } = useRunPayroll();
  
  const { data: attendanceLogs, isLoading: isLoadingAttendance } = useAttendance(
    undefined, 
    parseInt(selectedMonth), 
    parseInt(selectedYear)
  );

  const unlockedRecords = attendanceLogs?.filter(log => !log.is_locked) || [];
  const hasUnlockedRecords = unlockedRecords.length > 0;
  
  const handleGenerate = () => {
    runPayroll({ month: parseInt(selectedMonth), year: parseInt(selectedYear) });
  };
  
  const handleApprove = () => {
    toast.success('Payroll approved and finalized.');
  };

  const canApprove = user && hasPermission(user.role, 'payroll:approve');
  const canGenerate = user && hasPermission(user.role, 'payroll:generate');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-text-primary">Payroll Generation</h1>
          <p className="text-text-secondary mt-1">Run readiness checks and generate monthly payroll.</p>
        </div>
      </div>

      <Card className="border-border-brand bg-surface max-w-2xl">
        <CardHeader>
          <CardTitle>Payroll Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-text-secondary">Month</label>
              <Select value={selectedMonth} onValueChange={(val) => val && setSelectedMonth(val)}>
                <SelectTrigger className="bg-bg-brand border-border-brand">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-text-secondary">Year</label>
              <Select value={selectedYear} onValueChange={(val) => val && setSelectedYear(val)}>
                <SelectTrigger className="bg-bg-brand border-border-brand">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border border-border-brand p-4 space-y-4">
            <h3 className="font-semibold text-text-primary">Readiness Check</h3>
            
            {isLoadingAttendance ? (
              <p className="text-sm text-text-secondary">Checking records...</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  {hasUnlockedRecords ? (
                    <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className={`font-medium ${hasUnlockedRecords ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {hasUnlockedRecords ? 'Attendance Lock Incomplete' : 'Attendance Fully Locked'}
                    </p>
                    <p className="text-sm text-text-secondary mt-1">
                      {hasUnlockedRecords 
                        ? `Cannot generate payroll: ${unlockedRecords.length} attendance records are active or incomplete in this period. Lock them first.`
                        : 'All attendance records for this period are locked and ready.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border-brand">
            {canGenerate && (
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || hasUnlockedRecords || isLoadingAttendance}
                className="bg-accent text-bg-brand hover:bg-accent/90 flex-1"
              >
                {isGenerating ? 'Generating...' : 'Generate Payroll'}
              </Button>
            )}
            
            {canApprove && (
              <Button 
                variant="outline"
                onClick={handleApprove}
                disabled={hasUnlockedRecords || isLoadingAttendance}
                className="flex-1 bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Approve & Finalize
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
