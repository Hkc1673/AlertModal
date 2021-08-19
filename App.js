import React, {useState} from 'react';
import {View, Button} from 'react-native';
import AlertModal from './src/AlertModal';

const App = () => {
  const [modalVisible, setModalVisible] = useState(true);

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
        displayAlertIcon={true}
        alertTitleText={'Alert Title from Props'}
        alertMessageText={'Alert message from props'}
        displayPositiveButton={true}
        positiveButtonText={'OK'}
        displayNegativeButton={true}
        negativeButtonText={'CANCEL'}
        onPressPositiveButton={onPressAlertPositiveButton}
        onPressNegativeButton={onPressAlertNegativeButton}
      />
    </View>
  );
};

export default App;
