'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  Filter,
  FlaskConical,
  GraduationCap,
  Handshake,
  Heart,
  Lightbulb,
  Search,
  Trophy,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/header';

type Kind = 'Internship' | 'Scholarship' | 'Program';
type Opening = 'Closing soon' | 'Open now' | 'Upcoming';
type Personal = 'Not reviewed' | 'Interested' | 'Applied' | 'Interview / Selection' | 'Selected' | 'Not selected' | 'Saved for later';
type ProgramType =
  | 'Ambassador'
  | 'Fellowship'
  | 'Research Program'
  | 'Open Source'
  | 'Mentorship'
  | 'Community / Leadership'
  | 'Training / Scholar'
  | 'Innovation / Competition';

type Item = {
  id: string;
  kind: Kind;
  opening: Opening;
  title: string;
  org: string;
  focus: string;
  location: string;
  mode: string;
  deadline?: string;
  benefit: string;
  url: string;
  seed: string;
  summary: string;
  eligibility: string;
  programType?: ProgramType;
};

const items: Item[] = [
  {
    id: 'vssc-int08-2026',
    kind: 'Internship',
    opening: 'Closing soon',
    title: 'VSSC Internship Slot INT 08 — Nov 2026 to Jan 2027',
    org: 'Vikram Sarabhai Space Centre / ISRO',
    focus: 'CSE • AI/Computing • Space Technology • Research',
    location: 'Thiruvananthapuram, Kerala',
    mode: 'On-site',
    deadline: '14 Sep 2026',
    benefit: 'Research exposure',
    url: 'https://vsscinternship.vssc.gov.in/HRDD_LOGIN/',
    seed: 'vssc-int08-2026',
    summary: 'Official VSSC slot INT 08 runs from 1 Nov 2026 to 31 Jan 2027. Online applications close 14 Sep 2026 at 11:59 PM.',
    eligibility: 'BE/BTech applicants must have completed the 4th semester and meet the centre requirements.',
  },
  {
    id: 'niti-sep2026',
    kind: 'Internship',
    opening: 'Closing soon',
    title: 'NITI Aayog Internship — September 2026 window',
    org: 'NITI Aayog, Government of India',
    focus: 'Technology • Data • Policy Research',
    location: 'New Delhi',
    mode: 'On-site',
    deadline: '10 Sep 2026',
    benefit: 'Research experience',
    url: 'https://www.niti.gov.in/work-niti/opportunities',
    seed: 'niti-sep2026',
    summary: 'NITI Aayog accepts internship applications only from the 1st through the 10th day of each month.',
    eligibility: 'Undergraduate applicants who have completed or appeared in second-year/4th-semester exams can apply, subject to the published academic conditions.',
  },
  {
    id: 'mitacs-gri-2027-india',
    kind: 'Internship',
    opening: 'Closing soon',
    title: 'Globalink Research Internship 2027 — India',
    org: 'Mitacs / AICTE',
    focus: 'Research • Engineering • AI/ML • Computer Science',
    location: 'Canada',
    mode: 'On-site, funded',
    deadline: '16 Sep 2026',
    benefit: '12-week funded research internship',
    url: 'https://www.mitacs.ca/our-programs/globalink-research-internship-students/',
    seed: 'mitacs-gri-2027-india',
    summary: 'Mitacs is accepting applications for summer 2027 Globalink research internships from eligible Indian undergraduate students.',
    eligibility: 'Indian full-time undergraduate engineering/technology applicants must satisfy the current India-partner, academic and institution requirements.',
  },
  {
    id: 'drivetrain-genai-2026',
    kind: 'Internship',
    opening: 'Open now',
    title: 'Engineering Intern — Gen AI for FP&A Platform',
    org: 'Drivetrain',
    focus: 'Generative AI • RAG • Agentic AI • LLMs • DSA',
    location: 'India',
    mode: 'Remote',
    benefit: 'Hands-on enterprise AI engineering',
    url: 'https://jobs.lever.co/drivetrain/bc1c17bc-86ac-4f00-a1e3-0eb85aae4fdc',
    seed: 'drivetrain-genai-2026',
    summary: 'Drivetrain currently lists a remote India engineering internship focused on RAG, agentic AI, LLMs, algorithms and scalable systems.',
    eligibility: 'Currently pursuing or recently completed Computer Science or a related degree; strong DSA and exposure to RAG, agentic AI or LLM projects are requested.',
  },
  {
    id: 'niti-oct2026',
    kind: 'Internship',
    opening: 'Upcoming',
    title: 'NITI Aayog Internship — October 2026 window',
    org: 'NITI Aayog, Government of India',
    focus: 'Technology • Data • Policy Research',
    location: 'New Delhi',
    mode: 'On-site',
    deadline: '10 Oct 2026',
    benefit: 'Research experience',
    url: 'https://www.niti.gov.in/work-niti/opportunities',
    seed: 'niti-oct2026',
    summary: 'The next NITI Aayog application window follows the official monthly rule and runs from 1–10 Oct 2026.',
    eligibility: 'Undergraduate applicants who have completed or appeared in second-year/4th-semester exams can apply, subject to the published academic conditions.',
  },
  {
    id: 'microsoft-student-ambassadors',
    kind: 'Program',
    opening: 'Open now',
    programType: 'Ambassador',
    title: 'Microsoft Learn Student Ambassadors',
    org: 'Microsoft',
    focus: 'AI • Cloud • Developer Skills • Leadership • Community',
    location: 'Global',
    mode: 'Online / Community',
    benefit: 'Technical skills, leadership and community experience',
    url: 'https://learn.microsoft.com/en-us/training/student-hub/become-a-student-ambassador',
    seed: 'microsoft-student-ambassadors',
    summary: 'Microsoft says the reimagined Student Ambassadors program is open to students from all backgrounds, with no application or gatekeeping required to get started.',
    eligibility: 'Open to students regardless of background or field of study; participants learn with Microsoft technologies, build community and can take part in student rotations.',
  },
  {
    id: 'github-campus-experts',
    kind: 'Program',
    opening: 'Open now',
    programType: 'Community / Leadership',
    title: 'GitHub Campus Experts',
    org: 'GitHub',
    focus: 'Open Source • Developer Communities • Events • Leadership',
    location: 'Global / Campus',
    mode: 'Hybrid',
    benefit: 'Training, mentorship, community-building support and GitHub recognition',
    url: 'https://education.github.com/experts',
    seed: 'github-campus-experts',
    summary: 'GitHub Campus Experts are student leaders who build technical communities on campus through events, meetups, hackathons and open-source work.',
    eligibility: 'For students who want to build and grow technical communities at their educational institution; GitHub’s student pack currently links students to apply while they are students.',
  },
  {
    id: 'gdg-on-campus',
    kind: 'Program',
    opening: 'Open now',
    programType: 'Community / Leadership',
    title: 'Google Developer Groups on Campus',
    org: 'Google for Developers',
    focus: 'Developer Technologies • AI • Events • Community Leadership',
    location: 'Campus / Global',
    mode: 'Community',
    benefit: 'Hands-on experience and campus developer leadership',
    url: 'https://developers.google.com/community',
    seed: 'gdg-on-campus',
    summary: 'Google describes GDG on Campus as a way for students to gain hands-on experience, build essential skills and develop a foundation for a tech career.',
    eligibility: 'Students can participate through existing campus communities or explore the path to lead a GDG on Campus chapter.',
  },
  {
    id: 'nvidia-student-network',
    kind: 'Program',
    opening: 'Open now',
    programType: 'Training / Scholar',
    title: 'NVIDIA Student Network',
    org: 'NVIDIA',
    focus: 'AI • GPU Computing • Deep Learning • Projects',
    location: 'Global',
    mode: 'Online / Community',
    benefit: 'Exclusive training, tools and student projects',
    url: 'https://developer.nvidia.com/omniverse/community',
    seed: 'nvidia-student-network',
    summary: 'NVIDIA describes the Student Network as a community engagement program with exclusive training, tools and projects for students preparing for AI careers.',
    eligibility: 'Students interested in AI and accelerated computing; verify the current student-network enrollment requirements on NVIDIA’s official page.',
  },
  {
    id: 'lfx-mentorship',
    kind: 'Program',
    opening: 'Open now',
    programType: 'Mentorship',
    title: 'LFX Mentorship',
    org: 'Linux Foundation',
    focus: 'Open Source • Linux • Cloud • Security • Developer Infrastructure',
    location: 'Global',
    mode: 'Remote',
    benefit: 'Mentor-guided open-source experience; some mentorships include stipends',
    url: 'https://lfx.linuxfoundation.org/tools/mentorship/',
    seed: 'lfx-mentorship',
    summary: 'LFX Mentorship helps new contributors work with open-source communities. Availability and compensation vary by mentorship project.',
    eligibility: 'Eligibility, selection and stipend availability are defined by the individual mentorship and project; review the live LFX listings before applying.',
  },
  {
    id: 'cern-summer-student',
    kind: 'Program',
    opening: 'Open now',
    programType: 'Research Program',
    title: 'CERN Summer Student Programme',
    org: 'CERN',
    focus: 'Computing • Engineering • Physics • Mathematics • Research',
    location: 'Geneva, Switzerland',
    mode: 'On-site',
    deadline: 'End of Jan — check current Careers deadline',
    benefit: '8–13 weeks in a CERN research environment',
    url: 'https://home.cern/summer-student-programme/',
    seed: 'cern-summer-student',
    summary: 'CERN says the Summer Student Programme is currently open and welcomes bachelor’s and master’s students in physics, computing, engineering and mathematics.',
    eligibility: 'Bachelor’s or master’s students in relevant fields. CERN states that all nationalities are welcome and the current application deadline should be checked on its Careers site.',
  },
  {
    id: 'google-student-researcher',
    kind: 'Program',
    opening: 'Open now',
    programType: 'Research Program',
    title: 'Google Student Researcher Program',
    org: 'Google Research',
    focus: 'AI/ML • Algorithms • HCI • Security • Research',
    location: 'Varies',
    mode: 'Research / Hybrid varies',
    benefit: 'Research projects with Google teams',
    url: 'https://research.google/programs-and-events/student-engagement/',
    seed: 'google-student-researcher',
    summary: 'Google Research says its Student Researcher Program supports early-career researchers through research projects and welcomes BS, MS and PhD students, plus pre-academic researchers.',
    eligibility: 'BS/MS/PhD students or pre-academic researchers preparing for an MS or PhD; individual openings define the precise requirements.',
  },
  {
    id: 'google-summer-of-code',
    kind: 'Program',
    opening: 'Upcoming',
    programType: 'Open Source',
    title: 'Google Summer of Code',
    org: 'Google Open Source',
    focus: 'Open Source • Software Engineering • Community',
    location: 'Global',
    mode: 'Online',
    benefit: '12+ week mentored open-source project and stipend',
    url: 'https://summerofcode.withgoogle.com/',
    seed: 'google-summer-of-code',
    summary: 'GSoC is a global online program where contributors work on 12+ week open-source projects with mentors. The 2026 organization registration is closed, so the next contributor cycle should be watched.',
    eligibility: 'Google currently lists contributors as people aged 18+ who are students or open-source beginners and eligible to work in their country during the program.',
  },
  {
    id: 'mlh-fellowship',
    kind: 'Program',
    opening: 'Upcoming',
    programType: 'Fellowship',
    title: 'MLH Fellowship',
    org: 'Major League Hacking',
    focus: 'Software Engineering • Production Engineering • SRE • Open Source',
    location: 'Global',
    mode: 'Remote / Online',
    benefit: 'Structured fellowship experience, portfolio work and peer learning',
    url: 'https://fellowship.mlh.io/',
    seed: 'mlh-fellowship',
    summary: 'MLH Fellowship runs structured fellowship tracks such as Software Engineering and Production Engineering; its current LMS shows 12-week fellowship cohorts and specialized tracks.',
    eligibility: 'Eligibility and admissions vary by cohort. Check the official fellowship admissions page for the next application cycle.',
  },
  {
    id: 'imagine-cup-2027',
    kind: 'Program',
    opening: 'Upcoming',
    programType: 'Innovation / Competition',
    title: 'Imagine Cup 2027',
    org: 'Microsoft',
    focus: 'Student Startups • AI • Product Building • Entrepreneurship',
    location: 'Global',
    mode: 'Online / Competition',
    benefit: 'Student startup competition, mentorship, resources and Microsoft technology benefits',
    url: 'https://imaginecup.microsoft.com/en-us/category/34',
    seed: 'imagine-cup-2027',
    summary: 'Microsoft currently lists Imagine Cup 2027 as the next student startup competition, with registration opening for the new cycle and resources for student founders.',
    eligibility: 'Designed for student founders. Check the official 2027 rules for the current age, enrollment, team-size and technology requirements before registering.',
  },
  {
    id: 'aws-ai-ml-scholars',
    kind: 'Program',
    opening: 'Upcoming',
    programType: 'Training / Scholar',
    title: 'AWS AI & ML Scholars',
    org: 'Amazon Web Services',
    focus: 'AI • Machine Learning • Cloud • Learning',
    location: 'Global',
    mode: 'Online',
    benefit: 'Large-scale foundational AI/ML learning program',
    url: 'https://aws.amazon.com/about-aws/our-impact/scholars/',
    seed: 'aws-ai-ml-scholars',
    summary: 'AWS says the 2026 Challenge phase reached capacity, with up to 100,000 learners supported in the program. Watch the official page for the next cohort.',
    eligibility: 'The 2026 program was for learners aged 18+ and did not require prior AI/ML experience; next-cycle requirements should be checked when announced.',
  },
];

