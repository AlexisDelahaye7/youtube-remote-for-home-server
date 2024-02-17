const regExp = {
  url: {
    youtube: /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/,
    // * https://stackoverflow.com/questions/19377262/regex-for-youtube-url
  },
};

export default (request, payload) => {
  switch (request.type) {
    case "playURL":
      if (!payload.url) return false;
      if (!regExp.url.youtube.test(payload.url)) return false;
      return true;

    case "pauseAudio":
      if (audioStatus === "pause") return false;
      return true;

    case "resumeAudio":
      return checkResumePayload(payload);
    default:
      return false;
  }
};
