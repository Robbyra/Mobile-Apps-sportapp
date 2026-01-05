import { db } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface PostToSocialModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'workout' | 'meal';
  item: {
    id: string;
    title?: string;
    name?: string;
    [key: string]: any;
  };
  currentUserId: string;
  currentUserName: string;
}

export default function PostToSocialModal({
  visible,
  onClose,
  type,
  item,
  currentUserId,
  currentUserName,
}: PostToSocialModalProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!description.trim()) {
      Alert.alert('Fout', 'Voeg een beschrijving toe');
      return;
    }

    setLoading(true);
    try {
      const postData = {
        authorId: currentUserId,
        authorName: currentUserName,
        authorImage: '',
        type: type === 'workout' ? 'workout' : 'meal',
        title: type === 'workout' ? item.title : item.name,
        description: description,
        stats: type === 'workout' 
          ? `${item.sets} sets × ${item.reps} reps — ${item.weight}kg`
          : `${item.calories} kcal`,
        caloriesBurned: type === 'workout' ? Math.round((item.weight * item.reps * item.sets) * 0.5) : null,
        likes: 0,
        timestamp: new Date().toISOString(),
      };

      await addDoc(collection(db, 'posts'), postData);
      
      Alert.alert('Succes', `Je ${type === 'workout' ? 'workout' : 'maaltijd'} is gepost!`);
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Fout bij posten:', error);
      Alert.alert('Fout', 'Kon post niet toevoegen');
    } finally {
      setLoading(false);
    }
  };

  const itemTitle = type === 'workout' ? item.title : item.name;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-background p-4">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-white text-2xl font-bold">
            Post {type === 'workout' ? 'Workout' : 'Maaltijd'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#FF4D4D" />
          </TouchableOpacity>
        </View>

        <View className="bg-surface p-4 rounded-2xl border border-gray-800 mb-6">
          <Text className="text-gray-400 text-sm mb-2">
            {type === 'workout' ? 'Workout' : 'Maaltijd'}
          </Text>
          <Text className="text-white text-xl font-bold mb-2">{itemTitle}</Text>
          <Text className="text-gray-300 text-sm">
            {type === 'workout'
              ? `${item.sets} sets × ${item.reps} reps — ${item.weight}kg`
              : `${item.calories} kcal`}
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-white font-semibold mb-2">Beschrijving (optioneel)</Text>
          <TextInput
            className="bg-surface text-white p-4 rounded-xl border border-gray-800 h-32"
            placeholder="Deel je ervaringen..."
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={200}
          />
          <Text className="text-gray-400 text-xs mt-2">
            {description.length}/200
          </Text>
        </View>

        <TouchableOpacity
          className={`p-4 rounded-xl items-center ${
            loading ? 'bg-gray-600' : 'bg-primary'
          }`}
          onPress={handlePost}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Post naar Feed</Text>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
