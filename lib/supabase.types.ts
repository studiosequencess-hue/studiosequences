export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5'
  }
  public: {
    Tables: {
      collection_projects: {
        Row: {
          collection_id: number | null
          created_at: string
          id: number
          project_id: number | null
        }
        Insert: {
          collection_id?: number | null
          created_at?: string
          id?: number
          project_id?: number | null
        }
        Update: {
          collection_id?: number | null
          created_at?: string
          id?: number
          project_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'collection_projects_collection_id_fkey'
            columns: ['collection_id']
            isOneToOne: false
            referencedRelation: 'collections'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'collection_projects_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          id: number
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'collections_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      post_comments: {
        Row: {
          content: string | null
          created_at: string
          id: number
          post_id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          post_id: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          post_id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'post_comments_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'post_comments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      post_files: {
        Row: {
          created_at: string
          id: number
          name: string
          post_id: number
          type: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          post_id: number
          type?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          post_id?: number
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'post_files_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: number
          post_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          post_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'post_likes_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'post_likes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      post_projects: {
        Row: {
          created_at: string
          id: number
          post_id: number
          project_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          post_id: number
          project_id: number
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'post_projects_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'post_projects_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      post_reposts: {
        Row: {
          created_at: string
          id: number
          post_id: number
          repost_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          post_id: number
          repost_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number
          repost_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'post_reposts_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'post_reposts_repost_id_fkey'
            columns: ['repost_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          id: number
          likes_count: number
          updated_at: string | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          id?: number
          likes_count?: number
          updated_at?: string | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          id?: number
          likes_count?: number
          updated_at?: string | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'posts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      project_files: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          project_id: number
          title: string | null
          type: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          project_id: number
          title?: string | null
          type: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          project_id?: number
          title?: string | null
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'project_images_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      project_members: {
        Row: {
          created_at: string
          department: string
          id: number
          project_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          department: string
          id?: number
          project_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string
          id?: number
          project_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'project_members_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'project_members_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_sensitive: boolean | null
          position: number | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_sensitive?: boolean | null
          position?: number | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_sensitive?: boolean | null
          position?: number | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'projects_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      user_post_bookmarks: {
        Row: {
          created_at: string
          id: number
          post_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          post_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_post_bookmarks_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_post_bookmarks_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          about: string | null
          avatar: string | null
          background_bottom: string | null
          background_top: string | null
          company_name: string | null
          contact: string | null
          email: string
          facebook: string | null
          first_name: string | null
          id: string
          instagram: string | null
          is_open_to_work: boolean
          is_verified: boolean | null
          last_name: string | null
          linkedin: string | null
          location: string | null
          occupation: string | null
          pronoun: string | null
          role: string
          twitter: string | null
          username: string
        }
        Insert: {
          about?: string | null
          avatar?: string | null
          background_bottom?: string | null
          background_top?: string | null
          company_name?: string | null
          contact?: string | null
          email: string
          facebook?: string | null
          first_name?: string | null
          id: string
          instagram?: string | null
          is_open_to_work: boolean
          is_verified?: boolean | null
          last_name?: string | null
          linkedin?: string | null
          location?: string | null
          occupation?: string | null
          pronoun?: string | null
          role: string
          twitter?: string | null
          username: string
        }
        Update: {
          about?: string | null
          avatar?: string | null
          background_bottom?: string | null
          background_top?: string | null
          company_name?: string | null
          contact?: string | null
          email?: string
          facebook?: string | null
          first_name?: string | null
          id?: string
          instagram?: string | null
          is_open_to_work?: boolean
          is_verified?: boolean | null
          last_name?: string | null
          linkedin?: string | null
          location?: string | null
          occupation?: string | null
          pronoun?: string | null
          role?: string
          twitter?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_post_like: {
        Args: { p_is_liked: boolean; p_post_id: number; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
