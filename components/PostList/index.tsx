import React from "react";
import type { Post } from "@/types/types";

interface PostListProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PostList({
  posts,
  currentPage,
  totalPages,
  onPageChange,
}: PostListProps) {

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-background p-4 rounded-lg shadow-md dark:border dark:border-gray-500">
          <div className="flex justify-between items-start mb-2">
            <div>
              {post.user_name ? (
                <span className="font-semibold text-primary">
                  {post.user_name}
                </span>
              ) : (
                <span className="text-muted">名無しさんこんにちは</span>
              )}
              {post.user_trip && (
                <span className="ml-2 text-sm text-secondary">
                  ◆{post.user_trip}
                </span>
              )}
            </div>
            <span className="text-sm text-muted">
            {new Date(post.created_at).toLocaleString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
          <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
        </div>
      ))}

      {/* Pagination UI */}
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-primary text-background rounded-md disabled:bg-muted disabled:text-foreground transition-colors"
        >
          前のページ
        </button>
        <span className="px-4 py-2 bg-background text-foreground rounded-md border border-border">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-primary text-background rounded-md disabled:bg-muted disabled:text-foreground transition-colors"
        >
          次のページ
        </button>
      </div>
    </div>
  );
}
