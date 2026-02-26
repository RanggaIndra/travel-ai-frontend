// types/trip.d.ts
export interface FlightDetail {
  type?: string;
  price?: {
    total?: string; // contoh: "1.200.000"
    currency?: string; // "IDR"
  };
  itineraries?: any; // Anda dapat memperluas bila butuh
}

export interface Activity {
  time: string; // "09:00"
  activity: string; // "Kunjungi Pura Tanah Lot"
  location?: string; // opsional
  description?: string; // opsional (untuk akomodasi / makan)
}

export interface DayItinerary {
  day: number;
  activities: Activity[];
}

export interface BudgetInfo {
  category: string; // "Mid-range"
  style: string; // deskripsi singkat
}

export interface TripData {
  id: number;
  user_id: number;
  destination: string;
  start_date: string; // YYYY‑MM‑DD
  duration_days: number;
  budget_estimate: number;
  budget_category: string;
  itinerary_data: DayItinerary[];
  flight_details: FlightDetail | null;
  created_at: string;
  updated_at: string;
}

export interface GenerateTripResponse {
  status: "success" | "error";
  message: string;
  budget_info: BudgetInfo;
  data: TripData;
  booking_url: string;
}
