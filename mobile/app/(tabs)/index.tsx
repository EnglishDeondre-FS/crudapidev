import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <div>
      <span>test</span>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A1CEDC', // Example background color
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  reactLogo: {
    width: 200,
    height: 120,
  },
});