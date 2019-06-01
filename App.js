import React from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createDrawerNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

/**
 *  import custom components
 */
import Auth from './src/screens/Auth/Auth'
import SettingsScreen from './src/screens/Settings/Settings'
import HomeScreen from './src/screens/HomeModule/Home'
import OtherScreen from './src/screens/HomeModule/Other/Other'

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class IconWithBadge extends React.Component {
  render() {
    const { name, badgeCount, color, size } = this.props;
    return (
      <View style={{ width: 24, height: 24, margin: 5 }}>
        <Ionicons name={name} size={size} color={color} />
        {badgeCount > 0 && (
          <View
            style={{
              // /If you're using react-native < 0.57 overflow outside of the parent
              // will not work on Android, see https://git.io/fhLJ8
              position: 'absolute',
              right: -6,
              top: -3,
              backgroundColor: 'red',
              borderRadius: 6,
              width: 12,
              height: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const HomeIconWithBadge = props => {
  // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
  return <IconWithBadge {...props} badgeCount={0} />;
};

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Ionicons;
  let iconName;
  if (routeName === 'Home') {
    // iconName = `ios-information-circle${focused ? '' : '-outline'}`;
    iconName = `md-home`;
    // We want to add badges to home tab icon
    IconComponent = HomeIconWithBadge;
  } else if (routeName === 'Settings') {
    iconName = `ios-options${focused ? '' : ''}`;
  }
  // You can return any component that you like here!
  return <IconComponent name={iconName} size={25} color={tintColor} />;
}

/*
 * AppStack Start
 */
const AppStack = createStackNavigator(
  { Home: HomeScreen, Other: {
      screen: OtherScreen,
      navigationOptions: ({ navigation }) => {
        return {
          headerLeft: (
            <Ionicons style={{ paddingLeft: 10 }} onPress={() => navigation.navigate('Home')} name="ios-arrow-back" size={30} />
          )
        };
      }
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerLeft: (
          <Ionicons style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
        )
      };
    }
  }
);


const AppDrawerNavigator = createDrawerNavigator({
  Dashboard: {
    screen: AppStack,
    navigationOptions: {
      drawerLabel: 'Dashboard-World',
      drawerIcon: () => (
        <Ionicons name="ios-card" size={30} />
      ),
    }
  },
  Personal: {
    screen: AppStack,
    navigationOptions: {
      drawerLabel: 'Personl-Space',
      drawerIcon: () => (
        <Ionicons name="ios-person" size={30} />
      ),
    }
  }
},{
  contentOptions: {
    activeTintColor: '#e91e63',
    itemsContainerStyle: {
      marginVertical: 0,
    },
    iconContainerStyle: {
      opacity: 1
    },

  }
});

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen
  }
)

const DashboardTabNavigator = createBottomTabNavigator(
  {
    Home: { screen: AppDrawerNavigator },
    Settings: { screen: SettingsStack },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) =>
        getTabBarIcon(navigation, focused, tintColor),
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
)

const AuthStack = createStackNavigator({ SignIn: Auth });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: DashboardTabNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
