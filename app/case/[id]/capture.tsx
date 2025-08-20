import { db } from "@/lib/db";
import { uuid } from "@/lib/ids";
import { prepareImage } from "@/lib/image";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

export default function Capture() {
  const { id: caseId } = useLocalSearchParams<{ id: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<any>(null);
  const [mode, setMode] = useState<"overview" | "card">("overview");

  if (!permission?.granted) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <Text>Camera permission needed</Text>
        <Pressable
          onPress={requestPermission}
          style={{ backgroundColor: "#111", padding: 12, borderRadius: 10 }}
        >
          <Text style={{ color: "#fff" }}>Grant</Text>
        </Pressable>
      </View>
    );
  }

  const take = async () => {
    try {
      const photo = await ref.current?.takePictureAsync({
        quality: 0.9,
        skipProcessing: true,
      });
      if (!photo?.uri) return;
      const local = await prepareImage(photo.uri);
      // create arrangement on first shot or append to last created
      const arrId = uuid();
      db.run(
        "insert into arrangements_local (id, case_id, type, order_index) values (?,?,?,?)",
        arrId,
        caseId,
        "other",
        Date.now()
      );
      const phId = uuid();
      db.run(
        "insert into photos_local (id, arrangement_id, kind, local_uri, width, height, synced) values (?,?,?,?,?,?,0)",
        phId,
        arrId,
        mode,
        local,
        photo.width || null,
        photo.height || null
      );
      Alert.alert("Saved", "Photo added to arrangement");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to capture");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={ref} style={{ flex: 1 }} facing="back" />
      <View
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          alignItems: "center",
          gap: 12,
        }}
      >
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={() => setMode("overview")}
            style={{
              backgroundColor: mode === "overview" ? "#111" : "#fff",
              borderWidth: 1,
              borderColor: "#ddd",
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 999,
            }}
          >
            <Text style={{ color: mode === "overview" ? "#fff" : "#111" }}>
              Overview
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("card")}
            style={{
              backgroundColor: mode === "card" ? "#111" : "#fff",
              borderWidth: 1,
              borderColor: "#ddd",
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 999,
            }}
          >
            <Text style={{ color: mode === "card" ? "#fff" : "#111" }}>
              Card
            </Text>
          </Pressable>
        </View>
        <Pressable
          onPress={take}
          style={{
            backgroundColor: "#fff",
            width: 76,
            height: 76,
            borderRadius: 38,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 3,
            borderColor: "#111",
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#111",
            }}
          />
        </Pressable>
      </View>
    </View>
  );
}
