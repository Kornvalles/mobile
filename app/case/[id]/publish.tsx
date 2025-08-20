import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import { Alert, Pressable, Switch, Text, TextInput, View } from "react-native";

export default function Publish() {
  const { id: caseId } = useLocalSearchParams<{ id: string }>();
  const c = db.getFirstSync("select * from cases_local where id=?", caseId);
  const [hideSenders, setHideSenders] = React.useState(true);
  const [pin, setPin] = React.useState("");

  const publish = async () => {
    // Create remote case if not exists, then arrangements & photos via queue
    // For MVP we assume rows exist remotely and only create share link here
    const token = crypto.getRandomValues(new Uint32Array(4)).join("");
    const { error } = await supabase
      .from("share_links")
      .insert({
        case_id: c.id,
        token,
        hide_senders: hideSenders,
        password_hash: pin ? pin : null,
        allow_zip: false,
        expires_at: null,
      });
    if (error) {
      Alert.alert("Error", error.message);
      return;
    }
    Alert.alert("Published", `Link: https://your-gallery-host/v/${token}`);
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Publish link</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Switch value={hideSenders} onValueChange={setHideSenders} />
        <Text>Hide sender names</Text>
      </View>
      <Text>PIN (optional)</Text>
      <TextInput
        value={pin}
        onChangeText={setPin}
        placeholder="e.g., 1234"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 10,
          padding: 12,
        }}
      />
      <Pressable
        onPress={publish}
        style={{ backgroundColor: "#111", padding: 14, borderRadius: 12 }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
          Create link
        </Text>
      </Pressable>
      <Text style={{ opacity: 0.7 }}>
        Note: In real flow, token validation + PIN happens via Edge Function.
      </Text>
    </View>
  );
}
