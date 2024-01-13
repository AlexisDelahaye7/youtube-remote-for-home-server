export default class ApiError extends Error {
  constructor(message, infos) {
    super(message);
    this.name = 'ApiError';
    this.infos = infos;
  }
}
