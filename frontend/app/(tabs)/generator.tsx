import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import {
  RefreshCw,
  Copy,
  Check,
  Shield,
} from 'lucide-react-native';

function generatePassword(
  length: number,
  uppercase: boolean,
  lowercase: boolean,
  numbers: boolean,
  symbols: boolean
): string {
  let chars = '';
  if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) chars += '0123456789';
  if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function getStrength(password: string): { label: string; color: string; percent: number } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: 'Weak', color: '#E17055', percent: 25 };
  if (score <= 4) return { label: 'Fair', color: '#FDCB6E', percent: 50 };
  if (score <= 5) return { label: 'Good', color: '#74B9FF', percent: 75 };
  return { label: 'Strong', color: '#00B894', percent: 100 };
}

export default function GeneratorScreen() {
  const [length, setLength] = React.useState(16);
  const [uppercase, setUppercase] = React.useState(true);
  const [lowercase, setLowercase] = React.useState(true);
  const [numbers, setNumbers] = React.useState(true);
  const [symbols, setSymbols] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    regenerate();
  }, [length, uppercase, lowercase, numbers, symbols]);

  const regenerate = () => {
    const newPass = generatePassword(
      length,
      uppercase,
      lowercase,
      numbers,
      symbols
    );
    setPassword(newPass);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(password);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      Alert.alert('Password', password);
    }
  };

  const strength = getStrength(password);

  const lengths = [8, 12, 16, 20, 24, 32];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0f1332' }}>
      <View style={{ paddingTop: 55, paddingHorizontal: 20, paddingBottom: 10 }}>
        <Text style={{ color: '#fff', fontSize: 26, fontWeight: '700' }}>
          Password Generator
        </Text>
        <Text style={{ color: '#8b90b5', fontSize: 13, marginTop: 2 }}>
          Generate strong, unique passwords
        </Text>
      </View>

      {/* Generated Password */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24, marginTop: 10 }}>
        <View
          style={{
            backgroundColor: '#1a1f45',
            borderRadius: 20,
            padding: 24,
          }}>
          <Text
            style={{
              color: '#fff',
              fontFamily: 'monospace',
              fontSize: 18,
              textAlign: 'center',
              letterSpacing: 1.5,
              lineHeight: 28,
            }}
            selectable>
            {password}
          </Text>

          {/* Strength bar */}
          <View style={{ marginTop: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
              <Text style={{ color: '#8b90b5', fontSize: 12 }}>Strength</Text>
              <Text
                style={{
                  color: strength.color,
                  fontSize: 12,
                  fontWeight: '700',
                }}>
                {strength.label}
              </Text>
            </View>
            <View
              style={{
                height: 6,
                backgroundColor: '#2a2f55',
                borderRadius: 3,
              }}>
              <View
                style={{
                  height: 6,
                  width: `${strength.percent}%`,
                  backgroundColor: strength.color,
                  borderRadius: 3,
                }}
              />
            </View>
          </View>

          {/* Actions */}
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              marginTop: 20,
            }}>
            <TouchableOpacity
              onPress={regenerate}
              style={{
                flex: 1,
                backgroundColor: '#2a2f55',
                borderRadius: 12,
                paddingVertical: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}>
              <RefreshCw size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>
                Regenerate
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={copyToClipboard}
              style={{
                flex: 1,
                backgroundColor: '#e8456b',
                borderRadius: 12,
                paddingVertical: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}>
              {copied ? (
                <Check size={18} color="#fff" />
              ) : (
                <Copy size={18} color="#fff" />
              )}
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>
                {copied ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Length Selector */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: '700',
            marginBottom: 12,
          }}>
          Password Length: {length}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {lengths.map((len) => (
            <TouchableOpacity
              key={len}
              onPress={() => setLength(len)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: length === len ? '#e8456b' : '#1a1f45',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: length === len ? '#fff' : '#8b90b5',
                  fontSize: 13,
                  fontWeight: '600',
                }}>
                {len}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Options */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: '700',
            marginBottom: 12,
          }}>
          Character Types
        </Text>
        <View
          style={{
            backgroundColor: '#1a1f45',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
          {[
            { label: 'Uppercase (A-Z)', value: uppercase, setter: setUppercase },
            { label: 'Lowercase (a-z)', value: lowercase, setter: setLowercase },
            { label: 'Numbers (0-9)', value: numbers, setter: setNumbers },
            {
              label: 'Symbols (!@#$%)',
              value: symbols,
              setter: setSymbols,
            },
          ].map((opt, i) => (
            <View
              key={opt.label}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: i < 3 ? 1 : 0,
                borderBottomColor: '#2a2f55',
              }}>
              <Text style={{ color: '#fff', fontSize: 14 }}>{opt.label}</Text>
              <Switch
                value={opt.value}
                onValueChange={opt.setter}
                trackColor={{ false: '#2a2f55', true: '#e8456b' }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
