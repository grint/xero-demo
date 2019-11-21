import React from 'react';
import PropTypes from 'prop-types';
import { createStackNavigator } from 'react-navigation';
import { translate } from '@gqlapp/i18n-client-react';
import { HeaderTitle, IconButton } from '@gqlapp/look-client-react-native';
import ClientModule from '@gqlapp/module-client-react-native';

import resolvers from './resolvers';
import resources from './locales';
import DataRootComponent from './containers/DataRootComponent';
import UserScreenNavigator from './containers/UserScreenNavigator';
import Profile from './containers/Profile';
import Login from './containers/Login';
import ForgotPassword from './containers/ForgotPassword';
import Logout from './containers/Logout';
import Register from './containers/Register';
import UserEdit from './containers/UserEdit';

export { default as CURRENT_USER_QUERY } from './graphql/CurrentUserQuery.graphql';

class LoginScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: <HeaderTitleWithI18n i18nKey="navLink.signIn" style="subTitle" />,
    headerLeft: (
      <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
    ),
    headerForceInset: {}
  });

  render() {
    return <Login navigation={this.props.navigation} />;
  }
}

LoginScreen.propTypes = {
  navigation: PropTypes.object
};

class ForgotPasswordScreen extends React.Component {
  static navigationOptions = () => ({
    headerTitle: <HeaderTitleWithI18n i18nKey="navLink.forgotPassword" style="subTitle" />,
    headerForceInset: {}
  });
  render() {
    return <ForgotPassword navigation={this.props.navigation} />;
  }
}

ForgotPasswordScreen.propTypes = {
  navigation: PropTypes.object
};

class RegisterScreen extends React.Component {
  static navigationOptions = () => ({
    headerTitle: <HeaderTitleWithI18n i18nKey="navLink.register" style="subTitle" />,
    headerForceInset: {}
  });
  render() {
    return <Register navigation={this.props.navigation} />;
  }
}

RegisterScreen.propTypes = {
  navigation: PropTypes.object
};

const AuthScreen = createStackNavigator(
  {
    Login: { screen: LoginScreen },
    ForgotPassword: { screen: ForgotPasswordScreen },
    Register: { screen: RegisterScreen }
  },
  {
    cardStyle: {
      backgroundColor: '#fff'
    },
    navigationOptions: {
      headerStyle: { backgroundColor: '#fff' }
    }
  }
);

class UserEditScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Edit user'
  });
  render() {
    return <UserEdit navigation={this.props.navigation} />;
  }
}
UserEditScreen.propTypes = {
  navigation: PropTypes.object
};

class ProfileScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Profile'
  });
  render() {
    return <Profile navigation={this.props.navigation} />;
  }
}

class ProfilerEditScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Edit profile'
  });
  render() {
    return <UserEdit navigation={this.props.navigation} />;
  }
}

ProfilerEditScreen.propTypes = {
  navigation: PropTypes.object
};

ProfileScreen.propTypes = {
  navigation: PropTypes.object
};

const HeaderTitleWithI18n = translate('user')(HeaderTitle);

export * from './containers/Auth';

const ref = { navigator: null };

const MainScreenNavigator = () => {
  const Navigator = ref.navigator;
  return <Navigator />;
};

export default new ClientModule({
  drawerItem: [
    {
      Profile: {
        screen: createStackNavigator({
          Profile: {
            screen: Profile,
            navigationOptions: ({ navigation }) => ({
              headerTitle: <HeaderTitleWithI18n i18nKey="navLink.profile" style="subTitle" />,
              headerLeft: (
                <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
              ),
              headerForceInset: {}
            })
          },
          ProfileEdit: {
            screen: ProfilerEditScreen,
            navigationOptions: () => ({
              headerTitle: <HeaderTitleWithI18n i18nKey="navLink.editProfile" style="subTitle" />,
              headerForceInset: {}
            })
          }
        }),
        userInfo: {
          showOnLogin: true,
          role: ['user', 'admin']
        },
        navigationOptions: {
          drawerLabel: <HeaderTitleWithI18n i18nKey="navLink.profile" />
        }
      },
      Login: {
        screen: AuthScreen,
        userInfo: {
          showOnLogin: false
        },
        navigationOptions: {
          drawerLabel: <HeaderTitleWithI18n i18nKey="navLink.signIn" />
        }
      },
      Logout: {
        screen: () => null,
        userInfo: {
          showOnLogin: true
        },
        navigationOptions: ({ navigation }) => {
          return {
            drawerLabel: <Logout navigation={navigation} />
          };
        }
      }
    }
  ],
  resolver: [resolvers],
  localization: [{ ns: 'user', resources }],
  router: <MainScreenNavigator />,
  dataRootComponent: [DataRootComponent],
  onAppCreate: [async modules => (ref.navigator = UserScreenNavigator(modules.drawerItems))]
});
