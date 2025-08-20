import { db } from "@/lib/db";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

export default function Arrangements() {
  const { id: caseId } = useLocalSearchParams<{ id: string }>();
  const data = db.getAll(
    "select * from arrangements_local where case_id=? order by order_index desc",
    caseId
  );
  return (
    <FlatList
      data={data}
      keyExtractor={(i) => i.id}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      renderItem={({ item }) => <Row item={item} />}
    />
  );
}

function Row({ item }: { item: any }) {
  const [sender, setSender] = useState(item.sender_name || "");
  const [message, setMessage] = useState(item.sender_message || "");
  const save = () => {
    db.run(
      "update arrangements_local set sender_name=?, sender_message=? where id=?",
      sender,
      message,
      item.id
    );
  };
  const photos = db.getAll(
    "select * from photos_local where arrangement_id=?",
    item.id
  );
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        padding: 12,
        gap: 8,
      }}
    >
      <Text style={{ fontWeight: "700" }}>
        {photos.length} photo{photos.length !== 1 ? "s" : ""}
      </Text>
      <TextInput
        value={sender}
        onChangeText={setSender}
        placeholder="Sender name"
        onEndEditing={save}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          padding: 10,
        }}
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Message"
        onEndEditing={save}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          padding: 10,
        }}
      />
      <Pressable
        onPress={save}
        style={{
          alignSelf: "flex-start",
          backgroundColor: "#111",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff" }}>Save</Text>
      </Pressable>
    </View>
  );
}
