'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FinanceService } from '@/services/finance.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Mock data for demo purposes when backend is unavailable
const MOCK_PROGRAMS = [
  { id: 101, program_name: 'Regional Vaccination Alpha', status: 'Active', total_animals_treated: 1240 },
  { id: 102, program_name: 'Urban Spay & Neuter Program', status: 'In Progress', total_animals_treated: 450 },
  { id: 103, program_name: 'Wildlife Habitat Restoration', status: 'Active', total_animals_treated: 85 },
  { id: 104, program_name: 'Endangered Species Monitoring', status: 'Active', total_animals_treated: 12 },
  { id: 105, program_name: 'Community Animal Health Clinic', status: 'In Progress', total_animals_treated: 890 },
];

export default function ProgramsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: programs, isLoading, isError } = useQuery({
    queryKey: ['programs'],
    queryFn: FinanceService.getPrograms,
    retry: 1
  });

  // Use mock data if API fails or returns empty for now
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
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-400',
          border: 'border-emerald-500/20'
        };
      case 'in progress': 
        return {
          icon: <Clock size={14} />,
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          border: 'border-amber-500/20'
        };
      default: 
        return {
          icon: <AlertCircle size={14} />,
          bg: 'bg-slate-500/10',
          text: 'text-slate-400',
          border: 'border-slate-500/20'
        };
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Program Registry</h1>
            {isError && (
              <Badge variant="outline" className="text-[10px] uppercase font-bold text-amber-500 border-amber-500/20 bg-amber-500/5 h-5">
                <Database size={10} className="mr-1" /> Demo Mode
              </Badge>
            )}
          </div>
          <p className="text-slate-400 max-w-2xl">
            Strategic oversight of environmental initiatives, animal health programs, and ecological impact assessments.
          </p>
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 px-6">
           <Plus className="mr-2 h-4 w-4" /> Initialize Program
        </Button>
      </div>

      {/* Stats/Dashboard Briefing (Optional Visual Add-on) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Programs', value: displayPrograms.filter(p => p.status === 'Active').length, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'Total Impact', value: displayPrograms.reduce((acc, p) => acc + (p.total_animals_treated || 0), 0).toLocaleString(), icon: Dog, color: 'text-blue-400' },
          { label: 'Growth/mo', value: '+12%', icon: TrendingUp, color: 'text-indigo-400' },
          { label: 'Resources', value: '94%', icon: Info, color: 'text-slate-400' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
            <div className={cn("p-2 rounded-lg bg-slate-800/50", stat.color)}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <Input 
            placeholder="Search tactical programs..." 
            className="pl-10 bg-slate-900/50 border-slate-800 focus:border-blue-500/50 transition-all h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-slate-800 hover:bg-slate-800 h-11">
          <Filter className="mr-2 h-4 w-4" /> Advanced Filter
        </Button>
      </div>

      {/* Programs Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => (
            <Skeleton key={i} className="h-48 w-full bg-slate-900/50 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program) => {
            const styles = getStatusStyles(program.status);
            return (
              <Card key={program.id} className="bg-slate-900/50 border-slate-800 hover:border-blue-600/30 transition-all hover:-translate-y-1 duration-300 group relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600/0 group-hover:bg-blue-600 transition-colors" />
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-400/20 bg-blue-400/5">
                      #ID-{program.id}
                    </Badge>
                    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-tight", styles.bg, styles.text, styles.border)}>
                      {styles.icon}
                      {program.status || 'Active'}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors leading-tight">
                    {program.program_name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 py-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Dog size={16} className="text-blue-400" />
                        Cumulative Impact
                      </div>
                      <span className="text-white font-bold tracking-tight">
                        {(program.total_animals_treated ?? 0).toLocaleString()} <span className="text-[10px] font-normal text-slate-500">Units</span>
                      </span>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                        <span>Milestone Progress</span>
                        <span>{Math.round(Math.min(100, ((program.total_animals_treated || 0) / 1500) * 100))}%</span>
                      </div>
                      <div className="w-full bg-slate-800/50 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.min(100, ((program.total_animals_treated || 0) / 1500) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-slate-800/50 flex justify-between items-center bg-slate-800/10">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800 -ml-2">
                    <TrendingUp className="mr-2 h-4 w-4 text-emerald-400" /> Analytics
                  </Button>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] text-slate-500 italic">Updated 2h ago</span>
                     <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      {filteredPrograms.length === 0 && !isLoading && (
        <div className="text-center py-24 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800 shadow-inner">
          <div className="mx-auto h-20 w-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
            <Handshake className="h-10 w-10 text-slate-600" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-300 mb-2">Operational Gap Detected</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            No active programs match your current filter parameters. Try clearing your search or establishing a new initiative.
          </p>
          <Button variant="link" className="mt-4 text-blue-400 hover:text-blue-300" onClick={() => setSearchTerm('')}>
            Clear Search Parameters
          </Button>
        </div>
      )}
    </div>
  );
}
