import React from "react";
import Link from "next/link";
import type { Thread, Category } from "@/types/types";

interface ThreadListProps {
  threads: Thread[];
  categories: Category[];
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onCategoryChange: (categoryId: string | null) => void;
  selectedCategory: string | null; // この行を追加
}

export default function ThreadList({
  threads,
  categories,
  page,
  totalPages,
  onPageChange,
  onCategoryChange,
  selectedCategory, // この行を追加
}: ThreadListProps) {
  return (
    <div className="space-y-6">
      <div className="bg-background p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-foreground">カテゴリ</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === null
                ? "bg-primary text-background"
                : "border border-primary text-primary hover:bg-primary hover:text-background"
            } transition-colors`}
          >
            全て
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category.id
                  ? "bg-primary text-background"
                  : "border border-primary text-primary hover:bg-primary hover:text-background"
              } transition-colors`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-4">
        {threads.map((thread) => (
          <li key={thread.id} className="bg-background p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Link href={`/thread/${thread.id}`} className="block">
              <h3 className="text-lg font-semibold text-primary hover:text-primary-dark transition-colors">
                {thread.title}
              </h3>
              <p className="text-sm text-muted mt-2">
                最終更新: {new Date(thread.updated_at).toLocaleString()}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-primary text-background rounded-md disabled:bg-muted disabled:text-foreground transition-colors"
        >
          前のページ
        </button>
        <span className="px-4 py-2 bg-background text-foreground rounded-md">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-primary text-background rounded-md disabled:bg-muted disabled:text-foreground transition-colors"
        >
          次のページ
        </button>
      </div>
    </div>
  );
}
