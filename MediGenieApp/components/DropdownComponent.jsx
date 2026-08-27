import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/constants';

const DropdownComponent = ({
  label = 'Dropdown Label',
  placeholder = 'Select item',
  onSelect,
  errorBorder,
  startLeft,
  data,
}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}

      <Dropdown
        style={[
          styles.dropdown,
          {
            backgroundColor: isFocus ? '#262626' : colors.black1,
            borderColor: errorBorder ? colors.fail : colors.blue1,
          },
        ]}
        placeholderStyle={[
          styles.placeholderStyle,
          { paddingLeft: startLeft ? 0 : 56 },
        ]}
        selectedTextStyle={[
          styles.selectedTextStyle,
          { paddingLeft: startLeft ? 0 : 56 },
        ]}
        containerStyle={styles.containerStyle}
        itemTextStyle={styles.itemTextStyle}
        itemContainerStyle={styles.itemContainerStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          onSelect && onSelect(item.value);
          setIsFocus(false);
        }}
        renderRightIcon={() => (
          <Ionicons
            name="chevron-down-outline"
            size={20}
            color={isFocus ? colors.blue1 : '#6B7280'}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: 8,
  },
  label: {
    paddingLeft: 16,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  dropdown: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  placeholderStyle: {
    fontSize: 16,
    color: colors.lightGrey,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#fff',
  },
  containerStyle: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.blue1,
    marginTop: -10,
    backgroundColor: '#1f1f1f',
  },
  itemTextStyle: {
    fontSize: 14,
    color: '#fff',
  },
  itemContainerStyle: {
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2c',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});

export default DropdownComponent;
