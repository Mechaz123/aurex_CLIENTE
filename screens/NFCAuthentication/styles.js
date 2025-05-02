import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    color: colors.background,
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 80,
  },
  text: {
    color: colors.background,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 80,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    width: '100%',
  },
  text_button: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
