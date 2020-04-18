import axios, { AxiosResponse } from 'axios'
import {CacheForPage} from "@mm0202/cache-for-page";

export default class RemoteFile {
  private cacheKey = this.constructor.name + '/' + this.url;

  constructor(private readonly url: string) {}

  async get(): Promise<{ response: AxiosResponse<any>; cache: boolean }> {
    const cachedResponse = CacheForPage.get(this.cacheKey);
    if (cachedResponse) {
      return { response: cachedResponse, cache: true }
    }

    const response = await axios.get(this.url);
    CacheForPage.add(this.cacheKey, response);

    return { response, cache: false }
  }

  getFromCache() {
    return { response: CacheForPage.get(this.cacheKey), cache: true }
  }
}
