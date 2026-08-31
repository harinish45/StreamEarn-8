import CommandCenter from '@/components/projects/CommandCenter';
import ProjectCreateBridge from '@/components/projects/project-create-bridge';

export default function ProjectsPage() {
  return (
    <>
      <ProjectCreateBridge />
      <CommandCenter />
    </>
  );
}
