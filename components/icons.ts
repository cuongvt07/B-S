'use client';

/**
 * Icon compatibility shim.
 *
 * Re-exports Phosphor icons under the Lucide names the codebase already uses,
 * so migrating a file is just changing the import source from `lucide-react`
 * to `@/components/icons` — the JSX stays identical.
 *
 * Global appearance (weight/size/color) is set once via `<IconContext.Provider>`
 * in the root layout. Phosphor's default weight here is `regular` — clean single
 * strokes (Lucide-like), matching the Manrope + navy/gold system.
 *
 * Note: Phosphor uses `weight="fill"` instead of `fill="currentColor"`, and has
 * no `strokeWidth` prop. A few call sites were adjusted accordingly.
 */
export type { Icon as LucideIcon, IconProps } from '@phosphor-icons/react';
export { IconContext } from '@phosphor-icons/react';

export {
  // --- same name in both libraries ---
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bookmark,
  Calendar,
  Car,
  Check,
  Clock,
  Compass,
  Crown,
  Eye,
  Flag,
  Gauge,
  Heart,
  Info,
  List,
  ListChecks,
  Lock,
  Palette,
  Phone,
  PlusCircle,
  SlidersHorizontal,
  Star,
  Truck,
  User,
  UserPlus,
  Users,
  Wrench,
  X,
  FileText,
  ArrowUp,
  Key,
  Megaphone,
  Newspaper,
  ShieldCheck,
  Tag,

  // --- renamed to the Phosphor equivalent ---
  House as Home,
  Buildings as Building2,
  Bed as BedDouble,
  Bathtub as Bath,
  GasPump as Fuel,
  Couch as Sofa,
  Tree as Trees,
  Bicycle as Bike,
  Package as Box,
  Medal as Award,
  SealCheck as BadgeCheck,
  CurrencyCircleDollar as BadgeDollarSign,
  PencilSimple as Edit3,
  FacebookLogo as Facebook,
  FilePlus as FilePlus2,
  FileMagnifyingGlass as FileSearch,
  Fire as Flame,
  ArrowsLeftRight as GitCompare,
  Globe as Globe2,
  Key as KeyRound,
  Stack as Layers,
  SquaresFour as LayoutDashboard,
  GridFour as LayoutGrid,
  SignIn as LogIn,
  SignOut as LogOut,
  Envelope as Mail,
  MapTrifold as Map,
  MapPin,
  ArrowsOut as Maximize2,
  List as Menu,
  ChatCircle as MessageCircle,
  ChatText as MessageSquare,
  ArrowsClockwise as RefreshCcw,
  MagnifyingGlass as Search,
  PaperPlaneTilt as Send,
  GearSix as Settings2,
  Sparkle as Sparkles,
  Trash as Trash2,
  CloudArrowUp as UploadCloud,
  Lightning as Zap,
  CaretDown as ChevronDown,
  CaretLeft as ChevronLeft,
  CaretRight as ChevronRight,
  CheckCircle as CheckCircle2,
  Buildings as Building,
  Headset as Headphones,
  ArrowsClockwise as RefreshCw,
  GearSix as Settings,
  ShareNetwork as Share2,
  DeviceMobile as Smartphone,
  YoutubeLogo as Youtube,
} from '@phosphor-icons/react';
