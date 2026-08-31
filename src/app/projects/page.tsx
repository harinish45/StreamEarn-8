import CommandCenter from '@/components/projects/CommandCenter';
import ProjectCreateBridge from '@/components/projects/project-create-bridge';
import ProjectIdeas from '@/components/projects/ProjectIdeas';

export default function ProjectsPage() {
  return (
    <>
      <ProjectCreateBridge />
      <CommandCenter />
      <ProjectIdeas />
    </>
  );
}
