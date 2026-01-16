export type DBMarker = {
  id: number;
  latitude: number;
  longitude: number;
  created_at?: string;
  title?: string; // название (необязательно)
  description?: string; // описание (необязательно)
};

export type DBMarkerImage = {
  id: number;
  marker_id: number;
  uri: string;
  created_at?: string;
};

export interface DatabaseContextType {
  addMarker: (latitude: number, longitude: number) => Promise<number>;
  deleteMarker: (id: number) => Promise<void>;
  getMarkers: () => Promise<DBMarker[]>;

  addImage: (markerId: number, uri: string) => Promise<void>;
  deleteImage: (id: number) => Promise<void>;
  getMarkerImages: (markerId: number) => Promise<DBMarkerImage[]>;
  getMarkerById: (id: number) => Promise<DBMarker | null>;

  isLoading: boolean;
  error: Error | null;
}
