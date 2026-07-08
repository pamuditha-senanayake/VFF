'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FinanceService } from '@/services/finance.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Handshake, 
  Plus, 
  Dog, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  Info,
  Database
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { useThemeStore } from '@/store/useThemeStore';

const MOCK_PROGRAMS = [
  { id: 101, program_name: 'Regional Vaccination Alpha', status: 'Active', total_animals_treated: 1240 },
  { id: 102, program_name: 'Urban Spay & Neuter Program', status: 'In Progress', total_animals_treated: 450 },
  { id: 103, program_name: 'Wildlife Habitat Restoration', status: 'Active', total_animals_treated: 85 },
  { id: 104, program_name: 'Endangered Species Monitoring', status: 'Active', total_animals_treated: 12 },
  { id: 105, program_name: 'Community Animal Health Clinic', status: 'In Progress', total_animals_treated: 890 },
];

export default function ProgramsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  
  const { data: programs, isLoading, isError } = useQuery({
    queryKey: ['programs'],
    queryFn: FinanceService.getPrograms,
    retry: 1
  });

  const createProgram = useMutation({
    mutationFn: FinanceService.createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success('Program initialized successfully!');
    },
    onError: () => {
      toast.error('Failed to initialize program');
    }
  });

  const displayPrograms = useMemo(() => {
    if (isLoading) return [];
    if (!programs || programs.length === 0 || isError) return MOCK_PROGRAMS;
    return programs;
  }, [programs, isLoading, isError]);

  const filteredPrograms = useMemo(() => {
    return displayPrograms.filter(p => 
      p.program_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [displayPrograms, searchTerm]);

  const getStatusStyles = (status: string) => {
    switch ((status || 'Active').toLowerCase()) {
      case 'active': 
        return {
          icon: <CheckCircle2 size={14} />,
          bg: 'bg-green-500/10',
          text: 'text-positive',
          border: 'border-green-500/20'
        };
      case 'in progress': 
        return {
          icon: <Clock size={14} />,
          bg: 'bg-amber-500/10',
          text: 'text-accent',
          border: 'border-accent/20'
        };
      default: 
        return {
          icon: <AlertCircle size={14} />,
          bg: 'bg-bg-subtle',
          text: 'text-text-secondary',
          border: 'border-border-brand'
        };
    }
  };

  const handleInitializeProgram = () => {
    const isDark = useThemeStore.getState().theme === 'dark';
    const inputStyle = `width: 100%; margin-top: 4px; box-sizing: border-box; font-size: 12px; height: 38px; background: ${isDark ? '#14161C' : '#FFFFFF'}; color: ${isDark ? '#F9FAFB' : '#111318'}; border: 1px solid ${isDark ? '#232730' : '#E5E7EB'}; border-radius: 8px; padding: 0 10px;`;
    
    Swal.fire({
      title: 'Initialize New Program',
      html: `
        <div style="display: flex; flex-direction: column; gap: 12px; text-align: left; font-family: sans-serif;">
          <div>
            <label style="font-size: 10px; font-weight: bold; color: ${isDark ? '#9CA3AF' : '#6B7280'}; uppercase; tracking-wider;">PROGRAM NAME</label>
            <input id="swal-pname" style="${inputStyle}" placeholder="Program name">
          </div>
          <div>
            <label style="font-size: 10px; font-weight: bold; color: ${isDark ? '#9CA3AF' : '#6B7280'}; uppercase; tracking-wider;">BUDGET (LKR)</label>
            <input id="swal-budget" type="number" style="${inputStyle}" placeholder="250000">
          </div>
          <div>
            <label style="font-size: 10px; font-weight: bold; color: ${isDark ? '#9CA3AF' : '#6B7280'}; uppercase; tracking-wider;">INITIAL ANIMALS TREATED</label>
            <input id="swal-treated" type="number" style="${inputStyle}" placeholder="0">
          </div>
          <div>
            <label style="font-size: 10px; font-weight: bold; color: ${isDark ? '#9CA3AF' : '#6B7280'}; uppercase; tracking-wider;">STATUS</label>
            <select id="swal-status" style="${inputStyle}">
              <option value="Active">Active</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
        </div>
      `,
      background: isDark ? '#0F1520' : '#FFFFFF',
      color: isDark ? '#F9FAFB' : '#111318',
      showCancelButton: true,
      confirmButtonText: 'Initialize',
      confirmButtonColor: '#EF9F27',
      cancelButtonText: 'Cancel',
      cancelButtonColor: isDark ? '#232730' : '#E5E7EB',
      preConfirm: () => {
        const name = (document.getElementById('swal-pname') as HTMLInputElement).value.trim();
        const budget = (document.getElementById('swal-budget') as HTMLInputElement).value.trim();
        const treated = (document.getElementById('swal-treated') as HTMLInputElement).value.trim();
        const status = (document.getElementById('swal-status') as HTMLSelectElement).value;

        if (!name || !budget || !status) {
          Swal.showValidationMessage('Program name and budget are required');
          return false;
        }

        const bVal = parseFloat(budget);
        if (isNaN(bVal) || bVal <= 0) {
          Swal.showValidationMessage('Budget must be a positive number');
          return false;
        }

        return {
          program_name: name,
          budget: bVal,
          total_animals_treated: parseInt(treated) || 0,
          status
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        createProgram.mutate(result.value);
      }
    });
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold font-heading tracking-tight text-text-primary">Program Registry</h1>
            {isError && (
              <Badge variant="outline" className="text-[9px] uppercase font-bold text-accent border-accent/20 bg-accent/5 h-5 rounded-full px-2">
                <Database size={10} className="mr-1" /> Demo Mode
              </Badge>
            )}
          </div>
          <p className="text-text-secondary text-sm max-w-2xl">
            Strategic oversight of environmental initiatives, animal health programs, and ecological impact assessments.
          </p>
        </div>
        
        <Button 
          onClick={handleInitializeProgram}
          className="bg-accent hover:bg-accent/80 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-sm"
        >
           <Plus className="mr-2 h-4 w-4" /> Initialize Program
        </Button>
      </div>

      {/* Stats/Dashboard Briefing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Programs', value: displayPrograms.filter(p => p.status === 'Active').length, icon: CheckCircle2, color: 'text-positive' },
          { label: 'Total Impact', value: displayPrograms.reduce((acc, p) => acc + (p.total_animals_treated || 0), 0).toLocaleString(), icon: Dog, color: 'text-accent' },
          { label: 'Growth/mo', value: '+12%', icon: TrendingUp, color: 'text-accent' },
          { label: 'Resources', value: '94%', icon: Info, color: 'text-text-secondary' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-surface border border-border-brand p-4 rounded-card flex items-center gap-4 shadow-card">
            <div className={cn("p-2 rounded-lg bg-bg-subtle", stat.color)}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-text-primary font-heading mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <Input 
            placeholder="Search tactical programs..." 
            className="pl-10 bg-bg-subtle border-border-brand focus:border-accent text-xs rounded-lg transition-all h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-border-brand text-text-primary hover:bg-bg-subtle h-11 text-xs">
          <Filter className="mr-2 h-4 w-4" /> Advanced Filter
        </Button>
      </div>

      {/* Programs Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => (
            <Skeleton key={i} className="h-48 w-full bg-bg-subtle rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program) => {
            const styles = getStatusStyles(program.status);
            return (
              <Card key={program.id} className="bg-surface border border-border-brand rounded-card shadow-card hover:border-accent/30 transition-all hover:-translate-y-1 duration-300 group relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent/0 group-hover:bg-accent transition-colors" />
                
                <CardHeader className="pb-2 p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className="text-[9px] text-accent border-accent/20 bg-accent/5 rounded-full px-2">
                      #ID-{program.id}
                    </Badge>
                    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-tight", styles.bg, styles.text, styles.border)}>
                      {styles.icon}
                      {program.status || 'Active'}
                    </div>
                  </div>
                  <CardTitle className="text-lg text-text-primary group-hover:text-accent font-heading transition-colors leading-tight">
                    {program.program_name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 py-4 px-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Dog size={16} className="text-accent" />
                        Cumulative Impact
                      </div>
                      <span className="text-text-primary font-bold font-mono text-sm">
                        {(program.total_animals_treated ?? 0).toLocaleString()} <span className="text-[9px] font-normal text-text-secondary">Units</span>
                      </span>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] uppercase font-bold text-text-secondary">
                        <span>Milestone Progress</span>
                        <span className="font-mono">{Math.round(Math.min(100, ((program.total_animals_treated || 0) / 1500) * 100))}%</span>
                      </div>
                      <div className="w-full bg-bg-subtle rounded-full h-1.5 overflow-hidden border border-border-brand">
                        <div 
                          className="bg-accent h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.min(100, ((program.total_animals_treated || 0) / 1500) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-border-brand flex justify-between items-center bg-bg-subtle p-4 px-5 rounded-b-card">
                  <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary hover:bg-surface -ml-2 text-xs">
                    <TrendingUp className="mr-2 h-4 w-4 text-positive" /> Analytics
                  </Button>
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] text-text-muted italic">Updated 2h ago</span>
                     <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      {filteredPrograms.length === 0 && !isLoading && (
        <div className="text-center py-24 bg-bg-subtle rounded-card border border-dashed border-border-brand shadow-inner">
          <div className="mx-auto h-20 w-20 bg-surface rounded-full flex items-center justify-center mb-6 border border-border-brand">
            <Handshake className="h-10 w-10 text-text-secondary" />
          </div>
          <h3 className="text-xl font-bold font-heading text-text-primary mb-2">Operational Gap Detected</h3>
          <p className="text-text-secondary text-xs max-w-sm mx-auto">
            No active programs match your current filter parameters. Try clearing your search or establishing a new initiative.
          </p>
          <Button variant="link" className="mt-4 text-accent hover:text-accent/80 text-xs font-semibold" onClick={() => setSearchTerm('')}>
            Clear Search Parameters
          </Button>
        </div>
      )}
    </div>
  );
}
