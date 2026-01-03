
'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/header';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink } from 'lucide-react';
import { coursesData, type Course } from '@/lib/courses-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons';
import Image from 'next/image';
import placeholderImages from "@/lib/placeholder-images.json" with { type: "json" };
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { CoursesSidebar } from '@/components/courses-sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';


function CourseCard({ course }: { course: Course }) {
  const image = placeholderImages[course.imageKey as keyof typeof placeholderImages] || placeholderImages.futureAbstract;
  return (
    <div className="themed-card rounded-xl overflow-hidden group border">
      <div className="relative aspect-video">
        <Image 
          src={image.src}
          alt={course.title}
          width={image.width}
          height={image.height}
          className="object-cover w-full h-full"
          data-ai-hint="course image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-4 right-4 p-2 bg-background/80 rounded-full">
            <Icon name={course.icon} className="w-5 h-5 text-accent" />
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold font-serif mb-2 text-foreground">{course.title}</h3>
        <p className="text-muted-foreground mb-4 text-sm">{course.description}</p>
        <Button className="w-full btn-main">
          Start Learning <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}


export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState<string[]>(coursesData.map(c => c.id));

  const filteredCourses = useMemo(() => {
    if (!searchQuery) {
      return coursesData;
    }
    return coursesData.map(category => {
      const filtered = category.courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...category, courses: filtered };
    }).filter(category => category.courses.length > 0);
  }, [searchQuery]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <CoursesSidebar />
        <SidebarInset>
          <Header showSidebarTrigger={true} />
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <main className="flex-1">
              <div className="container mx-auto px-4 py-8 md:py-12">
                
                <div className="text-center mb-12">
                  <Breadcrumbs path={[{ name: "Courses", href: "/courses" }]} />
                  <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-accent mt-4">The Ultimate Course Library for AI & Online Earning</h1>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
                    Our courses are designed to give you the skills you need to succeed in the digital economy. Learn from industry experts and start earning today.
                  </p>
                </div>

                <div className="relative mx-auto w-full max-w-2xl mb-12">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for courses like 'Python' or 'SEO'..."
                    className="w-full rounded-full bg-card py-6 pl-12 pr-4 text-lg shadow-lg focus-visible:ring-ring"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-8">
                  <Accordion 
                      type="multiple" 
                      value={openCategories} 
                      onValueChange={setOpenCategories}
                      className="w-full space-y-4"
                  >
                    {filteredCourses.map((category) => (
                      <AccordionItem value={category.id} key={category.id} className="border-b-0">
                         <AccordionTrigger className="text-2xl md:text-3xl font-serif tracking-tight text-accent hover:no-underline px-4 py-3 bg-card rounded-lg">
                            {category.name}
                          </AccordionTrigger>
                        <AccordionContent className="pt-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {category.courses.map((course) => (
                              <CourseCard key={course.id} course={course} />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

              </div>
            </main>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
