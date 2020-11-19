import React, { Component } from 'react';
import { connect } from 'react-redux';
import AgoraRTC, { Stream } from 'agora-rtc-sdk';
import { History } from 'history';

import { storeType } from '../../store';

import styles from './styles.module.scss';

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'h264',
});

interface RoomProps {
  appId: string;
  token: string;
  channel: string;
  history: History;
}

interface RoomStates {
  remoteStreams: Stream[];
}

class Room extends Component<RoomProps, RoomStates> {
  userId: string | number;
  localStream: Stream | null;

  constructor(props: RoomProps | Readonly<RoomProps>) {
    super(props);

    this.state = {
      remoteStreams: [],
    };

    this.userId = '';
    this.localStream = null;
  }

  componentDidMount() {
    const { appId, token, channel } = this.props;

    if (appId && token && channel) {
      this.initClient().then(() => {
        this.joinClient().then(() => {
          // TODO: Bind events
          this.initStream().then(() => {
            // TODO: Publish
          });
        });
      });
    } else {
      this.handleLeave();
    }
  }

  handleLeave = () => {
    client.leave(
      () => {
        console.log('RTC leaved channel');
      },
      err => {
        console.log('RTC failed to leave channel', err);
      }
    );
    this.props.history.push('/');
  };

  initClient = () => {
    return new Promise((resolve, reject) => {
      client.init(
        this.props.appId,
        () => {
          console.log('RTC initialized');
          client.on('stream-added', () => {
            // TODO: Handle remote stream added
          });
          client.on('stream-subscribed', () => {
            // TODO: Handle remote stream sub
          });
          client.on('stream-removed', () => {
            // TODO: Handle stream removed
          });
          client.on('peer-leave', () => {
            // TODO: Handle remote stream left
          });
          resolve();
        },
        err => {
          console.log('RTC init failed', err);
          reject();
        }
      );
    });
  };

  joinClient = () => {
    return new Promise((resolve, reject) => {
      client.join(
        this.props.token,
        this.props.channel,
        null,
        uid => {
          console.log('RTC joined');
          this.userId = uid;
          resolve();
        },
        err => {
          console.log('RTC join channel failed', err);
          reject();
        }
      );
    });
  };

  initStream = () => {
    this.localStream = AgoraRTC.createStream({
      streamID: this.userId,
      audio: true,
      video: true,
      screen: false,
    });

    return new Promise((resolve, reject) => {
      this.localStream!.init(
        () => {
          console.log('RTC stream established');
          resolve();
        },
        err => {
          console.log('RTC stream failed', err);
          reject();
        }
      );
    });
  };

  render() {
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
          <button onClick={this.handleLeave}>Leave Room</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: storeType) => {
  const { appId, token, channel } = state.room;
  return {
    appId,
    token,
    channel,
  };
};

export default connect(mapStateToProps)(Room);
