import RemoteFile from "./RemoteFile";
import {CacheForPage} from "@mm0202/cache-for-page";

describe('RemoteDataクラスのテスト', () => {
  let remoteData: RemoteFile;
  beforeEach(() => {
    CacheForPage.reset();
    remoteData = new RemoteFile('https://covid19-data.wlaboratory.com/jg-jpn.json');
  });

  test('データ取得に成功', async () => {
    const result = await remoteData.get();
    result.response.data.forEach((datum: any) => {
      expect(typeof datum).toBe('object');
      expect(Object.keys(datum)).toContain('通し');
    })
  });

  test("２回目以降のデータ参照はキャッシュデータ", async () => {
    const result1 = await remoteData.get();
    expect(result1.cache).toBe(false);
    result1.response.data.forEach((datum: any) => {
      expect(typeof datum).toBe('object');
      expect(Object.keys(datum)).toContain('通し');
    });

    const result2 = await remoteData.get();
    expect(result2.cache).toBe(true);
    expect(Object.keys(result1.response.data).length).toEqual(Object.keys(result2.response.data).length);

    const result3 = await remoteData.get();
    expect(result3.cache).toBe(true);
  })
});

