import { useState, useCallback, useEffect, useRef } from 'react';

export interface EEGData {
  attention: number;
  meditation: number;
  delta: number;
  theta: number;
  alpha: number;
  beta: number;
  gamma: number;
  timestamp: number;
}

type BluetoothDeviceWithGatt = BluetoothDevice & {
  gatt?: BluetoothRemoteGATTServer | null;
};

const EEG_SERVICE_UUID = 'heart_rate';

const useEEG = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [eegData, setEEGData] = useState<EEGData | null>(null);
  const deviceRef = useRef<BluetoothDeviceWithGatt | null>(null);
  const simulationTimer = useRef<number | null>(null);

  const startDataSimulation = useCallback(() => {
    if (simulationTimer.current) {
      return;
    }
    simulationTimer.current = window.setInterval(() => {
      setEEGData({
        attention: Math.random() * 0.3 + 0.7,
        meditation: Math.random() * 0.5 + 0.5,
        delta: Math.random(),
        theta: Math.random(),
        alpha: Math.random(),
        beta: Math.random(),
        gamma: Math.random(),
        timestamp: Date.now(),
      });
    }, 1000);
  }, []);

  const stopDataSimulation = useCallback(() => {
    if (simulationTimer.current) {
      window.clearInterval(simulationTimer.current);
      simulationTimer.current = null;
    }
  }, []);

  const connectDevice = useCallback(async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [EEG_SERVICE_UUID] }],
        optionalServices: ['battery_service'],
      });

      deviceRef.current = device;
      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error('Unable to connect to EEG device');
      }

      setIsConnected(true);
      startDataSimulation();
    } catch (error) {
      console.error('Failed to connect to EEG device', error);
    }
  }, [startDataSimulation]);

  const disconnect = useCallback(() => {
    stopDataSimulation();
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect();
    }
    deviceRef.current = null;
    setIsConnected(false);
    setEEGData(null);
  }, [stopDataSimulation]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    eegData,
    connectDevice,
    disconnect,
  };
};

export default useEEG;
