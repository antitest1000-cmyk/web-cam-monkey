/**
 * Plays a random clip in the stranger tile when the live queue is empty.
 */
const FillerPartner = (() => {
  const BASE = 'https://huggingface.co/datasets/Antrikshhsjidv/mira-mi-vidoes/resolve/main/';
  const FILES = [
    'YTDown.com_YouTube_Beautiful-girl-doing-web-cam-chat_Media_G-agKtCRHYY_001_480p.mp4',
    'YTDown.com_YouTube_Fake-WebCam-HD-For-Video-Omegle-Face-Cut_Media_GdhCadsv3og_002_720p.mp4',
    'YTDown.com_YouTube_Fake-WebCam-HD-For-Video-Omegle-Face-Cut_Media_IBh00ESuGHo_002_720p.mp4',
    'YTDown.com_YouTube_Fake-WebCam-HD-For-Video-Omegle-Face-Cut_Media_R0c89lMugsA_002_720p.mp4',
    'YTDown.com_YouTube_Fake-WebCam-HD-For-Video-Omegle-Face-Cut_Media_R0v9tWtt7UY_002_720p.mp4',
    'YTDown.com_YouTube_Fake-WebCam-HD-For-Video-Omegle-Face-Cut_Media_Y88wGtEMmLM_002_720p.mp4',
    'YTDown.com_YouTube_Fake-WebCam-HD-For-Video-Omegle-Face-Cut_Media_drUC90ibMuE_002_720p.mp4',
    'YTDown.com_YouTube_Fake-WebCam-HD-For-Video-Omegle-Face-Cut_Media_eLis5PC2ogg_002_720p.mp4',
    'YTDown.com_YouTube_Filipino-Beauty_Media_P1naAoPKSRw_001_480p.mp4',
    'YTDown.com_YouTube_beautiful-girl-in-front-of-webcam_Media_BMELOi28Lic_001_480p.mp4',
    'YTDown.com_YouTube_hit-me-in-my-nostalgia_Media_r95xlWYdtJc_002_480p (2).mp4',
    'YTDown.com_YouTube_sabrinacarpenter-Please-Please-Please-C_Media_eaBll4XO5VA_001_720p.mp4',
    'YTDown.com_YouTube_school-makeup-no-talking_Media_VzKKPnac6FI_002_720p.mp4',
    'videoplayback (1).mp4',
    'videoplayback (11).mp4',
    'videoplayback (12).mp4',
    'videoplayback (13).mp4',
    'videoplayback (14).mp4',
    'videoplayback (16).mp4',
    'videoplayback (18).mp4',
    'videoplayback (20).mp4',
    'videoplayback (3).mp4',
    'videoplayback (4).mp4',
    'videoplayback (6).mp4',
    'videoplayback (9).mp4',
  ];
  const URLS = FILES.map((name) => encodeURI(BASE + name));

  const remoteVideo = document.getElementById('remote-video');
  let waitTimer = null;
  let searching = false;
  let active = false;
  let lastIndex = -1;

  function pickUrl() {
    if (URLS.length === 1) return URLS[0];
    let i = Math.floor(Math.random() * URLS.length);
    if (i === lastIndex) i = (i + 1) % URLS.length;
    lastIndex = i;
    return URLS[i];
  }

  function jitter(minMs, maxMs) {
    return minMs + Math.random() * (maxMs - minMs);
  }

  function stopPlayback() {
    remoteVideo.onended = null;
    remoteVideo.onerror = null;
    remoteVideo.onloadeddata = null;
    remoteVideo.pause();
    remoteVideo.removeAttribute('src');
    remoteVideo.srcObject = null;
    try {
      remoteVideo.load();
    } catch (err) {
      /* ignore */
    }
    active = false;
  }

  function showConnected() {
    UI.setStatus('connected');
    UI.setOverlay('hidden');
    UI.enterConnectedMode();
    UI.showToast('✓ Connected to a stranger!', 2500);
  }

  function playOne() {
    if (!searching) return;
    const url = pickUrl();
    stopPlayback();
    active = true;
    remoteVideo.srcObject = null;
    remoteVideo.src = url;
    remoteVideo.loop = false;
    remoteVideo.playsInline = true;
    remoteVideo.muted = false;

    remoteVideo.onloadeddata = () => {
      if (!active || !searching) return;
      showConnected();
    };
    remoteVideo.onended = () => {
      if (!searching) return;
      stopPlayback();
      UI.setStatus('waiting');
      UI.setOverlay('waiting');
      UI.enterWaitingMode();
      schedule(jitter(1200, 2800));
    };
    remoteVideo.onerror = () => {
      if (!searching) return;
      schedule(400);
    };

    const attempt = remoteVideo.play();
    if (attempt && attempt.catch) {
      attempt.catch(() => {
        remoteVideo.muted = true;
        remoteVideo.play().catch(() => {
          if (searching) schedule(600);
        });
      });
    }
  }

  function schedule(ms) {
    clearTimeout(waitTimer);
    if (!searching) return;
    waitTimer = setTimeout(playOne, ms);
  }

  function arm() {
    searching = true;
    if (active || waitTimer) return;
    UI.setStatus('waiting');
    UI.setOverlay('waiting');
    UI.enterWaitingMode();
    schedule(jitter(3500, 7000));
  }

  function skip() {
    searching = true;
    clearTimeout(waitTimer);
    waitTimer = null;
    stopPlayback();
    UI.setStatus('waiting');
    UI.setOverlay('waiting');
    UI.enterWaitingMode();
    schedule(jitter(1800, 4000));
  }

  function stopForRealMatch() {
    clearTimeout(waitTimer);
    waitTimer = null;
    stopPlayback();
  }

  function stopAll() {
    searching = false;
    clearTimeout(waitTimer);
    waitTimer = null;
    stopPlayback();
  }

  return {
    arm,
    skip,
    stopForRealMatch,
    stopAll,
    isActive: () => active,
  };
})();
