import type { ProtocolRequest, ProtocolResponse } from "electron";
import fs from 'fs';
import os from 'os';
import path from 'path';
import { ArchitectPublicPath } from "../app.boot";

export function InterceptAbsoluteFileResolution(req: ProtocolRequest, cb: (resp: ProtocolResponse) => void) {
  let hashPath = req.url.split('#')[1] ?? '';

  let filePath = req.url.split('#')[0].replace(/^file:\/\//, '').replace(/\\/g, '/');
  const publicPathRegExp = new RegExp('^' + ArchitectPublicPath.replace(/\\/g, '/'));
  // File is not in the public DIR ?
  if (!filePath.match(publicPathRegExp)) {
    // Strip root path and append to Architect Public path
    let strippedRoot = '';
    switch (os.platform()) {
      case 'win32':
        strippedRoot = filePath.replace(/^[\/\\]*[A-z]*:\//i, '');
        filePath = path.join(ArchitectPublicPath, strippedRoot);
        //console.debug('=> [FileProtocol]\nUsing public dir as root resolution!\n', filePath, '\n');
        break;
      default:
        strippedRoot = filePath.replace(/^\//, '');
        filePath = path.join(ArchitectPublicPath, strippedRoot);
        //console.debug('Using public dir as root resolution!', filePath);
        break;
    }
  }

  fs.readFile(filePath, (readFileExc, fileData) => {

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
      path: filePath,
      data: fileData,
    });

  });

}

function WindowsFileResolution(req: ProtocolRequest) {

}