import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AgoraRTC, { Stream } from 'agora-rtc-sdk';

import { selectRoom } from './roomSlice';

import styles from './styles.module.scss';

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'h264',
});

const Room = () => {
  const { appId, token, channel } = useSelector(selectRoom);
  const userId = useRef<string | number>();
  const localStream = useRef<Stream>();

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
          uid => {
            console.log('RTC joined');
            userId.current = uid;
            resolve();
          },
          err => {
            console.log('RTC join channel failed', err);
            reject();
          }
        );
      });
    };

    const initStream = () => {
      localStream.current = AgoraRTC.createStream({
        streamID: userId.current,
        audio: true,
        video: true,
        screen: false,
      });

      return new Promise((resolve, reject) => {
        localStream.current!.init(
          () => {
            console.log('RTC stream established');
            resolve();
          },
          err => {
            console.log('RTC stream failed');
            reject();
          }
        );
      });
    };

    if (appId && token && channel) {
      initClient().then(() => {
        joinClient().then(() => {
          // TODO: Bind events
          initStream().then(() => {
            // TODO: Publish
          });
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
