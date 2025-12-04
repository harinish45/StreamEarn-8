
import Link from 'next/link';
import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  path: BreadcrumbItem[];
}

export function Breadcrumbs({ path }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {path.map((item, index) => (
          <Fragment key={item.name}>
            <li>
              <Link href={item.href} className="hover:text-foreground">
                {item.name}
              </Link>
            </li>
            {index < path.length - 1 && (
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
