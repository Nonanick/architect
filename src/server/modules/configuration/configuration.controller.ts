import { Controller, Resolver, Route } from "maestro";
import { storage } from "../../data/store/ElectronStore";

export const ConfigStore = "config";

export class ConfigurationController extends Controller {

  protected defaultConfig?: any;

  async getDefaultConfig() {

    if (this.defaultConfig == null) {
      try {
        this.defaultConfig = await import('./default.config').then(imported => imported.default);
      } catch (err) {
        console.error('[ConfigurationController] Failed to read default config file!' + err.message);
      } 
    }

    return this.defaultConfig ?? {};
  }
  get baseURL(): string {
    return 'config';
  }

  @Route({
    url: 'list',
  })
  public list: Resolver = () => {
    return storage(ConfigStore).store;
  };

  @Route({
    methods: 'get',
    url: ':name'
  })
  public get: Resolver = async (req) => {
    return storage(ConfigStore).get(req.get('name')) ?? (await this.getDefaultConfig())[req.get('name')];
  };

  @Route({
    url: ':name/:value',
    methods: ['patch', 'put'],
  })
  public set: Resolver = (req) => {
    let newValue = req.get('value');
    let old = storage(ConfigStore).get(req.get('name'));

    storage(ConfigStore).set(req.get('name'), req.get('value'));

    return {
      oldValue: old,
      newValue
    };
  };

  @Route({
    url: ':name',
    methods: 'post',
    schema: {
      body: {
        type: 'object',
        properties: {
          value: {}
        },
        required: ['value']
      }
    }
  })
  public setWithBody: Resolver = (req) => {
    storage(ConfigStore).set(req.get('name'), req.get('value'));

    return req.get('value');
  };



}