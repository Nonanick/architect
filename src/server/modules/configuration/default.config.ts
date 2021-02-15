import os from 'os';
import path from 'path';

export default {
  "username" : os.userInfo().username,
  "workspace" : path.join(os.userInfo().homedir, 'architect-workspace'),
  "app-theme" : "light"
}