import type { RouteSchema } from "maestro"

const AddTrackedProject: RouteSchema = {
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
};


export default {
    AddTrackedProject
}