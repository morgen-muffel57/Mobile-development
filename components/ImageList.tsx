// Задача: сетка фото 3 колонки, пустое состояние, кнопка удаления фото.
// Пусть экран [id].tsx передаёт images и onDelete.
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ImageData } from "../types";

type Props = {
  images: ImageData[];
  onDelete: (photoId: string) => void;
};

export default function ImageList({ images, onDelete }: Props) {
  if (images.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <MaterialIcons name="photo" size={48} color="#79A8FF" style={{ marginBottom: 16 }} />
        <Text style={styles.emptyTitle}>Фото ещё нет</Text>
        <Text style={styles.emptyText}>Добавьте фото к метке</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {images.map((item, index) => {
        const isThird = (index + 1) % 3 === 0;

        return (
          <View
            key={item.id}
            style={[styles.photoItem, !isThird && { marginRight: 8 }]}
          >
            <Image source={{ uri: item.uri }} style={styles.photo} />
            <TouchableOpacity
              onPress={() => onDelete(item.id)}
              style={styles.deleteBadge}
              hitSlop={10}
            >
              <Text style={styles.deleteBadgeText}>×</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  photoItem: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    marginBottom: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  photo: { width: "100%", height: "100%" },

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
});
