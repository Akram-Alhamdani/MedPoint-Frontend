import { Card, CardContent } from "@/shared/components/ui/card";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";

import { useReviews } from "../hooks";
import { IconStar, IconDots } from "@tabler/icons-react";
import type { Review, ReviewComment } from "../api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";

export default function ReviewsPage() {
  const { data: reviews } = useReviews(1, 10);

  return (
    <div className="w-full min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {reviews?.results.map((review: Review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.patient.user.image} />
            <AvatarFallback>
              {review.patient.user.full_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-2 ml-auto">
                <span className="font-medium">
                  {review.patient.user.full_name}
                </span>
                <div className="flex gap-1 text-yellow-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <IconStar key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded-full hover:bg-accent focus:outline-none ml-2 mr-4">
                    <IconDots size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm">{review.content}</p>
          </div>
        </div>

        {/* Reply */}
        {review.comments.length === 0 ? null : (
          <div className="mr-16 ml-14 border-2 shadow-md pl-4 space-y-2 border-accent p-4 rounded-lg">
            <div className="flex-col items-center justify-between space-y-4">
              {review.comments.map((comment) => ReplySection(comment))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReplySection(comment: ReviewComment) {
  return (
    <div>
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.user.image} />
          <AvatarFallback>
            {comment.user.full_name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2 ml-auto">
              <span className="font-medium">{comment.user.full_name}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-full hover:bg-accent focus:outline-none ml-2 mr-4">
                  <IconDots size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}
