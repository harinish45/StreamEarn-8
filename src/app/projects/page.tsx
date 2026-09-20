import ProjectCommandCenterStable from '@/components/projects/ProjectCommandCenterStable';

export default function ProjectsPage(){
  // Keep navigation fast: the client command center hydrates its own data after
  // the route shell paints instead of blocking the server response on Supabase.
  return <ProjectCommandCenterStable />;
}
