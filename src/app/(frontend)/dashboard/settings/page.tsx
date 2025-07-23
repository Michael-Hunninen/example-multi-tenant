"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Bell, Shield, User, Monitor, Volume2, Mail, Smartphone, Globe, Eye, Lock, CreditCard, Download, Trash2 } from "lucide-react"
import { useAuth } from '@/components/LMSAuth/AuthWrapper'
import BillingManagement from '@/components/BillingManagement'

// Mock settings data - replace with actual API calls
const mockSettings = {
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    programUpdates: true,
    newVideoAlerts: false,
    achievementAlerts: true,
    marketingEmails: false
  },
  privacy: {
    profileVisibility: "private",
    showProgress: true,
    showAchievements: true,
    allowMessages: false,
    dataCollection: true
  },
  playback: {
    autoplay: true,
    quality: "auto",
    playbackSpeed: "1x",
    subtitles: false,
    volume: 75
  },
  account: {
    language: "en",
    timezone: "America/Chicago",
    theme: "dark",
    emailFrequency: "weekly"
  }
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState(mockSettings)
  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // Save settings to API
    console.log('Saving settings:', settings)
    setHasChanges(false)
  }

  const handleReset = () => {
    setSettings(mockSettings)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and privacy settings</p>
        </div>
        {hasChanges && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:text-teal-300">
              Reset Changes
            </Button>
            <Button onClick={handleSave} className="bg-teal-400 hover:bg-teal-500 text-white">
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-gray-900 border-gray-800">
          <TabsTrigger value="notifications" className="data-[state=active]:bg-teal data-[state=active]:text-white">
            <Bell className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-teal data-[state=active]:text-white">
            <Shield className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="playback" className="data-[state=active]:bg-teal data-[state=active]:text-white">
            <Monitor className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Playback</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-teal data-[state=active]:text-white">
            <User className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-teal data-[state=active]:text-white">
            <CreditCard className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <div className="grid gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-teal" />
                  Email Notifications
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Choose what email notifications you'd like to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-sm text-gray-400">Receive email notifications for important updates</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                  />
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Weekly Digest</Label>
                    <p className="text-sm text-gray-400">Get a weekly summary of your learning progress</p>
                  </div>
                  <Switch
                    checked={settings.notifications.weeklyDigest}
                    onCheckedChange={(checked) => updateSetting('notifications', 'weeklyDigest', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Program Updates</Label>
                    <p className="text-sm text-gray-400">Notifications when new lessons are added to your programs</p>
                  </div>
                  <Switch
                    checked={settings.notifications.programUpdates}
                    onCheckedChange={(checked) => updateSetting('notifications', 'programUpdates', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">New Video Alerts</Label>
                    <p className="text-sm text-gray-400">Get notified when new videos are published</p>
                  </div>
                  <Switch
                    checked={settings.notifications.newVideoAlerts}
                    onCheckedChange={(checked) => updateSetting('notifications', 'newVideoAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Achievement Alerts</Label>
                    <p className="text-sm text-gray-400">Celebrate your achievements with email notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.achievementAlerts}
                    onCheckedChange={(checked) => updateSetting('notifications', 'achievementAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Marketing Emails</Label>
                    <p className="text-sm text-gray-400">Receive promotional content and special offers</p>
                  </div>
                  <Switch
                    checked={settings.notifications.marketingEmails}
                    onCheckedChange={(checked) => updateSetting('notifications', 'marketingEmails', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-teal" />
                  Push Notifications
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage browser and mobile push notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Push Notifications</Label>
                    <p className="text-sm text-gray-400">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="mt-6">
          <div className="grid gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-teal" />
                  Profile Visibility
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Control who can see your profile and learning activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Profile Visibility</Label>
                  <Select
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) => updateSetting('privacy', 'profileVisibility', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                      <SelectItem value="members">Members Only - Only other members can see your profile</SelectItem>
                      <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Show Progress</Label>
                    <p className="text-sm text-gray-400">Allow others to see your learning progress</p>
                  </div>
                  <Switch
                    checked={settings.privacy.showProgress}
                    onCheckedChange={(checked) => updateSetting('privacy', 'showProgress', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Show Achievements</Label>
                    <p className="text-sm text-gray-400">Display your achievements on your profile</p>
                  </div>
                  <Switch
                    checked={settings.privacy.showAchievements}
                    onCheckedChange={(checked) => updateSetting('privacy', 'showAchievements', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Allow Messages</Label>
                    <p className="text-sm text-gray-400">Let other members send you direct messages</p>
                  </div>
                  <Switch
                    checked={settings.privacy.allowMessages}
                    onCheckedChange={(checked) => updateSetting('privacy', 'allowMessages', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-teal" />
                  Data & Privacy
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your data and privacy preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Analytics & Data Collection</Label>
                    <p className="text-sm text-gray-400">Help us improve by sharing anonymous usage data</p>
                  </div>
                  <Switch
                    checked={settings.privacy.dataCollection}
                    onCheckedChange={(checked) => updateSetting('privacy', 'dataCollection', checked)}
                  />
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800">
                    <Download className="w-4 h-4 mr-2" />
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-red-700 text-red-400 hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete My Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Playback Tab */}
        <TabsContent value="playback" className="mt-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Monitor className="w-5 h-5 text-teal" />
                Video Playback Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Customize your video viewing experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Autoplay Next Video</Label>
                  <p className="text-sm text-gray-400">Automatically play the next video in a program</p>
                </div>
                <Switch
                  checked={settings.playback.autoplay}
                  onCheckedChange={(checked) => updateSetting('playback', 'autoplay', checked)}
                />
              </div>
              
              <Separator className="bg-gray-800" />
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Video Quality</Label>
                  <Select
                    value={settings.playback.quality}
                    onValueChange={(value) => updateSetting('playback', 'quality', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="auto">Auto (Recommended)</SelectItem>
                      <SelectItem value="1080p">1080p HD</SelectItem>
                      <SelectItem value="720p">720p HD</SelectItem>
                      <SelectItem value="480p">480p</SelectItem>
                      <SelectItem value="360p">360p</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Default Playback Speed</Label>
                  <Select
                    value={settings.playback.playbackSpeed}
                    onValueChange={(value) => updateSetting('playback', 'playbackSpeed', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="0.5x">0.5x</SelectItem>
                      <SelectItem value="0.75x">0.75x</SelectItem>
                      <SelectItem value="1x">1x (Normal)</SelectItem>
                      <SelectItem value="1.25x">1.25x</SelectItem>
                      <SelectItem value="1.5x">1.5x</SelectItem>
                      <SelectItem value="2x">2x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Subtitles/Captions</Label>
                  <p className="text-sm text-gray-400">Show subtitles when available</p>
                </div>
                <Switch
                  checked={settings.playback.subtitles}
                  onCheckedChange={(checked) => updateSetting('playback', 'subtitles', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Default Volume</Label>
                  <span className="text-sm text-gray-400">{settings.playback.volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.playback.volume}
                  onChange={(e) => updateSetting('playback', 'volume', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="mt-6">
          <div className="grid gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-teal" />
                  Language & Region
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Set your language and regional preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Language</Label>
                    <Select
                      value={settings.account.language}
                      onValueChange={(value) => updateSetting('account', 'language', value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Timezone</Label>
                    <Select
                      value={settings.account.timezone}
                      onValueChange={(value) => updateSetting('account', 'timezone', value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Appearance</CardTitle>
                <CardDescription className="text-gray-400">
                  Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Theme</Label>
                  <Select
                    value={settings.account.theme}
                    onValueChange={(value) => updateSetting('account', 'theme', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="auto">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Communication Preferences</CardTitle>
                <CardDescription className="text-gray-400">
                  How often would you like to hear from us?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Email Frequency</Label>
                  <Select
                    value={settings.account.emailFrequency}
                    onValueChange={(value) => updateSetting('account', 'emailFrequency', value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="mt-6">
          {user?.id ? (
            <BillingManagement userId={user.id} />
          ) : (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">Please log in to view billing information</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
