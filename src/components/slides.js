// import React, { Component } from 'react';
// import { View, Text, Image, ScrollView, Dimensions, StatusBar } from 'react-native';
// import { Button } from 'react-native-elements';
//
// const SCREEN_WIDTH = Dimensions.get('window').width;
// const SCREEN_HEIGHT = Dimensions.get('window').height;
//
// const slideData = [
//   require('../../assets/images/tour_1.png'),
//   require('../../assets/images/tour_2.png'),
//   require('../../assets/images/tour_3.png'),
//   require('../../assets/images/tour_4.png'),
//   require('../../assets/images/tour_5.png')
// ]
//
// class Slides extends Component {
//   renderLastSlide(index) {
//     if (index === slideData.length - 1) {
//       return (
//         <View style={styles.overlay}>
//           <Button
//           title="GOT IT!"
//           fontWeight='bold'
//           backgroundColor='#27ae60'
//           raised
//           buttonStyle={styles.buttonStyle}
//           onPress={this.props.onComplete}
//           />
//         </View>
//       );
//     }
//     return (
//       <View style={styles.overlay}>
//         <StatusBar hidden />
//         <Text style={styles.swipeRight}>Swipe right for more...</Text>
//       </View>
//     )
//   }
//
//   renderSlides() {
//     return slideData.map((slide, index) => {
//       return (
//         <View
//           key={slide}
//           style={styles.container}
//         >
//           <Image source={slide} style={styles.slide}>
//             {this.renderLastSlide(index)}
//           </Image>
//         </View>
//       );
//     });
//   }
//
//   render() {
//     return (
//       <ScrollView
//         horizontal
//         style={{ flex: 1 }}
//         pagingEnabled
//       >
//         {this.renderSlides()}
//       </ScrollView>
//     );
//   }
// }
//
// const styles = {
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: SCREEN_WIDTH,
//     backgroundColor: '#ecf0f1'
//   },
//   slide: {
//     width: SCREEN_WIDTH * 0.90,
//     height: SCREEN_HEIGHT * 0.90,
//     marginTop: SCREEN_HEIGHT * 0.05,
//     marginBottom: SCREEN_HEIGHT * 0.05,
//     marginLeft: SCREEN_WIDTH * 0.05,
//     marginRight: SCREEN_WIDTH * 0.05,
//     borderWidth: 2,
//     borderColor: '#27ae60'
//   },
//   buttonStyle: {
//     backgroundColor: 'orange',
//     width: 250,
//     borderRadius: 5,
//     zIndex: 10,
//   },
//   overlay: {
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     flex: 1,
//     marginBottom: 30,
//     backgroundColor: 'transparent'
//   },
//   swipeRight: {
//     textShadowColor: 'black',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//     fontWeight: 'bold',
//     color: 'white',
//     fontSize: 22
//   }
// };
//
// export default Slides
