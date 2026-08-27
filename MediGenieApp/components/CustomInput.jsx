import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/constants';
import { Text } from '@react-navigation/elements';

const CustomInput = ({
  placeholder,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  value,
  onChangeText,
  keyboardType = 'default',
  onBlur,
  onFocus,
  errorBorder,
  legendText,
  startLeft,
  minLength,
  ...props
}) => {
  const [inputBgColor, setInputBgColor] = useState(colors.black1);

  const customOnBlur = (e) => {
    setInputBgColor(colors.black1);
    if (onBlur) onBlur(e);
  };

  const customOnFocus = (e) => {
    setInputBgColor('#262626');
    if (onFocus) onFocus(e);
  };

  return (
    <View style={styles.wrapper}>
      {/* Legend Label */}
      {legendText && (
        <View style={styles.legendWrapper}>
          <Text style={styles.legendText}>{legendText}</Text>
        </View>
      )}

      <View style={styles.inputWrapper}>
        {/* Left Icon */}
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={22}
            color={colors.lightGrey}
            style={styles.leftIcon}
          />
        )}

        {/* Input Field */}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.lightGrey}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          keyboardAppearance="default"
          minLength={minLength}
          style={[
            styles.input,
            {
              backgroundColor: inputBgColor,
              borderColor: errorBorder ? colors.fail : colors.blue1,
              paddingLeft: startLeft ? 24 : 48,
            },
          ]}
          onBlur={customOnBlur}
          onFocus={customOnFocus}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons name={rightIcon} size={22} color={colors.lightGrey} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    marginTop: 16,
  },
  legendWrapper: {
    paddingLeft: 24,
  },
  legendText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 999,
    paddingRight: 48,
    paddingVertical: 8,
    fontSize: 16,
    color: '#fff',
  },
  leftIcon: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 20,
    zIndex: 2,
  },
});

export default CustomInput;
