export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campgrounds: {
        Row: {
          address_1: string | null
          address_2: string | null
          campground_name: string | null
          city: string | null
          created_at: string
          email: string | null
          gps_coordinates: string | null
          id: number
          phone: string | null
          state: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address_1?: string | null
          address_2?: string | null
          campground_name?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          gps_coordinates?: string | null
          id?: number
          phone?: string | null
          state?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address_1?: string | null
          address_2?: string | null
          campground_name?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          gps_coordinates?: string | null
          id?: number
          phone?: string | null
          state?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      data_2025: {
        Row: {
          clutch: string | null
          colors: string | null
          created_at: string
          curb_weight: string | null
          current_value: number | null
          engine_type: string | null
          front_brakes: string | null
          front_suspension: string | null
          front_tire: string | null
          fuel_capacity: string | null
          ground_clearance: string | null
          height: string | null
          id: number
          image_url: string | null
          length: string | null
          make: string | null
          model: string | null
          msrp: number | null
          rake: string | null
          rear_brakes: string | null
          rear_suspension: string | null
          rear_tire: string | null
          seat_height: string | null
          trail: string | null
          transmission: string | null
          updated_at: string | null
          wheelbase: string | null
          width: string | null
          year: string | null
        }
        Insert: {
          clutch?: string | null
          colors?: string | null
          created_at?: string
          curb_weight?: string | null
          current_value?: number | null
          engine_type?: string | null
          front_brakes?: string | null
          front_suspension?: string | null
          front_tire?: string | null
          fuel_capacity?: string | null
          ground_clearance?: string | null
          height?: string | null
          id?: number
          image_url?: string | null
          length?: string | null
          make?: string | null
          model?: string | null
          msrp?: number | null
          rake?: string | null
          rear_brakes?: string | null
          rear_suspension?: string | null
          rear_tire?: string | null
          seat_height?: string | null
          trail?: string | null
          transmission?: string | null
          updated_at?: string | null
          wheelbase?: string | null
          width?: string | null
          year?: string | null
        }
        Update: {
          clutch?: string | null
          colors?: string | null
          created_at?: string
          curb_weight?: string | null
          current_value?: number | null
          engine_type?: string | null
          front_brakes?: string | null
          front_suspension?: string | null
          front_tire?: string | null
          fuel_capacity?: string | null
          ground_clearance?: string | null
          height?: string | null
          id?: number
          image_url?: string | null
          length?: string | null
          make?: string | null
          model?: string | null
          msrp?: number | null
          rake?: string | null
          rear_brakes?: string | null
          rear_suspension?: string | null
          rear_tire?: string | null
          seat_height?: string | null
          trail?: string | null
          transmission?: string | null
          updated_at?: string | null
          wheelbase?: string | null
          width?: string | null
          year?: string | null
        }
        Relationships: []
      }
      gear: {
        Row: {
          created_at: string | null
          id: number
          link: string | null
          price: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          link?: string | null
          price?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          link?: string | null
          price?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          stripe_customer_id: string | null
          subscription_id: string | null
          subscription_period_end: string | null
          subscription_status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          stripe_customer_id?: string | null
          subscription_id?: string | null
          subscription_period_end?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          stripe_customer_id?: string | null
          subscription_id?: string | null
          subscription_period_end?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      roads: {
        Row: {
          description: string
          id: number
          image: string | null
          miles: string | null
          name: string
          state: string | null
          url: string | null
        }
        Insert: {
          description: string
          id?: number
          image?: string | null
          miles?: string | null
          name: string
          state?: string | null
          url?: string | null
        }
        Update: {
          description?: string
          id?: number
          image?: string | null
          miles?: string | null
          name?: string
          state?: string | null
          url?: string | null
        }
        Relationships: []
      }
      route_points: {
        Row: {
          address: string | null
          amenities: Database["public"]["Enums"]["campsite_amenity"][] | null
          attraction_type: string | null
          camping_type: string | null
          city: string | null
          created_at: string
          email: string | null
          id: string
          latitude: number
          lodging_type: string | null
          longitude: number
          name: string
          phone: string | null
          point_type: string
          price_level: number | null
          rating: number | null
          restaurant_type: string | null
          review_count: number | null
          state: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          amenities?: Database["public"]["Enums"]["campsite_amenity"][] | null
          attraction_type?: string | null
          camping_type?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          latitude: number
          lodging_type?: string | null
          longitude: number
          name: string
          phone?: string | null
          point_type: string
          price_level?: number | null
          rating?: number | null
          restaurant_type?: string | null
          review_count?: number | null
          state?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          amenities?: Database["public"]["Enums"]["campsite_amenity"][] | null
          attraction_type?: string | null
          camping_type?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          latitude?: number
          lodging_type?: string | null
          longitude?: number
          name?: string
          phone?: string | null
          point_type?: string
          price_level?: number | null
          rating?: number | null
          restaurant_type?: string | null
          review_count?: number | null
          state?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      routes: {
        Row: {
          created_at: string | null
          id: number
          link: string | null
          location: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          link?: string | null
          location?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          link?: string | null
          location?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scenic_byways: {
        Row: {
          byway_name: string
          description: string | null
          designation: string
          length_miles: string | null
          state: string
        }
        Insert: {
          byway_name: string
          description?: string | null
          designation: string
          length_miles?: string | null
          state: string
        }
        Update: {
          byway_name?: string
          description?: string | null
          designation?: string
          length_miles?: string | null
          state?: string
        }
        Relationships: []
      }
      service_records: {
        Row: {
          cost: number | null
          created_at: string
          id: string
          mileage: number | null
          next_service_date: string | null
          notes: string | null
          service_date: string
          service_type: Database["public"]["Enums"]["service_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          id?: string
          mileage?: number | null
          next_service_date?: string | null
          notes?: string | null
          service_date: string
          service_type: Database["public"]["Enums"]["service_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          id?: string
          mileage?: number | null
          next_service_date?: string | null
          notes?: string | null
          service_date?: string
          service_type?: Database["public"]["Enums"]["service_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          period_end: string | null
          period_start: string | null
          price_id: string
          status: string
          subscription_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          price_id: string
          status: string
          subscription_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          price_id?: string
          status?: string
          subscription_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tents: {
        Row: {
          amazon_url: string
          description: string
          id: number
          image_url: string | null
          tent_name: string
        }
        Insert: {
          amazon_url: string
          description: string
          id?: number
          image_url?: string | null
          tent_name: string
        }
        Update: {
          amazon_url?: string
          description?: string
          id?: number
          image_url?: string | null
          tent_name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      campsite_amenity:
        | "water_hookup"
        | "electric_hookup"
        | "sewer_hookup"
        | "wifi"
        | "showers"
        | "restrooms"
        | "laundry"
        | "camp_store"
        | "hiking_trails"
        | "lake_access"
        | "rv_dump_station"
        | "pet_friendly"
        | "playground"
        | "fire_rings"
        | "picnic_tables"
      service_type:
        | "oil_change"
        | "tire_replacement"
        | "brake_service"
        | "chain_maintenance"
        | "general_maintenance"
        | "repair"
        | "inspection"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
