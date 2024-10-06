export interface Category {
    id: string;
    name: string;
    description: string;
  }
  
  export interface Thread {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
    category_id: string;
  }
  
  export interface Post {
    id: string;
    thread_id: string;
    content: string;
    created_at: string;
    user_name?: string;
    user_trip?: string;
    // is_ai_generated: boolean;
  }
  