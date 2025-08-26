//import { View, Text } from 'react-native'
//import React from 'react'
//import Home from './Home'
//import ArrowLeft from './ArrowLeft'
//import Call from './Call'
/* import Camera from './Camera'
import Comment from './Comment'
import Delete from './Delete'
import Edit from './Edit'
import Heart from './Heart'
import Image from './Image'
import Location from './Location'
import Lock from './Lock'
import Logout from './Logout'
import Mail from './Mail'
import Menu from './Threedots'
import Search from './Search'
import Sent from './Send'
import Share from './Share'
import User from './User'
import Video from './Video'
import Plus from './Plus' */



const icons = {
    arrowLeft:ArrowLeft,
    Call:Call,
    Camera:Camera,
    comment:Comment,
    delete:Delete,
    edit:Edit,
    heart:Heart,
    home:Home,
    Image:Image,
    location:Location,
    lock:Lock,
    logout:Logout,
    mail:Mail,
    menu:Menu,
    search:Search,
    send:Sent,
    share:Share,
    user:User,
    video:Video,
    plus:Plus,

}

const Icon = ({name,...props}) => {
    const Icon = icons[name]
  return (
    <Icon 
    height ={props.size || 24}
    width = {props.size ||24}
    strokeWidth={props.strokeWidth || 1.9}
    color='#009688'
    {...props}
    />
  )
}

export default Icon