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

const getAllDivisions = async () => {

  const divisions = await Division.find({});
    const totalDivisions = await Division.countDocuments();
  
    return {
      data: divisions,
      meta: {
        total: totalDivisions,
      },
    };

}

const updateDivision = async (
  id: string,
  payload: Partial<IDivition>
): Promise<IDivition | null> => {
  /* 1️⃣ Check if division exists */
  const existingDivision = await Division.findById(id);

  if (!existingDivision) {
    throw new Error("Division not found");
  }

  /* 2️⃣ Handle name → slug regeneration */
  let updatedSlug = existingDivision.slug;

  if (payload.name && payload.name !== existingDivision.name) {
    updatedSlug = generateSlug(payload.name);

    /* 3️⃣ Uniqueness check (exclude current division) */
    const isDuplicate = await Division.findOne({
      _id: { $ne: id },
      $or: [
        { name: payload.name },
        { slug: updatedSlug },
      ],
    });

    if (isDuplicate) {
      if (isDuplicate.name === payload.name) {
        throw new Error("Division name already exists");
      }
      if (isDuplicate.slug === updatedSlug) {
        throw new Error("Division slug already exists");
      }
    }
  }

  /* 4️⃣ Update division */
  const updatedDivision = await Division.findByIdAndUpdate(
    id,
    {
      ...payload,
      slug: updatedSlug,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedDivision;
};

export const DivisionServices = {
  createDivision,
  getAllDivisions,
  updateDivision
}