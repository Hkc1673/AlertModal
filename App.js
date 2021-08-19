import React, {useState} from 'react';
import {View, Button} from 'react-native';
import AlertModal from './src/AlertModal';
import AwesomeAlert from './src/AwesomeAlert';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const onPressAlertPositiveButton = () => {
    console.log('Positive Button Clicked');
    setModalVisible(false);
  };

  const onPressAlertNegativeButton = () => {
    console.log('Negative Button Clicked');
    setModalVisible(false);
  };
  return (
    <View>
      <Button title="click" onPress={() => setModalVisible(true)} />
      <AlertModal
        displayAlert={modalVisible}
        onPressPositiveButton={onPressAlertPositiveButton}
        onPressNegativeButton={onPressAlertNegativeButton}
      />
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="AwesomeAlert"
        message="I have a message for you!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, delete it"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          setShowAlert(false);
        }}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
      <Button title="press" onPress={() => setShowAlert(true)} />
    </View>
  );
};

export default App;
