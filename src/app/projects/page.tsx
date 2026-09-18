import ProjectCommandCenterStable from '@/components/projects/ProjectCommandCenterStable';
import { listProjects } from '@/lib/project-store';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage(){
  let initialProjects = [];
  try {
    initialProjects = await listProjects();
  } catch (error) {
    console.error('[projects-page] initial load failed', error);
  }
  return <ProjectCommandCenterStable initialProjects={initialProjects} />;
}
