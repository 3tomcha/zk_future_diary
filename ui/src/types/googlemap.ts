
export type GoogleMapsResponse = {
  status: string;
  results: PlaceResult[];
  error_message?: string;
};

export type PlaceResult = {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport?: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
  name: string;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: {
    height: number;
    width: number;
    photo_reference: string;
  }[];
  place_id: string;
  rating?: number;
  reference: string;
  types: string[];
};

