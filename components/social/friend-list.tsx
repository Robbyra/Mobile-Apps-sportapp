import { Ionicons } from '@expo/vector-icons';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

interface Friend {
  id: string;
  name: string;
  image?: string;
  isFriend?: boolean;
}

interface FriendListProps {
  friends: Friend[];
  onPressFriend: (friend: Friend) => void;
  onAddFriend?: (friend: Friend) => void;
  horizontal?: boolean;
  showAddButton?: boolean;
}

export default function FriendList({
  friends,
  onPressFriend,
  onAddFriend,
  horizontal = false,
  showAddButton = true,
}: FriendListProps) {
  const renderFriend = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      className="items-center mr-4"
      onPress={() => onPressFriend(item)}
    >
      <View className="relative mb-2">
        <View className="w-16 h-16 bg-primary rounded-full justify-center items-center border-2 border-gray-700">
          {item.image ? (
            <Image source={{ uri: item.image }} className="w-16 h-16 rounded-full" />
          ) : (
            <Text className="text-white font-bold text-lg">{item.name.charAt(0)}</Text>
          )}
        </View>
        {item.isFriend && (
          <View className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
            <Ionicons name="checkmark" size={12} color="white" />
          </View>
        )}
      </View>
      <Text className="text-white font-semibold text-xs text-center w-16 line-clamp-1">
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={friends}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
        horizontal={horizontal}
        scrollEnabled={horizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={!horizontal ? { flexDirection: 'column' } : undefined}
      />
    </View>
  );
}
