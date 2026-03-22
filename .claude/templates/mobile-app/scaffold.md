# Mobile App Scaffold (React Native / Expo)

## Command
```bash
npx create-expo-app@latest [app-name] --template blank-typescript
```

## Directory Structure
```
src/
  app/                  ← Expo Router (file-based routing)
    _layout.tsx         ← Root layout
    (tabs)/
      _layout.tsx       ← Tab navigator layout
      index.tsx         ← Home tab
      search.tsx        ← Search tab
      profile.tsx       ← Profile tab
    (auth)/
      login.tsx
      signup.tsx
    [id].tsx            ← Dynamic detail screen
  components/
    ui/                 ← Base components (Button, Input, Card)
    layout/             ← Layout wrappers (SafeArea, ScrollView)
    features/           ← Feature-specific components
  lib/
    api.ts              ← API client
    auth.ts             ← Auth utilities
    storage.ts          ← AsyncStorage helpers
    utils.ts
  hooks/
    use-auth.ts
    use-api.ts
  types/
    index.ts
  constants/
    colors.ts           ← Color tokens
    layout.ts           ← Spacing, sizes
```

## Default Dependencies
```json
{
  "dependencies": {
    "expo": "latest",
    "expo-router": "latest",
    "react-native": "latest",
    "react-native-safe-area-context": "latest",
    "react-native-screens": "latest",
    "@expo/vector-icons": "latest",
    "zustand": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "@types/react": "latest"
  }
}
```

## Screens to Build (from vision)
Map user's screens to tab structure. Common mobile patterns:
- Bottom tabs: Home, Search/Explore, Create/Add, Notifications, Profile
- Stack screens within each tab for detail views
- Auth screens: Login, Signup, Forgot Password
