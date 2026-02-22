import { Tabs } from 'expo-router';
import { Home, Shield, Heart, Plus } from 'lucide-react-native';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1f3d',
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarActiveTintColor: '#e8456b',
        tabBarInactiveTintColor: '#6b7199',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vault"
        options={{
          title: 'Vault',
          tabBarIcon: ({ color, size }) => <Shield size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarIcon: () => (
            <View
              style={{
                backgroundColor: '#e8456b',
                width: 52,
                height: 52,
                borderRadius: 26,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
                shadowColor: '#e8456b',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 8,
              }}>
              <Plus size={26} color="#fff" strokeWidth={3} />
            </View>
          ),
          tabBarButton: (props) => {
              const { delayLongPress, ...rest } = props as any;
              return (
                <TouchableOpacity
                  {...rest}
                  onPress={() => router.push('/add-password')}
                  activeOpacity={0.7}
                />
              );
            },
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="generator"
        options={{
          title: 'Generator',
          tabBarIcon: ({ color, size }) => (
            <Shield size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
