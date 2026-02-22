import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
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
  Eye,
  EyeOff,
  Copy,
  Lock,
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
  website_url: string;
  category: string;
  notes: string;
  is_favorite: boolean;
  created_at: string;
};

type Stats = {
  total: number;
  favorites: number;
  categories: Record<string, number>;
  healthScore: number;
};

export default function HomeScreen() {
  const router = useRouter();
  const [stats, setStats] = React.useState<Stats>({
    total: 0,
    favorites: 0,
    categories: {},
    healthScore: 100,
  });
  const [recentPasswords, setRecentPasswords] = React.useState<Password[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [visiblePasswords, setVisiblePasswords] = React.useState<Set<string>>(
    new Set()
  );

  const fetchData = async () => {
    try {
      const [statsRes, passwordsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/stats`),
        fetch(`${BACKEND_URL}/passwords`),
      ]);
      const statsData = await statsRes.json();
      const passwordsData = await passwordsRes.json();
      setStats(statsData);
      setRecentPasswords(passwordsData.slice(0, 5));
    } catch (e) {
      console.error('Failed to fetch data:', e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const healthColor =
    stats.healthScore >= 80
      ? '#00B894'
      : stats.healthScore >= 50
        ? '#FDCB6E'
        : '#E17055';

  const screenWidth = Dimensions.get('window').width;
  const healthAngle = (stats.healthScore / 100) * 360;

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: '#0f1332' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Header */}
      <View style={{ paddingTop: 55, paddingHorizontal: 20, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: '#8b90b5', fontSize: 14 }}>Welcome to</Text>
            <Text style={{ color: '#fff', fontSize: 26, fontWeight: '700' }}>
              PassPocket
            </Text>
          </View>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: '#1e2450',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Lock size={20} color="#e8456b" />
          </View>
        </View>
      </View>

      {/* Health Score Card */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <View
          style={{
            backgroundColor: '#1a1f45',
            borderRadius: 20,
            padding: 24,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#8b90b5', fontSize: 13, marginBottom: 4 }}>
              Password Health
            </Text>
            <Text
              style={{ color: healthColor, fontSize: 42, fontWeight: '800' }}>
              {stats.healthScore}%
            </Text>
            <Text style={{ color: '#8b90b5', fontSize: 12, marginTop: 4 }}>
              {stats.healthScore >= 80
                ? 'Your passwords are strong'
                : stats.healthScore >= 50
                  ? 'Some passwords need attention'
                  : 'Update weak passwords'}
            </Text>
          </View>
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              borderWidth: 6,
              borderColor: '#2a2f55',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                borderWidth: 6,
                borderColor: healthColor,
                borderTopColor:
                  healthAngle > 90 ? healthColor : 'transparent',
                borderRightColor:
                  healthAngle > 180 ? healthColor : 'transparent',
                borderBottomColor:
                  healthAngle > 270 ? healthColor : 'transparent',
                borderLeftColor: healthColor,
                position: 'absolute',
                transform: [{ rotate: '-90deg' }],
              }}
            />
            <Shield size={28} color={healthColor} />
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          marginBottom: 24,
          gap: 12,
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: '#1a1f45',
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
          }}
          onPress={() => router.push('/(tabs)/vault')}>
          <Text style={{ color: '#e8456b', fontSize: 28, fontWeight: '800' }}>
            {stats.total}
          </Text>
          <Text style={{ color: '#8b90b5', fontSize: 12, marginTop: 4 }}>
            Total Passwords
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: '#1a1f45',
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
          }}
          onPress={() => router.push('/(tabs)/favorites')}>
          <Text style={{ color: '#FDCB6E', fontSize: 28, fontWeight: '800' }}>
            {stats.favorites}
          </Text>
          <Text style={{ color: '#8b90b5', fontSize: 12, marginTop: 4 }}>
            Favorites
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            backgroundColor: '#1a1f45',
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
          }}>
          <Text style={{ color: '#6C5CE7', fontSize: 28, fontWeight: '800' }}>
            {Object.keys(stats.categories).length}
          </Text>
          <Text style={{ color: '#8b90b5', fontSize: 12, marginTop: 4 }}>
            Categories
          </Text>
        </View>
      </View>

      {/* Categories */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
            Categories
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/vault')}>
            <Text style={{ color: '#e8456b', fontSize: 13 }}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.entries(stats.categories).map(([cat, count]) => {
            const IconComp = CATEGORY_ICONS[cat] || Shield;
            const color = CATEGORY_COLORS[cat] || '#74B9FF';
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => router.push(`/(tabs)/vault?category=${cat}` as any)}
                style={{
                  backgroundColor: '#1a1f45',
                  borderRadius: 16,
                  padding: 16,
                  marginRight: 12,
                  width: 100,
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
                    marginBottom: 8,
                  }}>
                  <IconComp size={22} color={color} />
                </View>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}>
                  {cat}
                </Text>
                <Text style={{ color: '#8b90b5', fontSize: 11, marginTop: 2 }}>
                  {count} {count === 1 ? 'item' : 'items'}
                </Text>
              </TouchableOpacity>
            );
          })}
          {Object.keys(stats.categories).length === 0 && (
            <View
              style={{
                backgroundColor: '#1a1f45',
                borderRadius: 16,
                padding: 20,
                flex: 1,
                alignItems: 'center',
              }}>
              <Text style={{ color: '#8b90b5', fontSize: 13 }}>
                No categories yet. Add a password to get started!
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Recent Passwords */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
            Recent Passwords
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/vault')}>
            <Text style={{ color: '#e8456b', fontSize: 13 }}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentPasswords.length === 0 ? (
          <View
            style={{
              backgroundColor: '#1a1f45',
              borderRadius: 16,
              padding: 30,
              alignItems: 'center',
            }}>
            <Shield size={40} color="#2a2f55" />
            <Text
              style={{
                color: '#8b90b5',
                fontSize: 14,
                marginTop: 12,
                textAlign: 'center',
              }}>
              No passwords saved yet.{'\n'}Tap + to add your first password!
            </Text>
          </View>
        ) : (
          recentPasswords.map((item) => {
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
                    style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: '#8b90b5', fontSize: 12, marginTop: 2 }}>
                    {item.username || item.email}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => togglePasswordVisibility(item.id)}
                  style={{ padding: 6 }}>
                  {isVisible ? (
                    <EyeOff size={18} color="#8b90b5" />
                  ) : (
                    <Eye size={18} color="#8b90b5" />
                  )}
                </TouchableOpacity>
                <ChevronRight size={18} color="#8b90b5" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}
