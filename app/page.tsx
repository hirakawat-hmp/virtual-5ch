"use client";
import React, { useState, useEffect, useCallback } from "react";
import type { Thread, Category } from "@/types/types";
import ThreadList from "@/components/ThreadList";
import ThreadForm from "@/components/ThreadForm";
import { supabase } from "@/lib/supabase";

async function getCategory(){
  const { data: categories, error } = await supabase.from("categories").select("*");
  if (error) {
    throw error;
  }
  return categories;
}

async function getThread({page, categoryId}: {page: number, categoryId: string | null}){
  const limit = 10;
  let query = supabase
    .from("threads")
    .select("*, categories(name)", { count: "exact" })
    .order("updated_at", { ascending: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: threads, error, count } = await query.range(from, to);

  if (error) throw error;

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    threads,
    currentPage: page,
    totalPages,
    totalThreads: count,
  };
}

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try{
      const data = await getThread({page, categoryId: selectedCategory});
      setThreads(data.threads as unknown as Thread[]);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching threads:", error);
      setError("スレッドの取得に失敗しました。");
    }
    setIsLoading(false);
  }, [page, selectedCategory]);

  const fetchCategories = useCallback(async () => {
    try{
      const data = await getCategory();
      setCategories(data as unknown as Category[]);
    }catch (error) {
      console.error("Error fetching categories:", error);
      setError("カテゴリの取得に失敗しました。");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setPage(1); // カテゴリが変更されたら、ページを1に戻す
  };

  const handleThreadCreated = async (newThread: Thread) => {
    setThreads((prevThreads) => [newThread, ...prevThreads]);
    // 新しいスレッドが作成されたら、最新のスレッドリストを再取得
    await fetchThreads();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (isLoading && threads.length === 0) return <p>読み込み中...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">スレッド一覧</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ThreadList
        threads={threads}
        categories={categories}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />
      <ThreadForm
        categories={categories}
        onThreadCreated={handleThreadCreated}
        onError={handleError}
      />
    </div>
  );
}
