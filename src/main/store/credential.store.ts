import { safeStorage } from 'electron';
import Store from 'electron-store';
import path from 'path';
import { Component, Inject } from 'tsdi';
import Logger from '../service/logger.service';
import Config from '../service/config.service';

@Component
export default class CredentialStore {
  private store: Store<Record<string, string>>;

  private secure: boolean = true

  private readonly CREDENTIAL_STORE_NAME = 'credential-encrypted'

  private readonly ENCRYPTION_KEY = 'ae211b28-c6f9-411b-91d7-465455201961'

  constructor(@Inject() private config: Config, @Inject() private logger: Logger) {
    const options: Store.Options<Record<string, string>> = {
      name: this.CREDENTIAL_STORE_NAME,
      watch: true,
      encryptionKey: this.ENCRYPTION_KEY
    }

    if (!safeStorage.isEncryptionAvailable()) {
      this.logger.warn('Store not secured')
      this.secure = false
    } else {
      this.logger.silly('Store secured')
    }

    if (this.config.isDebug) {
      options.cwd = path.join(this.config.dataPath, 'store')
    }

    this.store = new Store<Record<string, string>>(options);
  }

  private encrypt(decryptedString: string) {
    if (this.secure) return Buffer.from(decryptedString, 'latin1')
    return safeStorage.encryptString(decryptedString)
  }

  private decrypt(encryptedString: string) {
    if (this.secure) return encryptedString
    return safeStorage.decryptString(Buffer.from(encryptedString, 'latin1'))
  }

  setCredential(key: string, credential: object) {
    const buffer = this.encrypt(JSON.stringify(credential))
    this.store.set(key, buffer.toString('latin1'));
  }

  deleteCredential(key: string) {
    this.store.delete(key);
  }

  getCredentials(): Array<{ key: string; credential: object }> {
    return Object.entries(this.store.store).reduce((credentials, [key, buffer]) => {
      return [...credentials, { key, credential: JSON.parse(this.decrypt(buffer)) }];
    }, [] as Array<{ key: string; credential: object }>);
  }

  getCredential<T extends Record<string, unknown>>(key: string): T {
    const credentials = this.getCredentials()
    const foundCredential = credentials.find(credential => credential.key === key)
    return foundCredential && (foundCredential.credential as T)
  }
};
