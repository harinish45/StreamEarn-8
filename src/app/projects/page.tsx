import CommandCenter from '@/components/projects/CommandCenter';
import ProjectCreateBridge from '@/components/projects/project-create-bridge';
import ProjectInteractionBridge from '@/components/projects/project-interaction-bridge';
import IdeaSubmitBridge from '@/components/projects/idea-submit-bridge';

export default function ProjectsPage() {
  return (
    <>
      <ProjectCreateBridge />
      <ProjectInteractionBridge />
      <IdeaSubmitBridge />
      <CommandCenter />
    </>
  );
}
