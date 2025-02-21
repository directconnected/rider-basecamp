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
      motorcycles: {
        Row: {
          created_at: string
          id: string
          make: string
          model: string
          msrp: number
          value: number
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          make: string
          model: string
          msrp?: number
          value: number
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          make?: string
          model?: string
          msrp?: number
          value?: number
          year?: number
        }
        Relationships: []
      }
      motorcycles_1: {
        Row: {
          "0-100 km/h (sec)": string | null
          "1/4 mil (sec)": string | null
          "60-140 km/h, highest gear (sec)": string | null
          "Alternate seat height (mm)": string | null
          "Bore x stroke (mm)": string | null
          "Carrying capacity": string | null
          Category: string | null
          Clutch: string | null
          "Color options": string | null
          Comments: string | null
          Compression: string | null
          "Cooling system": string | null
          "Displacement (cm3)": string | null
          Driveline: string | null
          "Dry weight (kg)": string | null
          Electrical: string | null
          "Emission details": string | null
          "Engine details": string | null
          "Engine type": string | null
          "Exhaust system": string | null
          "Factory warranty": string | null
          "Frame type": string | null
          "Front brakes": string | null
          "Front brakes diameter (mm)": string | null
          "Front percentage of weight": string | null
          "Front suspension": string | null
          "Front tyre": string | null
          "Front wheel travel (mm)": string | null
          "Fuel capacity (litres)": string | null
          "Fuel consumption (litres / 100 km)": string | null
          "Fuel control": string | null
          "Fuel system": string | null
          Gearbox: string | null
          "Greenhouse gases (CO2 g/km)": string | null
          "Ground clearance (mm)": string | null
          Ignition: string | null
          "Image URL": string | null
          Instruments: string | null
          Light: string | null
          "Lubrication system": string | null
          Make: string | null
          "Max RPM": string | null
          Model: string | null
          "Modifications compared to previous model": string | null
          motorcycle_id: number
          "Oil capacity (litres)": string | null
          "Overall height (mm)": string | null
          "Overall length (mm)": string | null
          "Overall width (mm)": string | null
          "Page URL": string | null
          "Power (PS)": string | null
          "Power (rpm)": string | null
          "Power/weight ratio (HP/kgP": string | null
          "Price as new (MSRP)": string | null
          "Rake (fork angle)": string | null
          Rating: string | null
          "Rear brakes": string | null
          "Rear brakes diameter (mm)": string | null
          "Rear percentage of weight": string | null
          "Rear suspension": string | null
          "Rear tyre": string | null
          "Rear wheel travel (mm)": string | null
          "Reserve fuel capacity (litres)": string | null
          Seat: string | null
          "Seat height (mm)": string | null
          Starter: string | null
          "Top speed (kmph)": string | null
          "Torque (Nm)": string | null
          "Torque (rpm)": string | null
          Trail: string | null
          "Transmission type, final drive": string | null
          "Valves per cylinder": string | null
          "Weight incl. oil, gas, etc (kg)": string | null
          "Wheelbase (mm)": string | null
          Wheels: string | null
          "Year of launch": string | null
        }
        Insert: {
          "0-100 km/h (sec)"?: string | null
          "1/4 mil (sec)"?: string | null
          "60-140 km/h, highest gear (sec)"?: string | null
          "Alternate seat height (mm)"?: string | null
          "Bore x stroke (mm)"?: string | null
          "Carrying capacity"?: string | null
          Category?: string | null
          Clutch?: string | null
          "Color options"?: string | null
          Comments?: string | null
          Compression?: string | null
          "Cooling system"?: string | null
          "Displacement (cm3)"?: string | null
          Driveline?: string | null
          "Dry weight (kg)"?: string | null
          Electrical?: string | null
          "Emission details"?: string | null
          "Engine details"?: string | null
          "Engine type"?: string | null
          "Exhaust system"?: string | null
          "Factory warranty"?: string | null
          "Frame type"?: string | null
          "Front brakes"?: string | null
          "Front brakes diameter (mm)"?: string | null
          "Front percentage of weight"?: string | null
          "Front suspension"?: string | null
          "Front tyre"?: string | null
          "Front wheel travel (mm)"?: string | null
          "Fuel capacity (litres)"?: string | null
          "Fuel consumption (litres / 100 km)"?: string | null
          "Fuel control"?: string | null
          "Fuel system"?: string | null
          Gearbox?: string | null
          "Greenhouse gases (CO2 g/km)"?: string | null
          "Ground clearance (mm)"?: string | null
          Ignition?: string | null
          "Image URL"?: string | null
          Instruments?: string | null
          Light?: string | null
          "Lubrication system"?: string | null
          Make?: string | null
          "Max RPM"?: string | null
          Model?: string | null
          "Modifications compared to previous model"?: string | null
          motorcycle_id?: number
          "Oil capacity (litres)"?: string | null
          "Overall height (mm)"?: string | null
          "Overall length (mm)"?: string | null
          "Overall width (mm)"?: string | null
          "Page URL"?: string | null
          "Power (PS)"?: string | null
          "Power (rpm)"?: string | null
          "Power/weight ratio (HP/kgP"?: string | null
          "Price as new (MSRP)"?: string | null
          "Rake (fork angle)"?: string | null
          Rating?: string | null
          "Rear brakes"?: string | null
          "Rear brakes diameter (mm)"?: string | null
          "Rear percentage of weight"?: string | null
          "Rear suspension"?: string | null
          "Rear tyre"?: string | null
          "Rear wheel travel (mm)"?: string | null
          "Reserve fuel capacity (litres)"?: string | null
          Seat?: string | null
          "Seat height (mm)"?: string | null
          Starter?: string | null
          "Top speed (kmph)"?: string | null
          "Torque (Nm)"?: string | null
          "Torque (rpm)"?: string | null
          Trail?: string | null
          "Transmission type, final drive"?: string | null
          "Valves per cylinder"?: string | null
          "Weight incl. oil, gas, etc (kg)"?: string | null
          "Wheelbase (mm)"?: string | null
          Wheels?: string | null
          "Year of launch"?: string | null
        }
        Update: {
          "0-100 km/h (sec)"?: string | null
          "1/4 mil (sec)"?: string | null
          "60-140 km/h, highest gear (sec)"?: string | null
          "Alternate seat height (mm)"?: string | null
          "Bore x stroke (mm)"?: string | null
          "Carrying capacity"?: string | null
          Category?: string | null
          Clutch?: string | null
          "Color options"?: string | null
          Comments?: string | null
          Compression?: string | null
          "Cooling system"?: string | null
          "Displacement (cm3)"?: string | null
          Driveline?: string | null
          "Dry weight (kg)"?: string | null
          Electrical?: string | null
          "Emission details"?: string | null
          "Engine details"?: string | null
          "Engine type"?: string | null
          "Exhaust system"?: string | null
          "Factory warranty"?: string | null
          "Frame type"?: string | null
          "Front brakes"?: string | null
          "Front brakes diameter (mm)"?: string | null
          "Front percentage of weight"?: string | null
          "Front suspension"?: string | null
          "Front tyre"?: string | null
          "Front wheel travel (mm)"?: string | null
          "Fuel capacity (litres)"?: string | null
          "Fuel consumption (litres / 100 km)"?: string | null
          "Fuel control"?: string | null
          "Fuel system"?: string | null
          Gearbox?: string | null
          "Greenhouse gases (CO2 g/km)"?: string | null
          "Ground clearance (mm)"?: string | null
          Ignition?: string | null
          "Image URL"?: string | null
          Instruments?: string | null
          Light?: string | null
          "Lubrication system"?: string | null
          Make?: string | null
          "Max RPM"?: string | null
          Model?: string | null
          "Modifications compared to previous model"?: string | null
          motorcycle_id?: number
          "Oil capacity (litres)"?: string | null
          "Overall height (mm)"?: string | null
          "Overall length (mm)"?: string | null
          "Overall width (mm)"?: string | null
          "Page URL"?: string | null
          "Power (PS)"?: string | null
          "Power (rpm)"?: string | null
          "Power/weight ratio (HP/kgP"?: string | null
          "Price as new (MSRP)"?: string | null
          "Rake (fork angle)"?: string | null
          Rating?: string | null
          "Rear brakes"?: string | null
          "Rear brakes diameter (mm)"?: string | null
          "Rear percentage of weight"?: string | null
          "Rear suspension"?: string | null
          "Rear tyre"?: string | null
          "Rear wheel travel (mm)"?: string | null
          "Reserve fuel capacity (litres)"?: string | null
          Seat?: string | null
          "Seat height (mm)"?: string | null
          Starter?: string | null
          "Top speed (kmph)"?: string | null
          "Torque (Nm)"?: string | null
          "Torque (rpm)"?: string | null
          Trail?: string | null
          "Transmission type, final drive"?: string | null
          "Valves per cylinder"?: string | null
          "Weight incl. oil, gas, etc (kg)"?: string | null
          "Wheelbase (mm)"?: string | null
          Wheels?: string | null
          "Year of launch"?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
