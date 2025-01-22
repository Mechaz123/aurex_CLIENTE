import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 60,
  },
  text: {
    color: colors.text_basic,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 80,
    textAlign: 'center',
  },
  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 80,
  },
});
