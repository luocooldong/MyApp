import React, { Component } from 'react'
import { View, Text, Button } from 'react-native'
import { 
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator,
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation'
import AuthScreen from './src/screens/Auth/Auth'
import SideDrawer from './src/screens/SideDrawer/SideDrawer'
import Icon from "react-native-vector-icons/Ionicons";

/**
 * - AppSwitchNavigator
 *    - WelcomeScreen
 *      - Login Button
 *      - Sign Up Button
 *    - AppDrawerNavigator
 *          - Dashboard - DashboardStackNavigator(needed for header and to change the header based on the                     tab)
 *            - DashboardTabNavigator
 *              - Tab 1 - FeedStack
 *              - Tab 2 - ProfileStack
 *              - Tab 3 - SettingsStack
 *            - Any files you don't want to be a part of the Tab Navigator can go here.
 */


class WelcomeScreen extends Component{
  render(){
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <Text>WelcomeScreen</Text>
        <Button title="Login" onPress={() => this.props.navigation.navigate('Dashboard')} />
        <Button title="Sign Up" onPress={() => alert('button pressed')} />
      </View>
    );
  }
}


class DashboardScreen extends Component{
  render(){
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <Text>DashboardScreen</Text>
      </View>
    );
  }
}



class Feed extends Component{
  render(){
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <Button title="Go To Detail Screen" onPress={() => this.props.navigation.navigate('Detail')} />
      </View>
    );
  }
}


class Profile extends Component{
  render(){
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <Text>Profile</Text>
      </View>
    );
  }
}


class Settings extends Component{
  render(){
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <Text>Settings</Text>
      </View>
    );
  }
}


class Detail extends Component{
  render(){
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <Text>Detail</Text>
      </View>
    );
  }
}

const FeedStack = createStackNavigator(
  {
    Feed: {
      screen: Feed,
      navigationOptions: ({ navigation }) => {
        return {
          headerTitle: 'Feed',
          headerLeft: (
            <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
          )
        };
      }
    },
    Detail: {
      screen: Detail
    }
  },
  {
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
);

const ProfileStack = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Profile',
        headerLeft: (
          <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
        )
      };
    }
  }
});

const SettingsStack = createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Settings',
        headerLeft: (
          <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
        )
      };
    }
  }
});

const DashboardTabNavigator = createBottomTabNavigator(
  {
    FeedStack,
    ProfileStack,
    SettingsStack
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return {
        header: null,
        headerTitle: routeName
      };
    }
  }
);

const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: DashboardTabNavigator
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerLeft: (
          <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
        )
      };
    }
  }
);

const AppDrawerNavigator = createDrawerNavigator({
  Dashboard: {
    screen: DashboardStackNavigator
  }
});

const AppSwitchNavigator = createSwitchNavigator({
  Welcome: { screen: WelcomeScreen },
  Dashboard: { screen: AppDrawerNavigator }
})

// const AppNavigator = createStackNavigator(
//   {
//     Home: AuthScreen,
//     SideDrawer: SideDrawer
//   },
//   {
//     initialRouteName: 'Home'
//   }
// )

const AppContainer = createAppContainer(AppSwitchNavigator)

export default class App extends Component {
  render() {
    return <AppContainer />
  }
}
