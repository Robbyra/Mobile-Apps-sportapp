import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

const SUGGESTED_USERS = [
  { id: '1', name: 'Jan Jansen' },
  { id: '2', name: 'Marie Pieters' },
  { id: '3', name: 'Thomas Groot' },
  { id: '4', name: 'Lisa van den Berg' },
  { id: '5', name: 'Marco Rossi' },
  { id: '6', name: 'Emma Schmidt' },
];

export default function AddFriendModal({
  visible,
  onClose,
  onAddFriend,
  existingFriends,
}: AddFriendModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = SUGGESTED_USERS.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isFriend = (userId: string) => existingFriends.some((f) => f.id === userId);

  const handleAddFriend = (user: Friend) => {
    onAddFriend(user);
    setSearchQuery('');
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
            ? 'bg-primary border-primary'
            : 'bg-background border-gray-700'
        }`}
        onPress={() => handleAddFriend(item)}
      >
        <Text
          className={`font-semibold text-sm ${
            isFriend(item.id) ? 'text-white' : 'text-primary'
          }`}
        >
          {isFriend(item.id) ? '✓ Vrienden' : 'Toevoegen'}
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
          <Text className="text-white text-xl font-bold">Vrienden toevoegen</Text>
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

        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 0 }}
        />
      </View>
    </Modal>
  );
}
