const token = `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM0I0VzUiLCJzdWIiOiIzTlNaMkoiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJ3aHIgd251dCB3cHJvIHdzbGUgd3dlaSB3c29jIHdzZXQgd2FjdCB3bG9jIiwiZXhwIjoxNjUxNTM5ODEwLCJpYXQiOjE2MjAwMDM4MTB9.ZQIGDci5_b60HMjtnSZ-qIwFK0eWdlXGMRpDO4RihcM`;
let interval;
let heartRateStatic1Interval;
let heartRateStatic2Interval;
let heartRateDynamic1Interval;

const initUI = () => {
  const nameMessage = document.getElementById('name-message');
  const joinButton = document.getElementById('join-btn');
  const conferenceAliasInput = document.getElementById('alias-input');
  const leaveButton = document.getElementById('leave-btn');
  const lblDolbyVoice = document.getElementById('label-dolby-voice');
  const startVideoBtn = document.getElementById('start-video-btn');
  const stopVideoBtn = document.getElementById('stop-video-btn');
  const startAudioBtn = document.getElementById('start-audio-btn');
  const stopAudioBtn = document.getElementById('stop-audio-btn');
  const startScreenShareBtn = document.getElementById('start-screenshare-btn');
  const stopScreenShareBtn = document.getElementById('stop-screenshare-btn');
  const startRecordingBtn = document.getElementById('start-recording-btn');
  const stopRecordingBtn = document.getElementById('stop-recording-btn');
  // const stopRecordingBtn = ;

  // Update the login message with the name of the user
  // nameMessage.innerHTML = `You are logged in as ${randomName}`;
  joinButton.disabled = false;

  joinButton.onclick = () => {
    // Default conference parameters
    // See: https://dolby.io/developers/interactivity-apis/client-sdk/reference-javascript/model/conferenceparameters
    let conferenceParams = {
      liveRecording: false,
      rtcpMode: 'average', // worst, average, max
      ttl: 0,
      videoCodec: 'H264', // H264, VP8
      dolbyVoice: true,
    };

    // See: https://dolby.io/developers/interactivity-apis/client-sdk/reference-javascript/model/conferenceoptions
    let conferenceOptions = {
      alias: conferenceAliasInput.value,
      params: conferenceParams,
    };

    // 1. Create a conference room with an alias
    VoxeetSDK.conference
      .create(conferenceOptions)
      .then((conference) => {
        // See: https://dolby.io/developers/interactivity-apis/client-sdk/reference-javascript/model/joinoptions
        const joinOptions = {
          constraints: {
            audio: true,
            video: false,
          },
          simulcast: false,
        };

        // 2. Join the conference
        VoxeetSDK.conference
          .join(conference, joinOptions)
          .then((conf) => {
            lblDolbyVoice.innerHTML = `Dolby Voice is ${
              conf.params.dolbyVoice ? 'On' : 'Off'
            }.`;

            conferenceAliasInput.disabled = true;
            joinButton.disabled = true;
            leaveButton.disabled = false;
            startVideoBtn.disabled = false;
            startAudioBtn.disabled = true;
            stopAudioBtn.disabled = false;
            startScreenShareBtn.disabled = false;
            startRecordingBtn.disabled = false;

            nameMessage.innerHTML = `You are logged in as ${randomName}`;

            document.getElementById('video-container-wrapper').style.display =
              '';

            document.getElementById('actions').style.display = '';
            document.getElementById('video-static-1').style.display = '';
            document.getElementById('video-static-2').style.display = '';

            heartRateStatic1Interval = setInterval(() => {
              document.getElementById(
                'heart-rate-static-1-bpm'
              ).innerText = randomHeartRate(152, 155);

              document.getElementById(
                'heart-rate-static-1-cal'
              ).innerText = randomHeartRate(133, 140);
            }, 1000);

            heartRateStatic2Interval = setInterval(() => {
              document.getElementById(
                'heart-rate-static-2-bpm'
              ).innerText = randomHeartRate(162, 165);

              document.getElementById(
                'heart-rate-static-2-cal'
              ).innerText = randomHeartRate(136, 142);
            }, 1000);
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  };

  leaveButton.onclick = () => {
    // Leave the conference
    window.VoxeetSDK.conference
      .leave()
      .then(() => {
        lblDolbyVoice.innerHTML = '';

        conferenceAliasInput.disabled = false;
        joinButton.disabled = false;
        leaveButton.disabled = true;
        startVideoBtn.disabled = true;
        stopVideoBtn.disabled = true;
        startAudioBtn.disabled = true;
        stopAudioBtn.disabled = true;
        startScreenShareBtn.disabled = true;
        stopScreenShareBtn.disabled = true;
        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = true;

        document.getElementById('video-container-wrapper').style.display =
          'none';
        document.getElementById('actions').style.display = 'none';
        document.getElementById('name-message').innerText = '';

        clearInterval(heartRateStatic1Interval);
        clearInterval(heartRateStatic2Interval);
      })
      .catch((e) => console.log(e));
  };

  startVideoBtn.onclick = () => {
    // Start sharing the video with the other participants
    VoxeetSDK.conference
      .startVideo(VoxeetSDK.session.participant)
      .then(() => {
        startVideoBtn.disabled = true;
        stopVideoBtn.disabled = false;
      })
      .catch((e) => console.log(e));
  };

  stopVideoBtn.onclick = () => {
    // Stop sharing the video with the other participants
    VoxeetSDK.conference
      .stopVideo(VoxeetSDK.session.participant)
      .then(() => {
        stopVideoBtn.disabled = true;
        startVideoBtn.disabled = false;

        document.getElementById('video-dynamic-1').style.display = 'none';
      })
      .catch((e) => console.log(e));
  };

  startAudioBtn.onclick = () => {
    // Start sharing the Audio with the other participants
    VoxeetSDK.conference
      .startAudio(VoxeetSDK.session.participant)
      .then(() => {
        startAudioBtn.disabled = true;
        stopAudioBtn.disabled = false;
      })
      .catch((e) => console.log(e));
  };

  stopAudioBtn.onclick = () => {
    // Stop sharing the Audio with the other participants
    VoxeetSDK.conference
      .stopAudio(VoxeetSDK.session.participant)
      .then(() => {
        stopAudioBtn.disabled = true;
        startAudioBtn.disabled = false;
      })
      .catch((e) => console.log(e));
  };

  startScreenShareBtn.onclick = () => {
    // Start the Screen Sharing with the other participants
    VoxeetSDK.conference
      .startScreenShare()
      .then(() => {
        startScreenShareBtn.disabled = true;
        stopScreenShareBtn.disabled = false;
      })
      .catch((e) => console.log(e));
  };

  stopScreenShareBtn.onclick = () => {
    // Stop the Screen Sharing
    VoxeetSDK.conference.stopScreenShare().catch((e) => console.log(e));
  };

  startRecordingBtn.onclick = () => {
    let recordStatus = document.getElementById('record-status');

    // Start recording the conference
    VoxeetSDK.recording
      .start()
      .then(() => {
        recordStatus.innerText = 'Recording...';
        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = false;
      })
      .catch((e) => console.log(e));
  };

  stopRecordingBtn.onclick = () => {
    let recordStatus = document.getElementById('record-status');

    // Stop recording the conference
    VoxeetSDK.recording
      .stop()
      .then(() => {
        recordStatus.innerText = '';
        startRecordingBtn.disabled = false;
        stopRecordingBtn.disabled = true;
      })
      .catch((e) => console.log(e));
  };
};

const fetchStat = async () => {
  try {
    const heartRateResult = await axios.get(
      'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1min.json',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const activitiesResult = await axios.get(
      'https://api.fitbit.com/1/user/-/activities/date/today.json',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { dataset } = heartRateResult.data['activities-heart-intraday'];
    const { summary: activitySummary } = activitiesResult;

    const data = dataset[dataset.length - 1];

    document.getElementById('heart-rate-dynamic-1-bpm').innerText =
      data?.value || '';

    document.getElementById('heart-rate-dynamic-1-cal').innerText =
      activitySummary.caloriesOut;
  } catch (error) {
    console.log('fetched error', error);
    heartRateDynamic1Interval = setInterval(() => {
      document.getElementById(
        'heart-rate-dynamic-1-bpm'
      ).innerText = randomHeartRate(113, 115);
      document.getElementById(
        'heart-rate-dynamic-1-cal'
      ).innerText = randomHeartRate(120, 125);
    }, 2000);
  }
};

// Add a video stream to the web page
const addVideoNode = (participant, stream) => {
  let videoNode = document.getElementById('video-' + participant.id);

  if (!videoNode) {
    videoNode = document.createElement('video');

    videoNode.setAttribute('id', 'video-' + participant.id);
    videoNode.setAttribute('class', 'bs-card-video');
    console.log(document.getElementById('video-1').width);
    console.log(document.getElementById('video-1').height);

    // videoNode.setAttribute('width', 320);
    // debugger;
    // videoNode.setAttribute(
    //   'width',
    //   document.getElementById('video-1').videoWidth
    // );
    // videoNode.setAttribute(
    //   'height',
    //   document.getElementById('video-1').videoHeight
    // );
    videoNode.setAttribute('playsinline', true);
    videoNode.muted = true;
    videoNode.setAttribute('autoplay', 'autoplay');
    videoNode.style = 'background: gray;';

    const videoContainer = document.getElementById('video-container');
    videoContainer.appendChild(videoNode);

    document.getElementById('video-dynamic-1').style.display = '';

    fetchStat();
    interval = setInterval(fetchStat, 10000);
  }

  navigator.attachMediaStream(videoNode, stream);
};

// Remove the video streem from the web page
const removeVideoNode = (participant) => {
  let videoNode = document.getElementById('video-' + participant.id);

  if (videoNode) {
    videoNode.parentNode.removeChild(videoNode);
    clearInterval(interval);
    clearInterval(heartRateDynamic1Interval);
  }
};

// Add a new participant to the list
const addParticipantNode = (participant) => {
  // If the participant is the current session user, don't add himself to the list
  if (participant.id === VoxeetSDK.session.participant.id) return;

  let participantNode = document.createElement('li');
  participantNode.setAttribute('id', 'participant-' + participant.id);
  participantNode.innerText = `${participant.info.name}`;

  const participantsList = document.getElementById('participants-list');
  participantsList.appendChild(participantNode);
};

// Remove a participant from the list
const removeParticipantNode = (participant) => {
  let participantNode = document.getElementById(
    'participant-' + participant.id
  );

  if (participantNode) {
    participantNode.parentNode.removeChild(participantNode);
  }
};

// Add a screen share stream to the web page
const addScreenShareNode = (stream) => {
  let screenShareNode = document.getElementById('screenshare');

  if (screenShareNode) {
    return alert('There is already a participant sharing a screen!');
  }

  screenShareNode = document.createElement('video');
  screenShareNode.setAttribute('id', 'screenshare');
  screenShareNode.autoplay = 'autoplay';
  navigator.attachMediaStream(screenShareNode, stream);

  const screenShareContainer = document.getElementById('screenshare-container');
  screenShareContainer.appendChild(screenShareNode);
};

// Remove the screen share stream from the web page
const removeScreenShareNode = () => {
  let screenShareNode = document.getElementById('screenshare');

  if (screenShareNode) {
    screenShareNode.parentNode.removeChild(screenShareNode);
  }

  const startScreenShareBtn = document.getElementById('start-screenshare-btn');
  startScreenShareBtn.disabled = false;

  const stopScreenShareBtn = document.getElementById('stop-screenshare-btn');
  stopScreenShareBtn.disabled = true;
};

const randomHeartRate = (min, max) => {
  return faker.random.number({ min, max });
};
