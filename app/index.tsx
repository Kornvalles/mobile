import { db, initDb } from "@/lib/db";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

initDb();

export default function Cases() {
  const [cases, setCases] = useState<any[]>([]);
  useFocusEffect(
    useCallback(() => {
      const rows = db.getAll(
        "select * from cases_local order by service_date desc"
      );
      setCases(rows);
    }, [])
  );
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Link href="/new" asChild>
        <Pressable
          style={{ backgroundColor: "#111", padding: 14, borderRadius: 12 }}
        >
          <Text
            style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}
          >
            New Case
          </Text>
        </Pressable>
      </Link>
      <FlatList
        data={cases}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Link href={`/case/${item.id}`} asChild>
            <Pressable
              style={{
                padding: 16,
                backgroundColor: "#fff",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#eee",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontWeight: "700" }}>{item.deceased_name}</Text>
              <Text style={{ opacity: 0.7 }}>{item.service_date}</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}
