import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
} from 'lucide-react-native';
import { BACKEND_URL } from '@/lib/api';

const CATEGORIES = [
  { value: 'social', label: 'Social Media' },
  { value: 'finance', label: 'Finance' },
  { value: 'email', label: 'Email' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'work', label: 'Work' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'apps', label: 'Apps' },
  { value: 'other', label: 'Other' },
];

function generatePassword(length = 16): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export default function AddPasswordScreen() {
  const router = useRouter();
  const [title, setTitle] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [websiteUrl, setWebsiteUrl] = React.useState('');
  const [category, setCategory] = React.useState('other');
  const [notes, setNotes] = React.useState('');
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/passwords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
          website_url: websiteUrl.trim(),
          category,
          notes: notes.trim(),
          is_favorite: isFavorite,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0f1332' }}>
      {/* Header */}
      <View
        style={{
          paddingTop: 55,
          paddingHorizontal: 20,
          paddingBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#1a1f45',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 14,
          }}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>
            Add Password
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {/* Title */}
        <Text
          style={{
            color: '#8b90b5',
            fontSize: 13,
            marginBottom: 6,
            marginTop: 10,
          }}>
          Title *
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Instagram, Gmail"
          placeholderTextColor="#4a4f75"
          style={{
            backgroundColor: '#1a1f45',
            borderRadius: 12,
            padding: 14,
            color: '#fff',
            fontSize: 15,
            marginBottom: 16,
          }}
        />

        {/* Username */}
        <Text style={{ color: '#8b90b5', fontSize: 13, marginBottom: 6 }}>
          Username
        </Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="e.g. john_doe"
          placeholderTextColor="#4a4f75"
          autoCapitalize="none"
          style={{
            backgroundColor: '#1a1f45',
            borderRadius: 12,
            padding: 14,
            color: '#fff',
            fontSize: 15,
            marginBottom: 16,
          }}
        />

        {/* Email */}
        <Text style={{ color: '#8b90b5', fontSize: 13, marginBottom: 6 }}>
          Email
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="e.g. john@email.com"
          placeholderTextColor="#4a4f75"
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            backgroundColor: '#1a1f45',
            borderRadius: 12,
            padding: 14,
            color: '#fff',
            fontSize: 15,
            marginBottom: 16,
          }}
        />

        {/* Password */}
        <Text style={{ color: '#8b90b5', fontSize: 13, marginBottom: 6 }}>
          Password *
        </Text>
        <View
          style={{
            backgroundColor: '#1a1f45',
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            placeholderTextColor="#4a4f75"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            style={{
              flex: 1,
              padding: 14,
              color: '#fff',
              fontSize: 15,
            }}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ padding: 14 }}>
            {showPassword ? (
              <EyeOff size={18} color="#8b90b5" />
            ) : (
              <Eye size={18} color="#8b90b5" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPassword(generatePassword())}
            style={{ padding: 14 }}>
            <RefreshCw size={18} color="#e8456b" />
          </TouchableOpacity>
        </View>

        {/* Website URL */}
        <Text style={{ color: '#8b90b5', fontSize: 13, marginBottom: 6 }}>
          Website URL
        </Text>
        <TextInput
          value={websiteUrl}
          onChangeText={setWebsiteUrl}
          placeholder="e.g. https://instagram.com"
          placeholderTextColor="#4a4f75"
          autoCapitalize="none"
          keyboardType="url"
          style={{
            backgroundColor: '#1a1f45',
            borderRadius: 12,
            padding: 14,
            color: '#fff',
            fontSize: 15,
            marginBottom: 16,
          }}
        />

        {/* Category */}
        <Text style={{ color: '#8b90b5', fontSize: 13, marginBottom: 6 }}>
          Category
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 16,
          }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              onPress={() => setCategory(cat.value)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor:
                  category === cat.value ? '#e8456b' : '#1a1f45',
              }}>
              <Text
                style={{
                  color: category === cat.value ? '#fff' : '#8b90b5',
                  fontSize: 13,
                  fontWeight: '600',
                }}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <Text style={{ color: '#8b90b5', fontSize: 13, marginBottom: 6 }}>
          Notes
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any notes..."
          placeholderTextColor="#4a4f75"
          multiline
          numberOfLines={3}
          style={{
            backgroundColor: '#1a1f45',
            borderRadius: 12,
            padding: 14,
            color: '#fff',
            fontSize: 15,
            marginBottom: 16,
            minHeight: 80,
            textAlignVertical: 'top',
          }}
        />

        {/* Favorite Toggle */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#1a1f45',
            borderRadius: 12,
            padding: 14,
            marginBottom: 24,
          }}>
          <Text style={{ color: '#fff', fontSize: 15 }}>
            Add to Favorites
          </Text>
          <Switch
            value={isFavorite}
            onValueChange={setIsFavorite}
            trackColor={{ false: '#2a2f55', true: '#e8456b' }}
            thumbColor="#fff"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={{
            backgroundColor: '#e8456b',
            borderRadius: 14,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            opacity: saving ? 0.6 : 1,
            shadowColor: '#e8456b',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}>
          <Shield size={20} color="#fff" />
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: '700',
            }}>
            {saving ? 'Saving...' : 'Save Password'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
