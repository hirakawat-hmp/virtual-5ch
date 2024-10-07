import React, { useState } from "react";
import type { Post } from "@/types/types";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
// import { toZonedTime } from "date-fns-tz";

interface PostFormProps {
  threadId: string;
  onPostCreated: (newPost: Post) => void;
  onError: (error: string) => void;
}

async function generateTrip(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));
  return hashBase64.slice(0, 8);
}

async function post(
  threadId: string,
  content: string,
  userName: string | null,
  userTrip: string | null
): Promise<Post>{
  try{
    if (!threadId || !content.trim()) {
      throw new Error("threadId と content は必須です。");
    }

    const now = new Date();
    const formattedTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

    const generatedTrip = userTrip ? await generateTrip(userTrip) : undefined;

    const newPost = {
      thread_id: threadId,
      content: content.trim(),
      user_name: userName?.trim() || '名無しさん',
      user_trip: generatedTrip || '',
      created_at: formattedTime,
    };

    const { data, error } = await supabase.rpc('create_post_and_update_thread', {
      p_thread_id: threadId,
      p_content: newPost.content,
      p_user_name: newPost.user_name,
      p_user_trip: newPost.user_trip,
      p_created_at: newPost.created_at
    });

    if (error) throw error;
    console.log(data);
    // データの型を確認し、必要なプロパティを持っているか検証
    if (
        typeof data === 'object' &&
        data !== null &&
        'id' in data &&
        'thread_id' in data &&
        'content' in data &&
        'user_name' in data &&
        'user_trip' in data &&
        'created_at' in data
      ) {
        // Post 型に合わせてデータを整形
        const post: Post = {
          id: data.id as string,
          thread_id: data.thread_id as string,
          content: data.content as string,
          user_name: data.user_name as string,
          user_trip: data.user_trip as string,
          created_at: data.created_at as string
        };
        return post;
      } else {
        throw new Error("返されたデータが期待する形式ではありません。");
      }
  }catch(error){
    console.error("Error submitting post:", error);
    throw new Error("投稿の送信に失敗しました。");
  }
}

export default function PostForm({
  threadId,
  onPostCreated,
  onError,
}: PostFormProps) {
  const [content, setContent] = useState("");
  const [userName, setUserName] = useState("");
  const [userTrip, setUserTrip] = useState("");

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadId || !content.trim()) return;

    try{
      const data = await post(threadId, content, userName, userTrip);
      onPostCreated(data);
      setContent("");
      setUserName("");
      setUserTrip("");
    }catch(error){
      console.log("投稿の送信に失敗しました。", error);
      onError("投稿の送信に失敗しました。");
    }
  };

  return (
    <form onSubmit={handleSubmitPost} className="space-y-4">
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-foreground mb-1"
        >
          投稿内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
          rows={4}
          placeholder="投稿内容を入力..."
          required
        />
      </div>
      <div>
        <label
          htmlFor="userName"
          className="block text-sm font-medium text-foreground mb-1"
        >
          名前 (任意)
        </label>
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
          placeholder="名前を入力..."
        />
      </div>
      <div>
        <label
          htmlFor="userTrip"
          className="block text-sm font-medium text-foreground mb-1"
        >
          トリップ (任意)
        </label>
        <input
          type="text"
          id="userTrip"
          value={userTrip}
          onChange={(e) => setUserTrip(e.target.value)}
          className="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
          placeholder="トリップを入力..."
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-primary text-background rounded-md hover:bg-primary-dark transition-colors"
      >
        投稿する
      </button>
    </form>
  );
}
