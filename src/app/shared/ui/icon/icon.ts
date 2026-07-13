import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  Activity,
  AlertTriangle,
  AppWindow,
  ArrowLeft,
  ArrowRight,
  Award,
  Banknote,
  BarChart2,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Brain,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  ChartColumn,
  ChartNoAxesColumnIncreasing,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  CircleHelp,
  Clipboard,
  ClipboardList,
  Clock,
  Clock3,
  Cloud,
  CloudOff,
  Code2,
  createElement,
  Cpu,
  CreditCard,
  Crown,
  Database,
  Download,
  Eye,
  EyeOff,
  FilePlus,
  FileText,
  FileUser,
  Globe,
  GraduationCap,
  GripVertical,
  Headphones,
  Headset,
  Heart,
  HelpCircle,
  History,
  Info,
  Layout,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  Loader2,
  LoaderCircle,
  Lock,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MessageCircleMore,
  MessageCircleQuestionMark,
  MessageSquare,
  MessageSquareMore,
  Mic,
  Minus,
  Monitor,
  MoveRight,
  Network,
  PanelLeftClose,
  PanelRightOpen,
  Paperclip,
  Pencil,
  Percent,
  Phone,
  Plane,
  Play,
  PlayCircle,
  Plus,
  Quote,
  Radio,
  RefreshCw,
  Rocket,
  RotateCcw,
  Save,
  ScrollText,
  Search,
  SearchX,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  SkipForward,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Square,
  SquarePen,
  Star,
  StickyNote,
  Sun,
  Terminal,
  Ticket,
  Tickets,
  Timer,
  Trash2,
  TrendingUp,
  TriangleAlert,
  Trophy,
  Upload,
  User,
  UserPlus,
  UserRound,
  Users,
  Video,
  VolumeX,
  Wifi,
  Wrench,
  X,
  Zap,
} from 'lucide';

/** Central icon registry — import and use `AppIcons.<name>` everywhere. */
export const APP_ICONS = {
  // Navigation
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  moveRight: MoveRight,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,

  // Layout
  menu: Menu,
  close: X,
  panelLeftClose: PanelLeftClose,
  panelRightOpen: PanelRightOpen,
  dashboard: LayoutDashboard,
  appWindow: AppWindow,
  monitor: Monitor,
  window: AppWindow,
  layout: Layout,

  // User & Account
  user: User,
  userRound: UserRound,
  userPlus: UserPlus,
  users: Users,
  settings: Settings,
  logOut: LogOut,
  crown: Crown,
  creditCard: CreditCard,

  // Authentication
  lock: Lock,
  lockKeyhole: LockKeyhole,
  eye: Eye,
  eyeOff: EyeOff,

  // Communication
  mail: Mail,
  phone: Phone,
  messageSquare: MessageSquare,
  messageCircle: MessageCircle,
  messageHelp: MessageCircleQuestionMark,
  messageCircleMore: MessageCircleMore,
  messageSquareMore: MessageSquareMore,

  // Actions
  search: Search,
  searchX: SearchX,
  refresh: RefreshCw,
  replay: RotateCcw,
  upload: Upload,
  download: Download,
  trash: Trash2,
  squarePen: SquarePen,
  pencil: Pencil,
  plus: Plus,
  gripVertical: GripVertical,
  filters: SlidersHorizontal,

  // Status
  check: Check,
  checkCircle: CheckCircle2,
  circleCheck: CircleCheck,
  shield: ShieldCheck,
  zap: Zap,
  alertTriangle: AlertTriangle,
  triangleAlert: TriangleAlert,
  info: Info,

  // Time
  clock: Clock3,
  clockSimple: Clock,
  timer: Timer,
  calendar: Calendar,
  history: History,

  // Media
  play: Play,
  playCircle: PlayCircle,
  skipForward: SkipForward,
  camera: Camera,
  mic: Mic,
  paperclip: Paperclip,
  square: Square,
  video: Video,
  volumeOff: VolumeX,

  // Technology
  brain: Brain,
  cpu: Cpu,
  code: Code2,
  terminal: Terminal,
  wifi: Wifi,
  bot: Bot,
  sparkles: Sparkles,

  // Files
  filePlus: FilePlus,
  fileText: FileText,
  stickyNote: StickyNote,
  fileUser: FileUser,
  clipboard: Clipboard,
  clipboardList: ClipboardList,
  scrollText: ScrollText,

  // Business & Learning
  rocket: Rocket,
  globe: Globe,
  graduationCap: GraduationCap,
  briefcase: Briefcase,
  building: Building2,
  banknote: Banknote,
  ticket: Ticket,
  tickets: Tickets,

  // Data & Cloud
  database: Database,
  cloud: Cloud,
  cloudOff: CloudOff,
  network: Network,

  // Charts & Analytics
  chartColumn: ChartColumn,
  chartNoAxesColumnIncreasing: ChartNoAxesColumnIncreasing,
  barChart: BarChart2,
  analytics: BarChart3,
  trendingUp: TrendingUp,
  activity: Activity,

  // UI
  bell: Bell,
  sun: Sun,
  circleHelp: CircleHelp,
  lightbulb: Lightbulb,
  listChecks: ListChecks,
  loader: Loader2,
  loaderCircle: LoaderCircle,
  trophy: Trophy,
  percent: Percent,
  star: Star,
  minus: Minus,
  wrench: Wrench,
  plan: Plane,

  // Social
  heart: Heart,
  share: Share2,
  quote: Quote,

  // Support & Audio
  headphones: Headphones,
  headset: Headset,
  bookOpen: BookOpen,
  save: Save,
  award: Award,
  send: Send,

  // Mobile
  smartphone: Smartphone,
  mapPin: MapPin,

  // Interview & Admin domain
  liveNow: Radio,
  completed: CheckCircle2,
  aiVoice: Headphones,
  textBased: MessageSquare,
} as const;

