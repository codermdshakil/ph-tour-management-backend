import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

divisionSchema.pre("save", async function () {

  if (this.isModified("name")) {

    const baseslug = this.name?.toLowerCase().split(" ").join("-");
    let slug = `${baseslug}-division`;

    let counter = 0;

    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }

    this.slug = slug;
  }

});






export const Division = model<IDivision>("Division", divisionSchema);
