import type { ProjectDTO } from "../../lib/project/new-project.interface";
import { ProjectModule as ProjectLib } from "../../lib/project/project.lib";

export const ProjectModule = {
  ...ProjectLib,
  *createProject(info: ProjectDTO): Generator<CreateProjectStep> {
    let projectRoot = architect.FileSystem.joinPath(
      info.root,
    );
    // # 1 - Create project folder
    yield {
      title: "Creating project root folder",
      resolved: architect.Server.post(
        "project/create-folder",
        {
          target: projectRoot,
        },
      )
        .then((msg) =>
          `Sucessfully created project root folder!` +
          `\nPath: <a>${projectRoot}</a>` +
          `\n${msg}`
        )
        .catch((err) => Promise.reject(err.message)),
    };

    yield {
      title: "Copying standart project template",
      resolved: architect.Server
        .post("project/copy-template-project", { target: projectRoot }),
    };

    yield {
      title: "Installing architect metadata",
      resolved: architect.Server
        .post("project/install-architect", { target: projectRoot }),
    };

    yield {
      title: "Configuring project",
      resolved: architect.Server
        .post(
          "project/configure-project",
          {
            ...info,
            root: projectRoot,
            created_at: info.created_at.toString(),
          },
        ),
    };

    yield {
      title: "Installing project dependencies",
      resolved: architect.Server
        .post("project/install-project-dependencies",
          {
            package_manager: 'yarn',
            project_path: projectRoot
          }
        ),
    };

    yield {
      title: "Saving new project in Architect",
      resolved: architect.Server
        .post(
          "project/tracked",
          {
            ...info,
            created_at: info.created_at.toString(),
          },
        ).then(insertedValues => {
          console.log(insertedValues);
          return 'OK! New project created with values:\n<pre>' + JSON.stringify(insertedValues, null, 2) + "</pre>"
        }),
    };
  },
};

export interface CreateProjectStep {
  title: string;
  resolved: Promise<true | string>;
}
