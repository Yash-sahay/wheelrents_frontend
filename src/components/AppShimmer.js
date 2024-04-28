import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient)

const AppShimmer = ({children, visible, style}) => {
  return (
    <ShimmerPlaceHolder contentStyle={{borderRadius: 100}} visible={visible} style={visible ? null : style}>
        {children}
  </ShimmerPlaceHolder>
  )
}

export default AppShimmer