import { db } from "@/lib/db";
import { uuid } from "@/lib/ids";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function NewCase() {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const create = () => {
    if (!name.trim()) return;
    const id = uuid();
    db.run(
      "insert into cases_local (id, deceased_name, service_date, org_id, status) values (?,?,?,?,?)",
      id,
      name.trim(),
      date,
      "ORG_PLACEHOLDER",
      "draft"
    );
    router.replace(`/case/${id}`);
  };
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>Deceased name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g., Anna Jensen"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 10,
          padding: 12,
        }}
      />
      <Text>Service date</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 10,
          padding: 12,
        }}
      />
      <Pressable
        onPress={create}
        style={{ backgroundColor: "#111", padding: 14, borderRadius: 12 }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
          Create Case
        </Text>
      </Pressable>
    </View>
  );
}
