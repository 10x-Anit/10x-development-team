# Expo + React Native Reference

## Setup
```bash
npx create-expo-app@latest my-app --template blank-typescript
cd my-app
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants
```

## File-based Routing (Expo Router)
```
app/
  _layout.tsx          → Root layout
  index.tsx            → Home (/)
  (tabs)/
    _layout.tsx        → Tab navigator
    index.tsx          → First tab
    profile.tsx        → Profile tab
  [id].tsx             → Dynamic route (/123)
  (auth)/
    login.tsx
    signup.tsx
```

## Tab Navigator
```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#3b82f6' }}>
      <Tabs.Screen name="index" options={{
        title: 'Home',
        tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Profile',
        tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />
      }} />
    </Tabs>
  )
}
```

## Screen Pattern
```tsx
// app/(tabs)/index.tsx
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Home</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
})
```

## Navigation
```tsx
import { Link, useRouter } from 'expo-router'

// Declarative
<Link href="/profile">Go to Profile</Link>

// Programmatic
const router = useRouter()
router.push('/profile')
router.replace('/login')
router.back()
```

## Common Packages
```bash
npx expo install expo-image          # Optimized images
npx expo install expo-secure-store   # Secure storage (tokens)
npx expo install expo-haptics        # Haptic feedback
npx expo install expo-camera         # Camera access
```
