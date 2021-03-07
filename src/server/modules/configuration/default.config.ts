import os from 'os';
import path from 'path';
import type { Configuration } from './configuration.type';

const DefaultConfig : Partial<Configuration> = {
  username : os.userInfo().username,
  workspace : path.join(os.userInfo().homedir, 'architect-workspace'),
  theme : "light"
};

export default {
  ...DefaultConfig
}