const rank: Record<Opening, number> = { 'Closing soon': 0, 'Open now': 1, Upcoming: 2 };
const storage = 'streamearn-opportunity-tracker-v9';

const visual = (title: string, kind: Kind, seed: string) => {
  const p = kind === 'Internship'
    ? ['#0f172a', '#2563eb', '#06b6d4']
    : kind === 'Scholarship'
      ? ['#0f172a', '#059669', '#84cc16']
      : ['#171128', '#7c3aed', '#ec4899'];
  const initials = title.split(/\s+/).map((x) => x[0]).join('').slice(0, 3).toUpperCase();
  const n = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % 90;
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${p[0]}"/><stop offset=".55" stop-color="${p[1]}"/><stop offset="1" stop-color="${p[2]}"/></linearGradient></defs><rect width="900" height="360" fill="url(#g)"/><circle cx="${120 + n * 4}" cy="80" r="130" fill="white" opacity=".08"/><circle cx="760" cy="300" r="180" fill="white" opacity=".07"/><text x="48" y="210" fill="white" font-family="Arial" font-size="72" font-weight="800">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;
};

const mark = (org: string) => org.split(/\s+/).filter(Boolean).map((x) => x[0]).join('').slice(0, 2).toUpperCase();

const programTypes: Array<ProgramType | 'All'> = [
  'All',
  'Ambassador',
  'Fellowship',
  'Research Program',
  'Open Source',
  'Mentorship',
  'Community / Leadership',
  'Training / Scholar',
  'Innovation / Competition',
];

const iconForProgram = (type?: ProgramType) => {
  switch (type) {
    case 'Ambassador': return <Handshake className="h-4 w-4" />;
    case 'Fellowship': return <GraduationCap className="h-4 w-4" />;
    case 'Research Program': return <FlaskConical className="h-4 w-4" />;
    case 'Open Source': return <Code2 className="h-4 w-4" />;
    case 'Mentorship': return <Users className="h-4 w-4" />;
    case 'Community / Leadership': return <Users className="h-4 w-4" />;
    case 'Training / Scholar': return <BookOpen className="h-4 w-4" />;
    case 'Innovation / Competition': return <Trophy className="h-4 w-4" />;
    default: return <Lightbulb className="h-4 w-4" />;
  }
};

export function OpportunityTypePage({ kind }: { kind: Kind }) {
  const [opening, setOpening] = useState<'All' | Opening>('All');
  const [programType, setProgramType] = useState<ProgramType | 'All'>('All');
  const [q, setQ] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [tracker, setTracker] = useState<Record<string, Personal>>(() => {
    try { return JSON.parse(localStorage.getItem(storage) || '{}'); } catch { return {}; }
  });

  const isIntern = kind === 'Internship';
  const isScholarship = kind === 'Scholarship';
  const isProgram = kind === 'Program';

  const records = useMemo(() => items.filter((x) => x.kind === kind), [kind]);
  const filtered = useMemo(
    () => records
      .filter((x) => opening === 'All' || x.opening === opening)
      .filter((x) => !isProgram || programType === 'All' || x.programType === programType)
      .filter((x) => !q || `${x.title} ${x.org} ${x.focus} ${x.location} ${x.summary} ${x.programType || ''}`.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => rank[a.opening] - rank[b.opening] || (a.deadline || '9999').localeCompare(b.deadline || '9999')),
    [records, opening, programType, q, isProgram],
  );

  const save = (id: string, value: Personal) => {
    const next = { ...tracker, [id]: value };
    setTracker(next);
    try { localStorage.setItem(storage, JSON.stringify(next)); } catch {}
  };

  const heading = isIntern ? 'Internships' : isScholarship ? 'Scholarships' : 'Programs';
  const radarDescription = isIntern
    ? 'Verified India, Tamil Nadu, remote and global undergraduate opportunities prioritised for CSE, cybersecurity, Python, AI and research.'
    : isScholarship
      ? 'Strict undergraduate filter: no postgraduate/study-abroad listings, and no need-based scheme with an income ceiling above ₹2 lakh.'
      : 'Ambassador, fellowship, research, open-source, mentorship, community, leadership and training programs collected from official program sources.';

  return <>
    <Header showSidebarTrigger />
    <main className="mx-auto w-full max-w-[1380px] px-3 pb-10 pt-3 sm:px-5 lg:px-7">
      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-primary">
              {isIntern ? <BriefcaseBusiness className="h-4 w-4" /> : isScholarship ? <GraduationCap className="h-4 w-4" /> : <Lightbulb className="h-4 w-4" />}
              {isProgram ? 'Verified Program Radar' : isIntern ? 'Verified Internship Radar' : 'Verified Scholarship Radar'}
            </div>
            <h1 className="mt-2 text-3xl font-bold">{heading}</h1>
            <p className="mt-1 max-w-4xl text-sm text-muted-foreground">{radarDescription}</p>
          </div>
          <div className="rounded-xl border bg-background px-4 py-3 text-center">
            <div className="text-2xl font-semibold">{records.length}</div>
            <div className="text-[10px] text-muted-foreground">{isProgram ? 'listed programs' : 'verified active'}</div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} className="h-10 pl-9" placeholder={isProgram ? 'Search program, organization, skill, category…' : 'Search role, skill, company, location…'} />
          </div>
          <div className="flex gap-1 rounded-lg border bg-background p-1">
            <Button size="sm" variant={view === 'list' ? 'secondary' : 'ghost'} onClick={() => setView('list')}>List</Button>
            <Button size="sm" variant={view === 'grid' ? 'secondary' : 'ghost'} onClick={() => setView('grid')}>Grid</Button>
          </div>
        </div>
      </section>

      {isProgram && (
        <section className="mt-3 flex flex-wrap gap-1.5">
          {programTypes.map((type) => (
            <Button key={type} size="sm" variant={programType === type ? 'default' : 'outline'} className="h-8" onClick={() => setProgramType(type)}>
              {type !== 'All' && iconForProgram(type)}
              {type}
            </Button>
          ))}
        </section>
      )}

      <section className="mt-3 flex flex-wrap gap-1.5">
        <Button size="sm" variant={opening === 'All' ? 'default' : 'outline'} className="h-8" onClick={() => setOpening('All')}>All</Button>
        {(Object.keys(rank) as Opening[]).map((status) => (
          <Button size="sm" key={status} variant={opening === status ? 'default' : 'outline'} className="h-8" onClick={() => setOpening(status)}>{status}</Button>
        ))}
      </section>

      {filtered.length === 0 ? (
        <section className="mt-3 rounded-2xl border border-dashed bg-card p-12 text-center">
          <Filter className="mx-auto h-7 w-7 text-muted-foreground" />
          <h2 className="mt-3 font-semibold">No matching {kind.toLowerCase()} right now</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            {isProgram ? 'Try another program category or check the official source for the next cycle.' : 'The strict filter is intentional. Closed, stale, postgraduate, study-abroad and ineligible entries are not shown.'}
          </p>
          {isScholarship && (
            <Button asChild variant="outline" className="mt-4">
              <a href="https://scholarships.gov.in/" target="_blank" rel="noreferrer">Open official National Scholarship Portal <ExternalLink className="ml-1 h-3 w-3" /></a>
            </Button>
          )}
        </section>
      ) : (
        <section className={view === 'grid' ? 'mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3' : 'mt-3 space-y-2'}>
          {filtered.map((item) => {
            const personalStatus = tracker[item.id] || 'Not reviewed';
            const saved = personalStatus === 'Saved for later';

            return (
              <article key={item.id} className="overflow-hidden rounded-xl border bg-card transition hover:border-primary/40">
                {view === 'grid' && (
                  <div className="relative">
                    <img src={visual(item.title, item.kind, item.seed)} alt="" className="h-28 w-full object-cover" loading="lazy" />
                    <Badge className="absolute left-2 top-2">{item.opening}</Badge>
                    {item.programType && <Badge variant="secondary" className="absolute right-2 top-2">{item.programType}</Badge>}
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border bg-muted text-[10px] font-bold">{mark(item.org)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">{item.org}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">Official source • {item.location} • {item.mode}</p>
                    </div>
                    <Button size="icon" variant={saved ? 'default' : 'ghost'} className="h-8 w-8" onClick={() => save(item.id, saved ? 'Not reviewed' : 'Saved for later')}>
                      <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                    </Button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge>{item.opening}</Badge>
                    {item.programType && <Badge variant="outline" className="inline-flex items-center gap-1">{iconForProgram(item.programType)}{item.programType}</Badge>}
                    {item.deadline && <Badge variant="outline">Deadline {item.deadline}</Badge>}
                  </div>

                  <h2 className="mt-3 text-base font-semibold">{item.title}</h2>
                  <p className="mt-1 text-xs font-medium text-primary">{item.focus}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.summary}</p>

                  <div className="mt-3 rounded-lg border bg-muted/30 p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Eligibility</p>
                    <p className="mt-1 text-xs leading-5">{item.eligibility}</p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] text-muted-foreground">{item.benefit}</span>
                    <div className="flex items-center gap-2">
                      <select value={personalStatus} onChange={(e) => save(item.id, e.target.value as Personal)} className="h-8 rounded-md border bg-background px-2 text-[10px]">
                        {['Not reviewed', 'Interested', 'Applied', 'Interview / Selection', 'Selected', 'Not selected', 'Saved for later'].map((status) => <option key={status}>{status}</option>)}
                      </select>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center gap-1 rounded-md border px-2 text-[10px] font-medium hover:bg-muted">
                        Open official source <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  </>;
}
