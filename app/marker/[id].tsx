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
import { useDatabase } from "../../context/DatabaseContext";
import { DBMarker, DBMarkerImage } from "../../types";

export default function MarkerDetailsScreen() {
  // получаем id с помощью useLocalSearchParams - хук для чтения параметров из URL
  const params = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  // берём данные из контекста
  const {
    getMarkerImages,
    addImage,
    deleteImage,
    deleteMarker,
    getMarkerById,
    isLoading,
  } = useDatabase();

  const markerId = Number(params.id);
  const [marker, setMarker] = React.useState<DBMarker | null>(null); // состояние для данных маркера (координаты)
  const [images, setImages] = React.useState<DBMarkerImage[]>([]); // массив изображений (фотографий) этой метки
  const [busy, setBusy] = React.useState(false);

  // функция загрузки фото из базы
  // useCallback нужен, чтобы функция не пересоздавалась без нужды
  const loadImages = React.useCallback(async () => {
    // если markerId некорректный (NaN/Infinity), то ничего не делаем
    if (!Number.isFinite(markerId)) return;

    try {
      // запрашиваем из БД все фото для этой метки, сохраняем фото в state
      const data = await getMarkerImages(markerId);
      setImages(data);
    } catch (e) {
      Alert.alert("Ошибка", "Не удалось загрузить фотографии.");
    }
  }, [getMarkerImages, markerId]);

  // функция загрузки самого маркера по id
  const loadMarker = React.useCallback(async () => {
    try {
      // получаем маркер из БД, сохраняем в state
      const m = await getMarkerById(markerId);
      setMarker(m);
    } catch {
      Alert.alert("Ошибка", "Не удалось загрузить координаты метки.");
    }
  }, [getMarkerById, markerId]);

  // загрузка маркера при открытии экрана
  React.useEffect(() => {
    loadMarker();
  }, [loadMarker]);

  // загрузка изображений при открытии экрана
  React.useEffect(() => {
    loadImages();
  }, [loadImages]);

  // выбираем фото из галереи
  const pickImage = async () => {
    if (busy) return;
    if (!Number.isFinite(markerId)) {
      Alert.alert("Ошибка", "Некорректный id метки.");
      return;
    }

    setBusy(true);
    try {
      // запрашиваем разрешение на доступ к галерее
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          "Нет доступа к фото",
          "Разрешите доступ к галерее в настройках, чтобы добавлять фото.",
        );
        return;
      }

      // открываем галерею
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.6,
      });

      const uri = result.assets?.[0]?.uri;
      if (!uri) {
        Alert.alert("Ошибка", "Не удалось получить изображение.");
        return;
      }

      // если пользователь не отменил выбор (result.canceled = false)
      if (!result.canceled) {
        await addImage(markerId, uri);
        await loadImages();
        Alert.alert("Фото добавлено");
      }
    } catch (e) {
      Alert.alert("Ошибка", "Не удалось выбрать фото.");
    } finally {
      setBusy(false);
    }
  };

  // удаление метки целиком
  const handleDeleteMarker = () => {
    // если markerId некорректный — ничего не делаем
    if (!Number.isFinite(markerId)) return;

    Alert.alert("Удаление", "Удалить эту метку и все её фото?", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMarker(markerId);
            router.back();
          } catch (e) {
            Alert.alert("Ошибка", "Не удалось удалить метку.");
          }
        },
      },
    ]);
  };

  // удаление одного фото по его id (id из таблицы marker_images)
  const handleDeletePhoto = (imageId: number) => {
    Alert.alert("Удалить фото?", "Это действие нельзя отменить.", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteImage(imageId);
            await loadImages();
          } catch (e) {
            Alert.alert("Ошибка", "Не удалось удалить фото.");
          }
        },
      },
    ]);
  };

  if (!Number.isFinite(markerId)) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundTitle}>Некорректный id метки</Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.primaryBtnText}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={{ fontWeight: "700" }}>Загрузка…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topCard}>
        <View style={styles.topRow}>
          <Text style={styles.markerTitle}>Метка #{markerId}</Text>

          <TouchableOpacity
            style={styles.deleteMarkerBtn}
            onPress={handleDeleteMarker}
          >
            <Text style={styles.deleteMarkerBtnText}>Удалить метку</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.coordsCard}>
          <Text style={styles.coordsLabel}>Координаты</Text>
          <Text style={styles.coordsValue}>{marker?.latitude.toFixed(7)}</Text>
          <Text style={styles.coordsValue}>{marker?.longitude.toFixed(7)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.addPhotoBtn}
        onPress={pickImage}
        disabled={busy}
      >
        <Text style={styles.addPhotoBtnText}>
          {busy ? "Добавление…" : "Добавить фото"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Фотографии</Text>

      <ImageList images={images} onDelete={handleDeletePhoto} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 28,
  },

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
