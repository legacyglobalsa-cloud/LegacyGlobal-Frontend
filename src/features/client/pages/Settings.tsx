import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings as SettingsIcon,
  Bell,
  Mail,
  Shield,
  Globe,
  User,
  Building2,
  Smartphone,
  Lock,
  Save,
  AlertCircle
} from "lucide-react";
import { mockClientCompany } from "@/constants/mockClientData";

export default function ClientSettings() {
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    projectMilestones: true,
    documentUploads: true,
    invoices: true,
    proposals: true,
    contracts: true,
    newsletter: false,
    marketing: false,
  });

  const [contactPreferences, setContactPreferences] = useState({
    preferredContact: "email",
    language: "en",
    timezone: "Asia/Riyadh",
  });

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and notifications
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="company">
            <Building2 className="mr-2 h-4 w-4" /> Company
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Choose what email notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Updates */}
              <div className="space-y-4">
                <h4 className="font-medium">Project Updates</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Project milestone updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when project milestones are completed
                      </p>
                    </div>
                    <Switch
                      checked={notifications.projectMilestones}
                      onCheckedChange={() => handleNotificationChange("projectMilestones")}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Document uploads</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new documents are available
                      </p>
                    </div>
                    <Switch
                      checked={notifications.documentUploads}
                      onCheckedChange={() => handleNotificationChange("documentUploads")}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Financial Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium">Financial Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New invoices</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when new invoices are issued
                      </p>
                    </div>
                    <Switch
                      checked={notifications.invoices}
                      onCheckedChange={() => handleNotificationChange("invoices")}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contract & Proposal Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium">Contracts & Proposals</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New proposals</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new proposals are ready for review
                      </p>
                    </div>
                    <Switch
                      checked={notifications.proposals}
                      onCheckedChange={() => handleNotificationChange("proposals")}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Contract updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications about contracts pending signature
                      </p>
                    </div>
                    <Switch
                      checked={notifications.contracts}
                      onCheckedChange={() => handleNotificationChange("contracts")}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Marketing */}
              <div className="space-y-4">
                <h4 className="font-medium">Marketing & Updates</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Monthly updates about LegacyGlobal services
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newsletter}
                      onCheckedChange={() => handleNotificationChange("newsletter")}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Promotional offers and new service announcements
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={() => handleNotificationChange("marketing")}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Contact Preferences
              </CardTitle>
              <CardDescription>
                How would you like us to contact you?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Preferred Contact Method</Label>
                  <Select 
                    value={contactPreferences.preferredContact}
                    onValueChange={(value) => setContactPreferences(prev => ({ ...prev, preferredContact: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select 
                    value={contactPreferences.language}
                    onValueChange={(value) => setContactPreferences(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <Globe className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية (Arabic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select 
                    value={contactPreferences.timezone}
                    onValueChange={(value) => setContactPreferences(prev => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Riyadh">Asia/Riyadh (GMT+3)</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your personal account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={mockClientCompany.signatory.name.split(" ")[0]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={mockClientCompany.signatory.name.split(" ")[1]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={mockClientCompany.signatory.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue={mockClientCompany.signatory.phone} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
            <CardContent className="flex items-center gap-4 pt-6">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-medium">Email Change Requires Verification</p>
                <p className="text-sm text-muted-foreground">
                  If you change your email address, you'll need to verify the new email before it becomes active.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Your registered company details (read-only)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={mockClientCompany.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input value={mockClientCompany.registrationNumber} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={mockClientCompany.country} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input value={mockClientCompany.industry} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Registered Address</Label>
                <Input value={mockClientCompany.address} disabled />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
            <CardContent className="flex items-center gap-4 pt-6">
              <SettingsIcon className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium">Need to Update Company Information?</p>
                <p className="text-sm text-muted-foreground">
                  Company details can only be updated by contacting our support team with proper documentation.
                </p>
              </div>
              <Button variant="outline">Contact Support</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code in addition to your password
                  </p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage your active login sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                    <Smartphone className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-muted-foreground">
                      Chrome on Windows • Riyadh, Saudi Arabia
                    </p>
                    <p className="text-xs text-muted-foreground">Last active: Just now</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Sign Out All Other Sessions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
