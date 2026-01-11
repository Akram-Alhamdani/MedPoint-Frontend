import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type { SectionCardsProps } from "../../types";

export function SectionCards({ cards }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6  @lg/main:grid-cols-2 @3xl/main:grid-cols-3 @7xl/main:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.trend > 0 ? IconTrendingUp : IconTrendingDown;
        return (
          <Card key={index} className="@container/card">
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              <CardAction>
                <Badge
                  variant="outline"
                  className={`${
                    card.trend > 0
                      ? "text-green-300 border-green-300"
                      : "text-destructive border-destructive"
                  } `}
                >
                  <Icon /> {card.trend}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.description}{" "}
                <Icon
                  className={`${
                    card.trend > 0
                      ? "text-green-300 border-green-300"
                      : "text-destructive border-destructive"
                  } size-4 `}
                />
              </div>
              <div className="text-muted-foreground">{card.caption}</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
