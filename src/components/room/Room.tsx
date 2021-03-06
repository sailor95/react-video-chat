import React, { Component } from 'react';
import { connect } from 'react-redux';
import AgoraRTC, { Client, Stream } from 'agora-rtc-sdk';
import StreamPlayer from 'agora-stream-player';
import { History } from 'history';
import { SpinnerCircularFixed } from 'spinners-react';

import { storeType } from '../../store';

import styles from './styles.module.scss';

interface RoomProps {
  appId: string;
  token: string;
  channel: string;
  history: History;
}

interface RoomStates {
  remoteStreams: Stream[];
  isLocalStreamReady: boolean;
  isMuted: boolean;
}

class Room extends Component<RoomProps, RoomStates> {
  client: Client;
  userId: string | number;
  localStream: Stream | null;

  constructor(props: RoomProps | Readonly<RoomProps>) {
    super(props);

    this.state = {
      remoteStreams: [],
      isLocalStreamReady: false,
      isMuted: false,
    };

    this.client = AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'h264',
    });
    this.userId = '';
    this.localStream = null;
  }

  componentDidMount() {
    const { appId, token, channel } = this.props;

    if (appId && token && channel) {
      this.initClient().then(() => {
        this.joinClient().then(() => {
          this.initStream().then(() => {
            this.publishStream().then(() => {
              console.log('RTC flow done');
              this.setState({ isLocalStreamReady: true });
            });
          });
        });
      });
    } else {
      this.handleLeave();
    }
  }

  handleLeave = () => {
    if (this.localStream) {
      this.localStream.close();
      this.client.unpublish(this.localStream);
    }

    this.client.leave(
      () => {
        console.log('RTC left channel');
      },
      err => {
        console.log('RTC failed to leave channel', err);
      }
    );
    this.props.history.push('/');
  };

  initClient = () => {
    return new Promise((resolve, reject) => {
      this.client.init(
        this.props.appId,
        () => {
          console.log('RTC initialized');
          this.client.on('stream-added', this.onStreamAdded);
          this.client.on('stream-subscribed', this.onRemoteClientAdded);
          this.client.on('stream-removed', this.onStreamRemoved);
          this.client.on('peer-leave', this.onPeerLeave);
          resolve();
        },
        err => {
          console.log('RTC init failed', err);
          reject();
        }
      );
    });
  };

  onStreamAdded = (event: any) => {
    const { stream } = event;

    this.setState(
      {
        remoteStreams: [...this.state.remoteStreams, stream],
      },
      () => {
        this.client.subscribe(stream, {}, err => {
          console.log('RTC sub stream failed', err);
        });
      }
    );
  };

  onRemoteClientAdded = (event: any) => {
    const remoteStream = event.stream;

    this.state.remoteStreams[remoteStream.getId()].play(
      'agora_remote ' + remoteStream.getId()
    );
  };

  onStreamRemoved = (event: any) => {
    const { stream } = event;

    if (stream) {
      const streamId = stream.getId();

      stream.stop();

      this.setState({
        remoteStreams: this.state.remoteStreams.filter(
          stream => stream.getId() !== streamId
        ),
      });

      console.log('RTC remote stream removed ', streamId);
    }
  };

  onPeerLeave = (event: any) => {
    let stream = event.stream;

    if (stream) {
      const streamId = stream.getId();

      stream.stop();

      this.setState({
        remoteStreams: this.state.remoteStreams.filter(
          stream => stream.getId() !== streamId
        ),
      });

      console.log('RTC peer left ', streamId);
    }
  };

  joinClient = () => {
    return new Promise((resolve, reject) => {
      this.client.join(
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

  publishStream = () => {
    return new Promise((resolve, reject) => {
      this.client.publish(this.localStream!, err => {
        console.log('RTC publish failed', err);
        reject();
      });

      this.client.on('stream-published', () => {
        console.log('RTC published');
        resolve();
      });
    });
  };

  toggleMute = () => {
    const { isMuted } = this.state;

    if (isMuted) {
      this.localStream?.unmuteAudio();
      this.setState({ isMuted: false });
    } else {
      this.localStream?.muteAudio();
      this.setState({ isMuted: true });
    }
  };

  render() {
    const { remoteStreams, isLocalStreamReady, isMuted } = this.state;

    return (
      <div className={styles.container}>
        <h1>Chat Room</h1>

        <div className={styles.guest}>
          <h2>Room Members</h2>
          <div className={styles['guest-streams']}>
            {remoteStreams.map(stream => (
              <StreamPlayer stream={stream} key={stream.getId()} />
            ))}
          </div>
        </div>

        <div className={styles.me}>
          <h2>My Video</h2>
          {isLocalStreamReady ? (
            <StreamPlayer stream={this.localStream} />
          ) : (
            <SpinnerCircularFixed color="#FFF" />
          )}
        </div>

        <div className={styles.buttons}>
          <button onClick={this.toggleMute} disabled={!isLocalStreamReady}>
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
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
