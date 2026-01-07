import CreatePostModal from '@/components/CreatePost';
import AddFriendModal from '@/components/social/add-friend-modal';
import PostCard from '@/components/social/post-card';
import { db } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { arrayRemove, arrayUnion, collection, doc, limit, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostToSocialModal from '@/components/PostToSocialModal';
import SelectMealModal from '@/components/SelectMeal';
import SelectWorkoutModal from '@/components/SelectWorkout';
import { WorkoutItem } from '@/components/WorkoutCard';
import { NutritionItem } from '../meal/[id]';

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

export default function SocialScreen() {
  const currentUserId = 'user-123';
  const [activeTab, setActiveTab] = useState<'feed' | 'friends'>('feed');
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [meals, setMeals] = useState<NutritionItem[]>([]);
const [selectedMeal, setSelectedMeal] = useState<NutritionItem | null>(null);
const [showPostModal, setShowPostModal] = useState(false);
type CreatePostType = 'meal' | 'workout' | null;

const [createType, setCreateType] = useState<CreatePostType>(null);
const [showSelectMealModal, setShowSelectMealModal] = useState(false);
const [showSelectWorkoutModal, setShowSelectWorkoutModal] = useState(false);
const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
const [selectedWorkout, setSelectedWorkout] = useState<WorkoutItem | null>(null);




  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts: Post[] = [];
      snapshot.forEach((doc) => {
        fetchedPosts.push({ id: doc.id, ...doc.data() } as Post);
      });
      setPosts(fetchedPosts);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'users'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedFriends: Friend[] = [];
      snapshot.forEach((doc) => {
        fetchedFriends.push({ 
          id: doc.id, 
          name: doc.data().name,
          image: doc.data().image
        });
      });
      setFriends(fetchedFriends);
      setLoadingFriends(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'nutrition'), (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        name: d.name || 'Unnamed meal',
        calories: d.calories || 0,
        protein: d.protein || 0,
        carbs: d.carbs || 0,
        fats: d.fats || 0,
        date: d.date || '',
      } as NutritionItem;
    });

    setMeals(data);
  });

  return unsubscribe;
}, []);

useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'workouts'), (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        title: d.title || 'Unnamed workout',
        sets: d.sets || 0,
        reps: d.reps || 0,
        weight: d.weight || 0,
        date: d.date || '',
      } as WorkoutItem;
    });
    setWorkouts(data);
  });

  return unsubscribe;
}, []);



  const handleAddFriend = async (user: Friend) => {
    try {
      await updateDoc(doc(db, 'users', currentUserId), {
        friends: arrayUnion(user.id)
      });
      
      await updateDoc(doc(db, 'users', user.id), {
        friends: arrayUnion(currentUserId)
      });

      if (!friends.some((f) => f.id === user.id)) {
        setFriends([...friends, user]);
      }
    } catch (error) {
      console.error('Fout bij toevoegen vriend:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const isLiked = likedPosts.includes(postId);
      
      if (isLiked) {
        await updateDoc(doc(db, 'posts', postId), {
          likes: Math.max(0, (posts.find(p => p.id === postId)?.likes || 1) - 1)
        });
        setLikedPosts((prev) => prev.filter((id) => id !== postId));
      } else {
        await updateDoc(doc(db, 'posts', postId), {
          likes: (posts.find(p => p.id === postId)?.likes || 0) + 1
        });
        setLikedPosts((prev) => [...prev, postId]);
      }
    } catch (error) {
      console.error('Fout bij liken post:', error);
    }
  };

  const handleSavePost = async (postId: string) => {
    try {
      const isSaved = savedPosts.includes(postId);
      
      if (isSaved) {
        await updateDoc(doc(db, 'users', currentUserId), {
          savedPosts: arrayRemove(postId)
        });
        setSavedPosts((prev) => prev.filter((id) => id !== postId));
      } else {
        await updateDoc(doc(db, 'users', currentUserId), {
          savedPosts: arrayUnion(postId)
        });
        setSavedPosts((prev) => [...prev, postId]);
      }
    } catch (error) {
      console.error('Fout bij opslaan post:', error);
    }
  };

  const handlePressFriend = (friend: Friend) => {
    setSelectedFriend(friend);
  };

  const friendPosts = posts.filter(
    (post) => post.authorId === selectedFriend?.id
  );

  if (loading || loadingFriends) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#FF4D4D" />
        <Text className="text-white mt-4">Laden...</Text>
      </SafeAreaView>
    );
  }


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

      <View className="flex-row items-center border-b border-gray-800">
    {/* Voor jou */}
    <TouchableOpacity
        className={`flex-1 py-4 ${
        activeTab === 'feed' ? 'border-b-2 border-primary' : ''
        }`}
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
    <View className="w-px h-6 bg-gray-700" />

    {/* + knop */}
    <TouchableOpacity
  className="px-4 py-4"
  onPress={() => setShowCreateModal(true)}
>
  <Text className="text-primary text-xl font-bold">+</Text>
</TouchableOpacity>

    <View className="w-px h-6 bg-gray-700" />

    {/* Vrienden */}
    <TouchableOpacity
        className={`flex-1 py-4 ${
        activeTab === 'friends' ? 'border-b-2 border-primary' : ''
        }`}
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
          data={posts}
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

      <CreatePostModal
  visible={showCreateModal}
  onClose={() => setShowCreateModal(false)}
  onMealPress={() => {
    setShowCreateModal(false);
    setCreateType('meal');
    setShowSelectMealModal(true);
  }}
  onWorkoutPress={() => {
    setShowCreateModal(false);
    setCreateType('workout');
    setShowSelectWorkoutModal(true);
  }}
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

      <SelectMealModal
  visible={showSelectMealModal}
  meals={meals}
  onClose={() => setShowSelectMealModal(false)}
  onSelect={(meal) => {
    setShowSelectMealModal(false);
    setSelectedMeal(meal);
    setShowPostModal(true);
  }}/>

  <SelectWorkoutModal
  visible={showSelectWorkoutModal}
  workouts={workouts}
  onClose={() => setShowSelectWorkoutModal(false)}
  onSelect={(workout) => {
    setShowSelectWorkoutModal(false);
    setSelectedWorkout(workout);
    setShowPostModal(true); 
  }}
/>


  

  {selectedMeal && (
  <PostToSocialModal
    visible={showPostModal}
    onClose={() => setShowPostModal(false)}
    type="meal"
    item={selectedMeal}
    currentUserId={currentUserId}
    currentUserName="Jouw Naam"
  />
)}

{selectedWorkout && (
  <PostToSocialModal
    visible={showPostModal}
    onClose={() => setShowPostModal(false)}
    type="workout"
    item={selectedWorkout}
    currentUserId={currentUserId}
    currentUserName="Jouw Naam"
  />
)}


    </SafeAreaView>
  );
}