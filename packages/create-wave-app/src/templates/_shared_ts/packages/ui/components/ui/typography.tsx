import * as React from "react";

import { cn } from "@ui/lib/utils";

export interface TypographyHeadingProps
  extends React.HTMLProps<HTMLHeadingElement> {}

export function TypographyH1({ className, ...props }: TypographyHeadingProps) {
  return (
    <h1
      className={cn(
        "text-5xl md:text-6xl lg:text-7xl",
        "scroll-m-20 font-extrabold tracking-tight font-sans",
        className
      )}
      {...props}
    />
  );
}

export function TypographyH2({ className, ...props }: TypographyHeadingProps) {
  return (
    <h2
      className={cn(
        "text-4xl md:text-5xl lg:text-6xl font-sans",
        "scroll-m-20 text-3xl font-extrabold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  );
}

export function TypographyH3({ className, ...props }: TypographyHeadingProps) {
  return (
    <h3
      className={cn(
        "text-3xl md:text-4xl lg:text-5xl font-sans",
        "scroll-m-20 text-2xl font-extrabold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function TypographyH4({ className, ...props }: TypographyHeadingProps) {
  return (
    <h4
      className={cn(
        "text-xl md:text-2xl lg:text-3xl font-sans",
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function TypographyH5({ className, ...props }: TypographyHeadingProps) {
  return (
    <h5
      className={cn(
        "text-md md:text-xl lg:text-2xl font-sans",
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function TypographyH6({ className, ...props }: TypographyHeadingProps) {
  return (
    <h6
      className={cn(
        "text-md md:text-lg lg:text-xl font-body",
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export interface TypographyParagraphProps
  extends React.HTMLProps<HTMLParagraphElement> {}

export function TypographyP({ className, ...props }: TypographyParagraphProps) {
  return (
    <p className={cn("text-md leading-7 font-body", className)} {...props} />
  );
}

export interface TypographyBlockquoteProps
  extends React.HTMLProps<HTMLQuoteElement> {}

export function TypographyBlockquote({
  className,
  ...props
}: TypographyBlockquoteProps) {
  return (
    <blockquote
      className={cn("border-l-2 pl-6 italic", className)}
      {...props}
    />
  );
}

export interface TypographyListProps
  extends React.HTMLProps<HTMLUListElement> {}

export function TypographyUnorderedList({
  className,
  ...props
}: TypographyListProps) {
  return (
    <ul className={cn("ml-6 list-disc [&>li]:mt-2", className)} {...props} />
  );
}

export function TypographyInlineCode() {
  return (
    <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
      @vastly/ui
    </code>
  );
}
