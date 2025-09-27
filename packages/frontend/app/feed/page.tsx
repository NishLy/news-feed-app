"use client";

import Navbar from "@/components/navbar";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { queryFeeds } from "./services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FeedCreate from "./components/create";
import FollowCreate from "./components/follow-create";
import { Skeleton } from "@/components/ui/skeleton";
import { getRelativeTime } from "@/lib/time";

function Feed() {
  const queryClient = useQueryClient();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["feeds", { limit: 10 }],
      queryFn: queryFeeds,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        return lastPage.lastPage <= lastPage.page
          ? undefined
          : lastPage.page + 1;
      },
    });

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const refetchFromStart = () => {
    queryClient.removeQueries({ queryKey: ["feeds"] });
    refetch();
  };

  return (
    <div className="mt-14 px-4">
      <Navbar>
        Feeds
        <FollowCreate />
      </Navbar>
      <ul className="space-y-4 py-6 ">
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.posts.map((feed) => (
              <li key={feed.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>@{feed.user?.username}</CardTitle>
                    <CardDescription>
                      {getRelativeTime(feed.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap break-words">
                      {feed.content}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
      {isFetchingNextPage && (
        <>
          <Skeleton className="h-[125px] w-full rounded-md border-white/10 border-2" />
          <Skeleton className="h-[125px] w-full rounded-md border-white/10 border-2" />
          <Skeleton className="h-[125px] w-full rounded-md border-white/10 border-2" />
        </>
      )}
      {!hasNextPage && !isFetchingNextPage && (
        <p className="text-gray-500 text-center text-lg">No more items</p>
      )}
      <div ref={loaderRef} className="h-10" />
      <div className="fixed bottom-4 right-4">
        <FeedCreate onSuccessPost={refetchFromStart} />
      </div>
    </div>
  );
}

export default Feed;
