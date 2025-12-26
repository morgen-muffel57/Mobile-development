// структура фотографии
export interface ImageData {
  id: string;   // уникальный id
  uri: string;   // ссылка на местоположение файла в памяти телефона
}

// структура маркера
export interface MarkerData {
  id: string;   // уникальный id маркера   
  latitude: number;  // широта
  longitude: number; // долгота
  title?: string;    // название (необязательно)
  description?: string; // описание (необязательно)
  images: ImageData[]; // массив фотографий, привязанных к этой точке
}

// интерфейс для хранилища (Context)
export interface MarkerContextType {
  markers: MarkerData[];
  addMarker: (marker: MarkerData) => void;
  deleteMarker: (markerId: string) => void;
  addPhotoToMarker: (markerId: string, photo: ImageData) => void;
  deletePhotoFromMarker: (markerId: string, photoId: string) => void;
}

// параметры навигации 
// какие экраны есть в приложении и что они принимают
export type RootStackParamList = {
  index: undefined;           // главный экран параметров не требует
  'marker/[id]': { id: string }; // экран деталей требует строку 'id'
};