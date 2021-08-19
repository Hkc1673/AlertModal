import React, {Component} from 'react';
import {
  Text,
  Animated,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  BackHandler,
  Modal,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';

import PropTypes from 'prop-types';

const HwBackHandler = BackHandler;
const HW_BACK_EVENT = 'hardwareBackPress';

const {OS} = Platform;
const {height, width} = Dimensions.get('window');

export default class AwesomeAlert extends Component {
  constructor(props) {
    super(props);
    const {show} = this.props;
    this.springValue = new Animated.Value(props.animatedValue);

    this.state = {
      showSelf: false,
    };

    if (show) this._springShow(true);
  }

  componentDidMount() {
    HwBackHandler.addEventListener(HW_BACK_EVENT, this._handleHwBackEvent);
  }

  _springShow = fromConstructor => {
    const {useNativeDriver = false} = this.props;

    this._toggleAlert(fromConstructor);
    Animated.spring(this.springValue, {
      toValue: 1,
      bounciness: 10,
      useNativeDriver,
    }).start();
  };

  _springHide = () => {
    const {useNativeDriver = false} = this.props;

    if (this.state.showSelf === true) {
      Animated.spring(this.springValue, {
        toValue: 0,
        tension: 10,
        useNativeDriver,
      }).start();

      setTimeout(() => {
        this._toggleAlert();
        this._onDismiss();
      }, 70);
    }
  };

  _toggleAlert = fromConstructor => {
    if (fromConstructor) this.state = {showSelf: true};
    else this.setState({showSelf: !this.state.showSelf});
  };

  _handleHwBackEvent = () => {
    const {closeOnHardwareBackPress} = this.props;
    if (this.state.showSelf && closeOnHardwareBackPress) {
      this._springHide();
      return true;
    } else if (!closeOnHardwareBackPress && this.state.showSelf) {
      return true;
    }

    return false;
  };

  _onTapOutside = () => {
    const {closeOnTouchOutside} = this.props;
    if (closeOnTouchOutside) this._springHide();
  };

  _onDismiss = () => {
    const {onDismiss} = this.props;
    onDismiss && onDismiss();
  };

  _renderButton = data => {
    const {
      testID,
      text,
      backgroundColor,
      buttonStyle,
      buttonTextStyle,
      onPress,
    } = data;

    return (
      <TouchableOpacity testID={testID} onPress={onPress}>
        <View style={[styles.button, {backgroundColor}, buttonStyle]}>
          <Text style={[styles.buttonText, buttonTextStyle]}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  _renderAlert = () => {
    const animation = {transform: [{scale: this.springValue}]};

    const {showProgress} = this.props;
    const {title, message, customView = null} = this.props;

    const {
      showCancelButton,
      cancelText,
      cancelButtonColor,
      cancelButtonStyle,
      cancelButtonTextStyle,
      onCancelPressed,
      cancelButtonTestID,
    } = this.props;

    const {
      showConfirmButton,
      confirmText,
      confirmButtonColor,
      confirmButtonStyle,
      confirmButtonTextStyle,
      onConfirmPressed,
      confirmButtonTestID,
    } = this.props;

    const {
      alertContainerStyle,
      overlayStyle,
      progressSize,
      progressColor,
      contentContainerStyle,
      contentStyle,
      titleStyle,
      messageStyle,
      actionContainerStyle,
    } = this.props;

    const cancelButtonData = {
      testID: cancelButtonTestID,
      text: cancelText,
      backgroundColor: cancelButtonColor,
      buttonStyle: cancelButtonStyle,
      buttonTextStyle: cancelButtonTextStyle,
      onPress: onCancelPressed,
    };

    const confirmButtonData = {
      testID: confirmButtonTestID,
      text: confirmText,
      backgroundColor: confirmButtonColor,
      buttonStyle: confirmButtonStyle,
      buttonTextStyle: confirmButtonTextStyle,
      onPress: onConfirmPressed,
    };

    return (
      <View style={[styles.container, alertContainerStyle]}>
        <TouchableWithoutFeedback onPress={this._onTapOutside}>
          <View style={[styles.overlay, overlayStyle]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[styles.contentContainer, animation, contentContainerStyle]}>
          <View style={[styles.content, contentStyle]}>
            {showProgress ? (
              <ActivityIndicator size={progressSize} color={progressColor} />
            ) : null}
            {title ? (
              <Text style={[styles.title, titleStyle]}>{title}</Text>
            ) : null}
            {message ? (
              <Text style={[styles.message, messageStyle]}>{message}</Text>
            ) : null}
            {customView}
          </View>
          <View style={[styles.action, actionContainerStyle]}>
            {showCancelButton ? this._renderButton(cancelButtonData) : null}
            {showConfirmButton ? this._renderButton(confirmButtonData) : null}
          </View>
        </Animated.View>
      </View>
    );
  };

  render() {
    const {show, showSelf} = this.state;
    const {modalProps = {}, closeOnHardwareBackPress} = this.props;

    const wrapInModal = OS === 'android' || OS === 'ios';

    return showSelf ? (
      wrapInModal ? (
        <Modal
          animationType="none"
          transparent={true}
          visible={show}
          onRequestClose={() => {
            if (showSelf && closeOnHardwareBackPress) {
              this._springHide();
            }
          }}
          {...modalProps}>
          {this._renderAlert()}
        </Modal>
      ) : (
        this._renderAlert()
      )
    ) : null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {show} = nextProps;
    const {showSelf} = this.state;

    if (show && !showSelf) this._springShow();
    else if (show === false && showSelf) this._springHide();
  }

  componentWillUnmount() {
    HwBackHandler.removeEventListener(HW_BACK_EVENT, this._handleHwBackEvent);
  }
}

AwesomeAlert.propTypes = {
  show: PropTypes.bool,
  animatedValue: PropTypes.number,
  useNativeDriver: PropTypes.bool,
  showProgress: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  closeOnTouchOutside: PropTypes.bool,
  closeOnHardwareBackPress: PropTypes.bool,
  showCancelButton: PropTypes.bool,
  showConfirmButton: PropTypes.bool,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  cancelButtonColor: PropTypes.string,
  confirmButtonColor: PropTypes.string,
  onCancelPressed: PropTypes.func,
  onConfirmPressed: PropTypes.func,
  customView: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.func,
  ]),
  modalProps: PropTypes.object,
  cancelButtonTestID: PropTypes.string,
  confirmButtonTestID: PropTypes.string,
};

AwesomeAlert.defaultProps = {
  show: false,
  animatedValue: 0.3,
  useNativeDriver: false,
  showProgress: false,
  closeOnTouchOutside: true,
  closeOnHardwareBackPress: true,
  showCancelButton: false,
  showConfirmButton: false,
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  cancelButtonColor: '#D0D0D0',
  confirmButtonColor: '#AEDEF4',
  customView: null,
  modalProps: {},
  cancelButtonTestID: 'awesome-alert-cancel-btn',
  confirmButtonTestID: 'awesome-alert-confirm-btn',
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute'
    },
    overlay: {
      width: width,
      height: height,
      position: 'absolute',
      backgroundColor: 'rgba(52,52,52,0.5)'
    },
    contentContainer: {
      maxWidth: '80%',
      borderRadius: 5,
      backgroundColor: 'white',
      padding: 10
    },
    content: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10
    },
    action: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
      marginTop: 5
    },
    title: {
      paddingVertical: 5,
      paddingHorizontal: 15,
      color: '#626262',
      fontSize: 18
    },
    message: {
      paddingTop: 5,
      color: '#7b7b7b',
      fontSize: 14
    },
    button: {
      paddingHorizontal: 10,
      paddingVertical: 7,
      margin: 5,
      borderRadius: 5
    },
    buttonText: {
      color: '#fff',
      fontSize: 13
    }
  });