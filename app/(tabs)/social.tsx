import AddFriendModal from '@/components/social/add-friend-modal';
import PostCard from '@/components/social/post-card';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Friend {
  id: string;
  name: string;
  image?: string;
}

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  type: 'workout' | 'meal';
  title: string;
  description: string;
  stats: string;
  caloriesBurned?: number;
  likes: number;
  timestamp: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    authorId: '101',
    authorName: 'Jan Jansen',
    type: 'workout',
    title: 'Ochtend run 🏃',
    description: '5K snelle tempo run in het park',
    stats: '5,2 km — 26 minuten',
    caloriesBurned: 380,
    likes: 24,
    timestamp: '2u geleden',
  },
  {
    id: '2',
    authorId: '102',
    authorName: 'Marie Pieters',
    type: 'meal',
    title: 'Gezonde acaibowl',
    description: 'Verse acai bowl met noten en granola',
    stats: 'Ontbijt — 450 kcal',
    likes: 18,
    timestamp: '1u geleden',
  },
  {
    id: '3',
    authorId: '103',
    authorName: 'Thomas Groot',
    type: 'workout',
    title: 'Krachttraining benen',
    description: 'Intensieve sessie: squats, lunges, leg press',
    stats: '45 minuten — Benen',
    caloriesBurned: 460,
    likes: 32,
    timestamp: '3u geleden',
  },
  {
    id: '4',
    authorId: '104',
    authorName: 'Lisa van den Berg',
    type: 'meal',
    title: 'Gezonde griekse salade',
    description: 'Feta, olijven, tomaten en komkommer',
    stats: 'Lunch — 280 kcal',
    likes: 15,
    timestamp: '5u geleden',
  },
  {
    id: '5',
    authorId: '105',
    authorName: 'Marco Rossi',
    type: 'workout',
    title: 'Yoga sessie',
    description: 'Hatha yoga voor flexibiliteit en ontspanning',
    stats: '60 minuten',
    likes: 28,
    timestamp: '6u geleden',
  },
];

export default function SocialScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'feed' | 'friends'>('feed');
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([
    { id: '101', name: 'Jan Jansen' },
    { id: '102', name: 'Marie Pieters' },
  ]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const handleAddFriend = (user: Friend) => {
    if (!friends.some((f) => f.id === user.id)) {
      setFriends([...friends, user]);
    }
  };

  const handleLikePost = (postId: string) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleSavePost = (postId: string) => {
    setSavedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handlePressFriend = (friend: Friend) => {
    setSelectedFriend(friend);
  };

  const friendPosts = INITIAL_POSTS.filter(
    (post) => post.authorId === selectedFriend?.id
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
        <View>
          <Text className="text-white text-2xl font-bold">FitCircle</Text>
          <Text className="text-gray-400 text-xs">Sociaal</Text>
        </View>
        <TouchableOpacity
          className="bg-surface px-4 py-2 rounded-lg border border-gray-800"
          onPress={() => setShowAddFriendModal(true)}
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="person-add" size={18} color="#FF4D4D" />
            <Text className="text-white font-semibold text-sm">Toevoegen</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="flex-row border-b border-gray-800">
        <TouchableOpacity
          className={`flex-1 py-4 ${activeTab === 'feed' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('feed')}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'feed' ? 'text-primary' : 'text-gray-400'
            }`}
          >
            Voor jou
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-4 ${activeTab === 'friends' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('friends')}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'friends' ? 'text-primary' : 'text-gray-400'
            }`}
          >
            Vrienden ({friends.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'feed' ? (
        <FlatList
          data={INITIAL_POSTS}
          renderItem={({ item }) => (
            <PostCard
              {...item}
              onPress={() => handlePressFriend({ id: item.authorId, name: item.authorName })}
              onLike={() => handleLikePost(item.id)}
              onSave={() => handleSavePost(item.id)}
              isLiked={likedPosts.includes(item.id)}
              isSaved={savedPosts.includes(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          scrollEnabled
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-4">
            {friends.length === 0 ? (
              <View className="items-center justify-center py-16">
                <Ionicons name="people-outline" size={48} color="#A0A0A0" />
                <Text className="text-gray-400 text-center mt-4">
                  Je hebt nog geen vrienden toevoegd
                </Text>
                <TouchableOpacity
                  className="bg-primary px-6 py-3 rounded-xl mt-6"
                  onPress={() => setShowAddFriendModal(true)}
                >
                  <Text className="text-white font-bold">Vrienden zoeken</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text className="text-white text-lg font-bold mb-4">Je vrienden</Text>
                {friends.map((friend) => (
                  <TouchableOpacity
                    key={friend.id}
                    className="flex-row items-center justify-between bg-surface p-4 rounded-xl mb-3 border border-gray-800"
                    onPress={() => handlePressFriend(friend)}
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="w-12 h-12 bg-primary rounded-full justify-center items-center mr-3">
                        <Text className="text-white font-bold">{friend.name.charAt(0)}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-semibold">{friend.name}</Text>
                        <Text className="text-gray-400 text-xs">Vrienden sinds vandaag</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}

      <AddFriendModal
        visible={showAddFriendModal}
        onClose={() => setShowAddFriendModal(false)}
        onAddFriend={handleAddFriend}
        existingFriends={friends}
      />

      <Modal visible={selectedFriend !== null} animationType="slide" transparent={false}>
        {selectedFriend && (
          <SafeAreaView className="flex-1 bg-background">
            <View className="border-b border-gray-800">
              <View className="flex-row items-center justify-between p-4">
                <TouchableOpacity onPress={() => setSelectedFriend(null)}>
                  <Ionicons name="chevron-back" size={24} color="#FF4D4D" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Profiel</Text>
                <View style={{ width: 24 }} />
              </View>

              <View className="items-center py-6 px-4">
                <View className="w-20 h-20 bg-primary rounded-full justify-center items-center mb-4">
                  <Text className="text-white font-bold text-3xl">
                    {selectedFriend.name.charAt(0)}
                  </Text>
                </View>
                <Text className="text-white text-2xl font-bold">{selectedFriend.name}</Text>
                <Text className="text-gray-400 mt-2">Jouw vriend</Text>

                <View className="flex-row gap-6 mt-6">
                  <View className="items-center">
                    <Text className="text-primary text-2xl font-bold">
                      {friendPosts.length}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-1">Posts</Text>
                  </View>
                  <View className="w-px bg-gray-800" />
                  <View className="items-center">
                    <Text className="text-primary text-2xl font-bold">
                      {friendPosts.filter((p) => p.type === 'workout').length}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-1">Workouts</Text>
                  </View>
                  <View className="w-px bg-gray-800" />
                  <View className="items-center">
                    <Text className="text-primary text-2xl font-bold">
                      {friendPosts.filter((p) => p.type === 'meal').length}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-1">Meals</Text>
                  </View>
                </View>
              </View>
            </View>

            <FlatList
              data={friendPosts}
              renderItem={({ item }) => (
                <PostCard
                  {...item}
                  onLike={() => handleLikePost(item.id)}
                  onSave={() => handleSavePost(item.id)}
                  isLiked={likedPosts.includes(item.id)}
                  isSaved={savedPosts.includes(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
              ListEmptyComponent={
                <View className="items-center justify-center py-16">
                  <Text className="text-gray-400">Geen posts van deze vriend</Text>
                </View>
              }
              scrollEnabled
              showsVerticalScrollIndicator={false}
            />
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}