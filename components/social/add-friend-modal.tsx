import { db } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Friend {
  id: string;
  name: string;
  image?: string;
}

interface AddFriendModalProps {
  visible: boolean;
  onClose: () => void;
  onAddFriend: (friend: Friend) => void;
  existingFriends: Friend[];
}

export default function AddFriendModal({
  visible,
  onClose,
  onAddFriend,
  existingFriends,
}: AddFriendModalProps) {
  const currentUserId = "user-123";
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;

    const q = query(collection(db, "users"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: Friend[] = [];
      snapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          name: doc.data().name,
          image: doc.data().image,
        });
      });
      setAllUsers(users);
      setLoading(false);
    });

    return unsubscribe;
  }, [visible]);

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isFriend = (userId: string) =>
    existingFriends.some((f) => f.id === userId);

  const handleAddFriend = async (user: Friend) => {
    try {
      await updateDoc(doc(db, "users", currentUserId), {
        friends: arrayUnion(user.id),
      });

      await updateDoc(doc(db, "users", user.id), {
        friends: arrayUnion(currentUserId),
      });

      onAddFriend(user);
      setSearchQuery("");
    } catch (error) {
      console.error("Fout bij toevoegen vriend:", error);
    }
  };

  const renderUserItem = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4 border-b border-gray-800"
      onPress={() => handleAddFriend(item)}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 bg-primary rounded-full justify-center items-center mr-3">
          <Text className="text-white font-bold">{item.name.charAt(0)}</Text>
        </View>
        <Text className="text-white font-semibold flex-1">{item.name}</Text>
      </View>
      <TouchableOpacity
        className={`px-4 py-2 rounded-lg border ${
          isFriend(item.id)
            ? "bg-primary border-primary"
            : "bg-background border-gray-700"
        }`}
        onPress={() => handleAddFriend(item)}
      >
        <Text
          className={`font-semibold text-sm ${
            isFriend(item.id) ? "text-white" : "text-primary"
          }`}
        >
          {isFriend(item.id) ? "✓ Vrienden" : "Toevoegen"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-background">
        <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#FF4D4D" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">
            Vrienden toevoegen
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-4">
          <View className="flex-row items-center bg-surface rounded-xl px-4 py-3 border border-gray-800">
            <Ionicons name="search" size={20} color="#A0A0A0" />
            <TextInput
              placeholder="Zoeken naar vrienden..."
              placeholderTextColor="#666"
              className="flex-1 text-white ml-2"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FF4D4D" />
            <Text className="text-white mt-4">Gebruikers laden...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          />
        )}
      </View>
    </Modal>
  );
}
