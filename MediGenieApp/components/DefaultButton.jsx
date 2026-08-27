import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/constants';

const DefaultButton = ({
  onPress,
  title,
  children,
  fill,
  border,
  textWhite,
  thinPadding,
  icon,
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.button,
        fill ? { backgroundColor: colors.blue1 } : { backgroundColor: colors.black1 },
        border ? { borderWidth: 1, borderColor: colors.blue1 } : null,
        thinPadding ? { paddingVertical: 6, paddingHorizontal: 12 } : null,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          textWhite ? { color: '#fff' } : { color: colors.black1 },
          thinPadding ? { fontSize: 14 } : { fontSize: 16 },
        ]}
      >
        {children || title}
      </Text>

      {icon ? (
        <Ionicons name={icon} color={'#ffffff'} size={16} style={{ marginLeft: 6 }} />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DefaultButton;
