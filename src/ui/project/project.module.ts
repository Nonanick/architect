import type { NewProject } from "../../lib/project/new-project.interface";
import { ProjectModule as ProjectLib } from "../../lib/project/project.lib";

export const ProjectModule = {
  ...ProjectLib,
  *createProject(info: NewProject): Generator<CreateProjectStep> {
    let projectRoot = window.Architect.FileSystem.joinPath(
      info.root,
      info.folder_name,
    );
    // # 1 - Create project folder
    yield {
      title: "Creating project root folder",
      resolved: window.Architect.Server.post(
        "project/create-folder", { 
          target : projectRoot
        }
      )
        .then((msg) => 
        `Sucessfully created project root folder!` +
        `\nPath: <a>${projectRoot}</a>` + 
        `\n${msg}`)
        .catch((err) => Promise.reject(err.message)),
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

    yield {
      title: "Configuring project",
      resolved: window.Architect.Server
        .post(
          "project/configure-project",
          {
            target: projectRoot,
            ...info,
            created_at: info.created_at.toString(),
          },
        ),
    };

    yield {
      title: "Installing project dependencies",
      resolved: window.Architect.Server
        .post("project/install-project-dependencies", { target: projectRoot }),
    };
  },
};

export interface CreateProjectStep {
  title: string;
  resolved: Promise<true | string>;
}
