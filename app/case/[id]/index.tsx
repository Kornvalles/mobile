import { db } from "@/lib/db";
import { Link, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Case() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = db.getFirstSync("select * from cases_local where id=?", id);
  const count =
    db.getFirstSync(
      "select count(*) as n from arrangements_local where case_id=?",
      id
    )?.n || 0;
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>{c.deceased_name}</Text>
      <Text style={{ opacity: 0.7 }}>{c.service_date}</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Link href={`/case/${id}/capture`}>Capture</Link>
        <Link href={`/case/${id}/arrangements`}>Arrangements ({count})</Link>
        <Link href={`/case/${id}/publish`}>Publish</Link>
      </View>
    </View>
  );
}
