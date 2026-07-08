'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  Shield, 
  Wallet, 
  Users, 
  Package, 
  FileText, 
  ArrowRight,
  LifeBuoy
} from 'lucide-react';

interface DocArticle {
  id: number;
  category: 'rbac' | 'finance' | 'hr' | 'inventory' | 'faq';
  title: string;
  excerpt: string;
  content: string;
}

const DOCUMENTATION_ARTICLES: DocArticle[] = [
  {
    id: 1,
    category: 'rbac',
    title: 'Role-Based Access Control (RBAC) System Architecture',
    excerpt: 'Detailed specification of system roles, mapping structures, and API permissions matrix.',
    content: `
### System Roles Overview
The platform utilizes a structured RBAC architecture ensuring only authorized personnel access sensitive data modules.

| Role Name | Scope Description | Dashboard Permissions |
| :--- | :--- | :--- |
| **Admin** | Full administrative configuration | Access all modules, role assignments, user deletions. |
| **Director** | Strategic oversight and budget approvals | Access Overview, Programs, Finance, Inventory. |
| **Finance Officer** | General ledger maintenance & transaction entry | Access Finance, General Ledger, Programs tracking. |
| **HR Officer** | Staff management & attendance recording | Access HR, Attendance records, basic directory. |
| **Operations Lead** | Clinic management and program tracking | Access Programs, Inventory tracking, issues. |

### Access Validation Protocol
When a page is initialized, the system validates the logged user object's role property against the module's allowed list. If unauthorized, routes automatically trigger navigation redirect actions.
    `
  },
  {
    id: 2,
    category: 'finance',
    title: 'General Ledger Operations & Transaction Auditing',
    excerpt: 'Manual for financial entry rules, approval states, and compliance calculations.',
    content: `
### Financial Entry Lifecycle
All transactions flow through a rigid cycle ensuring zero audit discrepancy.

1. **Initiation**: Finance Officer registers transaction with description, amount, category, and source.
2. **Review**: Transactions exceeding budget thresholds flag for Director reviews.
3. **Approval**: Director marks status as Approved, updating ledger balance calculations.
4. **Archiving**: Closed months are cryptographically marked, preventing retrospect edits.

### Ledger Calculations
Disbursement entries sum automatically, updating regional balance calculations. Overdraft warnings flag when transaction sizes exceed remaining cash levels.
    `
  },
  {
    id: 3,
    category: 'hr',
    title: 'Human Resources Daily Attendance & Payroll Computation',
    excerpt: 'Guide for shift check-ins, record locking, and automated salary disbursements.',
    content: `
### Attendance Record Flow
Daily registers track work time details.
- **Clock In**: Personnel records start hour.
- **Clock Out**: Personnel records departure hour.
- **Lock Action**: Daily records must be manually locked by HR Officers before payroll processing.

### Payroll Calculations Formula
Total salary calculations are computed automatically:
$$\\text{Disbursement} = \\text{Base Salary} + (\\text{Overtime Hours} \\times \\text{OT Rate}) - \\text{Deductions}$$
Calculated payrolls cannot be overridden manually.
    `
  },
  {
    id: 4,
    category: 'inventory',
    title: 'Inventory Resource Management & Issues Auditing',
    excerpt: 'Logistics rules for medical supply issues, stock audits, and auto-toggling warnings.',
    content: `
### Inventory Audits
Items are registered with unique tracking references, current quantities, and unit costs.

### Issues and Returns Flow
- **Issue**: Medical supplies checked out for specific programs are immediately decremented.
- **Return**: Unused items checked back in are credited, updating local records.
- **Low Stock Indicator**: If quantity falls below the threshold, low stock warning badges display.
    `
  },
  {
    id: 5,
    category: 'faq',
    title: 'Frequently Asked Questions & Technical Operations FAQ',
    excerpt: 'Resolution steps for CORS errors, supabase connection drops, and authentication issues.',
    content: `
### Authentication Failures
**Q: Why does my login state drop unexpectedly?**
A: System session timeouts trigger automatic sign-outs if inactivity exceeds two hours. Please sign back in.

### CORS Header Restrictions
**Q: Why does the API return a 405 Method Not Allowed?**
A: CORS restrictions limit API operations to valid origins only. Ensure headers are correctly set in the environment files.
    `
  }
];

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<DocArticle | null>(null);

  const filteredArticles = DOCUMENTATION_ARTICLES.filter(art => 
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight mb-2 text-text-primary">
            Support Center
          </h1>
          <p className="text-text-secondary text-sm">
            Search our comprehensive, production-grade documentation database.
          </p>
        </div>
        <Badge className="bg-accent/10 text-accent border border-accent/20 rounded-full px-3 py-1 text-xs w-fit">
          <LifeBuoy className="mr-1.5 h-3.5 w-3.5" /> v1.2 Documentation
        </Badge>
      </div>

      {/* Search Section */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
        <Input 
          placeholder="Search system documentation (e.g. RBAC, payroll, ledger...)" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 bg-surface border-border-brand focus:border-accent text-xs rounded-lg h-12 transition-all shadow-sm"
        />
      </div>

      {/* Main Grid: Articles List vs Detail View */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Articles List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 px-1">
            Manual Chapters
          </div>
          {filteredArticles.length === 0 ? (
            <p className="text-xs text-text-secondary italic px-1">No matching articles found.</p>
          ) : (
            filteredArticles.map(art => (
              <Card 
                key={art.id} 
                onClick={() => setSelectedArticle(art)}
                className={`cursor-pointer transition-all border p-4 rounded-card shadow-sm hover:border-accent/40 ${
                  selectedArticle?.id === art.id 
                    ? 'bg-surface border-accent' 
                    : 'bg-surface border-border-brand'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-bg-subtle text-text-secondary border border-border-brand rounded px-1.5 py-0.5 text-[9px] font-mono capitalize">
                      {art.category}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-text-primary leading-snug">{art.title}</h4>
                  <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed">{art.excerpt}</p>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Article Detail View */}
        <div className="lg:col-span-2">
          {selectedArticle ? (
            <Card className="bg-surface border border-border-brand rounded-card shadow-card p-6 min-h-[500px]">
              <CardHeader className="p-0 pb-4 border-b border-border-brand flex flex-row items-start justify-between">
                <div>
                  <Badge className="bg-accent/10 text-accent border border-accent/20 rounded px-1.5 py-0.5 text-[10px] font-mono uppercase mb-2">
                    {selectedArticle.category} Document
                  </Badge>
                  <CardTitle className="text-xl font-bold font-heading text-text-primary leading-tight">
                    {selectedArticle.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-6 prose prose-invert max-w-none text-xs text-text-secondary space-y-4 leading-relaxed whitespace-pre-wrap">
                {selectedArticle.content}
              </CardContent>
            </Card>
          ) : (
            <div className="bg-surface border border-border-brand border-dashed rounded-card p-12 text-center flex flex-col items-center justify-center min-h-[500px] shadow-sm">
              <div className="h-16 w-16 bg-bg-subtle rounded-full flex items-center justify-center mb-6 border border-border-brand">
                <BookOpen className="h-8 w-8 text-text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Knowledge Base</h3>
              <p className="text-text-secondary text-xs max-w-md mx-auto leading-relaxed">
                Select a documentation chapter from the side menu to view detailed technical specifications, operational procedures, and system integration workflows.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
