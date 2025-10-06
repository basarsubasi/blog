export interface BlogPost {
  uuid: string;
  title: string;
  author: string;
  category: string;
  date_posted: string;
  slug: string;
  content_markdown?: string;
  content_html: string;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export interface Tag {
  uuid: string;
  name: string;
}

export interface AuthResponse {
  token: string;
}

export interface AuthCheckResponse {
  authenticated: boolean;
  user?: any;
}
