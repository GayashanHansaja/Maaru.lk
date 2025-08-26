import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { hp,wp } from '../helpers/common'
import { theme } from '../helpers/theme'
//import Loading from './Loading'

const Button = ({
  buttonStyle,
  textStyle,
  title='',
  onPress=()=>{},
  loading=false,
  hasShadow=true,
}) => {
  const shadowStyle = {
    shadowColor: theme.colors.primaryDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
  if(loading){
    return (
      <View style={[styles.button , buttonStyle , {backgroundColor:'transparent'}]}>
        <Loading/>
      </View> 
    )
  }
    
  return (
    <Pressable style={[ styles.button, buttonStyle, hasShadow && shadowStyle]} onPress={onPress} disabled={loading}>
      <Text style={[styles.text, textStyle]}> {title}</Text>
    </Pressable>  
  )
}

export default Button

const styles = StyleSheet.create({
  button:{

    backgroundColor:'#009688',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderCurve: 'continuous',
    height: hp(6),

  },

  text:{
    color: 'white',
    fontSize:20,
    fontWeight: theme.fonts.bold,
  }
})