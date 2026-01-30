import { generateSlug } from "../../utils/generateSlug";
import { IDivition } from "./division.interface";
import { Division } from "./division.model";


// create division
const createDivision = async (payload: Partial<IDivition>) => {

    if (!payload.name) {
    throw new Error("Division name is required");
  }

  const slug = generateSlug(payload.name);

    const isDivisionExists = await Division.findOne({
      $or: [
        { name: payload.name },
        { slug: payload.slug },
      ],
    });

    if (isDivisionExists) {
      if (isDivisionExists.name === payload.name) {
        throw new Error(`${isDivisionExists.name} Division name already exists`);
      }
      if (isDivisionExists.slug === payload.slug) {
        throw new Error("Division slug already exists");
      }
    }

    const division = await Division.create({...payload, slug});

    return division;

}

export const DivisionServices = {
  createDivision
}