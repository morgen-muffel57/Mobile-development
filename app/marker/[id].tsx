import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageList from "../../components/ImageList";
import { useMarkers } from "../../context/MarkerContext";
import { ImageData } from "../../types";

export default function MarkerDetailsScreen() {
  // получаем id с помощью useLocalSearchParams - хук для чтения параметров из URL
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  // берём данные из контекста
  const { markers, deleteMarker, addPhotoToMarker, deletePhotoFromMarker } =
    useMarkers();

  const marker = markers.find((m) => m.id === id);

  const [busy, setBusy] = React.useState(false);

  // функция выбора изображения pickImage
  const pickImage = async () => {
    if (busy) return;
    setBusy(true);
    try {
      // разрешение на доступ к галерее
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          "Нет доступа к фото",
          "Разрешите доступ к галерее в настройках, чтобы добавлять фото."
        );
        return;
      }

      // открытие галереи
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.6,
      });

      // проверяем, что uri реально есть
      const uri = result.assets?.[0]?.uri;
      if (!uri) {
        Alert.alert("Ошибка", "Не удалось получить изображение.");
        return;
      }
      // если всё хорошо, создаём фото
      if (!result.canceled && marker) {
        const newPhoto: ImageData = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
        };
        addPhotoToMarker(marker.id, newPhoto);
        Alert.alert("Фото добавлено");
      }
    } catch (e) {
      Alert.alert("Ошибка", "Не удалось выбрать фото.");
    } finally {
      setBusy(false);
    }
  };

  // функция удаления маркера
  const handleDeleteMarker = () => {
    Alert.alert("Удаление", "Удалить эту метку и все её фото?", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: () => {
          deleteMarker(id);
          router.back();
        },
      },
    ]);
  };

  // функция удаления фото в маркере
  const handleDeletePhoto = (photoId: string) => {
    if (!marker) return;
    Alert.alert("Удалить фото?", "Это действие нельзя отменить.", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: () => deletePhotoFromMarker(marker.id, photoId),
      },
    ]);
  };

  if (!marker) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundTitle}>Маркер не найден</Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.primaryBtnText}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* верхняя основная карточка */}
      <View style={styles.topCard}>
        <View style={styles.topRow}>
          <Text style={styles.markerTitle}>{marker.title}</Text>

          <TouchableOpacity
            style={styles.deleteMarkerBtn}
            onPress={handleDeleteMarker}
          >
            <Text style={styles.deleteMarkerBtnText}>Удалить метку</Text>
          </TouchableOpacity>
        </View>

        {/* карточка координат */}
        <View style={styles.coordsCard}>
          <Text style={styles.coordsLabel}>Координаты</Text>
          <Text style={styles.coordsValue}>{marker.latitude.toFixed(7)}</Text>
          <Text style={styles.coordsValue}>{marker.longitude.toFixed(7)}</Text>
        </View>
      </View>

      {/* кнопка добавления фото */}
      <TouchableOpacity
        style={styles.addPhotoBtn}
        onPress={pickImage}
        disabled={busy}
      >
        <Text style={styles.addPhotoBtnText}>Добавить фото</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Фотографии</Text>

      <ImageList images={marker.images} onDelete={handleDeletePhoto} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 28,
  },

  // верхняя карточка
  topCard: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 16,
    padding: 18,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  markerTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#111827",
  },

  deleteMarkerBtn: {
    backgroundColor: "#EB7273",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
  },
  deleteMarkerBtnText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
  },

  // координаты
  coordsCard: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 12,
    padding: 20,
  },
  coordsLabel: {
    fontSize: 18,
    fontWeight: "400",
    color: "#111827",
    marginBottom: 8,
  },
  coordsValue: {
    fontSize: 18,
    fontWeight: "400",
    color: "rgba(17,24,39,0.6)",
  },

  // кнопка "Добавить фото"
  addPhotoBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  addPhotoBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 16,
  },

  // пустое состояние
  emptyCard: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 16,
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(17,24,39,0.6)",
  },

  // сетка фото
  gridRow: {
    justifyContent: "flex-start",
  },
  photoItem: {
    width: "32%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    marginBottom: 8,
    marginRight: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  deleteBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EB7273",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBadgeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 18,
  },

  // не найдено 
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  notFoundTitle: { fontSize: 18, fontWeight: "800", marginBottom: 12 },

  primaryBtn: {
    backgroundColor: "#2F6FED",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  primaryBtnText: { color: "white", fontWeight: "800" },
});
