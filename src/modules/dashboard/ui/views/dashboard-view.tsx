"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { 
  VideoIcon, 
  BotIcon, 
  PlusIcon, 
  ClockIcon, 
  ArrowRightIcon,
  CircleCheckIcon,
  ClockArrowUpIcon,
  LoaderIcon,
  ActivityIcon,
  TimerIcon
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const statusIconsMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: ClockIcon,
};

const statusColorMap = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  processing: "bg-gray-500/20 text-gray-800 border-gray-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
};

export const DashboardView = () => {
  const trpc = useTRPC();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Fetch recent meetings and agents data
  const { data: recentMeetings, isLoading: meetingsLoading } = useQuery(
    trpc.meetings.getMany.queryOptions({
      page: 1,
      pageSize: 5,
    })
  );

  const { data: agentsData, isLoading: agentsLoading } = useQuery(
    trpc.agents.getMany.queryOptions({
      page: 1,
      pageSize: 5,
    })
  );

  const { data: allMeetings } = useQuery(
    trpc.meetings.getMany.queryOptions({
      page: 1,
      pageSize: 100, // Get more for stats
    })
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionPending && !meetingsLoading && !agentsLoading) {
      gsap.registerPlugin(ScrollTrigger);

      // Header animation
      if (headerRef.current) {
        gsap.fromTo(headerRef.current, 
          {
            opacity: 0,
            y: -30,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out"
          }
        );
      }

      // Stats cards with magnetic hover
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll('.stat-card');
        
        gsap.fromTo(statCards,
          {
            opacity: 0,
            y: 50,
            rotationY: -15,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "back.out(1.7)",
            delay: 0.2
          }
        );

        // Add hover animations
        statCards.forEach((card) => {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              scale: 1.05,
              rotationY: 5,
              z: 20,
              boxShadow: "0 20px 40px rgba(34, 197, 94, 0.15)",
              duration: 0.3,
              ease: "power2.out"
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              scale: 1,
              rotationY: 0,
              z: 0,
              boxShadow: "0 0 0 rgba(34, 197, 94, 0)",
              duration: 0.4,
              ease: "power2.out"
            });
          });
        });
      }

      // Main content cards
      if (cardsRef.current) {
        const mainCards = cardsRef.current.querySelectorAll('.main-card');
        
        gsap.fromTo(mainCards,
          {
            opacity: 0,
            x: -50,
            rotationX: 20
          },
          {
            opacity: 1,
            x: 0,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            delay: 0.5
          }
        );
      }
    }
  }, [sessionPending, meetingsLoading, agentsLoading]);

  if (sessionPending || meetingsLoading || agentsLoading) {
    return <LoadingState title="Loading Dashboard" description="Preparing your workspace..." />;
  }

  if (!session?.user) {
    return <ErrorState title="Authentication Error" description="Please sign in to access the dashboard." />;
  }

  // Calculate statistics
  const totalMeetings = allMeetings?.total || 0;
  const totalAgents = agentsData?.total || 0;
  const upcomingMeetings = allMeetings?.items?.filter(m => m.status === 'upcoming').length || 0;
  const completedMeetings = allMeetings?.items?.filter(m => m.status === 'completed').length || 0;
  const activeMeetings = allMeetings?.items?.filter(m => m.status === 'active').length || 0;

  return (
    <div ref={containerRef} className="flex-1 py-4 px-4 md:px-8 space-y-6">
      {/* Welcome Header */}
      <div ref={headerRef} className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {session.user.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your AI meetings today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/agents">
            <Button variant="outline">
              <BotIcon className="size-4" />
              New Agent
            </Button>
          </Link>
          <Link href="/meetings">
            <Button>
              <VideoIcon className="size-4" />
              New Meeting
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div ref={statsRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <VideoIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMeetings}</div>
            <p className="text-xs text-muted-foreground">
              {completedMeetings} completed, {upcomingMeetings} upcoming
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Agents</CardTitle>
            <BotIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgents}</div>
            <p className="text-xs text-muted-foreground">
              Ready to assist in your meetings
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMeetings}</div>
            <p className="text-xs text-muted-foreground">
              Meetings currently in progress
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TimerIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedMeetings}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed meetings
            </p>
          </CardContent>
        </Card>
      </div>

      <div ref={cardsRef} className="grid gap-6 lg:grid-cols-2">
        {/* Recent Meetings */}
        <Card className="main-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Meetings</CardTitle>
                <CardDescription>
                  Your latest meeting activity
                </CardDescription>
              </div>
              <Link href="/meetings">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRightIcon className="size-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">{recentMeetings && recentMeetings.items.length > 0 ? (
              recentMeetings.items.slice(0, 5).map((meeting) => {
                const StatusIcon = statusIconsMap[meeting.status as keyof typeof statusIconsMap];
                
                return (
                  <div key={meeting.id} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <GeneratedAvatar
                          seed={meeting.agent?.name || meeting.name}
                          variant="initials"
                          className="size-10"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link 
                          href={`/meetings/${meeting.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {meeting.name}
                        </Link>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">
                            {meeting.agent?.name && (
                              <span>with {meeting.agent.name}</span>
                            )}
                          </p>
                          {meeting.createdAt && (
                            <p className="text-xs text-gray-500">
                              • {format(new Date(meeting.createdAt), "MMM d")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={cn("flex items-center gap-1", statusColorMap[meeting.status as keyof typeof statusColorMap])}
                      >
                        <StatusIcon className="size-3" />
                        {meeting.status}
                      </Badge>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6">
                <VideoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No meetings yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first meeting.</p>
                <div className="mt-4">
                  <Link href="/meetings">
                    <Button size="sm">
                      <PlusIcon className="size-4 mr-2" />
                      Create Meeting
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Agents */}
        <Card className="main-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>AI Agents</CardTitle>
                <CardDescription>
                  Your intelligent meeting assistants
                </CardDescription>
              </div>
              <Link href="/agents">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRightIcon className="size-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {agentsData && agentsData.items.length > 0 ? (
              agentsData.items.slice(0, 5).map((agent) => (
                <div key={agent.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <GeneratedAvatar
                        seed={agent.name}
                        variant="botttsNeutral"
                        className="size-10"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link 
                        href={`/agents/${agent.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {agent.name}
                      </Link>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">
                        {agent.instructions}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <VideoIcon className="size-3 text-blue-600" />
                      {agent.meetingCount}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <BotIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No agents yet</h3>
                <p className="mt-1 text-sm text-gray-500">Create an AI agent to assist in your meetings.</p>
                <div className="mt-4">
                  <Link href="/agents">
                    <Button size="sm">
                      <PlusIcon className="size-4 mr-2" />
                      Create Agent
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <Link href="/meetings">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <VideoIcon className="size-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">Quick Meeting</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Start an instant meeting with your AI agents
              </CardDescription>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-blue-600 font-medium">
                  {activeMeetings} active now
                </div>
                <ArrowRightIcon className="size-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <Link href="/agents">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <BotIcon className="size-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">New Agent</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create a specialized AI assistant for your needs
              </CardDescription>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-purple-600 font-medium">
                  {totalAgents} agents available
                </div>
                <ArrowRightIcon className="size-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Mobile Quick Actions */}
      <div className="sm:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/meetings" className="block">
              <Button variant="outline" className="w-full justify-start">
                <VideoIcon className="size-4" />
                New Meeting
              </Button>
            </Link>
            <Link href="/agents" className="block">
              <Button variant="outline" className="w-full justify-start">
                <BotIcon className="size-4" />
                Create Agent
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
