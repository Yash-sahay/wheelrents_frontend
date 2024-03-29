import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, PaperProvider, Text } from 'react-native-paper';
import AppButton from './AppButton';
import { appstyle } from '../styles/appstyle';

const AppDialog = ({visible, description="", title="", onSuccessPress, onCancelPress, loading}) => {

  return (
   
      <View>
        <Portal>
          <Dialog style={{backgroundColor: appstyle.priBack}} visible={visible} onDismiss={onCancelPress}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{description}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <AppButton icon="close" outlined onPress={onCancelPress} style={{paddingHorizontal: 8}}>Cancel</AppButton>
              <AppButton icon="delete" buttonColor="tomato" outlined loading={loading} style={{paddingHorizontal: 5}} textColor="white" onPress={onSuccessPress}>Yes</AppButton>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
  );
};

export default AppDialog;