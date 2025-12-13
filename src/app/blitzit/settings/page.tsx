'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account and app preferences.</p>
            </header>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="theme">Theme</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General</CardTitle>
                            <CardDescription>Configure your Pomodoro and break settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="space-y-2">
                                <Label>Pomodoro Duration (minutes)</Label>
                                <Slider defaultValue={[25]} max={60} min={15} step={5} />
                            </div>
                             <div className="space-y-2">
                                <Label>Break Duration (minutes)</Label>
                                <Slider defaultValue={[5]} max={30} min={5} step={1} />
                            </div>
                             <div className="space-y-2">
                                <Label>Long Break Duration (minutes)</Label>
                                <Slider defaultValue={[15]} max={60} min={15} step={5} />
                            </div>
                            <div className="space-y-2">
                                <Label>Sessions before Long Break</Label>
                                <RadioGroup defaultValue="4" className="flex">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="2" id="r2" />
                                        <Label htmlFor="r2">2</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="3" id="r3" />
                                        <Label htmlFor="r3">3</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="4" id="r4" />
                                        <Label htmlFor="r4">4</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="notifications">
                     <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Manage how you receive notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <Label htmlFor="sound-alerts">Sound Alerts</Label>
                                <Switch id="sound-alerts" defaultChecked />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label>Quiet Hours Start</Label>
                                    <Input type="time" defaultValue="22:00" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Quiet Hours End</Label>
                                    <Input type="time" defaultValue="08:00" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="theme">
                     <Card>
                        <CardHeader>
                            <CardTitle>Theme</CardTitle>
                            <CardDescription>Customize the look and feel of the app.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="flex items-center justify-between rounded-lg border p-4">
                                <Label>Dark Mode</Label>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="about">
                     <Card>
                        <CardHeader>
                            <CardTitle>About Blitzit</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>Version: 1.0.0</p>
                            <Separator />
                            <h3 className="font-semibold">Keyboard Shortcuts</h3>
                            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                                <li><span className="font-mono bg-muted p-1 rounded-md">Ctrl+K</span>: Focus search</li>
                                <li><span className="font-mono bg-muted p-1 rounded-md">Ctrl+N</span>: New task</li>
                            </ul>
                             <Separator />
                             <div className="flex gap-4">
                                <Button variant="link" className="p-0 h-auto">Privacy Policy</Button>
                                <Button variant="link" className="p-0 h-auto">Terms of Service</Button>
                             </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
