import { Entity } from "clerk";
import { Controller, Resolver, Route } from "maestro";
import type { ProjectDTO } from "../../../../lib/project/new_project.interface";
import { ProjectEntity } from "../../../data/entities";
import { storage } from "../../../data/store/ElectronStore";

export class TrackedProjectsController extends Controller {

  get baseURL(): string {
    return 'project/tracked';
  }

  @Route({
    url: "",
    methods: "post",
    schema: {
      body: {
        type: "object",
        required: ["name", "title", "root"],
        properties: {
          name: { type: "string" },
          title: { type: "string" },
          root: { type: "string" },
          metadata_root: { type: "string" },
          icon: { type: "string" },
          version: { type: "string" },
          author: { type: "string" },
        },
        additionalProperties: false,
      },
    },
  })
  public addTrackedProject: Resolver = async (req) => {
    let model = Entity.instance(ProjectEntity).model<
      ProjectDTO
    >();
    model.$set(
      req.get(
        ["name", "title", "root", "metadata_root", "icon", "version", "author"],
      ),
    );

    let values = await model.$commit(true);

    if (values instanceof Error) {
      return values;
    }


    let projects: any[] = storage("projects").get("tracked") as any[] ?? [];
    projects.push(values);
    storage("projects").set("tracked", projects);

    return values;
  };

  @Route({
    url: ''
  })
  public listAllTrackedProjects: Resolver = () => {
    let allProjects: any[] = storage("projects").get("tracked") as any[] ?? [];
    if (allProjects.length > 10) {
      allProjects = allProjects.slice(allProjects.length - 10);
    }
    return allProjects.reverse();
  };

  @Route({
    url: ':name'
  })
  public getTrackedProject: Resolver = (req) => {
    let allProjects = storage('projects').get('tracked') as any[];
    let project = allProjects.filter(project => project.name === req.get('name'));
    if (project.length > 0) {
      return project[0];
    } else {
      return new Error(`Could not find project with name '${req.get('name')}' on the tracked projects`);
    }
  };

  @Route({
    url: '',
    methods: 'delete'
  })
  public emptyTrackedProjects: Resolver = () => {
    storage("projects").set("tracked", []);
    return 'Ok! Erased all tracked projects';
  };

  @Route({
    url: ':name',
    methods: 'delete'
  })
  public removeFromTrackedProjects: Resolver = (req) => {
    let allProjects = storage('projects').get('tracked') as any[];
    let oldLength = allProjects.length;
    allProjects = allProjects.filter(project => project.name != req.get('name'));
    storage('projects').set('tracked', allProjects);
    return `Removed ${oldLength - allProjects.length} projects with name '${req.get('name')}'`;
  };

}