
'use client';

import {
  Type,
  MousePointerClick,
  Headphones,
  Mic,
  BookOpen,
  UserCheck,
  FlaskConical,
  MessageSquare,
  FileText,
  ClipboardList,
  GraduationCap,
  BriefcaseBusiness,
  Languages,
  School,
  Home,
  Palette,
  Bug,
  Users,
  Share2,
  Youtube,
  Instagram,
  BrainCircuit,
  Paintbrush,
  Book,
  Bot,
  CircleDollarSign,
  TrendingUp,
  Landmark,
  Shield,
  Printer,
  Package,
  Laptop,
  Camera,
  Store,
  Wifi,
  Tag,
  PenTool,
  Wallet,
  Clock,
  Pin,
  LucideProps,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Type,
  MousePointerClick,
  Headphones,
  Mic,
  BookOpen,
  UserCheck,
  FlaskConical,
  MessageSquare,
  FileText,
  ClipboardList,
  GraduationCap,
  BriefcaseBusiness,
  Languages,
  School,
  Home,
  Palette,
  Bug,
  Users,
  Share2,
  Youtube,
  Instagram,
  BrainCircuit,
  Paintbrush,
  Book,
  Bot,
  CircleDollarSign,
  TrendingUp,
  Landmark,
  Shield,
  Printer,
  Package,
  Laptop,
  Camera,
  Store,
  Wifi,
  Tag,
  PenTool,
  Wallet,
  Clock,
  Pin,
};

interface IconProps extends LucideProps {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  const LucideIconComponent = iconMap[name];
  if (!LucideIconComponent) {
    return null; // Or return a default icon
  }
  return <LucideIconComponent {...props} />;
}

    