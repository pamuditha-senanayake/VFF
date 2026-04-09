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
  Filter
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ProgramsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProgram, setNewProgram] = useState({
    program_name: '',
    status: 'Active',
    total_animals_treated: 0
  });

  const { data: programs, isLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: FinanceService.getPrograms
  });

  const createMutation = useMutation({
    mutationFn: FinanceService.createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success('Program successfully initiated');
      setIsModalOpen(false);
      setNewProgram({ program_name: '', status: 'Active', total_animals_treated: 0 });
    },
    onError: () => {
      toast.error('Failed to register program');
    }
  });

  const filteredPrograms = programs?.filter(p => 
    p.program_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <CheckCircle2 className="text-emerald-400" size={16} />;
      case 'in progress': return <Clock className="text-amber-400" size={16} />;
      default: return <AlertCircle className="text-slate-400" size={16} />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Program Registry</h1>
          <p className="text-slate-400">Manage environmental initiatives and animal treatment programs.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Initialize Program
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white">
            <DialogHeader>
              <DialogTitle>New Program Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Program Name</Label>
                <Input 
                  id="name" 
                  className="bg-slate-950 border-slate-800" 
                  placeholder="e.g. Village Vaccination Drive"
                  value={newProgram.program_name}
                  onChange={(e) => setNewProgram({...newProgram, program_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Initial Status</Label>
                <select 
                  id="status"
                  className="w-full bg-slate-950 border-slate-800 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  value={newProgram.status}
                  onChange={(e) => setNewProgram({...newProgram, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="border-slate-800 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => createMutation.mutate(newProgram)}
                disabled={!newProgram.program_name || createMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Registry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-500" size={18} />
          <Input 
            placeholder="Search programs..." 
            className="pl-10 bg-slate-900 border-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-slate-800">
          <Filter className="mr-2 h-4 w-4" /> Filter Status
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => (
            <Skeleton key={i} className="h-48 w-full bg-slate-900 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms?.map((program) => (
            <Card key={program.id} className="bg-slate-900 border-slate-800 hover:border-blue-600/50 transition-all group overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Handshake size={60} />
               </div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className="bg-blue-600/10 text-blue-400 border-blue-600/20 px-2 py-0">
                    ID: #{program.id}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                    {getStatusIcon(program.status)}
                    {program.status}
                  </div>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                  {program.program_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Dog size={16} />
                      Animals Treated
                    </div>
                    <span className="text-white font-bold">{program.total_animals_treated.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, (program.total_animals_treated/200)*100)}%` }} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-slate-800/50 flex justify-between items-center">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                  <TrendingUp className="mr-2 h-4 w-4" /> View Impact
                </Button>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {filteredPrograms?.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800">
          <Handshake className="mx-auto h-12 w-12 text-slate-700 mb-4" />
          <h3 className="text-lg font-medium text-slate-300">No programs found</h3>
          <p className="text-slate-500">Try adjusting your search or initiate a new program.</p>
        </div>
      )}
    </div>
  );
}
