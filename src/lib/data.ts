
import type { LucideIcon } from 'lucide-react';

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  link: string;
  logoKey: string;
  imageKey: string;
  aiHint: string;
  visited?: boolean;
  tags?: string[];
};

export type EarningCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
  opportunities: Opportunity[];
  pinned?: boolean;
};

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
          { id: 'rw-1', title: 'Upwork', description: 'Freelance platform for various jobs', link: 'https://www.upwork.com/', logoKey: 'upworkLogo', imageKey: 'dataSpreadsheetImage2', aiHint: 'data spreadsheet', tags: ['Freelance', 'Jobs'] },
          { id: 'rw-2', title: 'Rev', description: 'Transcription and captioning services', link: 'https://www.rev.com/', logoKey: 'revLogo', imageKey: 'audioTranscriptionImage1', aiHint: 'audio transcription', tags: ['Transcription', 'Audio'] },
          { id: 'rw-3', title: 'Swagbucks', description: 'Rewards and survey site', link: 'https://www.swagbucks.com/', logoKey: 'swagbucksLogo', imageKey: 'surveyFormImage1', aiHint: 'survey form', tags: ['Surveys', 'Rewards'] },
        ],
    },
    {
        id: 'captcha-entry',
        name: 'Captcha Entry',
        icon: 'MousePointerClick',
        description: "Earn by solving captchas.",
        opportunities: [
            { id: 'ce-1', title: '2Captcha', description: 'Captcha solving service', link: 'https://2captcha.com/', logoKey: '2captchaLogo', imageKey: 'captchaSecurityImage1', aiHint: 'captcha security', tags: ['Captcha', 'Microtask'] },
            { id: 'ce-2', title: 'Megatypers', description: 'Captcha solving service', link: 'https://www.megatypers.com/', logoKey: 'megatypersLogo', imageKey: 'captchaSecurityImage2', aiHint: 'captcha security', tags: ['Captcha', 'Microtask'] },
            { id: 'ce-3', title: 'Kolotibablo', description: 'Captcha solving service', link: 'https://kolotibablo.com/', logoKey: 'kolotibabloLogo', imageKey: 'captchaSecurityImage3', aiHint: 'captcha security', tags: ['Captcha', 'Microtask'] },
            { id: 'ce-4', title: 'ProTypers', description: 'Captcha solving service', link: 'https://www.protypers.com/', logoKey: 'protypersLogo', imageKey: 'captchaSecurityImage4', aiHint: 'captcha security', tags: ['Captcha', 'Microtask'] },
        ],
    },
    {
        id: 'data-entry',
        name: 'Data Entry',
        icon: 'Type',
        description: "Jobs involving entering data into systems.",
        opportunities: [
            { id: 'de-1', title: 'Upwork', description: 'Freelance platform for various jobs', link: 'https://www.upwork.com/', logoKey: 'upworkLogo', imageKey: 'dataSpreadsheetImage1', aiHint: 'data spreadsheet', tags: ['Data Entry', 'Freelance'] },
            { id: 'de-2', title: 'Fiverr', description: 'Freelance platform for various jobs', link: 'https://www.fiverr.com/', logoKey: 'fiverrLogo', imageKey: 'dataSpreadsheetImage2', aiHint: 'data spreadsheet', tags: ['Data Entry', 'Freelance'] },
            { id: 'de-3', title: 'Clickworker', description: 'Microtask and data processing platform', link: 'https://www.clickworker.com/', logoKey: 'clickworkerLogo', imageKey: 'dataSpreadsheetImage3', aiHint: 'data spreadsheet', tags: ['Data Entry', 'Microtask'] },
            { id: 'de-4', title: 'Amazon Mechanical Turk', description: 'Crowdsourcing marketplace', link: 'https://www.mturk.com/', logoKey: 'mturkLogo', imageKey: 'dataSpreadsheetImage4', aiHint: 'data spreadsheet', tags: ['Data Entry', 'Crowdsourcing'] },
            { id: 'de-5', title: 'Freelancer', description: 'Freelance platform for various jobs', link: 'https://www.freelancer.com/', logoKey: 'freelancerLogo', imageKey: 'dataSpreadsheetImage5', aiHint: 'data spreadsheet', tags: ['Data Entry', 'Freelance'] },
            { id: 'de-6', title: 'Guru', description: 'Freelance platform for various jobs', link: 'https://www.guru.com/', logoKey: 'guruLogo', imageKey: 'dataSpreadsheetImage6', aiHint: 'data spreadsheet', tags: ['Data Entry', 'Freelance'] },
        ],
    },
    {
        id: 'transcription',
        name: 'Transcription',
        icon: 'Headphones',
        description: "Convert audio to text.",
        opportunities: [
            { id: 't-1', title: 'Rev', description: 'Transcription and captioning services', link: 'https://www.rev.com/', logoKey: 'revLogo', imageKey: 'audioTranscriptionImage1', aiHint: 'audio transcription', tags: ['Transcription', 'Audio'] },
            { id: 't-2', title: 'TranscribeMe', description: 'Transcription services', link: 'https://www.transcribeme.com/', logoKey: 'transcribemeLogo', imageKey: 'audioTranscriptionImage2', aiHint: 'audio transcription', tags: ['Transcription', 'Audio'] },
            { id: 't-3', title: 'Scribie', description: 'Transcription services', link: 'https://scribie.com/', logoKey: 'scribieLogo', imageKey: 'audioTranscriptionImage3', aiHint: 'audio transcription', tags: ['Transcription', 'Audio'] },
            { id: 't-4', title: 'GoTranscript', description: 'Transcription services', link: 'https://gotranscript.com/', logoKey: 'gotranscriptLogo', imageKey: 'audioTranscriptionImage4', aiHint: 'audio transcription', tags: ['Transcription', 'Audio'] },
            { id: 't-5', title: 'Tigerfish', description: 'Transcription services', link: 'https://tigerfish.com/', logoKey: 'tigerfishLogo', imageKey: 'audioTranscriptionImage5', aiHint: 'audio transcription', tags: ['Transcription', 'Audio'] },
        ],
    },
    {
        id: 'microtasks',
        name: 'Copy Pasting / Microtasks',
        icon: 'ClipboardList',
        description: "Complete small, simple online tasks.",
        opportunities: [
            { id: 'm-1', title: 'Clickworker', description: 'Microtask platform', link: 'https://www.clickworker.com/', logoKey: 'clickworkerLogo', imageKey: 'taskListImage1', aiHint: 'task list', tags: ['Microtask', 'Copy Paste'] },
            { id: 'm-2', title: 'MicroWorkers', description: 'Micro job platform', link: 'https://www.microworkers.com/', logoKey: 'microworkersLogo', imageKey: 'taskListImage2', aiHint: 'task list', tags: ['Microtask', 'Jobs'] },
        ],
    },
    {
        id: 'virtual-assistant',
        name: 'Virtual Assistant',
        icon: 'UserCheck',
        description: "Provide remote administrative support.",
        opportunities: [
            { id: 'va-1', title: 'Belay Solutions', description: 'Virtual assistant services', link: 'https://belaysolutions.com/', logoKey: 'belayLogo', imageKey: 'virtualAssistantImage1', aiHint: 'virtual assistant', tags: ['VA', 'Admin'] },
            { id: 'va-2', title: 'Time ETC', description: 'Virtual assistant services', link: 'https://www.timeetc.com/', logoKey: 'timeetcLogo', imageKey: 'virtualAssistantImage2', aiHint: 'virtual assistant', tags: ['VA', 'Admin'] },
            { id: 'va-3', title: 'Zirtual', description: 'Virtual assistant services', link: 'https://www.zirtual.com/', logoKey: 'zirtualLogo', imageKey: 'virtualAssistantImage3', aiHint: 'virtual assistant', tags: ['VA', 'Admin'] },
            { id: 'va-4', title: 'Virtual Vocations', description: 'Remote job board', link: 'https://www.virtualvocations.com/', logoKey: 'virtualvocationsLogo', imageKey: 'virtualAssistantImage4', aiHint: 'virtual assistant', tags: ['VA', 'Remote Jobs'] },
        ],
    },
    {
        id: 'online-surveys',
        name: 'Online Surveys',
        icon: 'MessageSquare',
        description: "Share your opinion for rewards.",
        opportunities: [
            { id: 'os-1', title: 'Swagbucks', description: 'Rewards and survey site', link: 'https://www.swagbucks.com/', logoKey: 'swagbucksLogo', imageKey: 'surveyFormImage1', aiHint: 'survey form', tags: ['Surveys', 'Rewards'] },
            { id: 'os-2', title: 'Survey Junkie', description: 'Survey site', link: 'https://www.surveyjunkie.com/', logoKey: 'surveyjunkieLogo', imageKey: 'surveyFormImage2', aiHint: 'survey form', tags: ['Surveys', 'Rewards'] },
            { id: 'os-3', title: 'Toluna', description: 'Survey and community site', link: 'https://www.toluna.com/', logoKey: 'tolunaLogo', imageKey: 'surveyFormImage3', aiHint: 'survey form', tags: ['Surveys', 'Community'] },
            { id: 'os-4', title: 'InboxDollars', description: 'Rewards site', link: 'https://www.inboxdollars.com/', logoKey: 'inboxdollarsLogo', imageKey: 'surveyFormImage4', aiHint: 'survey form', tags: ['Surveys', 'Rewards'] },
            { id: 'os-5', title: 'YouGov', description: 'Market research and data company', link: 'https://yougov.com/', logoKey: 'yougovLogo', imageKey: 'surveyFormImage5', aiHint: 'survey form', tags: ['Surveys', 'Research'] },
            { id: 'os-6', title: 'PineCone Research', description: 'Survey panel', link: 'https://www.pineconeresearch.com/', logoKey: 'pineconeLogo', imageKey: 'surveyFormImage6', aiHint: 'survey form', tags: ['Surveys', 'Research'] },
        ],
    },
    {
        id: 'product-testing',
        name: 'Product Testing',
        icon: 'FlaskConical',
        description: "Test new products and give feedback.",
        opportunities: [
            { id: 'pt-1', title: 'UserTesting', description: 'Usability testing platform', link: 'https://www.usertesting.com/', logoKey: 'usertestingLogo', imageKey: 'productTestingImage1', aiHint: 'product testing', tags: ['Testing', 'UX'] },
            { id: 'pt-2', title: 'Testbirds', description: 'Crowdtesting platform', link: 'https://www.testbirds.com/', logoKey: 'testbirdsLogo', imageKey: 'productTestingImage2', aiHint: 'product testing', tags: ['Testing', 'QA'] },
            { id: 'pt-3', title: 'Trymata', description: 'Usability testing platform', link: 'https://trymata.com/', logoKey: 'trymataLogo', imageKey: 'productTestingImage3', aiHint: 'product testing', tags: ['Testing', 'UX'] },
            { id: 'pt-4', title: 'Userlytics', description: 'User testing platform', link: 'https://www.userlytics.com/', logoKey: 'userlyticsLogo', imageKey: 'productTestingImage4', aiHint: 'product testing', tags: ['Testing', 'UX'] },
        ],
    },
    {
        id: 'writing-reviews',
        name: 'Writing Product Reviews',
        icon: 'PenTool',
        description: "Get paid to write reviews.",
        opportunities: [
            { id: 'wpr-1', title: 'Amazon Vine', description: 'Amazon review program', link: 'https://www.amazon.com/vine', logoKey: 'amazonvineLogo', imageKey: 'writingReviewImage1', aiHint: 'writing review', tags: ['Reviews', 'Amazon'] },
            { id: 'wpr-2', title: 'Influenster', description: 'Product discovery and review platform', link: 'https://www.influenster.com/', logoKey: 'influensterLogo', imageKey: 'writingReviewImage2', aiHint: 'writing review', tags: ['Reviews', 'Products'] },
            { id: 'wpr-3', title: 'Bazaarvoice', description: 'User-generated content solutions', link: 'https://www.bazaarvoice.com/', logoKey: 'bazaarvoiceLogo', imageKey: 'writingReviewImage3', aiHint: 'writing review', tags: ['Reviews', 'UGC'] },
            { id: 'wpr-4', title: 'ReviewStream', description: 'Get paid to write reviews', link: 'https://www.reviewstream.com/', logoKey: 'reviewstreamLogo', imageKey: 'writingReviewImage4', aiHint: 'writing review', tags: ['Reviews', 'Writing'] },
            { id: 'wpr-5', title: 'Capterra', description: 'Software review site', link: 'https://www.capterra.com/', logoKey: 'capterraLogo', imageKey: 'writingReviewImage5', aiHint: 'writing review', tags: ['Reviews', 'Software'] },
        ],
    },
    {
        id: 'app-testing',
        name: 'App Testing',
        icon: 'Laptop',
        description: "Test mobile and web apps.",
        opportunities: [
            { id: 'at-1', title: 'uTest', description: 'Software testing platform', link: 'https://www.utest.com/', logoKey: 'utestLogo', imageKey: 'appTestingImage1', aiHint: 'app testing', tags: ['Testing', 'Apps'] },
            { id: 'at-2', title: 'Trymata', description: 'Usability testing platform', link: 'https://trymata.com/', logoKey: 'trymataLogo', imageKey: 'appTestingImage2', aiHint: 'app testing', tags: ['Testing', 'UX'] },
            { id: 'at-3', title: 'Applause', description: 'Digital quality testing', link: 'https://www.applause.com/', logoKey: 'applauseLogo', imageKey: 'appTestingImage3', aiHint: 'app testing', tags: ['Testing', 'QA'] },
            { id: 'at-4', title: 'BetaTesting', description: 'Beta testing platform', link: 'https://www.betatesting.com/', logoKey: 'betatestingLogo', imageKey: 'appTestingImage4', aiHint: 'app testing', tags: ['Testing', 'Beta'] },
        ],
    },
    {
        id: 'usability-testing',
        name: 'Feedback & Usability Testing',
        icon: 'Users',
        description: "Test websites and apps for user-friendliness.",
        opportunities: [
            { id: 'ut-1', title: 'Userfeel', description: 'Usability testing platform', link: 'https://www.userfeel.com/', logoKey: 'userfeelLogo', imageKey: 'userFeedbackImage1', aiHint: 'user feedback', tags: ['UX', 'Testing'] },
            { id: 'ut-2', title: 'Lyssna', description: 'Usability testing platform', link: 'https://lyssna.com/', logoKey: 'lyssnaLogo', imageKey: 'userFeedbackImage2', aiHint: 'user feedback', tags: ['UX', 'Testing'] },
            { id: 'ut-3', title: 'TestingTime', description: 'Test user recruiting', link: 'https://www.testingtime.com/', logoKey: 'testingtimeLogo', imageKey: 'userFeedbackImage3', aiHint: 'user feedback', tags: ['UX', 'Research'] },
        ],
    },
    {
        id: 'content-writing',
        name: 'Content Writing',
        icon: 'FileText',
        description: "Write articles, blog posts, and more.",
        opportunities: [
            { id: 'cw-1', title: 'iWriter', description: 'Content writing service', link: 'https://www.iwriter.com/', logoKey: 'iwriterLogo', imageKey: 'contentWritingImage1', aiHint: 'content writing', tags: ['Writing', 'Content'] },
            { id: 'cw-2', title: 'Textbroker', description: 'Content writing service', link: 'https://www.textbroker.com/', logoKey: 'textbrokerLogo', imageKey: 'contentWritingImage2', aiHint: 'content writing', tags: ['Writing', 'Content'] },
            { id: 'cw-3', title: 'ProBlogger Job Board', description: 'Job board for bloggers', link: 'https://problogger.com/jobs/', logoKey: 'probloggerLogo', imageKey: 'contentWritingImage3', aiHint: 'content writing', tags: ['Writing', 'Jobs'] },
        ],
    },
    {
        id: 'copywriting',
        name: 'Copywriting',
        icon: 'BookOpen',
        description: "Write compelling marketing copy.",
        opportunities: [
            { id: 'c-1', title: 'ProBlogger Job Board', description: 'Job board for bloggers', link: 'https://problogger.com/jobs/', logoKey: 'probloggerLogo', imageKey: 'copywritingBookImage1', aiHint: 'copywriting book', tags: ['Copywriting', 'Marketing'] },
            { id: 'c-2', title: 'PeoplePerHour', description: 'Freelance marketplace', link: 'https://www.peopleperhour.com/', logoKey: 'peopleperhourLogo', imageKey: 'copywritingBookImage2', aiHint: 'copywriting book', tags: ['Copywriting', 'Freelance'] },
        ],
    },
    {
        id: 'proofreading-editing',
        name: 'Proofreading & Editing',
        icon: 'GraduationCap',
        description: "Correct grammar and style in texts.",
        opportunities: [
            { id: 'pe-1', title: 'Scribendi', description: 'Editing and proofreading services', link: 'https://www.scribendi.com/', logoKey: 'scribendiLogo', imageKey: 'editingDocumentImage1', aiHint: 'editing document', tags: ['Editing', 'Writing'] },
            { id: 'pe-2', title: 'ProofreadingServices.com', description: 'Proofreading services', link: 'https://www.proofreadingservices.com/', logoKey: 'proofreadingservicesLogo', imageKey: 'editingDocumentImage2', aiHint: 'editing document', tags: ['Editing', 'Writing'] },
        ],
    },
    {
        id: 'resume-writing',
        name: 'Resume Writing',
        icon: 'BriefcaseBusiness',
        description: "Help people create professional resumes.",
        opportunities: [
            { id: 'rw-4', title: 'LinkedIn Services Marketplace', description: 'Find professionals on LinkedIn', link: 'https://www.linkedin.com/services/', logoKey: 'linkedinLogo', imageKey: 'resumeDocumentImage1', aiHint: 'resume document', tags: ['Resume', 'Career'] },
            { id: 'rw-5', title: 'TopResume', description: 'Resume writing service', link: 'https://www.topresume.com/', logoKey: 'topresumeLogo', imageKey: 'resumeDocumentImage2', aiHint: 'resume document', tags: ['Resume', 'Career'] },
            { id: 'rw-6', title: 'Monster', description: 'Job board and resume services', link: 'https://www.monster.com/', logoKey: 'monsterLogo', imageKey: 'resumeDocumentImage3', aiHint: 'resume document', tags: ['Resume', 'Jobs'] },
        ],
    },
    {
        id: 'translation-jobs',
        name: 'Translation Jobs',
        icon: 'Languages',
        description: "Translate documents and audio.",
        opportunities: [
            { id: 'tj-1', title: 'Gengo', description: 'Translation platform', link: 'https://gengo.com/', logoKey: 'gengoLogo', imageKey: 'languageTranslationImage1', aiHint: 'language translation', tags: ['Translation', 'Language'] },
            { id: 'tj-2', title: 'Unbabel', description: 'AI-powered translation', link: 'https://unbabel.com/', logoKey: 'unbabelLogo', imageKey: 'languageTranslationImage2', aiHint: 'language translation', tags: ['Translation', 'AI'] },
            { id: 'tj-3', title: 'ProZ.com', description: 'Directory of translation services', link: 'https://www.proz.com/', logoKey: 'prozLogo', imageKey: 'languageTranslationImage3', aiHint: 'language translation', tags: ['Translation', 'Community'] },
            { id: 'tj-4', title: 'TranslatorsCafé', description: 'Translation community', link: 'https://www.translatorscafe.com/', logoKey: 'translatorscafeLogo', imageKey: 'languageTranslationImage4', aiHint: 'language translation', tags: ['Translation', 'Community'] },
        ],
    },
    {
        id: 'online-tutoring',
        name: 'Online Tutoring',
        icon: 'School',
        description: "Tutor students in various subjects.",
        opportunities: [
            { id: 'ot-1', title: 'Chegg Tutors', description: 'Online tutoring', link: 'https://www.chegg.com/tutors/', logoKey: 'cheggLogo', imageKey: 'onlineTutoringImage1', aiHint: 'online tutoring', tags: ['Tutoring', 'Education'] },
            { id: 'ot-2', title: 'Tutor.com', description: 'Online tutoring', link: 'https://www.tutor.com/', logoKey: 'tutorcomLogo', imageKey: 'onlineTutoringImage2', aiHint: 'online tutoring', tags: ['Tutoring', 'Education'] },
            { id: 'ot-3', title: 'Wyzant', description: 'Tutoring marketplace', link: 'https://www.wyzant.com/', logoKey: 'wyzantLogo', imageKey: 'onlineTutoringImage3', aiHint: 'online tutoring', tags: ['Tutoring', 'Marketplace'] },
            { id: 'ot-4', title: 'Preply', description: 'Language tutoring platform', link: 'https://preply.com/', logoKey: 'preplyLogo', imageKey: 'onlineTutoringImage4', aiHint: 'online tutoring', tags: ['Tutoring', 'Language'] },
            { id: 'ot-5', title: 'Varsity Tutors', description: 'Online tutoring and test prep', link: 'https://www.varsitytutors.com/', logoKey: 'varsitytutorsLogo', imageKey: 'onlineTutoringImage5', aiHint: 'online tutoring', tags: ['Tutoring', 'Test Prep'] },
            { id: 'ot-6', title: 'iTalki', description: 'Language learning platform', link: 'https://www.italki.com/', logoKey: 'italkiLogo', imageKey: 'onlineTutoringImage6', aiHint: 'online tutoring', tags: ['Tutoring', 'Language'] },
        ],
    },
    {
        id: 'homework-help',
        name: 'Homework Help',
        icon: 'Home',
        description: "Assist students with their homework.",
        opportunities: [
            { id: 'hh-1', title: 'Course Hero', description: 'Online learning platform', link: 'https://www.coursehero.com/', logoKey: 'courseheroLogo', imageKey: 'studentHomeworkImage1', aiHint: 'student homework', tags: ['Homework', 'Education'] },
            { id: 'hh-2', title: 'StudyPool', description: 'Online tutoring and homework help', link: 'https://www.studypool.com/', logoKey: 'studypoolLogo', imageKey: 'studentHomeworkImage2', aiHint: 'student homework', tags: ['Homework', 'Tutoring'] },
            { id: 'hh-3', title: 'Chegg Study', description: 'Homework help and textbook solutions', link: 'https://www.chegg.com/study', logoKey: 'cheggstudyLogo', imageKey: 'studentHomeworkImage3', aiHint: 'student homework', tags: ['Homework', 'Education'] },
            { id: 'hh-4', title: 'Brainfuse', description: 'Online tutoring and academic help', link: 'https://www.brainfuse.com/', logoKey: 'brainfuseLogo', imageKey: 'studentHomeworkImage4', aiHint: 'student homework', tags: ['Homework', 'Tutoring'] },
        ],
    },
    {
        id: 'ui-ux-design',
        name: 'UI/UX Design',
        icon: 'Palette',
        description: "Design user interfaces and experiences.",
        opportunities: [
            { id: 'ui-1', title: 'Dribbble', description: 'Design portfolio platform', link: 'https://dribbble.com/', logoKey: 'dribbbleLogo', imageKey: 'designPrototypeImage1', aiHint: 'design prototype', tags: ['UI/UX', 'Design'] },
            { id: 'ui-2', title: 'Behance', description: 'Design portfolio platform', link: 'https://www.behance.net/', logoKey: 'behanceLogo', imageKey: 'designPrototypeImage2', aiHint: 'design prototype', tags: ['UI/UX', 'Design'] },
            { id: 'ui-3', title: 'Toptal', description: 'Freelance talent network', link: 'https://www.toptal.com/', logoKey: 'toptalLogo', imageKey: 'designPrototypeImage3', aiHint: 'design prototype', tags: ['UI/UX', 'Freelance'] },
        ],
    },
    {
        id: 'bug-bounty',
        name: 'Bug Bounty Hunting',
        icon: 'Bug',
        description: "Find and report software bugs.",
        opportunities: [
            { id: 'bb-1', title: 'HackerOne', description: 'Bug bounty platform', link: 'https://www.hackerone.com/', logoKey: 'hackeroneLogo', imageKey: 'hackerCodeImage1', aiHint: 'hacker code', tags: ['Security', 'Bounty'] },
            { id: 'bb-2', title: 'Bugcrowd', description: 'Bug bounty platform', link: 'https://www.bugcrowd.com/', logoKey: 'bugcrowdLogo', imageKey: 'hackerCodeImage2', aiHint: 'hacker code', tags: ['Security', 'Bounty'] },
            { id: 'bb-3', title: 'Synack', description: 'Crowdsourced security testing', link: 'https://www.synack.com/', logoKey: 'synackLogo', imageKey: 'hackerCodeImage3', aiHint: 'hacker code', tags: ['Security', 'Testing'] },
            { id: 'bb-4', title: 'Open Bug Bounty', description: 'Open bug bounty platform', link: 'https://www.openbugbounty.org/', logoKey: 'openbugbountyLogo', imageKey: 'hackerCodeImage4', aiHint: 'hacker code', tags: ['Security', 'Bounty'] },
            { id: 'bb-5', title: 'Cobalt', description: 'Pentesting as a Service', link: 'https://cobalt.io/', logoKey: 'cobaltLogo', imageKey: 'hackerCodeImage5', aiHint: 'hacker code', tags: ['Security', 'Pentesting'] },
        ],
    },
    {
        id: 'social-media',
        name: 'Social Media Management',
        icon: 'Share2',
        description: "Manage social media accounts for businesses.",
        opportunities: [
            { id: 'sm-1', title: 'Simply Hired', description: 'Job search engine', link: 'https://www.simplyhired.com/', logoKey: 'simplyhiredLogo', imageKey: 'socialMediaImage1', aiHint: 'social media', tags: ['Social Media', 'Jobs'] },
            { id: 'sm-2', title: 'Remote.co', description: 'Remote job board', link: 'https://remote.co/', logoKey: 'remotecoLogo', imageKey: 'socialMediaImage2', aiHint: 'social media', tags: ['Social Media', 'Remote'] },
        ],
    },
    {
        id: 'affiliate-marketing',
        name: 'Affiliate Marketing',
        icon: 'Tag',
        description: "Promote products and earn commissions.",
        opportunities: [
            { id: 'am-1', title: 'Amazon Associates', description: 'Amazon affiliate program', link: 'https://affiliate-program.amazon.com/', logoKey: 'amazonLogo', imageKey: 'affiliateChartImage1', aiHint: 'affiliate chart', tags: ['Affiliate', 'Marketing'] },
            { id: 'am-2', title: 'ShareASale', description: 'Affiliate marketing network', link: 'https://www.shareasale.com/', logoKey: 'shareasaleLogo', imageKey: 'affiliateChartImage2', aiHint: 'affiliate chart', tags: ['Affiliate', 'Network'] },
            { id: 'am-3', title: 'CJ Affiliate', description: 'Affiliate marketing network', link: 'https://www.cj.com/', logoKey: 'cjLogo', imageKey: 'affiliateChartImage3', aiHint: 'affiliate chart', tags: ['Affiliate', 'Network'] },
            { id: 'am-4', title: 'Rakuten Advertising', description: 'Affiliate marketing network', link: 'https://rakutenadvertising.com/', logoKey: 'rakutenLogo', imageKey: 'affiliateChartImage4', aiHint: 'affiliate chart', tags: ['Affiliate', 'Network'] },
            { id: 'am-5', title: 'ClickBank', description: 'Affiliate marketplace', link: 'https://www.clickbank.com/', logoKey: 'clickbankLogo', imageKey: 'affiliateChartImage5', aiHint: 'affiliate chart', tags: ['Affiliate', 'Marketplace'] },
            { id: 'am-6', title: 'Impact', description: 'Partnership automation platform', link: 'https://impact.com/', logoKey: 'impactLogo', imageKey: 'affiliateChartImage6', aiHint: 'affiliate chart', tags: ['Affiliate', 'Automation'] },
        ],
    },
    {
        id: 'youtube',
        name: 'YouTube Content Creation',
        icon: 'Youtube',
        description: "Create and monetize YouTube videos.",
        opportunities: [
            { id: 'yt-1', title: 'YouTube Partner Program', description: 'Monetize YouTube content', link: 'https://www.youtube.com/creators/how-things-work/getting-paid/', logoKey: 'youtubeLogo', imageKey: 'youtubeCreatorImage1', aiHint: 'youtube creator', tags: ['YouTube', 'Content'] },
            { id: 'yt-2', title: 'Patreon', description: 'Membership platform for creators', link: 'https://www.patreon.com/', logoKey: 'patreonLogo', imageKey: 'youtubeCreatorImage2', aiHint: 'youtube creator', tags: ['Membership', 'Creators'] },
            { id: 'yt-3', title: 'YouTube BrandConnect', description: 'Branded content platform', link: 'https://www.youtube.com/brandconnect/', logoKey: 'yt-brandconnectLogo', imageKey: 'youtubeCreatorImage3', aiHint: 'youtube creator', tags: ['YouTube', 'Branding'] },
            { id: 'yt-4', title: 'IZEA', description: 'Influencer marketing platform', link: 'https://izea.com/', logoKey: 'izeaLogo', imageKey: 'youtubeCreatorImage4', aiHint: 'youtube creator', tags: ['Influencer', 'Marketing'] },
        ],
    },
    {
        id: 'instagram-marketing',
        name: 'Instagram Marketing',
        icon: 'Instagram',
        description: "Market products and services on Instagram.",
        opportunities: [
            { id: 'im-1', title: 'Aspire', description: 'Influencer marketing platform', link: 'https://www.aspire.io/', logoKey: 'aspireLogo', imageKey: 'instagramPhoneImage1', aiHint: 'instagram phone', tags: ['Instagram', 'Influencer'] },
            { id: 'im-2', title: 'TRIBE', description: 'Influencer marketing platform', link: 'https://www.tribegroup.co/', logoKey: 'tribeLogo', imageKey: 'instagramPhoneImage2', aiHint: 'instagram phone', tags: ['Instagram', 'Influencer'] },
            { id: 'im-3', title: 'Upfluence', description: 'Influencer marketing platform', link: 'https://www.upfluence.com/', logoKey: 'upfluenceLogo', imageKey: 'instagramPhoneImage3', aiHint: 'instagram phone', tags: ['Instagram', 'Influencer'] },
            { id: 'im-4', title: 'Influencity', description: 'Influencer marketing platform', link: 'https://influencity.com/', logoKey: 'influencityLogo', imageKey: 'instagramPhoneImage4', aiHint: 'instagram phone', tags: ['Instagram', 'Influencer'] },
            { id: 'im-5', title: 'Fohr', description: 'Influencer marketing platform', link: 'https://www.fohr.co/', logoKey: 'fohrLogo', imageKey: 'instagramPhoneImage5', aiHint: 'instagram phone', tags: ['Instagram', 'Influencer'] },
        ],
    },
    {
        id: 'ai-prompts',
        name: 'Creating & Selling AI Prompts',
        icon: 'BrainCircuit',
        description: "Craft and sell prompts for AI models.",
        opportunities: [
            { id: 'aip-1', title: 'PromptBase', description: 'Marketplace for AI prompts', link: 'https://promptbase.com/', logoKey: 'promptbaseLogo', imageKey: 'aiBrainImage1', aiHint: 'ai brain', tags: ['AI', 'Prompts'] },
            { id: 'aip-2', title: 'PromptHero', description: 'Marketplace for AI prompts', link: 'https://prompthero.com/', logoKey: 'promptheroLogo', imageKey: 'aiBrainImage2', aiHint: 'ai brain', tags: ['AI', 'Prompts'] },
        ],
    },
    {
        id: 'ai-art',
        name: 'Selling AI-Generated Art',
        icon: 'Paintbrush',
        description: "Create and sell art made with AI.",
        opportunities: [
            { id: 'aia-1', title: 'Etsy', description: 'Marketplace for handmade and vintage goods', link: 'https://www.etsy.com/', logoKey: 'etsyLogo', imageKey: 'aiArtImage1', aiHint: 'ai art', tags: ['AI Art', 'E-commerce'] },
            { id: 'aia-2', title: 'Redbubble', description: 'Print-on-demand marketplace', link: 'https://www.redbubble.com/', logoKey: 'redbubbleLogo', imageKey: 'aiArtImage2', aiHint: 'ai art', tags: ['AI Art', 'POD'] },
            { id: 'aia-3', title: 'Society6', description: 'Print-on-demand marketplace', link: 'https://society6.com/', logoKey: 'society6Logo', imageKey: 'aiArtImage3', aiHint: 'ai art', tags: ['AI Art', 'POD'] },
            { id: 'aia-4', title: 'Fine Art America', description: 'Art marketplace', link: 'https://fineartamerica.com/', logoKey: 'fineartamericaLogo', imageKey: 'aiArtImage4', aiHint: 'ai art', tags: ['AI Art', 'Marketplace'] },
            { id: 'aia-5', title: 'ArtPal', description: 'Art marketplace', link: 'https://www.artpal.com/', logoKey: 'artpalLogo', imageKey: 'aiArtImage5', aiHint: 'ai art', tags: ['AI Art', 'Marketplace'] },
            { id: 'aia-6', title: 'Zazzle', description: 'Print-on-demand marketplace', link: 'https://www.zazzle.com/', logoKey: 'zazzleLogo', imageKey: 'aiArtImage6', aiHint: 'ai art', tags: ['AI Art', 'POD'] },
        ],
    },
    {
        id: 'ai-voiceover',
        name: 'AI Voiceover Work',
        icon: 'Mic',
        description: "Use AI for voiceover projects.",
        opportunities: [
            { id: 'aiv-1', title: 'Descript', description: 'AI-powered audio/video editor', link: 'https://www.descript.com/', logoKey: 'descriptLogo', imageKey: 'voiceoverMicrophoneImage1', aiHint: 'voiceover microphone', tags: ['AI', 'Voiceover'] },
            { id: 'aiv-2', title: 'Play.ht', description: 'AI text-to-speech generator', link: 'https://play.ht/', logoKey: 'playhtLogo', imageKey: 'voiceoverMicrophoneImage2', aiHint: 'voiceover microphone', tags: ['AI', 'TTS'] },
            { id: 'aiv-3', title: 'Murf.ai', description: 'AI voice generator', link: 'https://murf.ai/', logoKey: 'murfaiLogo', imageKey: 'voiceoverMicrophoneImage3', aiHint: 'voiceover microphone', tags: ['AI', 'Voiceover'] },
            { id: 'aiv-4', title: 'Bunny Studio', description: 'Creative services marketplace', link: 'https://bunnystudio.com/voice-overs/', logoKey: 'bunnystudioLogo', imageKey: 'voiceoverMicrophoneImage4', aiHint: 'voiceover microphone', tags: ['Voiceover', 'Marketplace'] },
            { id: 'aiv-5', title: 'Voices.com', description: 'Voiceover marketplace', link: 'https://www.voices.com/', logoKey: 'voicescomLogo', imageKey: 'voiceoverMicrophoneImage5', aiHint: 'voiceover microphone', tags: ['Voiceover', 'Marketplace'] },
        ],
    },
    {
        id: 'ai-ebooks',
        name: 'Selling AI-Generated Ebooks',
        icon: 'Book',
        description: "Write and sell ebooks with AI assistance.",
        opportunities: [
            { id: 'aie-1', title: 'Amazon KDP', description: 'Self-publishing platform', link: 'https://kdp.amazon.com/', logoKey: 'amazonkdpLogo', imageKey: 'ebookLibraryImage1', aiHint: 'ebook library', tags: ['AI', 'Ebooks'] },
            { id: 'aie-2', title: 'Smashwords', description: 'Ebook distribution platform', link: 'https://www.smashwords.com/', logoKey: 'smashwordsLogo', imageKey: 'ebookLibraryImage2', aiHint: 'ebook library', tags: ['Ebooks', 'Publishing'] },
            { id: 'aie-3', title: 'Lulu', description: 'Self-publishing platform', link: 'https://www.lulu.com/', logoKey: 'luluLogo', imageKey: 'ebookLibraryImage3', aiHint: 'ebook library', tags: ['Ebooks', 'Publishing'] },
            { id: 'aie-4', title: 'Blurb', description: 'Self-publishing platform', link: 'https://www.blurb.com/', logoKey: 'blurbLogo', imageKey: 'ebookLibraryImage4', aiHint: 'ebook library', tags: ['Ebooks', 'Publishing'] },
            { id: 'aie-5', title: 'Draft2Digital', description: 'Ebook distribution platform', link: 'https://www.draft2digital.com/', logoKey: 'draft2digitalLogo', imageKey: 'ebookLibraryImage5', aiHint: 'ebook library', tags: ['Ebooks', 'Publishing'] },
        ],
    },
    {
        id: 'ai-chat-dev',
        name: 'AI Based Chat Development',
        icon: 'Bot',
        description: "Develop chatbots using AI.",
        opportunities: [
            { id: 'aicd-1', title: 'OpenAI API', description: 'API for AI models', link: 'https://platform.openai.com/', logoKey: 'openaiLogo', imageKey: 'chatbotRobotImage1', aiHint: 'chatbot robot', tags: ['AI', 'Chatbot'] },
            { id: 'aicd-2', title: 'Botpress', description: 'Chatbot building platform', link: 'https://botpress.com/', logoKey: 'botpressLogo', imageKey: 'chatbotRobotImage2', aiHint: 'chatbot robot', tags: ['AI', 'Chatbot'] },
            { id: 'aicd-3', title: 'Google Dialogflow', description: 'Conversational AI platform', link: 'https://cloud.google.com/dialogflow', logoKey: 'dialogflowLogo', imageKey: 'chatbotRobotImage3', aiHint: 'chatbot robot', tags: ['AI', 'Google'] },
            { id: 'aicd-4', title: 'Microsoft Bot Framework', description: 'Bot building framework', link: 'https://dev.botframework.com/', logoKey: 'msbotLogo', imageKey: 'chatbotRobotImage4', aiHint: 'chatbot robot', tags: ['AI', 'Microsoft'] },
            { id: 'aicd-5', title: 'IBM Watson Assistant', description: 'AI assistant platform', link: 'https://www.ibm.com/products/watson-assistant', logoKey: 'ibmwatsonLogo', imageKey: 'chatbotRobotImage5', aiHint: 'chatbot robot', tags: ['AI', 'IBM'] },
            { id: 'aicd-6', title: 'Rasa', description: 'Open source conversational AI', link: 'https://rasa.com/', logoKey: 'rasaLogo', imageKey: 'chatbotRobotImage6', aiHint: 'chatbot robot', tags: ['AI', 'Open Source'] },
        ],
    },
    {
        id: 'crypto-staking',
        name: 'Cryptocurrency Staking',
        icon: 'CircleDollarSign',
        description: "Earn rewards by staking crypto.",
        opportunities: [
            { id: 'cs-1', title: 'Binance Earn', description: 'Crypto earning platform', link: 'https://www.binance.com/en/earn', logoKey: 'binanceLogo', imageKey: 'cryptoCoinImage1', aiHint: 'crypto coin', tags: ['Crypto', 'Staking'] },
            { id: 'cs-2', title: 'Kraken', description: 'Crypto exchange and staking', link: 'https://www.kraken.com/', logoKey: 'krakenLogo', imageKey: 'cryptoCoinImage2', aiHint: 'crypto coin', tags: ['Crypto', 'Staking'] },
            { id: 'cs-3', title: 'Coinbase', description: 'Crypto exchange and staking', link: 'https://www.coinbase.com/', logoKey: 'coinbaseLogo', imageKey: 'cryptoCoinImage3', aiHint: 'crypto coin', tags: ['Crypto', 'Staking'] },
            { id: 'cs-4', title: 'Crypto.com', description: 'Crypto platform', link: 'https://crypto.com/', logoKey: 'cryptocomLogo', imageKey: 'cryptoCoinImage4', aiHint: 'crypto coin', tags: ['Crypto', 'Staking'] },
            { id: 'cs-5', title: 'KuCoin', description: 'Crypto exchange', link: 'https://www.kucoin.com/', logoKey: 'kucoinLogo', imageKey: 'cryptoCoinImage5', aiHint: 'crypto coin', tags: ['Crypto', 'Exchange'] },
            { id: 'cs-6', title: 'Bitfinex', description: 'Crypto exchange', link: 'https://www.bitfinex.com/', logoKey: 'bitfinexLogo', imageKey: 'cryptoCoinImage6', aiHint: 'crypto coin', tags: ['Crypto', 'Exchange'] },
        ],
    },
    {
        id: 'stock-trading',
        name: 'Stock Market Trading',
        icon: 'TrendingUp',
        description: "Trade stocks on the financial markets.",
        opportunities: [
            { id: 'st-1', title: 'Robinhood', description: 'Stock trading platform', link: 'https://robinhood.com/', logoKey: 'robinhoodLogo', imageKey: 'stockChartImage1', aiHint: 'stock chart', tags: ['Stocks', 'Trading'] },
            { id: 'st-2', title: 'E*TRADE', description: 'Online brokerage', link: 'https://us.etrade.com/', logoKey: 'etradeLogo', imageKey: 'stockChartImage2', aiHint: 'stock chart', tags: ['Stocks', 'Trading'] },
            { id: 'st-3', title: 'Fidelity', description: 'Financial services company', link: 'https://www.fidelity.com/', logoKey: 'fidelityLogo', imageKey: 'stockChartImage3', aiHint: 'stock chart', tags: ['Stocks', 'Investing'] },
            { id: 'st-4', title: 'TD Ameritrade', description: 'Online brokerage', link: 'https://www.tdameritrade.com/', logoKey: 'tdameritradeLogo', imageKey: 'stockChartImage4', aiHint: 'stock chart', tags: ['Stocks', 'Trading'] },
            { id: 'st-5', title: 'Interactive Brokers', description: 'Online brokerage', link: 'https://www.interactivebrokers.com/', logoKey: 'interactivebrokersLogo', imageKey: 'stockChartImage5', aiHint: 'stock chart', tags: ['Stocks', 'Trading'] },
            { id: 'st-6', title: 'Charles Schwab', description: 'Financial services company', link: 'https://www.schwab.com/', logoKey: 'schwabLogo', imageKey: 'stockChartImage6', aiHint: 'stock chart', tags: ['Stocks', 'Investing'] },
        ],
    },
    {
        id: 'nft-trading',
        name: 'NFT Trading',
        icon: 'Landmark',
        description: "Buy and sell Non-Fungible Tokens.",
        opportunities: [
            { id: 'nft-1', title: 'OpenSea', description: 'NFT marketplace', link: 'https://opensea.io/', logoKey: 'openseaLogo', imageKey: 'nftArtImage1', aiHint: 'nft art', tags: ['NFT', 'Marketplace'] },
            { id: 'nft-2', title: 'Rarible', description: 'NFT marketplace', link: 'https://rarible.com/', logoKey: 'raribleLogo', imageKey: 'nftArtImage2', aiHint: 'nft art', tags: ['NFT', 'Marketplace'] },
            { id: 'nft-3', title: 'Foundation', description: 'NFT marketplace', link: 'https://foundation.app/', logoKey: 'foundationLogo', imageKey: 'nftArtImage3', aiHint: 'nft art', tags: ['NFT', 'Art'] },
            { id: 'nft-4', title: 'SuperRare', description: 'NFT marketplace', link: 'https://superrare.com/', logoKey: 'superrareLogo', imageKey: 'nftArtImage4', aiHint: 'nft art', tags: ['NFT', 'Art'] },
            { id: 'nft-5', title: 'Nifty Gateway', description: 'NFT marketplace', link: 'https://niftygateway.com/', logoKey: 'niftygatewayLogo', imageKey: 'nftArtImage5', aiHint: 'nft art', tags: ['NFT', 'Marketplace'] },
            { id: 'nft-6', title: 'MakersPlace', description: 'NFT marketplace', link: 'https://makersplace.com/', logoKey: 'makersplaceLogo', imageKey: 'nftArtImage6', aiHint: 'nft art', tags: ['NFT', 'Art'] },
        ],
    },
    {
        id: 'forex-trading',
        name: 'Forex Trading',
        icon: 'Wallet',
        description: "Trade currencies on the foreign exchange market.",
        opportunities: [
            { id: 'ft-1', title: 'Forex.com', description: 'Forex trading platform', link: 'https://www.forex.com/', logoKey: 'forexcomLogo', imageKey: 'forexGraphImage1', aiHint: 'forex graph', tags: ['Forex', 'Trading'] },
            { id: 'ft-2', title: 'OANDA', description: 'Forex trading platform', link: 'https://www.oanda.com/', logoKey: 'oandaLogo', imageKey: 'forexGraphImage2', aiHint: 'forex graph', tags: ['Forex', 'Trading'] },
            { id: 'ft-3', title: 'IG Group', description: 'Online trading provider', link: 'https://www.ig.com/', logoKey: 'iggroupLogo', imageKey: 'forexGraphImage3', aiHint: 'forex graph', tags: ['Forex', 'Trading'] },
            { id: 'ft-4', title: 'FXTM', description: 'Forex broker', link: 'https://www.forextime.com/', logoKey: 'fxtmLogo', imageKey: 'forexGraphImage4', aiHint: 'forex graph', tags: ['Forex', 'Broker'] },
            { id: 'ft-5', title: 'XM', description: 'Forex broker', link: 'https://www.xm.com/', logoKey: 'xmLogo', imageKey: 'forexGraphImage5', aiHint: 'forex graph', tags: ['Forex', 'Broker'] },
            { id: 'ft-6', title: 'Pepperstone', description: 'Forex broker', link: 'https://pepperstone.com/', logoKey: 'pepperstoneLogo', imageKey: 'forexGraphImage6', aiHint: 'forex graph', tags: ['Forex', 'Broker'] },
        ],
    },
    {
        id: 'airdrops',
        name: 'Participating in Airdrops',
        icon: 'Shield',
        description: "Receive free tokens from new crypto projects.",
        opportunities: [
            { id: 'a-1', title: 'CoinMarketCap Airdrops', description: 'Airdrop listings', link: 'https://coinmarketcap.com/airdrop/', logoKey: 'coinmarketcapLogo', imageKey: 'cryptoAirdropImage1', aiHint: 'crypto airdrop', tags: ['Crypto', 'Airdrop'] },
            { id: 'a-2', title: 'Airdrop Alert', description: 'Airdrop listings', link: 'https://airdropalert.com/', logoKey: 'airdropalertLogo', imageKey: 'cryptoAirdropImage2', aiHint: 'crypto airdrop', tags: ['Crypto', 'Airdrop'] },
            { id: 'a-3', title: 'Airdrops.io', description: 'Airdrop listings', link: 'https://airdrops.io/', logoKey: 'airdropsioLogo', imageKey: 'cryptoAirdropImage3', aiHint: 'crypto airdrop', tags: ['Crypto', 'Airdrop'] },
            { id: 'a-4', title: 'ICO Drops', description: 'ICO and airdrop listings', link: 'https://icodrops.com/', logoKey: 'icodropsLogo', imageKey: 'cryptoAirdropImage4', aiHint: 'crypto airdrop', tags: ['Crypto', 'ICO'] },
        ],
    },
    {
        id: 'print-on-demand',
        name: 'Print-on-Demand Stores',
        icon: 'Printer',
        description: "Sell custom designs on products.",
        opportunities: [
            { id: 'pod-1', title: 'Redbubble', description: 'Print-on-demand marketplace', link: 'https://www.redbubble.com/', logoKey: 'redbubbleLogo', imageKey: 'tshirtDesignImage1', aiHint: 'tshirt design', tags: ['POD', 'E-commerce'] },
            { id: 'pod-2', title: 'Spring (Teespring)', description: 'Print-on-demand platform', link: 'https://creator-spring.com/', logoKey: 'springLogo', imageKey: 'tshirtDesignImage2', aiHint: 'tshirt design', tags: ['POD', 'E-commerce'] },
            { id: 'pod-3', title: 'Merch by Amazon', description: 'Amazon print-on-demand', link: 'https://merch.amazon.com/', logoKey: 'amazonmerchLogo', imageKey: 'tshirtDesignImage3', aiHint: 'tshirt design', tags: ['POD', 'Amazon'] },
            { id: 'pod-4', title: 'Zazzle', description: 'Print-on-demand marketplace', link: 'https://www.zazzle.com/', logoKey: 'zazzleLogo', imageKey: 'tshirtDesignImage4', aiHint: 'tshirt design', tags: ['POD', 'E-commerce'] },
            { id: 'pod-5', title: 'Spreadshirt', description: 'Print-on-demand platform', link: 'https://www.spreadshirt.com/', logoKey: 'spreadshirtLogo', imageKey: 'tshirtDesignImage5', aiHint: 'tshirt design', tags: ['POD', 'E-commerce'] },
            { id: 'pod-6', title: 'Society6', description: 'Print-on-demand marketplace', link: 'https://society6.com/', logoKey: 'society6Logo', imageKey: 'tshirtDesignImage6', aiHint: 'tshirt design', tags: ['POD', 'Art'] },
        ],
    },
    {
        id: 'dropshipping',
        name: 'Dropshipping',
        icon: 'Package',
        description: "Sell products without holding inventory.",
        opportunities: [
            { id: 'd-1', title: 'Shopify', description: 'E-commerce platform', link: 'https://www.shopify.com/', logoKey: 'shopifyLogo', imageKey: 'shippingBoxImage1', aiHint: 'shipping box', tags: ['Dropshipping', 'E-commerce'] },
            { id: 'd-2', title: 'AliExpress', description: 'E-commerce marketplace', link: 'https://www.aliexpress.com/', logoKey: 'aliexpressLogo', imageKey: 'shippingBoxImage2', aiHint: 'shipping box', tags: ['Dropshipping', 'Sourcing'] },
            { id: 'd-3', title: 'WooCommerce', description: 'E-commerce platform for WordPress', link: 'https://woocommerce.com/', logoKey: 'woocommerceLogo', imageKey: 'shippingBoxImage3', aiHint: 'shipping box', tags: ['Dropshipping', 'WordPress'] },
            { id: 'd-4', title: 'BigCommerce', description: 'E-commerce platform', link: 'https://www.bigcommerce.com/', logoKey: 'bigcommerceLogo', imageKey: 'shippingBoxImage4', aiHint: 'shipping box', tags: ['Dropshipping', 'E-commerce'] },
            { id: 'd-5', title: 'Spocket', description: 'Dropshipping marketplace', link: 'https://www.spocket.co/', logoKey: 'spocketLogo', imageKey: 'shippingBoxImage5', aiHint: 'shipping box', tags: ['Dropshipping', 'Sourcing'] },
        ],
    },
    {
        id: 'digital-products',
        name: 'Selling Digital Products',
        icon: 'Laptop',
        description: "Sell your own digital creations.",
        opportunities: [
            { id: 'dp-1', title: 'Gumroad', description: 'Platform for creators to sell products', link: 'https://gumroad.com/', logoKey: 'gumroadLogo', imageKey: 'digitalDownloadImage1', aiHint: 'digital download', tags: ['Digital Products', 'Creators'] },
            { id: 'dp-2', title: 'Sellfy', description: 'E-commerce platform for creators', link: 'https://sellfy.com/', logoKey: 'sellfyLogo', imageKey: 'digitalDownloadImage2', aiHint: 'digital download', tags: ['Digital Products', 'Creators'] },
            { id: 'dp-3', title: 'Etsy', description: 'Marketplace for digital products', link: 'https://www.etsy.com/', logoKey: 'etsyLogo', imageKey: 'digitalDownloadImage3', aiHint: 'digital download', tags: ['Digital Products', 'Etsy'] },
            { id: 'dp-4', title: 'Creative Market', description: 'Marketplace for design assets', link: 'https://creativemarket.com/', logoKey: 'creativemarketLogo', imageKey: 'digitalDownloadImage4', aiHint: 'digital download', tags: ['Digital Products', 'Design'] },
            { id: 'dp-5', title: 'E-junkie', description: 'E-commerce platform', link: 'https://www.e-junkie.com/', logoKey: 'ejunkieLogo', imageKey: 'digitalDownloadImage5', aiHint: 'digital download', tags: ['Digital Products', 'E-commerce'] },
            { id: 'dp-6', title: 'Payhip', description: 'Platform to sell digital products', link: 'https://payhip.com/', logoKey: 'payhipLogo', imageKey: 'digitalDownloadImage6', aiHint: 'digital download', tags: ['Digital Products', 'Creators'] },
        ],
    },
    {
        id: 'sell-photos',
        name: 'Selling Photos & Videos',
        icon: 'Camera',
        description: "Monetize your photography and videography.",
        opportunities: [
            { id: 'spv-1', title: 'Shutterstock', description: 'Stock photo marketplace', link: 'https://www.shutterstock.com/', logoKey: 'shutterstockLogo', imageKey: 'cameraLensImage1', aiHint: 'camera lens', tags: ['Stock Photos', 'Photography'] },
            { id: 'spv-2', title: 'Adobe Stock', description: 'Stock photo marketplace', link: 'https://stock.adobe.com/', logoKey: 'adobestockLogo', imageKey: 'cameraLensImage2', aiHint: 'camera lens', tags: ['Stock Photos', 'Adobe'] },
            { id: 'spv-3', title: 'iStock', description: 'Stock photo marketplace', link: 'https://www.istockphoto.com/', logoKey: 'istockLogo', imageKey: 'cameraLensImage3', aiHint: 'camera lens', tags: ['Stock Photos', 'Photography'] },
            { id: 'spv-4', title: 'Dreamstime', description: 'Stock photo marketplace', link: 'https://www.dreamstime.com/', logoKey: 'dreamstimeLogo', imageKey: 'cameraLensImage4', aiHint: 'camera lens', tags: ['Stock Photos', 'Photography'] },
            { id: 'spv-5', title: 'Alamy', description: 'Stock photo marketplace', link: 'https://www.alamy.com/', logoKey: 'alamyLogo', imageKey: 'cameraLensImage5', aiHint: 'camera lens', tags: ['Stock Photos', 'Photography'] },
        ],
    },
    {
        id: 'mystery-shopping',
        name: 'Online Mystery Shopping',
        icon: 'Store',
        description: "Evaluate online businesses anonymously.",
        opportunities: [
            { id: 'oms-1', title: 'BestMark', description: 'Mystery shopping company', link: 'https://www.bestmark.com/', logoKey: 'bestmarkLogo', imageKey: 'onlineShoppingImage1', aiHint: 'online shopping', tags: ['Mystery Shopping', 'Reviews'] },
            { id: 'oms-2', title: 'IntelliShop', description: 'Mystery shopping company', link: 'https://www.intelli-shop.com/', logoKey: 'intellishopLogo', imageKey: 'onlineShoppingImage2', aiHint: 'online shopping', tags: ['Mystery Shopping', 'Reviews'] },
            { id: 'oms-3', title: 'Secret Shopper', description: 'Mystery shopping company', link: 'https://www.secretshopper.com/', logoKey: 'secretshopperLogo', imageKey: 'onlineShoppingImage3', aiHint: 'online shopping', tags: ['Mystery Shopping', 'Reviews'] },
            { id: 'oms-4', title: 'Market Force', description: 'Customer experience management', link: 'https://www.marketforce.com/', logoKey: 'marketforceLogo', imageKey: 'onlineShoppingImage4', aiHint: 'online shopping', tags: ['Mystery Shopping', 'CX'] },
            { id: 'oms-5', title: 'Coyle Hospitality Group', description: 'Mystery shopping for hospitality', link: 'https://www.coylehospitality.com/', logoKey: 'coylehospitalityLogo', imageKey: 'onlineShoppingImage5', aiHint: 'online shopping', tags: ['Mystery Shopping', 'Hospitality'] },
        ],
    },
    {
        id: 'rent-digital-space',
        name: 'Renting Out Digital Space',
        icon: 'Wifi',
        description: "Share your internet bandwidth for cash.",
        opportunities: [
            { id: 'rds-1', title: 'Honeygain', description: 'Share internet to earn', link: 'https://www.honeygain.com/', logoKey: 'honeygainLogo', imageKey: 'internetRouterImage1', aiHint: 'internet router', tags: ['Passive Income', 'Internet'] },
            { id: 'rds-2', title: 'Peer2Profit', description: 'Share internet to earn', link: 'https://peertoprofit.com/', logoKey: 'peer2profitLogo', imageKey: 'internetRouterImage2', aiHint: 'internet router', tags: ['Passive Income', 'Internet'] },
            { id: 'rds-3', title: 'PacketStream', description: 'Share internet to earn', link: 'https://packetstream.io/', logoKey: 'packetstreamLogo', imageKey: 'internetRouterImage3', aiHint: 'internet router', tags: ['Passive Income', 'Internet'] },
        ],
    },
    {
        id: 'data-annotation',
        name: 'Data Annotation',
        icon: 'Tag',
        description: "Label data to train AI models.",
        opportunities: [
            { id: 'da-1', title: 'Appen', description: 'Data annotation services', link: 'https://appen.com/', logoKey: 'appenLogo', imageKey: 'dataLabelImage1', aiHint: 'data label', tags: ['Data Annotation', 'AI'] },
            { id: 'da-2', title: 'Lionbridge', description: 'Data annotation services', link: 'https://www.lionbridge.com/', logoKey: 'lionbridgeLogo', imageKey: 'dataLabelImage2', aiHint: 'data label', tags: ['Data Annotation', 'AI'] },
        ],
    },
    {
        id: 'ai-image-video-tools',
        name: 'AI Image & Video Tools',
        icon: 'Camera',
        description: "Tools for generating and editing images and videos with AI.",
        opportunities: [
            { id: 'aivt-1', title: 'Syllaby', description: 'AI video script generator.', link: 'https://www.syllaby.io/', logoKey: 'syllabyLogo', imageKey: 'aiVideoLogo', aiHint: 'AI video', tags: ['AI', 'Video'] },
            { id: 'aivt-2', title: 'HeyGen', description: 'AI video generation platform.', link: 'https://www.heygen.com/', logoKey: 'heyGenLogo', imageKey: 'aiVideoLogo', aiHint: 'AI video', tags: ['AI', 'Video'] },
            { id: 'aivt-3', title: 'Runway', description: 'AI video editing and generation tools.', link: 'https://runwayml.com/', logoKey: 'runwayLogo', imageKey: 'aiVideoLogo', aiHint: 'AI video', tags: ['AI', 'Video'] },
            { id: 'aivt-4', title: 'Submagic', description: 'AI-powered subtitle generation.', link: 'https://www.submagic.co/', logoKey: 'submagicLogo', imageKey: 'aiVideoLogo', aiHint: 'AI video', tags: ['AI', 'Subtitles'] },
            { id: 'aivt-5', title: 'Krea AI', description: 'Real-time AI image generation.', link: 'https://www.krea.ai/', logoKey: 'kreaAiLogo', imageKey: 'aiVideoLogo', aiHint: 'AI video', tags: ['AI', 'Image'] },
        ],
    },
    {
        id: 'ai-coding-assistants',
        name: 'AI Coding Assistants',
        icon: 'Bot',
        description: "Assistants that help with writing and debugging code.",
        opportunities: [
            { id: 'aica-1', title: 'Cursor', description: 'AI-first code editor.', link: 'https://cursor.sh/', logoKey: 'cursorAssistLogo', imageKey: 'chatbotRobotImage1', aiHint: 'AI code', tags: ['AI', 'Code'] },
            { id: 'aica-2', title: 'Github Copilot', description: 'AI pair programmer from GitHub.', link: 'https://github.com/features/copilot', logoKey: 'githubCopilotLogo', imageKey: 'chatbotRobotImage2', aiHint: 'AI code', tags: ['AI', 'Code'] },
            { id: 'aica-3', title: 'Tabnine', description: 'AI assistant for software developers.', link: 'https://www.tabnine.com/', logoKey: 'tabnineLogo', imageKey: 'chatbotRobotImage3', aiHint: 'AI code', tags: ['AI', 'Code'] },
            { id: 'aica-4', title: 'Devin', description: 'The first AI software engineer.', link: 'https://www.cognition-labs.com/blog/introducing-devin', logoKey: 'devinLogo', imageKey: 'chatbotRobotImage4', aiHint: 'AI code', tags: ['AI', 'Code'] },
            { id: 'aica-5', title: 'Aider', description: 'AI pair programming in your terminal.', link: 'https://aider.chat/', logoKey: 'aiderLogo', imageKey: 'chatbotRobotImage5', aiHint: 'AI code', tags: ['AI', 'Code'] },
        ],
    },
];
