import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {Button, Centered, Column} from '../components/ui';
import {Theme} from '../components/ui/styleUtils';
import {RootRouteProps} from '../routes';
import {useBiometricScreen} from './BiometricScreenController';
import {Passcode} from '../components/Passcode';
import {
  getEventType,
  incrementPasscodeRetryCount,
} from '../shared/telemetry/TelemetryUtils';

export const BiometricScreen: React.FC<RootRouteProps> = props => {
  const {t} = useTranslation('BiometricScreen');
  const controller = useBiometricScreen(props);

  const handlePasscodeMismatch = (error: string) => {
    incrementPasscodeRetryCount(getEventType(props.route.params?.setup));
    controller.onError(error);
  };

  return (
    <Column
      fill
      pY={32}
      pX={32}
      backgroundColor={Theme.Colors.whiteBackgroundColor}>
      <Centered fill>
        <TouchableOpacity onPress={controller.useBiometrics}>
          <Icon name="fingerprint" size={180} color={Theme.Colors.Icon} />
        </TouchableOpacity>
      </Centered>

      <Button
        title={t('unlock')}
        margin="8 0"
        onPress={controller.useBiometrics}
        disabled={controller.isSuccessBio}
      />
      {controller.isReEnabling && (
        <Passcode
          message="Enter your passcode to re-enable biometrics authentication."
          onSuccess={() => controller.onSuccess()}
          onError={handlePasscodeMismatch}
          storedPasscode={controller.storedPasscode}
          onDismiss={() => controller.onDismiss()}
          error={controller.error}
          salt={controller.passcodeSalt}
        />
      )}
    </Column>
  );
};
