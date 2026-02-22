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
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  Shield,
  Globe,
  CreditCard,
  Wifi,
  Smartphone,
  MoreHorizontal,
  Heart,
  Edit3,
  Save,
  ExternalLink,
} from 'lucide-react-native';
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
  { value: 'social', label: 'Social Media' },
  { value: 'finance', label: 'Finance' },
  { value: 'email', label: 'Email' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'work', label: 'Work' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'apps', label: 'Apps' },
  { value: 'other', label: 'Other' },
];

type PasswordData = {
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
  updated_at: string;
};

export default function PasswordDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = React.useState<PasswordData | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [copied, setCopied] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  // Edit fields
  const [title, setTitle] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [websiteUrl, setWebsiteUrl] = React.useState('');
  const [category, setCategory] = React.useState('other');
  const [notes, setNotes] = React.useState('');
  const [isFavorite, setIsFavorite] = React.useState(false);

  const fetchPassword = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/passwords/${id}`);
      const d = await res.json();
      setData(d);
      setTitle(d.title);
      setUsername(d.username || '');
      setEmail(d.email || '');
      setPassword(d.password);
      setWebsiteUrl(d.website_url || '');
      setCategory(d.category);
      setNotes(d.notes || '');
      setIsFavorite(d.is_favorite);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    if (id) fetchPassword();
  }, [id]);

  const copyField = async (value: string, field: string) => {
    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(value);
      }
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      Alert.alert(field, value);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !password.trim()) {
      Alert.alert('Error', 'Title and password are required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/passwords/${id}`, {
        method: 'PUT',
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
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setData(updated);
      setEditing(false);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Password', `Delete "${data?.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await fetch(`${BACKEND_URL}/passwords/${id}`, {
              method: 'DELETE',
            });
            router.back();
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  const toggleFavorite = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/passwords/${id}/favorite`, {
        method: 'PATCH',
      });
      const updated = await res.json();
      setData(updated);
      setIsFavorite(updated.is_favorite);
    } catch (e) {
      console.error(e);
    }
  };

  if (!data) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0f1332',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ color: '#8b90b5' }}>Loading...</Text>
      </View>
    );
  }

  const IconComp = CATEGORY_ICONS[data.category] || Shield;
  const color = CATEGORY_COLORS[data.category] || '#74B9FF';

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          justifyContent: 'space-between',
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
          }}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPress={toggleFavorite}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#1a1f45',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Heart
              size={18}
              color={data.is_favorite ? '#e8456b' : '#8b90b5'}
              fill={data.is_favorite ? '#e8456b' : 'none'}
            />
          </TouchableOpacity>
          {!editing ? (
            <TouchableOpacity
              onPress={() => setEditing(true)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#1a1f45',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Edit3 size={18} color="#e8456b" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#e8456b',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Save size={18} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleDelete}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#1a1f45',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Trash2 size={18} color="#E17055" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {/* Title Card */}
        <View
          style={{
            backgroundColor: '#1a1f45',
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: `${color}20`,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 14,
            }}>
            <IconComp size={30} color={color} />
          </View>
          {editing ? (
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={{
                color: '#fff',
                fontSize: 22,
                fontWeight: '700',
                textAlign: 'center',
                backgroundColor: '#2a2f55',
                borderRadius: 8,
                padding: 8,
                width: '100%',
              }}
            />
          ) : (
            <Text
              style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>
              {data.title}
            </Text>
          )}
          <Text
            style={{
              color: '#8b90b5',
              fontSize: 13,
              marginTop: 6,
              textTransform: 'capitalize',
            }}>
            {data.category}
          </Text>
        </View>

        {/* Fields */}
        {editing ? (
          <>
            <FieldInput label="Username" value={username} onChange={setUsername} />
            <FieldInput label="Email" value={email} onChange={setEmail} />
            <View>
              <Text
                style={{
                  color: '#8b90b5',
                  fontSize: 13,
                  marginBottom: 6,
                }}>
                Password
              </Text>
              <View
                style={{
                  backgroundColor: '#1a1f45',
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 14,
                }}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
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
              </View>
            </View>
            <FieldInput label="Website URL" value={websiteUrl} onChange={setWebsiteUrl} />
            <Text
              style={{
                color: '#8b90b5',
                fontSize: 13,
                marginBottom: 6,
              }}>
              Category
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 14,
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
                      color:
                        category === cat.value ? '#fff' : '#8b90b5',
                      fontSize: 13,
                      fontWeight: '600',
                    }}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <FieldInput
              label="Notes"
              value={notes}
              onChange={setNotes}
              multiline
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#1a1f45',
                borderRadius: 12,
                padding: 14,
                marginBottom: 14,
              }}>
              <Text style={{ color: '#fff', fontSize: 15 }}>Favorite</Text>
              <Switch
                value={isFavorite}
                onValueChange={setIsFavorite}
                trackColor={{ false: '#2a2f55', true: '#e8456b' }}
                thumbColor="#fff"
              />
            </View>
          </>
        ) : (
          <>
            <DetailRow
              label="Username"
              value={data.username}
              onCopy={() => copyField(data.username, 'username')}
              copied={copied === 'username'}
            />
            <DetailRow
              label="Email"
              value={data.email}
              onCopy={() => copyField(data.email, 'email')}
              copied={copied === 'email'}
            />
            <View
              style={{
                backgroundColor: '#1a1f45',
                borderRadius: 14,
                padding: 16,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  color: '#8b90b5',
                  fontSize: 12,
                  marginBottom: 6,
                }}>
                Password
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    flex: 1,
                    color: '#fff',
                    fontSize: 15,
                    fontFamily: showPassword ? 'monospace' : undefined,
                  }}>
                  {showPassword ? data.password : '\u2022'.repeat(12)}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ padding: 6 }}>
                  {showPassword ? (
                    <EyeOff size={16} color="#8b90b5" />
                  ) : (
                    <Eye size={16} color="#8b90b5" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => copyField(data.password, 'password')}
                  style={{ padding: 6 }}>
                  {copied === 'password' ? (
                    <Check size={16} color="#00B894" />
                  ) : (
                    <Copy size={16} color="#8b90b5" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            {data.website_url ? (
              <DetailRow
                label="Website"
                value={data.website_url}
                onCopy={() => copyField(data.website_url, 'website')}
                copied={copied === 'website'}
              />
            ) : null}
            {data.notes ? (
              <View
                style={{
                  backgroundColor: '#1a1f45',
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    color: '#8b90b5',
                    fontSize: 12,
                    marginBottom: 6,
                  }}>
                  Notes
                </Text>
                <Text style={{ color: '#fff', fontSize: 15 }}>
                  {data.notes}
                </Text>
              </View>
            ) : null}
          </>
        )}

        {/* Meta info */}
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: '#4a4f75', fontSize: 12, textAlign: 'center' }}>
            Created: {formatDate(data.created_at)}
          </Text>
          {data.updated_at !== data.created_at && (
            <Text
              style={{
                color: '#4a4f75',
                fontSize: 12,
                textAlign: 'center',
                marginTop: 4,
              }}>
              Updated: {formatDate(data.updated_at)}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function DetailRow({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
}) {
  if (!value) return null;
  return (
    <View
      style={{
        backgroundColor: '#1a1f45',
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
      }}>
      <Text
        style={{ color: '#8b90b5', fontSize: 12, marginBottom: 6 }}>
        {label}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={{ flex: 1, color: '#fff', fontSize: 15 }}
          selectable>
          {value}
        </Text>
        <TouchableOpacity onPress={onCopy} style={{ padding: 6 }}>
          {copied ? (
            <Check size={16} color="#00B894" />
          ) : (
            <Copy size={16} color="#8b90b5" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={{
          color: '#8b90b5',
          fontSize: 13,
          marginBottom: 6,
        }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        style={{
          backgroundColor: '#1a1f45',
          borderRadius: 12,
          padding: 14,
          color: '#fff',
          fontSize: 15,
          ...(multiline ? { minHeight: 80, textAlignVertical: 'top' as any } : {}),
        }}
      />
    </View>
  );
}