/**
 * App-wide icon map including semantic aliases for navigation and legacy keys.
 * Prefer `APP_ICONS` keys for new code; existing feature keys remain supported.
 */
export const AppIcons = {
  ...APP_ICONS,

  // Navigation semantics
  interviews: APP_ICONS.clipboardList,
  masterData: APP_ICONS.database,
  aiManagement: APP_ICONS.bot,
  subscriptions: APP_ICONS.creditCard,
  logs: APP_ICONS.scrollText,
  support: HelpCircle,
  signOut: APP_ICONS.logOut,

  // Legacy / feature aliases
  add: APP_ICONS.plus,
  view: APP_ICONS.eye,
  edit: APP_ICONS.pencil,
  gear: APP_ICONS.settings,
  usersKpi: APP_ICONS.users,
  userRegistered: APP_ICONS.userPlus,
  interviewCompleted: APP_ICONS.checkCircle,
  systemAlert: APP_ICONS.alertTriangle,
  addDomain: APP_ICONS.globe,
  createCoupon: APP_ICONS.tickets,
  managePrompt: APP_ICONS.messageSquare,
  securityAudit: APP_ICONS.shield,
} as const;

export type AppIconDefinition = (typeof AppIcons)[keyof typeof AppIcons];

@Component({
  selector: 'app-icon',
  template: '',
  encapsulation: ViewEncapsulation.None,
  styles: `
    app-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
    }
  `,
})
export class AppIcon implements OnChanges {
  private readonly host = inject(ElementRef<HTMLElement>);

  @Input({ required: true }) icon!: AppIconDefinition;
  @Input() size = 18;
  @Input() strokeWidth = 2;
  @Input() color = 'currentColor';

  ngOnChanges(): void {
    const host = this.host.nativeElement;
    host.innerHTML = '';

    const svg = createElement(this.icon, {
      width: this.size,
      height: this.size,
      stroke: this.color,
      'stroke-width': this.strokeWidth,
    });

    host.appendChild(svg);
  }
}
