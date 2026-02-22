import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Shield,
  Globe,
  CreditCard,
  Wifi,
  Smartphone,
  MoreHorizontal,
  ChevronRight,
  Heart,
  Eye,
  EyeOff,
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

type Password = {
  id: string;
  title: string;
  username: string;
  email: string;
  password: string;
  category: string;
  is_favorite: boolean;
};

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = React.useState<Password[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [visiblePasswords, setVisiblePasswords] = React.useState<Set<string>>(
    new Set()
  );

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/passwords?favorite=true`);
      const data = await res.json();
      setFavorites(data);
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const toggleFavorite = async (id: string) => {
    try {
      await fetch(`${BACKEND_URL}/passwords/${id}/favorite`, {
        method: 'PATCH',
      });
      fetchFavorites();
    } catch (e) {
      console.error(e);
    }
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
      <View style={{ paddingTop: 55, paddingHorizontal: 20, paddingBottom: 10 }}>
        <Text style={{ color: '#fff', fontSize: 26, fontWeight: '700' }}>
          Favorites
        </Text>
        <Text style={{ color: '#8b90b5', fontSize: 13, marginTop: 2 }}>
          {favorites.length} favorite passwords
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {favorites.length === 0 ? (
          <View
            style={{
              backgroundColor: '#1a1f45',
              borderRadius: 16,
              padding: 40,
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Heart size={48} color="#2a2f55" />
            <Text
              style={{
                color: '#8b90b5',
                fontSize: 15,
                marginTop: 14,
                textAlign: 'center',
              }}>
              No favorites yet.{'\n'}Tap the heart icon to favorite a password.
            </Text>
          </View>
        ) : (
          favorites.map((item) => {
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
                  style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                    <Heart size={16} color="#e8456b" fill="#e8456b" />
                  </TouchableOpacity>
                  <ChevronRight
                    size={16}
                    color="#8b90b5"
                    style={{ marginLeft: 2 }}
                  />
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
