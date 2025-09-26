"use client";

import Navbar from "@/components/navbar";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { queryFeeds } from "./services/api";

function Feed() {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["feeds", { limit: 10 }],
      queryFn: queryFeeds,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        return lastPage.lastPage ? undefined : lastPage.page + 1;
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
      <ul>
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.posts.map((feed) => (
              <li key={feed.id}>
                <p>{feed.content}</p>
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
      <div ref={loaderRef} className="h-10" />
      {isFetchingNextPage && <p>Loading more...</p>}
      {!hasNextPage && <p className="text-gray-500">No more items</p>}
    </div>
  );
}

export default Feed;
