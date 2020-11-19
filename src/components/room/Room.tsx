import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk';

import { selectRoom } from './roomSlice';

import styles from './styles.module.scss';

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'h264',
});

const Room = () => {
  const { appId, token, channel } = useSelector(selectRoom);

  const history = useHistory();

  const handleLeave = () => {
    history.push('/');
  };

  useEffect(() => {
    const initClient = () => {
      return new Promise((resolve, reject) => {
        client.init(
          appId,
          () => {
            console.log('RTC initialized');
            resolve();
          },
          err => {
            console.log('RTC init failed', err);
            reject();
          }
        );
      });
    };

    const joinClient = () => {
      return new Promise((resolve, reject) => {
        client.join(
          token,
          channel,
          null,
          () => {
            console.log('RTC joined');
            resolve();
          },
          err => {
            console.log('RTC join channel failed', err);
            reject();
          }
        );
      });
    };

    if (appId && token && channel) {
      initClient().then(() => {
        joinClient().then(() => {
          // TODO: Init stream
          // TODO: Publish
        });
      });
    } else {
      handleLeave();
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1>Chat Room</h1>

      <div className={styles.guest}>
        <h2>Room Members</h2>
        {/* TODO: Members Videos */}
      </div>

      <div className={styles.me}>
        <h2>My Video</h2>
        {/* TODO: My Video */}
      </div>

      <div className={styles.buttons}>
        {/* TODO: <button>Mute</button> */}
        <button onClick={handleLeave}>Leave Room</button>
      </div>
    </div>
  );
};

export default Room;
