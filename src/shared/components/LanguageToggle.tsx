import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  if (isArabic) {
    document.documentElement.dir = "rtl";
  } else {
    document.documentElement.dir = "ltr";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {isArabic ? <span>AR</span> : <span>EN</span>}
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={i18n.language === "ar" ? "start" : "end"}>
        <DropdownMenuItem onClick={() => i18n.changeLanguage("ar")}>
          العربية
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
