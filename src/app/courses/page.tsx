
import { Header } from '@/components/header';
import { Breadcrumbs } from '@/components/breadcrumbs';

export default function CoursesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="space-y-4 mb-6">
          <Breadcrumbs path={[{ name: "Courses", href: "/courses" }]} />
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-accent">Courses</h1>
          <p className="text-lg text-muted-foreground">
            Expand your skills and unlock new earning potential with our expert-led courses.
          </p>
        </div>
        <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Course content coming soon!</p>
        </div>
      </main>
    </div>
  );
}
