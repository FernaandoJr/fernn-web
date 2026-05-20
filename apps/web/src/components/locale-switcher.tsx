"use client";

import { useCallback, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  localeFlagSrc,
  localeLabels,
  locales,
  LOCALE_COOKIE,
  type Locale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

function LocaleFlag({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={localeFlagSrc[locale]}
      alt=""
      width={20}
      height={15}
      className={cn("h-3.5 w-5 shrink-0 rounded-[2px] object-cover", className)}
      decoding="async"
    />
  );
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();

  const setLocale = useCallback(
    (next: string) => {
      if (next === locale) return;
      document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
      startTransition(() => {
        router.refresh();
      });
    },
    [locale, router],
  );

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          className={cn("gap-2", className)}
          aria-label={t("a11y.selectLanguage")}
        >
          <LocaleFlag locale={locale} />
          <span>{localeLabels[locale]}</span>
          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuRadioGroup value={locale} onValueChange={setLocale}>
          {locales.map((code) => (
            <DropdownMenuRadioItem key={code} value={code}>
              <LocaleFlag locale={code} />
              {localeLabels[code]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
