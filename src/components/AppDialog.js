import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, PaperProvider, Text } from 'react-native-paper';
import AppButton from './AppButton';
import { appstyle } from '../styles/appstyle';

const AppDialog = ({visible, description="", title="", onSuccessPress, onCancelPress}) => {

  return (
   
      <View>
        <Portal>
          <Dialog style={{backgroundColor: appstyle.pri}} visible={visible} onDismiss={onCancelPress}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{description}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <AppButton icon="close" outlined onPress={onCancelPress}>Cancel</AppButton>
              <AppButton icon="delete" textColor="tomato" onPress={onSuccessPress}>Done </AppButton>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
  );
};

export default AppDialog;