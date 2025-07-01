
'use client';

import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Moon, Sun, Monitor, Contrast, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { currentUser, signOutUser } = useAuth();

  return (
    <main className="flex-grow p-4 md:p-8">
      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-headline text-primary">
            <SettingsIcon className="mr-3 h-8 w-8 text-accent" />
            Settings
          </CardTitle>
          <CardDescription>
            Manage your account and application preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Profile Section */}
          {currentUser && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-accent">Profile</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || "User"} />
                  <AvatarFallback>{currentUser.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <p className="text-lg font-medium">{currentUser.displayName}</p>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
                <Button variant="outline" onClick={signOutUser} className="w-full sm:w-auto">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Appearance Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-accent">Appearance</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choose how Rankle looks and feels. Your preference is saved automatically.
            </p>
            <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Label className="flex items-center space-x-3 rounded-md border p-4 cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-muted/50">
                <RadioGroupItem value="light" id="light" />
                <div className="flex items-center gap-2 font-medium">
                  <Sun className="h-5 w-5" /> Light
                </div>
              </Label>
              <Label className="flex items-center space-x-3 rounded-md border p-4 cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-muted/50">
                <RadioGroupItem value="dark" id="dark" />
                <div className="flex items-center gap-2 font-medium">
                  <Moon className="h-5 w-5" /> Dark
                </div>
              </Label>
              <Label className="flex items-center space-x-3 rounded-md border p-4 cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-muted/50">
                <RadioGroupItem value="high-contrast" id="high-contrast" />
                <div className="flex items-center gap-2 font-medium">
                  <Contrast className="h-5 w-5" /> High Contrast
                </div>
              </Label>
              <Label className="flex items-center space-x-3 rounded-md border p-4 cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-muted/50">
                <RadioGroupItem value="system" id="system" />
                <div className="flex items-center gap-2 font-medium">
                  <Monitor className="h-5 w-5" /> System
                </div>
              </Label>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
