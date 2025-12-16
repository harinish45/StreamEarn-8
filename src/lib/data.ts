
import type { LucideIcon } from 'lucide-react';

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  link: string;
  logo: string; // Added for company logo
  image: string;
  aiHint: string;
  visited?: boolean;
};

export type EarningCategory = {
  id: string;
  name: string;
  description: string;
  icon: string; // Changed from LucideIcon
  opportunities: Opportunity[];
  pinned?: boolean;
};

const createImage = (index: number) => `https://picsum.photos/seed/${index}/600/400`;
const createLogo = (seed: string) => `https://picsum.photos/seed/${seed}/100/100`;

export const earningOpportunities: EarningCategory[] = [
    {
        id: 'home',
        name: 'Home',
        icon: 'Home',
        description: "The main dashboard.",
        opportunities: [],
    },
    {
        id: 'recently-watched',
        name: 'Recently Watched',
        icon: 'Clock',
        description: "Opportunities you've recently viewed.",
        opportunities: [
          { id: 'rw-1', title: 'Upwork', description: 'Freelance platform for various jobs', link: 'https://www.upwork.com/', logo: createLogo('upwork'), image: createImage(7), aiHint: 'data spreadsheet' },
          { id: 'rw-2', title: 'Rev', description: 'Transcription and captioning services', link: 'https://www.rev.com/', logo: createLogo('rev'), image: createImage(13), aiHint: 'audio transcription' },
          { id: 'rw-3', title: 'Swagbucks', description: 'Rewards and survey site', link: 'https://www.swagbucks.com/', logo: createLogo('swagbucks'), image: createImage(24), aiHint: 'survey form' },
        ],
    },
    {
        id: 'captcha-entry',
        name: 'Captcha Entry',
        icon: 'MousePointerClick',
        description: "Earn by solving captchas.",
        opportunities: [
            { id: 'ce-1', title: '2Captcha', description: 'Captcha solving service', link: 'https://2captcha.com/', logo: createLogo('2captcha'), image: createImage(3), aiHint: 'captcha security' },
            { id: 'ce-2', title: 'Megatypers', description: 'Captcha solving service', link: 'https://www.megatypers.com/', logo: createLogo('megatypers'), image: createImage(4), aiHint: 'captcha security' },
            { id: 'ce-3', title: 'Kolotibablo', description: 'Captcha solving service', link: 'https://kolotibablo.com/', logo: createLogo('kolotibablo'), image: createImage(5), aiHint: 'captcha security' },
            { id: 'ce-4', title: 'ProTypers', description: 'Captcha solving service', link: 'https://www.protypers.com/', logo: createLogo('protypers'), image: createImage(6), aiHint: 'captcha security' },
        ],
    },
    {
        id: 'data-entry',
        name: 'Data Entry',
        icon: 'Type',
        description: "Jobs involving entering data into systems.",
        opportunities: [
            { id: 'de-1', title: 'Upwork', description: 'Freelance platform for various jobs', link: 'https://www.upwork.com/', logo: createLogo('upwork'), image: createImage(7), aiHint: 'data spreadsheet' },
            { id: 'de-2', title: 'Fiverr', description: 'Freelance platform for various jobs', link: 'https://www.fiverr.com/', logo: createLogo('fiverr'), image: createImage(8), aiHint: 'data spreadsheet' },
            { id: 'de-3', title: 'Clickworker', description: 'Microtask and data processing platform', link: 'https://www.clickworker.com/', logo: createLogo('clickworker'), image: createImage(9), aiHint: 'data spreadsheet' },
            { id: 'de-4', title: 'Amazon Mechanical Turk', description: 'Crowdsourcing marketplace', link: 'https://www.mturk.com/', logo: createLogo('mturk'), image: createImage(10), aiHint: 'data spreadsheet' },
            { id: 'de-5', title: 'Freelancer', description: 'Freelance platform for various jobs', link: 'https://www.freelancer.com/', logo: createLogo('freelancer'), image: createImage(11), aiHint: 'data spreadsheet' },
            { id: 'de-6', title: 'Guru', description: 'Freelance platform for various jobs', link: 'https://www.guru.com/', logo: createLogo('guru'), image: createImage(12), aiHint: 'data spreadsheet' },
        ],
    },
    {
        id: 'transcription',
        name: 'Transcription',
        icon: 'Headphones',
        description: "Convert audio to text.",
        opportunities: [
            { id: 't-1', title: 'Rev', description: 'Transcription and captioning services', link: 'https://www.rev.com/', logo: createLogo('rev'), image: createImage(13), aiHint: 'audio transcription' },
            { id: 't-2', title: 'TranscribeMe', description: 'Transcription services', link: 'https://www.transcribeme.com/', logo: createLogo('transcribeme'), image: createImage(14), aiHint: 'audio transcription' },
            { id: 't-3', title: 'Scribie', description: 'Transcription services', link: 'https://scribie.com/', logo: createLogo('scribie'), image: createImage(15), aiHint: 'audio transcription' },
            { id: 't-4', title: 'GoTranscript', description: 'Transcription services', link: 'https://gotranscript.com/', logo: createLogo('gotranscript'), image: createImage(16), aiHint: 'audio transcription' },
            { id: 't-5', title: 'Tigerfish', description: 'Transcription services', link: 'https://tigerfish.com/', logo: createLogo('tigerfish'), image: createImage(17), aiHint: 'audio transcription' },
        ],
    },
    {
        id: 'microtasks',
        name: 'Copy Pasting / Microtasks',
        icon: 'ClipboardList',
        description: "Complete small, simple online tasks.",
        opportunities: [
            { id: 'm-1', title: 'Clickworker', description: 'Microtask platform', link: 'https://www.clickworker.com/', logo: createLogo('clickworker'), image: createImage(18), aiHint: 'task list' },
            { id: 'm-2', title: 'MicroWorkers', description: 'Micro job platform', link: 'https://www.microworkers.com/', logo: createLogo('microworkers'), image: createImage(19), aiHint: 'task list' },
        ],
    },
    {
        id: 'virtual-assistant',
        name: 'Virtual Assistant',
        icon: 'UserCheck',
        description: "Provide remote administrative support.",
        opportunities: [
            { id: 'va-1', title: 'Belay Solutions', description: 'Virtual assistant services', link: 'https://belaysolutions.com/', logo: createLogo('belay'), image: createImage(20), aiHint: 'virtual assistant' },
            { id: 'va-2', title: 'Time ETC', description: 'Virtual assistant services', link: 'https://www.timeetc.com/', logo: createLogo('timeetc'), image: createImage(21), aiHint: 'virtual assistant' },
            { id: 'va-3', title: 'Zirtual', description: 'Virtual assistant services', link: 'https://www.zirtual.com/', logo: createLogo('zirtual'), image: createImage(22), aiHint: 'virtual assistant' },
            { id: 'va-4', title: 'Virtual Vocations', description: 'Remote job board', link: 'https://www.virtualvocations.com/', logo: createLogo('virtualvocations'), image: createImage(23), aiHint: 'virtual assistant' },
        ],
    },
    {
        id: 'online-surveys',
        name: 'Online Surveys',
        icon: 'MessageSquare',
        description: "Share your opinion for rewards.",
        opportunities: [
            { id: 'os-1', title: 'Swagbucks', description: 'Rewards and survey site', link: 'https://www.swagbucks.com/', logo: createLogo('swagbucks'), image: createImage(24), aiHint: 'survey form' },
            { id: 'os-2', title: 'Survey Junkie', description: 'Survey site', link: 'https://www.surveyjunkie.com/', logo: createLogo('surveyjunkie'), image: createImage(25), aiHint: 'survey form' },
            { id: 'os-3', title: 'Toluna', description: 'Survey and community site', link: 'https://www.toluna.com/', logo: createLogo('toluna'), image: createImage(26), aiHint: 'survey form' },
            { id: 'os-4', title: 'InboxDollars', description: 'Rewards site', link: 'https://www.inboxdollars.com/', logo: createLogo('inboxdollars'), image: createImage(27), aiHint: 'survey form' },
            { id: 'os-5', title: 'YouGov', description: 'Market research and data company', link: 'https://yougov.com/', logo: createLogo('yougov'), image: createImage(28), aiHint: 'survey form' },
            { id: 'os-6', title: 'PineCone Research', description: 'Survey panel', link: 'https://www.pineconeresearch.com/', logo: createLogo('pinecone'), image: createImage(29), aiHint: 'survey form' },
        ],
    },
    {
        id: 'product-testing',
        name: 'Product Testing',
        icon: 'FlaskConical',
        description: "Test new products and give feedback.",
        opportunities: [
            { id: 'pt-1', title: 'UserTesting', description: 'Usability testing platform', link: 'https://www.usertesting.com/', logo: createLogo('usertesting'), image: createImage(30), aiHint: 'product testing' },
            { id: 'pt-2', title: 'Testbirds', description: 'Crowdtesting platform', link: 'https://www.testbirds.com/', logo: createLogo('testbirds'), image: createImage(31), aiHint: 'product testing' },
            { id: 'pt-3', title: 'Trymata', description: 'Usability testing platform', link: 'https://trymata.com/', logo: createLogo('trymata'), image: createImage(32), aiHint: 'product testing' },
            { id: 'pt-4', title: 'Userlytics', description: 'User testing platform', link: 'https://www.userlytics.com/', logo: createLogo('userlytics'), image: createImage(33), aiHint: 'product testing' },
        ],
    },
    {
        id: 'writing-reviews',
        name: 'Writing Product Reviews',
        icon: 'PenTool',
        description: "Get paid to write reviews.",
        opportunities: [
            { id: 'wpr-1', title: 'Amazon Vine', description: 'Amazon review program', link: 'https://www.amazon.com/vine', logo: createLogo('amazonvine'), image: createImage(34), aiHint: 'writing review' },
            { id: 'wpr-2', title: 'Influenster', description: 'Product discovery and review platform', link: 'https://www.influenster.com/', logo: createLogo('influenster'), image: createImage(35), aiHint: 'writing review' },
            { id: 'wpr-3', title: 'Bazaarvoice', description: 'User-generated content solutions', link: 'https://www.bazaarvoice.com/', logo: createLogo('bazaarvoice'), image: createImage(36), aiHint: 'writing review' },
            { id: 'wpr-4', title: 'ReviewStream', description: 'Get paid to write reviews', link: 'https://www.reviewstream.com/', logo: createLogo('reviewstream'), image: createImage(37), aiHint: 'writing review' },
            { id: 'wpr-5', title: 'Capterra', description: 'Software review site', link: 'https://www.capterra.com/', logo: createLogo('capterra'), image: createImage(38), aiHint: 'writing review' },
        ],
    },
    {
        id: 'app-testing',
        name: 'App Testing',
        icon: 'Laptop',
        description: "Test mobile and web apps.",
        opportunities: [
            { id: 'at-1', title: 'uTest', description: 'Software testing platform', link: 'https://www.utest.com/', logo: createLogo('utest'), image: createImage(39), aiHint: 'app testing' },
            { id: 'at-2', title: 'Trymata', description: 'Usability testing platform', link: 'https://trymata.com/', logo: createLogo('trymata'), image: createImage(40), aiHint: 'app testing' },
            { id: 'at-3', title: 'Applause', description: 'Digital quality testing', link: 'https://www.applause.com/', logo: createLogo('applause'), image: createImage(41), aiHint: 'app testing' },
            { id: 'at-4', title: 'BetaTesting', description: 'Beta testing platform', link: 'https://www.betatesting.com/', logo: createLogo('betatesting'), image: createImage(42), aiHint: 'app testing' },
        ],
    },
    {
        id: 'usability-testing',
        name: 'Feedback & Usability Testing',
        icon: 'Users',
        description: "Test websites and apps for user-friendliness.",
        opportunities: [
            { id: 'ut-1', title: 'Userfeel', description: 'Usability testing platform', link: 'https://www.userfeel.com/', logo: createLogo('userfeel'), image: createImage(43), aiHint: 'user feedback' },
            { id: 'ut-2', title: 'Lyssna', description: 'Usability testing platform', link: 'https://lyssna.com/', logo: createLogo('lyssna'), image: createImage(44), aiHint: 'user feedback' },
            { id: 'ut-3', title: 'TestingTime', description: 'Test user recruiting', link: 'https://www.testingtime.com/', logo: createLogo('testingtime'), image: createImage(45), aiHint: 'user feedback' },
        ],
    },
    {
        id: 'content-writing',
        name: 'Content Writing',
        icon: 'FileText',
        description: "Write articles, blog posts, and more.",
        opportunities: [
            { id: 'cw-1', title: 'iWriter', description: 'Content writing service', link: 'https://www.iwriter.com/', logo: createLogo('iwriter'), image: createImage(46), aiHint: 'content writing' },
            { id: 'cw-2', title: 'Textbroker', description: 'Content writing service', link: 'https://www.textbroker.com/', logo: createLogo('textbroker'), image: createImage(47), aiHint: 'content writing' },
            { id: 'cw-3', title: 'ProBlogger Job Board', description: 'Job board for bloggers', link: 'https://problogger.com/jobs/', logo: createLogo('problogger'), image: createImage(48), aiHint: 'content writing' },
        ],
    },
    {
        id: 'copywriting',
        name: 'Copywriting',
        icon: 'BookOpen',
        description: "Write compelling marketing copy.",
        opportunities: [
            { id: 'c-1', title: 'ProBlogger Job Board', description: 'Job board for bloggers', link: 'https://problogger.com/jobs/', logo: createLogo('problogger'), image: createImage(49), aiHint: 'copywriting book' },
            { id: 'c-2', title: 'PeoplePerHour', description: 'Freelance marketplace', link: 'https://www.peopleperhour.com/', logo: createLogo('peopleperhour'), image: createImage(50), aiHint: 'copywriting book' },
        ],
    },
    {
        id: 'proofreading-editing',
        name: 'Proofreading & Editing',
        icon: 'GraduationCap',
        description: "Correct grammar and style in texts.",
        opportunities: [
            { id: 'pe-1', title: 'Scribendi', description: 'Editing and proofreading services', link: 'https://www.scribendi.com/', logo: createLogo('scribendi'), image: createImage(51), aiHint: 'editing document' },
            { id: 'pe-2', title: 'ProofreadingServices.com', description: 'Proofreading services', link: 'https://www.proofreadingservices.com/', logo: createLogo('proofreadingservices'), image: createImage(52), aiHint: 'editing document' },
        ],
    },
    {
        id: 'resume-writing',
        name: 'Resume Writing',
        icon: 'BriefcaseBusiness',
        description: "Help people create professional resumes.",
        opportunities: [
            { id: 'rw-4', title: 'LinkedIn Services Marketplace', description: 'Find professionals on LinkedIn', link: 'https://www.linkedin.com/services/', logo: createLogo('linkedin'), image: createImage(53), aiHint: 'resume document' },
            { id: 'rw-5', title: 'TopResume', description: 'Resume writing service', link: 'https://www.topresume.com/', logo: createLogo('topresume'), image: createImage(54), aiHint: 'resume document' },
            { id: 'rw-6', title: 'Monster', description: 'Job board and resume services', link: 'https://www.monster.com/', logo: createLogo('monster'), image: createImage(55), aiHint: 'resume document' },
        ],
    },
    {
        id: 'translation-jobs',
        name: 'Translation Jobs',
        icon: 'Languages',
        description: "Translate documents and audio.",
        opportunities: [
            { id: 'tj-1', title: 'Gengo', description: 'Translation platform', link: 'https://gengo.com/', logo: createLogo('gengo'), image: createImage(56), aiHint: 'language translation' },
            { id: 'tj-2', title: 'Unbabel', description: 'AI-powered translation', link: 'https://unbabel.com/', logo: createLogo('unbabel'), image: createImage(57), aiHint: 'language translation' },
            { id: 'tj-3', title: 'ProZ.com', description: 'Directory of translation services', link: 'https://www.proz.com/', logo: createLogo('proz'), image: createImage(58), aiHint: 'language translation' },
            { id: 'tj-4', title: 'TranslatorsCafé', description: 'Translation community', link: 'https://www.translatorscafe.com/', logo: createLogo('translatorscafe'), image: createImage(59), aiHint: 'language translation' },
        ],
    },
    {
        id: 'online-tutoring',
        name: 'Online Tutoring',
        icon: 'School',
        description: "Tutor students in various subjects.",
        opportunities: [
            { id: 'ot-1', title: 'Chegg Tutors', description: 'Online tutoring', link: 'https://www.chegg.com/tutors/', logo: createLogo('chegg'), image: createImage(60), aiHint: 'online tutoring' },
            { id: 'ot-2', title: 'Tutor.com', description: 'Online tutoring', link: 'https://www.tutor.com/', logo: createLogo('tutorcom'), image: createImage(61), aiHint: 'online tutoring' },
            { id: 'ot-3', title: 'Wyzant', description: 'Tutoring marketplace', link: 'https://www.wyzant.com/', logo: createLogo('wyzant'), image: createImage(62), aiHint: 'online tutoring' },
            { id: 'ot-4', title: 'Preply', description: 'Language tutoring platform', link: 'https://preply.com/', logo: createLogo('preply'), image: createImage(63), aiHint: 'online tutoring' },
            { id: 'ot-5', title: 'Varsity Tutors', description: 'Online tutoring and test prep', link: 'https://www.varsitytutors.com/', logo: createLogo('varsitytutors'), image: createImage(64), aiHint: 'online tutoring' },
            { id: 'ot-6', title: 'iTalki', description: 'Language learning platform', link: 'https://www.italki.com/', logo: createLogo('italki'), image: createImage(65), aiHint: 'online tutoring' },
        ],
    },
    {
        id: 'homework-help',
        name: 'Homework Help',
        icon: 'Home',
        description: "Assist students with their homework.",
        opportunities: [
            { id: 'hh-1', title: 'Course Hero', description: 'Online learning platform', link: 'https://www.coursehero.com/', logo: createLogo('coursehero'), image: createImage(66), aiHint: 'student homework' },
            { id: 'hh-2', title: 'StudyPool', description: 'Online tutoring and homework help', link: 'https://www.studypool.com/', logo: createLogo('studypool'), image: createImage(67), aiHint: 'student homework' },
            { id: 'hh-3', title: 'Chegg Study', description: 'Homework help and textbook solutions', link: 'https://www.chegg.com/study', logo: createLogo('cheggstudy'), image: createImage(68), aiHint: 'student homework' },
            { id: 'hh-4', title: 'Brainfuse', description: 'Online tutoring and academic help', link: 'https://www.brainfuse.com/', logo: createLogo('brainfuse'), image: createImage(69), aiHint: 'student homework' },
        ],
    },
    {
        id: 'ui-ux-design',
        name: 'UI/UX Design',
        icon: 'Palette',
        description: "Design user interfaces and experiences.",
        opportunities: [
            { id: 'ui-1', title: 'Dribbble', description: 'Design portfolio platform', link: 'https://dribbble.com/', logo: createLogo('dribbble'), image: createImage(70), aiHint: 'design prototype' },
            { id: 'ui-2', title: 'Behance', description: 'Design portfolio platform', link: 'https://www.behance.net/', logo: createLogo('behance'), image: createImage(71), aiHint: 'design prototype' },
            { id: 'ui-3', title: 'Toptal', description: 'Freelance talent network', link: 'https://www.toptal.com/', logo: createLogo('toptal'), image: createImage(72), aiHint: 'design prototype' },
        ],
    },
    {
        id: 'bug-bounty',
        name: 'Bug Bounty Hunting',
        icon: 'Bug',
        description: "Find and report software bugs.",
        opportunities: [
            { id: 'bb-1', title: 'HackerOne', description: 'Bug bounty platform', link: 'https://www.hackerone.com/', logo: createLogo('hackerone'), image: createImage(73), aiHint: 'hacker code' },
            { id: 'bb-2', title: 'Bugcrowd', description: 'Bug bounty platform', link: 'https://www.bugcrowd.com/', logo: createLogo('bugcrowd'), image: createImage(74), aiHint: 'hacker code' },
            { id: 'bb-3', title: 'Synack', description: 'Crowdsourced security testing', link: 'https://www.synack.com/', logo: createLogo('synack'), image: createImage(75), aiHint: 'hacker code' },
            { id: 'bb-4', title: 'Open Bug Bounty', description: 'Open bug bounty platform', link: 'https://www.openbugbounty.org/', logo: createLogo('openbugbounty'), image: createImage(76), aiHint: 'hacker code' },
            { id: 'bb-5', title: 'Cobalt', description: 'Pentesting as a Service', link: 'https://cobalt.io/', logo: createLogo('cobalt'), image: createImage(77), aiHint: 'hacker code' },
        ],
    },
    {
        id: 'social-media',
        name: 'Social Media Management',
        icon: 'Share2',
        description: "Manage social media accounts for businesses.",
        opportunities: [
            { id: 'sm-1', title: 'Simply Hired', description: 'Job search engine', link: 'https://www.simplyhired.com/', logo: createLogo('simplyhired'), image: createImage(78), aiHint: 'social media' },
            { id: 'sm-2', title: 'Remote.co', description: 'Remote job board', link: 'https://remote.co/', logo: createLogo('remoteco'), image: createImage(79), aiHint: 'social media' },
        ],
    },
    {
        id: 'affiliate-marketing',
        name: 'Affiliate Marketing',
        icon: 'Tag',
        description: "Promote products and earn commissions.",
        opportunities: [
            { id: 'am-1', title: 'Amazon Associates', description: 'Amazon affiliate program', link: 'https://affiliate-program.amazon.com/', logo: createLogo('amazon'), image: createImage(80), aiHint: 'affiliate chart' },
            { id: 'am-2', title: 'ShareASale', description: 'Affiliate marketing network', link: 'https://www.shareasale.com/', logo: createLogo('shareasale'), image: createImage(81), aiHint: 'affiliate chart' },
            { id: 'am-3', title: 'CJ Affiliate', description: 'Affiliate marketing network', link: 'https://www.cj.com/', logo: createLogo('cj'), image: createImage(82), aiHint: 'affiliate chart' },
            { id: 'am-4', title: 'Rakuten Advertising', description: 'Affiliate marketing network', link: 'https://rakutenadvertising.com/', logo: createLogo('rakuten'), image: createImage(83), aiHint: 'affiliate chart' },
            { id: 'am-5', title: 'ClickBank', description: 'Affiliate marketplace', link: 'https://www.clickbank.com/', logo: createLogo('clickbank'), image: createImage(84), aiHint: 'affiliate chart' },
            { id: 'am-6', title: 'Impact', description: 'Partnership automation platform', link: 'https://impact.com/', logo: createLogo('impact'), image: createImage(85), aiHint: 'affiliate chart' },
        ],
    },
    {
        id: 'youtube',
        name: 'YouTube Content Creation',
        icon: 'Youtube',
        description: "Create and monetize YouTube videos.",
        opportunities: [
            { id: 'yt-1', title: 'YouTube Partner Program', description: 'Monetize YouTube content', link: 'https://www.youtube.com/creators/how-things-work/getting-paid/', logo: createLogo('youtube'), image: createImage(86), aiHint: 'youtube creator' },
            { id: 'yt-2', title: 'Patreon', description: 'Membership platform for creators', link: 'https://www.patreon.com/', logo: createLogo('patreon'), image: createImage(87), aiHint: 'youtube creator' },
            { id: 'yt-3', title: 'YouTube BrandConnect', description: 'Branded content platform', link: 'https://www.youtube.com/brandconnect/', logo: createLogo('yt-brandconnect'), image: createImage(88), aiHint: 'youtube creator' },
            { id: 'yt-4', title: 'IZEA', description: 'Influencer marketing platform', link: 'https://izea.com/', logo: createLogo('izea'), image: createImage(89), aiHint: 'youtube creator' },
        ],
    },
    {
        id: 'instagram-marketing',
        name: 'Instagram Marketing',
        icon: 'Instagram',
        description: "Market products and services on Instagram.",
        opportunities: [
            { id: 'im-1', title: 'Aspire', description: 'Influencer marketing platform', link: 'https://www.aspire.io/', logo: createLogo('aspire'), image: createImage(90), aiHint: 'instagram phone' },
            { id: 'im-2', title: 'TRIBE', description: 'Influencer marketing platform', link: 'https://www.tribegroup.co/', logo: createLogo('tribe'), image: createImage(91), aiHint: 'instagram phone' },
            { id: 'im-3', title: 'Upfluence', description: 'Influencer marketing platform', link: 'https://www.upfluence.com/', logo: createLogo('upfluence'), image: createImage(92), aiHint: 'instagram phone' },
            { id: 'im-4', title: 'Influencity', description: 'Influencer marketing platform', link: 'https://influencity.com/', logo: createLogo('influencity'), image: createImage(93), aiHint: 'instagram phone' },
            { id: 'im-5', title: 'Fohr', description: 'Influencer marketing platform', link: 'https://www.fohr.co/', logo: createLogo('fohr'), image: createImage(94), aiHint: 'instagram phone' },
        ],
    },
    {
        id: 'ai-prompts',
        name: 'Creating & Selling AI Prompts',
        icon: 'BrainCircuit',
        description: "Craft and sell prompts for AI models.",
        opportunities: [
            { id: 'aip-1', title: 'PromptBase', description: 'Marketplace for AI prompts', link: 'https://promptbase.com/', logo: createLogo('promptbase'), image: createImage(95), aiHint: 'ai brain' },
            { id: 'aip-2', title: 'PromptHero', description: 'Marketplace for AI prompts', link: 'https://prompthero.com/', logo: createLogo('prompthero'), image: createImage(96), aiHint: 'ai brain' },
        ],
    },
    {
        id: 'ai-art',
        name: 'Selling AI-Generated Art',
        icon: 'Paintbrush',
        description: "Create and sell art made with AI.",
        opportunities: [
            { id: 'aia-1', title: 'Etsy', description: 'Marketplace for handmade and vintage goods', link: 'https://www.etsy.com/', logo: createLogo('etsy'), image: createImage(97), aiHint: 'ai art' },
            { id: 'aia-2', title: 'Redbubble', description: 'Print-on-demand marketplace', link: 'https://www.redbubble.com/', logo: createLogo('redbubble'), image: createImage(98), aiHint: 'ai art' },
            { id: 'aia-3', title: 'Society6', description: 'Print-on-demand marketplace', link: 'https://society6.com/', logo: createLogo('society6'), image: createImage(99), aiHint: 'ai art' },
            { id: 'aia-4', title: 'Fine Art America', description: 'Art marketplace', link: 'https://fineartamerica.com/', logo: createLogo('fineartamerica'), image: createImage(100), aiHint: 'ai art' },
            { id: 'aia-5', title: 'ArtPal', description: 'Art marketplace', link: 'https://www.artpal.com/', logo: createLogo('artpal'), image: createImage(101), aiHint: 'ai art' },
            { id: 'aia-6', title: 'Zazzle', description: 'Print-on-demand marketplace', link: 'https://www.zazzle.com/', logo: createLogo('zazzle'), image: createImage(102), aiHint: 'ai art' },
        ],
    },
    {
        id: 'ai-voiceover',
        name: 'AI Voiceover Work',
        icon: 'Mic',
        description: "Use AI for voiceover projects.",
        opportunities: [
            { id: 'aiv-1', title: 'Descript', description: 'AI-powered audio/video editor', link: 'https://www.descript.com/', logo: createLogo('descript'), image: createImage(103), aiHint: 'voiceover microphone' },
            { id: 'aiv-2', title: 'Play.ht', description: 'AI text-to-speech generator', link: 'https://play.ht/', logo: createLogo('playht'), image: createImage(104), aiHint: 'voiceover microphone' },
            { id: 'aiv-3', title: 'Murf.ai', description: 'AI voice generator', link: 'https://murf.ai/', logo: createLogo('murfai'), image: createImage(105), aiHint: 'voiceover microphone' },
            { id: 'aiv-4', title: 'Bunny Studio', description: 'Creative services marketplace', link: 'https://bunnystudio.com/voice-overs/', logo: createLogo('bunnystudio'), image: createImage(106), aiHint: 'voiceover microphone' },
            { id: 'aiv-5', title: 'Voices.com', description: 'Voiceover marketplace', link: 'https://www.voices.com/', logo: createLogo('voicescom'), image: createImage(107), aiHint: 'voiceover microphone' },
        ],
    },
    {
        id: 'ai-ebooks',
        name: 'Selling AI-Generated Ebooks',
        icon: 'Book',
        description: "Write and sell ebooks with AI assistance.",
        opportunities: [
            { id: 'aie-1', title: 'Amazon KDP', description: 'Self-publishing platform', link: 'https://kdp.amazon.com/', logo: createLogo('amazonkdp'), image: createImage(108), aiHint: 'ebook library' },
            { id: 'aie-2', title: 'Smashwords', description: 'Ebook distribution platform', link: 'https://www.smashwords.com/', logo: createLogo('smashwords'), image: createImage(109), aiHint: 'ebook library' },
            { id: 'aie-3', title: 'Lulu', description: 'Self-publishing platform', link: 'https://www.lulu.com/', logo: createLogo('lulu'), image: createImage(110), aiHint: 'ebook library' },
            { id: 'aie-4', title: 'Blurb', description: 'Self-publishing platform', link: 'https://www.blurb.com/', logo: createLogo('blurb'), image: createImage(111), aiHint: 'ebook library' },
            { id: 'aie-5', title: 'Draft2Digital', description: 'Ebook distribution platform', link: 'https://www.draft2digital.com/', logo: createLogo('draft2digital'), image: createImage(112), aiHint: 'ebook library' },
        ],
    },
    {
        id: 'ai-chat-dev',
        name: 'AI Based Chat Development',
        icon: 'Bot',
        description: "Develop chatbots using AI.",
        opportunities: [
            { id: 'aicd-1', title: 'OpenAI API', description: 'API for AI models', link: 'https://platform.openai.com/', logo: createLogo('openai'), image: createImage(113), aiHint: 'chatbot robot' },
            { id: 'aicd-2', title: 'Botpress', description: 'Chatbot building platform', link: 'https://botpress.com/', logo: createLogo('botpress'), image: createImage(114), aiHint: 'chatbot robot' },
            { id: 'aicd-3', title: 'Google Dialogflow', description: 'Conversational AI platform', link: 'https://cloud.google.com/dialogflow', logo: createLogo('dialogflow'), image: createImage(115), aiHint: 'chatbot robot' },
            { id: 'aicd-4', title: 'Microsoft Bot Framework', description: 'Bot building framework', link: 'https://dev.botframework.com/', logo: createLogo('msbot'), image: createImage(116), aiHint: 'chatbot robot' },
            { id: 'aicd-5', title: 'IBM Watson Assistant', description: 'AI assistant platform', link: 'https://www.ibm.com/products/watson-assistant', logo: createLogo('ibmwatson'), image: createImage(117), aiHint: 'chatbot robot' },
            { id: 'aicd-6', title: 'Rasa', description: 'Open source conversational AI', link: 'https://rasa.com/', logo: createLogo('rasa'), image: createImage(118), aiHint: 'chatbot robot' },
        ],
    },
    {
        id: 'crypto-staking',
        name: 'Cryptocurrency Staking',
        icon: 'CircleDollarSign',
        description: "Earn rewards by staking crypto.",
        opportunities: [
            { id: 'cs-1', title: 'Binance Earn', description: 'Crypto earning platform', link: 'https://www.binance.com/en/earn', logo: createLogo('binance'), image: createImage(119), aiHint: 'crypto coin' },
            { id: 'cs-2', title: 'Kraken', description: 'Crypto exchange and staking', link: 'https://www.kraken.com/', logo: createLogo('kraken'), image: createImage(120), aiHint: 'crypto coin' },
            { id: 'cs-3', title: 'Coinbase', description: 'Crypto exchange and staking', link: 'https://www.coinbase.com/', logo: createLogo('coinbase'), image: createImage(121), aiHint: 'crypto coin' },
            { id: 'cs-4', title: 'Crypto.com', description: 'Crypto platform', link: 'https://crypto.com/', logo: createLogo('cryptocom'), image: createImage(122), aiHint: 'crypto coin' },
            { id: 'cs-5', title: 'KuCoin', description: 'Crypto exchange', link: 'https://www.kucoin.com/', logo: createLogo('kucoin'), image: createImage(123), aiHint: 'crypto coin' },
            { id: 'cs-6', title: 'Bitfinex', description: 'Crypto exchange', link: 'https://www.bitfinex.com/', logo: createLogo('bitfinex'), image: createImage(124), aiHint: 'crypto coin' },
        ],
    },
    {
        id: 'stock-trading',
        name: 'Stock Market Trading',
        icon: 'TrendingUp',
        description: "Trade stocks on the financial markets.",
        opportunities: [
            { id: 'st-1', title: 'Robinhood', description: 'Stock trading platform', link: 'https://robinhood.com/', logo: createLogo('robinhood'), image: createImage(125), aiHint: 'stock chart' },
            { id: 'st-2', title: 'E*TRADE', description: 'Online brokerage', link: 'https://us.etrade.com/', logo: createLogo('etrade'), image: createImage(126), aiHint: 'stock chart' },
            { id: 'st-3', title: 'Fidelity', description: 'Financial services company', link: 'https://www.fidelity.com/', logo: createLogo('fidelity'), image: createImage(127), aiHint: 'stock chart' },
            { id: 'st-4', title: 'TD Ameritrade', description: 'Online brokerage', link: 'https://www.tdameritrade.com/', logo: createLogo('tdameritrade'), image: createImage(128), aiHint: 'stock chart' },
            { id: 'st-5', title: 'Interactive Brokers', description: 'Online brokerage', link: 'https://www.interactivebrokers.com/', logo: createLogo('interactivebrokers'), image: createImage(129), aiHint: 'stock chart' },
            { id: 'st-6', title: 'Charles Schwab', description: 'Financial services company', link: 'https://www.schwab.com/', logo: createLogo('schwab'), image: createImage(130), aiHint: 'stock chart' },
        ],
    },
    {
        id: 'nft-trading',
        name: 'NFT Trading',
        icon: 'Landmark',
        description: "Buy and sell Non-Fungible Tokens.",
        opportunities: [
            { id: 'nft-1', title: 'OpenSea', description: 'NFT marketplace', link: 'https://opensea.io/', logo: createLogo('opensea'), image: createImage(131), aiHint: 'nft art' },
            { id: 'nft-2', title: 'Rarible', description: 'NFT marketplace', link: 'https://rarible.com/', logo: createLogo('rarible'), image: createImage(132), aiHint: 'nft art' },
            { id: 'nft-3', title: 'Foundation', description: 'NFT marketplace', link: 'https://foundation.app/', logo: createLogo('foundation'), image: createImage(133), aiHint: 'nft art' },
            { id: 'nft-4', title: 'SuperRare', description: 'NFT marketplace', link: 'https://superrare.com/', logo: createLogo('superrare'), image: createImage(134), aiHint: 'nft art' },
            { id: 'nft-5', title: 'Nifty Gateway', description: 'NFT marketplace', link: 'https://niftygateway.com/', logo: createLogo('niftygateway'), image: createImage(135), aiHint: 'nft art' },
            { id: 'nft-6', title: 'MakersPlace', description: 'NFT marketplace', link: 'https://makersplace.com/', logo: createLogo('makersplace'), image: createImage(136), aiHint: 'nft art' },
        ],
    },
    {
        id: 'forex-trading',
        name: 'Forex Trading',
        icon: 'Wallet',
        description: "Trade currencies on the foreign exchange market.",
        opportunities: [
            { id: 'ft-1', title: 'Forex.com', description: 'Forex trading platform', link: 'https://www.forex.com/', logo: createLogo('forexcom'), image: createImage(137), aiHint: 'forex graph' },
            { id: 'ft-2', title: 'OANDA', description: 'Forex trading platform', link: 'https://www.oanda.com/', logo: createLogo('oanda'), image: createImage(138), aiHint: 'forex graph' },
            { id: 'ft-3', title: 'IG Group', description: 'Online trading provider', link: 'https://www.ig.com/', logo: createLogo('iggroup'), image: createImage(139), aiHint: 'forex graph' },
            { id: 'ft-4', title: 'FXTM', description: 'Forex broker', link: 'https://www.forextime.com/', logo: createLogo('fxtm'), image: createImage(140), aiHint: 'forex graph' },
            { id: 'ft-5', title: 'XM', description: 'Forex broker', link: 'https://www.xm.com/', logo: createLogo('xm'), image: createImage(141), aiHint: 'forex graph' },
            { id: 'ft-6', title: 'Pepperstone', description: 'Forex broker', link: 'https://pepperstone.com/', logo: createLogo('pepperstone'), image: createImage(142), aiHint: 'forex graph' },
        ],
    },
    {
        id: 'airdrops',
        name: 'Participating in Airdrops',
        icon: 'Shield',
        description: "Receive free tokens from new crypto projects.",
        opportunities: [
            { id: 'a-1', title: 'CoinMarketCap Airdrops', description: 'Airdrop listings', link: 'https://coinmarketcap.com/airdrop/', logo: createLogo('coinmarketcap'), image: createImage(143), aiHint: 'crypto airdrop' },
            { id: 'a-2', title: 'Airdrop Alert', description: 'Airdrop listings', link: 'https://airdropalert.com/', logo: createLogo('airdropalert'), image: createImage(144), aiHint: 'crypto airdrop' },
            { id: 'a-3', 'title': 'Airdrops.io', description: 'Airdrop listings', link: 'https://airdrops.io/', logo: createLogo('airdropsio'), image: createImage(145), aiHint: 'crypto airdrop' },
            { id: 'a-4', title: 'ICO Drops', description: 'ICO and airdrop listings', link: 'https://icodrops.com/', logo: createLogo('icodrops'), image: createImage(146), aiHint: 'crypto airdrop' },
        ],
    },
    {
        id: 'print-on-demand',
        name: 'Print-on-Demand Stores',
        icon: 'Printer',
        description: "Sell custom designs on products.",
        opportunities: [
            { id: 'pod-1', title: 'Redbubble', description: 'Print-on-demand marketplace', link: 'https://www.redbubble.com/', logo: createLogo('redbubble'), image: createImage(147), aiHint: 'tshirt design' },
            { id: 'pod-2', title: 'Spring (Teespring)', description: 'Print-on-demand platform', link: 'https://creator-spring.com/', logo: createLogo('spring'), image: createImage(148), aiHint: 'tshirt design' },
            { id: 'pod-3', title: 'Merch by Amazon', description: 'Amazon print-on-demand', link: 'https://merch.amazon.com/', logo: createLogo('amazonmerch'), image: createImage(149), aiHint: 'tshirt design' },
            { id: 'pod-4', title: 'Zazzle', description: 'Print-on-demand marketplace', link: 'https://www.zazzle.com/', logo: createLogo('zazzle'), image: createImage(150), aiHint: 'tshirt design' },
            { id: 'pod-5', title: 'Spreadshirt', description: 'Print-on-demand platform', link: 'https://www.spreadshirt.com/', logo: createLogo('spreadshirt'), image: createImage(151), aiHint: 'tshirt design' },
            { id: 'pod-6', title: 'Society6', description: 'Print-on-demand marketplace', link: 'https://society6.com/', logo: createLogo('society6'), image: createImage(152), aiHint: 'tshirt design' },
        ],
    },
    {
        id: 'dropshipping',
        name: 'Dropshipping',
        icon: 'Package',
        description: "Sell products without holding inventory.",
        opportunities: [
            { id: 'd-1', title: 'Shopify', description: 'E-commerce platform', link: 'https://www.shopify.com/', logo: createLogo('shopify'), image: createImage(153), aiHint: 'shipping box' },
            { id: 'd-2', title: 'AliExpress', description: 'E-commerce marketplace', link: 'https://www.aliexpress.com/', logo: createLogo('aliexpress'), image: createImage(154), aiHint: 'shipping box' },
            { id: 'd-3', title: 'WooCommerce', description: 'E-commerce platform for WordPress', link: 'https://woocommerce.com/', logo: createLogo('woocommerce'), image: createImage(155), aiHint: 'shipping box' },
            { id: 'd-4', title: 'BigCommerce', description: 'E-commerce platform', link: 'https://www.bigcommerce.com/', logo: createLogo('bigcommerce'), image: createImage(156), aiHint: 'shipping box' },
            { id: 'd-5', title: 'Spocket', description: 'Dropshipping marketplace', link: 'https://www.spocket.co/', logo: createLogo('spocket'), image: createImage(157), aiHint: 'shipping box' },
        ],
    },
    {
        id: 'digital-products',
        name: 'Selling Digital Products',
        icon: 'Laptop',
        description: "Sell your own digital creations.",
        opportunities: [
            { id: 'dp-1', title: 'Gumroad', description: 'Platform for creators to sell products', link: 'https://gumroad.com/', logo: createLogo('gumroad'), image: createImage(158), aiHint: 'digital download' },
            { id: 'dp-2', title: 'Sellfy', description: 'E-commerce platform for creators', link: 'https://sellfy.com/', logo: createLogo('sellfy'), image: createImage(159), aiHint: 'digital download' },
            { id: 'dp-3', title: 'Etsy', description: 'Marketplace for digital products', link: 'https://www.etsy.com/', logo: createLogo('etsy'), image: createImage(160), aiHint: 'digital download' },
            { id: 'dp-4', title: 'Creative Market', description: 'Marketplace for design assets', link: 'https://creativemarket.com/', logo: createLogo('creativemarket'), image: createImage(161), aiHint: 'digital download' },
            { id: 'dp-5', title: 'E-junkie', description: 'E-commerce platform', link: 'https://www.e-junkie.com/', logo: createLogo('ejunkie'), image: createImage(162), aiHint: 'digital download' },
            { id: 'dp-6', title: 'Payhip', description: 'Platform to sell digital products', link: 'https://payhip.com/', logo: createLogo('payhip'), image: createImage(163), aiHint: 'digital download' },
        ],
    },
    {
        id: 'sell-photos',
        name: 'Selling Photos & Videos',
        icon: 'Camera',
        description: "Monetize your photography and videography.",
        opportunities: [
            { id: 'spv-1', title: 'Shutterstock', description: 'Stock photo marketplace', link: 'https://www.shutterstock.com/', logo: createLogo('shutterstock'), image: createImage(164), aiHint: 'camera lens' },
            { id: 'spv-2', title: 'Adobe Stock', description: 'Stock photo marketplace', link: 'https://stock.adobe.com/', logo: createLogo('adobestock'), image: createImage(165), aiHint: 'camera lens' },
            { id: 'spv-3', title: 'iStock', description: 'Stock photo marketplace', link: 'https://www.istockphoto.com/', logo: createLogo('istock'), image: createImage(166), aiHint: 'camera lens' },
            { id: 'spv-4', title: 'Dreamstime', description: 'Stock photo marketplace', link: 'https://www.dreamstime.com/', logo: createLogo('dreamstime'), image: createImage(167), aiHint: 'camera lens' },
            { id: 'spv-5', title: 'Alamy', description: 'Stock photo marketplace', link: 'https://www.alamy.com/', logo: createLogo('alamy'), image: createImage(168), aiHint: 'camera lens' },
        ],
    },
    {
        id: 'mystery-shopping',
        name: 'Online Mystery Shopping',
        icon: 'Store',
        description: "Evaluate online businesses anonymously.",
        opportunities: [
            { id: 'oms-1', title: 'BestMark', description: 'Mystery shopping company', link: 'https://www.bestmark.com/', logo: createLogo('bestmark'), image: createImage(169), aiHint: 'online shopping' },
            { id: 'oms-2', title: 'IntelliShop', description: 'Mystery shopping company', link: 'https://www.intelli-shop.com/', logo: createLogo('intellishop'), image: createImage(170), aiHint: 'online shopping' },
            { id: 'oms-3', title: 'Secret Shopper', description: 'Mystery shopping company', link: 'https://www.secretshopper.com/', logo: createLogo('secretshopper'), image: createImage(171), aiHint: 'online shopping' },
            { id: 'oms-4', title: 'Market Force', description: 'Customer experience management', link: 'https://www.marketforce.com/', logo: createLogo('marketforce'), image: createImage(172), aiHint: 'online shopping' },
            { id: 'oms-5', title: 'Coyle Hospitality Group', description: 'Mystery shopping for hospitality', link: 'https://www.coylehospitality.com/', logo: createLogo('coylehospitality'), image: createImage(173), aiHint: 'online shopping' },
        ],
    },
    {
        id: 'rent-digital-space',
        name: 'Renting Out Digital Space',
        icon: 'Wifi',
        description: "Share your internet bandwidth for cash.",
        opportunities: [
            { id: 'rds-1', title: 'Honeygain', description: 'Share internet to earn', link: 'https://www.honeygain.com/', logo: createLogo('honeygain'), image: createImage(174), aiHint: 'internet router' },
            { id: 'rds-2', title: 'Peer2Profit', description: 'Share internet to earn', link: 'https://peertoprofit.com/', logo: createLogo('peer2profit'), image: createImage(175), aiHint: 'internet router' },
            { id: 'rds-3', title: 'PacketStream', description: 'Share internet to earn', link: 'https://packetstream.io/', logo: createLogo('packetstream'), image: createImage(176), aiHint: 'internet router' },
        ],
    },
    {
        id: 'data-annotation',
        name: 'Data Annotation',
        icon: 'Tag',
        description: "Label data to train AI models.",
        opportunities: [
            { id: 'da-1', title: 'Appen', description: 'Data annotation services', link: 'https://appen.com/', logo: createLogo('appen'), image: createImage(177), aiHint: 'data label' },
            { id: 'da-2', title: 'Lionbridge', description: 'Data annotation services', link: 'https://www.lionbridge.com/', logo: createLogo('lionbridge'), image: createImage(178), aiHint: 'data label' },
        ],
    },
];

    