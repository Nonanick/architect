import type { FSWatcher } from 'chokidar';

export interface FolderTracker {
    on : FSWatcher['on'];
    off : FSWatcher['off'];
    stop() : Promise<void>;
}