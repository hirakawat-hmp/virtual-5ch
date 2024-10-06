"use client";
import React, { useState, useEffect, useCallback } from "react";
import type { Post } from "@/types/types";
import PostList from "@/components/PostList";
import PostForm from "@/components/PostForm";
import { supabase } from "@/lib/supabase";

interface ThreadDetailProps {
  threadId: string;
}

async function getPosts(threadId: string, page: number) {
  const limit = 15; // 1ページあたりの投稿数

  if (!threadId) {
    throw new Error("threadId is required");
  }

  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const {
      data: posts, error, count
    } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .range(from, to);

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      posts,
      currentPage: page,
      totalPages,
      totalPosts: count?count:0,
    };
  }catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("投稿の取得に失敗しました。");
  }
}

export default function ThreadDetail({ threadId }: ThreadDetailProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const data = await getPosts(threadId, page);
        setPosts(data.posts as unknown as Post[]);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalPosts(data.totalPosts);
      }catch (error) {
        console.error("Error fetching posts:", error);
        setError("投稿の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    },
    [threadId]
  );

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handlePageChange = (page: number) => {
    fetchPosts(page);
  };

  const handlePostCreated = async () => {
    // 新しい総投稿数を計算
    const newTotalPosts = totalPosts + 1;
    setTotalPosts(newTotalPosts);

    // 新しい総ページ数を計算
    const newTotalPages = Math.ceil(newTotalPosts / 15); // 15は1ページあたりの投稿数
    setTotalPages(newTotalPages);

    // 最新のページ（新しい投稿を含むページ）を取得
    await fetchPosts(newTotalPages);

    // 最新のページに自動的に移動
    setCurrentPage(newTotalPages);
  };

  if (isLoading) return <p className="text-center text-muted">読み込み中...</p>;
  if (error) return <p className="text-center text-error">{error}</p>;

  return (
    <div className="space-y-8">
      <div className="bg-background p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-foreground mb-4">スレッド詳細</h1>
        <p className="text-muted">
          総投稿数: {totalPosts} | ページ: {currentPage} / {totalPages}
        </p>
      </div>

      <PostList
        posts={posts}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <div className="bg-background p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-foreground mb-4">新規投稿</h2>
        <PostForm
          threadId={threadId}
          onPostCreated={handlePostCreated}
          onError={setError}
        />
      </div>
    </div>
  );
}
