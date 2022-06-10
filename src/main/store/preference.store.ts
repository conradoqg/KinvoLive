import Store from 'electron-store';
import path from 'path';
import { Component, Inject } from 'tsdi';
import { PreferenceData } from 'shared/type/preference.type';
import LoggerService from '../service/logger.service';
import ConfigService from '../service/config.service';

@Component
export default class PreferenceStore {
  private store: Store<PreferenceData>;

  private readonly PREFERENCE_STORE_NAME = 'preference'

  constructor(@Inject() private configService: ConfigService, @Inject() private loggerService: LoggerService) {
    const options: Store.Options<PreferenceData> = {
      name: this.PREFERENCE_STORE_NAME,
      watch: true
    }

    if (this.configService.isDebug) {
      options.cwd = path.join(this.configService.dataPath, 'store')
    }

    this.store = new Store<PreferenceData>(options);
  }

  set<Key extends keyof PreferenceData>(key: Key, value?: PreferenceData[Key]): void {
    this.store.set(key, value);
  }

  delete<Key extends keyof PreferenceData>(key: Key): void {
    this.store.delete(key);
  }

  get<Key extends keyof PreferenceData>(key: Key, defaultValue?: Required<PreferenceData>[Key]): Required<PreferenceData>[Key] {
    return this.store.get(key, defaultValue)
  }
};
