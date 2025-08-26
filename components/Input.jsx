import { ProgressBarAndroidComponent, StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import { hp, wp } from '../helpers/common'
import { theme } from '../helpers/theme'
const Input = (props) => {
  return (
    <View style={[styles.container, props.containerStyle && props.containerStyle]}>
      {
        props.icon && props.icon
      }
      <TextInput 
      style={{flex:1}}
      placeholderTextColor={theme.colors.textLight}
      ref={props.inputRef && props.inputRef} 
      {...props}/>
      
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        
        justifyContent  :'center',
        height: hp(7.2),
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: theme.colors.text,
        borderRadius: 24,
        gap: 12,
        paddingHorizontal:18,
        borderCurve:'continuous',

    }
})