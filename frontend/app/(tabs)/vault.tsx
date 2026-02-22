import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Search,
  Shield,
  Globe,
  CreditCard,
  Wifi,
  Smartphone,
  MoreHorizontal,
  ChevronRight,
  Eye,
  EyeOff,
  Heart,
  Trash2,
  Copy,
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BACKEND_URL } from '@/lib/api';

const CATEGORY_ICONS: Record<string, any> = {
  social: Globe,
  finance: CreditCard,
  wifi: Wifi,
  apps: Smartphone,
  other: MoreHorizontal,
  email: Globe,
  shopping: CreditCard,
  work: Shield,
};

const CATEGORY_COLORS: Record<string, string> = {
  social: '#6C5CE7',
  finance: '#00B894',
  wifi: '#FDCB6E',
  apps: '#E17055',
  other: '#74B9FF',
  email: '#A29BFE',
  shopping: '#FAB1A0',
  work: '#55A3F2',
};

const CATEGORIES = [
  'all',
  'social',
  'finance',
  'wifi',
  'apps',
  'email',
  'shopping',
  'work',
  'other',
];

type Password = {
  id: string;
  title: string;
  username: string;
  email: string;
  password: string;
  website_url: string;
  category: string;
  notes: string;
  is_favorite: boolean;
  created_at: string;
};

export default function VaultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const [passwords, setPasswords] = React.useState<Password[]>([]);
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState(
    params.category || 'all'
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const [visiblePasswords, setVisiblePasswords] = React.useState<Set<string>>(
    new Set()
  );

  const fetchPasswords = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'all')
        queryParams.set('category', selectedCategory);
      if (search) queryParams.set('search', search);

      const res = await fetch(
        `${BACKEND_URL}/passwords?${queryParams.toString()}`
      );
      const data = await res.json();
      setPasswords(data);
    } catch (e) {
      console.error('Failed to fetch passwords:', e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPasswords();
    }, [selectedCategory, search])
  );

  React.useEffect(() => {
    fetchPasswords();
  }, [selectedCategory, search]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPasswords();
    setRefreshing(false);
  };

  const toggleFavorite = async (id: string) => {
    try {
      await fetch(`${BACKEND_URL}/passwords/${id}/favorite`, {
        method: 'PATCH',
      });
      fetchPasswords();
    } catch (e) {
      console.error(e);
    }
  };

  const deletePassword = (id: string, title: string) => {
    Alert.alert('Delete Password', `Delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await fetch(`${BACKEND_URL}/passwords/${id}`, {
              method: 'DELETE',
            });
            fetchPasswords();
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  const toggleVisibility = (id: string) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0f1332' }}>
      {/* Header */}
      <View style={{ paddingTop: 55, paddingHorizontal: 20, paddingBottom: 10 }}>
        <Text style={{ color: '#fff', fontSize: 26, fontWeight: '700' }}>
          My Vault
        </Text>
        <Text style={{ color: '#8b90b5', fontSize: 13, marginTop: 2 }}>
          {passwords.length} passwords stored
        </Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <View
          style={{
            backgroundColor: '#1a1f45',
            borderRadius: 14,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
          }}>
          <Search size={18} color="#8b90b5" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search passwords..."
            placeholderTextColor="#8b90b5"
            style={{
              flex: 1,
              paddingVertical: 14,
              paddingHorizontal: 10,
              color: '#fff',
              fontSize: 15,
            }}
          />
        </View>
      </View>

      {/* Category Filter */}
      <View style={{ marginBottom: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor:
                  selectedCategory === cat ? '#e8456b' : '#1a1f45',
              }}>
              <Text
                style={{
                  color: selectedCategory === cat ? '#fff' : '#8b90b5',
                  fontSize: 13,
                  fontWeight: '600',
                  textTransform: 'capitalize',
                }}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Password List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {passwords.length === 0 ? (
          <View
            style={{
              backgroundColor: '#1a1f45',
              borderRadius: 16,
              padding: 40,
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Shield size={48} color="#2a2f55" />
            <Text
              style={{
                color: '#8b90b5',
                fontSize: 15,
                marginTop: 14,
                textAlign: 'center',
              }}>
              No passwords found.
            </Text>
          </View>
        ) : (
          passwords.map((item) => {
            const IconComp = CATEGORY_ICONS[item.category] || Shield;
            const color = CATEGORY_COLORS[item.category] || '#74B9FF';
            const isVisible = visiblePasswords.has(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  router.push(`/password-detail?id=${item.id}` as any)
                }
                style={{
                  backgroundColor: '#1a1f45',
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: `${color}20`,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}>
                    <IconComp size={20} color={color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: '600',
                      }}>
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        color: '#8b90b5',
                        fontSize: 12,
                        marginTop: 2,
                      }}>
                      {item.username || item.email}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity
                      onPress={() => toggleVisibility(item.id)}
                      style={{ padding: 6 }}>
                      {isVisible ? (
                        <EyeOff size={16} color="#8b90b5" />
                      ) : (
                        <Eye size={16} color="#8b90b5" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => toggleFavorite(item.id)}
                      style={{ padding: 6 }}>
                      <Heart
                        size={16}
                        color={item.is_favorite ? '#e8456b' : '#8b90b5'}
                        fill={item.is_favorite ? '#e8456b' : 'none'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deletePassword(item.id, item.title)}
                      style={{ padding: 6 }}>
                      <Trash2 size={16} color="#8b90b5" />
                    </TouchableOpacity>
                  </View>
                </View>
                {isVisible && (
                  <View
                    style={{
                      marginTop: 10,
                      paddingTop: 10,
                      borderTopWidth: 1,
                      borderTopColor: '#2a2f55',
                    }}>
                    <Text
                      style={{
                        color: '#e8456b',
                        fontFamily: 'monospace',
                        fontSize: 14,
                      }}>
                      {item.password}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
