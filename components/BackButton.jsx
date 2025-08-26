import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import Icon from '../assets/icons/Icon'
import { theme } from '../helpers/theme'

const BackButton = ({size=26 ,navigation}) => {
  return (
    <Pressable onPress={() => navigation.goBack()} style={styles.button}>
        <Icon name='arrowLeft' strokeWidth={2.5} size={size} color={theme.colors.text} />
    </Pressable>
  )
}

export default BackButton

const styles = StyleSheet.create({
  button:{
    alignSelf:'flex-start',
    padding:5,
    borderRadius:theme.radius.sm,
    backgroundColor:'rgba(0,0,0,0.07)'
  }
})