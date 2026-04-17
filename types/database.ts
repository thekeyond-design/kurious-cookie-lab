export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "baking"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled"

export type FulfillmentType =
  | "pickup"
  | "local_delivery"
  | "nc_shipping"
  | "national_shipping"

export type CookieGroup = "classic" | "seasonal" | "custom" | "limited"

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          slug: string
          name: string
          symbol: string
          atomic_number: number
          group: CookieGroup
          description: string
          price: number
          is_active: boolean
          is_unstable: boolean
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          slug: string
          name: string
          symbol: string
          atomic_number: number
          group: CookieGroup
          description: string
          price: number
          is_active?: boolean
          is_unstable?: boolean
          image_url?: string | null
        }
        Update: {
          slug?: string
          name?: string
          symbol?: string
          atomic_number?: number
          group?: CookieGroup
          description?: string
          price?: number
          is_active?: boolean
          is_unstable?: boolean
          image_url?: string | null
        }
        Relationships: []
      }

      orders: {
        Row: {
          id: string
          customer_id: string | null
          customer_name: string
          customer_email: string
          box_size: number
          fulfillment: FulfillmentType
          special_instructions: string | null
          status: OrderStatus
          subtotal: number
          shipping_fee: number
          total: number
          stripe_payment_intent_id: string | null
          stripe_checkout_session_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          customer_name: string
          customer_email: string
          box_size: number
          fulfillment: FulfillmentType
          subtotal: number
          shipping_fee: number
          total: number
          customer_id?: string | null
          special_instructions?: string | null
          status?: OrderStatus
          stripe_payment_intent_id?: string | null
          stripe_checkout_session_id?: string | null
        }
        Update: {
          customer_name?: string
          customer_email?: string
          box_size?: number
          fulfillment?: FulfillmentType
          subtotal?: number
          shipping_fee?: number
          total?: number
          customer_id?: string | null
          special_instructions?: string | null
          status?: OrderStatus
          stripe_payment_intent_id?: string | null
          stripe_checkout_session_id?: string | null
        }
        Relationships: []
      }

      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          created_at: string
        }
        Insert: {
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Update: {
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }

      customers: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          email: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id: string
          email: string
          full_name?: string | null
          phone?: string | null
        }
        Update: {
          user_id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
        }
        Relationships: []
      }

      events: {
        Row: {
          id: string
          title: string
          description: string | null
          location: string
          event_date: string
          start_time: string | null
          end_time: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          location: string
          event_date: string
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          is_published?: boolean
        }
        Update: {
          title?: string
          location?: string
          event_date?: string
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          is_published?: boolean
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      order_status: OrderStatus
      fulfillment_type: FulfillmentType
      cookie_group: CookieGroup
    }
  }
}
