import React, { useState } from "react";
import type { Category, Thread } from "@/types/types";
import { supabase } from "@/lib/supabase";

interface ThreadFormProps {
  categories: Category[];
  onThreadCreated: (newThread: Thread) => void;
  onError: (error: string) => void;
}

async function post(title: string, category_id: string) {
  try {
    if (!title.trim() || !category_id) {
      throw new Error("スレッドタイトルとカテゴリは必須です。");
    }

    const { data, error } = await supabase
      .from("threads")
      .insert({ title: title.trim(), category_id })
      .select()
      .single();

    if (error) throw error;

    return data;
  }catch(error){
    console.error("Error creating thread:", error);
    throw new Error("スレッドの作成に失敗しました。");
  }
}

export default function ThreadForm({
  categories,
  onThreadCreated,
  onError,
}: ThreadFormProps) {
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !selectedCategory) {
      onError("スレッドタイトルとカテゴリを入力してください。");
      return;
    }

    try{
      const data = await post(newThreadTitle, selectedCategory);
      onThreadCreated(data as Thread);
      setNewThreadTitle("");
      setSelectedCategory("");
    }catch(error){
      console.error("Error creating thread:", error);
      onError("スレッドの作成に失敗しました。");
    }
  };

  return (
    <form
      onSubmit={handleCreateThread}
      className="mt-8 p-6 bg-background rounded-lg shadow-md"
    >
      <h3 className="text-xl font-semibold mb-4 text-foreground">
        新規スレッド作成
      </h3>
      <div className="mb-4">
        <label
          htmlFor="threadTitle"
          className="block text-sm font-medium text-muted mb-2"
        >
          スレッドタイトル
        </label>
        <input
          type="text"
          id="threadTitle"
          value={newThreadTitle}
          placeholder="スレッドタイトルを入力..."
          onChange={(e) => setNewThreadTitle(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-muted mb-2"
        >
          カテゴリ
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="" className="text-muted">
            カテゴリを選択してください
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-primary text-background rounded-md hover:bg-primary-dark transition-colors"
      >
        スレッドを作成
      </button>
    </form>
  );
}
