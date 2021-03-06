import React, { Component } from "react";
import {
  AsyncStorage,
  Text,
  View,
  Image,
  StatusBar,
  Platform,
  AppState
} from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import OneSignal from "react-native-onesignal";
import _ from "lodash";

import { getLinks, organiseLinks } from "../redux/link/actions";
import {
  getUserInfo,
  updateUser,
  getUserActivity
} from "../redux/user/actions";
import { getConversations } from "../redux/conversation/actions";
import { getContacts } from "../redux/contact/actions";
import LinkView from "../components/linkView";
import Spinner from "../components/common/spinner";

const styles = {
  noLinks: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  reload: {
    margin: 10,
    textAlign: "center",
    textDecorationLine: "underline",
    color: "grey"
  },
  loading: {
    flex: 1,
    justifyContent: "center"
  }
};

class Links extends Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      headerTitle: (
        <Image
          style={{ width: 100, height: 30 }}
          resizeMode="contain"
          source={require("../../assets/images/logo_clear.png")}
        />
      ),
      headerRight: (
        <Button
          icon={{ name: "plus", type: "font-awesome" }}
          iconRight
          backgroundColor="rgba(0,0,0,0)"
          onPress={() => {
            navigate("addLink");
          }}
        />
      ),
      headerLeft: (
        <Button
          icon={{ name: "settings" }}
          iconLeft
          backgroundColor="rgba(0,0,0,0)"
          onPress={() => navigate("profile")}
        />
      )
    };
  };

  state = { cachedLinks: null, token: null, appState: AppState.currentState };

  async componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
    this._loadStoredData();
    this.getUserData();
    this.requestNotificationPermissions();
    await this.updateUserOs();

    OneSignal.getPermissionSubscriptionState(status => {
      this.checkNotificationStatus(status);
    });

    this.subs = [
      this.props.navigation.addListener("didFocus", () =>
        this.getLinksAndChats()
      )
    ];
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.authorized, this.props.authorized);
    if (!nextProps.authorized || !this.props.authorized)
      this.props.navigation.navigate("auth");
    if (nextProps.newLinks) {
      this._storeData(nextProps.newLinks);
    }

    if (nextProps.newLinks && this.props.newLinks) {
      if (!_.isEqual(nextProps.newLinks, this.props.newLinks)) {
        this.props.getUserInfo(this.state.token);
      }
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
    this.subs.forEach(sub => sub.remove());
  }

  getUserData = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      this.setState({ token });
      this.props.getLinks(token);
      this.props.getContacts(token);
      this.props.getUserInfo(token);
      this.props.getUserActivity(token);
      this.props.getConversations(token);
    }
  };

  getLinksAndChats = () => {
    if (this.state.token) {
      this.props.getLinks(this.state.token);
      this.props.getConversations(this.state.token);
    }
  };

  refreshLinks = () => {
    const showLoadingIndicator = true;
    this.props.getLinks(this.state.token, showLoadingIndicator);
  };

  _handleAppStateChange = async nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      if (this.state.token) {
        const showLoadingIndicator = false;
        this.props.getLinks(this.state.token, showLoadingIndicator);
      }
    }
    this.setState({ appState: nextAppState });
  };

  async _loadStoredData() {
    const links = await AsyncStorage.getItem("cachedLinks");
    this.setState({ cachedLinks: JSON.parse(links) });
  }

  async _storeData() {
    if (this.props.newLinks) {
      await AsyncStorage.setItem(
        "cachedLinks",
        JSON.stringify(this.props.newLinks)
      );
    }
    if (this.props.archivedLinks) {
      await AsyncStorage.setItem(
        "cachedArchivedLinks",
        JSON.stringify(this.props.archivedLinks)
      );
    }
  }

  checkNotificationStatus = async status => {
    const pushToken = await AsyncStorage.getItem("pushToken");
    const token = await AsyncStorage.getItem("token");
    if (pushToken !== status.userId) {
      await AsyncStorage.setItem("pushToken", status.userId);
      this.props.updateUser(token, status.userId, "push", this.props.userInfo);
    }
  };

  async updateUserOs() {
    const storedOs = await AsyncStorage.getItem("deviceOs");
    if (!storedOs) {
      const token = await AsyncStorage.getItem("token");
      this.props.updateUser(
        token,
        Platform.OS,
        "device_os",
        this.props.userInfo
      );
      AsyncStorage.setItem("deviceOs", Platform.OS);
    }
  }

  requestNotificationPermissions() {
    if (Platform.OS === "ios") {
      const permissions = {
        alert: true,
        badge: true,
        sound: true
      };
      OneSignal.requestPermissions(permissions);
    }
  }

  clearCache = () => {
    this.setState({ cachedLinks: null });
  };

  renderLinkView() {
    const { loading } = this.props;
    const links = this.props.newLinks || this.state.cachedLinks;
    if (!links) {
      if (loading) {
        return (
          <View style={styles.loading}>
            <StatusBar barStyle="light-content" />
            <Spinner size="large" text="Loading links..." />
          </View>
        );
      }
      return (
        <View style={styles.noLinks}>
          <Text>Looks like there are no new links!</Text>
        </View>
      );
    }
    return (
      <LinkView
        status="new"
        navigate={this.props.navigation.navigate}
        refresh={this.refreshLinks}
        links={links}
        token={this.state.token}
        clearCache={this.clearCache}
      />
    );
  }

  render() {
    return this.renderLinkView();
  }
}

const mapStateToProps = ({ link, user, conversation }) => {
  const { newLinks, archivedLinks, loading, authorized } = link;
  const { info: userInfo } = user;
  const { unreadMessages } = conversation;
  return {
    newLinks,
    archivedLinks,
    loading,
    authorized,
    userInfo,
    unreadMessages
  };
};

export default connect(
  mapStateToProps,
  {
    getLinks,
    organiseLinks,
    getContacts,
    getUserInfo,
    updateUser,
    getUserActivity,
    getConversations
  }
)(Links);
