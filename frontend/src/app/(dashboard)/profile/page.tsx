'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, MapPin, Phone, FileText, Camera, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || 'Jane Doe');
  const [email, setEmail] = useState(user?.email || 'jane@vff.org');
  const [phone, setPhone] = useState('+94 77 123 4567');
  const [location, setLocation] = useState('Kalubovila Central Clinic');
  const [bio, setBio] = useState('Senior veterinarian officer coordinating Rabies eradication campaigns and population control clinics across Colombo region.');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      if (user) {
        setUser({ ...user, name, email });
      }
      setIsSaving(false);
      toast.success('Profile information updated successfully!');
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight mb-2 text-text-primary">
          My Profile
        </h1>
        <p className="text-text-secondary text-sm">
          Manage your personal details, credentials, and regional workspace assignments.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="space-y-6">
          <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#EF9F27]" />
            <CardContent className="p-0 pt-4 space-y-4">
              <div className="relative w-24 h-24 mx-auto rounded-full bg-amber-500/10 border-2 border-[#EF9F27]/20 flex items-center justify-center text-4xl font-extrabold text-[#EF9F27] group">
                {name[0].toUpperCase()}
                <button className="absolute bottom-0 right-0 p-1.5 bg-[#EF9F27] text-white rounded-full border border-surface hover:bg-[#EF9F27]/90 transition-colors shadow">
                  <Camera size={12} />
                </button>
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">{name}</h3>
                <p className="text-xs text-text-secondary mt-0.5">{email}</p>
              </div>
              <div className="pt-2">
                <Badge className="bg-accent/10 text-accent border border-accent/20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                  {user?.role || 'Staff Member'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-text-secondary">Workspace Status</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3 pt-1">
              <div className="flex items-center gap-2.5 text-xs text-text-secondary">
                <Shield className="h-4 w-4 text-accent" />
                <span>Permissions: Active</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-text-secondary">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{location}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-2">
          <Card className="bg-surface border border-border-brand rounded-card shadow-card p-5">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base font-semibold font-heading text-text-primary">Personal Details</CardTitle>
              <CardDescription className="text-text-secondary text-xs mt-1">Update your display name and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 bg-bg-subtle border-border-brand focus:border-accent text-xs rounded-lg h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                    <Input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-bg-subtle border-border-brand focus:border-accent text-xs rounded-lg h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                    <Input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-9 bg-bg-subtle border-border-brand focus:border-accent text-xs rounded-lg h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary">Office Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                    <Input 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-9 bg-bg-subtle border-border-brand focus:border-accent text-xs rounded-lg h-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">Biographical Context</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-text-secondary" size={16} />
                  <textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full pl-9 pr-3 py-2 bg-bg-subtle border border-border-brand focus:outline-none focus:border-accent text-xs rounded-lg text-text-primary"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-accent hover:bg-accent/80 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-sm"
                >
                  <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving Changes...' : 'Save Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
