"use client";

import Navbar from "@/components/navbar";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { queryFeeds } from "./services/api";
import { Card, CardContent } from "@/components/ui/card";
import FeedCreate from "./components/create";

function Feed() {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["feeds", { limit: 10 }],
      queryFn: queryFeeds,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        return lastPage.lastPage < lastPage.page
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

  return (
    <div className="mt-14 px-4">
      <Navbar>Feed</Navbar>
      <ul className="space-y-4 py-6 ">
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.posts.map((feed) => (
              <li key={feed.id}>
                <Card>
                  <CardContent>
                    <p>{feed.content}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
      {isFetchingNextPage && <p>Loading more...</p>}
      {!hasNextPage && (
        <p className="text-gray-500 text-center text-lg">No more items</p>
      )}
      <div ref={loaderRef} className="h-10" />
      <div className="fixed bottom-4 right-4">
        <FeedCreate onSuccessPost={() => {}} />
      </div>
    </div>
  );
}

export default Feed;
