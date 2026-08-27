import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors } from '../utils/constants'
// import styled from 'styled-components'
// import { colors } from '../utils/colors'

// const StyledView = styled.View`
//     flex: 1;
//     padding: 30px;
//     backgroundColor: ${colors.black1};

export default function MainContainer(props) {
    // <StyledView {...props}>{props.children}</StyledView>
    return (
        <View styles={styles.container}>{props.children}</View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.black1,
        height: '100%',
        width: '100%',
        flex: 1,
        padding: 12,
        borderWidth: 5,
        borderColor: 'red',
    }
})