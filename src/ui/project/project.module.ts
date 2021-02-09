import type { NewProject } from "../../lib/project/new-project.interface";
import { ProjectModule as ProjectLib } from "../../lib/project/project.lib";

export const ProjectModule = {
  ...ProjectLib,
  *createProject(info: NewProject): Generator<CreateProjectStep> {
    let projectRoot;
    // # 1 - Create project folder
    yield {
      title: "Creating project root folder",
      resolved: window.Architect.FileSystem.createFolder(
        info.root + "/" + info.folder_name,
      ).then((dir) => true).catch((err) => err.message),
    };

    yield {
      title: "Installing architect metadata",
      resolved: window.Architect.Server
        .post("project/install-architect", { target: projectRoot }),
    };

    yield {
      title: "Running architect migrations",
      resolved: window.Architect.Server
        .post("project/install-database", { target: projectRoot }),
    };

    yield {
      title: "Copying standart project template",
      resolved: window.Architect.Server
        .post("project/copy-template-project", { target: projectRoot }),
    };
  },
};

export interface CreateProjectStep {
  title: string;
  resolved: Promise<true | string>;
}
