import type { ProtocolRequest, ProtocolResponse } from "electron";
import fs from 'fs';
import os from 'os';
import path from 'path';
import { ArchitectPublicPath } from '../app.window.boot';

export function InterceptAbsoluteFileResolution(req: ProtocolRequest, cb: (resp: ProtocolResponse) => void) {

  let filePath = req.url.split('#')[0].replace(/^file:\/\//, '').replace(/\\/g, '/');
  if(filePath.indexOf('?') >= 0) {
    filePath.substr(0,filePath.indexOf('?'));
  }
  let absolutePath: string = "";
  const publicPathRegExp = new RegExp('^' + ArchitectPublicPath.replace(/\\/g, '/'));

  switch (os.platform()) {
    case 'win32':
      let removeInitialSlash = filePath.substr(1);

      absolutePath = path.resolve(removeInitialSlash);

      if (!removeInitialSlash.match(publicPathRegExp)) {
        absolutePath = path.join(
          ArchitectPublicPath.replace(/\\/g, '/'),
          removeInitialSlash.replace(/^[A-z]*\:/, '').replace(/\\/g, '/')
        );
      }

      break;
    default:
      if (!filePath.match(publicPathRegExp)) {
        absolutePath = path.join(ArchitectPublicPath, filePath);
      } else {
        absolutePath = path.join(filePath);
      }
      break;
  }

  fs.readFile(absolutePath, (readFileExc, fileData) => {

    if (readFileExc != null) {
      console.error('Error while loading file', '\n', filePath, '\n', readFileExc);
      cb({
        error: 404
      });
      return;
    }

    cb({
      method: req.method,
      referrer: req.referrer,
      headers: req.headers,
      path: absolutePath,
      data: fileData,
    });

  });

}

function isInsidePublicPath(path: string): boolean {
  return true;
}
function WindowsFileResolution(req: ProtocolRequest) {

}