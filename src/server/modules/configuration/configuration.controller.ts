import { Controller, Resolver, Route } from "maestro";
import { storage } from "../../data/store/ElectronStore";

export class ConfigurationController extends Controller {

  get baseURL(): string {
    return 'config';
  }

  @Route({
    url: 'list',
  })
  public list: Resolver = (req) => {
    return storage('configuration').store;
  };

  @Route({
    methods: 'get',
    url: ':name'
  })
  public get: Resolver = (req) => {
    return storage('configuration').get(req.get('name'));
  };

  @Route({
    methods: ['patch', 'put'],
    url: ':name/:value'
  })
  public set: Resolver = (req) => {
    let newValue = req.get('value');
    let old = storage('configuration').get(req.get('name'));

    storage('configuration').set(req.get('name'), req.get('value'));

    return {
      oldValue: old,
      newValue
    };
  };


}